import { useEffect, useRef, useState } from 'react';
import { MILESTONES } from '../types';
import type { Milestone } from '../types';

function ImagePlaceholder({ label, size = 'md' }: { label: string; size?: 'md' | 'lg' }) {
  const dim = size === 'lg' ? 'w-64 h-64' : 'w-48 h-48';
  return (
    <div className={`${dim} img-placeholder rounded-xl flex-shrink-0`}>
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="8" r="3" fill="#E8B830" />
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (Math.PI * 2 / 8) * i;
          return (
            <ellipse
              key={i}
              cx={16 + Math.cos(a) * 6}
              cy={8 + Math.sin(a) * 6}
              rx="2.5"
              ry="1"
              transform={`rotate(${(i * 45)}deg)`}
              fill="#F5C842"
              opacity="0.8"
            />
          );
        })}
        <line x1="16" y1="11" x2="16" y2="24" stroke="#546438" strokeWidth="2" />
      </svg>
      <span style={{ fontFamily: "'Caveat', cursive", fontSize: '0.85rem', color: '#8B6914', textAlign: 'center', padding: '0 8px' }}>
        {label}
      </span>
    </div>
  );
}

interface BloomModalProps {
  milestone: Milestone;
  onClose: () => void;
}

function BloomModal({ milestone, onClose }: BloomModalProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 350);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(10, 5, 0, 0.7)', backdropFilter: 'blur(6px)' }}
      onClick={handleClose}
    >
      <div
        className="relative max-w-md w-full p-8 rounded-3xl"
        style={{
          background: 'linear-gradient(135deg, rgba(40,20,5,0.95) 0%, rgba(60,30,5,0.95) 100%)',
          border: '1px solid rgba(245, 200, 66, 0.3)',
          boxShadow: '0 0 60px rgba(245, 160, 0, 0.15), 0 20px 60px rgba(0,0,0,0.5)',
          transform: visible ? 'scale(1) translateY(0)' : 'scale(0.85) translateY(20px)',
          opacity: visible ? 1 : 0,
          transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Sunflower decoration */}
        <div className="absolute -top-5 left-1/2 -translate-x-1/2">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: '#F5C842', boxShadow: '0 0 20px rgba(245,200,66,0.5)' }}
          >
            <svg width="22" height="22" viewBox="0 0 22 22">
              <circle cx="11" cy="11" r="4" fill="#584400" />
              {Array.from({ length: 8 }).map((_, i) => {
                const a = (Math.PI * 2 / 8) * i - Math.PI / 2;
                return (
                  <ellipse
                    key={i}
                    cx={11 + Math.cos(a) * 7}
                    cy={11 + Math.sin(a) * 7}
                    rx="3"
                    ry="1.3"
                    transform={`rotate(${i * 45} ${11 + Math.cos(a) * 7} ${11 + Math.sin(a) * 7})`}
                    fill="#584400"
                  />
                );
              })}
            </svg>
          </div>
        </div>

        <div className="text-center mt-4">
          <p
            className="text-xs mb-1 tracking-widest uppercase"
            style={{ fontFamily: "'Inter', sans-serif", color: 'rgba(245,200,66,0.55)', fontWeight: 400 }}
          >
            {milestone.date}
          </p>
          <h3
            className="text-2xl mb-4 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif", color: '#FFF8E7', fontStyle: 'italic' }}
          >
            {milestone.title}
          </h3>

          <div className="flex justify-center mb-5">
            <ImagePlaceholder label={`Photo — ${milestone.title}`} size="lg" />
          </div>

          {milestone.memory && (
            <p
              className="text-xl leading-relaxed"
              style={{ fontFamily: "'Caveat', cursive", color: 'rgba(255,248,231,0.8)', fontWeight: 400 }}
            >
              "{milestone.memory}"
            </p>
          )}
        </div>

        <button
          onClick={handleClose}
          className="absolute top-4 right-5 text-2xl leading-none transition-opacity duration-200 hover:opacity-100 opacity-50"
          style={{ color: '#F5C842', fontFamily: "'Inter', sans-serif" }}
        >
          ×
        </button>
      </div>
    </div>
  );
}

