/* Code Range — RangeKit build table. New tracks are created here; existing tracks are converted by listing their old stage ids in `old`. */
(function () {
  var RK = window.RK;
  RK.build({ track: 'remote', pfx: 'rem', unit: 'Module',
    trackDef: { name: 'Remote Access & Support', short: 'REM', subtitle: 'SSH, Remote Desktop, PowerShell remoting and secure remote support — all hands-on', after: 'ad' },
    domains: [
      { d: 1, tier: 'rem-f', tierDef: { name: 'Module 1 · Foundations', desc: 'Pick the right tool, SSH from the command line, Remote Desktop.' }, name: 'Foundations', wrapLab: 'rem-m1-wrap', next: 'Module 2 · Remote administration' },
      { d: 2, tier: 'rem-a', tierDef: { name: 'Module 2 · Remote administration', desc: 'PowerShell remoting, support workflow, troubleshooting, secure access.' }, name: 'Remote administration', wrapLab: 'rem-m2-wrap', next: 'the next track' }
    ] });
})();
