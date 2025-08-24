import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../styles/ArtistsPage.css";

const backendURL = "http://localhost:5000";

const ArtistsPage = () => {
  const [artists, setArtists] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [previewMedia, setPreviewMedia] = useState(null);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));

        const res = await fetch(`${backendURL}/api/artists`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });

        const data = await res.json();

        if (Array.isArray(data)) {
          const sorted = [...data].sort((a, b) => {
            const dateA = a.createdAt
              ? new Date(a.createdAt)
              : new Date(parseInt(a._id.substring(0, 8), 16) * 1000);
            const dateB = b.createdAt
              ? new Date(b.createdAt)
              : new Date(parseInt(b._id.substring(0, 8), 16) * 1000);
            return dateB - dateA;
          });
          setArtists(sorted);
        } else {
          setArtists([]);
        }
      } catch (err) {
        console.error("Error fetching artists:", err);
      }
    };

    fetchArtists();
  }, []);

  // ✅ helper to get the first available media
  const getFirstMedia = (artist) => {
    if (artist.photos?.length > 0) {
      return { type: "image", src: artist.photos[0] };
    }
    if (artist.videos?.length > 0) {
      return { type: "video", src: artist.videos[0] };
    }
    return null;
  };

  return (
    <>
      <Navbar />

      <div className="artists-page">
        <h1 className="page-title">Meet Our Artists</h1>
        <div className="artists-grid">
          {artists.length > 0 ? (
            artists.map((artist) => {
              const firstMedia = getFirstMedia(artist);
              return (
                <div
                  className="artist-card"
                  key={artist._id}
                  onClick={() => setSelectedArtist(artist)}
                >
                  {firstMedia && firstMedia.type === "image" && (
                    <img
                      src={firstMedia.src}
                      alt={artist.name}
                      className="artist-photo"
                    />
                  )}
                  {firstMedia && firstMedia.type === "video" && (
                    <video
                      className="artist-video"
                      controls
                      src={firstMedia.src}
                    />
                  )}
                  <h2>{artist.name}</h2>
                  <div className="artist-info">
                    <p><strong>Role:</strong> {artist.identity || artist.role}</p>
                    <p><strong>Email:</strong> {artist.email}</p>
                    <p><strong>Contact:</strong> {artist.contact || "N/A"}</p>
                    <p><strong>Gender:</strong> {artist.gender || "N/A"}</p>
                    <p><strong>DOB:</strong> {artist.dob ? new Date(artist.dob).toLocaleDateString() : "N/A"}</p>
                    <p><strong>City:</strong> {artist.city || "N/A"}</p>
                    <p><strong>State:</strong> {artist.state || "N/A"}</p>
                    <p><strong>Country:</strong> {artist.country || "N/A"}</p>
                    <p><strong>Language:</strong> {artist.language || "N/A"}</p>
                    <p>{artist.description}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <p>No artists found.</p>
          )}
        </div>

        {/* Modal (Info Card) */}
        {selectedArtist && (
          <div className="artist-modal">
            <div className="artist-modal-content">
              <button className="close-btn" onClick={() => setSelectedArtist(null)}>
                ✖
              </button>

              <h2>{selectedArtist.name}</h2>

              {/* Show only first 4 photos and videos */}
              <div className="artist-photos-gallery">
                {[
                  ...(selectedArtist.photos || []),
                  ...(selectedArtist.videos || []),
                ]
                  .slice(0, 4)
                  .map((media, idx) =>
                    media.includes("mp4") ? (
                      <video
                        key={idx}
                        controls
                        className="artist-gallery-photo"
                        onClick={() =>
                          setPreviewMedia({ type: "video", src: media })
                        }
                      >
                        <source src={media} type="video/mp4" />
                      </video>
                    ) : (
                      <img
                        key={idx}
                        src={media}
                        alt={`${selectedArtist.name} ${idx}`}
                        className="artist-gallery-photo"
                        onClick={() =>
                          setPreviewMedia({ type: "image", src: media })
                        }
                      />
                    )
                  )}

                {/* Premium message if more than 4 */}
                {((selectedArtist.photos?.length || 0) +
                  (selectedArtist.videos?.length || 0)) > 4 && (
                  <p className="premium-msg">✨ Buy premium to see more ✨</p>
                )}
              </div>

              {/* Artist details */}
              <div className="artist-info">
                <p><strong>Role:</strong> {selectedArtist.identity || selectedArtist.role}</p>
                <p><strong>Email:</strong> {selectedArtist.email}</p>
                <p><strong>Contact:</strong> {selectedArtist.contact || "N/A"}</p>
                <p><strong>Gender:</strong> {selectedArtist.gender || "N/A"}</p>
                <p><strong>DOB:</strong> {selectedArtist.dob ? new Date(selectedArtist.dob).toLocaleDateString() : "N/A"}</p>
                <p><strong>City:</strong> {selectedArtist.city || "N/A"}</p>
                <p><strong>State:</strong> {selectedArtist.state || "N/A"}</p>
                <p><strong>Country:</strong> {selectedArtist.country || "N/A"}</p>
                <p><strong>Language:</strong> {selectedArtist.language || "N/A"}</p>
                <p>{selectedArtist.description}</p>
              </div>
            </div>
          </div>
        )}

        {/* Floating Media Preview */}
        {previewMedia && (
          <div className="media-preview" onClick={() => setPreviewMedia(null)}>
            {previewMedia.type === "image" ? (
              <img src={previewMedia.src} alt="Preview" className="preview-content" />
            ) : (
              <video src={previewMedia.src} controls autoPlay className="preview-content" />
            )}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default ArtistsPage;
