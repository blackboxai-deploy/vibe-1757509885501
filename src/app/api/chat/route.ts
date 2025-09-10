import { NextRequest, NextResponse } from 'next/server';
import { getPaper } from '@/lib/storage';
import { chatWithAI } from '@/lib/ai';
import { ChatMessage } from '@/types/paper';

export async function POST(request: NextRequest) {
  try {
    const { paperId, messages } = await request.json();
    
    if (!paperId || !messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Paper ID and messages are required' }, 
        { status: 400 }
      );
    }

    // Get the paper content
    const paper = await getPaper(paperId);
    if (!paper) {
      return NextResponse.json(
        { error: 'Paper not found' }, 
        { status: 404 }
      );
    }

    // Chat with AI using paper context
    const aiResponse = await chatWithAI({
      messages: messages as ChatMessage[],
      paperContext: paper.content,
      paperTitle: paper.title
    });

    return NextResponse.json({
      success: true,
      response: aiResponse
    });
  } catch (error) {
    console.error('Error in chat:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      { error: errorMessage }, 
      { status: 500 }
    );
  }
}