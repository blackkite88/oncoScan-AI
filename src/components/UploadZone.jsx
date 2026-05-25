import React, { useState, useRef } from 'react';

export default function UploadZone({ 
  uploadedFile, 
  previewUrl, 
  onFileChange, 
  onPredict, 
  onExplain, 
  isLoading 
}) {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        onFileChange(file);
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onFileChange(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Upload Box Container */}
      <div 
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={!uploadedFile ? onButtonClick : undefined}
        className={`relative aspect-square w-full max-w-md mx-auto rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all duration-300 overflow-hidden ${
          isDragActive 
            ? 'border-cyan-400 bg-cyan-950/20 shadow-[0_0_30px_rgba(6,182,212,0.3)]' 
            : uploadedFile 
            ? 'border-cyan-500/30 bg-slate-900/40 cursor-default' 
            : 'border-slate-800 bg-[#0d1326]/40 hover:border-slate-700 hover:bg-[#0d1326]/80'
        }`}
      >
        <input 
          ref={fileInputRef}
          type="file" 
          className="hidden" 
          accept="image/*"
          onChange={handleFileChange}
          disabled={isLoading}
        />

        {/* Scan lines overlay pattern for tech medical style */}
        <div className="absolute inset-0 scanlines opacity-30 pointer-events-none" />

        {/* Grayscale Preview or Upload Prompt */}
        {previewUrl ? (
          <div className="relative w-full h-full flex items-center justify-center group">
            {/* Grayscale tinted preview image */}
            <img 
              src={previewUrl} 
              alt="MRI Scan Preview" 
              className="max-h-full max-w-full object-contain rounded filter grayscale contrast-125 brightness-90 transition-all duration-300"
            />
            
            {/* Sweeping scanline animation */}
            {isLoading && (
              <div className="absolute left-0 right-0 h-1 bg-cyan-400/80 shadow-[0_0_12px_rgba(6,182,212,1)] animate-scan-line pointer-events-none" />
            )}

            {/* Subtle corner ticks (crosshairs) representing alignment bounds */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-500/40" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-500/40" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-500/40" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-500/40" />

            {/* Clear Image Button Overlay on Hover (when not loading) */}
            {!isLoading && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onFileChange(null);
                }}
                className="absolute top-4 right-4 bg-slate-950/80 hover:bg-slate-900 text-slate-300 hover:text-white border border-slate-700 hover:border-slate-600 px-2 py-1 rounded text-[10px] font-mono tracking-wider uppercase transition-colors"
              >
                Clear Scan
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 z-10 select-none">
            {/* Scanner Pulse Ring Wrap */}
            <div className="relative w-20 h-20 rounded-full border border-cyan-500/30 flex items-center justify-center bg-cyan-950/10 animate-scanner-ring">
              <svg className="w-10 h-10 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="font-syne text-sm font-semibold tracking-wide text-slate-200">
                DRAG & DROP MRI SCAN
              </p>
              <p className="font-mono text-xs text-slate-500 mt-1">
                or click to browse local files
              </p>
            </div>
            <div className="border border-slate-800/80 bg-[#070b18]/60 px-3 py-1 rounded font-mono text-[10px] text-slate-400">
              DICOM / PNG / JPEG — Max 10MB
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto w-full">
        <button
          onClick={onPredict}
          disabled={!uploadedFile || isLoading}
          className={`relative group font-mono text-xs uppercase tracking-wider font-semibold py-3.5 px-4 rounded-lg border transition-all duration-300 ${
            !uploadedFile || isLoading
              ? 'bg-slate-900/40 border-slate-800 text-slate-600 cursor-not-allowed'
              : 'bg-[#0b172a] border-cyan-500/40 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:border-cyan-400 hover:text-cyan-200 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]'
          }`}
        >
          {/* Subtle diagnostic glow */}
          {uploadedFile && !isLoading && (
            <span className="absolute inset-0 w-full h-full rounded-lg bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          )}
          Predict Classification
        </button>

        <button
          onClick={onExplain}
          disabled={!uploadedFile || isLoading}
          className={`relative group font-mono text-xs uppercase tracking-wider font-semibold py-3.5 px-4 rounded-lg border transition-all duration-300 ${
            !uploadedFile || isLoading
              ? 'bg-slate-900/40 border-slate-800 text-slate-600 cursor-not-allowed'
              : 'bg-[#0f172a] border-cyan-500/40 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:border-cyan-400 hover:text-cyan-200 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]'
          }`}
        >
          {uploadedFile && !isLoading && (
            <span className="absolute inset-0 w-full h-full rounded-lg bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          )}
          Explain Diagnostic
        </button>
      </div>
    </div>
  );
}
