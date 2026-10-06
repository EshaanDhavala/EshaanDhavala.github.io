export type Tag = 'Football' | 'Tennis' | 'ML & AI' | 'Stats';

export interface Entry {
  slug: string;
  no: number;
  title: string;
  /** one line, plain words — what it is */
  blurb: string;
  /** the number a reader should remember */
  hook: string;
  when: string;
  tags: Tag[];
  stack: string[];
  /** where the work happened */
  context: string;
}

export const TAGS: Tag[] = ['Football', 'Tennis', 'ML & AI', 'Stats'];

export const entries: Entry[] = [
  {
    slug: 'ucla-football-ai-assistant',
    no: 1,
    title: 'An AI assistant for UCLA Football’s strength staff',
    blurb: 'Coaches ask questions about player testing data in plain English and get a chart, table, or report back, built on 17 tools that query the real data instead of guessing.',
    hook: '~6 s per answer',
    when: '2026',
    tags: ['Football', 'ML & AI'],
    stack: ['R / Shiny', 'Anthropic API', 'tool use', 'GitHub Actions'],
    context: 'Bruin Sports Analytics · co-chair',
  },
  {
    slug: 'nfl-overtime-4th-down',
    no: 2,
    title: 'Overtime 4th-down decision engine',
    blurb: 'Go for it, punt, or kick? A live tool that compares win probability for each choice in NFL overtime. I built the field-goal make-probability model inside it.',
    hook: 'live at playbyplay.football',
    when: 'Feb – Mar 2026',
    tags: ['Football', 'ML & AI'],
    stack: ['Python', 'XGBoost', 'scikit-learn', 'nfl_data_py'],
    context: 'Bruin Sports Analytics · 8-person team',
  },
  {
    slug: 'qb-clutch-optimality',
    no: 3,
    title: 'Which quarterbacks make better decisions under pressure?',
    blurb: 'Player-tracking features of the pocket (how fast it collapses, how close the rushers are) feed a model of expected play value, then compared in clutch vs. normal moments.',
    hook: '7,088 dropbacks',
    when: 'Spring 2026',
    tags: ['Football', 'Stats'],
    stack: ['Python', 'XGBoost', 'SciPy convex hulls', 'NFL Big Data Bowl tracking'],
    context: 'Bruin Sports Analytics · research team',
  },
  {
    slug: 'usaa-closure-reasons',
    no: 4,
    title: 'Why people actually closed their credit cards',
    blurb: '72% of closures were logged as “No longer needed.” Topic-modeling the call transcripts recovered the real reasons.',
    hook: '28% → 66% reasons captured',
    when: 'Summer 2026',
    tags: ['ML & AI', 'Stats'],
    stack: ['SQL / Snowflake', 'Python', 'BERTopic', 'clustering'],
    context: 'USAA · data science intern',
  },
  {
    slug: 'playscan',
    no: 5,
    title: 'PlayScan: calling the play from the broadcast',
    blurb: 'A ResNet-LSTM watches TV footage frame by frame and labels each snap as a run, pass, or special-teams play, live on screen.',
    hook: '89% held-out accuracy',
    when: 'Jun – Sep 2025',
    tags: ['Football', 'ML & AI'],
    stack: ['PyTorch', 'ResNet18', 'LSTM', 'OpenCV'],
    context: 'Personal project',
  },
  {
    slug: 'journal-to-data',
    no: 6,
    title: 'JournalToData: turning a diary into a dataset',
    blurb: 'I wrote a journal entry nearly every night; an LLM turned each one into 15+ validated daily metrics (sleep, mood, training, food) in a Google Sheet with a dashboard on top.',
    hook: '131 of 132 nights logged',
    when: 'Jan – Jun 2026',
    tags: ['ML & AI'],
    stack: ['Python', 'Streamlit', 'OpenAI API', 'Google Sheets API', 'Pydantic'],
    context: 'Personal project',
  },
  {
    slug: 'tennis-scouting',
    no: 7,
    title: 'Scouting for UCLA Tennis',
    blurb: 'Serve and shot-selection pipelines across a full season, a serve-return scouting app, and a travel dashboard players used on the road.',
    hook: '26 matches analyzed',
    when: 'Mar 2025 – Jun 2026',
    tags: ['Tennis', 'Stats'],
    stack: ['Python', 'Plotly Dash', 'R Leaflet', 'D3'],
    context: 'Bruin Sports Analytics · tennis consulting',
  },
  {
    slug: 'house-prices',
    no: 8,
    title: 'Pricing houses with seven predictors',
    blurb: 'A Kaggle competition for STATS 101A: a deliberately small linear model that still explains most of the variance in sale price.',
    hook: 'test R² = 0.888',
    when: 'Mar 2026',
    tags: ['Stats'],
    stack: ['R', 'linear regression', 'diagnostics'],
    context: 'UCLA STATS 101A · team of 3',
  },
  {
    slug: 'adhd-diagnosis',
    no: 9,
    title: 'Who gets diagnosed with ADHD, and who gets treated?',
    blurb: 'CDC survey data on 2,966 kids: how ADHD severity, co-occurring conditions, and access to treatment change with household income.',
    hook: 'severe cases: 23% → 12% by income',
    when: 'Spring 2026',
    tags: ['Stats'],
    stack: ['Python', 'logistic regression', 'CDC NS-DATA'],
    context: 'DataLearn · team of 3',
  },
  {
    slug: 'souschef',
    no: 10,
    title: 'SousChef: what can I cook with what I have?',
    blurb: 'A recipe agent that reads what’s in your kitchen and recommends meals from a knowledge base built out of PDF cookbooks.',
    hook: 'my first AI agent',
    when: 'Apr – Jun 2024',
    tags: ['ML & AI'],
    stack: ['Google Vertex AI', 'Python', 'PDF scraping', 'intent recognition'],
    context: 'Personal project',
  },
];

export const bySlug = (slug: string) => {
  const e = entries.find((x) => x.slug === slug);
  if (!e) throw new Error(`Unknown entry: ${slug}`);
  return e;
};
