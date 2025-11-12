import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Target, Plus } from 'lucide-react';
import { useGoals } from '../hooks/useGoals';
import { categoriesAPI } from '../services/api';
import toast from 'react-hot-toast';

const goalTypes = [
  { value: 'daily', label: 'Daily', description: 'Repeat every day' },
  { value: 'weekly', label: 'Weekly', description: 'Repeat every week' },
  { value: 'monthly', label: 'Monthly', description: 'Repeat every month' }
];

const priorities = [
  { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800' },
  { value: 'medium', label: 'Medium', color: 'bg-orange-100 text-orange-800' },
  { value: 'high', label: 'High', color: 'bg-red-100 text-red-800' }
];

export default function CreateGoalModal({ isOpen, onClose }) {
  const [categories, setCategories] = useState([]);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryData, setNewCategoryData] = useState({ name: '', color: '#3B82F6', icon: '🎯' });
  
  // Add error handling for useGoals hook
  let createGoal;
  try {
    const goalsHook = useGoals();
    createGoal = goalsHook.createGoal;
  } catch (error) {
    console.error('Error with useGoals hook:', error);
    createGoal = () => Promise.reject(new Error('Goals hook not available'));
  }
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    type: 'daily',
    target_type: 'quantity',
    target_value: 1,
    priority: 'medium',
    is_recurring: true,
    carryover_multiplier: 1.1,
    max_carryover_cap: 5
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data);
    } catch (error) {
      toast.error('Failed to fetch categories');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Goal title is required');
      return;
    }

    setIsSubmitting(true);
    try {
      await createGoal(formData);
      handleClose();
    } catch (error) {
      console.error('Failed to create goal:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      category_id: '',
      type: 'daily',
      target_type: 'quantity',
      target_value: 1,
      priority: 'medium',
      is_recurring: true,
      carryover_multiplier: 1.1,
      max_carryover_cap: 5
    });
    setShowNewCategory(false);
    setNewCategoryData({ name: '', color: '#3B82F6', icon: '🎯' });
    onClose();
  };

  const handleCreateCategory = async () => {
    if (!newCategoryData.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    try {
      const response = await categoriesAPI.create(newCategoryData);
      setCategories(prev => [...prev, response.data]);
      setFormData(prev => ({ ...prev, category_id: response.data.id }));
      setShowNewCategory(false);
      setNewCategoryData({ name: '', color: '#3B82F6', icon: '🎯' });
      toast.success('Category created successfully!');
    } catch (error) {
      toast.error('Failed to create category');
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog
          as={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClose={handleClose}
          className="fixed inset-0 z-50 overflow-y-auto"
        >
          <div className="flex min-h-screen items-center justify-center p-4">
            <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-50" />
            
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <Target className="h-5 w-5 text-primary-600" />
                  </div>
                  <Dialog.Title className="text-lg font-semibold text-gray-900">
                    Create New Goal
                  </Dialog.Title>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Goal Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Exercise for 30 minutes"
                    className="input-field"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Optional details about your goal..."
                    rows={2}
                    className="input-field"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  {!showNewCategory ? (
                    <div className="flex space-x-2">
                      <select
                        value={formData.category_id}
                        onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
                        className="input-field flex-1"
                      >
                        <option value="">Select a category</option>
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.icon} {category.name}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => setShowNewCategory(true)}
                        className="btn-secondary px-3"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={newCategoryData.name}
                          onChange={(e) => setNewCategoryData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Category name"
                          className="input-field flex-1"
                        />
                        <input
                          type="text"
                          value={newCategoryData.icon}
                          onChange={(e) => setNewCategoryData(prev => ({ ...prev, icon: e.target.value }))}
                          placeholder="🎯"
                          className="input-field w-16 text-center"
                        />
                        <input
                          type="color"
                          value={newCategoryData.color}
                          onChange={(e) => setNewCategoryData(prev => ({ ...prev, color: e.target.value }))}
                          className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                        />
                      </div>
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={handleCreateCategory}
                          className="btn-primary flex-1"
                        >
                          Create Category
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowNewCategory(false)}
                          className="btn-secondary"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Type and Target */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                      className="input-field"
                    >
                      {goalTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.target_value}
                      onChange={(e) => setFormData(prev => ({ ...prev, target_value: parseInt(e.target.value) || 1 }))}
                      className="input-field"
                    />
                  </div>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <div className="flex space-x-2">
                    {priorities.map(priority => (
                      <button
                        key={priority.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, priority: priority.value }))}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                          formData.priority === priority.value
                            ? priority.color
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {priority.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Advanced Settings */}
                {formData.type === 'daily' && (
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Advanced Settings</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Carryover Multiplier
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="2"
                          step="0.1"
                          value={formData.carryover_multiplier}
                          onChange={(e) => setFormData(prev => ({ ...prev, carryover_multiplier: parseFloat(e.target.value) || 1.1 }))}
                          className="input-field text-sm"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          How much to increase target when carrying over
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Max Carryover
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={formData.max_carryover_cap}
                          onChange={(e) => setFormData(prev => ({ ...prev, max_carryover_cap: parseInt(e.target.value) || 5 }))}
                          className="input-field text-sm"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Maximum additional amount
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !formData.title.trim()}
                    className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Creating...' : 'Create Goal'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
}