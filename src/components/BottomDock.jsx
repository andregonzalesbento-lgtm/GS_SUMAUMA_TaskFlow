import React from 'react';
import { Home, MapPin, Flame, HeartHandshake, SlidersHorizontal } from 'lucide-react';

export default function BottomDock({ activeSection, onOpenSettings }) {
  const navItems = [
    { id: 'top', href: '#top', label: 'Início', icon: Home },
    { id: 'risco', href: '#risco', label: 'Risco', icon: MapPin },
    { id: 'avisar', href: '#avisar', label: 'Avisar', icon: Flame, fab: true },
    { id: 'sp-ajuda', href: '#sp-ajuda', label: 'SP Ajuda', icon: HeartHandshake },
  ];

  return (
    <nav
      aria-label="Navegação principal"
      className="fixed left-1/2 bottom-3.5 -translate-x-1/2 z-50 flex items-center gap-1 p-1.5 rounded-[30px] bg-[#0B2E1B]/85 backdrop-blur-xl border border-[#F5F5DC]/20 shadow-2xl"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeSection === item.id;

        if (item.fab) {
          return (
            <a
              key={item.id}
              href={item.href}
              className="flex flex-col items-center justify-center gap-0.5 w-16 py-2 rounded-2xl bg-[#FB8C00] text-[#1B1F24] font-bold text-[11px] shadow-md transition-transform active:scale-95"
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </a>
          );
        }

        return (
          <a
            key={item.id}
            href={item.href}
            className={`flex flex-col items-center justify-center gap-0.5 w-15 sm:w-16 px-2.5 py-2 rounded-2xl font-semibold text-[11px] transition-colors ${
              isActive ? 'bg-[#F5F5DC]/15 text-[#A5D6A7]' : 'text-[#F5F5DC] hover:text-[#A5D6A7]'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span>{item.label}</span>
          </a>
        );
      })}

      <button
        type="button"
        onClick={onOpenSettings}
        aria-haspopup="dialog"
        className="flex flex-col items-center justify-center gap-0.5 w-15 sm:w-16 px-2.5 py-2 rounded-2xl text-[#F5F5DC] hover:text-[#A5D6A7] font-semibold text-[11px] cursor-pointer"
      >
        <SlidersHorizontal className="w-5 h-5" />
        <span>Ajustes</span>
      </button>
    </nav>
  );
}
