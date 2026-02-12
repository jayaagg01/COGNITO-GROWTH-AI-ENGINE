
export type View = 'home' | 'website-builder' | 'ad-generator' | 'pricing';

export interface GeneratedWebsite {
  html: string;
  timestamp: number;
}

export interface AdCreative {
  imageUrl: string;
  prompt: string;
}

export enum ModelType {
  WEBSITE = 'gemini-3-pro-preview',
  ADS = 'gemini-3-pro-image-preview'
}
