// pages/api/transactions/stats.js
import clientPromise from '@/app/lib/mongodb';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const kasir = searchParams.get('kasir');
  const period = searchParams.get('period') || 'daily';

  try {
    const client = await clientPromise;
    const db = client.db();
    let filter = {};
    if (startDate) {
      filter.orderDate = { $gte: startDate };
    }
    if (endDate) {
      filter.orderDate = filter.orderDate || {};
      filter.orderDate.$lte = endDate;
    }
    if (kasir) {
      filter['customerInfo.name'] = kasir;
    }
    const transactions = await db.collection('transactions')
      .find(filter)
      .toArray();
    // Calculate statistics
    const stats = calculateTransactionStats(transactions, period);
    return new Response(JSON.stringify({
      success: true,
      stats,
      totalTransactions: transactions.length,
    }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      message: error.message || 'Failed to fetch stats',
    }), { status: 500 });
  }
}

function calculateTransactionStats(transactions, period) {
  // Simple daily stats: group by date
  const stats = {};
  transactions.forEach((trx) => {
    let key = 'unknown';
    if (period === 'daily') {
      key = trx.orderDate ? trx.orderDate.slice(0, 10) : 'unknown';
    }
    if (!stats[key]) stats[key] = { total: 0, count: 0 };
    stats[key].total += trx.totalAmount || 0;
    stats[key].count += 1;
  });
  return stats;
}