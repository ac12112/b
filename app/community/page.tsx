
"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import L from "leaflet";

interface EmergencyService {
  id: number;
  name: string;
  icon: JSX.Element;
  number: string;
  description: string;
}

interface CommentType {
  id: number;
  text: string;
  author: string;
  date: string;
  likes: number;
  replies: CommentType[];
}

interface ServiceStat {
  category: string;
  current: number;
  previous: number;
  icon: JSX.Element;
}

interface LiveService {
  id: number;
  type: "ambulance" | "fire" | "police";
  status: "dispatched" | "enroute" | "arrived";
  location: string;
  eta: string;
}

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  image: string;
}

const SecurityIcon = ({ className }: { className?: string }) => (
  <svg
    className={`h-6 w-6 text-[#07D348] ${className}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    />
  </svg>
);

const SERVICE_STATS: ServiceStat[] = [
  {
    category: "Response Time (Avg)",
    current: 8.2,
    previous: 14.5,
    icon: <SecurityIcon />,
  },
  {
    category: "Active Emergencies",
    current: 142,
    previous: 89,
    icon: <SecurityIcon />,
  },
  {
    category: "Rescues Today",
    current: 327,
    previous: 281,
    icon: <SecurityIcon />,
  },
];

const LIVE_SERVICES: LiveService[] = [
  { id: 1, type: "ambulance", status: "enroute", location: "Mohakhali Flyover", eta: "8 mins" },
  { id: 2, type: "fire", status: "dispatched", location: "Lalmatia Area", eta: "12 mins" },
  { id: 3, type: "police", status: "arrived", location: "Gulshan Circle-2", eta: "On Site" },
];

const BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    title: "New Emergency Response Protocols",
    excerpt: "Learn about our updated safety procedures and community guidelines for faster emergency response.",
    date: "March 15, 2024",
    image: `https://picsum.photos/seed/${Math.random()}/600/400`,
  },
  {
    id: 2,
    title: "Community Safety Workshop",
    excerpt: "Join our free public safety workshops conducted by emergency response professionals.",
    date: "March 20, 2024",
    image: `https://picsum.photos/seed/${Math.random()}/600/400`,
  },
  {
    id: 3,
    title: "Annual Emergency Service Report",
    excerpt: "Review our yearly performance metrics and service improvement initiatives.",
    date: "March 25, 2024",
    image: `https://picsum.photos/seed/${Math.random()}/600/400`,
  },
];

