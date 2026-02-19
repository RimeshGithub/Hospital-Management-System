'use client';

import { useState, useEffect } from 'react';
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
import { AlertCircle, CheckCircle } from 'lucide-react';

export function BookAppointmentForm({ onSuccess }: { onSuccess?: () => void }) {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingDoctors, setFetchingDoctors] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    doctor_id: '',
    appointment_date: '',
    appointment_time: '',
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  async function fetchDoctors() {
    try {
      const response = await fetch('/api/doctors');
      const data = await response.json();
      if (data.success) {
        setDoctors(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setError('Failed to load doctors');
    } finally {
      setFetchingDoctors(false);
    }
  }

  function handleChange(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleBookAppointment(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          doctor_id: parseInt(formData.doctor_id),
        }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || 'Failed to book appointment');
        return;
      }

      setSuccess('Appointment booked successfully!');
      setFormData({
        doctor_id: '',
        appointment_date: '',
        appointment_time: '',
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

  const selectedDoctor = doctors.find((d) => d.doctor_id === parseInt(formData.doctor_id));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Book an Appointment</CardTitle>
        <CardDescription>Schedule your consultation with a doctor</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleBookAppointment} className="space-y-4">
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
            <label htmlFor="doctor" className="text-sm font-medium">
              Select Doctor *
            </label>
            <Select value={formData.doctor_id} onValueChange={(value) => handleChange('doctor_id', value)}>
              <SelectTrigger id="doctor" disabled={fetchingDoctors}>
                <SelectValue placeholder={fetchingDoctors ? 'Loading doctors...' : 'Select a doctor'} />
              </SelectTrigger>
              <SelectContent>
                {doctors.map((doctor) => (
                  <SelectItem key={doctor.doctor_id} value={doctor.doctor_id.toString()}>
                    {doctor.name} - {doctor.specialization}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedDoctor && (
            <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
              <p className="font-medium">{selectedDoctor.name}</p>
              <p>Specialization: {selectedDoctor.specialization}</p>
              <p>Consultation Fee: Rs. {selectedDoctor.doctor_fees}</p>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="date" className="text-sm font-medium">
              Appointment Date *
            </label>
            <Input
              id="date"
              type="date"
              value={formData.appointment_date}
              onChange={(e) => handleChange('appointment_date', e.target.value)}
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="time" className="text-sm font-medium">
              Appointment Time *
            </label>
            <Input
              id="time"
              type="time"
              value={formData.appointment_time}
              onChange={(e) => handleChange('appointment_time', e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading || fetchingDoctors}>
            {loading ? 'Booking...' : 'Book Appointment'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
