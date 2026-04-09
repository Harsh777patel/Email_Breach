import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "CyberGuard KI - Breach & Password Analyzer",
  description: "Advanced email breach detection and password strength analyzer powered by AI.",
};

import { Toaster } from "react-hot-toast";

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-zinc-950 text-white selection:bg-purple-500/30">
        <Toaster position="top-right" />
        <Navbar />
        <main className="flex-1 pt-16 flex flex-col min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
