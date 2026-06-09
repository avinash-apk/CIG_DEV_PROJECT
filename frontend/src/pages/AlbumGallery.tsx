import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Upload, Grid, List as ListIcon, X } from 'lucide-react';
import api from '../services/api';
import MediaCard from '../components/MediaCard';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

interface Media {
  id: number;
  s3Url: string;
  s3Key: string;
  type: 'PHOTO' | 'VIDEO';
}

const AlbumGallery: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [mediaItems, setMediaItems] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchMedia();
  }, [id]);

  const fetchMedia = async () => {
    try {
      const response = await api.get(`/media/album/${id}`);
      setMediaItems(response.data);
    } catch (error) {
      console.error('Error fetching media:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        const urlRes = await api.post('/media/upload-url', {
          fileName: file.name,
          contentType: file.type,
          albumId: id
        });
        const { uploadUrl, key } = urlRes.data;

        await axios.create().put(uploadUrl, file, {
          headers: { 'Content-Type': file.type }
        });

        await api.post('/media/register', {
          albumId: id,
          s3Key: key,
          type: file.type.startsWith('video') ? 'VIDEO' : 'PHOTO'
        });
      }
      fetchMedia();
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please check console for details.');
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (media: Media) => {
    try {
      window.open(`http://localhost:5000/api/download/watermark?key=${media.s3Key}`, '_blank');
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  const handleLike = async (mediaId: number) => {
    try {
      await api.post('/social/like', { mediaId });
    } catch (error) {
      console.error('Like error:', error);
    }
  };

  const handleFavorite = async (mediaId: number) => {
    try {
      await api.post('/social/favorite', { mediaId });
    } catch (error) {
      console.error('Favorite error:', error);
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <Link to={`/events`} className="p-2 hover:bg-gray-800 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-3xl font-bold">Album Gallery</h1>
        </div>

        {(user?.role === 'ADMIN' || user?.role === 'PHOTOGRAPHER') && (
          <div className="flex gap-2">
            <input 
              type="file" 
              multiple 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleUpload}
              accept="image/*,video/*"
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 px-6 py-2 rounded-lg flex items-center gap-2 font-bold transition-colors"
            >
              <Upload size={20} /> {uploading ? 'Uploading...' : 'Upload Media'}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {mediaItems.map((media) => (
          <MediaCard 
            key={media.id} 
            media={media} 
            onDownload={() => handleDownload(media)}
            onLike={() => handleLike(media.id)}
            onFavorite={() => handleFavorite(media.id)}
          />
        ))}
        {mediaItems.length === 0 && (
          <div className="col-span-full py-20 text-center bg-gray-800/30 rounded-2xl border-2 border-dashed border-gray-700">
            <p className="text-gray-500">This album is empty. Be the first to upload!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlbumGallery;
