// /app/api/auth/login/route.js
import clientPromise from '@/app/lib/mongodb';
import { compare } from 'bcryptjs';

export async function POST(req) {
  try {
    const { username, password } = await req.json();
    const client = await clientPromise;
    const db = client.db();
    const user = await db.collection('users').findOne({ username: username.toLowerCase() });

    if (!user) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Username atau password salah' 
        }), 
        { status: 401 }
      );
    }

    const isValid = await compare(password, user.password);

    if (!isValid) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Username atau password salah' 
        }), 
        { status: 401 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: user._id,
          username: user.username,
          fullName: user.fullName,
          role: user.role,
          permissions: user.permissions
        },
        message: 'Login berhasil'
      }),
      { status: 200 }
    );

  } catch (error) {
    console.error('Login error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Terjadi kesalahan saat login' 
      }), 
      { status: 500 }
    );
  }
}
