import React, { useState, useEffect } from 'react';
import UserNavbar from './UserNavbar';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showThankYouModal, setShowThankYouModal] = useState(false);
  const [bookName, setBookName] = useState('');

  useEffect(() => {
    const savedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    setWishlist(savedWishlist);
  }, []);

  const handleRemoveFromWishlist = (book) => {
    const updatedWishlist = wishlist.filter((item) => item._id !== book._id);
    setWishlist(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
  };

  const handleViewMore = (book) => {
    setSelectedBook(book);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedBook(null);
  };

  const handleBuy = async (book) => {
    try {
      const response = await axios.put(`http://localhost:5000/books/${book._id}/buy`);
      if (response.status === 200) {
        setBookName(book.bookName);
        setShowThankYouModal(true);
        const updatedWishlist = wishlist.map((item) => {
          if (item._id === book._id) {
            return {
              ...item,
              purchasedCopies: item.purchasedCopies + 1  // Increase purchased copies
            };
          }
          return item;
        });
        setWishlist(updatedWishlist);
        localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      } else {
        alert('Failed to buy the book. No copies available.');
      }
    } catch (error) {
      console.error('Error buying book:', error);
    }
  };

  const handleCloseThankYouModal = () => {
    setShowThankYouModal(false);
  };

  return (
    <>
      <UserNavbar wishlistCount={wishlist.length} />
      <div className="min-h-screen bg-blue-100 p-4">
        <h1 className="text-3xl font-bold text-center mb-6">Wishlist</h1>
        <div className="flex flex-wrap justify-center">
          {wishlist.length === 0 ? (
            <p className="text-gray-700 text-center">No books in wishlist.</p>
          ) : (
            wishlist.map((book) => (
              <div key={book._id} className="bg-white shadow-md rounded-lg p-4 m-5 w-96 flex flex-col justify-between relative" style={{ height: 'auto' }}>
                <div className="flex">
                  <img src={book.imgUrl} className="h-52 w-32 object-cover mb-4 mt-3 rounded-lg" alt={book.bookName} />
                  <div className="ml-5 flex-1">
                    <h2 className="text-xl font-bold mb-2">{book.bookName}</h2>
                    <p className="text-gray-700 mb-2 truncate">Author: {book.authorName}</p>
                    <p className="text-gray-700 mb-2 truncate">Publisher: {book.publisherName}</p>
                    <p className="text-gray-700 mb-2 truncate">Available Copies: {book.totalCopies - book.purchasedCopies}</p>
                    <p className="text-gray-700 mb-2 truncate">Published Date: {new Date(book.publisherDate).toLocaleDateString('en-GB')}</p>
                    <p className="text-gray-700 mb-2 truncate">Price: ₹{book.price}</p>
                  </div>
                </div>
                <div className="mt-4 flex justify-between">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white p-1 rounded ml-9 mb-2 w-1/3 mr-1"
                    onClick={() => handleViewMore(book)}
                  >
                    View More
                  </button>
                  <button
                    className="bg-green-500 hover:bg-green-700 text-white p-1 mr-9 rounded mb-2 w-1/3 ml-1"
                    onClick={() => handleBuy(book)}
                  >
                    Buy
                  </button>
                  <button
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    onClick={() => handleRemoveFromWishlist(book)}
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedBook?.bookName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBook && (
            <>
              <img src={selectedBook.imgUrl} alt={selectedBook.bookName} className="w-full object-contain mb-4 rounded-lg" style={{ maxHeight: '300px' }} />
              <p><strong>Author:</strong> {selectedBook.authorName}</p>
              <p><strong>Publisher:</strong> {selectedBook.publisherName}</p>
              <p><strong>Available Copies:</strong> {selectedBook.availableCopies}</p>
              <p><strong>Published Date:</strong> {new Date(selectedBook.publisherDate).toLocaleDateString('en-GB')}</p>
              <p><strong>Price:</strong> ₹{selectedBook.price}</p>
              <p><strong>Summary:</strong> {selectedBook.description}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => handleBuy(selectedBook)}>
            Buy
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showThankYouModal} onHide={handleCloseThankYouModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Thank You!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-lg">Thank you for buying <strong>{bookName}</strong>! Happy Reading... :)</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseThankYouModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Wishlist;
