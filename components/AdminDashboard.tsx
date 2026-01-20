
import React from 'react';
import { Order, User, OrderStatus } from '../types';

interface AdminDashboardProps {
  orders: Order[];
  users: User[];
  t: any;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ orders, users, t }) => {
  const totalVolume = orders.reduce((acc, curr) => acc + curr.productPrice + curr.deliveryFee, 0);
  const totalCommissions = orders.reduce((acc, curr) => acc + curr.platformSaleFee + curr.platformDeliveryFee, 0);
  const activeOrders = orders.filter(o => o.status !== OrderStatus.COMPLETED && o.status !== OrderStatus.CANCELLED).length;

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-brand-black dark:text-white mb-2">{t.admin_panel}</h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">AubeShop System Controller</p>
        </div>
        <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 px-6 py-3 rounded-2xl">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Serveur Live</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-brand-black p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden group border border-slate-800">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
            <i className="fas fa-chart-line text-7xl"></i>
          </div>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{t.total_volume}</p>
          <p className="text-5xl font-black tracking-tighter">{totalVolume.toLocaleString()} F</p>
        </div>
        
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-10 rounded-[40px] shadow-sm">
          <p className="text-brand-pink text-[10px] font-black uppercase tracking-[0.2em] mb-2">{t.platform_revenue}</p>
          <p className="text-5xl font-black tracking-tighter text-brand-black dark:text-white">{totalCommissions.toLocaleString()} F</p>
        </div>
        
        <div className="bg-brand-cyan p-10 rounded-[40px] text-white shadow-2xl">
          <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Missions Actives</p>
          <p className="text-5xl font-black tracking-tighter">{activeOrders}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 p-10 overflow-hidden shadow-sm">
        <h3 className="text-xl font-black mb-10 text-brand-black dark:text-white uppercase tracking-widest">{t.admin_orders}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50 dark:border-slate-800">
                <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">ID</th>
                <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Statut</th>
                <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Client</th>
                <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Recette</th>
                <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                  <td className="py-8 font-black text-brand-black dark:text-white text-sm">{order.id}</td>
                  <td className="py-8">
                    <span className="text-[9px] font-black px-4 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 uppercase tracking-widest">{order.status}</span>
                  </td>
                  <td className="py-8 text-slate-500 text-sm font-bold">{users.find(u => u.id === order.buyerId)?.name || 'Anonyme'}</td>
                  <td className="py-8 font-black text-brand-pink text-sm">{(order.platformSaleFee + order.platformDeliveryFee).toLocaleString()} F</td>
                  <td className="py-8">
                     <button className="bg-slate-100 dark:bg-slate-800 p-3 rounded-xl text-slate-500 hover:text-brand-pink transition-colors">
                       <i className="fas fa-eye"></i>
                     </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
