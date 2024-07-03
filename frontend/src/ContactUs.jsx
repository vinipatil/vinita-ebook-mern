import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserNavbar from './UserNavbar';

function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    const savedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    setWishlistCount(savedWishlist.length);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/inquiries', formData);
      alert('Inquiry submitted successfully!');
      setFormData({
        name: '',
        phone: '',
        email: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      alert('Failed to submit inquiry. Please try again.');
    }
  };

  const handleLogout = async () => {
    const email = localStorage.getItem('email');
    const loginIndex = localStorage.getItem('loginIndex');
    try {
      await axios.post('http://localhost:5000/logout', { email, loginIndex });
      localStorage.removeItem('email');
      localStorage.removeItem('loginIndex');
      localStorage.removeItem('wishlist');
      window.location.href = '/login';
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <UserNavbar wishlistCount={wishlistCount} handleLogout={handleLogout} />
      <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8" style={{
        backgroundImage:
          'url("https://wallpapertag.com/wallpaper/full/2/3/1/931467-free-cute-plain-backgrounds-1920x1080-pc.jpg")',
      }}>
        <div className="flex flex-col md:flex-row bg-white rounded-xl shadow-lg overflow-hidden max-w-5xl w-full">
          <div className="md:w-1/2">
            <img
              className="h-full w-full object-cover"
              src="https://i1.wp.com/techinnov.ca/wp-content/uploads/2020/04/gif-phone-1.gif?w=1080&ssl=1"
              alt="Contact Us"
            />
          </div>
          <div className="md:w-1/2 p-6 space-y-8">
            <h2 className="text-2xl font-bold text-gray-900 text-center">Contact Us</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default ContactUs;
