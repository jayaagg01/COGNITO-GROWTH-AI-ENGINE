
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import WebsiteBuilder from './components/WebsiteBuilder';
import AdGenerator from './components/AdGenerator';
import Pricing from './components/Pricing';
import { View } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');

  // Basic hash routing support
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as View;
      if (['home', 'website-builder', 'ad-generator', 'pricing'].includes(hash)) {
        setCurrentView(hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initial check

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (view: View) => {
    window.location.hash = view;
    setCurrentView(view);
    window.scrollTo(0, 0);
  };

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <Home onNavigate={navigate} />;
      case 'website-builder':
        return <WebsiteBuilder />;
      case 'ad-generator':
        return <AdGenerator />;
      case 'pricing':
        return <Pricing />;
      default:
        return <Home onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar currentView={currentView} onNavigate={navigate} />
      
      <main className="flex-1">
        {renderView()}
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 glass mt-auto px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center font-bold text-xs">C</div>
            <span className="font-bold">Cognito Growth</span>
          </div>
          <p className="text-slate-500 text-sm">© 2024 Cognito Growth. All rights reserved.</p>
          <div className="flex space-x-6 text-slate-400 text-sm">
            <a href="#" className="hover:text-blue-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Terms</a>
            <a href="tel:9958025783" className="hover:text-blue-400 transition-colors">+91 9958025783</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
