'use client';

export default function ClientOnlyGradient() {
  return (
    <div className="fixed inset-0 -z-10 min-h-screen">
      <div className="absolute inset-0 h-full bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.03),transparent_50%)]" />
      <div className="absolute inset-0 h-full bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.04),transparent_70%)]" />
    </div>
  );
}