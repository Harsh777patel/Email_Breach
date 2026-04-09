import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-zinc-950 to-black overflow-hidden relative">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px] pointer-events-none"></div>
      
      <main className="z-10 flex flex-col items-center text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto py-20">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
          <span className="block text-white mb-2">Secure your</span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
            Digital Identity
          </span>
        </h1>
        
        <p className="mt-4 max-w-2xl text-xl text-gray-400 mb-12 leading-relaxed">
          Instantly check if your email has been compromised in data breaches, and analyze the strength of your passwords against advanced KI cracking algorithms.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 w-full max-w-lg justify-center">
          <Link
            href="/breach-check"
            className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white transition-all duration-200 bg-blue-600 border border-transparent rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 focus:ring-offset-zinc-900"
          >
            Check Email Breach
            <svg className="w-5 h-5 ml-2 -mr-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path></svg>
          </Link>
          
          <Link
            href="/password-analyzer"
            className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white transition-all duration-200 bg-zinc-800/50 border border-white/10 rounded-full hover:bg-zinc-800 hover:border-white/20 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-600 focus:ring-offset-zinc-900"
          >
            Analyze Password
            <svg className="w-5 h-5 ml-2 -mr-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
          </Link>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard title="Email Breach Check" desc="[Email Breach Detection Module & Risk Assessment Module]" />
          <FeatureCard title="Password Analysis" desc="[Password Strength & Pattern Check Modules]" />
          <FeatureCard title="Breach Monitoring" desc="[Breached Password Detection Module]" />
          <FeatureCard title="Security Logging" desc="[Security Logging & Data Encryption Modules]" />
          <FeatureCard title="Admin Control" desc="[Admin Monitoring & Reporting Modules]" />
          <FeatureCard title="RapidAPI Sync" desc="[API Integration Module & Real-time Alerts]" />
          <FeatureCard title="Auth Gateway" desc="[User Registration & Authentication Modules]" />
          <FeatureCard title="Privacy Shield" desc="[Data Protection & Privacy Module]" />
        </div>
      </main>
    </div>
  );
}

function FeatureCard({ title, desc }) {
  return (
    <div className="p-6 bg-white/[0.02] border border-white/[0.05] rounded-3xl backdrop-blur-sm hover:border-blue-500/30 transition-all text-left">
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-600 mb-2">Module Active</p>
      <p className="text-sm text-zinc-400">{desc}</p>
    </div>
  );
}
