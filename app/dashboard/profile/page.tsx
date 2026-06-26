'use client';

import { useState, useEffect } from 'react';
import { storage, User } from '@/lib/storage';
import { useToast } from '@/components/ToastProvider';
import { UserCircle, Mail, Phone, Lock, Eye, EyeOff, Save } from 'lucide-react';

export default function ProfilePage() {
  const { showToast } = useToast();
  const [user, setUser]           = useState<User | null>(null);
  const [name, setName]           = useState('');
  const [phone, setPhone]         = useState('');
  const [oldPass, setOldPass]     = useState('');
  const [newPass, setNewPass]     = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPass, setShowPass]   = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPass,    setSavingPass]    = useState(false);

  useEffect(() => {
    const cu = storage.getCurrentUser();
    if (cu) {
      setUser(cu);
      setName(cu.name);
      setPhone(cu.phone ?? '');
    }
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { showToast('Nama tidak boleh kosong.', 'error'); return; }
    setSavingProfile(true);
    setTimeout(() => {
      const users = storage.getUsers();
      const updated: User = { ...user!, name: name.trim(), phone: phone.trim() };
      storage.saveUsers(users.map(u => u.id === updated.id ? updated : u));
      storage.setCurrentUser(updated);
      setUser(updated);
      showToast('Profil berhasil diperbarui!', 'success');
      setSavingProfile(false);
    }, 600);
  };

  const handleChangePass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (oldPass !== user.password)  { showToast('Password lama tidak cocok.', 'error'); return; }
    if (newPass.length < 6)          { showToast('Password baru minimal 6 karakter.', 'error'); return; }
    if (newPass !== confirmPass)      { showToast('Konfirmasi password tidak cocok.', 'error'); return; }

    setSavingPass(true);
    setTimeout(() => {
      const users = storage.getUsers();
      const updated: User = { ...user!, password: newPass };
      storage.saveUsers(users.map(u => u.id === updated.id ? updated : u));
      storage.setCurrentUser(updated);
      setUser(updated);
      setOldPass(''); setNewPass(''); setConfirmPass('');
      showToast('Password berhasil diubah!', 'success');
      setSavingPass(false);
    }, 600);
  };

  if (!user) return null;

  const initials = user.name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '6px' }}>Profil Saya</h1>
        <p style={{ color: 'var(--text-muted)' }}>Kelola informasi akun dan keamanan Anda.</p>
      </div>

      {/* Avatar + info header */}
      <div className="glass-card no-hover flex items-center gap-6" style={{ padding: '28px 32px' }}>
        <div className="avatar" style={{ width: '72px', height: '72px', fontSize: '1.6rem', flexShrink: 0 }}>
          {initials}
        </div>
        <div>
          <h2 style={{ fontSize: '1.3rem' }}>{user.name}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>{user.email}</p>
          <span
            style={{
              display: 'inline-block',
              marginTop: '8px',
              padding: '3px 12px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(59,130,246,0.1)',
              color: 'var(--primary)',
              border: '1px solid rgba(59,130,246,0.3)',
              fontSize: '0.75rem',
              fontWeight: 700,
            }}
          >
            CUSTOMER
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Edit Profile */}
        <div className="glass-card no-hover flex flex-col gap-5">
          <h3 className="flex items-center gap-2" style={{ fontSize: '1.05rem' }}>
            <UserCircle size={18} color="var(--primary)" /> Informasi Pribadi
          </h3>
          <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
            <div className="form-group">
              <label className="form-label" htmlFor="prof-name">Nama Lengkap</label>
              <input id="prof-name" type="text" className="form-input" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="prof-email">Email</label>
              <input id="prof-email" type="email" className="form-input" value={user.email} disabled style={{ opacity: 0.5, cursor: 'not-allowed' }} />
              <span className="form-error" style={{ color: 'var(--text-muted)' }}>Email tidak dapat diubah.</span>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="prof-phone">Nomor HP</label>
              <input id="prof-phone" type="tel" className="form-input" placeholder="0812-xxxx-xxxx" value={phone} onChange={e => setPhone(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }} disabled={savingProfile}>
              {savingProfile ? <span className="spinner" /> : <><Save size={16} /> Simpan Perubahan</>}
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div className="glass-card no-hover flex flex-col gap-5">
          <h3 className="flex items-center gap-2" style={{ fontSize: '1.05rem' }}>
            <Lock size={18} color="var(--accent)" /> Ubah Password
          </h3>
          <form onSubmit={handleChangePass} className="flex flex-col gap-4">
            <div className="form-group">
              <label className="form-label" htmlFor="old-pass">Password Lama</label>
              <div style={{ position: 'relative' }}>
                <input id="old-pass" type={showPass ? 'text' : 'password'} className="form-input" placeholder="••••••••"
                  value={oldPass} onChange={e => setOldPass(e.target.value)} required style={{ paddingRight: '44px' }} />
                <button type="button" onClick={() => setShowPass(v => !v)}
                  style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex' }}>
                  {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="new-pass">Password Baru</label>
              <input id="new-pass" type="password" className="form-input" placeholder="Min. 6 karakter"
                value={newPass} onChange={e => setNewPass(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="conf-pass">Konfirmasi Password Baru</label>
              <input id="conf-pass" type="password" className="form-input" placeholder="Ulangi password baru"
                value={confirmPass} onChange={e => setConfirmPass(e.target.value)} required />
            </div>
            <button type="submit" className="btn" style={{ alignSelf: 'flex-start', background: 'rgba(139,92,246,0.12)', color: 'var(--accent)', border: '1px solid rgba(139,92,246,0.3)' }}
              disabled={savingPass}>
              {savingPass ? <span className="spinner" /> : <><Lock size={16} /> Ubah Password</>}
            </button>
          </form>
        </div>
      </div>

      {/* Account Info */}
      <div className="glass-card no-hover flex flex-col gap-4" style={{ padding: '24px 28px' }}>
        <h3 style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.78rem' }}>
          Info Akun
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'ID Pengguna', value: user.id },
            { label: 'Peran',       value: user.role },
            { label: 'Bergabung Sejak', value: new Date(user.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) },
          ].map(({ label, value }) => (
            <div key={label}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>{label}</div>
              <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
