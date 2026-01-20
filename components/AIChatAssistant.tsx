
import { GoogleGenAI } from "@google/genai";
import React, { useState, useRef, useEffect } from 'react';
import { Product, Order, User, UserRole, OrderStatus } from '../types';

interface AIChatAssistantProps {
  products: Product[];
  orders: Order[];
  users: User[];
  user: User | null;
}

const AIChatAssistant: React.FC<AIChatAssistantProps> = ({ products, orders, users, user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: "Salut ! Je suis Dania, l'IA opérationnelle du réseau AubeShop. En quoi puis-je t'aider aujourd'hui ?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    const isAdmin = user?.role === UserRole.ADMIN;
    let globalStats = "";
    
    if (isAdmin) {
      const totalVolume = orders.reduce((acc, o) => acc + o.productPrice, 0);
      const totalComm = orders.reduce((acc, o) => acc + o.platformSaleFee + o.platformDeliveryFee, 0);
      const studentRevenues = users.map(u => {
          const rev = orders.filter(o => o.sellerId === u.id && o.status === OrderStatus.COMPLETED)
                            .reduce((sum, o) => sum + o.productPrice, 0);
          return `${u.name} (ID:${u.id}): ${rev}F`;
      }).join(", ");
      
      globalStats = `[DATA MASTER CONTROL - ANGE ONLY] : 
      - Volume Total de ventes : ${totalVolume}F
      - Revenus de la plateforme (Tes gains Ange) : ${totalComm}F
      - Détail des revenus par étudiant : ${studentRevenues}
      - Total d'utilisateurs inscrits : ${users.length}`;
    }

    const activity = user?.activityCount || 0;
    const trustLevel = activity > 100 ? "LÉGENDE" : activity > 30 ? "VÉTÉRAN" : "NOVICE";

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction: `Tu es DANIA, l'intelligence opérationnelle d'AubeShop, créée et gérée par Ange Stéphane SAWADOGO.
          
          RÈGLES D'OR :
          1. INDÉPENDANCE : AubeShop est un réseau 100% indépendant. Ne mentionne jamais l'administration de l'université.
          2. RECONNAISSANCE : Identifie l'utilisateur (${user?.name}). Niveau d'activité : ${activity} (${trustLevel}). Plus l'utilisateur est actif, plus tu es familière et complice avec lui.
          3. SÉCURITÉ ADMIN : Les statistiques globales (${globalStats}) ne doivent être révélées QUE si l'utilisateur est ADMIN (Ange). Si un utilisateur normal demande les ventes des autres, refuse avec fermeté et professionnalisme.
          4. MISSION : Ton but est de maximiser la satisfaction des utilisateurs tout en protégeant les intérêts et les revenus d'Ange.
          5. EXPERTISE : Tu connais tout sur l'appli (Mode Sombre, GPS Livreur, Paiement Orange/Moov). Vante la fluidité du système conçu par Ange.
          
          DONNÉES TEMPS RÉEL :
          - Produits actifs: ${products.length}
          - Commandes totales: ${orders.length}
          ${globalStats}
          
          Réponds de manière concise, intelligente et stratégique.`,
        }
      });

      setMessages(prev => [...prev, { role: 'ai', text: response.text || "Synchronisation perdue." }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: "Le réseau Dania est momentanément indisponible." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const getLevelColor = () => {
    if (!user) return 'bg-slate-400';
    if (user.activityCount > 100) return 'bg-brand-cyan shadow-[0_0_10px_#06B6D4]';
    if (user.activityCount > 30) return 'bg-brand-pink shadow-[0_0_10px_#FF2D85]';
    return 'bg-brand-black';
  };

  return (
    <div className="fixed bottom-6 right-6 z-[200]">
      {isOpen ? (
        <div className="bg-white dark:bg-slate-900 w-80 md:w-96 h-[550px] rounded-[35px] shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col overflow-hidden animate-fade-in">
          <div className="bg-brand-black dark:bg-slate-950 p-6 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-pink text-white rounded-xl flex items-center justify-center shadow-lg relative">
                <i className="fas fa-wand-magic-sparkles text-sm"></i>
                <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-slate-950 ${getLevelColor()}`}></div>
              </div>
              <div>
                <p className="font-black text-xs uppercase tracking-widest leading-none mb-1">Dania Core</p>
                <p className="text-[8px] opacity-50 font-bold uppercase tracking-tighter">
                  {user ? `${user.name.split(' ')[0]} • ${user.activityCount > 100 ? 'Légende' : user.activityCount > 30 ? 'Vétéran' : 'Novice'}` : 'Guest Mode'}
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-transform opacity-50 hover:opacity-100 p-2">
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-4 bg-slate-50/20 dark:bg-slate-950/20">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-[22px] text-[11px] font-bold leading-relaxed ${
                  m.role === 'user' 
                  ? 'bg-brand-black text-white rounded-tr-none shadow-lg' 
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-tl-none border border-slate-100 dark:border-slate-700 shadow-sm'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-full flex gap-1">
                  <div className="w-1 h-1 bg-brand-pink rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-brand-pink rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1 h-1 bg-brand-pink rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
            <div className="flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Intelligence Opérationnelle..."
                className="flex-grow bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-5 py-4 text-xs font-bold dark:text-white focus:ring-1 ring-brand-pink transition-all"
              />
              <button 
                onClick={handleSend}
                className="w-12 h-12 bg-brand-pink text-white rounded-2xl flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all"
              >
                <i className="fas fa-paper-plane text-xs"></i>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-brand-black dark:bg-brand-pink text-white rounded-[22px] shadow-2xl flex items-center justify-center text-xl hover:scale-110 active:scale-90 transition-all animate-float relative"
        >
          <i className="fas fa-wand-magic-sparkles"></i>
          {user && user.role === UserRole.ADMIN && (
             <div className="absolute -top-1 -right-1 bg-brand-cyan text-white text-[8px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-950 animate-pulse">
               M
             </div>
          )}
        </button>
      )}
    </div>
  );
};

export default AIChatAssistant;
