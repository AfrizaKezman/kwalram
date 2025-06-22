// app/api/transactions/stats/route.js
import clientPromise from '@/app/lib/mongodb';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const client = await clientPromise;
    const db = client.db();
    let filter = {};
    if (userId) {
      filter = { 'customerInfo.userId': userId };
    }
    const transactions = await db.collection('transactions')
      .find(filter)
      .sort({ orderDate: -1 })
      .toArray();
    return NextResponse.json({
      success: true,
      transactions: transactions.map(t => ({ ...t, id: t._id }))
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db();
    const result = await db.collection('transactions').insertOne({
      ...body,
      createdAt: new Date().toISOString(),
    });
    return NextResponse.json({
      success: true,
      orderNumber: body.orderNumber || `ORD-${result.insertedId}`,
      id: result.insertedId
    });
  } catch (error) {
    console.error('Error saving transaction:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to save transaction' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const { id, orderStatus } = await request.json();
    if (!id || !orderStatus) {
      return NextResponse.json({ success: false, message: 'ID dan status wajib diisi' }, { status: 400 });
    }
    const client = await clientPromise;
    const db = client.db();
    await db.collection('transactions').updateOne(
      { _id: new ObjectId(id) },
      { $set: { orderStatus, updatedAt: new Date().toISOString() } }
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal update status pesanan' }, { status: 500 });
  }
}

// ...existing code for DELETE if any...