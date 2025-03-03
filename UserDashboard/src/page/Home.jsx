import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../Redux/Feature/AuthSlice";

function Home() {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUsername(JSON.parse(storedUser));
    }
  }, []);

  return (

    <div className="p-36 xl:ml-40 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
      {/* Welcome Header */}
      <h1 className="text-center text-4xl font-extrabold text-white mb-12 tracking-tight">
        Welcome, <span className="text-blue-600 bg-blue-100 px-3 py-1 rounded-md shadow-sm">{username}</span>!
      </h1>

      {/* Dashboard Cards */}
      <div className="max-w-7xl mx-auto">
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {/* Total Tasks */}
          <div className="relative flex flex-col bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="absolute -top-6 left-6 bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-full h-14 w-14 flex items-center justify-center shadow-lg">
              <span className="text-2xl">📋</span>
            </div>
            <div className="pt-12 pb-6 px-6 text-right">
              <p className="text-sm text-gray-300 font-medium uppercase tracking-wide">Total Tasks</p>
              <h4 className="text-3xl font-bold text-white mt-1">150</h4>
            </div>
            <div className="border-t border-gray-700 px-6 py-4 bg-gray-900 rounded-b-2xl">
              <p className="text-sm text-gray-400">
                <span className="text-green-400 font-semibold">+10%</span> increase this month
              </p>
            </div>
          </div>

        
          <div className="relative flex flex-col bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="absolute -top-6 left-6 bg-gradient-to-br from-green-500 to-green-700 text-white rounded-full h-14 w-14 flex items-center justify-center shadow-lg">
              <span className="text-2xl">✅</span>
            </div>
            <div className="pt-12 pb-6 px-6 text-right">
              <p className="text-sm text-gray-300 font-medium uppercase tracking-wide">Completed Tasks</p>
              <h4 className="text-3xl font-bold text-white mt-1">120</h4>
            </div>
            <div className="border-t border-gray-700 px-6 py-4 bg-gray-900 rounded-b-2xl">
              <p className="text-sm text-gray-400">
                <span className="text-green-400 font-semibold">+15%</span> compared to last week
              </p>
            </div>
          </div>

          {/* Pending Tasks */}
          <div className="relative flex flex-col bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="absolute -top-6 left-6 bg-gradient-to-br from-yellow-500 to-yellow-700 text-white rounded-full h-14 w-14 flex items-center justify-center shadow-lg">
              <span className="text-2xl">⏳</span>
            </div>
            <div className="pt-12 pb-6 px-6 text-right">
              <p className="text-sm text-gray-300 font-medium uppercase tracking-wide">Pending Tasks</p>
              <h4 className="text-3xl font-bold text-white mt-1">25</h4>
            </div>
            <div className="border-t border-gray-700 px-6 py-4 bg-gray-900 rounded-b-2xl">
              <p className="text-sm text-gray-400">
                <span className="text-red-400 font-semibold">-5%</span> completion rate this week
              </p>
            </div>
          </div>

          {/* Overdue Tasks */}
          <div className="relative flex flex-col bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="absolute -top-6 left-6 bg-gradient-to-br from-red-500 to-red-700 text-white rounded-full h-14 w-14 flex items-center justify-center shadow-lg">
              <span className="text-2xl">⚠️</span>
            </div>
            <div className="pt-12 pb-6 px-6 text-right">
              <p className="text-sm text-gray-300 font-medium uppercase tracking-wide">Overdue Tasks</p>
              <h4 className="text-3xl font-bold text-white mt-1">5</h4>
            </div>
            <div className="border-t border-gray-700 px-6 py-4 bg-gray-900 rounded-b-2xl">
              <p className="text-sm text-gray-400">
                <span className="text-red-400 font-semibold">+2</span> more than yesterday
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}

export default Home;