'use client';

import { useState, useEffect } from 'react';
import { storage, Booking, Service } from '@/lib/storage';
import { Calendar, Clock, Car, Search, Filter } from 'lucide-react';

const STATUS_LABEL: Record<string, string> = {
  PENDING: 'Menunggu',
  APPROVED: 'Disetujui',
  DONE: 'Selesai',
  REJECTED: 'Ditolak',
};

export default function HistoryPage() {
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [services,    setServices]    = useState<Service[]>([]);
  const [filter,      setFilter]      = useState<string>('ALL');
  const [search,      setSearch]      = useState('');

  const user = storage.getCurrentUser();

  useEffect(() => {
    if (!user) return;
    const bkgs = storage
      .getBookings()
      .filter(b => b.userId === user.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setAllBookings(bkgs);
    setServices(storage.getServices());
  }, []);

  const getService = (id: string) => services.find(s => s.id === id);

  const filtered = allBookings.filter(b => {
    const matchStatus = filter === 'ALL' || b.status === filter;
    const svcName = getService(b.serviceId)?.name?.toLowerCase() ?? '';
    const matchSearch = svcName.includes(search.toLowerCase()) || b.vehicleInfo.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const counts = {
    ALL:      allBookings.length,
    PENDING:  allBookings.filter(b => b.status === 'PENDING').length,
    APPROVED: allBookings.filter(b => b.status === 'APPROVED').length,
    DONE:     allBookings.filter(b => b.status === 'DONE').length,
    REJECTED: allBookings.filter(b => b.status === 'REJECTED').length,
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '6px' }}>Riwayat Booking</h1>
        <p style={{ color: 'var(--text-muted)' }}>Semua riwayat pemesanan layanan cuci mobil Anda.</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {(['ALL', 'PENDING', 'APPROVED', 'DONE', 'REJECTED'] as const).map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.82rem',
              fontWeight: 600,
              border: '1px solid',
              cursor: 'pointer',
              transition: 'var(--transition-fast)',
              borderColor: filter === s ? 'var(--primary)' : 'var(--glass-border)',
              background: filter === s ? 'rgba(59,130,246,0.12)' : 'transparent',
              color: filter === s ? 'var(--primary)' : 'var(--text-muted)',
            }}
          >
            {s === 'ALL' ? 'Semua' : STATUS_LABEL[s]} ({counts[s]})
          </button>
        ))}
      </div>

      {/* Search */}
      <div style={{ position: 'relative', maxWidth: '400px' }}>
        <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input
          type="text"
          className="form-input"
          placeholder="Cari layanan atau kendaraan..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ paddingLeft: '40px' }}
        />
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="empty-state glass-card no-hover">
          <Calendar size={40} style={{ opacity: 0.3 }} />
          <p>Tidak ada booking yang ditemukan.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map(b => {
            const svc = getService(b.serviceId);
            return (
              <div
                key={b.id}
                className="glass-card flex justify-between items-start"
                style={{ borderLeft: `3px solid ${b.status === 'PENDING' ? 'var(--warning)' : b.status === 'APPROVED' ? 'var(--info)' : b.status === 'DONE' ? 'var(--success)' : 'var(--danger)'}` }}
              >
                <div className="flex items-start gap-4">
                  <div style={{ padding: '12px', background: 'rgba(59,130,246,0.08)', borderRadius: 'var(--radius-md)', color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }}>
                    <Calendar size={22} />
                  </div>
                  <div>
                    <h4 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '6px' }}>{svc?.name ?? '—'}</h4>
                    <div className="flex flex-col gap-1" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      <span className="flex items-center gap-2"><Calendar size={13} /> {b.date}</span>
                      <span className="flex items-center gap-2"><Clock size={13} /> {b.time} WIB</span>
                      <span className="flex items-center gap-2"><Car size={13} /> {b.vehicleInfo}</span>
                      {b.notes && (
                        <span style={{ fontStyle: 'italic', marginTop: '4px', color: 'rgba(156,163,175,0.7)' }}>
                          &ldquo;{b.notes}&rdquo;
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3" style={{ flexShrink: 0, marginLeft: '16px' }}>
                  <span className={`badge badge-${b.status.toLowerCase()}`}>{STATUS_LABEL[b.status]}</span>
                  <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>
                    Rp {(svc?.price ?? 0).toLocaleString('id-ID')}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {new Date(b.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
