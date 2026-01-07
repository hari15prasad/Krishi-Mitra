
export type Language = 'en' | 'hi' | 'bn' | 'te' | 'mr' | 'ta' | 'gu' | 'kn' | 'ml' | 'pa';

export interface UserProfile {
  name: string;
  phone: string;
  state: string;
  district: string;
  landSize: string;
  crops: string[];
}

export interface Scheme {
  id: string;
  name: string;
  benefits: string;
  eligibility: string;
  state: string;
  link: string;
  documents: string[];
}

export interface CropPrice {
  crop: string;
  market: string;
  state: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  date: string;
}

export interface TranslationDict {
  [key: string]: {
    [lang in Language]: string;
  };
}
