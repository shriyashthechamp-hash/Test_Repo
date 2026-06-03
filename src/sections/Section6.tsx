import { useRef, useState } from 'react';
import { Play, Volume2 } from 'lucide-react';

export default function Section6() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(() => {});
    }
    setPlaying(!playing);
  };

  return (
    <section
      className="relative w-full flex flex-col items-center justify-center"
      style={{
        zIndex: 2,
        minHeight: '100vh',
        padding: '6rem 1rem',
      }}
    >
      <div className="max-w-4xl w-full flex flex-col items-center gap-10">
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
            I Tried to Sing It Instead
          </h2>
          <p
            className="mt-3"
            style={{ fontFamily: "'Caveat', cursive", fontSize: '1.1rem', color: 'rgba(245,200,66,0.6)' }}
          >
            Because some things are too important to just say.
          </p>
        </div>

        {/* Video container */}
        <div
          className="relative w-full rounded-3xl overflow-hidden"
          style={{
            aspectRatio: '16/9',
            background: 'rgba(10, 5, 0, 0.8)',
            border: '1px solid rgba(245,200,66,0.15)',
            boxShadow: '0 20px 80px rgba(0,0,0,0.5)',
            cursor: 'none',
          }}
          onClick={togglePlay}
        >
          <video
            ref={videoRef}
            src="/movie-on-03-06-26-at-524-pm_nCnTICGR"
            className="w-full h-full object-cover"
            playsInline
          />

          {/* Play/Pause overlay */}
          <div
            className="absolute inset-0 flex items-center justify-center transition-opacity duration-300"
            style={{ opacity: playing ? 0 : 1 }}
          >
            <div
              className="flex items-center justify-center w-16 h-16 rounded-full"
              style={{ background: 'rgba(245,200,66,0.85)', boxShadow: '0 0 30px rgba(245,200,66,0.4)' }}
            >
              <Play size={28} color="#3d2800" fill="#3d2800" />
            </div>
          </div>

          {/* Gradient overlay at bottom */}
          <div
            className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
            style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.4))' }}
          />
        </div>

        {/* Controls hint */}
        <div
          className="flex items-center gap-3"
          style={{ fontFamily: "'Inter', sans-serif", color: 'rgba(245,200,66,0.4)', fontSize: '0.75rem' }}
        >
          <Volume2 size={14} />
          <span>Click anywhere on the video to play / pause</span>
        </div>
      </div>
    </section>
  );
}