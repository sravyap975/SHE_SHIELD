import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Trash2, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';

const Contacts = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState({ name: '', phone: '', relationship: '', email: '' });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchContacts = async () => {
    try {
      const res = await api.get('/contacts');
      setContacts(res.data);
    } catch (err) {
      toast.error('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { fetchContacts(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post('/contacts', form);
      toast.success('Contact added');
      setForm({ name: '', phone: '', relationship: '', email: '' });
      setShowForm(false);
      fetchContacts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add contact');
    }
  };
  const handleDelete = async (id) => {
    try {
      await api.delete(`/contacts/${id}`);
      toast.success('Contact removed');
      fetchContacts();
    } catch (err) {
      toast.error('Failed to delete contact');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-gradient-to-br from-shield-bg via-purple-50 to-pink-50 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate('/dashboard')} className="text-gray-500 hover:text-shield-purple">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold text-gray-800">Emergency Contacts</h1>
        </div>
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : (
          <div className="space-y-3 mb-6">
            {contacts.length === 0 && (
              <p className="text-gray-400 text-sm bg-white rounded-2xl p-6 text-center border border-purple-50">No contacts added yet.</p>
            )}
            {contacts.map((c) => (
              <motion.div key={c._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm border border-purple-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-shield-purple to-shield-pink flex items-center justify-center text-white font-medium">
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{c.name}</p>
                    <p className="text-sm text-gray-400">{c.relationship} • {c.phone}</p>
                  </div>
                </div>
                <button onClick={() => handleDelete(c._id)} className="text-gray-300 hover:text-red-500 transition">
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
        {contacts.length < 5 && !showForm && (
          <button onClick={() => setShowForm(true)}
            className="w-full py-3 rounded-xl border-2 border-dashed border-purple-200 text-shield-purple flex items-center justify-center gap-2 hover:bg-purple-50 transition">
            <Plus className="w-4 h-4" /> Add Contact
          </button>
        )}
        {showForm && (
          <motion.form initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleAdd}
            className="bg-white rounded-2xl p-5 space-y-3 border border-purple-100 shadow-sm">
            <input required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:border-shield-purple" />
            <input required placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:border-shield-purple" />
            <input placeholder="Email (for SOS alerts)" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:border-shield-purple" />
            <input placeholder="Relationship (e.g. Mother)" value={form.relationship} onChange={(e) => setForm({ ...form, relationship: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:border-shield-purple" />
            <div className="flex gap-2">
              <button type="submit" className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-shield-purple to-shield-pink text-white font-medium">Save</button>
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2.5 rounded-lg border border-gray-200 text-gray-500">Cancel</button>
            </div>
          </motion.form>
        )}
      </div>
    </motion.div>
  );
};
export default Contacts;