'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import toast from 'react-hot-toast';
import { useWebSocket } from '@/hooks/useWebSocket';
import { formatDistanceToNow } from 'date-fns';

interface Alert {
  id: string;
  message: string;
  time: string;
  type: string;
}

export default function AppLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useWebSocket((msg) => {
    if (msg.event === 'disease_alert') {
      const d = msg.data as {
        disease: string;
        confidence: number;
        severity: string;
      };
      const alert: Alert = {
        id: Date.now().toString(),
        message: `🔬 Disease detected: ${d.disease} (${(d.confidence * 100).toFixed(0)}% confidence)`,
        time: formatDistanceToNow(new Date(), { addSuffix: true }),
        type: d.severity === 'critical' ? 'critical' : 'high',
      };
      setAlerts((prev) => [alert, ...prev].slice(0, 20));
      toast.error(`⚠️ ${d.disease} detected on your farm!`);
    }
  });

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-center space-y-4">
          <div className="text-5xl animate-bounce">🌿</div>
          <p className="text-primary font-semibold text-lg tracking-tight">Loading PrithviCore…</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F5F7F6] dark:bg-[#0F172A] text-foreground transition-colors selection:bg-primary/20 relative z-0">
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#22C55E]/5 via-transparent to-transparent animate-in fade-in duration-1000" />
      
      <Sidebar />
      
      {/* Main scrolling wrapper */}
      <div className="md:ml-[260px] flex flex-col min-h-screen w-full md:w-[calc(100%-260px)] transition-all">
        <Navbar alerts={alerts} />
        
        <main className="flex-1 p-6 md:p-8 animate-fade-in custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

