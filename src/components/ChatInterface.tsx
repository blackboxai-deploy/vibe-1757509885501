'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ChatMessage } from '@/types/paper';
import { generateMessageId } from '@/lib/ai';

interface ChatInterfaceProps {
  paperId: string;
  paperTitle: string;
}

export default function ChatInterface({ paperId, paperTitle }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Add initial welcome message
    const welcomeMessage: ChatMessage = {
      id: generateMessageId(),
      role: 'assistant',
      content: `Hello! I'm ready to discuss the paper "${paperTitle}" with you. I've analyzed the full content and can help you understand the research, methodology, findings, and implications. What would you like to know about this paper?`,
      timestamp: new Date().toISOString()
    };
    setMessages([welcomeMessage]);
  }, [paperTitle]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim() || isLoading) return;
    
    const userMessage: ChatMessage = {
      id: generateMessageId(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setError('');
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paperId,
          messages: [...messages, userMessage]
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get AI response');
      }
      
      const assistantMessage: ChatMessage = {
        id: generateMessageId(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as React.FormEvent);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <Card className={`max-w-[80%] ${
              message.role === 'user' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white dark:bg-gray-800'
            }`}>
              <CardContent className="p-4">
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {message.content}
                </div>
                <div className={`text-xs mt-2 ${
                  message.role === 'user' 
                    ? 'text-blue-200' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {formatTimestamp(message.timestamp)}
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <Card className="bg-white dark:bg-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    AI is thinking...
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <Card className="border-t-0 rounded-t-none">
        <CardHeader className="pb-2">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <Textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask questions about the paper... (Press Enter to send, Shift+Enter for new line)"
              className="flex-1 min-h-[60px] max-h-32 resize-none"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              disabled={!inputValue.trim() || isLoading}
              className="px-6"
            >
              Send
            </Button>
          </form>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Example questions: &quot;What is the main contribution of this paper?&quot;, &quot;Explain the methodology&quot;, &quot;What are the key findings?&quot;
          </div>
        </CardContent>
      </Card>
    </div>
  );
}