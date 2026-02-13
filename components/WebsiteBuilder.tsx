
import React, { useState, useRef, useEffect } from 'react';
import { generateWebsiteCodeStream } from '../services/geminiService';

const WebsiteBuilder: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [htmlCode, setHtmlCode] = useState('');
  const [isMaximized, setIsMaximized] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [status, setStatus] = useState('');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setHtmlCode('');
    setStatus('Architecting site structure...');
    
    try {
      const stream = generateWebsiteCodeStream(prompt);
      let fullCode = '';
      
      for await (const chunk of stream) {
        fullCode += chunk;
        setHtmlCode(fullCode);
        
        if (fullCode.includes('<body') && !fullCode.includes('</body')) {
          setStatus('Crafting visual elements...');
        } else if (fullCode.includes('class=') || fullCode.includes('style=')) {
          setStatus('Applying Tailwind optimization...');
        }
      }
      setStatus('Site ready for deployment.');
    } catch (err: any) {
      console.error(err);
      setStatus('Generation failed.');
      alert("Failed to generate website. Please check your prompt or API configuration.");
    } finally {
      setIsGenerating(false);
      setTimeout(() => setStatus(''), 3000);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(htmlCode);
    alert('Code copied to clipboard!');
  };

  const handleDownload = () => {
    const blob = new Blob([htmlCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cognito-studio-site.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'HTML_UPDATE') {
        setHtmlCode(event.data.html);
      } else if (event.data?.type === 'IMAGE_CLICK') {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.onchange = (e: any) => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (re: any) => {
              iframeRef.current?.contentWindow?.postMessage({
                type: 'UPDATE_IMAGE',
                id: event.data.id,
                src: re.target.result
              }, '*');
            };
            reader.readAsDataURL(file);
          }
        };
        fileInput.click();
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const editableHtml = `
    ${htmlCode}
    <script>
      if (document.body) {
        document.body.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a, button').forEach((el) => {
          if(el.innerText.trim().length > 0) {
             el.contentEditable = 'true';
             el.style.outline = 'none';
             el.addEventListener('focus', () => el.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.5)');
             el.addEventListener('blur', () => el.style.boxShadow = 'none');
             el.addEventListener('input', () => {
               window.parent.postMessage({ type: 'HTML_UPDATE', html: document.documentElement.outerHTML }, '*');
             });
          }
        });

        document.querySelectorAll('img').forEach((img, idx) => {
          img.id = 'editable-img-' + idx;
          img.title = 'Click to swap image';
          img.style.cursor = 'pointer';
          img.addEventListener('click', (e) => {
            e.preventDefault();
            window.parent.postMessage({ type: 'IMAGE_CLICK', id: img.id }, '*');
          });
        });
      }

      window.addEventListener('message', (event) => {
        if (event.data.type === 'UPDATE_IMAGE') {
          const img = document.getElementById(event.data.id);
          if (img) {
            img.src = event.data.src;
            window.parent.postMessage({ type: 'HTML_UPDATE', html: document.documentElement.outerHTML }, '*');
          }
        }
      });
    </script>
  `;

  return (
    <div className={`pt-24 px-6 max-w-[1600px] mx-auto flex flex-col h-[calc(100vh-40px)] transition-all duration-300 ${isMaximized ? 'fixed inset-0 z-[60] bg-slate-950 pt-6 max-w-full' : ''}`}>
      
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold flex items-center gap-3">
            Site Studio
            {status && (
              <span className="text-xs bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full border border-blue-500/20 animate-pulse uppercase tracking-widest font-bold">
                {status}
              </span>
            )}
          </h2>
          <p className="text-slate-400 text-sm mt-1">Generate and preview high-conversion responsive websites.</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <input 
            type="text" 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your vision (e.g., A minimalist furniture store...)"
            className="flex-1 md:w-96 bg-white/5 border border-white/10 rounded-xl px-5 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
            disabled={isGenerating}
            onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
          />
          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 whitespace-nowrap text-sm"
          >
            {isGenerating ? 'Building...' : 'Generate Site'}
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0 pb-6">
        
        {/* Code Panel */}
        <div className="lg:col-span-5 flex flex-col min-h-0 glass rounded-3xl border border-white/10 overflow-hidden">
          <div className="px-5 py-4 bg-slate-900 flex items-center justify-between border-b border-white/5">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Source Code</span>
            <div className="flex gap-2">
              <button onClick={handleCopyCode} className="text-[10px] font-bold uppercase tracking-tighter px-3 py-1 bg-white/5 hover:bg-white/10 rounded-md transition-all text-slate-300">Copy</button>
              <button onClick={handleDownload} className="text-[10px] font-bold uppercase tracking-tighter px-3 py-1 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-md transition-all">Download</button>
            </div>
          </div>
          <div className="flex-1 overflow-auto bg-slate-950 p-6 custom-scrollbar">
            <pre className="text-sm font-mono text-blue-300/80 leading-relaxed whitespace-pre-wrap break-all">
              {htmlCode || <span className="text-slate-700 italic">Code will appear here...</span>}
            </pre>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-7 flex flex-col min-h-0 glass rounded-3xl border border-white/10 overflow-hidden relative">
          <div className="px-5 py-3 bg-slate-900 flex items-center justify-between border-b border-white/5">
            <div className="flex items-center gap-4">
              <div className="flex gap-1.5 mr-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/30"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/30"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/30"></div>
              </div>
              
              {/* Responsive Toggles */}
              <div className="flex items-center bg-white/5 p-1 rounded-lg gap-1 border border-white/5">
                <button 
                  onClick={() => setPreviewMode('desktop')}
                  className={`p-1.5 rounded-md transition-all ${previewMode === 'desktop' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                  title="Desktop View"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>
                </button>
                <button 
                  onClick={() => setPreviewMode('mobile')}
                  className={`p-1.5 rounded-md transition-all ${previewMode === 'mobile' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                  title="Mobile View"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="20" x="5" y="2" rx="2"/><path d="M12 18h.01"/></svg>
                </button>
              </div>
            </div>

            <div className="hidden sm:block bg-white/5 px-4 py-1.5 rounded-full text-[10px] font-mono text-slate-500 truncate max-w-[200px]">
              {previewMode === 'desktop' ? 'desktop-preview.local' : 'mobile-preview.local'}
            </div>

            <button onClick={() => setIsMaximized(!isMaximized)} className="text-[10px] font-bold uppercase tracking-tighter text-slate-400 hover:text-white">
              {isMaximized ? 'Exit Focus' : 'Focus Mode'}
            </button>
          </div>
          
          <div className="flex-1 bg-slate-100 relative flex items-center justify-center p-4 sm:p-8 overflow-hidden">
            {!htmlCode && !isGenerating && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12 bg-slate-950">
                <div className="w-20 h-20 bg-blue-600/10 rounded-3xl flex items-center justify-center text-4xl mb-6 border border-blue-500/20">✨</div>
                <h3 className="text-2xl font-bold mb-3">Live Site Preview</h3>
                <p className="text-slate-400 max-w-sm">Describe your dream website above to start the responsive generation process.</p>
              </div>
            )}
            
            {htmlCode && (
              <div className={`h-full transition-all duration-500 shadow-2xl relative bg-white ${previewMode === 'mobile' ? 'w-[375px] rounded-[40px] border-[8px] border-slate-900 ring-4 ring-slate-800' : 'w-full'}`}>
                {/* Mobile Camera Notch Simulation */}
                {previewMode === 'mobile' && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl z-20 flex items-center justify-center">
                    <div className="w-8 h-1 bg-slate-800 rounded-full"></div>
                  </div>
                )}
                
                <iframe 
                  ref={iframeRef}
                  srcDoc={editableHtml}
                  className={`w-full h-full border-none transition-all duration-300 ${previewMode === 'mobile' ? 'rounded-[32px]' : ''}`}
                  title="Website Preview"
                />
              </div>
            )}

            {isGenerating && (
              <div className="absolute bottom-6 right-6 bg-slate-900/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl flex items-center gap-3 shadow-2xl z-30">
                <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Building Live...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebsiteBuilder;
