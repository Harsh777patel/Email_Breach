"use client";
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { ShieldAlert, ShieldCheck, Zap, Hash, Activity } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PasswordAnalyzer() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [score, setScore] = useState(0); 
  const [feedback, setFeedback] = useState([]);
  const [breachCount, setBreachCount] = useState(null);
  const [isCheckingBreach, setIsCheckingBreach] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      toast.error("Please login to use analyzer");
      router.push('/login');
    }
  }, []);

  useEffect(() => {
    if (!password) {
      setScore(0);
      setFeedback([]);
      setBreachCount(null);
      return;
    }

    let currentScore = 0;
    let newFeedback = [];

    // [Password Input Validation Module & Pattern Check]
    if (password.length >= 8) currentScore += 25;
    else newFeedback.push("Minimum 8 characters required");

    if (password.length >= 12) currentScore += 15;

    if (/[A-Z]/.test(password)) currentScore += 15;
    else newFeedback.push("Add uppercase letters");

    if (/[a-z]/.test(password)) currentScore += 15;
    else newFeedback.push("Add lowercase letters");

    if (/[0-9]/.test(password)) currentScore += 15;
    else newFeedback.push("Add numbers");

    if (/[^A-Za-z0-9]/.test(password)) currentScore += 15;
    else newFeedback.push("Add special characters");

    // Dictionary/Common patterns [Pattern and Dictionary Check Module]
    const commonPasswords = ['password', '123456', 'qwerty', 'admin'];
    if (commonPasswords.includes(password.toLowerCase())) {
        currentScore = 10;
        newFeedback.push("This is a very common password!");
    }

    let finalScore = Math.min(100, currentScore);
    setScore(finalScore);
    setFeedback(newFeedback);

    // Call API for logging [Security Logging Module]
    const debouncer = setTimeout(() => {
      if (password.length > 5) {
        fetch('http://localhost:5000/api/check-password', {
          method: 'POST',
          headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ score: finalScore, feedback: newFeedback })
        }).catch(() => {});
      }
    }, 2000);

    return () => clearTimeout(debouncer);
  }, [password]);

  // [Breached Password Detection Module]
  const checkPasswordBreach = async () => {
    if (!password) return;
    setIsCheckingBreach(true);
    setBreachCount(null);
    
    try {
      const res = await fetch("http://localhost:5000/api/check-password-breach", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      setBreachCount(data.count || 0);
      
      if (data.isBreached) {
        toast.error(`Warning: This password was found in ${data.count} breaches!`);
      } else {
        toast.success("Safe! This password hasn't been leaked.");
      }
    } catch (err) {
      toast.error("Breach check service unavailable");
    } finally {
      setIsCheckingBreach(false);
    }
  };

  const getScoreColor = () => {
    if (score < 40) return 'text-red-500';
    if (score < 75) return 'text-yellow-500';
    return 'text-emerald-500';
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center">
      <div className="max-w-3xl w-full space-y-10 mt-12">
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-black italic tracking-tighter text-emerald-400 uppercase">
            PassVault Analyzer
          </h1>
          <p className="text-zinc-500 font-medium">
            [Password Strength Analysis Module & Breached Password Detection]
          </p>
        </div>

        <div className="bg-zinc-900/50 border border-white/5 p-8 rounded-[2rem] shadow-2xl backdrop-blur-xl">
          <div className="space-y-6">
            <div className="relative group">
              <input 
                type="password" 
                placeholder="Type your secret password..." 
                className="w-full bg-black/40 border-2 border-white/5 rounded-2xl px-8 py-6 text-2xl font-mono focus:border-emerald-500/50 outline-none transition-all placeholder:text-zinc-700"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="absolute top-1/2 -translate-y-1/2 right-6">
                <ShieldCheck className={`w-8 h-8 ${password ? getScoreColor() : 'text-zinc-800'}`} />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatItem label="Health Score" value={`${score}%`} color={getScoreColor()} />
              <StatItem label="Length" value={password.length} color="text-zinc-200" />
              <StatItem label="Complexity" value={score > 80 ? 'High' : score > 40 ? 'Mid' : 'Low'} color="text-zinc-200" />
              <StatItem label="Status" value={score > 75 ? 'Valid' : 'Weak'} color={getScoreColor()} />
            </div>

            <div className="h-4 bg-black/60 rounded-full overflow-hidden border border-white/5">
              <div 
                className={`h-full transition-all duration-1000 ease-out bg-gradient-to-r from-emerald-500 to-cyan-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]`}
                style={{ width: `${score}%` }}
              />
            </div>

            <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                  <Activity className="w-4 h-4" /> AI Feedback
                </h3>
                {password ? (
                  <div className="space-y-2">
                    {feedback.length > 0 ? feedback.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-zinc-400 bg-white/5 p-3 rounded-xl border border-white/5">
                        <Zap className="w-4 h-4 text-yellow-500" /> {f}
                      </div>
                    )) : (
                      <div className="flex items-center gap-2 text-sm text-emerald-400 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
                        <ShieldCheck className="w-4 h-4" /> Passphrase meets all safety standards.
                      </div>
                    )}
                  </div>
                ) : <p className="text-zinc-700 text-sm italic">Analysis will appear as you type...</p>}
              </div>

              <div className="w-full md:w-64 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" /> Leak Check
                </h3>
                <button 
                  onClick={checkPasswordBreach}
                  disabled={isCheckingBreach || !password}
                  className="w-full py-4 bg-white text-black font-black rounded-2xl hover:bg-emerald-400 hover:text-black transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isCheckingBreach ? 'Searching...' : 'Check Breaches'}
                </button>
                {breachCount !== null && (
                  <div className={`p-4 rounded-xl text-center border font-bold ${breachCount > 0 ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'}`}>
                    {breachCount > 0 ? `FOUND IN ${breachCount} LEAKS` : 'CLEAN PASS'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatItem({ label, value, color }) {
  return (
    <div className="bg-black/40 border border-white/5 p-4 rounded-2xl text-center">
      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter mb-1">{label}</p>
      <p className={`text-xl font-black ${color}`}>{value}</p>
    </div>
  );
}
