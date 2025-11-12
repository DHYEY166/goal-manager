import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

export default function TestGoals() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Goals Test</h1>
          <p className="text-gray-600 mt-1">Testing basic functionality</p>
        </div>
        <button
          onClick={() => {
            console.log('Button clicked');
            alert('Button works!');
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Test Button
        </button>
      </div>

      <div className="p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Basic Test</h2>
        <p>If you can see this, the basic React component is working.</p>
        
        <button
          onClick={() => setShowModal(true)}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Test Modal Toggle
        </button>

        {showModal && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <p>Modal state is working!</p>
            <button
              onClick={() => setShowModal(false)}
              className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}