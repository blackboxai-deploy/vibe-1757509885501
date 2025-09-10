'use client';

import React, { useState } from 'react';
import PaperInput from '@/components/PaperInput';
import ChatInterface from '@/components/ChatInterface';
import PaperInfo from '@/components/PaperInfo';
import { ArxivPaper } from '@/types/paper';

export default function HomePage() {
  const [currentPaper, setCurrentPaper] = useState<ArxivPaper | null>(null);
  const [paperId, setPaperId] = useState<string | null>(null);

  const handlePaperProcessed = (id: string, paper: Partial<ArxivPaper>) => {
    setPaperId(id);
    // Create full paper object for display
    if (paper.id && paper.title && paper.authors && paper.abstract && paper.categories) {
      setCurrentPaper({
        id: paper.id,
        title: paper.title,
        authors: paper.authors,
        abstract: paper.abstract,
        categories: paper.categories,
        content: '', // Don't display full content in UI
        createdAt: new Date().toISOString(),
        url: `https://arxiv.org/abs/${paper.id}`,
        pdfUrl: `https://arxiv.org/pdf/${paper.id}.pdf`
      });
    }
  };

  const handleStartOver = () => {
    setCurrentPaper(null);
    setPaperId(null);
  };

  if (currentPaper && paperId) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
            {/* Paper Info Sidebar */}
            <div className="lg:col-span-1">
              <div className="space-y-4">
                <PaperInfo paper={currentPaper} />
                <button
                  onClick={handleStartOver}
                  className="w-full px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Load Different Paper
                </button>
              </div>
            </div>
            
            {/* Chat Interface */}
            <div className="lg:col-span-2 h-full">
              <ChatInterface 
                paperId={paperId}
                paperTitle={currentPaper.title}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Chat with Research Papers
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">
            Enter an arXiv paper URL and have intelligent conversations about the research
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Powered by Claude Sonnet 4 with full paper context
          </p>
        </div>
        
        <PaperInput onPaperProcessed={handlePaperProcessed} />
        
        <div className="mt-12 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                Full Paper Analysis
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                The AI reads the entire PDF content, not just the abstract
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                Shareable Conversations
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Generate links for others to chat about the same paper
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                Advanced AI
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Claude Sonnet 4 provides detailed insights and explanations
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}