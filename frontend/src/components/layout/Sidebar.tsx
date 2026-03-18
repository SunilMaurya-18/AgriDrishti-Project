'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Leaf, Bug, Lightbulb,
  FileBarChart, Settings, User, ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/dashboard',       label: 'Dashboard',        icon: LayoutDashboard },
  { href: '/soil',            label: 'Soil Data',         icon: Leaf },
  { href: '/disease',         label: 'Disease Detection', icon: Bug },
  { href: '/recommendations', label: 'Recommendations',   icon: Lightbulb },
  { href: '/reports',         label: 'Reports',           icon: FileBarChart },
];

const BOTTOM_ITEMS = [
  { href: '/settings', label: 'Settings', icon: Settings },
  { href: '/profile',  label: 'Profile',  icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();

  const NavItem = ({ href, label, Icon }: { href: string; label: string; Icon: React.ElementType }) => {
    const active = pathname === href || pathname.startsWith(href + '/');
    return (
      <Link
        href={href}
        className={cn(
          'group flex items-center gap-3 px-4 py-3 rounded-xl mx-3 text-[15px] font-semibold transition-all duration-300',
          active
            ? 'bg-[#22C55E]/15 text-[#22C55E] shadow-[0_0_15px_rgba(34,197,94,0.1)] ring-1 ring-[#22C55E]/20'
            : 'text-white/70 hover:bg-white/10 hover:text-white'
        )}
      >
        <Icon size={20} className={cn('flex-shrink-0 transition-colors', active ? 'text-[#22C55E]' : 'text-white/60 group-hover:text-white')} />
        <span className="flex-1 truncate">{label}</span>
      </Link>
    );
  };

  return (
    <aside className="fixed inset-y-0 left-0 w-[260px] bg-gradient-to-b from-[#0B3D2E] to-[#06241a] border-r border-white/5 flex-col flex-shrink-0 transition-transform hidden md:flex z-50 shadow-2xl">
      {/* Brand Logo Header */}
      <div className="h-20 flex items-center px-6 border-b border-white/10">
        <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#22C55E] to-[#14B8A6] flex items-center justify-center text-xl shadow-lg shadow-[#22C55E]/20 text-white">🌿</div>
          <span className="text-xl font-bold tracking-tight text-white">PrithviCore</span>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-6 space-y-1.5 overflow-y-auto custom-scrollbar">
        {NAV_ITEMS.map(item => (
          <NavItem key={item.href} href={item.href} label={item.label} Icon={item.icon} />
        ))}
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-white/10 space-y-1.5 bg-black/10">
        {BOTTOM_ITEMS.map(item => (
          <NavItem key={item.href} href={item.href} label={item.label} Icon={item.icon} />
        ))}
      </div>
    </aside>
  );
}
