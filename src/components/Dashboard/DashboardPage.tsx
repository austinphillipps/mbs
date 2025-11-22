import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Package, Users, ShoppingCart, DollarSign, AlertTriangle, Activity } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Stats {
  totalRevenue: number;
  revenueChange: number;
  totalOrders: number;
  ordersChange: number;
  totalCustomers: number;
  customersChange: number;
  lowStockItems: number;
  stockChange: number;
}

export function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalRevenue: 0,
    revenueChange: 0,
    totalOrders: 0,
    ordersChange: 0,
    totalCustomers: 0,
    customersChange: 0,
    lowStockItems: 0,
    stockChange: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [ordersRes, customersRes, inventoryRes] = await Promise.all([
        supabase.from('orders').select('*', { count: 'exact' }),
        supabase.from('customers').select('*', { count: 'exact' }),
        supabase.from('inventory').select('*, products(name, min_stock_level)'),
      ]);

      const totalRevenue = ordersRes.data?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;
      const totalOrders = ordersRes.count || 0;
      const totalCustomers = customersRes.count || 0;

      const lowStock = inventoryRes.data?.filter(
        (item: any) => item.quantity <= item.products?.min_stock_level
      ) || [];

      setStats({
        totalRevenue,
        revenueChange: 12.5,
        totalOrders,
        ordersChange: 8.2,
        totalCustomers,
        customersChange: 5.3,
        lowStockItems: lowStock.length,
        stockChange: -3.1,
      });

      const { data: recent } = await supabase
        .from('orders')
        .select('*, customers(company_name)')
        .order('created_at', { ascending: false })
        .limit(5);

      setRecentOrders(recent || []);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Chiffre d\'affaires',
      value: `${stats.totalRevenue.toFixed(2)} €`,
      change: stats.revenueChange,
      icon: DollarSign,
      color: 'from-emerald-500 to-green-600',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
    },
    {
      title: 'Commandes',
      value: stats.totalOrders.toString(),
      change: stats.ordersChange,
      icon: ShoppingCart,
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
    },
    {
      title: 'Clients actifs',
      value: stats.totalCustomers.toString(),
      change: stats.customersChange,
      icon: Users,
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30',
    },
    {
      title: 'Stock faible',
      value: stats.lowStockItems.toString(),
      change: stats.stockChange,
      icon: AlertTriangle,
      color: 'from-orange-500 to-red-600',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/30',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          const isPositive = card.change >= 0;

          return (
            <div
              key={card.title}
              className={`bg-slate-800/50 backdrop-blur-sm border ${card.borderColor} rounded-xl p-6 hover:scale-105 transition-transform`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`${card.bgColor} p-3 rounded-lg border ${card.borderColor}`}>
                  <Icon className={`w-6 h-6 bg-gradient-to-r ${card.color} bg-clip-text text-transparent`} style={{ WebkitTextStroke: '1px' }} />
                </div>
                <div className={`flex items-center space-x-1 text-sm ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                  {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span>{Math.abs(card.change)}%</span>
                </div>
              </div>
              <p className="text-slate-400 text-sm mb-1">{card.title}</p>
              <p className="text-2xl font-bold text-white">{card.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              <span>Commandes récentes</span>
            </h3>
          </div>

          <div className="space-y-4">
            {recentOrders.length === 0 ? (
              <p className="text-slate-400 text-center py-8">Aucune commande pour le moment</p>
            ) : (
              recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-700 hover:border-cyan-500/30 transition-all"
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-cyan-500/20 p-2 rounded-lg border border-cyan-500/30">
                      <ShoppingCart className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{order.order_number}</p>
                      <p className="text-sm text-slate-400">{order.customers?.company_name || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-white">{Number(order.total_amount).toFixed(2)} €</p>
                    <span className={`inline-block px-2 py-1 text-xs rounded-md ${
                      order.status === 'delivered' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      order.status === 'processing' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                      'bg-slate-600/20 text-slate-400 border border-slate-600/30'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
            <Package className="w-5 h-5 text-orange-400" />
            <span>Alertes stock</span>
          </h3>

          <div className="space-y-3">
            {stats.lowStockItems === 0 ? (
              <p className="text-slate-400 text-sm text-center py-8">Tous les stocks sont au niveau optimal</p>
            ) : (
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-orange-400" />
                  <p className="font-medium text-orange-400">Attention requise</p>
                </div>
                <p className="text-sm text-slate-300">
                  {stats.lowStockItems} produit(s) nécessitent un réapprovisionnement
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
