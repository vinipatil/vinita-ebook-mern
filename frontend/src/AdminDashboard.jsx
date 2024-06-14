import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from './AdminNavbar'; 

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [editMode, setEditMode] = useState(null);
  const [editUser, setEditUser] = useState({});
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

  return (
    <div className="min-h-screen flex flex-col bg-blue-100">
      <AdminNavbar /> 
      <div className="flex flex-col items-center justify-center flex-grow bg-cover">
        <div className="bg-white p-8 rounded-lg shadow-lg w-11/12 max-w-4xl">
          <h1 className="text-2xl font-bold mb-6 text-center">Admin Dashboard</h1>
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
              {users.map((user, index) => (
                user.logins.map((login, i) => {
                  const formattedDate = formatDate(login.loginTime);
                  const formattedLoginTime = formatTime(login.loginTime);
                  const formattedLogoutTime = login.logoutTime ? formatTime(login.logoutTime) : 'N/A';

                  return (
                    <tr key={`${index}-${i}`} className="bg-white">
                      <td className="border border-gray-400 p-2 whitespace-nowrap overflow-auto max-w-xs text-center">
                        {editMode === user._id ? (
                          <input
                            type="text"
                            name="name"
                            value={editUser.name}
                            onChange={handleInputChange}
                            className="w-full p-2"
                          />
                        ) : (
                          user.name
                        )}
                      </td>
                      <td className="border border-gray-400 p-2 whitespace-nowrap overflow-auto max-w-xs text-center">
                        {editMode === user._id ? (
                          <input
                            type="text"
                            name="email"
                            value={editUser.email}
                            onChange={handleInputChange}
                            className="w-full p-2"
                          />
                        ) : (
                          user.email
                        )}
                      </td>
                      <td className="border border-gray-400 p-2">{formattedDate}</td>
                      <td className="border border-gray-400 p-2">{formattedLoginTime}</td>
                      <td className="border border-gray-400 p-2">{formattedLogoutTime}</td>
                      <td className="border border-gray-400 p-2">
                        <div className="flex space-x-2">
                          {editMode === user._id ? (
                            <button className="bg-green-500 hover:bg-green-700 text-white p-2 rounded" onClick={handleSave}>Save</button>
                          ) : (
                            <>
                              <button className="bg-blue-500 hover:bg-blue-700 text-white p-2 rounded" onClick={() => handleEdit(user)}>Edit</button>
                              <button className="bg-red-500 hover:bg-red-700 text-white p-2 rounded" onClick={() => handleRemove(user._id, i)}>Remove</button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ))}
            </tbody>
          </table>
          {message && <p className="mt-4 text-center text-green-500">{message}</p>}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
