import { LoginForm } from '@/components/auth/LoginForm';

export const metadata = {
  title: 'Login - Hospital Management System',
  description: 'Login to the hospital management system',
};

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div>
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Hospital Management</h1>
          <p className="mt-2 text-gray-600">Healthcare at your fingertips</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
