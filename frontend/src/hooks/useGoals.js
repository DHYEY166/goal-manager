import { useState, useEffect } from 'react';
import { goalsAPI } from '../services/api';
import toast from 'react-hot-toast';

export const useGoals = () => {
  const [goals, setGoals] = useState([]);
  const [todayGoals, setTodayGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all goals
  const fetchGoals = async () => {
    try {
      setLoading(true);
      const response = await goalsAPI.getAll();
      setGoals(response.data);
    } catch (err) {
      setError('Failed to fetch goals');
      toast.error('Failed to fetch goals');
    } finally {
      setLoading(false);
    }
  };

  // Fetch today's goals
  const fetchTodayGoals = async () => {
    try {
      const response = await goalsAPI.getToday();
      setTodayGoals(response.data);
    } catch (err) {
      toast.error('Failed to fetch today\'s goals');
    }
  };

  // Create new goal
  const createGoal = async (goalData) => {
    try {
      const response = await goalsAPI.create(goalData);
      setGoals(prev => [...prev, response.data]);
      await fetchTodayGoals(); // Refresh today's goals
      toast.success('Goal created successfully!');
      return response.data;
    } catch (err) {
      toast.error('Failed to create goal');
      throw err;
    }
  };

  // Update goal
  const updateGoal = async (id, goalData) => {
    try {
      const response = await goalsAPI.update(id, goalData);
      setGoals(prev => prev.map(goal => goal.id === id ? response.data : goal));
      await fetchTodayGoals(); // Refresh today's goals
      toast.success('Goal updated successfully!');
      return response.data;
    } catch (err) {
      toast.error('Failed to update goal');
      throw err;
    }
  };

  // Delete goal
  const deleteGoal = async (id) => {
    try {
      await goalsAPI.delete(id);
      setGoals(prev => prev.filter(goal => goal.id !== id));
      setTodayGoals(prev => prev.filter(goal => goal.goal_id !== id));
      toast.success('Goal deleted successfully!');
    } catch (err) {
      toast.error('Failed to delete goal');
      throw err;
    }
  };

  // Add progress to goal
  const addProgress = async (goalId, value, notes = '') => {
    try {
      const response = await goalsAPI.addProgress(goalId, { value, notes });
      setTodayGoals(prev => prev.map(goal => 
        goal.goal_id === goalId ? response.data : goal
      ));
      
      // Show celebration for completion
      if (response.data.is_completed && !todayGoals.find(g => g.goal_id === goalId)?.is_completed) {
        toast.success('🎉 Goal completed! Great job!');
      } else {
        toast.success('Progress added!');
      }
      
      return response.data;
    } catch (err) {
      toast.error('Failed to add progress');
      throw err;
    }
  };

  // Get goal history
  const getGoalHistory = async (goalId, limit = 30) => {
    try {
      const response = await goalsAPI.getHistory(goalId, limit);
      return response.data;
    } catch (err) {
      toast.error('Failed to fetch goal history');
      throw err;
    }
  };

  useEffect(() => {
    fetchGoals();
    fetchTodayGoals();
  }, []);

  return {
    goals,
    todayGoals,
    loading,
    error,
    fetchGoals,
    fetchTodayGoals,
    createGoal,
    updateGoal,
    deleteGoal,
    addProgress,
    getGoalHistory,
  };
};