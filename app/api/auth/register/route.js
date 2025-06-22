import clientPromise from '@/app/lib/mongodb';
import { hash } from 'bcryptjs';

export async function POST(req) {
  try {
    const { username, email, password, fullName, role = 'user' } = await req.json();

    // Validasi input
    if (!username || !email || !password) {
      return new Response(
        JSON.stringify({ 
          success: false,
          message: 'Username, email, dan password wajib diisi' 
        }), 
        { status: 400 }
      );
    }

    // Validasi role
    const allowedRoles = ['admin', 'user'];
    if (!allowedRoles.includes(role.toLowerCase())) {
      return new Response(
        JSON.stringify({ 
          success: false,
          message: 'Role tidak valid' 
        }), 
        { status: 400 }
      );
    }

    // Validasi panjang password
    if (password.length < 6) {
      return new Response(
        JSON.stringify({ 
          success: false,
          message: 'Password minimal 6 karakter' 
        }), 
        { status: 400 }
      );
    }

    // Validasi format email sederhana
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ 
          success: false,
          message: 'Format email tidak valid' 
        }), 
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    // Cek apakah username sudah ada
    const usernameExists = await db.collection('users').findOne({ username });
    if (usernameExists) {
      return new Response(
        JSON.stringify({ 
          success: false,
          message: 'Username sudah terdaftar' 
        }), 
        { status: 400 }
      );
    }

    // Cek apakah email sudah ada
    const emailExists = await db.collection('users').findOne({ email });
    if (emailExists) {
      return new Response(
        JSON.stringify({ 
          success: false,
          message: 'Email sudah terdaftar' 
        }), 
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Buat user baru
    const userData = {
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: hashedPassword,
      fullName,
      role: role.toLowerCase(),
      permissions: [],
      createdAt: new Date().toISOString()
    };

    // Simpan ke MongoDB
    const result = await db.collection('users').insertOne(userData);

    return new Response(
      JSON.stringify({ 
        success: true,
        user: { id: result.insertedId, ...userData } 
      }), 
      { status: 201 }
    );

  } catch (error) {
    console.error('Error saat registrasi:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        message: 'Terjadi kesalahan saat registrasi' 
      }), 
      { status: 500 }
    );
  }
}