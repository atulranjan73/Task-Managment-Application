const Task = require("../Models/TaskModel");
const User = require("../Models/user.model");
const Notification = require("../Models/NotificationModel");

// Create a new task
exports.createTask = async (req, res) => {
  const { title, description, priority, dueDate, assignedTo } = req.body;

  try {
    if (!title || !description || !priority || !dueDate || !assignedTo) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email: assignedTo });
    if (!user) {
      return res.status(404).json({ message: "Assigned user not found" });
    }

    const newTask = new Task({
      title,
      description,
      priority,
      dueDate,
      assignedTo: user._id,
    });

    await newTask.save();
    await User.findByIdAndUpdate(user._id, { $addToSet: { tasks: newTask._id } });

    res.status(201).json({ message: "Task created successfully!", task: newTask });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Failed to create task", error: error.message });
  }
};

// Get all tasks for the authenticated user
exports.getAllTasks = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const tasks = await Task.find({
      $or: [{ assignedTo: req.user.id }, { collaborators: req.user.id }],
    }).populate("assignedTo collaborators", "email");

    res.status(200).json({ tasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Failed to fetch tasks", error: error.message });
  }
};

// Assign task to a user by email
exports.assignTaskToUserByEmail = async (req, res) => {
  const { taskId } = req.params;
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const task = await Task.findByIdAndUpdate(
      taskId,
      { assignedTo: user._id },
      { new: true }
    ).populate("assignedTo collaborators", "email");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await User.findByIdAndUpdate(user._id, { $addToSet: { tasks: task._id } });

    res.status(200).json({ message: "Task assigned successfully!", task });
  } catch (error) {
    console.error("Error assigning task:", error);
    res.status(500).json({ message: "Failed to assign task", error: error.message });
  }
};

// Assign collaborators to a task (with notification)
exports.assignTaskCollaborators = async (req, res) => {
  const { taskId } = req.params;
  const { collaborators } = req.body;

  if (!Array.isArray(collaborators) || collaborators.length === 0) {
    return res.status(400).json({ message: "Collaborators must be a non-empty array of emails" });
  }

  try {
    const users = await User.find({ email: { $in: collaborators } });
    if (!users.length) {
      return res.status(404).json({ message: "No valid collaborators found" });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const collaboratorIds = users.map((user) => user._id);
    const foundEmails = users.map((user) => user.email);
    const notFoundEmails = collaborators.filter((email) => !foundEmails.includes(email));

    // Create notifications for each collaborator
    const notifications = users.map((user) => ({
      user: user._id,
      task: taskId,
      type: "taskAssignment",
      message: `You've been invited to collaborate on "${task.title}". Please accept or decline.`,
      status: "pending",
    }));

    await Notification.insertMany(notifications);

    // Do not add collaborators to the task yet; wait for acceptance
    await task.populate("assignedTo collaborators", "email");

    res.status(200).json({
      message: "Collaborators notified successfully! Awaiting their response.",
      task,
      notFoundEmails: notFoundEmails.length ? notFoundEmails : undefined,
    });
  } catch (error) {
    console.error("Error assigning collaborators:", error);
    res.status(500).json({ message: "Failed to assign collaborators", error: error.message });
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  const { taskId } = req.params;
  const updates = req.body;

  try {
    const task = await Task.findByIdAndUpdate(taskId, updates, { new: true }).populate(
      "assignedTo collaborators",
      "email"
    );
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ message: "Task updated successfully!", task });
  } catch (error) {
    res.status(500).json({ message: "Failed to update task", error: error.message });
  }
};

// New endpoint: Get notifications for the authenticated user
exports.getUserNotifications = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const notifications = await Notification.find({ user: req.user.id })
      .populate("task", "title")
      .sort({ createdAt: -1 });

    res.status(200).json({ notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Failed to fetch notifications", error: error.message });
  }
};

// New endpoint: Accept or decline a task assignment
// Controllers/taskcontroller.js
exports.handleTaskAssignmentResponse = async (req, res) => {
  const { notificationId } = req.params;
  const { action } = req.body;

  // Update to match the schema's enum values
  if (!["accepted", "declined"].includes(action)) {
    return res.status(400).json({ message: "Invalid action. Use 'accepted' or 'declined'." });
  }

  try {
    console.log("Processing notification:", notificationId, "Action:", action);

    const notification = await Notification.findById(notificationId).populate("task");
    if (!notification) {
      console.log("Notification not found:", notificationId);
      return res.status(404).json({ message: "Notification not found" });
    }

    if (!notification.task) {
      console.log("Task not found for notification:", notificationId);
      return res.status(400).json({ message: "Task reference in notification is invalid" });
    }

    if (!req.user || !req.user.id) {
      console.log("User not authenticated:", req.user);
      return res.status(403).json({ message: "User not authenticated" });
    }

    if (notification.user.toString() !== req.user.id) {
      console.log("Unauthorized user:", req.user.id, "Notification user:", notification.user);
      return res.status(403).json({ message: "Unauthorized to respond to this notification" });
    }

    if (notification.status !== "pending") {
      console.log("Notification already processed:", notification.status);
      return res.status(400).json({ message: "This request has already been processed" });
    }

    notification.status = action; // "accepted" or "declined"
    await notification.save();

    if (action === "accepted") {
      const task = await Task.findByIdAndUpdate(
        notification.task._id,
        { $addToSet: { collaborators: req.user.id } },
        { new: true }
      ).populate("assignedTo collaborators", "email");

      if (!task) {
        console.log("Task not found during update:", notification.task._id);
        return res.status(404).json({ message: "Task not found during update" });
      }

      await User.findByIdAndUpdate(req.user.id, { $addToSet: { tasks: task._id } });
      return res.status(200).json({ message: "Task accepted successfully!", task });
    }

    res.status(200).json({ message: "Task declined successfully!" });
  } catch (error) {
    console.error("Error handling task assignment response:", error.stack);
    res.status(500).json({ message: "Failed to process response", error: error.message });
  }
};