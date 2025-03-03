import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/components/Header.css';

function Header({ setIsAuth }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo"); 
    setIsAuth(false);  // Ensure logout updates state
    navigate("/");  // Redirect to login page
  };
  
  

  return (
    <header className="header">
      <div className="logo">
       <h1>Task Managment Apps</h1>
      </div>
      <h1 className="heading">Dashboard</h1>
      <div className="right-section">
        <img src="https://png.pngtree.com/element_our/png/20181206/users-vector-icon-png_260862.jpg" alt="User" className="profile-pic" />
        <button className="logout-btn" onClick={handleLogout}>Log Out</button>
      </div>
    </header>
  );
}

export default Header;
