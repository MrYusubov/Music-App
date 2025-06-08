import { useState } from 'react'
import Auth from './Authentification/Auth'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Home/Home';
import UploadMusicModal from './Upload/UploadMusicModal';
import Favorites from './Favorites/Favorites';
import PlaylistPage from './Playlist/PlaylistPage';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/home" element={<Home />} />
        <Route path="/upload" element={<UploadMusicModal />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/playlist" element={<PlaylistPage />} />

      </Routes>
      </div>

    </>
  )
}

export default App
