import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Home.css';

const cloudinaryBaseUrl = "https://res.cloudinary.com/djosldcjf/image/upload/w_300,h_300,c_fill/";

const Home = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:7022/api/Musics', { withCredentials: true })
      .then(res => {
        setSongs(res.data);
      })
      .catch(err => {
        console.error("Error fetching songs:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading songs...</div>;

  return (
    <div className="home-container">
      <h1>My Music Library</h1>
      <div className="songs-grid">
        {songs.length === 0 && <p>No songs available.</p>}
        {songs.map(song => (
          <div key={song.id} className="song-card">
            <img
              src={`${cloudinaryBaseUrl}${song.posterPublicId}.jpg`}
              alt={song.title}
              className="song-poster"
            />
            <div className="song-info">
              <h3 className="song-title">{song.title}</h3>
              <p className="song-artist">Artist: {song.artist}</p>
              <p className="song-genre">Genre: {song.genre}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
