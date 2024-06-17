import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/login', { email, password });
      const { message, loginIndex } = response.data;
      if (message.includes('user dashboard')) {
        localStorage.setItem('email', email);
        localStorage.setItem('loginIndex', loginIndex);
        navigate('/user-dashboard');
      } else if (message.includes('admin dashboard')) {
        localStorage.setItem('email', email);
        localStorage.setItem('loginIndex', loginIndex);
        navigate('/admin-dashboard');
      } else {
        setMessage(message);
      }
    } catch (error) {
      console.error(error);
      setMessage('Error logging in. Please try again.');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover"
      style={{
        backgroundImage:
          'url("https://www.wns.co.za/Portals/0/Images/HeaderBanner/desktop/1087/53/travel_HD.jpg")',
      }}
    >
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <input
          type="email"
          className="w-full mb-4 p-2 border rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="w-full mb-4 p-2 border rounded"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="w-full bg-green-500 hover:bg-green-600 text-white p-2 rounded mb-2"
          onClick={handleLogin}
        >
          Login
        </button>
        <p className="text-center">
          Don't have an account?{' '}
          <span className="text-blue-500 cursor-pointer" onClick={() => navigate('/register')}>
            Register here
          </span>
        </p>
        {message && <p className="mt-4 text-center text-red-500">{message}</p>}
      </div>
    </div>
  );
}

export default Login;
