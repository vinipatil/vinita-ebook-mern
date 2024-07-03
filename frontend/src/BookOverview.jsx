import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function BookOverview() {
  const [books, setBooks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

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
  }, []);

  const handleViewMore = (book) => {
    setSelectedBook(book);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedBook(null);
  };

  const handleAddToWishlist = (book) => {
    const email = localStorage.getItem('email');
    console.log("Adding to wishlist. Email: ", email); 
    if (!email) {
      console.log("User not logged in. Showing login prompt."); 
      setShowLoginPrompt(true);
    } else {
      console.log(`Added to wishlist: ${book.bookName}`);
    }
  };

  const handleBuyBook = (book) => {
    const email = localStorage.getItem('email');
    console.log("Buying book. Email: ", email); 
    if (!email) {
      console.log("User not logged in. Showing login prompt."); 
      setShowLoginPrompt(true);
    } else {
      console.log(`Buying book: ${book.bookName}`);
    }
  };

  const handleLoginRedirect = () => {
    console.log("Redirecting to login page."); 
    setShowLoginPrompt(false);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-blue-100 bg-cover p-4" style={{
      backgroundImage:
        'url("https://wallpapertag.com/wallpaper/full/2/3/1/931467-free-cute-plain-backgrounds-1920x1080-pc.jpg")',
    }}>
      <h1 className="text-5xl font-bold text-center mb-9 mt-5">Welcome to Our Book Store</h1>
      <form className="mb-4" onSubmit={(e) => { e.preventDefault(); fetchBooks(searchQuery); }}>
        <div className="flex justify-center">
          <input
            type="text"
            className="p-2 w-2/3 rounded-l-lg border border-gray-300"
            placeholder="Search by book name, author, or publisher"
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
                className="bg-green-500 hover:bg-green-700 text-white p-1 rounded ml-9 mb-2 w-1/3 mr-1"
                onClick={() => handleBuyBook(book)}
              >
                Buy
              </button>
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={() => handleAddToWishlist(book)}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </button>
            </div>
          </div>
        ))}
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
          <Button variant="primary" onClick={() => handleBuyBook(selectedBook)}>
            Buy
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showLoginPrompt} onHide={() => setShowLoginPrompt(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Login Required</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>You need to login/register first.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLoginPrompt(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleLoginRedirect}>
            Login
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default BookOverview;
