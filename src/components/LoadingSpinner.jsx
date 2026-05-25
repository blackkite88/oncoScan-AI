import React from 'react';

export default function LoadingSpinner({ message = "Analyzing MRI Scan..." }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-6 w-full animate-fade-in">
      <div className="relative w-24 h-24">
        {/* Concentric pulsing rings */}
        <div className="absolute inset-0 rounded-full border border-cyan-500/10 animate-ping pointer-events-none" />
        <div className="absolute inset-2 rounded-full border border-cyan-500/20 animate-pulse pointer-events-none" />
        
        {/* Main rotating diagnostic ring */}
        <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-l-2 border-transparent border-t-cyan-400 border-r-cyan-500/30 animate-spin" style={{ animationDuration: '1.2s' }} />
        
        {/* Outer dotted rings for telemetry detail */}
        <div className="absolute -inset-2 rounded-full border border-dashed border-cyan-500/10 animate-spin" style={{ animationDuration: '8s' }} />

        {/* Center dot */}
        <div className="absolute inset-0 m-auto w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_12px_rgba(6,182,212,1)]" />
      </div>

      <div className="text-center space-y-1.5">
        <p className="font-mono text-xs text-cyan-400 uppercase tracking-widest glow-text-cyan animate-pulse">
          {message}
        </p>
        <p className="font-mono text-[9px] text-slate-500 tracking-widest uppercase">
          Processing Neuro-Imaging Telemetry
        </p>
      </div>
    </div>
  );
}
