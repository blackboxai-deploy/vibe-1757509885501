import { NextRequest, NextResponse } from 'next/server';
import { getPaper } from '@/lib/storage';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: paperId } = await params;
    
    if (!paperId) {
      return NextResponse.json(
        { error: 'Paper ID is required' }, 
        { status: 400 }
      );
    }

    const paper = await getPaper(paperId);
    
    if (!paper) {
      return NextResponse.json(
        { error: 'Paper not found' }, 
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      paper
    });
  } catch (error) {
    console.error('Error retrieving paper:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      { error: errorMessage }, 
      { status: 500 }
    );
  }
}