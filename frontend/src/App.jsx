import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import UserDashboard from './UserDashboard';
import AddBook from './AddBook';
import Register from './Register';
import Login from './Login';
import Wishlist from './Wishlist';
import ViewBooks from './ViewBooks'; 

function App() {
  const [wishlist, setWishlist] = useState([]);

  const handleAddToWishlist = (book) => {
    if (!wishlist.some(item => item._id === book._id)) {
      setWishlist([...wishlist, book]);
    }
  };

  const handleRemoveFromWishlist = (book) => {
    setWishlist(wishlist.filter(item => item._id !== book._id));
  };

  return (
    <Router>
      <Routes>
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/add-book" element={<AddBook />} />
        <Route path="/view-books" element={<ViewBooks />} /> 
        <Route 
          path="/user-dashboard" 
          element={
            <UserDashboard 
              wishlist={wishlist} 
              handleAddToWishlist={handleAddToWishlist} 
              handleRemoveFromWishlist={handleRemoveFromWishlist} 
            />
          } 
        />
        <Route 
          path="/wishlist" 
          element={
            <Wishlist 
              wishlist={wishlist} 
              handleRemoveFromWishlist={handleRemoveFromWishlist} 
            />
          } 
        />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
