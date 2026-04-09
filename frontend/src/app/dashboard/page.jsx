"use client";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function Dashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({ emailsMonitored: 0, breachesFound: 0, passwordsAnalyzed: 0 });
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetch("http://localhost:5000/api/dashboard", {
       headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.stats) setStats(data.stats);
        if (data.activities) setActivities(data.activities);
        setLoading(false);
      })
      .catch(err => {
        toast.error("Session expired. Please login again.");
        router.push('/login');
      });
  }, []);

  return (
    <div className="flex-1 flex flex-col p-6 lg:p-10 max-w-7xl mx-auto w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black italic text-white mb-2 uppercase tracking-tighter">KI User Dashboard</h1>
          <p className="text-gray-400">Welcome back. Monitoring your digital perimeter.</p>
        </div>
        <Link href="/feedback" className="px-6 py-3 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-500 text-sm font-bold transition-all">
          Provide Feedback
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
         <StatCard title="Emails Scanned" value={stats.emailsMonitored} color="text-blue-400" bgColor="bg-blue-500/20" icon="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
         <StatCard title="Breaches Found" value={stats.breachesFound} color="text-red-400" bgColor="bg-red-500/20" icon="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
         <StatCard title="Pass-Checks" value={stats.passwordsAnalyzed} color="text-emerald-400" bgColor="bg-emerald-500/20" icon="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
      </div>

      <div className="bg-zinc-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex-1 min-h-[300px]">
        <h3 className="text-xl font-bold text-white mb-6">Real-time Safety Feed</h3>
        <div className="space-y-4">
          {loading ? (
            <p className="text-gray-500 animate-pulse">Scanning server logs...</p>
          ) : activities.length === 0 ? (
            <p className="text-gray-500">No recent activity detected.</p>
          ) : (
            activities.map((activity, i) => (
              <div key={i} className="flex items-start justify-between p-4 bg-black/40 border border-white/5 rounded-xl hover:bg-white/5 transition-all">
                <div className="flex items-start gap-4">
                  <div className={`p-2 bg-white/5 rounded-lg`}>
                    <svg className={`w-5 h-5 ${activity.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={activity.icon} /></svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{activity.action}</h4>
                    <p className="text-xs text-gray-500">{activity.status}</p>
                  </div>
                </div>
                <span className="text-[10px] text-gray-600 font-mono">
                  {new Date(activity.createdAt).toLocaleTimeString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, color, bgColor, icon }) {
    return (
        <div className="bg-zinc-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{title}</p>
              <p className={`text-3xl font-black ${color}`}>{value || 0}</p>
            </div>
            <div className={`p-3 ${bgColor} rounded-xl`}>
              <svg className={`w-6 h-6 ${color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon} /></svg>
            </div>
          </div>
        </div>
    )
}
