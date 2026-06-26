'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { storage, Service, Booking } from '@/lib/storage';
import { CheckCircle2, Clock, Car, FileText, ChevronRight, ChevronLeft, Calendar } from 'lucide-react';
import { useToast } from '@/components/ToastProvider';

type Step = 1 | 2 | 3;

export default function BookingPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [services, setServices]     = useState<Service[]>([]);
  const [step, setStep]             = useState<Step>(1);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess]       = useState(false);

  const [serviceId,   setServiceId]   = useState('');
  const [date,        setDate]        = useState('');
  const [time,        setTime]        = useState('');
  const [vehicleInfo, setVehicleInfo] = useState('');
  const [notes,       setNotes]       = useState('');

  useEffect(() => {
    setServices(storage.getServices().filter(s => s.isActive));
  }, []);

  const selectedService = services.find(s => s.id === serviceId);

  const todayStr = new Date().toISOString().split('T')[0];

  const TIMES = ['08:00','09:00','10:00','11:00','13:00','14:00','15:00','16:00'];

  const handleSubmit = () => {
    if (!serviceId || !date || !time || !vehicleInfo.trim()) {
      showToast('Harap lengkapi semua data booking.', 'error');
      return;
    }
    setSubmitting(true);

    setTimeout(() => {
      const user = storage.getCurrentUser();
      if (!user) return;

      const newBooking: Booking = {
        id: `b${Date.now()}`,
        userId: user.id,
        serviceId,
        date,
        time,
        vehicleInfo: vehicleInfo.trim(),
        notes: notes.trim(),
        status: 'PENDING',
        createdAt: new Date().toISOString(),
      };

      storage.saveBookings([...storage.getBookings(), newBooking]);
      setSubmitting(false);
      setSuccess(true);
      showToast('Booking berhasil! Menunggu konfirmasi admin.', 'success');
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
        <h2 style={{ fontSize: '1.8rem', marginBottom: '12px' }}>Booking Berhasil! 🎉</h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '380px', lineHeight: 1.7 }}>
          Pesanan Anda telah kami terima. Admin akan segera mengkonfirmasi jadwal Anda.
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '8px' }}>
          Mengarahkan ke riwayat booking...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '6px' }}>Buat Booking Baru</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Pesan layanan cuci mobil sesuai jadwal Anda.
        </p>
      </div>

      {/* Step Indicators */}
      <div className="flex items-center gap-0">
        {(['Pilih Layanan', 'Jadwal & Kendaraan', 'Konfirmasi'] as const).map((label, i) => {
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
                <span style={{ fontSize: '0.85rem', fontWeight: active ? 600 : 400, color: active ? 'var(--text-main)' : 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                  {label}
                </span>
              </div>
              {i < 2 && <div style={{ flex: 1, height: '1px', background: done ? 'var(--success)' : 'var(--glass-border)', margin: '0 12px', transition: 'background 0.3s' }} />}
            </div>
          );
        })}
      </div>

      {/* Step 1 — Choose Service */}
      {step === 1 && (
        <div className="flex flex-col gap-4 animate-fade-in">
          <h2 style={{ fontSize: '1.2rem' }}>Pilih Paket Layanan</h2>
          <div className="flex flex-col gap-3">
            {services.map(svc => (
              <div
                key={svc.id}
                onClick={() => setServiceId(svc.id)}
                style={{
                  padding: '20px 24px',
                  borderRadius: 'var(--radius-lg)',
                  border: `2px solid ${serviceId === svc.id ? 'var(--primary)' : 'var(--glass-border)'}`,
                  background: serviceId === svc.id ? 'rgba(59,130,246,0.08)' : 'rgba(0,0,0,0.2)',
                  cursor: 'pointer',
                  transition: 'var(--transition-normal)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '16px',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 style={{ fontSize: '1.1rem' }}>{svc.name}</h3>
                    <div className="flex items-center gap-1" style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                      <Clock size={13} /> {svc.duration} menit
                    </div>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '10px' }}>{svc.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {svc.features.slice(0, 4).map(f => (
                      <span key={f} style={{ fontSize: '0.75rem', padding: '3px 10px', borderRadius: 'var(--radius-full)', background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)' }}>
                        {f}
                      </span>
                    ))}
                    {svc.features.length > 4 && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>+{svc.features.length - 4} lagi</span>
                    )}
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: serviceId === svc.id ? 'var(--primary)' : 'var(--text-main)' }}>
                    Rp {svc.price.toLocaleString('id-ID')}
                  </div>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: `2px solid ${serviceId === svc.id ? 'var(--primary)' : 'var(--glass-border)'}`,
                    background: serviceId === svc.id ? 'var(--primary)' : 'transparent', margin: '8px auto 0', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                    {serviceId === svc.id && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'white' }} />}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="btn btn-primary" style={{ alignSelf: 'flex-end', padding: '12px 32px' }}
            onClick={() => { if (!serviceId) { showToast('Pilih layanan terlebih dahulu.', 'error'); return; } setStep(2); }}
          >
            Lanjut <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* Step 2 — Date, Time, Vehicle */}
      {step === 2 && (
        <div className="flex flex-col gap-6 animate-fade-in">
          <h2 style={{ fontSize: '1.2rem' }}>Atur Jadwal &amp; Kendaraan</h2>

          <div className="grid grid-cols-2 gap-5">
            <div className="form-group">
              <label className="form-label" htmlFor="book-date">Tanggal Booking</label>
              <input id="book-date" type="date" className="form-input" value={date} min={todayStr}
                onChange={e => setDate(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="book-time">Pilih Waktu</label>
              <select id="book-time" className="form-input" value={time} onChange={e => setTime(e.target.value)} required>
                <option value="">-- Pilih Slot --</option>
                {TIMES.map(t => <option key={t} value={t}>{t} WIB</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="book-vehicle">Informasi Kendaraan</label>
            <input id="book-vehicle" type="text" className="form-input"
              placeholder="Contoh: Honda HRV 2021 Hitam — B 1234 XYZ"
              value={vehicleInfo} onChange={e => setVehicleInfo(e.target.value)} required />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="book-notes">Catatan Tambahan (opsional)</label>
            <textarea id="book-notes" className="form-input" rows={3}
              placeholder="Contoh: Bagian bumper depan ada noda membandel..."
              value={notes} onChange={e => setNotes(e.target.value)} />
          </div>

          <div className="flex justify-between">
            <button className="btn btn-outline" onClick={() => setStep(1)}>
              <ChevronLeft size={18} /> Kembali
            </button>
            <button className="btn btn-primary" style={{ padding: '12px 32px' }}
              onClick={() => {
                if (!date || !time || !vehicleInfo.trim()) { showToast('Lengkapi semua bidang yang wajib.', 'error'); return; }
                setStep(3);
              }}
            >
              Lanjut <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Step 3 — Review & Confirm */}
      {step === 3 && selectedService && (
        <div className="flex flex-col gap-6 animate-fade-in">
          <h2 style={{ fontSize: '1.2rem' }}>Konfirmasi Pesanan</h2>

          <div className="glass-card no-hover flex flex-col gap-5">
            <h3 style={{ color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.78rem' }}>
              Ringkasan Booking
            </h3>

            {[
              { icon: FileText, label: 'Layanan',       value: selectedService.name },
              { icon: Clock,    label: 'Harga',          value: `Rp ${selectedService.price.toLocaleString('id-ID')}` },
              { icon: Clock,    label: 'Estimasi Durasi', value: `${selectedService.duration} menit` },
              { icon: Calendar, label: 'Tanggal',        value: date },
              { icon: Clock,    label: 'Jam',             value: `${time} WIB` },
              { icon: Car,      label: 'Kendaraan',       value: vehicleInfo },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex justify-between items-start" style={{ paddingBottom: '12px', borderBottom: '1px solid var(--glass-border)' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Icon size={14} /> {label}
                </span>
                <span style={{ fontWeight: 600, textAlign: 'right', maxWidth: '60%' }}>{value}</span>
              </div>
            ))}

            {notes && (
              <div className="flex justify-between items-start" style={{ paddingBottom: '12px', borderBottom: '1px solid var(--glass-border)' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Catatan</span>
                <span style={{ fontWeight: 500, textAlign: 'right', maxWidth: '60%', fontSize: '0.9rem', color: 'var(--text-muted)' }}>{notes}</span>
              </div>
            )}

            <div className="flex justify-between items-center" style={{ paddingTop: '4px' }}>
              <span style={{ fontWeight: 700, fontSize: '1rem' }}>Total Pembayaran</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-display)', background: 'linear-gradient(135deg,var(--primary),var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Rp {selectedService.price.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          <div className="flex justify-between">
            <button className="btn btn-outline" onClick={() => setStep(2)}>
              <ChevronLeft size={18} /> Kembali
            </button>
            <button className="btn btn-primary" style={{ padding: '14px 36px' }} onClick={handleSubmit} disabled={submitting}>
              {submitting ? <span className="spinner" /> : <><CheckCircle2 size={18} /> Konfirmasi Booking</>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

