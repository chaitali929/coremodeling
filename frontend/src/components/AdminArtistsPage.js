import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../styles/ArtistsPage.css";

const backendURL = "http://localhost:5000"; // still needed for API requests

const AdminArtistsPage = () => {
  const [artists, setArtists] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [previewMedia, setPreviewMedia] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

 useEffect(() => {
  const fetchArtists = async () => {
    try {
      const res = await fetch(`${backendURL}/api/artists`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      let data = await res.json();

      // 🔽 sort descending by createdAt (assuming backend sends createdAt)
      data = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setArtists(data);
    } catch (err) {
      console.error("Error fetching artists:", err);
    }
  };
  fetchArtists();
}, [user]);

  const handleStatusUpdate = async (artistId, status) => {
    try {
      const res = await fetch(`${backendURL}/api/artists/${artistId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update status");
      }

      const updatedArtist = await res.json();
      setArtists((prev) =>
        prev.map((a) => (a._id === artistId ? updatedArtist : a))
      );
    } catch (err) {
      console.error(`Error updating status for artist ${artistId}:`, err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="artists-page">
        <h1 className="page-title">Admin - Manage Artists</h1>
        <div className="artists-grid">
          {artists.length > 0 ? (
            artists.map((artist) => (
              <div
                className="artist-card"
                key={artist._id}
                onClick={() => setSelectedArtist(artist)}
              >
                {artist.photos?.length > 0 && (
                  <img
                    src={artist.photos[0]} // 👈 already a Cloudinary URL
                    alt={artist.name}
                    className="artist-photo"
                  />
                )}
                {artist.videos?.length > 0 && (
                  <video
                    className="artist-video"
                    controls
                    src={artist.videos[0]} // 👈 already a Cloudinary URL
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
                  <p><strong>Status:</strong> {artist.status || "pending"}</p>
                </div>

                <div className="status-buttons">
                  <button
                    className="approve-btn"
                    disabled={artist.status === "approved"}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusUpdate(artist._id, "approved");
                    }}
                  >
                    {artist.status === "approved" ? "Approved" : "Approve"}
                  </button>
                  <button
                    className="reject-btn"
                    disabled={artist.status === "rejected"}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusUpdate(artist._id, "rejected");
                    }}
                  >
                    {artist.status === "rejected" ? "Rejected" : "Reject"}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No artists found.</p>
          )}
        </div>

        {/* Modal */}
        {selectedArtist && (
          <div className="artist-modal">
            <div className="artist-modal-content">
              <button
                className="close-btn"
                onClick={() => setSelectedArtist(null)}
              >
                ✖
              </button>

              <h2>{selectedArtist.name}</h2>

              <div className="artist-photos-gallery">
                {selectedArtist.photos?.map((photo, idx) => (
                  <img
                    key={idx}
                    src={photo} // 👈 Cloudinary URL
                    alt={`${selectedArtist.name} ${idx}`}
                    className="artist-gallery-photo"
                    onClick={() =>
                      setPreviewMedia({ type: "image", src: photo })
                    }
                  />
                ))}

                {selectedArtist.videos?.map((video, idx) => (
                  <video
                    key={idx}
                    controls
                    className="artist-gallery-photo"
                    onClick={() =>
                      setPreviewMedia({ type: "video", src: video })
                    }
                  >
                    <source src={video} type="video/mp4" />
                  </video>
                ))}
              </div>

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
                <p><strong>Status:</strong> {selectedArtist.status || "pending"}</p>
              </div>
            </div>
          </div>
        )}

        {/* Preview Overlay */}
        {previewMedia && (
          <div className="media-preview" onClick={() => setPreviewMedia(null)}>
            {previewMedia.type === "image" ? (
              <img
                src={previewMedia.src}
                alt="Preview"
                className="preview-content"
              />
            ) : (
              <video
                src={previewMedia.src}
                controls
                autoPlay
                className="preview-content"
              />
            )}
          </div>
        )}

        <Footer />
      </div>
    </>
  );
};

export default AdminArtistsPage;
