
import React from 'react';

const Pricing: React.FC = () => {
  return (
    <div className="pt-24 px-6 max-w-7xl mx-auto pb-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
        <p className="text-slate-400">Scale your business with the plan that fits you.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Free Plan */}
        <div className="glass p-10 rounded-3xl border border-white/10 flex flex-col hover:border-blue-500/30 transition-all">
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-2">Free Explorer</h3>
            <p className="text-slate-400">Perfect for individuals just starting out.</p>
          </div>
          <div className="mb-8">
            <span className="text-5xl font-extrabold">$0</span>
            <span className="text-slate-500 ml-2">/month</span>
          </div>
          <ul className="space-y-4 mb-12 flex-1">
            <li className="flex items-center space-x-3">
              <span className="text-green-500">✓</span>
              <span>AI Website Builder Access</span>
            </li>
            <li className="flex items-center space-x-3">
              <span className="text-green-500">✓</span>
              <span>Visual Ad Creative Generator</span>
            </li>
            <li className="flex items-center space-x-3">
              <span className="text-green-500">✓</span>
              <span>No Account Required</span>
            </li>
            <li className="flex items-center space-x-3 text-slate-500">
              <span className="text-slate-700">✗</span>
              <span>Customized Tech Support</span>
            </li>
          </ul>
          <button className="w-full py-4 glass hover:bg-white/10 rounded-xl font-bold transition-all">
            Start Free Now
          </button>
        </div>

        {/* Growth Plus Plan */}
        <div className="bg-blue-600 p-10 rounded-3xl flex flex-col transform md:scale-105 shadow-2xl shadow-blue-900/40">
          <div className="mb-8 text-white">
            <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase mb-4 tracking-widest">Recommended</div>
            <h3 className="text-2xl font-bold mb-2 text-white">Customized Growth</h3>
            <p className="text-blue-100">Tailored support for established businesses.</p>
          </div>
          <div className="mb-8 text-white">
             <span className="text-5xl font-extrabold">Custom</span>
          </div>
          <ul className="space-y-4 mb-12 flex-1 text-white">
            <li className="flex items-center space-x-3">
              <span className="bg-white/20 rounded-full px-1">✓</span>
              <span>Everything in Free Plan</span>
            </li>
            <li className="flex items-center space-x-3">
              <span className="bg-white/20 rounded-full px-1">✓</span>
              <span>1-on-1 Personalized Onboarding</span>
            </li>
            <li className="flex items-center space-x-3">
              <span className="bg-white/20 rounded-full px-1">✓</span>
              <span>Custom Integration Support</span>
            </li>
            <li className="flex items-center space-x-3">
              <span className="bg-white/20 rounded-full px-1">✓</span>
              <span>Priority Feature Requests</span>
            </li>
          </ul>
          
          <div className="space-y-3">
            <a 
              href="https://wa.me/919958025783" 
              className="block w-full text-center py-4 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-all"
            >
              Contact on WhatsApp
            </a>
            <a 
              href="tel:9958025783" 
              className="block w-full text-center py-3 text-white border border-white/30 rounded-xl font-semibold hover:bg-white/10 transition-all"
            >
              Call Us: 9958025783
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
