import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNavbar from './AdminNavbar';

const OrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersResponse = await axios.get('http://localhost:5000/orders');
        const ordersData = ordersResponse.data;

        // Retrieve wishlist from local storage
        const wishlistData = JSON.parse(localStorage.getItem('wishlist')) || [];

        // Filter out wishlist items that are already in orders
        const wishlistNotInOrders = wishlistData.filter(wishItem => {
          return !ordersData.some(orderItem => orderItem.bookName === wishItem.bookName);
        });

        // Update state with filtered wishlist and orders data
        setWishlist(wishlistNotInOrders);
        setOrders(ordersData);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  // Group orders by email
  const groupedOrders = orders.reduce((acc, order) => {
    if (!acc[order.email]) {
      acc[order.email] = [];
    }
    acc[order.email].push(order);
    return acc;
  }, {});

  const renderRows = () => {
    const rows = [];

    Object.keys(groupedOrders).forEach(email => {
      const orders = groupedOrders[email];
      orders.forEach((order, index) => {
        rows.push(
          <tr key={order._id} className="border-b border-gray-200">
            {index === 0 && (
              <td className="py-3 px-6 text-center border-r border-gray-200" rowSpan={orders.length}>
                {order.email}
              </td>
            )}
            <td className="py-3 px-6 text-2x text-center border-r border-gray-200">{order.bookName}</td>
            <td className="py-3 px-6 text-center border-r border-gray-200">₹{order.bookPrice}</td>
            <td className="py-3 px-6 text-center border-r border-gray-200">{order.quantity}</td>
            <td className="py-3 px-6 text-center border-r border-gray-200">₹{order.totalPrice}</td>
            <td className="py-3 px-6 text-center">{new Date(order.purchaseDate).toLocaleDateString('en-GB')}</td>
          </tr>
        );
      });
    });

    return rows;
  };

  return (
    <div>
      <AdminNavbar />
      <div className="min-h-screen bg-gray-100 p-6" style={{
      backgroundImage:
        'url("https://cdn.wallpapersafari.com/78/14/dFQR2j.jpg")',
    }}>
        <h1 className="text-3xl font-bold text-center mb-6">Order Details</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-200 text-black-700 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-center border-r border-gray-300">Email</th>
                <th className="py-3 px-6 text-center border-r border-gray-300">Book Name</th>
                <th className="py-3 px-6 text-center border-r border-gray-300">Book Price</th>
                <th className="py-3 px-6 text-center border-r border-gray-300">Quantity</th>
                <th className="py-3 px-6 text-center border-r border-gray-300">Total Price</th>
                <th className="py-3 px-6 text-center">Purchase Date</th>
              </tr>
            </thead>
            <tbody className="text-black-700 text-sm font-normal">
              {renderRows()}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrdersTable;
