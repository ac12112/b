'use client';
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ReportTracker } from "@/components/report/ReportTracker";

// Client-side only components
const ClientOnlyGradient = dynamic(
  () => import("@/components/ClientOnlyGradient").then(mod => mod.default),
  { ssr: false }
);

export default function TrackReportPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-black relative overflow-hidden">
      <ClientOnlyGradient />

      {/* Enhanced Floating Particles - Similar to page.tsx */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(300)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-[#07D348] rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `rain ${Math.random() * 2 + 1}s linear ${Math.random() * 5}s infinite`,
              opacity: Math.random() * 0.5 + 0.1,
              transform: `translateY(-100vh) scale(${0.5 + Math.random() * 0.5})`,
            }}
          ></div>
        ))}
      </div>
      
      {/* Background Glow Orbs - Similar to page.tsx */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-48 -left-24 w-96 h-96 bg-gradient-to-r from-[#07D348]/30 to-[#24fe41]/15 rounded-full blur-3xl opacity-40 animate-float"></div>
        <div className="absolute top-1/4 -right-48 w-96 h-96 bg-gradient-to-l from-[#07D348]/30 to-[#24fe41]/15 rounded-full blur-3xl opacity-30 animate-float-delayed"></div>
        <div className="absolute bottom-0 left-1/2 w-[200vw] h-48 bg-gradient-to-t from-[#07D348]/10 to-transparent -translate-x-1/2"></div>
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-gradient-to-br from-[#07D348]/30 to-[#24fe41]/15 rounded-full blur-2xl opacity-30 animate-float-slow"></div>
      </div>
      
      {/* Add the same styles as page.tsx */}
      <style jsx global>{`
        @keyframes rain {
          to {
            transform: translateY(100vh) scale(var(--tw-scale-x), var(--tw-scale-y));
          }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(10px) rotate(5deg); }
          50% { transform: translateY(-10px) rotate(7deg); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(1deg); }
        }
        .animate-float { animation: float 8s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 10s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 12s ease-in-out infinite; }
      `}</style>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center">
        <div className="w-full max-w-5xl space-y-8">
          {/* Tracker Container */}
          <div className="relative group backdrop-blur-xl rounded-3xl border border-[#07D348]/20 bg-black/60 p-8 shadow-2xl hover:shadow-[0_0_40px_-15px_#07D348]/40 transition-all duration-300">
            <ReportTracker />
          </div>
        </div>
      </div>
    </div>
  );
}