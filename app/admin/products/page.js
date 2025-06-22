'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import Image from 'next/image';
import { BuildingOffice2Icon, CubeIcon, ScissorsIcon, WrenchIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import Swal from 'sweetalert2';

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    nama: '',
    harga: '',
    gambar: '',
    kategori: '',
    deskripsi: ''
  });
  const [imagePreview, setImagePreview] = useState(null);
  const { user } = useAuth();

  // Textile categories
  const categories = [
    { id: 'yarn', name: 'Yarn', icon: <ScissorsIcon className="w-5 h-5 inline" /> },
    { id: 'fabric', name: 'Fabric', icon: <BuildingOffice2Icon className="w-5 h-5 inline" /> },
    { id: 'garment', name: 'Garment', icon: <ShoppingBagIcon className="w-5 h-5 inline" /> },
    { id: 'accessories', name: 'Accessories', icon: <WrenchIcon className="w-5 h-5 inline" /> },
    { id: 'tools', name: 'Tools', icon: <CubeIcon className="w-5 h-5 inline" /> },
  ];

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  // Handle search
  useEffect(() => {
    const filtered = products.filter(product =>
      product.nama.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  // Reset form
  const resetForm = () => {
    setNewProduct({
      nama: '',
      harga: '',
      gambar: '',
      kategori: '',
      deskripsi: ''
    });
    setImagePreview(null);
    setIsEditMode(false);
    setEditingProduct(null);
  };

  // Handle Edit - Open modal with product data
  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsEditMode(true);
    setNewProduct({
      nama: product.nama,
      harga: product.harga.toString(),
      gambar: product.gambar,
      kategori: product.kategori,
      deskripsi: product.deskripsi
    });
    setImagePreview(product.gambar);
    setIsModalOpen(true);
  };

  // Handle Delete
  const handleDelete = async (productId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This product will be deleted permanently!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });
    if (result.isConfirmed) {
      try {
        const response = await fetch('/api/products', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: productId }),
        });
        if (response.ok) {
          setProducts(products.filter(product => product.id !== productId));
          await Swal.fire({ icon: 'success', title: 'Deleted!', text: 'Product deleted successfully!', confirmButtonColor: '#2563eb' });
        } else {
          const error = await response.json();
          await Swal.fire({ icon: 'error', title: 'Error', text: error.error || 'Failed to delete product', confirmButtonColor: '#2563eb' });
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        await Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to delete product', confirmButtonColor: '#2563eb' });
      }
    }
  };

  // Handle form submit (Add or Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (isEditMode) {
        response = await fetch('/api/products', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: editingProduct.id,
            ...newProduct
          }),
        });
      } else {
        response = await fetch('/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newProduct),
        });
      }
      if (response.ok) {
        const data = await response.json();
        if (isEditMode) {
          setProducts(products.map(product =>
            product.id === editingProduct.id ? { ...product, ...newProduct, id: editingProduct.id } : product
          ));
          await Swal.fire({ icon: 'success', title: 'Updated!', text: 'Product updated successfully!', confirmButtonColor: '#2563eb' });
        } else {
          setProducts([...products, data]);
          await Swal.fire({ icon: 'success', title: 'Added!', text: 'Product added successfully!', confirmButtonColor: '#2563eb' });
        }
        resetForm();
        setIsModalOpen(false);
      } else {
        const error = await response.json();
        await Swal.fire({ icon: 'error', title: 'Error', text: error.error || 'Failed to save product', confirmButtonColor: '#2563eb' });
      }
    } catch (error) {
      console.error('Error saving product:', error);
      await Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to save product', confirmButtonColor: '#2563eb' });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setNewProduct({ ...newProduct, gambar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    resetForm();
  };

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-blue-100 to-white">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-blue-800">PT Kwalram Products</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-blue-700 to-blue-500 text-white px-6 py-2 rounded-full hover:from-blue-800 hover:to-blue-600 transition-all duration-200 shadow-md"
          >
            + Add Product
          </button>
        </div>
        {/* Search Bar */}
        <div className="relative mb-8">
          <input
            type="text"
            placeholder="Search textile products..."
            className="w-full px-4 py-3 pl-12 rounded-lg border border-blue-100 bg-white shadow-md focus:ring-2 focus:ring-blue-400 transition-all duration-200 text-blue-700 placeholder-blue-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <CubeIcon className="w-6 h-6 text-blue-300 absolute left-4 top-3" />
        </div>
        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white/90 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 border border-blue-100">
              <div className="relative h-48 w-full bg-blue-50 flex items-center justify-center">
                <Image
                  src={product.gambar || '/placeholder-fabric.png'}
                  alt={product.nama}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg text-blue-800 mb-2">{product.nama}</h3>
                <p className="text-blue-600 font-bold mb-2">
                  Rp {parseInt(product.harga).toLocaleString('id-ID')}
                </p>
                <p className="text-sm text-blue-500 mb-4 flex items-center gap-1">
                  {categories.find(c => c.id === product.kategori)?.icon}
                  {categories.find(c => c.id === product.kategori)?.name || product.kategori}
                </p>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="text-blue-700 hover:text-blue-900 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Add/Edit Product Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full m-4">
              <h2 className="text-2xl font-bold mb-6 text-blue-800">
                {isEditMode ? 'Edit Product' : 'Add New Product'}
              </h2>
              <form onSubmit={handleSubmit}>
                {/* Image Upload */}
                <div className="mb-6">
                  <div className="relative h-40 bg-blue-50 rounded-lg overflow-hidden">
                    {imagePreview ? (
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <CubeIcon className="w-12 h-12 text-blue-200" />
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
                {/* Form Fields */}
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Product Name"
                    required
                    className="w-full px-4 py-2 rounded-lg border border-blue-200 focus:ring-blue-400 focus:border-blue-400 text-blue-700"
                    value={newProduct.nama}
                    onChange={(e) => setNewProduct({ ...newProduct, nama: e.target.value })}
                  />
                  <div className="relative">
                    <span className="absolute left-4 top-2 text-blue-400">Rp</span>
                    <input
                      type="number"
                      placeholder="Price"
                      required
                      className="w-full px-4 py-2 pl-12 rounded-lg border border-blue-200 focus:ring-blue-400 focus:border-blue-400 text-blue-700"
                      value={newProduct.harga}
                      onChange={(e) => setNewProduct({ ...newProduct, harga: e.target.value })}
                    />
                  </div>
                  <select
                    value={newProduct.kategori}
                    onChange={(e) => setNewProduct({ ...newProduct, kategori: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-blue-200 focus:ring-blue-400 focus:border-blue-400 text-blue-700"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <textarea
                    placeholder="Product description (optional)"
                    className="w-full px-4 py-2 rounded-lg border border-blue-200 focus:ring-blue-400 focus:border-blue-400 text-blue-700"
                    rows="3"
                    value={newProduct.deskripsi}
                    onChange={(e) => setNewProduct({ ...newProduct, deskripsi: e.target.value })}
                  />
                </div>
                {/* Modal Actions */}
                <div className="mt-8 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleModalClose}
                    className="px-6 py-2 rounded-full border border-blue-200 hover:bg-blue-50 transition-colors text-blue-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-700 to-blue-500 text-white hover:from-blue-800 hover:to-blue-600 transition-all duration-200"
                  >
                    {isEditMode ? 'Update' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}