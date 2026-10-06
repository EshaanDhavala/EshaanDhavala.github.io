export type Cat = 'football' | 'tennis' | 'ai' | 'stats';

export const CATS: { id: Cat; label: string }[] = [
  { id: 'football', label: 'Football' },
  { id: 'tennis', label: 'Tennis' },
  { id: 'ai', label: 'AI & ML' },
  { id: 'stats', label: 'Stats' },
];

export interface Link { href: string; label: string }
export interface Figure { src: string; alt: string; caption: string; w: number; h: number; wide?: boolean }

export interface Entry {
  slug: string;
  name: string;
  /** one line: what it does */
  what: string;
  /** the "price" */
  stat: { value: string; label: string };
  cats: Cat[];
  /** plate colour family for the item picture */
  plate: Cat;
  when: string;
  where: string;
  stack: string[];
  built: string[];
  results: string[];
  links: Link[];
  figures?: Figure[];
  /** card picture: an inline data drawing (src/assets/thumbs/<slug>.svg) or a photo */
  pic: { kind: 'svg' } | { kind: 'img'; src: string; alt: string };
  /** interactive charts on the detail view */
  charts?: ('qb' | 'journal' | 'journal-dow' | 'tennis' | 'fg')[];
  video?: { src: string; poster: string; label: string };
  note?: string;
}

