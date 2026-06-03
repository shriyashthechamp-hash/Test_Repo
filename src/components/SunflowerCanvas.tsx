import { useEffect, useRef } from 'react';
import type { EnvState } from '../types';

interface SunflowerData {
  x: number;
  baseY: number;
  height: number;
  phase: number;
  size: number;
  swayFactor: number;
  layer: 'bg' | 'mid' | 'fg';
  blur: number;
  parallaxFactor: number;
  parallaxOffsetY: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  life: number;
  maxLife: number;
  type: 'pollen' | 'firefly' | 'petal';
  phase: number;
}

interface EnvConfig {
  skyTop: string;
  skyBottom: string;
  flowerYellow: string;
  flowerCenter: string;
  stemColor: string;
  petalColor: string;
  rimLight: string;
  particleType: 'pollen' | 'firefly' | 'petal';
  ambientAlpha: number;
}

const ENV_CONFIGS: Record<EnvState, EnvConfig> = {
  day: {
    skyTop: '#FFF8E7',
    skyBottom: '#FFEAA0',
    flowerYellow: '#F5C842',
    flowerCenter: '#584400',
    stemColor: '#5a7a2a',
    petalColor: '#F5C842',
    rimLight: 'rgba(255, 240, 120, 0.6)',
    particleType: 'petal',
    ambientAlpha: 0.0,
  },
  golden: {
    skyTop: 'rgba(26, 8, 0, 0)',
    skyBottom: 'rgba(42, 16, 0, 0)',
    flowerYellow: '#F5A000',
    flowerCenter: '#3D2800',
    stemColor: '#3d5220',
    petalColor: '#E8851A',
    rimLight: 'rgba(245, 160, 0, 0.7)',
    particleType: 'pollen',
    ambientAlpha: 0.0,
  },
  night: {
    skyTop: 'rgba(4, 2, 14, 0)',
    skyBottom: 'rgba(24, 13, 58, 0)',
    flowerYellow: '#2a1a40',
    flowerCenter: '#0a0515',
    stemColor: '#1a2410',
    petalColor: '#3d1f5e',
    rimLight: 'rgba(168, 85, 247, 0.5)',
    particleType: 'firefly',
    ambientAlpha: 0.0,
  },
};

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function lerpColor(c1: string, c2: string, t: number): string {
  const p1 = parseHex(c1);
  const p2 = parseHex(c2);
  if (!p1 || !p2) return c1;
  const r = Math.round(lerp(p1[0], p2[0], t));
  const g = Math.round(lerp(p1[1], p2[1], t));
  const b = Math.round(lerp(p1[2], p2[2], t));
  return `rgb(${r},${g},${b})`;
}

