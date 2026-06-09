import React from 'react';
import { Heart, MessageCircle, MoreVertical } from 'lucide-react';

interface MediaCardProps {
  imageUrl?: string;
  likes?: number;
  comments?: number;
  isPlaceholder?: boolean;
}

const MediaCard: React.FC<MediaCardProps> = ({ 
  imageUrl, 
  likes = 0, 
  comments = 0, 
  isPlaceholder = false 
}) => {
  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden shadow-lg border border-gray-800 transition-transform hover:scale-[1.02]">
      <div className="aspect-square relative bg-gray-800">
        {isPlaceholder ? (
          <div className="w-full h-full flex items-center justify-center text-gray-600">
            <span className="text-sm">No Image</span>
          </div>
        ) : (
          <img 
            src={imageUrl || 'https://via.placeholder.com/400'} 
            alt="Media content" 
            className="w-full h-full object-cover"
          />
        )}
        <button className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full text-white hover:bg-black/70">
          <MoreVertical size={18} />
        </button>
      </div>
      
      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-1 text-gray-400 hover:text-red-500 transition-colors">
            <Heart size={20} />
            <span className="text-sm font-medium">{likes}</span>
          </button>
          <button className="flex items-center space-x-1 text-gray-400 hover:text-blue-500 transition-colors">
            <MessageCircle size={20} />
            <span className="text-sm font-medium">{comments}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MediaCard;
