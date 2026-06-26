'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Droplets, LogOut, User as UserIcon, Menu, X, LayoutDashboard, ShieldCheck } from 'lucide-react';
import { storage, User } from '@/lib/storage';

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setUser(storage.getCurrentUser());
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [pathname]);

  const handleLogout = () => {
    storage.setCurrentUser(null);
    setUser(null);
    setMenuOpen(false);
    router.push('/');
  };

  const dashLink = user?.role === 'ADMIN' ? '/admin' : '/dashboard';

  return (
    <nav
      className="navbar"
      style={{
        boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.3)' : 'none',
        transition: 'box-shadow 0.3s',
      }}
    >
      <div className="container flex justify-between items-center w-full">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2" style={{ gap: '10px' }}>
          <Droplets color="var(--primary)" size={30} />
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.4rem',
              fontWeight: 700,
              letterSpacing: '-0.02em',
            }}
          >
            Lumina<span className="text-gradient">Wash</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="flex items-center gap-4 nav-links mobile-hide">
          {!user ? (
            <>
              <Link href="/#services" style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                Layanan
              </Link>
              <Link href="/login" className="btn btn-outline btn-sm">
                Masuk
              </Link>
              <Link href="/register" className="btn btn-primary btn-sm">
                Daftar Gratis
              </Link>
            </>
          ) : (
            <>
              <Link
                href={dashLink}
                className="flex items-center gap-2"
                style={{ color: 'var(--text-muted)', fontSize: '0.95rem', gap: '6px' }}
              >
                {user.role === 'ADMIN' ? <ShieldCheck size={16} /> : <LayoutDashboard size={16} />}
                {user.role === 'ADMIN' ? 'Admin Panel' : 'Dashboard'}
              </Link>
              <div
                className="flex items-center gap-3"
                style={{
                  padding: '6px 14px 6px 8px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--glass-border)',
                  background: 'rgba(255,255,255,0.04)',
                  gap: '10px',
                }}
              >
                <div className="avatar" style={{ width: '32px', height: '32px', fontSize: '0.8rem' }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{user.name.split(' ')[0]}</span>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}
                >
                  <LogOut size={16} />
                </button>
              </div>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="flex items-center justify-center"
          style={{
            display: 'none',
            padding: '8px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--glass-border)',
            color: 'var(--text-main)',
          }}
          id="mobile-menu-btn"
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div
          className="animate-fade-in-down"
          style={{
            position: 'absolute',
            top: '72px',
            left: 0,
            right: 0,
            background: 'rgba(10, 15, 30, 0.97)',
            backdropFilter: 'blur(16px)',
            borderBottom: '1px solid var(--glass-border)',
            padding: '16px 24px',
            zIndex: 99,
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {!user ? (
            <>
              <Link href="/#services" onClick={() => setMenuOpen(false)} style={{ color: 'var(--text-muted)' }}>
                Layanan
              </Link>
              <Link href="/login" className="btn btn-outline w-full" onClick={() => setMenuOpen(false)}>
                Masuk
              </Link>
              <Link href="/register" className="btn btn-primary w-full" onClick={() => setMenuOpen(false)}>
                Daftar Gratis
              </Link>
            </>
          ) : (
            <>
              <Link href={dashLink} onClick={() => setMenuOpen(false)} style={{ color: 'var(--text-muted)' }}>
                {user.role === 'ADMIN' ? 'Admin Panel' : 'Dashboard'}
              </Link>
              <button onClick={handleLogout} className="btn btn-danger w-full">
                <LogOut size={16} /> Keluar
              </button>
            </>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          #mobile-menu-btn { display: flex !important; }
          .nav-links { display: none !important; }
        }
      `}</style>
    </nav>
  );
}
