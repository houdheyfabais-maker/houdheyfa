export interface Review {
  id: string;
  user: string;
  avatar: string;
  rating: number;
  text: string;
  date: string;
}

export interface AppData {
  id: string;
  name: string;
  developer: string;
  category: string;
  iconUrl: string;
  rating: number;
  downloads: string;
  description: string;
  shortDescription: string;
  screenshots: string[];
  reviews: Review[];
  isAiGenerated?: boolean;
  tags?: string[];
}

export type Category = 'For you' | 'Top charts' | 'Kids' | 'Premium' | 'Categories';
