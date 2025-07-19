"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VoiceReportingProps {
  onTranscription?: (text: string) => void;
  onComplete?: (report: any) => void;
}

export default function VoiceReporting({ onTranscription, onComplete }: VoiceReportingProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [audioLevel, setAudioLevel] = useState(0);
  const [recordingTime, setRecordingTime] = useState(0);
  const [error, setError] = useState('');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const animationRef = useRef<number | null>(null);

  // Initialize audio context and analyzer
  const initializeAudio = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      streamRef.current = stream;
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      analyserRef.current.fftSize = 256;
      
      return stream;
    } catch (err) {
      setError('Microphone access denied. Please allow microphone permissions.');
      throw err;
    }
  };

  // Monitor audio levels
  const monitorAudioLevel = () => {
    if (!analyserRef.current) return;
    
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    
    const updateLevel = () => {
      if (!analyserRef.current) return;
      
      analyserRef.current.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
      setAudioLevel(average / 255);
      
      if (isRecording) {
        animationRef.current = requestAnimationFrame(updateLevel);
      }
    };
    
    updateLevel();
  };

  // Start recording
  const startRecording = async () => {
    try {
      setError('');
      const stream = await initializeAudio();
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      const audioChunks: Blob[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        await processAudio(audioBlob);
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      // Start audio level monitoring
      monitorAudioLevel();
      
    } catch (err) {
      console.error('Failed to start recording:', err);
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      // Stop all tracks
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      // Close audio context
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    }
  };

  // Process audio with speech recognition
  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);
    
    try {
      // Simulate speech-to-text processing
      // In a real implementation, you would send this to a speech recognition service
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock transcription result
      const mockTranscriptions = [
        "There's a fire at the building on Main Street. Smoke is coming from the third floor.",
        "I witnessed a car accident at the intersection of Gulshan and Banani Road. Two vehicles are involved.",
        "There's a medical emergency at Dhaka Medical College. Someone collapsed in the parking lot.",
        "I'm reporting suspicious activity near the shopping mall. Multiple people acting strangely.",
        "There's flooding on the road near Dhanmondi Lake. Water level is rising rapidly."
      ];
      
      const randomTranscription = mockTranscriptions[Math.floor(Math.random() * mockTranscriptions.length)];
      setTranscription(randomTranscription);
      onTranscription?.(randomTranscription);
      
    } catch (err) {
      setError('Failed to process audio. Please try again.');
      console.error('Audio processing error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Format recording time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <div className="bg-zinc-900/50 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
      <div className="text-center space-y-6">
        <h3 className="text-2xl font-bold text-white mb-2">Voice Reporting</h3>
        <p className="text-zinc-400 mb-8">Speak your report and we'll convert it to text automatically</p>

        {/* Recording Button */}
        <div className="relative flex justify-center">
          <motion.button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isProcessing}
            className={`relative w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${
              isRecording 
                ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30' 
                : 'bg-gradient-to-r from-[#07D348] to-[#24fe41] hover:shadow-lg hover:shadow-[#07D348]/30'
            } disabled:opacity-50`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={isRecording ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 1, repeat: isRecording ? Infinity : 0 }}
          >
            {isProcessing ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 border-4 border-white border-t-transparent rounded-full"
              />
            ) : isRecording ? (
              <motion.div
                className="w-8 h-8 bg-white rounded-sm"
                animate={{ scale: [1, 0.8, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
            ) : (
              <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            )}

            {/* Audio level visualization */}
            {isRecording && (
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-white/30"
                animate={{ scale: 1 + audioLevel * 0.5 }}
                transition={{ duration: 0.1 }}
              />
            )}
          </motion.button>
        </div>

        {/* Recording Status */}
        <AnimatePresence>
          {isRecording && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-center gap-2 text-red-400">
                <motion.div
                  className="w-3 h-3 bg-red-500 rounded-full"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <span className="font-medium">Recording... {formatTime(recordingTime)}</span>
              </div>

              {/* Audio Waveform Visualization */}
              <div className="flex items-center justify-center gap-1 h-8">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-[#07D348] rounded-full"
                    animate={{
                      height: [4, 4 + audioLevel * 20 + Math.random() * 10, 4],
                    }}
                    transition={{
                      duration: 0.5,
                      repeat: Infinity,
                      delay: i * 0.05,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Processing Status */}
        <AnimatePresence>
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-[#07D348] font-medium"
            >
              Processing your voice report...
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Transcription Result */}
        <AnimatePresence>
          {transcription && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-6 p-4 bg-zinc-800/50 rounded-xl border border-zinc-700"
            >
              <h4 className="text-white font-medium mb-2">Transcription:</h4>
              <p className="text-zinc-300 text-left leading-relaxed">{transcription}</p>
              
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setTranscription('')}
                  className="px-4 py-2 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition-colors"
                >
                  Clear
                </button>
                <button
                  onClick={() => onComplete?.({ transcription })}
                  className="px-4 py-2 bg-gradient-to-r from-[#07D348] to-[#24fe41] text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  Use This Report
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Instructions */}
        {!isRecording && !isProcessing && !transcription && (
          <div className="text-sm text-zinc-400 space-y-2">
            <p>Click the microphone to start recording your report</p>
            <p>Speak clearly and describe the incident in detail</p>
            <p>Click again to stop recording and process your voice</p>
          </div>
        )}
      </div>
    </div>
  );
}