import { RegisterForm } from '@/components/auth/RegisterForm';

export const metadata = {
  title: 'Register - Hospital Management System',
  description: 'Register as a patient in the hospital management system',
};

export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div>
        <div className="mb-4 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Hospital Management System</h1>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
