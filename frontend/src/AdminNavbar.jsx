import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function AdminNavbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const email = localStorage.getItem('email');
    const loginIndex = localStorage.getItem('loginIndex');
    try {
      await axios.post('http://localhost:5000/logout', { email, loginIndex });
      localStorage.removeItem('email');
      localStorage.removeItem('loginIndex');
      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <nav className="bg-blue-900 p-4 flex justify-between items-center">
      <h1 className="text-white text-2xl">Admin Dashboard</h1>
      <div className="flex space-x-4">
        <Link to="/admin-dashboard" className="text-white">Home</Link>
        <Link to="/add-book" className="text-white">Add Books</Link>
        <Link to="/view-books" className="text-white">View Books</Link> {/* Added Link */}
        <button onClick={handleLogout} className="text-white">Logout</button>
      </div>
    </nav>
  );
}

export default AdminNavbar;
