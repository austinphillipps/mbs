import { useEffect, useState } from 'react';
import { Package, Plus, Search, AlertTriangle, TrendingUp, Edit2, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { ProductModal } from './ProductModal';

interface InventoryItem {
  id: string;
  product_id: string;
  quantity: number;
  reserved_quantity: number;
  products: {
    id: string;
    sku: string;
    name: string;
    selling_price: number;
    min_stock_level: number;
    unit_type: string;
  };
}

export function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      const { data, error } = await supabase
        .from('inventory')
        .select(`
          *,
          products (
            id,
            sku,
            name,
            selling_price,
            min_stock_level,
            unit_type
          )
        `);

      if (error) throw error;

      const sortedData = (data || []).sort((a, b) => {
        const nameA = a.products?.name || '';
        const nameB = b.products?.name || '';
        return nameA.localeCompare(nameB);
      });

      setInventory(sortedData);
    } catch (error) {
      console.error('Error loading inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredInventory = inventory.filter((item) =>
    item.products?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.products?.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStockStatus = (item: InventoryItem) => {
    const available = item.quantity - item.reserved_quantity;
    if (available <= 0) return { label: 'Rupture', color: 'text-red-400 bg-red-500/20 border-red-500/30' };
    if (available <= item.products.min_stock_level) return { label: 'Faible', color: 'text-orange-400 bg-orange-500/20 border-orange-500/30' };
    return { label: 'Normal', color: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30' };
  };

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
              placeholder="Rechercher un produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 px-6 py-3 md:px-6 md:py-3 px-3 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all shadow-lg shadow-cyan-500/25"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden md:inline">Nouveau produit</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-emerald-500/30 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-emerald-500/20 p-2 rounded-lg border border-emerald-500/30">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-slate-400">Total produits</span>
          </div>
          <p className="text-3xl font-bold text-white">{inventory.length}</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-orange-500/30 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-orange-500/20 p-2 rounded-lg border border-orange-500/30">
              <AlertTriangle className="w-5 h-5 text-orange-400" />
            </div>
            <span className="text-slate-400">Stock faible</span>
          </div>
          <p className="text-3xl font-bold text-white">
            {inventory.filter(item => {
              const available = item.quantity - item.reserved_quantity;
              return available <= item.products.min_stock_level;
            }).length}
          </p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-cyan-500/20 p-2 rounded-lg border border-cyan-500/30">
              <Package className="w-5 h-5 text-cyan-400" />
            </div>
            <span className="text-slate-400">Valeur totale</span>
          </div>
          <p className="text-3xl font-bold text-white">
            {inventory.reduce((sum, item) => sum + (item.quantity * item.products.selling_price), 0).toFixed(0)} €
          </p>
        </div>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/50 border-b border-slate-700">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">SKU</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Produit</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Stock</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Réservé</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Disponible</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Statut</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Prix</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-400">
                    Aucun produit trouvé
                  </td>
                </tr>
              ) : (
                filteredInventory.map((item) => {
                  const available = item.quantity - item.reserved_quantity;
                  const status = getStockStatus(item);

                  return (
                    <tr key={item.id} className="hover:bg-slate-900/30 transition-colors">
                      <td className="px-6 py-4 text-sm text-slate-400">{item.products?.sku}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="bg-slate-700 p-2 rounded-lg">
                            <Package className="w-4 h-4 text-cyan-400" />
                          </div>
                          <div>
                            <p className="font-medium text-white">{item.products?.name}</p>
                            <p className="text-xs text-slate-400">{item.products?.unit_type}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-white font-semibold">{item.quantity}</td>
                      <td className="px-6 py-4 text-sm text-orange-400">{item.reserved_quantity}</td>
                      <td className="px-6 py-4 text-sm text-cyan-400 font-semibold">{available}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2 py-1 text-xs rounded-md border ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-white font-medium">
                        {item.products?.selling_price.toFixed(2)} €
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end space-x-2">
                          <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                            <Edit2 className="w-4 h-4 text-slate-400 hover:text-cyan-400" />
                          </button>
                          <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ProductModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={loadInventory}
      />
    </div>
  );
}
