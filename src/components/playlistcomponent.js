import React, { useState, useEffect, useRef } from 'react';
import './playlistcomponent.css'; // Import CSS for styling

const CustomAudioPlayer = ({ audioSrc }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;

    const handleLoadedMetadata = () => {
      // Optional: Set initial state or interact with audio metadata
      console.log('Audio metadata loaded:', audio.duration);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleTimeUpdate = () => {
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, []);

  const togglePlayPause = () => {
    const audio = audioRef.current;

    if (audio.paused) {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(error => console.error('Play failed:', error));
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const handleProgressChange = (e) => {
    const audio = audioRef.current;
    const newTime = (e.target.value / 100) * audio.duration;
    audio.currentTime = newTime;
    setProgress(e.target.value);
  };

  return (
    <div className="custom-audio-player">
      <button onClick={togglePlayPause} className="play-pause-btn">
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <input
        type="range"
        min="0"
        max="100"
        value={progress}
        onChange={handleProgressChange}
        className="progress-bar"
      />
      <audio ref={audioRef} src={audioSrc}></audio>
    </div>
  );
};

export default CustomAudioPlayer;
