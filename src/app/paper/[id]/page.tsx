'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ChatInterface from '@/components/ChatInterface';
import PaperInfo from '@/components/PaperInfo';
import { ArxivPaper } from '@/types/paper';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function SharedPaperPage() {
  const params = useParams();
  const router = useRouter();
  const [paper, setPaper] = useState<ArxivPaper | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const paperId = params.id as string;

  useEffect(() => {
    const fetchPaper = async () => {
      try {
        const response = await fetch(`/api/paper/${paperId}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to load paper');
        }
        
        setPaper(data.paper);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load paper');
      } finally {
        setLoading(false);
      }
    };

    if (paperId) {
      fetchPaper();
    }
  }, [paperId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Loading Paper
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Retrieving paper content and preparing chat interface...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !paper) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>
                {error || 'Paper not found'}
              </AlertDescription>
            </Alert>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Unable to Load Paper
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              The requested paper could not be found or may have been removed.
            </p>
            <Button 
              onClick={() => router.push('/')}
              className="w-full"
            >
              Go Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header with paper title and back button */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => router.push('/')}
                variant="outline"
                size="sm"
              >
                ← Back to Home
              </Button>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Shared Paper Discussion
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
          {/* Paper Info Sidebar */}
          <div className="lg:col-span-1">
            <PaperInfo paper={paper} />
          </div>
          
          {/* Chat Interface */}
          <div className="lg:col-span-2 h-full">
            <ChatInterface 
              paperId={paperId}
              paperTitle={paper.title}
            />
          </div>
        </div>
      </div>
    </div>
  );
}