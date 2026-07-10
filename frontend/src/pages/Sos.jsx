import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, AlertTriangle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';

const Sos = () => {
  const navigate = useNavigate();
  const [triggered, setTriggered] = useState(false);
  const [loading, setLoading] = useState(false);
  const audioRef = useRef(null);

  const handleTrigger = () => {
    if (!navigator.geolocation) {
      toast.error('Location not supported on this device');
      return;
    }
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
    if (navigator.vibrate) {
      navigator.vibrate([500, 200, 500, 200, 500]);
    }
    setLoading(true);
   
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          await api.post('/sos', { latitude, longitude, address: 'Live location shared', note: 'Emergency triggered from app' });
          setTriggered(true);
          toast.success('SOS alert sent to your contacts!');
        } catch (err) {
          toast.error('Failed to send SOS. Try again.');
        } finally {
          setLoading(false);
          if (audioRef.current) {
            setTimeout(() => audioRef.current.pause(), 4000);
          }
        }
      },
      () => {
        toast.error('Please allow location access to send SOS');
        setLoading(false);
      }
    );
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-gradient-to-br from-shield-bg via-purple-50 to-pink-50 px-4 py-8">
      <audio ref={audioRef} src="/siren.mp3" />
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => navigate('/dashboard')} className="text-gray-500 hover:text-shield-purple">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold text-gray-800">Emergency SOS</h1>
        </div>

        {!triggered ? (
          <div className="bg-white rounded-3xl p-8 text-center shadow-xl shadow-purple-100 border border-purple-50">
            <p className="text-gray-500 mb-8">Tap the button below to instantly share your live location and alert all your emergency contacts.</p>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleTrigger}
              disabled={loading}
              animate={{ boxShadow: ['0 0 0 0 rgba(236,72,153,0.4)', '0 0 0 20px rgba(236,72,153,0)'] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-40 h-40 rounded-full bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center mx-auto disabled:opacity-60"
            >
              <div className="text-white text-center">
                <AlertTriangle className="w-10 h-10 mx-auto mb-1" />
                <span className="font-bold">{loading ? 'Sending...' : 'SOS'}</span>
              </div>
            </motion.button>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 text-center shadow-xl shadow-purple-100 border border-purple-50">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Alert Sent</h2>
            <p className="text-gray-500 mb-6">Your location has been shared with your emergency contacts via email.</p>
            <button onClick={() => setTriggered(false)}
              className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600">Send Another Alert</button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
export default Sos;