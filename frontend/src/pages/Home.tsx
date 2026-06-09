import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="text-center py-20">
      <h1 className="text-5xl font-extrabold mb-6">Centralized Event & Media Management</h1>
      <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
        Organize, share, and discover event photos seamlessly with AI-powered tagging and facial recognition.
      </p>
      <div className="flex justify-center gap-4">
        <Link to="/events" className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg text-lg font-semibold">
          Explore Events
        </Link>
        <Link to="/signup" className="bg-gray-700 hover:bg-gray-600 px-8 py-3 rounded-lg text-lg font-semibold">
          Join Now
        </Link>
      </div>
    </div>
  );
};

export default Home;
