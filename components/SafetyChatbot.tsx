'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SafetyChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [reportType, setReportType] = useState<'anonymous' | 'verified' | null>(null);
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // System prompt for Bangladesh context
  const systemPrompt = `You are CivicGuard BD, the official AI assistant for Bangladesh's 999 emergency service extension. 
  Your capabilities:
  1. Explain 999 emergency protocols 
  2. Guide through verified (NID-based) or anonymous reporting
  3. Categorize incidents per Bangladesh context (road accidents, medical emergencies, etc.)
  4. Process media attachments for evidence analysis
  5. Provide real-time tracking of filed reports
  6. Detect and handle hate speech content
  7. Offer safety tips specific to Bangladeshi context
  8. Initiate emergency video calls with 999 operators
  Always:
  - Use Bengali numerals (৯৯৯) when mentioning emergency numbers
  - Refer to NID as জাতীয় পরিচয়পত্র
  - Prioritize connecting to live 999 operators for immediate emergencies
  - Use Dhaka time (BST) for timestamps
  - Mention Bangladesh Police, RAB, and other local authorities`;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startVideoCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true
      });
      
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.play().catch(console.error);
      }
      
      setIsVideoCallActive(true);
      addSystemMessage('ভিডিও কল শুরু হয়েছে। ৯৯৯ অপারেটরের সাথে সংযোগ করা হচ্ছে...');

      setTimeout(() => {
        addSystemMessage('অপারেটরের সাথে সংযুক্ত হয়েছে');
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream.clone();
          remoteVideoRef.current.play().catch(console.error);
        }
      }, 2000);

    } catch (error) {
      addSystemMessage('ভিডিও কল শুরু করতে ব্যর্থ: ক্যামেরা/মাইক্রোফোন এক্সেস অনুমতি প্রয়োজন');
      console.error('Error accessing media devices:', error);
    }
  };

  const endVideoCall = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    setIsVideoCallActive(false);
    addSystemMessage('ভিডিও কল সমাপ্ত হয়েছে');
  };

  const addSystemMessage = (content: string) => {
    setMessages(prev => [...prev, { role: 'system', content }]);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    if (inputMessage.includes('ভিডিও কল')) {
      startVideoCall();
      return;
    }

    setMessages(prev => [...prev, 
      { role: 'user', content: inputMessage },
      { role: 'assistant', content: 'প্রসেসিং...' }
    ]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: inputMessage,
          reportType,
          location: "BD"
        }),
      });

      const data = await response.json();
      
      setMessages(prev => [
        ...prev.slice(0, -1),
        { role: 'assistant', content: data.response }
      ]);

      if (data.reportTypePrompt) {
        setReportType(null);
      }

    } catch (error) {
      setMessages(prev => [
        ...prev.slice(0, -1),
        { role: 'assistant', content: '⚠️ সেবা অস্থায়ীভাবে অনুপলব্ধ। অনুগ্রহ করে ৯৯৯-এ সরাসরি কল করুন।' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    {
      title: "জরুরি রিপোর্ট করুন",
      prompt: "আমি একটি জরুরি ঘটনা রিপোর্ট করতে চাই"
    },
    {
      title: "ভিডিও কল শুরু করুন",
      prompt: "এখনই ৯৯৯ অপারেটরের সাথে ভিডিও কল সংযোগ করুন"
    },
    {
      title: "রিপোর্ট যাচাই করুন",
      prompt: "যাচাইকৃত রিপোর্টের জন্য NID যুক্ত করুন"
    },
    {
      title: "আমার লোকেশন শেয়ার করুন",
      prompt: "আমার বর্তমান অবস্থান ৯৯৯ সেবার সাথে শেয়ার করুন"
    }
  ];

  useEffect(() => {
    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [localStream]);

  
  return (
    <div className="fixed bottom-8 right-8 z-50 font-sans">
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="w-full max-w-[95vw] md:max-w-md lg:max-w-lg xl:max-w-xl rounded-2xl border-2 border-[#07D348]/20 bg-[#0a0a0a] shadow-2xl shadow-[#07D348]/20"
          >
            {/* Header */}
            <div className="p-4 border-b border-[#07D348]/30 bg-gradient-to-r from-[#07D348] to-[#24fe41] rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.div 
                    className="p-2 rounded-lg bg-white/10 backdrop-blur-sm"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                  >
                    <ShieldIcon className="h-6 w-6 text-[#d9ffe6]" />
                  </motion.div>
                  <div>
                    <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#d9ffe6]">
                      CivicGuard AI
                    </h3>
                    <p className="text-xs text-[#d9ffe6]/80">বাংলাদেশ জরুরি সেবা সহকারী</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={isVideoCallActive ? endVideoCall : startVideoCall}
                    className="p-2 rounded-lg bg-[#ff4d4d]/15 hover:bg-[#ff4d4d]/25 transition-colors"
                  >
                    {isVideoCallActive ? (
                      <VideoOffIcon className="h-5 w-5 text-[#ff9999]" />
                    ) : (
                      <VideoIcon className="h-5 w-5 text-[#d9ffe6]" />
                    )}
                  </button>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-[#d9ffe6]/10 rounded-lg transition-colors"
                  >
                    <XIcon className="h-5 w-5 text-[#d9ffe6]/80 hover:text-[#d9ffe6]" />
                  </button>
                </div>
              </div>
            </div>

            {/* Video Call Container */}
            {isVideoCallActive && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative h-40 md:h-64 bg-black"
              >
                <video
                  ref={remoteVideoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                />
                <div className="absolute bottom-2 right-2 w-16 h-20 md:w-24 md:h-32 rounded-lg border-2 border-[#07D348] overflow-hidden shadow-xl">
                  <video
                    ref={localVideoRef}
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                  />
                </div>
              </motion.div>
            )}

            {/* Chat Messages */}
            <div className="h-[50vh] md:h-[60vh] flex flex-col">
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#111111]">
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] p-3 ${
                      msg.role === 'user' 
                        ? 'rounded-t-2xl rounded-bl-2xl bg-[#333333] border border-[#07D348]/30' 
                        : 'rounded-t-2xl rounded-br-2xl bg-[#444444] border border-[#07D348]/30'
                    } shadow-md shadow-black/30`}>
                      <p className="text-sm md:text-base text-[#F0FFF7] leading-relaxed">
                        {msg.content.split('\n').map((line, idx) => (
                          <span key={idx}>{line}<br/></span>
                        ))}
                      </p>
                      <div className="mt-2 text-xs text-[#888888] flex items-center gap-1">
                        <span className="text-[0.7em]">●</span>
                        {msg.role === 'user' ? 'আপনি' : 'সিভিকগার্ড'}
                        <span className="text-[0.7em]">●</span>
                        <span className="text-[#666666]">{new Date().toLocaleTimeString('bn-BD', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Actions */}
              {messages.length === 0 && (
                <div className="px-4 pb-4 grid grid-cols-1 md:grid-cols-2 gap-2 border-t border-[#333333]">
                  {quickActions.map((action, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="p-3 text-left rounded-xl bg-[#333333] border border-[#444444] hover:border-[#07D348]/50 transition-all group"
                    >
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-[#07D348]/20 group-hover:bg-[#07D348]/30">
                          <ActionIcon index={i} />
                        </div>
                        <div>
                          <span className="text-sm text-[#d9ffe6]">{action.title}</span>
                          <p className="text-xs text-[#666666] mt-1">{action.prompt}</p>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Input Area */}
              <div className="px-4 pb-4 border-t border-[#333333] bg-[#0a0a0a]">
                <div className="relative">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="এখানে বার্তা টাইপ করুন..."
                    className="w-full pr-12 pl-4 py-3 rounded-xl bg-[#1a1a1a] border border-[#333333] text-[#d9ffe6] placeholder-[#666666] focus:outline-none focus:border-[#07D348] focus:ring-2 focus:ring-[#07D348]/20"
                    dir="auto"
                  />
                  <motion.button
                    onClick={handleSendMessage}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute right-2 top-2 p-2 hover:bg-[#07D348]/10 rounded-xl"
                  >
                    <SendIcon className="h-5 w-5 text-[#07D348]" />
                  </motion.button>
                </div>
                <p className="mt-2 text-xs text-center text-[#666666] flex items-center justify-center gap-2">
                  <ShieldCheckIcon className="w-4 h-4 text-[#07D348]" />
                  <span>বাংলাদেশ পুলিশের সাথে সমন্বিত • এন্ড-টু-এন্ড এনক্রিপ্টেড</span>
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            whileHover={{ scale: 1.1, rotate: [0, 10, -10, 0] }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-[#07D348] to-[#24fe41] shadow-lg hover:shadow-[#07D348]/40 transition-all"
          >
            <ShieldIcon className="h-6 w-6 text-white" />
            <span className="absolute -top-2 -right-2">
              <div className="relative">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="h-3 w-3 bg-[#ff4d4d] rounded-full absolute"
                />
                <div className="h-3 w-3 bg-[#ff4d4d]/30 rounded-full animate-ping" />
              </div>
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

// Icon Components
function ShieldIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6L6 18M6 6l12 12"/>
    </svg>
  );
}

function SendIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
    </svg>
  );
}

function VideoIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M23 7l-7 5 7 5V7z"/>
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
    </svg>
  );
}

function VideoOffIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M16 16v1a2 2 0 01-2 2H3a2 2 0 01-2-2V7a2 2 0 012-2h2m5.66 0H14a2 2 0 012 2v3.34l1 1L23 7v10M1 1l22 22"/>
    </svg>
  );
}

function ShieldCheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
    </svg>
  );
}
function ActionIcon({ index, className }: { index: number; className?: string }) {
  const icons = [
    <svg key={0} className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6 0h-4V4h4v2z"/></svg>,
    <VideoIcon key={1} className={className} />,
    <svg key={2} className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M23 12l-2.44-2.79.34-3.69-3.61-.82-1.89-3.2L12 2.96 8.6 1.5 6.71 4.69 3.1 5.5l.34 3.7L1 12l2.44 2.79-.34 3.7 3.61.82 1.89 3.2L12 22l3.4 1.46 1.89-3.2 3.61-.82-.34-3.69L23 12zm-12.91 4.72l-3.8-3.81 1.48-1.48 2.32 2.33 5.85-5.87 1.48 1.48-7.33 7.35z"/></svg>,
    <svg key={3} className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
  ];
  return icons[index];
}