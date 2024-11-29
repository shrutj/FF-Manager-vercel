import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faUsers, faTruck, faHistory, faHome, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import './Styles/Header.css'; // Optional: create a separate CSS file for styling

const Header = ({ onLogout }) => {
  const navigate = useNavigate();

  return (
    <header className="header">
      <h1>FF Manager</h1>
      <nav>
        <ul>
          <li onClick={() => navigate('/home')}><FontAwesomeIcon icon={faHome} /> FF Home</li>
          <li onClick={() => navigate('/products')}><FontAwesomeIcon icon={faBox} /> Manage Products</li>
          <li onClick={() => navigate('/homepage')}><FontAwesomeIcon icon={faHome} /> Manage Homepage</li>
          <li onClick={() => navigate('/users')}><FontAwesomeIcon icon={faUsers} /> Manage Users</li>
          <li onClick={() => navigate('/delivery')}><FontAwesomeIcon icon={faTruck} /> Deliveries Pending</li>
          <li onClick={() => navigate('/history')}><FontAwesomeIcon icon={faHistory} /> Delivery History</li>
        </ul>
      </nav>
      <div className="profile-icon" onClick={onLogout}>
        <FontAwesomeIcon icon={faSignOutAlt} /> Logout
      </div>
    </header>
  );
};

export default Header;
