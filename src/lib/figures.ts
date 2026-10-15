// Star-chart figures traced around the featured constellations, the way old atlases drew a hunter
// or a horseman around the stars. Drawn by hand in the default 400×280 box, so they line up with
// the stars that constellation() places there (pad 36). Each is a list of SVG path strings, plus the
// labels for the small chart axes drawn under it.

export const figures: Record<string, { paths: string[]; transform?: string; axes: { x: string; y: string } }> = {
  // a football in flight: its seam runs along the stars, laces in the middle, stripes at the ends
  'ucla-football-ai-assistant': {
    transform: 'rotate(-32.4 200 140)',
    axes: { x: 'feeds · tools · evals · metrics', y: 'count' },
    paths: [
      'M-14,140 Q200,-20 414,140 Q200,300 -14,140 Z',
      'M70,90 Q81,140 70,190 M86,84 Q97,140 86,196',
      'M330,90 Q319,140 330,190 M314,84 Q303,140 314,196',
      'M152,128 v24 M168,127 v26 M184,126 v28 M200,126 v28 M216,126 v28 M232,127 v26 M248,128 v24',
      'M-70,108 h40 M-84,140 h52 M-70,172 h40',
    ],
  },
  // a field goal: goalposts on the left, the kicker on the right, the ball's flight between them
  'nfl-overtime-4th-down': {
    axes: { x: 'kick distance, 18 → 66 yd', y: 'make %' },
    paths: [
      'M8,40 H96 M8,40 V-36 M96,40 V-36',
      'M52,40 V80 Q52,98 34,98 V172 M20,172 H48',
      'M42,4 a11,6 -25 1,0 22,-10 a11,6 -25 1,0 -22,10',
      'M356,250 a10,6 0 1,0 18,0 a10,6 0 1,0 -18,0 M360,256 l5,8 l5,-8',
      'M402,164 L374,236 L360,236',
      'M402,164 L408,212 L398,262 L410,262',
      'M402,164 L404,104 M404,118 L376,98 M404,118 L432,140',
      'M404,86 m-14,0 a14,14 0 1,0 28,0 a14,14 0 1,0 -28,0 M392,90 h-8',
    ],
  },
  // a quarterback standing tall mid-throw: the ball cocked back at the brightest star, stepping toward the target
  'qb-clutch-optimality': {
    axes: { x: 'QBs, best → worst', y: 'clutch rating' },
    paths: [
      'M22,44 a15,8 -30 1,0 28,-16 a15,8 -30 1,0 -28,16 M30,34 l12,-7',
      'M168,92 L98,96 L48,48',
      'M192,58 m-17,0 a17,17 0 1,0 34,0 a17,17 0 1,0 -34,0 M205,60 l11,4 M205,68 l10,2',
      'M168,92 L214,96 L212,165 L180,165 Z',
      'M214,96 L256,112 L288,98',
      'M208,165 L258,206 L298,256 M294,262 H322',
      'M184,165 L160,212 L130,256 M116,262 L138,258',
    ],
  },
};
