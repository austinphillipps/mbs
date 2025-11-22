import { X, Wine, Truck, UserCircle, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function MobileMenu({ isOpen, onClose, currentPage, onNavigate }: MobileMenuProps) {
  const { profile, signOut } = useAuth();

  const handleNavigate = (page: string) => {
    onNavigate(page);
    onClose();
  };

  const handleSignOut = async () => {
    await signOut();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      <div className="md:hidden fixed inset-y-0 right-0 w-80 max-w-[85vw] bg-slate-900 border-l border-slate-800 z-50 transform transition-transform duration-300 flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center justify-between mb-6">
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
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <button
            onClick={() => handleNavigate('profile')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
              currentPage === 'profile'
                ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-400 border border-cyan-500/30'
                : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <UserCircle className="w-5 h-5" />
            <div className="flex-1 text-left">
              <p className="text-sm font-medium">{profile?.full_name || 'Utilisateur'}</p>
              <p className="text-xs opacity-75">{profile?.role || 'Membre'}</p>
            </div>
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button
            onClick={() => handleNavigate('suppliers')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
              currentPage === 'suppliers'
                ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Truck className="w-5 h-5" />
            <span className="font-medium">Fournisseurs</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>
    </>
  );
}
