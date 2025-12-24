import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const akkuratPro = localFont({
  src: [
    {
      path: './fonts/AkkuratPro/AkkuratPro.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/AkkuratPro/Akkurat-Bold.woff2',
      weight: '700',
      style: 'bold',
    },
  ],
  variable: '--akkurat-pro',
});

export const metadata: Metadata = {
  title: 'Excel to Word Summariser',
  description: 'Excel to Word Summariser',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${akkuratPro.variable} ${akkuratPro.variable}`}>{children}</body>
    </html>
  );
}
