import AppLayout from '@/components/layout/AppLayout';

export default function FeedbackLoading() {
  return (
    <AppLayout>
      <div className="mb-8">
        <div className="h-8 w-48 rounded-lg bg-muted/30 animate-pulse" />
        <div className="h-4 w-80 rounded-lg bg-muted/20 animate-pulse mt-2" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3 h-[500px] rounded-2xl bg-muted/10 border border-border/20 animate-pulse" />
        <div className="lg:col-span-2 h-[500px] rounded-2xl bg-muted/10 border border-border/20 animate-pulse" />
      </div>
    </AppLayout>
  );
}
