import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [editMode, setEditMode] = useState(null);
  const [editUser, setEditUser] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [loginsPerPage] = useState(6);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserLogs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/user-logs');
        setUsers(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserLogs();
  }, []);

  const handleLogout = async () => {
    const email = localStorage.getItem('email');
    const loginIndex = localStorage.getItem('loginIndex');
    try {
      const response = await axios.post('http://localhost:5000/logout', { email, loginIndex });
      setMessage(response.data.message);
      localStorage.removeItem('email');
      localStorage.removeItem('loginIndex');
      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemove = async (userId, loginIndex) => {
    try {
      await axios.delete(`http://localhost:5000/remove-user-login/${userId}/${loginIndex}`);
      const updatedUsers = users.map(user => {
        if (user._id === userId) {
          user.logins = user.logins.filter((_, i) => i !== loginIndex);
        }
        return user;
      });
      setUsers(updatedUsers);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (user) => {
    setEditMode(user._id);
    setEditUser(user);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditUser(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:5000/update-user/${editUser._id}`, editUser);
      setUsers(users.map(user => (user._id === editUser._id ? editUser : user)));
      setEditMode(null);
      setMessage('User updated successfully');
    } catch (error) {
      console.error(error);
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatTime = (date) => {
    const d = new Date(date);
    return d.toLocaleTimeString();
  };

  const handleClick = (event) => {
    setCurrentPage(Number(event.target.id));
  };

  const pages = [];
  for (let i = 1; i <= Math.ceil(users.reduce((acc, user) => acc + user.logins.length, 0) / loginsPerPage); i++) {
    pages.push(i);
  }

  const renderPageNumbers = pages.map(number => {
    return (
      <li
        key={number}
        id={number}
        onClick={handleClick}
        className={`cursor-pointer inline-block mx-1 px-3 py-1 rounded ${currentPage === number ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
      >
        {number}
      </li>
    );
  });

  const currentLogins = users.flatMap(user => 
    user.logins.map(login => ({
      userId: user._id,
      name: user.name,
      email: user.email,
      login,
      loginIndex: user.logins.indexOf(login)
    }))
  ).slice((currentPage - 1) * loginsPerPage, currentPage * loginsPerPage);

  return (
    <div className="min-h-screen flex flex-col bg-cover" >
      <AdminNavbar />
      <div className="flex min-h-screen flex bg-cover bg-blue-100">
        <div className="p-8 rounded-lg shadow-lg w-full max-w-full" style={{ backgroundImage: 'url("https://cdn.wallpapersafari.com/78/14/dFQR2j.jpg")' }}>
          <h1 className="text-4xl font-bold mb-10 text-center">User Login Details</h1>
          <table className="w-full table-auto border-collapse border border-gray-400">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-400 p-2 text-center">Name</th>
                <th className="border border-gray-400 p-2 text-center">Email</th>
                <th className="border border-gray-400 p-2 text-center">Date</th>
                <th className="border border-gray-400 p-2 text-center">Login Time</th>
                <th className="border border-gray-400 p-2 text-center">Logout Time</th>
                <th className="border border-gray-400 p-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentLogins.map(({ userId, name, email, login, loginIndex }) => {
                const formattedDate = formatDate(login.loginTime);
                const formattedLoginTime = formatTime(login.loginTime);
                const formattedLogoutTime = login.logoutTime ? formatTime(login.logoutTime) : 'N/A';

                return (
                  <tr key={`${userId}-${loginIndex}`} className="bg-white">
                    <td className="border border-gray-400 p-2 whitespace-nowrap overflow-auto max-w-xs text-center">
                      {editMode === userId ? (
                        <input
                          type="text"
                          name="name"
                          value={editUser.name}
                          onChange={handleInputChange}
                          className="w-full p-2"
                        />
                      ) : (
                        name
                      )}
                    </td>
                    <td className="border border-gray-400 p-2 whitespace-nowrap overflow-auto max-w-xs text-center">
                      {editMode === userId ? (
                        <input
                          type="text"
                          name="email"
                          value={editUser.email}
                          onChange={handleInputChange}
                          className="w-full p-2"
                        />
                      ) : (
                        email
                      )}
                    </td>
                    <td className="border border-gray-400 p-2 text-center">{formattedDate}</td>
                    <td className="border border-gray-400 p-2 text-center">{formattedLoginTime}</td>
                    <td className="border border-gray-400 p-2 text-center">{formattedLogoutTime}</td>
                    <td className="border border-gray-400 p-2 text-center">
                      <div className="flex justify-center space-x-2">
                        {editMode === userId ? (
                          <button className="bg-green-500 hover:bg-green-700 text-white p-2 rounded" onClick={handleSave}>Save</button>
                        ) : (
                          <>
                            <button className="bg-blue-500 hover:bg-blue-700 text-white p-2 rounded" onClick={() => handleEdit({ _id: userId, name, email })}>Edit</button>
                            <button className="bg-red-500 hover:bg-red-700 text-white p-2 rounded" onClick={() => handleRemove(userId, loginIndex)}>Remove</button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {message && <p className="mt-4 text-center text-green-500">{message}</p>}
          <ul className="flex justify-center mt-4">
            {renderPageNumbers}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
