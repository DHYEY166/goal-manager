import React from 'react';

export default function MinimalGoals() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Goals Page</h1>
      <p>This is a minimal goals page to test if the component renders.</p>
      
      <button 
        onClick={() => alert('Button works!')}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Test Button
      </button>
    </div>
  );
}