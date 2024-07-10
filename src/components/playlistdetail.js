import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './playlistdetail.css'; // Import your CSS file for styling
import CustomAudioPlayer from './playlistcomponent'; // Custom audio player component

const PlaylistDetail = () => {
  const { playlistId } = useParams();
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/playlists/${playlistId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setSongs(response.data);
      } catch (error) {
        console.error('Error fetching songs:', error);
      }
    };

    fetchSongs();
  }, [playlistId]);

  const handleRemoveSong = async (songId) => {
    try {
      await axios.delete('http://localhost:5000/api/playlists/remove-song', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        data: { playlist_id: playlistId, song_id: songId }
      });
      setSongs(songs.filter(song => song.id !== songId));
    } catch (error) {
      console.error('Error removing song from playlist:', error);
    }
  };

  return (
    <div className="playlist-detail-container">
      <h3 className="playlist-title">Songs in Playlist</h3>
      <ul className="song-list">
        {songs.map(song => (
          <li key={song.id} className="song-item">
            <div className="song-info">
              <p className="song-details">{song.title} by {song.artist}</p>
              <CustomAudioPlayer audioSrc={`http://localhost:5000/audio/${encodeURIComponent(song.file_path)}`} />
            </div>
            <button className="remove-button" onClick={() => handleRemoveSong(song.id)}>Remove from Playlist</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlaylistDetail;
