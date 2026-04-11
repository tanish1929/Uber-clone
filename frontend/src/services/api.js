import axios from 'axios';

// Get API base URL from environment or use default
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    // Determine which token to use based on route
    let token;
    if (window.location.pathname.includes('/captain')) {
      token = localStorage.getItem('captainToken');
    } else {
      token = localStorage.getItem('token');
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('captainToken');
      window.location.href = '/login';
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error('Access forbidden');
    }

    // Handle 500 Server Error
    if (error.response?.status === 500) {
      console.error('Server error. Please try again later.');
    }

    return Promise.reject(error);
  }
);

// API endpoints
export const api = {
  // User endpoints
  user: {
    register: (data) => axiosInstance.post('/users/register', data),
    login: (data) => axiosInstance.post('/users/login', data),
    getProfile: () => axiosInstance.get('/users/profile'),
    updateProfile: (data) => axiosInstance.put('/users/profile', data),
    logout: () => axiosInstance.get('/users/logout'),
  },

  // Captain endpoints
  captain: {
    register: (data) => axiosInstance.post('/captains/register', data),
    login: (data) => axiosInstance.post('/captains/login', data),
    getProfile: () => axiosInstance.get('/captains/profile'),
    updateProfile: (data) => axiosInstance.put('/captains/profile', data),
    updateVehicle: (data) => axiosInstance.put('/captains/vehicle', data),
    logout: () => axiosInstance.get('/captains/logout'),
  },

  // Ride endpoints (to be implemented in backend)
  ride: {
    createRide: (data) => axiosInstance.post('/rides', data),
    getRides: () => axiosInstance.get('/rides'),
    getRideById: (id) => axiosInstance.get(`/rides/${id}`),
    acceptRide: (id) => axiosInstance.post(`/rides/${id}/accept`),
    completeRide: (id) => axiosInstance.post(`/rides/${id}/complete`),
    getRideHistory: () => axiosInstance.get('/rides/history'),
  },

  // Payment endpoints (to be implemented in backend)
  payment: {
    createPayment: (data) => axiosInstance.post('/payments', data),
    getPaymentHistory: () => axiosInstance.get('/payments/history'),
  },
};

export default axiosInstance;
