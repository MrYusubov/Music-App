import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './PlaylistPage.css';

const API_URL = "http://localhost:7022/api/Musics";

const PlaylistPage = () => {
  const navigate = useNavigate();
  const [musics, setMusics] = useState([]);
  const [allMusics, setAllMusics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  
  const userId = localStorage.getItem('userId');
  const user = JSON.parse(localStorage.getItem('user'));

  const fetchPlaylistMusics = async () => {
    try {
      const response = await axios.get(`${API_URL}/playlist/all-music/${userId}`);
      setMusics(response.data);
    } catch (err) {
      setError('Error');
      console.error(err);
    }
  };

  const fetchAllMusics = async () => {
    try {
      const response = await axios.get(`${API_URL}`);
      setAllMusics(response.data);
    } catch (err) {
      console.error('Error ocurred while music download:', err);
    }
  };

  useEffect(() => {
    if (!userId) {
      navigate('/login');
      return;
    }

    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchPlaylistMusics(), fetchAllMusics()]);
      setLoading(false);
    };

    loadData();
  }, [userId, navigate]);

  const handleRemoveMusic = async (musicId) => {
    try {
      await axios.delete(`${API_URL}/playlist/remove/${musicId}/${userId}`);
      await fetchPlaylistMusics();
    } catch (err) {
      setError('Error occured while music delete');
      console.error(err);
    }
  };

  const handleAddMusic = (music) => {
    setMusics(prev => [...prev, music]);
    setShowAddModal(false);
  };

  if (!user) {
    return <div className="container">Please Log in</div>;
  }

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  if (error) {
    return <div className="container error">{error}</div>;
  }

  return (
    <div className="playlist-container">
      <div className="playlist-header">
        <h1>Mənim Playlistim</h1>
        <button 
          className="add-music-btn"
          onClick={() => setShowAddModal(true)}
        >
          Mahnı Əlavə Et
        </button>
      </div>

      {musics.length === 0 ? (
        <div className="empty-playlist">
          Your Playlist is empty !
        </div>
      ) : (
        <div className="music-list">
          {musics.map(music => (
            <div key={music.id} className="music-item">
              <div className="music-info">
                <h3>{music.title}</h3>
                <p>{music.artist} • {music.genre}</p>
              </div>
              <button 
                className="remove-btn"
                onClick={() => handleRemoveMusic(music.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <div className="modal-overlay">
          <div className="add-music-modal">
            <div className="modal-header">
              <h2>Add Music</h2>
              <button 
                className="close-btn"
                onClick={() => setShowAddModal(false)}
              >
                &times;
              </button>
            </div>
            <div className="modal-content">
              {allMusics.filter(m => !musics.some(pm => pm.id === m.id))
                .map(music => (
                  <div key={music.id} className="available-music-item">
                    <div className="music-info">
                      <h4>{music.title}</h4>
                      <p>{music.artist} • {music.genre}</p>
                    </div>
                    <button 
                      className="add-btn"
                      onClick={() => handleAddMusic(music)}
                    >
                      Add
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaylistPage;