// lib/storage.ts

export type UserRole = 'USER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: UserRole;
  createdAt: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  features: string[];
  isActive: boolean;
}

export type BookingStatus = 'PENDING' | 'APPROVED' | 'DONE' | 'REJECTED' | 'CANCELLED';

export interface Booking {
  id: string;
  userId: string;
  serviceId: string;
  bayId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  vehicleInfo: string;
  notes?: string;
  status: BookingStatus;
  paymentMethod: string;
  paymentStatus: 'UNPAID' | 'PAID' | 'CANCELLED';
  expiresAt?: string; // ISO string
  createdAt: string;
}

// =============================================
// Initial Dummy Data
// =============================================

export const initialServices: Service[] = [
  {
    id: 's1',
    name: 'Cuci Express',
    description: 'Cuci body cepat menggunakan snow foam & snow wash, semir ban.',
    price: 30000,
    duration: 30,
    features: ['Snow Foam Wash', 'Semir Ban', 'Lap Kering', 'Pembersih Kaca'],
    isActive: true,
  },
  {
    id: 's2',
    name: 'Cuci Premium',
    description: 'Paket lengkap cuci body, vakum interior, wax cair, semir ban, dan pembersih kaca.',
    price: 75000,
    duration: 60,
    features: ['Snow Foam Wash', 'Vacuum Interior', 'Wax Cair', 'Semir Ban', 'Pembersih Kaca', 'Pengharum Kabin'],
    isActive: true,
  },
  {
    id: 's3',
    name: 'Full Detailing',
    description: 'Pembersihan mendalam interior & eksterior, poles body, dan engine bay cleaning.',
    price: 350000,
    duration: 180,
    features: ['Deep Wash Eksterior', 'Poles Body', 'Detailing Interior', 'Engine Bay Cleaning', 'Coating Pelindung', 'Semir Plastik', 'Pembersih Jok'],
    isActive: true,
  },
];

export const initialUsers: User[] = [
  {
    id: 'u1',
    name: 'Budi Santoso',
    email: 'user@test.com',
    password: 'user123',
    phone: '08123456789',
    role: 'USER',
    createdAt: '2026-01-10T08:00:00.000Z',
  },
  {
    id: 'u2',
    name: 'Dewi Rahayu',
    email: 'dewi@test.com',
    password: 'dewi123',
    phone: '08567891234',
    role: 'USER',
    createdAt: '2026-02-15T10:30:00.000Z',
  },
  {
    id: 'u3',
    name: 'Arif Wicaksono',
    email: 'arif@test.com',
    password: 'arif123',
    phone: '08987654321',
    role: 'USER',
    createdAt: '2026-03-20T14:00:00.000Z',
  },
  {
    id: 'a1',
    name: 'Admin Master',
    email: 'admin@test.com',
    password: 'admin123',
    role: 'ADMIN',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
];

export const initialBookings: Booking[] = [
  {
    id: 'b1',
    userId: 'u1',
    serviceId: 's2',
    bayId: 'bay-1',
    date: '2026-06-28',
    time: '10:00',
    vehicleInfo: 'Honda Brio 2022 - B 1234 CD',
    notes: 'Tolong perhatikan bagian kap mesin',
    status: 'PENDING',
    paymentMethod: 'QRIS',
    paymentStatus: 'PAID',
    createdAt: '2026-06-26T08:00:00.000Z',
  },
  {
    id: 'b2',
    userId: 'u2',
    serviceId: 's3',
    bayId: 'bay-2',
    date: '2026-06-27',
    time: '09:00',
    vehicleInfo: 'Toyota Avanza 2020 - D 5678 EF',
    notes: '',
    status: 'APPROVED',
    paymentMethod: 'Tunai',
    paymentStatus: 'UNPAID',
    createdAt: '2026-06-25T14:30:00.000Z',
  },
  {
    id: 'b3',
    userId: 'u3',
    serviceId: 's1',
    bayId: 'bay-3',
    date: '2026-06-25',
    time: '13:00',
    vehicleInfo: 'Suzuki Ertiga 2021 - AD 9012 GH',
    notes: '',
    status: 'DONE',
    paymentMethod: 'QRIS',
    paymentStatus: 'PAID',
    createdAt: '2026-06-23T09:00:00.000Z',
  },
  {
    id: 'b4',
    userId: 'u1',
    serviceId: 's1',
    bayId: 'bay-1',
    date: '2026-06-20',
    time: '15:00',
    vehicleInfo: 'Honda Brio 2022 - B 1234 CD',
    notes: '',
    status: 'DONE',
    paymentMethod: 'QRIS',
    paymentStatus: 'PAID',
    createdAt: '2026-06-18T11:00:00.000Z',
  },
  {
    id: 'b5',
    userId: 'u2',
    serviceId: 's2',
    bayId: 'bay-1',
    date: '2026-06-22',
    time: '11:00',
    vehicleInfo: 'Toyota Avanza 2020 - D 5678 EF',
    notes: '',
    status: 'REJECTED',
    paymentMethod: 'QRIS',
    paymentStatus: 'CANCELLED',
    createdAt: '2026-06-20T10:00:00.000Z',
  },
];

// =============================================
// Storage Helpers
// =============================================

function seed<T>(key: string, defaults: T[]): T[] {
  if (typeof window === 'undefined') return defaults;
  const raw = localStorage.getItem(key);
  if (!raw) {
    localStorage.setItem(key, JSON.stringify(defaults));
    return defaults;
  }
  return JSON.parse(raw) as T[];
}

function save<T>(key: string, data: T[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(data));
  }
}

export const storage = {
  // ---- Users ----
  getUsers: (): User[] => seed('cw_users', initialUsers),

  saveUsers: (users: User[]) => save('cw_users', users),

  // ---- Services ----
  getServices: (): Service[] => seed('cw_services', initialServices),

  saveServices: (services: Service[]) => save('cw_services', services),

  // ---- Bookings ----
  getBookings: (): Booking[] => seed('cw_bookings', initialBookings),

  saveBookings: (bookings: Booking[]) => save('cw_bookings', bookings),

  // ---- Session ----
  getCurrentUser: (): User | null => {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem('cw_current_user');
    return raw ? (JSON.parse(raw) as User) : null;
  },

  setCurrentUser: (user: User | null) => {
    if (typeof window === 'undefined') return;
    if (user) localStorage.setItem('cw_current_user', JSON.stringify(user));
    else localStorage.removeItem('cw_current_user');
  },

  // ---- Utilities ----
  cleanExpiredBookings: () => {
    if (typeof window === 'undefined') return;
    const all = storage.getBookings();
    const now = new Date().getTime();
    let updated = false;
    const cleaned = all.map(b => {
      if (b.paymentStatus === 'UNPAID' && b.expiresAt && new Date(b.expiresAt).getTime() < now) {
        updated = true;
        return { ...b, paymentStatus: 'CANCELLED' as const, status: 'CANCELLED' as const };
      }
      return b;
    });
    if (updated) storage.saveBookings(cleaned);
  },

  resetAll: () => {
    if (typeof window === 'undefined') return;
    ['cw_users', 'cw_services', 'cw_bookings', 'cw_current_user'].forEach(k =>
      localStorage.removeItem(k)
    );
  },
};
