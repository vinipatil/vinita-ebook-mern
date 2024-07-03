import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';

function AddBook() {
  const [bookName, setBookName] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [description, setDescription] = useState('');
  const [publisherName, setPublisherName] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [publisherDate, setPublisherDate] = useState('');
  const [totalCopies, setTotalCopies] = useState('');
  const [price, setPrice] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleAddBook = async () => {
    try {
      const bookDetails = {
        bookName: bookName,
        imgUrl: imgUrl,
        description: description,
        publisherDate: publisherDate,
        totalCopies: parseInt(totalCopies), 
        price: parseFloat(price), 
      };

      const response = await axios.post('http://localhost:5000/books', {
        publisherName: publisherName,
        authorName: authorName,
        bookDetails: bookDetails,
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
      <div className="min-h-screen flex items-center justify-center bg-cover bg-blue-100" style={{
      backgroundImage:
        'url("https://cdn.wallpapersafari.com/78/14/dFQR2j.jpg")',
    }}>
        <div className="bg-white p-8 mt-3 rounded-lg shadow-lg w-96">
          <h1 className="text-2xl font-bold mb-6 text-center">Add Book</h1>
          <input
            type="text"
            className="w-full mb-4 p-2 border rounded"
            placeholder="Book Name"
            value={bookName}
            onChange={(e) => setBookName(e.target.value)}
          />
          <input
            type="text"
            className="w-full mb-4 p-2 border rounded"
            placeholder="Image URL"
            value={imgUrl}
            onChange={(e) => setImgUrl(e.target.value)}
          />
          <input
            type="text"
            className="w-full mb-4 p-2 border rounded"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="text"
            className="w-full mb-4 p-2 border rounded"
            placeholder="Publisher Name"
            value={publisherName}
            onChange={(e) => setPublisherName(e.target.value)}
          />
          <input
            type="text"
            className="w-full mb-4 p-2 border rounded"
            placeholder="Author Name"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
          />
          <input
            type="date"
            className="w-full mb-4 p-2 border rounded"
            placeholder="Publisher Date"
            value={publisherDate}
            onChange={(e) => setPublisherDate(e.target.value)}
          />
          <input
            type="number"
            className="w-full mb-4 p-2 border rounded"
            placeholder="Total Copies"
            value={totalCopies}
            onChange={(e) => setTotalCopies(e.target.value)}
          />
          <input
            type="number"
            className="w-full mb-4 p-2 border rounded"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

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
