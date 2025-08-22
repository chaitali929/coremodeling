import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../styles/style.css";

const HomePage = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="homepage">
      <Navbar />

      {/* Hero Section */}
      <header className="hero">
        <h1>
          Welcome to <span>CoreModeling</span>
        </h1>
        <p>
          Connecting <strong>Artists</strong>, <strong>Recruiters</strong>, and{" "}
          <strong>Creators</strong> in one powerful platform.
        </p>
        <p className="user-greet">
          Hello, {user?.name} ({user?.identity || user?.role})
        </p>
        <button className="explore-btn">Explore Now</button>
      </header>

      {/* Features Section */}
      <section className="features">
        <div className="feature-card">
          <h2>🎭 For Artists</h2>
          <p>Showcase your talent and connect with top recruiters worldwide.</p>
        </div>
        <div className="feature-card">
          <h2>💼 For Recruiters</h2>
          <p>Discover passionate artists and build your dream team easily.</p>
        </div>
        <div className="feature-card">
          <h2>📰 Blogs & Updates</h2>
          <p>Stay inspired with the latest trends and success stories.</p>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <h3>1. Sign Up</h3>
            <p>Join as an Artist or Recruiter and create your profile.</p>
          </div>
          <div className="step">
            <h3>2. Connect</h3>
            <p>Artists showcase skills while recruiters post opportunities.</p>
          </div>
          <div className="step">
            <h3>3. Collaborate</h3>
            <p>Find the right match and build amazing projects together.</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <h2>What Our Users Say</h2>
        <div className="testimonial-cards">
          <div className="testimonial">
            <p>"CoreModeling helped me land my first modeling gig!"</p>
            <h4>- Ayesha, Model</h4>
          </div>
          <div className="testimonial">
            <p>"I found talented actors for my short film in days!"</p>
            <h4>- Raj, Recruiter</h4>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
