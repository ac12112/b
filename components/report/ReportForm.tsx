"use client";

import { useState, useCallback } from "react";
import { LocationInput } from "./LocationInput";
import crypto from "crypto";
import Image from "next/image";

const REPORT_TYPES = [
  "Theft",
  "Fire Outbreak",
  "Medical Emergency",
  "Natural Disaster",
  "Violence",
  "Other",
] as const;

type ReportType = "EMERGENCY" | "NON_EMERGENCY";

interface ReportData {
  reportId: string;
  type: ReportType;
  specificType: string;
  title: string;
  description: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  image: string | null;
  status: string;
}

interface ReportFormProps {
  onComplete: (data: ReportData) => void;
}

interface ImageAnalysisResult {
  title: string;
  description: string;
  reportType: string;
}

export function ReportForm({ onComplete }: ReportFormProps) {
  const [formData, setFormData] = useState({
    incidentType: "" as ReportType,
    specificType: "",
    location: "",
    description: "",
    title: "",
  });
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [coordinates, setCoordinates] = useState<{
    latitude: number | null;
    longitude: number | null;
  }>({
    latitude: null,
    longitude: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contentWarning, setContentWarning] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log("=== IMAGE UPLOAD STARTED ===");
    console.log("File name:", file.name);
    console.log("File size:", file.size);
    console.log("File type:", file.type);

    setIsAnalyzing(true);

    try {
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            resolve(reader.result);
          }
        };
        reader.readAsDataURL(file);
      });

      console.log("Base64 conversion complete, calling API...");
      const response = await fetch("/api/analyze-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64 }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("=== API RESPONSE RECEIVED ===");
        console.log("Response data:", data);

        // Check if we have valid data
        if (data && typeof data === 'object') {
          console.log("=== UPDATING FORM DATA ===");
          console.log("Title:", data.title);
          console.log("Description:", data.description);
          console.log("Report Type:", data.reportType);
          
          setFormData((prev) => ({
            ...prev,
            title: data.title || prev.title,
            description: data.description || prev.description,
            specificType: data.reportType || prev.specificType,
          }));
          console.log("Form data updated successfully");
        } else {
          console.log("Invalid response data structure:", data);
        }
      } else {
        console.log("API response not OK:", response.status, response.statusText);
      }
      
      setImage(base64);
    } catch (error) {
      console.error("Error analyzing image:", error);
      // Still set the image even if analysis fails
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateReportId = useCallback(() => {
    const timestamp = Date.now().toString();
    const randomBytes = crypto.randomBytes(16).toString("hex");
    const combinedString = `${timestamp}-${randomBytes}`;
    return crypto
      .createHash("sha256")
      .update(combinedString)
      .digest("hex")
      .slice(0, 16);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Comprehensive list of inappropriate terms
    const blockedTerms = [
      // Funny/joking terms
      "funny", "joke", "lol", "haha", "prank", "troll",
      // Adult content
      "adult", "explicit", "nsfw", "porn", "sex", "nude",
      // Toxic terms
      "hate", "stupid", "idiot", "loser", "dumb", "moron",
      // Common slang/offensive terms
      "damn", "hell", "crap", "shit", "fuck", "asshole", "bitch"
    ];

    // Check both title and description for inappropriate content
    const textToCheck = `${formData.title.toLowerCase()} ${formData.description.toLowerCase()}`;
    const foundTerm = blockedTerms.find(term => textToCheck.includes(term));

    if (foundTerm) {
      setContentWarning(`Inappropriate content detected: "${foundTerm}". Please use professional and relevant language.`);
      return;
    }

    setIsSubmitting(true);

    try {
      const reportData = {
        reportId: generateReportId(),
        type: formData.incidentType,
        specificType: formData.specificType,
        title: formData.title,
        description: formData.description,
        location: formData.location,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        image: image,
        status: "PENDING",
      };

      const response = await fetch("/api/reports/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reportData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit report");
      }

      onComplete(result);
    } catch (error) {
      console.error("Error submitting report:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Emergency Type Selection */}
      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() =>
            setFormData((prev) => ({ ...prev, incidentType: "EMERGENCY" }))
          }
          className={`p-6 rounded-2xl border-2 transition-all duration-200 ${
            formData.incidentType === "EMERGENCY"
              ? "bg-red-500/20 border-red-500 shadow-lg shadow-red-500/20"
              : "bg-zinc-900/50 border-zinc-800 hover:bg-red-500/10 hover:border-red-500/50"
          }`}
        >
          <div className="flex flex-col items-center space-y-2">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span className="font-medium text-red-500">Emergency</span>
            <span className="text-xs text-zinc-400">
              Immediate Response Required
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() =>
            setFormData((prev) => ({ ...prev, incidentType: "NON_EMERGENCY" }))
          }
          className={`p-6 rounded-2xl border-2 transition-all duration-200 ${
            formData.incidentType === "NON_EMERGENCY"
              ? "bg-orange-500/20 border-orange-500 shadow-lg shadow-orange-500/20"
              : "bg-zinc-900/50 border-zinc-800 hover:bg-orange-500/10 hover:border-orange-500/50"
          }`}
        >
          <div className="flex flex-col items-center space-y-2">
            <svg
              className="w-8 h-8 text-orange-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="font-medium text-orange-500">Non-Emergency</span>
            <span className="text-xs text-zinc-400">General Report</span>
          </div>
        </button>
      </div>

      {/* Image Upload */}
      <div className="relative group">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className="block w-full p-8 border-2 border-dashed border-zinc-700 rounded-2xl 
                   hover:border-[#07D348] hover:bg-green-600/5 transition-all duration-200
                   cursor-pointer text-center"
        >
          {image ? (
            <div className="space-y-4">
              <div className="w-full h-48 relative rounded-lg overflow-hidden">
                <Image
                  src={image}
                  alt="Upload preview"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <p className="text-sm text-zinc-400">Click to change image</p>
            </div>
          ) : (
            <div className="space-y-4">
              <svg
                className="mx-auto h-12 w-12 text-zinc-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-sm text-zinc-400">
                Drop an image here or click to upload
              </p>
            </div>
          )}
        </label>
        {isAnalyzing && (
          <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <svg
                className="animate-spin h-5 w-5 text-[#07D348]"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span className="text-[#07D348] font-medium">
                Analyzing image...
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Specific Report Type */}
      <div className="relative group">
        <label className="block text-sm font-medium text-zinc-300 mb-3 ml-1.5">
          Incident Type <span className="text-[#07D348]">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#07D348]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <select
            value={formData.specificType}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, specificType: e.target.value }))
            }
            className="w-full rounded-xl bg-zinc-900/50 border-2 border-zinc-700 px-4 py-3.5
                     text-white transition-all duration-300
                     focus:outline-none focus:border-[#07D348]/60 focus:ring-2 focus:ring-[#07D348]/30
                     hover:border-[#07D348]/40 appearance-none backdrop-blur-sm
                     [&>option]:bg-zinc-800 [&>option]:text-white"
            required
          >
            <option value="" disabled className="text-zinc-400">
              Select incident type
            </option>
            {REPORT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg
              className="w-5 h-5 text-[#07D348]"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="relative group">
        <LocationInput
          value={formData.location}
          onChange={(value) => setFormData(prev => ({ ...prev, location: value }))}
          onCoordinatesChange={(lat, lng) => setCoordinates({ latitude: lat, longitude: lng })}
          className="border-zinc-700 hover:border-[#07D348]/40 focus-within:border-[#07D348] focus-within:ring-2 focus-within:ring-[#07D348]/30"
        />
      </div>

      {/* Title */}
      <div className="relative group">
        <label className="block text-sm font-medium text-zinc-300 mb-2 ml-1">
          Report Title <span className="text-[#07D348]">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#07D348]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <input
            type="text"
            value={formData.title}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, title: e.target.value }));
              setContentWarning(null);
            }}
            className="w-full rounded-xl bg-zinc-900/50 border-2 border-zinc-700 px-4 py-3.5
                     text-white transition-all duration-300
                     focus:outline-none focus:border-[#07D348]/60 focus:ring-2 focus:ring-[#07D348]/30
                     hover:border-[#07D348]/40 backdrop-blur-sm"
            required
          />
        </div>
      </div>

      {/* Description with Warning */}
      <div className="relative group">
        <label className="block text-sm font-medium text-zinc-300 mb-2 ml-1">
          Description <span className="text-[#07D348]">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#07D348]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <textarea
            value={formData.description}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, description: e.target.value }));
              setContentWarning(null);
            }}
            rows={4}
            className="w-full rounded-xl bg-zinc-900/50 border-2 border-zinc-700 px-4 py-3.5
                     text-white transition-all duration-300
                     focus:outline-none focus:border-[#07D348]/60 focus:ring-2 focus:ring-[#07D348]/30
                     hover:border-[#07D348]/40 backdrop-blur-sm"
            required
          />
        </div>
        {contentWarning && (
          <div className="mt-2 text-sm text-red-500 bg-red-500/10 p-3 rounded-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
            <svg
              className="w-5 h-5 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>{contentWarning}</span>
            <button
              onClick={() => setContentWarning(null)}
              className="ml-auto text-red-300 hover:text-red-100"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full relative group overflow-hidden rounded-xl bg-gradient-to-br from-[#07D348] to-[#24fe41] 
                 px-6 py-4 text-sm font-medium text-white shadow-lg shadow-[#07D348]/20
                 transition-all duration-300 hover:shadow-[#07D348]/30 hover:scale-[1.02]
                 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="relative z-10 flex items-center justify-center gap-2">
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <span>Submit Report</span>
              <svg
                className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </>
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#07D348]/30 to-[#24fe41]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-30">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
      </button>
    </form>
  );
}