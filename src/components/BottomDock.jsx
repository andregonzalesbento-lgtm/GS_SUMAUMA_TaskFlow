import React from 'react';
import { Home, MapPin, Megaphone, HeartHandshake, SlidersHorizontal } from 'lucide-react';

const itemBase =
  'relative flex flex-col items-center justify-center gap-1 w-[62px] min-h-[52px] px-1 pt-2 pb-1.5 whitespace-nowrap rounded-2xl text-[11px] leading-none font-semibold transition-colors duration-150';

export default function BottomDock({ activeSection, onOpenSettings }) {
  const navItems = [
    { id: 'top', href: '#top', label: 'Início', icon: Home },
    { id: 'risco', href: '#risco', label: 'Risco', icon: MapPin },
    { id: 'avisar', href: '#avisar', label: 'Avisar', icon: Megaphone, fab: true },
    { id: 'sp-ajuda', href: '#sp-ajuda', label: 'SP Ajuda', icon: HeartHandshake },
  ];

  return (
    <nav
      aria-label="Navegação principal"
      className="fixed left-1/2 -translate-x-1/2 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-50 flex items-center gap-1 p-1.5 rounded-[28px] bg-[color-mix(in_srgb,var(--sf)_94%,transparent)] backdrop-blur-xl border border-[var(--ln)] shadow-[0_6px_24px_rgba(0,0,0,0.14)]"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeSection === item.id;

        if (item.fab) {
          return (
            <a
              key={item.id}
              href={item.href}
              aria-current={isActive ? 'location' : undefined}
              className="relative -top-3.5 flex flex-col items-center justify-center gap-1 w-16 min-h-[60px] px-1 pt-2.5 pb-2 whitespace-nowrap rounded-[22px] bg-[#FB8C00] text-[#1B1F24] text-[11px] leading-none font-bold ring-4 ring-[var(--sf)] shadow-[0_6px_16px_rgba(251,140,0,0.35)] transition-transform duration-150 hover:-translate-y-0.5 active:scale-95"
            >
              <Icon className="w-[22px] h-[22px]" aria-hidden="true" />
              <span>{item.label}</span>
            </a>
          );
        }

        return (
          <a
            key={item.id}
            href={item.href}
            aria-current={isActive ? 'location' : undefined}
            className={`${itemBase} ${
              isActive
                ? 'bg-[color-mix(in_srgb,var(--natureza)_14%,transparent)] text-[var(--natureza-texto)]'
                : 'text-[var(--mu)] hover:text-[var(--ink)]'
            }`}
          >
            {isActive && (
              <span aria-hidden="true" className="absolute top-1 left-1/2 -translate-x-1/2 w-5 h-1 rounded-full bg-[var(--natureza-texto)]" />
            )}
            <Icon className="w-5 h-5" aria-hidden="true" />
            <span>{item.label}</span>
          </a>
        );
      })}

      <button
        type="button"
        onClick={onOpenSettings}
        aria-haspopup="dialog"
        className={`${itemBase} text-[var(--mu)] hover:text-[var(--ink)] cursor-pointer`}
      >
        <SlidersHorizontal className="w-5 h-5" aria-hidden="true" />
        <span>Ajustes</span>
      </button>
    </nav>
  );
}
