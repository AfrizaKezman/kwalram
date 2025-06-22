'use client';
import { useState, useEffect } from 'react';

const OrderStatusBadge = ({ status }) => {
  const statusStyles = {
    pending: 'bg-blue-100 text-blue-700',
    processing: 'bg-sky-100 text-sky-700',
    shipped: 'bg-indigo-100 text-indigo-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700'
  };
  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const res = await fetch('/api/transactions');
      const data = await res.json();
      setOrders(data.transactions || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateOrderStatus(orderId, newStatus) {
    try {
      const res = await fetch('/api/transactions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, orderStatus: newStatus })
      });
      if (!res.ok) throw new Error('Failed to update status');
      fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update order status');
    }
  }

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.orderStatus === filter);

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-blue-100 to-white py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
          <h1 className="text-2xl font-bold text-blue-800">PT Kwalram Order Management</h1>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-full border-blue-200 shadow-sm focus:border-blue-400 focus:ring-blue-400 text-blue-700 px-4 py-2 bg-white"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-20 bg-blue-100 rounded"></div>
            <div className="h-20 bg-blue-100 rounded"></div>
            <div className="h-20 bg-blue-100 rounded"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="bg-white/90 rounded-xl shadow p-8 text-center text-blue-400">No orders found</div>
            ) : filteredOrders.map((order) => (
              <div key={order.id} className="bg-white/90 shadow rounded-xl overflow-hidden border border-blue-100">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4 gap-2">
                    <div>
                      <h3 className="text-lg font-bold text-blue-800">
                        Order #{order.orderNumber}
                      </h3>
                      <p className="text-xs text-blue-400">
                        {new Date(order.orderDate).toLocaleString('id-ID')}
                      </p>
                      <p className="text-xs text-blue-500 mt-1">
                        Customer: {order.customerInfo?.name}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <OrderStatusBadge status={order.orderStatus} />
                      <select
                        value={order.orderStatus}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className="rounded-full border-blue-200 shadow-sm text-sm focus:border-blue-400 focus:ring-blue-400 text-blue-700 px-3 py-1"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                  <div className="border-t border-blue-100 mt-4 pt-4">
                    <div className="flow-root">
                      <ul className="-my-4 divide-y divide-blue-50">
                        {order.items.map((item, index) => (
                          <li key={index} className="flex items-center justify-between py-4">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-blue-800 truncate">
                                {item.name}
                              </p>
                              <p className="text-xs text-blue-500">
                                {item.quantity}x @ Rp {item.price.toLocaleString('id-ID')}
                              </p>
                            </div>
                            <div className="ml-4 text-sm font-bold text-blue-700">
                              Rp {item.subtotal.toLocaleString('id-ID')}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="border-t border-blue-100 mt-4 pt-4">
                    <div className="flex justify-between text-sm">
                      <div>
                        <p className="font-bold text-blue-800">Total Payment</p>
                        <p className="text-blue-500">via {order.paymentMethod}</p>
                      </div>
                      <p className="font-bold text-blue-800">
                        Rp {order.totalAmount.toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}