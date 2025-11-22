import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginPage } from './components/Auth/LoginPage';
import { Sidebar } from './components/Layout/Sidebar';
import { Header } from './components/Layout/Header';
import { BottomNav } from './components/Layout/BottomNav';
import { MobileMenu } from './components/Layout/MobileMenu';
import { DashboardPage } from './components/Dashboard/DashboardPage';
import { InventoryPage } from './components/Inventory/InventoryPage';
import { CustomersPage } from './components/Customers/CustomersPage';
import { OrdersPage } from './components/Orders/OrdersPage';
import { SuppliersPage } from './components/Suppliers/SuppliersPage';
import { AnalyticsPage } from './components/Analytics/AnalyticsPage';
import { ProfilePage } from './components/Profile/ProfilePage';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  const pageTitle = {
    dashboard: 'Tableau de bord',
    inventory: 'Gestion des stocks',
    customers: 'Gestion des clients',
    orders: 'Gestion des commandes',
    suppliers: 'Gestion des fournisseurs',
    analytics: 'Analyses et rapports',
    profile: 'Mon profil',
  }[currentPage] || 'Tableau de bord';

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {!isMobile && <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />}

      <main className="flex-1 flex flex-col overflow-hidden">
        <Header title={pageTitle} />

        <div className="flex-1 overflow-y-auto pb-20 md:pb-0">
          <div className="p-4 md:p-6">
            {currentPage === 'dashboard' && <DashboardPage />}
            {currentPage === 'inventory' && <InventoryPage />}
            {currentPage === 'customers' && <CustomersPage />}
            {currentPage === 'orders' && <OrdersPage />}
            {currentPage === 'suppliers' && <SuppliersPage />}
            {currentPage === 'analytics' && <AnalyticsPage />}
            {currentPage === 'profile' && <ProfilePage />}
          </div>
        </div>
      </main>

      <BottomNav
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onMenuClick={() => setIsMobileMenuOpen(true)}
      />

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
