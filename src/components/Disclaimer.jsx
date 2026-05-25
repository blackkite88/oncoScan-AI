import React from 'react';

export default function Disclaimer() {
  return (
    <div className="w-full bg-slate-950/90 border border-amber-500/20 rounded-xl p-4 mt-12 max-w-4xl mx-auto shadow-[0_0_20px_rgba(245,158,11,0.02)]">
      <div className="flex flex-col sm:flex-row items-center gap-3 justify-center text-center sm:text-left select-none">
        <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-amber-950/40 text-amber-500 border border-amber-500/30 font-bold text-sm">
          ⚠
        </span>
        <p className="font-mono text-[10px] text-amber-200/70 tracking-wide leading-relaxed max-w-2xl uppercase">
          For research and clinical decision support only. Not a substitute for professional radiological diagnosis or clinical examination.
        </p>
      </div>
    </div>
  );
}
