#!/usr/bin/env python3
"""RangeKit engine patch: teaches a track-based Range engine (A+, Sec+, Cloud, Code) to render
"part-based" stages (s.parts) — objective statement, quick check, paired lab, flip back, wrap-ups.

Usage:  python3 partsify.py <file>      # <file> is src/app.js (A+, Sec+) or index.html (Cloud, Code)
Idempotent: a file that already carries the marker is left alone. Exits non-zero if a required anchor is missing.
Stages WITHOUT s.parts keep working exactly as before, so a console can be converted one domain at a time."""
import sys, re

MARK = '/* RANGEKIT-PARTS v2 */'
path = sys.argv[1]
s = open(path, encoding='utf-8').read()
if MARK in s:
    print('already patched:', path); sys.exit(0)

def rep(a, b, required=True, name=''):
    global s
    n = s.count(a)
    if n != 1:
        msg = '%s anchor %r found %d times' % (name, a[:70], n)
        if required: sys.exit('FAILED: ' + msg)
        print('skipped (optional):', msg); return
    s = s.replace(a, b)

# 1) Learn tab renders parts; rename the gate tab; drop an empty Cards tab
rep("    if (!(s.labs || []).length) tabs.splice(3, 1);",
    "    if (!(s.labs || []).length) tabs.splice(3, 1);\n"
    "    if (s.parts) { tabs[tabs.length - 1][1] = (s.domWrap ? (s.unit || 'Domain') + ' test' : (s.obj ? (s.unit === 'Module' ? 'Lesson test' : 'Objective test') : 'Gate')) + (x.passed ? ' ✓' : ' 🔒'); if (!s.cards.length) { tabs.splice(1, 1); if (tab === 'cards') tab = 'learn'; } }",
    name='tabs')
rep("({ learn: pLearn, cards: pCards, practice: pPractice, labs: pLabs, gate: pGate })[tab](pane, s);",
    "({ learn: s.parts ? pParts : pLearn, cards: pCards, practice: pPractice, labs: pLabs, gate: pGate })[tab](pane, s);", name='dispatch')

# 2) labs count as done wherever they were completed (a lab can be paired with a part AND listed in a wrap-up)
rep("  function labsDone(s) { return (s.labs || []).filter(function (l) { return st(s.id).labs[l]; }).length; }",
    "  function labDone(s, l) { return !!(st(s.id).labs[l] || (S.labx && S.labx[l])); }\n"
    "  function labsDone(s) { return (s.labs || []).filter(function (l) { return labDone(s, l); }).length; }", name='labsDone')

# 3) path: under the current part-based stage, list its parts with minutes and check/lab chips
rep("        var parts = s.lesson || [], rd = x.lesson ? parts.length : (x.pread || 0);",
    "        if (s.parts) { if (un && cur && cur.id === s.id) html += partList(s); return; }\n"
    "        var parts = s.lesson || [], rd = x.lesson ? parts.length : (x.pread || 0);", name='path')
rep("(x.passed ? '✓' : (un ? (s.tidx + 1) : '🔒'))", "(x.passed ? '✓' : (un ? (s.obj || (s.domWrap ? '🏁' : s.tidx + 1)) : '🔒'))", required=False, name='num')
rep("<span class=\"t\">' + (s.tidx + 1) + '. ' + esc(s.title)", "<span class=\"t\">' + (s.obj || s.domWrap ? '' : (s.tidx + 1) + '. ') + esc(s.title)", required=False, name='title')
rep("var sub = x.passed ? 'Passed · best ' + x.best + '%' :", "var sub = x.passed ? (x.carried && !x.attempts ? 'Carried over from your earlier progress' : 'Passed · best ' + x.best + '%') :", required=False, name='carried')

