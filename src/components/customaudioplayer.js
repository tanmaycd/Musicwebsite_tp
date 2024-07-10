// CustomAudioPlayer.js
import React, { useState, useRef, useEffect } from 'react';
import './audioplayer.css';

const CustomAudioPlayer = ({ src }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, []);

  const togglePlayPause = () => {
    const audio = audioRef.current;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }

    setIsPlaying(!isPlaying);
  };

  const handleProgressChange = (e) => {
    const audio = audioRef.current;
    const newTime = (e.target.value / 100) * audio.duration;
    audio.currentTime = newTime;
    setProgress(e.target.value);
  };

  return (
    <div className="audio-player">
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
      <audio ref={audioRef} src={src}></audio>
    </div>
  );
};

export default CustomAudioPlayer;
