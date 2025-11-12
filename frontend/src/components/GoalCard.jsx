import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Plus,
  Minus,
  Flame,
  Clock,
  Target,
  TrendingUp
} from 'lucide-react';
import clsx from 'clsx';

export default function GoalCard({ goal, onProgress }) {
  const [progressValue, setProgressValue] = useState(1);
  const [isUpdating, setIsUpdating] = useState(false);

  const progressPercentage = Math.min((goal.current_value / goal.target_value) * 100, 100);
  const isCompleted = goal.is_completed;
  const remaining = Math.max(goal.target_value - goal.current_value, 0);

  const handleAddProgress = async () => {
    if (progressValue <= 0 || isUpdating) return;
    
    setIsUpdating(true);
    try {
      await onProgress(goal.goal_id, progressValue);
      setProgressValue(1); // Reset to 1 after successful update
    } catch (error) {
      console.error('Failed to add progress:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-orange-200 bg-orange-50';
      case 'low': return 'border-green-200 bg-green-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getPriorityDot = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-orange-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={clsx(
        'card p-6 transition-all duration-200',
        isCompleted ? 'ring-2 ring-green-200 bg-green-50' : 'hover:shadow-lg'
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <div className={clsx('w-2 h-2 rounded-full', getPriorityDot(goal.priority))} />
            <h3 className={clsx(
              'font-semibold text-lg leading-tight',
              isCompleted ? 'text-green-800 line-through' : 'text-gray-900'
            )}>
              {goal.title}
            </h3>
          </div>
          
          {goal.description && (
            <p className="text-sm text-gray-600 mb-2">{goal.description}</p>
          )}
          
          <div className="flex items-center space-x-2">
            {goal.category_name && (
              <span 
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                style={{ 
                  backgroundColor: `${goal.category_color}20`,
                  color: goal.category_color 
                }}
              >
                <span className="mr-1">{goal.category_icon}</span>
                {goal.category_name}
              </span>
            )}
            
            {goal.streak_count > 0 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                <Flame className="h-3 w-3 mr-1" />
                {goal.streak_count} day streak
              </span>
            )}
          </div>
        </div>
        
        <div className="flex-shrink-0">
          {isCompleted ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </motion.div>
          ) : (
            <div className="relative w-12 h-12">
              <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="2"
                />
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke={goal.category_color || '#3b82f6'}
                  strokeWidth="2"
                  strokeDasharray={`${progressPercentage}, 100`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-medium text-gray-700">
                  {Math.round(progressPercentage)}%
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Progress Details */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">Progress</span>
          <span className="font-medium text-gray-900">
            {goal.current_value} / {goal.target_value}
            {goal.target_type === 'quantity' && remaining > 0 && (
              <span className="text-gray-500 ml-1">({remaining} left)</span>
            )}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="h-2 rounded-full bg-gradient-to-r"
            style={{
              background: isCompleted 
                ? 'linear-gradient(90deg, #22c55e, #16a34a)' 
                : `linear-gradient(90deg, ${goal.category_color || '#3b82f6'}, ${goal.category_color || '#2563eb'})`
            }}
          />
        </div>
      </div>

      {/* Carryover Info */}
      {goal.carried_over_from && (
        <div className="mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs text-yellow-800 flex items-center">
            <TrendingUp className="h-3 w-3 mr-1" />
            Carried over from {new Date(goal.carried_over_from).toLocaleDateString()}
          </p>
        </div>
      )}

      {/* Action Area */}
      {!isCompleted && (
        <div className="flex items-center space-x-2">
          <div className="flex items-center border rounded-lg">
            <button
              onClick={() => setProgressValue(Math.max(1, progressValue - 1))}
              disabled={progressValue <= 1}
              className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Minus className="h-4 w-4" />
            </button>
            <input
              type="number"
              min="1"
              max={remaining}
              value={progressValue}
              onChange={(e) => setProgressValue(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-16 py-2 px-2 text-center border-0 focus:ring-0 text-sm"
            />
            <button
              onClick={() => setProgressValue(Math.min(remaining, progressValue + 1))}
              disabled={progressValue >= remaining}
              className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddProgress}
            disabled={isUpdating || progressValue <= 0}
            className={clsx(
              'flex-1 btn-primary text-sm py-2 px-4 disabled:opacity-50 disabled:cursor-not-allowed',
              isUpdating && 'animate-pulse'
            )}
          >
            {isUpdating ? 'Adding...' : `Add ${progressValue}`}
          </motion.button>
        </div>
      )}
      
      {isCompleted && (
        <div className="text-center py-2">
          <span className="text-green-700 font-medium text-sm">
            🎉 Completed! Great job!
          </span>
        </div>
      )}
    </motion.div>
  );
}