import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import "../style/components/Login.css";

function Login({ setIsAuth }) {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/auth/login", loginData);
      const { token, message, user } = res.data;
  
      toast.success(message);
      localStorage.setItem("token", token);
      localStorage.setItem("userInfo", JSON.stringify(user));
  
      setIsAuth(true);
      window.location.reload();  // Reload page after successful login
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid credentials. Please try again.");
    }
  };
  
  

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" value={loginData.email} onChange={handleChange} required />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" value={loginData.password} onChange={handleChange} required />
        </div>
        <button type="submit">Login</button>
      </form>
      <ToastContainer/>
    </div>
  );
}

export default Login;
