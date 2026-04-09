"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              CyberGuard KI
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {user ? (
                <>
                  <Link href="/breach-check" className="text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-md text-sm font-medium">
                    Email Breach
                  </Link>
                  <Link href="/password-analyzer" className="text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-md text-sm font-medium">
                    Analyzer
                  </Link>
                  <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-md text-sm font-medium">
                    Dashboard
                  </Link>
                  <Link href="/feedback" className="text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-md text-sm font-medium">
                    Feedback
                  </Link>
                  {user.role === 'admin' && (
                    <Link href="/admin" className="text-emerald-400 hover:text-emerald-300 px-3 py-2 rounded-md text-sm font-bold border border-emerald-500/20 bg-emerald-500/5">
                      Admin Panel
                    </Link>
                  )}
                </>
              ) : (
                <div className="flex items-center space-x-6">
                   <Link href="/" className="text-zinc-400 hover:text-white px-2 py-1 text-sm font-bold transition-all border-b-2 border-transparent hover:border-blue-500">HOME</Link>
                   <Link href="/breach-check" className="text-zinc-400 hover:text-white px-2 py-1 text-sm font-bold transition-all border-b-2 border-transparent hover:border-purple-500">SCANNER</Link>
                   <Link href="/pricing" className="text-zinc-400 hover:text-white px-2 py-1 text-sm font-bold transition-all border-b-2 border-transparent hover:border-pink-500">PRICING</Link>
                </div>
              )}
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <button 
                onClick={handleLogout}
                className="text-red-400 hover:text-red-300 text-sm font-medium"
              >
                Logout
              </button>
            ) : (
              <>
                <Link href="/login" className="text-gray-300 hover:text-white text-sm font-medium">Log in</Link>
                <Link href="/signup" className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium hover:opacity-90 transition-opacity">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
