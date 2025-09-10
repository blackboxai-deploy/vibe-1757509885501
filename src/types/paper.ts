export interface ArxivPaper {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  url: string;
  pdfUrl: string;
  content: string;
  createdAt: string;
  categories: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatSession {
  paperId: string;
  messages: ChatMessage[];
}

export interface ArxivMetadata {
  title: string;
  authors: string[];
  abstract: string;
  categories: string[];
  published: string;
}