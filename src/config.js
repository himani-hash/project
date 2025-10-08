// src/config.js
const BASE_URL = 'http://10.64.171.117:5000';  // Use your IP here

export const API_ENDPOINTS = {
  TEST: '/api/test',
  LOGIN: '/api/login',
  UNLOCK_DOOR: '/api/unlock-door',
  LOCK_DOOR: '/api/lock-door',
  ACCESS_LOGS: '/api/access-logs',
  ESP_COMMAND: '/api/esp8266/command',
  ESP_CONFIRM: '/api/esp8266/confirm'
};

export const getApiUrl = (endpoint) => {
  return `${BASE_URL}${endpoint}`;
};