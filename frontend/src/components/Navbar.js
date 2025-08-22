import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/style.css";
import logo from "../images/logo.png";

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const handleProjectsClick = (e) => {
    e.preventDefault();
    if (!user) return navigate("/");
    switch (user.role) {
      case "artist":
        navigate("/projects");
        break;
      case "recruiter":
        navigate("/recruiterProjects");
        break;
      case "admin":
        navigate("/adminProjects");
        break;
      default:
        navigate("/");
    }
  };

  const handleBlogsClick = (e) => {
    e.preventDefault();
    if (!user) return navigate("/");
    if (user.role === "admin") navigate("/adminBlogs");
    else navigate("/blogs");
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <a href="/home">
          <img src={logo} alt="CoreModeling Logo" className="navbar-logo" />
        </a>
      </div>

      <div className="nav-center">
        <a href="/home">Home</a>
        <a href="/artists">Artists</a>
        <a href="/projects" onClick={handleProjectsClick}>
          Projects
        </a>
        <a href="/blogs" onClick={handleBlogsClick}>
          Blogs
        </a>
      </div>

      <div className="nav-right">
        {/* ✅ Show profile only if user exists and is NOT admin */}
        {user && user.role !== "admin" && (
          <div
            className="profile-container"
            onClick={() => navigate("/profile")} // 👈 redirect
            style={{ cursor: "pointer" }}
          >
            <img
              src={user.profilePic || "/default-avatar.png"}
              alt="Profile"
              className="profile-avatar"
            />
            <p className="profile-text">Your Profile</p>
          </div>
        )}

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
