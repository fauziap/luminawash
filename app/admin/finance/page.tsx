'use client';

import { useState, useEffect } from 'react';
import { storage, Booking, Service } from '@/lib/storage';
import { DollarSign, TrendingUp, CreditCard, Wallet, Download } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function FinancePage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    storage.cleanExpiredBookings();
    setBookings(storage.getBookings());
    setServices(storage.getServices());
  }, []);

  const getService = (id: string) => services.find(s => s.id === id);

  // Only calculate revenue for PAID bookings
  const paidBookings = bookings.filter(b => b.paymentStatus === 'PAID');
  
  const totalRevenue = paidBookings.reduce((sum, b) => {
    const s = getService(b.serviceId);
    return sum + (s?.price || 0);
  }, 0);

  // Revenue by Bay
  const revByBay = paidBookings.reduce((acc, b) => {
    const s = getService(b.serviceId);
    if (!acc[b.bayId]) acc[b.bayId] = 0;
    acc[b.bayId] += (s?.price || 0);
    return acc;
  }, {} as Record<string, number>);

  // Revenue by Payment Method
  const revByMethod = paidBookings.reduce((acc, b) => {
    const s = getService(b.serviceId);
    if (!acc[b.paymentMethod]) acc[b.paymentMethod] = 0;
    acc[b.paymentMethod] += (s?.price || 0);
    return acc;
  }, {} as Record<string, number>);

  const handleExport = () => {
    const dataToExport = paidBookings.map(b => {
      const s = getService(b.serviceId);
      return {
        'ID Transaksi': b.id,
        'Tanggal': b.date,
        'Waktu': b.time,
        'Layanan': s?.name || '-',
        'Ruang': b.bayId === 'bay-1' ? 'Ruang 1' : b.bayId === 'bay-2' ? 'Ruang 2' : 'Ruang 3',
        'Metode Pembayaran': b.paymentMethod,
        'Pendapatan (Rp)': s?.price || 0
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Laporan');
    
    worksheet['!cols'] = [{wch: 15}, {wch: 12}, {wch: 10}, {wch: 25}, {wch: 12}, {wch: 18}, {wch: 18}];

    XLSX.writeFile(workbook, `Laporan_Keuangan_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '6px' }}>Laporan Keuangan</h1>
          <p style={{ color: 'var(--text-muted)' }}>Ringkasan pendapatan dari transaksi yang sudah dibayar.</p>
        </div>
        <button className="btn btn-primary flex items-center gap-2" onClick={handleExport}>
          <Download size={18} /> Export Excel
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="glass-card flex items-center gap-4">
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(16,185,129,0.15)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '4px' }}>Total Pendapatan Bersih</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>Rp {totalRevenue.toLocaleString('id-ID')}</div>
          </div>
        </div>
        <div className="glass-card flex items-center gap-4">
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(59,130,246,0.15)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CreditCard size={24} />
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '4px' }}>Pendapatan QRIS</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>Rp {(revByMethod['QRIS'] || 0).toLocaleString('id-ID')}</div>
          </div>
        </div>
        <div className="glass-card flex items-center gap-4">
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(245,158,11,0.15)', color: 'var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Wallet size={24} />
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '4px' }}>Pendapatan Tunai</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>Rp {(revByMethod['Tunai'] || 0).toLocaleString('id-ID')}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {/* Revenue by Bay */}
        <div className="glass-card">
          <h2 style={{ fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={20} color="var(--primary)" /> Pendapatan per Ruangan
          </h2>
          <div className="flex flex-col gap-3">
            {['bay-1', 'bay-2', 'bay-3'].map(bay => (
              <div key={bay} className="flex justify-between items-center" style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontWeight: 600 }}>{bay === 'bay-1' ? 'Ruang 1' : bay === 'bay-2' ? 'Ruang 2' : 'Ruang 3'}</span>
                <span style={{ fontWeight: 800, color: 'var(--success)' }}>Rp {(revByBay[bay] || 0).toLocaleString('id-ID')}</span>
              </div>
            ))}
          </div>
        </div>

        {/* History of Paid */}
        <div className="glass-card">
          <h2 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Transaksi Lunas Terbaru</h2>
          <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-2">
            {paidBookings.sort((a,b)=>new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5).map(b => {
              const s = getService(b.serviceId);
              return (
                <div key={b.id} className="flex justify-between items-center" style={{ paddingBottom: '12px', borderBottom: '1px solid var(--glass-border)' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{s?.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{b.date} • {b.paymentMethod}</div>
                  </div>
                  <div style={{ fontWeight: 700 }}>+ Rp {(s?.price || 0).toLocaleString('id-ID')}</div>
                </div>
              );
            })}
            {paidBookings.length === 0 && (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px' }}>Belum ada transaksi lunas.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
