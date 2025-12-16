import { GoogleGenAI, Type } from "@google/genai";
import { AppData, Review } from '../types';

// Ensure API key is present
const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.error("API_KEY is missing from environment variables.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy-key' });

export const generateAppSuggestions = async (query: string): Promise<AppData[]> => {
  if (!apiKey) return [];
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate 4 realistic but fictional mobile app ideas based on the search query: "${query}". 
      Return a list of app details including name, developer, category, rating (3.5-5.0), downloads, description, shortDescription, and 3 hypothetical tags.
      For the iconUrl and screenshots, just provide empty strings, I will handle them.
      Make them sound like real store listings.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              developer: { type: Type.STRING },
              category: { type: Type.STRING },
              rating: { type: Type.NUMBER },
              downloads: { type: Type.STRING },
              description: { type: Type.STRING },
              shortDescription: { type: Type.STRING },
              tags: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["name", "developer", "category", "rating", "downloads", "description", "shortDescription", "tags"]
          }
        }
      }
    });

    const data = JSON.parse(response.text || '[]');
    
    return data.map((item: any, index: number) => ({
      ...item,
      id: `ai-${Date.now()}-${index}`,
      iconUrl: `https://picsum.photos/seed/${item.name.replace(/\s/g, '')}/200`,
      screenshots: [
        `https://picsum.photos/seed/${item.name.replace(/\s/g, '')}1/300/600`,
        `https://picsum.photos/seed/${item.name.replace(/\s/g, '')}2/300/600`,
        `https://picsum.photos/seed/${item.name.replace(/\s/g, '')}3/300/600`,
      ],
      reviews: [],
      isAiGenerated: true
    }));

  } catch (error) {
    console.error("Error generating apps:", error);
    return [];
  }
};

export const generateAppReviews = async (appName: string): Promise<Review[]> => {
  if (!apiKey) return [];

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate 3 user reviews for the app "${appName}".
      Include a user name, a realistic rating (1-5), and a short review text.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              user: { type: Type.STRING },
              rating: { type: Type.NUMBER },
              text: { type: Type.STRING },
            },
            required: ["user", "rating", "text"]
          }
        }
      }
    });

    const data = JSON.parse(response.text || '[]');
    return data.map((item: any, index: number) => ({
      ...item,
      id: `review-${index}`,
      date: new Date().toLocaleDateString(),
      avatar: `https://picsum.photos/seed/user${index}/50`
    }));
  } catch (error) {
    console.error("Error generating reviews:", error);
    return [];
  }
};
