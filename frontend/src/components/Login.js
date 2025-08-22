import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../styles/style.css";
import slide1 from "../images/slide1.jpg";
import slide2 from "../images/slide2.jpg";
import slide3 from "../images/slide3.jpg";
import Signup from "./Signup";
import logo from "../images/logo.png";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const slides = [slide1, slide2, slide3];

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [slides.length]);

  // Input change
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Submit login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", formData);

      if (res && res.data) {
        localStorage.setItem("user", JSON.stringify(res.data));
        navigate("/home");
      } else {
        alert("Unexpected response from server. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="landing-page">
      {/* Background Slideshow */}
      <div
        className="slideshow"
        style={{ backgroundImage: `url(${slides[currentSlide]})` }}
      ></div>

      {/* Navbar */}
      <nav className="auth-navbar">
        <div className="auth-logo">
          <div className="logo">
            <img src={logo} alt="CoreModeling Logo" className="navbar-logo" />
          </div>
        </div>
        <ul className="auth-nav-links center-nav">
          <li><Link to="/home">Home</Link></li>
          <li><span onClick={() => setShowLogin(true)}>Login</span></li>
          <li><span onClick={() => setShowSignup(true)}>Signup</span></li>
        </ul>
      </nav>

      {/* Hero Section */}
      <header className="hero-section">
        <h1>Welcome to CoreModeling</h1>
        <p>
          Connecting <strong>Artists</strong>, <strong>Recruiters</strong>, and <strong>Creators</strong> in one powerful platform.
        </p>
        <button onClick={() => setShowSignup(true)} className="explore-btn">
          Get Started
        </button>
      </header>

      {/* Floating Login Modal */}
      {showLogin && (
        <div className="modal-overlay" onClick={() => setShowLogin(false)}>
          <div className="container" onClick={(e) => e.stopPropagation()}>
            <h2>Login - CoreModeling</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
            <p
              onClick={() => {
                setShowLogin(false);
                setShowSignup(true);
              }}
              style={{ cursor: "pointer" }}
            >
              Don’t have an account? Signup here
            </p>
          </div>
        </div>
      )}

      {/* Floating Signup Modal */}
      {showSignup && (
        <div className="modal-overlay" onClick={() => setShowSignup(false)}>
          <div className="container" onClick={(e) => e.stopPropagation()}>
            <Signup />
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
