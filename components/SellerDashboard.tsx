
import React, { useState } from 'react';
import { User, Product, Order, OrderStatus } from '../types';

interface SellerDashboardProps {
  user: User;
  products: Product[];
  orders: Order[];
  onUpdateOrder: (id: string, status: OrderStatus) => void;
  onAddProduct: (product: Omit<Product, 'id' | 'sellerId' | 'sellerName' | 'createdAt' | 'rating' | 'reviewCount'>) => void;
  onDeleteProduct: (id: string) => void;
  onUpdateUser: (user: User) => void;
  commissionRate: number;
  t: any;
}

const SellerDashboard: React.FC<SellerDashboardProps> = ({ user, products, orders, onUpdateOrder, onAddProduct, onDeleteProduct, onUpdateUser, commissionRate, t }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProd, setNewProd] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Nourriture',
    image: '',
    stock: '10',
    allowPreOrder: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProd.image) return alert("Photo requise !");
    onAddProduct({
      name: newProd.name,
      description: newProd.description,
      price: parseInt(newProd.price) || 0,
      category: newProd.category,
      image: newProd.image,
      stock: parseInt(newProd.stock) || 0,
      allowPreOrder: newProd.allowPreOrder
    });
    setNewProd({ name: '', description: '', price: '', category: 'Nourriture', image: '', stock: '10', allowPreOrder: false });
    setShowAddModal(false);
  };

  const totalGross = orders.filter(o => o.status === OrderStatus.COMPLETED).reduce((acc, o) => acc + o.productPrice, 0);
  const totalNet = totalGross * (1 - commissionRate);

  return (
    <div className="space-y-12 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h1 className="text-5xl font-black text-brand-black dark:text-white mb-2 tracking-tighter">{t.my_business}</h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Merchant: {user.name}</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="bg-brand-black dark:bg-brand-pink text-white px-10 py-5 rounded-[28px] font-black shadow-2xl flex items-center justify-center gap-4 hover:scale-[1.02] transition-all">
          <i className="fas fa-plus"></i> {t.add_product}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-brand-black p-10 rounded-[45px] text-white shadow-2xl relative overflow-hidden group">
           <div className="absolute right-0 bottom-0 p-6 opacity-10 rotate-12 group-hover:scale-125 transition-transform">
             <i className="fas fa-coins text-8xl"></i>
           </div>
           <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-4">Revenu Net (Après -{commissionRate * 100}%)</p>
           <p className="text-5xl font-black tracking-tighter">{totalNet.toLocaleString()} F</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-10 rounded-[45px] shadow-sm">
           <p className="text-brand-pink text-[10px] font-black uppercase tracking-widest mb-4">Stock Alertes</p>
           <p className="text-5xl font-black tracking-tighter text-brand-black dark:text-white">{products.filter(p => p.stock < 5).length}</p>
        </div>
        <div className="bg-brand-cyan p-10 rounded-[45px] text-white shadow-2xl">
           <p className="text-white/50 text-[10px] font-black uppercase tracking-widest mb-4">Ventes Effectuées</p>
           <p className="text-5xl font-black tracking-tighter">{orders.filter(o => o.status === OrderStatus.COMPLETED).length}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[50px] border border-slate-100 dark:border-slate-800 p-10 shadow-sm">
        <h3 className="text-2xl font-black mb-12 text-brand-black dark:text-white uppercase tracking-widest flex items-center gap-4">
          <span className="w-12 h-1 bg-brand-pink rounded-full"></span>
          Mon Catalogue
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map(product => (
            <div key={product.id} className="group p-8 border border-slate-100 dark:border-slate-800 rounded-[40px] bg-slate-50/30 dark:bg-slate-800/20 hover:border-brand-pink transition-all">
               <div className="flex items-center gap-6 mb-8">
                  <div className="relative">
                    <img src={product.image} className="w-20 h-20 rounded-3xl object-cover shadow-lg" alt="" />
                    <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-lg ${product.stock < 5 ? 'bg-brand-red' : 'bg-green-500'}`}>
                      <span className="text-[10px] font-black">{product.stock}</span>
                    </div>
                  </div>
                  <div className="flex-grow">
                     <p className="font-black text-lg dark:text-white mb-1 line-clamp-1">{product.name}</p>
                     <p className="text-brand-pink font-black text-sm">{product.price.toLocaleString()} F</p>
                  </div>
                  <button onClick={() => onDeleteProduct(product.id)} className="text-slate-200 hover:text-brand-red transition-colors p-2">
                    <i className="fas fa-trash-alt"></i>
                  </button>
               </div>
               <div className="flex gap-3">
                  <span className="flex-grow px-6 py-3 bg-white dark:bg-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 text-center border border-slate-100 dark:border-slate-800">
                    {product.category}
                  </span>
                  <button className="px-6 py-3 bg-brand-black dark:bg-brand-pink text-white rounded-2xl text-[10px] font-black uppercase tracking-widest">
                    Éditer
                  </button>
               </div>
            </div>
          ))}
          {products.length === 0 && (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[40px]">
               <i className="fas fa-plus-circle text-4xl text-slate-100 dark:text-slate-800 mb-6"></i>
               <p className="text-slate-300 font-black uppercase tracking-widest text-xs">Aucun produit en vente</p>
            </div>
          )}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-brand-black/95 backdrop-blur-2xl z-[300] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-950 w-full max-w-xl rounded-[50px] p-12 animate-bounce-in overflow-y-auto max-h-[90vh] shadow-2xl">
            <h2 className="text-3xl font-black mb-10 dark:text-white tracking-tighter">Nouveau Produit</h2>
            <form onSubmit={handleSubmit} className="space-y-8">
               <div className="flex justify-center mb-10">
                  <div className="relative group w-40 h-40">
                     {newProd.image ? (
                        <img src={newProd.image} className="w-full h-full rounded-[40px] object-cover shadow-2xl" alt="" />
                     ) : (
                        <div className="w-full h-full rounded-[40px] bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center text-slate-300 border-4 border-dashed border-slate-100 dark:border-slate-800 hover:border-brand-pink transition-colors">
                           <i className="fas fa-camera text-4xl mb-3"></i>
                           <span className="text-[10px] font-black uppercase tracking-widest">Photo</span>
                        </div>
                     )}
                     <input type="file" accept="image/*" onChange={(e) => {
                       const file = e.target.files?.[0];
                       if (file) {
                         const r = new FileReader();
                         r.onloadend = () => setNewProd({...newProd, image: r.result as string});
                         r.readAsDataURL(file);
                       }
                     }} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
               </div>
               
               <div className="grid gap-6">
                 <input type="text" placeholder="Nom du produit" required value={newProd.name} onChange={e => setNewProd({...newProd, name: e.target.value})} className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-900 rounded-3xl border-none font-bold text-sm dark:text-white" />
                 <div className="grid grid-cols-2 gap-6">
                    <input type="number" placeholder="Prix (F)" required value={newProd.price} onChange={e => setNewProd({...newProd, price: e.target.value})} className="px-8 py-5 bg-slate-50 dark:bg-slate-900 rounded-3xl border-none font-bold text-sm dark:text-white" />
                    <input type="number" placeholder="Stock initial" required value={newProd.stock} onChange={e => setNewProd({...newProd, stock: e.target.value})} className="px-8 py-5 bg-slate-50 dark:bg-slate-900 rounded-3xl border-none font-bold text-sm dark:text-white" />
                 </div>
                 <select value={newProd.category} onChange={e => setNewProd({...newProd, category: e.target.value})} className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-900 rounded-3xl border-none font-bold text-sm dark:text-white appearance-none">
                    <option>Nourriture</option>
                    <option>Services</option>
                    <option>Fournitures</option>
                    <option>Mode</option>
                    <option>Électronique</option>
                 </select>
                 <textarea placeholder="Description rapide..." value={newProd.description} onChange={e => setNewProd({...newProd, description: e.target.value})} className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-900 rounded-3xl border-none font-bold text-sm dark:text-white h-32" />
               </div>
               
               <div className="flex gap-6 pt-6">
                  <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-5 font-black uppercase text-[10px] text-slate-400 hover:text-brand-black transition-all">Annuler</button>
                  <button type="submit" className="flex-[2] bg-brand-black dark:bg-brand-pink text-white py-5 rounded-3xl font-black uppercase text-[10px] tracking-widest shadow-2xl">Publier sur le campus</button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;
