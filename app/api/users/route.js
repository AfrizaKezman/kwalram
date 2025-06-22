import clientPromise from '@/app/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const users = await db.collection('users').find({}).toArray();
    return Response.json({ users: users.map(u => ({ ...u, id: u._id?.toString() })) });
  } catch (error) {
    return Response.json({ users: [], error: 'Gagal mengambil data user' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const { id, role, isActive } = await req.json();
    if (!id) return Response.json({ error: 'ID user wajib' }, { status: 400 });
    const client = await clientPromise;
    const db = client.db();
    const update = {};
    if (role) update.role = role;
    if (typeof isActive === 'boolean') update.isActive = isActive;
    update.updatedAt = new Date().toISOString();
    await db.collection('users').updateOne({ _id: new ObjectId(id) }, { $set: update });
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: 'Gagal update user' }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { id } = await req.json();
    if (!id) return Response.json({ error: 'ID user wajib' }, { status: 400 });
    const client = await clientPromise;
    const db = client.db();
    await db.collection('users').deleteOne({ _id: new ObjectId(id) });
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: 'Gagal hapus user' }, { status: 500 });
  }
}
