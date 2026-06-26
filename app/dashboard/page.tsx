'use client';

import { useEffect, useState } from 'react';
import { storage, Booking, Service } from '@/lib/storage';
import { Calendar, Clock, Car, CalendarPlus, ArrowRight, TrendingUp } from 'lucide-react';
import Link from 'next/link';

const STATUS_LABEL: Record<string, string> = {
  PENDING: 'Menunggu',
  APPROVED: 'Disetujui',
  DONE: 'Selesai',
  REJECTED: 'Ditolak',
};

export default function DashboardHome() {
  const [bookings, setBookings]   = useState<Booking[]>([]);
  const [services, setServices]   = useState<Service[]>([]);
  const user = storage.getCurrentUser();

  useEffect(() => {
    if (!user) return;
    const all = storage.getBookings().filter(b => b.userId === user.id);
    all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setBookings(all);
    setServices(storage.getServices());
  }, []);

  const getService = (id: string) => services.find(s => s.id === id);

  const active   = bookings.filter(b => b.status === 'PENDING' || b.status === 'APPROVED').length;
  const done     = bookings.filter(b => b.status === 'DONE').length;
  const totalSpent = bookings
    .filter(b => b.status === 'DONE')
    .reduce((sum, b) => sum + (getService(b.serviceId)?.price ?? 0), 0);

  const recent = bookings.slice(0, 4);

  return (
    <div className="flex flex-col gap-8">
      {/* Greeting */}
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '6px' }}>
          Halo, {user?.name.split(' ')[0]} 👋
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>Ini ringkasan aktivitas cuci mobil Anda.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-5">
        {[
          { label: 'Booking Aktif', value: active,    color: 'primary', note: 'Pending & disetujui' },
          { label: 'Cuci Selesai',  value: done,      color: 'success', note: 'Total layanan tuntas' },
          {
            label: 'Total Pengeluaran',
            value: `Rp ${totalSpent.toLocaleString('id-ID')}`,
            color: 'info',
            note: 'Akumulasi semua booking',
          },
        ].map(({ label, value, color, note }) => (
          <div key={label} className={`stat-card ${color}`}>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {label}
            </div>
            <div style={{ fontSize: typeof value === 'string' && value.length > 8 ? '1.5rem' : '2.4rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
              {value}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '6px' }}>{note}</div>
          </div>
        ))}
      </div>

      {/* Quick action */}
      <div
        className="glass-card flex items-center justify-between no-hover"
        style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.12))', border: '1px solid rgba(139,92,246,0.2)' }}
      >
        <div className="flex items-center gap-4">
          <div
            style={{
              padding: '14px',
              background: 'linear-gradient(135deg, var(--primary), var(--accent))',
              borderRadius: 'var(--radius-md)',
              color: 'white',
            }}
          >
            <CalendarPlus size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>Mau cuci mobil lagi?</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              Booking jadwal baru hanya dalam beberapa klik.
            </p>
          </div>
        </div>
        <Link href="/dashboard/booking" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
          Booking Sekarang <ArrowRight size={16} />
        </Link>
      </div>

      {/* Recent Bookings */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 style={{ fontSize: '1.35rem' }}>Aktivitas Terakhir</h2>
          <Link href="/dashboard/history" className="flex items-center gap-1" style={{ color: 'var(--primary)', fontSize: '0.88rem' }}>
            Lihat Semua <ArrowRight size={14} />
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="empty-state glass-card no-hover">
            <Calendar size={40} style={{ opacity: 0.3 }} />
            <p>Belum ada riwayat booking. Yuk, buat yang pertama!</p>
            <Link href="/dashboard/booking" className="btn btn-primary btn-sm">
              Buat Booking
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {recent.map(b => {
              const svc = getService(b.serviceId);
              return (
                <div key={b.id} className="glass-card flex justify-between items-center" style={{ padding: '16px 20px' }}>
                  <div className="flex items-center gap-4">
                    <div
                      style={{
                        padding: '10px',
                        background: 'rgba(59,130,246,0.1)',
                        borderRadius: 'var(--radius-md)',
                        color: 'var(--primary)',
                        flexShrink: 0,
                      }}
                    >
                      <Car size={20} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, marginBottom: '3px' }}>{svc?.name ?? '—'}</div>
                      <div className="flex items-center gap-3" style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                        <span className="flex items-center gap-1">
                          <Calendar size={12} /> {b.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> {b.time}
                        </span>
                        <span className="mobile-hide">{b.vehicleInfo}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`badge badge-${b.status.toLowerCase()}`}>
                      {STATUS_LABEL[b.status]}
                    </span>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                      Rp {(svc?.price ?? 0).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