export default function EmergencyDashboard() {
  const [location, setLocation] = useState<string>("");
  const [locationError, setLocationError] = useState<string>("");
  const [comments, setComments] = useState<any[]>([]);
  const [comment, setComment] = useState("");
  const [emergencyType, setEmergencyType] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  // Canvas particle animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particleCount = window.innerWidth < 768 ? 50 : 150;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3 + 1,
      speedX: Math.random() * 0.5 - 0.25,
      speedY: Math.random() * 0.5 - 0.25,
      color: `rgba(7, 211, 72, ${Math.random() * 0.5 + 0.1})`,
    }));

    let animationId: number;
    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x < 0 || particle.x > canvas.width) {
          particle.speedX = -particle.speedX;
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.speedY = -particle.speedY;
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Initialize Leaflet
  useEffect(() => {
    if (!mapRef.current) return;

    try {
      mapInstanceRef.current = L.map(mapRef.current, {
        center: [23.8103, 90.4125], // Default center (Dhaka, Bangladesh)
        zoom: 12,
        zoomControl: true,
      });

      // Add OpenStreetMap tiles (Google Maps-like view, no API key)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(mapInstanceRef.current);

      // Log successful map initialization
      console.log("Leaflet map loaded successfully");

      // Handle map load errors
      mapInstanceRef.current.on("tileerror", (e) => {
        console.error("Leaflet tile error:", e);
        setLocationError("Failed to load map tiles. Please check your network.");
      });
    } catch (error) {
      console.error("Failed to initialize Leaflet:", error);
      setLocationError("Failed to load map. Please try again.");
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }
    };
  }, []);

  // Update map center and add marker when location changes
  useEffect(() => {
    if (location && mapInstanceRef.current) {
      const [lng, lat] = location.split(",").map(Number);
      if (isNaN(lng) || isNaN(lat)) {
        setLocationError("Invalid location coordinates");
        return;
      }

      mapInstanceRef.current.setView([lat, lng], 14);

      // Remove existing marker if present
      if (markerRef.current) {
        markerRef.current.remove();
      }

      // Add new marker with Google Maps-like styling
      const customIcon = L.divIcon({
        html: `
          <svg viewBox="0 0 24 24" width="32" height="32" fill="#FF0000">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5 14.5 7.62 14.5 9 13.38 11.5 12 11.5z"/>
          </svg>
        `,
        className: "",
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });

      markerRef.current = L.marker([lat, lng], { icon: customIcon })
        .addTo(mapInstanceRef.current)
        .bindPopup("Your Location")
        .openPopup();

      console.log("Map centered at:", [lat, lng]);
    }
  }, [location]);

  const handleLocationShare = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = `${position.coords.longitude},${position.coords.latitude}`;
          setLocation(coords);
          setLocationError("");
          console.log("Location shared:", coords);
        },
        (error) => {
          setLocationError("Unable to retrieve your location. Please enable permissions.");
          console.error("Geolocation error:", error);
        }
      );
    } else {
      setLocationError("Geolocation is not supported by this browser.");
      console.error("Geolocation not supported");
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      setComments([
        {
          id: comments.length + 1,
          text: comment,
          author: "Citizen",
          date: new Date().toLocaleString(),
          likes: 0,
          replies: [],
        },
        ...comments,
      ]);
      setComment("");
    }
  };

  return (
    <div className="relative min-h-screen bg-black selection:bg-[#07D348]/20 overflow-hidden">
      {/* Leaflet CSS */}
      <style jsx global>{`
        @import url("https://unpkg.com/leaflet@1.9.4/dist/leaflet.css");
      `}</style>

      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />
      <div className="fixed inset-0 -z-10 min-h-screen pointer-events-none">
        <div className="absolute -top-48 -left-24 w-96 h-96 bg-gradient-to-r from-[#07D348]/30 to-[#24fe41]/15 rounded-full blur-3xl opacity-50 animate-float"></div>
        <div className="absolute top-1/2 -right-48 w-96 h-96 bg-gradient-to-l from-[#07D348]/30 to-[#24fe41]/15 rounded-full blur-3xl opacity-40 animate-float-delayed"></div>
        <div className="absolute bottom-0 left-1/2 w-[200vw] h-48 bg-gradient-to-t from-[#07D348]/10 to-transparent -translate-x-1/2"></div>
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-gradient-to-br from-[#07D348]/30 to-[#24fe41]/15 rounded-full blur-2xl opacity-30 animate-float-slow"></div>
      </div>
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0); }
        }
        @keyframes float-delayed {
          0% { transform: translateY(0); }
          50% { transform: translateY(-30px); }
          100% { transform: translateY(0); }
        }
        @keyframes float-slow {
          0% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0); }
        }
      `}</style>

      <main className="relative px-6 pt-32">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center text-center mb-32">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex h-12 items-center gap-2 rounded-full border border-[#07D348]/40 bg-[#07D348]/15 px-6 text-sm font-medium text-[#07D348] backdrop-blur-sm transition-all hover:border-[#07D348]/60 hover:bg-[#07D348]/25 shadow-md hover:shadow-[#07D348]/30"
            >
              <SecurityIcon className="h-5 w-5" />
              24/7 Nationwide Emergency Response
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8 bg-gradient-to-b from-white to-white/80 bg-clip-text text-6xl font-bold tracking-tight text-transparent sm:text-7xl"
            >
              Join the Community
              <span className="block mt-4 bg-gradient-to-r from-[#07D348] to-[#24fe41] bg-clip-text text-transparent text-4xl">
                Share Your Feedback and Help Build a Greater Nation
              </span>
            </motion.h1>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-12 backdrop-blur-2xl relative overflow-hidden mb-32 shadow-2xl hover:shadow-[#07D348]/30"
          >
            <div className="grid gap-10 md:grid-cols-3 mb-12">
              {SERVICE_STATS.map((stat) => (
                <motion.div
                  key={stat.category}
                  whileHover={{ scale: 1.02 }}
                  className="text-center p-6 rounded-xl bg-zinc-900/70 backdrop-blur-sm border border-white/10 hover:border-[#07D348]/30 transition-all"
                >
                  <div className="text-4xl font-bold text-[#07D348] mb-2">
                    {stat.current}
                    <span className="text-sm text-zinc-400 ml-2">({stat.previous})</span>
                  </div>
                  <div className="text-lg text-zinc-300 font-medium">{stat.category}</div>
                </motion.div>
              ))}
            </div>

            <div className="grid gap-4">
              {LIVE_SERVICES.map((service) => (
                <motion.div
                  key={service.id}
                  whileHover={{ scale: 1.02 }}
                  className="group relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-6 transition-all hover:border-[#07D348]/40 hover:bg-[#07D348]/15 shadow-md hover:shadow-[#07D348]/30"
                >
                  <div className="flex items-center gap-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 p-3 backdrop-blur-sm">
                      <SecurityIcon />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{service.location}</h3>
                      <p className="text-sm text-zinc-300">{service.type.toUpperCase()} - {service.status}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        service.status === "arrived"
                          ? "bg-green-500/20 text-green-400"
                          : service.status === "enroute"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {service.eta}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.section
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-32"
          >
            <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-12 backdrop-blur-2xl shadow-2xl hover:shadow-[#07D348]/30">
              <h2 className="text-4xl font-bold text-white mb-8">
                Real-time Location Sharing
                <span className="block text-xl mt-2 text-[#07D348]">Instant Position Tracking</span>
              </h2>

              <div className="grid gap-8">
                <div className="p-6 rounded-2xl bg-zinc-900/70 border border-white/10 backdrop-blur-sm">
                  <div className="flex flex-col gap-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleLocationShare}
                      className="group relative inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#07D348]/20 to-[#24fe41]/10 px-6 text-sm font-medium text-[#07D348] transition-all hover:from-[#07D348]/30 hover:to-[#24fe41]/20 shadow-md hover:shadow-[#07D348]/30"
                    >
                      Share Live Location
                      <SecurityIcon className="h-5 w-5" />
                    </motion.button>

                    <div className="space-y-4">
                      <input
                        type="text"
                        value={location}
                        readOnly
                        placeholder="Current location coordinates"
                        className="w-full bg-zinc-900/50 rounded-lg p-3 text-zinc-300 focus:outline-none focus:ring-2 focus:ring-[#07D348] border border-zinc-700 hover:border-[#07D348]/60 transition-all shadow-sm"
                      />
                      {locationError && <p className="text-red-400 text-sm">{locationError}</p>}
                    </div>
                  </div>
                </div>

                <div className="relative h-96 rounded-2xl overflow-hidden border border-[#07D348]/20 bg-[#07D348]/10">
                  <div
                    ref={mapRef}
                    className="absolute inset-0"
                    style={{ height: "100%", width: "100%" }}
                  >
                    {!location && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-center">
                        <p className="text-zinc-300 text-sm">Your live location will appear here once shared</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-32"
          >
            <h2 className="text-4xl font-bold text-white mb-8">
              Safety Updates
              <span className="block text-xl mt-2 text-[#07D348]">Latest News & Announcements</span>
            </h2>

            <div className="grid md:grid-cols-3 gap-10">
              {BLOG_POSTS.map((post) => (
                <motion.div
                  key={post.id}
                  whileHover={{ scale: 1.02 }}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent shadow-md hover:shadow-[#07D348]/30"
                >
                  <div className="relative h-48 bg-zinc-900">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  </div>

                  <div className="p-6">
                    <p className="text-sm text-[#07D348] mb-2">{post.date}</p>
                    <h3 className="text-xl font-semibold text-white mb-3">{post.title}</h3>
                    <p className="text-zinc-300 mb-4">{post.excerpt}</p>
                    <button className="text-[#07D348] flex items-center gap-2 group-hover:text-[#24fe41] transition-colors">
                      Read More
                      <svg
                        className="h-4 w-4 transition-transform group-hover:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-32"
          >
            <h2 className="text-4xl font-bold text-white mb-12 text-center">
              Community Hub
              <span className="block text-xl mt-3 bg-gradient-to-r from-[#07D348] to-[#24fe41] bg-clip-text text-transparent">
                Your Voice Builds Safer Communities
              </span>
            </h2>

            <div className="grid md:grid-cols-2 gap-10">
              <motion.div
                className="relative p-8 rounded-3xl border-2 border-white/10 bg-gradient-to-br from-zinc-900/70 to-zinc-900/30 backdrop-blur-2xl shadow-2xl hover:shadow-[#07D348]/30"
              >
                <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(7,211,72,0.1),transparent)] opacity-30" />
                <h3 className="text-2xl font-semibold text-white mb-8 flex items-center gap-3">
                  <SecurityIcon className="h-7 w-7 text-[#07D348]" />
                  Emergency Report Portal
                </h3>

                <form className="space-y-6">
                  <div className="space-y-4">
                    <label className="block text-zinc-100 font-medium">Incident Type</label>
                    <select
                      className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl p-4 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#07D348] focus:border-transparent transition-all shadow-sm hover:border-[#07D348]/60"
                      value={emergencyType || ""}
                      onChange={(e) => setEmergencyType(e.target.value)}
                    >
                      <option value="" className="bg-zinc-800">
                        Select incident type
                      </option>
                      <option value="medical" className="bg-zinc-800">
                        Medical Emergency
                      </option>
                      <option value="fire" className="bg-zinc-800">
                        Fire Emergency
                      </option>
                      <option value="crime" className="bg-zinc-800">
                        Criminal Activity
                      </option>
                      <option value="accident" className="bg-zinc-800">
                        Road Accident
                      </option>
                    </select>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-zinc-100 font-medium">Location Details</label>
                    <input
                      type="text"
                      className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl p-4 text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#07D348] focus:border-transparent transition-all shadow-sm hover:border-[#07D348]/60"
                      placeholder="Enter precise location or landmark"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="block text-zinc-100 font-medium">Incident Description</label>
                    <textarea
                      className="w-full h-32 bg-zinc-800/50 border border-zinc-700 rounded-xl p-4 text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#07D348] focus:border-transparent transition-all shadow-sm hover:border-[#07D348]/60"
                      placeholder="Provide detailed description of the emergency"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full group relative flex items-center justify-center gap-2 h-14 bg-gradient-to-r from-[#07D348]/90 to-[#24fe41]/90 rounded-xl font-semibold text-white hover:from-[#07D348] hover:to-[#24fe41] transition-all shadow-lg hover:shadow-[#07D348]/40"
                  >
                    Submit Secure Report
                    <svg
                      className="h-5 w-5 transition-transform group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </motion.button>
                </form>
              </motion.div>

              <div className="space-y-6">
                <motion.div
                  className="p-6 rounded-3xl bg-zinc-900/70 border border-zinc-700 backdrop-blur-2xl shadow-md hover:shadow-[#07D348]/30"
                >
                  <form onSubmit={handleCommentSubmit} className="space-y-4">
                    <div className="flex gap-4">
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Share your safety insights..."
                          className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl p-4 pr-16 text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#07D348] focus:border-transparent transition-all shadow-sm hover:border-[#07D348]/60"
                        />
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          type="submit"
                          className="absolute right-2 top-2 bg-[#07D348]/20 hover:bg-[#07D348]/30 p-2 rounded-lg text-[#07D348] transition-colors"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                          </svg>
                        </motion.button>
                      </div>
                    </div>
                  </form>
                </motion.div>

                <AnimatePresence>
                  {comments.map((comment) => (
                    <motion.div
                      key={comment.id}
                      initial={{ opacity: 0, x: 50, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-700 backdrop-blur-2xl hover:border-[#07D348]/40 transition-all group shadow-md hover:shadow-[#07D348]/30"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#07D348]/20 flex items-center justify-center">
                          <span className="text-[#07D348] font-medium">{comment.author[0]}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h4 className="font-semibold text-[#07D348]">{comment.author}</h4>
                            <span className="text-xs text-zinc-400">{comment.date}</span>
                          </div>
                          <p className="mt-2 text-zinc-100 leading-relaxed">{comment.text}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-4">
                        <button className="text-zinc-400 hover:text-[#07D348] flex items-center gap-1 transition-colors">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                            />
                          </svg>
                          <span className="text-sm">{comment.likes}</span>
                        </button>
                        <button className="text-zinc-400 hover:text-[#07D348] text-sm transition-colors">
                          Report Concern
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </motion.section>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-32"
          >
            <h2 className="text-4xl font-bold text-white mb-6">Need Immediate Assistance?</h2>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#07D348] to-[#24fe41] px-10 text-lg font-medium text-white transition-all shadow-lg hover:shadow-[#07D348]/40"
            >
              Call Emergency 999
              <svg
                className="h-5 w-5 transition-transform group-hover:translate-x-1"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </motion.button>
          </motion.div>
        </div>
      </main>

      {/* Load Leaflet JavaScript */}
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" async></script>
    </div>
  );
}