# 4) the part engine itself
PARTS = r"""
  __MARK__
  // ---------- part-based stages (domain → objective → part) ----------
  S.labx = S.labx || {};
  var LABMIN = { net: 10, drill: 4, match: 3, order: 3, calc: 4, acl: 6, term: 6, sh: 8, ad: 8, git: 8, code: 8, cloud: 8 };
  function labMin(id) { var L = C.labs[id] || {}; return L.min || LABMIN[L.kind || 'net'] || 5; }
  function words(h) { return String(h || '').replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length; }
  function partMin(p) { return Math.max(2, Math.round(words(p.html) / 150 + (p.qi || []).length * 0.6 + 0.5)); }
  function allParts(s) { var a = s.parts.slice(); if (s.wrap && ((s.wrap.recap && s.wrap.recap.length) || s.wrap.lab || s.domWrap)) a.push({ wrap: true, h: s.domWrap ? (s.unit || 'Domain') + ' lab & test' : 'Wrap-up', obj: s.domWrap ? 'Combine everything in this ' + (s.unit || 'Domain').toLowerCase() + ', then pass its test.' : 'Recall every part of ' + s.obj + ', run the combined lab, then take the objective test.', html: '', qi: [] }); return a; }
  function stageMins(s) { return allParts(s).reduce(function (t, p) { return t + (p.wrap ? 3 : partMin(p)) + (p.lab ? labMin(p.lab) : 0); }, 0) + (s.wrap && s.wrap.lab ? labMin(s.wrap.lab) : 0); }
  function partDone(s, i) { var x = st(s.id); return x.lesson || i < (x.pread || 0); }
  function partList(s) {
    var ps = allParts(s);
    return '<div style="margin:1px 0 12px 22px;border-left:2px solid var(--line);padding-left:12px;display:flex;flex-direction:column;gap:5px">' +
      ps.map(function (p, i) {
        var done = partDone(s, i), lab = p.wrap ? s.wrap.lab : p.lab;
        var tg = (p.qi && p.qi.length ? '<span class="chip" style="padding:0 6px;font-size:10px">✎ check</span>' : '') + (lab && C.labs[lab] ? '<span class="chip" style="padding:0 6px;font-size:10px">' + (C.labs[lab].kind === 'term' ? '⌨ terminal' : '🧪 lab') + (labDone(s, lab) ? ' ✓' : '') + '</span>' : '');
        return '<button data-go="#stage/' + s.id + '/learn/' + i + '" style="display:flex;align-items:center;gap:8px;background:none;border:0;padding:3px 2px;cursor:pointer;text-align:left;font:inherit;color:' + (done ? 'var(--ok)' : 'var(--muted)') + '">' +
          '<span style="flex:0 0 18px;height:18px;border-radius:50%;border:1px solid currentColor;display:inline-flex;align-items:center;justify-content:center;font-size:11px">' + (done ? '✓' : (p.wrap ? '🏁' : i + 1)) + '</span>' +
          '<span style="flex:1;min-width:0">' + esc(p.h) + ' <span class="dim small">· ~' + (p.wrap ? 3 : partMin(p)) + ' min</span></span>' + tg + '</button>';
      }).join('') + '</div>';
  }
  var PAIR = {};
  STAGES.forEach(function (s) { if (!s.parts) return; allParts(s).forEach(function (p, i) { var l = p.wrap ? s.wrap.lab : p.lab; if (l && !PAIR[l]) PAIR[l] = { s: s, i: i, p: p }; }); });
  function labPanel(s, id, i, wrap) {
    var L = C.labs[id]; if (!L) return '';
    var d = labDone(s, id);
    return '<div class="panel" style="border-color:' + (wrap ? 'var(--lock)' : 'var(--acc2)') + ';margin-top:12px"><div class="tag">' + (wrap ? '🏁 Combined lab' : (L.kind === 'term' ? '⌨ Paired terminal lab for this part' : '🧪 Paired lab for this part')) + ' · ~' + labMin(id) + ' min</div>' +
      '<b style="display:block;margin:4px 0">' + esc(L.title) + '</b><div class="muted small">' + esc(L.sum || '') + '</div>' +
      '<div class="row" style="margin-top:8px;gap:8px"><button class="btn ' + (d ? '' : 'pri') + '" data-go="#lab/' + id + '/' + s.id + '/' + i + '">' + (d ? 'Revisit lab' : 'Flip to the lab →') + '</button>' + (d ? '<span class="chip ok">✓ Done</span>' : '') + '</div></div>';
  }
  function pParts(p, s) {
    var x = st(s.id), ps = allParts(s), N = ps.length;
    var read = x.lesson ? N : (x.pread || 0);
    var idx = view.part[s.id]; if (idx == null) idx = Math.min(read, N - 1);
    idx = Math.max(0, Math.min(idx, N - 1)); view.part[s.id] = idx;
    var part = ps[idx], isLast = idx === N - 1, body = '';
    var gq = Math.min(s.gateN || 15, s.qs.length);
    if (part.wrap) {
      if (!s.domWrap) body = '<div class="panel lesson"><h3>🏁 ' + esc(s.obj) + ' wrap-up</h3><p class="muted small">Say each line out loud before you read it. If one feels shaky, tap its part below to flip back.</p><ul>' + (s.wrap.recap || []).map(function (r) { return '<li>' + r + '</li>'; }).join('') + '</ul>' +
        '<div class="row" style="gap:6px;flex-wrap:wrap">' + s.parts.map(function (pp, k) { return '<button class="btn sm ghost" data-go="#stage/' + s.id + '/learn/' + k + '">' + (k + 1) + '. ' + esc(pp.h) + '</button>'; }).join('') + '</div></div>';
      else body = '<div class="panel lesson"><h3>🏁 ' + esc(s.unit || 'Domain') + ' ' + s.dom + ' — put it all together</h3><p>You have recapped every objective. Run the combined lab, then take the <b>' + gq + '-question test</b>. ' + PASS + '% or better opens the next ' + esc((s.unit || 'Domain').toLowerCase()) + '.</p></div>';
      if (s.wrap.lab) body += labPanel(s, s.wrap.lab, idx, true);
      body += '<div class="panel" style="margin-top:12px"><div class="tag">' + (s.domWrap ? esc(s.unit || 'Domain') + ' test' : 'Test') + '</div><p class="small">' + gq + ' questions from ' + (s.domWrap ? esc(s.unit || 'Domain') + ' ' + s.dom + ' only' : esc(s.obj) + ' only') + '. Pass with ' + PASS + '% or better.</p><button class="btn pri" data-go="#stage/' + s.id + '/gate">Go to the test →</button></div>';
    } else {
      body = '<div class="panel" style="border-color:var(--acc);margin-bottom:10px;padding:10px 12px"><div class="tag">🎯 Objective for this part</div><div style="margin-top:4px">' + esc(part.obj) + '</div></div>' +
        '<div class="panel lesson"><h3>' + esc(part.h) + '</h3>' + part.html + '</div>';
      if (part.qi && part.qi.length) body += '<div class="panel" style="border-color:var(--acc2);margin-top:12px"><div class="tag">✎ Quick check</div><div id="sq"></div></div>';
      if (part.lab) body += labPanel(s, part.lab, idx, false);
    }
    p.innerHTML = '<div class="row" style="justify-content:space-between;align-items:center;margin-bottom:8px">' +
      '<span class="tag">Part ' + (idx + 1) + ' of ' + N + ' · ~' + (part.wrap ? 3 : partMin(part)) + ' min' + (part.lab ? ' + ' + labMin(part.lab) + ' min lab' : '') + '</span>' +
      '<span class="chip ' + (read >= N ? 'ok' : '') + '">' + Math.min(read, N) + '/' + N + ' parts</span></div>' +
      '<div class="bar" style="margin-bottom:12px"><i style="width:' + Math.round(100 * Math.min(read, N) / N) + '%"></i></div>' + body +
      '<div class="row small" style="margin-top:8px;align-items:center;gap:8px"><span class="muted">Resume code for this part:</span><span class="mono" style="color:var(--acc)">' + esc(partCode(s, idx)) + '</span><button class="btn sm ghost" data-cp="' + esc(partCode(s, idx)) + '">Copy</button></div>' +
      '<div class="row" style="margin-top:12px;justify-content:space-between">' +
      '<button class="btn" id="pv"' + (idx === 0 ? ' disabled' : '') + '>← Back</button>' +
      (!isLast ? '<button class="btn pri" id="nx">' + (idx < read ? 'Next part →' : 'Got it — next part →') + '</button>'
        : (read >= N ? '<button class="btn" data-go="#stage/' + s.id + '/gate">Go to the test →</button>' : '<button class="btn pri" id="fin">Finish the parts ✓</button>')) + '</div>';
    p.querySelectorAll('[data-cp]').forEach(function (b) { b.onclick = function () { copy(b.dataset.cp); }; });
    var pv = $('#pv', p); if (pv) pv.onclick = function () { view.part[s.id] = idx - 1; route(); };
    var nx = $('#nx', p); if (nx) nx.onclick = function () { if (!x.lesson && idx + 1 > (x.pread || 0)) x.pread = idx + 1; if ((x.pread || 0) >= N) x.lesson = true; view.part[s.id] = idx + 1; persist(); route(); };
    var fin = $('#fin', p); if (fin) fin.onclick = function () { x.pread = N; x.lesson = true; persist(); route(); };
    if (part.qi && part.qi.length) {
      var sq = $('#sq', p), qi = 0, key = 'p' + idx;
      var draw = function () {
        if ((x.seg && x.seg[key]) || qi >= part.qi.length) { sq.innerHTML = '<span class="chip ok">✓ Check complete</span> <button class="btn sm ghost" id="sqr">Redo</button>'; if (!x.seg) x.seg = {}; x.seg[key] = true; persist(); $('#sqr', sq).onclick = function () { x.seg[key] = false; qi = 0; draw(); }; return; }
        var q = prep(s.qs[part.qi[qi]]);
        sq.innerHTML = '<div class="small muted" style="margin-bottom:6px">Q' + (qi + 1) + ' / ' + part.qi.length + '</div><div id="sqp">' + renderQ(q) + '</div>';
        wire($('#sqp', sq), q, function () {
          var r = document.createElement('div'); r.className = 'row'; r.style.marginTop = '8px';
          r.innerHTML = '<button class="btn pri" id="sqn">' + (qi + 1 >= part.qi.length ? 'Finish check ✓' : 'Next →') + '</button>';
          $('#sqp', sq).appendChild(r); $('#sqn', sq).onclick = function () { qi++; draw(); };
        }, true);
      };
      draw();
    }
  }

  // ---------- flashcards (Leitner) ----------""".replace('__MARK__', MARK)
