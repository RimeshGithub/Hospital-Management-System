'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, Banknote } from 'lucide-react';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('upcoming');

  useEffect(() => {
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

  const filteredAppointments = appointments.filter((apt) => {
    const aptDate = new Date(apt.appointment_date);
    aptDate.setHours(
      parseInt(apt.appointment_time.split(':')[0]),
      parseInt(apt.appointment_time.split(':')[1]),
      0
    );

    const now = new Date();

    if (filter === 'upcoming') {
      return aptDate > now;
    } else if (filter === 'completed') {
      return aptDate <= now;
    }
    return true;
  });

  if (filter === 'upcoming') {
    filteredAppointments.sort(function (a, b) {
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
    })
  }

  function convertTo12Hour(time24: string): string {
    if (!time24) return '';

    const [hourStr, minuteStr] = time24.split(':');
    let hours = parseInt(hourStr, 10);
    const minutes = minuteStr;

    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert 0 → 12

    return `${hours.toString().padStart(2, '0')}:${minutes} ${period}`;
  }

  async function handleCancelAppointment(appointment_id: number) {
    if (!window.confirm(`Are you sure you want to cancel this appointment? This action cannot be undone.`)) {
      return;
    }

    setDeletingId(appointment_id);
    try {
      const response = await fetch('/api/appointments', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointment_id }),
      });

      const data = await response.json();

      if (data.success) {
        setAppointments((prev) => prev.filter((apt) => apt.appointment_id !== appointment_id));
      } else {
        alert(`Failed to cancel appointment: ${data.error}`);
      }
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      alert('An error occurred while cancelling the appointment');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">My Appointments</h1>
          <p className="text-gray-600 mt-2">View and manage all your appointments</p>
        </div>
        <Link href="/patient/book-appointment">
          <Button>Book New</Button>
        </Link>
      </div>

      <div className="flex gap-2">
        <Button
          variant={filter === 'upcoming' ? 'default' : 'outline'}
          onClick={() => setFilter('upcoming')}
        >
          Upcoming
        </Button>
        <Button
          variant={filter === 'completed' ? 'default' : 'outline'}
          onClick={() => setFilter('completed')}
        >
          Completed
        </Button>
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
        >
          All
        </Button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <p className="text-gray-600">Loading appointments...</p>
        ) : filteredAppointments.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Calendar className="h-12 w-12 text-gray-300 mb-4" />
              <p className="text-lg font-medium text-gray-600">No {filter} appointments</p>
              <p className="text-sm text-gray-500 mb-4">
                {filter === 'upcoming'
                  ? 'Book an appointment to get started'
                  : 'No completed appointments yet'}
              </p>
              {filter === 'upcoming' && (
                <Link href="/patient/book-appointment">
                  <Button>Book Now</Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredAppointments.map((apt) => {
            const aptDate = new Date(apt.appointment_date);
            aptDate.setHours(
              parseInt(apt.appointment_time.split(':')[0]),
              parseInt(apt.appointment_time.split(':')[1]),
              0
            );
            const isUpcoming = aptDate > new Date();

            return (
              <Card key={apt.appointment_id}>
                <CardContent className="pt-0">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                      <div>
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <User className="h-5 w-5 text-blue-600" />
                          {apt.name}
                        </h3>
                        <p className="text-sm text-gray-600">{apt.specialization}</p>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:gap-6 gap-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="h-4 w-4" />
                          {new Date(apt.appointment_date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="h-4 w-4" />
                          {convertTo12Hour(apt.appointment_time)}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Banknote className="h-4 w-4" />
                          Rs. {apt.doctor_fees}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          isUpcoming
                            ? 'bg-green-200 text-green-800'
                            : 'bg-gray-200 text-gray-800'
                        }`}
                      >
                        {isUpcoming ? 'Upcoming' : 'Completed'}
                      </span>
                      {isUpcoming && (
                        <Button
                          size="sm"
                          className="w-40"
                          variant="destructive"
                          disabled={deletingId === apt.appointment_id}
                          onClick={() => handleCancelAppointment(apt.appointment_id)}
                        >
                          {deletingId === apt.appointment_id ? 'Cancelling...' : 'Cancel Appointment'}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
