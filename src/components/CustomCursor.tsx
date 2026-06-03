import { useEffect, useRef, useCallback } from 'react';
import type { EnvState } from '../types';

interface Props {
  env: EnvState;
}

interface MicroPetal {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  life: number;
  el: HTMLDivElement | null;
}

interface TrailPoint {
  x: number;
  y: number;
  t: number;
  el: HTMLDivElement | null;
}

const MAX_PETALS = 20;
const MAX_TRAIL = 13;
const TRAIL_LIFETIME = 600;

export default function CustomCursor({ env }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailContainerRef = useRef<HTMLDivElement>(null);
  const petalContainerRef = useRef<HTMLDivElement>(null);

  const posRef = useRef({ x: -100, y: -100 });
  const prevPosRef = useRef({ x: -100, y: -100 });
  const angleRef = useRef(0);
  const rafRef = useRef(0);
  const envRef = useRef(env);

  // Mutable arrays for animation — no React state
  const petalsRef = useRef<MicroPetal[]>([]);
  const trailRef = useRef<TrailPoint[]>([]);

  // Keep env ref in sync
  useEffect(() => {
    envRef.current = env;
  }, [env]);

  // Create a pool of reusable DOM elements for petals
  const ensurePetalEl = useCallback((petal: MicroPetal) => {
    if (petal.el) return;
    const el = document.createElement('div');
    el.style.position = 'absolute';
    el.style.width = '12px';
    el.style.height = '6px';
    el.style.borderRadius = '50%';
    el.style.pointerEvents = 'none';
    el.style.willChange = 'transform, opacity';
    petal.el = el;
    petalContainerRef.current?.appendChild(el);
  }, []);

  const ensureTrailEl = useCallback((tp: TrailPoint) => {
    if (tp.el) return;
    const el = document.createElement('div');
    el.style.position = 'absolute';
    el.style.width = '8px';
    el.style.height = '8px';
    el.style.borderRadius = '50%';
    el.style.background = 'radial-gradient(circle, rgba(170,255,200,0.6) 0%, transparent 70%)';
    el.style.pointerEvents = 'none';
    el.style.willChange = 'transform, opacity';
    tp.el = el;
    trailContainerRef.current?.appendChild(el);
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const dx = e.clientX - prevPosRef.current.x;
      const dy = e.clientY - prevPosRef.current.y;
      prevPosRef.current.x = e.clientX;
      prevPosRef.current.y = e.clientY;
      posRef.current.x = e.clientX;
      posRef.current.y = e.clientY;

      if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
        angleRef.current = Math.atan2(dy, dx);
      }

      // Add trail point for night mode
      if (envRef.current === 'night') {
        const tp: TrailPoint = { x: e.clientX, y: e.clientY, t: Date.now(), el: null };
        ensureTrailEl(tp);
        trailRef.current.push(tp);

        // Cap trail length
        while (trailRef.current.length > MAX_TRAIL) {
          const old = trailRef.current.shift();
          old?.el?.remove();
        }
      }
    };

    const onClick = (e: MouseEvent) => {
      const count = 3 + Math.floor(Math.random() * 2);
      for (let i = 0; i < count; i++) {
        const ang = (Math.PI * 2 / count) * i + Math.random() * 0.5;
        const petal: MicroPetal = {
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(ang) * (3 + Math.random() * 3),
          vy: Math.sin(ang) * (3 + Math.random() * 3),
          rot: Math.random() * 360,
          life: 1,
          el: null,
        };
        ensurePetalEl(petal);
        petalsRef.current.push(petal);
      }

      // Cap petals
      while (petalsRef.current.length > MAX_PETALS) {
        const old = petalsRef.current.shift();
        old?.el?.remove();
      }
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('click', onClick);

    function tick() {
      // Skip work when tab is hidden
      if (document.visibilityState === 'hidden') {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      const isNight = envRef.current === 'night';

      // Update cursor position via transform (GPU-composited)
      if (cursorRef.current) {
        cursorRef.current.style.transform =
          `translate3d(${posRef.current.x - 14}px, ${posRef.current.y - 14}px, 0) rotate(${angleRef.current}rad)`;
      }

      // Update micro-petals
      const petals = petalsRef.current;
      for (let i = petals.length - 1; i >= 0; i--) {
        const p = petals[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15;
        p.life -= 0.05;

        if (p.life <= 0) {
          p.el?.remove();
          petals.splice(i, 1);
          continue;
        }

        if (p.el) {
          p.el.style.transform = `translate3d(${p.x - 6}px, ${p.y - 3}px, 0) rotate(${p.rot}deg)`;
          p.el.style.opacity = String(p.life);
          p.el.style.background = isNight ? 'rgba(170,255,200,0.8)' : 'rgba(245, 180, 30, 0.9)';
        }
      }

      // Update trail points
      const trail = trailRef.current;
      const now = Date.now();
      for (let i = trail.length - 1; i >= 0; i--) {
        const tp = trail[i];
        const age = now - tp.t;

        if (age >= TRAIL_LIFETIME || !isNight) {
          tp.el?.remove();
          trail.splice(i, 1);
          continue;
        }

        if (tp.el) {
          tp.el.style.transform = `translate3d(${tp.x - 4}px, ${tp.y - 4}px, 0)`;
          tp.el.style.opacity = String((1 - age / TRAIL_LIFETIME) * 0.7);
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('click', onClick);
      cancelAnimationFrame(rafRef.current);

      // Clean up DOM elements
      petalsRef.current.forEach(p => p.el?.remove());
      petalsRef.current = [];
      trailRef.current.forEach(tp => tp.el?.remove());
      trailRef.current = [];
    };
  }, [ensurePetalEl, ensureTrailEl]); // Stable — envRef handles env changes

  const isNight = env === 'night';

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 9999 }}>
      {/* Trail container — night mode trail points are appended here */}
      <div ref={trailContainerRef} />

      {/* Petal container — click burst petals are appended here */}
      <div ref={petalContainerRef} />

      {/* Main cursor — positioned via transform in rAF */}
      <div
        ref={cursorRef}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: 28,
          height: 28,
          willChange: 'transform',
          pointerEvents: 'none',
        }}
      >
        {isNight ? (
          // Night: firefly aura
          <div className="relative w-full h-full flex items-center justify-center">
            <div
              className="absolute rounded-full"
              style={{
                width: 24,
                height: 24,
                background: 'radial-gradient(circle, rgba(170,255,200,0.9) 0%, rgba(170,255,200,0.4) 40%, transparent 70%)',
                boxShadow: '0 0 12px rgba(170,255,200,0.6)',
              }}
            />
            <div
              className="absolute rounded-full"
              style={{
                width: 6,
                height: 6,
                background: 'rgba(200, 255, 220, 1)',
                boxShadow: '0 0 6px rgba(170,255,200,1)',
              }}
            />
          </div>
        ) : (
          // Day / Golden: sunflower petal
          <svg viewBox="-20 -20 40 40" width="28" height="28">
            <ellipse cx="0" cy="0" rx="8" ry="18" fill={env === 'day' ? '#F5C842' : '#E8850F'} opacity="0.92" />
            <ellipse cx="0" cy="0" rx="3" ry="7" fill={env === 'day' ? 'rgba(255,240,100,0.6)' : 'rgba(255,180,50,0.5)'} />
          </svg>
        )}
      </div>
    </div>
  );
}
