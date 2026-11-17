/* Code Range — NEW track: Remote Access & Support (track id 'remote', unit 'Module'). All lessons have paired labs; most are terminal labs. */
(function () {
  var RK = window.RK, P = RK.P, M = RK.M, O = RK.O, T = RK.T, TR = 'remote';
  function pro(t) { return '<div class="callout pro"><b class="k">On the job</b>' + t + '</div>'; }
  function trap(t) { return '<div class="callout trap"><b class="k">Exam trap</b>' + t + '</div>'; }

  // ================= Module 1 · 1.1 The remote-access map =================
  M('rem-pick', 'Which remote tool?', 'RDP, SSH, WinRM, VNC, VPN, RMM',
    'Pick the best tool for each job.', ['RDP (3389)', 'SSH (22)', 'WinRM / PowerShell remoting (5985/5986)', 'VNC (5900)', 'VPN', 'RMM agent', 'Quick Assist / screen sharing'],
    [['Full Windows desktop on a server, as if you were sitting at it', 'RDP (3389)', 'Graphical Windows session.'], ['Command line on a Linux server', 'SSH (22)', 'Encrypted shell.'], ['Run the same PowerShell command on 40 Windows PCs at once', 'WinRM / PowerShell remoting (5985/5986)', 'Remote management at scale.'], ['See the exact screen a Linux kiosk is showing', 'VNC (5900)', 'Screen sharing of the console.'], ['Reach office servers safely from a hotel', 'VPN', 'Encrypted tunnel into the network.'], ['Patch, monitor and script 300 client PCs from one console', 'RMM agent', 'Remote monitoring and management.'], ['Help a user who is on the phone with you and can see their screen', 'Quick Assist / screen sharing', 'Attended support with consent.']],
    'GUI on Windows → RDP. Shell on Linux → SSH. Scripts on many Windows boxes → WinRM. Help a person → attended screen share. Get onto the network first → VPN.');
  T('rem-ports', 'What can I reach on this server?', 'Test remote-access ports',
    'Ticket: you were handed server SRV-APP02 with no documentation. Find which remote-access services answer before choosing how to manage it. PowerShell on your admin PC.',
    { shell: 'ps', prompt: 'PS C:\\Users\\tech>' },
    [{ t: 'Test whether Remote Desktop answers.', accept: [/^test-netconnection( -computername)? srv-app02 -port 3389$/i, /^tnc srv-app02 -port 3389$/i], show: 'Test-NetConnection SRV-APP02 -Port 3389', hint: 'Test-NetConnection <host> -Port <n>', out: 'ComputerName     : SRV-APP02\nRemoteAddress    : 10.20.5.12\nRemotePort       : 3389\nTcpTestSucceeded : False', why: 'RDP is off or blocked.' },
     { t: 'Test PowerShell remoting over HTTP.', accept: [/^test-netconnection( -computername)? srv-app02 -port 5985$/i, /^tnc srv-app02 -port 5985$/i], show: 'Test-NetConnection SRV-APP02 -Port 5985', hint: 'WinRM HTTP port.', out: 'RemotePort       : 5985\nTcpTestSucceeded : True', why: 'WinRM answers — you can manage it with PowerShell remoting.' },
     { t: 'Test SSH as well.', accept: [/^test-netconnection( -computername)? srv-app02 -port 22$/i, /^tnc srv-app02 -port 22$/i], show: 'Test-NetConnection SRV-APP02 -Port 22', hint: 'SSH port.', out: 'RemotePort       : 22\nTcpTestSucceeded : True', ask: { q: 'Which two remote methods can you use right now? (answer: ssh and winrm, in any order)', accept: ['ssh and winrm', 'winrm and ssh', 'ssh, winrm', 'winrm, ssh', 'ssh winrm', 'winrm ssh'], why: 'Windows Server 2025 includes OpenSSH Server. Both are command-line; RDP needs enabling if a GUI is required.' }, why: 'Discover before you connect.' },
     { t: 'Confirm WinRM is actually a working WS-Management listener, not just an open port.', accept: [/^test-wsman( -computername)? srv-app02$/i], show: 'Test-WSMan SRV-APP02', hint: 'Test-WSMan <host>', out: 'wsmid           : http://schemas.dmtf.org/wbem/wsman/identity/1/wsmanidentity.xsd\nProtocolVersion : http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd\nProductVendor   : Microsoft Corporation\nProductVersion  : OS: 0.0.0 SP: 0.0 Stack: 3.0', why: 'Listener confirmed. Record what you found in the server\'s documentation.' }],
    'Map the access methods (ports) before you pick a tool. Then document them.',
    ['Test-NetConnection -Port 3389 / 5985 / 22, Test-WSMan.']);
  M('rem-map-wrap', 'Remote-access map', 'Combined 1.1',
    'Pick the port or method.', ['22', '3389', '5985', '5986', '5900', 'VPN first', 'Attended session', 'Unattended (RMM) session'],
    [['SSH', '22', 'Secure Shell.'], ['RDP', '3389', 'Remote Desktop.'], ['WinRM over HTTP (still encrypted by Kerberos in a domain)', '5985', 'WS-Man HTTP.'], ['WinRM over HTTPS with a certificate', '5986', 'WS-Man HTTPS.'], ['VNC', '5900', 'RFB protocol.'], ['Any of the above from outside the office', 'VPN first', 'Never expose management ports to the Internet.'], ['User is present and approves you viewing their screen', 'Attended session', 'Consent.'], ['Patch a PC overnight with nobody there', 'Unattended (RMM) session', 'Pre-authorized agent.']],
    'Know the ports cold; they are what you open, test and troubleshoot.');

  RK.add({ track: TR, id: '1.1', dom: 1, short: 'The remote-access map', title: 'Choose the right remote-access method for the job',
    goal: 'Match RDP, SSH, WinRM, VNC, VPN and RMM to the job, and know their ports.',
    kw: /\b(rdp|ssh|winrm|vnc|vpn|rmm|remote access|3389|5985|5986|5900|\b22\b|quick assist|screen shar)/,
    parts: [
      P('Protocols and ports', 'Match each remote-access protocol to its port and best use.',
        `<table><tr><th>Method</th><th>Port</th><th>What you get</th><th>Typical use</th></tr>
<tr><td><b>RDP</b></td><td>TCP/UDP 3389</td><td>Full Windows desktop session</td><td>Windows servers and PCs</td></tr>
<tr><td><b>SSH</b></td><td>TCP 22</td><td>Encrypted command line; file copy (scp/sftp); tunnels</td><td>Linux, network devices, and now Windows</td></tr>
<tr><td><b>WinRM</b> (PowerShell remoting)</td><td>TCP 5985 (HTTP) / 5986 (HTTPS)</td><td>Remote PowerShell, one or many machines</td><td>Windows admin at scale</td></tr>
<tr><td><b>VNC</b></td><td>TCP 5900</td><td>Shares the actual console screen</td><td>Linux desktops, kiosks, Macs</td></tr></table>
<p>RDP creates its own session (the console can be locked); VNC shows exactly what is on the physical screen. SSH and WinRM are text-only and light enough for slow links.</p>` + pro('Use the lightest tool that does the job. If you only need to restart a service, a one-line Invoke-Command beats opening a full RDP desktop.') + trap('Telnet (23) is also remote command line, but unencrypted — SSH replaced it. VNC is often unencrypted too unless tunneled.'),
        [['Which port does RDP use?', '3389', ['22', '5985', '5900'], 'Remote Desktop.'],
         ['Which method shares the exact physical screen rather than a new session?', 'VNC', ['RDP', 'SSH', 'WinRM'], 'Console sharing.']],
        'rem-pick'),
      P('VPN, RMM and attended support', 'Explain where VPNs, RMM agents and attended screen sharing fit, and discover which methods a host offers.',
        `<ul><li><b>VPN</b> — puts your device on the company network through an encrypted tunnel. Remote-access ports (3389, 22, 5985) are then reached <i>inside</i> the network and never exposed to the Internet.</li>
<li><b>RMM</b> (remote monitoring and management: NinjaOne, Datto, ConnectWise, Intune) — an agent on each PC phones home to a cloud console, so techs can patch, script, monitor and take control without a VPN.</li>
<li><b>Attended support</b> — the user is present and approves: Quick Assist, Teams screen share, RMM "ask before connecting".</li>
<li><b>Unattended support</b> — pre-authorized access to servers or PCs with no one present (RMM, RDP, SSH). Logged and restricted to admins.</li></ul>
<p>Discover what a host offers with <code>Test-NetConnection host -Port n</code> (Windows) or <code>nc -zv host 22</code> (Linux).</p>` + pro('Scammers use the same remote tools. Your company should have exactly one approved support tool, and users should know a real tech never cold-calls them to "fix a virus".') + trap('A VPN does not replace authentication on the target: you still need RDP/SSH credentials once you are inside.'),
        [['What should usually come before RDP or SSH from home?', 'A VPN connection', ['A port-forward on the firewall', 'Telnet', 'Disabling MFA'], 'Never expose management ports.'],
         ['Which tool lets techs patch PCs overnight with no one present?', 'An RMM agent', ['Quick Assist', 'A phone call', 'VNC viewer only'], 'Unattended management.']],
        'rem-ports')
    ],
    wrap: { recap: ['RDP 3389 (Windows desktop), SSH 22 (shell, files, tunnels), WinRM 5985/5986 (PowerShell remoting), VNC 5900 (console screen).', 'Use the lightest tool that does the job.', 'VPN first: never expose management ports to the Internet.', 'RMM agents give unattended patching, scripting and control.', 'Attended = user present and consenting; unattended = pre-authorized, logged.', 'Discover with Test-NetConnection -Port / nc -zv.'], lab: 'rem-map-wrap' }
  });

  // ================= 1.2 SSH from the command line =================
  T('rem-ssh1', 'First SSH connection', 'ssh, host keys and known_hosts',
    'Ticket: log in to the new web server web01 (10.0.4.21) as user <b>phil</b> for the first time, then check who else is logged in. Linux admin workstation.',
    { shell: 'bash', prompt: 'phil@admin:~$' },
    [{ t: 'Connect to web01 as phil.', accept: [/^ssh phil@(web01|10\.0\.4\.21)$/], show: 'ssh phil@web01', hint: 'ssh user@host', out: "The authenticity of host 'web01 (10.0.4.21)' can't be established.\nED25519 key fingerprint is SHA256:9xQ2fK…Lm4.\nAre you sure you want to continue connecting (yes/no/[fingerprint])?", ask: { q: 'Before typing yes, what should you compare the fingerprint against?', accept: ['the server fingerprint', 'server fingerprint', 'the real fingerprint', 'the fingerprint from the server', 'fingerprint from the server', 'documented fingerprint', 'the documented fingerprint'], why: 'Check it against the fingerprint the server owner published (or read on the console). Blindly typing yes is how on-path attacks succeed.' }, why: 'Host key verification protects you from impostor servers.' },
     { t: 'The fingerprint matches. Accept it.', accept: [/^yes$/], show: 'yes', hint: 'yes', out: "Warning: Permanently added 'web01' (ED25519) to the list of known hosts.\nphil@web01's password:\nWelcome to Ubuntu 24.04 LTS\nphil@web01:~$", prompt: 'phil@web01:~$', why: 'Saved in ~/.ssh/known_hosts — next time SSH checks silently and warns loudly if it changes.' },
     { t: 'You are on web01 now. Show who is logged in.', accept: [/^w$/, /^who$/], show: 'w', hint: 'w (or who)', out: ' 17:05:11 up 12 days,  2 users,  load average: 0.08, 0.05, 0.01\nUSER  TTY    FROM          LOGIN@  IDLE  WHAT\nphil  pts/0  10.0.1.50     17:05   0.00s w\nanna  pts/1  10.0.1.77     16:40   12:00 vim /etc/nginx/nginx.conf', ask: { q: 'Which user is editing the nginx config right now?', accept: ['anna'], why: 'Check before restarting services someone else is working on.' }, why: 'Situational awareness on a shared server.' },
     { t: 'Disconnect from web01.', accept: [/^exit$/, /^logout$/], show: 'exit', hint: 'exit', out: 'logout\nConnection to web01 closed.', prompt: 'phil@admin:~$', why: 'Back on your workstation.' },
     { t: 'Connect to the old firewall box fw-legacy, whose SSH listens on port 2222, as user admin.', accept: [/^ssh -p 2222 admin@fw-legacy$/, /^ssh admin@fw-legacy -p 2222$/], show: 'ssh -p 2222 admin@fw-legacy', hint: 'ssh -p <port> user@host', out: "admin@fw-legacy's password:", why: 'Non-standard port: -p (lowercase). scp uses -P (uppercase).' }],
    'ssh user@host; verify the host-key fingerprint the first time; -p for another port; exit to leave.',
    ['ssh user@host, yes after verifying, w, exit, ssh -p.']);
  T('rem-sshkey', 'Log in with keys, not passwords', 'ssh-keygen, ssh-copy-id, permissions, config',
    'Ticket: set up key-based login from your workstation to web01 and a shortcut name for it.',
    { shell: 'bash', prompt: 'phil@admin:~$' },
    [{ t: 'Generate a modern Ed25519 key pair (accept the default path, set a passphrase).', accept: [/^ssh-keygen -t ed25519( -c ["'][^"']*["'])?$/i], show: 'ssh-keygen -t ed25519 -C "phil@admin"', hint: 'ssh-keygen -t ed25519', out: 'Generating public/private ed25519 key pair.\nYour identification has been saved in /home/phil/.ssh/id_ed25519\nYour public key has been saved in /home/phil/.ssh/id_ed25519.pub', ask: { q: 'Which file must NEVER leave your workstation: id_ed25519 or id_ed25519.pub?', accept: ['id_ed25519'], why: 'id_ed25519 is the private key. The .pub file is meant to be copied to servers.' }, why: 'Key pair created.' },
     { t: 'Install the public key on web01 for user phil.', accept: [/^ssh-copy-id( -i ~\/\.ssh\/id_ed25519\.pub)? phil@web01$/], show: 'ssh-copy-id phil@web01', hint: 'ssh-copy-id user@host', out: "Number of key(s) added: 1\nNow try logging into the machine, with: \"ssh 'phil@web01'\"", why: 'Appended to ~/.ssh/authorized_keys on web01.' },
     { t: 'Make sure your private key is readable only by you.', accept: [/^chmod 600 ~\/\.ssh\/id_ed25519$/, /^chmod 600 \/home\/phil\/\.ssh\/id_ed25519$/], show: 'chmod 600 ~/.ssh/id_ed25519', hint: 'chmod 600 <file>', out: '', why: 'SSH refuses keys that others can read ("UNPROTECTED PRIVATE KEY FILE").' },
     { t: 'Add a shortcut: append a Host entry so "ssh web" means phil@web01 with that key. (Type the one-line printf provided in the hint.)', accept: [/^printf ['"]Host web\\n +HostName web01\\n +User phil\\n +IdentityFile ~\/\.ssh\/id_ed25519\\n['"] >> ~\/\.ssh\/config$/], show: "printf 'Host web\\n  HostName web01\\n  User phil\\n  IdentityFile ~/.ssh/id_ed25519\\n' >> ~/.ssh/config", hint: "printf 'Host web\\n  HostName web01\\n  User phil\\n  IdentityFile ~/.ssh/id_ed25519\\n' >> ~/.ssh/config", out: '', why: '~/.ssh/config saves typing and mistakes: hosts, users, ports, keys, jump hosts.' },
     { t: 'Test the shortcut and run one command remotely: print the hostname.', accept: [/^ssh web hostname$/, /^ssh web ['"]hostname['"]$/], show: 'ssh web hostname', hint: 'ssh <alias> <command>', out: 'Enter passphrase for key \'/home/phil/.ssh/id_ed25519\':\nweb01', why: 'Key login works (the passphrase unlocks your key locally; use ssh-agent to type it once per session).' }],
    'Keys: generate (ed25519) → copy the .pub (ssh-copy-id) → protect the private key (600) → alias in ~/.ssh/config.',
    ['ssh-keygen -t ed25519, ssh-copy-id, chmod 600, ~/.ssh/config.']);
  T('rem-scp', 'Move files and tunnel a port', 'scp, remote commands, ssh -L',
    'Ticket: pull web01\'s nginx error log for the developer, push a fixed config, and reach web01\'s admin page (only listening on 127.0.0.1:8080 there) from your workstation.',
    { shell: 'bash', prompt: 'phil@admin:~$' },
    [{ t: 'Copy /var/log/nginx/error.log from web01 to your current folder.', accept: [/^scp (phil@)?web01:\/var\/log\/nginx\/error\.log \.\/?$/, /^scp web:\/var\/log\/nginx\/error\.log \.\/?$/], show: 'scp phil@web01:/var/log/nginx/error.log .', hint: 'scp user@host:/remote/path <local dest>', out: 'error.log                     100%   48KB   2.1MB/s   00:00', why: 'Remote → local: the remote path goes first.' },
     { t: 'Copy your local site.conf to /tmp on web01.', accept: [/^scp site\.conf (phil@)?web01:\/tmp\/?$/, /^scp site\.conf web:\/tmp\/?$/], show: 'scp site.conf phil@web01:/tmp/', hint: 'scp <local file> user@host:/remote/path', out: 'site.conf                     100%  2310   1.4MB/s   00:00', why: 'Local → remote. Then move it into place with sudo on the server.' },
     { t: 'Without opening an interactive shell, test the nginx config on web01 with sudo.', accept: [/^ssh -t (phil@)?web01 ['"]?sudo nginx -t['"]?$/, /^ssh (phil@)?web01 ['"]?sudo nginx -t['"]?$/, /^ssh -t web ['"]?sudo nginx -t['"]?$/], show: "ssh -t phil@web01 'sudo nginx -t'", hint: "ssh -t user@host 'command' (-t gives sudo a terminal for its password prompt)", out: '[sudo] password for phil:\nnginx: the configuration file /etc/nginx/nginx.conf syntax is ok\nnginx: configuration file /etc/nginx/nginx.conf test is successful', why: 'One-shot remote commands are scriptable and leave no shell open.' },
     { t: 'Forward local port 9000 to port 8080 on web01\'s own loopback, without running a remote shell (-N).', accept: [/^ssh -N -L 9000:(localhost|127\.0\.0\.1):8080 (phil@)?web01$/, /^ssh -L 9000:(localhost|127\.0\.0\.1):8080 -N (phil@)?web01$/, /^ssh -N -L 9000:(localhost|127\.0\.0\.1):8080 web$/], show: 'ssh -N -L 9000:localhost:8080 phil@web01', hint: 'ssh -N -L <localport>:localhost:<remoteport> user@host', out: '(tunnel open — browse to http://localhost:9000 on your workstation)', ask: { q: 'Which URL do you open in your own browser?', accept: ['http://localhost:9000', 'localhost:9000', 'http://127.0.0.1:9000', '127.0.0.1:9000'], why: 'Your localhost:9000 is carried through the encrypted SSH session to web01\'s localhost:8080 — the admin page is never exposed on the network.' }, why: 'Local port forwarding (tunnel).' }],
    'scp for copies (remote:path syntax), ssh host \'cmd\' for one-shots, ssh -L for tunnels.',
    ['scp src dest, ssh -t host \'cmd\', ssh -N -L local:host:remote.']);
  T('rem-ssh-wrap', 'SSH shift', 'Combined 1.2',
    'Ticket: the backup server bkp01 (SSH on port 2200) needs a new key login and you must fetch last night\'s backup report. No hints in the tasks.',
    { shell: 'bash', prompt: 'phil@admin:~$' },
    [{ t: 'Copy your existing public key to phil@bkp01 on port 2200.', accept: [/^ssh-copy-id -p 2200 phil@bkp01$/, /^ssh-copy-id phil@bkp01 -p 2200$/], show: 'ssh-copy-id -p 2200 phil@bkp01', hint: 'ssh-copy-id -p <port> user@host', out: 'Number of key(s) added: 1', why: 'Key installed.' },
     { t: 'Run "df -h /backup" on bkp01 without an interactive shell.', accept: [/^ssh -p 2200 phil@bkp01 ['"]?df -h \/backup['"]?$/], show: "ssh -p 2200 phil@bkp01 'df -h /backup'", hint: 'ssh -p 2200 user@host \'command\'', out: 'Filesystem  Size  Used Avail Use% Mounted on\n/dev/sdb1   8.0T  7.6T  410G  95% /backup', ask: { q: 'How full is /backup (percent)?', accept: ['95', '95%'], why: '95% — that explains the failed job. Escalate for more storage or retention cleanup.' }, why: 'Quick remote check.' },
     { t: 'Copy /backup/reports/latest.txt from bkp01 (port 2200) to your current folder.', accept: [/^scp -P 2200 phil@bkp01:\/backup\/reports\/latest\.txt \.\/?$/], show: 'scp -P 2200 phil@bkp01:/backup/reports/latest.txt .', hint: 'scp uses capital -P for the port', out: 'latest.txt                    100%  3.1KB   1.2MB/s   00:00', why: 'Note: scp -P (uppercase) vs ssh -p (lowercase).' }],
    'Ports, keys, remote commands and file copies — the daily SSH toolkit.',
    ['ssh -p vs scp -P.']);

  RK.add({ track: TR, id: '1.2', dom: 1, short: 'SSH from the command line', title: 'Connect, authenticate and move files with SSH',
    goal: 'Connect with ssh, verify host keys, use key authentication, copy files with scp and build port-forward tunnels.',
    kw: /\b(ssh|openssh|scp|sftp|known_hosts|authorized_keys|ssh-keygen|ssh-copy-id|ed25519|fingerprint|port forward|tunnel|~\/\.ssh)/,
    parts: [
      P('Connecting with SSH', 'Connect to a server with ssh, verify its host key and use a non-standard port.',
        `<ul><li><code>ssh user@host</code> — opens an encrypted shell. Leave with <code>exit</code>.</li>
<li><b>Host key verification</b> — the first time, SSH shows the server\'s fingerprint. Compare it with the one the server owner published, then type <code>yes</code>. It is saved in <code>~/.ssh/known_hosts</code>.</li>
<li>If a known host\'s key <b>changes</b>, SSH prints "REMOTE HOST IDENTIFICATION HAS CHANGED" and refuses. That is either a rebuilt server (remove the old line with <code>ssh-keygen -R host</code>) or an attack — find out which before connecting.</li>
<li><code>ssh -p 2222 user@host</code> — other port. <code>ssh -v</code> — verbose output for troubleshooting.</li>
<li>On the server: <code>w</code> or <code>who</code> shows logged-in users.</li></ul>
<p>Windows 10/11 and Server 2019+ include the OpenSSH client (<code>ssh</code> works in PowerShell), and Server 2025 ships the OpenSSH server.</p>` + pro('Before restarting a service on a shared server, run w. Restarting nginx while a colleague is mid-edit is a classic way to cause an outage.') + trap('ssh uses lowercase -p for the port; scp uses uppercase -P.'),
        [['Where does SSH store fingerprints of servers you have trusted?', '~/.ssh/known_hosts', ['~/.ssh/authorized_keys', '/etc/passwd', '~/.ssh/id_ed25519'], 'Client side.'],
         ['How do you SSH to a server listening on port 2222?', 'ssh -p 2222 user@host', ['ssh -P 2222 user@host', 'ssh user@host:2222', 'ssh --port=2222 host'], 'Lowercase -p.']],
        'rem-ssh1'),
      P('Key-based authentication', 'Create an SSH key pair, install the public key on a server, protect the private key and use ~/.ssh/config.',
        `<ol><li><code>ssh-keygen -t ed25519</code> — creates <code>~/.ssh/id_ed25519</code> (private, keep secret, protect with a passphrase) and <code>id_ed25519.pub</code> (public).</li>
<li><code>ssh-copy-id user@host</code> — appends your public key to the server\'s <code>~/.ssh/authorized_keys</code>. (On Windows, append the .pub contents to that file manually.)</li>
<li>Permissions: <code>~/.ssh</code> 700, private key and <code>authorized_keys</code> 600. SSH refuses keys with loose permissions.</li>
<li><code>ssh-agent</code> / <code>ssh-add</code> — unlock your key once per session.</li>
<li><code>~/.ssh/config</code> — aliases:<br><code>Host web</code> / <code>HostName web01</code> / <code>User phil</code> / <code>Port 22</code> / <code>IdentityFile ~/.ssh/id_ed25519</code> → then just <code>ssh web</code>.</li></ol>` + pro('Keys plus a passphrase beat passwords: nothing to brute-force on the server, and you can disable password login entirely (Module 2.4). When someone leaves, remove their line from authorized_keys.') + trap('authorized_keys lives on the server and lists who may log in; known_hosts lives on the client and lists servers you trust.'),
        [['Which file is copied to the server for key login?', 'id_ed25519.pub', ['id_ed25519', 'known_hosts', 'sshd_config'], 'Public key.'],
         ['What permission should a private key file have?', '600', ['777', '644', '755'], 'Owner read/write only.']],
        'rem-sshkey'),
      P('Files, remote commands and tunnels', 'Copy files with scp, run one-shot remote commands and forward ports through SSH.',
        `<ul><li><b>scp</b> — <code>scp file user@host:/path</code> (upload), <code>scp user@host:/path/file .</code> (download), <code>-r</code> for folders, <code>-P</code> for port. <b>sftp</b> gives an interactive file session; <b>rsync -e ssh</b> copies only changes.</li>
<li><b>Remote commands</b> — <code>ssh host 'command'</code> runs it and returns. Add <code>-t</code> when the command needs a terminal (sudo password prompts).</li>
<li><b>Local port forwarding</b> — <code>ssh -L 9000:localhost:8080 host</code>: your <code>localhost:9000</code> reaches port 8080 on the server through the encrypted connection. <code>-N</code> = tunnel only, no shell.</li>
<li><b>Jump hosts</b> — <code>ssh -J bastion user@internal</code> hops through a hardened bastion (Module 2.4).</li></ul>` + pro('Admin web pages (databases, routers, dashboards) should listen only on localhost. An SSH tunnel lets you use them without ever opening their port on the network.') + trap('In scp, the side with host: is the remote side. scp host:/file . downloads; scp file host:/dir uploads.'),
        [['Which command downloads /etc/hosts from web01 to the current folder?', 'scp web01:/etc/hosts .', ['scp . web01:/etc/hosts', 'ssh web01 /etc/hosts', 'scp -L web01 /etc/hosts'], 'Remote first.'],
         ['What does ssh -L 9000:localhost:8080 host do?', 'Forwards your local port 9000 to port 8080 on the server', ['Opens port 9000 on the server firewall', 'Copies files', 'Changes the SSH port'], 'Local forward.']],
        'rem-scp')
    ],
    wrap: { recap: ['ssh user@host; verify the fingerprint first time; known_hosts on the client; -p for port; -v to debug.', 'Changed host key = rebuilt server or attack — investigate, then ssh-keygen -R.', 'ssh-keygen -t ed25519 → ssh-copy-id → authorized_keys on the server.', 'Permissions: ~/.ssh 700, keys 600; ssh-agent for passphrases; ~/.ssh/config aliases.', 'scp (remote:path, -P port, -r), ssh host \'cmd\' (-t for sudo).', 'ssh -L local:host:remote tunnels; -N for tunnel only; -J for jump hosts.'], lab: 'rem-ssh-wrap' }
  });

  // ================= 1.3 Remote Desktop =================
  T('rem-rdp-use', 'Connect to a terminal server and clean up sessions', 'mstsc, quser, logoff',
    'Ticket: users say TS01 (a Remote Desktop server) is "full". Check sessions, clear a stale one, and connect for an admin check. Command Prompt on your admin PC.',
    { shell: 'cmd', prompt: 'C:\\Users\\tech>' },
    [{ t: 'List user sessions on TS01.', accept: [/^quser \/server:ts01$/i, /^query user \/server:ts01$/i, /^qwinsta \/server:ts01$/i], show: 'quser /server:TS01', hint: 'quser /server:<name>', out: ' USERNAME   SESSIONNAME  ID  STATE   IDLE TIME  LOGON TIME\n jlee       rdp-tcp#4     2  Active          .  11/17/2026 8:01 AM\n mrivera                  3  Disc      2+04:11  11/15/2026 9:12 AM\n kpatel     rdp-tcp#9     5  Active         3  11/17/2026 9:30 AM', ask: { q: 'Which session ID has been disconnected for over two days?', accept: ['3'], why: 'Disconnected sessions keep apps and memory in use. Check with the user/owner first, then log it off.' }, why: 'Read session state.' },
     { t: 'Log off session 3 on TS01.', accept: [/^logoff 3 \/server:ts01$/i, /^rwinsta 3 \/server:ts01$/i], show: 'logoff 3 /server:TS01', hint: 'logoff <id> /server:<name>', out: '', why: 'Unsaved work in that session is lost — that is why you check first.' },
     { t: 'Connect to TS01\'s console/admin session full screen for maintenance.', accept: [/^mstsc \/v:ts01 \/admin( \/f)?$/i, /^mstsc \/v:ts01 \/f \/admin$/i, /^mstsc \/admin \/v:ts01( \/f)?$/i], show: 'mstsc /v:TS01 /admin /f', hint: 'mstsc /v:<host> /admin /f', out: '(Remote Desktop Connection opens full screen to TS01, administrative session)', why: '/admin uses an administrative session that does not consume a user licence slot.' }],
    'Session housekeeping: quser to see, logoff to clear (after checking), mstsc /v: /admin to manage.',
    ['quser /server:, logoff <id> /server:, mstsc /v: /admin /f.']);
  T('rem-rdp-enable', 'Enable Remote Desktop on a PC', 'Registry, firewall, group, NLA',
    'Ticket: allow the help-desk group CORP\\HelpDesk to RDP into PC-ACC14. You are in an elevated PowerShell session on that PC.',
    { shell: 'ps', prompt: 'PS C:\\Windows\\system32>' },
    [{ t: 'Turn on Remote Desktop (set fDenyTSConnections to 0).', accept: [/^set-itemproperty -path ['"]?hklm:\\system\\currentcontrolset\\control\\terminal server['"]? -name ['"]?fdenytsconnections['"]? -value 0$/i], show: "Set-ItemProperty -Path 'HKLM:\\System\\CurrentControlSet\\Control\\Terminal Server' -Name fDenyTSConnections -Value 0", hint: "Set-ItemProperty -Path 'HKLM:\\System\\CurrentControlSet\\Control\\Terminal Server' -Name fDenyTSConnections -Value 0", out: '', why: 'Same as Settings → System → Remote Desktop → On (needs Pro/Enterprise).' },
     { t: 'Enable the built-in Remote Desktop firewall rules.', accept: [/^enable-netfirewallrule -displaygroup ['"]remote desktop['"]$/i], show: 'Enable-NetFirewallRule -DisplayGroup "Remote Desktop"', hint: 'Enable-NetFirewallRule -DisplayGroup "Remote Desktop"', out: '', why: 'Opens 3389 (TCP and UDP) for the configured profiles.' },
     { t: 'Allow the help-desk group to sign in remotely.', accept: [/^add-localgroupmember -group ['"]remote desktop users['"] -member ['"]?corp\\helpdesk['"]?$/i], show: 'Add-LocalGroupMember -Group "Remote Desktop Users" -Member "CORP\\HelpDesk"', hint: 'Add-LocalGroupMember -Group "Remote Desktop Users" -Member …', out: '', why: 'Only Administrators and Remote Desktop Users may log on through RDP. Use the group, not individual users.' },
     { t: 'Confirm Network Level Authentication is required (UserAuthentication = 1).', accept: [/^get-itemproperty -path ['"]?hklm:\\system\\currentcontrolset\\control\\terminal server\\winstations\\rdp-tcp['"]? -name ['"]?userauthentication['"]?$/i], show: "Get-ItemProperty -Path 'HKLM:\\System\\CurrentControlSet\\Control\\Terminal Server\\WinStations\\RDP-Tcp' -Name UserAuthentication", hint: "Get-ItemProperty … \\WinStations\\RDP-Tcp -Name UserAuthentication", out: 'UserAuthentication : 1', ask: { q: 'Is NLA on? (yes/no)', accept: ['yes'], why: 'NLA makes users authenticate before a full session is built — less exposure to attacks on the login screen.' }, why: 'Keep NLA on.' },
     { t: 'Verify the PC now listens on 3389.', accept: [/^get-nettcpconnection -localport 3389( -state listen)?$/i, /^netstat -an(o)? \| (findstr|select-string) :?3389$/i], show: 'Get-NetTCPConnection -LocalPort 3389 -State Listen', hint: 'Get-NetTCPConnection -LocalPort 3389', out: 'LocalAddress LocalPort RemoteAddress RemotePort State\n------------ --------- ------------- ---------- -----\n0.0.0.0      3389      0.0.0.0       0          Listen', why: 'Ready. In a domain, do this with Group Policy for many PCs.' }],
    'Enable RDP = turn it on + firewall + Remote Desktop Users group + keep NLA + verify 3389.',
    ['fDenyTSConnections, Enable-NetFirewallRule, Add-LocalGroupMember, UserAuthentication.']);
  O('rem-rdp-wrap', 'RDP from request to session', 'Combined 1.3',
    'Put the steps in order for giving a contractor RDP access to one server.',
    [['Get the access request approved and time-limited', 'Change control.'], ['Confirm the contractor connects through the VPN, not the Internet', 'VPN first.'], ['Add the contractor\'s account to a group in Remote Desktop Users on that server only', 'Least privilege.'], ['Make sure RDP is enabled with NLA and the firewall rule is scoped to the VPN subnet', 'Exposure.'], ['Contractor connects with mstsc /v:server', 'Session.'], ['Review sessions with quser and log off stale ones', 'Housekeeping.'], ['Remove the account from the group when the work ends', 'Revoke access.']],
    'Approve → VPN → least-privilege group → NLA + scoped firewall → connect → monitor → revoke.');

  RK.add({ track: TR, id: '1.3', dom: 1, short: 'Remote Desktop', title: 'Use and enable Remote Desktop (RDP) safely',
    goal: 'Connect with mstsc, manage sessions with quser/logoff, and enable RDP with firewall rules, Remote Desktop Users and NLA.',
    kw: /\b(rdp|remote desktop|mstsc|3389|quser|qwinsta|logoff|nla|network level|remote desktop users|terminal server|session host)/,
    parts: [
      P('Connecting and managing sessions', 'Connect with mstsc and manage sessions with quser and logoff.',
        `<ul><li><code>mstsc /v:host</code> — connect. Useful switches: <code>/f</code> full screen, <code>/admin</code> administrative session, <code>/multimon</code>. Or use the Windows App / Remote Desktop app.</li>
<li><b>Sessions</b> — signing out ends the session; closing the window only <b>disconnects</b> it (apps keep running). Disconnected sessions use RAM and can lock files.</li>
<li><code>quser /server:host</code> (or <code>query user</code>, <code>qwinsta</code>) — list sessions with ID, state (Active/Disc) and idle time.</li>
<li><code>logoff ID /server:host</code> — sign a session out (unsaved work is lost). <code>tsdiscon</code> disconnects without logging off.</li>
<li>Windows 10/11 Pro allows one RDP user at a time and locks the console user out; Windows Server with Remote Desktop Services (RDS) allows many, with CALs.</li></ul>` + pro('Teach users to Sign out, not just close the RDP window, on shared servers. It prevents "the server is full" and locked-file tickets.') + trap('Closing the RDP window disconnects; it does not log off.'),
        [['Which command lists sessions on TS01?', 'quser /server:TS01', ['mstsc /v:TS01', 'logoff /server:TS01', 'netstat TS01'], 'Query user.'],
         ['What happens when a user closes the RDP window instead of signing out?', 'The session is disconnected and keeps running', ['The session logs off', 'The server reboots', 'The account is locked'], 'Disconnected state.']],
        'rem-rdp-use'),
      P('Enabling RDP on a host', 'Enable Remote Desktop with the registry or settings, firewall rules, the Remote Desktop Users group and NLA.',
        `<p>To allow RDP into a Windows machine (Pro/Enterprise/Server):</p>
<ol><li><b>Turn it on</b> — Settings → System → Remote Desktop, or set <code>fDenyTSConnections</code> = 0 under <code>HKLM:\\System\\CurrentControlSet\\Control\\Terminal Server</code>.</li>
<li><b>Firewall</b> — <code>Enable-NetFirewallRule -DisplayGroup "Remote Desktop"</code>; scope it to admin/VPN subnets.</li>
<li><b>Who may connect</b> — Administrators plus members of the local <b>Remote Desktop Users</b> group. Add a domain group, not individuals.</li>
<li><b>NLA</b> (Network Level Authentication) — keep on: credentials are checked before the session is created.</li>
<li><b>Verify</b> — port 3389 listening; test from a client with <code>Test-NetConnection host -Port 3389</code>.</li></ol>
<p>For many PCs, use Group Policy (Computer Configuration → Administrative Templates → Remote Desktop Services, plus a firewall rule GPO).</p>` + pro('Never forward 3389 from the Internet to an internal PC. Exposed RDP is one of the most common ransomware entry points. VPN or an RD Gateway with MFA only.') + trap('Adding a user to Remote Desktop Users does nothing if RDP is disabled or the firewall blocks 3389 — all three must be right.'),
        [['Which local group grants RDP sign-in to non-administrators?', 'Remote Desktop Users', ['Power Users', 'Backup Operators', 'Users'], 'RDP rights.'],
         ['What does NLA do?', 'Authenticates the user before a full session is created', ['Encrypts the disk', 'Changes the port', 'Allows Home edition RDP'], 'Network Level Authentication.']],
        'rem-rdp-enable')
    ],
    wrap: { recap: ['mstsc /v:host (/f full screen, /admin admin session).', 'Close = disconnect; Sign out = log off. Disconnected sessions use resources.', 'quser /server: to list; logoff ID /server: to clear (check first).', 'Enable: fDenyTSConnections=0 + firewall group "Remote Desktop" + Remote Desktop Users + NLA.', 'Verify 3389 listening and reachable; use GPO at scale.', 'Never expose 3389 to the Internet: VPN or RD Gateway with MFA.'], lab: 'rem-rdp-wrap' }
  });

  // ================= Module 2 · 2.1 PowerShell remoting =================
  T('rem-psr-setup', 'Turn on PowerShell remoting', 'Enable-PSRemoting, Test-WSMan, TrustedHosts',
    'Ticket: set up PowerShell remoting on the workgroup lab server LAB-SQL (10.9.0.30) and manage it from your admin PC. Not domain-joined, so Kerberos is not available.',
    { shell: 'ps', prompt: 'PS C:\\Windows\\system32>' },
    [{ t: 'On LAB-SQL (console session): enable remoting, skipping the confirmation prompts.', accept: [/^enable-psremoting( -force| -skipnetworkprofilecheck)+$/i], show: 'Enable-PSRemoting -Force', hint: 'Enable-PSRemoting -Force', out: 'WinRM has been updated to receive requests.\nWinRM service started.\nWinRM firewall exception enabled.\nConfigured LocalAccountTokenFilterPolicy to grant administrative rights remotely to local users.', why: 'Starts WinRM, creates the HTTP listener on 5985 and the firewall rule. (Servers have it on by default.)' },
     { t: 'Back on your admin PC: test the WS-Management endpoint on 10.9.0.30.', accept: [/^test-wsman( -computername)? 10\.9\.0\.30$/i], show: 'Test-WSMan 10.9.0.30', hint: 'Test-WSMan <host>', out: 'ProductVendor   : Microsoft Corporation\nProductVersion  : OS: 0.0.0 SP: 0.0 Stack: 3.0', why: 'Listener reachable.' },
     { t: 'Because neither machine is in a domain, add LAB-SQL\'s IP to your client\'s TrustedHosts list.', accept: [/^set-item wsman:\\localhost\\client\\trustedhosts -value ['"]?10\.9\.0\.30['"]?( -concatenate)?( -force)?$/i], show: 'Set-Item WSMan:\\localhost\\Client\\TrustedHosts -Value "10.9.0.30" -Concatenate -Force', hint: 'Set-Item WSMan:\\localhost\\Client\\TrustedHosts -Value "<ip>" -Concatenate', out: '', why: 'Without Kerberos the client cannot verify the server\'s identity, so you must explicitly trust it. Never set TrustedHosts to "*".' },
     { t: 'Check the TrustedHosts list.', accept: [/^get-item wsman:\\localhost\\client\\trustedhosts$/i], show: 'Get-Item WSMan:\\localhost\\Client\\TrustedHosts', hint: 'Get-Item WSMan:\\localhost\\Client\\TrustedHosts', out: 'Name          Value\n----          -----\nTrustedHosts  10.9.0.30', ask: { q: 'For a production workgroup server, which port would you use instead to get certificate-based identity and encryption?', accept: ['5986'], why: 'WinRM over HTTPS (5986) with a certificate proves the server\'s identity and encrypts everything, without TrustedHosts.' }, why: 'Workgroup remoting.' }],
    'Domain: Enable-PSRemoting and go (Kerberos). Workgroup: TrustedHosts (narrow!) or, better, HTTPS on 5986 with a certificate.',
    ['Enable-PSRemoting -Force, Test-WSMan, WSMan:\\localhost\\Client\\TrustedHosts.']);
  T('rem-psr-use', 'Manage servers without logging on to them', 'Enter-PSSession, Invoke-Command, sessions',
    'Ticket: the Print Spooler on PRT01 is stuck, and you must check the free space on three file servers. Domain-joined; PowerShell on your admin PC.',
    { shell: 'ps', prompt: 'PS C:\\Users\\tech>' },
    [{ t: 'Open an interactive remote session to PRT01.', accept: [/^enter-pssession( -computername)? prt01$/i, /^etsn prt01$/i], show: 'Enter-PSSession -ComputerName PRT01', hint: 'Enter-PSSession -ComputerName <host>', out: '', prompt: '[PRT01]: PS C:\\Users\\tech\\Documents>', why: 'The prompt now shows [PRT01] — commands run there.' },
     { t: 'Restart the Print Spooler on PRT01.', accept: [/^restart-service( -name)? spooler( -force)?$/i], show: 'Restart-Service Spooler -Force', hint: 'Restart-Service Spooler', out: '', why: 'Fixed without a full desktop session.' },
     { t: 'Leave the remote session.', accept: [/^exit-pssession$/i, /^exit$/i], show: 'Exit-PSSession', hint: 'Exit-PSSession', out: '', prompt: 'PS C:\\Users\\tech>', why: 'Back on your PC.' },
     { t: 'In one command, get the free space on drive D: of FS01, FS02 and FS03.', accept: [/^invoke-command -computername fs01,\s?fs02,\s?fs03 -scriptblock \{ ?get-psdrive d ?\}$/i, /^icm fs01,\s?fs02,\s?fs03 \{ ?get-psdrive d ?\}$/i, /^invoke-command -computername fs01,\s?fs02,\s?fs03 -scriptblock \{ ?get-volume -driveletter d ?\}$/i], show: 'Invoke-Command -ComputerName FS01,FS02,FS03 -ScriptBlock { Get-PSDrive D }', hint: 'Invoke-Command -ComputerName a,b,c -ScriptBlock { … }', out: 'Name Used (GB) Free (GB) PSComputerName\n---- --------- --------- --------------\nD       1712.4     287.6 FS01\nD       1950.2      49.8 FS02\nD        880.1    1119.9 FS03', ask: { q: 'Which server is nearly full?', accept: ['fs02'], why: 'Invoke-Command runs in parallel and tags each result with PSComputerName — fan-out administration.' }, why: 'One-to-many remoting.' },
     { t: 'Create a reusable session to FS02 and store it in $s.', accept: [/^\$s ?= ?new-pssession( -computername)? fs02$/i], show: '$s = New-PSSession -ComputerName FS02', hint: '$s = New-PSSession -ComputerName FS02', out: '', why: 'Persistent sessions keep state (variables, loaded modules) between commands.' },
     { t: 'Using $s, list the 5 largest folders under D:\\Shares by running a script block (any command is fine) — use the session.', accept: [/^invoke-command -session \$s -scriptblock \{.+\}$/i, /^icm -session \$s \{.+\}$/i], show: 'Invoke-Command -Session $s -ScriptBlock { Get-ChildItem D:\\Shares -Directory | Sort-Object LastWriteTime -Descending | Select-Object -First 5 }', hint: 'Invoke-Command -Session $s -ScriptBlock { … }', out: 'Name          LastWriteTime        PSComputerName\n----          -------------        --------------\nMarketing     11/17/2026 3:02 PM   FS02\nVideoArchive  11/17/2026 2:47 PM   FS02', why: 'Remove the session afterwards: Remove-PSSession $s.' }],
    'Enter-PSSession = one machine, interactive. Invoke-Command = one or many, scripted. New-PSSession = keep a connection for several commands.',
    ['Enter-PSSession, Exit-PSSession, Invoke-Command -ComputerName/-Session, New-PSSession.']);
  M('rem-psr-wrap', 'Which remoting command?', 'Combined 2.1',
    'Pick the command.', ['Enable-PSRemoting', 'Test-WSMan', 'TrustedHosts', 'Enter-PSSession', 'Invoke-Command', 'New-PSSession', 'Exit-PSSession', 'HTTPS listener (5986)'],
    [['Turn on WinRM and its firewall rule on a PC', 'Enable-PSRemoting', 'Setup.'], ['Check a WinRM endpoint answers', 'Test-WSMan', 'Test.'], ['Allow a client to connect to a workgroup server by IP', 'TrustedHosts', 'No Kerberos.'], ['Work interactively on one server', 'Enter-PSSession', '1:1.'], ['Restart a service on 50 servers at once', 'Invoke-Command', '1:many.'], ['Keep a connection open for several commands', 'New-PSSession', 'Persistent.'], ['Leave the interactive session', 'Exit-PSSession', 'Back to local.'], ['Certificate-verified, encrypted remoting outside a domain', 'HTTPS listener (5986)', 'WinRM HTTPS.']],
    'Setup (Enable, Test, trust) then use (Enter, Invoke, sessions).');

  RK.add({ track: TR, id: '2.1', dom: 2, short: 'PowerShell remoting', title: 'Administer Windows remotely with PowerShell remoting (WinRM)',
    goal: 'Enable and test WinRM, handle workgroup trust, and use Enter-PSSession, Invoke-Command and persistent sessions.',
    kw: /\b(winrm|ws-?man|psremoting|enter-pssession|invoke-command|new-pssession|trustedhosts|5985|5986|remoting)/,
    parts: [
      P('Setting up remoting', 'Enable PowerShell remoting, test it and handle domain vs workgroup authentication.',
        `<ul><li><b>WinRM</b> (Windows Remote Management) implements WS-Management. PowerShell remoting runs on top of it: TCP <b>5985</b> (HTTP) and <b>5986</b> (HTTPS).</li>
<li><code>Enable-PSRemoting -Force</code> — starts WinRM, creates the listener and the firewall exception. On by default on Windows Server; off on client Windows.</li>
<li><code>Test-WSMan host</code> — checks the endpoint answers.</li>
<li><b>Domain</b>: Kerberos authenticates both sides and encrypts the session even on 5985 — just use computer names.</li>
<li><b>Workgroup / IP address</b>: no Kerberos, so the client must trust the target: add it to <code>WSMan:\\localhost\\Client\\TrustedHosts</code> (specific names/IPs only), or better, configure an <b>HTTPS listener on 5986</b> with a certificate.</li>
<li>Who may connect: local Administrators and the <b>Remote Management Users</b> group.</li></ul>` + pro('Enable remoting on every client through Group Policy, scoped by firewall to the admin subnet. It turns a 20-minute "remote in and click" job into a one-line fix.') + trap('Setting TrustedHosts to "*" disables server identity checks for every host — never do it.'),
        [['Which ports does WinRM use?', '5985 (HTTP) and 5986 (HTTPS)', ['3389 and 22', '80 and 443', '445 and 139'], 'WS-Man.'],
         ['Why is TrustedHosts needed for a workgroup server?', 'Kerberos cannot verify the server\'s identity outside a domain', ['To open the firewall', 'To install PowerShell', 'To enable RDP'], 'No Kerberos.']],
        'rem-psr-setup'),
      P('Using remoting', 'Run commands remotely with Enter-PSSession, Invoke-Command and persistent sessions.',
        `<table><tr><th>Command</th><th>Use</th></tr>
<tr><td><code>Enter-PSSession -ComputerName X</code></td><td>Interactive, one machine; prompt shows <code>[X]:</code>. Leave with <code>Exit-PSSession</code>.</td></tr>
<tr><td><code>Invoke-Command -ComputerName A,B,C -ScriptBlock { … }</code></td><td>Run a command or script on many machines in parallel; results tagged with <code>PSComputerName</code>. <code>-FilePath</code> runs a local .ps1 remotely.</td></tr>
<tr><td><code>$s = New-PSSession X</code></td><td>Persistent session for several commands (<code>Invoke-Command -Session $s</code>, <code>Enter-PSSession $s</code>). Clean up with <code>Remove-PSSession</code>.</td></tr></table>
<p>Pass local variables into a script block with <code>$using:var</code>. Results come back as deserialized objects (properties, no methods).</p>` + pro('Build checks as Invoke-Command one-liners against a list of servers (Get-Content servers.txt). The same line works for 3 machines or 300.') + trap('The "double hop": inside a remote session you cannot use your credentials to reach a third machine (e.g. a file share) by default. Copy files first or use CredSSP/resource-based delegation deliberately.'),
        [['Which command runs a script block on several computers at once?', 'Invoke-Command', ['Enter-PSSession', 'Test-WSMan', 'mstsc'], 'Fan-out.'],
         ['How do you leave an interactive remote PowerShell session?', 'Exit-PSSession', ['logoff', 'Remove-Item', 'Stop-Computer'], 'Back to local.']],
        'rem-psr-use')
    ],
    wrap: { recap: ['WinRM: 5985 HTTP, 5986 HTTPS; PowerShell remoting runs on it.', 'Enable-PSRemoting -Force; Test-WSMan host.', 'Domain = Kerberos, just works. Workgroup = TrustedHosts (narrow) or HTTPS with a certificate.', 'Enter-PSSession for one interactive machine; Exit-PSSession to leave.', 'Invoke-Command -ComputerName a,b,c -ScriptBlock {} for many; PSComputerName tags results.', 'New-PSSession for persistent sessions; $using: for local variables; mind the double hop.'], lab: 'rem-psr-wrap' }
  });

  // ================= 2.2 Remote support workflow =================
  O('rem-support-order', 'An attended remote-support call', 'Professional workflow',
    'A user calls the help desk: Outlook keeps crashing. Put the remote-support steps in order.',
    [['Verify the caller\'s identity (ticket, employee ID, call-back to a known number)', 'Never skip — attackers impersonate users.'], ['Explain what you will do and get the user\'s consent to view/control the screen', 'Consent.'], ['Start the approved tool (Quick Assist / RMM attended session) and have the user share the code', 'Approved tool only.'], ['Never ask for the user\'s password; use your own admin credentials when elevation is needed', 'Credentials.'], ['Fix the problem while narrating; avoid opening personal files', 'Privacy.'], ['Confirm with the user that it works', 'Verify.'], ['End the session and make sure the tool is closed', 'Disconnect.'], ['Document what you did in the ticket', 'Documentation.']],
    'Verify → consent → approved tool → own credentials → fix → verify → disconnect → document.');
  T('rem-audit', 'Who connected, and remove temporary access', 'Audit remote logons in PowerShell',
    'Ticket: after a vendor finished work on SRV-ERP01 yesterday, confirm when they connected over RDP and remove their temporary access. Elevated PowerShell on SRV-ERP01.',
    { shell: 'ps', prompt: 'PS C:\\Windows\\system32>' },
    [{ t: 'Find RDP logon events: Security log, event ID 4624 (the output is filtered to logon type 10 = RemoteInteractive).', accept: [/^get-winevent -filterhashtable @\{ ?logname ?= ?['"]?security['"]?; ?id ?= ?4624 ?\}.*$/i], show: "Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4624} | Where-Object { $_.Properties[8].Value -eq 10 } | Select-Object TimeCreated,@{n='User';e={$_.Properties[5].Value}}", hint: "Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4624} | …", out: 'TimeCreated            User\n-----------            ----\n11/16/2026 1:12:40 PM  vendor-acme\n11/16/2026 9:03:11 AM  vendor-acme\n11/15/2026 4:51:02 PM  tech', ask: { q: 'How many RDP logons did vendor-acme make? (number)', accept: ['2'], why: 'Two sessions, both during the approved window. Logon type 10 = RemoteInteractive (RDP); type 3 = network (shares, WinRM).' }, why: 'Audit trail.' },
     { t: 'Remove the vendor account from the Remote Desktop Users group.', accept: [/^remove-localgroupmember -group ['"]remote desktop users['"] -member ['"]?vendor-acme['"]?$/i], show: 'Remove-LocalGroupMember -Group "Remote Desktop Users" -Member "vendor-acme"', hint: 'Remove-LocalGroupMember -Group … -Member …', out: '', why: 'Temporary access removed the day the work ended.' },
     { t: 'Disable the vendor\'s local account too.', accept: [/^disable-localuser( -name)? ['"]?vendor-acme['"]?$/i], show: 'Disable-LocalUser -Name "vendor-acme"', hint: 'Disable-LocalUser -Name …', out: '', why: 'Disable, do not delete yet — the account may be needed for an investigation. Note both actions in the change ticket.' }],
    'Remote access ends with an audit and a revocation, not just "they are done".',
    ['Security 4624 logon type 10, Remove-LocalGroupMember, Disable-LocalUser.']);
  M('rem-support-wrap', 'Remote support judgement', 'Combined 2.2',
    'Pick the right response.', ['Verify identity first', 'Ask for consent before taking control', 'Use your own admin credentials', 'Use only the approved tool', 'End the session and close the tool', 'Document in the ticket', 'Refuse and report it'],
    [['A caller says they are the CFO and need their password reset now', 'Verify identity first', 'Call back on a known number.'], ['You are about to take mouse control', 'Ask for consent before taking control', 'Explain and ask.'], ['An install asks for admin rights during the session', 'Use your own admin credentials', 'Never ask for the user\'s password.'], ['User suggests you use a free remote tool they found online', 'Use only the approved tool', 'Approved, logged tools.'], ['Problem is fixed', 'End the session and close the tool', 'No lingering access.'], ['What you changed and why', 'Document in the ticket', 'Documentation.'], ['A "Microsoft technician" called a user and asked them to install AnyDesk', 'Refuse and report it', 'Tech-support scam.']],
    'Trust is the job: identity, consent, approved tools, clean exit, documentation.');

  RK.add({ track: TR, id: '2.2', dom: 2, short: 'Remote support workflow', title: 'Run professional, secure remote-support sessions',
    goal: 'Verify identity, get consent, use approved tools, never take passwords, end cleanly, document, audit and revoke access.',
    kw: /\b(remote support|quick assist|consent|attended|unattended|verify identity|help desk call|tech.support scam|audit|4624|logon type|revoke)/,
    parts: [
      P('The attended support session', 'Run an attended remote-support session from identity check to documentation.',
        `<ol><li><b>Verify identity</b> — ticket number, employee ID, call-back to the number in the directory. Attackers call help desks pretending to be executives.</li>
<li><b>Consent</b> — explain what you will do; the user approves viewing and control (Quick Assist and RMM tools prompt for this).</li>
<li><b>Approved tool only</b> — the company\'s remote tool, which logs sessions. Never a random free tool.</li>
<li><b>Credentials</b> — never ask for the user\'s password; elevate with your own admin account (UAC prompt) or a LAPS-managed local admin password.</li>
<li><b>Privacy</b> — stay in the problem area; ask before opening documents or email.</li>
<li><b>Verify</b> the fix with the user, <b>end</b> the session, confirm the tool closed.</li>
<li><b>Document</b> — symptoms, cause, changes made, follow-ups.</li></ol>` + pro('Narrate while you work ("I\'m opening Outlook\'s safe mode now"). Users trust what they can follow, and they learn the fix for next time.') + trap('No legitimate support process asks a user for their password. If a "technician" asks, it is social engineering.'),
        [['What is the first step when a user calls asking for remote help?', 'Verify their identity', ['Start the remote tool', 'Ask for their password', 'Reboot their PC'], 'Identity first.'],
         ['An installer needs admin rights during a session. What do you do?', 'Enter your own admin credentials', ['Ask for the user\'s password', 'Disable UAC', 'Skip the install'], 'Own credentials.']],
        'rem-support-order'),
      P('Unattended access, auditing and revocation', 'Control unattended access, audit remote logons and revoke temporary access.',
        `<ul><li><b>Unattended access</b> (servers, overnight patching, vendors) must be pre-approved, limited to named people or groups, and logged.</li>
<li><b>Audit</b> — Windows Security log event <b>4624</b> (successful logon): <b>logon type 10</b> = RemoteInteractive (RDP), <b>type 3</b> = network (file shares, WinRM). 4625 = failed logon. RMM tools keep their own session logs and recordings.</li>
<li><b>Temporary access</b> — vendors and contractors get time-limited accounts or group membership. When the work ends: remove from <b>Remote Desktop Users</b>/admin groups, disable the account, rotate any shared credentials, and record it.</li>
<li>Prefer just-in-time access (approval per session) and session recording for privileged remote work.</li></ul>` + pro('Put an expiry date on every vendor account the day you create it (Set-ADUser -AccountExpirationDate). Forgotten vendor access is a common breach path.') + trap('Logon type 10 is RDP; type 3 is network access. Do not read every 4624 as an interactive login.'),
        [['Which logon type in event 4624 indicates an RDP logon?', 'Type 10', ['Type 2', 'Type 3', 'Type 5'], 'RemoteInteractive.'],
         ['A vendor finished their work. What do you do with their remote access?', 'Remove group membership and disable the account, then document', ['Leave it for next time', 'Share it with another vendor', 'Delete all logs'], 'Revoke.']],
        'rem-audit')
    ],
    wrap: { recap: ['Verify identity → consent → approved tool → own credentials → fix → verify → end → document.', 'Never ask for or accept a user\'s password.', 'Privacy: stay in the problem area.', 'Unattended access: pre-approved, named, logged.', 'Audit: 4624 type 10 = RDP, type 3 = network; 4625 = failed.', 'Revoke temporary access the day work ends: groups, disable, rotate, record.'], lab: 'rem-support-wrap' }
  });

  // ================= 2.3 Troubleshooting remote access =================
  T('rem-rdp-ts', '"I can\'t RDP to the server"', 'Walk the RDP troubleshooting ladder',
    'Ticket: a help-desk tech cannot RDP to APP03. Work up the ladder from your admin PC (PowerShell, domain admin).',
    { shell: 'ps', prompt: 'PS C:\\Users\\tech>' },
    [{ t: 'Step 1 — is the host up and resolving? Ping it by name.', accept: [/^(test-connection|ping)( -computername| -targetname)? app03( -count \d+| -n \d+)?$/i], show: 'Test-Connection APP03 -Count 2', hint: 'Test-Connection <host>', out: 'Destination Status  Address\n----------- ------  -------\nAPP03       Success 10.20.5.33\nAPP03       Success 10.20.5.33', why: 'DNS and network fine.' },
     { t: 'Step 2 — is 3389 reachable?', accept: [/^test-netconnection( -computername)? app03 -port 3389$/i, /^tnc app03 -port 3389$/i], show: 'Test-NetConnection APP03 -Port 3389', hint: 'Test-NetConnection … -Port 3389', out: 'TcpTestSucceeded : False', why: 'Up, but RDP port closed: service or firewall.' },
     { t: 'Step 3 — check the Remote Desktop Services service on APP03 remotely.', accept: [/^get-service( -name)? termservice -computername app03$/i, /^invoke-command -computername app03 -scriptblock \{ ?get-service termservice ?\}$/i], show: 'Invoke-Command -ComputerName APP03 -ScriptBlock { Get-Service TermService }', hint: 'Invoke-Command … { Get-Service TermService }', out: 'Status   Name         DisplayName          PSComputerName\n------   ----         -----------          --------------\nRunning  TermService  Remote Desktop Se…   APP03', why: 'Service running → firewall next.' },
     { t: 'Step 4 — check whether the Remote Desktop firewall rules are enabled on APP03.', accept: [/^invoke-command -computername app03 -scriptblock \{ ?get-netfirewallrule -displaygroup ['"]remote desktop['"]( \| select(-object)? .+)? ?\}$/i], show: 'Invoke-Command -ComputerName APP03 -ScriptBlock { Get-NetFirewallRule -DisplayGroup "Remote Desktop" | Select-Object DisplayName,Enabled }', hint: 'Invoke-Command … { Get-NetFirewallRule -DisplayGroup "Remote Desktop" }', out: 'DisplayName                              Enabled\n-----------                              -------\nRemote Desktop - User Mode (TCP-In)      False\nRemote Desktop - User Mode (UDP-In)      False', ask: { q: 'Are the RDP firewall rules enabled? (yes/no)', accept: ['no'], why: 'A hardening GPO change disabled them. Fix it in the GPO (or locally for now).' }, why: 'Found the cause.' },
     { t: 'Step 5 — enable them on APP03 and re-test from your PC (just enable them; re-test is assumed).', accept: [/^invoke-command -computername app03 -scriptblock \{ ?enable-netfirewallrule -displaygroup ['"]remote desktop['"] ?\}$/i], show: 'Invoke-Command -ComputerName APP03 -ScriptBlock { Enable-NetFirewallRule -DisplayGroup "Remote Desktop" }', hint: 'Invoke-Command … { Enable-NetFirewallRule -DisplayGroup "Remote Desktop" }', out: '(Test-NetConnection APP03 -Port 3389 → TcpTestSucceeded : True)', why: 'Port open. If login were still refused, the next rungs are: Remote Desktop Users membership, NLA/credential errors, licensing.' }],
    'RDP ladder: ping/DNS → port 3389 → TermService → firewall → group membership → NLA/credentials → licensing.',
    ['Test-Connection, Test-NetConnection -Port 3389, TermService, Get-NetFirewallRule.']);
  T('rem-ssh-ts', '"Permission denied (publickey)"', 'Walk the SSH troubleshooting ladder',
    'Ticket: a developer cannot SSH to api02 with their key. You have console access to api02 and the developer\'s verbose output.',
    { shell: 'bash', prompt: 'phil@admin:~$' },
    [{ t: 'From your workstation, check port 22 on api02 is reachable.', accept: [/^nc -zv api02 22$/, /^nc -vz api02 22$/], show: 'nc -zv api02 22', hint: 'nc -zv <host> <port>', out: 'Connection to api02 (10.0.4.40) 22 port [tcp/ssh] succeeded!', why: 'Network and sshd are fine — it is authentication.' },
     { t: 'Connect verbosely as dev to see which keys are offered.', accept: [/^ssh -v dev@api02$/, /^ssh -vv dev@api02$/, /^ssh -vvv dev@api02$/], show: 'ssh -v dev@api02', hint: 'ssh -v user@host', out: 'debug1: Offering public key: /home/dev/.ssh/id_ed25519 ED25519 SHA256:k7Fa…\ndebug1: Authentications that can continue: publickey\ndev@api02: Permission denied (publickey).', why: 'The right key is offered but the server rejects it. Check the server side.' },
     { t: 'On api02 (as root on the console now), check the auth log for sshd messages about dev.', accept: [/^(sudo )?journalctl -u ssh(d)?( -n \d+| --since .+)?$/, /^(sudo )?grep (sshd|dev) \/var\/log\/auth\.log$/, /^(sudo )?tail( -n \d+)? \/var\/log\/auth\.log$/], show: 'journalctl -u ssh -n 20', hint: 'journalctl -u ssh (or tail /var/log/auth.log)', prompt: 'root@api02:~#', out: 'sshd[2214]: Authentication refused: bad ownership or modes for directory /home/dev/.ssh', ask: { q: 'What does sshd say is wrong?', accept: ['bad ownership or modes', 'permissions', 'bad permissions', 'ownership or modes', 'bad modes', 'wrong permissions'], why: 'StrictModes: sshd ignores authorized_keys if ~/.ssh or the file is writable by others.' }, why: 'The server log tells you why.' },
     { t: 'Fix the permissions: ~/.ssh must be 700 for dev.', accept: [/^chmod 700 \/home\/dev\/\.ssh$/], show: 'chmod 700 /home/dev/.ssh', hint: 'chmod 700 /home/dev/.ssh', out: '', prompt: 'root@api02:~#', why: 'Directory fixed.' },
     { t: 'And authorized_keys must be 600.', accept: [/^chmod 600 \/home\/dev\/\.ssh\/authorized_keys$/], show: 'chmod 600 /home/dev/.ssh/authorized_keys', hint: 'chmod 600 …/authorized_keys', out: '', prompt: 'root@api02:~#', why: 'Also check ownership (chown -R dev:dev /home/dev/.ssh). The developer can now log in.' }],
    'SSH ladder: reach port 22 (nc -zv) → ssh -v on the client → server log (journalctl/auth.log) → permissions, authorized_keys content, sshd_config (AllowUsers, PasswordAuthentication) → host key warnings.',
    ['nc -zv, ssh -v, journalctl -u ssh, chmod 700/600.']);
  M('rem-ts-wrap', 'Remote-access help desk', 'Combined 2.3',
    'Pick the most likely cause.', ['DNS / host down', 'Firewall blocking the port', 'Service stopped', 'Not in Remote Desktop Users', 'NLA / credential problem', 'Key permissions too open', 'Host key changed', 'TrustedHosts / Kerberos', 'Not on the VPN'],
    [['Ping by name fails, ping by IP works', 'DNS / host down', 'Name resolution.'], ['Ping works; Test-NetConnection 3389 fails; TermService running', 'Firewall blocking the port', 'Firewall.'], ['nc -zv host 22 refused; host is up', 'Service stopped', 'sshd not running.'], ['"The connection was denied because the user account is not authorized for remote login"', 'Not in Remote Desktop Users', 'Group.'], ['"An authentication error has occurred" after a password change', 'NLA / credential problem', 'Credentials/NLA.'], ['sshd log: "bad ownership or modes"', 'Key permissions too open', 'chmod 700/600.'], ['"REMOTE HOST IDENTIFICATION HAS CHANGED"', 'Host key changed', 'Rebuilt server or attack — verify.'], ['Enter-PSSession by IP fails with "WinRM cannot process the request… TrustedHosts"', 'TrustedHosts / Kerberos', 'Workgroup trust.'], ['Works in the office, every remote method fails from home', 'Not on the VPN', 'Connect VPN first.']],
    'Every remote ticket: reachability → port → service → firewall → authorization → authentication.');

  RK.add({ track: TR, id: '2.3', dom: 2, short: 'Troubleshooting remote access', title: 'Troubleshoot RDP, SSH and PowerShell remoting connections',
    goal: 'Use a repeatable ladder to fix "can\'t RDP", "can\'t SSH" and remoting failures.',
    kw: /\b(can.?t (rdp|ssh|connect)|permission denied|publickey|host identification|authentication error|not authorized for remote|termservice|sshd|auth\.log|journalctl|nc -zv|ssh -v)/,
    parts: [
      P('The RDP ladder', 'Troubleshoot RDP from reachability through firewall, membership, NLA and licensing.',
        `<ol><li><b>Reachable?</b> — <code>Test-Connection host</code>; name vs IP (DNS).</li>
<li><b>Port open?</b> — <code>Test-NetConnection host -Port 3389</code>. VPN connected if remote?</li>
<li><b>Service?</b> — Remote Desktop Services (<code>TermService</code>) running; RDP enabled (<code>fDenyTSConnections</code> = 0).</li>
<li><b>Firewall?</b> — "Remote Desktop" rule group enabled and scoped correctly (often changed by a GPO).</li>
<li><b>Authorization?</b> — user in Administrators or Remote Desktop Users ("not authorized for remote login").</li>
<li><b>Authentication?</b> — wrong/expired password, locked account, NLA/CredSSP errors, clock skew breaking Kerberos.</li>
<li><b>Capacity/licensing?</b> — too many sessions (client Windows allows one), RDS licensing.</li></ol>
<p>Read the exact error text — each rung has a distinct message.</p>` + pro('Use Invoke-Command to inspect the target while RDP is broken. WinRM often still works, so you can check services and firewall rules without walking to the server.') + trap('If ping fails, do not assume the server is down — many servers block ICMP. Test the port too.'),
        [['Ping works but port 3389 fails and TermService is running. Next check?', 'The firewall rules on the server', ['The DNS record', 'The user\'s password', 'RDS licensing'], 'Ladder.'],
         ['"Not authorized for remote login" points to what?', 'Missing Remote Desktop Users membership', ['Firewall', 'DNS', 'Expired certificate'], 'Authorization.']],
        'rem-rdp-ts'),
      P('The SSH and WinRM ladders', 'Troubleshoot SSH and PowerShell remoting with verbose output and server logs.',
        `<p><b>SSH</b>:</p>
<ol><li><code>nc -zv host 22</code> (or <code>Test-NetConnection host -Port 22</code>) — reachable? "Refused" = sshd not running or firewall reject; timeout = filtered/down.</li>
<li><code>ssh -v user@host</code> — which keys are offered, what methods are allowed.</li>
<li>Server log: <code>journalctl -u ssh</code> or <code>/var/log/auth.log</code> — exact reason.</li>
<li>Common causes: <code>~/.ssh</code> not 700 / <code>authorized_keys</code> not 600 or wrong owner; key missing from authorized_keys; <code>PasswordAuthentication no</code>; <code>AllowUsers</code>; firewall (<code>ufw status</code>); changed host key.</li></ol>
<p><b>WinRM</b>: <code>Test-WSMan host</code> → firewall 5985/5986 → service <code>WinRM</code> → user in Administrators/Remote Management Users → TrustedHosts/HTTPS outside a domain → double-hop limits.</p>` + pro('Always ask for the full error text. "Connection refused", "timed out" and "permission denied" are three different rungs of the ladder.') + trap('"Connection refused" means something answered and rejected you (no listener); "timed out" means nothing answered (filtered or down).'),
        [['Which client option shows the SSH authentication steps?', 'ssh -v', ['ssh -p', 'ssh -L', 'ssh -N'], 'Verbose.'],
         ['Where do you find why sshd rejected a key on Ubuntu?', 'journalctl -u ssh or /var/log/auth.log', ['~/.ssh/known_hosts', '/etc/hosts', 'Event Viewer only'], 'Server log.']],
        'rem-ssh-ts')
    ],
    wrap: { recap: ['Ladder: reachable → port → service → firewall → authorization → authentication → capacity.', 'RDP: Test-NetConnection 3389, TermService, "Remote Desktop" firewall group, Remote Desktop Users, NLA/credentials.', 'SSH: nc -zv 22, ssh -v, journalctl -u ssh / auth.log, permissions 700/600, sshd_config.', 'WinRM: Test-WSMan, 5985/5986, WinRM service, groups, TrustedHosts, double hop.', 'Refused = no listener; timed out = filtered or down.', 'Use a working channel (WinRM, console) to inspect a broken one.'], lab: 'rem-ts-wrap' }
  });

  // ================= 2.4 Secure remote access =================
  T('rem-jump', 'Reach internal servers through a bastion', 'ssh -J and ProxyJump',
    'Ticket: internal database server db01 (10.50.0.10) is only reachable from the bastion host bastion.corp.example. Your key is on both.',
    { shell: 'bash', prompt: 'phil@laptop:~$' },
    [{ t: 'Connect to db01 as phil, jumping through the bastion in one command.', accept: [/^ssh -J (phil@)?bastion\.corp\.example phil@(db01|10\.50\.0\.10)$/], show: 'ssh -J phil@bastion.corp.example phil@db01', hint: 'ssh -J <jumpuser@jumphost> <user@target>', out: 'phil@db01:~$', prompt: 'phil@db01:~$', why: 'The bastion forwards the encrypted connection; your private key never sits on the bastion.' },
     { t: 'Disconnect.', accept: [/^exit$/], show: 'exit', hint: 'exit', out: 'Connection to db01 closed.', prompt: 'phil@laptop:~$', why: 'Back on your laptop.' },
     { t: 'Make it permanent: append a Host entry for db01 that uses ProxyJump (type the printf from the hint).', accept: [/^printf ['"]Host db01\\n +HostName 10\.50\.0\.10\\n +User phil\\n +ProxyJump phil@bastion\.corp\.example\\n['"] >> ~\/\.ssh\/config$/], show: "printf 'Host db01\\n  HostName 10.50.0.10\\n  User phil\\n  ProxyJump phil@bastion.corp.example\\n' >> ~/.ssh/config", hint: "printf 'Host db01\\n  HostName 10.50.0.10\\n  User phil\\n  ProxyJump phil@bastion.corp.example\\n' >> ~/.ssh/config", out: '', why: 'Now plain "ssh db01" and "scp file db01:" go through the bastion automatically.' },
     { t: 'Test it by running uptime on db01.', accept: [/^ssh db01 ['"]?uptime['"]?$/], show: 'ssh db01 uptime', hint: 'ssh db01 uptime', out: ' 17:42:09 up 41 days,  3:10,  0 users,  load average: 0.31, 0.29, 0.25', why: 'One hardened, monitored entry point (with MFA) instead of SSH open on every server.' }],
    'Bastion/jump host: one hardened, logged, MFA-protected door; internal servers accept SSH only from it.',
    ['ssh -J, ProxyJump in ~/.ssh/config.']);
  T('rem-harden', 'Harden an SSH server', 'sshd_config, test, reload, verify',
    'Ticket: security review says web01 allows root and password logins over SSH. Keys already work for all admins. You are root on web01.',
    { shell: 'bash', prompt: 'root@web01:~#' },
    [{ t: 'Show the current values of PermitRootLogin and PasswordAuthentication in /etc/ssh/sshd_config.', accept: [/^grep -[Ei]+ ['"]?\^?\(?permitrootlogin\|passwordauthentication\)?['"]? \/etc\/ssh\/sshd_config$/i, /^grep -e permitrootlogin -e passwordauthentication \/etc\/ssh\/sshd_config$/i, /^grep -iE ['"]permitrootlogin\|passwordauthentication['"] \/etc\/ssh\/sshd_config$/], show: "grep -iE 'PermitRootLogin|PasswordAuthentication' /etc/ssh/sshd_config", hint: "grep -iE 'PermitRootLogin|PasswordAuthentication' /etc/ssh/sshd_config", out: 'PermitRootLogin yes\nPasswordAuthentication yes', why: 'Both too permissive.' },
     { t: 'Set PermitRootLogin to no (in-place edit with sed).', accept: [/^sed -i ['"]s\/\^?PermitRootLogin yes\/PermitRootLogin no\/['"] \/etc\/ssh\/sshd_config$/], show: "sed -i 's/^PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config", hint: "sed -i 's/^PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config", out: '', why: 'Admins log in as themselves and use sudo — every action is attributable.' },
     { t: 'Set PasswordAuthentication to no.', accept: [/^sed -i ['"]s\/\^?PasswordAuthentication yes\/PasswordAuthentication no\/['"] \/etc\/ssh\/sshd_config$/], show: "sed -i 's/^PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config", hint: "sed -i 's/^PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config", out: '', why: 'Keys only: password brute-forcing becomes useless.' },
     { t: 'Test the config syntax before reloading (so you cannot lock yourself out).', accept: [/^sshd -t$/, /^\/usr\/sbin\/sshd -t$/], show: 'sshd -t', hint: 'sshd -t', out: '', ask: { q: 'sshd -t printed nothing. Does that mean the config is valid? (yes/no)', accept: ['yes'], why: 'Silence = valid. Errors would be printed with the line number.' }, why: 'Test before reload.' },
     { t: 'Reload SSH to apply the new config (existing sessions stay open).', accept: [/^systemctl reload ssh(d)?$/, /^systemctl reload ssh(d)?\.service$/], show: 'systemctl reload ssh', hint: 'systemctl reload ssh', out: '', why: 'Keep your current session open and test a new login in a second terminal before you disconnect.' },
     { t: 'Confirm the effective settings sshd is using.', accept: [/^sshd -T \| grep -[Ei]+ ['"]?\(?permitrootlogin\|passwordauthentication\)?['"]?$/i, /^sshd -T \| grep -iE ['"]permitrootlogin\|passwordauthentication['"]$/], show: "sshd -T | grep -iE 'permitrootlogin|passwordauthentication'", hint: "sshd -T | grep -iE 'permitrootlogin|passwordauthentication'", out: 'permitrootlogin no\npasswordauthentication no', why: 'Verified. Add fail2ban and limit port 22 to the bastion/VPN subnet in the firewall.' }],
    'SSH hardening: no root, no passwords, keys only, test (sshd -t) → reload → verify (sshd -T) → keep a session open until a fresh login works.',
    ['grep sshd_config, sed -i, sshd -t, systemctl reload ssh, sshd -T.']);
  M('rem-sec-wrap', 'Secure remote access design', 'Combined 2.4',
    'Pick the best control.', ['VPN with MFA', 'RD Gateway / bastion with MFA', 'Keys instead of passwords', 'Disable root/administrator remote login', 'Least privilege group', 'Scope the firewall to admin subnets', 'Account lockout + monitoring', 'Just-in-time access'],
    [['Staff need to reach internal file servers from home', 'VPN with MFA', 'Network access.'], ['Admins need RDP and SSH to servers from anywhere', 'RD Gateway / bastion with MFA', 'Single hardened entry point.'], ['SSH logs show thousands of password guesses a day', 'Keys instead of passwords', 'Nothing to guess.'], ['Shared "root" logins make actions untraceable', 'Disable root/administrator remote login', 'Personal accounts + sudo.'], ['Help desk only needs RDP to user PCs, not servers', 'Least privilege group', 'Scope rights.'], ['WinRM and RDP reachable from every VLAN', 'Scope the firewall to admin subnets', 'Reduce exposure.'], ['Detect and slow down guessing', 'Account lockout + monitoring', 'Detection.'], ['Domain admin rights granted only for an approved 2-hour window', 'Just-in-time access', 'Time-bound privilege.']],
    'Layer it: VPN/bastion + MFA → keys/strong auth → least privilege → narrow firewall → logging.');

  RK.add({ track: TR, id: '2.4', dom: 2, short: 'Secure remote access', title: 'Design and harden secure remote access',
    goal: 'Put remote access behind VPNs and bastions with MFA, use keys and least privilege, and harden SSH and RDP.',
    kw: /\b(bastion|jump host|proxyjump|ssh -j|rd gateway|mfa|multi.factor|least privilege|sshd_config|permitrootlogin|passwordauthentication|harden|fail2ban|just.in.time|expose)/,
    parts: [
      P('VPNs, bastions and MFA', 'Put remote access behind a VPN or bastion/gateway with MFA and use jump hosts.',
        `<ul><li><b>Never expose management ports</b> (3389, 22, 5985/5986) directly to the Internet. They are scanned constantly.</li>
<li><b>VPN first</b> — with MFA — so management traffic only travels inside the network.</li>
<li><b>Bastion / jump host</b> — one hardened, patched, logged server that admins connect to (with MFA); internal servers accept SSH/RDP only from it. SSH: <code>ssh -J bastion user@internal</code> or <code>ProxyJump</code> in <code>~/.ssh/config</code>. Windows: <b>RD Gateway</b> (RDP over HTTPS 443 with MFA).</li>
<li><b>Zero-trust access</b> products (identity-aware proxies) verify user and device for every session.</li>
<li><b>MFA</b> on every path that leads to admin access — VPN, gateway, bastion, RMM console.</li></ul>` + pro('Your RMM console is the most powerful remote tool you own: it reaches every PC. Protect it with phishing-resistant MFA and alert on new admin logins.') + trap('A bastion only helps if internal servers refuse direct connections — scope their firewalls to the bastion\'s address.'),
        [['How do you SSH to db01 through bastion in one command?', 'ssh -J bastion user@db01', ['ssh -L bastion db01', 'scp bastion db01', 'ssh -p bastion db01'], 'ProxyJump.'],
         ['Which Windows role carries RDP over HTTPS with MFA?', 'RD Gateway', ['WinRM', 'Quick Assist', 'BitLocker'], 'Gateway.']],
        'rem-jump'),
      P('Hardening SSH and RDP', 'Harden SSH and RDP with keys, no root/password logins, least privilege, NLA, firewall scoping and lockout.',
        `<p><b>SSH</b> (<code>/etc/ssh/sshd_config</code>):</p>
<ul><li><code>PasswordAuthentication no</code> — keys only. <code>PermitRootLogin no</code> — personal accounts + sudo.</li>
<li><code>AllowUsers</code>/<code>AllowGroups</code> to limit who may log in; fail2ban to block guessing.</li>
<li>Always <code>sshd -t</code> (test) → <code>systemctl reload ssh</code> → test a new login while your old session is still open → <code>sshd -T</code> to see effective settings.</li></ul>
<p><b>RDP</b>: keep NLA on; restrict Remote Desktop Users to the right group; account lockout policy; firewall rule scoped to admin/VPN subnets; RD Gateway for outside access; patch promptly.</p>
<p><b>Everywhere</b>: least privilege (separate admin accounts, just-in-time elevation), unique local admin passwords (LAPS), session logging, remove access when it is no longer needed.</p>` + pro('Never close your only SSH session after editing sshd_config until a brand-new login works. Keep the old one open as your way back in.') + trap('Changing the SSH port to something like 2222 cuts log noise but is not real security — keys, no root and firewall scoping are.'),
        [['Which sshd_config setting forces key-only logins?', 'PasswordAuthentication no', ['PermitRootLogin yes', 'Port 2222', 'X11Forwarding yes'], 'Keys only.'],
         ['What should you run before reloading sshd after an edit?', 'sshd -t', ['ssh -v', 'ssh-keygen -R', 'nc -zv'], 'Syntax test.']],
        'rem-harden')
    ],
    wrap: { recap: ['Never expose 3389/22/5985 to the Internet.', 'VPN with MFA; bastion/jump host (ssh -J, ProxyJump) or RD Gateway with MFA.', 'Internal servers accept management only from the bastion/admin subnets.', 'SSH: PasswordAuthentication no, PermitRootLogin no, AllowUsers, fail2ban; sshd -t → reload → test → sshd -T.', 'RDP: NLA, least-privilege group, lockout, scoped firewall, patching.', 'Least privilege, LAPS, just-in-time access, logging, prompt revocation.'], lab: 'rem-sec-wrap' }
  });

  // ================= Module wrap labs =================
  T('rem-m1-wrap', 'Module 1 shift: first day as a remote admin', 'SSH + RDP + discovery',
    'Ticket: get access sorted on two servers. Your workstation runs PowerShell 7 with the OpenSSH client. Each task names its lesson.',
    { shell: 'ps', prompt: 'PS C:\\Users\\phil>' },
    [{ t: '<b>1.1</b> — Which remote ports does LNX-MON01 answer on? Test SSH.', accept: [/^test-netconnection( -computername)? lnx-mon01 -port 22$/i, /^tnc lnx-mon01 -port 22$/i], show: 'Test-NetConnection LNX-MON01 -Port 22', hint: '1.1 — Test-NetConnection', out: 'TcpTestSucceeded : True', why: 'SSH available.' },
     { t: '<b>1.2</b> — Generate an Ed25519 key on this Windows PC.', accept: [/^ssh-keygen -t ed25519( -c ["'][^"']*["'])?$/i], show: 'ssh-keygen -t ed25519', hint: '1.2 — ssh-keygen', out: 'Your identification has been saved in C:\\Users\\phil/.ssh/id_ed25519', why: 'Windows has OpenSSH built in.' },
     { t: '<b>1.2</b> — Windows has no ssh-copy-id. Append your public key to the server\'s authorized_keys over SSH (type the line from the hint).', accept: [/^get-content \$env:userprofile\\\.ssh\\id_ed25519\.pub \| ssh phil@lnx-mon01 ['"]mkdir -p ~\/\.ssh && cat >> ~\/\.ssh\/authorized_keys['"]$/i, /^type \$env:userprofile\\\.ssh\\id_ed25519\.pub \| ssh phil@lnx-mon01 ['"]mkdir -p ~\/\.ssh && cat >> ~\/\.ssh\/authorized_keys['"]$/i], show: "Get-Content $env:USERPROFILE\\.ssh\\id_ed25519.pub | ssh phil@lnx-mon01 'mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys'", hint: "Get-Content $env:USERPROFILE\\.ssh\\id_ed25519.pub | ssh phil@lnx-mon01 'mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys'", out: "phil@lnx-mon01's password:", why: 'Last password login; keys from now on.' },
     { t: '<b>1.3</b> — Check who has sessions on the Windows server WIN-MON02.', accept: [/^quser \/server:win-mon02$/i, /^query user \/server:win-mon02$/i], show: 'quser /server:WIN-MON02', hint: '1.3 — quser', out: ' USERNAME  SESSIONNAME  ID  STATE  IDLE TIME  LOGON TIME\n backup    rdp-tcp#2     1  Active      .  11/17/2026 6:00 AM', why: 'One active service-account session — do not reboot during it.' },
     { t: '<b>1.3</b> — Open an admin RDP session to WIN-MON02.', accept: [/^mstsc \/v:win-mon02 \/admin( \/f)?$/i, /^mstsc \/admin \/v:win-mon02( \/f)?$/i], show: 'mstsc /v:WIN-MON02 /admin', hint: '1.3 — mstsc', out: '(Remote Desktop Connection opens)', why: 'Module 1 skills in one shift.' }],
    'Discover → SSH keys (even from Windows) → RDP sessions.',
    ['Each task names its lesson.']);
  T('rem-m2-wrap', 'Module 2 shift: the remote-admin on-call', 'Remoting + support + troubleshooting + hardening',
    'On-call: three alerts. Admin PC with PowerShell 7 (domain). Each task names its lesson.',
    { shell: 'ps', prompt: 'PS C:\\Users\\phil>' },
    [{ t: '<b>2.1</b> — Check the WinRM service on WEB01, WEB02 and WEB03 at once.', accept: [/^invoke-command -computername web01,\s?web02,\s?web03 -scriptblock \{ ?get-service winrm ?\}$/i, /^icm web01,\s?web02,\s?web03 \{ ?get-service winrm ?\}$/i], show: 'Invoke-Command -ComputerName WEB01,WEB02,WEB03 -ScriptBlock { Get-Service WinRM }', hint: '2.1 — Invoke-Command', out: 'Status   Name   PSComputerName\n------   ----   --------------\nRunning  WinRM  WEB01\nRunning  WinRM  WEB03\n[WEB02] Connecting to remote server WEB02 failed: WinRM cannot complete the operation…', ask: { q: 'Which server failed?', accept: ['web02'], why: 'Next: is WEB02 up and is 5985 open?' }, why: 'Fan-out check.' },
     { t: '<b>2.3</b> — Test WEB02 on the WinRM port.', accept: [/^test-netconnection( -computername)? web02 -port 5985$/i, /^tnc web02 -port 5985$/i], show: 'Test-NetConnection WEB02 -Port 5985', hint: '2.3 — Test-NetConnection', out: 'PingSucceeded    : True\nTcpTestSucceeded : False', why: 'Host up, port closed → service or firewall on WEB02. Use the console/RDP to fix.' },
     { t: '<b>2.2</b> — A contractor finished on WEB01. Remove "ctr-jsmith" from its Remote Desktop Users remotely.', accept: [/^invoke-command -computername web01 -scriptblock \{ ?remove-localgroupmember -group ['"]remote desktop users['"] -member ['"]?ctr-jsmith['"]? ?\}$/i], show: 'Invoke-Command -ComputerName WEB01 -ScriptBlock { Remove-LocalGroupMember -Group "Remote Desktop Users" -Member "ctr-jsmith" }', hint: '2.2 — Invoke-Command … Remove-LocalGroupMember', out: '', why: 'Access revoked; record it in the change ticket.' },
     { t: '<b>2.4</b> — Confirm the Linux bastion only allows key logins (it is reachable as phil@bastion).', accept: [/^ssh phil@bastion ['"]sudo sshd -T \| grep -i passwordauthentication['"]$/i, /^ssh -t phil@bastion ['"]sudo sshd -T \| grep -i passwordauthentication['"]$/i], show: "ssh -t phil@bastion 'sudo sshd -T | grep -i passwordauthentication'", hint: "2.4 — ssh -t phil@bastion 'sudo sshd -T | grep -i passwordauthentication'", out: 'passwordauthentication no', why: 'Bastion hardened. On-call shift complete.' }],
    'Module 2: one-to-many remoting, the troubleshooting ladder, revocation and hardening checks.',
    ['Each task names its lesson.']);

  // ---------- extra questions + cards ----------
  RK.extra(TR, '1.1', [
    ['Which method gives a full graphical Windows desktop session?', 'RDP', ['SSH', 'WinRM', 'Telnet'], 'Remote Desktop.'],
    ['Which port does VNC use by default?', '5900', ['3389', '22', '5986'], 'RFB.'],
    ['Which WinRM port uses HTTPS?', '5986', ['5985', '443', '3389'], 'WS-Man HTTPS.'],
    ['Why should RDP never be port-forwarded from the Internet?', 'It is heavily attacked and a common ransomware entry point', ['It is too slow', 'It needs IPv6', 'It cannot use NLA'], 'Exposure.'],
    ['What is an RMM tool?', 'An agent-based platform to monitor, patch and control many PCs', ['A VPN protocol', 'An SSH key type', 'A firewall rule'], 'Remote monitoring and management.'],
    ['A user is present and approves screen control. This is:', 'Attended support', ['Unattended support', 'A jump host', 'Port forwarding'], 'Consent.'],
    ['Which Linux command tests whether port 22 is open on a host?', 'nc -zv host 22', ['ls -l host 22', 'chmod 22 host', 'ssh-keygen host'], 'netcat.'],
    ['Which protocol replaced Telnet for remote command lines?', 'SSH', ['RDP', 'FTP', 'VNC'], 'Encrypted.'],
    ['Which is the lightest way to restart one service on a remote Windows server?', 'Invoke-Command with Restart-Service', ['Full RDP session', 'Driving to the site', 'VNC'], 'Lightest tool.'],
    ['What does a VPN give a remote admin?', 'An encrypted path into the internal network', ['Automatic RDP rights', 'A new password', 'A desktop session'], 'Network access.'],
    ['Which tool shows exactly what is on a kiosk\'s physical screen?', 'VNC', ['RDP (new session)', 'WinRM', 'scp'], 'Console.']
  ]);
  RK.extra(TR, '1.2', [
    ['What does ssh-keygen -R web01 do?', 'Removes web01\'s old host key from known_hosts', ['Generates a key for web01', 'Restarts sshd', 'Revokes your key'], 'After a rebuild.'],
    ['Which file on the server lists public keys allowed to log in?', '~/.ssh/authorized_keys', ['~/.ssh/known_hosts', '/etc/ssh/ssh_config', '~/.ssh/id_ed25519'], 'Server side.'],
    ['Which option copies a folder with scp?', '-r', ['-p', '-L', '-N'], 'Recursive.'],
    ['Which key type is the modern default choice?', 'Ed25519', ['DSA', 'RSA-1024', 'MD5'], 'Fast, secure.'],
    ['What does ssh -N do?', 'Opens the connection without running a remote shell (tunnels only)', ['Disables encryption', 'Uses a new key', 'Skips host key checks'], 'No command.'],
    ['Why use -t with ssh host \'sudo …\'?', 'sudo needs a terminal for the password prompt', ['It sets the port', 'It encrypts the session', 'It makes a tunnel'], 'TTY.'],
    ['What protects a private key if the laptop is stolen?', 'A passphrase on the key', ['The .pub file', 'known_hosts', 'Port 22'], 'Encrypted key.'],
    ['What should ~/.ssh permissions be?', '700', ['777', '644', '600'], 'Owner only.'],
    ['Which command shows logged-in users on a Linux server?', 'w', ['ls', 'pwd', 'df'], 'Who and what.'],
    ['What tool syncs only changed files over SSH?', 'rsync', ['scp only', 'ping', 'telnet'], 'Delta copy.']
  ]);
  RK.extra(TR, '1.3', [
    ["Which port must be reachable for RDP?", "TCP 3389", ["TCP 22", "TCP 5985", "UDP 53"], "RDP port."],
    ["Which tool replaces RDP exposure to the Internet for outside admins?", "RD Gateway or VPN with MFA", ["Port forwarding 3389", "Telnet", "Disabling NLA"], "Safe access."],
    ['Which mstsc switch opens a full-screen session?', '/f', ['/v', '/admin', '/w'], 'Full screen.'],
    ['Which registry value must be 0 to allow RDP?', 'fDenyTSConnections', ['UserAuthentication', 'EnableLUA', 'LmCompatibilityLevel'], 'Deny = 0 means allowed.'],
    ['How many simultaneous RDP users does Windows 11 Pro allow?', 'One', ['Two', 'Ten', 'Unlimited'], 'Client limit.'],
    ['Which command logs off session 4 on TS01?', 'logoff 4 /server:TS01', ['quser 4 TS01', 'mstsc /logoff:4', 'shutdown /l 4'], 'Logoff.'],
    ['Which firewall rule group must be enabled for RDP?', '"Remote Desktop"', ['"File and Printer Sharing"', '"Windows Remote Management"', '"Core Networking"'], 'RDP rules.'],
    ['How do you enable RDP on 200 PCs consistently?', 'Group Policy (RDP setting + firewall rule)', ['Visit each PC', 'Email users instructions', 'Change DNS'], 'GPO.'],
    ['Which Windows edition cannot host incoming RDP?', 'Home', ['Pro', 'Enterprise', 'Server'], 'Home is client-only.'],
    ['What does the mstsc /admin switch do?', 'Connects to an administrative session that does not use a user licence slot', ['Runs as domain admin', 'Disables NLA', 'Enables full screen'], 'Admin session.'],
    ['A user\'s apps are still running on the server after they "closed" RDP. Why?', 'Their session is disconnected, not logged off', ['The server crashed', 'NLA is off', 'The firewall is open'], 'Disconnected.'],
    ['What should you do before logging off someone else\'s disconnected session?', 'Check with the user or owner — unsaved work will be lost', ['Nothing', 'Reboot the server', 'Disable their account'], 'Courtesy and safety.']
  ]);
  RK.extra(TR, '2.1', [
    ["Which command tests a WinRM endpoint?", "Test-WSMan", ["Test-Connection", "mstsc", "nc"], "WS-Man test."],
    ["Which cmdlet turns on remoting on a Windows 11 PC?", "Enable-PSRemoting", ["Enable-RDP", "Start-WSMan", "Set-ExecutionPolicy"], "Setup."],
    ['Which group grants WinRM access without full admin rights?', 'Remote Management Users', ['Remote Desktop Users', 'Backup Operators', 'Guests'], 'WinRM access.'],
    ['Which variable syntax passes a local variable into a remote script block?', '$using:name', ['$remote:name', '$global:name', '$env:name'], 'Using scope.'],
    ['What property shows which server each Invoke-Command result came from?', 'PSComputerName', ['MachineName only', 'HostName', 'Source'], 'Tagged results.'],
    ['What is the "double hop" problem?', 'A remote session cannot reuse your credentials to reach a third machine by default', ['Two firewalls in a row', 'Two NICs on a server', 'Two RDP sessions'], 'Delegation.'],
    ['Why is setting TrustedHosts to "*" dangerous?', 'It trusts every host without identity checks', ['It disables WinRM', 'It opens RDP', 'It deletes sessions'], 'No verification.'],
    ['Is remoting traffic on 5985 encrypted in a domain?', 'Yes — Kerberos encrypts the session', ['No, never', 'Only with RDP', 'Only on Linux'], 'Kerberos.'],
    ['Which command removes a persistent session $s?', 'Remove-PSSession $s', ['Exit-PSSession $s', 'Stop-Service $s', 'Clear-Host'], 'Cleanup.'],
    ['Which parameter runs a local .ps1 on remote computers?', '-FilePath', ['-Path', '-Script', '-Local'], 'Invoke-Command -FilePath.'],
    ['Is PowerShell remoting enabled by default on Windows Server?', 'Yes', ['No', 'Only on Core', 'Only with RDP'], 'Server default.'],
    ['What do remote command results come back as?', 'Deserialized objects with properties but no methods', ['Plain text only', 'Live objects', 'Binary files'], 'Serialization.']
  ]);
  RK.extra(TR, '2.2', [
    ["Which event ID records a successful logon?", "4624", ["4625", "4740", "7045"], "Success."],
    ["When a user leaves the call before you finish, what do you do?", "End the session and arrange a follow-up", ["Keep working unattended without approval", "Leave the tool connected", "Close the ticket"], "Consent ends with presence."],
    ['A caller claims to be an executive and is in a hurry. What do you do?', 'Verify identity using the normal process', ['Skip verification for executives', 'Give them a temporary password immediately', 'Hang up'], 'Same process for everyone.'],
    ['Which Windows event ID records a failed logon?', '4625', ['4624', '4720', '1102'], 'Failed logon.'],
    ['Which logon type is a network logon (file share, WinRM)?', '3', ['10', '2', '7'], 'Network.'],
    ['What should happen to a vendor account the day the work ends?', 'Remove access and disable it', ['Keep it enabled', 'Share it with IT', 'Rename it'], 'Revoke.'],
    ['What is LAPS used for?', 'Unique, rotated local admin passwords per PC', ['VPN encryption', 'SSH keys', 'RDP licensing'], 'Local admin passwords.'],
    ['During a session you need to look at the user\'s email. What first?', 'Ask permission', ['Open it quietly', 'Forward it to yourself', 'Skip asking'], 'Privacy.'],
    ['Why use only the approved remote tool?', 'It is secured, logged and known to users', ['It is free', 'It is faster', 'It skips consent'], 'Control.'],
    ['What is just-in-time access?', 'Privileges granted for an approved, limited time', ['Access granted forever', 'A VPN type', 'A backup schedule'], 'Time-bound.'],
    ['What must you record at the end of a support session?', 'What was found, changed and any follow-up in the ticket', ['Nothing', 'Only the time', 'The user\'s password'], 'Documentation.'],
    ['A "Microsoft" caller asks a user to install a remote tool. What is it?', 'A tech-support scam', ['Normal support', 'A patch', 'An audit'], 'Social engineering.']
  ]);
  RK.extra(TR, '2.3', [
    ["What is the first rung of the troubleshooting ladder?", "Is the host reachable and resolving?", ["Reset the password", "Reinstall the OS", "Check licensing"], "Bottom up."],
    ["WinRM fails for one of three servers. Next test?", "Test-NetConnection server -Port 5985", ["ssh -v server", "mstsc /admin", "logoff"], "Port."],
    ['What does "Connection refused" usually mean?', 'The host answered but nothing is listening on that port (or a firewall rejected)', ['The host is off', 'Wrong password', 'DNS failed'], 'Listener.'],
    ['What does a connection timeout usually mean?', 'Nothing answered — filtered or down', ['Wrong key', 'Service running', 'Account locked'], 'Filtered.'],
    ['Which Windows service provides RDP?', 'TermService (Remote Desktop Services)', ['WinRM', 'Spooler', 'BITS'], 'RDP service.'],
    ['"An authentication error has occurred (CredSSP)" usually points to:', 'An NLA/credential or patch mismatch', ['A firewall block', 'DNS', 'Licensing'], 'Authentication rung.'],
    ['Ping fails but Test-NetConnection 3389 succeeds. Conclusion?', 'ICMP is blocked but RDP is reachable', ['The server is down', 'DNS is broken', 'RDP is disabled'], 'Do not rely on ping.'],
    ['Which command checks sshd is running on Ubuntu?', 'systemctl status ssh', ['ps -rdp', 'Get-Service sshd', 'ipconfig'], 'Service.'],
    ['Which ssh client message means the server rejected all offered keys?', 'Permission denied (publickey)', ['Connection timed out', 'Host key changed', 'No route to host'], 'Auth.'],
    ['Kerberos remoting fails with time errors. What do you check?', 'Clock skew between client and server', ['Port 3389', 'Key permissions', 'DNS TTL'], 'Time.'],
    ['Which UFW command shows whether port 22 is allowed?', 'ufw status', ['ufw open', 'ss -z', 'chmod 22'], 'Firewall.'],
    ['When RDP is broken, what other channel can you use to inspect the server?', 'PowerShell remoting or the console', ['Telnet to 3389', 'Email', 'VNC to the DNS server'], 'Working channel.']
  ]);
  RK.extra(TR, '2.4', [
    ["Which edit should always be tested with sshd -t first?", "Any change to sshd_config", ["known_hosts", "authorized_keys order", "~/.bashrc"], "Avoid lockout."],
    ["What does AllowGroups in sshd_config do?", "Limits SSH logins to members of the listed groups", ["Opens the firewall", "Disables keys", "Creates groups"], "Who may log in."],
    ['What is a bastion host?', 'A hardened, monitored server used as the single entry point to internal systems', ['A backup server', 'A DNS server', 'A web cache'], 'Jump host.'],
    ['Which ~/.ssh/config keyword sets a jump host?', 'ProxyJump', ['HostName', 'IdentityFile', 'LocalForward'], 'Jump.'],
    ['Which sshd_config setting blocks direct root login?', 'PermitRootLogin no', ['PasswordAuthentication no', 'AllowUsers root', 'Port 22'], 'Root.'],
    ['How do you see the effective sshd settings?', 'sshd -T', ['sshd -t', 'ssh -v', 'cat known_hosts'], 'Effective config.'],
    ['Why keep your SSH session open after reloading a hardened config?', 'So you can fix it if new logins fail', ['To speed it up', 'To save keys', 'It is required by sshd'], 'Safety net.'],
    ['Which tool blocks IPs after repeated failed SSH logins?', 'fail2ban', ['nc', 'scp', 'w'], 'Brute-force protection.'],
    ['Is moving SSH to port 2222 a strong security control?', 'No — it reduces noise but keys, no root and firewall scoping are the real controls', ['Yes, it stops all attacks', 'Yes, it enables MFA', 'Yes, it encrypts more'], 'Obscurity.'],
    ['What should internal servers allow SSH/RDP from when a bastion exists?', 'Only the bastion/admin subnet', ['Anywhere', 'Only the Internet', 'Guest Wi-Fi'], 'Scope.'],
    ['Which control most directly defeats stolen passwords on a VPN?', 'MFA', ['A longer SSH port', 'VNC', 'Port forwarding'], 'Second factor.'],
    ['What does an RD Gateway do?', 'Carries RDP inside HTTPS through one MFA-protected entry point', ['Replaces NLA', 'Disables RDP', 'Shares screens'], 'Gateway.']
  ]);
  RK.cards(TR, '1.1', [['RDP 3389', 'Windows desktop session.'], ['SSH 22', 'Encrypted shell, files, tunnels.'], ['WinRM 5985/5986', 'PowerShell remoting HTTP/HTTPS.'], ['VNC 5900', 'Shares the console screen.'], ['RMM', 'Agent-based monitoring, patching, control.']]);
  RK.cards(TR, '1.2', [['known_hosts', 'Client: servers you trust.'], ['authorized_keys', 'Server: keys that may log in.'], ['ssh -p vs scp -P', 'Port options differ in case.'], ['ssh -L', 'Local port forward (tunnel).'], ['~/.ssh/config', 'Host aliases, users, keys, jumps.']]);
  RK.cards(TR, '1.3', [['mstsc /v: /admin /f', 'Connect, admin session, full screen.'], ['quser / logoff', 'List and end sessions.'], ['Remote Desktop Users', 'Local group for RDP sign-in.'], ['NLA', 'Authenticate before session is built.']]);
  RK.cards(TR, '2.1', [['Enable-PSRemoting', 'Turn on WinRM listener + firewall.'], ['Enter-PSSession', 'Interactive, one host.'], ['Invoke-Command', 'Script on many hosts.'], ['TrustedHosts', 'Workgroup trust list — keep narrow.']]);
  RK.cards(TR, '2.2', [['Support order', 'Verify → consent → tool → fix → verify → end → document.'], ['4624 type 10', 'RDP logon.'], ['Revoke', 'Groups, disable, rotate, record.'], ['Never', 'Ask for a user\'s password.']]);
  RK.cards(TR, '2.3', [['Ladder', 'Reach → port → service → firewall → authz → authn.'], ['Refused vs timeout', 'No listener vs filtered/down.'], ['ssh -v', 'Client-side auth details.'], ['journalctl -u ssh', 'Server-side reason.']]);
  RK.cards(TR, '2.4', [['Bastion', 'Single hardened entry point.'], ['ssh -J', 'Jump through a bastion.'], ['sshd hardening', 'No root, no passwords, AllowUsers.'], ['sshd -t / -T', 'Test syntax / show effective config.']]);
})();