rep("  // ---------- flashcards (Leitner) ----------", PARTS, name='flash')

# 5) lab page: remember the part it was opened from, flip-back banner, global completion
rep("  function labStage(id) { return STAGES.filter(function (s) { return (s.labs || []).indexOf(id) >= 0; })[0]; }",
    "  function labStage(id) { return PAIR[id] ? PAIR[id].s : STAGES.filter(function (s) { return (s.labs || []).indexOf(id) >= 0; })[0]; }", name='labStage')
rep("    var id = args[0], L = C.labs[id], s = labStage(id);",
    "    var id = args[0], L = C.labs[id], s = (args[1] && stageById(args[1])) || labStage(id), pi = args[2] != null && args[2] !== '' ? +args[2] : (PAIR[id] && PAIR[id].s === s ? PAIR[id].i : null);", name='vlab1')
rep("if (!st(s.id).labs[id]) { st(s.id).labs[id] = true;",
    "S.labx[id] = true; var fb = document.getElementById('flipback'); if (fb) fb.classList.add('pri'); if (!st(s.id).labs[id]) { st(s.id).labs[id] = true;", name='complete')
rep("      done: function () { return !!st(s.id).labs[id]; },", "      done: function () { return labDone(s, id); },", name='done')
rep("      back: '#stage/' + s.id + '/labs',", "      back: pi != null && s.parts ? '#stage/' + s.id + '/learn/' + pi : '#stage/' + s.id + '/labs',", name='back')
rep("    kind.render(m, L, api);",
    "    kind.render(m, L, api);\n"
    "    if (pi != null && s.parts) {\n"
    "      var pp = allParts(s)[pi] || {}, bn = document.createElement('div');\n"
    "      bn.className = 'panel'; bn.style.cssText = 'border-color:var(--acc);margin-bottom:10px;padding:10px 12px';\n"
    "      bn.innerHTML = '<div class=\"row\" style=\"gap:8px;align-items:center\"><span class=\"grow\"><span class=\"tag\">📖 Paired with ' + esc(s.obj || s.title) + ' · Part ' + (pi + 1) + '</span><b style=\"display:block;margin-top:2px\">' + esc(pp.h || '') + '</b>' +\n"
    "        '<span class=\"small muted\">🎯 ' + esc(pp.obj || '') + '</span></span><button class=\"btn sm\" id=\"flipback\" data-go=\"#stage/' + s.id + '/learn/' + pi + '\">⇄ Flip back to Learn</button></div>';\n"
    "      m.insertBefore(bn, m.firstChild);\n"
    "    }", name='render')

# 6) practice-exam pool: domain wrap-ups reuse objective questions, so de-duplicate by question text
rep("o.qs.forEach(function (q) { if (q.d) pool.push(q); });",
    "o.qs.forEach(function (q) { var k = q.gen ? null : String(q.q); pool._seen = pool._seen || {}; if (q.d && (!k || !pool._seen[k])) { if (k) pool._seen[k] = 1; pool.push(q); } });", name='pool')

# 7) one-time carry-over of old progress (COURSE.migrate is set by RK.build)
rep("  // ---------- boot ----------", "  if (C.migrate) { try { C.migrate(S, st); persist(); } catch (e) { } }\n  // ---------- boot ----------", name='boot')

# skill tracks (unit 'Module') label their header chip "Module N" instead of "Domain N.0" (optional anchor)
rep("""style="margin:0 6px 4px 0">Domain ' + esc(domLabel(d)) + '</span>'""", """style="margin:0 6px 4px 0">' + (s.unit === 'Module' ? 'Module ' + d : 'Domain ' + esc(domLabel(d))) + '</span>'""", required=False, name='unit chip')
open(path, 'w', encoding='utf-8').write(s)
print('patched:', path)
