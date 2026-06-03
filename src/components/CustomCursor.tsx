import { useEffect, useRef, useState } from 'react';
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
  id: number;
}

export default function CustomCursor({ env }: Props) {
  const posRef = useRef({ x: -100, y: -100 });
  const velRef = useRef({ x: 0, y: 0 });
  const prevPosRef = useRef({ x: -100, y: -100 });
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [angle, setAngle] = useState(0);
  const [micropetals, setMicropetals] = useState<MicroPetal[]>([]);
  const [trailPoints, setTrailPoints] = useState<Array<{ x: number; y: number; t: number }>>([]);
  const counterRef = useRef(0);
  const rafRef = useRef(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const dx = e.clientX - prevPosRef.current.x;
      const dy = e.clientY - prevPosRef.current.y;
      velRef.current = { x: dx, y: dy };
      prevPosRef.current = { x: e.clientX, y: e.clientY };
      posRef.current = { x: e.clientX, y: e.clientY };

      if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
        setAngle(Math.atan2(dy, dx));
      }

      if (env === 'night') {
        setTrailPoints(prev => [
          ...prev.slice(-12),
          { x: e.clientX, y: e.clientY, t: Date.now() },
        ]);
      }
    };

    const onClick = (e: MouseEvent) => {
      const count = 3 + Math.floor(Math.random() * 2);
      const newPetals: MicroPetal[] = [];
      for (let i = 0; i < count; i++) {
        const ang = (Math.PI * 2 / count) * i + Math.random() * 0.5;
        newPetals.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(ang) * (3 + Math.random() * 3),
          vy: Math.sin(ang) * (3 + Math.random() * 3),
          rot: Math.random() * 360,
          life: 1,
          id: counterRef.current++,
        });
      }
      setMicropetals(prev => [...prev, ...newPetals]);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('click', onClick);

    function tick() {
      setPos({ ...posRef.current });
      setMicropetals(prev =>
        prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.15,
            life: p.life - 0.05,
          }))
          .filter(p => p.life > 0)
      );
      setTrailPoints(prev =>
        prev.filter(pt => Date.now() - pt.t < 600)
      );
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('click', onClick);
      cancelAnimationFrame(rafRef.current);
    };
  }, [env]);

  const isNight = env === 'night';

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 9999 }}>
      {/* Night trail */}
      {isNight && trailPoints.map((pt, i) => {
        const age = (Date.now() - pt.t) / 600;
        return (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: pt.x - 4,
              top: pt.y - 4,
              width: 8,
              height: 8,
              background: 'radial-gradient(circle, rgba(170,255,200,0.6) 0%, transparent 70%)',
              opacity: (1 - age) * 0.7,
              transform: 'translate(0,0)',
              pointerEvents: 'none',
            }}
          />
        );
      })}

      {/* Micro petals on click */}
      {micropetals.map(p => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left: p.x - 6,
            top: p.y - 3,
            width: 12,
            height: 6,
            background: isNight ? 'rgba(170,255,200,0.8)' : 'rgba(245, 180, 30, 0.9)',
            borderRadius: '50%',
            opacity: p.life,
            transform: `rotate(${p.rot}deg)`,
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* Main cursor */}
      <div
        style={{
          position: 'absolute',
          left: pos.x - 14,
          top: pos.y - 14,
          width: 28,
          height: 28,
          transform: `rotate(${angle}rad)`,
          transition: 'transform 0.05s ease',
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
