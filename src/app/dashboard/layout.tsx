import type { ReactNode } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {children}
    </div>
  );
}
