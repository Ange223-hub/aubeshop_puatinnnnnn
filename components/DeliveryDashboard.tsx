
import React, { useState, useEffect, useRef } from 'react';
import { User, Order, OrderStatus } from '../types';
import { getZoneFromCoordinates, parseSchedule } from '../services/geminiService';

interface DeliveryDashboardProps {
  user: User;
  orders: Order[];
  onUpdateOrder: (id: string, status: OrderStatus) => void;
  updateOrderLocation: (orderId: string, location: { lat: number; lng: number }) => void;
  setUser: (user: User) => void;
  commissionRate: number;
  t: any;
}

const DeliveryDashboard: React.FC<DeliveryDashboardProps> = ({ user, orders, onUpdateOrder, updateOrderLocation, setUser, commissionRate, t }) => {
  const [isWorkNow, setIsWorkNow] = useState(false);
  const [isDetectingZone, setIsDetectingZone] = useState(false);
  const [isParsingSchedule, setIsParsingSchedule] = useState(false);
  const lastCoordRef = useRef<{lat: number, lng: number} | null>(null);
  const watchIdRef = useRef<number | null>(null);

  const activeMission = orders.find(o => o.deliveryId === user.id && (o.status === OrderStatus.ACCEPTED || o.status === OrderStatus.DELIVERING));
  
  const totalDeliveryNet = orders
    .filter(o => o.status === OrderStatus.COMPLETED && o.deliveryId === user.id)
    .reduce((acc, curr) => acc + (curr.deliveryFee - curr.platformDeliveryFee), 0);

  const missionsInZone = orders.filter(o => 
    o.status === OrderStatus.PAID && 
    !o.deliveryId && 
    user.preferredZone && 
    o.deliveryLocation.address.toLowerCase().includes(user.preferredZone.toLowerCase())
  );

  useEffect(() => {
    if (isWorkNow && navigator.geolocation) {
      setIsDetectingZone(true);
      navigator.geolocation.getCurrentPosition(updatePositionAndZone);
      watchIdRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          if (activeMission) updateOrderLocation(activeMission.id, { lat: latitude, lng: longitude });
          if (!lastCoordRef.current || Math.abs(lastCoordRef.current.lat - latitude) > 0.0001) {
            updatePositionAndZone(pos);
          }
        },
        null,
        { enableHighAccuracy: true }
      );
    } else {
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
    }
    return () => { if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current); };
  }, [isWorkNow, activeMission?.id]);

  async function updatePositionAndZone(position: GeolocationPosition) {
    const { latitude, longitude } = position.coords;
    lastCoordRef.current = { lat: latitude, lng: longitude };
    try {
      const zone = await getZoneFromCoordinates(latitude, longitude);
      if (zone !== user.preferredZone) setUser({ ...user, preferredZone: zone });
    } finally { setIsDetectingZone(false); }
  }

  const handleScheduleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsParsingSchedule(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = (reader.result as string).split(',')[1];
        const schedule = await parseSchedule(base64);
        if (schedule) {
          setUser({ ...user, schedule });
          alert("Emploi du temps synchronisé avec l'IA !");
        }
        setIsParsingSchedule(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const getTrustLabel = () => {
    if (user.activityCount > 100) return "LÉGENDE DU CAMPUS";
    if (user.activityCount > 30) return "VÉTÉRAN CERTIFIÉ";
    return "LIVREUR NOVICE";
  };

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-brand-black dark:text-white mb-2 tracking-tighter">{t.deliveries}</h1>
          <div className="flex items-center gap-3">
             <div className={`w-2 h-2 rounded-full ${isWorkNow ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></div>
             <p className="text-slate-400 font-black uppercase tracking-widest text-[9px]">
               {isWorkNow ? (isDetectingZone ? 'Scanning Campus...' : `Zone : ${user.preferredZone || 'U-AUBEN'}`) : 'Indisponible'}
             </p>
          </div>
        </div>
        <button 
          onClick={() => setIsWorkNow(!isWorkNow)}
          className={`flex items-center gap-4 px-10 py-5 rounded-[28px] font-black text-[10px] uppercase tracking-widest transition-all ${isWorkNow ? 'bg-brand-pink text-white shadow-xl shadow-brand-pink/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}
        >
          <i className={`fas ${isWorkNow ? 'fa-bolt' : 'fa-power-off'}`}></i>
          {isWorkNow ? 'Service Actif' : 'Passer en ligne'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-brand-black p-10 rounded-[45px] text-white shadow-2xl relative overflow-hidden group">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">{t.earnings_today}</p>
          <p className="text-5xl font-black tracking-tighter">{totalDeliveryNet.toLocaleString()} F</p>
          <i className="fas fa-wallet absolute -right-2 -bottom-2 text-7xl opacity-10 rotate-12"></i>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-10 rounded-[45px] shadow-sm relative overflow-hidden">
          <p className="text-brand-pink text-[10px] font-black uppercase tracking-widest mb-2">Missions Proches</p>
          <p className="text-5xl font-black tracking-tighter text-brand-black dark:text-white">{missionsInZone.length}</p>
          <i className="fas fa-crosshairs absolute -right-2 -bottom-2 text-7xl opacity-5 text-brand-pink"></i>
        </div>
        <div className="bg-brand-cyan p-10 rounded-[45px] text-white shadow-2xl flex flex-col justify-between">
          <p className="text-white/50 text-[10px] font-black uppercase tracking-widest mb-2">{t.delivery_rating}</p>
          <p className="text-xl font-black tracking-widest uppercase">{getTrustLabel()}</p>
        </div>
      </div>

      {/* Section Emploi du Temps Restaurée */}
      <div className="bg-slate-50 dark:bg-slate-900 p-10 rounded-[50px] border border-slate-100 dark:border-slate-800">
         <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black uppercase tracking-widest dark:text-white">{t.schedule_title}</h2>
            <div className="relative">
               <input type="file" accept="image/*" onChange={handleScheduleUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
               <button className="bg-brand-black text-white px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest">
                 {isParsingSchedule ? <i className="fas fa-spinner fa-spin mr-2"></i> : <i className="fas fa-calendar-plus mr-2"></i>}
                 {t.schedule_upload}
               </button>
            </div>
         </div>
         {user.schedule?.ai_advice ? (
           <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm animate-fade-in">
              <p className="text-[10px] font-black text-brand-pink uppercase tracking-widest mb-2">{t.schedule_ai_advice}</p>
              <p className="text-xs font-medium dark:text-slate-300 leading-relaxed">{user.schedule.ai_advice}</p>
           </div>
         ) : (
           <div className="text-center py-10 opacity-30">
              <i className="fas fa-calendar-alt text-4xl mb-4"></i>
              <p className="text-[10px] font-black uppercase tracking-widest">Uploadez votre planning pour optimiser vos gains</p>
           </div>
         )}
      </div>

      {activeMission ? (
        <div className="bg-brand-black p-12 rounded-[50px] text-white shadow-2xl border-l-[12px] border-brand-pink animate-fade-in relative overflow-hidden">
           <div className="relative z-10">
              <div className="flex items-center gap-6 mb-10">
                <div className="w-20 h-20 bg-brand-pink rounded-[30px] flex items-center justify-center text-3xl animate-bounce">
                  <i className="fas fa-box"></i>
                </div>
                <div>
                  <h3 className="text-3xl font-black tracking-tight">{activeMission.deliveryLocation.address}</h3>
                  <p className="text-[10px] font-black text-brand-pink uppercase tracking-widest mt-1">Mission en cours • Indépendance Logistique</p>
                </div>
              </div>
              <button onClick={() => onUpdateOrder(activeMission.id, OrderStatus.COMPLETED)} className="w-full bg-white text-brand-black py-7 rounded-[30px] font-black uppercase text-xs hover:bg-brand-pink hover:text-white transition-all shadow-2xl">
                Confirmer la livraison
              </button>
           </div>
           <i className="fas fa-shipping-fast absolute -right-10 -bottom-10 text-[15rem] opacity-5 -rotate-12"></i>
        </div>
      ) : (
        <div className="grid gap-8">
           {missionsInZone.length > 0 && (
             <div className="space-y-6">
                <div className="flex items-center gap-4 px-6">
                  <span className="w-8 h-1 bg-brand-pink rounded-full"></span>
                  <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Radar {user.preferredZone}</h2>
                </div>
                <div className="grid gap-4">
                  {missionsInZone.map(o => (
                    <div key={o.id} className="bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-sm flex items-center justify-between border border-slate-100 dark:border-slate-800 hover:border-brand-pink transition-all group">
                       <div className="flex items-center gap-6">
                          <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-brand-pink group-hover:scale-110 transition-transform shadow-inner">
                            <i className="fas fa-location-dot"></i>
                          </div>
                          <div>
                            <p className="font-black dark:text-white text-lg">{o.deliveryLocation.address}</p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{o.deliveryLocation.distanceKm} KM • Revenu: {o.deliveryFee}F</p>
                          </div>
                       </div>
                       <button onClick={() => onUpdateOrder(o.id, OrderStatus.ACCEPTED)} className="bg-brand-black dark:bg-brand-pink text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-all">Accepter</button>
                    </div>
                  ))}
                </div>
             </div>
           )}
           
           {orders.filter(o => o.status === OrderStatus.PAID && !o.deliveryId && (!user.preferredZone || !o.deliveryLocation.address.toLowerCase().includes(user.preferredZone.toLowerCase()))).length > 0 && (
              <div className="space-y-6 opacity-60">
                <div className="flex items-center gap-4 px-6">
                   <span className="w-8 h-1 bg-slate-200 rounded-full"></span>
                   <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Autres opportunités Campus</h2>
                </div>
                <div className="grid gap-4">
                  {orders.filter(o => o.status === OrderStatus.PAID && !o.deliveryId && (!user.preferredZone || !o.deliveryLocation.address.toLowerCase().includes(user.preferredZone.toLowerCase()))).map(o => (
                    <div key={o.id} className="bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-sm flex items-center justify-between border border-slate-100 dark:border-slate-800">
                       <p className="font-black dark:text-white text-sm">{o.deliveryLocation.address}</p>
                       <button onClick={() => onUpdateOrder(o.id, OrderStatus.ACCEPTED)} className="text-slate-400 font-black text-[10px] uppercase hover:text-brand-black dark:hover:text-white transition-colors">Prendre</button>
                    </div>
                  ))}
                </div>
              </div>
           )}
        </div>
      )}
    </div>
  );
};

export default DeliveryDashboard;
