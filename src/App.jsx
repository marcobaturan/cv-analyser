import React from 'react';

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-getdevdark text-white p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">CV Analyser</h1>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 flex gap-6">
        <section className="flex-1 bg-white p-6 shadow-sm rounded-md">
          <h2 className="text-xl font-semibold mb-4">Input</h2>
          <p>PDF upload and Job Description will go here.</p>
        </section>

        <section className="flex-1 bg-white p-6 shadow-sm rounded-md">
          <h2 className="text-xl font-semibold mb-4">Results</h2>
          <p>Analysis mapping output will go here.</p>
        </section>
      </main>

      <footer className="bg-gray-100 text-center py-4 text-sm text-gray-500">
        Built by GetDevWorks &middot; getdevworks.com
      </footer>
    </div>
  );
}
