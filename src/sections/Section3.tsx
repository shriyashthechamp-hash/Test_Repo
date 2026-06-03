import { useState, useRef, useEffect } from 'react';
import { OBSERVATION_CARDS } from '../types';

interface CardProps {
  card: typeof OBSERVATION_CARDS[0];
  index: number;
}

function ObservationCard({ card, index }: CardProps) {
  const [flipped, setFlipped] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [easterShown, setEasterShown] = useState(false);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const rotation = hovered ? 0 : card.rotation;
  const transX = hovered ? 0 : card.offsetX;

  return (
    <div
      ref={ref}
      className="card-3d-wrapper inline-block"
      style={{
        width: '200px',
        height: '220px',
        margin: '10px',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.6s ease ${index * 0.06}s, transform 0.6s ease ${index * 0.06}s`,
      }}
    >
      <div
        className={`card-3d-inner ${flipped ? 'flipped' : ''}`}
        style={{ cursor: 'none' }}
      >
        {/* Front face */}
        <div
          className="card-face"
          style={{
            transform: `rotate(${rotation}deg) translateX(${transX}px)`,
            transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={() => setFlipped(true)}
        >
          <div
            className="w-full h-full p-5 rounded-xl flex flex-col justify-between"
            style={{
              background: 'linear-gradient(145deg, #FFF9ED 0%, #FFF3CC 60%, #FFEAA0 100%)',
              boxShadow: hovered
                ? '0 12px 40px rgba(245, 160, 0, 0.25), 0 4px 16px rgba(0,0,0,0.15)'
                : '2px 4px 12px rgba(0,0,0,0.2)',
              border: '1px solid rgba(232, 184, 48, 0.4)',
            }}
          >
            {/* Small sunflower decoration */}
            <div className="flex justify-end">
              <svg width="18" height="18" viewBox="0 0 18 18">
                <circle cx="9" cy="9" r="3" fill="#584400" />
                {Array.from({ length: 8 }).map((_, i) => {
                  const a = (Math.PI * 2 / 8) * i;
                  return (
                    <ellipse
                      key={i}
                      cx={9 + Math.cos(a) * 5.5}
                      cy={9 + Math.sin(a) * 5.5}
                      rx="2"
                      ry="0.8"
                      transform={`rotate(${i * 45} ${9 + Math.cos(a) * 5.5} ${9 + Math.sin(a) * 5.5})`}
                      fill="#E8B830"
                      opacity="0.9"
                    />
                  );
                })}
              </svg>
            </div>

            <p
              style={{
                fontFamily: "'Caveat', cursive",
                fontSize: '1rem',
                color: '#3d2800',
                lineHeight: 1.5,
                fontWeight: 500,
                flex: 1,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {card.text}
            </p>

            <p
              className="text-xs mt-2"
              style={{
                fontFamily: "'Inter', sans-serif",
                color: 'rgba(88, 68, 0, 0.4)',
                fontSize: '0.65rem',
                letterSpacing: '0.1em',
              }}
            >
              tap to turn
            </p>
          </div>
        </div>

        {/* Back face */}
        <div
          className="card-face card-face-back"
          onClick={() => { setFlipped(false); setEasterShown(false); }}
        >
          <div
            className="w-full h-full p-5 rounded-xl flex flex-col items-center justify-center gap-3"
            style={{
              background: 'linear-gradient(145deg, #3d2800 0%, #584400 100%)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
              border: '1px solid rgba(245, 200, 66, 0.3)',
            }}
          >
            {/* Sunflower illustration */}
            <svg width="52" height="52" viewBox="0 0 52 52">
              <circle cx="26" cy="26" r="9" fill="#584400" />
              {Array.from({ length: 12 }).map((_, i) => {
                const a = (Math.PI * 2 / 12) * i;
                return (
                  <ellipse
                    key={i}
                    cx={26 + Math.cos(a) * 16}
                    cy={26 + Math.sin(a) * 16}
                    rx="5"
                    ry="2"
                    transform={`rotate(${i * 30} ${26 + Math.cos(a) * 16} ${26 + Math.sin(a) * 16})`}
                    fill="#F5C842"
                  />
                );
              })}
              <circle cx="26" cy="26" r="8" fill="#3d2800" />
            </svg>

            <p
              style={{
                fontFamily: "'Caveat', cursive",
                fontSize: '1.5rem',
                color: '#F5C842',
                letterSpacing: '0.15em',
                fontWeight: 600,
              }}
            >
              noticed.
            </p>

            {/* Easter Egg 3 on back of card */}
            {card.id === 10 && (
              <button
                className="absolute bottom-3 left-3 opacity-0 hover:opacity-100 transition-opacity text-xs"
                style={{ color: 'rgba(245,200,66,0.5)', fontFamily: "'Caveat', cursive", cursor: 'none' }}
                onClick={e => { e.stopPropagation(); setEasterShown(true); }}
              >
                ✦
              </button>
            )}

            {easterShown && (
              <div
                className="absolute inset-2 rounded-lg p-3 flex items-center justify-center"
                style={{ background: 'rgba(20,10,0,0.9)', border: '1px solid rgba(245,200,66,0.3)' }}
              >
                <p style={{ fontFamily: "'Caveat', cursive", color: '#F5C842', fontSize: '0.9rem', textAlign: 'center', lineHeight: 1.4 }}>
                  [ EASTER EGG TEXT PLACEHOLDER 3 ]
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Section3() {
  return (
    <section
      className="relative py-24 px-4"
      style={{ zIndex: 2 }}
    >
      <div className="max-w-5xl mx-auto">
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
            Things I Never Told You
          </h2>
          <p
            className="mt-3"
            style={{ fontFamily: "'Caveat', cursive", fontSize: '1.2rem', color: 'rgba(245,200,66,0.6)' }}
          >
            20 things I kept to myself. Until now.
          </p>
        </div>

        {/* Masonry-style floating grid */}
        <div
          className="flex flex-wrap justify-center"
          style={{ gap: '0' }}
        >
          {OBSERVATION_CARDS.map((card, i) => (
            <ObservationCard key={card.id} card={card} index={i} />
          ))}
        </div>

        <p
          className="text-center mt-10"
          style={{
            fontFamily: "'Caveat', cursive",
            fontSize: '1rem',
            color: 'rgba(245,200,66,0.35)',
          }}
        >
          tap any card to turn it over
        </p>
      </div>
    </section>
  );
}
