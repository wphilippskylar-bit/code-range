#!/usr/bin/env node
/* Bullet coverage audit. Usage: node rk-coverage.js /abs/index.html bullets.json
   bullets.json = { "track": "core2", "objectives": { "1.1": "term;term;…" } }
   Prints every official bullet term not found (case-insensitive) in that objective's parts + recap. Exit 1 if any miss. */
const path = require('path'), fs = require('fs');
let chromium; try { chromium = require('playwright').chromium; } catch (e) { chromium = require('/home/claude/.npm-global/lib/node_modules/playwright').chromium; }
const [file, bul] = process.argv.slice(2); const B = JSON.parse(fs.readFileSync(bul, 'utf8'));
(async () => {
  const opts = { args: ['--no-sandbox'] }; if (fs.existsSync('/opt/pw-browsers/chromium')) opts.executablePath = '/opt/pw-browsers/chromium';
  const b = await chromium.launch(opts), p = await b.newPage(); await p.goto('file://' + path.resolve(file)); await p.waitForTimeout(1200);
  const r = await p.evaluate(B => {
    const norm = s => String(s).replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ').toLowerCase().replace(/[‑–—]/g, '-').replace(/\s+/g, ' ');
    const out = []; let total = 0, hit = 0;
    Object.keys(B.objectives).forEach(id => {
      const s = COURSE.stages.find(x => x.obj === id && (!B.track || x.track === B.track));
      if (!s) { out.push(id + ': NOT BUILT'); return; }
      const t = norm(s.parts.map(p => p.h + ' ' + p.html).join(' ') + ' ' + ((s.wrap && s.wrap.recap) || []).join(' '));
      const miss = B.objectives[id].split(';').filter(x => { total++; const k = x.trim().toLowerCase(); const ok = t.indexOf(k) >= 0 || t.indexOf(k.replace(/-/g, ' ')) >= 0 || t.indexOf(k.replace(/ /g, '-')) >= 0; if (ok) hit++; return !ok; });
      if (miss.length) out.push(id + ': ' + miss.join(' | '));
    });
    return { out, total, hit };
  }, B);
  console.log(r.out.join('\n') || 'every bullet found');
  console.log('coverage: ' + r.hit + '/' + r.total + ' official bullet terms found in their objective');
  await b.close(); process.exit(r.out.length ? 1 : 0);
})();
