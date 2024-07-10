import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { removeFavorite } from './api'; // Implement this function in your API service
import CustomAudioPlayer from './customaudioplayer'; // Import the custom audio player
import './fav.css'; // Import the CSS for Favorites component
const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const userId = localStorage.getItem('userId'); // Retrieve the logged-in user ID

  // useEffect(() => {
  //   const fetchFavorites = async () => {
  //     try {
  //       const response = await axios.get(`http://localhost:5000/api/favorites/${userId}`);
  //       setFavorites(response.data);
  //     } catch (error) {
  //       console.error('Error fetching favorites:', error);
  //     }
  //   };

  //   fetchFavorites();
  // }, [userId]);

  useEffect(() => {
    const fetchFavorites = async () => {
      const token = localStorage.getItem('token'); // Retrieve token from localStorage
      try {
        const response = await axios.get(
          'http://localhost:5000/api/favorites', 
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setFavorites(response.data);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };
  
    fetchFavorites();
  }, []);

  // const handleRemoveFavorite = async (songId) => {
  //   try {
  //     await removeFavorite(userId, songId);
  //     setFavorites(favorites.filter(fav => fav.id !== songId));
  //   } catch (error) {
  //     console.error('Error removing from favorites:', error);
  //   }
  // };


  const handleRemoveFavorite = async (songId) => {
    const token = localStorage.getItem('token'); // Retrieve token from localStorage
    try {
      await axios.delete(
        'http://localhost:5000/api/favorites/remove', 
        { 
          headers: { Authorization: `Bearer ${token}` },
          data: { song_id: songId }  // Pass song_id in the request body for DELETE method
        }
      );
      setFavorites(favorites.filter(fav => fav.id !== songId));
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  };

  return (
    <div className="favorites-container">
      <h2>Favorites</h2>
      <ul className="favorites-list">
        {favorites.map(favorite => (
          <li key={favorite.id} className="favorite-item">
            <div className="favorite-details">
              <div className="song-info"><h3>{favorite.title}</h3>
              <p>{favorite.artist}</p></div>
              <CustomAudioPlayer src={`http://localhost:5000/audio/${encodeURIComponent(favorite.file_path)}`} />
              <button onClick={() => handleRemoveFavorite(favorite.id)} className="remove-btn">Remove</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Favorites;
