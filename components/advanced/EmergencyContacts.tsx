"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface EmergencyContact {
  id: string;
  name: string;
  number: string;
  type: 'police' | 'fire' | 'medical' | 'disaster' | 'utility';
  description: string;
  available24h: boolean;
  location?: string;
}

export default function EmergencyContacts() {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const emergencyContacts: EmergencyContact[] = [
    {
      id: '1',
      name: 'National Emergency Service',
      number: '999',
      type: 'police',
      description: 'Primary emergency hotline for all emergencies',
      available24h: true,
    },
    {
      id: '2',
      name: 'Fire Service & Civil Defence',
      number: '9555555',
      type: 'fire',
      description: 'Fire emergencies and rescue operations',
      available24h: true,
      location: 'Dhaka'
    },
    {
      id: '3',
      name: 'Dhaka Medical Emergency',
      number: '10921',
      type: 'medical',
      description: 'Medical emergency and ambulance service',
      available24h: true,
      location: 'Dhaka'
    },
    {
      id: '4',
      name: 'RAB Control Room',
      number: '8961105',
      type: 'police',
      description: 'Rapid Action Battalion emergency response',
      available24h: true,
    },
    {
      id: '5',
      name: 'Disaster Management',
      number: '1090',
      type: 'disaster',
      description: 'Natural disaster response and coordination',
      available24h: true,
    },
    {
      id: '6',
      name: 'Gas Emergency',
      number: '16430',
      type: 'utility',
      description: 'Gas leak and utility emergencies',
      available24h: true,
    },
    {
      id: '7',
      name: 'Electricity Emergency',
      number: '16123',
      type: 'utility',
      description: 'Power outage and electrical emergencies',
      available24h: true,
    },
    {
      id: '8',
      name: 'Water Emergency',
      number: '16162',
      type: 'utility',
      description: 'Water supply and sewerage emergencies',
      available24h: false,
    }
  ];

  const contactTypes = [
    { id: 'all', label: 'All Services', icon: '🏢' },
    { id: 'police', label: 'Police', icon: '👮' },
    { id: 'fire', label: 'Fire & Rescue', icon: '🚒' },
    { id: 'medical', label: 'Medical', icon: '🏥' },
    { id: 'disaster', label: 'Disaster', icon: '🌪️' },
    { id: 'utility', label: 'Utilities', icon: '⚡' },
  ];

  const filteredContacts = emergencyContacts.filter(contact => {
    const matchesType = selectedType === 'all' || contact.type === selectedType;
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'police': return 'from-blue-500 to-blue-600';
      case 'fire': return 'from-red-500 to-red-600';
      case 'medical': return 'from-green-500 to-green-600';
      case 'disaster': return 'from-orange-500 to-orange-600';
      case 'utility': return 'from-purple-500 to-purple-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const handleCall = (number: string, name: string) => {
    if (confirm(`Call ${name} at ${number}?`)) {
      window.open(`tel:${number}`);
    }
  };

  return (
    <div className="bg-zinc-900/50 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">Emergency Contacts</h2>
        <p className="text-zinc-400">Quick access to essential emergency services in Bangladesh</p>
      </div>

      {/* Search and Filter */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search emergency services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 pl-12 text-white focus:outline-none focus:border-[#07D348] transition-all"
          />
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="flex flex-wrap gap-2">
          {contactTypes.map((type) => (
            <motion.button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                selectedType === type.id
                  ? 'bg-gradient-to-r from-[#07D348] to-[#24fe41] text-white shadow-lg'
                  : 'bg-zinc-800/50 text-zinc-300 hover:bg-zinc-700/50'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>{type.icon}</span>
              <span className="text-sm">{type.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Emergency Contacts Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {filteredContacts.map((contact, index) => (
            <motion.div
              key={contact.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className="bg-zinc-800/50 rounded-xl border border-zinc-700 p-6 hover:border-[#07D348]/50 transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getTypeColor(contact.type)} flex items-center justify-center shadow-lg`}>
                  <span className="text-white font-bold text-lg">
                    {contact.name.charAt(0)}
                  </span>
                </div>
                
                {contact.available24h && (
                  <div className="flex items-center gap-1 bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs">
                    <motion.div
                      className="w-2 h-2 bg-green-400 rounded-full"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    24/7
                  </div>
                )}
              </div>

              <h3 className="text-white font-semibold mb-2 group-hover:text-[#07D348] transition-colors">
                {contact.name}
              </h3>
              
              <p className="text-zinc-400 text-sm mb-4 leading-relaxed">
                {contact.description}
              </p>

              {contact.location && (
                <div className="flex items-center gap-2 text-zinc-500 text-xs mb-4">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  {contact.location}
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="text-[#07D348] font-mono font-bold text-lg">
                  {contact.number}
                </div>
                
                <motion.button
                  onClick={() => handleCall(contact.number, contact.name)}
                  className="flex items-center gap-2 bg-gradient-to-r from-[#07D348] to-[#24fe41] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredContacts.length === 0 && (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-zinc-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="text-zinc-400">No emergency contacts found matching your search.</p>
        </div>
      )}

      {/* Emergency Banner */}
      <div className="mt-8 p-6 bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-xl">
        <div className="flex items-center gap-4">
          <motion.div
            className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </motion.div>
          <div>
            <h4 className="text-white font-semibold mb-1">Life-Threatening Emergency?</h4>
            <p className="text-zinc-300 text-sm">Call 999 immediately for fastest response</p>
          </div>
          <motion.button
            onClick={() => handleCall('999', 'Emergency Services')}
            className="ml-auto bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-bold transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            CALL 999
          </motion.button>
        </div>
      </div>
    </div>
  );
}