import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, Button, Grid, Typography } from '@mui/material';
import { PlayArrow, Delete } from '@mui/icons-material';

const Playlists = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://musicwebbackend-1.onrender.com/api/playlists', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPlaylists(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching playlists:', error);
        setError('Error fetching playlists. Please try again later.');
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  const handleGoToPlaylist = (playlistId) => {
    navigate(`/playlists/${playlistId}`);
  };

  const handleRemovePlaylist = async (playlistIdToRemove) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://musicwebbackend-1.onrender.com/api/playlists/${playlistIdToRemove}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPlaylists(playlists.filter(playlist => playlist.id !== playlistIdToRemove));
    } catch (error) {
      console.error('Error removing playlist:', error);
    }
  };

  return (
    <div>
      <h2>My Playlists</h2>
      {loading && <p>Loading playlists...</p>}
      {error && <p>{error}</p>}
      <Grid container spacing={3}>
        {playlists.map(playlist => (
          <Grid item xs={12} sm={6} md={4} key={playlist.id}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>{playlist.name}</Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<PlayArrow />}
                  onClick={() => handleGoToPlaylist(playlist.id)}
                >
                  Go to Playlist
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<Delete />}
                  onClick={() => handleRemovePlaylist(playlist.id)}
                  style={{ marginTop: '1rem' }}
                >
                  Remove Playlist
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Playlists;
