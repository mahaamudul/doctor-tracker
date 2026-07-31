import './globals.css';
import Providers from '@/components/shared/providers';

export const metadata = {
  title: 'Doctor Tracker - Admin Portal',
  description: 'Administrative web application to manage doctors and patient records.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-50 font-sans antialiased text-slate-900">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}