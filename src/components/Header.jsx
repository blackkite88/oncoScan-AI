import React from 'react';

export default function Header({ backendStatus, isMockMode, toggleMockMode }) {
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

        <div className="flex items-center gap-4">
          {/* Status Indicator */}
          <div className="flex items-center gap-2 bg-[#0e1529] px-3 py-1.5 rounded border border-medical-border text-xs font-mono">
            <span className="text-slate-400">API Gateway:</span>
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full relative ${backendStatus === 'online'
                  ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]'
                  : backendStatus === 'offline'
                    ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.7)] animate-pulse'
                    : 'bg-slate-500 animate-pulse'
                }`}>
                {backendStatus !== 'checking' && (
                  <span className={`absolute inset-0 rounded-full animate-ping ${backendStatus === 'online' ? 'bg-emerald-500/60' : 'bg-amber-500/60'
                    }`} />
                )}
              </span>
              <span className={`uppercase font-semibold tracking-wider ${backendStatus === 'online' ? 'text-emerald-400' : backendStatus === 'offline' ? 'text-amber-400' : 'text-slate-400'
                }`}>
                {backendStatus === 'online' ? 'Online' : backendStatus === 'offline' ? 'Offline (Mock)' : 'Connecting...'}
              </span>
            </div>
          </div>

          {/* Mock Mode Control Toggle */}
          <button
            onClick={toggleMockMode}
            className={`font-mono text-xs px-3 py-1.5 rounded border transition-all duration-200 ${isMockMode
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.15)] hover:bg-amber-500/20'
                : 'bg-slate-900 border-medical-border text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            title="Toggle mock responses for demonstration when API is offline"
          >
            {isMockMode ? 'MOCK MODE [ACTIVE]' : 'MOCK MODE [OFF]'}
          </button>
        </div>
      </div>
    </header>
  );
}
