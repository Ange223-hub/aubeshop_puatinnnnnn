
import React, { useState } from 'react';
import { Product } from '../types';

interface MarketplaceProps {
  products: Product[];
  onBuy: (productId: string, preOrderTime?: string) => void;
  t: any;
}

const CATEGORIES = ["Nourriture", "Services", "Fournitures", "Mode", "Électronique"];

const Marketplace: React.FC<MarketplaceProps> = ({ products, onBuy, t }) => {
  const [search, setSearch] = useState('');

  const getProductsByCategory = (category: string) => {
    return products.filter(p => p.category === category && p.name.toLowerCase().includes(search.toLowerCase()));
  };

  return (
    <div className="animate-fade-in space-y-16 pb-20">
      {/* Hero Search Section */}
      <div className="relative">
        <div className="max-w-4xl mb-12">
          <div className="inline-flex items-center gap-3 px-5 py-2 bg-brand-pink/10 rounded-full mb-6">
            <span className="w-2 h-2 bg-brand-pink rounded-full animate-pulse"></span>
            <span className="text-brand-pink font-black text-[10px] uppercase tracking-widest">{t.market_badge}</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-brand-black dark:text-white leading-[0.85] tracking-tighter mb-8">
            {t.market_title}
          </h1>
          <div className="w-full max-w-xl">
            <div className="relative group bg-white dark:bg-slate-900 rounded-[30px] border border-slate-100 dark:border-slate-800 p-1 shadow-xl">
               <i className="fas fa-search absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-pink transition-colors"></i>
               <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t.search_placeholder} 
                className="w-full pl-16 pr-6 py-5 bg-transparent border-none focus:ring-0 font-bold text-sm dark:text-white"
               />
            </div>
          </div>
        </div>
      </div>

      {/* Sections Horizontales */}
      {CATEGORIES.map(category => {
        const catProducts = getProductsByCategory(category);
        if (catProducts.length === 0 && search) return null;
        
        return (
          <div key={category} className="space-y-8">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-2xl font-black text-brand-black dark:text-white flex items-center gap-4">
                <span className="w-8 h-1 bg-brand-pink rounded-full"></span>
                {category}
              </h2>
              <button className="text-[10px] font-black uppercase text-slate-400 hover:text-brand-pink tracking-widest transition-colors">Voir Tout</button>
            </div>
            
            <div className="flex gap-8 overflow-x-auto pb-8 px-2 snap-x no-scrollbar scroll-smooth">
              {catProducts.length > 0 ? catProducts.map(product => (
                <div key={product.id} className="snap-start flex-shrink-0 w-[280px] md:w-[320px] group bg-white dark:bg-slate-900 rounded-[45px] overflow-hidden border border-slate-100 dark:border-slate-800 hover:border-brand-pink transition-all duration-500 flex flex-col shadow-sm hover:shadow-2xl">
                  <div className="h-56 overflow-hidden relative">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute top-4 left-4 right-4 flex justify-between">
                      <span className={`px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest shadow-lg ${product.stock < 5 ? 'bg-brand-red text-white' : 'bg-green-500 text-white'}`}>
                        {product.stock > 0 ? `${product.stock} en stock` : 'Rupture'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-8 flex-grow flex flex-col">
                    <div className="mb-4">
                      <h3 className="font-black text-lg text-brand-black dark:text-white line-clamp-1 mb-1">{product.name}</h3>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Par {product.sellerName}</p>
                    </div>

                    <p className="text-slate-400 text-[10px] mb-6 line-clamp-2 font-medium leading-relaxed">{product.description}</p>
                    
                    <div className="mt-auto pt-6 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                      <p className="text-2xl font-black text-brand-black dark:text-white tracking-tighter">{product.price.toLocaleString()} F</p>
                      <button 
                        onClick={() => onBuy(product.id)}
                        disabled={product.stock === 0}
                        className="bg-brand-black dark:bg-brand-pink text-white w-12 h-12 rounded-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl disabled:opacity-30"
                      >
                        <i className="fas fa-cart-plus text-sm"></i>
                      </button>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="w-full py-12 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[45px] text-slate-300">
                  <i className="fas fa-box-open text-2xl mb-4"></i>
                  <p className="text-[10px] font-black uppercase tracking-widest">Aucun produit dans cette ligne</p>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {products.length === 0 && (
        <div className="py-40 flex flex-col items-center justify-center text-center opacity-50">
          <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-8">
            <i className="fas fa-shopping-bag text-4xl text-slate-300"></i>
          </div>
          <h3 className="text-xl font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest max-w-sm">
            {t.stock_empty}
          </h3>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
