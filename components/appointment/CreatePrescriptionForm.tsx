'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface CreatePrescriptionFormProps {
  appointmentId: number;
  patientName: string;
  patientEmail: string;
  onSuccess?: () => void;
}

export function CreatePrescriptionForm({
  appointmentId,
  patientName,
  patientEmail,
  onSuccess,
}: CreatePrescriptionFormProps) {
  const [formData, setFormData] = useState({
    diagnosis_info: '',
    advice_medicine: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  function handleChange(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleCreatePrescription(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/prescriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appointment_id: appointmentId,
          ...formData,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || 'Failed to create prescription');
        return;
      }

      setSuccess('Prescription created successfully!');
      setFormData({
        diagnosis_info: '',
        advice_medicine: '',
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
        <CardTitle>Patient: {patientName}</CardTitle>
        <CardDescription>
          {patientEmail}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCreatePrescription} className="space-y-4">
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

          <div className="space-y-2">
            <label htmlFor="diagnosis" className="text-sm font-medium">
              Diagnosis Information *
            </label>
            <Textarea
              id="diagnosis"
              placeholder="Enter diagnosis details..."
              value={formData.diagnosis_info}
              onChange={(e) => handleChange('diagnosis_info', e.target.value)}
              required
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="medicine" className="text-sm font-medium">
              Advice & Medicine *
            </label>
            <Textarea
              id="medicine"
              placeholder="Enter prescribed medicines and advice..."
              value={formData.advice_medicine}
              onChange={(e) => handleChange('advice_medicine', e.target.value)}
              required
              rows={4}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating...' : 'Create Prescription'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
