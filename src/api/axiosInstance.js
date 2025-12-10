import axios from 'axios';

const api = axios.create({
  baseURL: 'https://dwp-store-production.up.railway.app', 
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, 
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const MAX_RETRIES = 3;
    
    if (!originalRequest._retryCount) {
      originalRequest._retryCount = 0;
    }

    if (
      originalRequest._retryCount < MAX_RETRIES &&
      (!error.response || error.response.status >= 500 || error.code === 'ECONNABORTED')
    ) {
      originalRequest._retryCount += 1;
      
      // MENGIRIM SINYAL KE UI
      const event = new CustomEvent('axios-retry', { 
        detail: { count: originalRequest._retryCount, max: MAX_RETRIES } 
      });
      window.dispatchEvent(event);

      await new Promise(resolve => setTimeout(resolve, 2000));
      return api(originalRequest);
    }

    return Promise.reject(error);
  }
);

export default api;