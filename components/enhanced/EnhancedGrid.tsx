"use client";

import { motion } from 'framer-motion';
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
}

export default function EnhancedGrid() {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const gridRef = useRef<HTMLDivElement>(null);

  const gridItems: GridItem[] = [
    {
      id: 1,
      title: "Anonymous Reporting",
      description: "Submit reports without revealing your identity, with military-grade encryption protecting your data.",
      category: "security",
      image: "https://picsum.photos/id/1018/600/400",
      stats: { value: "99.9%", label: "Secure" },
      icon: (
        <svg className="w-8 h-8 text-[#07D348]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
      icon: (
        <svg className="w-8 h-8 text-[#07D348]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
      icon: (
        <svg className="w-8 h-8 text-[#07D348]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
      icon: (
        <svg className="w-8 h-8 text-[#07D348]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
      icon: (
        <svg className="w-8 h-8 text-[#07D348]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
      icon: (
        <svg className="w-8 h-8 text-[#07D348]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  const categories = ['all', 'security', 'emergency', 'technology', 'communication', 'analytics'];

  const filteredItems = selectedCategory === 'all' 
    ? gridItems 
    : gridItems.filter(item => item.category === selectedCategory);

  // Enhanced hover effects with GSAP-like animations
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!gridRef.current) return;
      
      const cards = gridRef.current.querySelectorAll('.grid-card');
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        const distance = Math.sqrt(x * x + y * y);
        const maxDistance = 200;
        
        if (distance < maxDistance) {
          const strength = (maxDistance - distance) / maxDistance;
          const rotateX = (y / rect.height) * 10 * strength;
          const rotateY = (x / rect.width) * -10 * strength;
          
          (card as HTMLElement).style.transform = `
            perspective(1000px) 
            rotateX(${rotateX}deg) 
            rotateY(${rotateY}deg) 
            translateZ(${strength * 20}px)
          `;
        } else {
          (card as HTMLElement).style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        }
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#07D348]/10 to-transparent rounded-3xl -z-10"></div>
      
      {/* Enhanced Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#07D348] rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.1,
            }}
          />
        ))}
      </div>
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-[#07D348] bg-clip-text text-transparent relative">
          Revolutionary Safety Features
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-[#07D348] to-[#24fe41] rounded-full blur-sm"></div>
        </h2>
        <p className="text-xl text-zinc-300 max-w-3xl mx-auto">
          Experience next-generation public safety technology designed for Bangladesh's unique needs
        </p>
      </motion.div>

      {/* Category Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap justify-center gap-3 mb-12"
      >
        {categories.map((category) => (
          <motion.button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-6 py-3 rounded-full font-medium transition-all ${
              selectedCategory === category
                ? 'bg-gradient-to-r from-[#07D348] to-[#24fe41] text-white shadow-lg shadow-[#07D348]/30'
                : 'bg-zinc-900/50 text-zinc-300 hover:bg-zinc-800/50 border border-zinc-700'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </motion.button>
        ))}
      </motion.div>

      {/* Enhanced Grid */}
      <div ref={gridRef} className="grid gap-8 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 relative">
        {filteredItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            className="grid-card group relative overflow-hidden rounded-3xl border-2 border-[#07D348]/30 bg-gradient-to-br from-black/80 to-zinc-900/60 backdrop-blur-xl transition-all duration-500 hover:border-[#07D348]/80 hover:shadow-2xl hover:shadow-[#07D348]/40"
            onMouseEnter={() => setHoveredItem(item.id)}
            onMouseLeave={() => setHoveredItem(null)}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Background Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#07D348]/20 via-transparent to-[#24fe41]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Floating Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1.5 h-1.5 bg-[#07D348] rounded-full opacity-0 group-hover:opacity-80 shadow-lg shadow-[#07D348]/50"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={hoveredItem === item.id ? {
                    y: [0, -30, 0],
                    opacity: [0, 0.8, 0],
                    scale: [0, 1.5, 0],
                  } : {}}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                />
              ))}
            </div>

            {/* Image Container */}
            <div className="relative h-48 overflow-hidden rounded-t-3xl">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Stats Badge */}
              <motion.div
                className="absolute top-4 right-4 bg-black/90 backdrop-blur-sm rounded-xl px-3 py-2 border border-[#07D348]/40 shadow-lg"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: hoveredItem === item.id ? 1 : 0.8, scale: hoveredItem === item.id ? 1 : 0.8 }}
              >
                <div className="text-[#24fe41] font-bold text-lg">{item.stats?.value}</div>
                <div className="text-zinc-300 text-xs">{item.stats?.label}</div>
              </motion.div>

              {/* Icon Overlay */}
              <motion.div
                className="absolute bottom-4 left-4 p-3 bg-black/90 backdrop-blur-sm rounded-xl border border-[#07D348]/40 shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                {item.icon}
              </motion.div>
            </div>

            {/* Content */}
            <div className="p-8 relative z-10">
              <motion.h3
                className="text-2xl font-bold text-white mb-4 group-hover:text-[#24fe41] transition-colors duration-300"
                animate={hoveredItem === item.id ? { x: [0, 5, 0] } : {}}
                transition={{ duration: 0.5 }}
              >
                {item.title}
              </motion.h3>
              
              <motion.p
                className="text-zinc-300 leading-relaxed mb-6 group-hover:text-zinc-200 transition-colors duration-300"
                animate={hoveredItem === item.id ? { opacity: [0.7, 1, 0.7] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {item.description}
              </motion.p>

              {/* Category Tag */}
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-[#07D348]/30 text-[#24fe41] rounded-full text-sm font-medium border border-[#07D348]/50 shadow-sm">
                  {item.category}
                </span>
                
                <motion.button
                  className="flex items-center gap-2 text-[#07D348] hover:text-[#24fe41] transition-colors group/btn font-medium"
                  whileHover={{ x: 5 }}
                >
                  <span className="text-sm font-medium">Learn More</span>
                  <svg className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </motion.button>
              </div>
            </div>

            {/* Glow Effect */}
            <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#07D348]/30 to-[#24fe41]/30 blur-2xl" />
            </div>
          </motion.div>
        ))}
      </div>

    </section>
  );
}