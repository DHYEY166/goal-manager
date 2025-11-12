import { useState, useEffect } from 'react';
import { analyticsAPI } from '../services/api';
import toast from 'react-hot-toast';

export const useAnalytics = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard analytics
  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await analyticsAPI.getDashboard();
      setDashboardData(response.data);
    } catch (err) {
      setError('Failed to fetch analytics');
      toast.error('Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };

  // Get goal-specific analytics
  const getGoalAnalytics = async (goalId, days = 30) => {
    try {
      const response = await analyticsAPI.getGoalAnalytics(goalId, days);
      return response.data;
    } catch (err) {
      toast.error('Failed to fetch goal analytics');
      throw err;
    }
  };

  // Export data
  const exportData = async (type = 'all', startDate, endDate) => {
    try {
      const response = await analyticsAPI.exportData(type, startDate, endDate);
      
      // Create download link
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `goal-manager-${type}-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Data exported successfully!');
    } catch (err) {
      toast.error('Failed to export data');
      throw err;
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return {
    dashboardData,
    loading,
    error,
    fetchDashboard,
    getGoalAnalytics,
    exportData,
  };
};