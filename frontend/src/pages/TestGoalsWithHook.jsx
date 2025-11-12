import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useGoals } from '../hooks/useGoals';

export default function TestGoalsWithHook() {
  console.log('TestGoalsWithHook rendering...');

  try {
    const { goals, loading, error } = useGoals();
    
    console.log('useGoals result:', { goals: goals?.length, loading, error });

    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="ml-4">Loading goals...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-xl font-semibold text-red-800">Error</h2>
          <p className="text-red-600">{error}</p>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Goals with Hook Test</h1>
            <p className="text-gray-600 mt-1">Testing useGoals hook functionality</p>
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Hook Results</h2>
          <p><strong>Goals found:</strong> {goals?.length || 0}</p>
          <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
          <p><strong>Error:</strong> {error || 'None'}</p>
          
          {goals && goals.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Goals:</h3>
              <ul className="space-y-1">
                {goals.slice(0, 3).map((goal, index) => (
                  <li key={goal.id || index} className="text-sm text-gray-600">
                    {goal.title || 'Untitled Goal'}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  } catch (hookError) {
    console.error('Error in useGoals hook:', hookError);
    
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <h2 className="text-xl font-semibold text-red-800">Hook Error</h2>
        <p className="text-red-600">Error with useGoals: {hookError.message}</p>
        <pre className="mt-2 text-xs text-red-500">{hookError.stack}</pre>
      </div>
    );
  }
}