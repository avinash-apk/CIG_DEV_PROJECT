import React, { useState, useEffect, useRef } from 'react';
import { Camera, Search, User, RefreshCcw } from 'lucide-react';
import api from '../services/api';
import MediaCard from '../components/MediaCard';
import axios from 'axios';

interface Media {
  id: number;
  s3Url: string;
  s3Key: string;
  type: 'PHOTO' | 'VIDEO';
}

const MyPhotos: React.FC = () => {
  const [photos, setPhotos] = useState<Media[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [hasSelfie, setHasSelfie] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.selfieS3Key) {
      setHasSelfie(true);
      searchPhotos();
    }
  }, []);

  const searchPhotos = async () => {
    setLoading(true);
    try {
      const response = await api.get('/users/my-photos');
      setPhotos(response.data);
    } catch (error) {
      console.error('Error searching photos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelfieUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const urlRes = await api.post('/users/selfie-url', {
        fileName: file.name,
        contentType: file.type
      }).catch(err => {
        throw new Error(`Failed to get upload URL: ${err.response?.data?.message || err.message}`);
      });
      
      const { uploadUrl, key } = urlRes.data;

      // Use a clean axios instance without any global headers/interceptors
      await axios.create().put(uploadUrl, file, {
        headers: { 'Content-Type': file.type }
      }).catch(err => {
        throw new Error(`S3 Upload failed: ${err.message}. Check CORS and Region settings.`);
      });

      await api.post('/users/register-selfie', { s3Key: key }).catch(err => {
        throw new Error(`Failed to register selfie in database: ${err.response?.data?.message || err.message}`);
      });
      
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      user.selfieS3Key = key;
      localStorage.setItem('user', JSON.stringify(user));

      setHasSelfie(true);
      searchPhotos();
    } catch (error: any) {
      console.error('Selfie upload failed:', error);
      alert(error.message || 'Selfie upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-10">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
          Find Your Photos
        </h1>
        <p className="text-gray-400 max-w-xl mx-auto">
          Upload a clear selfie, and our AI will find every photo you appear in across all events.
        </p>
      </div>

      <div className="flex justify-center">
        <div className="bg-gray-800 p-8 rounded-3xl border border-gray-700 shadow-2xl flex flex-col items-center gap-6 max-w-md w-full">
          <div className="w-32 h-32 bg-gray-900 rounded-full flex items-center justify-center border-4 border-blue-500/30 overflow-hidden">
            {hasSelfie ? (
              <User size={64} className="text-blue-500" />
            ) : (
              <Camera size={64} className="text-gray-700" />
            )}
          </div>
          
          <input 
            type="file" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleSelfieUpload}
            accept="image/*"
          />
          
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
          >
            {uploading ? (
              <RefreshCcw className="animate-spin" size={20} />
            ) : (
              <Camera size={20} />
            )}
            {hasSelfie ? 'Update Reference Selfie' : 'Upload Selfie to Start'}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-gray-800 pb-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Search className="text-blue-500" /> Results ({photos.length})
          </h2>
          {hasSelfie && (
            <button 
              onClick={searchPhotos}
              className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              <RefreshCcw size={14} /> Refresh Search
            </button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-800 animate-pulse rounded-xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {photos.map((photo) => (
              <MediaCard key={photo.id} media={photo} />
            ))}
            {hasSelfie && photos.length === 0 && (
              <div className="col-span-full py-20 text-center bg-gray-800/30 rounded-2xl border-2 border-dashed border-gray-700">
                <p className="text-gray-500">No photos found yet. We'll notify you when a match is found!</p>
              </div>
            )}
            {!hasSelfie && (
              <div className="col-span-full py-20 text-center bg-gray-800/30 rounded-2xl border-2 border-dashed border-gray-700">
                <p className="text-gray-500">Upload a selfie above to discover your photos.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPhotos;
