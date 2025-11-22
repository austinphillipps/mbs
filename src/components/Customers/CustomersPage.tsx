import { useEffect, useState } from 'react';
import { Users, Plus, Search, Phone, Mail, MapPin, Building2, Star } from 'lucide-react';
import { supabase, Customer } from '../../lib/supabase';
import { CustomerModal } from './CustomerModal';

export function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('active', true)
        .order('company_name');

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error('Error loading customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter((customer) =>
    customer.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.contact_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCustomerTypeIcon = (type: string) => {
    switch (type) {
      case 'restaurant':
        return '🍽️';
      case 'hotel':
        return '🏨';
      case 'bar':
        return '🍹';
      case 'retail':
        return '🏪';
      default:
        return '🏢';
    }
  };

  const getCustomerTypeColor = (type: string) => {
    switch (type) {
      case 'restaurant':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'hotel':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'bar':
        return 'bg-pink-500/20 text-pink-400 border-pink-500/30';
      case 'retail':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
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
              placeholder="Rechercher un client..."
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
          <span className="hidden md:inline">Nouveau client</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {['restaurant', 'hotel', 'bar', 'retail'].map((type) => (
          <div key={type} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-2xl">{getCustomerTypeIcon(type)}</span>
              <span className="text-slate-400 capitalize">{type}s</span>
            </div>
            <p className="text-3xl font-bold text-white">
              {customers.filter((c) => c.customer_type === type).length}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCustomers.length === 0 ? (
          <div className="col-span-full bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-12 text-center">
            <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">Aucun client trouvé</p>
          </div>
        ) : (
          filteredCustomers.map((customer) => (
            <div
              key={customer.id}
              className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 hover:border-cyan-500/50 rounded-xl p-6 transition-all hover:scale-105 cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-3 rounded-xl">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-lg">{customer.company_name}</h3>
                    <p className="text-sm text-slate-400">{customer.contact_name}</p>
                  </div>
                </div>
                <span className={`inline-block px-2 py-1 text-xs rounded-md border ${getCustomerTypeColor(customer.customer_type)}`}>
                  {getCustomerTypeIcon(customer.customer_type)} {customer.customer_type}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                {customer.email && (
                  <div className="flex items-center space-x-2 text-sm text-slate-400">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{customer.email}</span>
                  </div>
                )}
                {customer.phone && (
                  <div className="flex items-center space-x-2 text-sm text-slate-400">
                    <Phone className="w-4 h-4" />
                    <span>{customer.phone}</span>
                  </div>
                )}
                {customer.city && (
                  <div className="flex items-center space-x-2 text-sm text-slate-400">
                    <MapPin className="w-4 h-4" />
                    <span>{customer.city}, {customer.country}</span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-700 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500">Limite crédit</p>
                  <p className="font-semibold text-white">{customer.credit_limit.toFixed(2)} €</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Conditions</p>
                  <p className="font-semibold text-cyan-400">{customer.payment_terms}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <CustomerModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={loadCustomers}
      />
    </div>
  );
}
