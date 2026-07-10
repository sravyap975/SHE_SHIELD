import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../utils/api';

const Report = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ incidentType: 'other', description: '' });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/reports', { ...form, isAnonymous: true });
      toast.success('Report submitted anonymously');
      setForm({ incidentType: 'other', description: '' });
    } catch (err) {
      toast.error('Failed to submit report');
    }
  };
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-gradient-to-br from-shield-bg via-purple-50 to-pink-50 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate('/dashboard')} className="text-gray-500 hover:text-shield-purple">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold text-gray-800">Report Incident</h1>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 space-y-4 border border-purple-50">
          <select value={form.incidentType} onChange={(e) => setForm({ ...form, incidentType: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 outline-none">
            <option value="harassment">Harassment</option>
            <option value="stalking">Stalking</option>
            <option value="unsafe_area">Unsafe Area</option>
            <option value="assault">Assault</option>
            <option value="suspicious_activity">Suspicious Activity</option>
            <option value="other">Other</option>
          </select>
          <textarea required rows={4} placeholder="Describe what happened (anonymous)" value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 outline-none" />
          <button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-shield-purple to-shield-pink text-white font-medium">
            Submit Anonymously
          </button>
        </form>
      </div>
    </motion.div>
  );
};
export default Report;