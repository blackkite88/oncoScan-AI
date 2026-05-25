import React, { useEffect, useState } from 'react';

const CLASS_CONFIGS = {
  glioma: {
    name: 'Glioma',
    badgeClass: 'bg-rose-950/50 text-rose-400 border-rose-500/30',
    barColor: 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]',
    textColor: 'text-rose-400',
  },
  meningioma: {
    name: 'Meningioma',
    badgeClass: 'bg-amber-950/50 text-amber-400 border-amber-500/30',
    barColor: 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]',
    textColor: 'text-amber-400',
  },
  pituitary: {
    name: 'Pituitary',
    badgeClass: 'bg-purple-950/50 text-purple-400 border-purple-500/30',
    barColor: 'bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]',
    textColor: 'text-purple-400',
  },
  notumor: {
    name: 'No Tumor',
    badgeClass: 'bg-emerald-950/50 text-emerald-400 border-emerald-500/30',
    barColor: 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]',
    textColor: 'text-emerald-400',
  },
};

export default function PredictionResult({ result }) {
  const [animatedWidth, setAnimatedWidth] = useState(0);

  useEffect(() => {
    // Reset and trigger CSS animation on result mount/change
    setAnimatedWidth(0);
    const timer = setTimeout(() => {
      setAnimatedWidth((result.confidence * 100));
    }, 100);
    return () => clearTimeout(timer);
  }, [result]);

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-500 border border-dashed border-slate-800 rounded-lg">
        <svg className="w-8 h-8 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
        <p className="font-mono text-xs">Awaiting diagnostic classification</p>
      </div>
    );
  }

  // Fallback config if class doesn't match standard
  const currentClass = result.label?.toLowerCase() || 'notumor';
  const classConfig = CLASS_CONFIGS[currentClass] || {
    name: result.label || 'Unknown',
    badgeClass: 'bg-slate-950/50 text-slate-400 border-slate-500/30',
    barColor: 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]',
    textColor: 'text-cyan-400',
  };

  // Extract classes from probabilities
  const probabilities = result.probabilities || {};

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Primary Diagnosis Header */}
      <div className="bg-[#0e1428]/80 border border-medical-border rounded-xl p-6 glow-border-cyan">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="font-mono text-[10px] text-slate-500 tracking-widest uppercase block">
              PRIMARY DIAGNOSIS
            </span>
            <h2 className="font-syne font-extrabold text-2xl tracking-wide text-white uppercase">
              {classConfig.name}
            </h2>
          </div>
          
          <div className={`self-start sm:self-center font-mono text-xs uppercase tracking-wider font-semibold px-4 py-2 rounded-full border ${classConfig.badgeClass}`}>
            Class: {result.label}
          </div>
        </div>

        {/* Primary Confidence Progress */}
        <div className="mt-6 space-y-2">
          <div className="flex justify-between items-end font-mono">
            <span className="text-[11px] text-slate-400">Model Confidence</span>
            <span className={`text-base font-bold ${classConfig.textColor}`}>
              {(result.confidence * 100).toFixed(2)}%
            </span>
          </div>
          
          {/* Progress bar container */}
          <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800/80">
            <div 
              style={{ width: `${animatedWidth}%` }}
              className={`h-full rounded-full transition-all duration-1000 ease-out ${classConfig.barColor}`}
            />
          </div>
        </div>
      </div>

      {/* Class Probabilities Breakdown */}
      <div className="space-y-4">
        <h3 className="font-syne text-xs font-semibold tracking-wider text-slate-300 uppercase flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          Probability Breakdown
        </h3>

        <div className="space-y-3 bg-[#0d1326]/40 border border-slate-800/60 rounded-xl p-5 font-mono">
          {Object.entries(CLASS_CONFIGS).map(([key, config]) => {
            const probValue = probabilities[key] ?? 0;
            const probPercentage = probValue * 100;
            const isPredictedClass = key === currentClass;

            return (
              <div key={key} className={`space-y-1.5 p-2.5 rounded transition-all duration-200 ${isPredictedClass ? 'bg-cyan-950/10 border border-cyan-500/20' : 'border border-transparent'}`}>
                <div className="flex justify-between items-center text-xs">
                  <span className={`font-medium ${isPredictedClass ? 'text-white' : 'text-slate-400'}`}>
                    {config.name}
                    {isPredictedClass && <span className="ml-2 font-mono text-[9px] bg-cyan-950 text-cyan-400 border border-cyan-500/30 px-1.5 py-0.5 rounded uppercase">Predicted</span>}
                  </span>
                  <span className={isPredictedClass ? 'text-cyan-400 font-bold' : 'text-slate-400'}>
                    {probPercentage.toFixed(2)}%
                  </span>
                </div>
                
                {/* Visual horizontal bar */}
                <div className="h-1.5 w-full bg-slate-950/80 rounded-full overflow-hidden">
                  <div 
                    style={{ width: `${probPercentage}%` }}
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${
                      isPredictedClass ? config.barColor : 'bg-slate-700'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
