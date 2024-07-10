import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route,Navigate, Routes} from 'react-router-dom';
import Login from './components/login';
import Signup from './components/signup';
import Home from './components/home';
import Favorites from './components/fav';

import Navbar from './components/navbar';
import Playlists from './components/playlist';
import PlaylistDetail from './components/playlistdetail';
function App() {


  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    // Check if the user is authenticated
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };
  return (
    <Router>
      <div>
        {isAuthenticated && <Navbar handleLogout={handleLogout} />}
      <Routes>
        <Route exact path="/" element={<Navigate to="/login" />} />
        <Route exact path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        {/* <Route exact path="/playlists/:playlistId" element={Playlists} />
        <Route exact path="/playlists" element={Playlists} />                          */}

<Route exact path="/playlists" element={isAuthenticated ?<Playlists />: <Navigate to="/login" />} />
<Route exact path="/playlists/:playlistId" element={isAuthenticated ?<PlaylistDetail />: <Navigate to="/login" />} />
        <Route exact path="/signup" element={<Signup />} />
        <Route exact path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
        <Route exact path="/favorites" element={isAuthenticated ?<Favorites />: <Navigate to="/login" />} />
        <Route exact path="/playlists" element={isAuthenticated ?<Playlists />: <Navigate to="/login" />} />
      </Routes>
      </div>
    </Router>



      
     
  );
}

export default App;
