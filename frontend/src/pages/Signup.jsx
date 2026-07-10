import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Mail, Lock, User, Phone } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/signup', form);
      login(res.data.user, res.data.token);
      toast.success('Account created!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
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
          <p className="text-gray-500 mt-1">Create your safety account</p>
        </div>
        <div className="bg-white rounded-3xl shadow-xl shadow-purple-100 p-8 border border-purple-100">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input name="name" onChange={handleChange} required placeholder="Full name"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-shield-purple focus:ring-2 focus:ring-purple-100 outline-none" />
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input name="email" type="email" onChange={handleChange} required placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-shield-purple focus:ring-2 focus:ring-purple-100 outline-none" />
            </div>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input name="phone" onChange={handleChange} placeholder="Phone number"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-shield-purple focus:ring-2 focus:ring-purple-100 outline-none" />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input name="password" type="password" onChange={handleChange} required placeholder="Password"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-shield-purple focus:ring-2 focus:ring-purple-100 outline-none" />
            </div>
            <motion.button whileTap={{ scale: 0.97 }} type="submit" disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-shield-purple to-shield-pink text-white font-medium shadow-lg shadow-purple-200 disabled:opacity-50">
              {loading ? 'Creating account...' : 'Sign Up'}
            </motion.button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-shield-purple font-medium hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
};
export default Signup;