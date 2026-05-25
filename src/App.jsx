import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import UploadZone from './components/UploadZone';
import ResultsPanel from './components/ResultsPanel';
import Disclaimer from './components/Disclaimer';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorAlert from './components/ErrorAlert';

const BASE_URL = "/api";

export default function App() {
  // State variables
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [activeTab, setActiveTab] = useState('predict');
  const [predictResult, setPredictResult] = useState(null);
  const [explainResult, setExplainResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle uploaded file changes
  const handleFileChange = useCallback((file) => {
    // Revoke old URL to prevent memory leaks
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    if (!file) {
      setUploadedFile(null);
      setPreviewUrl(null);
      setPredictResult(null);
      setExplainResult(null);
      setError(null);
      return;
    }

    setUploadedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setPredictResult(null);
    setExplainResult(null);
    setError(null);
  }, [previewUrl]);

  // Predict endpoint trigger
  const handlePredict = async () => {
    if (!uploadedFile) return;
    setIsLoading(true);
    setError(null);
    setActiveTab('predict');

    try {
      const formData = new FormData();
      formData.append('file', uploadedFile);

      const response = await fetch(`${BASE_URL}/predict`, {
        method: 'POST',
        body: formData,
        mode: 'cors'
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP status ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setPredictResult(data);
    } catch (err) {
      console.error(err);
      setError(`Predict Endpoint Failure: ${err.message || 'Check your backend server is running and CORS is enabled.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Explain endpoint trigger
  const handleExplain = async () => {
    if (!uploadedFile) return;
    setIsLoading(true);
    setError(null);
    setActiveTab('explain');

    try {
      const formData = new FormData();
      formData.append('file', uploadedFile);

      const response = await fetch(`${BASE_URL}/explain`, {
        method: 'POST',
        body: formData,
        mode: 'cors'
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP status ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setExplainResult(data);
    } catch (err) {
      console.error(err);
      setError(`Explain Endpoint Failure: ${err.message || 'Check your backend server is running and CORS is enabled.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative medical-grid">
      {/* Background Dots Layer */}
      <div className="absolute inset-0 medical-grid-dots pointer-events-none" />

      {/* Header bar */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10 z-10">
        
        {/* Action errors */}
        {error && (
          <div className="mb-6">
            <ErrorAlert message={error} onDismiss={() => setError(null)} />
          </div>
        )}

        {/* Side-by-Side Panel Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Panel: Upload & Controls */}
          <section className="lg:col-span-5 bg-medical-card/25 border border-medical-border rounded-2xl p-6 backdrop-blur-sm space-y-6">
            <div className="space-y-1">
              <h2 className="font-syne font-bold text-sm tracking-wider uppercase text-slate-300">
                Patient MRI Telemetry Input
              </h2>
              <p className="font-mono text-[10px] text-slate-500">
                Drop high-resolution scan slices below for model classification
              </p>
            </div>

            <UploadZone 
              uploadedFile={uploadedFile}
              previewUrl={previewUrl}
              onFileChange={handleFileChange}
              onPredict={handlePredict}
              onExplain={handleExplain}
              isLoading={isLoading}
            />
          </section>

          {/* Right Panel: Results & Diagnostics */}
          <section className="lg:col-span-7 h-full flex flex-col">
            {isLoading ? (
              <div className="w-full bg-medical-card/30 border border-medical-border rounded-2xl p-6 flex items-center justify-center min-h-[400px]">
                <LoadingSpinner 
                  message={activeTab === 'predict' ? "Predicting Tumor Class..." : "Generating Heatmap & Report..."} 
                />
              </div>
            ) : (
              <ResultsPanel 
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                predictResult={predictResult}
                explainResult={explainResult}
              />
            )}
          </section>

        </div>

        {/* Bottom medical disclaimer */}
        <Disclaimer />

      </main>
    </div>
  );
}
