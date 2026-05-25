import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import UploadZone from './components/UploadZone';
import ResultsPanel from './components/ResultsPanel';
import Disclaimer from './components/Disclaimer';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorAlert from './components/ErrorAlert';

const BASE_URL = "http://34.100.210.180";

// Mock reports mapping for the simulation mode
const MOCK_REPORTS = {
  glioma: `Findings: A large, irregular mass is identified in the left frontoparietal lobe measuring approximately 3.8 x 4.1 cm. T2/FLAIR images reveal substantial peritumoral vasogenic edema. Solid and nodular peripheral enhancement is demonstrated post-contrast. There is moderate mass effect on the left lateral ventricle and a 4mm midline shift.
Impression: Intracranial space-occupying lesion, highly characteristic of a high-grade Glioma.
Disclaimer: OncoScan AI findings are advisory. Correlation with histopathological analysis of a biopsy sample is required for definitive diagnosis.`,

  meningioma: `Findings: A well-circumscribed, extra-axial dural-based mass is noted along the right parietal convexity, measuring 3.0 x 2.7 cm. The lesion is homogeneously hyperintense on T2-weighted sequences. Uniform robust enhancement is demonstrated following gadolinium injection, displaying a classic dural tail sign. Minimal surrounding vasogenic edema.
Impression: Extra-axial neoplasm, highly consistent with Meningioma.
Disclaimer: OncoScan AI findings are advisory. Neurosurgical consultation and clinical follow-up is recommended.`,

  pituitary: `Findings: Expansion of the sella turcica is noted due to a 2.1 cm solid mass originating from the pituitary gland. The lesion demonstrates moderate heterogeneous enhancement. It extends superiorly into the suprasellar cistern, causing mild compression of the optic chiasm. Normal pituitary gland tissue is compressed.
Impression: Sellar and suprasellar mass, highly consistent with a Pituitary Macroadenoma.
Disclaimer: OncoScan AI findings are advisory. Full endocrinological evaluation and formal visual field testing are recommended.`,

  notumor: `Findings: Symmetric ventricles and cortical sulci. No focal areas of abnormal signal intensity in the cerebral hemispheres, brainstem, or cerebellum. No pathological enhancement is observed following gadolinium contrast injection. Midline structures are centered. Bony structures and paranasal sinuses are intact.
Impression: Unremarkable brain MRI scan. No space-occupying lesion or abnormal enhancement detected.
Disclaimer: OncoScan AI findings are advisory. Clinical evaluation and symptoms should dictate further diagnostic investigations.`
};

