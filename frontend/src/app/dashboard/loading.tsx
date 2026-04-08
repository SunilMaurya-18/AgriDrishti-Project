import { Leaf } from 'lucide-react';

export default function DashboardLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <div className="relative w-16 h-16 mx-auto">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-400 animate-pulse shadow-lg shadow-emerald-500/20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Leaf size={28} className="text-white" />
          </div>
        </div>
        <p className="text-primary font-semibold text-base tracking-tight">Loading Dashboard…</p>
      </div>
    </div>
  );
}
