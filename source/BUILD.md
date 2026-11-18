# Code Range build (RangeKit)

The page is still one `index.html`; RangeKit content is injected into it.

```
cd code-range
python3 source/rangekit/rk-inject.py index.html source/rangekit/rk-base.js source/rk-win.js source/rk-ad.js source/rk-lnx.js source/rk-remote.js source/rk-build-code.js
node source/rangekit/rk-check.js index.html          # must print "✓ all checks passed"
```

Re-running rk-inject replaces the previous injected block. Add new content files before `rk-build-code.js`,
and add their track/domains to `rk-build-code.js`. Bump the CACHE name in `sw.js` on each deploy.

AD and Linux tracks: edit `source/rk-ad.src.js` / `rk-lnx.src.js`, then `python3 source/build-sec.py` (fills SEC() placeholders from `*-sections.json`, the original lesson text) before injecting.
