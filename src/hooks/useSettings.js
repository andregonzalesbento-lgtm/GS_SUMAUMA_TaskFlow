import { useState, useEffect } from 'react';

const KEY = 'suma_sw_v2';
const DEFAULTS = { wa: true };

export function useSettings() {
  const [settings, setSettings] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || DEFAULTS;
    } catch {
      return DEFAULTS;
    }
  });

  useEffect(() => {
    const html = document.documentElement;
    html.classList.toggle('big', settings.sz === 1);
    html.classList.toggle('xl', settings.sz === 2);
    html.classList.toggle('hc', !!settings.hc);
    html.classList.toggle('calm', !!settings.calm);
    const theme = ['', 'light', 'dark'][settings.th || 0];
    if (theme) html.dataset.theme = theme;
    else html.removeAttribute('data-theme');

    try {
      localStorage.setItem(KEY, JSON.stringify(settings));
    } catch {
    }
  }, [settings]);

  return [settings, setSettings];
}
