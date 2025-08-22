import React from "react";
import "../styles/style.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div>
          <h3>CoreModeling</h3>
          <p>Connecting talent with opportunities worldwide.</p>
        </div>
        <div>
          <h3>Quick Links</h3>
          <ul>
            <li>Artists</li>
            <li>Projects</li>
            <li>Blogs</li>
          </ul>
        </div>
        <div>
          <h3>Contact</h3>
          <p>Email: support@coremodeling.com</p>
          <p>Phone: +91 9876543210</p>
        </div>
      </div>
      <p className="footer-bottom">© 2025 CoreModeling. All Rights Reserved.</p>
    </footer>
  );
};

export default Footer;
