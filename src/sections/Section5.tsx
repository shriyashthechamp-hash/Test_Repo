import { useState, useRef, useEffect } from 'react';

type Stage = 'sealed' | 'breaking' | 'opening' | 'open' | 'unlocked';

function WaxSeal({ breaking }: { breaking: boolean }) {
  return (
    <div
      className="absolute left-1/2 -translate-x-1/2"
      style={{
        bottom: '-20px',
        zIndex: 5,
        animation: breaking ? 'sealBreak 0.6s ease forwards' : 'none',
      }}
    >
      <div
        className="relative flex items-center justify-center rounded-full"
        style={{
          width: 52,
          height: 52,
          background: 'radial-gradient(circle, #C1440E 0%, #8B2000 60%, #5a1000 100%)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.4), inset 0 1px 4px rgba(255,100,50,0.3)',
        }}
      >
        <svg width="28" height="28" viewBox="0 0 28 28">
          <circle cx="14" cy="14" r="5" fill="#E8B830" />
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (Math.PI * 2 / 8) * i;
            return (
              <ellipse
                key={i}
                cx={14 + Math.cos(a) * 9}
                cy={14 + Math.sin(a) * 9}
                rx="3.5"
                ry="1.4"
                transform={`rotate(${i * 45} ${14 + Math.cos(a) * 9} ${14 + Math.sin(a) * 9})`}
                fill="#F5C842"
                opacity="0.9"
              />
            );
          })}
          <circle cx="14" cy="14" r="4" fill="#3d2800" />
        </svg>
      </div>
    </div>
  );
}

