import { NextRequest, NextResponse } from 'next/server';
import { getGeminiService } from '@/lib/geminiService';
import { Bond } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, bond } = body;

    const geminiService = getGeminiService();

    switch (action) {
      case 'getTraderInsight':
        const insight = await geminiService.getTraderInsight(bond as Bond);
        return NextResponse.json({ insight });
      
      default:
        return NextResponse.json(
          { error: 'Unknown action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
