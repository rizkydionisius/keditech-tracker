import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const apiKey = process.env.GEMINI_API_KEY;

export async function POST(req: Request) {
  if (!apiKey) {
    return NextResponse.json({ summary: "Configuration Error: GEMINI_API_KEY is missing." }, { status: 500 });
  }

  try {
    const { data } = await req.json();

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `
      You are an expert Business Intelligence Analyst for a company called Keditech.
      Analyze the provided team performance data below.
      
      Data: ${JSON.stringify(data)}

      Instructions:
      1. Highlight significant growths (Green) and critical drops (Red).
      2. Mention specific people if their data is notable.
      3. Keep the tone professional, encouraging, but direct.
      4. Output raw text only, max 3 sentences.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ summary: text });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return NextResponse.json({ summary: "Failed to generate insight. Please try again later." }, { status: 500 });
  }
}
