'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, User, Trash2, UserPlus } from 'lucide-react';

export default function AdminDashboard() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    fetchCurrentUser();
    fetchDoctors();
  }, []);

  async function fetchDoctors() {
    try {
      const response = await fetch('/api/admin/doctors');
      const data = await response.json();
      if (data.success) {
        setDoctors(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
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

  async function handleDeleteDoctor(doctor_id: number, doctorName: string) {
    if (!window.confirm(`Are you sure you want to remove ${doctorName}? All the related appointments and prescriptions will be deleted.`)) {
      return;
    }

    setDeletingId(doctor_id);
    try {
      const response = await fetch('/api/admin/doctors', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doctor_id }),
      });

      const data = await response.json();

      if (data.success) {
        setDoctors((prev) => prev.filter((d) => d.doctor_id !== doctor_id));
      } else {
        alert(`Failed to remove doctor: ${data.error}`);
      }
    } catch (error) {
      console.error('Error deleting doctor:', error);
      alert('An error occurred while removing the doctor');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Add and manage doctors</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Personal Info</CardTitle>
            <User className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentUser?.name ?? 'Admin'}</div>
            <p className="text-xs text-gray-600">{currentUser?.email}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Doctors</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{doctors.length}</div>
            <p className="text-xs text-gray-600">Registered doctors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Add Doctor</CardTitle>
            <UserPlus className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <Link href="/admin/add-doctor">
              <Button className="w-full text-sm">Add New Doctor</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registered Doctors</CardTitle>
          <CardDescription>List of all doctors in the system</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-gray-600">Loading...</p>
          ) : doctors.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">No doctors registered yet</p>
              <Link href="/admin/add-doctor">
                <Button>Add First Doctor</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4">Name</th>
                      <th className="text-left py-2 px-4">Email</th>
                      <th className="text-left py-2 px-4">Specialization</th>
                      <th className="text-left py-2 px-4">Fees</th>
                      <th className="text-left py-2 px-4">Joined</th>
                      <th className="text-left py-2 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doctors.map((doctor) => (
                      <tr key={doctor.doctor_id} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-4 font-medium">{doctor.name}</td>
                        <td className="py-2 px-4 text-sm text-gray-600">{doctor.email}</td>
                        <td className="py-2 px-4 text-sm">{doctor.specialization}</td>
                        <td className="py-2 px-4 text-sm">Rs. {doctor.doctor_fees}</td>
                        <td className="py-2 px-4 text-sm text-gray-600">
                          {new Date(doctor.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-2 px-4">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteDoctor(doctor.doctor_id, doctor.name)}
                            disabled={deletingId === doctor.doctor_id}
                            className="flex items-center gap-2"
                          >
                            <Trash2 className="h-4 w-4" />
                            {deletingId === doctor.doctor_id ? 'Removing...' : 'Remove'}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
