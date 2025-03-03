import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Create = () => {
  const [task, setTask] = useState({
    title: "",
    description: "",
    priority: "",
    dueDate: "",
    assignedTo: "",
    status: "", // Optional, since backend defaults to "Pending"
  });

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/auth/Alluser", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data.users); // Expecting { users: [{ _id, email, ...}] }
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to fetch users!", { position: "top-center", autoClose: 3000 });
      }
    };

    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!task.title || !task.description || !task.priority || !task.dueDate || !task.assignedTo) {
      toast.error("❌ Please fill in all fields!", { position: "top-center", autoClose: 3000 });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3000/tasks/createTask",
        task,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Task created successfully:", response.data);
      toast.success("🎉 Task added successfully!", { position: "top-center", autoClose: 3000 });

      setTask({
        title: "",
        description: "",
        priority: "",
        dueDate: "",
        assignedTo: "",
        status: "",
      });
    } catch (error) {
      console.error("Error adding task:", error.response?.data || error.message);
      toast.error(
        `❌ ${error.response?.data?.message || "Failed to add task!"}`,
        { position: "top-center", autoClose: 3000 }
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto mt-20 p-8 rounded-xl shadow-xl bg-gray-800 text-white">
        <h2 className="text-3xl font-bold text-center mb-8 animate-fade-in">
          🚀 Create a New Task
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Title & Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-lg font-medium text-gray-300">📝 Task Title:</label>
              <input
                type="text"
                name="title"
                value={task.title}
                onChange={handleChange}
                required
                className="mt-2 w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter task title..."
              />
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-300">📄 Description:</label>
              <textarea
                name="description"
                value={task.description}
                onChange={handleChange}
                required
                className="mt-2 w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter task description..."
                rows="3"
              />
            </div>
          </div>

          {/* Priority & Due Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-lg font-medium text-gray-300">⚡ Priority:</label>
              <select
                name="priority"
                value={task.priority}
                onChange={handleChange}
                required
                className="mt-2 w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Select Priority</option>
                <option value="Low">🟢 Low</option>
                <option value="Medium">🟡 Medium</option>
                <option value="High">🔴 High</option>
              </select>
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-300">📅 Due Date:</label>
              <input
                type="date"
                name="dueDate"
                value={task.dueDate}
                onChange={handleChange}
                required
                className="mt-2 w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Assigned To */}
          <div>
            <label className="block text-lg font-medium text-gray-300">👤 Assign To:</label>
            <select
              name="assignedTo"
              value={task.assignedTo}
              onChange={handleChange}
              required
              className="mt-2 w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">Select User</option>
              {users.map((user) => (
                <option key={user._id} value={user.email}>
                  {user.email}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white font-bold rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300 hover:scale-[1.02] active:scale-95"
          >
            ✅ Add Task
          </button>
        </form>

        {/* Toast Notification */}
        <ToastContainer />
      </div>
    </div>
  );
};

export default Create;