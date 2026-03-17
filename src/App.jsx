import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import ResultsCard from './components/ResultsCard';
import { Loader2, AlertCircle } from 'lucide-react';

export default function App() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const isFormValid = file && jobDescription.length >= 50;

  const handleAnalyse = async () => {
    if (!isFormValid) return;

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('cv', file);
    formData.append('job_description', jobDescription);

    try {
      const response = await fetch('/api/analyse', {
        method: 'POST',
        body: formData,
      });

      // API always returns JSON structure as { success, data } or { success, error }
      const data = await response.json().catch(() => ({ 
        success: false, 
        error: 'Failed to parse server response' 
      }));

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to analyse CV');
      }

      setResult(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 font-sans">
      <header className="bg-getdevdark text-white p-4 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold tracking-tight">CV Analyser</h1>
          <p className="text-getdevmid text-sm mt-1">AI-powered CV to Job Description fit assessment</p>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column - Input */}
          <section className="bg-white p-6 shadow-sm border border-gray-100 rounded-xl h-fit">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">New Analysis</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  1. Upload CV (PDF)
                </label>
                <FileUpload file={file} setFile={setFile} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  2. Paste Job Description
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-getdevmid focus:border-getdevmid outline-none transition-shadow min-h-[160px] resize-y"
                  placeholder="Paste the full job description here (minimum 50 characters)..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-1 text-right">
                  {jobDescription.length} chars (min 50)
                </p>
              </div>

              <button
                onClick={handleAnalyse}
                disabled={!isFormValid || loading}
                className="w-full bg-getdevmid hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors flex justify-center items-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Analysing CV...
                  </>
                ) : (
                  'Analyse Fit'
                )}
              </button>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3 mt-4">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">{error}</p>
                </div>
              )}
            </div>
          </section>

          {/* Right Column - Results */}
          <section className="bg-white p-6 shadow-sm border border-gray-100 rounded-xl relative overflow-hidden min-h-[500px]">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">Results</h2>
            
            {!result && !loading && (
              <div className="h-full pt-12 flex flex-col items-center justify-center text-gray-400 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <div className="w-8 h-8 text-gray-300">
                    <svg fill="currentColor" viewBox="0 0 24 24"><path d="M9 3v15h3V3H9m3 2l4 13 3-1-4-13-3 1M5 5v13h3V5H5M3 19v2h18v-2H3Z"/></svg>
                  </div>
                </div>
                <p>Upload a CV and job description to see the analysis</p>
              </div>
            )}

            {loading && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                <Loader2 className="w-10 h-10 animate-spin text-getdevmid mb-4" />
                <p className="text-gray-600 font-medium">Extracting text and analysing fit...</p>
                <p className="text-sm text-gray-400 mt-2 text-center max-w-xs">This uses a large language model and may take 15-30 seconds.</p>
              </div>
            )}

            {result && !loading && <ResultsCard data={result} />}
          </section>
        </div>
      </main>

      <footer className="bg-gray-100 border-t border-gray-200 text-center py-6 mt-8">
        <p className="text-sm text-gray-500">
          Built by <span className="font-semibold text-gray-700">GetDevWorks</span> &middot; getdevworks.com
        </p>
      </footer>
    </div>
  );
}
