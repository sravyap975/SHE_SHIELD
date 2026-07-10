import axios from 'axios';

// This is the base URL of your backend server (running locally for now)
const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Automatically attach the login token to every request, if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sheShieldToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;