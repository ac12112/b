"use client";

import { motion, useInView } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface GridItem {
  id: number;
  title: string;
  description: string;
  icon: JSX.Element;
  image: string;
  category: string;
  stats?: {
    value: string;
    label: string;
  };
  gradient: string;
}

export default function StunningGrid() {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const gridRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(gridRef, { once: true, margin: "-100px" });

  const gridItems: GridItem[] = [
    {
      id: 1,
      title: "Anonymous Reporting",
      description: "Submit reports without revealing your identity, with military-grade encryption protecting your data.",
      category: "security",
      image: "https://picsum.photos/id/1018/600/400",
      stats: { value: "99.9%", label: "Secure" },
      gradient: "from-blue-600 via-purple-600 to-blue-800",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
    },
    {
      id: 2,
      title: "Emergency Integration",
      description: "Direct connection to Bangladesh's 999 service for immediate emergency response.",
      category: "emergency",
      image: "https://picsum.photos/id/1015/600/400",
      stats: { value: "< 2min", label: "Response" },
      gradient: "from-red-500 via-orange-500 to-red-700",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856C19.12 19 20 18.104 20 17V7c0-1.104-.88-2-1.938-2H5.938C4.88 5 4 5.896 4 7v10c0 1.104.88 2 1.938 2z" />
        </svg>
      ),
    },
    {
      id: 3,
      title: "AI-Powered Analysis",
      description: "Advanced algorithms categorize and prioritize reports for faster response times.",
      category: "technology",
      image: "https://picsum.photos/id/1025/600/400",
      stats: { value: "95%", label: "Accuracy" },
      gradient: "from-emerald-500 via-teal-500 to-emerald-700",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
    {
      id: 4,
      title: "Real-Time Alerts",
      description: "Get notifications when authorities respond to your report or when similar incidents occur nearby.",
      category: "communication",
      image: "https://picsum.photos/id/1031/600/400",
      stats: { value: "24/7", label: "Monitoring" },
      gradient: "from-violet-500 via-purple-500 to-violet-700",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
    },
    {
      id: 5,
      title: "Community Dashboard",
      description: "View anonymized incident trends and safety statistics for your area.",
      category: "analytics",
      image: "https://picsum.photos/id/1033/600/400",
      stats: { value: "Live", label: "Data" },
      gradient: "from-amber-500 via-yellow-500 to-amber-700",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      id: 6,
      title: "Multimedia Support",
      description: "Attach photos, videos, or documents to provide crucial evidence while maintaining privacy.",
      category: "technology",
      image: "https://picsum.photos/id/1039/600/400",
      stats: { value: "All", label: "Formats" },
      gradient: "from-pink-500 via-rose-500 to-pink-700",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  const categories = ['all', 'security', 'emergency', 'technology', 'communication', 'analytics'];

  const filteredItems = selectedCategory === 'all' 
    ? gridItems 
    : gridItems.filter(item => item.category === selectedCategory);

  // Floating particles animation
  useEffect(() => {
    if (!gridRef.current) return;

    const createFloatingParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'absolute w-2 h-2 bg-[#07D348] rounded-full opacity-60 pointer-events-none';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      
      gridRef.current?.appendChild(particle);

      // Animate particle
      const animation = particle.animate([
        { transform: 'translateY(0px) scale(0)', opacity: 0 },
        { transform: 'translateY(-50px) scale(1)', opacity: 0.6 },
        { transform: 'translateY(-100px) scale(0)', opacity: 0 }
      ], {
        duration: 3000,
        easing: 'ease-out'
      });

      animation.onfinish = () => {
        particle.remove();
      };
    };

    const interval = setInterval(createFloatingParticle, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Stunning Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-90" />
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-[#07D348]/20 to-[#24fe41]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-l from-[#24fe41]/20 to-[#07D348]/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="text-center mb-16 relative z-10"
      >
        <motion.h2 
          className="text-6xl font-bold mb-6 relative"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <span className="bg-gradient-to-r from-white via-[#07D348] to-[#24fe41] bg-clip-text text-transparent">
            Revolutionary Safety Features
          </span>
          <div className="absolute -inset-4 bg-gradient-to-r from-[#07D348]/20 to-[#24fe41]/20 blur-2xl -z-10 rounded-full" />
        </motion.h2>
        <motion.p 
          className="text-xl text-zinc-300 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Experience next-generation public safety technology designed for Bangladesh's unique needs
        </motion.p>
      </motion.div>

      {/* Category Filter */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="flex flex-wrap justify-center gap-3 mb-16 relative z-10"
      >
        {categories.map((category, index) => (
          <motion.button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-8 py-4 rounded-2xl font-semibold text-sm transition-all duration-300 relative overflow-hidden group ${
              selectedCategory === category
                ? 'bg-gradient-to-r from-[#07D348] to-[#24fe41] text-white shadow-2xl shadow-[#07D348]/40'
                : 'bg-white/10 text-zinc-300 hover:bg-white/20 border border-white/20 hover:border-[#07D348]/50'
            }`}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
          >
            <span className="relative z-10">
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </span>
            {selectedCategory !== category && (
              <div className="absolute inset-0 bg-gradient-to-r from-[#07D348]/20 to-[#24fe41]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            )}
          </motion.button>
        ))}
      </motion.div>

      {/* Stunning Grid */}
      <div ref={gridRef} className="grid gap-8 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 relative z-10 max-w-7xl mx-auto px-6">
        {filteredItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 60, rotateX: 45 }}
            animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
            transition={{ 
              duration: 0.8, 
              delay: index * 0.2,
              type: "spring",
              stiffness: 100
            }}
            className="group relative overflow-hidden rounded-3xl transition-all duration-700 hover:scale-105"
            onMouseEnter={() => setHoveredItem(item.id)}
            onMouseLeave={() => setHoveredItem(null)}
            style={{ 
              transformStyle: 'preserve-3d',
              perspective: '1000px'
            }}
          >
            {/* Main Card */}
            <div className={`relative h-96 bg-gradient-to-br ${item.gradient} rounded-3xl overflow-hidden border border-white/20 shadow-2xl group-hover:shadow-4xl transition-all duration-700`}>
              
              {/* Background Image with Parallax */}
              <div className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity duration-700">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>

              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-80 group-hover:opacity-90 transition-opacity duration-700`} />
              
              {/* Animated Mesh Background */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.1\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-pulse" />
              </div>

              {/* Content */}
              <div className="relative z-10 p-8 h-full flex flex-col justify-between">
                
                {/* Header */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <motion.div 
                      className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 shadow-lg"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      {item.icon}
                    </motion.div>
                    
                    <motion.div 
                      className="text-right bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.5 }}
                    >
                      <div className="text-2xl font-bold text-white">{item.stats?.value}</div>
                      <div className="text-xs text-white/80">{item.stats?.label}</div>
                    </motion.div>
                  </div>

                  <motion.h3
                    className="text-2xl font-bold text-white mb-4 group-hover:text-yellow-200 transition-colors duration-300"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                  >
                    {item.title}
                  </motion.h3>
                  
                  <motion.p
                    className="text-white/90 leading-relaxed text-sm group-hover:text-white transition-colors duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.4 }}
                  >
                    {item.description}
                  </motion.p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-6">
                  <span className="px-4 py-2 bg-white/20 text-white rounded-full text-xs font-semibold border border-white/30 backdrop-blur-sm">
                    {item.category}
                  </span>
                  
                  <motion.button
                    className="flex items-center gap-2 text-white hover:text-yellow-200 transition-colors group/btn font-semibold"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="text-sm">Explore</span>
                    <svg className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </motion.button>
                </div>
              </div>

              {/* Hover Effects */}
              {hoveredItem === item.id && (
                <>
                  {/* Floating Particles */}
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-white rounded-full"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                      animate={{
                        y: [0, -50, -100],
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                  
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-50 animate-pulse" />
                </>
              )}
            </div>

            {/* 3D Shadow */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/40 rounded-3xl transform translate-y-2 translate-x-2 -z-10 group-hover:translate-y-4 group-hover:translate-x-4 transition-transform duration-700" />
          </motion.div>
        ))}
      </div>

      {/* Bottom Glow */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-32 bg-gradient-to-t from-[#07D348]/20 to-transparent" />
    </section>
  );
}