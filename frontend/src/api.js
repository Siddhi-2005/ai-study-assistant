import axios from 'axios';

// Create axios instance with backend base URL
const api = axios.create({
  baseURL: 'http://localhost:8000',
});

export default api;
