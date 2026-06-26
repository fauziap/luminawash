'use client';

import { useState, useEffect } from 'react';
import { storage, Booking, Service, User } from '@/lib/storage';
import { Calendar, Users, TrendingUp, Clock, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import Link from 'next/link';

const STATUS_LABEL: Record<string, string> = {
  PENDING: 'Menunggu', APPROVED: 'Disetujui', DONE: 'Selesai', REJECTED: 'Ditolak',
};

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [users,    setUsers]    = useState<User[]>([]);

  useEffect(() => {
    setBookings(storage.getBookings());
    setServices(storage.getServices());
    setUsers(storage.getUsers().filter(u => u.role === 'USER'));
  }, []);

  const pending   = bookings.filter(b => b.status === 'PENDING');
  const approved  = bookings.filter(b => b.status === 'APPROVED').length;
  const done      = bookings.filter(b => b.status === 'DONE').length;
  const totalRevenue = bookings
    .filter(b => b.status === 'DONE')
    .reduce((sum, b) => sum + (services.find(s => s.id === b.serviceId)?.price ?? 0), 0);

  const recent = [...bookings]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const getService  = (id: string) => services.find(s => s.id === id);
  const getUserName = (id: string) => users.find(u => u.id === id)?.name ?? id;

  const handleQuickAction = (id: string, status: 'APPROVED' | 'REJECTED') => {
    const updated = storage.getBookings().map(b => b.id === id ? { ...b, status } : b);
    storage.saveBookings(updated);
    setBookings(storage.getBookings());
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '6px' }}>Admin Dashboard</h1>
        <p style={{ color: 'var(--text-muted)' }}>Ringkasan operasional LuminaWash hari ini.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-5">
        {[
          { label: 'Total Booking',    value: bookings.length, color: 'primary', sub: 'Semua waktu' },
          { label: 'Perlu Konfirmasi', value: pending.length,  color: 'warning', sub: 'Butuh tindakan' },
          { label: 'Selesai',          value: done,            color: 'success', sub: 'Layanan tuntas' },
          { label: 'Total Pendapatan', value: `Rp ${totalRevenue.toLocaleString('id-ID')}`, color: 'info', sub: 'Dari booking done' },
        ].map(({ label, value, color, sub }) => (
          <div key={label} className={`stat-card ${color}`}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {label}
            </div>
            <div style={{ fontSize: typeof value === 'string' && value.length > 8 ? '1.3rem' : '2.4rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
              {value}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Quick section row */}
      <div className="grid grid-cols-2 gap-6">
        {/* Pending Quick Actions */}
        <div className="glass-card no-hover flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 style={{ fontSize: '1.05rem' }}>⏳ Menunggu Konfirmasi</h3>
            <Link href="/admin/bookings" className="flex items-center gap-1" style={{ color: 'var(--primary)', fontSize: '0.82rem' }}>
              Lihat Semua <ArrowRight size={13} />
            </Link>
          </div>
          {pending.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '20px 0' }}>
              Tidak ada booking pending.
            </p>
          ) : (
            pending.slice(0, 3).map(b => (
              <div key={b.id} style={{ padding: '12px 14px', borderRadius: 'var(--radius-md)', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)' }}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>{getService(b.serviceId)?.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{getUserName(b.userId)} · {b.date} {b.time}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleQuickAction(b.id, 'APPROVED')} className="btn btn-success btn-sm">
                    <CheckCircle2 size={14} /> Setujui
                  </button>
                  <button onClick={() => handleQuickAction(b.id, 'REJECTED')} className="btn btn-danger btn-sm">
                    <XCircle size={14} /> Tolak
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Service Summary */}
        <div className="glass-card no-hover flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 style={{ fontSize: '1.05rem' }}>📊 Statistik Layanan</h3>
            <Link href="/admin/services" className="flex items-center gap-1" style={{ color: 'var(--primary)', fontSize: '0.82rem' }}>
              Kelola <ArrowRight size={13} />
            </Link>
          </div>
          {services.map(svc => {
            const count = bookings.filter(b => b.serviceId === svc.id && b.status === 'DONE').length;
            const pct   = done > 0 ? Math.round((count / done) * 100) : 0;
            return (
              <div key={svc.id}>
                <div className="flex justify-between mb-1" style={{ fontSize: '0.85rem' }}>
                  <span>{svc.name}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{count} selesai ({pct}%)</span>
                </div>
                <div style={{ height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.06)' }}>
                  <div style={{ width: `${pct}%`, height: '100%', borderRadius: '3px',
                    background: 'linear-gradient(to right, var(--primary), var(--accent))', transition: 'width 0.8s ease' }} />
                </div>
              </div>
            );
          })}

          <div className="divider" style={{ margin: '4px 0' }} />
          <div className="flex justify-between" style={{ fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Total Pelanggan</span>
            <span style={{ fontWeight: 700 }}>{users.length} orang</span>
          </div>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="glass-card no-hover flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h3 style={{ fontSize: '1.05rem' }}>📋 Booking Terbaru</h3>
          <Link href="/admin/bookings" className="flex items-center gap-1" style={{ color: 'var(--primary)', fontSize: '0.82rem' }}>
            Lihat Semua <ArrowRight size={13} />
          </Link>
        </div>
        <div className="table-wrapper" style={{ border: 'none' }}>
          <table>
            <thead>
              <tr>
                <th>Pelanggan</th>
                <th>Layanan</th>
                <th>Tanggal &amp; Jam</th>
                <th>Kendaraan</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recent.map(b => (
                <tr key={b.id}>
                  <td style={{ fontWeight: 500 }}>{getUserName(b.userId)}</td>
                  <td>{getService(b.serviceId)?.name ?? '—'}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{b.date} / {b.time}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{b.vehicleInfo}</td>
                  <td><span className={`badge badge-${b.status.toLowerCase()}`}>{STATUS_LABEL[b.status]}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
