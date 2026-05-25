import React from 'react';

export default function ErrorAlert({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div className="w-full max-w-md mx-auto bg-rose-950/20 border border-rose-500/30 rounded-lg p-4 animate-fade-in shadow-[0_0_15px_rgba(244,63,94,0.05)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <div className="flex-shrink-0 mt-0.5 text-rose-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h3 className="font-syne text-xs font-semibold uppercase tracking-wider text-rose-300">
              System Telemetry Error
            </h3>
            <p className="font-mono text-[11px] text-rose-200/80 mt-1 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        {onDismiss && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 text-rose-400 hover:text-rose-200 p-0.5 rounded hover:bg-rose-900/30 transition-colors"
            title="Dismiss error"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
