import type {Metadata} from 'next';
import { Outfit, Inter } from 'next/font/google';
import './globals.css'; // Global styles

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Roatan Self Storage - Métodos de Pago',
  description: 'Métodos de pago seguros para Roatan Self Storage. Tarjeta, Transferencia y Pago en Caja.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="es" className={`${outfit.variable} ${inter.variable}`}>
      <head>
        
      </head>
      <body className="font-sans antialiased text-slate-800 bg-[#fafcff] min-h-screen" suppressHydrationWarning>
        
        {children}
      </body>
    </html>
  );
}
