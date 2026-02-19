import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import type { APIResponse, Doctor } from '@/types';

export async function GET(request: NextRequest): Promise<NextResponse<APIResponse<any>>> {
  try {
    // Check if user is admin
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }

    // Get all doctors with user info
    const doctors = await query(
      `SELECT d.doctor_id, d.user_id, d.specialization, d.doctor_fees, 
              u.name, u.email, u.created_at
       FROM doctors d
       JOIN users u ON d.user_id = u.id
       ORDER BY u.created_at DESC`
    );

    return NextResponse.json(
      {
        success: true,
        data: doctors || [],
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get doctors error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch doctors' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest): Promise<NextResponse<APIResponse<any>>> {
  try {
    // Check if user is admin
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }

    const { doctor_id } = await request.json();

    if (!doctor_id) {
      return NextResponse.json(
        { success: false, error: 'Doctor ID is required' },
        { status: 400 }
      );
    }

    // Get doctor info to find user_id
    const doctors = await query(
      `SELECT user_id FROM doctors WHERE doctor_id = ?`,
      [doctor_id]
    );

    if (!doctors || doctors.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Doctor not found' },
        { status: 404 }
      );
    }

    const user_id = doctors[0].user_id;

    // Delete doctor record
    await query(
      `DELETE FROM doctors WHERE doctor_id = ?`,
      [doctor_id]
    );

    // Delete user record
    await query(
      `DELETE FROM users WHERE id = ?`,
      [user_id]
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Doctor removed successfully',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Delete doctor error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove doctor' },
      { status: 500 }
    );
  }
}
