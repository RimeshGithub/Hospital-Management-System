import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import type { APIResponse } from '@/types';

export async function GET(request: NextRequest): Promise<NextResponse<APIResponse<any>>> {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get all doctors with their info
    const doctors = await query(
      `SELECT d.doctor_id, d.user_id, d.specialization, d.doctor_fees,
              u.name, u.email, u.created_at
       FROM doctors d
       JOIN users u ON d.user_id = u.id
       ORDER BY u.name ASC`
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
