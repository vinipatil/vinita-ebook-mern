import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNavbar from './AdminNavbar';

function ViewBooks() {
  const [books, setBooks] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [editBook, setEditBook] = useState({});

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/books');
        setBooks(response.data);
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
    if (name.startsWith('publisher.')) {
      const field = name.split('.')[1];
      setEditBook(prevState => ({
        ...prevState,
        publisher: {
          ...prevState.publisher,
          [field]: value
        }
      }));
    } else {
      setEditBook(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:5000/books/${editBook._id}`, editBook);
      setBooks(books.map(book => (book._id === editBook._id ? editBook : book)));
      setEditMode(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemove = async (bookId) => {
    try {
      await axios.delete(`http://localhost:5000/books/${bookId}`);
      setBooks(books.filter(book => book._id !== bookId));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-blue-100">
      <AdminNavbar />
      <div className="flex flex-col items-center justify-center flex-grow bg-cover">
        <div className="bg-white p-8 rounded-lg shadow-lg w-11/12 max-w-4xl mt-3">
          <h1 className="text-2xl font-bold mb-6 text-center">View Book Details</h1>
          <table className="w-full table-auto border-collapse border border-gray-400">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-400 p-2 text-center">Name</th>
                <th className="border border-gray-400 p-2 text-center">Author</th>
                <th className="border border-gray-400 p-2 text-center">Publisher</th>
                <th className="border border-gray-400 p-2 text-center">Published Year</th>
                <th className="border border-gray-400 p-2 text-center">Copies Available</th>
                <th className="border border-gray-400 p-2 text-center">Purchased</th>
                <th className="border border-gray-400 p-2 text-center">Price</th>
                <th className="border border-gray-400 p-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map(book => (
                <tr key={book._id} className="bg-white">
                  <td className="border border-gray-400 p-2 text-center">
                    {editMode === book._id ? (
                      <input
                        type="text"
                        name="name"
                        value={editBook.name}
                        onChange={handleInputChange}
                        className="w-full p-2"
                      />
                    ) : (
                      book.name
                    )}
                  </td>
                  <td className="border border-gray-400 p-2 text-center">
                    {editMode === book._id ? (
                      <input
                        type="text"
                        name="author"
                        value={editBook.author}
                        onChange={handleInputChange}
                        className="w-full p-2"
                      />
                    ) : (
                      book.author
                    )}
                  </td>
                  <td className="border border-gray-400 p-2 text-center">
                    {editMode === book._id ? (
                      <input
                        type="text"
                        name="publisher.name"
                        value={editBook.publisher.name}
                        onChange={handleInputChange}
                        className="w-full p-2"
                      />
                    ) : (
                      book.publisher.name
                    )}
                  </td>
                  <td className="border border-gray-400 p-2 text-center">
                    {editMode === book._id ? (
                      <input
                        type="text"
                        name="publishedYear"
                        value={editBook.publishedYear}
                        onChange={handleInputChange}
                        className="w-full p-2"
                      />
                    ) : (
                      book.publishedYear
                    )}
                  </td>
                  <td className="border border-gray-400 p-2 text-center">
                    {editMode === book._id ? (
                      <input
                        type="number"
                        name="copiesAvailable"
                        value={editBook.copiesAvailable}
                        onChange={handleInputChange}
                        className="w-full p-2"
                      />
                    ) : (
                      book.copiesAvailable
                    )}
                  </td>
                  <td className="border border-gray-400 p-2 text-center">
                    {book.purchasedCount}
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
                        <button className="bg-green-500 hover:bg-green-700 text-white p-2 rounded" onClick={handleSave}>Save</button>
                      ) : (
                        <>
                          <button className="bg-blue-500 hover:bg-blue-700 text-white p-2 rounded" onClick={() => handleEdit(book)}>Edit</button>
                          <button className="bg-red-500 hover:bg-red-700 text-white p-2 rounded" onClick={() => handleRemove(book._id)}>Remove</button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ViewBooks;
