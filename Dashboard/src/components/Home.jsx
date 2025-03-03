import React from "react";
import { Routes, Route } from "react-router-dom";
import AddTicket from "../page/TaskForm";

import Signup from "./Signup";

function Home() {
  return (
    <div className="container">
      <div className="page-content">
        <Routes>
          <Route path="/add-ticket" element={<AddTicket />} />
          <Route path="/monthly-selling" element={<h3>Monthly Selli</h3>} />
          <Route path="/yearly-selling" element={<h3>Yearly Selling Page</h3>}
          />
          <Route
            path="/train-schedule"
            element={<h3>Train Schedule Page</h3>}
          />
          <Route
            path="/passenger-list"
            element={<h3>Passenger List Page</h3>}
          />
          <Route
            path="/revenue-report"
            element={<h3>Revenue Report Page</h3>}
          />
          <Route path="/settings" element={<h3>Settings Page</h3>} />
          <Route path="/logout" element={<h3>Logging Out...</h3>} />
        </Routes>
      </div>
    </div>
  );
}

export default Home;