interface MilestoneNodeProps {
  milestone: Milestone;
  index: number;
  progress: number;
  onOpen: (m: Milestone) => void;
}

function MilestoneNode({ milestone, index, progress, onOpen }: MilestoneNodeProps) {
  const nodeProgress = (progress * MILESTONES.length - index) / 1;
  const visible = nodeProgress > 0;
  const scale = Math.min(1, nodeProgress);
  const isLeft = index % 2 === 0;

  return (
    <div
      className="relative flex items-center"
      style={{
        justifyContent: isLeft ? 'flex-start' : 'flex-end',
        paddingLeft: isLeft ? 0 : '50%',
        paddingRight: isLeft ? '50%' : 0,
        marginBottom: '3rem',
      }}
    >
      {/* Connector dot on stem */}
      <div
        className="absolute left-1/2 -translate-x-1/2 w-5 h-5 rounded-full z-10"
        style={{
          background: visible ? '#F5C842' : 'rgba(245,200,66,0.2)',
          border: '2px solid rgba(245,200,66,0.6)',
          boxShadow: visible ? '0 0 12px rgba(245,200,66,0.5)' : 'none',
          transform: `translateX(-50%) scale(${scale})`,
          transition: 'all 0.5s ease',
        }}
      />

      {/* Content card */}
      <div
        className="relative max-w-xs"
        style={{
          opacity: visible ? 1 : 0,
          transform: `translateX(${visible ? 0 : isLeft ? -20 : 20}px) scale(${scale})`,
          transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
          marginLeft: isLeft ? '1rem' : 0,
          marginRight: isLeft ? 0 : '1rem',
        }}
      >
        <button
          onClick={() => onOpen(milestone)}
          className="group w-full p-4 rounded-2xl text-left transition-all duration-300 hover:scale-105"
          style={{
            background: 'rgba(40, 20, 5, 0.6)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(245, 200, 66, 0.2)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          }}
        >
          <div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: 'rgba(245, 200, 66, 0.05)' }}
          />
          <p
            className="text-xs mb-1 tracking-widest uppercase"
            style={{ fontFamily: "'Inter', sans-serif", color: 'rgba(245,200,66,0.55)', fontWeight: 400 }}
          >
            {milestone.date}
          </p>
          <p
            className="text-lg leading-snug"
            style={{ fontFamily: "'Caveat', cursive", color: '#FFF8E7', fontWeight: 600 }}
          >
            {milestone.title}
          </p>
          {milestone.memory && (
            <p
              className="text-sm mt-1 leading-relaxed"
              style={{ fontFamily: "'Inter', sans-serif", color: 'rgba(255,248,231,0.55)', fontWeight: 300 }}
            >
              {milestone.memory.length > 60 ? milestone.memory.slice(0, 60) + '...' : milestone.memory}
            </p>
          )}
          <p
            className="text-xs mt-2 opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ fontFamily: "'Caveat', cursive", color: '#F5C842' }}
          >
            tap to bloom →
          </p>
        </button>
      </div>
    </div>
  );
}

interface Props {
  isActive: boolean;
}

