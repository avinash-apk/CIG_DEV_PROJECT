import React from 'react';
import { Heart, MessageCircle, Download, Star } from 'lucide-react';

interface Media {
  id: number;
  s3Url: string;
  type: 'PHOTO' | 'VIDEO';
}

interface MediaCardProps {
  media: Media;
  onLike?: () => void;
  onComment?: () => void;
  onFavorite?: () => void;
  onDownload?: () => void;
}

const MediaCard: React.FC<MediaCardProps> = ({ media, onLike, onComment, onFavorite, onDownload }) => {
  return (
    <div className="group relative bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:ring-2 hover:ring-blue-500 transition-all duration-300">
      <div className="aspect-square bg-gray-900 overflow-hidden">
        <img 
          src={media.s3Url} 
          alt="Event Media" 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4">
        <div className="flex justify-end gap-2">
          <button 
            onClick={onFavorite}
            className="bg-white/10 hover:bg-white/20 p-2 rounded-full backdrop-blur-md transition-colors"
          >
            <Star size={18} className="text-yellow-400" />
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex justify-around items-center">
            <button 
              onClick={onLike}
              className="flex flex-col items-center gap-1 hover:text-red-400 transition-colors"
            >
              <Heart size={24} />
              <span className="text-xs font-bold">0</span>
            </button>
            <button 
              onClick={onComment}
              className="flex flex-col items-center gap-1 hover:text-blue-400 transition-colors"
            >
              <MessageCircle size={24} />
              <span className="text-xs font-bold">0</span>
            </button>
            <button 
              onClick={onDownload}
              className="flex flex-col items-center gap-1 hover:text-green-400 transition-colors"
            >
              <Download size={24} />
              <span className="text-xs font-bold">Get</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaCard;
