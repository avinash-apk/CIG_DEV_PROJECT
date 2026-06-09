import React, { useEffect, useState, useMemo } from 'react';
import { Calendar, ChevronRight, Plus, SortAsc, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

interface Event {
  id: number;
  name: string;
  description: string;
  date: string;
  category: string;
}

const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'category'>('date');
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ name: '', description: '', date: '', category: '' });
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/events', newEvent);
      setShowModal(false);
      setNewEvent({ name: '', description: '', date: '', category: '' });
      fetchEvents();
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'category') return (a.category || '').localeCompare(b.category || '');
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [events, sortBy]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold">Events</h1>
          <p className="text-gray-400 mt-2">Discover and manage all club events</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 w-full md:w-auto">
            <SortAsc size={18} className="text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'date' | 'category')}
              className="bg-transparent border-none text-white focus:outline-none w-full appearance-none"
            >
              <option value="date" className="bg-gray-800">Sort by Date</option>
              <option value="name" className="bg-gray-800">Sort by Name</option>
              <option value="category" className="bg-gray-800">Sort by Category</option>
            </select>
          </div>
          {(user?.role === 'ADMIN' || user?.role === 'PHOTOGRAPHER' || user?.role === 'CLUB_MEMBER') && (
            <button 
              onClick={() => setShowModal(true)}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center justify-center gap-2 font-semibold w-full md:w-auto whitespace-nowrap"
            >
              <Plus size={20} /> Create Event
            </button>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl w-full max-w-md relative shadow-2xl">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-6">Create New Event</h2>
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Event Name</label>
                <input
                  type="text"
                  required
                  value={newEvent.name}
                  onChange={(e) => setNewEvent({...newEvent, name: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Annual Gala 2024"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
                <input
                  type="text"
                  value={newEvent.category}
                  onChange={(e) => setNewEvent({...newEvent, category: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Workshop, Party, Seminar"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                  placeholder="Tell us about the event..."
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-bold text-white transition-colors mt-2"
              >
                {submitting ? 'Creating...' : 'Create Event'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedEvents.length > 0 ? (
          sortedEvents.map((event) => (
            <Link 
              key={event.id} 
              to={`/events/${event.id}`}
              className="group bg-gray-800 border border-gray-700 rounded-xl overflow-hidden hover:border-blue-500 transition-all duration-300 shadow-lg"
            >
              <div className="h-48 bg-gray-700 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
                <div className="absolute bottom-4 left-4">
                  <span className="bg-blue-600 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
                    {event.category || 'General'}
                  </span>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold group-hover:text-blue-400 transition-colors">{event.name}</h3>
                <p className="text-gray-400 text-sm line-clamp-2">{event.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>{event.date ? new Date(event.date).toLocaleDateString() : 'TBA'}</span>
                  </div>
                </div>
                <div className="pt-2 flex justify-end">
                  <span className="text-blue-500 flex items-center gap-1 text-sm font-medium group-hover:translate-x-1 transition-transform">
                    View Albums <ChevronRight size={16} />
                  </span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-gray-800/50 rounded-2xl border border-dashed border-gray-700">
            <p className="text-gray-400">No events found. Start by creating one!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
