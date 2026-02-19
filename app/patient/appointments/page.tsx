'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, DollarSign } from 'lucide-react';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
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
    const aptDate = new Date(`${apt.appointment_date}T${apt.appointment_time}`);
    const now = new Date();

    if (filter === 'upcoming') {
      return aptDate > now;
    } else if (filter === 'completed') {
      return aptDate <= now;
    }
    return true;
  });

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
            const aptDate = new Date(`${apt.appointment_date}T${apt.appointment_time}`);
            const isUpcoming = aptDate > new Date();

            return (
              <Card key={apt.appointment_id}>
                <CardContent className="pt-6">
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
                          {apt.appointment_time}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <DollarSign className="h-4 w-4" />
                          Rs. {apt.doctor_fees}
                        </div>
                      </div>
                    </div>

                    <div className="ml-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          isUpcoming
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {isUpcoming ? 'Upcoming' : 'Completed'}
                      </span>
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
