import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Login from "../../page/Login";

const API_URL = "http://localhost:3000/auth";

// User Signup
export const signupUser = createAsyncThunk("auth/signup", async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, userData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data.message);
  }
});



export const loginUser = createAsyncThunk ("auth/login" , async(Credential , {rejectWithValue})=>{
  try {
    const response = await axios.post(`${API_URL}/login`,Credential);
    // savae token
    localStorage.setItem("token" , response.data.token);
    localStorage.setItem("user",JSON.stringify(response.data.user.name));
    return response.data;
  } catch (error) {
   return error
  }
})

// Fetch All Users
export const fetchAllUsers = createAsyncThunk(
  "auth/fetchAllUsers",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.user?.token; // Assuming token is stored here
      const response = await axios.get(`${API_URL}/Alluser`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data; // Return the full response ({ message, success, users })
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch users");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null, // Retrieve logged-in user
    token: localStorage.getItem("token") || null,
    allUsers: [], // Store all users
    error: null,
    loading: false,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token");
      localStorage.removeItem("user"); // Remove user info
      state.user = null;
      state.token = null;
      state.allUsers = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user; // Store user details in Redux
        state.token = action.payload.token;
        state.loading = false;
        state.error = null;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.allUsers = action.payload; // Store all users
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
