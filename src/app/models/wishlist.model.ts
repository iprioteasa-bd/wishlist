export interface WishlistItem {
  id: number;
  name: string;
  link: string;
  priority: 'high' | 'medium' | 'low';
  description?: string; // Optional description field
  imageUrl?: string; // Optional image URL
  price?: number; // Optional price field
  purchased?: boolean; // Track if item has been purchased
  hasLink?: boolean; // Track if item should have a link
}

export interface WishlistData {
  user: string;
  lastUpdated: string;
  items: WishlistItem[];
  // Firestore document ID (will be set automatically)
  id?: string;
}
