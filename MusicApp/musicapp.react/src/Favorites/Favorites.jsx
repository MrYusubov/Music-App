import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import '../Home/Home.css';
import Header from '../Header/Header';

const cloudinaryBaseUrl = "https://res.cloudinary.com/djosldcjf/image/upload/w_300,h_300,c_fill/";
const cloudinaryAudioBaseUrl = "https://res.cloudinary.com/djosldcjf/video/upload/";

const Favorites = () => {
    const [favoriteSongs, setFavoriteSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [playingSongId, setPlayingSongId] = useState(null);
    const audioRef = useRef(null);

    const userId = localStorage.getItem('userId');

    useEffect(() => {
        async function fetchFavorites() {
            try {
                setLoading(true);
                const res = await axios.get(`http://localhost:7022/api/Favorites/${userId}`);
                setFavoriteSongs(res.data);
            } catch (err) {
                console.error("Error fetching favorites:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchFavorites();
    }, [userId]);

    const togglePlay = (song) => {
        if (!audioRef.current) return;

        if (playingSongId === song.musicId) {
            audioRef.current.pause();
            setPlayingSongId(null);
        } else {
            audioRef.current.src = `${cloudinaryAudioBaseUrl}${song.cloudinaryPublicId}.mp3`;
            audioRef.current.play();
            setPlayingSongId(song.musicId);
        }
    };

    const handleAudioEnded = () => {
        setPlayingSongId(null);
    };

    const handleDownload = (song) => {
        const url = `${cloudinaryAudioBaseUrl}${song.cloudinaryPublicId}.mp3`;
        const link = document.createElement('a');
        link.href = url;
        link.download = `${song.title}.mp3`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleRemoveFavorite = async (song) => {
        try {
            await axios.delete(`http://localhost:7022/api/Favorites/${userId}/${song.musicId}`);
            setFavoriteSongs(favoriteSongs.filter(fav => fav.musicId !== song.musicId));
            alert(`"${song.title}" favorilərdən silindi.`);
        } catch (error) {
            console.error("Remove from favorites failed:", error);
            alert("Favorilərdən silmək alınmadı.");
        }
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (favoriteSongs.length === 0) return <div className="loading">You don't have a favorite</div>;

    return (
        <div>
            <Header/>
            <div className="home-container">
                <h2 style={{textAlign: 'center', marginBottom: '30px', color: '#333'}}>Your Favorites Music</h2>
                <div className="songs-grid">
                    {favoriteSongs.map(song => (
                        <div key={song.musicId} className="song-card">
                            <div className="poster-container" onClick={() => togglePlay(song)} style={{cursor: "pointer", position: "relative"}}>
                                <img
                                    src={song.posterLink || `${cloudinaryBaseUrl}${song.cloudinaryPublicId}.jpg`}
                                    alt={song.title}
                                    className="song-poster"
                                />
                                <div className={`play-button ${playingSongId === song.musicId ? 'playing' : ''}`}>
                                    {playingSongId === song.musicId ? (
                                        <svg width="60" height="60" viewBox="0 0 24 24" fill="white">
                                            <rect x="6" y="5" width="4" height="14"></rect>
                                            <rect x="14" y="5" width="4" height="14"></rect>
                                        </svg>
                                    ) : (
                                        <svg width="60" height="60" viewBox="0 0 24 24" fill="white">
                                            <polygon points="5,3 19,12 5,21"></polygon>
                                        </svg>
                                    )}
                                </div>
                            </div>

                            <div className="song-info">
                                <h3 className="song-title">{song.title}</h3>
                                <p className="song-artist">Artist: {song.artist}</p>
                                <p className="song-genre">Genre: {song.genre}</p>
                            </div>

                            <div className="song-actions">
                                <button onClick={() => handleRemoveFavorite(song)}>Remove From Favorites</button>
                                <button onClick={() => handleDownload(song)}>Download</button>
                            </div>
                        </div>
                    ))}
                </div>
                <audio ref={audioRef} onEnded={handleAudioEnded} />
            </div>
        </div>
    );
};

export default Favorites;