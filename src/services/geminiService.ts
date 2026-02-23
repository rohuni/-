import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const chatSession = ai.chats.create({
  model: "gemini-3-flash-preview",
  config: {
    systemInstruction: `You are WEBSOLUTE AI, a professional crypto market analyst and DAO governance assistant. 
    Your tone is technical, precise, and helpful. 
    When asked about market analysis, provide structured reports with clear sections.
    You can simulate providing "On-chain data" and "Market Momentum" insights.
    Always remind users that AI can make mistakes and they should verify data before investing.`,
  },
});

export interface Message {
  role: "user" | "model";
  text: string;
  timestamp: string;
  isReport?: boolean;
}
