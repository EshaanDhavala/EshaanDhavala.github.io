// Star-chart figures traced around the featured constellations, the way old atlases drew a hunter
// or a horseman around the stars. Drawn by hand in the default 400×280 box, so they line up with
// the stars that constellation() places there (pad 36). Each is a list of SVG path strings.

export const figures: Record<string, { paths: string[]; transform?: string }> = {
  // a football in flight: its seam runs along the stars, laces in the middle, stripes at the ends
  'ucla-football-ai-assistant': {
    transform: 'rotate(-32.4 200 140)',
    paths: [
      'M-14,140 Q200,30 414,140 Q200,250 -14,140 Z',
      'M70,105 Q78,140 70,175 M82,103 Q90,140 82,177',
      'M330,105 Q322,140 330,175 M318,103 Q310,140 318,177',
      'M152,130 v20 M168,129 v22 M184,128 v24 M200,128 v24 M216,128 v24 M232,129 v22 M248,130 v20',
      'M-70,118 h40 M-84,140 h52 M-70,162 h40',
    ],
  },
  // a field goal: goalposts on the left, the kicker on the right, the ball's flight between them
  'nfl-overtime-4th-down': {
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
  // a quarterback mid-throw: the ball held back at the brightest star, striding toward the dimmest
  'qb-clutch-optimality': {
    paths: [
      'M22,44 a15,8 -30 1,0 28,-16 a15,8 -30 1,0 -28,16 M30,34 l12,-7',
      'M50,46 L86,86 L140,106',
      'M160,80 m-18,0 a18,18 0 1,0 36,0 a18,18 0 1,0 -36,0 M172,84 l12,6 M174,92 l10,4',
      'M140,106 L182,112 L250,165 L222,182 Z',
      'M182,112 L226,126 L252,112',
      'M236,174 L295,192 L360,240 M350,246 H374',
      'M222,182 L205,226 L165,258 M154,262 L172,256',
    ],
  },
};
