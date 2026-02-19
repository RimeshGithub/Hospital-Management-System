'use client';

import { useRouter } from 'next/navigation';
import { BookAppointmentForm } from '@/components/appointment/BookAppointmentForm';

export default function BookAppointmentPage() {
  const router = useRouter();

  function handleSuccess() {
    router.push('/patient/appointments');
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Book an Appointment</h1>
        <p className="text-gray-600 mt-2">Schedule a consultation with one of our doctors</p>
      </div>

      <div className="max-w-2xl">
        <BookAppointmentForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
}
