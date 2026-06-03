import { useRef, useState, useEffect } from 'react';

interface AudioVisualizerProps {
  playing: boolean;
}

function AudioVisualizer({ playing }: AudioVisualizerProps) {
  const bars = Array.from({ length: 24 });
  return (
    <div className="flex items-center justify-center gap-0.5" style={{ height: '40px' }}>
      {bars.map((_, i) => (
        <div
          key={i}
          className="w-1 rounded-full"
          style={{
            height: playing ? `${10 + Math.random() * 30}px` : '4px',
            background: `rgba(245, 200, 66, ${playing ? 0.7 + Math.random() * 0.3 : 0.3})`,
            animation: playing ? `barPulse ${0.4 + (i % 5) * 0.1}s ease-in-out infinite alternate` : 'none',
            animationDelay: `${(i * 0.04).toFixed(2)}s`,
            transition: 'height 0.15s ease',
          }}
        />
      ))}
    </div>
  );
}

function SunflowerTurntable({ playing }: { playing: boolean }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 280, height: 280 }}>
      {/* Outer glow ring */}
      <div
        className="absolute rounded-full"
        style={{
          inset: -8,
          background: playing
            ? 'conic-gradient(from 0deg, rgba(245,200,66,0.3), rgba(232,119,31,0.2), rgba(245,200,66,0.3))'
            : 'transparent',
          animation: playing ? 'spin 4s linear infinite' : 'none',
          transition: 'all 0.5s ease',
        }}
      />

      {/* Audio ring visualizer */}
      <svg
        className="absolute"
        width="280"
        height="280"
        viewBox="0 0 280 280"
        style={{
          opacity: playing ? 1 : 0,
          transition: 'opacity 0.5s ease',
        }}
      >
        {Array.from({ length: 32 }).map((_, i) => {
          const angle = (Math.PI * 2 / 32) * i;
          const r = 128;
          const len = playing ? 8 + Math.random() * 18 : 4;
          const x1 = 140 + Math.cos(angle) * r;
          const y1 = 140 + Math.sin(angle) * r;
          const x2 = 140 + Math.cos(angle) * (r + len);
          const y2 = 140 + Math.sin(angle) * (r + len);
          return (
            <line
              key={i}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="rgba(245, 200, 66, 0.6)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          );
        })}
      </svg>

      {/* Main sunflower disc */}
      <div
        className="relative rounded-full overflow-hidden"
        style={{
          width: 240,
          height: 240,
          background: 'radial-gradient(circle at 40% 35%, #5a7a2a 0%, #3d5220 40%, #2a3816 100%)',
          boxShadow: '0 0 40px rgba(0,0,0,0.5), inset 0 0 30px rgba(0,0,0,0.3)',
          animation: playing ? 'spin 6s linear infinite' : 'none',
          transition: 'box-shadow 0.5s ease',
        }}
      >
        {/* Petals arranged in vinyl-groove-like rings */}
        <svg width="240" height="240" viewBox="0 0 240 240" className="absolute inset-0">
          {/* Petal ring 1 */}
          {Array.from({ length: 13 }).map((_, i) => {
            const a = (Math.PI * 2 / 13) * i;
            return (
              <ellipse
                key={`p1-${i}`}
                cx={120 + Math.cos(a) * 68}
                cy={120 + Math.sin(a) * 68}
                rx="14"
                ry="6"
                transform={`rotate(${(i * 360 / 13) + 90} ${120 + Math.cos(a) * 68} ${120 + Math.sin(a) * 68})`}
                fill="#F5C842"
                opacity="0.9"
              />
            );
          })}
          {/* Inner ring */}
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (Math.PI * 2 / 8) * i;
            return (
              <ellipse
                key={`p2-${i}`}
                cx={120 + Math.cos(a) * 38}
                cy={120 + Math.sin(a) * 38}
                rx="8"
                ry="3.5"
                transform={`rotate(${i * 45 + 90} ${120 + Math.cos(a) * 38} ${120 + Math.sin(a) * 38})`}
                fill="#E8A820"
                opacity="0.7"
              />
            );
          })}
        </svg>

        {/* Center disc */}
        <div
          className="absolute rounded-full"
          style={{
            width: 80,
            height: 80,
            top: 80,
            left: 80,
            background: 'radial-gradient(circle, #3d2800 0%, #584400 70%, #3d2800 100%)',
            boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.5)',
          }}
        >
          {/* Seed spiral dots */}
          <svg width="80" height="80" viewBox="0 0 80 80" className="absolute inset-0">
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (Math.PI * 2 / 12) * i;
              return (
                <circle
                  key={i}
                  cx={40 + Math.cos(a) * 18}
                  cy={40 + Math.sin(a) * 18}
                  r="2"
                  fill="rgba(245,200,66,0.35)"
                />
              );
            })}
            {Array.from({ length: 6 }).map((_, i) => {
              const a = (Math.PI * 2 / 6) * i;
              return (
                <circle
                  key={i}
                  cx={40 + Math.cos(a) * 8}
                  cy={40 + Math.sin(a) * 8}
                  r="1.5"
                  fill="rgba(245,200,66,0.25)"
                />
              );
            })}
          </svg>
        </div>
      </div>

      {/* Play/Pause center button */}
      <div
        className="absolute flex items-center justify-center rounded-full"
        style={{
          width: 44,
          height: 44,
          background: playing ? 'rgba(245,200,66,0.9)' : 'rgba(245,200,66,0.75)',
          boxShadow: playing ? '0 0 20px rgba(245,200,66,0.6)' : '0 2px 12px rgba(0,0,0,0.4)',
        }}
      >
        {playing ? (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="#3d2800">
            <rect x="2" y="1" width="3.5" height="12" rx="1.5" />
            <rect x="8.5" y="1" width="3.5" height="12" rx="1.5" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="#3d2800">
            <path d="M3 2 L12 7 L3 12 Z" />
          </svg>
        )}
      </div>
    </div>
  );
}

