"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';

// Icons
function UsersIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
}

// Badge status pesanan dengan nuansa biru/korporat
function OrderStatusBadge({ status }) {
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
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats');
        const data = await res.json();
        setStats({
          totalProducts: data.totalProducts || 0,
          totalOrders: data.totalOrders || 0,
          totalUsers: data.totalUsers || 0,
          recentOrders: data.recentOrders || []
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-blue-100 to-white p-4">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-blue-100 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-blue-100 rounded"></div>
              <div className="h-4 bg-blue-100 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-blue-100 to-white">
      {/* Header */}
      <div className="bg-white/90 shadow rounded-b-2xl">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-extrabold text-blue-800 tracking-tight">PT Kwalram Admin Dashboard</h1>
          <p className="text-blue-500 mt-2">Your company statistics overview</p>
        </div>
      </div>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* Total Products */}
          <div className="bg-white/90 overflow-hidden shadow rounded-lg border border-blue-100">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-blue-500 truncate">Total Products</dt>
                    <dd className="text-lg font-bold text-blue-800">{stats.totalProducts}</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 px-5 py-3">
              <div className="text-sm">
                <a href="/admin/products" className="font-medium text-blue-700 hover:text-blue-900">
                  View all products
                </a>
              </div>
            </div>
          </div>
          {/* Total Orders */}
          <div className="bg-white/90 overflow-hidden shadow rounded-lg border border-blue-100">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-blue-500 truncate">Total Orders</dt>
                    <dd className="text-lg font-bold text-blue-800">{stats.totalOrders}</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 px-5 py-3">
              <div className="text-sm">
                <a href="/admin/orders" className="font-medium text-blue-700 hover:text-blue-900">
                  View all orders
                </a>
              </div>
            </div>
          </div>
          {/* Total Users */}
          <div className="bg-white/90 overflow-hidden shadow rounded-lg border border-blue-100">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UsersIcon className="h-6 w-6 text-blue-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-blue-500 truncate">Total Users</dt>
                    <dd className="text-lg font-bold text-blue-800">{stats.totalUsers}</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 px-5 py-3">
              <div className="text-sm">
                <a href="/admin/users" className="font-medium text-blue-700 hover:text-blue-900">
                  Manage users
                </a>
              </div>
            </div>
          </div>
        </div>
        {/* Recent Orders */}
        <div className="mt-8">
          <div className="bg-white/90 shadow rounded-lg border border-blue-100">
            <div className="px-4 py-5 border-b border-blue-100 sm:px-6">
              <h3 className="text-lg leading-6 font-bold text-blue-800">
                Recent Orders
              </h3>
            </div>
            <div className="divide-y divide-blue-50">
              {stats.recentOrders.length === 0 ? (
                <div className="px-4 py-8 text-center text-blue-400">No orders yet</div>
              ) : stats.recentOrders.map((order) => (
                <div key={order.id} className="px-4 py-4 sm:px-6 hover:bg-blue-50 flex items-center justify-between">
                  <div className="text-sm font-bold text-blue-800 truncate">
                    Order #{order.id.slice(-6)}
                  </div>
                  <OrderStatusBadge status={order.status} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </main>
  );
}