/* Code Range — RangeKit build table. New tracks are created here; existing tracks are converted by listing their old stage ids in `old`. */
(function () {
  var RK = window.RK;
  RK.build({ track: 'win', pfx: 'win', unit: 'Module',
    domains: [
      { d: 1, tier: 'win-f', name: 'Command Prompt', old: ['win1'], wrapLab: 'win-m1-wrap', next: 'Module 2 · PowerShell' },
      { d: 2, tier: 'win-c', name: 'PowerShell', old: ['win2'], wrapLab: 'win-m2-wrap', next: 'the Active Directory track' }
    ] });
  RK.build({ track: 'ad', pfx: 'ad', unit: 'Module',
    domains: [
      { d: 1, tier: 'ad-f', name: 'Foundations', old: ['ad1', 'ad2'], wrapLab: 'adx-m1-wrap', next: 'Module 2 · Everyday administration' },
      { d: 2, tier: 'ad-c', name: 'Everyday administration', old: ['ad3', 'ad4', 'ad5'], wrapLab: 'adx-m2-wrap', next: 'Module 3 · Policy & authentication' },
      { d: 3, tier: 'ad-p', name: 'Policy & authentication', old: ['ad6', 'ad7'], wrapLab: 'adx-m3-wrap', next: 'Module 4 · Expert' },
      { d: 4, tier: 'ad-x', name: 'Expert', old: ['ad8', 'ad9'], wrapLab: 'adx-m4-wrap', next: 'the Remote Access track' }
    ] });
  RK.build({ track: 'remote', pfx: 'rem', unit: 'Module',
    trackDef: { name: 'Remote Access & Support', short: 'REM', subtitle: 'SSH, Remote Desktop, PowerShell remoting and secure remote support — all hands-on', after: 'ad' },
    domains: [
      { d: 1, tier: 'rem-f', tierDef: { name: 'Module 1 · Foundations', desc: 'Pick the right tool, SSH from the command line, Remote Desktop.' }, name: 'Foundations', wrapLab: 'rem-m1-wrap', next: 'Module 2 · Remote administration' },
      { d: 2, tier: 'rem-a', tierDef: { name: 'Module 2 · Remote administration', desc: 'PowerShell remoting, support workflow, troubleshooting, secure access.' }, name: 'Remote administration', wrapLab: 'rem-m2-wrap', next: 'the next track' }
    ] });
})();
