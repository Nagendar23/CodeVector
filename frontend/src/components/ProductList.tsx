import { Product } from '../types/product';

interface ProductListProps {
  products: Product[];
}

export default function ProductList({ products }: ProductListProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 animate-in fade-in duration-500">
        <div className="bg-slate-800/40 p-6 rounded-full mb-4 ring-1 ring-slate-700/50">
          <svg className="w-12 h-12 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-slate-200 mb-2">No products found</h3>
        <p className="text-slate-400 text-center max-w-sm">
          We couldn't find any products in this category. Try selecting a different one.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <div 
          key={product._id}
          className="group flex flex-col bg-slate-800/30 border border-slate-700/50 rounded-2xl overflow-hidden backdrop-blur-sm hover:bg-slate-800/60 hover:border-indigo-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10"
        >
          <div className="p-6 flex-grow flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 ring-1 ring-inset ring-indigo-500/20">
                {product.category}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-100 mb-2 line-clamp-2 group-hover:text-indigo-300 transition-colors">
              {product.name}
            </h3>
            <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-700/50">
              <span className="text-2xl font-black text-white">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-xs text-slate-500">
                {new Date(product.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
