import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faUsers, faTruck, faHistory, faHome, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import './Styles/Homepage.css';
import Header from './Header';
import Footer from './Footer'

const HomePage = ({ onLogout }) => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <Header onLogout={onLogout} />
      <main className="main-content">
        <h2>Welcome to FF Manager</h2>
        <p>Manage Figure Fiesta effortlessly!</p>
        <div className="cards">
          <div className="card" onClick={() => navigate('/products')}>
            <FontAwesomeIcon icon={faBox} /> Add & Manage Products
          </div>
          <div className="card" onClick={() => navigate('/homepage')}>
            <FontAwesomeIcon icon={faHome} /> Manage eCommerce Homepage
          </div>
          <div className="card" onClick={() => navigate('/users')}>
            <FontAwesomeIcon icon={faUsers} /> Manage Users
          </div>
          <div className="card" onClick={() => navigate('/delivery')}>
            <FontAwesomeIcon icon={faTruck} /> Items for Delivery
          </div>
          <div className="card" onClick={() => navigate('/history')}>
            <FontAwesomeIcon icon={faHistory} /> Delivery History
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
