import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserNavbar from './UserNavbar'; // Adjust the path if necessary

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0); // Example state for wishlist count

  useEffect(() => {
    const fetchOrders = async () => {
      const email = localStorage.getItem('email'); // Assuming user's email is stored in localStorage after login
      console.log('Fetching orders for email:', email); // Debug log
      try {
        const response = await axios.get('http://localhost:5000/user-orders', {
          params: { email }
        });
        console.log('Orders fetched:', response.data); // Debug log
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    fetchOrders();
  }, []);

  const handleLogout = () => {
    console.log('Logging out...');
  };

  return (
    <>
      <UserNavbar wishlistCount={wishlistCount} handleLogout={handleLogout} />
      <div className="min-h-screen bg-blue-100 p-4 bg-cover" style={{
        backgroundImage:
          'url("https://wallpapertag.com/wallpaper/full/2/3/1/931467-free-cute-plain-backgrounds-1920x1080-pc.jpg")',
      }}>
        <div className="flex flex-wrap justify-center">
          {orders.length === 0 ? (
            <p className="text-gray-700 text-center">No orders found.</p>
          ) : (
            orders.map(order => (
              <div key={order._id} className="bg-white shadow-md rounded-lg p-4 m-5 w-96 flex flex-col justify-between relative" style={{ height: 'auto' }}>
                <div className="flex">
                  <img src={order.bookImgUrl} className="h-52 w-32 object-cover mb-4 mt-3 rounded-lg border-2 border-black" alt={order.bookName} />
                  <div className="ml-5 flex-1 mt-10">
                    <h2 className="text-xl font-bold mb-2">{order.bookName}</h2>
                    <p className="text-gray-700 mb-2 truncate">Author: {order.authorName}</p>
                    <p className="text-gray-700 mb-2 truncate">Quantity: {order.quantity}</p>
                    <p className="text-gray-700 mb-2 truncate">Total Price: ₹{order.totalPrice}</p>
                    <p className="text-gray-700 mb-2 truncate">Purchase Date: {new Date(order.purchaseDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default MyOrders;
