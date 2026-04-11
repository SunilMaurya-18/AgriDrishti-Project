'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  MessageSquarePlus, Send, Star, Bug, Lightbulb, TrendingUp, MessageCircle,
  CheckCircle2, Clock, Eye,
} from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { feedbackAPI, type FeedbackPayload } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

const CATEGORIES = [
  { value: 'bug',         label: 'Bug Report',          icon: Bug,         color: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/20',    activeBg: 'bg-red-500/20',    activeBorder: 'border-red-500/40' },
  { value: 'feature',     label: 'Feature Request',     icon: Lightbulb,   color: 'text-amber-400',  bg: 'bg-amber-500/10',  border: 'border-amber-500/20',  activeBg: 'bg-amber-500/20',  activeBorder: 'border-amber-500/40' },
  { value: 'improvement', label: 'Improvement',         icon: TrendingUp,  color: 'text-sky-400',    bg: 'bg-sky-500/10',    border: 'border-sky-500/20',    activeBg: 'bg-sky-500/20',    activeBorder: 'border-sky-500/40' },
  { value: 'general',     label: 'General Feedback',    icon: MessageCircle,color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20', activeBg: 'bg-violet-500/20', activeBorder: 'border-violet-500/40' },
] as const;

const STATUS_MAP: Record<string, { label: string; icon: typeof CheckCircle2; color: string; bg: string }> = {
  pending:  { label: 'Pending',  icon: Clock,        color: 'text-amber-400',   bg: 'bg-amber-500/10' },
  reviewed: { label: 'Reviewed', icon: Eye,           color: 'text-sky-400',     bg: 'bg-sky-500/10' },
  resolved: { label: 'Resolved', icon: CheckCircle2,  color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
};

interface FeedbackItem {
  _id: string;
  category: string;
  rating: number;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}

export default function FeedbackPage() {
  const [category, setCategory] = useState<FeedbackPayload['category']>('general');
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [history, setHistory] = useState<FeedbackItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const fetchHistory = async () => {
    try {
      const res = await feedbackAPI.history();
      const data = res.data as { feedbacks: FeedbackItem[] };
      setHistory(data.feedbacks || []);
    } catch {
      // silently fail
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => { fetchHistory(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rating) {
      toast.error('Please select a rating');
      return;
    }
    if (!subject.trim()) {
      toast.error('Please enter a subject');
      return;
    }
    if (!message.trim()) {
      toast.error('Please enter your feedback message');
      return;
    }

    setSubmitting(true);
    try {
      await feedbackAPI.submit({ category, rating, subject: subject.trim(), message: message.trim() });
      toast.success('Feedback submitted! Thank you 🎉');
      setCategory('general');
      setRating(0);
      setSubject('');
      setMessage('');
      fetchHistory();
    } catch {
      toast.error('Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const activeCategory = CATEGORIES.find(c => c.value === category)!;

  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight flex items-center gap-2">
          <MessageSquarePlus size={26} className="text-emerald-500" /> Feedback
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Help us improve PrithviCore — share your thoughts, report bugs, or request features
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* ── Submit Form ───────────────────────────────── */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader className="pb-3 border-b border-border/20">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Send size={17} className="text-muted-foreground" /> Submit Feedback
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Category picker */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Category
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {CATEGORIES.map(cat => {
                      const Icon = cat.icon;
                      const active = category === cat.value;
                      return (
                        <button
                          key={cat.value}
                          type="button"
                          onClick={() => setCategory(cat.value)}
                          className={cn(
                            'flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all duration-300',
                            active
                              ? `${cat.activeBg} ${cat.activeBorder} shadow-sm`
                              : `${cat.bg} ${cat.border} hover:${cat.activeBg} hover:${cat.activeBorder} opacity-60 hover:opacity-100`
                          )}
                        >
                          <Icon size={20} className={cn(cat.color, !active && 'opacity-70')} />
                          <span className={cn('text-xs font-semibold', active ? 'text-foreground' : 'text-muted-foreground')}>
                            {cat.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Star rating */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Rating
                  </label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredStar(star)}
                        onMouseLeave={() => setHoveredStar(0)}
                        className="p-1 transition-transform duration-200 hover:scale-125 active:scale-95"
                      >
                        <Star
                          size={28}
                          className={cn(
                            'transition-all duration-200',
                            (hoveredStar || rating) >= star
                              ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.4)]'
                              : 'text-white/15'
                          )}
                        />
                      </button>
                    ))}
                    {rating > 0 && (
                      <span className="ml-3 text-sm font-medium text-muted-foreground">
                        {['', 'Terrible', 'Poor', 'Okay', 'Good', 'Excellent'][rating]}
                      </span>
                    )}
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    maxLength={200}
                    placeholder="Briefly describe your feedback…"
                    className="w-full rounded-xl border border-border/50 bg-muted/20 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all duration-200"
                  />
                  <span className="text-[10px] text-muted-foreground/50 float-right">{subject.length}/200</span>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Message
                  </label>
                  <textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    maxLength={2000}
                    rows={5}
                    placeholder="Share the details of your feedback…"
                    className="w-full rounded-xl border border-border/50 bg-muted/20 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all duration-200 resize-none"
                  />
                  <span className="text-[10px] text-muted-foreground/50 float-right">{message.length}/2000</span>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  className={cn(
                    'w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300',
                    'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20',
                    'hover:shadow-emerald-500/30 hover:brightness-110 active:scale-[0.98]',
                    'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:brightness-100'
                  )}
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting…
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Submit Feedback
                    </>
                  )}
                </button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* ── History ────────────────────────────────────── */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3 border-b border-border/20">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Clock size={17} className="text-muted-foreground" /> Your Feedback History
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {loadingHistory ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-20 rounded-xl bg-muted/20 animate-pulse" />
                  ))}
                </div>
              ) : history.length === 0 ? (
                <div className="text-center py-12">
                  <MessageCircle size={40} className="text-white/10 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">No feedback submitted yet</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">Your submissions will appear here</p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
                  {history.map(item => {
                    const cat = CATEGORIES.find(c => c.value === item.category);
                    const status = STATUS_MAP[item.status] || STATUS_MAP.pending;
                    const StatusIcon = status.icon;
                    const CatIcon = cat?.icon || MessageCircle;
                    return (
                      <div
                        key={item._id}
                        className="p-3.5 rounded-xl border border-border/20 bg-muted/10 hover:bg-muted/20 transition-all duration-200 space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <CatIcon size={14} className={cat?.color || 'text-muted-foreground'} />
                            <span className="text-sm font-semibold text-foreground truncate">{item.subject}</span>
                          </div>
                          <div className={cn('flex items-center gap-1 flex-shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full', status.bg, status.color)}>
                            <StatusIcon size={10} />
                            {status.label}
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{item.message}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map(s => (
                              <Star key={s} size={11} className={cn(s <= item.rating ? 'text-amber-400 fill-amber-400' : 'text-white/10')} />
                            ))}
                          </div>
                          <span className="text-[10px] text-muted-foreground/50">
                            {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
