export interface User {
  id: number;
  name: string;
  email: string;
  role: 'patient' | 'doctor' | 'admin';
  created_at: Date;
}

export interface Patient {
  patient_id: number;
  user_id: number;
  gender: string;
  contact_info: string;
  dob: string;
  user?: User;
}

export interface Doctor {
  doctor_id: number;
  user_id: number;
  specialization: string;
  doctor_fees: number;
  user?: User;
}

export interface Admin {
  admin_id: number;
  user_id: number;
  user?: User;
}

export interface Appointment {
  appointment_id: number;
  patient_id: number;
  doctor_id: number;
  appointment_date: string;
  appointment_time: string;
  patient?: Patient;
  doctor?: Doctor;
}

export interface Prescription {
  prescription_id: number;
  appointment_id: number;
  doctor_id: number;
  patient_id: number;
  diagnosis_info: string;
  advice_medicine: string;
  appointment?: Appointment;
  doctor?: Doctor;
  patient?: Patient;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
