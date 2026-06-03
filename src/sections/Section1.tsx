import { useEffect, useState, useRef } from 'react';

interface Props {
  onBegin: () => void;
  isActive: boolean;
}

const TEXT_SEQUENCE = [
  { text: 'Hi Aaashi.', delay: 600 },
  { text: "Since I couldn't celebrate with you in person...", delay: 2100 },
  { text: "I built a little place where I kept some of my favourite memories.", delay: 5200 },
];

function useTypewriter(text: string, active: boolean, speed = 42) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const iRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!active) return;
    iRef.current = 0;
    setDisplayed('');
    setDone(false);

    function type() {
      if (iRef.current < text.length) {
        iRef.current++;
        setDisplayed(text.slice(0, iRef.current));
        timerRef.current = setTimeout(type, speed);
      } else {
        setDone(true);
      }
    }
    timerRef.current = setTimeout(type, speed);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [text, active, speed]);

  return { displayed, done };
}

function TypeLine({
  text,
  active,
  className,
}: {
  text: string;
  active: boolean;
  className?: string;
}) {
  const { displayed, done } = useTypewriter(text, active);
  return (
    <span className={className}>
      {displayed}
      {active && !done && <span className="typewriter-cursor" />}
    </span>
  );
}

export default function Section1({ onBegin, isActive }: Props) {
  const [step, setStep] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const [easterEggVisible, setEasterEggVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (!isActive) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setStep(1), TEXT_SEQUENCE[0].delay));
    timers.push(setTimeout(() => setStep(2), TEXT_SEQUENCE[1].delay + 1200));
    timers.push(setTimeout(() => setStep(3), TEXT_SEQUENCE[2].delay + 1500));
    timers.push(setTimeout(() => setShowButton(true), TEXT_SEQUENCE[2].delay + 4500));
    return () => timers.forEach(clearTimeout);
  }, [isActive]);

  const handleBegin = () => {
    setExiting(true);
    setTimeout(onBegin, 2600);
  };

  return (
    <section
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden"
      style={{ zIndex: 2 }}
    >
      {/* Collage background */}
      <div
        className={`absolute inset-0 ${exiting ? 'collage-exit' : ''}`}
        style={{
          backgroundImage: `url('/ChatGPT_Image_Jun_3,_2026,_12_46_04_PM.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Dark vignette overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.55) 70%, rgba(0,0,0,0.8) 100%)',
          }}
        />
        {/* Warm golden tint */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, rgba(139,100,0,0.08) 0%, rgba(80,40,0,0.3) 100%)',
          }}
        />
      </div>

      {/* Easter Egg 1 - hidden in collage zone */}
      <button
        className="absolute top-8 right-8 w-10 h-10 rounded-full z-10 opacity-0 hover:opacity-100 transition-opacity duration-700"
        style={{ cursor: 'none' }}
        onClick={() => setEasterEggVisible(true)}
        aria-label="Easter egg"
      >
        <div
          className="w-full h-full rounded-full"
          style={{ background: 'rgba(245,200,66,0.15)', border: '1px dashed rgba(245,200,66,0.3)' }}
        />
      </button>

      {easterEggVisible && (
        <div
          className="absolute top-16 right-6 z-20 px-5 py-4 rounded-2xl max-w-xs"
          style={{
            background: 'rgba(20,10,0,0.85)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(245,200,66,0.3)',
          }}
        >
          <p
            className="text-lg text-center"
            style={{ fontFamily: "'Caveat', cursive", color: '#F5C842', lineHeight: 1.5 }}
          >
            [ EASTER EGG TEXT PLACEHOLDER 1 ]
          </p>
          <button
            className="absolute top-2 right-3 text-xs opacity-50 hover:opacity-100 transition-opacity"
            style={{ color: '#F5C842', fontFamily: "'Inter', sans-serif" }}
            onClick={() => setEasterEggVisible(false)}
          >
            ×
          </button>
        </div>
      )}

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-6 text-center max-w-2xl">
        <div className="flex flex-col gap-5">
          <div
            className="transition-all duration-700"
            style={{
              opacity: step >= 1 ? 1 : 0,
              transform: step >= 1 ? 'translateY(0)' : 'translateY(12px)',
            }}
          >
            <p
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(2rem, 5vw, 3.2rem)',
                color: '#FFF8E7',
                fontStyle: 'italic',
                textShadow: '0 2px 20px rgba(0,0,0,0.6)',
                lineHeight: 1.2,
              }}
            >
              {step >= 1 && <TypeLine text="Hi Aaashi." active={step === 1} />}
            </p>
          </div>

          <div
            className="transition-all duration-700"
            style={{
              opacity: step >= 2 ? 1 : 0,
              transform: step >= 2 ? 'translateY(0)' : 'translateY(12px)',
              transitionDelay: '0.1s',
            }}
          >
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
                color: 'rgba(255, 248, 231, 0.85)',
                fontWeight: 300,
                textShadow: '0 1px 12px rgba(0,0,0,0.5)',
                letterSpacing: '0.01em',
                lineHeight: 1.7,
              }}
            >
              {step >= 2 && (
                <TypeLine
                  text="Since I couldn't celebrate with you in person..."
                  active={step === 2}
                />
              )}
            </p>
          </div>

          <div
            className="transition-all duration-700"
            style={{
              opacity: step >= 3 ? 1 : 0,
              transform: step >= 3 ? 'translateY(0)' : 'translateY(12px)',
              transitionDelay: '0.15s',
            }}
          >
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 'clamp(0.95rem, 2.2vw, 1.15rem)',
                color: 'rgba(255, 248, 231, 0.8)',
                fontWeight: 300,
                textShadow: '0 1px 12px rgba(0,0,0,0.5)',
                letterSpacing: '0.01em',
                lineHeight: 1.7,
              }}
            >
              {step >= 3 && (
                <TypeLine
                  text="I built a little place where I kept some of my favourite memories."
                  active={step === 3}
                />
              )}
            </p>
          </div>
        </div>

        {/* Begin button */}
        <div
          className="transition-all duration-1000"
          style={{
            opacity: showButton ? 1 : 0,
            transform: showButton ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.95)',
          }}
        >
          <button
            onClick={handleBegin}
            className="group relative px-10 py-3.5 rounded-full transition-all duration-400 overflow-hidden"
            style={{
              background: 'rgba(245, 200, 66, 0.1)',
              border: '1px solid rgba(245, 200, 66, 0.5)',
              color: '#F5C842',
              fontFamily: "'Caveat', cursive",
              fontSize: '1.3rem',
              letterSpacing: '0.12em',
              fontWeight: 600,
              boxShadow: '0 0 30px rgba(245, 200, 66, 0.08)',
            }}
          >
            <span
              className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-400"
              style={{ background: 'rgba(245, 200, 66, 0.12)' }}
            />
            <span className="relative">Begin</span>
          </button>
        </div>

        {/* Scroll hint */}
        {showButton && (
          <div
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            style={{ animation: 'fadeIn 1s ease 0.5s both' }}
          >
            <div
              className="w-5 h-8 rounded-full border flex items-start justify-center pt-1.5"
              style={{ borderColor: 'rgba(245,200,66,0.3)' }}
            >
              <div
                className="w-1 h-2 rounded-full"
                style={{
                  background: 'rgba(245,200,66,0.6)',
                  animation: 'fadeInUp 1.5s ease infinite',
                }}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