export default function Section5() {
  const [stage, setStage] = useState<Stage>('sealed');
  const [inputValue, setInputValue] = useState('');
  const [shake, setShake] = useState(false);
  const [typedLetter, setTypedLetter] = useState('');
  const [typingDone, setTypingDone] = useState(false);
  const [easterVisible, setEasterVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const letterText = "Dear Aaashi, I tried writing this. I really did. But every version felt incomplete. Because some things are too important to leave on paper. So I tried singing it instead.";

  const handleSealClick = () => {
    if (stage !== 'sealed') return;
    setStage('breaking');
    setTimeout(() => setStage('opening'), 600);
    setTimeout(() => setStage('open'), 1600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.toLowerCase().trim() === 'love') {
      setStage('unlocked');
      // Typewriter effect for letter
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setTypedLetter(letterText.slice(0, i));
        if (i >= letterText.length) {
          clearInterval(interval);
          setTypingDone(true);
        }
      }, 28);
    } else {
      setShake(true);
      setInputValue('');
      setTimeout(() => setShake(false), 600);
    }
  };

  useEffect(() => {
    if (stage === 'open' && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 400);
    }
  }, [stage]);

  return (
    <section
      className="relative py-24 px-4 flex flex-col items-center justify-center"
      style={{ zIndex: 2, minHeight: '80vh' }}
    >
      <div className="max-w-lg w-full flex flex-col items-center gap-10">
        <div className="text-center">
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              color: '#FFF8E7',
              fontStyle: 'italic',
              textShadow: '0 2px 20px rgba(0,0,0,0.5)',
            }}
          >
            One Last Thing
          </h2>
          <p
            className="mt-3"
            style={{ fontFamily: "'Caveat', cursive", fontSize: '1.1rem', color: 'rgba(245,200,66,0.6)' }}
          >
            There's a letter. You'll need the right word to open it.
          </p>
        </div>

        {/* Envelope container */}
        <div
          className="relative w-full"
          style={{ perspective: '800px' }}
        >
          {/* Envelope body */}
          <div
            className={`relative w-full rounded-2xl overflow-visible transition-all duration-700 ${shake ? 'envelope-shake' : ''}`}
            style={{
              background: 'linear-gradient(145deg, #F5E6C0 0%, #EDD9A3 50%, #E5CC80 100%)',
              boxShadow: stage === 'sealed'
                ? '0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.3)'
                : '0 20px 60px rgba(0,0,0,0.3)',
              minHeight: stage === 'unlocked' ? '420px' : '200px',
              transition: 'min-height 0.8s ease, box-shadow 0.5s ease',
            }}
          >
            {/* Envelope decorative lines */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
              {/* Diagonal fold lines */}
              <svg width="100%" height="100%" viewBox="0 0 400 200" preserveAspectRatio="none" className="absolute inset-0">
                <line x1="0" y1="200" x2="200" y2="80" stroke="rgba(180,150,80,0.2)" strokeWidth="1" />
                <line x1="400" y1="200" x2="200" y2="80" stroke="rgba(180,150,80,0.2)" strokeWidth="1" />
              </svg>
            </div>

            {/* Envelope flap */}
            {stage !== 'unlocked' && (
              <div
                className="absolute top-0 left-0 right-0 h-24 rounded-t-2xl overflow-hidden"
                style={{
                  background: 'linear-gradient(180deg, #E8D090 0%, #DCC070 100%)',
                  transformOrigin: 'top center',
                  transform: stage === 'opening' || stage === 'open' ? 'rotateX(-180deg)' : 'rotateX(0deg)',
                  transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                  zIndex: 2,
                  borderBottom: '1px solid rgba(180,150,60,0.3)',
                }}
              >
                <svg width="100%" height="100%" viewBox="0 0 400 96" preserveAspectRatio="none">
                  <path d="M0 0 L200 80 L400 0 Z" fill="rgba(210, 180, 80, 0.4)" />
                </svg>
              </div>
            )}

            {/* Envelope content area */}
            <div className="relative px-8 py-8 pt-16 z-1">
              {(stage === 'sealed' || stage === 'breaking') && (
                <div
                  className="flex flex-col items-center gap-3 cursor-none"
                  onClick={handleSealClick}
                >
                  <p
                    style={{ fontFamily: "'Caveat', cursive", fontSize: '1.2rem', color: '#8B6914', textAlign: 'center' }}
                  >
                    Something I wrote for you.
                  </p>
                  <p
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', color: 'rgba(139,105,20,0.6)', letterSpacing: '0.1em' }}
                  >
                    click to break the seal
                  </p>
                </div>
              )}

              {stage === 'opening' && (
                <div className="flex justify-center py-4">
                  <div
                    className="w-8 h-8 rounded-full border-2 animate-spin"
                    style={{ borderColor: '#E8B830', borderTopColor: 'transparent' }}
                  />
                </div>
              )}

              {stage === 'open' && (
                <div className="flex flex-col items-center gap-5 pt-4">
                  <p
                    style={{ fontFamily: "'Caveat', cursive", fontSize: '1.15rem', color: '#584400', textAlign: 'center', lineHeight: 1.5 }}
                  >
                    What's the one word that holds everything together?
                  </p>
                  <form
                    onSubmit={handleSubmit}
                    className="w-full flex flex-col items-center gap-3"
                  >
                    <input
                      ref={inputRef}
                      value={inputValue}
                      onChange={e => setInputValue(e.target.value)}
                      placeholder="the word..."
                      className="w-48 text-center py-2.5 px-4 rounded-full outline-none text-lg"
                      style={{
                        fontFamily: "'Caveat', cursive",
                        background: 'rgba(255,248,220,0.8)',
                        border: '1.5px solid rgba(232,184,48,0.5)',
                        color: '#3d2800',
                        boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.1)',
                      }}
                    />
                    <button
                      type="submit"
                      className="px-6 py-2 rounded-full transition-all duration-300 hover:scale-105"
                      style={{
                        background: 'rgba(245,200,66,0.15)',
                        border: '1.5px solid rgba(245,200,66,0.5)',
                        color: '#8B6914',
                        fontFamily: "'Caveat', cursive",
                        fontSize: '1.1rem',
                      }}
                    >
                      open →
                    </button>
                  </form>
                </div>
              )}

              {stage === 'unlocked' && (
                <div className="relative flex flex-col gap-5 pt-2">
                  {/* Easter Egg 4 — low contrast watermark */}
                  <div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
                    style={{
                      opacity: 0.045,
                      fontSize: '5rem',
                      fontFamily: "'Caveat', cursive",
                      color: '#8B6914',
                      transform: 'rotate(-15deg)',
                      userSelect: 'none',
                      zIndex: 0,
                    }}
                  >
                    [ EASTER EGG TEXT PLACEHOLDER 4 ]
                  </div>

                  <p
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: '1.1rem',
                      color: '#3d2800',
                      fontStyle: 'italic',
                      textAlign: 'center',
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    {typedLetter}
                    {!typingDone && <span className="typewriter-cursor" style={{ color: '#8B6914' }} />}
                  </p>

                  {typingDone && (
                    <div
                      className="flex justify-center mt-2"
                      style={{ animation: 'fadeIn 0.8s ease both' }}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <svg width="28" height="28" viewBox="0 0 28 28">
                          <circle cx="14" cy="14" r="5" fill="#F5C842" />
                          {Array.from({ length: 8 }).map((_, i) => {
                            const a = (Math.PI * 2 / 8) * i;
                            return (
                              <ellipse
                                key={i}
                                cx={14 + Math.cos(a) * 9}
                                cy={14 + Math.sin(a) * 9}
                                rx="3.5"
                                ry="1.4"
                                transform={`rotate(${i * 45} ${14 + Math.cos(a) * 9} ${14 + Math.sin(a) * 9})`}
                                fill="#E8C030"
                                opacity="0.9"
                              />
                            );
                          })}
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Wax seal */}
            {stage === 'sealed' && <WaxSeal breaking={false} />}
            {stage === 'breaking' && <WaxSeal breaking={true} />}
          </div>
        </div>
      </div>
    </section>
  );
}
