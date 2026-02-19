import { PatientNavbar } from '@/components/navigation/PatientNavbar';

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <PatientNavbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
