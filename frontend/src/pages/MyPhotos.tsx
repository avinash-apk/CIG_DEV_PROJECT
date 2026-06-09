import React, { useState } from 'react';
import { Camera, Upload, Sparkles, Search } from 'lucide-react';
import MediaCard from '../components/MediaCard';

const MyPhotos: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [hasResults, setHasResults] = useState(false);

  const handleSelfieUpload = () => {
    setIsUploading(true);
    // Mocking facial recognition search
    setTimeout(() => {
      setIsUploading(false);
      setHasResults(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-2">My Photos</h1>
          <p className="text-gray-400">Upload a selfie to find all photos of you across our events</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-1">
            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 sticky top-6">
              <div className="aspect-square bg-gray-800 rounded-2xl border-2 border-dashed border-gray-700 flex flex-col items-center justify-center mb-6 relative overflow-hidden group">
                <Camera size={48} className="text-gray-600 mb-4 group-hover:text-indigo-500 transition-colors" />
                <p className="text-gray-400 text-center px-6">
                  {isUploading ? 'Analyzing your features...' : 'Click or drag a clear selfie here'}
                </p>
                {isUploading && (
                  <div className="absolute inset-0 bg-indigo-600/20 flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
              
              <button 
                onClick={handleSelfieUpload}
                disabled={isUploading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-800 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-indigo-500/20"
              >
                <Upload size={20} />
                <span>Upload Selfie</span>
              </button>
              
              <div className="mt-8 space-y-4">
                <h3 className="font-semibold text-gray-300 flex items-center gap-2">
                  <Sparkles size={18} className="text-yellow-500" />
                  How it works
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Our AI uses facial recognition to scan through thousands of photos from all events you've attended to find your best moments.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            {!hasResults ? (
              <div className="h-[500px] flex flex-col items-center justify-center bg-gray-900/30 border border-gray-800 border-dashed rounded-3xl text-center px-10">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-6">
                  <Search size={30} className="text-gray-500" />
                </div>
                <h2 className="text-xl font-bold mb-2">No photos found yet</h2>
                <p className="text-gray-400 max-w-sm">
                  Upload a selfie to start searching. Once we find matches, they'll appear here in a beautiful gallery.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">We found 8 photos of you!</h2>
                  <select className="bg-gray-900 border border-gray-800 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-indigo-500">
                    <option>Recent first</option>
                    <option>Oldest first</option>
                  </select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <MediaCard 
                      key={i} 
                      imageUrl={`https://picsum.photos/seed/${i + 500}/800/800`}
                      likes={Math.floor(Math.random() * 20)}
                      comments={Math.floor(Math.random() * 5)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPhotos;
