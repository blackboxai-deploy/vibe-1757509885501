import { ArxivMetadata, ArxivPaper } from '@/types/paper';

export function extractArxivId(url: string): string | null {
  // Handle various arXiv URL formats
  const patterns = [
    /arxiv\.org\/abs\/([0-9]{4}\.[0-9]{4,5}v?[0-9]*)/i,
    /arxiv\.org\/pdf\/([0-9]{4}\.[0-9]{4,5}v?[0-9]*)/i,
    /([0-9]{4}\.[0-9]{4,5}v?[0-9]*)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1].replace(/v[0-9]*$/, ''); // Remove version number
    }
  }
  
  return null;
}

export function buildArxivUrls(arxivId: string) {
  return {
    abstract: `https://arxiv.org/abs/${arxivId}`,
    pdf: `https://arxiv.org/pdf/${arxivId}.pdf`,
    api: `https://export.arxiv.org/api/query?id_list=${arxivId}`
  };
}

export async function fetchArxivMetadata(arxivId: string): Promise<ArxivMetadata> {
  const { api } = buildArxivUrls(arxivId);
  
  try {
    const response = await fetch(api);
    const xmlText = await response.text();
    
    // Parse XML response
    const titleMatch = xmlText.match(/<title>([\s\S]*?)<\/title>/);
    const title = titleMatch ? titleMatch[1].replace(/^\s*\n/, '').trim() : '';
    
    // Extract authors
    const authorMatches = xmlText.match(/<author>[\s\S]*?<name>(.*?)<\/name>/g) || [];
    const authors = authorMatches.map(match => {
      const nameMatch = match.match(/<name>(.*?)<\/name>/);
      return nameMatch ? nameMatch[1].trim() : '';
    }).filter(Boolean);
    
    // Extract abstract
    const abstractMatch = xmlText.match(/<summary>([\s\S]*?)<\/summary>/);
    const abstract = abstractMatch ? abstractMatch[1].replace(/\s+/g, ' ').trim() : '';
    
    // Extract categories
    const categoryMatch = xmlText.match(/<arxiv:primary_category.*?term="([^"]*)"/) || 
                         xmlText.match(/<category term="([^"]*)" scheme="http:\/\/arxiv\.org\/schemas\/atom"/);
    const categories = categoryMatch ? [categoryMatch[1]] : [];
    
    // Extract published date
    const publishedMatch = xmlText.match(/<published>(.*?)<\/published>/);
    const published = publishedMatch ? publishedMatch[1] : new Date().toISOString();
    
    return {
      title,
      authors,
      abstract,
      categories,
      published
    };
  } catch (error) {
    console.error('Error fetching arXiv metadata:', error);
    throw new Error('Failed to fetch paper metadata');
  }
}

export async function fetchPdfContent(pdfUrl: string): Promise<string> {
  try {
    const response = await fetch(pdfUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`);
    }
    
    // For now, we'll return a placeholder until we add pdf-parse
    // This will be handled by the API endpoint
    return `PDF content from ${pdfUrl} - Content will be extracted server-side`;
  } catch (error) {
    console.error('Error fetching PDF content:', error);
    throw new Error('Failed to extract PDF content');
  }
}

export async function scrapeArxivPaper(url: string): Promise<ArxivPaper> {
  const arxivId = extractArxivId(url);
  if (!arxivId) {
    throw new Error('Invalid arXiv URL format');
  }
  
  const urls = buildArxivUrls(arxivId);
  
  try {
    // Fetch metadata and PDF content in parallel
    const [metadata, content] = await Promise.all([
      fetchArxivMetadata(arxivId),
      fetchPdfContent(urls.pdf)
    ]);
    
    return {
      id: arxivId,
      title: metadata.title,
      authors: metadata.authors,
      abstract: metadata.abstract,
      url: urls.abstract,
      pdfUrl: urls.pdf,
      content,
      createdAt: new Date().toISOString(),
      categories: metadata.categories
    };
  } catch (error) {
    console.error('Error scraping arXiv paper:', error);
    throw error;
  }
}