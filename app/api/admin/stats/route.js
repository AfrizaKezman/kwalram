import clientPromise from '@/app/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const totalProducts = await db.collection('products').countDocuments();
    const totalOrders = await db.collection('transactions').countDocuments();
    const totalUsers = await db.collection('users').countDocuments();
    const recentOrders = await db.collection('transactions')
      .find({})
      .sort({ orderDate: -1 })
      .limit(5)
      .toArray();
    return Response.json({
      totalProducts,
      totalOrders,
      totalUsers,
      recentOrders: recentOrders.map(order => ({
        id: order._id?.toString() || '',
        status: order.orderStatus || 'pending',
      }))
    });
  } catch (error) {
    return Response.json({ error: 'Gagal mengambil statistik admin' }, { status: 500 });
  }
}
