import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { hashPassword } from '@/lib/hash';
import { getCurrentUser } from '@/lib/auth';
import { validateEmail, validatePassword, validateName, validateSpecialization, validateFees } from '@/lib/validation';
import type { APIResponse } from '@/types';

export async function POST(request: NextRequest): Promise<NextResponse<APIResponse<any>>> {
  try {
    // Check if user is admin
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }

    const { name, email, password, specialization, doctor_fees } = await request.json();

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

    if (!specialization || !validateSpecialization(specialization)) {
      return NextResponse.json(
        { success: false, error: 'Invalid specialization' },
        { status: 400 }
      );
    }

    if (!validateFees(doctor_fees)) {
      return NextResponse.json(
        { success: false, error: 'Invalid doctor fees' },
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

    // Create user with doctor role
    const userResult = await query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, 'doctor']
    );

    const userId = (userResult as any).insertId;

    // Create doctor record
    await query(
      'INSERT INTO doctors (user_id, specialization, doctor_fees) VALUES (?, ?, ?)',
      [userId, specialization, doctor_fees]
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Doctor added successfully',
        data: {
          doctor_id: userId,
          name,
          email,
          specialization,
          doctor_fees,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Add doctor error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add doctor' },
      { status: 500 }
    );
  }
}
