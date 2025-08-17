export interface Car {
  id: number;
  name: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  price_per_day: number;
  category_name: string;
  image_url: string;
  seats: number;
  fuel_type: string;
  transmission: string;
  available: boolean;
  description: string;
  created_at?: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  created_at?: string;
}