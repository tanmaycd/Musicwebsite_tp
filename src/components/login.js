import React, { useState } from 'react';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';
import './signup.css'
const Login = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { username, password });
      const { token } = response.data;
      localStorage.setItem('token', token);
      setIsAuthenticated(true);
      alert('Login successful!');
      if (response.status === 200) {
        navigate('/home');
      }
  
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('Invalid Credentials');
    }
    
    // catch (error) {
    //   if (error.response && error.response.status === 401) {
    //     setErrorMessage('Invalid credentials. Please try again.');
    //   } else {
    //     console.error('Login error:', error);
    //     setErrorMessage('An error occurred. Please try again.');
    //   }
    // }
  };
  const handleSignupRedirect = () => {
    navigate('/signup');
  };
  return (
    // <div>
    //   <h2>Login</h2>
    //   <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
    //   <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
    //   <button onClick={handleLogin}>Login</button>
    //   {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    // </div>
    <div className="login-container">
    <h2>Login</h2>
    <div className="form-group">
      <input 
        type="text" 
        placeholder="Username" 
        value={username} 
        onChange={(e) => setUsername(e.target.value)} 
      />
    </div>
    <div className="form-group">
      <input 
        type="password" 
        placeholder="Password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
      />
    </div>
    <div className="form-group">
      <button onClick={handleLogin}>Login</button>
    </div>
    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    <div className="form-group">
      <button onClick={handleSignupRedirect}>Signup</button>
    </div>
  </div>
);
  
};

export default Login;
