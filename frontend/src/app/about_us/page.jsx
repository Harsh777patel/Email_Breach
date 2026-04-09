export default function AboutUs() {
  return (
    <div className="flex-1 flex flex-col items-center p-4 py-20">
      <div className="max-w-4xl w-full text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-6">
          About CyberGuard KI
        </h1>
        <p className="text-xl text-gray-400 leading-relaxed">
          We are a team of security researchers, ethical hackers, and artificial intelligence engineers dedicated to making the internet safer.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl w-full">
        <div className="bg-zinc-900/40 backdrop-blur-sm border border-white/10 p-10 rounded-3xl">
          <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            CyberGuard KI was founded with a single mission: to democratize elite-level digital security. In an era where data breaches affect millions daily, we believe everyone deserves access to enterprise-grade threat intelligence and protection tools.
          </p>
          <p className="text-gray-400 leading-relaxed">
            By combining advanced Artificial Intelligence (KI) with comprehensive dark web monitoring, we provide proactive defense mechanisms against identity theft and credential stuffing attacks.
          </p>
        </div>

        <div className="bg-zinc-900/40 backdrop-blur-sm border border-white/10 p-10 rounded-3xl">
          <h2 className="text-2xl font-bold text-white mb-4">Why AI (KI)?</h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            Traditional security tools rely on static rules. Our KI engine dynamically analyzes password strength against billions of known cracking patterns, simulating real-world brute force and dictionary attacks.
          </p>
          <ul className="space-y-4">
            {['Pattern recognition across billions of leaked records', 'Real-time threat assessment', 'Predictive vulnerability modeling'].map((item, i) => (
              <li key={i} className="flex items-start text-gray-300">
                <svg className="w-5 h-5 text-purple-500 mr-3 mt-1 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
