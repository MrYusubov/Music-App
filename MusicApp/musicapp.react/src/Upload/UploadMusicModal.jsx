import React, { useState } from "react";
import "./UploadMusicModal.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function UploadMusicModal({ isOpen, onClose }) {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [genre, setGenre] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [posterFile, setPosterFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [audioFileName, setAudioFileName] = useState("");
  const [posterFileName, setPosterFileName] = useState("");

  const navigate = useNavigate();

  const handleAudioChange = (e) => {
    const file = e.target.files[0];
    setAudioFile(file);
    setAudioFileName(file ? file.name : "");
  };

  const handlePosterChange = (e) => {
    const file = e.target.files[0];
    setPosterFile(file);
    setPosterFileName(file ? file.name : "");
  };

  const handleUpload = async () => {
    if (!title || !artist || !genre || !audioFile || !posterFile) {
      alert("Zəhmət olmasa bütün sahələri doldurun.");
      return;
    }

    setLoading(true);

    try {
      const formDataAudio = new FormData();
      formDataAudio.append("file", audioFile);
      formDataAudio.append("upload_preset", "airbnb_uploads");

      const audioRes = await axios.post(
        "https://api.cloudinary.com/v1_1/djosldcjf/video/upload",
        formDataAudio
      );
      const audioData = audioRes.data;

      const formDataPoster = new FormData();
      formDataPoster.append("file", posterFile);
      formDataPoster.append("upload_preset", "airbnb_uploads");

      const posterRes = await axios.post(
        "https://api.cloudinary.com/v1_1/djosldcjf/image/upload",
        formDataPoster
      );
      const posterData = posterRes.data;

      const musicPayload = {
        title,
        artist,
        genre,
        cloudinaryPublicId: audioData.public_id,
        posterLink: posterData.public_id,
      };

      await axios.post("http://localhost:7022/api/Musics", musicPayload, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      alert("Mahnı uğurla yükləndi.");
      navigate("/home");


      setTitle("");
      setArtist("");
      setGenre("");
      setAudioFile(null);
      setPosterFile(null);
      setAudioFileName("");
      setPosterFileName("");
    } catch (err) {
      console.error("Yükləmə zamanı xəta baş verdi:", err);
      alert("Xəta baş verdi.");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Mahnı Yüklə</h2>
          <button className="close-btn" onClick={() => navigate("/home")}>
            &times;
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label>Başlıq</label>
            <input
              type="text"
              placeholder="Mahnı adı"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Artist</label>
              <input
                type="text"
                placeholder="Artist adı"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Janr</label>
              <input
                type="text"
                placeholder="Janr"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="file-upload-group">
            <label className="file-upload-label">
              <span>Audio fayl seçin</span>
              <input
                type="file"
                accept="audio/*"
                onChange={handleAudioChange}
                required
                hidden
              />
              <div className="file-upload-box">
                {audioFileName || "Fayl seçilməyib"}
              </div>
            </label>
          </div>

          <div className="file-upload-group">
            <label className="file-upload-label">
              <span>Poster şəkil seçin</span>
              <input
                type="file"
                accept="image/*"
                onChange={handlePosterChange}
                required
                hidden
              />
              <div className="file-upload-box">
                {posterFileName || "Fayl seçilməyib"}
              </div>
            </label>
          </div>
        </div>

        <div className="modal-footer">
          <button className="cancel-btn" onClick={() => navigate("/home")}>
            Ləğv et
          </button>

          <button
            className="submit-btn"
            onClick={handleUpload}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span> Yüklənir...
              </>
            ) : (
              "Yüklə"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default UploadMusicModal;
