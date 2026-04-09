"use client";
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Code sent! Check console (Simulator)");
        router.push(`/reset-password?email=${email}`);
      } else {
        toast.error(data.error || "Failed to send code");
      }
    } catch (err) {
      toast.error("Server connection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6 bg-black">
      <div className="w-full max-w-md bg-zinc-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-3xl">
        <h1 className="text-3xl font-black text-white mb-6 uppercase tracking-tighter italic">Forgot Password</h1>
        <p className="text-gray-400 mb-8 text-sm">Enter your email and we'll send you a 6-digit security code.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 text-left">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="name@example.com"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-xl transition-all uppercase tracking-widest text-sm disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Code"}
          </button>
        </form>

        <div className="mt-8 text-center">
            <Link href="/login" className="text-xs font-bold text-gray-500 hover:text-white uppercase tracking-widest transition-colors">
                Back to Login
            </Link>
        </div>
      </div>
    </div>
  );
}
