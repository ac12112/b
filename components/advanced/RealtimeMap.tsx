"use client";

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface EmergencyAlert {
  id: string;
  type: 'fire' | 'medical' | 'police' | 'traffic';
  location: string;
  coordinates: [number, number];
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  status: 'active' | 'responding' | 'resolved';
}

export default function RealtimeMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<EmergencyAlert | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Simulate real-time alerts
  useEffect(() => {
    const generateAlert = (): EmergencyAlert => ({
      id: Math.random().toString(36).substr(2, 9),
      type: ['fire', 'medical', 'police', 'traffic'][Math.floor(Math.random() * 4)] as any,
      location: ['Dhaka Central', 'Gulshan', 'Dhanmondi', 'Uttara', 'Mirpur'][Math.floor(Math.random() * 5)],
      coordinates: [
        23.8103 + (Math.random() - 0.5) * 0.1,
        90.4125 + (Math.random() - 0.5) * 0.1
      ],
      severity: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as any,
      timestamp: new Date(),
      status: 'active'
    });

    const interval = setInterval(() => {
      setAlerts(prev => {
        const newAlert = generateAlert();
        return [newAlert, ...prev.slice(0, 9)];
      });
    }, 8000);

    // Initial alerts
    setAlerts([generateAlert(), generateAlert(), generateAlert()]);

    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'fire':
        return <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" /></svg>;
      case 'medical':
        return <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm8 0a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V8z" clipRule="evenodd" /></svg>;
      case 'police':
        return <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>;
      case 'traffic':
        return <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>;
      default:
        return <div className="w-4 h-4 rounded-full bg-current" />;
    }
  };

  return (
    <div className="relative w-full h-96 rounded-2xl overflow-hidden border border-white/10 bg-zinc-900/50 backdrop-blur-xl">
      {/* Map Container */}
      <div ref={mapRef} className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900">
        {/* Simulated Map Grid */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="absolute border-l border-[#07D348]/20" style={{ left: `${i * 5}%`, height: '100%' }} />
          ))}
          {[...Array(12)].map((_, i) => (
            <div key={i} className="absolute border-t border-[#07D348]/20" style={{ top: `${i * 8.33}%`, width: '100%' }} />
          ))}
        </div>

        {/* Alert Markers */}
        <AnimatePresence>
          {alerts.map((alert, index) => (
            <motion.div
              key={alert.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute cursor-pointer"
              style={{
                left: `${20 + index * 15}%`,
                top: `${30 + (index % 3) * 20}%`,
              }}
              onClick={() => setSelectedAlert(alert)}
            >
              <div className={`relative p-2 rounded-full ${getSeverityColor(alert.severity)} shadow-lg`}>
                <div className="text-white">
                  {getTypeIcon(alert.type)}
                </div>
                <motion.div
                  className={`absolute inset-0 rounded-full ${getSeverityColor(alert.severity)} opacity-30`}
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Alert Details Panel */}
      <AnimatePresence>
        {selectedAlert && (
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            className="absolute top-4 right-4 w-72 bg-zinc-900/95 backdrop-blur-xl rounded-xl border border-white/10 p-4"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-white font-semibold capitalize">{selectedAlert.type} Alert</h3>
              <button
                onClick={() => setSelectedAlert(null)}
                className="text-zinc-400 hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-400">Location:</span>
                <span className="text-white">{selectedAlert.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Severity:</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(selectedAlert.severity)} text-white`}>
                  {selectedAlert.severity.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Status:</span>
                <span className="text-[#07D348] capitalize">{selectedAlert.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Time:</span>
                <span className="text-white">{selectedAlert.timestamp.toLocaleTimeString()}</span>
              </div>
            </div>

            <button className="w-full mt-4 bg-gradient-to-r from-[#07D348] to-[#24fe41] text-white py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
              View Details
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Live Indicator */}
      <div className="absolute top-4 left-4 flex items-center gap-2 bg-zinc-900/80 backdrop-blur-sm rounded-full px-3 py-1">
        <motion.div
          className="w-2 h-2 bg-red-500 rounded-full"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
        <span className="text-white text-xs font-medium">LIVE</span>
      </div>
    </div>
  );
}