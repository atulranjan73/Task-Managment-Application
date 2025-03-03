import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../style/components/Login.css"




const handleError = (message) => toast.error(message);
const handleSuccess = (message) => toast.success(message);

function Signup() {
    const [loginInfo, setLoginInfo] = useState({
        name: '',
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginInfo((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, email, password } = loginInfo;

        if (!name || !email || !password) {
            return handleError('All fields are required');
        }

        try {
            const apiUrl = "http://localhost:3000/auth/signup";

            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();

            if (response.ok) {
                handleSuccess("Signup Successful!");
                setLoginInfo({ name: '', email: '', password: '' });
            } else {
                handleError(data.message || "Signup failed. Try again.");
            }
        } catch (error) {
            handleError("An error occurred. Please try again later.");
        }
    };

    return (
      <div className="container">
          <div className="signup-container">
            <h1>Signup</h1>
            <form onSubmit={handleSubmit}>
            <div className="input-group">
                    <label htmlFor="name">Name</label>
                    <input
                        onChange={handleChange}
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Enter your name"
                        autoFocus
                        value={loginInfo.name}
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input
                        onChange={handleChange}
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter your email"
                        value={loginInfo.email}
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input
                        onChange={handleChange}
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Enter your password"
                        value={loginInfo.password}
                    />
                </div>

                <button type="submit" className="btn">Sign Up</button>

                <ToastContainer />
       
            </form>
          
        </div>
      
      </div>
    );
}

export default Signup;
