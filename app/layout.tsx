import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Outfit } from 'next/font/google';
import './globals.css';
import { ToastProvider } from '@/components/ToastProvider';

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: 'LuminaWash | Premium Car Wash Booking',
  description:
    'Platform booking cuci mobil premium. Jadwalkan layanan detailing & cuci mobil profesional dengan mudah dan cepat.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={`${jakarta.variable} ${outfit.variable}`}>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
