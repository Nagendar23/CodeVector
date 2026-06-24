import { Category, CATEGORIES } from '../types/product';

interface CategorySelectProps {
  selectedCategory: Category | string;
  onSelectCategory: (category: string) => void;
  disabled?: boolean;
}

export default function CategorySelect({ selectedCategory, onSelectCategory, disabled }: CategorySelectProps) {
  return (
    <div className="relative group w-full min-w-[200px]">
      <select
        id="category"
        value={selectedCategory}
        onChange={(e) => onSelectCategory(e.target.value)}
        disabled={disabled}
        className="block w-full appearance-none bg-slate-800/60 border border-slate-700 text-slate-200 py-2.5 px-4 pr-10 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 disabled:opacity-50 transition-all duration-200 backdrop-blur-sm hover:border-slate-500 hover:bg-slate-800 cursor-pointer"
      >
        {CATEGORIES.map((cat) => (
          <option key={cat} value={cat} className="bg-slate-900 text-slate-200">
            {cat === 'All' ? 'All Categories' : cat}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400 group-hover:text-indigo-400 transition-colors">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  );
}
