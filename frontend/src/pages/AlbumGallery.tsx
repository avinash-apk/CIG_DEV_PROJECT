import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, Share2, Filter } from 'lucide-react';
import MediaCard from '../components/MediaCard';

const AlbumGallery: React.FC = () => {
  const { albumId } = useParams<{ albumId: string }>();

  // Mock data for the gallery
  const photos = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    imageUrl: `https://picsum.photos/seed/${i + 100}/800/800`,
    likes: Math.floor(Math.random() * 50),
    comments: Math.floor(Math.random() * 10),
  }));

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <Link to="/events" className="p-2 bg-gray-900 rounded-full hover:bg-gray-800 transition-colors border border-gray-800 text-gray-400 hover:text-white">
              <ArrowLeft size={24} />
            </Link>
            <div>
              <nav className="flex text-sm text-gray-500 mb-1">
                <Link to="/events" className="hover:text-indigo-400">Events</Link>
                <span className="mx-2">/</span>
                <span className="text-gray-400">Summer Gala 2023</span>
              </nav>
              <h1 className="text-3xl font-bold">Album: Candid Moments {albumId}</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 border border-gray-800 px-4 py-2.5 rounded-xl transition-all">
              <Filter size={20} className="text-gray-400" />
              <span>Filter</span>
            </button>
            <button className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 border border-gray-800 px-4 py-2.5 rounded-xl transition-all">
              <Share2 size={20} className="text-gray-400" />
              <span>Share</span>
            </button>
            <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-6 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-500/20">
              <Download size={20} />
              <span>Download All</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {photos.map((photo) => (
            <MediaCard 
              key={photo.id}
              imageUrl={photo.imageUrl}
              likes={photo.likes}
              comments={photo.comments}
            />
          ))}
        </div>
        
        {photos.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-gray-500 text-lg">No photos found in this album.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlbumGallery;
