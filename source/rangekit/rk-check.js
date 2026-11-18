#!/usr/bin/env node
/* RangeKit checker. Usage: node rk-check.js /abs/path/to/index.html [--shots dir]
   Fails (exit 1) on: page errors, missing labs, match answers not in the options, terminal tasks whose own
   "show" command is rejected, a learn part over 5 min, a part + lab over 15 min, parts with no quick check,
   objectives with fewer than 12 test questions, or a broken flip / lab / gate flow. */
const path = require('path');
let chromium;
try { chromium = require('playwright').chromium; } catch (e) { chromium = require('/home/claude/.npm-global/lib/node_modules/playwright').chromium; }
const file = process.argv[2]; if (!file) { console.error('usage: node rk-check.js /abs/index.html'); process.exit(2); }
const shotIdx = process.argv.indexOf('--shots'); const shots = shotIdx > 0 ? process.argv[shotIdx + 1] : null;
(async () => {
  const opts = { args: ['--no-sandbox'] }; if (require('fs').existsSync('/opt/pw-browsers/chromium')) opts.executablePath = '/opt/pw-browsers/chromium';
  const b = await chromium.launch(opts); const p = await b.newPage({ viewport: { width: 420, height: 900 } });
  // game-layer consoles (Sec+) pop level-up/badge modals; clear them so they never block the flow test
  await p.addInitScript(() => { setInterval(() => { document.querySelectorAll('.modal').forEach(m => m.remove()); }, 40); });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + path.resolve(file)); await p.waitForTimeout(1200);
  await p.evaluate(() => { localStorage.clear(); }); await p.reload(); await p.waitForTimeout(900);
  await p.evaluate(() => { const S = ENGINE.state(); S.device = 'phone'; ENGINE.persist(); }); await p.reload(); await p.waitForTimeout(1200); // skip the first-run device picker
  const rep = await p.evaluate(() => {
    const C = window.COURSE, fail = [], warn = [], rows = [];
    const W = h => String(h || '').replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
    const LM = { net: 10, drill: 4, match: 3, order: 3, calc: 4, acl: 6, term: 6, sh: 8, ad: 8, git: 8, code: 8, cloud: 8 };
    const labMin = id => { const L = C.labs[id] || {}; return L.min || LM[L.kind || 'net'] || 5; };
    Object.entries(C.labs).forEach(([k, L]) => {
      if (L.kind === 'match' && L.options) L.items.forEach(it => { if (L.options.indexOf(it.a) < 0) fail.push('lab ' + k + ': answer not in options: ' + it.a); });
      if (L.kind === 'term') L.tasks.forEach((t, i) => {
        if (!t.show) fail.push('lab ' + k + ' task ' + (i + 1) + ': no show command');
        else if (!t.accept.some(re => re.test(t.show.trim().replace(/\s+/g, ' ')))) fail.push('lab ' + k + ' task ' + (i + 1) + ': show command rejected by its own accept: ' + t.show);
        if (t.ask && !(t.ask.accept || []).length) fail.push('lab ' + k + ' task ' + (i + 1) + ': ask has no accept');
        const plain = String(t.t).replace(/<[^>]+>/g, ' ').toLowerCase(); if (t.show && t.show.length > 5 && plain.indexOf(t.show.toLowerCase()) >= 0) warn.push('lab ' + k + ' task ' + (i + 1) + ': task text gives away the command');
      });
    });
    let parts = 0, objs = 0;
    C.stages.forEach(s => {
      (s.labs || []).forEach(l => { if (!C.labs[l]) fail.push(s.id + ': missing lab ' + l); });
      (s.qs || []).forEach(q => { if (q.c && q.c.slice(1).indexOf(q.c[0]) >= 0) fail.push(s.id + ': duplicate choice in "' + String(q.q).slice(0, 50) + '"'); });
      if (!s.parts) return;
      if (s.obj) { objs++; if (s.qs.length < 12) fail.push(s.id + ': only ' + s.qs.length + ' test questions (need 12+; add RK.extra)'); if (!(s.wrap && s.wrap.recap && s.wrap.recap.length >= 4)) fail.push(s.id + ': wrap recap needs 4+ lines'); if (!(s.wrap && s.wrap.lab)) warn.push(s.id + ': no combined wrap lab'); }
      if (s.domWrap && !(s.wrap && s.wrap.lab)) warn.push(s.id + ': domain wrap has no combined lab');
      let withLab = 0;
      s.parts.forEach((pt, i) => {
        if (pt.recapOf || !s.obj) return; parts++;
        const w = W(pt.html), m = Math.max(2, Math.round(w / 150 + (pt.qi || []).length * 0.6 + 0.5)), lm = pt.lab ? labMin(pt.lab) : 0;
        if (pt.lab && !C.labs[pt.lab]) fail.push(s.id + ' part ' + (i + 1) + ': paired lab missing: ' + pt.lab);
        if (pt.lab) withLab++;
        if (m > 5) fail.push(s.id + ' part ' + (i + 1) + ': learn ~' + m + ' min (' + w + ' words) — split it');
        if (m + lm > 15) fail.push(s.id + ' part ' + (i + 1) + ': learn + lab ~' + (m + lm) + ' min — over 15');
        if (!(pt.qi || []).length) fail.push(s.id + ' part ' + (i + 1) + ': no quick check');
        if (!pt.obj || pt.obj.length < 20) fail.push(s.id + ' part ' + (i + 1) + ': missing/weak objective line');
        if (w < 90) warn.push(s.id + ' part ' + (i + 1) + ': thin (' + w + ' words)');
      });
      if (s.obj && withLab < Math.ceil(s.parts.length / 2)) warn.push(s.id + ': only ' + withLab + '/' + s.parts.length + ' parts have a paired lab');
      if (s.obj) rows.push(s.obj.padEnd(5) + ' parts ' + s.parts.length + ' · labs ' + (s.labs || []).length + ' · questions ' + s.qs.length + ' · cards ' + s.cards.length + ' · ' + s.title);
    });
    const sim = Object.values(C.labs).filter(L => ['term', 'net', 'sh', 'ad', 'git', 'code', 'cloud', 'acl'].indexOf(L.kind || 'net') >= 0).length;
    let pw = 0, pl = 0, pc = 0, pn = 0, minQ = 1e9;
    C.stages.forEach(s => { if (!s.parts || !s.obj) return; minQ = Math.min(minQ, s.qs.length); s.parts.forEach(pt => { pn++; pw += W(pt.html); if (pt.lab && C.labs[pt.lab]) pl++; if (/class="callout/.test(pt.html)) pc++; }); });
    const score = pn ? { avgWords: Math.round(pw / pn), pctLab: Math.round(100 * pl / pn), pctCallout: Math.round(100 * pc / pn), sim, minQ } : null;
    const term = Object.values(C.labs).filter(L => L.kind === 'term').length;
    return { fail, warn, rows, parts, objs, term, score, labs: Object.keys(C.labs).length };
  });
  // flow: first part-based stage with a paired terminal lab (else any paired lab)
  const flow = await p.evaluate(() => {
    const C = window.COURSE; let pick = null;
    C.stages.forEach(s => { if (!s.parts || pick) return; s.parts.forEach((pt, i) => { if (!pick && pt.lab && C.labs[pt.lab] && C.labs[pt.lab].kind === 'term') pick = { s: s.id, i, lab: pt.lab, track: s.track }; }); });
    if (!pick) C.stages.forEach(s => { if (!s.parts || pick) return; s.parts.forEach((pt, i) => { if (!pick && pt.lab && C.labs[pt.lab]) pick = { s: s.id, i, lab: pt.lab, track: s.track }; }); });
    return pick;
  });
  const flowFail = [];
  if (flow) {
    await p.evaluate(f => { const S = ENGINE.state(); S.device = 'phone'; S.track = f.track; // unlock everything before the picked stage
      let hit = false; COURSE.stages.forEach(s => { if (s.id === f.s) hit = true; if (!hit && s.track === f.track) ENGINE.st(s.id).passed = true; }); ENGINE.persist(); location.hash = '#stage/' + f.s + '/learn/' + f.i; }, flow);
    await p.waitForTimeout(500);
    if (!(await p.$('#sq'))) flowFail.push('quick check did not render on ' + flow.s);
    if (shots) await p.screenshot({ path: path.join(shots, 'part.png'), fullPage: true });
    await p.evaluate(f => { location.hash = '#lab/' + f.lab + '/' + f.s + '/' + f.i; }, flow); await p.waitForTimeout(500);
    const kind = await p.evaluate(f => COURSE.labs[f.lab].kind, flow);
    if (!(await p.$('#flipback'))) flowFail.push('flip-back banner missing in lab ' + flow.lab);
    if (kind === 'term') {
      const tasks = await p.evaluate(f => COURSE.labs[f.lab].tasks.map(t => ({ show: t.show, ans: t.ask ? String(t.ask.accept[0] instanceof RegExp ? '' : t.ask.accept[0]) : null })), flow);
      for (const t of tasks) { await p.fill('#cmd', t.show); await p.click('#run'); await p.waitForTimeout(120); if (t.ans !== null) { await p.fill('#ans', t.ans); await p.click('#ansb'); await p.waitForTimeout(120); } }
      if (shots) await p.screenshot({ path: path.join(shots, 'term.png'), fullPage: true });
    } else if (kind === 'match') {
      await p.evaluate(f => { const L = COURSE.labs[f.lab]; document.querySelectorAll('.pbq-row').forEach(r => { const it = L.items[+r.dataset.i], s = r.querySelector('select'); s.value = it.a; s.dispatchEvent(new Event('change', { bubbles: true })); }); }, flow);
      await p.click('#chk'); await p.waitForTimeout(200);
    }
    const done = await p.evaluate(f => !!(ENGINE.state().labx && ENGINE.state().labx[f.lab]), flow);
    if ((kind === 'term' || kind === 'match') && !done) flowFail.push('lab ' + flow.lab + ' did not complete when given the correct answers');
    await p.click('#flipback'); await p.waitForTimeout(300);
    const h = await p.evaluate(() => location.hash); if (h !== '#stage/' + flow.s + '/learn/' + flow.i) flowFail.push('flip back went to ' + h);
    // gate: pass the stage test with correct answers, expect the next stage to unlock
    const gate = await p.evaluate(f => { const s = COURSE.stages.find(x => x.id === f.s), S = ENGINE.state(), x = ENGINE.st(f.s); x.lesson = true; S.labx = S.labx || {}; s.labs.forEach(l => { x.labs[l] = true; S.labx[l] = true; }); ENGINE.persist(); location.hash = '#stage/' + f.s + '/gate'; return s.gateN; }, flow);
    await p.waitForTimeout(400);
    if (await p.$('#go')) {
      await p.click('#go'); await p.waitForTimeout(300);
      for (let i = 0; i < gate + 5; i++) {
        const st = await p.evaluate(f => { const qp = document.querySelector('#qp'); if (!qp) return 'none'; const qt = qp.querySelector('.q'); if (!qt) return 'none'; const q = qt.textContent.trim(), s = COURSE.stages.find(x => x.id === f.s), qq = s.qs.find(z => String(z.q || '').trim() === q);
          const inp = qp.querySelector('input'); if (inp) { inp.value = qq && qq.accept ? qq.accept[0] : 'x'; qp.querySelector('button').click(); return 'typed'; }
          const btns = [...qp.querySelectorAll('.choice')]; let bt = btns[0]; if (qq && qq.c) bt = btns.find(x => x.textContent.replace(/^[A-G]/, '').trim() === String(qq.c[qq.a]).trim()) || btns[0]; bt.click(); return 'mc'; }, flow);
        if (st === 'none') break; await p.waitForTimeout(350);
      }
      await p.waitForTimeout(400);
      const passed = await p.evaluate(f => ENGINE.st(f.s).passed, flow); if (!passed) flowFail.push('objective test on ' + flow.s + ' did not pass with correct answers');
    } else flowFail.push('gate start button missing on ' + flow.s);
    await p.evaluate(() => { location.hash = '#path'; }); await p.waitForTimeout(300);
    if (shots) await p.screenshot({ path: path.join(shots, 'path.png') });
  }
  // every terminal lab: type each canonical command (and the first accepted answer) and expect completion
  const termIds = await p.evaluate(() => Object.keys(COURSE.labs).filter(k => COURSE.labs[k].kind === 'term'));
  await p.evaluate(() => { COURSE.stages.forEach(s => { ENGINE.st(s.id).passed = true; }); ENGINE.persist(); });
  for (const id of termIds) {
    await p.evaluate(id => { try { localStorage.removeItem(Object.keys(localStorage).find(k => k.indexOf(id) >= 0) || '__none'); } catch (e) {} location.hash = '#lab/' + id; }, id);
    await p.waitForTimeout(250);
    if (await p.$('#rst')) { p.once('dialog', d => d.accept()); await p.click('#rst'); await p.waitForTimeout(150); }
    if (!(await p.$('#cmd'))) { flowFail.push('term lab ' + id + ' did not render a command line'); continue; }
    const tasks = await p.evaluate(id => COURSE.labs[id].tasks.map(t => ({ show: t.show, ans: t.ask ? String(t.ask.accept[0]) : null })), id);
    for (const t of tasks) { await p.fill('#cmd', t.show); await p.click('#run'); await p.waitForTimeout(60); if (t.ans !== null) { if (!(await p.$('#ans'))) { flowFail.push('term lab ' + id + ': task "' + t.show + '" did not advance to its question'); break; } await p.fill('#ans', t.ans); await p.click('#ansb'); await p.waitForTimeout(60); } }
    const ok = await p.evaluate(() => /All \d+ tasks complete/.test((document.querySelector('#task') || {}).textContent || ''));
    if (!ok) flowFail.push('term lab ' + id + ' did not complete with its own answers');
  }
  console.log(rep.rows.join('\n'));
  console.log('\nobjectives ' + rep.objs + ' · parts ' + rep.parts + ' · labs ' + rep.labs + ' (terminal ' + rep.term + ')');
  if (rep.score) console.log('scorecard inputs: avg ' + rep.score.avgWords + ' words/part · ' + rep.score.pctLab + '% of parts have a paired lab · ' + rep.score.pctCallout + '% of parts have an On-the-job/Exam-trap callout · ' + rep.score.sim + ' simulator/terminal labs · fewest test questions on an objective: ' + rep.score.minQ);
  rep.warn.forEach(w => console.log('WARN  ' + w));
  const fails = rep.fail.concat(flowFail, errs.map(e => 'page error: ' + e));
  fails.forEach(f => console.log('FAIL  ' + f));
  console.log(fails.length ? '\n✗ ' + fails.length + ' problem(s)' : '\n✓ all checks passed' + (flow ? ' (flow tested on ' + flow.s + ' / ' + flow.lab + ')' : ''));
  await b.close(); process.exit(fails.length ? 1 : 0);
})();
