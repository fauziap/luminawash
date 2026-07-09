'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { storage } from '@/lib/storage';
import { Droplets, ArrowRight, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/components/ToastProvider';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const users = storage.getUsers();
      const user = users.find(u => u.email === email && u.password === password);

      if (user) {
        storage.setCurrentUser(user);
        showToast(`Selamat datang, ${user.name.split(' ')[0]}!`, 'success');
        setTimeout(() => {
          router.push(user.role === 'ADMIN' ? '/admin' : '/dashboard');
        }, 600);
      } else {
        alert('Username atau password salah!'); // As requested by user
        showToast('Email atau password salah.', 'error');
        setLoading(false);
      }
    }, 700);
  };

  return (
    <div
      className="flex items-center justify-center"
      style={{ minHeight: '100vh', padding: '24px' }}
    >
      <div className="w-full animate-fade-in" style={{ maxWidth: '420px' }}>
        {/* Card */}
        <div className="glass-card no-hover" style={{ padding: '40px' }}>
          {/* Logo */}
          <Link href="/" className="flex items-center justify-center gap-2 mb-8">
            <Droplets color="var(--primary)" size={28} />
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700 }}>
              Lumina<span className="text-gradient">Wash</span>
            </span>
          </Link>

          <h1 style={{ fontSize: '1.6rem', textAlign: 'center', marginBottom: '6px' }}>
            Selamat Datang
          </h1>
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', fontSize: '0.9rem', marginBottom: '32px' }}>
            Masuk untuk mulai booking layanan cuci mobil.
          </p>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="nama@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  style={{ paddingRight: '44px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  style={{
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                    display: 'flex',
                  }}
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              style={{ marginTop: '8px', padding: '14px' }}
              disabled={loading}
            >
              {loading ? <span className="spinner" /> : <>Masuk <ArrowRight size={18} /></>}
            </button>
          </form>

          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '24px' }}>
            Belum punya akun?{' '}
            <Link href="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>
              Daftar di sini
            </Link>
          </p>

          {/* Dummy hint */}
          <div
            style={{
              marginTop: '28px',
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(59,130,246,0.06)',
              border: '1px solid rgba(59,130,246,0.15)',
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
            }}
          >
            <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
              🔑 Akun Demo:
            </strong>
            <div>User: <code style={{ color: 'var(--primary)' }}>user@test.com</code> / <code style={{ color: 'var(--primary)' }}>user123</code></div>
            <div>Admin: <code style={{ color: 'var(--accent)' }}>admin@test.com</code> / <code style={{ color: 'var(--accent)' }}>admin123</code></div>
          </div>
        </div>
      </div>
    </div>
  );
}
