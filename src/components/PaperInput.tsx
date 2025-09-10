'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { extractArxivId } from '@/lib/arxiv';
import { ArxivPaper } from '@/types/paper';

interface PaperInputProps {
  onPaperProcessed: (paperId: string, paper: Partial<ArxivPaper>) => void;
}

export default function PaperInput({ onPaperProcessed }: PaperInputProps) {
  const [url, setUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!url.trim()) {
      setError('Please enter an arXiv URL');
      return;
    }
    
    const arxivId = extractArxivId(url);
    if (!arxivId) {
      setError('Invalid arXiv URL format. Please enter a valid arXiv URL like: https://arxiv.org/abs/2401.12345');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const response = await fetch('/api/paper/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to process paper');
      }
      
      onPaperProcessed(data.paperId, data.paper);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process paper');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Enter ArXiv Paper URL</CardTitle>
        <CardDescription>
          Paste an arXiv paper URL to start chatting about the research with AI
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="url"
              placeholder="https://arxiv.org/abs/2401.12345"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isProcessing}
              className="w-full"
            />
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Supported formats: arxiv.org/abs/..., arxiv.org/pdf/..., or just the paper ID
            </div>
          </div>
          
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <Button 
            type="submit" 
            disabled={isProcessing || !url.trim()}
            className="w-full"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing Paper...
              </>
            ) : (
              'Load Paper & Start Chat'
            )}
          </Button>
        </form>
        
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Example ArXiv URLs:
          </h3>
          <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
            <div>• https://arxiv.org/abs/2023.12345</div>
            <div>• https://arxiv.org/pdf/2023.12345.pdf</div>
            <div>• 2023.12345</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}