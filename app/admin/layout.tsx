'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { storage, User } from '@/lib/storage';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { LayoutDashboard, CalendarDays, Wrench, Users, ShieldCheck } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Dashboard',       href: '/admin',          icon: LayoutDashboard },
  { label: 'Kelola Booking',  href: '/admin/bookings', icon: CalendarDays },
  { label: 'Kelola Layanan',  href: '/admin/services', icon: Wrench },
  { label: 'Kelola User',     href: '/admin/users',    icon: Users },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router   = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const cu = storage.getCurrentUser();
    if (!cu || cu.role !== 'ADMIN') {
      router.replace('/login');
    } else {
      setUser(cu);
    }
  }, [router]);

  if (!user) return null;

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <div
        className="main-content container dashboard-layout"
        style={{ display: 'flex', gap: '32px', paddingBottom: '60px', alignItems: 'flex-start' }}
      >
        {/* Sidebar */}
        <aside className="sidebar-panel" style={{ width: '240px', flexShrink: 0 }}>
          <div className="glass-card no-hover" style={{ position: 'sticky', top: '100px', padding: '20px 16px' }}>
            {/* Admin badge */}
            <div className="flex flex-col items-center gap-3" style={{ padding: '12px 0 20px', borderBottom: '1px solid var(--glass-border)' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #EF4444, #F59E0B)',
                display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={26} color="white" />
              </div>
              <div className="text-center">
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{user.name}</div>
                <div style={{ fontSize: '0.75rem', marginTop: '4px', padding: '2px 10px', borderRadius: 'var(--radius-full)',
                  background: 'rgba(239,68,68,0.1)', color: 'var(--danger)', border: '1px solid rgba(239,68,68,0.25)' }}>
                  ADMIN
                </div>
              </div>
            </div>

            <nav className="flex flex-col gap-1" style={{ marginTop: '16px' }}>
              {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
                const active = pathname === href;
                return (
                  <Link key={href} href={href} className={`sidebar-link ${active ? 'active' : ''}`}>
                    <Icon size={18} />
                    <span>{label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main */}
        <main style={{ flexGrow: 1, minWidth: 0 }} className="animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
