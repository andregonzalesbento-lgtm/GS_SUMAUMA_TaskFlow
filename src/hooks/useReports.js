import { useCallback, useEffect, useRef, useState } from 'react';
import { reportsApi } from '../services/api';

const QUEUE_KEY = 'suma_offline_q';

function readQueue() {
  try {
    return JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveQueue(q) {
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(q));
  } catch {
  }
}

export function useReports(offline) {
  const [reports, setReports] = useState([]);
  const [queue, setQueue] = useState(readQueue);
  const [error, setError] = useState('');
  const flushing = useRef(false);

  const refresh = useCallback(async () => {
    try {
      setReports(await reportsApi.list());
      setError('');
    } catch {
      setError('Não foi possível carregar os avisos agora. Tente de novo em instantes.');
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (offline || queue.length === 0 || flushing.current) return;
    flushing.current = true;
    (async () => {
      const remaining = [];
      for (const item of queue) {
        try {
          const { id, ...clean } = item;
          await reportsApi.create({ ...clean, s: 0 });
        } catch {
          remaining.push(item);
        }
      }
      setQueue(remaining);
      saveQueue(remaining);
      flushing.current = false;
      if (remaining.length) setError('Alguns avisos da fila ainda não saíram. Eles continuam guardados.');
      await refresh();
    })();
  }, [offline, queue, refresh]);

  const run = useCallback(
    async (action, okMessage, failMessage) => {
      try {
        await action();
        await refresh();
        return { ok: true, message: okMessage };
      } catch {
        setError(failMessage);
        return { ok: false, message: failMessage };
      }
    },
    [refresh]
  );

  const create = useCallback(
    async (payload) => {
      if (offline) {
        const next = [{ ...payload, id: `q-${Date.now()}`, s: -1 }, ...queue];
        setQueue(next);
        saveQueue(next);
        return { ok: true, message: 'Sem internet: aviso salvo na fila.' };
      }
      return run(
        () => reportsApi.create(payload),
        'Aviso registrado. Emergência: ligue 193.',
        'Não foi possível enviar o aviso. Emergência: ligue 193.'
      );
    },
    [offline, queue, run]
  );

  const advance = useCallback(
    (item) =>
      run(() => reportsApi.update(item.id, { ...item, s: item.s + 1 }), 'Etapa atualizada.', 'Não foi possível atualizar o aviso.'),
    [run]
  );

  const confirm = useCallback(
    (item) =>
      run(() => reportsApi.update(item.id, { ...item, cf: 1 }), 'Atendimento confirmado. Obrigado!', 'Não foi possível confirmar agora.'),
    [run]
  );

  const remove = useCallback(
    async (item) => {
      if (String(item.id).startsWith('q-')) {
        const next = queue.filter((q) => q.id !== item.id);
        setQueue(next);
        saveQueue(next);
        return { ok: true, message: 'Aviso removido da fila.' };
      }
      return run(() => reportsApi.remove(item.id), 'Aviso excluído.', 'Não foi possível excluir o aviso.');
    },
    [queue, run]
  );

  return { items: [...queue, ...reports], error, create, advance, confirm, remove };
}
