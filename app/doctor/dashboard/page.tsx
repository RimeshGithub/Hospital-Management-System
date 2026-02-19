'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, FileText, Users } from 'lucide-react';

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchAppointments(), fetchPrescriptions()]);
  }, []);

  async function fetchAppointments() {
    try {
      const response = await fetch('/api/appointments');
      const data = await response.json();
      if (data.success) {
        setAppointments(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchPrescriptions() {
    try {
      const response = await fetch('/api/prescriptions');
      const data = await response.json();
      if (data.success) {
        setPrescriptions(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
    }
  }

  const upcomingAppointments = appointments.filter(
    (apt) => new Date(`${apt.appointment_date}T${apt.appointment_time}`) > new Date()
  );

  const completedAppointments = appointments.filter(
    (apt) => new Date(`${apt.appointment_date}T${apt.appointment_time}`) <= new Date()
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Doctor Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your appointments and prescriptions</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appointments.length}</div>
            <p className="text-xs text-gray-600">All appointments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
            <p className="text-xs text-gray-600">Scheduled appointments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prescriptions</CardTitle>
            <FileText className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{prescriptions.length}</div>
            <p className="text-xs text-gray-600">Issued prescriptions</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Appointments</CardTitle>
          <CardDescription>Your scheduled consultations</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-gray-600">Loading...</p>
          ) : upcomingAppointments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No upcoming appointments</p>
            </div>
          ) : (
            <div className="space-y-2">
              {upcomingAppointments.slice(0, 5).map((apt) => (
                <div
                  key={apt.appointment_id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div>
                    <p className="font-medium">{apt.name}</p>
                    <p className="text-sm text-gray-600">{apt.email}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(apt.appointment_date).toLocaleDateString()} at{' '}
                      {apt.appointment_time}
                    </p>
                  </div>
                  <Link href="/doctor/appointments">
                    <Button size="sm">View All</Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
