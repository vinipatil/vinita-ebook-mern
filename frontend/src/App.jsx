import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import UserDashboard from './UserDashboard';
import AddBook from './AddBook';
import Register from './Register';
import Login from './Login';
import Wishlist from './Wishlist';
import ViewBooks from './ViewBooks';
import LandingPage from './LandingPage';
import BookOverview from './BookOverview';
import AdminHomePage from './AdminHomePage';
import ContactUs from './ContactUs';
import Inquiries from './Inquiries';
import Feedback from './Feedback';
import OrdersTable from './OrdersTable';
import MyOrders from './MyOrders';

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

  const handleBuy = async (book) => {
    try {
      const response = await axios.put(`http://localhost:5000/books/${book._id}/buy`);
      if (response.status === 200) {
        const updatedBooks = wishlist.map((item) => {
          if (item._id === book._id) {
            return {
              ...item,
              purchasedCopies: item.purchasedCopies + 1
            };
          }
          return item;
        });
        setWishlist(updatedBooks);
      } else {
        alert('Failed to buy the book. No copies available.');
      }
    } catch (error) {
      console.error('Error buying book:', error);
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/admin-home" element={<AdminHomePage />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/add-book" element={<AddBook />} />
        <Route path="/view-books" element={<ViewBooks />} />
        <Route path="/book-overview" element={<BookOverview />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/inquiries" element={<Inquiries />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/user-order" element={<OrdersTable />} />
        <Route path="/my-orders" element={<MyOrders />} /> 
        <Route
          path="/user-dashboard"
          element={
            <UserDashboard
              wishlist={wishlist}
              handleAddToWishlist={handleAddToWishlist}
              handleRemoveFromWishlist={handleRemoveFromWishlist}
              handleBuy={handleBuy}
            />
          }
        />
        <Route
          path="/wishlist"
          element={
            <Wishlist
              wishlist={wishlist}
              handleRemoveFromWishlist={handleRemoveFromWishlist}
              handleBuy={handleBuy}
            />
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <LandingPage
              handleAddToWishlist={handleAddToWishlist}
              handleBuy={handleBuy}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
