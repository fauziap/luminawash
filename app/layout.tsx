import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { ToastProvider } from '@/components/ToastProvider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const poppins = Poppins({ 
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'], 
  variable: '--font-poppins' 
});

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
      <body className={`${inter.variable} ${poppins.variable}`}>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
