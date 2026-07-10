import { useState } from 'react';
import { ArrowLeft, Phone, ShieldAlert, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const NATIONAL_HELPLINES = [
  { name: 'Women Helpline (All India)', number: '181' },
  { name: 'Police Emergency', number: '100' },
  { name: 'National Emergency Number', number: '112' },
  { name: 'Domestic Violence Helpline', number: '181' },
  { name: 'Ambulance', number: '108' },
  { name: 'Child Helpline', number: '1098' },
];

const STATE_HELPLINES = {
  'Andhra Pradesh': [
    { name: 'AP Women Safety Wing', number: '181' },
    { name: 'Disha Helpline (AP)', number: '112' },
  ],
  'Telangana': [
    { name: 'Telangana Women Safety Wing', number: '181' },
    { name: 'SHE Teams', number: '181' },
  ],
  'Delhi': [
    { name: 'Delhi Commission for Women', number: '181' },
    { name: 'Delhi Police Women Helpline', number: '1091' },
  ],
  'Maharashtra': [
    { name: 'Maharashtra Women Helpline', number: '103' },
  ],
  'Karnataka': [
    { name: 'Karnataka Women Helpline', number: '181' },
  ],
  'Tamil Nadu': [
    { name: 'Tamil Nadu Women Helpline', number: '181' },
  ],
};

const SAFETY_TIPS = [
  { title: 'Night Travel', tips: ['Share your live location with a trusted contact', 'Prefer well-lit, populated routes', 'Keep your phone charged and easily accessible', 'Trust your instincts — leave if something feels wrong'] },
  { title: 'Public Transport', tips: ['Sit near the driver or in well-lit compartments', 'Avoid wearing headphones to stay alert', 'Keep emergency contacts one tap away', 'Note vehicle number and share with someone'] },
  { title: 'Online Safety', tips: ['Avoid sharing live location publicly on social media', 'Be cautious with new online contacts', 'Report suspicious accounts immediately', 'Keep personal details private on public profiles'] },
  { title: 'Workplace Safety', tips: ['Know your organization\'s harassment policy', 'Document any concerning incidents', 'Identify trusted colleagues or HR contacts', 'Don\'t hesitate to escalate concerns'] },
];

const SafetyResources = () => {
  const navigate = useNavigate();
  const [selectedState, setSelectedState] = useState('Andhra Pradesh');
  const [activeTab, setActiveTab] = useState('helplines');

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-gradient-to-br from-shield-bg via-purple-50 to-pink-50 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate('/dashboard')} className="text-gray-500 hover:text-shield-purple">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold text-gray-800">Safety Resources</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white p-1 rounded-xl border border-purple-50 w-fit">
          <button
            onClick={() => setActiveTab('helplines')}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition ${activeTab === 'helplines' ? 'bg-gradient-to-r from-shield-purple to-shield-pink text-white' : 'text-gray-500'}`}
          >
            <Phone className="w-4 h-4" /> Helplines
          </button>
          <button
            onClick={() => setActiveTab('tips')}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition ${activeTab === 'tips' ? 'bg-gradient-to-r from-shield-purple to-shield-pink text-white' : 'text-gray-500'}`}
          >
            <BookOpen className="w-4 h-4" /> Safety Tips
          </button>
        </div>

        {activeTab === 'helplines' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-sm font-semibold text-gray-500 mb-3 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-shield-pink" /> National Helplines
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {NATIONAL_HELPLINES.map((h, i) => (
                  <a key={i} href={`tel:${h.number}`} className="bg-white rounded-xl p-4 border border-purple-50 hover:border-shield-purple transition block">
                    <p className="text-sm text-gray-600">{h.name}</p>
                    <p className="text-lg font-bold text-shield-purple mt-1">{h.number}</p>
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-sm font-semibold text-gray-500 mb-3">State-wise Helplines</h2>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full mb-3 px-4 py-2.5 rounded-lg border border-gray-200 outline-none bg-white"
              >
                {Object.keys(STATE_HELPLINES).map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              <div className="grid grid-cols-2 gap-3">
                {STATE_HELPLINES[selectedState]?.map((h, i) => (
                  <a key={i} href={`tel:${h.number}`} className="bg-white rounded-xl p-4 border border-purple-50 hover:border-shield-purple transition block">
                    <p className="text-sm text-gray-600">{h.name}</p>
                    <p className="text-lg font-bold text-shield-purple mt-1">{h.number}</p>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tips' && (
          <div className="space-y-4">
            {SAFETY_TIPS.map((section, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-purple-50">
                <h3 className="font-semibold text-gray-800 mb-3">{section.title}</h3>
                <ul className="space-y-2">
                  {section.tips.map((tip, j) => (
                    <li key={j} className="text-sm text-gray-500 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-shield-pink mt-1.5 flex-shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SafetyResources;