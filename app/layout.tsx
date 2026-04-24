import type {Metadata} from 'next';
import { Montserrat } from 'next/font/google';
import '../public/CabinetGrotesk/Fonts/WEB/css/cabinet-grotesk.css';
import './globals.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
});

export const metadata: Metadata = {
  title: 'Clispy Solutions — Premium Web Design & Development Agency',
  description: 'Premium Web Design & Development Agency',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={montserrat.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
