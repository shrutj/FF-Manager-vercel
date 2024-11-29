import React from 'react';
import './Styles/Footer.css'; // Optional: create a separate CSS file for styling

const Footer = () => {
  return (
    <footer className="footer">
      <p style={{ margin: '10px'}}>&copy; 2024 Figure Fiesta | All rights reserved.</p>
      <a style={{ margin: '10px', color: 'white', textDecoration: 'none'}} href='tel: +916261967524'>Powered By - S.S. Friends and Company</a>
    </footer>
  );
};

export default Footer;
