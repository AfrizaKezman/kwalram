'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { ShoppingBagIcon, TrashIcon, PlusIcon, MinusIcon, ShoppingCartIcon, CurrencyDollarIcon, CreditCardIcon, XMarkIcon, MagnifyingGlassIcon, BuildingOffice2Icon, CubeIcon, ScissorsIcon, WrenchIcon } from '@heroicons/react/24/outline';

export default function ProductsPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    // Payment states
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [cashAmount, setCashAmount] = useState('');
    const [change, setChange] = useState(0);
    const [qrisImage, setQrisImage] = useState('');
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);

    // Textile categories
    const categories = [
        { id: 'all', name: 'All', icon: <CubeIcon className="w-5 h-5" /> },
        { id: 'yarn', name: 'Yarn', icon: <ScissorsIcon className="w-5 h-5" /> },
        { id: 'fabric', name: 'Fabric', icon: <BuildingOffice2Icon className="w-5 h-5" /> },
        { id: 'garment', name: 'Garment', icon: <ShoppingBagIcon className="w-5 h-5" /> },
        { id: 'accessories', name: 'Accessories', icon: <WrenchIcon className="w-5 h-5" /> },
    ];

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

    useEffect(() => {
        let filtered = products;
        if (searchTerm) {
            filtered = filtered.filter(product =>
                product.nama.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(product => {
                const productCategory = product.kategori ? product.kategori.toLowerCase() : '';
                return productCategory.includes(selectedCategory);
            });
        }
        setFilteredProducts(filtered);
    }, [searchTerm, products, selectedCategory]);

    const showSuccess = (msg) => {
        Swal.fire({ icon: 'success', title: 'Success', text: msg, confirmButtonColor: '#2563eb' });
    };
    const showError = (msg) => {
        Swal.fire({ icon: 'error', title: 'Error', text: msg, confirmButtonColor: '#2563eb' });
    };

    const addToCart = (product) => {
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            setCart(cart.map(item =>
                item.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
            showSuccess('Product quantity increased!');
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
            showSuccess('Product added to cart!');
        }
    };
    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity === 0) {
            removeFromCart(productId);
            return;
        }
        setCart(cart.map(item =>
            item.id === productId
                ? { ...item, quantity: newQuantity }
                : item
        ));
    };
    useEffect(() => {
        const sum = cart.reduce((acc, item) => acc + (item.harga * item.quantity), 0);
        setTotal(sum);
    }, [cart]);
    const removeFromCart = (productId) => {
        setCart(cart.filter(item => item.id !== productId));
        showSuccess('Product removed from cart!');
    };
    const clearCart = () => {
        setCart([]);
        showSuccess('Cart cleared!');
    };
    const getProductCountByCategory = (categoryId) => {
        if (categoryId === 'all') return products.length;
        return products.filter(product => {
            const productCategory = product.kategori ? product.kategori.toLowerCase() : '';
            return productCategory.includes(categoryId);
        }).length;
    };
    const generateQRIS = async (amount) => {
        const qrisData = `KWALRAM-QRIS-${amount}`;
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrisData)}`);
            }, 1000);
        });
    };
    const saveTransactionToReport = async (orderData) => {
        try {
            const response = await fetch('/api/transactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...orderData,
                    status: 'pending',
                    orderDate: new Date().toISOString(),
                    orderNumber: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    customerInfo: {
                        userId: user?.id,
                        name: user?.fullName || user?.username,
                        email: user?.email,
                        address: user?.address
                    }
                }),
            });
            if (!response.ok) throw new Error('Failed to create order');
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error saving order:', error);
            throw error;
        }
    };
    // Example: Fetch transactions for reports
    const fetchTransactions = async (filters = {}) => {
        try {
            const queryParams = new URLSearchParams();

            // Add filters
            if (filters.kasir) queryParams.append('kasir', filters.kasir);
            if (filters.paymentMethod) queryParams.append('paymentMethod', filters.paymentMethod);
            if (filters.startDate) queryParams.append('startDate', filters.startDate);
            if (filters.endDate) queryParams.append('endDate', filters.endDate);
            if (filters.page) queryParams.append('page', filters.page);
            if (filters.pageSize) queryParams.append('pageSize', filters.pageSize);

            const response = await fetch(`/api/transactions?${queryParams}`);

            if (!response.ok) {
                throw new Error('Failed to fetch transactions');
            }

            const data = await response.json();
            return data;

        } catch (error) {
            console.error('Error fetching transactions:', error);

            // Fallback: get from localStorage
            try {
                const localTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
                return {
                    success: true,
                    transactions: localTransactions,
                    pagination: {
                        currentPage: 1,
                        pageSize: localTransactions.length,
                        totalCount: localTransactions.length,
                        totalPages: 1,
                        hasNext: false,
                        hasPrev: false
                    }
                };
            } catch (localError) {
                console.error('Error fetching from localStorage:', localError);
                throw error;
            }
        }
    };

    // Example: Fetch statistics
    const fetchTransactionStats = async (filters = {}) => {
        try {
            const queryParams = new URLSearchParams();

            if (filters.startDate) queryParams.append('startDate', filters.startDate);
            if (filters.endDate) queryParams.append('endDate', filters.endDate);
            if (filters.kasir) queryParams.append('kasir', filters.kasir);
            if (filters.period) queryParams.append('period', filters.period);

            const response = await fetch(`/api/transactions/stats?${queryParams}`);

            if (!response.ok) {
                throw new Error('Failed to fetch statistics');
            }

            const data = await response.json();
            return data;

        } catch (error) {
            console.error('Error fetching statistics:', error);
            throw error;
        }
    };

    // Handle payment method selection
    const handlePayment = async (method) => {
        setPaymentMethod(method);
        setIsProcessingPayment(true);

        if (method === 'qris') {
            try {
                // Generate QRIS image
                const qrisImageUrl = await generateQRIS(total);
                setQrisImage(qrisImageUrl);
            } catch (error) {
                console.error('Error generating QRIS:', error);
                alert('Gagal membuat QRIS. Silakan coba lagi.');
                setPaymentMethod('');
            }
        } else {
            // For cash, we need to input amount
            setCashAmount('');
            setChange(0);
        }

        setIsProcessingPayment(false);
    };

    // Calculate change when cash amount changes
    useEffect(() => {
        if (paymentMethod === 'cash' && cashAmount) {
            const cash = parseInt(cashAmount) || 0;
            const changeAmount = cash - total;
            setChange(changeAmount);
        }
    }, [cashAmount, total, paymentMethod]);

    // Process payment
    const processPayment = async () => {
        try {
            const orderData = {
                items: cart.map(item => ({
                    id: item.id,
                    name: item.nama,
                    price: item.harga,
                    quantity: item.quantity,
                    subtotal: item.harga * item.quantity
                })),
                totalAmount: total,
                paymentMethod: paymentMethod,
                paymentStatus: 'pending',
                orderStatus: 'pending',
                paymentDetails: paymentMethod === 'tunai' ? {
                    cashAmount: parseInt(cashAmount),
                    changeAmount: change
                } : {
                    qrisReference: Date.now().toString()
                }
            };

            const result = await saveTransactionToReport(orderData);
            if (!result || !result.success) {
                throw new Error(result?.message || 'Gagal membuat pesanan');
            }
            Swal.fire({
                icon: 'success',
                title: 'Pesanan berhasil dibuat!',
                html: `Nomor Order: <b>${result.orderNumber}</b><br/>Total: <b>Rp ${total.toLocaleString('id-ID')}</b><br/>Status: <b>Menunggu konfirmasi admin</b><br/><br/>Silakan pantau status pesanan Anda di halaman Pesanan Saya.`,
                confirmButtonColor: '#d946ef',
                confirmButtonText: 'OK',
            });
            resetPaymentState();
            router.push('/orders');
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Gagal',
                text: error?.message || 'Terjadi kesalahan saat memproses pesanan. Silakan coba lagi.',
                confirmButtonColor: '#d946ef',
            });
        }
    };

    // Reset payment state
    const resetPaymentState = () => {
        setCart([]);
        setShowPaymentModal(false);
        setPaymentMethod('');
        setCashAmount('');
        setChange(0);
        setQrisImage('');
        setIsProcessingPayment(false);
    };

    // Handle cash payment submit
    const handleCashPayment = () => {
        const cash = parseInt(cashAmount) || 0;
        if (cash < total) {
            Swal.fire({
                icon: 'warning',
                title: 'Jumlah uang tidak mencukupi!',
                confirmButtonColor: '#d946ef',
            });
            return;
        }
        processPayment();
    };

    // Handle cancel payment
    const handleCancelPayment = () => {
        setPaymentMethod('');
        setCashAmount('');
        setChange(0);
        setQrisImage('');
    };

    return (
        <main className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-blue-100 to-white">
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-blue-800 tracking-tight mb-2">PT Kwalram Products</h1>
                    <p className="text-lg text-blue-500 font-medium">Discover our range of textile solutions for global industries</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Products Section */}
                    <div className="md:col-span-8">
                        {/* Search Bar */}
                        <div className="mb-6">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search textile products..."
                                    className="w-full px-4 py-3 pl-12 rounded-lg border border-blue-100 bg-white shadow-md focus:ring-2 focus:ring-blue-400 transition-all duration-200 text-blue-700 placeholder-blue-300"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <MagnifyingGlassIcon className="w-6 h-6 text-blue-300 absolute left-4 top-3" />
                            </div>
                        </div>
                        {/* Category Filter */}
                        <div className="mb-6">
                            <div className="flex flex-wrap gap-3">
                                {categories.map(category => (
                                    <button
                                        key={category.id}
                                        onClick={() => setSelectedCategory(category.id)}
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all duration-200 ${selectedCategory === category.id
                                                ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                                                : 'bg-white text-blue-700 border-blue-100 hover:border-blue-300 hover:bg-blue-50'
                                            }`}
                                    >
                                        <span>{category.icon}</span>
                                        <span className="font-medium">{category.name}</span>
                                        <span className={`text-xs px-2 py-1 rounded-full ${selectedCategory === category.id
                                                ? 'bg-blue-700 text-white'
                                                : 'bg-blue-100 text-blue-700'
                                            }`}>
                                            {getProductCountByCategory(category.id)}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                        {/* Products Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map(product => (
                                    <div
                                        key={product.id}
                                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:scale-105 border border-blue-100"
                                        onClick={() => addToCart(product)}
                                    >
                                        <div className="relative h-32 w-full bg-blue-50 flex items-center justify-center">
                                            <img
                                                src={product.gambar || '/placeholder-fabric.png'}
                                                alt={product.nama}
                                                className="w-full h-full object-cover bg-blue-100"
                                            />
                                            <div className="absolute top-2 right-2 bg-blue-600 bg-opacity-80 text-white text-xs px-2 py-1 rounded-full">
                                                {product.kategori || 'Other'}
                                            </div>
                                        </div>
                                        <div className="p-3">
                                            <h3 className="font-semibold text-blue-800 text-sm mb-1 truncate">{product.nama}</h3>
                                            <p className="text-blue-600 font-bold text-sm">
                                                Rp {parseInt(product.harga).toLocaleString('id-ID')}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-12">
                                    <CubeIcon className="w-16 h-16 text-blue-200 mx-auto mb-4" />
                                    <p className="text-blue-400 text-lg">No products found</p>
                                    <p className="text-blue-300 text-sm">Try changing your search or category</p>
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Cart Section */}
                    <div className="md:col-span-4">
                        <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4 border border-blue-100">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-blue-800">Cart</h2>
                                {cart.length > 0 && (
                                    <button
                                        onClick={clearCart}
                                        className="text-blue-400 hover:text-blue-600 text-sm font-medium flex items-center gap-1"
                                    >
                                        <TrashIcon className="w-4 h-4" /> Clear All
                                    </button>
                                )}
                            </div>
                            {cart.length === 0 ? (
                                <div className="text-center py-8">
                                    <ShoppingBagIcon className="w-10 h-10 text-blue-100 mx-auto mb-2" />
                                    <p className="text-blue-400">Cart is empty</p>
                                    <p className="text-blue-200 text-sm">Select products to start shopping</p>
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                                        {cart.map(item => (
                                            <div key={item.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                                <div className="flex-1">
                                                    <h3 className="font-medium text-sm text-blue-800">{item.nama}</h3>
                                                    <p className="text-xs text-blue-500">
                                                        Rp {parseInt(item.harga).toLocaleString('id-ID')} / item
                                                    </p>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="w-6 h-6 rounded-full bg-blue-200 text-blue-700 hover:bg-blue-300 flex items-center justify-center"
                                                    >
                                                        <MinusIcon className="w-4 h-4" />
                                                    </button>
                                                    <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="w-6 h-6 rounded-full bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center"
                                                    >
                                                        <PlusIcon className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="text-blue-400 hover:text-blue-600 ml-2"
                                                    >
                                                        <XMarkIcon className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="border-t pt-4">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-lg font-bold text-blue-700">Total:</span>
                                            <span className="text-xl font-bold text-blue-600">
                                                Rp {total.toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                        <button
                                            className="w-full bg-gradient-to-r from-blue-700 to-blue-500 text-white py-3 px-4 rounded-lg hover:from-blue-800 hover:to-blue-600 transition-all duration-200 font-medium shadow-md"
                                            onClick={() => setShowPaymentModal(true)}
                                        >
                                            Checkout ({cart.length} item)
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                {/* Payment Modal */}
                {showPaymentModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl p-8 max-w-md w-full m-4 max-h-[90vh] overflow-y-auto border border-blue-200">
                            <h2 className="text-2xl font-bold mb-6 text-blue-800 text-center">Select Payment Method</h2>
                            {/* Order Summary */}
                            <div className="bg-blue-50 rounded-lg p-4 mb-6">
                                <h3 className="font-semibold mb-2 text-blue-700">Order Summary:</h3>
                                <div className="space-y-2">
                                    {cart.map(item => (
                                        <div key={item.id} className="flex justify-between text-sm">
                                            <span>{item.nama} x{item.quantity}</span>
                                            <span>Rp {(item.harga * item.quantity).toLocaleString('id-ID')}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="border-t mt-2 pt-2 flex justify-between font-bold">
                                    <span>Total:</span>
                                    <span className="text-blue-600">Rp {total.toLocaleString('id-ID')}</span>
                                </div>
                            </div>
                            {!paymentMethod ? (
                                <div className="space-y-4">
                                    <button
                                        onClick={() => handlePayment('qris')}
                                        disabled={isProcessingPayment}
                                        className="w-full p-4 border-2 border-blue-100 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 flex items-center justify-center space-x-3 disabled:opacity-50"
                                    >
                                        <CreditCardIcon className="w-6 h-6 text-blue-400" />
                                        <div className="text-left">
                                            <div className="font-semibold text-blue-700">QRIS</div>
                                            <div className="text-sm text-blue-400">Pay with QR Code</div>
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => handlePayment('cash')}
                                        disabled={isProcessingPayment}
                                        className="w-full p-4 border-2 border-blue-100 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 flex items-center justify-center space-x-3 disabled:opacity-50"
                                    >
                                        <CurrencyDollarIcon className="w-6 h-6 text-blue-400" />
                                        <div className="text-left">
                                            <div className="font-semibold text-blue-700">Cash</div>
                                            <div className="text-sm text-blue-400">Pay with cash</div>
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => setShowPaymentModal(false)}
                                        className="w-full mt-4 px-6 py-2 rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <XMarkIcon className="w-5 h-5 text-blue-400" /> Cancel
                                    </button>
                                </div>
                            ) : paymentMethod === 'qris' ? (
                                <div className="text-center">
                                    <div className="bg-blue-50 rounded-lg p-8 mb-4">
                                        <div className="text-lg font-semibold mb-4 text-blue-700">Scan QR Code to Pay</div>
                                        {isProcessingPayment ? (
                                            <div className="flex flex-col items-center justify-center py-8">
                                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mb-4"></div>
                                                <div className="text-sm text-blue-400">Generating QR Code...</div>
                                            </div>
                                        ) : qrisImage ? (
                                            <div className="flex flex-col items-center">
                                                <img
                                                    src={qrisImage}
                                                    alt="QRIS Payment Code"
                                                    className="w-48 h-48 border-2 border-blue-200 rounded-lg mb-4"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                        e.target.nextSibling.style.display = 'block';
                                                    }}
                                                />
                                                <div className="hidden text-4xl mb-2">⬜</div>
                                                <div className="text-sm text-blue-400 mb-4">
                                                    Use your mobile banking or e-wallet app to scan
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="bg-white border-2 border-dashed border-blue-200 rounded-lg p-8 mb-4">
                                                <div className="text-4xl mb-2">⬜</div>
                                                <div className="text-xs text-blue-300">Failed to load QR Code</div>
                                            </div>
                                        )}
                                        <div className="text-lg font-bold text-blue-600">
                                            Rp {total.toLocaleString('id-ID')}
                                        </div>
                                    </div>
                                    <div className="flex space-x-3">
                                        <button
                                            onClick={handleCancelPayment}
                                            className="flex-1 px-4 py-2 rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <XMarkIcon className="w-5 h-5 text-blue-400" /> Back
                                        </button>
                                        <button
                                            onClick={processPayment}
                                            disabled={!qrisImage}
                                            className={`flex-1 px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${qrisImage
                                                    ? 'bg-blue-700 text-white hover:bg-blue-800'
                                                    : 'bg-blue-100 text-blue-400 cursor-not-allowed'
                                                }`}
                                        >
                                            <CreditCardIcon className="w-5 h-5" /> Confirm Payment
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-blue-700 mb-2">
                                            Cash Received
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-3 text-blue-400">Rp</span>
                                            <input
                                                type="number"
                                                value={cashAmount}
                                                onChange={(e) => setCashAmount(e.target.value)}
                                                placeholder="0"
                                                className="w-full px-4 py-3 pl-12 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-lg text-blue-700"
                                                autoFocus
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 mb-4">
                                        {[total, 50000, 100000, 150000, 200000, 500000].map((amount) => (
                                            <button
                                                key={amount}
                                                onClick={() => setCashAmount(amount.toString())}
                                                className="px-3 py-2 text-sm rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors text-blue-700"
                                            >
                                                {amount.toLocaleString()}
                                            </button>
                                        ))}
                                    </div>
                                    {cashAmount && (
                                        <div className="bg-blue-50 rounded-lg p-4 mb-4">
                                            <div className="flex justify-between text-sm mb-1">
                                                <span>Total:</span>
                                                <span>Rp {total.toLocaleString('id-ID')}</span>
                                            </div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span>Cash Received:</span>
                                                <span>Rp {parseInt(cashAmount || 0).toLocaleString('id-ID')}</span>
                                            </div>
                                            <div className={`flex justify-between font-bold text-lg ${change >= 0 ? 'text-blue-600' : 'text-red-600'}`}> 
                                                <span>Change:</span>
                                                <span>{change >= 0 ? 'Rp ' : '-Rp '}{Math.abs(change).toLocaleString('id-ID')}</span>
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex space-x-3">
                                        <button
                                            onClick={handleCancelPayment}
                                            className="flex-1 px-4 py-2 rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <XMarkIcon className="w-5 h-5 text-blue-400" /> Back
                                        </button>
                                        <button
                                            onClick={handleCashPayment}
                                            disabled={!cashAmount || change < 0}
                                            className={`flex-1 px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${cashAmount && change >= 0
                                                    ? 'bg-blue-700 text-white hover:bg-blue-800'
                                                    : 'bg-blue-100 text-blue-400 cursor-not-allowed'
                                                }`}
                                        >
                                            <CurrencyDollarIcon className="w-5 h-5" /> Process Payment
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}