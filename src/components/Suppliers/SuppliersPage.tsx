import { useEffect, useState } from 'react';
import { Truck, Plus, Search, Phone, Mail, MapPin } from 'lucide-react';
import { supabase, Supplier } from '../../lib/supabase';
import { SupplierModal } from './SupplierModal';

export function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .eq('active', true)
        .order('name');

      if (error) throw error;
      setSuppliers(data || []);
    } catch (error) {
      console.error('Error loading suppliers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contact_person?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher un fournisseur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 px-3 py-3 md:px-6 md:py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all shadow-lg shadow-cyan-500/25"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden md:inline">Nouveau fournisseur</span>
        </button>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className="bg-cyan-500/20 p-2 rounded-lg border border-cyan-500/30">
            <Truck className="w-5 h-5 text-cyan-400" />
          </div>
          <span className="text-slate-400">Total fournisseurs</span>
        </div>
        <p className="text-3xl font-bold text-white">{suppliers.length}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredSuppliers.length === 0 ? (
          <div className="col-span-full bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-12 text-center">
            <Truck className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">Aucun fournisseur trouvé</p>
          </div>
        ) : (
          filteredSuppliers.map((supplier) => (
            <div
              key={supplier.id}
              className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 hover:border-cyan-500/50 rounded-xl p-6 transition-all hover:scale-105 cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-br from-orange-500 to-red-600 p-3 rounded-xl">
                    <Truck className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-lg">{supplier.name}</h3>
                    {supplier.contact_person && (
                      <p className="text-sm text-slate-400">{supplier.contact_person}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {supplier.email && (
                  <div className="flex items-center space-x-2 text-sm text-slate-400">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{supplier.email}</span>
                  </div>
                )}
                {supplier.phone && (
                  <div className="flex items-center space-x-2 text-sm text-slate-400">
                    <Phone className="w-4 h-4" />
                    <span>{supplier.phone}</span>
                  </div>
                )}
                {supplier.city && (
                  <div className="flex items-center space-x-2 text-sm text-slate-400">
                    <MapPin className="w-4 h-4" />
                    <span>{supplier.city}, {supplier.country}</span>
                  </div>
                )}
              </div>

              {supplier.payment_terms && (
                <div className="pt-4 border-t border-slate-700">
                  <p className="text-xs text-slate-500 mb-1">Conditions de paiement</p>
                  <p className="font-semibold text-cyan-400">{supplier.payment_terms}</p>
                </div>
              )}

              {supplier.notes && (
                <div className="mt-3 p-3 bg-slate-900/50 rounded-lg">
                  <p className="text-xs text-slate-400 line-clamp-2">{supplier.notes}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <SupplierModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={loadSuppliers}
      />
    </div>
  );
}
