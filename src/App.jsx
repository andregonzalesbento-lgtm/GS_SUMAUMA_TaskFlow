import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import RiverStory from './components/RiverStory';
import Map3D from './components/Map3D';
import SaoPauloHelp from './components/SaoPauloHelp';
import NewsRadar from './components/NewsRadar';
import ReportForm from './components/ReportForm';
import BottomDock from './components/BottomDock';
import SettingsSheet from './components/SettingsSheet';
import Footer from './components/Footer';
import { useSettings } from './hooks/useSettings';
import { useSpeech } from './hooks/useSpeech';
import { useActiveSection } from './hooks/useActiveSection';
import { useEnvironmentData } from './hooks/useEnvironmentData';
import { useReports } from './hooks/useReports';

const SECTIONS = ['top', 'risco', 'sp-ajuda', 'avisar'];

export default function App() {
  const [settings, setSettings] = useSettings();
  const speak = useSpeech(!!settings.voz);
  const activeSection = useActiveSection(SECTIONS);
  const { regions, status } = useEnvironmentData();
  const reports = useReports(!!settings.off);

  const [selectedIdx, setSelectedIdx] = useState(1);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const closeSettings = useCallback(() => setSettingsOpen(false), []);

  const handleSelectRegion = (idx, shouldSpeak) => {
    setSelectedIdx(idx);
    if (shouldSpeak) {
      const r = regions[idx];
      const lv = r.pm <= 15 ? 'baixo' : r.pm <= 50 ? 'atenção' : 'perigo';
      speak(`${r.name}: risco ${lv}.`);
    }
  };

  const withSpeech = (fn) => async (...args) => {
    const result = await fn(...args);
    if (result.ok) speak(result.message);
    return result;
  };

  return (
    <>
      <div inert={settingsOpen ? '' : undefined}>
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:px-4 focus:py-2.5 focus:rounded-full focus:bg-[var(--sf)] focus:text-[var(--ink)] focus:font-bold focus:text-sm focus:border-2 focus:border-[var(--foco)] focus:shadow-lg"
        >
          Pular para o conteúdo
        </a>
        <Header />
        <main id="conteudo" tabIndex={-1} className="focus:outline-none">
          <Hero calm={!!settings.calm} />
          <RiverStory />
          <Map3D
            regions={regions}
            selectedIdx={selectedIdx}
            onSelect={handleSelectRegion}
            status={status}
            onSpeak={(text) => speak(text, true)}
          />
          <SaoPauloHelp onNotify={(msg) => speak(msg)} />
          <NewsRadar />
          <ReportForm
            regions={regions}
            items={reports.items}
            error={reports.error}
            isOfflineSim={!!settings.off}
            onCreate={withSpeech(reports.create)}
            onAdvance={reports.advance}
            onConfirm={withSpeech(reports.confirm)}
            onDelete={reports.remove}
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
                  className="px-4 py-1 rounded-full border border-[var(--natureza)] text-[var(--natureza-texto)] font-semibold text-xs"
                >
                  {pill}
                </span>
              ))}
            </div>
          </div>
        </main>

        <Footer />
      </div>

      <BottomDock activeSection={activeSection} onOpenSettings={() => setSettingsOpen(true)} />
      <SettingsSheet open={settingsOpen} onClose={closeSettings} settings={settings} onUpdate={setSettings} />
    </>
  );
}
