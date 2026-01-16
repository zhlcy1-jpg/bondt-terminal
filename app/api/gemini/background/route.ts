import { NextRequest, NextResponse } from 'next/server';
import { getGeminiService } from '@/lib/geminiService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { issuer, guarantor } = body;

    const geminiService = getGeminiService();
    const background = await geminiService.getIssuerBackground(issuer, guarantor);

    return NextResponse.json({ background });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
