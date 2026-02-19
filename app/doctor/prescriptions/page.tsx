'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, User, Calendar } from 'lucide-react';

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  async function fetchPrescriptions() {
    try {
      const response = await fetch('/api/prescriptions');
      const data = await response.json();
      if (data.success) {
        setPrescriptions(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Prescriptions</h1>
        <p className="text-gray-600 mt-2">View all prescriptions you have issued</p>
      </div>

      <div className="space-y-4">
        {loading ? (
          <p className="text-gray-600">Loading prescriptions...</p>
        ) : prescriptions.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <FileText className="h-12 w-12 text-gray-300 mb-4" />
              <p className="text-lg font-medium text-gray-600">No prescriptions issued yet</p>
            </CardContent>
          </Card>
        ) : (
          prescriptions.map((prescription) => (
            <Card key={prescription.prescription_id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-blue-100 p-3">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {prescription.name}
                        <span className="text-sm font-normal text-gray-600">
                          ({prescription.email})
                        </span>
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(prescription.appointment_date).toLocaleDateString()} at{' '}
                        {prescription.appointment_time}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600">
                      {new Date(prescription.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm mb-2">Diagnosis</h4>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {prescription.diagnosis_info}
                  </p>
                </div>
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-sm mb-2">Advice & Medicines</h4>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {prescription.advice_medicine}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
