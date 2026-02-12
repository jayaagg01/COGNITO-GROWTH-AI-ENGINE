
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { ModelType } from "../types";

export const getAIInstance = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("Gemini API key is not configured. Please ensure your environment variables are correctly set.");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateWebsiteCode = async (prompt: string): Promise<string> => {
  const ai = getAIInstance();
  const systemInstruction = `
    You are an expert full-stack web developer and designer.
    Generate a complete, high-quality, single-page HTML file based on the user's prompt.
    1. Use Tailwind CSS via CDN.
    2. Ensure the design is modern, clean, and mobile-responsive.
    3. Include high-quality placeholder images from Unsplash.
    4. The output must ONLY be the HTML content. Do not include markdown code blocks or any explanation.
  `;

  try {
    const response = await ai.models.generateContent({
      model: ModelType.WEBSITE,
      contents: `Build a modern, conversion-optimized landing page for: ${prompt}`,
      config: {
        systemInstruction,
        temperature: 0.7,
        thinkingConfig: { thinkingBudget: 4000 }
      },
    });

    if (!response.text) throw new Error("The AI returned an empty response.");
    return response.text.trim();
  } catch (error) {
    console.error("Website Generation Error:", error);
    throw error;
  }
};

export const generateAdImage = async (visualContext: string): Promise<string> => {
  const ai = getAIInstance();

  try {
    const response = await ai.models.generateContent({
      model: ModelType.ADS,
      contents: {
        parts: [
          { text: `High-end professional advertising photography. Visual concept: ${visualContext}. Commercial style, high resolution, professional lighting, photorealistic, clean composition.` }
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
          imageSize: "1K"
        }
      },
    });

    const candidate = response.candidates?.[0];
    if (!candidate || !candidate.content) throw new Error("The AI was unable to generate a visual for this concept.");

    for (const part of candidate.content.parts) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }

    throw new Error("No image data was found in the AI response.");
  } catch (error) {
    console.error("Ad Image Generation Error:", error);
    throw error;
  }
};
