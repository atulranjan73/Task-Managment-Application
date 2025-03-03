import React, { useState, useEffect } from "react";
import "../style/Pages/Dashboard.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";

function DashBoard() {
  const [userlength, setUserlength] = useState(0);

  // Fetch total users
  useEffect(() => {
    const fetchUserLength = async () => {
      try {
        const response = await fetch("http://localhost:3000/auth/Alluser");
        const data = await response.json();
        setUserlength(data.users.length || 0);
      } catch (error) {
        console.error("Error fetching user count:", error);
      }
    };

    fetchUserLength();
  }, []);

  // Sample data for bar chart
  const barData = [
    { month: "Jan", revenue: 4000 },
    { month: "Feb", revenue: 3000 },
    { month: "Mar", revenue: 5000 },
    { month: "Apr", revenue: 4000 },
    { month: "May", revenue: 7000 },
    { month: "Jun", revenue: 6000 },
  ];

  // Sample data for pie chart
  const pieData = [
    { name: "AC Class", value: 240 },
    { name: "Sleeper Class", value: 400 },
    { name: "General Class", value: 200 },
  ];

  const COLORS = ["#ff4d4d", "#4d79ff", "#ffcc00"];

  return (
    <div className="container">
      <div className="dashboard-container">
        <h2 className="dashboard-title">Admin Dashboard</h2>

        {/* Stats Cards */}
        <div className="stats-container">
          <div className="stat-card">
            <h3>Total Users</h3>
            <p>{userlength}</p>
          </div>
          <div className="stat-card">
            <h3>Total Revenue</h3>
            <p>₹8,50,000</p>
          </div>
          <div className="stat-card">
            <h3>Tickets Sold</h3>
            <p>5,500</p>
          </div>
        </div>

        {/* Charts Row - Bar Chart & Pie Chart Side by Side */}
        <div className="charts-row">
          {/* Revenue Bar Chart */}
          <div className="chart-container">
            <h3>Monthly Revenue</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#ff4d4d" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Ticket Category Pie Chart */}
          <div className="chart-container">
            <h3>Ticket Sales Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashBoard;
