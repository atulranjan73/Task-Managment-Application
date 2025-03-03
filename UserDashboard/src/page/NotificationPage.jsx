// NotificationPage.jsx
import React, { useState } from 'react';

const initialNotifications = [
  {
    id: 1,
    type: 'success',
    title: 'Task Completed',
    message: 'John Doe completed "Design Review" task',
    time: '2 minutes ago',
    priority: 'high',
    project: 'Website Redesign',
    dueDate: '2025-03-05',
    unread: true,
  },
  {
    id: 2,
    type: 'warning',
    title: 'Task Overdue',
    message: 'Complete "API Integration" before deadline',
    time: '1 hour ago',
    priority: 'urgent',
    project: 'Mobile App',
    dueDate: '2025-03-02',
    unread: true,
  },
  {
    id: 3,
    type: 'info',
    title: 'New Task Assigned',
    message: 'You’ve been assigned to "Database Optimization"',
    time: 'Yesterday',
    priority: 'medium',
    project: 'Backend Upgrade',
    dueDate: '2025-03-10',
    unread: false,
  },
];

const NotificationPage = () => {
  const [notifications, setNotifications] = useState(initialNotifications);

  const handleMarkAsRead = (id) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, unread: false } : notif
    ));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 py-8 px-4 sm:px-6 lg:px-8 pt-40">
      <div className="max-w-4xl mx-auto">

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white animate-fade-in">Task Notifications</h1>
            <p className="mt-1 text-sm text-gray-300">
              You have {notifications.filter(n => n.unread).length} unread notifications
            </p>
          </div>
          {notifications.length > 0 && (
            <NotificationCounter count={notifications.filter(n => n.unread).length} />
          )}
        </div>

        {/* Notification List */}
        {notifications.length > 0 ? (
          <div className="bg-gray-800 shadow-xl rounded-lg divide-y divide-gray-700">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-6 hover:bg-gray-700 transition-all duration-300 ease-in-out transform hover:scale-[1.01] ${
                  notification.unread ? 'bg-blue-900/30 border-l-4 border-blue-500' : ''
                }`}
              >
                <div className="flex items-start">
                  {/* Priority Indicator */}
                  <div className="flex-shrink-0">
                    <span
                      className={`inline-block w-3 h-3 rounded-full mt-2 animate-pulse ${
                        notification.priority === 'urgent'
                          ? 'bg-red-500'
                          : notification.priority === 'high'
                          ? 'bg-orange-500'
                          : 'bg-blue-500'
                      } ${!notification.unread && 'opacity-0'}`}
                    ></span>
                  </div>

                  {/* Content */}
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-white">
                          {notification.title}
                        </h3>
                        <p className="mt-1 text-xs text-gray-400">
                          Project: {notification.project}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400">{notification.time}</p>
                        <p className="text-xs text-gray-400">
                          Due: {new Date(notification.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-300">
                      {notification.message}
                    </p>
                    {/* Action Buttons */}
                    <div className="mt-3 flex space-x-4">
                      <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200">
                        View Task
                      </button>
                      {notification.unread && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                        >
                          Mark as Read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-800 shadow-xl rounded-lg p-6 text-center animate-fade-in">
            <p className="text-gray-400">No notifications to display</p>
          </div>
        )}

        {/* Clear All Button */}
        {notifications.length > 0 && (
          <div className="mt-6 text-center">
            <button
              onClick={handleClearAll}
              className="text-sm text-gray-300 hover:text-white font-medium py-2 px-4 rounded bg-gray-700 hover:bg-gray-600 transition-all duration-300"
            >
              Clear all notifications
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Notification Counter Component
const NotificationCounter = ({ count }) => {
  return (
    <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-semibold text-white bg-red-500 rounded-full animate-bounce">
      {count}
    </span>
  );
};

export default NotificationPage;