
import React, { useState, useRef, useEffect } from 'react';
import { generateWebsiteCode } from '../services/geminiService';

const WebsiteBuilder: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [htmlCode, setHtmlCode] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    try {
      const code = await generateWebsiteCode(prompt);
      setHtmlCode(code);
    } catch (err: any) {
      console.error(err);
      alert("Failed to generate website. Please check your prompt or ensure your environment configuration is correct.");
    } finally {
      setIsGenerating(false);
    }
  };

  const updateHtmlFromIframe = (newHtml: string) => {
    setHtmlCode(newHtml);
  };

  const handleDownload = () => {
    const blob = new Blob([htmlCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cognito-website.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'HTML_UPDATE') {
        updateHtmlFromIframe(event.data.html);
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
      document.body.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a, button').forEach((el) => {
        if(el.children.length === 0 || (el.children.length > 0 && el.innerText.trim().length > 0)) {
           el.contentEditable = 'true';
           el.style.outline = 'none';
           el.addEventListener('input', () => {
             window.parent.postMessage({ type: 'HTML_UPDATE', html: document.documentElement.outerHTML }, '*');
           });
        }
      });

      document.querySelectorAll('img').forEach((img, idx) => {
        img.id = 'editable-img-' + idx;
        img.style.cursor = 'pointer';
        img.title = 'Click to change image';
        img.addEventListener('click', (e) => {
          e.preventDefault();
          window.parent.postMessage({ type: 'IMAGE_CLICK', id: img.id }, '*');
        });
      });

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
    <div className={`pt-24 px-6 max-w-7xl mx-auto flex flex-col transition-all duration-300 ${isMaximized ? 'h-screen fixed inset-0 z-[60] bg-slate-950 pt-6 max-w-full' : 'h-[calc(100vh-80px)]'}`}>
      {!isMaximized && (
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Website Builder</h2>
            <p className="text-slate-400 text-sm">Design and edit in real-time using Gemini 3 Pro.</p>
          </div>
          <div className="flex space-x-3">
            {htmlCode && (
              <button 
                onClick={handleDownload}
                className="px-4 py-2 text-sm font-medium glass hover:bg-white/10 text-green-400 border-green-500/20 rounded-lg transition-colors"
              >
                Download HTML
              </button>
            )}
            <button 
              onClick={() => setShowCode(!showCode)}
              className="px-4 py-2 text-sm font-medium glass hover:bg-white/10 rounded-lg transition-colors"
            >
              {showCode ? 'View Preview' : 'View Code'}
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col gap-4 overflow-hidden pb-6">
        {!isMaximized && (
          <div className="flex gap-4">
            <input 
              type="text" 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. A modern SaaS landing page for a coffee subscription service"
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              disabled={isGenerating}
              onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
            />
            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg min-w-[140px]"
            >
              {isGenerating ? 'Designing...' : 'Generate Site'}
            </button>
          </div>
        )}

        <div className="flex-1 glass rounded-3xl overflow-hidden relative flex flex-col border border-white/10 shadow-2xl">
          <div className="bg-slate-900 px-4 py-3 flex items-center justify-between border-b border-white/5">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
            </div>
            <div className="flex-1 max-w-xl mx-4">
              <div className="bg-white/5 text-slate-500 text-[10px] font-mono py-1.5 px-4 rounded-full text-center truncate tracking-tighter">
                HTTPS://COGNITO-GROWTH.IO/PREVIEW-ALPHA
              </div>
            </div>
            <button 
              onClick={() => setIsMaximized(!isMaximized)}
              className="text-slate-400 hover:text-white text-xs font-bold uppercase tracking-widest"
            >
              {isMaximized ? 'Minimize' : 'Full Preview'}
            </button>
          </div>

          <div className="flex-1 relative min-h-0 bg-white">
            {!htmlCode && !isGenerating && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 p-8 text-center bg-slate-950">
                <div className="text-6xl mb-6">✨</div>
                <p className="text-xl font-extrabold text-white mb-2 uppercase tracking-widest">Cognito AI Engine</p>
                <p className="text-slate-500 max-w-md">Enter a prompt above to generate a professional, conversion-optimized landing page using Gemini 3 Pro.</p>
              </div>
            )}
            
            {isGenerating && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-950/95 backdrop-blur-xl z-20">
                <div className="flex flex-col items-center space-y-6">
                  <div className="relative">
                    <div className="w-20 h-20 border-4 border-blue-600/20 rounded-full"></div>
                    <div className="absolute inset-0 w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-white tracking-widest uppercase">Generating Code...</p>
                    <p className="text-slate-500 text-sm mt-2">Thinking hard about your design requirements</p>
                  </div>
                </div>
              </div>
            )}
            
            {htmlCode && (
              showCode ? (
                <textarea 
                  className="w-full h-full bg-slate-900 text-blue-300 font-mono p-8 resize-none outline-none text-sm leading-relaxed"
                  value={htmlCode}
                  onChange={(e) => setHtmlCode(e.target.value)}
                />
              ) : (
                <iframe 
                  ref={iframeRef}
                  title="Website Preview"
                  srcDoc={editableHtml}
                  className="w-full h-full border-none"
                />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebsiteBuilder;
