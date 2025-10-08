import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'Dashboard.css';

const AdminDashboard = ({ user, onLogout }) => {
  const [accessLogs, setAccessLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [doorStatus, setDoorStatus] = useState('locked'); // Track door status

  useEffect(() => {
    fetchAccessLogs();
  }, []);

  const fetchAccessLogs = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/access-logs');
      setAccessLogs(response.data.logs);
    } catch (error) {
      console.error('Error fetching access logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const unlockDoor = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/unlock-door', {
        username: user.username,
        is_admin: true
      });
      
      if (response.data.success) {
        setDoorStatus('unlocked');
        alert('✅ ' + response.data.message);
        fetchAccessLogs();
        
        // Auto lock after 10 seconds
        setTimeout(() => {
          setDoorStatus('locked');
        }, 10000);
      }
    } catch (error) {
      alert('Error unlocking door: ' + (error.response?.data?.error || 'Unknown error'));
    }
  };

  // In your AdminDashboard component
const lockDoor = async () => {
  try {
    const response = await axios.post(getApiUrl(API_ENDPOINTS.LOCK_DOOR), {
      username: 'admin',
      is_admin: true
    });
    
    if (response.data.success) {
      setDoorStatus('locked');
      alert('Door locked successfully!');
    }
  } catch (error) {
    alert('Error locking door: ' + (error.response?.data?.error || 'Server error'));
  }
};
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <div>
          <span>Welcome, {user.username}</span>
          <button onClick={onLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="control-section">
          <h2>Door Control</h2>
          <div className="door-status">
            <div className={`status-indicator ${doorStatus === 'locked' ? 'locked' : 'unlocked'}`}>
              Door Status: {doorStatus === 'locked' ? '🔒 LOCKED' : '🔓 UNLOCKED'}
            </div>
          </div>
          <div className="control-buttons">
            <button onClick={unlockDoor} className="unlock-btn" disabled={doorStatus === 'unlocked'}>
              Unlock Door
            </button>
            <button onClick={lockDoor} className="lock-btn" disabled={doorStatus === 'locked'}>
              Lock Door
            </button>
          </div>
          <p className="auto-lock-notice">
            ⏰ Door will auto-lock after 10 seconds when unlocked
          </p>
        </div>

        <div className="logs-section">
          <h2>Access Logs</h2>
          {loading ? (
            <p>Loading logs...</p>
          ) : (
            <div className="logs-table">
              <table>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {accessLogs.map((log) => (
                    <tr key={log.id}>
                      <td>{log.username}</td>
                      <td>{new Date(log.access_time).toLocaleString()}</td>
                      <td className={`status ${log.status}`}>
                        {log.status}
                      </td>
                      <td>
                        {log.status.includes('unlock') || log.status === 'success' ? '🔓 Unlocked' : 
                         log.status.includes('lock') ? '🔒 Locked' : 
                         log.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
