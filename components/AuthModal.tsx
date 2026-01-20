
import React, { useState } from 'react';
import { UserRole, User } from '../types';
import { verifyStudentId } from '../services/geminiService';
import { Language } from '../translations';

interface AuthModalProps {
  onClose: () => void;
  onLogin: (user: User) => void;
  t: any;
  lang: Language;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose, onLogin, t, lang }) => {
  const [role, setRole] = useState<UserRole>(UserRole.BUYER);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [idCardPreview, setIdCardPreview] = useState<string | null>(null);
  const [guestName, setGuestName] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setIdCardPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAction = async () => {
    if (role === UserRole.BUYER) {
      if (!guestName) return alert(lang === 'fr' ? 'Veuillez entrer votre nom' : 'Please enter your name');
      onLogin({ 
        id: Math.random().toString(36).substr(2, 9), 
        name: guestName, 
        email: 'guest@aubeshop.com', 
        role: UserRole.BUYER, 
        isVerified: false,
        activityCount: 0 
      });
      return;
    }

    if (!idCardPreview) return alert(t.scan_id);

    setIsLoading(true);
    try {
      const base64 = idCardPreview.split(',')[1];
      const result = await verifyStudentId(base64);
      
      const isAdminRequest = role === UserRole.ADMIN;
      const extractedName = result.full_name?.toUpperCase() || "";
      const isActuallyAdmin = extractedName.includes('ANGE STEPHANE') || extractedName.includes('SAWADOGO');

      if (isAdminRequest && !isActuallyAdmin) {
        alert(lang === 'fr' ? "Accès Administration refusé." : "Admin Access Denied.");
        setIsLoading(false);
        return;
      }

      if (result.isValid || isAdminRequest) {
        onLogin({ 
          id: result.student_id || Math.random().toString(36).substr(2, 9), 
          name: result.full_name || (isAdminRequest ? "Admin Principal" : "Étudiant"), 
          email: `${(result.student_id || 'student').toLowerCase()}@u-auben.com`, 
          role: isAdminRequest ? UserRole.ADMIN : role, 
          isVerified: true, 
          studentIdCard: idCardPreview,
          activityCount: 1
        });
      } else {
        alert(lang === 'fr' ? 'Carte non reconnue ou invalide.' : 'Invalid ID card.');
      }
    } catch (e) {
      alert('Erreur technique lors de la vérification.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-brand-black/80 dark:bg-black/90 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[40px] p-10 shadow-2xl relative overflow-hidden animate-bounce-in transition-colors">
        <button onClick={onClose} className="absolute top-8 right-8 text-slate-300 hover:text-brand-black transition-colors">
          <i className="fas fa-times text-xl"></i>
        </button>

        <div className="mb-10 text-center">
          <h2 className="text-3xl font-black text-brand-black dark:text-white mb-2">{t.auth_title}</h2>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">{t.auth_subtitle}</p>
        </div>

        {step === 1 ? (
          <div className="space-y-4">
            <div className="grid gap-2">
              {[
                { id: UserRole.BUYER, label: t.role_buyer, desc: t.role_buyer_desc, icon: 'fa-user', color: 'bg-brand-pink' },
                { id: UserRole.SELLER, label: t.role_seller, desc: t.role_seller_desc, icon: 'fa-store', color: 'bg-brand-red' },
                { id: UserRole.DELIVERY, label: t.role_delivery, desc: t.role_delivery_desc, icon: 'fa-motorcycle', color: 'bg-brand-cyan' },
                { id: UserRole.ADMIN, label: t.role_admin, desc: t.role_admin_desc, icon: 'fa-user-shield', color: 'bg-slate-800' }
              ].map(r => (
                <button key={r.id} onClick={() => setRole(r.id)} className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${role === r.id ? 'border-brand-black dark:border-brand-pink bg-slate-50 dark:bg-slate-800' : 'border-slate-50 dark:border-slate-800'}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${role === r.id ? r.color : 'bg-slate-200 dark:bg-slate-700'}`}>
                    <i className={`fas ${r.icon} text-sm`}></i>
                  </div>
                  <div>
                    <span className="block font-black text-brand-black dark:text-white text-sm leading-none mb-1">{r.label}</span>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{r.desc}</span>
                  </div>
                </button>
              ))}
            </div>
            
            {role === UserRole.BUYER && (
              <div className="animate-fade-in mt-4">
                <input type="text" placeholder="Entrez votre prénom..." value={guestName} onChange={(e) => setGuestName(e.target.value)} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-xl font-black dark:text-white" />
              </div>
            )}

            <button onClick={() => role === UserRole.BUYER ? handleAction() : setStep(2)} className="w-full bg-brand-black dark:bg-brand-pink text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-[1.02] transition-all mt-6 shadow-xl">
              {role === UserRole.BUYER ? t.start_shopping : t.continue_verify}
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="border-4 border-dashed border-slate-100 dark:border-slate-800 rounded-[35px] p-10 text-center bg-slate-50 dark:bg-slate-800/50 relative group cursor-pointer transition-all">
              <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 z-10 cursor-pointer" title="Uploader" />
              {idCardPreview ? (
                <img src={idCardPreview} className="max-h-56 mx-auto rounded-2xl shadow-2xl" alt="ID" />
              ) : (
                <div className="space-y-4">
                  <div className="w-20 h-20 bg-white dark:bg-slate-700 rounded-3xl flex items-center justify-center mx-auto text-slate-200">
                    <i className="fas fa-id-card text-4xl"></i>
                  </div>
                  <p className="text-xs text-slate-500 font-black uppercase tracking-tight">{t.scan_id}</p>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <button onClick={() => setStep(1)} className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-400 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest">{t.back}</button>
              <button onClick={handleAction} disabled={!idCardPreview || isLoading} className="flex-[2] bg-brand-black dark:bg-brand-pink text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest disabled:opacity-50 transition-all shadow-xl">
                {isLoading ? <i className="fas fa-circle-notch fa-spin text-xl"></i> : t.verify_and_open}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
