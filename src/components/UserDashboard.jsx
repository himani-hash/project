import React, { useState } from 'react';
import axios from 'axios';
import './dashboard.css';
import { getApiUrl, API_ENDPOINTS } from '../config';

const UserDashboard = ({ user, onLogout }) => {
  const [doorStatus, setDoorStatus] = useState('locked');

  const unlockDoor = async () => {
    try {
      const response = await axios.post(getApiUrl(API_ENDPOINTS.UNLOCK_DOOR), {
        username: user.username,
        is_admin: false
      });
      
      if (response.data.success) {
        setDoorStatus('unlocked');
        alert('✅ Door unlocked! It will auto-lock in 10 seconds.');
        
        setTimeout(() => {
          setDoorStatus('locked');
        }, 10000);
      }
    } catch (error) {
      alert('Error unlocking door: ' + (error.response?.data?.error || 'Unknown error'));
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {user?.username}!</h1>
        <button onClick={onLogout} className="logout-btn">Logout</button>
      </div>
      
      <div className="dashboard-content user-content">
        <div className="user-info">
          <h2>Door Access Control</h2>
          
          <div className="door-status">
            <div className={`status-indicator ${doorStatus === 'locked' ? 'locked' : 'unlocked'}`}>
              Door Status: {doorStatus === 'locked' ? '🔒 LOCKED' : '🔓 UNLOCKED'}
            </div>
          </div>
          
          <button 
            onClick={unlockDoor} 
            className="unlock-btn"
            disabled={doorStatus === 'unlocked'}
          >
            {doorStatus === 'unlocked' ? 'Door Unlocked' : 'Unlock Door'}
          </button>

          <p className="auto-lock-notice">
            ⏰ Door will automatically lock after 10 seconds
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;