'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

export function RegisterForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    gender: '',
    contact_info: '',
    dob: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  function handleChange(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || 'Registration failed');
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center space-y-4 py-8">
          <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
            <span className="text-2xl text-green-600">✓</span>
          </div>
          <h2 className="text-xl font-semibold">Registration Successful!</h2>
          <p className="text-center text-sm text-gray-600">
            Your account has been created. Redirecting to login...
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Patient Registration</CardTitle>
        <CardDescription>Create your patient account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleRegister} className="space-y-4">
          {error && (
            <div className="flex gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Full Name
            </label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="gender" className="text-sm font-medium">
              Gender (Optional)
            </label>
            <Select value={formData.gender} onValueChange={(value) => handleChange('gender', value)}>
              <SelectTrigger id="gender">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="contact" className="text-sm font-medium">
              Contact Number (Optional)
            </label>
            <Input
              id="contact"
              type="tel"
              placeholder="Your phone number"
              value={formData.contact_info}
              onChange={(e) => handleChange('contact_info', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="dob" className="text-sm font-medium">
              Date of Birth (Optional)
            </label>
            <Input
              id="dob"
              type="date"
              value={formData.dob}
              onChange={(e) => handleChange('dob', e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </Button>

          <div className="text-center text-sm">
            <span className="text-gray-600">Already have an account? </span>
            <Link href="/auth/login" className="font-medium text-blue-600 hover:underline">
              Login here
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
