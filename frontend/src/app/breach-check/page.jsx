"use client";
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Shield, AlertTriangle, CheckCircle, Info, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function BreachCheck() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, safe, breached, error
  const [breaches, setBreaches] = useState([]);
  const [riskLevel, setRiskLevel] = useState('Low');
  const [recommendations, setRecommendations] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      toast.error("Please login to access scanner");
      router.push('/login');
    }
  }, []);

  const handleCheck = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus('loading');
    setRecommendations([]);
    
    try {
      const res = await fetch("http://localhost:5000/api/check-email", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}` // [API Integration Module]
        },
        body: JSON.stringify({ email })
      });
      
      if (!res.ok) {
         const errorData = await res.json();
         throw new Error(errorData.error || "Server responded with an error");
      }

      const data = await res.json();
      
      if (data.status === 'safe') {
        setStatus('safe');
        setRiskLevel('Low');
        toast.success("No breaches found!");
        fetchRecommendations('Low');
      } else if (data.status === 'breached') {
        setStatus('breached');
        setBreaches(data.breaches || []);
        setRiskLevel(data.riskLevel || 'Medium');
        toast.error(`Found in ${data.breaches.length} breaches!`);
        fetchRecommendations(data.riskLevel || 'Medium');
      }
    } catch (err) {
      console.error("ANALYSIS FAILED:", err);
      setStatus('error');
      setErrorMessage(err.message || "Service unavailable.");
      toast.error(`Scan failed: ${err.message}`);
    }
  };

  const fetchRecommendations = async (level) => {
    try {
      const res = await fetch(`http://localhost:5000/api/recommendations/${level}`);
      const data = await res.json();
      setRecommendations(data.recommendations);
    } catch (e) {}
  };

  const getRiskColor = (rl) => {
    switch(rl) {
      case 'Very High': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'High': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'Medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      default: return 'text-green-500 bg-green-500/10 border-green-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500">
            Email Breach Shield
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            [Email Breach Detection Module & Risk Assessment Module] <br/>
            Enter your email to analyze potential exposure in known data leaks.
          </p>
        </div>

        <section className="bg-zinc-900/40 border border-white/5 p-8 rounded-3xl backdrop-blur-md shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-3xl -z-10" />
          
          <form onSubmit={handleCheck} className="flex flex-col md:flex-row gap-4">
            <input 
              type="email" 
              placeholder="your@email.com" 
              className="flex-1 bg-black/60 border border-white/10 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-red-500 outline-none transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button 
              type="submit" 
              disabled={status === 'loading'}
              className="bg-white text-black font-bold px-8 py-4 rounded-2xl hover:bg-zinc-200 transition-transform active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {status === 'loading' ? 'Analyzing...' : 'Scan Now'}
            </button>
          </form>

          {status === 'safe' && (
            <div className="mt-10 p-6 rounded-2xl bg-green-500/5 border border-green-500/20 flex gap-4 animate-in fade-in slide-in-from-bottom-4">
              <CheckCircle className="text-green-500 w-8 h-8 shrink-0" />
              <div>
                <h3 className="text-xl font-bold text-green-400">Security Clearance: CLEAR</h3>
                <p className="text-zinc-400">This email was not found in our database of known breaches.</p>
              </div>
            </div>
          )}

          {status === 'breached' && (
            <div className="mt-10 space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/20 flex gap-4">
                <AlertTriangle className="text-red-500 w-8 h-8 shrink-0" />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-red-400">Exposure Detected!</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getRiskColor(riskLevel)}`}>
                      {riskLevel} RISK
                    </span>
                  </div>
                  <p className="text-zinc-400 mt-1">Found in {breaches.length} data breaches. Action required.</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* [Reporting Module] */}
                <div className="space-y-4">
                  <h4 className="text-lg font-bold flex items-center gap-2"><Shield className="w-5 h-5" /> Recommended Steps</h4>
                  <ul className="space-y-2">
                    {recommendations.map((rec, i) => (
                      <li key={i} className="flex gap-2 text-sm text-zinc-300 bg-white/5 p-3 rounded-xl border border-white/5">
                        <ArrowRight className="w-4 h-4 shrink-0 text-red-500" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-bold flex items-center gap-2 text-red-400">
                    <Info className="w-5 h-5" /> Data Leaked Locations
                  </h4>
                  <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                    {breaches.map((b, i) => (
                      <div key={i} className="group p-4 bg-zinc-900/80 rounded-2xl border border-white/5 hover:border-red-500/30 transition-all">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="block font-bold text-white text-base group-hover:text-red-400 transition-colors uppercase tracking-tight">
                              {b.Name}
                            </span>
                            <div className="flex gap-2 mt-1">
                               <span className="text-[10px] px-2 py-0.5 bg-red-500/10 text-red-500 rounded font-bold uppercase">Breach</span>
                               <span className="text-[10px] px-2 py-0.5 bg-white/5 text-zinc-500 rounded font-bold uppercase">{b.BreachDate}</span>
                            </div>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
                             <AlertTriangle className="w-4 h-4 text-red-500" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {breaches.length > 5 && (
                    <p className="text-center text-zinc-600 text-xs mt-2 italic font-medium">
                      Showing top results from secure databases...
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
