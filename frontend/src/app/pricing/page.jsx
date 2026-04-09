import Link from 'next/link';

export default function Pricing() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 py-20">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-6">
          Simple, Transparent Pricing
        </h1>
        <p className="text-lg text-gray-400">Choose the right plan for your personal or enterprise digital security needs. Cancel anytime.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto w-full">
        {/* Basic Plan */}
        <div className="bg-zinc-900/40 backdrop-blur-sm border border-white/10 p-8 rounded-3xl flex flex-col items-start">
          <h3 className="text-2xl font-bold text-white mb-2">Basic</h3>
          <p className="text-gray-400 mb-6">Essential protection for individuals</p>
          <div className="text-4xl font-extrabold text-white mb-8">$0<span className="text-lg text-gray-500 font-normal">/mo</span></div>
          
          <ul className="space-y-4 mb-8 flex-1 w-full">
            {['Basic email breach checks (1/day)', 'Standard password analyzer', 'Public database access'].map((feature, i) => (
              <li key={i} className="flex items-center text-gray-300">
                <svg className="w-5 h-5 text-green-500 mr-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                {feature}
              </li>
            ))}
          </ul>
          
          <Link href="/signup" className="w-full py-4 rounded-xl text-center font-bold text-white bg-white/10 hover:bg-white/20 transition-colors border border-white/10">
            Get Started
          </Link>
        </div>

        {/* Pro Plan */}
        <div className="bg-gradient-to-b from-blue-900/40 to-purple-900/40 backdrop-blur-md border border-blue-500/30 p-8 rounded-3xl flex flex-col items-start relative transform md:-translate-y-4 shadow-2xl shadow-purple-500/20">
          <div className="absolute top-0 right-8 transform -translate-y-1/2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">Most Popular</div>
          <h3 className="text-2xl font-bold text-white mb-2">Pro KI</h3>
          <p className="text-blue-200/70 mb-6">Advanced KI-powered threat intelligence</p>
          <div className="text-4xl font-extrabold text-white mb-8">$12<span className="text-lg text-blue-200/50 font-normal">/mo</span></div>
          
          <ul className="space-y-4 mb-8 flex-1 w-full">
            {['Unlimited email breach checks', 'Advanced KI password cracking sim', 'Dark web continuous monitoring', 'Early threat alerts via SMS'].map((feature, i) => (
              <li key={i} className="flex items-center text-blue-50">
                <svg className="w-5 h-5 text-blue-400 mr-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                {feature}
              </li>
            ))}
          </ul>
          
          <Link href="/signup" className="w-full py-4 rounded-xl text-center font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/25">
            Start Free Trial
          </Link>
        </div>

        {/* Enterprise Plan */}
        <div className="bg-zinc-900/40 backdrop-blur-sm border border-white/10 p-8 rounded-3xl flex flex-col items-start">
          <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
          <p className="text-gray-400 mb-6">Full suite for corporate infrastructure</p>
          <div className="text-4xl font-extrabold text-white mb-8">$99<span className="text-lg text-gray-500 font-normal">/mo</span></div>
          
          <ul className="space-y-4 mb-8 flex-1 w-full">
            {['Domain-wide breach monitoring', 'API access to KI engine', 'Custom compliance reporting', '24/7 priority support', 'Dedicated security architect'].map((feature, i) => (
              <li key={i} className="flex items-center text-gray-300">
                <svg className="w-5 h-5 text-green-500 mr-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                {feature}
              </li>
            ))}
          </ul>
          
          <Link href="/contact" className="w-full py-4 rounded-xl text-center font-bold text-white bg-white/10 hover:bg-white/20 transition-colors border border-white/10">
            Contact Sales
          </Link>
        </div>
      </div>
    </div>
  );
}
