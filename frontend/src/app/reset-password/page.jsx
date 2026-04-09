"use client";
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function ResetForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({ email: searchParams.get('email') || '', code: '', newPassword: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData(prev => ({ ...prev, email: searchParams.get('email') || '' }));
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Password reset successfully!");
        router.push('/login');
      } else {
        toast.error(data.error || "Reset failed");
      }
    } catch (err) {
      toast.error("Service Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6 bg-black">
      <div className="w-full max-w-md bg-zinc-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-3xl">
        <h1 className="text-3xl font-black text-white mb-6 uppercase tracking-tighter italic">Reset Password</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 text-left">Email Address</label>
            <input 
              type="email" 
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full bg-black/50 border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-blue-500/50 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 text-left">Security Code (6 Digits)</label>
            <input 
              type="text" 
              required
              maxLength="6"
              value={formData.code}
              onChange={(e) => setFormData({...formData, code: e.target.value})}
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all tracking-[0.5em] text-center font-black"
              placeholder="000000"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 text-left">New Password</label>
            <input 
              type="password" 
              required
              value={formData.newPassword}
              onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="Enter new password"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-xl transition-all uppercase tracking-widest text-sm disabled:opacity-50 mt-4"
          >
            {loading ? "Resetting..." : "Update Password"}
          </button>
        </form>

        <div className="mt-8 text-center">
            <Link href="/login" className="text-xs font-bold text-gray-500 hover:text-white uppercase tracking-widest transition-colors">
                Cancel
            </Link>
        </div>
      </div>
    </div>
  );
}

export default function ResetPassword() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center p-20 text-white font-bold">Loading...</div>}>
      <ResetForm />
    </Suspense>
  )
}
