import clientPromise from '@/app/lib/mongodb';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

// GET: Fetch all products
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const products = await db.collection('products').find({}).toArray();
    return NextResponse.json(products.map(p => ({ ...p, id: p._id })));
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST: Add new product
export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.nama || !body.harga) {
      return NextResponse.json(
        { error: 'Nama dan harga wajib diisi' },
        { status: 400 }
      );
    }
    const client = await clientPromise;
    const db = client.db();
    // Check if product name already exists
    const exists = await db.collection('products').findOne({ nama: body.nama });
    if (exists) {
      return NextResponse.json(
        { error: 'Menu dengan nama tersebut sudah ada' },
        { status: 400 }
      );
    }
    const productData = {
      nama: body.nama,
      harga: Number(body.harga),
      gambar: body.gambar || '',
      kategori: body.kategori || '',
      deskripsi: body.deskripsi || '',
      createdAt: new Date().toISOString()
    };
    const result = await db.collection('products').insertOne(productData);
    return NextResponse.json({ ...productData, id: result.insertedId });
  } catch (error) {
    console.error('Error adding product:', error);
    return NextResponse.json(
      { error: 'Failed to add product' },
      { status: 500 }
    );
  }
}

// PUT: Update product
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Convert price to number if present
    if (updateData.harga) {
      updateData.harga = Number(updateData.harga);
    }

    const client = await clientPromise;
    const db = client.db();
    const result = await db.collection('products').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...updateData,
          updatedAt: new Date().toISOString()
        }
      }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: 'Failed to update product' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      message: 'Menu updated successfully',
      id,
      ...updateData
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE: Remove product
export async function DELETE(request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();
    const result = await db.collection('products').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Failed to delete product' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      message: 'Menu deleted successfully',
      id 
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}