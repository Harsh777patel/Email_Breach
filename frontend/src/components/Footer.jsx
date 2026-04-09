export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/50 backdrop-blur-lg mt-auto">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">CyberGuard KI</h2>
            <p className="mt-2 text-sm text-gray-400">
              Advanced threat intelligence. Protecting your digital life.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} CyberGuard KI. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
