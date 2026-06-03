import { useState, useEffect, useRef } from 'react';
import LoadingScreen from './components/LoadingScreen';
import SunflowerCanvas from './components/SunflowerCanvas';
import CustomCursor from './components/CustomCursor';
import EnvironmentSlider from './components/EnvironmentSlider';
import Section1 from './sections/Section1';
import Section2 from './sections/Section2';
import Section3 from './sections/Section3';
import Section4 from './sections/Section4';
import Section5 from './sections/Section5';
import Section6 from './sections/Section6';
import Section7 from './sections/Section7';
import type { EnvState, Act } from './types';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [act, setAct] = useState<Act>(1);
  const [env, setEnv] = useState<EnvState>('golden');
  const [scrollY, setScrollY] = useState(0);
  const [section1Active, setSection1Active] = useState(false);
  const section2Ref = useRef<HTMLElement | null>(null);
  const section3Ref = useRef<HTMLElement | null>(null);
  const isTouchRef = useRef(false);

  useEffect(() => {
    isTouchRef.current = 'ontouchstart' in window;
  }, []);

  // Apply env class to body for background
  useEffect(() => {
    document.body.classList.remove('env-day', 'env-golden', 'env-night');
    document.body.classList.add(`env-${env}`);
  }, [env]);

  // Track scroll for canvas parallax
  useEffect(() => {
    const onScroll = () => {
      setScrollY(window.scrollY);

      // Act transitions based on scroll
      const totalH = document.body.scrollHeight - window.innerHeight;
      const pct = window.scrollY / Math.max(totalH, 1);
      if (pct < 0.25) setAct(1);
      else if (pct < 0.6) setAct(2);
      else setAct(3);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLoadingComplete = () => {
    setLoading(false);
    setTimeout(() => setSection1Active(true), 200);
  };

  const handleBegin = () => {
    // Transition to act 2 — canvas fades in
    setAct(2);
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  };

  return (
    <div
      className="relative min-h-screen env-transition"
      style={{
        background: 'transparent',
        color: '#FFF8E7',
      }}
    >
      {/* Loading screen */}
      {loading && <LoadingScreen onComplete={handleLoadingComplete} />}

      {/* Sunflower canvas engine */}
      <SunflowerCanvas env={env} act={act} scrollY={scrollY} />

      {/* Custom cursor — hide on touch */}
      {!isTouchRef.current && <CustomCursor env={env} />}

      {/* Main content */}
      {!loading && (
        <main>
          {/* Section 1: Welcome */}
          <Section1 onBegin={handleBegin} isActive={section1Active} />

          {/* Section 2: Our Story */}
          <section ref={section2Ref as React.RefObject<HTMLElement>}>
            <Section2 isActive={act >= 2} />
          </section>

          {/* Transition label */}
          <div
            className="relative flex flex-col items-center py-16 px-6 text-center"
            style={{ zIndex: 2 }}
          >
            <div
              className="w-px h-16 mb-6"
              style={{ background: 'linear-gradient(180deg, transparent, rgba(245,200,66,0.4), transparent)' }}
            />
            <p
              style={{
                fontFamily: "'Caveat', cursive",
                fontSize: '1rem',
                color: 'rgba(245,200,66,0.4)',
                letterSpacing: '0.15em',
              }}
            >
              — and in between the dates, I noticed things —
            </p>
            <div
              className="w-px h-16 mt-6"
              style={{ background: 'linear-gradient(180deg, transparent, rgba(245,200,66,0.4), transparent)' }}
            />
          </div>

          {/* Section 3: Things I Never Told You */}
          <section ref={section3Ref as React.RefObject<HTMLElement>}>
            <Section3 />
          </section>

          {/* Section 4: Voice */}
          <Section4 />

          {/* Divider */}
          <div
            className="flex items-center justify-center gap-4 py-8"
            style={{ zIndex: 2, position: 'relative' }}
          >
            <div className="flex-1 h-px max-w-32" style={{ background: 'linear-gradient(90deg, transparent, rgba(245,200,66,0.25))' }} />
            <svg width="20" height="20" viewBox="0 0 20 20">
              <circle cx="10" cy="10" r="3.5" fill="#F5C842" opacity="0.5" />
              {Array.from({ length: 8 }).map((_, i) => {
                const a = (Math.PI * 2 / 8) * i;
                return (
                  <ellipse
                    key={i}
                    cx={10 + Math.cos(a) * 7}
                    cy={10 + Math.sin(a) * 7}
                    rx="2.5"
                    ry="1"
                    transform={`rotate(${i * 45} ${10 + Math.cos(a) * 7} ${10 + Math.sin(a) * 7})`}
                    fill="#F5C842"
                    opacity="0.4"
                  />
                );
              })}
            </svg>
            <div className="flex-1 h-px max-w-32" style={{ background: 'linear-gradient(270deg, transparent, rgba(245,200,66,0.25))' }} />
          </div>

          {/* Section 5: Envelope */}
          <Section5 />

          {/* Section 6: Video */}
          <Section6 />

          {/* Section 7: Ending */}
          <Section7 />

          {/* Footer breathing room */}
          <div style={{ height: '10vh' }} />
        </main>
      )}

      {/* Environment slider */}
      {!loading && <EnvironmentSlider env={env} onChange={setEnv} />}
    </div>
  );
}
