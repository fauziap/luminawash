'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { storage, User } from '@/lib/storage';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { LayoutDashboard, CalendarPlus, History, UserCircle } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Ringkasan',    href: '/dashboard',          icon: LayoutDashboard },
  { label: 'Buat Booking', href: '/dashboard/booking',  icon: CalendarPlus },
  { label: 'Riwayat',      href: '/dashboard/history',  icon: History },
  { label: 'Profil Saya',  href: '/dashboard/profile',  icon: UserCircle },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router   = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const cu = storage.getCurrentUser();
    if (!cu || cu.role !== 'USER') {
      router.replace('/login');
    } else {
      setUser(cu);
    }
  }, [router]);

  if (!user) return null;

  const initials = user.name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase();

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
            {/* User Info */}
            <div className="flex flex-col items-center gap-3" style={{ padding: '12px 0 20px', borderBottom: '1px solid var(--glass-border)' }}>
              <div className="avatar" style={{ width: '56px', height: '56px', fontSize: '1.2rem' }}>
                {initials}
              </div>
              <div className="text-center">
                <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{user.name}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>{user.email}</div>
              </div>
            </div>

            {/* Nav */}
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
