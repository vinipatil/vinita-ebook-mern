import React, { useState } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import UserNavbar from './UserNavbar'; // Adjust the path as per your file structure

function Feedback() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [feedback, setFeedback] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/feedback', { name, email, phone, feedback });
      setMessage(response.data.message);
      setName('');
      setEmail('');
      setPhone('');
      setFeedback('');
    } catch (error) {
      setMessage('Failed to submit feedback.');
    }
  };

  // Assuming you have a logout functionality in place
  const handleLogout = () => {
    // Implement your logout logic here
  };

  return (
    <div style={{
      backgroundImage:
        'url("https://wallpapertag.com/wallpaper/full/2/3/1/931467-free-cute-plain-backgrounds-1920x1080-pc.jpg")',
    }}>
      <UserNavbar wishlistCount={0} handleLogout={handleLogout} /> {/* Adjust wishlistCount as per your application */}
      <div className="container mx-auto p-4 mt-7">
        <div className="max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden md:max-w-lg">
          <div className="md:flex">
            <div className="w-full p-4 px-5 py-5">
              <div className="mb-4">
                <h2 className="text-4xl font-bold text-black-700 text-center">Feedback</h2>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    required
                  />
                </div>
                <div className="mb-4">
                  <input
                    type="email"
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your Email"
                    required
                  />
                </div>
                <div className="mb-4">
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Your Phone Number"
                    required
                  />
                </div>
                <div className="mb-4">
                  <textarea
                    className="w-full h-32 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Enter your feedback"
                    required
                  ></textarea>
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Submit
                  </button>
                </div>
              </form>
              {message && <p className="mt-4 text-green-500">{message}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Feedback;
