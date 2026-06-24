'use client';

import { useState, useEffect, useCallback } from 'react';
import { Product } from '../types/product';
import { fetchProducts } from '../lib/api';
import CategorySelect from '../components/CategorySelect';
import ProductList from '../components/ProductList';
import LoadMoreButton from '../components/LoadMoreButton';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<string>('All');
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [snapshotTime, setSnapshotTime] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadMoreLoading, setIsLoadMoreLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadInitialProducts = useCallback(async (selectedCategory: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetchProducts(
        selectedCategory === 'All' ? undefined : selectedCategory,
        null,
        null
      );
      
      setProducts(response.items);
      setNextCursor(response.nextCursor);
      setSnapshotTime(response.snapshotTime);
      setHasMore(response.hasMore);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching products.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialProducts(category);
  }, [category, loadInitialProducts]);

  const handleLoadMore = async () => {
    if (!hasMore || isLoadMoreLoading) return;
    
    try {
      setIsLoadMoreLoading(true);
      setError(null);
      
      const response = await fetchProducts(
        category === 'All' ? undefined : category,
        nextCursor,
        snapshotTime
      );
      
      setProducts(prev => [...prev, ...response.items]);
      setNextCursor(response.nextCursor);
      setSnapshotTime(response.snapshotTime);
      setHasMore(response.hasMore);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching more products.');
    } finally {
      setIsLoadMoreLoading(false);
    }
  };

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setProducts([]);
    setNextCursor(null);
    setSnapshotTime(null);
    setHasMore(true);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 selection:bg-indigo-500/30 overflow-x-hidden">
      {/* Background styling elements */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 -z-10"></div>
      <div className="absolute top-0 left-1/2 w-[800px] h-[500px] bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none transform -translate-x-1/2 -translate-y-1/2 -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 relative z-10">
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-4 drop-shadow-sm">
            Discover Products
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Browse our latest collection with real-time updates and seamless pagination.
          </p>
        </header>

        <section className="bg-slate-900/60 p-6 md:p-8 rounded-3xl border border-slate-800/80 backdrop-blur-xl shadow-2xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h2 className="text-2xl font-bold text-slate-100 tracking-tight">Catalog</h2>
            <div className="w-full sm:w-auto">
              <CategorySelect 
                selectedCategory={category} 
                onSelectCategory={handleCategoryChange} 
                disabled={isLoading && products.length === 0}
              />
            </div>
          </div>

          {error && (
            <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-start">
              <svg className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <h3 className="text-sm font-medium">Error loading products</h3>
                <p className="text-sm mt-1 opacity-80">{error}</p>
                <button 
                  onClick={() => products.length === 0 ? loadInitialProducts(category) : handleLoadMore()}
                  className="mt-3 text-sm font-medium text-red-400 hover:text-red-300 underline underline-offset-2 transition-colors"
                >
                  Try again
                </button>
              </div>
            </div>
          )}

          {isLoading && products.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-slate-800/40 rounded-2xl h-[180px] border border-slate-700/30"></div>
              ))}
            </div>
          ) : (
            <>
              <ProductList products={products} />
              
              {products.length > 0 && (
                <LoadMoreButton 
                  onClick={handleLoadMore} 
                  isLoading={isLoadMoreLoading} 
                  hasMore={hasMore} 
                />
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}
