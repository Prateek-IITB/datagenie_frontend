import React from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { getSidebarItems } from './sidebarConfig';
import UserAccountMenu from "../UserAccountMenu";
import { Link } from 'react-router-dom';


const Sidebar = ({ sidebarOpen, setSidebarOpen, userRole }) => {
  const sidebarItems = getSidebarItems(userRole);
  console.log('Sidebar role:', userRole); // Debug log

  const topItems = sidebarItems.filter(item => !item.bottom);
  const bottomItems = sidebarItems.filter(item => item.bottom);

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
      <nav className="flex flex-col justify-between h-full">
        {/* Top Buttons */}
        <div className="space-y-2">
            {topItems.map((item, idx) =>
            item.path ? (
                <Link
                key={idx}
                to={item.path}
                className="flex items-center space-x-2 text-left hover:bg-gray-700 p-2 rounded w-full"
                >
                <span>{item.icon}</span>
                {sidebarOpen && <span>{item.label}</span>}
                </Link>
            ) : (
                <div
                key={idx}
                className="flex items-center space-x-2 text-left hover:bg-gray-700 p-2 rounded w-full cursor-default"
                >
                <span>{item.icon}</span>
                {sidebarOpen && <span>{item.label}</span>}
                </div>
            )
            )}
        </div>

        {/* Bottom Buttons */}
        <div className="space-y-2 mt-auto pt-4">
          {/* 👤 User Account Menu */}
          <UserAccountMenu sidebarOpen={sidebarOpen} /> 
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
