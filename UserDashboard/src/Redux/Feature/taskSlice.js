import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:3000/tasks";

// Fetch all tasks (adjusted to return array)
export const fetchTaskById = createAsyncThunk(
  "tasks/fetchById",
  async (taskId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}`, { 
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.tasks; // Return array of tasks
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch tasks");
    }
  }
);

// Assign collaborators to a task
export const assignTaskCollaborators = createAsyncThunk(
  "tasks/assignCollaborators",
  async ({ taskId, collaborators }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `${API_URL}/${taskId}/collaborators`,
        { collaborators },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.task;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to assign collaborators");
    }
  }
);

// Update a task
export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async ({ taskId, updatedTask }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_URL}/${taskId}`,
        updatedTask,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.task;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update task");
    }
  }
);

const taskSlice = createSlice({
  name: "task",
  initialState: {
    task: [], // Array of tasks
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTaskById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaskById.fulfilled, (state, action) => {
        state.loading = false;
        state.task = action.payload; // Store array of tasks
      })
      .addCase(fetchTaskById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(assignTaskCollaborators.fulfilled, (state, action) => {
        state.loading = false;
        const updatedTask = action.payload;
        state.task = state.task.map((t) =>
          t.id === updatedTask.id ? updatedTask : t
        );
      })
      .addCase(assignTaskCollaborators.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        const updatedTask = action.payload;
        state.task = state.task.map((t) =>
          t.id === updatedTask.id ? updatedTask : t
        );
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default taskSlice.reducer;