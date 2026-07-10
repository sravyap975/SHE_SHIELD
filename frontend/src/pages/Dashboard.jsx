import { motion } from 'framer-motion';
import { Shield, MapPin, AlertTriangle, LogOut, Users, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/login'); };
  const cards = [
    { icon: Users, title: 'Emergency Contacts', desc: 'Manage trusted contacts', color: 'from-purple-500 to-purple-600', path: '/contacts' },
    { icon: MapPin, title: 'Nearby Help', desc: 'Police, hospitals nearby', color: 'from-pink-500 to-pink-600', path: '/nearby' },
    { icon: AlertTriangle, title: 'Report Incident', desc: 'Anonymous reporting', color: 'from-fuchsia-500 to-fuchsia-600', path: '/report' },
    { icon: BookOpen, title: 'Safety Resources', desc: 'Helplines & safety tips', color: 'from-purple-600 to-pink-500', path: '/resources' },
  ];
  return (
    <div className="min-h-screen bg-gradient-to-br from-shield-bg via-purple-50 to-pink-50 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-shield-purple to-shield-pink flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" fill="white" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Hi, {user?.name?.split(' ')[0] || 'there'}</p>
              <h1 className="text-lg font-semibold text-gray-800">She Shield Dashboard</h1>
            </div>
          </div>
          <button onClick={handleLogout} className="text-gray-400 hover:text-shield-pink transition">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
        <motion.div whileTap={{ scale: 0.97 }} onClick={() => navigate('/sos')}
          className="bg-gradient-to-br from-red-500 to-pink-600 rounded-3xl p-8 text-center mb-8 shadow-xl shadow-pink-200 cursor-pointer">
          <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
            className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
            <AlertTriangle className="w-10 h-10 text-white" />
          </motion.div>
          <h2 className="text-white text-xl font-bold">SOS Emergency</h2>
          <p className="text-white/80 text-sm mt-1">Tap to alert your emergency contacts instantly</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card, i) => (
            <motion.div key={i} whileHover={{ y: -4 }} onClick={() => navigate(card.path)}
              className="bg-white rounded-2xl p-6 shadow-lg shadow-purple-100 border border-purple-50 cursor-pointer">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-3`}>
                <card.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800">{card.title}</h3>
              <p className="text-sm text-gray-400 mt-1">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Dashboard;