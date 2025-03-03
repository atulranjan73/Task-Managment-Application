import { useState, useEffect } from "react";
import "../style/Pages/userlist.css"; // Import CSS file
import DashBoard from "./DashBoard";

function UserList() {
  const [users, setUsers] = useState([]);
  const [userLength, setUserLength] = useState(0); // Define userLength state

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:3000/auth/Alluser");
      const data = await response.json();
      console.log("API Response:", data);

      if (data.users && Array.isArray(data.users)) {
        setUsers(data.users);
        setUserLength(data.users.length); // Set user count
      } else {
        console.error("Invalid data format:", data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="container">


      <h1>Total Users: {userLength}</h1>
      <h2>User List</h2>
      <ul className="user-list">
        {users.map((user, index) => (
          <li key={index}>
            <span className="user-name">{user.name}</span>
            <span className="user-email">{user.email}</span>
            <span className="user-password">{user.password}</span>
          </li>
        ))}
      </ul>
      
    </div>
  );
}

export default UserList;
