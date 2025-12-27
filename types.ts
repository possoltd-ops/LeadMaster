

export interface BusinessLead {
  id: string;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  website?: string;
  rating?: number;
  types?: string[];
  mapsUrl?: string;
  status: 'new' | 'enriching' | 'completed' | 'failed';
  enrichment?: LeadEnrichment;
}

export interface LeadEnrichment {
  businessType: "Restaurant" | "Takeaway" | "Café" | "Pub" | "Bakery" | "Other";
  idealForKiosk: boolean;
  idealForOnlineOrdering: boolean;
  leadScore: number;
  notes: string;
  shortSummary: string;
  emailFound?: string;
  instagramFound?: string;
  groundingUrls?: { uri: string; title: string }[];
}

export interface SearchResult {
  leads: BusinessLead[];
  groundingUrls: { uri: string; title: string }[];
}

export interface EmailTemplate {
  subject: string;
  body: string;
}