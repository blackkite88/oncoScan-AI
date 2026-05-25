import React from 'react';

export default function Header() {
  return (
    <header className="border-b border-medical-border bg-medical-card/65 backdrop-blur-md px-6 py-4 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded border border-cyan-500/30 bg-cyan-950/20 text-cyan-400">
            <span className="font-syne font-bold text-lg">O</span>
            <div className="absolute inset-0 border border-cyan-500/10 rounded animate-ping pointer-events-none" />
          </div>
          <div>
            <h1 className="font-syne font-extrabold text-xl tracking-wider text-white flex items-center gap-2">
              ONCOSCAN <span className="text-cyan-400 glow-text-cyan">AI</span>
            </h1>
            <p className="font-mono text-[10px] text-slate-400 tracking-widest uppercase">
              Neuro-Radiology Diagnostic Support
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
