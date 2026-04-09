import Link from 'next/link';

export default function Contact() {
  return (
    <div className="flex-1 flex flex-col items-center p-4 py-20">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Get in Touch
        </h1>
        <p className="text-lg text-gray-400">Have questions about our enterprise plans, KI tools, or want to report a vulnerability? We're here to help.</p>
      </div>

      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-5 gap-8">
        <div className="md:col-span-2 space-y-8">
          <div className="bg-zinc-900/40 border border-white/10 p-6 rounded-2xl">
            <h3 className="text-xl font-bold text-white mb-4">Enterprise Inquiries</h3>
            <p className="text-gray-400 mb-4">Interested in integrating CyberGuard KI into your organization?</p>
            <a href="mailto:enterprise@cyberguardki.com" className="text-blue-400 hover:text-blue-300 font-medium flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              enterprise@cyberguardki.com
            </a>
          </div>

          <div className="bg-zinc-900/40 border border-white/10 p-6 rounded-2xl">
            <h3 className="text-xl font-bold text-white mb-4">General Support</h3>
            <p className="text-gray-400 mb-4">Need help with your account or our tools?</p>
            <a href="mailto:support@cyberguardki.com" className="text-purple-400 hover:text-purple-300 font-medium flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              support@cyberguardki.com
            </a>
          </div>
        </div>

        <div className="md:col-span-3 bg-zinc-900/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl">
          <form className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
                <input type="text" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="John" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
                <input type="text" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="Doe" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
              <input type="email" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="you@example.com" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
              <textarea rows="4" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="How can we help you?"></textarea>
            </div>

            <button type="button" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
