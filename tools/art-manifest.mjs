// Rebuild art/manifest.json from whatever is actually in art/.
// Run it after dropping new character art in:  node tools/art-manifest.mjs
import { readdirSync, writeFileSync } from 'node:fs';

const EXT = 'webp';
const ids = readdirSync('art')
  .filter(f => f.endsWith('.' + EXT))
  .map(f => f.slice(0, -(EXT.length + 1)))
  .sort();

writeFileSync('art/manifest.json', JSON.stringify({ ext: EXT, ids }, null, 2) + '\n');
console.log(ids.length ? `manifest: ${ids.join(', ')}` : 'manifest: empty, the vectors stay');
