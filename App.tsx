
import React, { useState, useEffect } from 'react';
import { User, UserRole, Product, Order, OrderStatus, PaymentMethod, DeliveryType } from './types';
import { Language, translations } from './translations';
import Navbar from './components/Navbar';
import Marketplace from './components/Marketplace';
import SellerDashboard from './components/SellerDashboard';
import DeliveryDashboard from './components/DeliveryDashboard';
import AdminDashboard from './components/AdminDashboard';
import AuthModal from './components/AuthModal';
import CheckoutModal from './components/CheckoutModal';
import NotificationCenter from './components/NotificationCenter';
import AIChatAssistant from './components/AIChatAssistant';

const PLATFORM_SALE_COMMISSION = 0.03;
const PLATFORM_DELIVERY_COMMISSION = 0.01;

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [currentView, setCurrentView] = useState<'marketplace' | 'dashboard' | 'admin'>('marketplace');
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [lang, setLang] = useState<Language>('fr');

  const t = translations[lang] || translations['fr'];

  useEffect(() => {
    const savedUser = localStorage.getItem('aubeshop_user');
    if (savedUser) setUser(JSON.parse(savedUser));
    const savedProducts = localStorage.getItem('aubeshop_products');
    if (savedProducts) setProducts(JSON.parse(savedProducts));
    const savedOrders = localStorage.getItem('aubeshop_orders');
    if (savedOrders) setOrders(JSON.parse(savedOrders));
    const savedUsers = localStorage.getItem('aubeshop_users');
    if (savedUsers) setUsers(JSON.parse(savedUsers));
    const savedTheme = localStorage.getItem('aubeshop_theme') as 'light' | 'dark';
    if (savedTheme) setTheme(savedTheme);
  }, []);

  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('aubeshop_theme', theme);
  }, [theme]);

  const trackActivity = () => {
    if (user) {
      const updated = { ...user, activityCount: (user.activityCount || 0) + 1 };
      setUser(updated);
      localStorage.setItem('aubeshop_user', JSON.stringify(updated));
      const updatedUsers = users.map(u => u.id === updated.id ? updated : u);
      setUsers(updatedUsers);
      localStorage.setItem('aubeshop_users', JSON.stringify(updatedUsers));
    }
  };

  const handleLogin = (userData: User) => {
    const enrichedUser = { ...userData, activityCount: userData.activityCount || 1 };
    setUser(enrichedUser);
    localStorage.setItem('aubeshop_user', JSON.stringify(enrichedUser));
    const newUsersList = users.find(u => u.id === userData.id) ? users : [...users, enrichedUser];
    setUsers(newUsersList);
    localStorage.setItem('aubeshop_users', JSON.stringify(newUsersList));
    setShowAuth(false);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('aubeshop_user');
    setCurrentView('marketplace');
  };

  const handleDeleteAccount = () => {
    if (window.confirm(t.confirm_delete_account)) {
      if (user) {
        const updatedUsers = users.filter(u => u.id !== user.id);
        setUsers(updatedUsers);
        localStorage.setItem('aubeshop_users', JSON.stringify(updatedUsers));
        
        const updatedProducts = products.filter(p => p.sellerId !== user.id);
        setProducts(updatedProducts);
        localStorage.setItem('aubeshop_products', JSON.stringify(updatedProducts));
      }
      setUser(null);
      localStorage.removeItem('aubeshop_user');
      setCurrentView('marketplace');
    }
  };

  const handleDeleteStore = () => {
    if (window.confirm(t.confirm_delete_store) && user) {
      const updatedProducts = products.filter(p => p.sellerId !== user.id);
      setProducts(updatedProducts);
      localStorage.setItem('aubeshop_products', JSON.stringify(updatedProducts));
      
      const updatedUser = { ...user, role: UserRole.BUYER };
      setUser(updatedUser);
      localStorage.setItem('aubeshop_user', JSON.stringify(updatedUser));
      
      const updatedUsers = users.map(u => u.id === user.id ? updatedUser : u);
      setUsers(updatedUsers);
      localStorage.setItem('aubeshop_users', JSON.stringify(updatedUsers));
      
      setCurrentView('marketplace');
    }
  };

  const handleBuyClick = (productId: string) => {
    if (!user) { setShowAuth(true); return; }
    trackActivity();
    const product = products.find(p => p.id === productId);
    if (product && product.stock > 0) setCheckoutProduct(product);
  };

  const handleConfirmOrder = (method: PaymentMethod, txId: string, deliveryType: DeliveryType) => {
    if (!user || !checkoutProduct) return;
    
    const newProducts = products.map(p => p.id === checkoutProduct.id ? { ...p, stock: Math.max(0, p.stock - 1) } : p);
    setProducts(newProducts);
    localStorage.setItem('aubeshop_products', JSON.stringify(newProducts));
    
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      buyerId: user.id,
      sellerId: checkoutProduct.sellerId,
      productId: checkoutProduct.id,
      productPrice: checkoutProduct.price,
      deliveryFee: deliveryType === DeliveryType.DELIVERY ? 300 : 0,
      platformSaleFee: checkoutProduct.price * PLATFORM_SALE_COMMISSION,
      platformDeliveryFee: (deliveryType === DeliveryType.DELIVERY ? 300 : 0) * PLATFORM_DELIVERY_COMMISSION,
      status: OrderStatus.PAID,
      paymentMethod: method,
      deliveryType: deliveryType,
      transactionId: txId,
      deliveryLocation: { lat: 12.3, lng: -1.5, address: "Campus U-AUBEN", distanceKm: 1.5 },
      createdAt: new Date().toISOString()
    };
    
    const newOrdersList = [newOrder, ...orders];
    setOrders(newOrdersList);
    localStorage.setItem('aubeshop_orders', JSON.stringify(newOrdersList));
    setCheckoutProduct(null);
    trackActivity();
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 transition-colors duration-500">
      <Navbar 
        user={user} 
        onAuthClick={() => setShowAuth(true)} 
        onLogout={handleLogout} 
        onDeleteAccount={handleDeleteAccount}
        onDeleteStore={handleDeleteStore}
        onViewChange={(view) => setCurrentView(view as any)} 
        currentView={currentView} 
        theme={theme} 
        setTheme={setTheme} 
        lang={lang} 
        setLang={setLang} 
        t={t} 
      />
      
      <main className="flex-grow container mx-auto px-6 py-12">
        {currentView === 'marketplace' ? (
          <Marketplace products={products} onBuy={handleBuyClick} t={t} />
        ) : (
          <div className="space-y-8 max-w-6xl mx-auto">
            {user?.role === UserRole.ADMIN && currentView === 'admin' && <AdminDashboard orders={orders} users={users} t={t} />}
            {user?.role === UserRole.SELLER && currentView === 'dashboard' && <SellerDashboard user={user} products={products.filter(p => p.sellerId === user.id)} orders={orders.filter(o => o.sellerId === user.id)} onUpdateOrder={(id, s) => { setOrders(prev => prev.map(o => o.id === id ? {...o, status: s} : o)); trackActivity(); }} onAddProduct={(p) => { const prod = { ...p, id: Math.random().toString(36).substr(2, 9).toUpperCase(), sellerId: user.id, sellerName: user.name, rating: 5, reviewCount: 0, createdAt: new Date().toISOString() }; const nps = [prod, ...products]; setProducts(nps); localStorage.setItem('aubeshop_products', JSON.stringify(nps)); trackActivity(); }} onDeleteProduct={(id) => { const nps = products.filter(p => p.id !== id); setProducts(nps); localStorage.setItem('aubeshop_products', JSON.stringify(nps)); }} onUpdateUser={(u) => { setUser(u); localStorage.setItem('aubeshop_user', JSON.stringify(u)); }} commissionRate={PLATFORM_SALE_COMMISSION} t={t} />}
            {user?.role === UserRole.DELIVERY && currentView === 'dashboard' && <DeliveryDashboard user={user} orders={orders.filter(o => o.deliveryType === DeliveryType.DELIVERY && (!o.deliveryId || o.deliveryId === user.id))} onUpdateOrder={(id, s) => { setOrders(prev => prev.map(o => o.id === id ? {...o, status: s, deliveryId: user.id} : o)); trackActivity(); }} updateOrderLocation={(id, loc) => setOrders(prev => prev.map(o => o.id === id ? {...o, driverLocation: loc} : o))} setUser={(u) => { setUser(u); localStorage.setItem('aubeshop_user', JSON.stringify(u)); }} commissionRate={PLATFORM_DELIVERY_COMMISSION} t={t} />}
            {user?.role === UserRole.BUYER && currentView === 'dashboard' && (
              <div className="bg-slate-50 dark:bg-slate-900 p-12 rounded-[50px] border border-slate-100 dark:border-slate-800 animate-fade-in shadow-inner">
                <h2 className="text-4xl font-black mb-12 text-brand-black dark:text-white tracking-tighter">{t.my_purchases}</h2>
                <div className="grid gap-6">
                  {orders.filter(o => o.buyerId === user.id).map(order => (
                    <div key={order.id} className="p-10 border border-slate-200 dark:border-slate-800 rounded-[40px] bg-white dark:bg-slate-900 shadow-sm flex justify-between items-center group">
                      <div>
                        <p className="font-black dark:text-white text-xl">{products.find(p => p.id === order.productId)?.name || 'Produit'}</p>
                        <p className="text-[10px] uppercase font-bold text-slate-400 mt-1 tracking-widest">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span className="text-[10px] font-black px-6 py-2 bg-brand-pink/10 text-brand-pink rounded-full uppercase tracking-widest">{order.status}</span>
                    </div>
                  ))}
                  {orders.filter(o => o.buyerId === user.id).length === 0 && (
                    <div className="text-center py-24 opacity-30">
                       <i className="fas fa-shopping-cart text-6xl mb-6 block"></i>
                       <p className="font-black uppercase tracking-widest">Aucun achat pour le moment</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="py-12 border-t border-slate-100 dark:border-slate-800 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">{t.footer_official}</p>
        <p className="text-[9px] font-bold text-brand-pink uppercase tracking-tighter">
          Réseau Étudiant Indépendant • v1.6.0
        </p>
      </footer>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onLogin={handleLogin} t={t} lang={lang} />}
      {checkoutProduct && user && <CheckoutModal product={checkoutProduct} user={user} deliveryFee={300} onConfirm={handleConfirmOrder} onClose={() => setCheckoutProduct(null)} t={t} />}
      <NotificationCenter orders={orders} products={products} user={user} />
      <AIChatAssistant products={products} orders={orders} users={users} user={user} />
    </div>
  );
};

export default App;
