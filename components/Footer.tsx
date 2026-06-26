import Link from 'next/link';
import { Droplets, Globe, Share2, Heart, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="grid" style={{ gridTemplateColumns: '2fr 1fr 1fr', gap: '48px' }}>
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center" style={{ gap: '10px' }}>
              <Droplets color="var(--primary)" size={28} />
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700 }}>
                Lumina<span className="text-gradient">Wash</span>
              </span>
            </Link>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7, maxWidth: '300px' }}>
              Platform booking cuci mobil premium. Kami memberikan layanan terbaik dengan teknisi profesional berpengalaman.
            </p>
            <div className="flex items-center gap-3 mt-2">
              {[Globe, Share2, Heart].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    border: '1px solid var(--glass-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-muted)',
                    transition: 'var(--transition-fast)',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--primary)';
                    (e.currentTarget as HTMLElement).style.color = 'var(--primary)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--glass-border)';
                    (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)';
                  }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-3">
            <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>
              Navigasi
            </h4>
            {[
              { label: 'Beranda', href: '/' },
              { label: 'Layanan', href: '/#services' },
              { label: 'Booking Sekarang', href: '/login' },
              { label: 'Masuk / Daftar', href: '/login' },
            ].map(link => (
              <Link
                key={link.label}
                href={link.href}
                style={{ color: 'var(--text-muted)', fontSize: '0.9rem', transition: 'color 0.2s' }}
                onMouseEnter={e => ((e.target as HTMLElement).style.color = 'var(--text-main)')}
                onMouseLeave={e => ((e.target as HTMLElement).style.color = 'var(--text-muted)')}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-3">
            <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>
              Kontak
            </h4>
            <div className="flex items-center gap-2" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              <MapPin size={15} style={{ flexShrink: 0, color: 'var(--primary)' }} />
              Jl. Merdeka No. 88, Yogyakarta
            </div>
            <div className="flex items-center gap-2" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              <Phone size={15} style={{ flexShrink: 0, color: 'var(--primary)' }} />
              +62 812-3456-7890
            </div>
            <div className="flex items-center gap-2" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              <Mail size={15} style={{ flexShrink: 0, color: 'var(--primary)' }} />
              hello@luminawash.id
            </div>
          </div>
        </div>

        <div
          className="flex justify-between items-center"
          style={{
            marginTop: '40px',
            paddingTop: '24px',
            borderTop: '1px solid var(--glass-border)',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            © 2026 LuminaWash. Hak cipta dilindungi.
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Dibuat dengan ❤️ untuk kemudahan Anda
          </p>
        </div>
      </div>
    </footer>
  );
}
