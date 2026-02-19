import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { comparePassword } from '@/lib/hash';
import { generateToken, setAuthCookie } from '@/lib/auth';
import { validateEmail } from '@/lib/validation';
import type { APIResponse, User } from '@/types';

export async function POST(request: NextRequest): Promise<NextResponse<APIResponse<any>>> {
  try {
    const { email, password } = await request.json();

    // Validation
    if (!email || !validateEmail(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email' },
        { status: 400 }
      );
    }

    if (!password) {
      return NextResponse.json(
        { success: false, error: 'Password is required' },
        { status: 400 }
      );
    }

    // Find user
    const users = await query('SELECT id, name, email, password, role FROM users WHERE email = ?', [email]);
    
    if (!Array.isArray(users) || users.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const user = users[0] as any;

    // Verify password
    const passwordMatch = await comparePassword(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    // Set auth cookie
    await setAuthCookie(token);

    return NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    );
  }
}
