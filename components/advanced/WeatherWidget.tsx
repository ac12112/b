"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  icon: string;
  forecast: {
    day: string;
    high: number;
    low: number;
    condition: string;
    icon: string;
  }[];
}

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Simulate weather data (in real app, you'd fetch from weather API)
  useEffect(() => {
    const fetchWeather = () => {
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        const conditions = [
          { condition: 'Sunny', icon: '☀️', temp: 32 },
          { condition: 'Partly Cloudy', icon: '⛅', temp: 28 },
          { condition: 'Cloudy', icon: '☁️', temp: 25 },
          { condition: 'Rainy', icon: '🌧️', temp: 22 },
          { condition: 'Thunderstorm', icon: '⛈️', temp: 20 },
        ];
        
        const current = conditions[Math.floor(Math.random() * conditions.length)];
        
        setWeather({
          location: 'Dhaka, Bangladesh',
          temperature: current.temp,
          condition: current.condition,
          humidity: Math.floor(Math.random() * 40) + 60,
          windSpeed: Math.floor(Math.random() * 15) + 5,
          icon: current.icon,
          forecast: [
            { day: 'Today', high: current.temp, low: current.temp - 8, condition: current.condition, icon: current.icon },
            { day: 'Tomorrow', high: 30, low: 22, condition: 'Partly Cloudy', icon: '⛅' },
            { day: 'Wed', high: 28, low: 20, condition: 'Rainy', icon: '🌧️' },
            { day: 'Thu', high: 31, low: 24, condition: 'Sunny', icon: '☀️' },
            { day: 'Fri', high: 29, low: 21, condition: 'Cloudy', icon: '☁️' },
          ]
        });
        setIsLoading(false);
      }, 1000);
    };

    fetchWeather();
    
    // Update weather every 10 minutes
    const weatherInterval = setInterval(fetchWeather, 600000);
    
    // Update time every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(weatherInterval);
      clearInterval(timeInterval);
    };
  }, []);

  const getWeatherGradient = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
        return 'from-yellow-400/20 to-orange-500/20';
      case 'partly cloudy':
        return 'from-blue-400/20 to-gray-500/20';
      case 'cloudy':
        return 'from-gray-400/20 to-gray-600/20';
      case 'rainy':
        return 'from-blue-500/20 to-blue-700/20';
      case 'thunderstorm':
        return 'from-purple-500/20 to-gray-800/20';
      default:
        return 'from-[#07D348]/20 to-[#24fe41]/20';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed top-20 right-6 z-40 w-80 bg-zinc-900/80 backdrop-blur-xl rounded-2xl border border-white/10 p-6"
      >
        <div className="flex items-center justify-center h-32">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-4 border-[#07D348] border-t-transparent rounded-full"
          />
        </div>
      </motion.div>
    );
  }

  if (!weather) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 1 }}
      className="fixed top-20 right-6 z-40"
    >
      <motion.div
        className={`bg-gradient-to-br ${getWeatherGradient(weather.condition)} backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden cursor-pointer`}
        whileHover={{ scale: 1.02 }}
        onClick={() => setIsExpanded(!isExpanded)}
        layout
      >
        {/* Compact View */}
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                className="text-3xl"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {weather.icon}
              </motion.div>
              <div>
                <div className="text-2xl font-bold text-white">
                  {weather.temperature}°C
                </div>
                <div className="text-xs text-zinc-300">
                  {weather.condition}
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-sm font-medium text-white">
                {formatTime(currentTime)}
              </div>
              <div className="text-xs text-zinc-300">
                {formatDate(currentTime)}
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-zinc-300">
            <span>{weather.location}</span>
            <motion.svg
              className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </motion.svg>
          </div>
        </div>

        {/* Expanded View */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t border-white/10"
            >
              {/* Current Details */}
              <div className="p-4 bg-black/20">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-400">💧</span>
                    <span className="text-zinc-300">Humidity: {weather.humidity}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">💨</span>
                    <span className="text-zinc-300">Wind: {weather.windSpeed} km/h</span>
                  </div>
                </div>
              </div>

              {/* 5-Day Forecast */}
              <div className="p-4">
                <h4 className="text-sm font-semibold text-white mb-3">5-Day Forecast</h4>
                <div className="space-y-2">
                  {weather.forecast.map((day, index) => (
                    <motion.div
                      key={day.day}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{day.icon}</span>
                        <div>
                          <div className="text-sm font-medium text-white">{day.day}</div>
                          <div className="text-xs text-zinc-400">{day.condition}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-white">{day.high}°</div>
                        <div className="text-xs text-zinc-400">{day.low}°</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Weather Alert */}
              <div className="p-4 bg-gradient-to-r from-[#07D348]/20 to-[#24fe41]/20 border-t border-white/10">
                <div className="flex items-center gap-2 text-sm">
                  <motion.span
                    className="text-[#07D348]"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    🌡️
                  </motion.span>
                  <span className="text-zinc-300">
                    Weather conditions are favorable for outdoor activities
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Floating Weather Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}