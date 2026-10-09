// Python runner (module worker). Loads Pyodide from a CDN on first use; the service
// worker caches it so later runs work offline.
import { loadPyodide } from 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.mjs';
let py = null;
const HARNESS = `
import sys, io, json, traceback
def __run_user(src, stdin):
    g = {'__name__': '__main__'}
    sys.stdin = io.StringIO(stdin)
    buf = io.StringIO(); old = sys.stdout; sys.stdout = buf
    err = None
    try:
        exec(compile(src, '<your code>', 'exec'), g)
    except SystemExit:
        pass
    except BaseException:
        et, ev, tb = sys.exc_info()
        frames = [f for f in traceback.extract_tb(tb) if f.filename == '<your code>']
        line = (' (line %d)' % frames[-1].lineno) if frames else ''
        err = '%s: %s%s' % (et.__name__, ev, line)
    finally:
        sys.stdout = old
        sys.stdin = sys.__stdin__
    return g, buf.getvalue(), err

def __norm(s):
    return '\\n'.join(l.rstrip() for l in s.strip().splitlines())

def __check(src, tests_json):
    tests = json.loads(tests_json); res = []
    for t in tests:
        g, out, err = __run_user(src, t.get('stdin', ''))
        ok, msg = True, ''
        if err and not t.get('allowError'):
            ok, msg = False, err
        elif 'expect' in t:
            if __norm(t['expect']) not in __norm(out):
                ok, msg = False, 'expected output to contain:\\n' + t['expect'] + '\\n--- your output ---\\n' + out[-600:]
        if ok and t.get('check'):
            buf = io.StringIO(); old = sys.stdout; sys.stdout = buf
            try:
                exec(t['check'], g)
            except AssertionError as e:
                ok, msg = False, str(e) or 'assertion failed'
            except BaseException as e:
                ok, msg = False, '%s: %s' % (type(e).__name__, e)
            finally:
                sys.stdout = old
        res.append({'name': t['name'], 'ok': ok, 'msg': msg})
    return json.dumps(res)
`;
self.onmessage = async (e) => {
  const m = e.data;
  try {
    if (!py) {
      postMessage({ type: 'status', text: 'Loading Python 3 (first time only, ~10 MB)…' });
      py = await loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/' });
      await py.runPythonAsync(HARNESS);
      postMessage({ type: 'status', text: 'Python ready' });
    }
    py.globals.set('__SRC', m.code);
    if (m.op === 'run') {
      py.globals.set('__STDIN', m.stdin || '');
      const r = py.runPython('_g, _o, _e = __run_user(__SRC, __STDIN)\njson.dumps([_o, _e])');
      const [out, err] = JSON.parse(r);
      postMessage({ type: 'run', out, err });
    } else {
      py.globals.set('__TESTS', JSON.stringify(m.tests));
      const r = py.runPython('__check(__SRC, __TESTS)');
      postMessage({ type: 'check', results: JSON.parse(r) });
    }
  } catch (err) {
    postMessage({ type: 'fatal', text: String(err) });
  }
};
