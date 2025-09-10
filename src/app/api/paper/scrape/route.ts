import { NextRequest, NextResponse } from 'next/server';
import { scrapeArxivPaper } from '@/lib/arxiv';
import { storePaper } from '@/lib/storage';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    
    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'URL is required' }, 
        { status: 400 }
      );
    }

    // Scrape the arXiv paper
    const paper = await scrapeArxivPaper(url);
    
    // For PDF content extraction, we'll use a server-side approach with pdf-parse
    // First, let's fetch the PDF and extract content properly
    const pdfResponse = await fetch(paper.pdfUrl);
    if (!pdfResponse.ok) {
      throw new Error('Failed to fetch PDF');
    }
    
    const arrayBuffer = await pdfResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Import pdf-parse dynamically (will be installed)
    let pdfContent = '';
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const pdfParse = require('pdf-parse');
      const pdfData = await pdfParse(buffer);
      pdfContent = pdfData.text;
    } catch (pdfError) {
      // Fallback - use abstract if PDF parsing fails
      console.warn('PDF parsing failed, using abstract:', pdfError);
      pdfContent = paper.abstract;
    }
    
    // Update paper with extracted content
    paper.content = pdfContent;
    
    // Store the paper
    const paperId = await storePaper(paper);
    
    return NextResponse.json({
      success: true,
      paperId,
      paper: {
        id: paper.id,
        title: paper.title,
        authors: paper.authors,
        abstract: paper.abstract,
        categories: paper.categories
      }
    });
  } catch (error) {
    console.error('Error scraping paper:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      { error: errorMessage }, 
      { status: 500 }
    );
  }
}