export default function Section4() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasAudio] = useState(true); // Toggle when real audio is added

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setPlaying(!playing);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setCurrentTime(audio.currentTime);
    const onLoad = () => setDuration(audio.duration);
    const onEnd = () => setPlaying(false);
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onLoad);
    audio.addEventListener('ended', onEnd);
    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onLoad);
      audio.removeEventListener('ended', onEnd);
    };
  }, []);

  const fmtTime = (t: number) => {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <section
      className="relative py-24 px-4 flex flex-col items-center"
      style={{ zIndex: 2, minHeight: '80vh' }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: playing
            ? 'radial-gradient(ellipse at 50% 50%, rgba(245,160,0,0.06) 0%, transparent 60%)'
            : 'transparent',
          transition: 'background 1s ease',
        }}
      />

      <div className="relative max-w-lg w-full flex flex-col items-center gap-10">
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
            The Voice I Wanted You to Hear
          </h2>
          <p
            className="mt-3"
            style={{ fontFamily: "'Caveat', cursive", fontSize: '1.1rem', color: 'rgba(245,200,66,0.6)' }}
          >
            Press play. Close your eyes.
          </p>
        </div>

        {/* Turntable */}
        <div
          onClick={togglePlay}
          style={{ cursor: 'none' }}
        >
          <SunflowerTurntable playing={playing} />
        </div>

        {/* Visualizer */}
        <div className="w-full px-4">
          <AudioVisualizer playing={playing} />
        </div>

        {/* Time display */}
        {hasAudio && (
          <div className="w-full px-4">
            <div
              className="w-full h-1 rounded-full mb-2 overflow-hidden"
              style={{ background: 'rgba(245,200,66,0.15)' }}
            >
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%',
                  background: 'rgba(245,200,66,0.7)',
                }}
              />
            </div>
            <div
              className="flex justify-between text-xs"
              style={{ fontFamily: "'Inter', sans-serif", color: 'rgba(245,200,66,0.45)' }}
            >
              <span>{fmtTime(currentTime)}</span>
              <span>{fmtTime(duration)}</span>
            </div>
          </div>
        )}

        {!hasAudio && (
          <p
            className="text-center"
            style={{ fontFamily: "'Caveat', cursive", fontSize: '1rem', color: 'rgba(245,200,66,0.35)' }}
          >
            [ AUDIO PLACEHOLDER: ambient_voice_message.mp3 ]
          </p>
        )}

        {/* Hidden audio element */}
        <audio ref={audioRef} src="/Hotel Best Elegance.m4a" preload="metadata" />
      </div>
    </section>
  );
}
