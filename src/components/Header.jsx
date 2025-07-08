// src/components/Header.jsx
import React, { useState, useEffect } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';


function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();


  const user = JSON.parse(localStorage.getItem("datagenie_user"));

  const handleLogout = () => {
    localStorage.removeItem("datagenie_user");
    navigate("/login");
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <header className="sticky top-0 bg-gray-900 text-white shadow-md z-50 flex justify-between items-center px-6 py-4">
      <div className="text-xl font-bold">DatanautAI</div>

      <div className="flex items-center space-x-4 relative">
           {location.pathname === "/" && user?.role !== "user" && (
            <Link
                to="/schema"
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition"
            >
                Check Schema
            </Link>
            )}

            {location.pathname === "/schema" && user?.role !== "user" &&(
            <Link
                to="/"
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition"
            >
                Back to Query
            </Link>
            )}

        <div className="relative">
          <button onClick={toggleDropdown} className="flex items-center space-x-2">
            <FaUserCircle className="text-2xl" />
            {!isMobile && (
              <span className="text-sm font-medium">{user?.user_name || 'User'}</span>
            )}
          </button>

          {dropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg py-2 z-50"
              onMouseLeave={closeDropdown}
            >

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
