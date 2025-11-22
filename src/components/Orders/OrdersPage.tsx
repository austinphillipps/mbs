import { useEffect, useState } from 'react';
import { ShoppingCart, Plus, Search, Calendar, DollarSign, CheckCircle, Clock, XCircle, Edit, Trash2 } from 'lucide-react';
import { supabase, Order } from '../../lib/supabase';
import { OrderModal } from './OrderModal';

interface OrderWithCustomer extends Order {
  customers?: {
    company_name: string;
    contact_name: string;
  };
}

export function OrdersPage() {
  const [orders, setOrders] = useState<OrderWithCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState<OrderWithCustomer | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, customers(company_name, contact_name)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customers?.company_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return CheckCircle;
      case 'cancelled':
        return XCircle;
      case 'processing':
      case 'shipped':
        return Clock;
      default:
        return ShoppingCart;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'processing':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'shipped':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'confirmed':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getPaymentColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'partial':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const handleEdit = (order: OrderWithCustomer) => {
    setEditingOrder(order);
    setShowModal(true);
  };

  const handleDelete = async (orderId: string) => {
    if (deleteConfirm !== orderId) {
      setDeleteConfirm(orderId);
      setTimeout(() => setDeleteConfirm(null), 3000);
      return;
    }

    try {
      await supabase.from('order_items').delete().eq('order_id', orderId);

      const { error } = await supabase.from('orders').delete().eq('id', orderId);

      if (error) throw error;

      await loadOrders();
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingOrder(null);
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
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher une commande..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
        >
          <option value="all">Tous les statuts</option>
          <option value="draft">Brouillon</option>
          <option value="confirmed">Confirmé</option>
          <option value="processing">En traitement</option>
          <option value="shipped">Expédié</option>
          <option value="delivered">Livré</option>
          <option value="cancelled">Annulé</option>
        </select>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 px-3 py-3 md:px-6 md:py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all shadow-lg shadow-cyan-500/25"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden md:inline">Nouvelle commande</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-cyan-500/20 p-2 rounded-lg border border-cyan-500/30">
              <ShoppingCart className="w-5 h-5 text-cyan-400" />
            </div>
            <span className="text-slate-400">Total</span>
          </div>
          <p className="text-3xl font-bold text-white">{orders.length}</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-blue-500/30 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-blue-500/20 p-2 rounded-lg border border-blue-500/30">
              <Clock className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-slate-400">En cours</span>
          </div>
          <p className="text-3xl font-bold text-white">
            {orders.filter((o) => ['confirmed', 'processing', 'shipped'].includes(o.status)).length}
          </p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-emerald-500/30 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-emerald-500/20 p-2 rounded-lg border border-emerald-500/30">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-slate-400">Livrées</span>
          </div>
          <p className="text-3xl font-bold text-white">
            {orders.filter((o) => o.status === 'delivered').length}
          </p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-orange-500/30 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-orange-500/20 p-2 rounded-lg border border-orange-500/30">
              <DollarSign className="w-5 h-5 text-orange-400" />
            </div>
            <span className="text-slate-400">Valeur totale</span>
          </div>
          <p className="text-3xl font-bold text-white">
            {orders.reduce((sum, o) => sum + Number(o.total_amount), 0).toFixed(0)} €
          </p>
        </div>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/50 border-b border-slate-700">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">N° Commande</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Client</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Statut</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Paiement</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">Montant</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    Aucune commande trouvée
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const StatusIcon = getStatusIcon(order.status);

                  return (
                    <tr key={order.id} className="hover:bg-slate-900/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="bg-cyan-500/20 p-2 rounded-lg border border-cyan-500/30">
                            <ShoppingCart className="w-4 h-4 text-cyan-400" />
                          </div>
                          <span className="font-medium text-white">{order.order_number}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-white">{order.customers?.company_name}</p>
                          <p className="text-sm text-slate-400">{order.customers?.contact_name}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2 text-sm text-slate-400">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(order.order_date).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs rounded-md border ${getStatusColor(order.status)}`}>
                          <StatusIcon className="w-3 h-3" />
                          <span>{order.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2 py-1 text-xs rounded-md border ${getPaymentColor(order.payment_status)}`}>
                          {order.payment_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="font-semibold text-white text-lg">{Number(order.total_amount).toFixed(2)} €</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(order)}
                            className="p-2 hover:bg-slate-700 rounded-lg transition-colors group"
                            title="Modifier"
                          >
                            <Edit className="w-4 h-4 text-slate-400 group-hover:text-cyan-400" />
                          </button>
                          <button
                            onClick={() => handleDelete(order.id)}
                            className={`p-2 rounded-lg transition-colors group ${
                              deleteConfirm === order.id
                                ? 'bg-red-500/20 hover:bg-red-500/30'
                                : 'hover:bg-slate-700'
                            }`}
                            title={deleteConfirm === order.id ? 'Confirmer la suppression' : 'Supprimer'}
                          >
                            <Trash2 className={`w-4 h-4 ${
                              deleteConfirm === order.id
                                ? 'text-red-400'
                                : 'text-slate-400 group-hover:text-red-400'
                            }`} />
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

      <OrderModal
        isOpen={showModal}
        onClose={handleModalClose}
        onSuccess={loadOrders}
        order={editingOrder}
      />
    </div>
  );
}
