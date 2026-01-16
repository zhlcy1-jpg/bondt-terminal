import { NextRequest, NextResponse } from 'next/server';
import { getGeminiService } from '@/lib/geminiService';
import { NewsItem } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { news } = body;

    const geminiService = getGeminiService();
    const macro = await geminiService.getMacroSummary(news as NewsItem[]);

    return NextResponse.json({ macro });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
