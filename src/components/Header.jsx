import React from 'react';
import { Flame } from 'lucide-react';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 flex justify-center pointer-events-none pt-3 px-4">
      <a
        href="#top"
        aria-label="SumaUma, início"
        className="pointer-events-auto inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#0B2E1B]/85 backdrop-blur-md border border-[#F5F5DC]/20 text-[#F5F5DC] shadow-lg transition-transform hover:scale-105"
      >
        <span className="w-8 h-8 rounded-full bg-[#F5F5DC] flex items-center justify-center text-[#FB8C00]">
          <Flame className="w-5 h-5 fill-[#FB8C00]" />
        </span>
        <span className="font-bold text-lg tracking-tight">
          Suma<b className="text-[#66BB6A]">Uma</b>
        </span>
      </a>
    </header>
  );
}
