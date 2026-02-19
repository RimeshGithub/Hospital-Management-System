'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LogOut, Menu, X } from 'lucide-react';

export function DoctorNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/auth/login');
  }

  return (
    <nav className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/doctor/dashboard" className="font-bold text-xl text-blue-600">
            Doctor Portal
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex gap-4 items-center">
            <Link href="/doctor/dashboard" className="text-gray-600 hover:text-gray-900">
              Dashboard
            </Link>
            <Link href="/doctor/appointments" className="text-gray-600 hover:text-gray-900">
              Appointments
            </Link>
            <Link href="/doctor/prescriptions" className="text-gray-600 hover:text-gray-900">
              Prescriptions
            </Link>
            <Button variant="outline" size="sm" onClick={handleLogout} className="flex gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              href="/doctor/dashboard"
              className="block px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              Dashboard
            </Link>
            <Link
              href="/doctor/appointments"
              className="block px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              Appointments
            </Link>
            <Link
              href="/doctor/prescriptions"
              className="block px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              Prescriptions
            </Link>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
