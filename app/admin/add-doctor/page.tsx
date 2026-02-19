'use client';

import { useRouter } from 'next/navigation';
import { AddDoctorForm } from '@/components/admin/AddDoctorForm';

export default function AddDoctorPage() {
  const router = useRouter();

  function handleSuccess() {
    router.push('/admin/dashboard');
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Add Doctor</h1>
        <p className="text-gray-600 mt-2">Register a new doctor in the system</p>
      </div>

      <div className="max-w-2xl">
        <AddDoctorForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
}
