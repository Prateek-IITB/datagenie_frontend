import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import clsx from "clsx";

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("datagenie_user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserRole(parsedUser.role);
      } catch (error) {
        console.error("Failed to parse user from localStorage:", error);
      }
    }
  }, []);

  return (
    <div className="flex h-screen w-screen relative">
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        userRole={userRole}
      />

      {/* Overlay for mobile view */}
      <div
        className={clsx(
          "md:hidden fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity",
          sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        )}
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* Main content */}
      <div
        className={clsx(
          "flex-1 overflow-y-auto transition-all duration-300 ease-in-out bg-gray-100 dark:bg-gray-800 text-black dark:text-white"
        )}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
