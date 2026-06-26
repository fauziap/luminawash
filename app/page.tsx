'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Sparkles, Clock, ShieldCheck, Star, ArrowRight, CheckCircle2, CarFront, Zap, MapPin } from 'lucide-react';
import { initialServices } from '@/lib/storage';

const stats = [
  { value: '5.000+', label: 'Mobil Dicuci', icon: CarFront },
  { value: '4.9 ★', label: 'Rating Kepuasan', icon: Star },
  { value: '0 Complain', label: 'Lokasi Aktif', icon: MapPin },
  { value: '2 Tahun', label: 'Pengalaman', icon: Zap },
];

const testimonials = [
  {
    name: 'Riko Pratama',
    vehicle: 'Honda CRV',
    text: 'Layanan Full Detailing-nya luar biasa! Mobil saya jadi kinclong banget dan baunya wangi. Proses booking juga sangat mudah.',
    rating: 5,
  },
  {
    name: 'Sinta Wulandari',
    // vehicle: 'Toyota Calya',
    text: 'Sudah langganan di sini lebih dari setahun. Harga terjangkau, hasilnya selalu memuaskan. Sangat recommended!',
    rating: 5,
  },
  {
    name: 'Ferdi Hasan',
    vehicle: 'Mitsubishi Pajero',
    text: 'Booking via web sangat praktis, tinggal pilih jadwal dan datang. Teknisinya ramah dan profesional.',
    rating: 5,
  },
];

