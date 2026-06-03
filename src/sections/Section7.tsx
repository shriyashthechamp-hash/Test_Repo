import { useEffect, useRef, useState } from 'react';

const LINES = [
  "Thank you for being my favourite story.",
  "Happy Birthday, Aaashi.",
  "If I could choose again...",
  "I'd still choose you.",
  "Every single time.",
];

interface Petal {
  id: number;
  x: number;
  y: number;
  driftX: number;
  driftY: number;
  driftRot: number;
  size: number;
  delay: number;
}

export default function Section7() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [currentLine, setCurrentLine] = useState(-1);
  const [petalsDrifting, setPetalsDrifting] = useState(false);
  const [petals, setPetals] = useState<Petal[]>([]);
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !inView) setInView(true);
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [inView]);

  useEffect(() => {
    if (!inView) return;

    const timers: ReturnType<typeof setTimeout>[] = [];
    // 3s silence, then lines
    timers.push(setTimeout(() => setCurrentLine(0), 3000));
    timers.push(setTimeout(() => setCurrentLine(1), 7000));
    timers.push(setTimeout(() => setCurrentLine(2), 11000));
    timers.push(setTimeout(() => setCurrentLine(3), 14000));
    timers.push(setTimeout(() => setCurrentLine(4), 17000));

    // Petals scatter
    timers.push(setTimeout(() => {
      const newPetals: Petal[] = Array.from({ length: 24 }).map((_, i) => ({
        id: i,
        x: 35 + Math.random() * 30,
        y: 40 + Math.random() * 20,
        driftX: (Math.random() - 0.5) * 300,
        driftY: 100 + Math.random() * 200,
        driftRot: (Math.random() - 0.5) * 720,
        size: 8 + Math.random() * 12,
        delay: Math.random() * 1500,
      }));
      setPetals(newPetals);
      setPetalsDrifting(true);
    }, 20000));

    timers.push(setTimeout(() => setCleared(true), 23000));

    return () => timers.forEach(clearTimeout);
  }, [inView]);

  return (
    <section
      ref={sectionRef}
      className="relative flex flex-col items-center justify-center px-6 text-center"
      style={{ zIndex: 2, minHeight: '100vh' }}
    >
      {/* Large centerpiece sunflower */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{
          opacity: inView ? 0.08 : 0,
          transform: inView ? 'scale(1)' : 'scale(0.6)',
          transition: 'all 3s ease',
        }}
      >
        <svg width="500" height="500" viewBox="0 0 500 500">
          <circle cx="250" cy="250" r="55" fill="#584400" />
          {Array.from({ length: 18 }).map((_, i) => {
            const a = (Math.PI * 2 / 18) * i;
            return (
              <ellipse
                key={i}
                cx={250 + Math.cos(a) * 140}
                cy={250 + Math.sin(a) * 140}
                rx="50"
                ry="20"
                transform={`rotate(${i * 20} ${250 + Math.cos(a) * 140} ${250 + Math.sin(a) * 140})`}
                fill="#F5C842"
                opacity="0.9"
              />
            );
          })}
          <circle cx="250" cy="250" r="50" fill="#3d2800" />
          {Array.from({ length: 18 }).map((_, i) => {
            const a = (Math.PI * 2 / 18) * i;
            return (
              <circle
                key={i}
                cx={250 + Math.cos(a) * 28}
                cy={250 + Math.sin(a) * 28}
                r="5"
                fill="rgba(245,200,66,0.3)"
              />
            );
          })}
        </svg>
      </div>

      {/* Drifting petals */}
      {petalsDrifting && petals.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size * 0.4,
            background: 'rgba(245, 180, 30, 0.7)',
            borderRadius: '50%',
            '--drift-x': `${p.driftX}px`,
            '--drift-y': `${p.driftY}px`,
            '--drift-rot': `${p.driftRot}deg`,
            animation: `petalDrift 3s ease forwards`,
            animationDelay: `${p.delay}ms`,
          } as React.CSSProperties}
        />
      ))}

      {/* Text lines */}
      <div
        className="relative flex flex-col items-center gap-6 z-10"
        style={{
          opacity: cleared ? 0 : 1,
          transition: 'opacity 2s ease',
        }}
      >
        {/* 3s silence indicator */}
        {inView && currentLine === -1 && (
          <div
            className="flex gap-2"
            style={{ animation: 'fadeIn 1s ease both' }}
          >
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: 'rgba(245,200,66,0.4)',
                  animation: `fireflyPulse 1.2s ease ${i * 0.4}s infinite`,
                }}
              />
            ))}
          </div>
        )}

        {LINES.map((line, i) => (
          <p
            key={i}
            className="transition-all duration-1000"
            style={{
              fontFamily: i === 1
                ? "'Playfair Display', serif"
                : "'Caveat', cursive",
              fontSize: i === 1
                ? 'clamp(2rem, 5vw, 3.5rem)'
                : i === 0
                ? 'clamp(1.2rem, 3vw, 1.8rem)'
                : 'clamp(1.5rem, 4vw, 2.5rem)',
              color: i === 1 ? '#F5C842' : '#FFF8E7',
              fontStyle: i === 1 ? 'italic' : 'normal',
              fontWeight: i === 1 ? 600 : i === 4 ? 700 : 400,
              textShadow: '0 2px 30px rgba(0,0,0,0.6)',
              opacity: currentLine >= i ? 1 : 0,
              transform: currentLine >= i ? 'translateY(0)' : 'translateY(16px)',
              letterSpacing: i === 4 ? '0.04em' : 'normal',
            }}
          >
            {line}
          </p>
        ))}
      </div>

      {/* Final cleared state */}
      {cleared && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ animation: 'fadeIn 2s ease both', background: 'transparent' }}
        >
          <div className="flex flex-col items-center gap-4">
            <svg width="60" height="60" viewBox="0 0 60 60" style={{ animation: 'scaleIn 1s ease both' }}>
              <circle cx="30" cy="30" r="10" fill="#F5C842" />
              {Array.from({ length: 12 }).map((_, i) => {
                const a = (Math.PI * 2 / 12) * i;
                return (
                  <ellipse
                    key={i}
                    cx={30 + Math.cos(a) * 18}
                    cy={30 + Math.sin(a) * 18}
                    rx="6"
                    ry="2.5"
                    transform={`rotate(${i * 30} ${30 + Math.cos(a) * 18} ${30 + Math.sin(a) * 18})`}
                    fill="#E8B830"
                  />
                );
              })}
              <circle cx="30" cy="30" r="9" fill="#3d2800" />
            </svg>
            <p
              style={{
                fontFamily: "'Caveat', cursive",
                fontSize: '1.3rem',
                color: 'rgba(245,200,66,0.5)',
              }}
            >
              with love
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
