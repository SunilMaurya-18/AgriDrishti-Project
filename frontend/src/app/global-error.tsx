'use client';

import { useEffect } from 'react';
import { Leaf, RefreshCw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[GlobalError]', error);
  }, [error]);

  return (
    <html>
      <body className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
        <div className="text-center max-w-md space-y-6">
          {/* Icon */}
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 opacity-20 animate-pulse" />
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Leaf size={36} className="text-white" />
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-black text-foreground tracking-tight mb-2">Something went wrong</h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              An unexpected error occurred in PrithviCore. Our team has been notified.
            </p>
            {error.digest && (
              <p className="text-xs text-muted-foreground/60 mt-2 font-mono">
                Error ID: {error.digest}
              </p>
            )}
          </div>

          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-semibold text-sm shadow-lg shadow-emerald-500/20 hover:brightness-110 transition-all"
          >
            <RefreshCw size={15} /> Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
