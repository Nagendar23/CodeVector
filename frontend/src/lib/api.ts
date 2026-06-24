import { ProductsResponse } from '../types/product';

export async function fetchProducts(
  category?: string,
  cursor?: string | null,
  snapshotTime?: string | null,
  limit: number = 10
): Promise<ProductsResponse> {
  const params = new URLSearchParams();
  
  if (category && category !== 'All') {
    params.append('category', category);
  }
  
  if (cursor) {
    params.append('cursor', cursor);
  }
  
  if (snapshotTime) {
    params.append('snapshotTime', snapshotTime);
  }
  
  params.append('limit', limit.toString());

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const url = `${baseUrl}/api/products?${params.toString()}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }

  return response.json();
}
