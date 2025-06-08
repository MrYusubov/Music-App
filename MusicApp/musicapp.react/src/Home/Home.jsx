import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './Home.css';
import Header from '../Header/Header';

const cloudinaryBaseUrl = "https://res.cloudinary.com/djosldcjf/image/upload/w_300,h_300,c_fill/";
const cloudinaryAudioBaseUrl = "https://res.cloudinary.com/djosldcjf/video/upload/";

const Home = () => {
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [playingSongId, setPlayingSongId] = useState(null);
    const audioRef = useRef(null);

    const userId = localStorage.getItem('userId');

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

    const togglePlay = (song) => {
        if (!audioRef.current) return;

        if (playingSongId === song.id) {
            audioRef.current.pause();
            setPlayingSongId(null);
        } else {
            audioRef.current.src = `${cloudinaryAudioBaseUrl}${song.musicCloudinaryId}.mp3`;
            audioRef.current.play();
            setPlayingSongId(song.id);
        }
    };

    const handleAudioEnded = () => {
        setPlayingSongId(null);
    };

    const handleDownload = (song) => {
        const url = `${cloudinaryAudioBaseUrl}${song.musicCloudinaryId}.mp3`;
        const link = document.createElement('a');
        link.href = url;
        link.download = `${song.title}.mp3`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleAddFavorite = async (song) => {
        try {
            await axios.post(`http://localhost:7022/api/Favorites/${userId}`, {
                userId: localStorage.getItem('userId'),
                musicId: song.id,
                title: song.title,
                artist: song.artist,
                genre: song.genre,
                cloudinaryPublicId: song.musicCloudinaryId,
                posterLink: song.posterCloudinaryId ?
                    `${cloudinaryBaseUrl}${song.posterCloudinaryId}.jpg` :
                    "/default-placeholder.jpg"
            });
            alert(`"${song.title}" favorilərinə əlavə olundu.`);
        } catch (error) {
            console.error("Add to favorites failed:", error);
            alert("Favorilərə əlavə etmək alınmadı.");
        }
    };


    const handleAddToPlaylist = async (song) => {
        if (!userId) {
            alert("Please login to add songs to your playlist");
            return;
        }

        try {
            await axios.post(
                `http://localhost:7022/api/musics/playlist/add/${song.id}/${userId}`,
                {},
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            alert(`"${song.title}" added to your playlist!`);
        } catch (error) {
            console.error("Add to playlist failed:", error);
            if (error.response?.status === 401) {
                alert("Your session has expired. Please login again.");
            } else {
                alert(error.response?.data?.message || "Failed to add to playlist");
            }
        }
    };
    if (loading) return <div className="loading">Loading songs...</div>;

    return (
        <div>
            <Header />
            <div className="home-container">
                <div className="songs-grid">
                    {songs.length === 0 && <p>No songs available.</p>}
                    {songs.map(song => (
                        <div key={song.id} className="song-card">
                            <div className="poster-container" onClick={() => togglePlay(song)} style={{ cursor: "pointer", position: "relative" }}>
                                <img
                                    src={song.posterCloudinaryId ? `${cloudinaryBaseUrl}${song.posterCloudinaryId}.jpg` : "/default-placeholder.jpg"}
                                    alt={song.title}
                                    className="song-poster"
                                />
                                <div className={`play-button ${playingSongId === song.id ? 'playing' : ''}`}>
                                    {playingSongId === song.id ? (
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
                                <button
                                    className="playlist-btn"
                                    onClick={() => handleAddToPlaylist(song)}
                                    title="Add to playlist"
                                >
                                    Add to Playlist
                                </button>
                                <button onClick={() => handleAddFavorite(song)}>Add Favorite</button>
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

export default Home;
