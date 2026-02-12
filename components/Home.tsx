
import React from 'react';
import { View } from '../types';

interface HomeProps {
  onNavigate: (view: View) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <div className="pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight">
          Scale Your Business with <br />
          <span className="gradient-text">Cognito Growth</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12">
          The ultimate AI-driven toolkit for high-performance marketing. Generate stunning websites and scroll-stopping ad creatives in seconds.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-20">
          <button 
            onClick={() => onNavigate('website-builder')}
            className="w-full md:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg transition-all transform hover:scale-105"
          >
            Launch Website Builder
          </button>
          <button 
            onClick={() => onNavigate('ad-generator')}
            className="w-full md:w-auto px-8 py-4 glass hover:bg-white/10 text-white rounded-xl font-bold text-lg transition-all"
          >
            Create Meta Ads
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <FeatureCard 
            title="Instant Websites"
            desc="Describe your business and get a conversion-optimized Tailwind landing page instantly."
            icon="🌐"
          />
          <FeatureCard 
            title="Edit in Preview"
            desc="No code? No problem. Edit text and images directly in the preview and watch the code update live."
            icon="✏️"
          />
          <FeatureCard 
            title="Ad Creative Suite"
            desc="Generate stunning visual assets for Meta Ads based on your core visual concepts."
            icon="🎨"
          />
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ title, desc, icon }: { title: string, desc: string, icon: string }) => (
  <div className="p-8 glass rounded-3xl border border-white/5 hover:border-blue-500/30 transition-all group">
    <div className="text-4xl mb-6 group-hover:scale-110 transition-transform">{icon}</div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-slate-400 leading-relaxed">{desc}</p>
  </div>
);

export default Home;
