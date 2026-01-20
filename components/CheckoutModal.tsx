
import React, { useState } from 'react';
import { PaymentMethod, Product, User, DeliveryType } from '../types';

interface CheckoutModalProps {
  product: Product;
  user: User;
  deliveryFee: number;
  onConfirm: (method: PaymentMethod, txId: string, deliveryType: DeliveryType) => void;
  onClose: () => void;
  t: any;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ product, user, deliveryFee, onConfirm, onClose, t }) => {
  const [method, setMethod] = useState<PaymentMethod>(PaymentMethod.ORANGE_MONEY);
  const [deliveryType, setDeliveryType] = useState<DeliveryType>(DeliveryType.DELIVERY);
  const [txId, setTxId] = useState('');
  
  const [estDistance] = useState(parseFloat((Math.random() * 3 + 0.5).toFixed(1)));
  const dynamicFee = Math.ceil(300 + (estDistance * 150));
  
  const currentDeliveryFee = deliveryType === DeliveryType.DELIVERY ? dynamicFee : 0;
  const total = product.price + currentDeliveryFee;

  return (
    <div className="fixed inset-0 bg-brand-black/95 backdrop-blur-2xl z-[120] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-950 w-full max-w-lg rounded-[55px] p-12 shadow-2xl relative animate-bounce-in overflow-y-auto max-h-[90vh]">
        <button onClick={onClose} className="absolute top-8 right-8 text-slate-400 hover:text-brand-black dark:hover:text-white transition-colors">
          <i className="fas fa-times text-xl"></i>
        </button>

        <h2 className="text-3xl font-black text-brand-black dark:text-white mb-10 tracking-tighter">{t.checkout_title}</h2>

        <div className="space-y-8 mb-10">
           <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setDeliveryType(DeliveryType.DELIVERY)}
                className={`p-6 rounded-[35px] border-2 text-center transition-all flex flex-col items-center gap-3 ${deliveryType === DeliveryType.DELIVERY ? 'border-brand-pink bg-brand-pink/5' : 'border-slate-100 dark:border-slate-800'}`}
              >
                <i className={`fas fa-motorcycle text-2xl ${deliveryType === DeliveryType.DELIVERY ? 'text-brand-pink' : 'text-slate-300'}`}></i>
                <p className="text-[10px] font-black uppercase tracking-widest leading-none">Livraison (+{dynamicFee}F)</p>
              </button>

              <button 
                onClick={() => setDeliveryType(DeliveryType.PICKUP)}
                className={`p-6 rounded-[35px] border-2 text-center transition-all flex flex-col items-center gap-3 ${deliveryType === DeliveryType.PICKUP ? 'border-brand-cyan bg-brand-cyan/5' : 'border-slate-100 dark:border-slate-800'}`}
              >
                <i className={`fas fa-store-alt text-2xl ${deliveryType === DeliveryType.PICKUP ? 'text-brand-cyan' : 'text-slate-300'}`}></i>
                <p className="text-[10px] font-black uppercase tracking-widest leading-none">Retrait Gratuit</p>
              </button>
           </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900 p-10 rounded-[45px] mb-10 border border-slate-100 dark:border-slate-800 shadow-inner">
           <div className="flex justify-between items-center mb-4">
             <span className="text-slate-400 font-bold uppercase text-[9px] tracking-widest">{product.name}</span>
             <span className="font-black text-md text-brand-black dark:text-white">{product.price.toLocaleString()} F</span>
           </div>
           <div className="flex justify-between items-center mb-8">
             <span className="text-slate-400 font-bold uppercase text-[9px] tracking-widest">Frais Campus</span>
             <span className="font-black text-md text-brand-black dark:text-white">{currentDeliveryFee.toLocaleString()} F</span>
           </div>
           <div className="flex justify-between items-center pt-8 border-t border-slate-200 dark:border-slate-800">
             <span className="text-brand-pink font-black uppercase text-[11px] tracking-widest">Total à payer</span>
             <span className="text-4xl font-black text-brand-black dark:text-white tracking-tighter">{total.toLocaleString()} F</span>
           </div>
        </div>

        <div className="space-y-8">
          <div className="flex gap-4">
             <button onClick={() => setMethod(PaymentMethod.ORANGE_MONEY)} className={`flex-1 p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-2 ${method === PaymentMethod.ORANGE_MONEY ? 'border-orange-500 bg-orange-500/5' : 'border-slate-100 dark:border-slate-800'}`}>
               <span className="text-orange-500 font-black text-[10px] tracking-widest">ORANGE</span>
             </button>
             <button onClick={() => setMethod(PaymentMethod.MOOV_MONEY)} className={`flex-1 p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-2 ${method === PaymentMethod.MOOV_MONEY ? 'border-brand-cyan bg-brand-cyan/5' : 'border-slate-100 dark:border-slate-800'}`}>
               <span className="text-brand-cyan font-black text-[10px] tracking-widest">MOOV</span>
             </button>
          </div>

          <div className="p-8 bg-brand-black rounded-[35px] text-center border border-slate-800 shadow-2xl space-y-4">
             <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">1. Effectuez le transfert vers :</p>
             <p className="text-3xl font-black text-white tracking-[0.2em] animate-pulse">66 79 80 31</p>
             <p className="text-slate-400 text-[9px] font-bold">Composez *144*4*1*66798031*MONTANT# (Exemple Orange)</p>
          </div>

          <div className="space-y-3">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">2. Collez la référence SMS ici :</p>
            <input 
              type="text" 
              placeholder="Ex: MP241205.1234.A12345" 
              value={txId} 
              onChange={(e) => setTxId(e.target.value)} 
              className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-900 border-none rounded-[28px] font-black text-xs dark:text-white focus:ring-2 ring-brand-pink shadow-inner uppercase" 
            />
          </div>

          <button 
            disabled={!txId}
            onClick={() => onConfirm(method, txId, deliveryType)}
            className="w-full bg-brand-black dark:bg-brand-pink text-white py-6 rounded-[30px] font-black text-sm uppercase tracking-widest disabled:opacity-20 hover:scale-[1.02] transition-all shadow-2xl"
          >
            {t.confirm_payment}
          </button>
          
          <p className="text-center text-[8px] text-slate-400 font-black uppercase tracking-tighter">
            * Votre commande sera vérifiée manuellement après validation de la référence.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
