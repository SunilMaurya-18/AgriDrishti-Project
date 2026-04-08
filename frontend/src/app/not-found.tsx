import Link from 'next/link';
import { Leaf, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 selection:bg-primary/20">
      {/* Background orbs */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative text-center max-w-md space-y-8 z-10">
        {/* Logo */}
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-emerald-500 to-teal-400 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-500/20">
          <Leaf size={30} className="text-white" />
        </div>

        {/* 404 */}
        <div>
          <div className="text-8xl font-black text-gradient mb-4">404</div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight mb-3">Page not found</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            This field hasn&apos;t been planted yet. The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-semibold text-sm shadow-lg shadow-emerald-500/20 hover:brightness-110 transition-all"
          >
            <Home size={15} /> Go Home
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-border/50 bg-background/80 text-foreground font-semibold text-sm hover:bg-accent/50 transition-all"
          >
            <ArrowLeft size={15} /> Open Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
