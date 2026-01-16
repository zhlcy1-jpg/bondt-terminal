import { NextRequest, NextResponse } from 'next/server';
import { getGeminiService } from '@/lib/geminiService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { issuer, guarantor } = body;

    const geminiService = getGeminiService();
    const news = await geminiService.getIssuerNews(issuer, guarantor);

    return NextResponse.json({ news });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
