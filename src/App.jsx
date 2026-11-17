import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import RiverStory from './components/RiverStory';
import Map3D from './components/Map3D';
import SaoPauloHelp from './components/SaoPauloHelp';
import NewsRadar from './components/NewsRadar';
import ReportForm from './components/ReportForm';
import BottomDock from './components/BottomDock';
import SettingsSheet from './components/SettingsSheet';
import { REGIONS, FALLBACK_NEWS } from './data/regions';
import {
  fetchEnvironmentData,
  fetchInpeHotspots,
  fetchVerifiedNews,
  reportsApi,
} from './services/api';

export default function App() {
  const [regions, setRegions] = useState(REGIONS);
  const [selectedIdx, setSelectedIdx] = useState(1);
  const [statusText, setStatusText] = useState('Carregando dados ambientais…');
  const [news, setNews] = useState(FALLBACK_NEWS);
  const [reports, setReports] = useState([]);
  const [offlineQueue, setOfflineQueue] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('suma_offline_q') || '[]');
    } catch {
      return [];
    }
  });
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('top');
  const [settings, setSettings] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('suma_sw_v2') || '{"wa":true}');
    } catch {
      return { wa: true };
    }
  });

  const speak = useCallback(
    (text, force = false) => {
      if (!force && !settings.voz) return;
      try {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'pt-BR';
        window.speechSynthesis.speak(u);
      } catch {}
    },
    [settings.voz]
  );

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
      localStorage.setItem('suma_sw_v2', JSON.stringify(settings));
    } catch {}
  }, [settings]);

  useEffect(() => {
    if (settings.off || offlineQueue.length === 0) return;
    (async () => {
      for (const item of offlineQueue) {
        const clean = { ...item, s: 0 };
        delete clean.id;
        await reportsApi.create(clean);
      }
      setOfflineQueue([]);
      localStorage.setItem('suma_offline_q', '[]');
      const fresh = await reportsApi.list();
      setReports(fresh);
    })();
  }, [settings.off, offlineQueue]);

  useEffect(() => {
    (async () => {
      let updated = [...REGIONS];
      try {
        const env = await fetchEnvironmentData(REGIONS);
        updated = updated.map((r, i) => ({
          ...r,
          pm: env[i].pm,
          temp: env[i].temp,
          hum: env[i].hum,
          wind: env[i].wind,
        }));
        setStatusText(`Ar e clima: Open-Meteo, ${env[0].time.replace('T', ' às ')}.`);
      } catch {
        setStatusText('Sem conexão externa; dados de demonstração.');
      }

      try {
        const inpe = await fetchInpeHotspots();
        updated = updated.map((r) => ({
          ...r,
          hotspots: inpe.counts[r.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase()] || 0,
        }));
        setStatusText((prev) => `${prev} Focos: INPE (${inpe.dateLabel}).`);
      } catch {}

      setRegions(updated);
      const loadedNews = await fetchVerifiedNews();
      setNews(loadedNews);
      const loadedReports = await reportsApi.list();
      setReports(loadedReports);
    })();
  }, []);

  useEffect(() => {
    const ids = ['top', 'risco', 'sp-ajuda', 'avisar'];
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection(e.target.id);
        });
      },
      { rootMargin: '-40% 0px -50% 0px' }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const handleSelectRegion = (idx, shouldSpeak) => {
    setSelectedIdx(idx);
    if (shouldSpeak && settings.voz) {
      const r = regions[idx];
      const lv = r.pm <= 15 ? 'baixo' : r.pm <= 50 ? 'atenção' : 'perigo';
      speak(`${r.name}: risco ${lv}.`);
    }
  };

  const handleCreateReport = async (payload) => {
    if (settings.off) {
      const queued = [{ ...payload, id: `q-${Date.now()}`, s: -1 }, ...offlineQueue];
      setOfflineQueue(queued);
      localStorage.setItem('suma_offline_q', JSON.stringify(queued));
      const msg = 'Sem internet: aviso salvo na fila.';
      speak(msg);
      return msg;
    }
    await reportsApi.create(payload);
    const fresh = await reportsApi.list();
    setReports(fresh);
    const msg = 'Aviso enviado. Emergência: ligue 193.';
    speak(msg);
    return msg;
  };

  const handleAdvanceReport = async (item) => {
    await reportsApi.update(item.id, { ...item, s: item.s + 1 });
    setReports(await reportsApi.list());
  };

  const handleConfirmReport = async (item) => {
    await reportsApi.update(item.id, { ...item, cf: 1 });
    setReports(await reportsApi.list());
    speak('Atendimento confirmado. Obrigado!');
  };

  const handleDeleteReport = async (item) => {
    if (String(item.id).startsWith('q-')) {
      const next = offlineQueue.filter((q) => q.id !== item.id);
      setOfflineQueue(next);
      localStorage.setItem('suma_offline_q', JSON.stringify(next));
      return;
    }
    await reportsApi.remove(item.id);
    setReports(await reportsApi.list());
  };

  return (
    <>
      <div inert={settingsOpen ? '' : undefined}>
        <Header />
        <Hero calm={!!settings.calm} />
        <RiverStory />
        <Map3D
          regions={regions}
          selectedIdx={selectedIdx}
          onSelect={handleSelectRegion}
          statusText={statusText}
          onSpeak={(text) => speak(text, true)}
        />
        <SaoPauloHelp onNotify={(msg) => speak(msg)} />
        <NewsRadar news={news} />
        <ReportForm
          regions={regions}
          reports={reports}
          offlineQueue={offlineQueue}
          isOfflineSim={!!settings.off}
          onCreate={handleCreateReport}
          onAdvance={handleAdvanceReport}
          onConfirm={handleConfirmReport}
          onDelete={handleDeleteReport}
        />

        <div className="max-w-3xl w-[calc(100%-32px)] mx-auto my-8 p-7 rounded-3xl bg-[var(--sf)] text-[var(--ink)] border border-[var(--ln)] text-center">
          <h2 className="font-serif font-semibold text-3xl mb-2">Juntos pela natureza.</h2>
          <p className="text-sm sm:text-base max-w-md mx-auto mb-4">
            A SumaUma conecta Amazônia e São Paulo com dados para prevenir queimadas.
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {['Natureza', 'Confiança', 'Prevenção', 'Humanidade', 'Tecnologia'].map((pill) => (
              <span
                key={pill}
                className="px-4 py-1 rounded-full border border-[var(--natureza)] text-[var(--natureza)] font-semibold text-xs"
              >
                {pill}
              </span>
            ))}
          </div>
        </div>

        <footer className="px-4 pt-4 pb-10 text-center text-xs text-[var(--mu)] max-w-3xl mx-auto">
          Protótipo FIAP • Global Solution 2026.2. Ar e clima: Open-Meteo/CAMS (CC BY 4.0); focos: INPE. Orientações não substituem Defesa Civil, bombeiros ou brigadas.
        </footer>
      </div>

      <BottomDock activeSection={activeSection} onOpenSettings={() => setSettingsOpen(true)} />
      <SettingsSheet
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onUpdate={setSettings}
      />
    </>
  );
}
