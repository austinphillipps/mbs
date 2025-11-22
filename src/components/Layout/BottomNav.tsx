import { LayoutDashboard, Package, Users, ShoppingCart, BarChart3, Menu } from 'lucide-react';

interface BottomNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onMenuClick: () => void;
}

export function BottomNav({ currentPage, onNavigate, onMenuClick }: BottomNavProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Accueil', icon: LayoutDashboard },
    { id: 'inventory', label: 'Stock', icon: Package },
    { id: 'customers', label: 'Clients', icon: Users },
    { id: 'orders', label: 'Commandes', icon: ShoppingCart },
    { id: 'analytics', label: 'Stats', icon: BarChart3 },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 z-50 safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center min-w-0 flex-1 py-2 px-1 rounded-lg transition-all ${
                isActive
                  ? 'text-cyan-400'
                  : 'text-slate-400 active:bg-slate-800'
              }`}
            >
              <Icon className={`w-5 h-5 mb-1 ${isActive ? 'text-cyan-400' : ''}`} />
              <span className="text-[10px] font-medium truncate">{item.label}</span>
            </button>
          );
        })}
        <button
          onClick={onMenuClick}
          className="flex flex-col items-center justify-center min-w-0 flex-1 py-2 px-1 rounded-lg text-slate-400 active:bg-slate-800 transition-all"
        >
          <Menu className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-medium">Menu</span>
        </button>
      </div>
    </nav>
  );
}
