export interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  items: Product[];
  count: number;
  hasMore: boolean;
  nextCursor: string | null;
  snapshotTime: string | null;
}

export const CATEGORIES = [
  'All',
  'Electronics',
  'Books',
  'Clothing',
  'Sports',
  'Home',
  'Beauty',
  'Toys',
  'Automotive'
] as const;

export type Category = typeof CATEGORIES[number];
