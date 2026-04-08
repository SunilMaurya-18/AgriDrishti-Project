import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/lib/AuthContext';
import { QueryProvider } from '@/lib/QueryProvider';
import { GoogleAuthWrapper } from '@/lib/GoogleAuthWrapper';
import ErrorBoundary from '@/components/ErrorBoundary';
import { ThemeProvider } from '@/components/ThemeProvider';

// Load Inter via next/font — avoids external <link> tags that can fail CSP on Vercel
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'PrithviCore – Smart Farming System',
    template: '%s | PrithviCore',
  },
  description: 'AI-powered precision agriculture platform. Monitor soil health, detect plant diseases, and get actionable farm recommendations in real-time.',
  keywords: ['smart farming', 'IoT agriculture', 'soil monitoring', 'plant disease detection', 'precision farming', 'AI farming'],
  authors: [{ name: 'PrithviCore' }],
  creator: 'PrithviCore',
  metadataBase: new URL('https://prithvicore.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://prithvicore.com',
    title: 'PrithviCore – AI-Powered Smart Farming',
    description: 'Real-time IoT soil monitoring, AI disease detection, and precision farming analytics in one platform.',
    siteName: 'PrithviCore',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PrithviCore – Smart Farming System',
    description: 'AI-powered precision agriculture platform for modern farmers.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8faf9' },
    { media: '(prefers-color-scheme: dark)',  color: '#06120b' },
  ],
  width: 'device-width',
  initialScale: 1,
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <GoogleAuthWrapper>
            <AuthProvider>
              <ErrorBoundary>
              {children}
              </ErrorBoundary>

              <Toaster
                position="bottom-right"
                toastOptions={{
                  style: {
                    background: 'var(--primary)',
                    color: '#fff',
                    borderRadius: 'var(--radius)',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                  },
                  success: {
                    iconTheme: { primary: '#fff', secondary: 'var(--primary)' },
                  },
                  error: {
                    style: { background: '#b91c1c', color: '#fff' },
                  },
                }}
              />
            </AuthProvider>
            </GoogleAuthWrapper>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

