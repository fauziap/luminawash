'use client';

import { useState, useEffect } from 'react';
import { storage, Booking, Service } from '@/lib/storage';
import { Calendar, Clock, Car, Search, MapPin, QrCode, X, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/components/ToastProvider';

const STATUS_LABEL: Record<string, string> = {
  PENDING: 'Menunggu',
  APPROVED: 'Disetujui',
  DONE: 'Selesai',
  REJECTED: 'Ditolak',
  CANCELLED: 'Dibatalkan',
};

const BAYS = { 'bay-1': 'Ruang 1', 'bay-2': 'Ruang 2', 'bay-3': 'Ruang 3' };

function CountdownTimer({ expiresAt, onExpire }: { expiresAt: string, onExpire: () => void }) {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const calc = () => Math.max(0, new Date(expiresAt).getTime() - Date.now());
    setTimeLeft(calc());
    
    const t = setInterval(() => {
      const remaining = calc();
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(t);
        onExpire();
      }
    }, 1000);
    return () => clearInterval(t);
  }, [expiresAt]);

  if (timeLeft <= 0) return <span style={{ color: 'var(--danger)' }}>Waktu habis</span>;
  
  const m = Math.floor(timeLeft / 60000);
  const s = Math.floor((timeLeft % 60000) / 1000);
  return <span>{m}:{s < 10 ? '0' : ''}{s}</span>;
}

export default function HistoryPage() {
  const { showToast } = useToast();
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [services,    setServices]    = useState<Service[]>([]);
  const [filter,      setFilter]      = useState<string>('ALL');
  const [search,      setSearch]      = useState('');
  
  // Payment Modal
  const [payBooking, setPayBooking] = useState<Booking | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const user = storage.getCurrentUser();

  const loadData = () => {
    if (!user) return;
    storage.cleanExpiredBookings(); // auto-cancel expired ones
    const bkgs = storage
      .getBookings()
      .filter(b => b.userId === user.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setAllBookings(bkgs);
    setServices(storage.getServices());
  };

  useEffect(() => {
    loadData();
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
    REJECTED: allBookings.filter(b => b.status === 'REJECTED' || b.status === 'CANCELLED').length,
  };

  const handleConfirmPayment = () => {
    if (!payBooking) return;
    setIsProcessing(true);
    setTimeout(() => {
      const updatedList = storage.getBookings().map(b => 
        b.id === payBooking.id ? { ...b, paymentStatus: 'PAID' as const } : b
      );
      storage.saveBookings(updatedList);
      showToast('Pembayaran berhasil dikonfirmasi!', 'success');
      setPayBooking(null);
      setIsProcessing(false);
      loadData();
    }, 1500);
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
            {s === 'ALL' ? 'Semua' : s === 'REJECTED' ? 'Batal/Tolak' : STATUS_LABEL[s]} ({counts[s]})
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
            const isUnpaid = b.paymentStatus === 'UNPAID';
            const isCancelled = b.status === 'CANCELLED';
            
            return (
              <div
                key={b.id}
                className="glass-card flex justify-between items-start"
                style={{ borderLeft: `3px solid ${isCancelled ? 'var(--danger)' : b.status === 'PENDING' ? 'var(--warning)' : b.status === 'APPROVED' ? 'var(--info)' : b.status === 'DONE' ? 'var(--success)' : 'var(--danger)'}` }}
              >
                <div className="flex items-start gap-4">
                  <div style={{ padding: '12px', background: 'rgba(59,130,246,0.08)', borderRadius: 'var(--radius-md)', color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }}>
                    <Calendar size={22} />
                  </div>
                  <div>
                    <h4 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '6px' }}>{svc?.name ?? '—'}</h4>
                    <div className="flex flex-col gap-1" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      <span className="flex items-center gap-2"><Calendar size={13} /> {b.date} &nbsp; <Clock size={13} /> {b.time} WIB</span>
                      <span className="flex items-center gap-2"><MapPin size={13} /> {BAYS[b.bayId as keyof typeof BAYS] || 'Ruang'}</span>
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
                  <span className={`badge badge-${isCancelled ? 'danger' : b.status.toLowerCase()}`}>{STATUS_LABEL[b.status]}</span>
                  
                  {isUnpaid && b.expiresAt && !isCancelled && (
                    <div style={{ fontSize: '0.75rem', padding: '4px 10px', background: 'rgba(245,158,11,0.1)', color: 'var(--warning)', borderRadius: 'var(--radius-full)', fontWeight: 600 }}>
                      Sisa Waktu:{' '}
                      <CountdownTimer expiresAt={b.expiresAt} onExpire={loadData} />
                    </div>
                  )}

                  <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>
                    Rp {(svc?.price ?? 0).toLocaleString('id-ID')}
                  </span>

                  {isUnpaid && !isCancelled && b.paymentMethod === 'QRIS' && (
                    <button className="btn btn-primary btn-sm" onClick={() => setPayBooking(b)}>
                      Bayar Sekarang
                    </button>
                  )}
                  {b.paymentStatus === 'PAID' && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 700 }}>✓ SUDAH DIBAYAR</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Payment Modal */}
      {payBooking && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && !isProcessing && setPayBooking(null)}>
          <div className="modal" style={{ maxWidth: '380px', textAlign: 'center' }}>
            <div className="flex justify-between items-center mb-4">
              <h2 style={{ fontSize: '1.2rem' }}>Pembayaran QRIS</h2>
              {!isProcessing && (
                <button onClick={() => setPayBooking(null)} style={{ color: 'var(--text-muted)', display: 'flex' }}>
                  <X size={20} />
                </button>
              )}
            </div>

            <div style={{ padding: '24px', background: 'white', borderRadius: 'var(--radius-md)', marginBottom: '20px', display: 'inline-block' }}>
              <QrCode size={180} color="#000" />
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px' }}>
              Total Tagihan
            </p>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--primary)', marginBottom: '24px' }}>
              Rp {(getService(payBooking.serviceId)?.price ?? 0).toLocaleString('id-ID')}
            </div>

            <button className="btn btn-primary w-full" style={{ padding: '14px' }} onClick={handleConfirmPayment} disabled={isProcessing}>
              {isProcessing ? <span className="spinner" /> : <><CheckCircle2 size={18} /> Saya Sudah Bayar</>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
