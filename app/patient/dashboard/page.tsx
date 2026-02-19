'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, FileText, Stethoscope, User } from 'lucide-react';

export default function PatientDashboard() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCurrentUser();
    fetchAppointments();
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

  async function fetchCurrentUser() {
    try {
      const response = await fetch('/api/users/me');
      const data = await response.json();
      if (data.success) {
        setCurrentUser(data.data || null);
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
  }

  const upcomingAppointments = appointments.filter(
    function (apt) {
      const aptDate = new Date(apt.appointment_date);
      aptDate.setHours(
        parseInt(apt.appointment_time.split(':')[0]),
        parseInt(apt.appointment_time.split(':')[1]),
        0
      );
      const now = new Date();
      return aptDate > now;
    }
  ).sort(function (a, b) {
    const aDate = new Date(a.appointment_date);
    aDate.setHours(
      parseInt(a.appointment_time.split(':')[0]),
      parseInt(a.appointment_time.split(':')[1]),
      0
    )
    const bDate = new Date(b.appointment_date);
    bDate.setHours(
      parseInt(b.appointment_time.split(':')[0]),
      parseInt(b.appointment_time.split(':')[1]),
      0
    )
    return aDate.getTime() - bDate.getTime();
  });

  const completedAppointments = appointments.filter(
    function (apt) {
      const aptDate = new Date(apt.appointment_date);
      aptDate.setHours(
        parseInt(apt.appointment_time.split(':')[0]),
        parseInt(apt.appointment_time.split(':')[1]),
        0
      );
      const now = new Date();
      return aptDate <= now;
    }
  );

  function convertTo12Hour(time24: string): string {
    if (!time24) return '';

    const [hourStr, minuteStr] = time24.split(':');
    let hours = parseInt(hourStr, 10);
    const minutes = minuteStr;

    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert 0 → 12

    return `${hours.toString().padStart(2, '0')}:${minutes} ${period}`;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Patient Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your health appointments</p>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Personal Info</CardTitle>
            <User className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentUser?.name ?? 'Patient'}</div>
            <p className="text-xs text-gray-600">{currentUser?.email}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
            <Stethoscope className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appointments.length}</div>
            <p className="text-xs text-gray-600">All appointments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Calendar className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
            <p className="text-xs text-gray-600">Scheduled appointments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <FileText className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedAppointments.length}</div>
            <p className="text-xs text-gray-600">Past appointments</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Book an appointment or view your appointments</CardDescription>
          </div>
          <div className="space-x-2">
            <Link href="/patient/book-appointment">
              <Button>Book Appointment</Button>
            </Link>
            <Link href="/patient/appointments">
              <Button>View Appointments</Button>
            </Link>
          </div>
        </CardHeader>
      </Card>

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
              <p className="text-gray-600 mb-4">No upcoming appointments</p>
              <Link href="/patient/book-appointment">
                <Button>Schedule Now</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {upcomingAppointments.map((apt) => (
                <div
                  key={apt.appointment_id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div>
                    <p className="font-medium">{apt.name}</p>
                    <p className="text-sm text-gray-600">{apt.specialization}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(apt.appointment_date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })} at{' '}
                      {convertTo12Hour(apt.appointment_time)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">Rs. {apt.doctor_fees}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
