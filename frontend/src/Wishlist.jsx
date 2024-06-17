import React, { useState, useEffect } from 'react';
import UserNavbar from './UserNavbar';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function Wishlist() {
  const [books, setBooks] = useState([]); // State to store all books
  const [wishlist, setWishlist] = useState([]); // State to store wishlist items
  const [showModal, setShowModal] = useState(false); // State to control modal for book details
  const [selectedBook, setSelectedBook] = useState(null); // State to store currently selected book for details modal
  const [showThankYouModal, setShowThankYouModal] = useState(false); // State to control modal for thank you message
  const [bookName, setBookName] = useState(''); // State to store the name of the book bought

  // Function to fetch books from server
  const fetchBooks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/books');
      setBooks(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Load wishlist from localStorage on mount
  useEffect(() => {
    fetchBooks(); // Fetch books from server
    const savedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    setWishlist(savedWishlist);
  }, []);

  // Function to handle adding a book to the wishlist
  const handleAddToWishlist = (book) => {
    const updatedWishlist = [...wishlist, book];
    setWishlist(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
  };

  // Function to handle removing a book from the wishlist
  const handleRemoveFromWishlist = (book) => {
    const updatedWishlist = wishlist.filter((item) => item._id !== book._id);
    setWishlist(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
  };

  // Function to handle viewing more details about a book
  const handleViewMore = (book) => {
    setSelectedBook(book);
    setShowModal(true);
  };

  // Function to handle closing the modal
  const handleClose = () => {
    setShowModal(false);
    setSelectedBook(null);
  };

  // Function to handle buying a book
  const handleBuy = async (book) => {
    try {
      const response = await axios.put(`http://localhost:5000/books/${book._id}/buy`);
      if (response.status === 200) {
        setBookName(book.name);
        setShowThankYouModal(true);
        await fetchBooks(); // Refresh books after purchase
      } else {
        alert('Failed to buy the book. No copies available.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Function to handle closing the thank you modal
  const handleCloseThankYouModal = () => {
    setShowThankYouModal(false);
  };

  // Function to get book details by ID
  const getBookDetails = (bookId) => {
    return books.find(book => book._id === bookId);
  };

  return (
    <>
      <UserNavbar wishlistCount={wishlist.length} />
      <div className="min-h-screen bg-blue-100 p-4">
        <h1 className="text-3xl font-bold text-center mb-6">Wishlist</h1>
        <div className="flex flex-wrap justify-center">
          {wishlist.map((wishlistItem) => {
            const book = getBookDetails(wishlistItem._id);
            if (!book) return null; // Skip rendering if book details are not available

            return (
              <div key={book._id} className="bg-white shadow-md rounded-lg p-4 m-5 w-96 flex flex-col justify-between relative" style={{ height: 'auto' }}>
                <div className="flex">
                  <img src={book.photoUrl} alt={book.name} className="h-52 w-32 object-cover mb-4 mt-3 rounded-lg" />
                  <div className="ml-5 flex-1">
                    <h2 className="text-xl font-bold mb-2">{book.name}</h2>
                    <p className="text-gray-700 mb-2 truncate">Author: {book.author}</p>
                    <p className="text-gray-700 mb-2 truncate">Publisher: {book.publisher.name}</p>
                    <p className="text-gray-700 mb-2 truncate">Copies: {book.copiesAvailable}</p>
                    <p className="text-gray-700 mb-2 truncate">Published Date: {new Date(book.publishedYear).toLocaleDateString('en-GB')}</p>
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
            );
          })}
        </div>
      </div>

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedBook?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBook && (
            <>
              <img src={selectedBook.photoUrl} alt={selectedBook.name} className="w-full object-contain mb-4 rounded-lg" style={{ height: '270px' }} />
              <div className="p-4">
                <h2 className="text-xl font-bold mb-2">{selectedBook.name}</h2>
                <p className="text-gray-700 mb-2">Author: {selectedBook.author}</p>
                <p className="text-gray-700 mb-2">Publisher: {selectedBook.publisher.name}</p>
                <p className="text-gray-700 mb-2">Copies: {selectedBook.copiesAvailable}</p>
                <p className="text-gray-700 mb-2">Published Date: {new Date(selectedBook.publishedYear).toLocaleDateString('en-GB')}</p>
                <p className="text-gray-700 mb-2">Price: ₹{selectedBook.price}</p>
                <p className="text-gray-700 mb-4">Summary: {selectedBook.summary}</p>
                <button className="bg-green-500 hover:bg-green-700 text-white p-2 rounded w-full" onClick={() => handleBuy(selectedBook)}>Buy</button>
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>

      <Modal show={showThankYouModal} onHide={handleCloseThankYouModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Thank You!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Thank you for buying "{bookName}". Happy reading :)</p>
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
