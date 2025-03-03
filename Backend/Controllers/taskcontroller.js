const Task = require("../Models/TaskModel");
const User = require("../Models/user.model");

// Create a new task
exports.createTask = async (req, res) => {
  const { title, description, priority, dueDate, assignedTo } = req.body;

  try {
    if (!title || !description || !priority || !dueDate || !assignedTo) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email: assignedTo }); // Expects email
    if (!user) {
      return res.status(404).json({ message: "Assigned user not found" });
    }

    const newTask = new Task({
      title,
      description,
      priority,
      dueDate,
      assignedTo: user._id, // Stores user ObjectId
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
      return res.status(401).json(
        { 
          message: "Unauthorized" 
        });
    }

    const tasks = await Task.find({
      $or: [{ assignedTo: req.user.id }, { collaborators: req.user.id }]
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



// Assign collaborators to a task
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

    const collaboratorIds = users.map(user => user._id);
    const foundEmails = users.map(user => user.email);
    const notFoundEmails = collaborators.filter(email => !foundEmails.includes(email));

    const task = await Task.findByIdAndUpdate(
      taskId,
      { $addToSet: { collaborators: { $each: collaboratorIds } } },
      { new: true }
    ).populate("assignedTo collaborators", "email");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({
      message: "Collaborators assigned successfully!",
      task,
      notFoundEmails: notFoundEmails.length ? notFoundEmails : undefined, // Show only if some emails were not found
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