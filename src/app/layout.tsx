import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ArXiv Paper Chat - Chat with Research Papers using AI',
  description: 'Enter an arXiv paper URL and chat with Claude Sonnet 4 about the paper content. Share conversations with others.',
  keywords: 'arxiv, research papers, AI chat, academic papers, Claude Sonnet, research assistant',
  authors: [{ name: 'ArXiv Paper Chat' }],
  openGraph: {
    title: 'ArXiv Paper Chat - Chat with Research Papers using AI',
    description: 'Enter an arXiv paper URL and chat with Claude Sonnet 4 about the paper content.',
    type: 'website',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800`}>
        <div className="flex flex-col min-h-screen">
          <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                  <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                    ArXiv Paper Chat
                  </h1>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Powered by Claude Sonnet 4
                </div>
              </div>
            </div>
          </header>
          
          <main className="flex-1">
            {children}
          </main>
          
          <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                Enter an arXiv paper URL to start chatting about research papers with AI
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}