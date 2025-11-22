import { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  order?: any;
}

interface Customer {
  id: string;
  company_name: string;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  selling_price: number;
}

interface OrderItem {
  product_id: string;
  quantity: number;
  unit_price: number;
}

export function OrderModal({ isOpen, onClose, onSuccess, order }: OrderModalProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    customer_id: '',
    order_date: new Date().toISOString().split('T')[0],
    delivery_date: '',
    status: 'draft',
    payment_status: 'pending',
    notes: '',
  });

  const [orderItems, setOrderItems] = useState<OrderItem[]>([
    { product_id: '', quantity: 1, unit_price: 0 },
  ]);

  useEffect(() => {
    if (isOpen) {
      loadCustomers();
      loadProducts();
      if (order) {
        loadOrderData();
      } else {
        resetForm();
      }
    }
  }, [isOpen, order]);

  const loadCustomers = async () => {
    const { data } = await supabase
      .from('customers')
      .select('id, company_name')
      .eq('active', true)
      .order('company_name');
    if (data) setCustomers(data);
  };

  const loadProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('id, name, sku, selling_price')
      .eq('active', true)
      .order('name');
    if (data) setProducts(data);
  };

  const loadOrderData = async () => {
    if (!order) return;

    setFormData({
      customer_id: order.customer_id,
      order_date: order.order_date,
      delivery_date: order.delivery_date || '',
      status: order.status,
      payment_status: order.payment_status,
      notes: order.notes || '',
    });

    const { data: items } = await supabase
      .from('order_items')
      .select('product_id, quantity, unit_price')
      .eq('order_id', order.id);

    if (items && items.length > 0) {
      setOrderItems(items);
    }
  };

  const handleProductChange = (index: number, productId: string) => {
    const product = products.find((p) => p.id === productId);
    const newItems = [...orderItems];
    newItems[index] = {
      ...newItems[index],
      product_id: productId,
      unit_price: product?.selling_price || 0,
    };
    setOrderItems(newItems);
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    const newItems = [...orderItems];
    newItems[index].quantity = quantity;
    setOrderItems(newItems);
  };

  const handlePriceChange = (index: number, price: number) => {
    const newItems = [...orderItems];
    newItems[index].unit_price = price;
    setOrderItems(newItems);
  };

  const addOrderItem = () => {
    setOrderItems([...orderItems, { product_id: '', quantity: 1, unit_price: 0 }]);
  };

  const removeOrderItem = (index: number) => {
    if (orderItems.length > 1) {
      setOrderItems(orderItems.filter((_, i) => i !== index));
    }
  };

  const calculateTotal = () => {
    return orderItems.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.customer_id) {
        throw new Error('Veuillez sélectionner un client');
      }

      const validItems = orderItems.filter((item) => item.product_id && item.quantity > 0);
      if (validItems.length === 0) {
        throw new Error('Veuillez ajouter au moins un produit');
      }

      const totalAmount = calculateTotal();

      if (order) {
        const { error: orderError } = await supabase
          .from('orders')
          .update({
            customer_id: formData.customer_id,
            order_date: formData.order_date,
            delivery_date: formData.delivery_date || null,
            status: formData.status,
            payment_status: formData.payment_status,
            total_amount: totalAmount,
            notes: formData.notes || null,
          })
          .eq('id', order.id);

        if (orderError) throw orderError;

        await supabase.from('order_items').delete().eq('order_id', order.id);

        const orderItemsData = validItems.map((item) => ({
          order_id: order.id,
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          subtotal: item.quantity * item.unit_price,
        }));

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItemsData);

        if (itemsError) throw itemsError;
      } else {
        const orderNumber = `CMD-${Date.now()}`;

        const { data: newOrder, error: orderError } = await supabase
          .from('orders')
          .insert({
            order_number: orderNumber,
            customer_id: formData.customer_id,
            order_date: formData.order_date,
            delivery_date: formData.delivery_date || null,
            status: formData.status,
            payment_status: formData.payment_status,
            total_amount: totalAmount,
            notes: formData.notes || null,
          })
          .select()
          .single();

        if (orderError) throw orderError;

        const orderItemsData = validItems.map((item) => ({
          order_id: newOrder.id,
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          subtotal: item.quantity * item.unit_price,
        }));

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItemsData);

        if (itemsError) throw itemsError;
      }

      onSuccess();
      onClose();
      resetForm();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création de la commande');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      customer_id: '',
      order_date: new Date().toISOString().split('T')[0],
      delivery_date: '',
      status: 'draft',
      payment_status: 'pending',
      notes: '',
    });
    setOrderItems([{ product_id: '', quantity: 1, unit_price: 0 }]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-2xl font-bold text-white">
            {order ? 'Modifier la commande' : 'Nouvelle commande'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Client *</label>
              <select
                required
                value={formData.customer_id}
                onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
                className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-500"
              >
                <option value="">Sélectionner un client...</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.company_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Statut</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-500"
              >
                <option value="draft">Brouillon</option>
                <option value="confirmed">Confirmé</option>
                <option value="processing">En traitement</option>
                <option value="shipped">Expédié</option>
                <option value="delivered">Livré</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Date de commande *</label>
              <input
                type="date"
                required
                value={formData.order_date}
                onChange={(e) => setFormData({ ...formData, order_date: e.target.value })}
                className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Date de livraison</label>
              <input
                type="date"
                value={formData.delivery_date}
                onChange={(e) => setFormData({ ...formData, delivery_date: e.target.value })}
                className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Statut paiement</label>
              <select
                value={formData.payment_status}
                onChange={(e) => setFormData({ ...formData, payment_status: e.target.value })}
                className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-500"
              >
                <option value="pending">En attente</option>
                <option value="partial">Partiel</option>
                <option value="paid">Payé</option>
              </select>
            </div>
          </div>

          <div className="border-t border-slate-700 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Articles</h3>
              <button
                type="button"
                onClick={addOrderItem}
                className="flex items-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter un article</span>
              </button>
            </div>

            <div className="space-y-3">
              {orderItems.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <select
                    value={item.product_id}
                    onChange={(e) => handleProductChange(index, e.target.value)}
                    className="flex-1 px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="">Produit...</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} ({product.sku})
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(index, parseInt(e.target.value) || 1)}
                    placeholder="Qté"
                    className="w-24 px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-500"
                  />

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.unit_price}
                    onChange={(e) => handlePriceChange(index, parseFloat(e.target.value) || 0)}
                    placeholder="Prix"
                    className="w-32 px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-500"
                  />

                  <div className="w-32 text-right text-white font-medium">
                    {(item.quantity * item.unit_price).toFixed(2)} €
                  </div>

                  <button
                    type="button"
                    onClick={() => removeOrderItem(index)}
                    disabled={orderItems.length === 1}
                    className="p-2 hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-700 flex items-center justify-between">
              <span className="text-lg font-semibold text-white">Total</span>
              <span className="text-2xl font-bold text-cyan-400">{calculateTotal().toFixed(2)} €</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-lg transition-all disabled:opacity-50"
            >
              {loading ? (order ? 'Mise à jour...' : 'Création...') : (order ? 'Mettre à jour' : 'Créer la commande')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
