import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function LandingPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });

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

  return (
    <div className="min-h-screen relative overflow-hidden bg-cover" style={{
      backgroundImage:
        'url("https://wallpapertag.com/wallpaper/full/2/3/1/931467-free-cute-plain-backgrounds-1920x1080-pc.jpg")',
    }}>
      <div className="absolute inset-0 bg-cover bg-center"></div>
      <div className="absolute inset-0 bg-blue-500 opacity-10"></div>
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-20 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl text-center lg:text-left">
            <span className="block animate-fadeInDown">Welcome to Our Book Store</span>
            <span className="block text-blue-600 animate-fadeInUp">Discover Your Next Great Read</span>
          </h1>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0 justify-center lg:justify-start">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/book-overview"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transform hover:scale-105 transition-transform duration-300 ease-in-out"
              >
                Browse Books
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 transform hover:scale-105 transition-transform duration-300 ease-in-out"
              >
                Login
              </Link>
            </div>
          </div>
        </div>

        {/* Book Review Testimonials */}
        <div className="py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                What Our Readers Say
              </p>
            </div>

            <div className="mt-10">
              <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
                <div className="p-6 bg-gray-50 rounded-lg shadow">
                  <img
                    src="https://i.pinimg.com/736x/07/33/ba/0733ba760b29378474dea0fdbcb97107.jpg" 
                    alt="Jane Doe"
                    className="w-32 h-38 rounded-xl mx-auto mb-4"
                  />
                  <p className="mt-2 text-lg leading-6 text-gray-500">"This bookstore has an amazing selection and the customer service is top-notch. I always find something new to read!"</p>
                  <p className="mt-4 text-base font-medium text-gray-900 text-center">- Jane Doe</p>
                </div>

                <div className="p-6 bg-gray-50 rounded-lg shadow">
                  <img
                    src="https://c.pxhere.com/photos/08/7a/male_portrait_profile_social_media_cv_young_elegant_suit-459413.jpg!d"
                    alt="John Smith"
                    className="w-32 h-38 rounded-xl mx-auto mb-4"
                  />
                  <p className="mt-2 text-lg leading-6 text-gray-500">"A wonderful experience every time I visit. The staff is friendly and knowledgeable. Highly recommend!"</p>
                  <p className="mt-4 text-base font-medium text-gray-900 text-center">- John Smith</p>
                </div>

                <div className="p-6 bg-gray-50 rounded-lg shadow">
                  <img
                    src="https://i.pinimg.com/originals/83/10/ab/8310ab709f70727b92fa1a6917897c82.jpg" 
                    alt="Sarah Johnson"
                    className="w-32 h-38 rounded-xl mx-auto mb-4"
                  />
                  <p className="mt-2 text-lg leading-6 text-gray-500">"Great variety of books and a cozy atmosphere. I love spending my weekends here, browsing through the shelves."</p>
                  <p className="mt-4 text-base font-medium text-gray-900 text-center">- Sarah Johnson</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Us Form */}
        <div className="mt-10 max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-20 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-5xl w-full mx-auto flex">
            <div className="w-1/2">
              <img
                className="h-full w-full object-cover"
                src="https://i1.wp.com/techinnov.ca/wp-content/uploads/2020/04/gif-phone-1.gif?w=1080&ssl=1" // Replace with the actual path to your image
                alt="Contact Us"
              />
            </div>
            <div className="w-1/2 p-8">
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
      </div>
    </div>
  );
}

export default LandingPage;
