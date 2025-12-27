

import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { BusinessLead, LeadEnrichment } from "../types";

export class GeminiService {
  // Always obtain a fresh client with the correct API key from process.env
  private get ai() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  /**
   * Fetches main towns, districts, and villages within a city or county.
   */
  async getTowns(location: string): Promise<string[]> {
    const response = await this.ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `List ALL major towns, districts, villages, and distinct local areas within or making up the city or county of "${location}". 
      Return the names as a simple JSON array of strings. 
      Be thorough: include as many as possible (up to 30) to ensure high-density lead generation. 
      Focus on areas with commercial centers and high-street businesses.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    try {
      return JSON.parse(response.text || "[]");
    } catch (e) {
      console.error("Failed to parse towns", e);
      return [];
    }
  }

  /**
   * Searches for businesses using Gemini 2.5 Flash with Google Maps Grounding.
   */
  async searchLeads(category: string, area: string, location?: { lat: number; lng: number }): Promise<{ leads: BusinessLead[], text: string, urls: {uri: string, title: string}[] }> {
    const config: any = {
      tools: [{ googleMaps: {} }],
    };

    if (location) {
      config.toolConfig = {
        retrievalConfig: {
          latLng: {
            latitude: location.lat,
            longitude: location.lng
          }
        }
      };
    }

    const searchQuery = area ? `${category} in ${area}` : category;

    // Maps grounding requires Gemini 2.5 series
    const response = await this.ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Find local businesses matching: "${searchQuery}". Focus on providing names, addresses, ratings, and phone numbers if available.`,
      config,
    });

    const text = response.text || "";
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const urls = chunks
      .filter((chunk: any) => chunk.maps)
      .map((chunk: any) => ({
        uri: chunk.maps.uri,
        title: chunk.maps.title
      }));

    // Use Gemini 3 Pro for the complex extraction and cleaning task
    const parseResponse = await this.ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Extract a list of businesses from this text and metadata.
      Text: ${text}
      Metadata: ${JSON.stringify(urls)}
      
      Return a JSON array of objects with fields: name, address, phone (if found), website (if found), rating (number if found), mapsUrl.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              address: { type: Type.STRING },
              phone: { type: Type.STRING },
              website: { type: Type.STRING },
              rating: { type: Type.NUMBER },
              mapsUrl: { type: Type.STRING }
            },
            required: ["name", "address"]
          }
        }
      }
    });

    const rawLeads = JSON.parse(parseResponse.text || "[]");
    const leads: BusinessLead[] = rawLeads.map((l: any, idx: number) => ({
      ...l,
      id: `lead-${Date.now()}-${idx}`,
      status: 'new'
    }));

    return { leads, text, urls };
  }

  /**
   * Enriches a lead with scoring and searches for email/instagram using Google Search grounding.
   */
  async enrichLead(lead: BusinessLead): Promise<LeadEnrichment> {
    const prompt = `You are a UK B2B lead qualification assistant for Posso Ltd.
    Target Business:
    Name: ${lead.name}
    Address: ${lead.address}
    Website: ${lead.website || 'N/A'}

    Task:
    1. Research this business using Google Search.
    2. Find an official contact email address (info@, hello@, etc.).
    3. Find their official Instagram profile handle or URL.
    4. Determine if they are a good fit for self-service kiosks and online ordering.
    5. Provide enrichment data in JSON.
    
    leadScore: 0-100 (high if they are a busy hospitality business with high footfall).`;

    // Complex reasoning with Search grounding requires Gemini 3 Pro
    const response = await this.ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            businessType: { 
              type: Type.STRING, 
              enum: ["Restaurant", "Takeaway", "Café", "Pub", "Bakery", "Other"] 
            },
            idealForKiosk: { type: Type.BOOLEAN },
            idealForOnlineOrdering: { type: Type.BOOLEAN },
            leadScore: { type: Type.INTEGER },
            notes: { type: Type.STRING },
            shortSummary: { type: Type.STRING },
            emailFound: { type: Type.STRING, description: "Official contact email address." },
            instagramFound: { type: Type.STRING, description: "Full URL to their Instagram profile." }
          },
          required: ["businessType", "idealForKiosk", "idealForOnlineOrdering", "leadScore", "notes", "shortSummary"]
        }
      }
    });

    const enrichment = JSON.parse(response.text || "{}");
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const groundingUrls = groundingChunks
      .filter((chunk: any) => chunk.web)
      .map((chunk: any) => ({
        uri: chunk.web.uri,
        title: chunk.web.title
      }));

    return { ...enrichment, groundingUrls };
  }
}