export default function Section2({ isActive }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [openMilestone, setOpenMilestone] = useState<Milestone | null>(null);
  const [easterEggVisible, setEasterEggVisible] = useState(false);

  useEffect(() => {
    let rafId: number | null = null;
    let lastProgress = -1;

    const onScroll = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          rafId = null;
          const el = sectionRef.current;
          if (!el) return;
          const rect = el.getBoundingClientRect();
          const sectionHeight = el.offsetHeight - window.innerHeight;
          if (sectionHeight <= 0) return;
          const scrolled = -rect.top;
          const progress = Math.max(0, Math.min(1, scrolled / sectionHeight));
          
          // Only update state if change is significant or hit boundary
          const diff = Math.abs(progress - lastProgress);
          if (diff > 0.001 || (progress === 0 && lastProgress !== 0) || (progress === 1 && lastProgress !== 1)) {
            setScrollProgress(progress);
            lastProgress = progress;
          }
        });
      }
    };
    onScroll();

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  const stemHeight = scrollProgress * 100;

  return (
    <section
      ref={sectionRef}
      className="relative py-20"
      style={{ minHeight: '280vh', zIndex: 2 }}
    >
      <div className="sticky top-0 h-screen overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
        <div className="absolute inset-0 flex items-start justify-center pt-16">
          <h2
            className="text-center"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              color: '#FFF8E7',
              fontStyle: 'italic',
              textShadow: '0 2px 20px rgba(0,0,0,0.5)',
              opacity: isActive ? 1 : 0,
              transition: 'opacity 1s ease',
            }}
          >
            Our Story
          </h2>
        </div>
      </div>

      <div className="relative max-w-2xl mx-auto px-4 pt-32 pointer-events-auto" style={{ zIndex: 2 }}>
        <div className="text-center mb-16">
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              color: '#FFF8E7',
              fontStyle: 'italic',
              textShadow: '0 2px 20px rgba(0,0,0,0.5)',
            }}
          >
            Our Story
          </h2>
          <p
            className="mt-2"
            style={{ fontFamily: "'Caveat', cursive", fontSize: '1.15rem', color: 'rgba(245,200,66,0.65)' }}
          >
            A garden of moments, grown from the ground up.
          </p>
        </div>

        {/* Timeline stem SVG */}
        <div className="absolute left-1/2 top-40 bottom-0 w-1 -translate-x-1/2" style={{ zIndex: 0 }}>
          <svg
            width="4"
            height="100%"
            viewBox="0 0 4 2000"
            preserveAspectRatio="none"
            style={{ width: '4px', height: '100%' }}
          >
            <line
              x1="2" y1="0" x2="2" y2="2000"
              stroke="rgba(84, 100, 56, 0.3)"
              strokeWidth="3"
            />
            <line
              x1="2" y1="0" x2="2" y2={`${stemHeight * 20}`}
              stroke="#546438"
              strokeWidth="3"
              strokeLinecap="round"
              style={{ filter: 'drop-shadow(0 0 4px rgba(84,100,56,0.6))' }}
            />
          </svg>
        </div>

        {/* Easter Egg 2 - at corner junction of timeline */}
        <div className="relative">
          <button
            className="absolute -right-4 top-0 w-6 h-6 rounded-full z-10 opacity-0 hover:opacity-100 transition-opacity duration-500"
            style={{ cursor: 'none' }}
            onClick={() => setEasterEggVisible(true)}
          >
            <div className="w-full h-full rounded-full" style={{ background: 'rgba(245,200,66,0.1)' }} />
          </button>
        </div>

        {easterEggVisible && (
          <div
            className="fixed top-1/2 right-6 z-50 -translate-y-1/2 px-5 py-4 rounded-2xl max-w-xs"
            style={{
              background: 'rgba(20,10,0,0.9)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(245,200,66,0.3)',
            }}
          >
            <p
              className="text-lg text-center"
              style={{ fontFamily: "'Caveat', cursive", color: '#F5C842', lineHeight: 1.5 }}
            >
              [ EASTER EGG TEXT PLACEHOLDER 2 ]
            </p>
            <button
              className="absolute top-2 right-3 text-xs opacity-50 hover:opacity-100"
              style={{ color: '#F5C842' }}
              onClick={() => setEasterEggVisible(false)}
            >
              ×
            </button>
          </div>
        )}

        {/* Milestones */}
        <div className="relative pt-8">
          {MILESTONES.map((m, i) => (
            <MilestoneNode
              key={m.id}
              milestone={m}
              index={i}
              progress={scrollProgress}
              onOpen={setOpenMilestone}
            />
          ))}
        </div>

        {/* End bloom */}
        <div className="flex justify-center mt-12 mb-8">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{
              background: 'rgba(245,200,66,0.15)',
              border: '2px solid rgba(245,200,66,0.4)',
              opacity: scrollProgress > 0.85 ? 1 : 0,
              transition: 'opacity 0.6s ease',
            }}
          >
            <span style={{ fontSize: '1.4rem' }}>🌻</span>
          </div>
        </div>
      </div>

      {openMilestone && (
        <BloomModal milestone={openMilestone} onClose={() => setOpenMilestone(null)} />
      )}
    </section>
  );
}
