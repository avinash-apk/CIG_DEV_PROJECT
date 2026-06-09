import React from 'react';
import { Calendar, Plus } from 'lucide-react';

const Events: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold mb-2">Events</h1>
            <p className="text-gray-400">Manage and explore upcoming events</p>
          </div>
          <button className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-500/20">
            <Plus size={20} />
            <span>Create Event</span>
          </button>
        </div>

        <div className="bg-gray-900/50 border border-gray-800 rounded-3xl p-12 text-center">
          <div className="bg-gray-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar size={40} className="text-indigo-500" />
          </div>
          <h2 className="text-2xl font-bold mb-3">No events yet</h2>
          <p className="text-gray-400 max-w-md mx-auto mb-8">
            Get started by creating your first event. You'll be able to manage albums and photos once an event is active.
          </p>
          <button className="text-indigo-500 hover:text-indigo-400 font-semibold underline decoration-2 underline-offset-4">
            View past events
          </button>
        </div>
      </div>
    </div>
  );
};

export default Events;
