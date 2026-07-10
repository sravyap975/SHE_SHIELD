import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Contacts from './pages/Contacts';
import Sos from './pages/Sos';
import Nearby from './pages/Nearby';
import Report from './pages/Report';
import SafetyResources from './pages/SafetyResources';
import ProtectedRoute from './components/ProtectedRoute';


function App() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/contacts" element={<ProtectedRoute><Contacts /></ProtectedRoute>} />
        <Route path="/sos" element={<ProtectedRoute><Sos /></ProtectedRoute>} />
        <Route path="/nearby" element={<ProtectedRoute><Nearby /></ProtectedRoute>} />
        <Route path="/report" element={<ProtectedRoute><Report /></ProtectedRoute>} />
        <Route path="/resources" element={<ProtectedRoute><SafetyResources /></ProtectedRoute>} />
      </Routes>
    </AnimatePresence>
  );
}
export default App;