
import React, { useState } from 'react';
import { generateAdImage } from '../services/geminiService';

const AdGenerator: React.FC = () => {
  const [context, setContext] = useState('');
  const [adText, setAdText] = useState('Limited Time Offer: Scale Your Brand Today!');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImg, setGeneratedImg] = useState<string | null>(null);
  const [uploadedImg, setUploadedImg] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!context.trim()) return;
    
    setErrorMessage(null);
    setIsGenerating(true);

    try {
      const img = await generateAdImage(context);
      setGeneratedImg(img);
      setUploadedImg(null); 
    } catch (err: any) {
      console.error("Ad Creation Failed:", err);
      setErrorMessage(err.message || "Failed to generate ad creative. Please check your visual concept description.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (re: any) => {
        setUploadedImg(re.target.result);
        setGeneratedImg(null);
        setErrorMessage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const activeImg = uploadedImg || generatedImg || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1080&h=1080";

  return (
    <div className="pt-24 px-6 max-w-7xl mx-auto pb-20">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold mb-2">Ad Creative Suite</h2>
        <p className="text-slate-400">High-performance marketing assets powered by Gemini 3 Pro Vision.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div className="space-y-8 glass p-8 rounded-3xl border border-white/10 shadow-xl">
          <section>
            <label className="block text-xs font-bold mb-3 text-blue-400 uppercase tracking-widest">Visual Concept</label>
            <textarea 
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Describe the visual: e.g. A high-end carbon fiber bicycle in a futuristic neon-lit city street..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 h-32 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-white placeholder-slate-600"
            />
            {errorMessage && (
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                <strong>Error:</strong> {errorMessage}
              </div>
            )}
          </section>

          <section>
            <label className="block text-xs font-bold mb-3 text-blue-400 uppercase tracking-widest">Headline Text Overlay</label>
            <input 
              type="text" 
              value={adText}
              onChange={(e) => setAdText(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-white"
            />
          </section>

          <section className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center min-h-[60px]"
            >
              {isGenerating ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></span>
                  Rendering...
                </>
              ) : 'Generate Pro Creative'}
            </button>
            <label className="flex-1 cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-8 py-4 font-bold text-center transition-all flex items-center justify-center text-slate-300">
              <span>Upload Custom</span>
              <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
            </label>
          </section>
        </div>

        <div className="sticky top-32">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-[450px] mx-auto border border-slate-200">
            <div className="p-4 flex items-center space-x-3 border-b border-slate-100">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-inner">C</div>
              <div>
                <p className="font-bold text-slate-900 text-sm">Cognito Growth</p>
                <p className="text-[10px] text-slate-500 font-semibold tracking-tight uppercase">Sponsored</p>
              </div>
            </div>
            
            <div className="px-4 py-3 text-slate-800 text-sm leading-relaxed">
              Experience the future of marketing with Cognito Growth's AI-driven visual engine. Built for performance.
            </div>

            <div className="aspect-square relative bg-slate-100 overflow-hidden">
              {isGenerating && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-md z-10">
                   <div className="text-center">
                     <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                     <p className="text-white text-xs font-bold uppercase tracking-widest">Processing Imagery</p>
                   </div>
                </div>
              )}
              <img src={activeImg} alt="Ad Creative" className="w-full h-full object-cover transition-opacity duration-500" />
              
              <div className="absolute bottom-6 left-6 right-6">
                 <div className="bg-black/70 backdrop-blur-lg text-white p-5 rounded-xl border border-white/20 shadow-2xl">
                    <p className="text-xl font-extrabold leading-tight tracking-tight uppercase">{adText}</p>
                 </div>
              </div>
            </div>

            <div className="p-5 flex items-center justify-between bg-slate-50 border-t border-slate-200">
              <div className="flex-1">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-0.5">cognitogrowth.io</p>
                <p className="font-extrabold text-slate-900 text-base">Elite Marketing Engine</p>
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-all shadow-md">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdGenerator;
