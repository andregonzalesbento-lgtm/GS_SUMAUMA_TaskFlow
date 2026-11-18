import React from 'react';

export default function Header() {
  return (
    <header className="zona-escura fixed top-0 left-0 right-0 z-40 flex justify-center pointer-events-none pt-3 px-4">
      <a
        href="#top"
        aria-label="SumaUma, início"
        className="pointer-events-auto inline-flex items-center gap-2.5 pl-1.5 pr-4 py-1.5 rounded-full bg-[#0B2E1B]/85 backdrop-blur-md border border-[#F5F5DC]/20 text-[#F5F5DC] shadow-lg transition-transform hover:scale-105"
      >
        <span className="w-9 h-9 rounded-full bg-[#F5F5DC] flex items-center justify-center overflow-hidden">
          <img src="/logo.webp" alt="" width="28" height="28" className="w-7 h-7 object-contain" />
        </span>
        <span className="font-bold text-lg tracking-tight">
          Suma<b className="text-[#66BB6A]">Uma</b>
        </span>
      </a>
    </header>
  );
}
