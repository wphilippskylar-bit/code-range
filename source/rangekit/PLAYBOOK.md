# Console Upgrade Playbook

How to finish rebuilding Phil's study consoles to the same standard as **Net+ Range** and **A+ Core 2 Domain 1**.
Written for whichever model (or person) continues the work. Read this whole file before touching a repo.

## 1. The standard (what "done" means)

Every certification console follows **Domain → Objective → Part**, in the official exam-objective order.

- **No mixed domains** until the final practice exam.
- **Objective** = one stage, titled with the official number (`1.5 Microsoft command-line tools`) and showing CompTIA's exact objective statement.
- **Part** = one idea. Target 2–3 minutes of reading, **never over 5**; a part plus its lab never over **15**.
  Each part has:
  1. `obj` — "🎯 Objective for this part": one sentence starting with a verb, saying what the learner will be able to *do*.
  2. `html` — the lesson. Plain words, short sentences, a table when comparing 3+ things. Define every term the first time.
  3. `q` — a quick check of 2–3 multiple-choice questions on exactly what the part taught.
  4. `lab` — a **paired lab that practices only what that part taught** (at least half the parts in an objective, all of them where a lab makes sense).
- **Objective wrap-up** = 5–6 recap lines + one *combined* lab (different from any part's lab) + a 15-question objective test.
- **Domain wrap-up** = recap of every objective + a bigger mixed lab + a 30-question domain test. 90% or better unlocks the next stage.
- **Flip**: every lab opens from its part ("Flip to the lab →") and has a banner back to that exact part ("⇄ Flip back to Learn"). The engine does this; you only set `lab`.

### Writing rules (these are what make it feel like TryHackMe / Professor Messer)

- Teach **only what the objective lists**, bullet by bullet — every bullet in the official objective must appear in some part. Do not drift into other objectives; point forward instead ("more in 4.9").
- Beginner-first (a true beginner uses these): no undefined jargon, one idea per sentence. Then add one professional touch per part:
  - `<div class="callout pro"><b class="k">On the job</b> …</div>` — how a working tech really uses it.
  - `<div class="callout trap"><b class="k">Exam trap</b> …</div>` — the confusion the exam exploits.
- Symptom → cause → fix tables for anything troubleshooting.
- Labs must match the verb of the objective: "Given a scenario, use…" → the learner *uses* it (terminal lab or scenario match). "Compare and contrast…" → a pick-the-right-one lab.
- **Terminal labs** (`RK.T`) are the priority wherever a command exists. Rules:
  - The task says **what to achieve, never the command**.
  - Give realistic output, then where useful an `ask` question that makes the learner **read the output**.
  - Chain tasks into one real ticket (config → gateway → DNS → path), not a list of unrelated commands.
  - `accept` regexes must be forgiving (spacing, common variants) and `show` must pass its own `accept` (the checker enforces this).
- Questions: one clearly right answer, three plausible wrong ones, and an explanation that teaches. No "all of the above".
- Everything stays **defensive / simulated / authorized-only**. No live targets, no attack tooling instructions beyond what the exam objectives themselves name.

## 2. Grading rubric (use this, critically, before and after every domain)

Score what a stranger could verify, not what you intended. If you cannot point to the evidence named in a row, take the lower band.
Five criteria, 20 points each. **90+ overall and no criterion under 17** is the bar. Never report a score without pasting the checker's
"scorecard inputs" line and the coverage audit result next to it.

| Criterion | 0–8 (failing) | 9–13 (thin) | 14–16 (exam-ready) | 17–18 (job-ready) | 19–20 (could teach it) | Evidence required |
|---|---|---|---|---|---|---|
| **1. Objective coverage** | Topics, not objectives | Objectives present, many official bullets missing | Every objective; a few bullets missing or in the wrong objective | **Every official bullet** taught under its own objective, in official order | …and each bullet is also practiced or tested | Coverage audit: list of official bullets checked against lesson text, misses explained |
| **2. Depth & accuracy** | Bullet-point summaries | Definitions only (<80 words/part) | Explains *what* and *why*; correct (100–140 words/part) | Adds *how it fails* and *what a tech does*: an On-the-job and an Exam-trap callout on every part (140–220 words/part) | Worked examples, real output and symptom→cause→fix for every troubleshooting item | Avg words/part, % parts with callouts, a spot-read of 5 random parts for errors |
| **3. Hands-on** | No labs | Labs exist but are not tied to parts | Half the parts have a matching lab, mostly pick/match | **85%+ of parts** paired; simulator or terminal labs wherever a command or config exists; labs chain into real tickets | Every "Given a scenario" objective ends in a multi-step ticket the learner solves from output alone | % parts with paired lab, count of simulator/terminal labs, list of scenario objectives without one |
| **4. Structure & pacing** | One long page per domain | Stages by topic, mixed domains | Domain → objective, some parts over 5 min | Domain → objective → part; every learn part ≤5 min, part + lab ≤15; objective and domain wrap-ups with distinct combined labs | …and the flip between a part and its lab loses no place on a phone | Checker passes; timing table |
| **5. Assessment** | <5 questions per objective | Questions not tied to objectives | 12+ per objective, quick checks on most parts | Quick check on every part; 15+ per objective; explanations teach; domain tests and a weighted, timed exam | Question bank hand-reviewed per objective (none misfiled), PBQ-style items in tests | Fewest questions on any objective; note whether the bank was sorted by keyword or reviewed by hand |

Honesty rules for the grader:
- A console that is "rebuilt in the new format" but averages 100 words a part is a 13–14 on depth, not a 17.
- Match/pick labs count for coverage of a part but do **not** raise hands-on above 16 on their own; that needs typed commands or a simulator.
- Auto-sorted question banks cap assessment at 18 until someone reviews them objective by objective.
- If the official objective numbering was read from a PDF, cross-check it against a second source (Professor Messer's course-notes index). PDF text extraction scrambled the numbering for both Net+ Domain 3 and A+ Core 1 Domain 3.

## 2b. Report card (updated 17 Nov 2026)

| Console | Coverage | Depth | Hands-on | Structure | Assessment | **Now** | What moves it up |
|---|---|---|---|---|---|---|---|
| Net+ Range (N10-009) | 19 | 17 | 18 | 19 | 17 | **90** | Hand-review the keyword-sorted question bank per objective; multi-step tickets for 3.4 and 5.4 |
| A+ Range — Core 2 Domain 1 (rebuilt) | 19 | 17 | 18 | 19 | 17 | **90** | Hand-review the auto-sorted question bank (caps assessment at 18) |
| A+ Range — Core 2 Domain 4 (rebuilt) | 19 | 17 | 18 | 19 | 17 | **90** | 17 Nov: terminal tickets added for 4.1 (asset inventory), 4.2 (change + rollback with restore points), 4.3 (robocopy/wbadmin backup + restore test). 4.4 safety stays pick/order (no commands) |
| A+ Range — Core 2 Domain 2 (rebuilt) | 19 | 17 | 18 | 19 | 17 | **90** | 2.10 has no terminal ticket (router config sim would lift it); hand-review the sorted bank |
| A+ Range — Core 2 Domain 3 (rebuilt) | 19 | 17 | 18 | 19 | 17 | **90** | 3.2 is pick-labs only (mobile); 3.3 has 15 questions (minimum) — add 3–5 more scenario questions |
| A+ Range — Core 1, all 5 domains (rebuilt 17 Nov) | 19 | 17 | 18 | 19 | 17 | **90** | 3.6 PSU and 3.8 printer maintenance have calc/order labs, not command tickets (nothing to type for them); hand-review the keyword-sorted old bank |
| Security+ Range (SY0-701) | 16 | 9 | 8 | 12 | 18 | **63** | Parts, callouts, paired labs on all 28 objectives |
| Cloud Range (15 cert tracks) | 10 | 10 | 10 | 9 | 12 | **51** | One ladder rebuilt by official domain → objective |
| Code Range — Remote Access track (new, 17 Nov) | 18 | 17 | 19 | 19 | 17 | **90** | 7 lessons, 16 terminal labs (SSH/scp/tunnels/jump hosts/sshd hardening, RDP sessions + enabling, WinRM, support audit, troubleshooting ladders). Assessment 17: bank is new and hand-written but only 15–16 per lesson |
| Code Range — Windows track (rebuilt, 17 Nov) | 18 | 17 | 19 | 19 | 17 | **90** | 6 lessons, 14 terminal labs (CMD navigation/files/network/admin/redirection, PowerShell help/pipeline/admin/scripts) |
| Code Range — other 9 tracks | 16 | 14 | 18 | 10 | 12 | **70** | AD and Linux next (convert to parts with their real simulators); then SQL, Python, JS, C++, Git, AI, Fix |

Net+ evidence (from `rk-check.js` and `coverage-check.js`): 25 objectives, 101 parts, avg 158 words/part, 88% of parts with a paired lab,
100% with callouts, 29 simulator/terminal labs, 15+ test questions on every objective, every official bullet found in its objective's lessons.
Net+ went 84 → 90 by adding 7 terminal labs, two callouts on every part, and the bullet-by-bullet audit — that is the recipe for the others.

Why the others are low:
- **A+ (old domains)**: about 250 words of lesson per *domain*. It is a question bank with a thin summary on top.
- **Security+**: already organized by objective and has 1,300 questions, but only ~170 words of teaching per objective and 13 objectives with no lab.
- **Cloud**: far too wide for its depth — 15 certifications at 3–6 stages each. Finish one ladder properly before widening.
- **Code**: best hands-on of all (real code runner, shell, Git and AD simulators) but the Windows track is 2 stages with no labs, there is no remote-access track, and nothing is in the part format yet.

## 3. Work queue (do in this order)

Each item is one sitting. Finish, run the checker, push, tick it off here.

**A+ Range** (`aplus-exams-practice`) — objective lists are in `source/objectives/`.
- [x] Core 2 Domain 1 — Operating Systems (1.1–1.11)
- [x] Core 2 Domain 1 depth pass to reach 90 (avg 172 words/part, 100% paired labs, 100% callouts, 11 terminal labs, 15+ questions per objective, 262/262 official bullets): add the missing On-the-job / Exam-trap callouts, pair labs with the parts that have none (1.1 p3, 1.2 p1, 1.3 p1, 1.4 p3, 1.5 p3, 1.8 p2, 1.9 p1, 1.11 p1), top up 1.11 and 1.10 to 15+ questions, run a bullet audit against `source/objectives/220-1202-core2.md`.
- [x] Core 2 Domain 4 — Operational Procedures (4.1–4.10), 17 Nov: 25 parts, 6 terminal labs (PowerShell script, bash script review, RDP, SSH keys, WinRM, domain shift), 437/437 bullets. **4.8 scripting and 4.9 remote access get terminal labs** (ssh, mstsc, Enter-PSSession, winrm). Wrap lab id `c2-d4-wrap`.
- [x] Core 2 Domain 2 — Security (2.1–2.11), 17 Nov: 30 parts, 9 terminal labs incl. **Active Directory in PowerShell** (join, OU move, groups, home folder, gpresult), Defender/firewall, NTFS icacls, BitLocker, hardening, malware removal, hash check; 671/671 bullets. **2.2 covers Active Directory** (domain join, OUs, home folders, GPO, security groups, folder redirection): scenario labs + PowerShell terminal lab. Wrap lab `c2-d2-wrap`.
- [x] Core 2 Domain 3 — Software Troubleshooting (3.1–3.4), 17 Nov: 10 parts, 5 terminal labs (WinRE bootrec/sfc offline, performance + DISM/sfc, services + w32tm, hosts/proxy/flushdns redirect fix, **adb clean-up of a spoofed Android app**) + domain shift `c2-d3-wrap`; 722/722 Core 2 bullets. **Core 2 complete.**
- [x] Core 1 Domain 1 — Mobile Devices (1.1–1.3), 17 Nov: battery report, laptop RAM/SSD upgrade, phone-hotspot netsh, adb MDM/data-saver labs.
- [x] Core 1 Domain 2 — Networking (2.1–2.8), 17 Nov: listening ports, Wi-Fi band/channel, DNS mail records (SPF/DKIM/DMARC), ARP/MAC, APIPA/DHCP/static labs; T568B order lab.
- [x] Core 1 Domain 3 — Hardware (3.1–3.8), 17 Nov. Numbering confirmed against the official list (3.1 displays … 3.8 printer maintenance). Labs: refresh rate/cable, RAM channels/ECC, disks/SMART, RAID and PSU calculators, TPM/Secure Boot/VT-x, print-server deployment, laser imaging order.
- [x] Core 1 Domain 4 — Virtualization & Cloud (4.1–4.2), 17 Nov: Hyper-V sandbox, Docker container, cloud bill calculator.
- [x] Core 1 Domain 5 — Troubleshooting (5.1–5.6), 17 Nov: every objective has a multi-step ticket (event IDs/temps/CMOS, degraded array + offline disk, projector path, adb phone, pathping/jitter + switch port flapping, frozen print queue). **A+ complete: 36 Core 2 + 27 Core 1 objectives, 438/438 Core 1 and 722/722 Core 2 bullets.**

**Code Range** (`code-range`) — see section 6 for what exists.
- [x] **New track: Remote Access & Support** (track id `remote`, `unit: 'Module'`), 17 Nov — source in `code-range/source/rk-remote.js`.
  - Module 1 · Foundations: 1.1 the remote-access map (RDP 3389, SSH 22, WinRM 5985/5986, VNC 5900, VPN, RMM — which to use when) · 1.2 SSH from the command line (ssh user@host, -p, ssh-keygen, ssh-copy-id, known_hosts, scp) · 1.3 Remote Desktop (mstsc /v, enabling RDP, NLA, Remote Desktop Users group, firewall, qwinsta/logoff).
  - Module 2 · Remote administration: 2.1 PowerShell remoting (Enable-PSRemoting, Test-WSMan, Enter-PSSession, Invoke-Command, TrustedHosts) · 2.2 remote support workflow (verify identity, consent, attended vs unattended, document) · 2.3 troubleshooting ("can't RDP": ping → Test-NetConnection -Port 3389 → service → firewall → group → NLA; "can't SSH": same ladder) · 2.4 secure remote access (VPN first, MFA, jump host, least privilege, keys over passwords, never expose RDP to the Internet).
- [x] **Rebuild the Windows track** (`win1`, `win2` → two modules), 17 Nov — source in `code-range/source/rk-win.js`.
  - Module 1 · Command Prompt: 1.1 files and navigation (cd, dir, md, rd, copy, move, del, ren, type, wildcards) · 1.2 network and system (ipconfig, ping, tracert, nslookup, netstat, tasklist/taskkill, systeminfo, shutdown) · 1.3 admin (net user/localgroup, net use, sfc, chkdsk, robocopy, gpupdate/gpresult, redirection and findstr).
  - Module 2 · PowerShell: 2.1 cmdlets and help (Verb-Noun, Get-Help, Get-Command, aliases) · 2.2 objects and the pipeline (Where-Object, Sort-Object, Select-Object, Get-Member, Export-Csv) · 2.3 managing a PC (Get-Service/Restart-Service, Get-WinEvent, Test-NetConnection, Get-NetIPAddress, execution policy, .ps1 scripts).
- [ ] Convert the Active Directory track (ad1–ad9) to parts, pairing each part with an `ad` simulator lab or a PowerShell terminal lab.
- [ ] Convert the Linux track (lnx1–lnx7) to parts, pairing with the `sh` simulator labs.

**Security+ Range** (`sec-training`) — stages are already one per objective.
- [ ] For each of the 28 objectives: split the lesson into parts, write quick checks, add paired labs (13 objectives have none), add wrap recaps. Keep the XP/level game layer and the 80% gate that app uses.

**Net+ Range** (`netplus-range`) — at 90. Build: `python3 source/n10-009/patch.py`, then `node source/tools/rk-check.js index.html` and `node source/tools/coverage-check.js`.
- [x] Terminal labs and an On-the-job + Exam-trap callout on every part; official-bullet coverage audit.
- [ ] Hand-review the question bank objective by objective (it was sorted by keyword); move misfiled questions in `01-assign.js`.
- [ ] Add multi-step terminal tickets for 3.4 (DHCP/DNS) and 5.4 (performance).

**Cloud Range** (`cloud-range`)
- [ ] Pick ONE ladder with Phil, rebuild it by official exam domain → objective, then the next.

## 4. How to build (A+ and Sec+ have source folders)

```
cd aplus-exams-practice/source
#   src/rk-base.js        RangeKit helpers + terminal lab kind   (do not edit per-app; canonical copy in source/rangekit/)
#   src/rk-c2d1a.js …     content files, one or two per domain   (name them rk-c<core>d<domain><letter>.js)
#   src/rk-build.js       domain table: tier ids, old stage ids, wrap lab ids
python3 build.py                                   # writes dist/
node rangekit/rk-check.js dist/index.html          # MUST print "✓ all checks passed"
cp dist/index.html dist/sw.js dist/manifest.json ../ && cp dist/icons/* ../icons/
cd .. && git add -A && git commit -m "…" && git push
```

- A domain is rebuilt as soon as **any** objective for it is registered, and it then replaces the old stage for that domain — so **write a whole domain before building**, never half.
- Old question banks are kept: each objective declares `kw: /regex/`, and old questions/cards from the domain's old stage are sorted to the best-matching objective automatically; unmatched ones go to the domain test. So write `kw` with the objective's distinctive terms.
- **Coverage audit (required for criterion 1):** list the official bullets per objective (see `source/tools/coverage-check.js` in the Net+ repo for the pattern) and confirm each appears in that objective's lesson text. Explain every miss.
- The checker prints a `scorecard inputs` line — paste it with your grade.
- An objective can list extra labs with `moreLabs: ['id']` (shown in its Labs tab, not paired to a part).
- `rk-check.js` also types every terminal lab's own answers and fails if any lab does not complete.
- `node rangekit/rk-coverage.js dist/index.html objectives/core2-bullets.json` (and `objectives/core1-bullets.json`) is the coverage audit. Write the JSON with `ensure_ascii=False` or the en-dash terms will not match. Add each new domain's official bullets to that JSON (one `;`-separated line per objective) **before** writing the content, and write until it reports every bullet found.
- The checker fails on: page errors, a learn part over 5 min, part + lab over 15 min, a part without a quick check or objective line, an objective with under 12 test questions (add `RK.extra`), a wrap with under 4 recap lines, match answers missing from their options, a terminal `show` command its own `accept` rejects, or a broken flip/lab/test flow.
- Progress: if the learner had passed the old domain stage, the new objectives start passed ("carried over"). Nothing to do.

**Code Range now has `source/`** (RangeKit, content files, `BUILD.md`): `python3 source/rangekit/rk-inject.py index.html source/rangekit/rk-base.js source/rk-win.js source/rk-remote.js source/rk-build-code.js` then `node source/rangekit/rk-check.js index.html`. Add AD/Linux content files before `rk-build-code.js` and add their domains (with `old: [...]`) to it. `partsify.py` now also labels Module-unit chips "Module N".

For apps **without** a source folder (Cloud): copy `source/rangekit/` from the A+ repo, then
`python3 source/rangekit/rk-inject.py index.html source/rangekit/rk-base.js source/content1.js … source/rk-build.js`.
It patches the engine and inserts the files before it; re-running replaces the earlier block. Keep the content files in `source/` in that repo.
The engine patch has been trial-run on all four track-based consoles (A+, Sec+, Cloud, Code) and loads cleanly.

Skill tracks (not certifications) use the same format with `unit: 'Module'`, and can be brand-new:
```js
RK.build({ track: 'remote', pfx: 'rem', unit: 'Module',
  trackDef: { name: 'Remote Access & Support', short: 'REM', subtitle: 'SSH, RDP, PowerShell remoting and secure remote support', after: 'ad' },
  domains: [{ d: 1, tier: 'rem-f', tierDef: { name: 'Foundations', desc: '…' }, name: 'Foundations', wrapLab: 'rem-m1-wrap' }, …] });
```

### Content file template

```js
(function () {
  var RK = window.RK, P = RK.P, M = RK.M, O = RK.O, T = RK.T, TR = 'core2';
  // labs first (ids must be unique across the app: prefix with the track, e.g. c2-)
  RK.M('c2-xxx', 'Title', 'One-line summary', 'Brief shown at the top.', ['Option A', 'Option B'],
    [['Scenario text', 'Option A', 'Why.'], …], 'Debrief shown when all correct.');
  RK.O('c2-yyy', 'Title', 'Summary', 'Brief.', [['First step', 'why'], ['Second step', 'why'], …], 'Debrief.');   // list in the CORRECT order
  RK.T('c2-zzz', 'Title', 'Summary', 'Ticket / scenario brief.', { shell: 'cmd' | 'ps' | 'bash', prompt: 'C:\\Users\\tech>' },
    [{ t: 'What to achieve (no command!)', accept: [/^regex$/i], show: 'the canonical command', hint: 'a nudge',
       out: 'realistic output', prompt: 'new prompt (optional)', shell: 'bash (optional switch)',
       ask: { q: 'Question about the output', accept: ['answer'], why: 'what it means' }, why: 'one-line takeaway' }], 'Debrief.');

  RK.add({ track: TR, id: '4.9', dom: 4, short: 'Remote access', title: 'CompTIA\'s exact objective statement',
    goal: 'One line: what you can do after this objective.',
    kw: /\b(rdp|remote desktop|vnc|ssh|rmm|spice|winrm|…)/,
    parts: [ P('Part title', 'Verb-first objective for this part.', `<p>lesson html</p>`,
               [['Question?', 'Right answer', ['Wrong', 'Wrong', 'Wrong'], 'Explanation.'], …], 'c2-zzz') ],
    wrap: { recap: ['…', '…', '…', '…', '…'], lab: 'c2-combined-lab-id' } });
  RK.extra(TR, '4.9', [[q, right, [wrong…], why], …]);      // extra test questions (not quick checks)
  RK.cards(TR, '4.9', [['Term', 'Definition'], …]);          // flashcards
})();
```

`cmd` and `ps` terminal labs match case-insensitively (write `/…/i`); `bash` labs are case-sensitive (no `i`).

## 5. Quality bar — reread before every domain

A finished objective passes when someone who has never seen the topic can:
1. read each part in under 5 minutes and answer its quick check;
2. do the paired lab using only what that part taught;
3. explain the wrap-up lines out loud without looking;
4. score 90%+ on the objective test;
and when a working professional reading it finds nothing wrong, nothing missing from the official bullets, and at least one thing per part they would actually say to a junior.

Use **Core 2 objectives 1.5 and 1.9** (`src/rk-c2d1a.js`, `rk-c2d1b.js`) as the model to copy, and Net+ (`g-depth.js`) for how callouts are added to every part.

## 6. Facts about each repo

| Repo | Site | Engine | Source | Notes |
|---|---|---|---|---|
| netplus-range | /netplus-range/ | single-track, patched by `source/n10-009/patch.py` | `source/n10-009/` (content + `index.orig.html`) | storage key `netplus:v2`; official order is 3.3 DR · 3.4 services · 3.5 access |
| aplus-exams-practice | /aplus-exams-practice/ | track-based, RangeKit | `source/src`, `build.py` | tracks `core1`, `core2`; 90% gate |
| sec-training | /sec-training/ | track-based + XP game layer | `source/src`, `build.py` | 80% gate; engine not yet patched — run `partsify.py source/src/app.js` first |
| cloud-range | /cloud-range/ | track-based | index.html only | use `rk-inject.py`; has `cloud` console-sim lab kind |
| code-range | /code-range/ | track-based | index.html only (+ `source/` for RangeKit files) | lab kinds `code`, `sh`, `git`, `ad` are real simulators — prefer them over `term` where they fit |

All consoles: GitHub owner `wphilippskylar-bit`, GitHub Pages from the repo root, service worker serves the page network-first.

## 7. Prompt to give the next model

> Read `source/rangekit/PLAYBOOK.md` in `aplus-exams-practice` and follow it exactly. Do the next unticked item in the work queue: write the whole domain as content files modeled on Core 2 objectives 1.5 and 1.9, covering every bullet of each official objective in `source/objectives/`. Build, run `rk-check.js` until it prints "all checks passed", open three parts and one terminal lab in a headless browser to confirm they read well on a phone, then grade the domain against the rubric in section 2 (be critical; paste the scorecard inputs and the coverage audit), fix anything under 17, commit, push, and tick the item in the playbook. Tell me the scores, the checker output and anything you were unsure about.
