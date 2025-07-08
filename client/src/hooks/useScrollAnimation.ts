import { useState, useEffect } from 'react';

export function useScrollAnimation() {
  const [scrollState, setScrollState] = useState({
    isScrolled: false,
    isScrollingDown: false,
    scrollProgress: 0
  });

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const isScrollingDown = currentScrollY > lastScrollY;
          const isScrolled = currentScrollY > 30;
          const scrollProgress = Math.min(currentScrollY / 100, 1); // Progress from 0 to 1

          setScrollState({
            isScrolled,
            isScrollingDown,
            scrollProgress
          });

          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollState;
}