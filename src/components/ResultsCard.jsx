import React from 'react';
import { CheckCircle, XCircle, Lightbulb, AlertCircle } from 'lucide-react';

export default function ResultsCard({ data }) {
  if (!data) return null;

  const { fit_score, summary, strengths, weaknesses, recommendations, missing_keywords } = data;

  // Determine score color
  let scoreColor = "text-red-600";
  if (fit_score >= 75) scoreColor = "text-green-600";
  else if (fit_score >= 50) scoreColor = "text-amber-500";

  return (
    <div className="w-full space-y-6">
      
      {/* Score Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-700">Fit Score</h3>
          <p className="text-sm text-gray-500">Overall matching percentage</p>
        </div>
        <div className={`text-5xl font-bold ${scoreColor}`}>
          {fit_score}%
        </div>
      </div>

      {/* Summary */}
      <div>
        <h4 className="font-medium text-gray-800 mb-2">Summary</h4>
        <p className="text-gray-600">{summary}</p>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strengths */}
        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <h4 className="font-semibold text-green-800 flex items-center gap-2 mb-3">
            <CheckCircle className="w-5 h-5" />
            Strengths
          </h4>
          <ul className="space-y-2">
            {strengths && strengths.length > 0 ? strengths.map((s, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-green-700">
                <span className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-green-500"></span>
                {s}
              </li>
            )) : <li className="text-sm text-green-600 italic">None identified</li>}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="bg-red-50 p-4 rounded-lg border border-red-100">
          <h4 className="font-semibold text-red-800 flex items-center gap-2 mb-3">
            <XCircle className="w-5 h-5" />
            Weaknesses
          </h4>
          <ul className="space-y-2">
            {weaknesses && weaknesses.length > 0 ? weaknesses.map((w, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-red-700">
                <span className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-red-500"></span>
                {w}
              </li>
            )) : <li className="text-sm text-red-600 italic">None identified</li>}
          </ul>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <h4 className="font-semibold text-blue-800 flex items-center gap-2 mb-3">
          <Lightbulb className="w-5 h-5" />
          Recommendations
        </h4>
        <ul className="space-y-2">
          {recommendations && recommendations.length > 0 ? recommendations.map((r, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-blue-700">
              <span className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              {r}
            </li>
          )) : <li className="text-sm text-blue-600 italic">No recommendations</li>}
        </ul>
      </div>

      {/* Missing Keywords */}
      {missing_keywords && missing_keywords.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-800 flex items-center gap-2 mb-3">
            <AlertCircle className="w-4 h-4 text-gray-500" />
            Missing Keywords
          </h4>
          <div className="flex flex-wrap gap-2">
            {missing_keywords.map((kw, idx) => (
              <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium border border-gray-200">
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
