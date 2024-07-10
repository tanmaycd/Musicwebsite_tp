import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const login = (username, password) => {
  return axios.post(`${API_URL}/auth/login`, { username, password });
};

const signup = (username, email, password) => {
  return axios.post(`${API_URL}/auth/signup`, { username, email, password });
};

const getSongs = () => {
  return axios.get(`${API_URL}/songs`);
};



const getFavorites = (userId) => {
  return axios.get(`${API_URL}/favorites/${userId}`);
};






export const removeFavorite = async (userId, songId) => {
  return await axios.delete('http://localhost:5000/api/favorites/remove', {
    data: { user_id: userId, song_id: songId }
  });
};



export const createPlaylist = async (name,token) => {
  const response = await axios.post(`${API_URL}/playlists/create`, { name }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const addSongToPlaylist = async (playlistId, songId,token) => {
  await axios.post(`${API_URL}/playlists/add-song`, { playlist_id: playlistId, song_id: songId }, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const removeSongFromPlaylist = async (playlistId, songId,token) => {
  await axios.delete(`${API_URL}/playlists/remove-song`, {
    data: { playlist_id: playlistId, song_id: songId },
    headers: { Authorization: `Bearer ${token}` },
  });
};
export const getPlaylists = async (token) => {
  const response = await axios.get(`${API_URL}/playlists`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const addFavorite = async (songId, token) => {
  const response = await axios.post('http://localhost:5000/api/favorites/add', 
    { song_id: songId }, 
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}
export {
  login,
  signup,
  getSongs,

  getFavorites,
  
  
  
};



