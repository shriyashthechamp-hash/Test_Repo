import { useEffect, useRef, useState } from 'react';

interface Props {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [textVisible, setTextVisible] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = 300;
    const H = 340;
    canvas.width = W;
    canvas.height = H;

    let frame = 0;
    let rafId = 0;

    // Animation phases:
    // 0-60: seed appears
    // 60-130: stem grows
    // 130-180: leaf unfurls
    // 180-260: bud forms + opens into sunflower
    // 260-320: petals animate in
    // 320+: bloom fully visible

    function easeOutCubic(t: number) {
      return 1 - Math.pow(1 - t, 3);
    }

    function easeInOut(t: number) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);

      const groundY = H - 30;
      const stemBaseX = W / 2;

      // Phase 0-60: seed
      if (frame > 5) {
        const seedT = Math.min(1, (frame - 5) / 40);
        ctx.save();
        ctx.translate(stemBaseX, groundY);
        ctx.beginPath();
        ctx.ellipse(0, 0, 8 * seedT, 12 * seedT, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(88, 68, 0, ${seedT})`;
        ctx.fill();
        ctx.restore();
      }

      // Phase 60-130: stem grows
      const stemT = frame < 60 ? 0 : Math.min(1, (frame - 60) / 70);
      const stemTopY = groundY - easeOutCubic(stemT) * 220;

      if (stemT > 0) {
        ctx.beginPath();
        ctx.moveTo(stemBaseX, groundY);
        const cpX = stemBaseX + Math.sin(stemT * Math.PI) * 12;
        const cpY = (groundY + stemTopY) / 2;
        ctx.quadraticCurveTo(cpX, cpY, stemBaseX, stemTopY);
        ctx.strokeStyle = '#546438';
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.stroke();
      }

      // Phase 150-200: leaf unfurls
      const leafT = frame < 150 ? 0 : Math.min(1, (frame - 150) / 50);
      if (leafT > 0) {
        const leafY = groundY - easeOutCubic(Math.min(1, (frame - 60) / 70)) * 120;
        ctx.save();
        ctx.translate(stemBaseX + 3, leafY);
        ctx.rotate(-0.5);
        ctx.scale(leafT, leafT);
        ctx.beginPath();
        ctx.ellipse(20, 0, 28, 9, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#5a7a2a';
        ctx.fill();
        ctx.restore();
      }

      // Phase 200-320: flower blooms
      const flowerT = frame < 200 ? 0 : Math.min(1, (frame - 200) / 120);
      const bloomEased = easeInOut(flowerT);
      const flowerSize = bloomEased * 40;

      if (flowerT > 0 && stemT > 0.9) {
        ctx.save();
        ctx.translate(stemBaseX, stemTopY);
        ctx.rotate(flowerT * 0.1);

        // Petals
        const petalCount = 13;
        for (let i = 0; i < petalCount; i++) {
          const angle = (Math.PI * 2 / petalCount) * i;
          const petalT = Math.max(0, Math.min(1, (flowerT * petalCount - i) / 1.5));
          ctx.save();
          ctx.rotate(angle);
          ctx.beginPath();
          ctx.ellipse(flowerSize * 0.9, 0, flowerSize * 0.7 * petalT, flowerSize * 0.28 * petalT, 0, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(245, 200, 66, ${petalT})`;
          ctx.fill();
          ctx.restore();
        }

        // Center
        ctx.beginPath();
        ctx.arc(0, 0, flowerSize * 0.55, 0, Math.PI * 2);
        ctx.fillStyle = '#584400';
        ctx.globalAlpha = bloomEased;
        ctx.fill();
        ctx.globalAlpha = 1;

        ctx.restore();
      }

      frame++;

      if (frame === 260) {
        setTextVisible(true);
      }

      if (frame < 400) {
        rafId = requestAnimationFrame(draw);
      }
    }

    rafId = requestAnimationFrame(draw);

    const textTimer = setTimeout(() => {
      setTextVisible(true);
    }, 4200);

    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 5200);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 6000);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(textTimer);
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-opacity duration-1000 ${fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      style={{ background: 'linear-gradient(160deg, #1a0800 0%, #4a2000 40%, #1a0800 100%)' }}
    >
      {/* Soft ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 55%, rgba(245, 160, 0, 0.12) 0%, transparent 65%)',
        }}
      />

      <div className="relative flex flex-col items-center gap-6">
        <canvas ref={canvasRef} className="w-[200px] h-[226px]" />

        <div
          className="text-center transition-all duration-1000"
          style={{
            opacity: textVisible ? 1 : 0,
            transform: textVisible ? 'translateY(0)' : 'translateY(10px)',
          }}
        >
          <p
            className="text-3xl font-caveat"
            style={{ color: '#F5C842', fontFamily: "'Caveat', cursive", letterSpacing: '0.04em' }}
          >
            For Aaashi.
          </p>
          <p
            className="text-sm mt-2 font-inter"
            style={{ color: 'rgba(245, 200, 66, 0.45)', letterSpacing: '0.15em', fontFamily: "'Inter', sans-serif" }}
          >
            one moment...
          </p>
        </div>
      </div>
    </div>
  );
}
