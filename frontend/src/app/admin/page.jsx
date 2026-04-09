"use client";
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Users, Activity, ShieldCheck, HeartPulse, Terminal, MessageSquare, Star } from 'lucide-react';

export default function AdminMonitoring() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!localStorage.getItem('token') || user.role !== 'admin') {
      toast.error("Unauthorized! Admins only.");
      router.push('/dashboard');
      return;
    }
    fetchStats();
    const interval = setInterval(fetchStats, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/stats", {
        headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` }
      });
      const result = await res.json();
      if (res.status === 403) {
         toast.error("Forbidden access");
         router.push('/dashboard');
      } else {
         setData(result);
      }
    } catch (err) {
      toast.error("Sync error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center font-mono text-emerald-500">ROOT@CYBERGUARD:~/ ACCESSING_STATS...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tighter flex items-center gap-3">
              <Terminal className="text-emerald-500" /> ADMIN TERMINAL
            </h1>
            <p className="text-zinc-500 font-mono text-sm">SECURE_LEVEL: ALFA-9 | ENCRYPTION: AES-256</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-emerald-500 text-xs font-bold uppercase">Health: {data?.systemHealth}</span>
            </div>
            <div className="bg-zinc-900 border border-white/5 px-4 py-2 rounded-xl flex items-center gap-2">
              <span className="text-zinc-500 text-xs font-bold uppercase">Uptime: {data?.uptime}</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <MetricCard title="Total Scans" value={data?.stats?.emailsMonitored} icon={<Users />} color="text-emerald-500" />
          <MetricCard title="Breaches" value={data?.stats?.breachesFound} icon={<Activity />} color="text-red-500" />
          <MetricCard title="Passwords" value={data?.stats?.passwordsAnalyzed} icon={<ShieldCheck />} color="text-blue-500" />
          <MetricCard title="Users" value={data?.usersCount} icon={<HeartPulse />} color="text-purple-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-xl">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-zinc-300"><LayoutDashboard className="w-5 h-5" /> Activity Stream</h2>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {data?.logs?.map((log, i) => (
                  <div key={i} className="bg-white/5 p-4 rounded-2xl flex justify-between items-center text-sm border border-transparent hover:border-white/10 transition-all">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-black/40 ${log.color}`}>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={log.icon} /></svg>
                      </div>
                      <div>
                        <p className="font-bold">{log.action}</p>
                        <p className="text-zinc-500 text-xs">{log.status}</p>
                      </div>
                    </div>
                    <span className="text-zinc-600 font-mono text-[10px]">{new Date(log.createdAt).toLocaleTimeString()}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-6">
               <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-zinc-300"><MessageSquare className="w-5 h-5" /> User Feedback</h2>
               <div className="grid md:grid-cols-2 gap-4">
                  {data?.feedbacks?.map((f, i) => (
                    <div key={i} className="bg-black/40 border border-white/5 p-4 rounded-2xl space-y-2">
                       <div className="flex justify-between items-center">
                          <p className="font-bold text-xs text-white">{f.user?.fullName || 'Anonymous'}</p>
                          <div className="flex gap-0.5 text-yellow-500">
                             {[...Array(f.rating || 5)].map((_, j) => <Star key={j} className="w-3 h-3 fill-current" />)}
                          </div>
                       </div>
                       <p className="text-xs font-black uppercase text-zinc-600 mb-1">{f.subject}</p>
                       <p className="text-sm text-zinc-400 italic">"{f.message}"</p>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          <div className="space-y-6">
             <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-6">
                <h2 className="text-lg font-bold mb-4">Core Recommendations</h2>
                <div className="space-y-3">
                   <RecommendationItem text="RapidAPI Endpoint Sync" status="Pending" />
                   <RecommendationItem text="K-Anonymity Verified" status="Verified" />
                   <RecommendationItem text="JWT Secret Rotation" status="Active" />
                </div>
             </div>
             
             <div className="bg-gradient-to-br from-red-500/10 to-transparent border border-red-500/10 rounded-3xl p-6">
                <h2 className="text-lg font-bold mb-2">Security Note</h2>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  [Data Protection Module] All user data is encrypted. Admins cannot view raw passwords. Data leaks are monitored 24/7 via HIBP integration.
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, color }) {
  return (
    <div className="bg-zinc-900/40 border border-white/5 p-6 rounded-3xl flex items-center justify-between">
      <div>
        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">{title}</p>
        <p className="text-3xl font-black">{value || 0}</p>
      </div>
      <div className={`p-4 rounded-2xl bg-white/5 ${color}`}>
        {icon}
      </div>
    </div>
  );
}

function RecommendationItem({ text, status }) {
  return (
    <div className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-white/5">
      <span className="text-xs text-zinc-300">{text}</span>
      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${status === 'Verified' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
        {status}
      </span>
    </div>
  );
}
