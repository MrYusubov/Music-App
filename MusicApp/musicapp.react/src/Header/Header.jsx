import "./Header.css";
import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Header({ setIsLoggedIn, setUserData }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:7022/api/Account/logout", {}, {
        withCredentials: true
      });

      localStorage.removeItem("user");
      localStorage.removeItem("username");
      localStorage.removeItem("userId");
      navigate("/");
      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <div onClick={() => navigate("/home")} className="logo">🎵 MusicApp</div>

        <nav className="nav-links">
        <button onClick={() => navigate("/upload")}>Upload Music</button>
          <button onClick={() => navigate("/playlist")}>Your Playlist</button>
          <button onClick={() => navigate("/favorites")}>Favorites</button>
          <div className="profile">
            <button onClick={() => setIsProfileOpen(!isProfileOpen)}>
              <FaUserCircle /> <span>Profile</span>
            </button>
            {isProfileOpen && (
              <div className="dropdown">
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
