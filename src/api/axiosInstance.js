import axios from 'axios';

const api = axios.create({
  baseURL: 'dwp-store-production.up.railway.app', 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;