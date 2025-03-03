import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTaskById } from "../Redux/Feature/taskSlice";
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

function Home() {
  const [username, setUsername] = useState("");
  const [userLength, setUserLength] = useState(0);
  const dispatch = useDispatch();
  const { task: tasks, loading, error } = useSelector((state) => state.task);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUsername(JSON.parse(storedUser));
    }
    dispatch(fetchTaskById());
  }, [dispatch]);

  useEffect(() => {
    const fetchUserLength = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3000/auth/Alluser", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setUserLength(data.users.length || 0);
      } catch (error) {
        console.error("Error fetching user count:", error);
      }
    };
    fetchUserLength();
  }, []);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === "Completed").length;
  const pendingTasks = tasks.filter((task) => task.status === "Pending").length;
  const overdueTasks = tasks.filter((task) => {
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    return task.status !== "Completed" && dueDate < today;
  }).length;

  const barData = tasks.reduce((acc, task) => {
    const month = new Date(task.dueDate).toLocaleString("default", { month: "short" });
    const existing = acc.find((item) => item.month === month);
    if (existing) existing.tasks += 1;
    else acc.push({ month, tasks: 1 });
    return acc;
  }, []);

  const pieData = [
    { name: "Completed", value: completedTasks },
    { name: "Pending", value: pendingTasks },
    { name: "Overdue", value: overdueTasks },
  ];

  const COLORS = ["#34d399", "#facc15", "#f87171"]; // Green, Yellow, Red

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 flex items-center justify-center">
        <p className="text-white text-xl font-semibold">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 flex items-center justify-center">
        <p className="text-red-400 text-xl font-semibold">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="mt-15 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 py-12 px-4 sm:px-6 lg:px-8 xl:ml-72">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Welcome Header */}
        <h1 className="text-4xl font-extrabold text-white text-center tracking-tight animate-fade-in">
          Welcome, <span className="text-blue-400 bg-blue-900/30 px-3 py-1 rounded-full shadow-md">{username}</span>!
        </h1>

        {/* Task Stats Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-700/50">
            <div className="flex items-center justify-between">
              <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-full h-12 w-12 flex items-center justify-center">
                <span className="text-xl">📋</span>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400 uppercase font-medium">Total Tasks</p>
                <h4 className="text-2xl font-bold text-white">{totalTasks}</h4>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">All assigned tasks</p>
          </div>

          <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-700/50">
            <div className="flex items-center justify-between">
              <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-full h-12 w-12 flex items-center justify-center">
                <span className="text-xl">✅</span>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400 uppercase font-medium">Completed</p>
                <h4 className="text-2xl font-bold text-white">{completedTasks}</h4>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Finished on time</p>
          </div>

          <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-700/50">
            <div className="flex items-center justify-between">
              <div className="bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-full h-12 w-12 flex items-center justify-center">
                <span className="text-xl">⏳</span>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400 uppercase font-medium">Pending</p>
                <h4 className="text-2xl font-bold text-white">{pendingTasks}</h4>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Awaiting completion</p>
          </div>

          <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-700/50">
            <div className="flex items-center justify-between">
              <div className="bg-gradient-to-br from-red-500 to-red-700 rounded-full h-12 w-12 flex items-center justify-center">
                <span className="text-xl">⚠️</span>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400 uppercase font-medium">Overdue</p>
                <h4 className="text-2xl font-bold text-white">{overdueTasks}</h4>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Past due date</p>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700/50">
            <h3 className="text-lg font-semibold text-gray-300">Total Users</h3>
            <p className="text-3xl font-bold text-white mt-2">{userLength}</p>
          </div>
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700/50">
            <h3 className="text-lg font-semibold text-gray-300">Active Projects</h3>
            <p className="text-3xl font-bold text-white mt-2">
              {new Set(tasks.map((task) => task.project)).size || 0}
            </p>
          </div>
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700/50">
            <h3 className="text-lg font-semibold text-gray-300">Avg. Completion</h3>
            <p className="text-3xl font-bold text-white mt-2">
              {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700/50">
            <h3 className="text-lg font-semibold text-gray-300 mb-4">Tasks by Due Month</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#111827", border: "none", borderRadius: "8px" }}
                  itemStyle={{ color: "#fff" }}
                />
                <Legend wrapperStyle={{ color: "#d1d5db" }} />
                <Bar dataKey="tasks" fill="#60a5fa" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700/50">
            <h3 className="text-lg font-semibold text-gray-300 mb-4">Task Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  labelLine={false}
                  paddingAngle={5}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#111827", border: "none", borderRadius: "8px" }}
                  itemStyle={{ color: "#fff" }}
                />
                <Legend wrapperStyle={{ color: "#d1d5db" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;