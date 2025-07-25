import React, { useState, useEffect } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { getSidebarItems } from './sidebarConfig';
import UserAccountMenu from "../UserAccountMenu";
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Sidebar = ({ sidebarOpen, setSidebarOpen, userRole }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = userRole === 'admin';

  // Toggle between admin and analyst views
  const [adminViewMode, setAdminViewMode] = useState('admin'); // 'admin' | 'query'

  // Dynamically decide which sidebar items to show
  const effectiveRole = isAdmin && adminViewMode === 'query' ? 'analyst' : userRole;
  const sidebarItems = getSidebarItems(effectiveRole);
  const topItems = sidebarItems.filter(item => !item.bottom);

  // Toggle Button Label
  const toggleLabel = adminViewMode === 'admin' ? 'Go to Query Page' : 'Back to Admin Dashboard';

  // Handle toggle and navigation
  const handleToggle = () => {
    const newMode = adminViewMode === 'admin' ? 'query' : 'admin';
    setAdminViewMode(newMode);

    if (newMode === 'query') {
      navigate('/');
    } else {
      navigate('/admin/home');
    }
  };

  return (
    <div
      className={`bg-gray-900 text-white transition-all duration-300 p-4 z-40 
        ${sidebarOpen ? 'w-64' : 'w-16'} flex flex-col fixed md:relative h-full`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        {sidebarOpen && <h1 className="text-xl font-bold">DataGenie</h1>}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-white focus:outline-none"
        >
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col flex-grow justify-between overflow-y-auto">
        <div className="space-y-2">
          {/* Admin toggle button */}
          {isAdmin && (
            <button
              onClick={handleToggle}
              className="flex items-center space-x-2 text-left p-2 rounded w-full hover:bg-gray-700 font-medium transition"
            >
              <span>🔁</span>
              {sidebarOpen && <span>{toggleLabel}</span>}
            </button>
          )}

          {/* Sidebar menu items */}
          {topItems.map((item, idx) =>
            item.path ? (
              <Link
                key={idx}
                to={item.path}
                className={`flex items-center space-x-2 text-left p-2 rounded w-full relative group transition
                  ${location.pathname === item.path ? 'bg-gray-700 font-semibold' : 'hover:bg-gray-700'}
                `}
              >
                <div className="relative">
                  <span>{item.icon}</span>
                  {!sidebarOpen && (
                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  )}
                </div>
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            ) : (
              <div
                key={idx}
                className="flex items-center space-x-2 text-left hover:bg-gray-700 p-2 rounded w-full cursor-default relative group"
              >
                <div className="relative">
                  <span>{item.icon}</span>
                  {!sidebarOpen && (
                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  )}
                </div>
                {sidebarOpen && <span>{item.label}</span>}
              </div>
            )
          )}
        </div>

        {/* Bottom User Menu */}
        <div className="pt-4">
          <UserAccountMenu sidebarOpen={sidebarOpen} />
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
