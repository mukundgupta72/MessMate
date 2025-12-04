import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Utensils } from 'lucide-react';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success('Login successful!');
      if (email.includes('admin')) navigate('/admin');
      else navigate('/student');
    } catch (error) {
      toast.error('Failed to login. Check credentials.');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-amber-50 to-orange-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-orange-100">
        <div className="flex flex-col items-center mb-8">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-4 rounded-full mb-4 shadow-lg">
                <Utensils className="text-white w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">MessMate</h1>
            <p className="text-gray-600">Sign in to manage your meals</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
              placeholder="student@messmate.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
              placeholder="••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg font-bold hover:from-orange-600 hover:to-orange-700 transition shadow-md hover:shadow-lg">
            Sign In
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-600">
          <p className="mb-2">Don't have an account? <Link to="/signup" className="text-orange-600 font-bold hover:text-orange-700 hover:underline">Sign Up</Link></p>
          <p className="text-gray-500">Demo: Use <b>admin@messmate.com</b> for Admin View</p>
        </div>
      </div>
    </div>
  );
}
