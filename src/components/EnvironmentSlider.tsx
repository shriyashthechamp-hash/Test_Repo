import type { EnvState } from '../types';

interface Props {
  env: EnvState;
  onChange: (env: EnvState) => void;
}

const OPTIONS: { value: EnvState; label: string; icon: string }[] = [
  { value: 'day', label: 'Day', icon: '☀' },
  { value: 'golden', label: 'Golden', icon: '◐' },
  { value: 'night', label: 'Night', icon: '☽' },
];

export default function EnvironmentSlider({ env, onChange }: Props) {
  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1 px-3 py-2 rounded-full"
      style={{
        background: 'rgba(20, 10, 0, 0.55)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(245, 200, 66, 0.2)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
      }}
    >
      {OPTIONS.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-300 text-xs font-inter select-none"
          style={{
            fontFamily: "'Inter', sans-serif",
            background: env === opt.value
              ? 'rgba(245, 200, 66, 0.18)'
              : 'transparent',
            color: env === opt.value
              ? '#F5C842'
              : 'rgba(245, 200, 66, 0.45)',
            border: env === opt.value
              ? '1px solid rgba(245, 200, 66, 0.4)'
              : '1px solid transparent',
            letterSpacing: '0.06em',
            fontWeight: env === opt.value ? 500 : 400,
          }}
        >
          <span style={{ fontSize: '0.8rem' }}>{opt.icon}</span>
          <span className="hidden sm:inline">{opt.label}</span>
        </button>
      ))}
    </div>
  );
}
