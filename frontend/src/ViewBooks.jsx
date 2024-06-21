import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNavbar from './AdminNavbar';

function ViewBooks() {
  const [books, setBooks] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [editBook, setEditBook] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(5); // To handle 5 books on the first page

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/books');
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
        console.error(error);
      }
    };
    fetchBooks();
  }, []);

  const handleEdit = (book) => {
    setEditMode(book._id);
    setEditBook(book);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditBook((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const updatedBook = {
        ...editBook,
        totalCopies: parseInt(editBook.availableCopies) + editBook.purchasedCopies
      };
      await axios.put(`http://localhost:5000/books/${editBook._id}`, { bookDetails: updatedBook });
      setBooks(books.map((book) => (book._id === editBook._id ? updatedBook : book)));
      setEditMode(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemove = async (bookId) => {
    console.log('Attempting to delete book with ID:', bookId);
    try {
      const response = await axios.delete(`http://localhost:5000/books/${bookId}`);
      if (response.status === 200) {
        setBooks(books.filter((book) => book._id !== bookId));
        console.log('Book deleted successfully:', response.data);
      } else {
        console.error('Failed to delete book:', response.data.message);
      }
    } catch (error) {
      console.error('Error deleting book:', error.response ? error.response.data : error.message);
    }
  };

  // Adjusted Pagination Logic
  const firstPageBooks = books.slice(0, 5);
  const remainingBooks = books.slice(5);
  const indexOfLastBook = (currentPage - 1) * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = currentPage === 1 ? firstPageBooks : remainingBooks.slice(indexOfFirstBook, indexOfLastBook);

  const totalPages = Math.ceil((books.length - 5) / booksPerPage) + 1;
  const paginate = pageNumber => setCurrentPage(pageNumber);

  // Group books by publisher
  const groupedBooks = currentBooks.reduce((acc, book) => {
    const publisherIndex = acc.findIndex(p => p.publisherName === book.publisherName);
    if (publisherIndex === -1) {
      acc.push({
        publisherName: book.publisherName,
        books: [book]
      });
    } else {
      acc[publisherIndex].books.push(book);
    }
    return acc;
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <AdminNavbar />
      <div className="flex flex-col items-center justify-center flex-grow bg-cover w-full">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-full">
          <h1 className="text-4xl font-bold mb-9 text-center">View Book Details</h1>
          <table className="w-full table-auto border-collapse border border-gray-400">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-400 p-2 text-center">Image</th>
                <th className="border border-gray-400 p-2 text-center">Publisher</th>
                <th className="border border-gray-400 p-2 text-center">Author</th>
                <th className="border border-gray-400 p-2 text-center">Book Name</th>
                <th className="border border-gray-400 p-2 text-center">Published Date</th>
                <th className="border border-gray-400 p-2 text-center">Available Copies</th>
                <th className="border border-gray-400 p-2 text-center">Purchases</th>
                <th className="border border-gray-400 p-2 text-center">Price</th>
                <th className="border border-gray-400 p-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {groupedBooks.flatMap((publisher, pubIndex) =>
                publisher.books.map((book, bookIndex) => (
                  <tr key={book._id} className="bg-white">
                    <td className="border border-gray-400 p-2 text-center">
                      {editMode === book._id ? (
                        <input
                          type="text"
                          name="imgUrl"
                          value={editBook.imgUrl}
                          onChange={handleInputChange}
                          className="w-full p-2"
                        />
                      ) : (
                        <img
                          src={book.imgUrl}
                          alt={book.bookName}
                          className="w-20 h-22 object-cover mx-auto"
                        />
                      )}
                    </td>
                    {bookIndex === 0 && (
                      <td className="border border-gray-400 p-2 text-center" rowSpan={publisher.books.length}>
                        {publisher.publisherName}
                      </td>
                    )}
                    <td className="border border-gray-400 p-2 text-center">
                      {editMode === book._id ? (
                        <input
                          type="text"
                          name="authorName"
                          value={editBook.authorName}
                          onChange={handleInputChange}
                          className="w-full p-2"
                        />
                      ) : (
                        book.authorName
                      )}
                    </td>
                    <td className="border border-gray-400 p-2 text-center">
                      {editMode === book._id ? (
                        <input
                          type="text"
                          name="bookName"
                          value={editBook.bookName}
                          onChange={handleInputChange}
                          className="w-full p-2"
                        />
                      ) : (
                        book.bookName
                      )}
                    </td>
                    <td className="border border-gray-400 p-2 text-center">
                      {editMode === book._id ? (
                        <input
                          type="date"
                          name="publisherDate"
                          value={editBook.publisherDate.split('T')[0]} 
                          onChange={handleInputChange}
                          className="w-full p-2"
                        />
                      ) : (
                        new Date(book.publisherDate).toLocaleDateString('en-GB')
                      )}
                    </td>
                    <td className="border border-gray-400 p-2 text-center">
                      {editMode === book._id ? (
                        <input
                          type="number"
                          name="availableCopies"
                          value={editBook.availableCopies}
                          onChange={handleInputChange}
                          className="w-full p-2"
                        />
                      ) : (
                        book.availableCopies
                      )}
                    </td>
                    <td className="border border-gray-400 p-2 text-center">
                      {book.purchasedCopies}
                    </td>
                    <td className="border border-gray-400 p-2 text-center">
                      {editMode === book._id ? (
                        <input
                          type="number"
                          name="price"
                          value={editBook.price}
                          onChange={handleInputChange}
                          className="w-full p-2"
                        />
                      ) : (
                        book.price
                      )}
                    </td>
                    <td className="border border-gray-400 p-2">
                      <div className="flex space-x-2">
                        {editMode === book._id ? (
                          <button
                            className="bg-green-500 hover:bg-green-700 text-white p-2 rounded"
                            onClick={handleSave}
                          >
                            Save
                          </button>
                        ) : (
                          <>
                            <button
                              className="bg-blue-500 hover:bg-blue-700 text-white p-2 rounded"
                              onClick={() => handleEdit(book)}
                            >
                              Edit
                            </button>
                            <button
                              className="bg-red-500 hover:bg-red-700 text-white p-2 rounded"
                              onClick={() => handleRemove(book._id)}
                            >
                              Remove
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="mt-4 flex justify-center">
            <ul className="flex space-x-2">
              {[...Array(totalPages).keys()].map((number) => (
                <li key={number} className="cursor-pointer">
                  <button
                    onClick={() => paginate(number + 1)}
                    className={`px-3 py-1 rounded ${currentPage === number + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  >
                    {number + 1}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewBooks;