export default function Home() {
  return (
    <main>
      <Navbar />

      <div className="main-content">
        {/* ─── HERO ──────────────────────────────── */}
        <section
          className="container flex flex-col items-center justify-center text-center animate-fade-in"
          style={{ padding: '90px 24px 70px', gap: '28px' }}
        >
          <div
            className="badge"
            style={{
              background: 'rgba(139, 92, 246, 0.1)',
              color: 'var(--accent)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              padding: '8px 20px',
              fontSize: '0.85rem',
            }}
          >
            <Sparkles size={14} style={{ display: 'inline', marginRight: '6px' }} />
            Layanan Detailing &amp; Cuci Premium
          </div>

          <h1
            className="hero-title"
            style={{ fontSize: '4.2rem', maxWidth: '820px', lineHeight: 1.1, letterSpacing: '-0.03em' }}
          >
            Kembalikan Kilau Mobil Anda dengan{' '}
            <span className="text-gradient">Sempurna</span>
          </h1>

          <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', maxWidth: '580px', lineHeight: 1.8 }}>
            Booking layanan cuci mobil & detailing profesional secara online. Pilih jadwal, kami siap hadir.
          </p>

          <div className="flex items-center gap-4 hero-actions" style={{ marginTop: '8px' }}>
            <Link
              href="/register"
              className="btn btn-primary"
              style={{ padding: '16px 36px', fontSize: '1rem' }}
            >
              Mulai Booking Gratis <ArrowRight size={18} />
            </Link>
            <Link
              href="#services"
              className="btn btn-outline"
              style={{ padding: '16px 36px', fontSize: '1rem' }}
            >
              Lihat Layanan
            </Link>
          </div>

          {/* Trust badge row */}
          <div
            className="flex items-center gap-6 flex-wrap justify-center"
            style={{ marginTop: '12px', color: 'var(--text-muted)', fontSize: '0.875rem' }}
          >
            {['✓ Tanpa Antrian', '✓ Pembayaran Fleksibel', '✓ Garansi Kepuasan'].map(t => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </section>

        {/* ─── STATS ────────────────────────────── */}
        <section className="container" style={{ paddingBottom: '70px' }}>
          <div className="grid grid-cols-4 gap-6">
            {stats.map(({ value, label, icon: Icon }, i) => (
              <div
                key={label}
                className={`glass-card text-center animate-fade-in delay-${i + 1}`}
                style={{ padding: '28px 16px' }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.15))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                    color: 'var(--primary)',
                  }}
                >
                  <Icon size={22} />
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 700, fontFamily: 'var(--font-display)' }}>{value}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── FEATURES ────────────────────────── */}
        <section className="container grid grid-cols-3 gap-6" style={{ paddingBottom: '80px' }}>
          {[
            {
              icon: Clock,
              color: 'var(--primary)',
              bg: 'rgba(59,130,246,0.1)',
              title: 'Efisien & Tepat Waktu',
              desc: 'Booking online 24 jam. Tidak perlu antri — pilih slot waktu yang sesuai jadwal Anda.',
            },
            {
              icon: ShieldCheck,
              color: 'var(--accent)',
              bg: 'rgba(139,92,246,0.1)',
              title: 'Produk Premium',
              desc: 'Menggunakan bahan cuci & wax berkualitas tinggi yang aman untuk eksterior dan cat kendaraan.',
            },
            {
              icon: Star,
              color: 'var(--success)',
              bg: 'rgba(16,185,129,0.1)',
              title: 'Tim Profesional',
              desc: 'Teknisi berpengalaman dengan standar kebersihan tinggi di setiap pengerjaan.',
            },
          ].map(({ icon: Icon, color, bg, title, desc }) => (
            <div key={title} className="glass-card flex flex-col items-center text-center gap-4">
              <div style={{ padding: '18px', background: bg, borderRadius: '50%', color }}>
                <Icon size={30} />
              </div>
              <h3 style={{ fontSize: '1.2rem' }}>{title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.7 }}>{desc}</p>
            </div>
          ))}
        </section>

        {/* ─── SERVICES ────────────────────────── */}
        <section id="services" className="container flex flex-col gap-10" style={{ paddingBottom: '90px' }}>
          <div className="text-center flex flex-col gap-3">
            <h2 style={{ fontSize: '2.8rem' }}>
              Paket Layanan <span className="text-gradient">Kami</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
              Pilih paket yang paling sesuai dengan kebutuhan kendaraan Anda.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {initialServices.map((service, i) => (
              <div
                key={service.id}
                className={`glass-card flex flex-col gap-5 justify-between animate-fade-in delay-${i + 1}`}
                style={{
                  borderTop: i === 1 ? '3px solid var(--primary)' : '3px solid transparent',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {i === 1 && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                      color: 'white',
                      padding: '3px 10px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                    }}
                  >
                    POPULER
                  </div>
                )}
                <div>
                  <h3 style={{ fontSize: '1.4rem', marginBottom: '6px' }}>{service.name}</h3>
                  <div style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '12px', fontFamily: 'var(--font-display)' }}>
                    Rp {service.price.toLocaleString('id-ID')}
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '16px' }}>
                    {service.description}
                  </p>
                  <ul className="flex flex-col gap-2">
                    {service.features.map(f => (
                      <li key={f} className="flex items-center gap-2" style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                        <CheckCircle2 size={14} color="var(--success)" style={{ flexShrink: 0 }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col gap-3">
                  <div
                    className="flex items-center gap-2"
                    style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}
                  >
                    <Clock size={14} />
                    Estimasi {service.duration} menit
                  </div>
                  <Link href="/login" className={`btn ${i === 1 ? 'btn-primary' : 'btn-outline'} w-full`}>
                    Pesan Sekarang
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── TESTIMONIALS ─────────────────────── */}
        <section className="container flex flex-col gap-10" style={{ paddingBottom: '100px' }}>
          <div className="text-center flex flex-col gap-3">
            <h2 style={{ fontSize: '2.8rem' }}>
              Kata <span className="text-gradient">Pelanggan</span>
            </h2>
            <p style={{ color: 'var(--text-muted)' }}>Kepercayaan pelanggan adalah prioritas kami.</p>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className={`glass-card flex flex-col gap-4 animate-fade-in delay-${i + 1}`}>
                <div className="flex gap-1">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={16} fill="var(--warning)" color="var(--warning)" />
                  ))}
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.7, fontStyle: 'italic' }}>
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3" style={{ marginTop: 'auto' }}>
                  <div className="avatar" style={{ width: '40px', height: '40px', fontSize: '0.9rem' }}>
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>{t.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t.vehicle}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── CTA BANNER ─────────────────────── */}
        <section className="container" style={{ paddingBottom: '80px' }}>
          <div
            className="glass-card text-center flex flex-col items-center gap-6 no-hover"
            style={{
              background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.15))',
              border: '1px solid rgba(139,92,246,0.25)',
              padding: '60px 32px',
            }}
          >
            <h2 style={{ fontSize: '2.2rem', maxWidth: '600px' }}>
              Siap Membuat Mobil Anda <span className="text-gradient">Kinclong</span> Hari Ini?
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '460px' }}>
              Daftar gratis sekarang dan dapatkan kemudahan booking layanan cuci mobil premium kapan saja.
            </p>
            <Link href="/register" className="btn btn-primary" style={{ padding: '16px 40px', fontSize: '1rem' }}>
              Daftar & Booking Sekarang <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
