import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import type { APIResponse } from '@/types';

export async function POST(request: NextRequest): Promise<NextResponse<APIResponse<any>>> {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'doctor') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Doctor access required' },
        { status: 403 }
      );
    }

    const { appointment_id, diagnosis_info, advice_medicine } = await request.json();

    if (!appointment_id || !diagnosis_info || !advice_medicine) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get appointment details to verify it belongs to this doctor
    const appointments = await query(
      `SELECT a.appointment_id, a.patient_id, d.doctor_id
       FROM appointments a
       JOIN doctors d ON a.doctor_id = d.doctor_id
       JOIN users u ON d.user_id = u.id
       WHERE a.appointment_id = ? AND u.id = ?`,
      [appointment_id, currentUser.id]
    );

    if (!Array.isArray(appointments) || appointments.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Appointment not found' },
        { status: 404 }
      );
    }

    const apt = (appointments[0] as any);

    // Create prescription
    const result = await query(
      `INSERT INTO prescriptions (appointment_id, doctor_id, patient_id, diagnosis_info, advice_medicine)
       SELECT ?, d.doctor_id, ?, ?, ?
       FROM doctors d
       JOIN users u ON d.user_id = u.id
       WHERE u.id = ?`,
      [appointment_id, apt.patient_id, diagnosis_info, advice_medicine, currentUser.id]
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Prescription created successfully',
        data: { prescription_id: (result as any).insertId },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create prescription error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create prescription' },
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

    let prescriptions;

    if (currentUser.role === 'doctor') {
      // Get prescriptions written by this doctor
      prescriptions = await query(
        `SELECT p.prescription_id, p.appointment_id, p.diagnosis_info, p.advice_medicine,
                p.created_at, a.appointment_date, a.appointment_time,
                pat.patient_id, pu.name, pu.email
         FROM prescriptions p
         JOIN appointments a ON p.appointment_id = a.appointment_id
         JOIN patients pat ON p.patient_id = pat.patient_id
         JOIN users pu ON pat.user_id = pu.id
         JOIN doctors d ON p.doctor_id = d.doctor_id
         JOIN users du ON d.user_id = du.id
         WHERE du.id = ?
         ORDER BY p.created_at DESC`,
        [currentUser.id]
      );
    } else if (currentUser.role === 'patient') {
      // Get prescriptions for this patient
      prescriptions = await query(
        `SELECT p.prescription_id, p.appointment_id, p.diagnosis_info, p.advice_medicine,
                p.created_at, a.appointment_date, a.appointment_time,
                d.doctor_id, du.name, du.email, d.specialization
         FROM prescriptions p
         JOIN appointments a ON p.appointment_id = a.appointment_id
         JOIN doctors d ON p.doctor_id = d.doctor_id
         JOIN users du ON d.user_id = du.id
         JOIN patients pat ON p.patient_id = pat.patient_id
         WHERE pat.user_id = ?
         ORDER BY p.created_at DESC`,
        [currentUser.id]
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: prescriptions || [],
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get prescriptions error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch prescriptions' },
      { status: 500 }
    );
  }
}
