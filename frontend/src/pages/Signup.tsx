import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, UserCircle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Signup: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('VIEWER');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await api.post('/auth/signup', { email, password, role });
      const { token, user } = response.data;
      login(token, user);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center px-4">
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-2xl border border-gray-800 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-emerald-600 p-3 rounded-xl mb-4">
            <UserPlus size={32} />
          </div>
          <h1 className="text-3xl font-bold">Create Account</h1>
          <p className="text-gray-400 mt-2">Join our event platform</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="name@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">I am a...</label>
            <div className="relative">
              <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all appearance-none"
              >
                <option value="VIEWER">Viewer</option>
                <option value="CLUB_MEMBER">Club Member</option>
                <option value="PHOTOGRAPHER">Photographer</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition-colors shadow-lg shadow-emerald-500/20 mt-4"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-8 text-center text-gray-400 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-emerald-500 hover:text-emerald-400 font-medium">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