export default function App() {
  // State variables
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [activeTab, setActiveTab] = useState('predict');
  const [predictResult, setPredictResult] = useState(null);
  const [explainResult, setExplainResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // API connection and simulation states
  const [backendStatus, setBackendStatus] = useState('checking'); // 'checking' | 'online' | 'offline'
  const [isMockMode, setIsMockMode] = useState(false);

  // Check backend availability on mount
  useEffect(() => {
    const testConnection = async () => {
      try {
        // Try fetching BASE_URL (with a timeout)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        const response = await fetch(`${BASE_URL}/`, {
          method: 'GET',
          mode: 'cors',
          signal: controller.signal
        }).catch(() => null);

        clearTimeout(timeoutId);

        if (response) {
          setBackendStatus('online');
          setIsMockMode(false);
        } else {
          setBackendStatus('offline');
          setIsMockMode(true); // auto-enable mock mode so it works immediately
        }
      } catch (err) {
        setBackendStatus('offline');
        setIsMockMode(true);
      }
    };
    testConnection();
  }, []);

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

  // Generate simulated Grad-CAM heatmap using client HTML5 Canvas
  const generateMockHeatmap = (file, callback) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');

        // Draw original image with high contrast and grayscale
        ctx.filter = 'grayscale(100%) brightness(85%) contrast(120%)';
        ctx.drawImage(img, 0, 0);
        ctx.filter = 'none';

        // Draw random simulated thermal overlay representing tumor focus
        const centerX = img.width * (0.35 + Math.random() * 0.3);
        const centerY = img.height * (0.35 + Math.random() * 0.3);
        const radius = Math.min(img.width, img.height) * (0.18 + Math.random() * 0.1);

        const gradient = ctx.createRadialGradient(centerX, centerY, radius * 0.05, centerX, centerY, radius);
        gradient.addColorStop(0, 'rgba(239, 68, 68, 0.75)');   // Red core (hottest)
        gradient.addColorStop(0.25, 'rgba(249, 115, 22, 0.65)'); // Orange
        gradient.addColorStop(0.5, 'rgba(234, 179, 8, 0.45)');   // Yellow
        gradient.addColorStop(0.75, 'rgba(16, 185, 129, 0.25)'); // Green/Teal
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');      // Transparent Blue edge

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();

        callback(canvas.toDataURL('image/png'));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Predict endpoint trigger
  const handlePredict = async () => {
    if (!uploadedFile) return;
    setIsLoading(true);
    setError(null);
    setActiveTab('predict');

    // MOCK MODE FALLBACK
    if (isMockMode) {
      setTimeout(() => {
        const classes = ['glioma', 'meningioma', 'pituitary', 'notumor'];
        const selectedClass = classes[Math.floor(Math.random() * classes.length)];
        const confidence = parseFloat((0.82 + Math.random() * 0.17).toFixed(4));

        // Distribute remaining probability across remaining classes
        const remaining = 1.0 - confidence;
        const otherClasses = classes.filter(c => c !== selectedClass);
        const p1 = parseFloat((remaining * (0.4 + Math.random() * 0.2)).toFixed(4));
        const p2 = parseFloat((remaining * (0.2 + Math.random() * 0.15)).toFixed(4));
        const p3 = parseFloat((remaining - p1 - p2).toFixed(4));

        const probabilities = {
          [selectedClass]: confidence,
          [otherClasses[0]]: p1,
          [otherClasses[1]]: p2,
          [otherClasses[2]]: p3
        };

        setPredictResult({
          label: selectedClass,
          confidence,
          probabilities
        });
        setIsLoading(false);
      }, 1200);
      return;
    }

    // REAL BACKEND CALL
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

    // MOCK MODE FALLBACK
    if (isMockMode) {
      // Step 1: Generate base64 canvas heatmap
      generateMockHeatmap(uploadedFile, (heatmapBase64) => {
        // Step 2: Assemble result
        setTimeout(() => {
          const classes = ['glioma', 'meningioma', 'pituitary', 'notumor'];
          const selectedClass = classes[Math.floor(Math.random() * classes.length)];
          const confidence = parseFloat((0.82 + Math.random() * 0.17).toFixed(4));

          const remaining = 1.0 - confidence;
          const otherClasses = classes.filter(c => c !== selectedClass);
          const p1 = parseFloat((remaining * (0.4 + Math.random() * 0.2)).toFixed(4));
          const p2 = parseFloat((remaining * (0.2 + Math.random() * 0.15)).toFixed(4));
          const p3 = parseFloat((remaining - p1 - p2).toFixed(4));

          const probabilities = {
            [selectedClass]: confidence,
            [otherClasses[0]]: p1,
            [otherClasses[1]]: p2,
            [otherClasses[2]]: p3
          };

          setExplainResult({
            label: selectedClass,
            confidence,
            probabilities,
            heatmap: heatmapBase64,
            report: MOCK_REPORTS[selectedClass]
          });
          setIsLoading(false);
        }, 1800);
      });
      return;
    }

    // REAL BACKEND CALL
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
      <Header
        backendStatus={backendStatus}
        isMockMode={isMockMode}
        toggleMockMode={() => setIsMockMode(prev => !prev)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10 z-10">

        {/* Connection status warning if offline and mock mode isn't enabled yet */}
        {!isMockMode && backendStatus === 'offline' && (
          <div className="mb-6">
            <ErrorAlert
              message={`Unable to connect to local API at ${BASE_URL}. Enable Mock Mode in the header to preview features locally.`}
              onDismiss={() => setIsMockMode(true)}
            />
          </div>
        )}

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
