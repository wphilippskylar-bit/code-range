/* RangeKit v1 — shared helpers for "Domain → Objective → Part" consoles.
   Load AFTER the course meta + old stage files and BEFORE the engine (app.js).
   Content files call RK.add({...}) for each objective; rk-build (RK.build) turns them into stages.
   See PLAYBOOK.md for the authoring rules. */
(function () {
  'use strict';
  var RK = window.RK = window.RK || { objs: [], labs: {}, built: [] };

  // ---------- lab helpers ----------
  // match lab: options = one list of choices; items = [text, answer, why]
  RK.M = function (id, title, sum, brief, options, items, debrief, hints) {
    RK.labs[id] = { kind: 'match', title: title, sum: sum, brief: brief, options: options, min: 3,
      items: items.map(function (i) { return { t: i[0], a: i[1], why: i[2] || '' }; }), debrief: debrief || '', hints: hints || [] };
  };
  // order lab: items listed in the CORRECT order = [text, why]
  RK.O = function (id, title, sum, brief, items, debrief, hints) {
    RK.labs[id] = { kind: 'order', title: title, sum: sum, brief: brief, min: 3,
      items: items.map(function (i) { return { t: i[0], why: i[1] || '' }; }), debrief: debrief || '', hints: hints || [] };
  };
  // calc lab: fields = [label, numeric answer, shown answer, why]
  RK.C = function (id, title, sum, brief, fields, debrief, hints, tol) {
    RK.labs[id] = { kind: 'calc', title: title, sum: sum, brief: brief, tolPct: tol || 0, min: 4,
      fields: fields.map(function (f) { return { label: f[0], a: f[1], show: f[2], why: f[3] || '' }; }), debrief: debrief || '', hints: hints || [] };
  };
  /* terminal lab: a scripted command line. env = { shell: 'cmd' | 'ps' | 'bash', prompt: 'C:\\Users\\tech>' }
     tasks = [{ t: 'what to do (plain words — never the literal command)', accept: [/^regex$/i, ...], show: 'canonical command',
                out: 'output printed on success', prompt: 'new prompt after this step (optional)',
                ask: { q: 'question about the output', accept: ['answer', ...], why: '' } (optional), why: 'one-line takeaway' }] */
  RK.T = function (id, title, sum, brief, env, tasks, debrief, hints) {
    RK.labs[id] = { kind: 'term', title: title, sum: sum, brief: brief, env: env || {}, tasks: tasks, debrief: debrief || '', hints: hints || [],
      min: Math.max(4, Math.min(12, 2 + tasks.length + tasks.filter(function (t) { return t.ask; }).length)) };
  };
  // part: h = title, obj = what you will be able to do, html = lesson, q = [[question, right, [wrong...], why], ...], lab = paired lab id
  RK.P = function (h, obj, html, q, lab) { return { h: h, obj: obj, html: html, q: q || [], lab: lab || null }; };
  RK.add = function (o) { RK.objs.push(o); };
  RK.setWrap = function (track, id, lab) { RK.objs.forEach(function (o) { if (o.track === track && o.id === id) o.wrap.lab = lab; }); };
  RK.cards = function (track, id, list) { RK.objs.forEach(function (o) { if (o.track === track && o.id === id) o.cards = (o.cards || []).concat(list); }); };
  RK.extra = function (track, id, list) { RK.objs.forEach(function (o) { if (o.track === track && o.id === id) o.extra = (o.extra || []).concat(list); }); };

  // ---------- build: objectives → stages ----------
  var W1 = ['COPPER', 'SIGNAL', 'PACKET', 'BEACON', 'SWITCH', 'CIPHER', 'ROUTER', 'MATRIX', 'VECTOR', 'TOKEN', 'PRISM', 'ORBIT', 'RELAY', 'FALCON', 'HARBOR', 'ANCHOR', 'COMET', 'GLACIER', 'EMBER', 'TUNDRA', 'CANYON', 'MERIDIAN', 'QUASAR', 'NEBULA', 'SUMMIT', 'ZENITH', 'BASALT', 'CEDAR', 'MAGNET', 'PILOT'];
  var W2 = ['LANTERN', 'RIVER', 'KESTREL', 'FORGE', 'HORIZON', 'GRANITE', 'BEARING', 'VALLEY', 'SPARROW', 'COMPASS', 'THUNDER', 'MARBLE', 'WILLOW', 'ARCHER', 'BRIDGE', 'CASCADE', 'DRIFT', 'FRONTIER', 'GARNET', 'HELIX', 'IVORY', 'JUNIPER', 'KEYSTONE', 'LOTUS', 'MOSAIC', 'NORTH', 'OASIS', 'PEBBLE', 'QUILL', 'RAVEN'];
  function qText(q) { return Array.isArray(q) ? String(q[0]) + ' ' + String((q[1] || [])[q[2] || 0]) : String(q.q || '') + ' ' + String((q.accept || [])[0] || ''); }
  function qDom(q) { return Array.isArray(q) ? q[4] : q.d; }
  function setD(q, d) { if (Array.isArray(q)) { q = q.slice(); q[4] = d; return q; } var o = {}; for (var k in q) o[k] = q[k]; o.d = d; return o; }
  function hits(re, text) { if (!re) return 0; var g = new RegExp(re.source, 'gi'), m = text.match(g); return m ? m.length : 0; }
  function best(objs, text) { var bi = -1, bs = 0; objs.forEach(function (o, i) { var n = hits(o.kw, text); if (n > bs) { bs = n; bi = i; } }); return bi; }

  /* cfg = { track: 'core2', pfx: 'c2', domains: [{ d: 1, tier: 'c2-os', name: 'Operating Systems', weight: 28, old: ['b1'], wrapLab: 'id', next: 'Domain 2' }] }
     Only domains that have objectives registered for cfg.track are rebuilt, so you can roll out one domain at a time. */
  RK.build = function (cfg) {
    var C = window.COURSE, Q = window.Q, U = cfg.unit || 'Domain';
    if (cfg.trackDef && !(C.tracks || []).some(function (t) { return t.id === cfg.track; })) {
      C.tracks = C.tracks || []; var ti = -1; C.tracks.forEach(function (t, i) { if (t.id === cfg.trackDef.after) ti = i; });
      var td = { id: cfg.track, name: cfg.trackDef.name, short: cfg.trackDef.short, subtitle: cfg.trackDef.subtitle };
      if (ti >= 0) C.tracks.splice(ti + 1, 0, td); else C.tracks.push(td);
    }
    cfg.domains.forEach(function (D) {
      if (!D.tierDef || C.tiers.some(function (t) { return t.id === D.tier; })) return;
      var li = -1; C.tiers.forEach(function (t, i) { if (t.track === cfg.track) li = i; });
      var nt = { id: D.tier, track: cfg.track, name: D.tierDef.name, desc: D.tierDef.desc };
      if (li >= 0) C.tiers.splice(li + 1, 0, nt); else C.tiers.push(nt);
    });
    Object.keys(RK.labs).forEach(function (k) { C.labs[k] = RK.labs[k]; });
    var byId = {}; C.stages.forEach(function (s) { byId[s.id] = s; });
    var newFor = {}, ci = 0, mig = [], appended = [];
    cfg.domains.forEach(function (D) {
      var objs = RK.objs.filter(function (o) { return o.track === cfg.track && o.dom === D.d; });
      if (!objs.length) return;
      var oldQ = [], oldC = [];
      (D.old || []).forEach(function (id) { var s = byId[id]; if (!s) return; (s.qs || []).forEach(function (q) { if (!D.strictDom || qDom(q) === D.d) oldQ.push(q); }); (s.cards || []).forEach(function (c) { oldC.push(c); }); });
      var qFor = objs.map(function () { return []; }), cFor = objs.map(function () { return []; }), looseQ = [], looseC = [];
      if (D.oldByObj) { // exact carry-over: objective id -> old stage id (questions, cards and labs keep their hand-assigned objective)
        oldQ = []; oldC = [];
        objs.forEach(function (o, oi) { var s = byId[D.oldByObj[o.id]]; if (!s) return;
          (s.qs || []).forEach(function (q) { qFor[oi].push(setD(q, D.d)); }); (s.cards || []).forEach(function (c) { cFor[oi].push(c); });
          o.moreLabs = (o.moreLabs || []).slice(); (s.labs || []).forEach(function (l) { if (o.moreLabs.indexOf(l) < 0) o.moreLabs.push(l); }); });
      }
      oldQ.forEach(function (q) { var i = best(objs, qText(q)); if (i < 0) looseQ.push(setD(q, D.d)); else qFor[i].push(setD(q, D.d)); });
      oldC.forEach(function (c) { var i = best(objs, String(c[0]) + ' ' + String(c[1])); if (i < 0) looseC.push(c); else cFor[i].push(c); });
      var out = [], domQs = [], recapParts = [], ids = [];
      objs.forEach(function (o, oi) {
        var qs = [];
        o.parts.forEach(function (p) { p.qi = []; (p.q || []).forEach(function (qq) { p.qi.push(qs.length); qs.push(Q(qq[0], qq[1], qq[2], qq[3], D.d)); }); });
        var nPart = qs.length;
        (o.extra || []).forEach(function (qq) { qs.push(Q(qq[0], qq[1], qq[2], qq[3], D.d)); });
        qs = qs.concat(qFor[oi]);
        var labs = [];
        o.parts.forEach(function (p) { if (p.lab && C.labs[p.lab] && labs.indexOf(p.lab) < 0) labs.push(p.lab); });
        if (o.wrap && o.wrap.lab && C.labs[o.wrap.lab] && labs.indexOf(o.wrap.lab) < 0) labs.push(o.wrap.lab);
        (o.moreLabs || []).forEach(function (l) { if (C.labs[l] && labs.indexOf(l) < 0) labs.push(l); });
        var num = o.id.replace('.', '_'), sid = cfg.pfx + 'o' + num;
        out.push({ id: sid, track: cfg.track, tier: D.tier, dom: D.d, unit: U, obj: o.id, title: o.id + ' ' + o.short, long: o.title, goal: o.goal,
          code: (cfg.pfx + o.id.replace('.', '')).toUpperCase() + '-' + W1[ci % W1.length] + '-' + W2[(ci * 7 + 3) % W2.length],
          parts: o.parts, wrap: o.wrap || { recap: [], lab: null }, qs: qs, cards: (o.cards || []).concat(cFor[oi]), labs: labs, gateN: Math.min(15, qs.length), partQ: nPart });
        ci++; ids.push(sid);
        var off = domQs.length; domQs = domQs.concat(qs);
        recapParts.push({ h: o.id + ' ' + o.short + ' — recap', obj: 'Recall the key points of objective ' + o.id + ' without looking.', recapOf: o.id,
          html: '<ul>' + ((o.wrap && o.wrap.recap) || []).map(function (r) { return '<li>' + r + '</li>'; }).join('') + '</ul>', q: [], qi: nPart >= 2 ? [off, off + 1] : [], lab: null });
      });
      domQs = domQs.concat(looseQ);
      var wid = cfg.pfx + 'dw' + D.d;
      out.push({ id: wid, track: cfg.track, tier: D.tier, dom: D.d, domWrap: true, unit: U, title: U + ' ' + D.d + ' wrap-up', long: U + ' ' + D.d + (U === 'Domain' ? '.0 ' : ' · ') + D.name + ' — wrap-up',
        goal: 'Recap every objective in ' + U + ' ' + D.d + ', run the combined lab, then pass the ' + U.toLowerCase() + ' test to open ' + (D.next || 'the next ' + U.toLowerCase()) + '.',
        code: (cfg.pfx + 'D' + D.d + 'W').toUpperCase() + '-' + W1[(ci + 11) % W1.length] + '-' + W2[(ci * 5 + 1) % W2.length],
        parts: recapParts, wrap: { recap: [], lab: D.wrapLab && C.labs[D.wrapLab] ? D.wrapLab : null }, qs: domQs, cards: looseC,
        labs: D.wrapLab && C.labs[D.wrapLab] ? [D.wrapLab] : [], gateN: Math.min(30, domQs.length) });
      ci++; ids.push(wid);
      if ((D.old || []).some(function (id) { return byId[id]; })) { var first = true; (D.old || []).forEach(function (id) { if (!byId[id]) return; newFor[id] = first ? out : []; first = false; }); }
      else appended.push(out);
      mig.push({ tier: D.tier, old: D.old || [], ids: ids });
    });
    var res = [];
    C.stages.forEach(function (s) { if (newFor[s.id]) newFor[s.id].forEach(function (n) { res.push(n); }); else res.push(s); });
    appended.forEach(function (list) { // brand-new modules: after the last stage of the same track, else at the end
      var li = -1; res.forEach(function (s, i) { if (s.track === cfg.track) li = i; });
      if (li >= 0) Array.prototype.splice.apply(res, [li + 1, 0].concat(list)); else res = res.concat(list);
    });
    C.stages.length = 0; res.forEach(function (s) { C.stages.push(s); });
    RK.built = RK.built.concat(mig);
    // one-time carry-over, per domain: if an old stage for the domain was passed, the new objectives start unlocked ("carried")
    C.migrate = function (S, st) {
      S.mig = S.mig || {};
      RK.built.forEach(function (m) {
        if (S.mig[m.tier]) return; S.mig[m.tier] = 1;
        var passed = m.old.length && m.old.every(function (id) { return S.stages[id] && S.stages[id].passed; });
        if (passed) m.ids.forEach(function (id) { var x = st(id); x.passed = true; x.carried = true; x.best = x.best || 90; });
      });
    };
  };

  // ---------- terminal lab kind ----------
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function notFound(shell, cmd) {
    var w = cmd.split(/\s+/)[0];
    if (shell === 'cmd') return "'" + w + "' is not recognized as an internal or external command,\noperable program or batch file.";
    if (shell === 'ps') return w + " : The term '" + w + "' is not recognized as the name of a cmdlet, function, script file, or operable program.";
    if (shell === 'ios') return "% Invalid input detected at '^' marker.";
    return 'bash: ' + w + ': command not found';
  }
  function renderTerm(m, L, api, fresh) {
    var saved = fresh ? null : api.load(), env = L.env || {}, shell = env.shell || 'bash';
    var i = saved && saved.i ? Math.min(saved.i, L.tasks.length) : 0, miss = 0, asking = false;
    var prompt = env.prompt || (shell === 'cmd' ? 'C:\\Users\\tech>' : shell === 'ps' ? 'PS C:\\Users\\tech>' : shell === 'ios' ? 'SW1#' : 'tech@ubuntu:~$');
    for (var k = 0; k < i; k++) { if (L.tasks[k].prompt) prompt = L.tasks[k].prompt; if (L.tasks[k].shell) shell = L.tasks[k].shell; }
    var keys = shell === 'bash' ? ['-', '/', '|', '~', '.', '*', '>', '"', '$', '@'] : ['-', '/', '\\', '|', ':', '.', '*', '"', '$', '@'];
    m.innerHTML = '<div class="row" style="margin-bottom:8px"><button class="btn sm ghost" data-go="' + api.back + '">← Back</button><span class="grow"></span>' +
      (L.hints && L.hints.length ? '<button class="btn sm ghost" id="hint">Hint</button>' : '') + '<button class="btn sm warn" id="rst">Reset</button></div>' +
      '<div class="tag">TERMINAL · HANDS-ON LAB · ' + esc(shell === 'cmd' ? 'Windows Command Prompt' : shell === 'ps' ? 'Windows PowerShell' : shell === 'ios' ? 'Switch / router CLI' : 'Linux shell') + '</div><h1 style="margin:4px 0 6px">' + esc(L.title) + '</h1>' +
      '<div class="panel tight small" style="margin-bottom:10px">' + L.brief + '</div>' +
      '<div class="panel tight" id="task" style="border-color:var(--acc);margin-bottom:10px"></div>' +
      '<div style="background:#05080c;border:1px solid var(--line);border-radius:12px;overflow:hidden">' +
      '<pre id="scr" style="margin:0;padding:10px 12px;min-height:150px;max-height:46vh;overflow:auto;white-space:pre-wrap;word-break:break-word;font:13px/1.45 var(--mono);color:#cfe3dc"></pre>' +
      '<div style="display:flex;align-items:center;gap:6px;padding:8px 10px;border-top:1px solid var(--line);background:#0a0f15"><span id="pr" style="font:13px var(--mono);color:var(--acc);white-space:nowrap;max-width:45%;overflow:hidden;text-overflow:ellipsis"></span>' +
      '<input id="cmd" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" style="flex:1;min-width:0;background:transparent;border:0;outline:0;color:#fff;font:14px var(--mono)" placeholder="type a command…">' +
      '<button class="btn sm pri" id="run">Run</button></div>' +
      '<div id="keys" style="display:flex;gap:4px;overflow-x:auto;padding:6px 8px;border-top:1px solid var(--line);background:#0a0f15">' + keys.map(function (c) { return '<button class="btn sm ghost" data-k="' + esc(c) + '" style="min-width:34px;font-family:var(--mono)">' + esc(c) + '</button>'; }).join('') + '</div></div>' +
      '<div id="out" style="margin-top:10px"></div>' +
      '<p class="dim small">Type the real command and press Enter (or Run). Type <b>help</b> if you are stuck. Commands are not shown in the task on purpose — recalling them is the skill.</p>';
    var scr = m.querySelector('#scr'), inp = m.querySelector('#cmd'), taskBox = m.querySelector('#task'), out = m.querySelector('#out');
    function print(t, color) { var s = document.createElement('span'); if (color) s.style.color = color; s.textContent = t + '\n'; scr.appendChild(s); scr.scrollTop = scr.scrollHeight; }
    function drawTask() {
      m.querySelector('#pr').textContent = prompt;
      if (i >= L.tasks.length) { taskBox.innerHTML = '<span class="chip ok">✓ All ' + L.tasks.length + ' tasks complete</span>'; return; }
      var t = L.tasks[i];
      taskBox.innerHTML = '<div class="tag">Task ' + (i + 1) + ' of ' + L.tasks.length + '</div><div style="margin-top:4px">' + t.t + '</div>' +
        (asking ? '<div style="margin-top:8px"><div class="small" style="color:var(--lock)">📖 Read the output: ' + t.ask.q + '</div><div class="row" style="gap:6px;margin-top:6px"><input id="ans" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" style="flex:1;min-width:0" placeholder="your answer"><button class="btn sm pri" id="ansb">Check</button></div><div id="ansr" class="small" style="margin-top:4px"></div></div>' : '') +
        (miss >= 4 && !asking ? '<div class="small" style="margin-top:6px;color:var(--lock)">Answer: <code>' + esc(t.show || '') + '</code> — type it yourself to continue.</div>' : (miss >= 2 && !asking && t.hint ? '<div class="small muted" style="margin-top:6px">💡 ' + t.hint + '</div>' : ''));
      if (asking) {
        var ab = taskBox.querySelector('#ansb'), ai = taskBox.querySelector('#ans');
        var chk = function () {
          var v = ai.value.trim().toLowerCase().replace(/\s+/g, ' ');
          var ok = t.ask.accept.some(function (a) { return a instanceof RegExp ? a.test(v) : String(a).toLowerCase() === v; });
          if (ok) { asking = false; if (t.ask.why) print('# ' + t.ask.why, '#7dd3a8'); advance(); }
          else taskBox.querySelector('#ansr').innerHTML = '<span style="color:var(--bad)">Not quite — look at the output again.</span>';
        };
        ab.onclick = chk; ai.onkeydown = function (e) { if (e.key === 'Enter') chk(); };
      }
    }
    function advance() {
      var t = L.tasks[i]; if (t.why) print('# ' + t.why, '#7dd3a8');
      i++; miss = 0; api.save({ i: i });
      if (i >= L.tasks.length) {
        out.innerHTML = '<div class="explain"><b class="v" style="color:var(--ok)">Lab complete.</b><div>' + (L.debrief || '') + '</div></div>';
        if (!api.done()) api.complete();
      }
      drawTask();
    }
    function run() {
      var raw = inp.value; inp.value = ''; var cmd = raw.trim().replace(/\s+/g, ' ');
      if (!cmd) return;
      print(prompt + (/[>$#]$/.test(prompt) ? ' ' : '') + cmd, '#ffffff');
      if (/^(cls|clear)$/i.test(cmd)) { scr.innerHTML = ''; return; }
      if (i >= L.tasks.length) { print('(lab finished — Reset to run it again)', '#8aa'); return; }
      var t = L.tasks[i];
      if (/^(help|\?)$/i.test(cmd)) { print(t.hint ? 'Hint: ' + t.hint.replace(/<[^>]+>/g, '') : 'No hint for this task. Re-read the paired Learn part.', '#e8c66a'); return; }
      if (asking) { print('(answer the question about the output above first)', '#e8c66a'); return; }
      var ok = t.accept.some(function (re) { return re.test(cmd); });
      if (ok) {
        if (t.out) print(t.out);
        if (t.prompt) prompt = t.prompt;
        if (t.shell) shell = t.shell;
        if (t.ask) { asking = true; drawTask(); var a = taskBox.querySelector('#ans'); if (a && !api.lite) a.focus(); } else advance();
        return;
      }
      var other = null; L.tasks.forEach(function (o, k) { if (k !== i && !other && o.accept.some(function (re) { return re.test(cmd); })) other = o; });
      if (other) { if (other.out) print(other.out); print('(that command works, but it is not what this task asks for)', '#e8c66a'); }
      else if (t.near && t.near.some(function (n) { return n[0].test(cmd); })) { print(t.near.filter(function (n) { return n[0].test(cmd); })[0][1], '#e8c66a'); }
      else print(notFound(shell, cmd), '#f2777a');
      miss++; drawTask();
    }
    m.querySelector('#run').onclick = run;
    inp.onkeydown = function (e) { if (e.key === 'Enter') { e.preventDefault(); run(); } };
    m.querySelector('#keys').addEventListener('click', function (e) { var b = e.target.closest('[data-k]'); if (!b) return; var s = inp.selectionStart == null ? inp.value.length : inp.selectionStart; inp.value = inp.value.slice(0, s) + b.dataset.k + inp.value.slice(inp.selectionEnd == null ? s : inp.selectionEnd); inp.focus(); inp.selectionStart = inp.selectionEnd = s + 1; });
    var hi = 0, h = m.querySelector('#hint');
    if (h) h.onclick = function () { var k = Math.min(hi++, L.hints.length - 1); api.modal('<div class="tag">Hint ' + (k + 1) + ' of ' + L.hints.length + '</div><p>' + L.hints[k] + '</p><button class="btn" data-close>Got it</button>'); };
    m.querySelector('#rst').onclick = function () { if (!confirm('Reset this lab?')) return; api.clear(); renderTerm(m, L, api, true); };
    if (env.banner) print(env.banner, '#8aa');
    if (i > 0 && i < L.tasks.length) print('(resumed at task ' + (i + 1) + ')', '#8aa');
    if (i >= L.tasks.length) out.innerHTML = '<div class="explain"><b class="v" style="color:var(--ok)">Lab complete.</b><div>' + (L.debrief || '') + '</div></div>';
    drawTask();
  }
  window.LAB_KINDS = window.LAB_KINDS || {};
  window.LAB_KINDS.term = { render: function (m, L, api) { renderTerm(m, L, api, false); } };
  // LAB_KINDS may be re-assigned by a later file; re-attach just before the engine boots
  RK.attachKinds = function () { window.LAB_KINDS = window.LAB_KINDS || {}; if (!window.LAB_KINDS.term) window.LAB_KINDS.term = { render: function (m, L, api) { renderTerm(m, L, api, false); } }; };
})();
