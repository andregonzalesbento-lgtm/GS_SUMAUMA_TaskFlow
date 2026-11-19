import { useMemo } from 'react';
import { parseAvisoEstacao, qualidadeDoAr, EXEMPLO_ILUSTRATIVO } from '../data/estacao';

const EXEMPLO = EXEMPLO_ILUSTRATIVO.map((d, i) => ({ id: `exemplo-${i}`, ...parseAvisoEstacao(d) }));

function maisRecente(a, b) {
  if (a.ts !== null && b.ts !== null && a.ts !== b.ts) return b.ts - a.ts;
  if (a.ts !== null && b.ts === null) return -1;
  if (a.ts === null && b.ts !== null) return 1;
  return (Number(b.id) || 0) - (Number(a.id) || 0);
}

export function useEstacao(items) {
  return useMemo(() => {
    const recebidas = (items || [])
      .map((item) => {
        const leitura = parseAvisoEstacao(item?.d);
        return leitura ? { id: item.id, ...leitura } : null;
      })
      .filter(Boolean)
      .sort(maisRecente);

    const exemplo = recebidas.length === 0;
    const lista = exemplo ? EXEMPLO : recebidas;
    const ultima = lista[0];

    return {
      exemplo,
      ultima,
      ultimas: lista.slice(0, 5),
      qualidade: qualidadeDoAr(ultima.fumaca),
    };
  }, [items]);
}
