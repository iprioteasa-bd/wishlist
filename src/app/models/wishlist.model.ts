export interface WishlistItem {
  id: number;
  name: string;
  link: string;
  priority: 'high' | 'medium' | 'low';
}

export interface WishlistData {
  user: string;
  lastUpdated: string;
  items: WishlistItem[];
}
