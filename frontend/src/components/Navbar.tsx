import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Camera, LogOut, User as UserIcon, Bell } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gray-800 border-b border-gray-700 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold flex items-center gap-2">
          <Camera className="text-blue-500" />
          <span>EventMedia</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link to="/events" className="hover:text-blue-400">Events</Link>
          {user ? (
            <>
              <Link to="/my-photos" className="hover:text-blue-400">My Photos</Link>
              <button className="relative">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full w-4 h-4 flex items-center justify-center">0</span>
              </button>
              <div className="flex items-center gap-2">
                <UserIcon size={20} />
                <span>{user.email.split('@')[0]}</span>
              </div>
              <button onClick={logout} className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded flex items-center gap-1">
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
