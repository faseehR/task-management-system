import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getInitials = () => {
    const name = user.name || 'Muhammad Ali';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <nav className="top-nav">
      <div className="nav-brand">
        <div className="brand-icon">TM</div>
        <span>Task Management</span>
      </div>
      
        <div className="nav-user">
          <div className="avatar">{getInitials()}</div>
          <div className="user-info">
            <span className="user-name">{user.name || 'Muhammad Ali'}</span>
            <span className="user-role">Administrator</span>
          
        </div>
        <button className="nav-icon-btn" style={{ color: '#ef4444' }} title="Logout" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i>
        </button>
      </div>
    </nav>
  );
};

export default Header;
