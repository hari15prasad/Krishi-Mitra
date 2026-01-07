
import { GoogleGenAI, Type, GenerateContentResponse, Modality } from "@google/genai";
import { UserProfile } from "../types";

// Always initialize with named parameter and direct process.env.API_KEY usage
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Chat with Gemini using Google Search for real-time agricultural data.
 */
export const chatWithGemini = async (message: string, languageCode: string, user: UserProfile, history: any[] = []) => {
  const ai = getAI();
  
  const langMap: Record<string, string> = {
    'kn': 'Kannada', 'ml': 'Malayalam', 'hi': 'Hindi', 'en': 'English', 
    'te': 'Telugu', 'ta': 'Tamil', 'bn': 'Bengali', 'mr': 'Marathi', 
    'gu': 'Gujarati', 'pa': 'Punjabi'
  };
  const languageName = langMap[languageCode] || 'Hindi';

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [...history, { role: 'user', parts: [{ text: message }] }],
    config: {
      systemInstruction: `You are Krishi Mitra, a conversational AI Agriculture Assistant for Indian Farmers. 
      STRICT REQUIREMENT: You MUST respond EXCLUSIVELY in the ${languageName} language. 
      
      USER CONTEXT (DO NOT ASK FOR THESE AGAIN):
      - Farmer Name: ${user.name}
      - Location: ${user.district}, ${user.state}
      - Land Size: ${user.landSize} acres
      - Crops grown: ${user.crops.join(', ')}
      
      CONVERSATIONAL ROLE:
      - You are a proactive guide. 
      - Use Google Search tool to find exact info for ${user.district}, ${user.state}.
      - Never ask the user where they are or what they grow; you already know.
      
      Tone: Empathetic, respectful, and helpful.`,
      tools: [{ googleSearch: {} }],
    },
  });

  return {
    text: response.text || "...",
    modelMessage: { role: 'model', parts: [{ text: response.text }] }
  };
};

/**
 * Specifically fetches Mandi prices for the user's crops and location.
 */
export const getMandiPrices = async (user: UserProfile, languageCode: string) => {
  const ai = getAI();
  const langMap: Record<string, string> = {
    'kn': 'Kannada', 'ml': 'Malayalam', 'hi': 'Hindi', 'en': 'English', 
    'te': 'Telugu', 'ta': 'Tamil', 'bn': 'Bengali', 'mr': 'Marathi', 
    'gu': 'Gujarati', 'pa': 'Punjabi'
  };
  const languageName = langMap[languageCode] || 'Hindi';

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Fetch today's current Mandi prices (minimum, maximum, and modal) for the crops: ${user.crops.join(', ')} in the district ${user.district}, ${user.state}. 
    Provide the response in ${languageName}. 
    Format the response clearly with a header for each crop and include the source name.`,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  const sources = groundingChunks 
    ? groundingChunks.map((chunk: any) => chunk.web?.uri).filter(Boolean)
    : [];

  return {
    text: response.text || "No recent data found.",
    sources: sources
  };
};

/**
 * Specifically fetches weather forecast for the user's location.
 */
export const getLiveWeather = async (user: UserProfile, languageCode: string) => {
  const ai = getAI();
  const langMap: Record<string, string> = {
    'kn': 'Kannada', 'ml': 'Malayalam', 'hi': 'Hindi', 'en': 'English', 
    'te': 'Telugu', 'ta': 'Tamil', 'bn': 'Bengali', 'mr': 'Marathi', 
    'gu': 'Gujarati', 'pa': 'Punjabi'
  };
  const languageName = langMap[languageCode] || 'Hindi';

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Get the current weather and a 3-day forecast for ${user.district}, ${user.state}. Respond in ${languageName} with: Current Temp, Humidity, Wind, and brief Forecast summary.`,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });
  return response.text;
};

/**
 * Translates scheme descriptions to the user's language.
 */
export const translateScheme = async (scheme: any, languageCode: string) => {
  const ai = getAI();
  const langMap: Record<string, string> = {
    'kn': 'Kannada', 'ml': 'Malayalam', 'hi': 'Hindi', 'en': 'English', 
    'te': 'Telugu', 'ta': 'Tamil', 'bn': 'Bengali', 'mr': 'Marathi', 
    'gu': 'Gujarati', 'pa': 'Punjabi'
  };
  const languageName = langMap[languageCode] || 'Hindi';

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Translate the following government scheme details into ${languageName}. Keep the meaning clear for a farmer.
    Scheme Name: ${scheme.name}
    Benefits: ${scheme.benefits}
    Eligibility: ${scheme.eligibility}
    Documents: ${scheme.documents.join(', ')}`,
    config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING },
                benefits: { type: Type.STRING },
                eligibility: { type: Type.STRING },
                documents: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["name", "benefits", "eligibility", "documents"]
        }
    }
  });
  
  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    return scheme;
  }
};

/**
 * Analyze crop images for disease detection.
 */
export const analyzeCropImage = async (base64Image: string, languageCode: string) => {
  const ai = getAI();
  const langMap: Record<string, string> = {
    'kn': 'Kannada', 'ml': 'Malayalam', 'hi': 'Hindi', 'en': 'English', 
    'te': 'Telugu', 'ta': 'Tamil', 'bn': 'Bengali', 'mr': 'Marathi', 
    'gu': 'Gujarati', 'pa': 'Punjabi'
  };
  const languageName = langMap[languageCode] || 'Hindi';

  const imagePart = {
    inlineData: {
      mimeType: 'image/jpeg',
      data: base64Image,
    },
  };
  const textPart = {
    text: `Identify the plant health status or disease in this image. Respond EXCLUSIVELY in ${languageName} with Condition, Symptoms, and Treatment.`
  };

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts: [imagePart, textPart] },
  });
  return response.text;
};

/**
 * Analyze soil reports and provide recommendations.
 */
export const analyzeSoilReport = async (base64Image: string, languageCode: string, user: UserProfile) => {
  const ai = getAI();
  const langMap: Record<string, string> = {
    'kn': 'Kannada', 'ml': 'Malayalam', 'hi': 'Hindi', 'en': 'English', 
    'te': 'Telugu', 'ta': 'Tamil', 'bn': 'Bengali', 'mr': 'Marathi', 
    'gu': 'Gujarati', 'pa': 'Punjabi'
  };
  const languageName = langMap[languageCode] || 'Hindi';

  const imagePart = {
    inlineData: {
      mimeType: 'image/jpeg',
      data: base64Image,
    },
  };
  const textPart = {
    text: `You are a soil expert. Analyze this Soil Health Card/Report for the farmer ${user.name} who grows ${user.crops.join(', ')} in ${user.district}.
    1. Summarize the current soil condition (pH, Organic Carbon, Nitrogen, Phosphorus, Potassium, etc.).
    2. Explain what these values mean for the user's crops.
    3. Provide specific, actionable fertilizer and amendment recommendations.
    4. Respond EXCLUSIVELY in ${languageName}. Use a professional yet simple tone.`
  };

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts: [imagePart, textPart] },
  });
  return response.text;
};
