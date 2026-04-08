import { Leaf } from 'lucide-react';

export default function PageLoading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="relative w-12 h-12 mx-auto">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-400 animate-pulse shadow-lg shadow-emerald-500/20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Leaf size={20} className="text-white" />
          </div>
        </div>
        <p className="text-primary font-semibold text-sm tracking-tight">Loading…</p>
      </div>
    </div>
  );
}
