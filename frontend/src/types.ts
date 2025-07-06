
export interface Photo {
  id: number;
  url: string;
  name: string;
}

export interface PortfolioCategory {
  id: string;
  name: string;
  subcategories: string[];
  coverImage: string;
  photos: Photo[];
}

export interface Service {
  id: number;
  name: string;
  basePrice: number;
  discount: number;
  description: string;
  finalPrice: number;
}

export interface ContactSubmission {
  id: number;
  name: string;
  phone: string;
  email: string;
  message: string;
  timestamp: string;
}

export interface Feedback {
    id: number;
    name: string;
    rating: number;
    review: string;
    timestamp: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin';
  phone?: string;
  createdAt?: string;
}