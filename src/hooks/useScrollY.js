import { useEffect, useState } from 'react';

// Posição de rolagem (limitada a 1,2 altura de tela), atualizada no máximo 1x por quadro.
export function useScrollY() {
  const [y, setY] = useState(0);

  useEffect(() => {
    let frame = 0;
    const read = () => {
      frame = 0;
      setY(Math.min(window.scrollY, window.innerHeight * 1.2));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return y;
}
