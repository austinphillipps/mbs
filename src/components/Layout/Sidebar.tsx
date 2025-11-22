import { Wine, LayoutDashboard, Package, Users, ShoppingCart, Truck, BarChart3, UserCircle, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const { profile, signOut } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'inventory', label: 'Inventaire', icon: Package },
    { id: 'customers', label: 'Clients', icon: Users },
    { id: 'orders', label: 'Commandes', icon: ShoppingCart },
    { id: 'suppliers', label: 'Fournisseurs', icon: Truck },
    { id: 'analytics', label: 'Analyses', icon: BarChart3 },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-2 rounded-lg">
            <Wine className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              MBS
            </h1>
            <p className="text-xs text-slate-400">Manager Pro</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800 space-y-2">
        <button
          onClick={() => onNavigate('profile')}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
            currentPage === 'profile'
              ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-400 border border-cyan-500/30'
              : 'bg-slate-800/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <UserCircle className="w-5 h-5" />
          <div className="flex-1 text-left">
            <p className="text-sm font-medium">{profile?.full_name}</p>
            <p className="text-xs opacity-75">{profile?.role}</p>
          </div>
        </button>
        <button
          onClick={signOut}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
}
