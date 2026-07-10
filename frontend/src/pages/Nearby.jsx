import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Nearby = () => {
  const navigate = useNavigate();
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-gradient-to-br from-shield-bg via-purple-50 to-pink-50 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate('/dashboard')} className="text-gray-500 hover:text-shield-purple">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold text-gray-800">Nearby Help</h1>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-purple-50 text-gray-400 text-center">
          Map view coming soon — backend API is live and ready.
        </div>
      </div>
    </motion.div>
  );
};
export default Nearby;