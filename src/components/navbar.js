import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from './logout'; // Ensure you have implemented this function
import './navbar.css'
const Navbar = ({handleLogout}) => {
  const nav = useNavigate();

  // const handleLogout = ({handleLogout}) => {
  //   logout(); // Implement this function to handle logout logic
  //   nav('/login'); // Redirect to login page after logout
  // };

  return (
    <nav className="navbar">
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link to="/home" className="nav-link">Home</Link>
        </li>
        <li className="nav-item">
          <Link to="/favorites" className="nav-link">Favorites</Link>
        </li>
        <li className="nav-item">
          <Link to="/playlists" className="nav-link">Playlists</Link>
        </li>
        <li className="nav-item">
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;

