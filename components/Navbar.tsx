
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { Language } from '../translations';

interface NavbarProps {
  user: User | null;
  onAuthClick: () => void;
  onLogout: () => void;
  onDeleteAccount: () => void;
  onDeleteStore: () => void;
  onViewChange: (view: string) => void;
  currentView: string;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  lang: Language;
  setLang: (lang: Language) => void;
  t: any;
}

const Navbar: React.FC<NavbarProps> = ({ user, onAuthClick, onLogout, onDeleteAccount, onDeleteStore, onViewChange, currentView, theme, setTheme, lang, setLang, t }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <nav className="bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl sticky top-0 z-50 border-b border-slate-100 dark:border-slate-800 transition-all">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        
        <div className="flex items-center gap-4 cursor-pointer group" onClick={() => onViewChange('marketplace')}>
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 bg-brand-black dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-700">
               <img 
                src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" 
                alt="Leader Logo" 
                className="w-full h-full object-cover scale-75 group-hover:scale-90 transition-transform"
               />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black text-brand-black dark:text-white tracking-tighter leading-none">Aube<span className="text-brand-pink">Shop</span></span>
            <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t.slogan_nav}</span>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl">
            <button onClick={() => onViewChange('marketplace')} className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${currentView === 'marketplace' ? 'bg-white dark:bg-slate-800 text-brand-black dark:text-white shadow-sm' : 'text-slate-400 hover:text-brand-black dark:hover:text-white'}`}>{t.discover}</button>
            {user && (
              <>
                <button onClick={() => onViewChange('dashboard')} className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${currentView === 'dashboard' ? 'bg-white dark:bg-slate-800 text-brand-black dark:text-white shadow-sm' : 'text-slate-400 hover:text-brand-black dark:hover:text-white'}`}>
                  {user.role === UserRole.SELLER ? t.my_business : user.role === UserRole.DELIVERY ? t.deliveries : t.my_purchases}
                </button>
                {user.role === UserRole.ADMIN && (
                   <button onClick={() => onViewChange('admin')} className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${currentView === 'admin' ? 'bg-brand-pink text-white shadow-sm' : 'text-slate-400 hover:text-brand-pink'}`}>
                    {t.admin_panel}
                   </button>
                )}
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-900 rounded-xl">
             <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-brand-pink transition-colors">
               <i className={`fas ${theme === 'light' ? 'fa-moon' : 'fa-sun'}`}></i>
             </button>
             <div className="w-[1px] h-4 bg-slate-200 dark:bg-slate-700 mx-1"></div>
             <select 
               value={lang} 
               onChange={(e) => setLang(e.target.value as Language)}
               className="bg-transparent text-[10px] font-black uppercase outline-none text-slate-400 cursor-pointer"
             >
               <option value="fr">FR</option>
               <option value="en">EN</option>
               <option value="cn">CN</option>
             </select>
          </div>

          {user ? (
            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 bg-slate-100 dark:bg-slate-900 pl-2 pr-4 py-2 rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-800 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
              >
                <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=111827&color=fff`} className="w-8 h-8 rounded-xl shadow-sm object-cover" alt="" />
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-black dark:text-white hidden md:inline">{user.name.split(' ')[0]}</span>
                <i className={`fas fa-chevron-down text-[8px] text-slate-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`}></i>
              </button>
              
              {showUserMenu && (
                <div className="absolute top-full right-0 mt-3 w-56 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 p-3 animate-fade-in">
                   <button 
                    onClick={() => { onViewChange('dashboard'); setShowUserMenu(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase text-slate-500 hover:text-brand-black dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all"
                   >
                     <i className="fas fa-th-large"></i> Dashboard
                   </button>
                   
                   {user.role === UserRole.SELLER && (
                     <button 
                      onClick={() => { onDeleteStore(); setShowUserMenu(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase text-brand-red hover:bg-brand-red/5 rounded-xl transition-all"
                     >
                       <i className="fas fa-store-slash"></i> {t.delete_store}
                     </button>
                   )}

                   <div className="h-[1px] bg-slate-50 dark:bg-slate-800 my-2"></div>
                   
                   <button 
                    onClick={() => { onDeleteAccount(); setShowUserMenu(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase text-brand-red hover:bg-brand-red/5 rounded-xl transition-all opacity-70 hover:opacity-100"
                   >
                     <i className="fas fa-user-slash"></i> {t.delete_account}
                   </button>

                   <button 
                    onClick={() => { onLogout(); setShowUserMenu(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase text-slate-400 hover:text-brand-black dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all mt-1"
                   >
                     <i className="fas fa-sign-out-alt"></i> {t.logout}
                   </button>
                </div>
              )}
            </div>
          ) : (
            <button onClick={onAuthClick} className="bg-brand-black dark:bg-brand-pink text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-brand-pink transition-all">{t.connect}</button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
