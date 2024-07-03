import React, { useState, useEffect } from 'react';
import UserNavbar from './UserNavbar';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import BookCarousel from './BookCarousel';

function UserDashboard() {
  const [books, setBooks] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showThankYouModal, setShowThankYouModal] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [bookName, setBookName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [quantity, setQuantity] = useState(1);

  const fetchBooks = async (query = '') => {
    try {
      const response = await axios.get('http://localhost:5000/books', {
        params: { query }
      });
      const formattedBooks = response.data.flatMap(publisher =>
        publisher.authors.flatMap(author =>
          author.books.map(book => ({
            ...book,
            authorName: author.authorName,
            publisherName: publisher.publisherName,
            availableCopies: book.totalCopies - book.purchasedCopies 
          }))
        )
      );
      setBooks(formattedBooks);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  useEffect(() => {
    fetchBooks();
    const savedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    setWishlist(savedWishlist);
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    fetchBooks(searchQuery);
  };

  const handleAddToWishlist = (book) => {
    const updatedWishlist = [...wishlist, book];
    setWishlist(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
  };

  const handleRemoveFromWishlist = (book) => {
    const updatedWishlist = wishlist.filter((item) => item._id !== book._id);
    setWishlist(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
  };

  const handleViewMore = (book) => {
    setSelectedBook(book);
    setShowModal(true);
  };

  const handleBuy = (book) => {
    setSelectedBook(book);
    setShowBuyModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setShowBuyModal(false);
    setSelectedBook(null);
    setQuantity(1);
  };

  const confirmBuy = async (bookId) => {
    const email = localStorage.getItem('email'); // Assuming user's email is stored in localStorage after login
    const quantity = parseInt(document.getElementById("quantity").value, 10);
    try {
      const response = await axios.post(`http://localhost:5000/purchase/${bookId}`, {
        email,
        quantity,
      });
      console.log('Book purchased successfully', response.data);
  
      // Update the books state to reduce the available copies count
      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book._id === bookId
            ? {
                ...book,
                purchasedCopies: book.purchasedCopies + quantity,
                availableCopies: book.availableCopies - quantity,
              }
            : book
        )
      );
  
      setShowThankYouModal(true);
    } catch (error) {
      console.error('Error buying book:', error);
    }
  };
  

  const handleCloseThankYouModal = () => {
    setShowThankYouModal(false);
  };

  const handleLogout = async () => {
    const email = localStorage.getItem('email');
    const loginIndex = localStorage.getItem('loginIndex');
    try {
      await axios.post('http://localhost:5000/logout', { email, loginIndex });
      localStorage.removeItem('email');
      localStorage.removeItem('loginIndex');
      localStorage.removeItem('wishlist');
      setWishlist([]);
      window.location.href = '/login';
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <UserNavbar wishlistCount={wishlist.length} handleLogout={handleLogout} />
      <BookCarousel books={books} />
      <div className="min-h-screen bg-blue-100 p-4 bg-cover" style={{
      backgroundImage:
        'url("https://wallpapertag.com/wallpaper/full/2/3/1/931467-free-cute-plain-backgrounds-1920x1080-pc.jpg")',
    }}>
        <h1 className="text-5xl font-bold text-center mb-6 mt-5">Welcome to Our Book Store</h1>
        <form className="mb-4" onSubmit={handleSearch}>
          <div className="flex justify-center">
            <input
              type="text"
              className="p-2 w-2/3 rounded-l-lg border border-gray-300"
              placeholder="Find your book..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="p-2 bg-blue-500 hover:bg-blue-700 text-white rounded-r-lg"
            >
              Search
            </button>
          </div>
        </form>
        <div className="flex flex-wrap justify-center">
          {books.map((book) => (
            <div key={book._id} className="bg-white shadow-md rounded-lg p-4 m-5 w-96 flex flex-col justify-between relative" style={{ height: 'auto' }}>
              <div className="flex">
                <img src={book.imgUrl} className="h-52 w-32 object-cover mb-4 mt-3 rounded-lg" alt={book.bookName} />
                <div className="ml-5 flex-1">
                  <h2 className="text-xl font-bold mb-2">{book.bookName}</h2>
                  <p className="text-gray-700 mb-2 truncate">Author: {book.authorName}</p>
                  <p className="text-gray-700 mb-2 truncate">Publisher: {book.publisherName}</p>
                  <p className="text-gray-700 mb-2 truncate">Available Copies: {book.availableCopies}</p>
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
                  Buy Now
                </button>
                {wishlist.some((item) => item._id === book._id) ? (
                  <button
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    onClick={() => handleRemoveFromWishlist(book)}
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </button>
                ) : (
                  <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                    onClick={() => handleAddToWishlist(book)}
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Book Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBook && (
            <>
              <img src={selectedBook.imgUrl} alt={selectedBook.bookName} className="w-full object-contain mb-4 rounded-lg" style={{ maxHeight: '300px' }} />
              <p><strong>Author:</strong> {selectedBook.authorName}</p>
              <p><strong>Publisher:</strong> {selectedBook.publisherName}</p>
              <p><strong>Available Copies:</strong> {selectedBook.totalCopies - selectedBook.purchasedCopies}</p>
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

      <Modal show={showBuyModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Buy Book</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBook && (
            <>
              <h2 className="text-xl font-bold mb-2">{selectedBook.bookName}</h2>
              <p className="text-gray-700 mb-2">Available Copies: {selectedBook.availableCopies}</p>
              <Form.Group controlId="quantity">
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  min="1"
                  max={selectedBook.availableCopies}
                />
              </Form.Group>
              <p className="text-gray-700 mt-2">Total Price: ₹{selectedBook.price * quantity}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              confirmBuy(selectedBook._id);
              setBookName(selectedBook.bookName);
              handleClose();
              setShowThankYouModal(true);
            }}
          >
            Buy
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showThankYouModal} onHide={handleCloseThankYouModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Thank You</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-lg">Thank you for buying <strong>{bookName}</strong>! Happy Reading... :)</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseThankYouModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default UserDashboard;
