'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { DOCTOR_SPECIALIZATIONS } from '@/lib/constants';

export function AddDoctorForm({ onSuccess }: { onSuccess?: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    specialization: '',
    doctor_fees: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  function handleChange(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleAddDoctor(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/admin/add-doctor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          doctor_fees: parseFloat(formData.doctor_fees),
        }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || 'Failed to add doctor');
        return;
      }

      setSuccess(`Doctor ${formData.name} added successfully!`);
      setFormData({
        name: '',
        email: '',
        password: '',
        specialization: '',
        doctor_fees: '',
      });

      if (onSuccess) {
        setTimeout(onSuccess, 1500);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Doctor</CardTitle>
        <CardDescription>Create a new doctor account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddDoctor} className="space-y-4">
          {error && (
            <div className="flex gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700">
              <CheckCircle className="h-5 w-5 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Full Name *
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Dr. John Doe"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email *
              </label>
              <Input
                id="email"
                type="email"
                placeholder="doctor@hospital.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password *
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
              <label htmlFor="specialization" className="text-sm font-medium">
                Specialization *
              </label>
              <Select value={formData.specialization} onValueChange={(value) => handleChange('specialization', value)}>
                <SelectTrigger id="specialization" className="w-full">
                  <SelectValue placeholder="Select a specialization" />
                </SelectTrigger>
                <SelectContent>
                  {DOCTOR_SPECIALIZATIONS.map((spec) => (
                    <SelectItem key={spec} value={spec}>
                      {spec}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="fees" className="text-sm font-medium">
                Consultation Fees (Rs.) *
              </label>
              <Input
                id="fees"
                type="number"
                placeholder="500"
                value={formData.doctor_fees}
                onChange={(e) => handleChange('doctor_fees', e.target.value)}
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Adding Doctor...' : 'Add Doctor'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
