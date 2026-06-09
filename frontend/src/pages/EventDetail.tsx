import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Folder, ArrowLeft, Plus, Clock, Tag, X } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

interface Event {
  id: number;
  name: string;
  description: string;
  date: string;
  category: string;
}

interface Album {
  id: number;
  name: string;
  visibility: string;
}

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newAlbum, setNewAlbum] = useState({ name: '', visibility: 'PUBLIC' });
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  const fetchEventData = async () => {
    try {
      const [eventRes, albumsRes] = await Promise.all([
        api.get(`/events/${id}`),
        api.get(`/events/${id}/albums`)
      ]);
      setEvent(eventRes.data);
      setAlbums(albumsRes.data);
    } catch (error) {
      console.error('Error fetching event data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventData();
  }, [id]);

  const handleCreateAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/events/albums', {
        ...newAlbum,
        eventId: parseInt(id as string)
      });
      setShowModal(false);
      setNewAlbum({ name: '', visibility: 'PUBLIC' });
      fetchEventData();
    } catch (error) {
      console.error('Error creating album:', error);
      alert('Failed to create album. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!event) return <div className="text-center py-20 text-red-500">Event not found</div>;

  return (
    <div className="space-y-8 relative">
      <Link to="/events" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
        <ArrowLeft size={20} /> Back to Events
      </Link>

      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold text-white">{event.name}</h1>
            <div className="flex flex-wrap gap-4 text-sm">
              <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full border border-blue-500/30 flex items-center gap-2">
                <Tag size={14} /> {event.category || 'General'}
              </span>
              <span className="text-gray-400 flex items-center gap-2">
                <Clock size={16} /> {event.date ? new Date(event.date).toLocaleDateString() : 'TBA'}
              </span>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed max-w-3xl">
              {event.description || 'No description provided for this event.'}
            </p>
          </div>
          {(user?.role === 'ADMIN' || user?.role === 'PHOTOGRAPHER' || user?.role === 'CLUB_MEMBER') && (
            <button 
              onClick={() => setShowModal(true)}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl flex items-center gap-2 font-bold shadow-lg shadow-blue-500/20 whitespace-nowrap"
            >
              <Plus size={20} /> Create Album
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
            <h2 className="text-2xl font-bold mb-6">Create New Album</h2>
            <form onSubmit={handleCreateAlbum} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Album Name</label>
                <input
                  type="text"
                  required
                  value={newAlbum.name}
                  onChange={(e) => setNewAlbum({...newAlbum, name: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Highlights, Ceremony"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Visibility</label>
                <select
                  value={newAlbum.visibility}
                  onChange={(e) => setNewAlbum({...newAlbum, visibility: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                >
                  <option value="PUBLIC">Public</option>
                  <option value="PRIVATE">Private</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-bold text-white transition-colors mt-2"
              >
                {submitting ? 'Creating...' : 'Create Album'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Folder className="text-blue-500" /> Event Albums
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {albums.length > 0 ? (
            albums.map((album) => (
              <Link 
                key={album.id} 
                to={`/albums/${album.id}`}
                className="group bg-gray-900 border border-gray-800 p-6 rounded-xl hover:bg-gray-800 hover:border-blue-500 transition-all duration-300 flex flex-col items-center text-center gap-4 shadow-lg"
              >
                <div className="bg-blue-600/10 p-4 rounded-full group-hover:scale-110 transition-transform">
                  <Folder size={40} className="text-blue-500" />
                </div>
                <div>
                  <h4 className="font-bold text-lg group-hover:text-blue-400 transition-colors">{album.name}</h4>
                  <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">{album.visibility}</p>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-12 text-center bg-gray-800/30 rounded-xl border border-dashed border-gray-700">
              <p className="text-gray-500">No albums created yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
