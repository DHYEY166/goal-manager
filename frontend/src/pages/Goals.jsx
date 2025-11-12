import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Edit2, Trash2, MoreVertical } from 'lucide-react';
import { useGoalsContext } from '../contexts/GoalsContext';
import SimpleCreateGoalModal from '../components/SimpleCreateGoalModal';
import SimpleEditModal from '../components/SimpleEditModal';
import { Menu } from '@headlessui/react';
import clsx from 'clsx';

export default function Goals() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [goalToEdit, setGoalToEdit] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  
  const { goals, loading, updateGoal, deleteGoal } = useGoalsContext();

  const handleEditGoal = (goal) => {
    setGoalToEdit(goal);
    setShowEditModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setGoalToEdit(null);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setGoalToEdit(null);
  };

  // Filter and search goals
  const filteredGoals = goals.filter(goal => {
    const matchesSearch = goal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         goal.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         goal.category_name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === 'all' || goal.type === filterType;
    const matchesPriority = filterPriority === 'all' || goal.priority === filterPriority;
    
    return matchesSearch && matchesType && matchesPriority;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Goals</h1>
          <p className="text-gray-600 mt-1">
            Manage and track all your goals in one place
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>New Goal</span>
        </motion.button>
      </div>

      {/* Filters and Search */}
      <div className="card p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search goals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="input-field lg:w-40"
          >
            <option value="all">All Types</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>

          {/* Priority Filter */}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="input-field lg:w-40"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>

        {/* Results count */}
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredGoals.length} of {goals.length} goals
        </div>
      </div>

      {/* Goals List */}
      {filteredGoals.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card p-12 text-center"
        >
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            {searchQuery || filterType !== 'all' || filterPriority !== 'all'
              ? 'No goals match your filters'
              : 'No goals created yet'
            }
          </h3>
          <p className="text-gray-500 mb-6">
            {searchQuery || filterType !== 'all' || filterPriority !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Create your first goal to start tracking your progress!'
            }
          </p>
          {!searchQuery && filterType === 'all' && filterPriority === 'all' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary"
            >
              Create Your First Goal
            </button>
          )}
        </motion.div>
      ) : (
        <div className="grid gap-4">
          {filteredGoals.map((goal, index) => (
            <GoalItem
              key={goal.id}
              goal={goal}
              index={index}
              onEdit={handleEditGoal}
              onDelete={deleteGoal}
              onToggleActive={updateGoal}
            />
          ))}
        </div>
      )}

      {/* Create Goal Modal */}
      <SimpleCreateGoalModal
        isOpen={showCreateModal}
        onClose={handleCloseModal}
      />

      {/* Edit Goal Modal */}
      <SimpleEditModal
        isOpen={showEditModal}
        onClose={handleCloseEditModal}
        goal={goalToEdit}
      />
    </motion.div>
  );
}

function GoalItem({ goal, index, onEdit, onDelete, onToggleActive }) {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'daily': return '📅';
      case 'weekly': return '📊';
      case 'monthly': return '🗓️';
      default: return '🎯';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={clsx(
        'card p-6 transition-all duration-200',
        !goal.is_active && 'opacity-60 bg-gray-50'
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <span className="text-2xl">{getTypeIcon(goal.type)}</span>
            <div>
              <h3 className={clsx(
                'text-xl font-semibold',
                goal.is_active ? 'text-gray-900' : 'text-gray-500 line-through'
              )}>
                {goal.title}
              </h3>
              {goal.description && (
                <p className="text-gray-600 text-sm mt-1">{goal.description}</p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(goal.priority)}`}>
              {goal.priority} priority
            </span>
            
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
              {goal.type}ly
            </span>

            {goal.category_name && (
              <span 
                className="px-2 py-1 rounded-full text-xs font-medium"
                style={{ 
                  backgroundColor: `${goal.category_color}20`,
                  color: goal.category_color 
                }}
              >
                {goal.category_icon} {goal.category_name}
              </span>
            )}

            {goal.streak_count > 0 && (
              <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                🔥 {goal.streak_count} day streak
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Target</p>
              <p className="font-medium text-gray-900">{goal.target_value}</p>
            </div>
            <div>
              <p className="text-gray-500">Completions</p>
              <p className="font-medium text-gray-900">{goal.total_completions}</p>
            </div>
            <div>
              <p className="text-gray-500">Current Streak</p>
              <p className="font-medium text-gray-900">{goal.streak_count} days</p>
            </div>
            <div>
              <p className="text-gray-500">Best Streak</p>
              <p className="font-medium text-gray-900">{goal.longest_streak} days</p>
            </div>
          </div>
        </div>

        {/* Actions Menu */}
        <Menu as="div" className="relative">
          <Menu.Button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
            <MoreVertical className="h-5 w-5" />
          </Menu.Button>
          
          <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => onEdit(goal)}
                    className={clsx(
                      'flex items-center px-4 py-2 text-sm w-full text-left',
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    )}
                  >
                    <Edit2 className="h-4 w-4 mr-3" />
                    Edit Goal
                  </button>
                )}
              </Menu.Item>
              
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => onToggleActive(goal.id, { ...goal, is_active: !goal.is_active })}
                    className={clsx(
                      'flex items-center px-4 py-2 text-sm w-full text-left',
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    )}
                  >
                    {goal.is_active ? '⏸️' : '▶️'}
                    <span className="ml-3">{goal.is_active ? 'Pause Goal' : 'Activate Goal'}</span>
                  </button>
                )}
              </Menu.Item>
              
              <div className="border-t border-gray-100 my-1"></div>
              
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this goal? This action cannot be undone.')) {
                        onDelete(goal.id);
                      }
                    }}
                    className={clsx(
                      'flex items-center px-4 py-2 text-sm w-full text-left',
                      active ? 'bg-red-50 text-red-700' : 'text-red-600'
                    )}
                  >
                    <Trash2 className="h-4 w-4 mr-3" />
                    Delete Goal
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Menu>
      </div>
    </motion.div>
  );
}