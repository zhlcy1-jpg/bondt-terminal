import { NextRequest, NextResponse } from 'next/server';
import { getGeminiService } from '@/lib/geminiService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { issuer } = body;

    const geminiService = getGeminiService();
    const analysis = await geminiService.getFinancialAnalysis(issuer);

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
