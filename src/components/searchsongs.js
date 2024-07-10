

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './searchSongs.css';
const AudioControls = ({ song }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (audio.paused) {
      audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  const handleProgressChange = (e) => {
    const audio = audioRef.current;
    audio.currentTime = e.target.value;
    setCurrentTime(audio.currentTime);
  };

  return (
    <div className="audio-controls">
      <button 
        className={`play-pause-button ${isPlaying ? 'pause' : 'play'}`} 
        onClick={handlePlayPause}
      >
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <input 
        type="range" 
        min="0" 
        max={duration} 
        value={currentTime} 
        onChange={handleProgressChange}
        className="progress-bar"
      />
      <audio 
        ref={audioRef} 
        onTimeUpdate={handleTimeUpdate} 
        onLoadedMetadata={handleLoadedMetadata} 
        className="audio-element"
      >
        <source src={`http://localhost:5000/audio/${encodeURIComponent(song.file_path)}`} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};



const SearchSongs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [selectedPlaylistId, setSelectedPlaylistId] = useState('');
  const [selectedSongId, setSelectedSongId] = useState('');
  const [showPlaylistOptions, setShowPlaylistOptions] = useState(false);
  const token = localStorage.getItem('token');
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/playlists', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPlaylists(response.data);
      } catch (error) {
        console.error('Error fetching playlists:', error);
      }
    };

    fetchPlaylists();
  }, [token]);

  useEffect(() => {
    setIsLoading(true);
    const url = searchTerm.trim() === ''
      ? 'http://localhost:5000/api/songs'
      : `http://localhost:5000/api/songs?searchTerm=${encodeURIComponent(searchTerm)}`;
    axios.get(url)
      .then(response => {
        setSearchResults(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setIsLoading(false);
      });
  }, [searchTerm]);

  const handleAddToFavorites = async (songId) => {
    try {
      const response = await axios.post('http://localhost:5000/api/favorites/add', 
        { song_id: songId }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(response.data);
      alert('Song added to favorites');
    } catch (error) {
      console.error('Error adding to favorites:', error);
      alert('Error adding to favorites');
    }
  };

  const handleAddToPlaylist = async (songId) => {
    if (!selectedPlaylistId) {
      alert('Please select a playlist');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/playlists/add-song', 
        { playlist_id: selectedPlaylistId, song_id: songId }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(response.data);
      alert('Song added to playlist');
      setShowPlaylistOptions(false); // Close the playlist options after adding
    } catch (error) {
      console.error('Error adding to playlist:', error);
      alert('Error adding to playlist');
    }
  };

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) {
      alert('Please enter a playlist name');
      return;
    }
  
    try {
      const response = await axios.post(
        'http://localhost:5000/api/playlists/create',
        { name: newPlaylistName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      const newPlaylist = response.data; // Assuming response.data contains the playlist with id and name
  
      // Update playlists state to include the new playlist
      setPlaylists(prevPlaylists => [...prevPlaylists, { id: newPlaylist.playlistId, name: newPlaylistName }]);
  
      // Clear the new playlist name input
      setNewPlaylistName('');
  
      alert('Playlist created');
    } catch (error) {
      console.error('Error creating playlist:', error);
      alert('Error creating playlist');
    }
  };
  
  const togglePlaylistOptions = (songId) => {
    setSelectedSongId(songId);
    setShowPlaylistOptions(prevState => !prevState);
  };

  const handlePlayPause = (song) => {
    const audio = audioRef.current;
    if (audio.src !== `http://localhost:5000/audio/${encodeURIComponent(song.file_path)}`) {
      audio.src = `http://localhost:5000/audio/${encodeURIComponent(song.file_path)}`;
      audio.play();
      setIsPlaying(true);
    } else if (audio.paused) {
      audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  const handleProgressChange = (e) => {
    const audio = audioRef.current;
    audio.currentTime = e.target.value;
    setCurrentTime(audio.currentTime);
  };

  return (
    <div className="search-songs-container">
      <input
        className="search-input"
        type="text"
        placeholder="Search by artist or song name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {/* <ul className="songs-list">
        {searchResults.map(song => (
          <li key={song.id} className="song-item">
            <div className="song-details">
              <h3>{song.title}</h3>
              <p>{song.artist}</p>
              <div className="audio-controls">
                <button 
                  className={`play-pause-button ${isPlaying ? 'pause' : 'play'}`} 
                  onClick={() => handlePlayPause(song)}
                >
                  {isPlaying ? 'Pause' : 'Play'}
                </button>
                <input 
                  type="range" 
                  min="0" 
                  max={duration} 
                  value={currentTime} 
                  onChange={handleProgressChange}
                  className="progress-bar"
                />
                <audio 
                  ref={audioRef} 
                  onTimeUpdate={handleTimeUpdate} 
                  onLoadedMetadata={handleLoadedMetadata} 
                  className="audio-element"
                >
                  <source src={`http://localhost:5000/audio/${encodeURIComponent(song.file_path)}`} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
              <button className="favorite-button" onClick={() => handleAddToFavorites(song.id)}>Add to Favorites</button>
              <button className="playlist-button" onClick={() => togglePlaylistOptions(song.id)}>Add to Playlist</button>
              {showPlaylistOptions && selectedSongId === song.id && (
                <div className="playlist-options">
                  <select value={selectedPlaylistId} onChange={(e) => setSelectedPlaylistId(e.target.value)}>
                    <option value="">Select Playlist</option>
                    {playlists.map(playlist => (
                      <option key={playlist.id} value={playlist.id}>{playlist.name}</option>
                    ))}
                  </select>
                  <button className="add-button" onClick={() => handleAddToPlaylist(song.id)}>Add</button>
                  <div className="create-playlist">
                    <input 
                      type="text" 
                      placeholder="New playlist name" 
                      value={newPlaylistName} 
                      onChange={(e) => setNewPlaylistName(e.target.value)} 
                    />  
                    <button className="create-button" onClick={handleCreatePlaylist}>Create Playlist</button>
                  </div>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul> */}

<ul className="songs-list">
  {searchResults.map(song => (
    <li key={song.id} className="song-item">
      <div className="song-details">
        <h3>{song.title}</h3>
        <p>{song.artist}</p>
        <AudioControls song={song} />
        <button className="favorite-button" onClick={() => handleAddToFavorites(song.id)}>Add to Favorites</button>
        <button className="playlist-button" onClick={() => togglePlaylistOptions(song.id)}>Add to Playlist</button>
        {showPlaylistOptions && selectedSongId === song.id && (
          <div className="playlist-options">
            <select value={selectedPlaylistId} onChange={(e) => setSelectedPlaylistId(e.target.value)}>
              <option value="">Select Playlist</option>
              {playlists.map(playlist => (
                <option key={playlist.id} value={playlist.id}>{playlist.name}</option>
              ))}
            </select>
            <button className="add-button" onClick={() => handleAddToPlaylist(song.id)}>Add</button>
            <div className="create-playlist">
              <input 
                type="text" 
                placeholder="New playlist name" 
                value={newPlaylistName} 
                onChange={(e) => setNewPlaylistName(e.target.value)} 
              />  
              <button className="create-button" onClick={handleCreatePlaylist}>Create Playlist</button>
            </div>
          </div>
        )}
      </div>
    </li>
  ))}
</ul>

    </div>
  );
};

export default SearchSongs;



// import React, { useState, useEffect,useRef } from 'react';
// import axios from 'axios';
// import './searchSongs.css'; 
// const SearchSongs = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [searchResults, setSearchResults] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [playlists, setPlaylists] = useState([]);
//   const [newPlaylistName, setNewPlaylistName] = useState('');
//   const [selectedPlaylistId, setSelectedPlaylistId] = useState('');
//   const [selectedSongId, setSelectedSongId] = useState('');
//   const [showPlaylistOptions, setShowPlaylistOptions] = useState(false);
//   const token = localStorage.getItem('token');
//   const audioRef = useRef(null);

//   useEffect(() => {
//     const fetchPlaylists = async () => {
//       try {
//         const response = await axios.get('http://localhost:5000/api/playlists', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setPlaylists(response.data);
//       } catch (error) {
//         console.error('Error fetching playlists:', error);
//       }
//     };

//     fetchPlaylists();
//   }, [token]);

//   useEffect(() => {
//     setIsLoading(true);
//     const url = searchTerm.trim() === ''
//       ? 'http://localhost:5000/api/songs'
//       : `http://localhost:5000/api/songs?searchTerm=${encodeURIComponent(searchTerm)}`;
//     axios.get(url)
//       .then(response => {
//         setSearchResults(response.data);
//         setIsLoading(false);
//       })
//       .catch(error => {
//         setError(error.message);
//         setIsLoading(false);
//       });
//   }, [searchTerm]);

//   const handleAddToFavorites = async (songId) => {
//     try {
//       const response = await axios.post('http://localhost:5000/api/favorites/add', 
//         { song_id: songId }, 
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       console.log(response.data);
//       alert('Song added to favorites');
//     } catch (error) {
//       console.error('Error adding to favorites:', error);
//       alert('Error adding to favorites');
//     }
//   };

//   const handleAddToPlaylist = async (songId) => {
//     if (!selectedPlaylistId) {
//       alert('Please select a playlist');
//       return;
//     }

//     try {
//       const response = await axios.post('http://localhost:5000/api/playlists/add-song', 
//         { playlist_id: selectedPlaylistId, song_id: songId }, 
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       console.log(response.data);
//       alert('Song added to playlist');
//       setShowPlaylistOptions(false); // Close the playlist options after adding
//     } catch (error) {
//       console.error('Error adding to playlist:', error);
//       alert('Error adding to playlist');
//     }
//   };

//   const handleCreatePlaylist = async () => {
//     if (!newPlaylistName.trim()) {
//       alert('Please enter a playlist name');
//       return;
//     }
  
//     try {
//       const response = await axios.post(
//         'http://localhost:5000/api/playlists/create',
//         { name: newPlaylistName },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
  
//       const newPlaylist = response.data; // Assuming response.data contains the playlist with id and name
  
//       // Update playlists state to include the new playlist
//       setPlaylists(prevPlaylists => [...prevPlaylists, { id: newPlaylist.playlistId, name: newPlaylistName }]);
  
//       // Clear the new playlist name input
//       setNewPlaylistName('');
  
//       alert('Playlist created');
//     } catch (error) {
//       console.error('Error creating playlist:', error);
//       alert('Error creating playlist');
//     }
//   };
  
//   // const handleCreatePlaylist = async () => {
//   //   if (!newPlaylistName.trim()) {
//   //     alert('Please enter a playlist name');
//   //     return;
//   //   }
  
//   //   try {
//   //     const response = await axios.post(
//   //       'http://localhost:5000/api/playlists/create',
//   //       { name: newPlaylistName },
//   //       { headers: { Authorization: `Bearer ${token}` } }
//   //     );
  
//   //     const newPlaylist = response.data;
      
//   //     // Update playlists state to include the new playlist
//   //     setPlaylists(prevPlaylists => [...prevPlaylists, newPlaylist]);
  
//   //     // Clear the new playlist name input
//   //     setNewPlaylistName('');
  
//   //     // Select the newly created playlist
//   //     setSelectedPlaylistId(newPlaylist.id);
  
//   //     alert('Playlist created');
//   //   } catch (error) {
//   //     console.error('Error creating playlist:', error);
//   //     alert('Error creating playlist');
//   //   }
//   // };
  
  
//   const togglePlaylistOptions = (songId) => {
//     setSelectedSongId(songId);
//     setShowPlaylistOptions(prevState => !prevState);
//   };


//   const handlePlayPause = (song) => {
//     const audio = audioRef.current;
//     if (audio.src !== `http://localhost:5000/audio/${encodeURIComponent(song.file_path)}`) {
//       audio.src = `http://localhost:5000/audio/${encodeURIComponent(song.file_path)}`;
//       audio.play();
//     } else if (audio.paused) {
//       audio.play();
//     } else {
//       audio.pause();
//     }
//   };
//   return (
//     <div className="search-songs-container">
//       <input
//         className="search-input"
//         type="text"
//         placeholder="Search by artist or song name"
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//       />
//       {isLoading && <p>Loading...</p>}
//       {error && <p>Error: {error}</p>}
//       <ul className="songs-list">
//         {searchResults.map(song => (
//           <li key={song.id} className="song-item">
//             <div className="song-details">
//               <h3>{song.title}</h3>
//               <p>{song.artist}</p>
//               {/* <audio controls>
//                 <source src={`http://localhost:5000/audio/${encodeURIComponent(song.file_path)}`} type="audio/mpeg" />
//                 Your browser does not support the audio element.
//               </audio> */}

// <div className="audio-controls">
//                 <button className="play-pause-button" onClick={() => handlePlayPause(song)}>Play/Pause</button>
//                 <audio ref={audioRef} controls className="audio-element">
//                   <source src={`http://localhost:5000/audio/${encodeURIComponent(song.file_path)}`} type="audio/mpeg" />
//                   Your browser does not support the audio element.
//                 </audio>
//               </div>
//               <button className="favorite-button" onClick={() => handleAddToFavorites(song.id)}>Add to Favorites</button>
//               <button className="playlist-button" onClick={() => togglePlaylistOptions(song.id)}>Add to Playlist</button>
//               {showPlaylistOptions && selectedSongId === song.id && (
//                 <div className="playlist-options">
//                   {/* <select onChange={(e) => setSelectedPlaylistId(e.target.value)}>
//                     <option value="">Select playlist</option>
//                     {playlists.map(playlist => (
//                       <option key={playlist.id} value={playlist.id}>
//                         {playlist.name}
//                       </option>
//                     ))}
//                   </select> */}
//                   <select value={selectedPlaylistId} onChange={(e) => setSelectedPlaylistId(e.target.value)}>
//   <option value="">Select Playlist</option>
//   {playlists.map(playlist => (
//     <option key={playlist.id} value={playlist.id}>{playlist.name}</option>
//   ))}
// </select>
//                   <button  className="add-button" onClick={() => handleAddToPlaylist(song.id)}>Add</button>
//                   <div className="create-playlist">
//                     <input 
//                       type="text" 
//                       placeholder="New playlist name" 
//                       value={newPlaylistName} 
//                       onChange={(e) => setNewPlaylistName(e.target.value)} 
//                     />  
//                     <button className="create-button" onClick={handleCreatePlaylist}>Create Playlist</button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default SearchSongs;




