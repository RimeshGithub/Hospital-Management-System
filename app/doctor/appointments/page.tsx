'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CreatePrescriptionForm } from '@/components/appointment/CreatePrescriptionForm';
import { Calendar, Clock, User } from 'lucide-react';

export default function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('upcoming');
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [showPrescriptionDialog, setShowPrescriptionDialog] = useState(false);

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

  function handlePrescriptionSuccess() {
    setShowPrescriptionDialog(false);
    setSelectedAppointment(null);
    fetchAppointments();
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Appointments</h1>
        <p className="text-gray-600 mt-2">View and manage your patient appointments</p>
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
              <p className="text-lg font-medium text-gray-600">
                No {filter === 'all' ? '' : filter} appointments
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredAppointments.map((apt) => {
            const aptDate = new Date(`${apt.appointment_date}T${apt.appointment_time}`);
            const isUpcoming = aptDate > new Date();
            const isPast = aptDate <= new Date();

            return (
              <Card key={apt.appointment_id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-3 flex-1">
                      <div>
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <User className="h-5 w-5 text-blue-600" />
                          {apt.name}
                        </h3>
                        <p className="text-sm text-gray-600">{apt.email}</p>
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
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          isUpcoming
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {isUpcoming ? 'Upcoming' : 'Completed'}
                      </span>
                      {isPast && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedAppointment(apt);
                            setShowPrescriptionDialog(true);
                          }}
                        >
                          Add Prescription
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

      {selectedAppointment && (
        <Dialog open={showPrescriptionDialog} onOpenChange={setShowPrescriptionDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Prescription</DialogTitle>
              <DialogDescription>
                Create a prescription for {selectedAppointment.name}
              </DialogDescription>
            </DialogHeader>
            <CreatePrescriptionForm
              appointmentId={selectedAppointment.appointment_id}
              patientName={selectedAppointment.name}
              patientEmail={selectedAppointment.email}
              onSuccess={handlePrescriptionSuccess}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
