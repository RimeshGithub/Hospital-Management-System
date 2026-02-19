import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { hashPassword } from '@/lib/hash';
import { validateEmail, validatePassword, validateName } from '@/lib/validation';
import type { APIResponse } from '@/types';

export async function POST(request: NextRequest): Promise<NextResponse<APIResponse<any>>> {
  try {
    const { name, email, password, gender, contact_info, dob } = await request.json();

    // Validation
    if (!name || !validateName(name)) {
      return NextResponse.json(
        { success: false, error: 'Invalid name' },
        { status: 400 }
      );
    }

    if (!email || !validateEmail(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email' },
        { status: 400 }
      );
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { success: false, error: passwordValidation.message },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await query('SELECT id FROM users WHERE email = ?', [email]);
    if (Array.isArray(existingUser) && existingUser.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Email already registered' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const userResult = await query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, 'patient']
    );

    const userId = (userResult as any).insertId;

    // Create patient record
    await query(
      'INSERT INTO patients (user_id, gender, contact_info, dob) VALUES (?, ?, ?, ?)',
      [userId, gender || null, contact_info || null, dob || null]
    );

    return NextResponse.json(
      { 
        success: true, 
        message: 'Registration successful. Please login.',
        data: { userId, email }
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: 'Registration failed' },
      { status: 500 }
    );
  }
}
