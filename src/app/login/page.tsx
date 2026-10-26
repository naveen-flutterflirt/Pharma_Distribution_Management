"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setIsLoading(true);

    // Simulate login
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/");
      }, 500);
    }, 800);
  };

  const handleFillDemo = () => {
    setEmail("admin@pharma.com");
    setPassword("admin123");
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 min-h-screen w-full flex items-center justify-center bg-[#f4f7f6] p-4 sm:p-6 overflow-y-auto">
      {/* Background ambient pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#178582_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.07] pointer-events-none" />

      {/* Login Card */}
      <div className="relative w-full max-w-[420px] bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 sm:p-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Brand Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#0c2427] text-white shadow-md shadow-[#0c2427]/20 mb-4">
            <span className="text-2xl font-bold text-[#178582]">+</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Sign in to DMS
          </h1>
          <p className="text-sm text-gray-500 mt-1.5">
            Pharma Distribution Management System
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
            {error}
          </div>
        )}

        {/* Success Alert */}
        {isSuccess && (
          <div className="mb-5 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Success! Redirecting to dashboard...</span>
          </div>
        )}

        {/* Simple Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full pl-10 pr-3.5 py-2.5 bg-white rounded-lg border border-gray-300 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#178582]/20 focus:border-[#178582] transition-colors shadow-2xs"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-gray-700">
                Password
              </label>
              <button
                type="button"
                onClick={() => alert("Password reset link will be sent to your administrator.")}
                className="text-xs font-medium text-[#178582] hover:underline cursor-pointer"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-white rounded-lg border border-gray-300 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#178582]/20 focus:border-[#178582] transition-colors shadow-2xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-600 cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember me */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-[#178582] focus:ring-[#178582] border-gray-300 cursor-pointer"
              />
              <span className="text-xs text-gray-600 font-medium">Remember me</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || isSuccess}
            className="w-full py-2.5 px-4 mt-2 rounded-lg bg-[#178582] hover:bg-[#136e6b] active:bg-[#0f5956] text-white text-sm font-semibold shadow-sm shadow-[#178582]/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign in</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Auto-fill Helper */}
        <div className="mt-6 pt-5 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-500">
            Testing the app?{" "}
            <button
              type="button"
              onClick={handleFillDemo}
              className="font-semibold text-[#178582] hover:underline cursor-pointer"
            >
              Auto-fill demo credentials
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
