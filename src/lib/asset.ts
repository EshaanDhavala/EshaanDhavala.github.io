// Cache-busting for files in /public: appends a short content hash so browsers
// fetch the new version whenever an image changes.
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const cache = new Map<string, string>();
export function asset(src: string): string {
  if (!src.startsWith('/')) return src;
  if (!cache.has(src)) {
    try {
      const buf = readFileSync(join(process.cwd(), 'public', src));
      cache.set(src, `${src}?v=${createHash('md5').update(buf).digest('hex').slice(0, 8)}`);
    } catch {
      cache.set(src, src);
    }
  }
  return cache.get(src)!;
}
