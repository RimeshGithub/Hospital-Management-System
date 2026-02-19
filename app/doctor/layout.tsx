import { DoctorNavbar } from '@/components/navigation/DoctorNavbar';

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <DoctorNavbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
