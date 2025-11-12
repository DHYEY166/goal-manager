import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Goals API
export const goalsAPI = {
  // Get all goals
  getAll: () => api.get('/goals'),
  
  // Get today's goals
  getToday: () => api.get('/goals/today'),
  
  // Create new goal
  create: (goalData) => api.post('/goals', goalData),
  
  // Update goal
  update: (id, goalData) => api.put(`/goals/${id}`, goalData),
  
  // Delete goal
  delete: (id) => api.delete(`/goals/${id}`),
  
  // Add progress to goal
  addProgress: (goalId, progressData) => api.post(`/goals/${goalId}/progress`, progressData),
  
  // Get goal history
  getHistory: (goalId, limit = 30) => api.get(`/goals/${goalId}/history?limit=${limit}`),
};

// Categories API
export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  create: (categoryData) => api.post('/categories', categoryData),
  update: (id, categoryData) => api.put(`/categories/${id}`, categoryData),
  delete: (id) => api.delete(`/categories/${id}`),
};

// Analytics API
export const analyticsAPI = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getGoalAnalytics: (goalId, days = 30) => api.get(`/analytics/goal/${goalId}?days=${days}`),
  exportData: (type = 'all', startDate, endDate) => {
    const params = new URLSearchParams({ type });
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    return api.get(`/analytics/export?${params}`);
  },
};

// Users API
export const usersAPI = {
  getSettings: () => api.get('/users/settings'),
  updateSettings: (settings) => api.put('/users/settings', { settings }),
};

// Health check
export const healthAPI = {
  check: () => api.get('/health'),
};

export default api;