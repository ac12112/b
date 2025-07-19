"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid credentials");
      } else {
        router.push("/dashboard");
      }
    } catch (_error) {  // Fixed unused variable warning
      setError("An error occurred during sign in");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-neutral-900 flex flex-col justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Green animated background elements */}
      <div className="absolute -top-32 -left-32 w-64 h-64 bg-gradient-to-r from-[#07D348]/20 to-[#24fe41]/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-gradient-to-r from-[#07D348]/20 to-[#24fe41]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-white bg-clip-text text-transparent mb-2 animate-gradient">
            CivicSafe Portal
          </h1>
          <p className="text-sm text-neutral-400 tracking-wide font-medium">
            Secure access to safety dashboard
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-neutral-900/50 backdrop-blur-xl border border-[#07D348]/20 rounded-2xl p-8 shadow-2xl shadow-[#07D348]/10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300 flex items-center gap-2">
                <svg className="w-4 h-4 text-[#07D348]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-neutral-900 border border-[#07D348]/20 rounded-xl text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-[#07D348] focus:ring-2 focus:ring-[#07D348]/30 transition-all"
                placeholder="name@company.com"
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300 flex items-center gap-2">
                <svg className="w-4 h-4 text-[#07D348]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-neutral-900 border border-[#07D348]/20 rounded-xl text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-[#07D348] focus:ring-2 focus:ring-[#07D348]/30 transition-all"
                placeholder="••••••••"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-900/20 border border-red-800/50 rounded-xl text-red-400 text-sm flex items-center gap-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-6 bg-gradient-to-r from-[#07D348] to-[#24fe41] rounded-xl text-sm font-semibold text-white hover:shadow-lg hover:shadow-[#07D348]/30 relative overflow-hidden transition-all disabled:opacity-50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity"></div>
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Authenticating...
                </div>
              ) : (
                "Sign In →"
              )}
            </button>

            {/* Signup Link */}
            <p className="text-center text-sm text-neutral-500">
              Need an account?{" "}
              <a 
                href="/auth/signup" 
                className="text-[#24fe41] hover:text-[#07D348] underline underline-offset-4 decoration-dotted transition-colors"
              >
                Request access
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}