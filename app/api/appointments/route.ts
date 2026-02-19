import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { validateDate, validateTime } from '@/lib/validation';
import type { APIResponse } from '@/types';

export async function POST(request: NextRequest): Promise<NextResponse<APIResponse<any>>> {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { doctor_id, appointment_date, appointment_time } = await request.json();

    // Validation
    if (!doctor_id) {
      return NextResponse.json(
        { success: false, error: 'Doctor ID is required' },
        { status: 400 }
      );
    }

    if (!appointment_date || !validateDate(appointment_date)) {
      return NextResponse.json(
        { success: false, error: 'Invalid appointment date' },
        { status: 400 }
      );
    }

    if (!appointment_time || !validateTime(appointment_time)) {
      return NextResponse.json(
        { success: false, error: 'Invalid appointment time' },
        { status: 400 }
      );
    }

    // Get patient ID
    const patients = await query('SELECT patient_id FROM patients WHERE user_id = ?', [
      currentUser.id,
    ]);

    if (!Array.isArray(patients) || patients.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Patient record not found' },
        { status: 404 }
      );
    }

    const patient_id = (patients[0] as any).patient_id;

    // Create appointment
    const result = await query(
      'INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time) VALUES (?, ?, ?, ?)',
      [patient_id, doctor_id, appointment_date, appointment_time]
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Appointment booked successfully',
        data: { appointment_id: (result as any).insertId },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Book appointment error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to book appointment' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest): Promise<NextResponse<APIResponse<any>>> {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get appointments based on user role
    let appointments;

    if (currentUser.role === 'patient') {
      // Get patient appointments
      appointments = await query(
        `SELECT a.appointment_id, a.appointment_date, a.appointment_time,
                d.doctor_id, u.name, u.email, d.specialization, d.doctor_fees,
                p.patient_id
         FROM appointments a
         JOIN patients p ON a.patient_id = p.patient_id
         JOIN doctors d ON a.doctor_id = d.doctor_id
         JOIN users u ON d.user_id = u.id
         WHERE p.user_id = ?
         ORDER BY a.appointment_date DESC, a.appointment_time DESC`,
        [currentUser.id]
      );
    } else if (currentUser.role === 'doctor') {
      // Get doctor appointments
      appointments = await query(
        `SELECT a.appointment_id, a.appointment_date, a.appointment_time,
                p.patient_id, pu.name, pu.email, p.gender, p.contact_info,
                d.doctor_id
         FROM appointments a
         JOIN patients p ON a.patient_id = p.patient_id
         JOIN users pu ON p.user_id = pu.id
         JOIN doctors d ON a.doctor_id = d.doctor_id
         JOIN users du ON d.user_id = du.id
         WHERE du.id = ?
         ORDER BY a.appointment_date DESC, a.appointment_time DESC`,
        [currentUser.id]
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: appointments || [],
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get appointments error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
}
