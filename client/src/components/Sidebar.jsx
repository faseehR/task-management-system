import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { FaTachometerAlt, FaPlus, FaClipboardList, FaCalendarDay, FaCalendarAlt, FaSearch, FaExclamationCircle } from 'react-icons/fa';
import { getDashboardStats } from '../services/api';

const Sidebar = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [dueTodayCount, setDueTodayCount] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getDashboardStats();
        setDueTodayCount(res.data.data?.dueTodayUrgent || 0);
      } catch (err) {
        // Non-critical — sidebar just won't show the urgency badge
      }
    };
    fetchStats();
  }, []);

  const getInitials = () => {
    const name = user.name || 'Muhammad Ali';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const menuItems = [
    { icon: FaTachometerAlt, label: 'Dashboard', path: '/dashboard' },
    { icon: FaPlus, label: 'Create Task', path: '/create-task' },
    { icon: FaClipboardList, label: 'My Tasks', path: '/tasks' },
    { icon: FaCalendarDay, label: "Today's Tasks", path: '/tasks/today', urgent: dueTodayCount > 0 },
    { icon: FaCalendarAlt, label: 'Later Tasks', path: '/tasks/later' },
    
  ];

  return (
    <aside className="app-sidebar">
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <Icon />
              <span>{item.label}</span>
              {item.urgent && (
                <FaExclamationCircle
                  title={`${dueTodayCount} task${dueTodayCount > 1 ? 's' : ''} due today`}
                  style={{ color: '#ef4444', marginLeft: 'auto' }}
                />
              )}
            </NavLink>
          );
        })}
      </nav>
      <div className="sidebar-profile">
        <div className="avatar-sm">{getInitials()}</div>
        <div className="user-details">
          <div className="name">{user.name || 'Muhammad Ali'}</div>
          <div className="email">{user.email || 'muhammad@example.com'}</div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
