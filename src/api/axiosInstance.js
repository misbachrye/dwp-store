import axios from 'axios';

const api = axios.create({
  baseURL: 'https://2cd81fd9-4343-42cb-ab12-5919b1f3e80b-00-30b0krpryfp34.pike.replit.dev', 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;