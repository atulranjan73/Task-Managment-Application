import React from 'react';
import { Link } from 'react-router-dom';
import '../style/components/Sidebar.css';

function Sidebar() {
  return (
    <aside className="sidebar">
    <Link to='/dash-board'>
    <button className="sidebar-btn">Dashboard</button>
    </Link>
      <ul className="sidebar-menu">
        <li><Link to="/add-task">Add Task</Link></li>
        <li><Link to="/user-list">User List</Link></li>
        <li><Link to="/add-users">Add User</Link></li>
        <li><Link to="/ticket-list">Ticket List</Link></li>
        <li><Link to="/passenger-list">Passenger List</Link></li>
        <li><Link to="/revenue-report">Revenue Report</Link></li>
        <li><Link to="/settings">Settings</Link></li>
      
      </ul>
    </aside>
  );
}

export default Sidebar;
