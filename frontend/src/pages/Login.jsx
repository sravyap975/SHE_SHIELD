import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data.user, response.data.token);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.4 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-shield-bg via-purple-50 to-pink-50 px-4">
      <div className="w-full max-w-md">
        <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-shield-purple to-shield-pink flex items-center justify-center shadow-lg shadow-purple-200">
            <Shield className="w-8 h-8 text-white" fill="white" />
          </div>
        </motion.div>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">She Shield</h1>
          <p className="text-gray-500 mt-1">Your Safety, One Tap Away</p>
        </div>
        <div className="bg-white rounded-3xl shadow-xl shadow-purple-100 p-8 border border-purple-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-1">Welcome Back</h2>
          <p className="text-gray-400 text-sm mb-6">Login to access your safety dashboard</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-shield-purple focus:ring-2 focus:ring-purple-100 outline-none" />
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 focus:border-shield-purple focus:ring-2 focus:ring-purple-100 outline-none" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <motion.button whileTap={{ scale: 0.97 }} type="submit" disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-shield-purple to-shield-pink text-white font-medium shadow-lg shadow-purple-200 disabled:opacity-50">
              {loading ? 'Logging in...' : 'Login'}
            </motion.button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-shield-purple font-medium hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
};
export default Login;