// components/UserAccountMenu.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const UserAccountMenu = ({ sidebarOpen }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("datagenie_user") || "{}");

  const menuRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("datagenie_user");
    navigate("/login");
  };

  const handleSettings = () => {
    navigate("/settings");
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={menuRef} className="relative p-2 text-white">
      {/* Trigger */}
      <div
        className="cursor-pointer flex items-center gap-2 hover:bg-gray-700 p-2 rounded-lg"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <div className="bg-purple-600 text-white font-bold w-8 h-8 rounded-full flex items-center justify-center uppercase">
          {user?.name?.[0] || "U"}
        </div>

        {sidebarOpen && (
          <div className="flex flex-col">
            <span className="text-sm font-medium">{user?.user_name || "User"}</span>
            <span className="text-xs text-gray-300">{user?.email || ""}</span>
          </div>
        )}
      </div>

      {/* Dropdown */}
      {menuOpen && (
        <div className="absolute bottom-14 left-0 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg py-2 z-50">
          <button
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-700"
            onClick={handleSettings}
          >
            ⚙️ Settings
          </button>
          <button
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-700"
            onClick={handleLogout}
          >
            🚪 Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserAccountMenu;
