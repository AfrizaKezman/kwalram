"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';

export default function SettingsPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    fullName: '',
    password: '',
    role: 'user',
    isActive: true
  });
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleRoleChange(userId, newRole) {
    try {
      await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, role: newRole })
      });
      fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  }

  async function handleStatusChange(userId, newStatus) {
    try {
      await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, isActive: newStatus })
      });
      fetchUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  }

  async function handleDeleteUser(userId) {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await fetch('/api/users', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: userId })
        });
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  }

  async function handleAddUser(e) {
    e.preventDefault();
    setErrorMsg('');
    if (!newUser.username || !newUser.email || !newUser.password) {
      setErrorMsg('Username, email, and password are required');
      return;
    }
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMsg(data.message || 'Failed to add user');
        return;
      }
      setShowModal(false);
      setNewUser({ username: '', email: '', fullName: '', password: '', role: 'user', isActive: true });
      fetchUsers();
    } catch (error) {
      setErrorMsg('Failed to add user');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-blue-100 rounded w-1/4"></div>
          <div className="h-4 bg-blue-100 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-100 to-white">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="px-4 py-6 sm:px-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-blue-800">User Settings</h1>
            <p className="mt-2 text-blue-500">Manage users and system access rights</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-blue-700 to-blue-500 text-white px-6 py-2 rounded-full hover:from-blue-800 hover:to-blue-600 transition-all duration-200 shadow-md"
          >
            + Add User
          </button>
        </div>
        {/* Modal Add User */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full m-4">
              <h2 className="text-2xl font-bold mb-6 text-blue-800">Add New User</h2>
              <form onSubmit={handleAddUser} className="space-y-4">
                <input
                  type="text"
                  placeholder="Username"
                  className="w-full px-4 py-2 rounded-lg border border-blue-200 focus:ring-blue-400 focus:border-blue-400"
                  value={newUser.username}
                  onChange={e => setNewUser({ ...newUser, username: e.target.value })}
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-2 rounded-lg border border-blue-200 focus:ring-blue-400 focus:border-blue-400"
                  value={newUser.email}
                  onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Full Name (optional)"
                  className="w-full px-4 py-2 rounded-lg border border-blue-200 focus:ring-blue-400 focus:border-blue-400"
                  value={newUser.fullName}
                  onChange={e => setNewUser({ ...newUser, fullName: e.target.value })}
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full px-4 py-2 rounded-lg border border-blue-200 focus:ring-blue-400 focus:border-blue-400"
                  value={newUser.password}
                  onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                  required
                />
                <select
                  value={newUser.role}
                  onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-blue-200 focus:ring-blue-400 focus:border-blue-400"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newUser.isActive}
                    onChange={e => setNewUser({ ...newUser, isActive: e.target.checked })}
                    id="isActive"
                  />
                  <label htmlFor="isActive" className="text-sm">Active</label>
                </div>
                {errorMsg && <div className="text-red-500 text-sm">{errorMsg}</div>}
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => { setShowModal(false); setErrorMsg(''); }}
                    className="px-4 py-2 rounded-full border border-blue-200 hover:bg-blue-50 text-blue-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-700 to-blue-500 text-white hover:from-blue-800 hover:to-blue-600"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Users Table */}
        <div className="mt-8 flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-blue-100 sm:rounded-lg">
                <table className="min-w-full divide-y divide-blue-100">
                  <thead className="bg-blue-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                        User
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-blue-50">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-blue-800">
                                {user.fullName || user.username}
                              </div>
                              <div className="text-sm text-blue-500">
                                {user.email}
                              </div>
                              <div className="text-xs text-blue-300">
                                @{user.username}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            disabled={user.id === currentUser?.id}
                            className="text-sm text-blue-800 border rounded-md px-2 py-1"
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={user.isActive ? 'active' : 'inactive'}
                            onChange={(e) => handleStatusChange(user.id, e.target.value === 'active')}
                            disabled={user.id === currentUser?.id}
                            className="text-sm border rounded-md px-2 py-1 text-blue-800"
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {user.id !== currentUser?.id && (
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}