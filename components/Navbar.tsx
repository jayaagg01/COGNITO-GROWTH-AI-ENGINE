
import React from 'react';
import { View } from '../types';

interface NavbarProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div 
          className="flex items-center space-x-2 cursor-pointer group"
          onClick={() => onNavigate('home')}
        >
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform shadow-lg shadow-blue-500/20">
            <span className="font-bold text-white">C</span>
          </div>
          <span className="text-xl font-bold tracking-tight">
            Cognito <span className="text-blue-500">Growth</span>
          </span>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          {[
            { id: 'website-builder', label: 'Website Builder' },
            { id: 'ad-generator', label: 'Ad Creatives' },
            { id: 'pricing', label: 'Pricing' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as View)}
              className={`text-sm font-medium transition-colors hover:text-blue-400 ${
                currentView === item.id ? 'text-blue-400' : 'text-slate-400'
              }`}
            >
              {item.label}
            </button>
          ))}
          
          <button 
            onClick={() => onNavigate('pricing')}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full text-xs font-bold transition-all shadow-lg shadow-blue-500/20"
          >
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