export const entries: Entry[] = [
  {
    slug: 'ucla-football-ai-assistant',
    name: 'Coach’s AI Assistant',
    what: 'Coaches ask about player data in plain English, get charts and reports.',
    stat: { value: '~6s', label: 'per answer' },
    cats: ['football', 'ai'],
    plate: 'ai',
    pic: { kind: 'img', src: '/thumbs/ucla-football-ai-assistant.jpg', alt: 'The AI Assistant answering which O-linemen have the weakest hamstrings, with a bar chart' },
    video: { src: '/media/ai-assistant.mp4', poster: '/media/ai-assistant-poster.jpg', label: 'Screen recording of the AI Assistant answering four coach questions with charts and a CSV, on synthetic data' },
    when: '2026',
    where: 'Bruin Sports Analytics × UCLA Football',
    stack: ['R / Shiny', 'Anthropic API', 'Tool use', 'dplyr'],
    built: [
      'AI tab inside the strength staff’s Shiny dashboard (7 data feeds)',
      '17 R tools the model calls to query real data instead of guessing',
      'Fallback: model writes an allow-listed dplyr pipeline, R runs it',
      'Metric dictionary for 60+ measurements and which direction is better',
      'Answers as charts, tables, CSVs, or a downloadable HTML report',
    ],
    results: [
      '32-question eval, all factual checks pass',
      'Cheaper model failed the eval on facts, so I kept the bigger one',
      'Demo on synthetic data; real-athlete use waiting on privacy approval',
    ],
    links: [],
    note: 'Recorded on synthetic data. Every athlete name and number is fake.',
  },
  {
    slug: 'nfl-overtime-4th-down',
    name: '4th-Down OT Engine',
    what: 'Go, punt, or kick in NFL overtime. I built its field-goal model.',
    stat: { value: '0.78', label: 'AUC' },
    cats: ['football', 'ai'],
    plate: 'football',
    when: 'Feb – Mar 2026',
    where: 'Bruin Sports Analytics · 8-person team',
    stack: ['Python', 'XGBoost', 'scikit-learn', 'nfl_data_py'],
    built: [
      'Every unblocked NFL field goal 2016–2024 (8,742 kicks)',
      '15 features: distance, wind gusts, temperature, surface, altitude, kicker form, game pressure',
      'XGBoost tuned on Brier score, then isotonic-calibrated so 70% means 70%',
      'Feeds the live decision engine with three other sub-models',
    ],
    results: [
      'Held-out ROC-AUC 0.78',
      'Brier 0.104 vs 0.122 for guessing the league rate',
      'Live at playbyplay.football',
    ],
    links: [
      { href: 'https://playbyplay.football', label: 'Live tool' },
      { href: 'https://github.com/Bruin-Sports-Analytics/nfl-ot-4th-down-model/tree/feature/fg-probability-model', label: 'Code' },
    ],
    pic: { kind: 'svg' },
    charts: ['fg'],
    figures: [
      { src: '/img/fg-explainer.png', alt: 'Four-panel chart of field goal make probability by distance, kicker quality, weather, and game scenario', caption: 'The summary slide I presented.', w: 1600, h: 891, wide: true },
      { src: '/img/fg-heatmap.png', alt: 'Heatmap of make probability by kick distance and wind gust speed', caption: 'Distance × wind gust, league-average kicker.', w: 1600, h: 1002 },
    ],
  },
  {
    slug: 'qb-clutch-optimality',
    name: 'QB Clutch Ratings',
    what: 'Which QBs beat expectations in close games, from tracking data.',
    stat: { value: '7,088', label: 'dropbacks' },
    cats: ['football', 'stats'],
    plate: 'football',
    when: 'Spring 2026',
    where: 'Bruin Sports Analytics · research team',
    stack: ['Python', 'XGBoost', 'SciPy', 'Big Data Bowl tracking'],
    built: [
      'Pipeline joining 10 Hz NFL tracking (2021, wks 1–8) to play-by-play',
      'Pass-rusher features; fixed data leakage across the team’s code',
      'XGBoost predicts EPA per dropback from pocket, pressure, QB, and game state',
      'Clutch = Q4/OT plays that are close (40–60% win prob), a 4th down within one score, or a 2-minute drill',
      'Clutch rating = performance vs. expected on clutch plays, minus the QB’s own average',
    ],
    results: [
      'Leave-one-week-out RMSE 1.57 EPA',
      'Top: Herbert, Goff, L. Jackson. Bottom: Brady, Wentz',
      'Small samples (11–41 clutch dropbacks per QB): a first look',
    ],
    links: [{ href: 'https://github.com/Bruin-Sports-Analytics/qb-optimality', label: 'Code' }],
    pic: { kind: 'svg' },
    charts: ['qb'],
  },
  {
    slug: 'usaa-closure-reasons',
    name: 'Card Closure Reasons',
    what: 'Why members really closed their cards, mined from call transcripts.',
    stat: { value: '28→66%', label: 'captured' },
    cats: ['ai', 'stats'],
    plate: 'stats',
    when: 'Summer 2026',
    where: 'USAA · Data Science Intern',
    stack: ['SQL', 'Snowflake', 'Python', 'BERTopic'],
    built: [
      'Found 72% of a year’s closures logged as “No longer needed” (25,000+ cards)',
      'BERTopic + clustering on call transcripts',
      'Surfaced hidden reasons: financial hardship, competitor rates, fraud',
    ],
    results: [
      'Reason capture rate 28% → 66%',
      'Pitched 3 fixes to senior leadership: rep training, a better dropdown, predicting the reason before the call',
    ],
    links: [],
    pic: { kind: 'svg' },
    note: 'Internal work. No company data shown.',
  },
  {
    slug: 'playscan',
    name: 'PlayScan',
    what: 'Calls run, pass, or special teams live from a TV broadcast.',
    stat: { value: '89%', label: 'accuracy' },
    cats: ['football', 'ai'],
    plate: 'football',
    when: 'Jun – Sep 2025',
    where: 'Personal project',
    stack: ['PyTorch', 'ResNet18', 'LSTM', 'OpenCV'],
    built: [
      'Cut and hand-labeled 1,174 clips (326 pass, 419 run, 429 special teams)',
      '16 frames per play → ResNet18 → LSTM → class',
      'Live mode: detects each snap from screen motion, overlays the call',
    ],
    results: ['89% on held-out validation clips', 'Demo: 6 validation plays it never trained on, with its real probabilities'],
    links: [{ href: 'https://github.com/EshaanDhavala/PlayScan', label: 'Code' }],
    pic: { kind: 'img', src: '/thumbs/playscan.jpg', alt: 'PlayScan calling a run play over an NFL broadcast' },
    video: { src: '/media/playscan.mp4', poster: '/media/playscan-poster.jpg', label: 'PlayScan reading six validation plays and calling pass, run, or special teams with its probabilities' },
  },
  {
    slug: 'journal-to-data',
    name: 'JournalToData',
    what: 'An LLM turns my nightly journal into daily metrics.',
    stat: { value: '131', label: 'nights logged' },
    cats: ['ai'],
    plate: 'ai',
    when: 'Jan – Jun 2026',
    where: 'Personal project',
    stack: ['Python', 'Streamlit', 'OpenAI API', 'Google Sheets', 'Pydantic'],
    built: [
      'Extracts 15+ fields per entry: sleep, training, food, screen time, mood',
      'Pydantic validation; asks a follow-up when something’s missing',
      'Streamlit app: log, dashboard, weekly review, chat with your data',
    ],
    results: [
      '131 of 132 nights logged · 57 gym days · 8.2 h avg sleep',
      'Best mood: Fridays (8.3/10). Lowest: Tuesdays (7.5)',
      'Gym schedule: Mon/Tue 68%, Thu 58%, Sun 11%. Split: 21 push, 19 pull, 11 legs',
      'Sleep and mood barely move together (r = −0.12); gym days and rest days had the same mood',
    ],
    links: [{ href: 'https://github.com/EshaanDhavala/Journal-to-Data-Base', label: 'Code' }],
    pic: { kind: 'svg' },
    charts: ['journal-dow', 'journal'],
  },
  {
    slug: 'tennis-scouting',
    name: 'Tennis Scouting',
    what: 'Serve/return analytics, a scouting app, and a travel map.',
    stat: { value: '26', label: 'matches' },
    cats: ['tennis', 'stats'],
    plate: 'tennis',
    when: 'Mar 2025 – Jun 2026',
    where: 'Bruin Sports Analytics · Tennis',
    stack: ['Python', 'Plotly Dash', 'R Leaflet'],
    built: [
      'Python ETL: serve accuracy, shot selection, return rates over 26 matches',
      'Dash app plotting every return by serve, side, stroke, spin, and score',
      'Leaflet travel map: venues, live weather, court conditions',
      'Built data for 12 untracked away matches from video',
    ],
    results: ['Scouting graphics for 8 opponents', 'Travel map used by players on the road'],
    links: [],
    pic: { kind: 'img', src: '/thumbs/tennis-scouting.jpg', alt: 'Travel dashboard map with a venue card showing live weather for SMU in Dallas' },
    charts: ['tennis'],
    figures: [{ src: '/img/travel-popup.jpg', alt: 'Leaflet travel dashboard: venue card for SMU in Dallas with travel, conditions, live weather, and nearby tabs', caption: 'Travel dashboard: each away venue has travel time, court conditions, live weather, and what’s nearby.', w: 1280, h: 800, wide: true }],
  },
  {
    slug: 'house-prices',
    name: 'House Price Model',
    what: '7-predictor regression for a Kaggle class competition.',
    stat: { value: '0.888', label: 'test R²' },
    cats: ['stats'],
    plate: 'stats',
    when: 'Mar 2026',
    where: 'UCLA STATS 101A · team of 3',
    stack: ['R', 'Linear regression'],
    built: [
      'log(price) on 7 predictors',
      'Engineered log total sq ft, centered year built, log lot area',
      'One interaction: quality × log(sq ft)',
      'Compared 3 nested models on adj. R², AIC, BIC; checked diagnostics',
    ],
    results: ['Kaggle test R² 0.888'],
    links: [],
    pic: { kind: 'svg' },
  },
  {
    slug: 'adhd-diagnosis',
    name: 'ADHD Care Gap',
    what: 'How ADHD severity and treatment track family income.',
    stat: { value: '2,966', label: 'kids' },
    cats: ['stats'],
    plate: 'stats',
    when: 'Spring 2026',
    where: 'DataLearn · team of 3',
    stack: ['Python', 'Logistic regression', 'CDC NS-DATA'],
    built: [
      'My part: severity and co-occurring conditions',
      'Severity by household income',
      'Co-occurrence across 13 conditions',
      'Team logistic regression on who gets treated',
    ],
    results: ['Severe share: 23% in the lowest income group vs 12% in the highest'],
    links: [],
    pic: { kind: 'svg' },
    figures: [{ src: '/img/adhd-income.png', alt: 'Stacked bar chart of ADHD severity by household income', caption: 'Severity by household income.', w: 1600, h: 1062 }],
  },
  {
    slug: 'souschef',
    name: 'SousChef',
    what: 'Tell it what’s in your kitchen, get recipes you can make.',
    stat: { value: '2024', label: 'first agent' },
    cats: ['ai'],
    plate: 'ai',
    when: 'Apr – Jun 2024',
    where: 'Personal project',
    stack: ['Google Vertex AI', 'Python'],
    built: [
      'Scraped recipes from PDF cookbooks into a knowledge base',
      'Vertex AI agent with intent recognition for messy ingredient lists',
      'Matches what you have to recipes you can make',
    ],
    results: [],
    links: [],
    pic: { kind: 'svg' },
  },
];

export const bySlug = (slug: string) => {
  const e = entries.find((x) => x.slug === slug);
  if (!e) throw new Error(`Unknown entry: ${slug}`);
  return e;
};
