"use client";

import { useState } from "react";
import { Search, Loader } from "lucide-react";

interface ReportDetails {
  id: string;
  reportId: string;
  status: string;
  createdAt: string;
  title: string;
  description: string;
  location: string;
}

type Status = "pending" | "processing" | "completed" | "failed";

export function ReportTracker() {
  const [reportId, setReportId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [reportDetails, setReportDetails] = useState<ReportDetails | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setReportDetails(null);
    setLoading(true);

    if (!reportId.trim()) {
      setError("Please enter a report ID");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/reports/${reportId}/details`);
      if (!response.ok) {
        throw new Error("Report not found");
      }
      const data: ReportDetails = await response.json();
      setReportDetails(data);
    } catch (error) {
      console.error("Tracking error:", error);
      setError(
        error instanceof Error 
          ? error.message 
          : "Unable to find report. Please check the ID and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="inline-flex h-9 items-center gap-2 rounded-full border border-[#07D348]/30 bg-black px-4 text-sm text-[#07D348] backdrop-blur-sm">
          <Search className="w-4 h-4" />
          Track Your Report Status
        </div>
        <h1 className="mt-6 bg-white bg-clip-text text-4xl font-bold tracking-tight text-transparent">
          Track Your Report
          <span className="block bg-gradient-to-r from-[#07D348] to-[#24fe41] bg-clip-text text-transparent">
            Stay Informed
          </span>
        </h1>
        <p className="mt-4 text-zinc-400 max-w-xl mx-auto">
          Enter your report ID to check the current status and updates
        </p>
      </div>

      {/* Dynamic Layout Container */}
      <div className="flex justify-center">
        <div className={`transition-all duration-300 ease-in-out ${reportDetails ? "w-full grid md:grid-cols-2 gap-8" : "max-w-lg w-full"}`}>
          {/* Form Section */}
          <div className={`bg-black/60 backdrop-blur-xl rounded-2xl border border-[#07D348]/20 p-6 w-full transition-all duration-300 ${reportDetails ? "" : "mx-auto"}`}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <label htmlFor="reportId" className="block text-sm font-medium mb-2 text-zinc-300">
                  Report ID
                </label>
                <input
                  type="text"
                  id="reportId"
                  value={reportId}
                  onChange={(e) => setReportId(e.target.value)}
                  className="w-full px-4 py-3 bg-black/40 border border-[#07D348]/30 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#07D348]/60 focus:border-[#07D348] transition-all"
                  placeholder="Enter your report ID"
                  disabled={loading}
                  aria-disabled={loading}
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 p-4 rounded-xl border border-red-500/20">
                  <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#07D348] to-[#24fe41] text-white py-3 px-4 rounded-xl hover:from-[#07D348]/90 hover:to-[#24fe41]/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg hover:shadow-[#07D348]/40"
                aria-label={loading ? "Searching for report" : "Track report"}
              >
                {loading ? (
                  <Loader className="w-5 h-5 animate-spin" role="status" aria-label="Loading" />
                ) : (
                  <Search className="w-5 h-5" />
                )}
                <span>{loading ? "Searching..." : "Track Report"}</span>
              </button>
            </form>
          </div>

          {/* Results Section */}
          <div className={`transition-all duration-300 ${reportDetails ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8 absolute"}`}>
            {reportDetails && (
              <div className="rounded-xl border border-[#07D348]/20 bg-black/60 backdrop-blur-xl p-6 h-full">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2 mb-6">
                  <div className="h-2 w-2 rounded-full bg-[#07D348] animate-pulse" />
                  Report Details
                </h2>

                <div className="grid gap-4">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-[#07D348]/10 hover:bg-[#07D348]/20 transition-colors border border-[#07D348]/20">
                    <span className="text-zinc-400">Status</span>
                    <span className={`font-medium ${getStatusColor(reportDetails.status)} px-3 py-1 rounded-full bg-black/30`}>
                      {reportDetails.status.toUpperCase()}
                    </span>
                  </div>

                  {[
                    { label: "Report ID", value: reportDetails.reportId || reportDetails.id },
                    { label: "Submitted On", value: new Date(reportDetails.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }) },
                    { label: "Title", value: reportDetails.title },
                    { label: "Location", value: reportDetails.location },
                    { label: "Description", value: reportDetails.description },
                  ].map((item, index) => (
                    <div key={index} className="p-3 rounded-lg bg-[#07D348]/10 hover:bg-[#07D348]/20 transition-colors border border-[#07D348]/20">
                      <span className="text-zinc-400 text-sm block mb-1">{item.label}</span>
                      <span className="text-white block font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function getStatusColor(status: string): string {
  const statusColors: Record<Status, string> = {
    pending: "text-[#fdfc47]",
    processing: "text-[#07D348]",
    completed: "text-[#24fe41]",
    failed: "text-red-400",
  };
  
  return statusColors[status.toLowerCase() as Status] || "text-white";
}