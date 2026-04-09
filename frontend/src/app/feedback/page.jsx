"use client";
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { MessageSquare, Star, Send, ShieldCheck, HeartPulse } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Feedback() {
  const router = useRouter();
  const [formData, setFormData] = useState({ subject: '', message: '', rating: 5 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      toast.error("Please login to give feedback");
      router.push('/login');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/feedback", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Feedback submitted successfully! Thank you.");
        setFormData({ subject: '', message: '', rating: 5 });
      } else {
        toast.error(data.error || "Submission failed");
      }
    } catch (err) {
      toast.error("Service error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 flex items-center justify-center">
      <div className="max-w-xl w-full">
        <div className="bg-zinc-900/60 border border-white/5 p-10 rounded-[2.5rem] shadow-2xl backdrop-blur-2xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px]" />
          
          <div className="text-center mb-10 relative">
            <div className="inline-flex p-4 rounded-3xl bg-emerald-500/10 text-emerald-500 mb-4">
              <MessageSquare className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white">System Feedback</h1>
            <p className="text-zinc-500 text-sm mt-1 px-4">Your input helps us improve CyberGuard KI's breach detection algorithms.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 relative">
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2 block">Subject</label>
              <input 
                type="text" 
                placeholder="Scanner performance, UI bug, etc." 
                className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 focus:border-emerald-500/50 outline-none transition-all"
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2 block">Message</label>
              <textarea 
                rows="4"
                placeholder="Share your experience with us..." 
                className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 focus:border-emerald-500/50 outline-none transition-all resize-none"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2 block">Rating</label>
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button 
                    key={num}
                    type="button"
                    onClick={() => setFormData({...formData, rating: num})}
                    className={`flex-1 py-3 rounded-xl border transition-all text-sm font-black ${formData.rating >= num ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-black/20 border-white/5 text-zinc-600'}`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-white text-black font-black py-5 rounded-3xl hover:bg-emerald-500 hover:text-black transition-all flex items-center justify-center gap-3 disabled:opacity-50 group"
            >
              {loading ? 'Transmitting...' : (
                <>
                  Send Feedback <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 flex items-center justify-center gap-8 border-t border-white/5 pt-8 opacity-40">
             <ShieldCheck className="w-5 h-5" />
             <HeartPulse className="w-5 h-5" />
             <Star className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
}
