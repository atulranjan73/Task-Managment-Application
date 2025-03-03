import React, { useEffect, useState } from "react";
import {
  Routes,
  Route,
  BrowserRouter,
  Navigate,
  useLocation,
} from "react-router-dom";
import Signup from "./page/Signup";
import Task from "./page/Task";
import Home from "./page/Home";
import Create from "./Components/Create";
import Login from "./page/Login";
import ProtectedRoute from "./page/ProtectedRoute";
import Sidebar from "./Components/Sidebar";
import MainLayout from "./Components/MainLayout";
import NotificationPage from "./page/NotificationPage";

function App() {
  const location = useLocation();
  const isHome = location.pathname.includes("/");

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/tasks/:taskId" element={<Task />} />
            <Route path="/create" element={<Create />} />
            <Route path="/notification" element={<NotificationPage/>} />
          </Route>
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
  );
}

export default App;
