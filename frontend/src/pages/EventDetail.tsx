import React from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Calendar, Users, Image as ImageIcon } from 'lucide-react';

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden mb-10">
          <div className="h-64 bg-gradient-to-r from-indigo-900 to-purple-900 relative">
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute bottom-8 left-8">
              <h1 className="text-5xl font-extrabold mb-4">Event Name Placeholder #{id}</h1>
              <div className="flex flex-wrap gap-6 text-gray-200">
                <div className="flex items-center gap-2">
                  <Calendar size={20} className="text-indigo-400" />
                  <span>October 24, 2023</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={20} className="text-indigo-400" />
                  <span>Downtown Club, NYC</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={20} className="text-indigo-400" />
                  <span>250+ Attendees</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-8 flex gap-8 border-t border-gray-800">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold transition-all">
              Join Event
            </button>
            <button className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-xl font-bold transition-all">
              View Albums
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <section className="bg-gray-900 p-8 rounded-3xl border border-gray-800">
              <h2 className="text-2xl font-bold mb-4">About the Event</h2>
              <p className="text-gray-400 leading-relaxed">
                This is a placeholder for the event description. Soon, you'll be able to see full details about the event, including the schedule, special guests, and more.
              </p>
            </section>
            
            <section>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Event Albums</h2>
                <button className="text-indigo-500 hover:text-indigo-400 font-semibold">View All</button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="group cursor-pointer">
                    <div className="aspect-[4/3] bg-gray-800 rounded-2xl mb-3 flex items-center justify-center border border-gray-700 group-hover:border-indigo-500 transition-all overflow-hidden relative">
                      <ImageIcon size={32} className="text-gray-600 group-hover:text-indigo-500 transition-all" />
                      <div className="absolute inset-0 bg-indigo-500/0 group-hover:bg-indigo-500/10 transition-all" />
                    </div>
                    <h3 className="font-semibold text-gray-200 group-hover:text-white">Main Album {i}</h3>
                    <p className="text-sm text-gray-500">42 Photos</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
          
          <aside className="space-y-8">
            <div className="bg-gray-900 p-8 rounded-3xl border border-gray-800">
              <h2 className="text-xl font-bold mb-4">Photographers</h2>
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700" />
                    <div>
                      <p className="font-medium">Pro Shooter {i}</p>
                      <p className="text-xs text-gray-500">Professional</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
