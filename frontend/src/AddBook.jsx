import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';

function AddBook() {
  const [name, setName] = useState('');
  const [author, setAuthor] = useState('');
  const [publisherName, setPublisherName] = useState('');
  const [publishedYear, setPublishedYear] = useState('');
  const [copiesAvailable, setCopiesAvailable] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [price, setPrice] = useState('');
  const [summary, setSummary] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleAddBook = async () => {
    try {
      const response = await axios.post('http://localhost:5000/add-book', {
        name,
        author,
        publisherName,
        publishedYear,
        copiesAvailable,
        photoUrl,
        price,
        summary,
      });
      setMessage(response.data.message);
      navigate('/admin-dashboard');
    } catch (error) {
      console.error(error);
      setMessage('Error adding book. Please try again.');
    }
  };

  return (
    <>
      <AdminNavbar />
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-blue-100"
        // style={{
        //   backgroundImage:
        //     'url("https://media0.giphy.com/media/xTiTnxpQ3ghPiB2Hp6/giphy.gif")',
        // }}
      >
        <div className="bg-white p-8 mt-3 rounded-lg shadow-lg w-96">
          <h1 className="text-2xl font-bold mb-6 text-center">Add Book</h1>
          <input
            type="text"
            className="w-full mb-4 p-2 border rounded"
            placeholder="Title"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            className="w-full mb-4 p-2 border rounded"
            placeholder="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
          <input
            type="text"
            className="w-full mb-4 p-2 border rounded"
            placeholder="Publisher"
            value={publisherName}
            onChange={(e) => setPublisherName(e.target.value)}
          />
          <input
            type="text"
            className="w-full mb-4 p-2 border rounded"
            placeholder="Published Date"
            value={publishedYear}
            onChange={(e) => setPublishedYear(e.target.value)}
          />
          <input
            type="number"
            className="w-full mb-4 p-2 border rounded"
            placeholder="Number of Copies"
            value={copiesAvailable}
            onChange={(e) => setCopiesAvailable(e.target.value)}
          />
          <input
            type="text"
            className="w-full mb-4 p-2 border rounded"
            placeholder="Image URL"
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
          />
          <input
            type="number"
            className="w-full mb-4 p-2 border rounded"
            placeholder="Price (₹)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <textarea
            className="w-full mb-4 p-2 border rounded"
            placeholder="Summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          ></textarea>
          <button
            className="w-full bg-blue-500 hover:bg-blue-700 text-white p-2 rounded mb-2"
            onClick={handleAddBook}
          >
            Add Book
          </button>
          {message && <p className="mt-4 text-center text-green-500">{message}</p>}
        </div>
      </div>
    </>
  );
}

export default AddBook;
