"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

interface AnalyticsData {
  responseTime: number[];
  incidentTypes: { [key: string]: number };
  resolutionRate: number;
  activeReports: number;
  weeklyTrends: number[];
}

export default function AdvancedAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    responseTime: [8.2, 7.8, 9.1, 6.5, 8.9, 7.2, 8.5],
    incidentTypes: {
      'Traffic': 35,
      'Medical': 28,
      'Fire': 15,
      'Crime': 12,
      'Other': 10
    },
    resolutionRate: 94.2,
    activeReports: 142,
    weeklyTrends: [45, 52, 38, 61, 49, 58, 67]
  });

  const [selectedMetric, setSelectedMetric] = useState('overview');

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAnalyticsData(prev => ({
        ...prev,
        responseTime: prev.responseTime.map(time => 
          time + (Math.random() - 0.5) * 0.5
        ),
        activeReports: prev.activeReports + Math.floor(Math.random() * 3) - 1,
        resolutionRate: Math.max(90, Math.min(98, prev.resolutionRate + (Math.random() - 0.5) * 0.2))
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const responseTimeData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Response Time (minutes)',
        data: analyticsData.responseTime,
        borderColor: '#07D348',
        backgroundColor: 'rgba(7, 211, 72, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#07D348',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
      },
    ],
  };

  const incidentTypeData = {
    labels: Object.keys(analyticsData.incidentTypes),
    datasets: [
      {
        data: Object.values(analyticsData.incidentTypes),
        backgroundColor: [
          '#07D348',
          '#24fe41',
          '#fdfc47',
          '#ff6b6b',
          '#4ecdc4',
        ],
        borderWidth: 0,
        hoverOffset: 10,
      },
    ],
  };

  const weeklyTrendsData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7'],
    datasets: [
      {
        label: 'Reports Filed',
        data: analyticsData.weeklyTrends,
        backgroundColor: 'rgba(7, 211, 72, 0.8)',
        borderColor: '#07D348',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#07D348',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#ffffff',
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#ffffff',
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#ffffff',
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#07D348',
        borderWidth: 1,
      },
    },
  };

  const metrics = [
    {
      id: 'overview',
      title: 'Overview',
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
    },
    {
      id: 'response',
      title: 'Response Time',
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    },
    {
      id: 'incidents',
      title: 'Incident Types',
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /></svg>
    },
    {
      id: 'trends',
      title: 'Weekly Trends',
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
    }
  ];

  return (
    <div className="space-y-6">
      {/* Metric Selector */}
      <div className="flex flex-wrap gap-2">
        {metrics.map((metric) => (
          <motion.button
            key={metric.id}
            onClick={() => setSelectedMetric(metric.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              selectedMetric === metric.id
                ? 'bg-[#07D348] text-white shadow-lg shadow-[#07D348]/30'
                : 'bg-zinc-800/50 text-zinc-300 hover:bg-zinc-700/50'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {metric.icon}
            <span className="text-sm font-medium">{metric.title}</span>
          </motion.button>
        ))}
      </div>

      {/* Analytics Content */}
      <motion.div
        key={selectedMetric}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="grid gap-6"
      >
        {selectedMetric === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-zinc-900/50 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">Active Reports</h3>
                <motion.div
                  className="w-3 h-3 bg-[#07D348] rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <div className="text-3xl font-bold text-[#07D348] mb-2">
                {analyticsData.activeReports}
              </div>
              <div className="text-sm text-zinc-400">
                +12% from last week
              </div>
            </div>

            <div className="bg-zinc-900/50 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
              <h3 className="text-white font-semibold mb-4">Resolution Rate</h3>
              <div className="text-3xl font-bold text-[#24fe41] mb-2">
                {analyticsData.resolutionRate.toFixed(1)}%
              </div>
              <div className="text-sm text-zinc-400">
                +2.3% improvement
              </div>
            </div>

            <div className="bg-zinc-900/50 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
              <h3 className="text-white font-semibold mb-4">Avg Response</h3>
              <div className="text-3xl font-bold text-[#fdfc47] mb-2">
                {analyticsData.responseTime[analyticsData.responseTime.length - 1].toFixed(1)}m
              </div>
              <div className="text-sm text-zinc-400">
                -15% faster today
              </div>
            </div>
          </div>
        )}

        {selectedMetric === 'response' && (
          <div className="bg-zinc-900/50 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
            <h3 className="text-white font-semibold mb-6">Response Time Trends</h3>
            <div className="h-80">
              <Line data={responseTimeData} options={chartOptions} />
            </div>
          </div>
        )}

        {selectedMetric === 'incidents' && (
          <div className="bg-zinc-900/50 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
            <h3 className="text-white font-semibold mb-6">Incident Distribution</h3>
            <div className="h-80">
              <Doughnut data={incidentTypeData} options={doughnutOptions} />
            </div>
          </div>
        )}

        {selectedMetric === 'trends' && (
          <div className="bg-zinc-900/50 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
            <h3 className="text-white font-semibold mb-6">Weekly Report Trends</h3>
            <div className="h-80">
              <Bar data={weeklyTrendsData} options={chartOptions} />
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}