import { NextRequest, NextResponse } from 'next/server';
import { clearAuthCookie } from '@/lib/auth';
import type { APIResponse } from '@/types';

export async function POST(request: NextRequest): Promise<NextResponse<APIResponse<null>>> {
  try {
    await clearAuthCookie();

    return NextResponse.json(
      {
        success: true,
        message: 'Logout successful',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, error: 'Logout failed' },
      { status: 500 }
    );
  }
}
