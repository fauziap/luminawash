'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { storage, Service, Booking } from '@/lib/storage';
import { CheckCircle2, Clock, Car, FileText, ChevronRight, ChevronLeft, MapPin, QrCode, Wallet, Calendar } from 'lucide-react';
import { useToast } from '@/components/ToastProvider';

type Step = 1 | 2 | 3;

const BAYS = [
  { id: 'bay-1', name: 'Ruang 1' },
  { id: 'bay-2', name: 'Ruang 2' },
  { id: 'bay-3', name: 'Ruang 3' },
];

const TIMES = ['08:00','09:00','10:00','11:00','13:00','14:00','15:00','16:00'];

export default function BookingPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [services, setServices]     = useState<Service[]>([]);
  const [step, setStep]             = useState<Step>(1);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess]       = useState(false);

  // Form states
  const [serviceId,   setServiceId]   = useState('');
  const [date,        setDate]        = useState('');
  const [time,        setTime]        = useState('');
  const [bayId,       setBayId]       = useState('');
  const [vehicleInfo, setVehicleInfo] = useState('');
  const [notes,       setNotes]       = useState('');
  const [paymentMethod, setPaymentMethod] = useState('QRIS');

  useEffect(() => {
    storage.cleanExpiredBookings();
    setServices(storage.getServices().filter(s => s.isActive));
  }, []);

  const selectedService = services.find(s => s.id === serviceId);
  const todayStr = new Date().toISOString().split('T')[0];

  const checkAvailability = (checkBay: string) => {
    if (!date || !time) return true;
    const taken = storage.getBookings().find(b => 
      b.bayId === checkBay && 
      b.date === date && 
      b.time === time && 
      b.status !== 'CANCELLED' && 
      b.status !== 'REJECTED' &&
      b.paymentStatus !== 'CANCELLED'
    );
    return !taken;
  };

  const handleNextStep2 = () => {
    if (!date || !time || !bayId || !vehicleInfo.trim()) {
      showToast('Lengkapi semua data jadwal, ruangan, dan kendaraan.', 'error');
      return;
    }
    if (!checkAvailability(bayId)) {
      showToast('Ruangan pada jam tersebut sudah dibooking. Pilih ruang/jam lain.', 'error');
      return;
    }
    setStep(3);
  };

  const handleSubmit = () => {
    if (!checkAvailability(bayId)) {
      showToast('Maaf, ruangan baru saja diambil orang lain. Silakan ubah pilihan.', 'error');
      setStep(2);
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      const user = storage.getCurrentUser();
      if (!user) return;

      const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes

      const newBooking: Booking = {
        id: `b${Date.now()}`,
        userId: user.id,
        serviceId,
        bayId,
        date,
        time,
        vehicleInfo: vehicleInfo.trim(),
        notes: notes.trim(),
        status: 'PENDING',
        paymentMethod,
        paymentStatus: 'UNPAID',
        expiresAt,
        createdAt: new Date().toISOString(),
      };

      storage.saveBookings([...storage.getBookings(), newBooking]);
      setSubmitting(false);
      setSuccess(true);
      showToast('Booking berhasil! Harap selesaikan pembayaran.', 'success');
      setTimeout(() => router.push('/dashboard/history'), 2200);
    }, 900);
  };

  if (success) {
    return (
      <div className="glass-card no-hover flex flex-col items-center justify-center text-center animate-fade-in"
        style={{ padding: '72px 24px', minHeight: '60vh' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16,185,129,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
          <CheckCircle2 size={44} color="var(--success)" />
        </div>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '12px' }}>Booking Tersimpan! 🎉</h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '380px', lineHeight: 1.7 }}>
          Anda memiliki waktu 10 menit untuk menyelesaikan pembayaran agar slot tidak dibatalkan otomatis.
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '8px' }}>
          Mengarahkan ke riwayat booking...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '6px' }}>Buat Booking Baru</h1>
        <p style={{ color: 'var(--text-muted)' }}>Pesan layanan cuci mobil sesuai jadwal Anda.</p>
      </div>

      {/* Step Indicators */}
      <div className="flex items-center gap-0">
        {(['Pilih Layanan', 'Jadwal & Ruang', 'Pembayaran & Konfirmasi'] as const).map((label, i) => {
          const s = (i + 1) as Step;
          const done = step > s;
          const active = step === s;
          return (
            <div key={label} className="flex items-center" style={{ flex: 1 }}>
              <div className="flex items-center gap-2" style={{ flex: '0 0 auto' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.85rem', fontWeight: 700, flexShrink: 0,
                  background: done ? 'var(--success)' : active ? 'linear-gradient(135deg,var(--primary),var(--accent))' : 'rgba(255,255,255,0.08)',
                  color: done || active ? 'white' : 'var(--text-muted)',
                  transition: 'all 0.3s',
                }}>
                  {done ? '✓' : s}
                </div>
                <span className="mobile-hide" style={{ fontSize: '0.85rem', fontWeight: active ? 600 : 400, color: active ? 'var(--text-main)' : 'var(--text-muted)' }}>
                  {label}
                </span>
              </div>
              {i < 2 && <div style={{ flex: 1, height: '1px', background: done ? 'var(--success)' : 'var(--glass-border)', margin: '0 12px', transition: 'background 0.3s' }} />}
            </div>
          );
        })}
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <div className="flex flex-col gap-4 animate-fade-in">
          <h2 style={{ fontSize: '1.2rem' }}>Pilih Paket Layanan</h2>
          <div className="flex flex-col gap-3">
            {services.map(svc => (
              <div key={svc.id} onClick={() => setServiceId(svc.id)}
                style={{ padding: '20px 24px', borderRadius: 'var(--radius-lg)', border: `2px solid ${serviceId === svc.id ? 'var(--primary)' : 'var(--glass-border)'}`, background: serviceId === svc.id ? 'rgba(59,130,246,0.08)' : 'rgba(0,0,0,0.2)', cursor: 'pointer', transition: 'var(--transition-normal)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 style={{ fontSize: '1.1rem' }}>{svc.name}</h3>
                    <div className="flex items-center gap-1" style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}><Clock size={13} /> {svc.duration} menit</div>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '10px' }}>{svc.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {svc.features.slice(0, 4).map(f => <span key={f} style={{ fontSize: '0.75rem', padding: '3px 10px', borderRadius: 'var(--radius-full)', background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)' }}>{f}</span>)}
                    {svc.features.length > 4 && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>+{svc.features.length - 4} lagi</span>}
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: serviceId === svc.id ? 'var(--primary)' : 'var(--text-main)' }}>Rp {svc.price.toLocaleString('id-ID')}</div>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: `2px solid ${serviceId === svc.id ? 'var(--primary)' : 'var(--glass-border)'}`, background: serviceId === svc.id ? 'var(--primary)' : 'transparent', margin: '8px auto 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {serviceId === svc.id && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'white' }} />}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="btn btn-primary" style={{ alignSelf: 'flex-end', padding: '12px 32px' }} onClick={() => { if (!serviceId) { showToast('Pilih layanan.', 'error'); return; } setStep(2); }}>
            Lanjut <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div className="flex flex-col gap-6 animate-fade-in">
          <h2 style={{ fontSize: '1.2rem' }}>Jadwal, Ruangan & Kendaraan</h2>
          
          <div className="grid grid-cols-3 gap-5">
            <div className="form-group">
              <label className="form-label" htmlFor="book-date">Tanggal</label>
              <input id="book-date" type="date" className="form-input" value={date} min={todayStr} onChange={e => setDate(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="book-time">Waktu</label>
              <select id="book-time" className="form-input" value={time} onChange={e => setTime(e.target.value)} required>
                <option value="">-- Jam --</option>
                {TIMES.map(t => <option key={t} value={t}>{t} WIB</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="book-bay">Ruang Cuci</label>
              <select id="book-bay" className="form-input" value={bayId} onChange={e => setBayId(e.target.value)} required>
                <option value="">-- Pilih Ruang --</option>
                {BAYS.map(b => {
                  const available = checkAvailability(b.id);
                  return (
                    <option key={b.id} value={b.id} disabled={!available}>
                      {b.name} {!available ? '(Penuh)' : ''}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Kendaraan</label>
            <input type="text" className="form-input" placeholder="Contoh: Honda HRV 2021 - B 1234 XYZ" value={vehicleInfo} onChange={e => setVehicleInfo(e.target.value)} required />
          </div>

          <div className="form-group">
            <label className="form-label">Catatan Tambahan (opsional)</label>
            <textarea className="form-input" rows={2} value={notes} onChange={e => setNotes(e.target.value)} />
          </div>

          <div className="flex justify-between">
            <button className="btn btn-outline" onClick={() => setStep(1)}><ChevronLeft size={18} /> Kembali</button>
            <button className="btn btn-primary" onClick={handleNextStep2}>Lanjut <ChevronRight size={18} /></button>
          </div>
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && selectedService && (
        <div className="flex flex-col gap-6 animate-fade-in">
          <h2 style={{ fontSize: '1.2rem' }}>Pembayaran & Konfirmasi</h2>

          <div className="grid grid-cols-2 gap-6">
            <div className="glass-card no-hover flex flex-col gap-4">
              <h3 style={{ fontSize: '1rem' }}>Metode Pembayaran</h3>
              <div className="flex flex-col gap-3">
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', border: `1px solid var(--primary)`, borderRadius: 'var(--radius-md)', background: 'rgba(59,130,246,0.05)' }}>
                  <QrCode size={20} color="var(--primary)" />
                  <span style={{ fontWeight: 600 }}>Pembayaran Otomatis Menggunakan QRIS</span>
                </label>
              </div>
              {paymentMethod === 'QRIS' && (
                <div style={{ padding: '12px', background: 'rgba(245,158,11,0.1)', color: 'var(--warning)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
                  Anda akan diberikan waktu <strong>10 menit</strong> untuk memindai kode QR setelah menekan tombol Konfirmasi.
                </div>
              )}
            </div>

            <div className="glass-card no-hover flex flex-col gap-4">
              <h3 style={{ color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.78rem' }}>Ringkasan Booking</h3>
              {[
                { icon: FileText, label: 'Layanan', value: selectedService.name },
                { icon: MapPin, label: 'Ruang', value: BAYS.find(b=>b.id===bayId)?.name },
                { icon: Calendar, label: 'Waktu', value: `${date} - ${time} WIB` },
                { icon: Car, label: 'Kendaraan', value: vehicleInfo },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex justify-between items-start" style={{ paddingBottom: '8px', borderBottom: '1px solid var(--glass-border)' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}><Icon size={14} /> {label}</span>
                  <span style={{ fontWeight: 600, textAlign: 'right', fontSize: '0.9rem' }}>{value}</span>
                </div>
              ))}
              <div className="flex justify-between items-center" style={{ paddingTop: '8px' }}>
                <span style={{ fontWeight: 700, fontSize: '1rem' }}>Total</span>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--primary)' }}>Rp {selectedService.price.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between" style={{ marginTop: '12px' }}>
            <button className="btn btn-outline" onClick={() => setStep(2)}><ChevronLeft size={18} /> Kembali</button>
            <button className="btn btn-primary" style={{ padding: '14px 36px' }} onClick={handleSubmit} disabled={submitting}>
              {submitting ? <span className="spinner" /> : <><CheckCircle2 size={18} /> Buat Pesanan</>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
