import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useGoalsContext } from '../contexts/GoalsContext';
import SimpleCreateGoalModal from '../components/SimpleCreateGoalModal';
import SimpleEditModal from '../components/SimpleEditModal';

export default function SimpleGoals() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [goalToEdit, setGoalToEdit] = useState(null);

  // Use Goals Context
  const { goals = [], loading = false, error = null, deleteGoal = () => {} } = useGoalsContext();
  console.log('Goals data:', { goalsCount: goals.length, loading, error });

  const handleEditGoal = (goal) => {
    setGoalToEdit(goal);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setGoalToEdit(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-4">Loading goals...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <h2 className="text-xl font-bold text-red-800 mb-2">Error Loading Goals</h2>
        <p className="text-red-600">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Reload Page
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Goals</h1>
          <p className="text-gray-600 mt-1">
            Manage and track all your goals in one place
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
        >
          <Plus className="h-5 w-5" />
          <span>New Goal</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="relative">
          <input
            type="text"
            placeholder="Search goals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="mt-4 text-sm text-gray-600">
          Showing {goals.length} goals
        </div>
      </div>

      {/* Goals List */}
      {goals.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-lg shadow">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            No goals created yet
          </h3>
          <p className="text-gray-500 mb-6">
            Create your first goal to start tracking your progress!
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
          >
            Create Your First Goal
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {goals.map((goal, index) => (
            <div key={goal.id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">{goal.title}</h3>
                  {goal.description && (
                    <p className="text-gray-600 text-sm mt-1">{goal.description}</p>
                  )}
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Target</p>
                      <p className="font-medium text-gray-900">{goal.target_value}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Type</p>
                      <p className="font-medium text-gray-900">{goal.type}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Priority</p>
                      <p className="font-medium text-gray-900">{goal.priority}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Status</p>
                      <p className="font-medium text-gray-900">{goal.is_active ? 'Active' : 'Inactive'}</p>
                    </div>
                  </div>
                </div>
                <div className="ml-4 flex space-x-2">
                  <button
                    onClick={() => handleEditGoal(goal)}
                    className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 text-sm rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to delete "${goal.title}"?`)) {
                        deleteGoal(goal.id);
                      }
                    }}
                    className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 text-sm rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Goal Modal */}
      <SimpleCreateGoalModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      {/* Edit Goal Modal */}
      <SimpleEditModal
        isOpen={showEditModal}
        onClose={handleCloseEditModal}
        goal={goalToEdit}
      />
    </div>
  );
}