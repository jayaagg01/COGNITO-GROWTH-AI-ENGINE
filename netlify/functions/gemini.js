
import { GoogleGenAI } from "@google/genai";

export const handler = async (event) => {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "API key not configured in Netlify environment variables." })
    };
  }

  if (event.httpMethod !== "POST") {
    return { 
      statusCode: 405, 
      body: "Method Not Allowed" 
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const { prompt, modelName } = body;
    
    if (!prompt) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing prompt in request body." })
      };
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // Using a reliable model for text generation if not specified
    const response = await ai.models.generateContent({
      model: modelName || 'gemini-3-flash-preview',
      contents: prompt,
    });

    return {
      statusCode: 200,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", 
      },
      body: JSON.stringify({ text: response.text })
    };
  } catch (error) {
    console.error("Netlify Function Error:", error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: error.message || "Internal Server Error" })
    };
  }
};