function parseHex(color: string): [number, number, number] | null {
  const match = color.match(/^#([0-9a-f]{6})$/i);
  if (!match) return null;
  const v = parseInt(match[1], 16);
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
}

interface Props {
  env: EnvState;
  act: 1 | 2 | 3;
  scrollY: number;
}

export default function SunflowerCanvas({ env, act, scrollY }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stateRef = useRef({
    bgSunflowers: [] as SunflowerData[],
    midSunflowers: [] as SunflowerData[],
    fgSunflowers: [] as SunflowerData[],
    particles: [] as Particle[],
    mouse: { x: 0, y: 0 },
    time: 0,
    envT: 0,
    currentEnv: env,
    targetEnv: env,
    act,
    scrollY,
    frameId: 0,
    width: 0,
    height: 0,
    scale: 1,
  });

  useEffect(() => {
    const canvas = document.getElementById('dream-canvas') as HTMLCanvasElement;
    if (!canvas) return;
    canvasRef.current = canvas;
    const s = stateRef.current;

    function buildField(w: number, h: number) {
      s.bgSunflowers = [];
      s.midSunflowers = [];
      s.fgSunflowers = [];

      // Background layer: 12 small, minimal parallax
      for (let i = 0; i < 12; i++) {
        s.bgSunflowers.push({
          x: (w / 11) * i + (Math.random() - 0.5) * 60,
          baseY: h + 10,
          height: 140 + Math.random() * 80,
          phase: Math.random() * Math.PI * 2,
          size: 14 + Math.random() * 8,
          swayFactor: 0.3 + Math.random() * 0.3,
          layer: 'bg',
          blur: 4,
          parallaxFactor: 0.02,
          parallaxOffsetY: 0,
        });
      }

      // Midground layer: 10 medium
      for (let i = 0; i < 10; i++) {
        s.midSunflowers.push({
          x: (w / 9) * i + (Math.random() - 0.5) * 80,
          baseY: h + 15,
          height: 210 + Math.random() * 120,
          phase: Math.random() * Math.PI * 2,
          size: 24 + Math.random() * 12,
          swayFactor: 0.5 + Math.random() * 0.4,
          layer: 'mid',
          blur: 1,
          parallaxFactor: 0.05,
          parallaxOffsetY: 0,
        });
      }

      // Foreground layer: 6 large, blurred
      for (let i = 0; i < 6; i++) {
        const side = i < 3 ? -0.15 : 1.15;
        s.fgSunflowers.push({
          x: side * w + (Math.random() - 0.5) * 100,
          baseY: h + 20,
          height: 340 + Math.random() * 160,
          phase: Math.random() * Math.PI * 2,
          size: 44 + Math.random() * 22,
          swayFactor: 0.7 + Math.random() * 0.5,
          layer: 'fg',
          blur: 4,
          parallaxFactor: 0.09,
          parallaxOffsetY: 0,
        });
      }
    }

    function spawnParticles(w: number, h: number, type: 'pollen' | 'firefly' | 'petal') {
      s.particles = [];
      const count = type === 'firefly' ? 15 : 25;
      for (let i = 0; i < count; i++) {
        s.particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: type === 'petal' ? 0.5 + Math.random() * 0.8 : (Math.random() - 0.5) * 0.4,
          vy: type === 'petal' ? 0.4 + Math.random() * 0.6 : -0.3 - Math.random() * 0.5,
          size: type === 'firefly' ? 3 + Math.random() * 2 : type === 'pollen' ? 2 + Math.random() * 2 : 4 + Math.random() * 4,
          opacity: Math.random(),
          life: Math.random() * 200,
          maxLife: 150 + Math.random() * 150,
          type,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }

    function init() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      
      const MAX_RES = 1600;
      let scale = 1;
      if (w > MAX_RES || h > MAX_RES) {
        scale = MAX_RES / Math.max(w, h);
      }
      
      canvas.width = Math.floor(w * scale);
      canvas.height = Math.floor(h * scale);
      
      s.width = w;
      s.height = h;
      s.scale = scale;
      
      const ctx = canvas.getContext('2d');
      if (ctx && scale !== 1) {
        ctx.scale(scale, scale);
      }
      
      buildField(w, h);
      spawnParticles(w, h, ENV_CONFIGS[s.currentEnv].particleType);
    }

    function drawSunflower(ctx: CanvasRenderingContext2D, sf: SunflowerData, cfg: EnvConfig, scrollY: number) {
      const wind = Math.sin(s.time * 0.8 + sf.phase) * 14 * sf.swayFactor;
      const dx = s.mouse.x - sf.x;
      const lookAt = dx * 0.04 * (sf.layer === 'fg' ? 0.5 : 1);
      const parallaxDY = scrollY * sf.parallaxFactor;

      const baseY = sf.baseY + parallaxDY;
      const topX = sf.x + wind + lookAt;
      const topY = baseY - sf.height;
      const cpX = sf.x + wind * 0.5;
      const cpY = baseY - sf.height * 0.4;

      if (sf.blur > 0) {
        ctx.filter = `blur(${sf.blur}px)`;
      }

      // Stem
      ctx.beginPath();
      ctx.moveTo(sf.x, baseY);
      ctx.quadraticCurveTo(cpX, cpY, topX, topY);
      ctx.strokeStyle = cfg.stemColor;
      ctx.lineWidth = sf.layer === 'fg' ? 9 : sf.layer === 'mid' ? 6 : 3;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Leaf
      if (sf.layer !== 'fg') {
        const leafX = lerp(sf.x, topX, 0.45);
        const leafY = lerp(baseY, topY, 0.45);
        ctx.save();
        ctx.translate(leafX, leafY);
        ctx.rotate(-0.4 + wind * 0.01);
        ctx.beginPath();
        ctx.ellipse(18 * (sf.size / 25), 0, 20 * (sf.size / 25), 7 * (sf.size / 25), 0, 0, Math.PI * 2);
        ctx.fillStyle = cfg.stemColor;
        ctx.fill();
        ctx.restore();
      }

      // Flower head
      ctx.save();
      ctx.translate(topX, topY);
      ctx.rotate(wind * 0.018 + lookAt * 0.008);

      // Rim light for night
      if (env === 'night') {
        ctx.beginPath();
        ctx.arc(0, 0, sf.size * 1.4, 0, Math.PI * 2);
        ctx.fillStyle = cfg.rimLight;
        ctx.fill();
      }

      // Petals
      const petalCount = 13;
      for (let i = 0; i < petalCount; i++) {
        const angle = (Math.PI * 2 / petalCount) * i + s.time * 0.005;
        ctx.save();
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.ellipse(sf.size, 0, sf.size * 0.65, sf.size * 0.28, 0, 0, Math.PI * 2);
        ctx.fillStyle = cfg.petalColor;
        ctx.globalAlpha = env === 'night' ? 0.5 : 0.9;
        ctx.fill();
        ctx.restore();
      }

      // Center
      ctx.beginPath();
      ctx.arc(0, 0, sf.size * 0.55, 0, Math.PI * 2);
      ctx.fillStyle = cfg.flowerCenter;
      ctx.globalAlpha = 1;
      ctx.fill();

      // Seed pattern on center (golden hour / day)
      if (env !== 'night' && sf.size > 18) {
        for (let r = 1; r <= 2; r++) {
          for (let a = 0; a < 8; a++) {
            const ang = (Math.PI * 2 / 8) * a + r * 0.4;
            const sr = sf.size * 0.15 * r;
            ctx.beginPath();
            ctx.arc(Math.cos(ang) * sr, Math.sin(ang) * sr, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(245, 200, 66, 0.4)';
            ctx.fill();
          }
        }
      }

      ctx.restore();
      ctx.filter = 'none';
      ctx.globalAlpha = 1;
    }

    function drawParticles(ctx: CanvasRenderingContext2D, cfg: EnvConfig) {
      const w = s.width;
      const h = s.height;
      s.particles.forEach(p => {
        p.life += 1;
        if (p.life > p.maxLife) {
          p.x = Math.random() * w;
          p.y = p.type === 'petal' ? -10 : h + 10;
          p.life = 0;
          p.opacity = 0;
        }
        const progress = p.life / p.maxLife;
        p.opacity = progress < 0.1 ? progress * 10 : progress > 0.8 ? (1 - progress) * 5 : 1;

        if (p.type === 'firefly') {
          // Fireflies wander toward cursor softly
          const fx = s.mouse.x - p.x;
          const fy = s.mouse.y - p.y;
          const dist = Math.sqrt(fx * fx + fy * fy);
          if (dist < 200) {
            p.vx += (fx / dist) * 0.02;
            p.vy += (fy / dist) * 0.02;
          }
          p.vx += (Math.random() - 0.5) * 0.1;
          p.vy += (Math.random() - 0.5) * 0.1;
          p.vx *= 0.98;
          p.vy *= 0.98;
          p.x += p.vx;
          p.y += p.vy;

          const pulse = (Math.sin(s.time * 2 + p.phase) + 1) * 0.5;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * (0.6 + pulse * 0.6), 0, Math.PI * 2);
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
          grad.addColorStop(0, `rgba(170, 255, 200, ${p.opacity})`);
          grad.addColorStop(1, `rgba(170, 255, 200, 0)`);
          ctx.fillStyle = grad;
          ctx.fill();
        } else if (p.type === 'pollen') {
          p.x += p.vx + Math.sin(s.time + p.phase) * 0.3;
          p.y += p.vy;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(245, 200, 66, ${p.opacity * 0.7})`;
          ctx.fill();
        } else {
          // Petal drifts down-right
          p.x += p.vx + Math.sin(s.time * 0.5 + p.phase) * 0.4;
          p.y += p.vy;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(s.time * 0.5 + p.phase);
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size, p.size * 0.4, 0, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(245, 160, 50, ${p.opacity * 0.6})`;
          ctx.fill();
          ctx.restore();
        }
      });
    }

    let envLerpT = 1;
    let prevEnv = env;
    let curEnv = env;

    function animate() {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Throttle when tab is hidden to save battery
      if (document.visibilityState === 'hidden') {
        s.frameId = requestAnimationFrame(animate);
        return;
      }

      s.time += 0.02;
      const { width: w, height: h } = s;

      // Env transition lerp
      if (s.targetEnv !== s.currentEnv) {
        prevEnv = s.currentEnv;
        curEnv = s.targetEnv;
        s.currentEnv = s.targetEnv;
        envLerpT = 0;
      }
      if (envLerpT < 1) {
        envLerpT = Math.min(1, envLerpT + 0.007); // ~2.5s at 60fps
      }

      const cfg = ENV_CONFIGS[s.currentEnv];
      const prevCfg = ENV_CONFIGS[prevEnv];

      // Only draw canvas content in act 2 or 3 (fade in)
      const actAlpha = s.act === 1 ? 0 : s.act === 2 ? 0.7 : 1;
      
      // Skip drawing if invisible
      if (actAlpha === 0) {
        ctx.clearRect(0, 0, w, h);
        s.frameId = requestAnimationFrame(animate);
        return;
      }

      ctx.clearRect(0, 0, w, h);
      ctx.globalAlpha = actAlpha;

      // Calculate blended configs once per frame
      const blendedCfg = {
        ...cfg,
        flowerYellow: envLerpT < 1 ? (lerpColor(prevCfg.flowerYellow, cfg.flowerYellow, envLerpT) || cfg.flowerYellow) : cfg.flowerYellow,
        flowerCenter: envLerpT < 1 ? (lerpColor(prevCfg.flowerCenter, cfg.flowerCenter, envLerpT) || cfg.flowerCenter) : cfg.flowerCenter,
        stemColor: envLerpT < 1 ? (lerpColor(prevCfg.stemColor, cfg.stemColor, envLerpT) || cfg.stemColor) : cfg.stemColor,
        petalColor: envLerpT < 1 ? (lerpColor(prevCfg.petalColor, cfg.petalColor, envLerpT) || cfg.petalColor) : cfg.petalColor,
      };

      // Draw layers: bg, mid, fg directly
      s.bgSunflowers.forEach(sf => drawSunflower(ctx, sf, blendedCfg as EnvConfig, s.scrollY));
      s.midSunflowers.forEach(sf => drawSunflower(ctx, sf, blendedCfg as EnvConfig, s.scrollY));
      s.fgSunflowers.forEach(sf => drawSunflower(ctx, sf, blendedCfg as EnvConfig, s.scrollY));

      // Particles
      if (s.act >= 2) {
        drawParticles(ctx, cfg);
      }

      ctx.globalAlpha = 1;
      s.frameId = requestAnimationFrame(animate);
    }

    const onMouseMove = (e: MouseEvent) => {
      stateRef.current.mouse.x = e.clientX;
      stateRef.current.mouse.y = e.clientY;
    };

    const onResize = () => {
      init();
    };

    document.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onResize);
    init();
    animate();

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(s.frameId);
    };
  }, []);

  // Update refs when props change without re-mounting
  useEffect(() => {
    stateRef.current.targetEnv = env;
  }, [env]);

  useEffect(() => {
    stateRef.current.act = act;
  }, [act]);

  useEffect(() => {
    stateRef.current.scrollY = scrollY;
  }, [scrollY]);

  return null;
}
