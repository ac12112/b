"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useRef } from "react";
import { Report, ReportStatus, ReportType } from "@prisma/client";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import RealtimeMap from "@/components/advanced/RealtimeMap";
import AdvancedAnalytics from "@/components/advanced/AdvancedAnalytics";
import SmartNotifications from "@/components/advanced/SmartNotifications";

interface NewReportState {
  title: string;
  description: string;
  type: ReportType;
  location: string;
  image: string;
}

export default function UserDashboard() {
  const { data: session, status } = useSession();
  const [reports, setReports] = useState<Report[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [newReport, setNewReport] = useState<NewReportState>({
    title: "",
    description: "",
    type: ReportType.NON_EMERGENCY,
    location: "",
    image: ""
  });
  const [showReportForm, setShowReportForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Redirect if not authenticated or not a user
  useEffect(() => {
    if (status === "loading") return;
    
    if (status === "unauthenticated") {
      window.location.href = "/auth/signin";
      return;
    }
    
    // Allow USER role to access user dashboard
    if (session?.user?.role !== "USER") {
      if (session?.user?.role === "ADMIN" || session?.user?.role === "MODERATOR") {
        window.location.href = "/dashboard";
      } else {
        window.location.href = "/auth/signin";
      }
      return;
    }
  }, [status, session]);

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

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const fetchReports = async () => {
        try {
          // Fetch only user's own reports
          const res = await fetch("/api/reports/user");
          if (res.ok) {
            const data = await res.json();
            setReports(data);
          } else {
            console.error("Failed to fetch reports:", res.statusText);
          }
        } catch (error) {
          console.error("Error fetching reports:", error);
        }
      };
      
      fetchReports();
    }
  }, [status, session]);

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user) {
      alert("Please sign in to submit a report");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const reportData = {
        ...newReport,
        userId: session.user.id
      };
      
      const res = await fetch("/api/reports/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reportData)
      });

      if (res.ok) {
        setShowReportForm(false);
        setNewReport({
          title: "",
          description: "",
          type: ReportType.NON_EMERGENCY,
          location: "",
          image: ""
        });
        // Refresh reports
        const updatedReports = await fetch("/api/reports/user").then(res => res.json());
        if (Array.isArray(updatedReports)) {
          setReports(updatedReports);
        }
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Failed to submit report");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-20 w-20 border-t-4 border-b-4 border-[#07D348]"
        ></motion.div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  const statusColors = {
    [ReportStatus.PENDING]: "bg-yellow-500/20 text-yellow-500",
    [ReportStatus.IN_PROGRESS]: "bg-blue-500/20 text-blue-500",
    [ReportStatus.RESOLVED]: "bg-green-500/20 text-green-500",
    [ReportStatus.DISMISSED]: "bg-red-500/20 text-red-500"
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Canvas for smooth particles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />
      
      {/* Background Glow Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-48 -left-24 w-96 h-96 bg-gradient-to-r from-[#07D348]/30 to-[#24fe41]/15 rounded-full blur-3xl opacity-40 animate-float"></div>
        <div className="absolute top-1/4 -right-48 w-96 h-96 bg-gradient-to-l from-[#07D348]/30 to-[#24fe41]/15 rounded-full blur-3xl opacity-30 animate-float-delayed"></div>
        <div className="absolute bottom-0 left-1/2 w-[200vw] h-48 bg-gradient-to-t from-[#07D348]/10 to-transparent -translate-x-1/2"></div>
      </div>

      <style jsx>{`
        @keyframes float { 0% { transform: translateY(0); } 50% { transform: translateY(-20px); } 100% { transform: translateY(0); } }
        @keyframes float-delayed { 0% { transform: translateY(0); } 50% { transform: translateY(-30px); } 100% { transform: translateY(0); } }
      `}</style>
      
      <nav className="relative z-10 bg-gray-900/90 backdrop-blur-2xl border-b border-gray-800 sticky top-0 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-bold bg-gradient-to-r from-[#07D348] to-[#24fe41] bg-clip-text text-transparent"
            >
              CivicSafe User Portal
            </motion.h1>
            <div className="flex items-center gap-6">
              <SmartNotifications />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#07D348] to-[#24fe41] flex items-center justify-center shadow-md">
                  <span className="text-sm font-bold text-white">
                    {session?.user?.name?.charAt(0) || "U"}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-100">
                  {session?.user?.name || "User"}
                </span>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => signOut()}
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg"
              >
                Sign Out
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-wrap gap-2"
        >
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'reports', label: 'My Reports', icon: '📋' },
            { id: 'analytics', label: 'Analytics', icon: '📈' },
            { id: 'map', label: 'Live Map', icon: '🗺️' },
          ].map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-[#07D348] to-[#24fe41] text-white shadow-lg shadow-[#07D348]/30'
                  : 'bg-gray-900/50 text-gray-300 hover:bg-gray-800/50 border border-gray-700'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {[
                    { label: 'Total Reports', value: reports.length, color: 'from-blue-500 to-blue-600', icon: '📊' },
                    { label: 'Pending', value: reports.filter(r => r.status === 'PENDING').length, color: 'from-yellow-500 to-yellow-600', icon: '⏳' },
                    { label: 'In Progress', value: reports.filter(r => r.status === 'IN_PROGRESS').length, color: 'from-orange-500 to-orange-600', icon: '🔄' },
                    { label: 'Resolved', value: reports.filter(r => r.status === 'RESOLVED').length, color: 'from-green-500 to-green-600', icon: '✅' },
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-900/70 backdrop-blur-xl rounded-2xl border border-gray-800/50 p-6 hover:border-[#07D348]/30 transition-all group"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl">{stat.icon}</span>
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                          <span className="text-white font-bold text-lg">{stat.value}</span>
                        </div>
                      </div>
                      <h3 className="text-gray-300 text-sm font-medium">{stat.label}</h3>
                    </motion.div>
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="bg-gray-900/70 backdrop-blur-xl rounded-2xl border border-gray-800/50 p-6">
                  <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { title: 'Submit New Report', desc: 'Report a new incident', icon: '📝', action: () => setShowReportForm(true) },
                      { title: 'Emergency Call', desc: 'Call 999 immediately', icon: '🚨', action: () => window.open('tel:999') },
                      { title: 'View Map', desc: 'See live incidents', icon: '🗺️', action: () => setActiveTab('map') },
                    ].map((action, index) => (
                      <motion.button
                        key={action.title}
                        onClick={action.action}
                        className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-[#07D348]/50 hover:bg-gray-700/50 transition-all text-left group"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="text-2xl mb-2">{action.icon}</div>
                        <h3 className="text-white font-medium mb-1">{action.title}</h3>
                        <p className="text-gray-400 text-sm">{action.desc}</p>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reports' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white">My Reports</h2>
                  <motion.button
                    onClick={() => setShowReportForm(!showReportForm)}
                    className="bg-gradient-to-r from-[#07D348] to-[#24fe41] text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {showReportForm ? "Cancel" : "New Report"}
                  </motion.button>
                </div>

                {/* Report Form */}
                <AnimatePresence>
                  {showReportForm && (
                    <motion.form
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      onSubmit={handleSubmitReport}
                      className="bg-gray-900/70 backdrop-blur-xl rounded-2xl border border-gray-800/50 p-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300">Title</label>
                          <input
                            required
                            value={newReport.title}
                            onChange={e => setNewReport({...newReport, title: e.target.value})}
                            className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#07D348] transition-all"
                            placeholder="Brief description of the incident"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300">Type</label>
                          <select
                            value={newReport.type}
                            onChange={e => setNewReport({
                              ...newReport,
                              type: e.target.value as ReportType
                            })}
                            className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#07D348] transition-all"
                          >
                            {Object.values(ReportType).map(type => (
                              <option key={type} value={type}>
                                {type.toLowerCase().replace('_', ' ')}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300">Location</label>
                          <input
                            value={newReport.location}
                            onChange={e => setNewReport({...newReport, location: e.target.value})}
                            className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#07D348] transition-all"
                            placeholder="Where did this happen?"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300">Image URL</label>
                          <input
                            value={newReport.image}
                            onChange={e => setNewReport({...newReport, image: e.target.value})}
                            className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#07D348] transition-all"
                            placeholder="Optional: Link to evidence"
                          />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                          <label className="text-sm font-medium text-gray-300">Description</label>
                          <textarea
                            required
                            value={newReport.description}
                            onChange={e => setNewReport({...newReport, description: e.target.value})}
                            className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#07D348] transition-all h-32 resize-none"
                            placeholder="Provide detailed information about the incident..."
                          />
                        </div>
                        <motion.button
                          type="submit"
                          disabled={isSubmitting}
                          className="md:col-span-2 bg-gradient-to-r from-[#07D348] to-[#24fe41] text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 shadow-lg"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {isSubmitting ? "Submitting..." : "Submit Report"}
                        </motion.button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>

                {/* Reports Table */}
                <div className="bg-gray-900/70 backdrop-blur-xl rounded-2xl border border-gray-800/50 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-800/50">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Title</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Type</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Status</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Location</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700/50">
                        {reports.map(report => (
                          <motion.tr
                            key={report.id}
                            className="hover:bg-gray-800/30 transition-colors"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            <td className="px-6 py-4 text-white font-medium">{report.title}</td>
                            <td className="px-6 py-4 text-gray-300">
                              {report.type.toLowerCase().replace('_', ' ')}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[report.status]}`}>
                                {report.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-gray-300">{report.location || "N/A"}</td>
                            <td className="px-6 py-4 text-gray-300">
                              {new Date(report.createdAt).toLocaleDateString()}
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>
                <AdvancedAnalytics />
              </div>
            )}

            {activeTab === 'map' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Live Emergency Map</h2>
                <RealtimeMap />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}