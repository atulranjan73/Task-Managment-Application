import React, { useState, useEffect } from "react";
import axios from "axios";
import "../style/Pages/AddTask.css";
import { ToastContainer } from "react-toastify";

const TaskForm = () => {
  const [task, setTask] = useState({
    title: "",
    description: "",
    priority: "",
    dueDate: "",
    assignedTo: "",
    status: "",
  });

  const [users, setUsers] = useState([]); // Store users fetched from API

  // Fetch users when component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:3000/auth/Alluser");
        console.log(response)
        setUsers(response.data.users); 
      } catch (error) {
        console.error("Error fetching users:", error);
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
    try {
      await axios.post("http://localhost:3000/tasks/createTask", task);
      alert("Task added successfully!");
      setTask({
        title: "",
        description: "",
        priority: "",
        dueDate: "",
        assignedTo: "",
        status: "",
      });
    } catch (error) {
      console.error("Error adding task:", error);
      alert("Failed to add task.");
    }
  };

  return (
    <div className="container">
       <span className="statusbtn">Pending</span>
      <form className="task-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Task Title:</label>
            <input
              type="text"
              name="title"
              value={task.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Description:</label>
            <textarea
              name="description"
              value={task.description}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Priority:</label>
            <select
              name="priority"
              value={task.priority}
              onChange={handleChange}
              required
            >
              <option value="">Select Priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <div className="form-group">
            <label>Due Date:</label>
            <input
              type="date"
              name="dueDate"
              value={task.dueDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Assigned To:</label>
            <select
              name="assignedTo"
              value={task.assignedTo}
              onChange={handleChange}
              required
            >
              <option value="">Select User</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button type="submit" className="add-btn">
          Add Task
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default TaskForm;
