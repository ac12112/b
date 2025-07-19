// components/SecureBadge.tsx
'use client';

export default function SecureBadge() {
  return (
    <div className="inline-flex h-10 items-center gap-2 rounded-full border border-[#07D348]/30 bg-[#07D348]/10 px-5 text-sm text-[#07D348] backdrop-blur-sm transition-all hover:border-[#07D348]/50 hover:bg-[#07D348]/20 animate-fade-in">
      <svg
        className="h-4 w-4"
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
      Secure & Anonymous
    </div>
  );
}