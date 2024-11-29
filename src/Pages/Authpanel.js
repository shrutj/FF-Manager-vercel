import React, { useState } from 'react';
import './Styles/AuthPanel.css'; // Optional styles

const AuthPanel = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple validation: replace with your actual logic
    if (username === 'admin' && password === 'password') {
      onLogin();
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="auth-panel">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default AuthPanel;
