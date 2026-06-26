'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { storage, User } from '@/lib/storage';
import { Droplets, ArrowRight, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/components/ToastProvider';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      showToast('Password tidak cocok!', 'error');
      return;
    }
    if (form.password.length < 6) {
      showToast('Password minimal 6 karakter.', 'error');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const users = storage.getUsers();
      if (users.find(u => u.email === form.email)) {
        showToast('Email sudah terdaftar. Coba masuk!', 'error');
        setLoading(false);
        return;
      }

      const newUser: User = {
        id: `u${Date.now()}`,
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        phone: form.phone.trim(),
        role: 'USER',
        createdAt: new Date().toISOString(),
      };

      storage.saveUsers([...users, newUser]);
      storage.setCurrentUser(newUser);
      showToast('Akun berhasil dibuat! Selamat datang 🎉', 'success');
      setTimeout(() => router.push('/dashboard'), 800);
    }, 700);
  };

  return (
    <div
      className="flex items-center justify-center"
      style={{ minHeight: '100vh', padding: '24px' }}
    >
      <div className="w-full animate-fade-in" style={{ maxWidth: '460px' }}>
        <div className="glass-card no-hover" style={{ padding: '40px' }}>
          {/* Logo */}
          <Link href="/" className="flex items-center justify-center gap-2 mb-8">
            <Droplets color="var(--primary)" size={28} />
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700 }}>
              Lumina<span className="text-gradient">Wash</span>
            </span>
          </Link>

          <h1 style={{ fontSize: '1.6rem', textAlign: 'center', marginBottom: '6px' }}>
            Buat Akun Baru
          </h1>
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', fontSize: '0.9rem', marginBottom: '32px' }}>
            Daftar gratis dan mulai booking sekarang.
          </p>

          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <div className="form-group">
              <label className="form-label" htmlFor="reg-name">Nama Lengkap</label>
              <input
                id="reg-name"
                type="text"
                className="form-input"
                placeholder="John Doe"
                value={form.name}
                onChange={set('name')}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-email">Email</label>
              <input
                id="reg-email"
                type="email"
                className="form-input"
                placeholder="nama@email.com"
                value={form.email}
                onChange={set('email')}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-phone">Nomor HP (opsional)</label>
              <input
                id="reg-phone"
                type="tel"
                className="form-input"
                placeholder="0812-xxxx-xxxx"
                value={form.phone}
                onChange={set('phone')}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-pass">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="reg-pass"
                  type={showPass ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Min. 6 karakter"
                  value={form.password}
                  onChange={set('password')}
                  required
                  style={{ paddingRight: '44px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex' }}
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-confirm">Konfirmasi Password</label>
              <input
                id="reg-confirm"
                type="password"
                className="form-input"
                placeholder="Ulangi password"
                value={form.confirmPassword}
                onChange={set('confirmPassword')}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              style={{ marginTop: '8px', padding: '14px' }}
              disabled={loading}
            >
              {loading ? <span className="spinner" /> : <>Daftar Sekarang <ArrowRight size={18} /></>}
            </button>
          </form>

          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '24px' }}>
            Sudah punya akun?{' '}
            <Link href="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
