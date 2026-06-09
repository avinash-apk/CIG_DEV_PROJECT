import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Folder, ArrowLeft, Plus, Clock, Tag } from 'lucide-react';
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
  const { user } = useAuth();

  useEffect(() => {
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

    fetchEventData();
  }, [id]);

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!event) return <div className="text-center py-20 text-red-500">Event not found</div>;

  return (
    <div className="space-y-8">
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
          {(user?.role === 'ADMIN' || user?.role === 'PHOTOGRAPHER') && (
            <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl flex items-center gap-2 font-bold shadow-lg shadow-blue-500/20 whitespace-nowrap">
              <Plus size={20} /> Create Album
            </button>
          )}
        </div>
      </div>

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
