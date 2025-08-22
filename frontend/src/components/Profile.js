import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../styles/Profile.css";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

// Format date as dd-mm-yyyy
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date)) return dateString; // if it's not valid date, fallback
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const Profile = () => {
  // load user from localStorage (login stores the user with token)
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const token = storedUser?.token || null;

  // original server-backed data
  const [user, setUser] = useState(storedUser || {});
  // editable form state
  const [updatedUser, setUpdatedUser] = useState({ ...storedUser });

  // profile picture state
  const [profilePicPreview, setProfilePicPreview] = useState(
    storedUser.profilePic || null
  );
  const [profilePicFile, setProfilePicFile] = useState(null);

  // media gallery
  const [gallery, setGallery] = useState(() => {
    const imgs = (storedUser.photos || []).map((url, i) => ({
      id: `old-img-${i}`,
      url,
      type: "image",
      isNew: false,
    }));
    const vids = (storedUser.videos || []).map((url, i) => ({
      id: `old-vid-${i}`,
      url,
      type: "video",
      isNew: false,
    }));
    return [...imgs, ...vids];
  });

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sync updatedUser/profile preview when user changes externally
  useEffect(() => {
    setUpdatedUser({ ...user });
    setProfilePicPreview(user.profilePic || null);

    const imgs = (user.photos || []).map((url, i) => ({
      id: `old-img-${i}`,
      url,
      type: "image",
      isNew: false,
    }));
    const vids = (user.videos || []).map((url, i) => ({
      id: `old-vid-${i}`,
      url,
      type: "video",
      isNew: false,
    }));
    setGallery([...imgs, ...vids]);
  }, [user]);

  // Text inputs change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser((prev) => ({ ...prev, [name]: value }));
  };

  // Profile picture selection
  const handleProfilePicChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfilePicFile(file);
    setProfilePicPreview(URL.createObjectURL(file));
    setUpdatedUser((p) => ({ ...p, profilePic: URL.createObjectURL(file) }));
  };

  // Remove a gallery item locally
  const handleRemoveMedia = (id) => {
    setGallery((prev) => prev.filter((item) => item.id !== id));
  };

  // Cancel edits
  const handleCancel = () => {
    setUpdatedUser({ ...user });
    setProfilePicPreview(user.profilePic || null);
    setProfilePicFile(null);

    const imgs = (user.photos || []).map((url, i) => ({
      id: `old-img-${i}`,
      url,
      type: "image",
      isNew: false,
    }));
    const vids = (user.videos || []).map((url, i) => ({
      id: `old-vid-${i}`,
      url,
      type: "video",
      isNew: false,
    }));
    setGallery([...imgs, ...vids]);

    setEditing(false);
  };

  // Save updates
  const handleSave = async () => {
    if (!token) {
      alert("You must be logged in to update profile.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      // Append text fields (make sure role & identity included)
      const textFields = [
        "name",
        "email",
        "role",
        "identity",
        "description",
        "contact",
        "gender",
        "dob",
        "city",
        "state",
        "country",
        "language",
      ];
      textFields.forEach((f) => {
        if (updatedUser[f] !== undefined && updatedUser[f] !== null) {
          formData.append(f, updatedUser[f]);
        }
      });

      // Profile picture
      if (profilePicFile) {
        formData.append("profilePic", profilePicFile);
      }

      // Only new files
      const newFiles = gallery.filter((g) => g.isNew && g.file).map((g) => g.file);
      newFiles.forEach((file) => formData.append("files", file));

      // Request
      const res = await axios.put(`${API_BASE}/api/auth/profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res && res.data) {
        const updated = {
          ...res.data,
          token, // keep token
        };
        localStorage.setItem("user", JSON.stringify(updated));
        setUser(updated);
        setUpdatedUser({ ...updated });
        setProfilePicFile(null);
        setProfilePicPreview(updated.profilePic || null);

        // rebuild gallery
        const imgs = (updated.photos || []).map((url, i) => ({
          id: `old-img-${i}`,
          url,
          type: "image",
          isNew: false,
        }));
        const vids = (updated.videos || []).map((url, i) => ({
          id: `old-vid-${i}`,
          url,
          type: "video",
          isNew: false,
        }));
        setGallery([...imgs, ...vids]);

        setEditing(false);
        alert("Profile updated successfully.");
      } else {
        alert("Unexpected response from server while updating profile.");
      }
    } catch (err) {
      console.error("Profile update failed:", err.response || err.message);
      alert(err.response?.data?.message || "Failed to update profile. See console.");
    } finally {
      setLoading(false);
    }
  };

  // Fields to render
  // Fields to render
  const allFields = [
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Role", key: "role" },
    { label: "Identity", key: "identity" },
    { label: "Contact", key: "contact" },
    { label: "Gender", key: "gender" },
    { label: "DOB", key: "dob" },
    { label: "City", key: "city" },
    { label: "State", key: "state" },
    { label: "Country", key: "country" },
    { label: "Language", key: "language" },
    { label: "About", key: "description", textarea: true },
  ];

  // Recruiters: only show name, email, contact (role + identity are hidden)
  const fields =
    user.role === "recruiter"
      ? allFields.filter((f) => ["name", "email", "contact"].includes(f.key))
      : allFields;

  return (
    <>
      <Navbar />
      <div className="profile-container">
        <h2 className="profile-title">Your Profile</h2>

        {/* Profile picture */}
        <div className="profile-pic-section">
          <img
            src={profilePicPreview || "/default-avatar.png"}
            alt="Profile"
            className="profile-avatar-circle"
          />
          {editing && (
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePicChange}
              className="file-input"
            />
          )}
        </div>

        {/* Update buttons */}
        <div className="profile-actions">
          {editing ? (
            <>
              <button onClick={handleSave} className="save-btn" disabled={loading}>
                {loading ? "Updating..." : "Save"}
              </button>
              <button onClick={handleCancel} className="cancel-btn" disabled={loading}>
                Cancel
              </button>
            </>
          ) : (
            <button onClick={() => setEditing(true)} className="edit-btn">
              Update Profile
            </button>
          )}
        </div>

      {/* Info card */}
<div className="profile-info-card">
  <div className="profile-info-grid">
    {fields.map(({ label, key, textarea }) => (
      <div key={key} className="form-row">
        <label>{label}:</label>
        {editing ? (
          textarea ? (
            <textarea
              name={key}
              value={updatedUser[key] || ""}
              onChange={handleChange}
              rows="4"
              style={{
                resize: "vertical",
                overflowWrap: "break-word",
                whiteSpace: "pre-wrap",
              }}
              disabled={user.role === "recruiter" && ["role", "identity"].includes(key)}
            />
          ) : key === "dob" ? (
            <input
              type="date"
              name={key}
              value={updatedUser.dob ? updatedUser.dob.split("T")[0] : ""}
              onChange={handleChange}
            />
          ) : (
            <input
              type="text"
              name={key}
              value={updatedUser[key] || ""}
              onChange={handleChange}
              disabled={user.role === "recruiter" && ["role", "identity"].includes(key)}
            />
          )
        ) : key === "dob" ? (
          <p>{formatDate(updatedUser.dob)}</p>
        ) : (
          <p>{updatedUser[key] || "Not provided"}</p>
        )}
      </div>
    ))}
  </div>
</div>

        {/* Media section (hide for recruiters) */}
        {user.role !== "recruiter" && (
          <div className="media-section">
            <h3>Your Photos & Videos</h3>
            <div className="gallery">
              {gallery.length > 0 ? (
                gallery.map((media) => (
                  <div key={media.id} className="media-item">
                    {media.type === "image" ? (
                      <img src={media.url} alt={media.id} className="gallery-img" />
                    ) : (
                      <video src={media.url} controls className="gallery-video" />
                    )}
                    <button
                      className="remove-media-btn"
                      onClick={() => handleRemoveMedia(media.id)}
                      title="Remove this item locally"
                    >
                      ✕
                    </button>
                  </div>
                ))
              ) : (
                <p>No media uploaded yet.</p>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Profile;
