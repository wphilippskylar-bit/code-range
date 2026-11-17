#!/usr/bin/env python3
"""RangeKit injector for consoles that ship as a single index.html with no source folder (Cloud, Code).
Usage:  python3 rk-inject.py index.html rk-base.js content1.js [content2.js ...] build.js
1) runs the engine patch (partsify) on index.html, 2) inserts the given files, in order, right before the engine.
Re-running replaces the previously injected block, so keep the .js files in the repo's source/ folder and re-inject after edits."""
import sys, os, subprocess
html = sys.argv[1]; files = sys.argv[2:]
here = os.path.dirname(os.path.abspath(__file__))
subprocess.check_call([sys.executable, os.path.join(here, 'partsify.py'), html])
s = open(html, encoding='utf-8').read()
B, E = '/* RK-INJECT-BEGIN */', '/* RK-INJECT-END */'
if B in s: s = s[:s.index(B)] + s[s.index(E) + len(E):].lstrip('\n;')
anchor = '/* Study engine — shared by every course repo.'
if s.count(anchor) != 1: sys.exit('FAILED: engine anchor not found exactly once')
blob = '\n;\n'.join(open(f, encoding='utf-8').read() for f in files).replace('</script', '<\\/script').replace('<!--', '<\\!--')
s = s.replace(anchor, B + '\n' + blob + '\n;\n' + E + '\n;\n' + anchor)
open(html, 'w', encoding='utf-8').write(s)
print('injected', len(files), 'files into', html, '-', len(s) // 1024, 'KB')
