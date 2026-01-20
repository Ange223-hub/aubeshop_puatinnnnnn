
import React, { useState, useEffect } from 'react';
import { Order, User, UserRole, OrderStatus, Product } from '../types';

interface NotificationCenterProps {
  orders: Order[];
  products: Product[];
  user: User | null;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ orders, products, user }) => {
  const [notifications, setNotifications] = useState<{id: string, message: string, type: 'info' | 'warning' | 'success', icon: string, timestamp: number}[]>([]);

  useEffect(() => {
    if (!user) return;

    const newNotifications: {id: string, message: string, type: 'info' | 'warning' | 'success', icon: string, timestamp: number}[] = [];

    // 1. LOGIQUE VENDEUR
    if (user.role === UserRole.SELLER) {
      products.filter(p => p.sellerId === user.id && p.stock < 5 && p.stock > 0).forEach(p => {
        newNotifications.push({
          id: `stock-${p.id}`,
          message: `Stock bas : Plus que ${p.stock} unités de "${p.name}" !`,
          type: 'warning',
          icon: 'fa-box-open',
          timestamp: Date.now()
        });
      });

      const pendingOrders = orders.filter(o => o.sellerId === user.id && o.status === OrderStatus.PAID);
      if (pendingOrders.length > 0) {
        newNotifications.push({
          id: 'new-orders',
          message: `Vente ! ${pendingOrders.length} commande(s) attendent ta préparation.`,
          type: 'success',
          icon: 'fa-hand-holding-heart',
          timestamp: Date.now()
        });
      }
    }

    // 2. LOGIQUE LIVREUR : Matching automatique par zone
    if (user.role === UserRole.DELIVERY) {
      const openMissions = orders.filter(o => o.status === OrderStatus.PAID && !o.deliveryId);
      
      if (user.preferredZone) {
        const matches = openMissions.filter(o => 
          o.deliveryLocation.address.toLowerCase().includes(user.preferredZone!.toLowerCase())
        );
        
        if (matches.length > 0) {
          newNotifications.push({
            id: 'zone-match',
            message: `Flash Zone : ${matches.length} colis à livrer près de ${user.preferredZone} !`,
            type: 'info',
            icon: 'fa-location-crosshairs',
            timestamp: Date.now()
          });
        }
      }
    }

    // 3. LOGIQUE ACHETEUR
    if (user.role === UserRole.BUYER) {
      const moving = orders.find(o => o.buyerId === user.id && o.status === OrderStatus.DELIVERING);
      if (moving) {
        newNotifications.push({
          id: `moving-${moving.id}`,
          message: `Ton colis est en mouvement ! Le livreur approche de ta position.`,
          type: 'success',
          icon: 'fa-shipping-fast',
          timestamp: Date.now()
        });
      }
    }

    // On ne garde que les notifications uniques
    setNotifications(prev => {
      const existingIds = new Set(prev.map(n => n.id));
      const filteredNew = newNotifications.filter(n => !existingIds.has(n.id));
      return [...prev, ...filteredNew].slice(-3); // Max 3 notifications affichées
    });
  }, [orders, products, user]);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 md:left-auto md:right-6 md:translate-x-0 z-[1000] flex flex-col gap-3 w-[95%] md:w-96 pointer-events-none">
      {notifications.map((n) => (
        <div 
          key={n.id} 
          className="pointer-events-auto bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl px-6 py-5 rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex items-center gap-5 border border-white dark:border-slate-800 animate-bounce-in"
        >
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
            n.type === 'warning' ? 'bg-brand-red text-white' : 
            n.type === 'success' ? 'bg-green-500 text-white' : 
            'bg-brand-cyan text-white'
          }`}>
            <i className={`fas ${n.icon} text-lg`}></i>
          </div>
          <div className="flex-grow">
            <div className="flex justify-between items-center mb-1">
               <p className="font-black text-[8px] uppercase tracking-widest text-slate-400">Notification Push IA</p>
               <p className="text-[8px] font-bold text-slate-300">À l'instant</p>
            </div>
            <p className="font-bold text-xs leading-tight text-brand-black dark:text-white">{n.message}</p>
          </div>
          <button 
            onClick={() => setNotifications(prev => prev.filter(notif => notif.id !== n.id))}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <i className="fas fa-times text-[10px] text-slate-300"></i>
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationCenter;
