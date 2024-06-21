import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';

function UserNavbar({ wishlistCount, handleLogout }) {
  return (
    <nav className="bg-blue-900 p-4 flex justify-between items-center">
      <h1 className="text-white text-2xl">User Dashboard</h1>
      <div className="flex space-x-4">
        <NavLink
          to="/wishlist"
          className="text-white"
          style={{ fontWeight: "bold", textDecoration: "none" }}
        >
          Wishlist ({wishlistCount})
        </NavLink>
        <button
          onClick={handleLogout}
          className="text-white"
          style={{ fontWeight: "bold", textDecoration: "none" }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default UserNavbar;
