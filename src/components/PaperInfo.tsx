'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArxivPaper } from '@/types/paper';

interface PaperInfoProps {
  paper: ArxivPaper;
}

export default function PaperInfo({ paper }: PaperInfoProps) {
  const [showCopyAlert, setShowCopyAlert] = useState(false);

  const shareableUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/paper/${paper.id}`;

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareableUrl);
      setShowCopyAlert(true);
      setTimeout(() => setShowCopyAlert(false), 3000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg leading-tight mb-2">
              {paper.title}
            </CardTitle>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <div>
                <strong>Authors:</strong> {paper.authors.join(', ')}
              </div>
              <div>
                <strong>ArXiv ID:</strong> {paper.id}
              </div>
              <div>
                <strong>Processed:</strong> {formatDate(paper.createdAt)}
              </div>
            </div>
          </div>
        </div>
        
        {paper.categories && paper.categories.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {paper.categories.map((category, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {category}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-sm text-gray-900 dark:text-white mb-2">
              Abstract
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {paper.abstract}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={handleCopyUrl}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              Copy Shareable Link
            </Button>
            <Button
              onClick={() => window.open(paper.url, '_blank')}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              View on ArXiv
            </Button>
            <Button
              onClick={() => window.open(paper.pdfUrl, '_blank')}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              Download PDF
            </Button>
          </div>
          
          {showCopyAlert && (
            <Alert>
              <AlertDescription>
                Shareable link copied to clipboard! Others can use this URL to chat about the same paper.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
}