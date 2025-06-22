import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;

export async function connectToDatabase() {
  const client = await clientPromise;
  const db = client.db();
  return { client, db };
}

export async function updateProduct(id, data) {
  const { db } = await connectToDatabase();
  const result = await db.collection('products').findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: data },
    { returnDocument: 'after' }
  );
  return result.value;
}

export async function deleteProduct(id) {
  const { db } = await connectToDatabase();
  const result = await db.collection('products').deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

export async function getProducts() {
  const { db } = await connectToDatabase();
  const products = await db.collection('products').find({}).toArray();
  // Ubah _id ke id agar konsisten di frontend
  return products.map(p => ({
    ...p,
    id: p._id.toString(),
    _id: undefined
  }));
}
