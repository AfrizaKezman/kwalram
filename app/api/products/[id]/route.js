import { NextResponse } from 'next/server';
import { getProducts, updateProduct, deleteProduct } from '@/app/lib/mongodb';

// GET single product (optional, not used here)
export async function GET(req, { params }) {
  const { id } = params;
  const products = await getProducts();
  const product = products.find((p) => p.id === id);
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(product);
}

// UPDATE product
export async function PUT(req, { params }) {
  const { id } = params;
  const body = await req.json();
  try {
    const updated = await updateProduct(id, body);
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// DELETE product
export async function DELETE(req, { params }) {
  const { id } = params;
  try {
    const deleted = await deleteProduct(id);
    if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
