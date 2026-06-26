'use client';

import { useState, useEffect } from 'react';
import { storage, Booking, Service, User, BookingStatus } from '@/lib/storage';
import { CheckCircle2, XCircle, Clock, Search, Filter } from 'lucide-react';
import { useToast } from '@/components/ToastProvider';

const STATUS_LABEL: Record<BookingStatus, string> = {
  PENDING: 'Menunggu', APPROVED: 'Disetujui', DONE: 'Selesai', REJECTED: 'Ditolak',
};

export default function AdminBookings() {
  const { showToast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [users,    setUsers]    = useState<User[]>([]);
  const [filter,   setFilter]   = useState<string>('ALL');
  const [search,   setSearch]   = useState('');

  const loadData = () => {
    const bkgs = storage.getBookings().sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setBookings(bkgs);
    setServices(storage.getServices());
    setUsers(storage.getUsers());
  };

  useEffect(loadData, []);

  const updateStatus = (id: string, status: BookingStatus, label: string) => {
    const updated = bookings.map(b => b.id === id ? { ...b, status } : b);
    storage.saveBookings(updated);
    setBookings(updated);
    showToast(`Booking berhasil ${label}.`, 'success');
  };

  const getService  = (id: string) => services.find(s => s.id === id);
  const getUserName = (id: string) => users.find(u => u.id === id)?.name ?? id;

  const filtered = bookings.filter(b => {
    const matchStatus = filter === 'ALL' || b.status === filter;
    const svcName = getService(b.serviceId)?.name?.toLowerCase() ?? '';
    const uName   = getUserName(b.userId).toLowerCase();
    const q       = search.toLowerCase();
    return matchStatus && (svcName.includes(q) || uName.includes(q) || b.vehicleInfo.toLowerCase().includes(q));
  });

  const counts: Record<string, number> = { ALL: bookings.length };
  (['PENDING', 'APPROVED', 'DONE', 'REJECTED'] as BookingStatus[]).forEach(s => {
    counts[s] = bookings.filter(b => b.status === s).length;
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '6px' }}>Manajemen Booking</h1>
        <p style={{ color: 'var(--text-muted)' }}>Kelola dan ubah status seluruh pesanan masuk.</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {(['ALL', 'PENDING', 'APPROVED', 'DONE', 'REJECTED'] as const).map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{
            padding: '8px 16px', borderRadius: 'var(--radius-full)', fontSize: '0.82rem', fontWeight: 600,
            border: '1px solid', cursor: 'pointer', transition: 'var(--transition-fast)',
            borderColor: filter === s ? 'var(--primary)' : 'var(--glass-border)',
            background:  filter === s ? 'rgba(59,130,246,0.12)' : 'transparent',
            color:       filter === s ? 'var(--primary)' : 'var(--text-muted)',
          }}>
            {s === 'ALL' ? 'Semua' : STATUS_LABEL[s as BookingStatus]} ({counts[s]})
          </button>
        ))}
      </div>

      {/* Search */}
      <div style={{ position: 'relative', maxWidth: '400px' }}>
        <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input type="text" className="form-input" placeholder="Cari nama, layanan, kendaraan..."
          value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '40px' }} />
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Pelanggan</th>
              <th>Layanan</th>
              <th>Tanggal &amp; Jam</th>
              <th>Kendaraan</th>
              <th>Harga</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  Tidak ada data booking.
                </td>
              </tr>
            ) : filtered.map(b => {
              const svc = getService(b.serviceId);
              return (
                <tr key={b.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{getUserName(b.userId)}</div>
                    {b.notes && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px', fontStyle: 'italic' }}>
                      &ldquo;{b.notes}&rdquo;
                    </div>}
                  </td>
                  <td>{svc?.name ?? '—'}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    <div>{b.date}</div>
                    <div>{b.time} WIB</div>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{b.vehicleInfo}</td>
                  <td style={{ fontWeight: 700 }}>Rp {(svc?.price ?? 0).toLocaleString('id-ID')}</td>
                  <td><span className={`badge badge-${b.status.toLowerCase()}`}>{STATUS_LABEL[b.status]}</span></td>
                  <td>
                    <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
                      {b.status === 'PENDING' && (
                        <>
                          <button onClick={() => updateStatus(b.id, 'APPROVED', 'disetujui')}
                            className="btn btn-success btn-sm">
                            <CheckCircle2 size={13} /> Setujui
                          </button>
                          <button onClick={() => updateStatus(b.id, 'REJECTED', 'ditolak')}
                            className="btn btn-danger btn-sm">
                            <XCircle size={13} /> Tolak
                          </button>
                        </>
                      )}
                      {b.status === 'APPROVED' && (
                        <button onClick={() => updateStatus(b.id, 'DONE', 'ditandai selesai')}
                          className="btn btn-sm" style={{ background: 'rgba(59,130,246,0.1)', color: 'var(--primary)', border: '1px solid rgba(59,130,246,0.3)' }}>
                          <Clock size={13} /> Selesai
                        </button>
                      )}
                      {(b.status === 'DONE' || b.status === 'REJECTED') && (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>—</span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
