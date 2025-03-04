import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTaskById,
  assignTaskCollaborators,
  updateTask,
} from "../Redux/Feature/taskSlice";
import { useParams } from "react-router-dom";
import { fetchAllUsers } from "../Redux/Feature/AuthSlice";

const Task = () => {
  const { taskId } = useParams();
  const dispatch = useDispatch();
  const { task, loading, error } = useSelector((state) => state.task); // task is an array
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTask, setUpdatedTask] = useState({});
  const [collaborators, setCollaborators] = useState([]);
  const [selectedCollaborators, setSelectedCollaborators] = useState({});
  const [isLoadingCollaborators, setIsLoadingCollaborators] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCollaborators, setFilteredCollaborators] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false); // New: Loading state for updates

  useEffect(() => {
    if (taskId) {
      dispatch(fetchTaskById(taskId));
    }

    setIsLoadingCollaborators(true);
    dispatch(fetchAllUsers())
      .then((response) => {
        if (response.payload && Array.isArray(response.payload.users)) {
          setCollaborators(response.payload.users);
        } else {
          console.error("fetchAllUsers did not return an array:", response.payload);
          setCollaborators([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setCollaborators([]);
      })
      .finally(() => setIsLoadingCollaborators(false));
  }, [dispatch, taskId]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCollaborators(collaborators);
    } else {
      const filtered = collaborators.filter((user) =>
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCollaborators(filtered);
    }
  }, [searchQuery, collaborators]);

  const handleAddWork = (task) => {
    setIsEditing(true);
    setUpdatedTask(task); // Pre-fill the edit form with current task data
  };

  const handleUpdate = () => {
    if (!updatedTask.id) {
      alert("Task ID is missing!");
      return;
    }

    setIsUpdating(true); // Start loading
    dispatch(updateTask({ taskId: updatedTask.id, updatedTask }))
      .unwrap()
      .then(() => {
        console.log("Task updated successfully:", updatedTask);
        setIsEditing(false); // Close the modal
      })
      .catch((error) => {
        console.error("Failed to update task:", error);
        alert("Failed to update task: " + (error.message || error));
      })
      .finally(() => setIsUpdating(false)); // Stop loading
  };

  const handleAddCollaborator = (taskId, email) => {
    setSelectedCollaborators((prev) => ({
      ...prev,
      [taskId]: prev[taskId] ? [...prev[taskId], email] : [email],
    }));
  };

  const handleRemoveCollaborator = (taskId, email) => {
    setSelectedCollaborators((prev) => ({
      ...prev,
      [taskId]: prev[taskId].filter((col) => col !== email),
    }));
  };

  const handleTaskAssign = (taskId) => {
    const taskCollaborators = selectedCollaborators[taskId] || [];
    if (taskCollaborators.length > 0) {
      dispatch(assignTaskCollaborators({ taskId, collaborators: taskCollaborators }))
        .unwrap()
        .then(() => {
          alert("Task assigned successfully!");
          setSelectedCollaborators((prev) => ({ ...prev, [taskId]: [] }));
        })
        .catch((error) => alert("Failed to assign task: " + error));
    } else {
      alert("Please select at least one collaborator for this task.");
    }
  };

  return (
    <div className="pt-34 sm:px-6 py-10 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 flex flex-col items-center">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 text-transparent bg-clip-text py-3 px-6 rounded-lg shadow-lg w-full max-w-xl mb-6">
        Task Details
      </h2>

      {loading && (
        <p className="text-lg text-center mt-8 text-gray-400 animate-pulse">
          Loading tasks...
        </p>
      )}
      {error && (
        <p className="text-red-500 font-medium text-center mt-8 bg-red-900/30 px-6 py-3 rounded-lg shadow-md">
          {error}
        </p>
      )}

      {task && task.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 w-full max-w-5xl px-2 sm:px-0">
          {task.map((t) => (
            <div
              key={t.id}
              className="bg-gray-800/90 shadow-lg rounded-xl p-6 border border-gray-700 hover:shadow-xl hover:border-indigo-500/70 transition-all duration-300 w-full"
            >
              <h3 className="text-lg sm:text-xl font-semibold text-indigo-400 mb-2">
                {t.title}
              </h3>
              <p className="text-gray-300 text-sm mb-3 line-clamp-3">
                {t.description}
              </p>
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-gray-400 text-xs font-medium">Status:</span>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    t.status === "Pending"
                      ? "bg-yellow-500/20 text-yellow-300"
                      : t.status === "In Progress"
                      ? "bg-indigo-500/20 text-indigo-300"
                      : t.status === "Completed"
                      ? "bg-green-500/20 text-green-300"
                      : "bg-red-500/20 text-red-300"
                  }`}
                >
                  {t.status}
                </span>
              </div>
              <p className="text-indigo-300 text-xs mb-3">
                Due: {new Date(t.dueDate).toDateString()}
              </p>
              <p
                className={`text-sm font-medium mb-4 ${
                  t.priority === "High"
                    ? "text-red-400"
                    : t.priority === "Medium"
                    ? "text-yellow-400"
                    : "text-green-400"
                }`}
              >
                Priority: {t.priority}
              </p>
              <div className="mb-4">
                <h4 className="text-gray-400 text-xs font-medium mb-1">
                  Current Collaborators:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(t.collaborators || []).map((collaborator, index) => (
                    <span
                      key={index}
                      className="bg-indigo-600 text-white px-2 py-1 text-xs rounded-full hover:bg-indigo-700 transition-colors duration-200"
                    >
                      {collaborator.email || collaborator}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <button
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all duration-200 w-full text-sm"
                  onClick={() => handleAddWork(t)}
                >
                  Edit Task
                </button>
                <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 w-full min-h-[200px] flex flex-col gap-4">
                  <input
                    type="text"
                    placeholder="Search by email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-400 text-sm"
                    disabled={isLoadingCollaborators}
                  />
                  <div className="flex-1 max-h-48 overflow-y-auto">
                    {isLoadingCollaborators ? (
                      <p className="text-gray-400 text-sm text-center">
                        Loading collaborators...
                      </p>
                    ) : filteredCollaborators.length > 0 ? (
                      filteredCollaborators.map((user, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-md transition-colors duration-200"
                        >
                          <span className="text-sm truncate">{user.email}</span>
                          <button
                            className={`px-2 py-1 text-xs rounded-full ${
                              (selectedCollaborators[t.id] || []).includes(user.email)
                                ? "bg-red-600 text-white hover:bg-red-700"
                                : "bg-indigo-600 text-white hover:bg-indigo-700"
                            }`}
                            onClick={() =>
                              (selectedCollaborators[t.id] || []).includes(user.email)
                                ? handleRemoveCollaborator(t.id, user.email)
                                : handleAddCollaborator(t.id, user.email)
                            }
                          >
                            {(selectedCollaborators[t.id] || []).includes(user.email)
                              ? "Remove"
                              : "Add"}
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 text-sm text-center">
                        No matching collaborators
                      </p>
                    )}
                  </div>
                </div>
                {(selectedCollaborators[t.id] || []).length > 0 && (
                  <div className="mt-2">
                    <h4 className="text-gray-400 text-xs font-medium mb-1">
                      Selected Collaborators:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {(selectedCollaborators[t.id] || []).map((email, index) => (
                        <span
                          key={index}
                          className="bg-indigo-600 text-white px-2 py-1 text-xs rounded-full flex items-center gap-1"
                        >
                          <span className="truncate max-w-[150px]">{email}</span>
                          <button
                            className="text-red-400 hover:text-red-300"
                            onClick={() => handleRemoveCollaborator(t.id, email)}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <button
                  className="bg-indigo-600 text-white px-4 py-2 mt-6 rounded-lg hover:bg-indigo-700 transition-all duration-200 w-full text-sm"
                  onClick={() => handleTaskAssign(t.id)}
                >
                  Assign Task
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-lg text-gray-400 mt-10 bg-gray-800/70 px-6 py-3 rounded-lg">
          No tasks found
        </p>
      )}

      {isEditing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 px-4 z-50">
          <div className="bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-md border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-center text-indigo-400">
              Edit Task
            </h3>
            <input
              type="text"
              className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-400"
              placeholder="Title"
              value={updatedTask.title || ""}
              onChange={(e) => setUpdatedTask({ ...updatedTask, title: e.target.value })}
              disabled={isUpdating}
            />
            <textarea
              className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-400 resize-none h-28"
              placeholder="Description"
              value={updatedTask.description || ""}
              onChange={(e) =>
                setUpdatedTask({ ...updatedTask, description: e.target.value })
              }
              disabled={isUpdating}
            />
            <select
              value={updatedTask.status || ""}
              onChange={(e) => setUpdatedTask({ ...updatedTask, status: e.target.value })}
              className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
              disabled={isUpdating}
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
            <div className="flex justify-end gap-3">
              <button
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all duration-200 disabled:bg-indigo-400"
                onClick={handleUpdate}
                disabled={isUpdating}
              >
                {isUpdating ? "Updating..." : "Update Task"}
              </button>
              <button
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-all duration-200"
                onClick={() => setIsEditing(false)}
                disabled={isUpdating}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Task;