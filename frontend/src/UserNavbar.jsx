import React from 'react';
import { NavLink } from 'react-router-dom';

function UserNavbar({ wishlistCount, handleLogout }) {
  return (
    <nav className="bg-blue-900 p-4 flex justify-between items-center">
      <NavLink to="/user-dashboard" className="text-white text-2xl" style={{ fontWeight: "bold", textDecoration: "none" }}>
        User Dashboard
      </NavLink>
      <div className="flex space-x-4">
        <NavLink to="/wishlist" className="text-white" style={{ fontWeight: "bold", textDecoration: "none" }}>
          Wishlist ({wishlistCount})
        </NavLink>
        <NavLink to="/my-orders" className="text-white" style={{ fontWeight: "bold", textDecoration: "none" }}>My Orders</NavLink>
        <NavLink to="/contact-us" className="text-white" style={{ fontWeight: "bold", textDecoration: "none" }}>
          Contact Us
        </NavLink>
        <NavLink to="/feedback" className="text-white" style={{ fontWeight: "bold", textDecoration: "none" }}>
          Feedback
        </NavLink>
        <button onClick={handleLogout} className="text-white" style={{ fontWeight: "bold", textDecoration: "none" }}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default UserNavbar;
