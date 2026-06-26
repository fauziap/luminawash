'use client';

import { useState, useEffect } from 'react';
import { storage, User, Booking } from '@/lib/storage';
import { Search, UserCircle, Calendar, ShieldCheck, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ToastProvider';

export default function AdminUsers() {
  const { showToast } = useToast();
  const [users,    setUsers]    = useState<User[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [search,   setSearch]   = useState('');

  useEffect(() => {
    setUsers(storage.getUsers());
    setBookings(storage.getBookings());
  }, []);

  const filtered = users
    .filter(u => u.role === 'USER')
    .filter(u =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    );

  const getUserBookings = (userId: string) => bookings.filter(b => b.userId === userId);

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Hapus akun "${name}"? Semua data booking-nya juga akan dihapus.`)) return;
    const updatedUsers    = users.filter(u => u.id !== id);
    const updatedBookings = bookings.filter(b => b.userId !== id);
    storage.saveUsers(updatedUsers);
    storage.saveBookings(updatedBookings);
    setUsers(updatedUsers);
    setBookings(updatedBookings);
    showToast(`Akun ${name} berhasil dihapus.`, 'info');
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '6px' }}>Kelola Pengguna</h1>
        <p style={{ color: 'var(--text-muted)' }}>Daftar semua customer yang terdaftar di sistem.</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-5">
        {[
          { label: 'Total Customer', value: users.filter(u => u.role === 'USER').length, color: 'primary' },
          { label: 'Total Admin',    value: users.filter(u => u.role === 'ADMIN').length, color: 'warning' },
          { label: 'Total Booking',  value: bookings.length, color: 'success' },
        ].map(({ label, value, color }) => (
          <div key={label} className={`stat-card ${color}`}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ position: 'relative', maxWidth: '400px' }}>
        <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input type="text" className="form-input" placeholder="Cari nama atau email..."
          value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '40px' }} />
      </div>

      {/* Users Table */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Pengguna</th>
              <th>Nomor HP</th>
              <th>Bergabung</th>
              <th>Total Booking</th>
              <th>Booking Selesai</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  Tidak ada pengguna ditemukan.
                </td>
              </tr>
            ) : filtered.map(user => {
              const userBkgs = getUserBookings(user.id);
              const doneBkgs = userBkgs.filter(b => b.status === 'DONE').length;
              return (
                <tr key={user.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar" style={{ width: '36px', height: '36px', fontSize: '0.85rem', flexShrink: 0 }}>
                        {user.name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>{user.name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                    {user.phone || '—'}
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {new Date(user.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td style={{ fontWeight: 600 }}>{userBkgs.length}</td>
                  <td>
                    <span style={{ color: 'var(--success)', fontWeight: 700 }}>{doneBkgs}</span>
                  </td>
                  <td>
                    <button onClick={() => handleDelete(user.id, user.name)} className="btn btn-sm btn-danger">
                      <Trash2 size={13} /> Hapus
                    </button>
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
