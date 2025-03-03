import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Home from "./components/Home";
import Signup from "./components/Signup";
import TicketList from "./page/TicketList";
import DashBoard from "./page/DashBoard";
import UserList from "./page/UserList";
import "./style/global.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TaskForm from "./page/TaskForm";

function App() {
  return (
    <div>
    <Header/>
    <Sidebar/>

      <Routes>
        
          <>
            <Route path="/home" element={<Home />} />
            <Route path="/add-task" element={<TaskForm />} />
            <Route path="/user-list" element={<UserList />} />
            <Route path="/add-users" element={<Signup />} />
            <Route path="/ticket-list" element={<TicketList />} />
            <Route path="/dash-board" element={<DashBoard />} />
            <Route path="*" element={<Navigate to="/dash-board" />} />
          </>
       
      </Routes>
    </div>
  );
}

export default App;
