import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNavbar from './AdminNavbar';

function Inquiries() {
  const [inquiries, setInquiries] = useState([]);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const response = await axios.get('http://localhost:5000/inquiries');
        setInquiries(response.data);
      } catch (error) {
        console.error('Error fetching inquiries:', error);
      }
    };
    fetchInquiries();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <AdminNavbar />
      <div
        className="flex-grow bg-cover bg-center"
        style={{
          backgroundImage: 'url("https://cdn.wallpapersafari.com/78/14/dFQR2j.jpg")',
        }}
      >
        <div className="container mx-auto px-4 py-8 bg-opacity-75 mt-8">
          <h2 className="text-4xl font-bold mb-10 text-center">Inquiries</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
              <thead>
                <tr className="bg-gray-200 text-black-600 uppercase text-m leading-normal">
                  <th className="py-3 px-6 text-center">Name</th>
                  <th className="py-3 px-6 text-center">Phone</th>
                  <th className="py-3 px-6 text-center">Email</th>
                  <th className="py-3 px-6 text-center">Message</th>
                  <th className="py-3 px-6 text-center">Date</th>
                </tr>
              </thead>
              <tbody className="text-black-700 text-m font-normal">
                {inquiries.map((inquiry) => (
                  <tr key={inquiry._id} className="border-b border-gray-200">
                    <td className="py-3 px-6 text-center whitespace-nowrap">{inquiry.name}</td>
                    <td className="py-3 px-6 text-center">{inquiry.phone}</td>
                    <td className="py-3 px-6 text-center">{inquiry.email}</td>
                    <td className="py-3 px-6 text-center">{inquiry.message}</td>
                    <td className="py-3 px-6 text-center">{new Date(inquiry.date).toLocaleDateString('en-GB')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Inquiries;
