import React from 'react';

export default function ExplanationResult({ result }) {
  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-500 border border-dashed border-slate-800 rounded-lg">
        <svg className="w-8 h-8 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
        <p className="font-mono text-xs">Awaiting diagnostic explanation</p>
      </div>
    );
  }

  // Parse report helper
  const parseReport = (text) => {
    if (!text) return [];
    
    // Split by lines or line breaks
    return text.split('\n').map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return { isEmpty: true, key: idx };

      // Identify major sections (Findings, Impression, Disclaimer, etc.)
      const match = trimmed.match(/^(findings|impression|disclaimer|clinical correlation|recommendation|note):?(.*)$/i);
      
      if (match) {
        return {
          isHeading: true,
          section: match[1].charAt(0).toUpperCase() + match[1].slice(1).toLowerCase(),
          content: match[2].trim(),
          key: idx
        };
      }
      
      return {
        isHeading: false,
        content: trimmed,
        key: idx
      };
    });
  };

  const parsedReport = parseReport(result.report);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
      {/* 1. Grad-CAM Heatmap Panel */}
      <div className="space-y-4">
        <h3 className="font-syne text-xs font-semibold tracking-wider text-slate-300 uppercase flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          Attention Heatmap
        </h3>

        <div className="bg-[#0d1326]/40 border border-slate-800/60 rounded-xl p-4 flex flex-col items-center justify-center gap-4">
          <div className="relative aspect-square w-full max-w-[280px] bg-slate-950 rounded-lg overflow-hidden border border-cyan-500/25 flex items-center justify-center">
            {(() => {
              const heatmapData = result.heatmap_b64 || result.heatmap;
              return heatmapData ? (
                <img 
                  src={heatmapData.startsWith('data:') ? heatmapData : `data:image/jpeg;base64,${heatmapData}`}
                  alt="Grad-CAM Activation Heatmap" 
                  className="max-h-full max-w-full object-contain filter brightness-95 contrast-105"
                />
              ) : (
                <div className="text-slate-500 font-mono text-[10px]">No Heatmap Rendered</div>
              );
            })()}
            
            {/* Corner Crosshairs */}
            <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t border-l border-cyan-400/40" />
            <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t border-r border-cyan-400/40" />
            <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b border-l border-cyan-400/40" />
            <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b border-r border-cyan-400/40" />
            
            {/* Scanner line (frozen or slow static line overlay) */}
            <div className="absolute left-0 right-0 top-1/2 h-[0.5px] bg-cyan-400/35 border-t border-dashed border-cyan-400/10 pointer-events-none" />
          </div>

          {/* Color Legend (cool -> hot) */}
          <div className="w-full max-w-[280px] space-y-1.5">
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>Low Activation</span>
              <span>High Activation</span>
            </div>
            
            {/* Heatmap Gradient Bar */}
            <div className="h-2 w-full bg-gradient-to-r from-blue-700 via-emerald-500 via-yellow-400 to-red-600 rounded-full" />
            
            <p className="font-mono text-[9px] text-slate-500 text-center uppercase tracking-widest mt-1">
              Grad-CAM Class Activation Map Overlay
            </p>
          </div>
        </div>
      </div>

      {/* 2. Radiology Report Card */}
      <div className="space-y-4">
        <h3 className="font-syne text-xs font-semibold tracking-wider text-slate-300 uppercase flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          Radiological Diagnostic Report
        </h3>

        {/* Clinical Report Card */}
        <div className="bg-[#0e1428]/60 border-l-2 border-cyan-500/70 border-y border-r border-slate-800/80 rounded-r-xl p-5 shadow-[0_0_15px_rgba(6,182,212,0.02)]">
          <div className="border-b border-slate-800/80 pb-3 mb-4 flex justify-between items-center">
            <span className="font-mono text-[10px] text-cyan-400/80 tracking-widest uppercase">
              Clinical Telemetry Transcript
            </span>
            <span className="font-mono text-[9px] text-slate-500">
              ID: {Math.floor(100000 + Math.random() * 900000)}
            </span>
          </div>

          <div className="font-mono text-xs text-slate-300 space-y-4 leading-relaxed max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
            {parsedReport.map((line) => {
              if (line.isEmpty) return <div key={line.key} className="h-2" />;
              
              if (line.isHeading) {
                return (
                  <div key={line.key} className="space-y-1 mt-3">
                    <span className="font-bold text-white uppercase tracking-wider text-xs block text-cyan-300">
                      {line.section}
                    </span>
                    {line.content && (
                      <p className="pl-0 text-slate-300">
                        {line.content}
                      </p>
                    )}
                  </div>
                );
              }

              return (
                <p key={line.key} className="text-slate-300">
                  {line.content}
                </p>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
