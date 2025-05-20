export interface Place {
  place_id: string;
  name: string;
  address: string;
  google_rating: number;
  cig_rating: number;
  latitude: number;
  longitude: number;
  distance_km?: number;
  open_status: 'OPEN' | 'CLOSED' | 'UNKNOWN';
  available_brands: string[];
  available_accessories: string[];
  reviews?: Review[];
}

export interface Review {
  id: number;
  userName: string;
  rating: number;
  text: string;
  date: string;
}

export interface CheckInDTO {
  place_id: string;
  open_confirm: boolean;
  brands: string[];
}

export interface StockDTO {
  place_id: string;
  brand: string;
  has_stock: boolean;
} 