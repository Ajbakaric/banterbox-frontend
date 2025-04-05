import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';  // Use default axios directly
// adjust path if needed


const NavBar = ({ user, setUser }) => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <nav className="bg-[#0f3d2e] text-white px-6 py-4 flex justify-between items-center shadow-md">
      <Link to="/" className="text-2xl font-bold text-[#c2f970]">💬 BanterBox</Link>

      <div className="space-x-4 text-sm">
        {!user ? (
          <>
            <Link to="/login" className="hover:text-[#ffa8a8]">Login</Link>
            <Link to="/signup" className="hover:text-[#ffa8a8]">Sign Up</Link>
          </>
        ) : (
          <>
            <Link to="/chatrooms" className="hover:text-[#ffa8a8]">Rooms</Link>
            <Link to="/profile" className="hover:text-[#ffa8a8]">Profile</Link>
            <span className="text-[#c2f970] font-semibold">({user.email})</span>
            <button
              onClick={handleLogout}
              className="bg-[#ff6f61] hover:bg-[#ffa8a8] text-white px-3 py-1 rounded-md font-medium"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
