'use client';

import { useState, useEffect } from 'react';
import { storage, Service } from '@/lib/storage';
import { useToast } from '@/components/ToastProvider';
import { Plus, Pencil, Trash2, X, Check, ToggleLeft, ToggleRight } from 'lucide-react';

const EMPTY_SERVICE: Omit<Service, 'id'> = {
  name: '', description: '', price: 0, duration: 30, features: [], isActive: true,
};

export default function AdminServices() {
  const { showToast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [showModal, setShowModal]   = useState(false);
  const [editId,    setEditId]      = useState<string | null>(null);
  const [form,      setForm]        = useState<Omit<Service, 'id'>>(EMPTY_SERVICE);
  const [featureInput, setFeatureInput] = useState('');

  useEffect(() => { setServices(storage.getServices()); }, []);

  const openCreate = () => { setForm(EMPTY_SERVICE); setEditId(null); setFeatureInput(''); setShowModal(true); };
  const openEdit   = (svc: Service) => {
    setForm({ name: svc.name, description: svc.description, price: svc.price, duration: svc.duration, features: [...svc.features], isActive: svc.isActive });
    setEditId(svc.id); setFeatureInput(''); setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) { showToast('Nama layanan wajib diisi.', 'error'); return; }
    if (form.price <= 0)   { showToast('Harga harus lebih dari 0.', 'error'); return; }

    const list = storage.getServices();
    if (editId) {
      const updated = list.map(s => s.id === editId ? { ...form, id: editId } : s);
      storage.saveServices(updated);
      setServices(updated);
      showToast('Layanan berhasil diperbarui!', 'success');
    } else {
      const newSvc: Service = { ...form, id: `s${Date.now()}` };
      const updated = [...list, newSvc];
      storage.saveServices(updated);
      setServices(updated);
      showToast('Layanan baru berhasil ditambahkan!', 'success');
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Yakin ingin menghapus layanan ini?')) return;
    const updated = services.filter(s => s.id !== id);
    storage.saveServices(updated);
    setServices(updated);
    showToast('Layanan berhasil dihapus.', 'info');
  };

  const toggleActive = (id: string) => {
    const updated = services.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s);
    storage.saveServices(updated);
    setServices(updated);
  };

  const addFeature = () => {
    const f = featureInput.trim();
    if (!f) return;
    if (form.features.includes(f)) { showToast('Fitur sudah ada.', 'error'); return; }
    setForm(prev => ({ ...prev, features: [...prev.features, f] }));
    setFeatureInput('');
  };

  const removeFeature = (f: string) => {
    setForm(prev => ({ ...prev, features: prev.features.filter(x => x !== f) }));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '6px' }}>Kelola Layanan</h1>
          <p style={{ color: 'var(--text-muted)' }}>Tambah, edit, atau hapus paket layanan cuci mobil.</p>
        </div>
        <button onClick={openCreate} className="btn btn-primary">
          <Plus size={18} /> Tambah Layanan
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-2 gap-6">
        {services.map(svc => (
          <div key={svc.id} className="glass-card flex flex-col gap-4" style={{ opacity: svc.isActive ? 1 : 0.6 }}>
            <div className="flex justify-between items-start">
              <div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>{svc.name}</h3>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: svc.isActive ? 'var(--primary)' : 'var(--text-muted)' }}>
                  Rp {svc.price.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(svc)}
                  className="btn btn-sm btn-outline" title="Edit">
                  <Pencil size={14} />
                </button>
                <button onClick={() => handleDelete(svc.id)}
                  className="btn btn-sm btn-danger" title="Hapus">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>{svc.description}</p>

            <div className="flex flex-wrap gap-2">
              {svc.features.map(f => (
                <span key={f} style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: 'var(--radius-full)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
                  {f}
                </span>
              ))}
            </div>

            <div className="flex justify-between items-center" style={{ paddingTop: '12px', borderTop: '1px solid var(--glass-border)' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>⏱ {svc.duration} menit</span>
              <button
                onClick={() => toggleActive(svc.id)}
                className="flex items-center gap-2"
                style={{ fontSize: '0.82rem', color: svc.isActive ? 'var(--success)' : 'var(--text-muted)', fontWeight: 600 }}
              >
                {svc.isActive
                  ? <><ToggleRight size={20} color="var(--success)" /> Aktif</>
                  : <><ToggleLeft size={20} /> Nonaktif</>
                }
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="flex justify-between items-center mb-6">
              <h2 style={{ fontSize: '1.3rem' }}>{editId ? 'Edit Layanan' : 'Tambah Layanan Baru'}</h2>
              <button onClick={() => setShowModal(false)} style={{ color: 'var(--text-muted)', display: 'flex' }}>
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div className="form-group">
                <label className="form-label">Nama Layanan</label>
                <input type="text" className="form-input" placeholder="Cuci Express" value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
              </div>

              <div className="form-group">
                <label className="form-label">Deskripsi</label>
                <textarea className="form-input" rows={2} placeholder="Deskripsi singkat layanan..."
                  value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Harga (Rp)</label>
                  <input type="number" className="form-input" placeholder="50000" min={0}
                    value={form.price || ''} onChange={e => setForm(p => ({ ...p, price: Number(e.target.value) }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Durasi (menit)</label>
                  <input type="number" className="form-input" placeholder="60" min={5}
                    value={form.duration || ''} onChange={e => setForm(p => ({ ...p, duration: Number(e.target.value) }))} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Fitur</label>
                <div className="flex gap-2">
                  <input type="text" className="form-input" placeholder="Tambah fitur..." value={featureInput}
                    onChange={e => setFeatureInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addFeature(); } }}
                    style={{ flex: 1 }} />
                  <button onClick={addFeature} className="btn btn-outline" style={{ flexShrink: 0 }}>
                    <Plus size={16} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2" style={{ marginTop: '10px' }}>
                  {form.features.map(f => (
                    <span key={f} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: 'var(--radius-full)', background: 'rgba(59,130,246,0.1)', color: 'var(--primary)', fontSize: '0.78rem' }}>
                      {f}
                      <button onClick={() => removeFeature(f)} style={{ color: 'inherit', display: 'flex', lineHeight: 1 }}>
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3" style={{ marginTop: '8px' }}>
                <button onClick={() => setShowModal(false)} className="btn btn-outline">Batal</button>
                <button onClick={handleSave} className="btn btn-primary">
                  <Check size={16} /> {editId ? 'Simpan Perubahan' : 'Tambah Layanan'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
