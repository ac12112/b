"use client";
import { useState } from "react";
import { ReportForm } from "./ReportForm";
import { ReportSubmitted } from "./ReportFormCompleted";
import VoiceReporting from "@/components/advanced/VoiceReporting";
import type { ReportData } from "@/types";

export function ReportWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [reportingMethod, setReportingMethod] = useState<'form' | 'voice'>('form');
  const [reportData, setReportData] = useState<Partial<ReportData>>({});

  const handleStepComplete = (data: ReportData) => {
    setReportData(prev => ({ ...prev, ...data }));
    if (currentStep === 4) return;
    setCurrentStep(prev => prev + 1);
  };

  const handleVoiceComplete = (voiceData: any) => {
    setReportData(prev => ({
      ...prev,
      description: voiceData.transcription,
      title: voiceData.transcription.split('.')[0] || 'Voice Report'
    }));
    setReportingMethod('form');
  };
  return (
    <div className="rounded-2xl bg-zinc-900/50 backdrop-blur-xl border border-white/10 p-8">
      {/* Method Selection */}
      {currentStep === 1 && reportingMethod === 'form' && (
        <div className="mb-8">
          <h3 className="text-xl font-bold text-white mb-6 text-center">Choose Reporting Method</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => setReportingMethod('form')}
              className="p-6 bg-gradient-to-r from-[#07D348]/20 to-[#24fe41]/10 border-2 border-[#07D348] rounded-xl text-left group hover:from-[#07D348]/30 hover:to-[#24fe41]/20 transition-all"
            >
              <div className="flex items-center gap-4">
                <svg className="w-8 h-8 text-[#07D348]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <div>
                  <h4 className="text-white font-semibold">Text Form</h4>
                  <p className="text-zinc-400 text-sm">Fill out a detailed form</p>
                </div>
              </div>
            </button>
            
            <button
              onClick={() => setReportingMethod('voice')}
              className="p-6 bg-zinc-800/50 border-2 border-zinc-700 rounded-xl text-left group hover:border-[#07D348]/50 hover:bg-zinc-700/50 transition-all"
            >
              <div className="flex items-center gap-4">
                <svg className="w-8 h-8 text-zinc-400 group-hover:text-[#07D348]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                <div>
                  <h4 className="text-white font-semibold">Voice Report</h4>
                  <p className="text-zinc-400 text-sm">Speak your report aloud</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      )}

      {reportingMethod === 'voice' && (
        <VoiceReporting onComplete={handleVoiceComplete} />
      )}
      
      {currentStep === 1 && <ReportForm onComplete={handleStepComplete} />}
      {currentStep === 2 && reportData && (
        <ReportSubmitted 
          data={reportData as ReportData} 
          onComplete={handleStepComplete} 
        />
      )}
    </div>
  );
}