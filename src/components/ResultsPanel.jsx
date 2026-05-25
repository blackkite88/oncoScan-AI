import React from 'react';
import PredictionResult from './PredictionResult';
import ExplanationResult from './ExplanationResult';

export default function ResultsPanel({ 
  activeTab, 
  setActiveTab, 
  predictResult, 
  explainResult 
}) {
  return (
    <div className="w-full bg-medical-card/30 border border-medical-border rounded-2xl p-6 flex flex-col h-full min-h-[400px]">
      {/* Tabs Header */}
      <div className="flex border-b border-slate-800/80 pb-4 mb-6">
        <div className="flex gap-2 bg-slate-950 p-1 rounded-lg border border-slate-800/60 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('predict')}
            className={`flex-1 sm:flex-none font-mono text-xs uppercase tracking-wider px-5 py-2.5 rounded-md transition-all duration-300 ${
              activeTab === 'predict'
                ? 'bg-cyan-950/40 text-cyan-400 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                : 'text-slate-500 hover:text-slate-300 border border-transparent'
            }`}
          >
            Prediction Analysis
          </button>
          
          <button
            onClick={() => setActiveTab('explain')}
            className={`flex-1 sm:flex-none font-mono text-xs uppercase tracking-wider px-5 py-2.5 rounded-md transition-all duration-300 ${
              activeTab === 'explain'
                ? 'bg-cyan-950/40 text-cyan-400 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                : 'text-slate-500 hover:text-slate-300 border border-transparent'
            }`}
          >
            Grad-CAM & Report
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      <div className="flex-1 flex flex-col justify-start">
        {activeTab === 'predict' ? (
          <PredictionResult result={predictResult} />
        ) : (
          <ExplanationResult result={explainResult} />
        )}
      </div>
    </div>
  );
}
