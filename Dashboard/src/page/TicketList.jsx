import { useState, useEffect } from "react";
import "../style/Pages/userlist.css"; // Import CSS file
import { ToastContainer } from "react-toastify";

function UserList() {
  const [users, setUsers] = useState([]); // Original user list
  const [filteredUsers, setFilteredUsers] = useState([]); // Filtered users for search
  const [searchQuery, setSearchQuery] = useState(""); 
 

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:3000/tickets/getAllTickets");
      const data = await response.json();
      // console.log("API Response:", data);
      setUsers(data.tickets);
      // console.log(data.length());
      setFilteredUsers(data.tickets); 
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle search input
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    if (query.trim() === "") {
      setFilteredUsers(users); // Show all if search is empty
    } else {
      const filtered = users.filter(user =>
        user.source.toLowerCase().includes(query) ||
        user.destination.toLowerCase().includes(query)
      );
      setFilteredUsers(filtered);
    }
  };

  // Handle Delete function
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/tickets/delete/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Ticket deleted successfully!");
        setUsers(users.filter(user => user._id !== id)); // Remove from state
        setFilteredUsers(filteredUsers.filter(user => user._id !== id)); // Update filtered list
      } else {
        alert("Failed to delete ticket");
      }
    } catch (error) {
      console.error("Error deleting ticket:", error);
    }
  };

  return (
    <div className="container">
      <h2>User List</h2>
      <div className="search">
        <input 
          type="search" 
          placeholder="Search by Source or Destination" 
          value={searchQuery} 
          onChange={handleSearch} 
        />
      </div>
      <ul className="user-list">
        {filteredUsers.map((user, index) => (
          <li key={index}>
            <span className="source">{user.source}</span>
            <span className="destination">{user.destination}</span>
            <span className="date">{user.date}</span>
            <span className="price">₹{user.price}</span>
            <span className="seat">{user.sit}</span>
            <span>
              <button onClick={() => handleDelete(user._id)}>❌</button>
            </span>
          </li>
        ))}
        
      </ul>
     
    </div>
  );
}

export default UserList;
