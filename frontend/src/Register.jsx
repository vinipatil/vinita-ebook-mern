import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import validator from 'validator';

function Register() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    if (!validator.isEmail(email)) {
      setMessage('Invalid email');
      return;
    }
    if (!/^[7,8,9]\d{9}$/.test(phone)) {
      setMessage('Invalid phone number');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/register', { name, phone, email, username, password });
      setMessage(response.data.message);
      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover" style={{
        backgroundImage:
          'url("http://www.pixelstalk.net/wp-content/uploads/2016/08/Desktop-Travel-Images.jpg")',
      }}>
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
        <input
          type="text"
          className="w-full mb-4 p-2 border rounded"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          className="w-full mb-4 p-2 border rounded"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <input
          type="email"
          className="w-full mb-4 p-2 border rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          className="w-full mb-4 p-2 border rounded"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          className="w-full mb-4 p-2 border rounded"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          className="w-full mb-4 p-2 border rounded"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button
          className="w-full bg-blue-500 hover:bg-blue-700 text-white p-2 rounded mb-2"
          onClick={handleRegister}
        >
          Register
        </button>
        <p className="text-center">
          Already have an account?{' '}
          <span className="text-blue-500 cursor-pointer" onClick={() => navigate('/login')}>
            Login here
          </span>
        </p>
        {message && <p className="mt-4 text-center text-red-500">{message}</p>}
      </div>
    </div>
  );
}

export default Register;
