export type EnvState = 'day' | 'golden' | 'night';
export type Act = 1 | 2 | 3;

export interface AppState {
  isLoading: boolean;
  act: Act;
  env: EnvState;
}

export interface Milestone {
  id: number;
  date: string;
  title: string;
  memory?: string;
}

export interface ObservationCard {
  id: number;
  text: string;
  rotation: number;
  offsetX: number;
}

export const MILESTONES: Milestone[] = [
  { id: 1, date: 'Jan 20, 2025', title: 'Sponsorship Day', memory: 'The day everything quietly changed.' },
  { id: 2, date: 'Jan 25, 2025', title: 'First Ever Paash Wali Date', memory: 'The date that made me want more dates.' },
  { id: 3, date: 'Jan 31, 2025', title: 'Tekron', memory: 'A memory that still makes me smile.' },
  { id: 4, date: 'Feb 14, 2025', title: "Valentine's Day", memory: 'By then, every day with you already felt special.' },
  { id: 5, date: 'Mar 21, 2025', title: 'Sante Spa Wali Date', memory: 'We were supposed to be sophisticated. That lasted approximately five minutes 😂' },
  { id: 6, date: 'Apr 10, 2025', title: 'First Kuai Date', memory: 'The beginning of our sushi addiction.' },
  { id: 7, date: 'Apr 14, 2025', title: 'Well welll needs no explanation 😂' },
  { id: 8, date: 'Apr 19, 2025', title: 'The day I was down, but you were the one who made it special and one of the coolest dates.' },
];

export const OBSERVATION_CARDS: ObservationCard[] = [
  { id: 1, text: 'The way your eyes get brighter when you\'re talking about something you actually love.', rotation: -3, offsetX: -8 },
  { id: 2, text: 'How you make every room warmer just by being in it.', rotation: 2, offsetX: 12 },
  { id: 3, text: 'That your laugh sounds completely different when you\'re genuinely surprised.', rotation: -2, offsetX: -4 },
  { id: 4, text: 'The way you hold your cup with both hands like it\'s something precious.', rotation: 4, offsetX: 6 },
  { id: 5, text: 'How you never let a quiet moment become an awkward one.', rotation: -1, offsetX: -10 },
  { id: 6, text: 'That you apologize to things you bump into. Always.', rotation: 3, offsetX: 8 },
  { id: 7, text: 'The face you make when you\'re trying so hard not to smile.', rotation: -4, offsetX: -6 },
  { id: 8, text: 'How you always remember exactly what everyone ordered last time.', rotation: 1, offsetX: 14 },
  { id: 9, text: 'That you hum the same few songs when you\'re content.', rotation: -3, offsetX: -12 },
  { id: 10, text: 'The way you look out windows on long drives, like you\'re collecting the view.', rotation: 2, offsetX: 4 },
  { id: 11, text: 'How you always find the most comfortable spot in any room within thirty seconds.', rotation: -2, offsetX: -8 },
  { id: 12, text: 'That your kindness is quieter than most people\'s. It doesn\'t need an audience.', rotation: 5, offsetX: 10 },
  { id: 13, text: 'The way your whole posture changes when someone needs your full attention.', rotation: -1, offsetX: -14 },
  { id: 14, text: 'How you instinctively look for me in unfamiliar places.', rotation: 3, offsetX: 6 },
  { id: 15, text: 'That you put your whole heart into small gestures, like they\'re the biggest ones.', rotation: -3, offsetX: -4 },
  { id: 16, text: 'The way your voice gets softer when you\'re being truly honest.', rotation: 2, offsetX: 12 },
  { id: 17, text: 'How you always notice when something is slightly off with someone before they say a word.', rotation: -2, offsetX: -6 },
  { id: 18, text: 'That you make ordinary moments feel worth remembering.', rotation: 4, offsetX: 8 },
  { id: 19, text: 'The way you light up at unexpected, tiny beautiful things.', rotation: -3, offsetX: -10 },
  { id: 20, text: 'How being with you always feels like exactly the right place to be.', rotation: 1, offsetX: 4 },
];
