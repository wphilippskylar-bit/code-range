/* Code Range — Windows track rebuilt: Module 1 Command Prompt (1.1–1.3), Module 2 PowerShell (2.1–2.3). Replaces old stages win1, win2. */
(function () {
  var RK = window.RK, P = RK.P, M = RK.M, O = RK.O, T = RK.T, TR = 'win';
  function pro(t) { return '<div class="callout pro"><b class="k">On the job</b>' + t + '</div>'; }
  function trap(t) { return '<div class="callout trap"><b class="k">Exam trap</b>' + t + '</div>'; }

  // ================= 1.1 Files and navigation =================
  T('win-nav', 'Find your way around', 'cd, dir, paths and wildcards',
    'Ticket: a user saved a report "somewhere in Documents" and needs a list of every PDF in their profile. Command Prompt.',
    { shell: 'cmd', prompt: 'C:\\Users\\jlee>' },
    [{ t: 'Show which folder you are in (print the current directory).', accept: [/^cd$/i, /^chdir$/i, /^echo %cd%$/i], show: 'cd', hint: 'cd on its own prints the current path', out: 'C:\\Users\\jlee', why: 'cd alone = pwd in Linux.' },
     { t: 'Move into the Documents folder.', accept: [/^cd documents\\?$/i, /^cd \.\\documents\\?$/i, /^cd c:\\users\\jlee\\documents\\?$/i], show: 'cd Documents', hint: 'cd <folder>', out: '', prompt: 'C:\\Users\\jlee\\Documents>', why: 'Paths are case-insensitive in Windows.' },
     { t: 'List the folder, including hidden files.', accept: [/^dir \/a$/i, /^dir \/a:h$/i, /^dir \/ah$/i], show: 'dir /a', hint: 'dir /a shows all attributes, including hidden', out: ' Directory of C:\\Users\\jlee\\Documents\n11/17/2026  09:02 AM    <DIR>          Reports\n11/12/2026  02:10 PM    <DIR>          Scans\n11/02/2026  08:15 AM           402,113 budget.xlsx\n10/30/2026  11:40 AM    <DIR>          desktop.ini (hidden)', why: 'dir = ls; /a = ls -a.' },
     { t: 'Go back up one level to C:\\Users\\jlee.', accept: [/^cd \.\.\\?$/i], show: 'cd ..', hint: 'cd ..', out: '', prompt: 'C:\\Users\\jlee>', why: '.. = parent folder.' },
     { t: 'Find every .pdf file under the profile, in all subfolders, showing just the paths.', accept: [/^dir \/s \/b \*\.pdf$/i, /^dir \/b \/s \*\.pdf$/i], show: 'dir /s /b *.pdf', hint: 'dir /s (subfolders) /b (bare) *.pdf', out: 'C:\\Users\\jlee\\Documents\\Reports\\Q3-summary.pdf\nC:\\Users\\jlee\\Downloads\\invoice-2291.pdf\nC:\\Users\\jlee\\OneDrive\\Contracts\\vendor-acme.pdf', ask: { q: 'Which folder is the Q3 report in? (folder name)', accept: ['reports'], why: 'Wildcards: * = any characters, ? = one character. /s recurses, /b prints bare paths.' }, why: 'Search with wildcards.' }],
    'cd, cd .., dir /a, dir /s /b *.ext — the navigation kit.',
    ['cd, dir /a, cd .., dir /s /b *.pdf.']);
  T('win-files', 'Organise a project folder', 'md, copy, move, ren, del, rd, type',
    'Ticket: tidy C:\\Work for a handover: make an Archive folder, archive old logs, rename a file, check a text file and clean up. Command Prompt.',
    { shell: 'cmd', prompt: 'C:\\Work>' },
    [{ t: 'Create a folder called Archive.', accept: [/^(md|mkdir) archive$/i], show: 'md Archive', hint: 'md <name>', out: '', why: 'md = mkdir.' },
     { t: 'Move every .log file into Archive.', accept: [/^move \*\.log archive\\?$/i], show: 'move *.log Archive', hint: 'move <pattern> <destination>', out: 'C:\\Work\\app-2026-10.log\nC:\\Work\\app-2026-11.log\n        2 file(s) moved.', why: 'move = mv.' },
     { t: 'Make a backup copy of notes.txt called notes.bak.', accept: [/^copy notes\.txt notes\.bak$/i], show: 'copy notes.txt notes.bak', hint: 'copy <source> <destination>', out: '        1 file(s) copied.', why: 'copy = cp. For folders use robocopy (1.3) or xcopy.' },
     { t: 'Rename draft.docx to handover.docx.', accept: [/^(ren|rename) draft\.docx handover\.docx$/i], show: 'ren draft.docx handover.docx', hint: 'ren <old> <new>', out: '', why: 'ren takes the new name only, not a path.' },
     { t: 'Print notes.txt to the screen.', accept: [/^type notes\.txt$/i], show: 'type notes.txt', hint: 'type <file>', out: 'Server: APP03\nService account: svc_app (password in vault)\nRestart order: DB, API, Web', why: 'type = cat.' },
     { t: 'Delete the empty Temp folder.', accept: [/^(rd|rmdir) temp$/i], show: 'rd Temp', hint: 'rd <folder> (add /s /q for a folder with contents — carefully)', out: '', why: 'rd only removes empty folders unless /s; del removes files. There is no Recycle Bin from the command line.' }],
    'Files: md, copy, move, ren, del, type. Folders: rd (rd /s /q deletes everything inside — no undo).',
    ['md, move, copy, ren, type, rd.']);
  M('win-cmd-map', 'CMD ↔ Linux', 'Combined 1.1',
    'Pick the CMD command that matches each Linux command or task.', ['cd (alone)', 'dir', 'type', 'copy', 'move', 'del', 'md', 'rd', 'cls', 'findstr', 'where'],
    [['pwd', 'cd (alone)', 'Print current directory.'], ['ls', 'dir', 'List.'], ['cat', 'type', 'Print a file.'], ['cp', 'copy', 'Copy.'], ['mv', 'move', 'Move/rename across folders.'], ['rm', 'del', 'Delete files.'], ['mkdir', 'md', 'Make a folder.'], ['rmdir', 'rd', 'Remove a folder.'], ['clear', 'cls', 'Clear screen.'], ['grep', 'findstr', 'Search text.'], ['which', 'where', 'Locate a program.']],
    'Knowing both sets makes you useful on any server.');

  RK.add({ track: TR, id: '1.1', dom: 1, short: 'Files & navigation', title: 'Navigate and manage files from the Command Prompt',
    goal: 'Move around with cd, list with dir, search with wildcards, and copy, move, rename, view and delete files and folders.',
    kw: /\b(cmd\.exe|command prompt|\bcd\b|\bdir\b|\btype\b|\bcopy\b|\bmove\b|\bdel\b|\bren\b|\bmd\b|\brd\b|mkdir|rmdir|wildcard|cls|backslash|drive letter)/,
    parts: [
      P('Paths and navigation', 'Navigate drives and folders, list contents and search with wildcards.',
        `<ul><li>Open <b>cmd.exe</b>. The prompt shows the current path: <code>C:\\Users\\jlee&gt;</code>.</li>
<li>Windows paths use <b>backslashes</b> and <b>drive letters</b> and are <b>case-insensitive</b>. Quote paths with spaces: <code>cd "Program Files"</code>.</li>
<li><code>cd</code> alone prints the current folder; <code>cd folder</code>, <code>cd ..</code> (up), <code>cd \\</code> (root of drive); switch drives by typing <code>D:</code>.</li>
<li><code>dir</code> lists; <code>/a</code> all (hidden too), <code>/s</code> include subfolders, <code>/b</code> bare paths, <code>/o:d</code> sort by date.</li>
<li><b>Wildcards</b>: <code>*</code> any characters, <code>?</code> one character: <code>dir /s /b *.pdf</code>, <code>dir report??.xlsx</code>.</li>
<li><code>%USERPROFILE%</code>, <code>%TEMP%</code>, <code>%PATH%</code> — environment variables use percent signs; <code>set</code> lists them.</li></ul>` + pro('dir /s /b with a wildcard is the fastest way to find a user\'s lost file over a remote session — faster than the File Explorer search.') + trap('cd alone prints the current directory in Windows; in Linux cd alone goes to your home folder.'),
        [['Which command lists hidden files too?', 'dir /a', ['dir /b', 'dir /s', 'cd /a'], 'All attributes.'],
         ['How do you reference the PATH variable in CMD?', '%PATH%', ['$PATH', '$env:PATH', '{PATH}'], 'Percent signs.']],
        'win-nav'),
      P('Working with files and folders', 'Create, copy, move, rename, view and delete files and folders.',
        `<table><tr><th>CMD</th><th>Does</th><th>Linux</th></tr>
<tr><td><code>md</code> / <code>mkdir</code></td><td>Make a folder</td><td>mkdir</td></tr>
<tr><td><code>copy a b</code></td><td>Copy files</td><td>cp</td></tr>
<tr><td><code>move a dest</code></td><td>Move (or rename)</td><td>mv</td></tr>
<tr><td><code>ren old new</code></td><td>Rename in place</td><td>mv</td></tr>
<tr><td><code>del file</code></td><td>Delete files (<code>/q</code> quiet)</td><td>rm</td></tr>
<tr><td><code>rd</code> / <code>rmdir</code></td><td>Remove a folder (<code>/s /q</code> = with contents)</td><td>rmdir / rm -r</td></tr>
<tr><td><code>type file</code></td><td>Show a text file</td><td>cat</td></tr>
<tr><td><code>cls</code></td><td>Clear the screen</td><td>clear</td></tr></table>
<p>Get help on any command with <code>/?</code>: <code>copy /?</code>.</p>` + pro('Before any del or rd /s with a wildcard, run the same pattern with dir first and read the list. There is no Recycle Bin on the command line.') + trap('rd without /s fails on a folder that still has files in it — "The directory is not empty".'),
        [['Which command renames a file in place?', 'ren', ['move', 'copy', 'type'], 'Rename.'],
         ['How do you see the options for any CMD command?', 'command /?', ['man command', 'command --help only', 'Get-Help command'], 'Built-in help.']],
        'win-files')
    ],
    wrap: { recap: ['Backslashes, drive letters, case-insensitive; quote paths with spaces.', 'cd (print/move), cd .., cd \\, D: to switch drives.', 'dir /a /s /b /o:d; wildcards * and ?.', 'md, copy, move, ren, del, rd (/s /q), type, cls.', 'Environment variables: %USERPROFILE%, %PATH%; set lists them.', 'command /? for help; dir before del.'], lab: 'win-cmd-map' }
  });

  // ================= 1.2 Network and system =================
  T('win-netcmd', 'A PC with "no Internet"', 'ipconfig, ping, tracert, nslookup, netstat',
    'Ticket: a user can open intranet pages but not external websites. Command Prompt on their PC.',
    { shell: 'cmd', prompt: 'C:\\Users\\mreyes>' },
    [{ t: 'Show the full IP configuration.', accept: [/^ipconfig \/all$/i], show: 'ipconfig /all', hint: 'ipconfig /all', out: '   IPv4 Address. . . . . . . . . . . : 10.1.20.44\n   Default Gateway . . . . . . . . . : 10.1.20.1\n   DNS Servers . . . . . . . . . . . : 10.1.1.5', why: 'Address, gateway and DNS look right.' },
     { t: 'Test the gateway.', accept: [/^ping 10\.1\.20\.1( -n \d+)?$/i], show: 'ping 10.1.20.1', hint: 'ping <gateway>', out: 'Reply from 10.1.20.1: bytes=32 time<1ms TTL=255', why: 'Local network OK.' },
     { t: 'Resolve www.example.com using the configured DNS server.', accept: [/^nslookup www\.example\.com$/i], show: 'nslookup www.example.com', hint: 'nslookup <name>', out: 'Server:  dns01.corp.local\nAddress:  10.1.1.5\n\nNon-authoritative answer:\nName:    www.example.com\nAddress:  93.184.215.14', why: 'DNS works too.' },
     { t: 'Trace the route to 93.184.215.14 without resolving names.', accept: [/^tracert -d 93\.184\.215\.14$/i], show: 'tracert -d 93.184.215.14', hint: 'tracert -d <ip>', out: '  1    <1 ms    <1 ms    <1 ms  10.1.20.1\n  2     1 ms     1 ms     1 ms  10.1.0.1\n  3     *        *        *     Request timed out.\n  4     *        *        *     Request timed out.', ask: { q: 'After which hop does traffic stop? (hop number)', accept: ['2'], why: 'It dies after the core router (10.1.0.1) — the firewall/ISP edge. Not this PC. Escalate to the network team with this trace.' }, why: 'Find where the path breaks.' },
     { t: 'Show active connections with the owning process IDs, to rule out a rogue proxy on this PC.', accept: [/^netstat -ano$/i, /^netstat -an -o$/i], show: 'netstat -ano', hint: 'netstat -ano', out: '  Proto  Local Address      Foreign Address     State        PID\n  TCP    10.1.20.44:52114   10.1.1.5:53         TIME_WAIT    0\n  TCP    10.1.20.44:52201   10.1.30.8:443       ESTABLISHED  4412', why: 'Nothing unusual. Use tasklist /fi "PID eq 4412" to name a process.' }],
    'Bottom-up: ipconfig → ping gateway → nslookup → tracert → netstat. Hand the network team evidence, not "it\'s broken".',
    ['ipconfig /all, ping, nslookup, tracert -d, netstat -ano.']);
  T('win-sys', 'Kill a frozen app and check the PC', 'tasklist, taskkill, systeminfo, shutdown',
    'Ticket: an accounting app is frozen, and the user wants to know their Windows version and last boot time before a scheduled restart. Command Prompt.',
    { shell: 'cmd', prompt: 'C:\\Users\\mreyes>' },
    [{ t: 'List running tasks filtered to the image name acctapp.exe.', accept: [/^tasklist \/fi ["']imagename eq acctapp\.exe["']$/i], show: 'tasklist /fi "imagename eq acctapp.exe"', hint: 'tasklist /fi "imagename eq <name>"', out: 'Image Name       PID Session Name   Session#    Mem Usage\nacctapp.exe     7720 Console           1     1,204,332 K', ask: { q: 'What is its PID?', accept: ['7720'], why: 'PID identifies the exact process.' }, why: 'tasklist = ps.' },
     { t: 'Force-end that process by PID.', accept: [/^taskkill \/pid 7720 \/f$/i, /^taskkill \/f \/pid 7720$/i], show: 'taskkill /PID 7720 /F', hint: 'taskkill /PID <n> /F', out: 'SUCCESS: The process with PID 7720 has been terminated.', why: '/F forces; /IM acctapp.exe would kill every instance by name. /T also kills child processes.' },
     { t: 'Show the OS name, version and last boot time (filter systeminfo output for "OS Name", "OS Version" and "Boot Time").', accept: [/^systeminfo \| findstr \/c:["']os name["'] \/c:["']os version["'] \/c:["']boot time["']$/i, /^systeminfo \| findstr \/i ["']os boot["']$/i], show: 'systeminfo | findstr /C:"OS Name" /C:"OS Version" /C:"Boot Time"', hint: 'systeminfo | findstr /C:"OS Name" /C:"OS Version" /C:"Boot Time"', out: 'OS Name:                   Microsoft Windows 11 Pro\nOS Version:                10.0.26100 N/A Build 26100\nSystem Boot Time:          11/3/2026, 7:58:12 AM', ask: { q: 'How many days since the last boot, if today is 11/17/2026? (number)', accept: ['14'], why: 'Two weeks without a restart — pending updates need a reboot.' }, why: 'Pipes (|) and findstr filter long output.' },
     { t: 'Schedule a restart in 10 minutes (600 seconds) with a message to the user.', accept: [/^shutdown \/r \/t 600( \/c ["'][^"']*["'])?$/i, /^shutdown \/r \/c ["'][^"']*["'] \/t 600$/i], show: 'shutdown /r /t 600 /c "Restarting for updates in 10 minutes - save your work"', hint: 'shutdown /r /t <seconds> /c "message"', out: '(Windows shows the restart warning to the user)', why: '/r restart, /s shut down, /t delay, /a aborts a pending shutdown.' }],
    'tasklist/taskkill to manage processes, systeminfo for facts, shutdown with a warning for restarts.',
    ['tasklist /fi, taskkill /PID /F, systeminfo | findstr, shutdown /r /t /c.']);
  M('win-net-wrap', 'Which command?', 'Combined 1.2',
    'Pick the command.', ['ipconfig /all', 'ipconfig /flushdns', 'ipconfig /release + /renew', 'ping', 'tracert', 'nslookup', 'netstat -ano', 'tasklist', 'taskkill', 'systeminfo', 'shutdown /a'],
    [['See DNS servers and the MAC address', 'ipconfig /all', 'Full config.'], ['A site moved servers but the PC keeps using the old IP', 'ipconfig /flushdns', 'Clear DNS cache.'], ['Get a new DHCP address', 'ipconfig /release + /renew', 'DHCP.'], ['Is the gateway alive?', 'ping', 'ICMP echo.'], ['Where along the path does traffic stop?', 'tracert', 'Hops.'], ['What IP does a name resolve to?', 'nslookup', 'DNS query.'], ['Which process owns a connection to port 443?', 'netstat -ano', 'PIDs.'], ['What is running and how much memory each uses?', 'tasklist', 'Processes.'], ['End a hung program', 'taskkill', 'Kill.'], ['OS version, install date, hotfixes, boot time', 'systeminfo', 'Facts.'], ['Cancel a restart you scheduled by mistake', 'shutdown /a', 'Abort.']],
    'Network: ipconfig/ping/tracert/nslookup/netstat. System: tasklist/taskkill/systeminfo/shutdown.');

  RK.add({ track: TR, id: '1.2', dom: 1, short: 'Network & system commands', title: 'Troubleshoot networking and processes from the Command Prompt',
    goal: 'Use ipconfig, ping, tracert, nslookup and netstat, and manage processes and restarts with tasklist, taskkill, systeminfo and shutdown.',
    kw: /\b(ipconfig|ping|tracert|nslookup|netstat|tasklist|taskkill|systeminfo|shutdown|flushdns|release|renew)/,
    parts: [
      P('Network commands', 'Troubleshoot connectivity with ipconfig, ping, tracert, nslookup and netstat.',
        `<ul><li><code>ipconfig</code> — address, mask, gateway; <code>/all</code> adds DNS, DHCP server, MAC, lease; <code>/release</code> + <code>/renew</code> refresh DHCP; <code>/flushdns</code> clears the DNS cache.</li>
<li><code>ping host</code> — reachability and latency (<code>-n 10</code> count, <code>-t</code> continuous, <code>-4</code> force IPv4). Many hosts block ping, so a failure is not proof.</li>
<li><code>tracert host</code> — the hop-by-hop path (<code>-d</code> skips name lookups — faster). <code>pathping</code> adds loss per hop.</li>
<li><code>nslookup name [server]</code> — DNS answers; ask a specific server to compare.</li>
<li><code>netstat -ano</code> — connections and listening ports with PIDs; <code>-b</code> (admin) shows program names.</li></ul>
<p>Order: link → ipconfig → ping gateway → ping an Internet IP → nslookup → tracert.</p>` + pro('Paste the tracert output into the ticket when you escalate. "Traffic stops after hop 2 (10.1.0.1)" gets fixed far faster than "the Internet is down".') + trap('A failed ping does not always mean the host is down — firewalls often drop ICMP. Test the actual port too.'),
        [['Which command clears the local DNS cache?', 'ipconfig /flushdns', ['ipconfig /renew', 'nslookup /clear', 'netstat -r'], 'DNS cache.'],
         ['Which command shows listening ports with process IDs?', 'netstat -ano', ['tracert -d', 'ipconfig /all', 'tasklist /svc'], 'PIDs.']],
        'win-netcmd'),
      P('Processes, system facts and restarts', 'Manage processes with tasklist and taskkill, read systeminfo, filter output and schedule restarts.',
        `<ul><li><code>tasklist</code> — running processes (= <code>ps</code>). Filter: <code>/fi "imagename eq x.exe"</code>; <code>/svc</code> shows services inside each process.</li>
<li><code>taskkill /PID n /F</code> or <code>/IM name.exe /F</code> — end processes; <code>/T</code> includes child processes.</li>
<li><code>systeminfo</code> — OS version and build, install date, boot time, RAM, hotfixes, domain.</li>
<li><b>Pipes and filters</b> — <code>|</code> sends output to the next command; <code>findstr</code> filters lines (<code>/i</code> ignore case, <code>/c:"phrase"</code> exact phrase); <code>more</code> pages output; <code>&gt;</code> writes to a file, <code>&gt;&gt;</code> appends.</li>
<li><code>shutdown /r</code> restart, <code>/s</code> shut down, <code>/t 600</code> delay, <code>/c "msg"</code> warning, <code>/a</code> abort, <code>/m \\\\pc</code> remote PC.</li></ul>` + pro('Always give users a warning and a delay (shutdown /r /t 600 /c "…"). An instant remote restart that loses someone\'s unsaved work is a ticket you will hear about.') + trap('taskkill /IM chrome.exe ends every Chrome process; use /PID to end only one.'),
        [['Which switch makes taskkill force-end a process?', '/F', ['/T', '/A', '/S'], 'Force.'],
         ['How do you cancel a pending shutdown?', 'shutdown /a', ['shutdown /c', 'taskkill /shutdown', 'shutdown /x'], 'Abort.']],
        'win-sys')
    ],
    wrap: { recap: ['ipconfig (/all, /release, /renew, /flushdns).', 'ping (-n, -t), tracert (-d), pathping, nslookup name [server].', 'netstat -ano: connections, listening ports, PIDs.', 'tasklist (/fi, /svc) and taskkill (/PID or /IM, /F, /T).', 'systeminfo for OS, boot time, hotfixes; | findstr to filter; > and >> to save.', 'shutdown /r /t /c to restart with warning; /a to abort.'], lab: 'win-net-wrap' }
  });

  // ================= 1.3 Admin commands =================
  T('win-admin', 'Admin chores from CMD', 'net user/localgroup, net use, sfc, chkdsk, robocopy, gpupdate, gpresult',
    'Ticket batch on a user\'s PC: add a temp admin for a vendor install, map the team share, repair system files, copy a project folder to the server, and refresh policy. Elevated Command Prompt.',
    { shell: 'cmd', prompt: 'C:\\Windows\\system32>' },
    [{ t: 'Create a local user "vendortmp" and be prompted for its password.', accept: [/^net user vendortmp \* \/add$/i], show: 'net user vendortmp * /add', hint: 'net user <name> * /add (the * prompts for the password)', out: 'Type a password for the user:\nRetype the password to confirm:\nThe command completed successfully.', why: 'The * avoids typing the password on the command line, where it could be logged.' },
     { t: 'Add vendortmp to the local Administrators group.', accept: [/^net localgroup administrators vendortmp \/add$/i], show: 'net localgroup administrators vendortmp /add', hint: 'net localgroup <group> <user> /add', out: 'The command completed successfully.', why: 'Remove it when the install is done (/delete).' },
     { t: 'Map drive S: to \\\\fs01\\team, persistent across reboots.', accept: [/^net use s: \\\\fs01\\team \/persistent:yes$/i], show: 'net use S: \\\\fs01\\team /persistent:yes', hint: 'net use <letter>: \\\\server\\share /persistent:yes', out: 'The command completed successfully.', why: 'net use alone lists mapped drives; net use S: /delete removes one.' },
     { t: 'Scan and repair protected system files.', accept: [/^sfc \/scannow$/i], show: 'sfc /scannow', hint: 'sfc /scannow', out: 'Windows Resource Protection found corrupt files and successfully repaired them.', why: 'If sfc cannot repair, run DISM /Online /Cleanup-Image /RestoreHealth first.' },
     { t: 'Mirror C:\\Projects\\Atlas to \\\\fs01\\projects\\Atlas, retrying only twice, with a log file C:\\Temp\\atlas.log.', accept: [/^robocopy c:\\projects\\atlas \\\\fs01\\projects\\atlas \/mir \/r:2 \/w:\d+ \/log:c:\\temp\\atlas\.log$/i, /^robocopy c:\\projects\\atlas \\\\fs01\\projects\\atlas \/mir \/r:2 \/log:c:\\temp\\atlas\.log$/i, /^robocopy c:\\projects\\atlas \\\\fs01\\projects\\atlas \/mir \/log:c:\\temp\\atlas\.log \/r:2( \/w:\d+)?$/i], show: 'robocopy C:\\Projects\\Atlas \\\\fs01\\projects\\Atlas /MIR /R:2 /W:5 /LOG:C:\\Temp\\atlas.log', hint: 'robocopy <src> <dst> /MIR /R:2 /W:5 /LOG:<file>', out: '(log written) Files : 1,284 Copied : 1,284 Failed : 0', ask: { q: 'What does /MIR do to files in the destination that are not in the source?', accept: ['deletes them', 'delete', 'deletes', 'removes them', 'removed'], why: '/MIR mirrors — it deletes extras at the destination. Double-check source and destination before running it.' }, why: 'robocopy: restartable, logged, multi-threaded copies.' },
     { t: 'Refresh Group Policy now.', accept: [/^gpupdate \/force$/i], show: 'gpupdate /force', hint: 'gpupdate /force', out: 'Computer Policy update has completed successfully.\nUser Policy update has completed successfully.', why: 'Applies new GPOs without waiting ~90 minutes.' },
     { t: 'Show which GPOs applied to this computer and user (summary).', accept: [/^gpresult \/r$/i], show: 'gpresult /r', hint: 'gpresult /r', out: 'COMPUTER SETTINGS\n    Applied Group Policy Objects\n        Workstation Baseline\n        BitLocker Policy\nUSER SETTINGS\n    Applied Group Policy Objects\n        Drive Maps - Sales', why: 'gpresult /h report.html gives a full HTML report.' }],
    'Local accounts (net user/localgroup), shares (net use), repair (sfc/chkdsk), copies (robocopy), policy (gpupdate/gpresult).',
    ['net user * /add, net localgroup, net use /persistent, sfc, robocopy /MIR, gpupdate, gpresult /r.']);
  T('win-redir', 'Save and search command output', 'Redirection, findstr, chkdsk',
    'Ticket: collect evidence for a slow disk and log errors on a PC. Elevated Command Prompt in C:\\Temp.',
    { shell: 'cmd', prompt: 'C:\\Temp>' },
    [{ t: 'Run a read-only check of drive C: and save the output to chk.txt.', accept: [/^chkdsk c: > chk\.txt$/i, /^chkdsk c:>chk\.txt$/i], show: 'chkdsk C: > chk.txt', hint: 'command > file', out: '', why: '> creates/overwrites a file. chkdsk without /f only reports (safe on a running system).' },
     { t: 'Search chk.txt for the word "bad", ignoring case.', accept: [/^findstr \/i bad chk\.txt$/i, /^findstr \/i "bad" chk\.txt$/i], show: 'findstr /i "bad" chk.txt', hint: 'findstr /i "<text>" <file>', out: '  0 KB in bad sectors.', why: 'No bad sectors: the disk surface is fine.' },
     { t: 'Append today\'s systeminfo hotfix section to the same file: run systeminfo and append everything to chk.txt.', accept: [/^systeminfo >> chk\.txt$/i, /^systeminfo>>chk\.txt$/i], show: 'systeminfo >> chk.txt', hint: 'command >> file appends', out: '', why: '>> appends; > would have overwritten the chkdsk output.' },
     { t: 'Count the lines in chk.txt that contain "KB" (hotfix lines).', accept: [/^findstr \/c:"kb" chk\.txt \| find \/c \/v ""$/i, /^find \/c "kb" chk\.txt$/i, /^find \/c "KB" chk\.txt$/], show: 'find /c "KB" chk.txt', hint: 'find /c "<text>" <file> counts matching lines', out: '---------- CHK.TXT: 37', ask: { q: 'How many lines matched?', accept: ['37'], why: 'find /c counts matches. Redirection + findstr/find turn long output into evidence you can attach to a ticket.' }, why: 'Count with find /c.' }],
    '> overwrite, >> append, 2> errors, | pipe; findstr/find to search and count.',
    ['>, >>, findstr /i, find /c.']);
  M('win-admin-wrap', 'Admin command desk', 'Combined 1.3',
    'Pick the command.', ['net user', 'net localgroup', 'net use', 'sfc /scannow', 'chkdsk /f', 'robocopy', 'gpupdate /force', 'gpresult /r', 'findstr', '>>'],
    [['Reset a local account password', 'net user', 'Local users.'], ['Add a user to local Administrators', 'net localgroup', 'Local groups.'], ['Map a network drive', 'net use', 'Shares.'], ['Repair corrupt Windows system files', 'sfc /scannow', 'System files.'], ['Fix file-system errors on D: (needs exclusive access)', 'chkdsk /f', 'File system.'], ['Copy 200 GB of folders with retries and a log', 'robocopy', 'Robust copy.'], ['A new GPO should apply now', 'gpupdate /force', 'Refresh.'], ['Which GPOs applied to this user?', 'gpresult /r', 'Result.'], ['Find "error" lines in a log', 'findstr', 'Search.'], ['Add output to the end of an existing file', '>>', 'Append.']],
    'The CMD admin kit still runs on every Windows machine — including recovery consoles.');

  RK.add({ track: TR, id: '1.3', dom: 1, short: 'Admin commands', title: 'Administer a Windows PC from the Command Prompt',
    goal: 'Manage local users, groups and drive maps; repair with sfc and chkdsk; copy with robocopy; apply and check Group Policy; redirect and search output.',
    kw: /\b(net user|net localgroup|net use|sfc|chkdsk|robocopy|xcopy|gpupdate|gpresult|findstr|redirect|>>|\bfind\b)/,
    parts: [
      P('Users, shares, repair and policy', 'Use net user, net localgroup, net use, sfc, chkdsk, robocopy, gpupdate and gpresult.',
        `<ul><li><code>net user</code> — list local users; <code>net user name * /add</code> create (prompt for password); <code>net user name /active:no</code> disable; <code>net user name /domain</code> show a domain account.</li>
<li><code>net localgroup Administrators name /add</code> (or <code>/delete</code>).</li>
<li><code>net use S: \\\\server\\share /persistent:yes</code> map a drive; <code>net use</code> list; <code>net use S: /delete</code>.</li>
<li><code>sfc /scannow</code> repair system files (DISM first if it cannot). <code>chkdsk C:</code> report; <code>/f</code> fix (reboot for the system drive); <code>/r</code> also scan bad sectors.</li>
<li><code>robocopy src dst /E</code> (subfolders) or <code>/MIR</code> (mirror — deletes extras), <code>/R:2 /W:5</code> retries, <code>/MT:16</code> threads, <code>/LOG:file</code>.</li>
<li><code>gpupdate /force</code> apply Group Policy now; <code>gpresult /r</code> (summary) or <code>/h file.html</code> (report).</li></ul>` + pro('robocopy\'s default is 1 million retries at 30-second waits. Always set /R:2 /W:5, or a single locked file can hang a migration for days.') + trap('robocopy /MIR deletes files in the destination that are not in the source. Swap the paths by mistake and you mirror an empty folder over your data.'),
        [['Which command maps a network drive?', 'net use', ['net user', 'net share', 'robocopy'], 'Drive mapping.'],
         ['What does gpresult /r show?', 'Which Group Policy Objects applied', ['Disk errors', 'Mapped drives', 'Open ports'], 'Policy result.']],
        'win-admin'),
      P('Redirection and filtering', 'Save, append and search command output with >, >>, |, findstr and find.',
        `<ul><li><code>command &gt; file</code> — write output to a file (overwrites).</li>
<li><code>command &gt;&gt; file</code> — append.</li>
<li><code>command 2&gt; err.txt</code> — errors only; <code>&gt; all.txt 2&gt;&amp;1</code> — output and errors together.</li>
<li><code>a | b</code> — pipe: <code>ipconfig /all | findstr /i dns</code>.</li>
<li><code>findstr</code> — search text: <code>/i</code> ignore case, <code>/s</code> subfolders, <code>/n</code> line numbers, <code>/c:"exact phrase"</code>, <code>/r</code> regex.</li>
<li><code>find /c "text" file</code> — count matching lines; <code>more</code> — page long output; <code>clip</code> — copy output to the clipboard (<code>ipconfig /all | clip</code>).</li></ul>` + pro('ipconfig /all | clip, then paste into the ticket. It is the fastest way to give the network team exact details without typos.') + trap('A single > overwrites the file every time. Use >> when you are collecting output from several commands into one file.'),
        [['Which operator appends output to an existing file?', '>>', ['>', '|', '2>'], 'Append.'],
         ['Which command copies output to the clipboard?', 'clip', ['copy', 'more', 'type'], 'Clipboard.']],
        'win-redir')
    ],
    wrap: { recap: ['net user (create/disable), net localgroup (add/delete members), net use (map /persistent).', 'sfc /scannow (DISM first if needed); chkdsk report, /f fix, /r bad sectors.', 'robocopy /E or /MIR (deletes extras!), /R:2 /W:5, /MT, /LOG.', 'gpupdate /force; gpresult /r or /h.', '> overwrite, >> append, 2> errors, 2>&1 both, | pipe.', 'findstr /i /c: /s /n; find /c to count; | clip to copy.'], lab: 'win-admin-wrap' }
  });

  // ================= 2.1 Cmdlets and help =================
  T('win-help', 'Teach yourself any cmdlet', 'Get-Command, Get-Help, aliases',
    'Ticket: you need to work with Windows services from PowerShell but do not remember the cmdlets. Find them yourself. PowerShell.',
    { shell: 'ps', prompt: 'PS C:\\Users\\tech>' },
    [{ t: 'Find all commands whose noun is Service.', accept: [/^get-command -noun service$/i, /^gcm -noun service$/i, /^get-command \*-service$/i], show: 'Get-Command -Noun Service', hint: 'Get-Command -Noun <noun>', out: 'CommandType  Name             Source\n-----------  ----             ------\nCmdlet       Get-Service      Microsoft.PowerShell.Management\nCmdlet       New-Service      Microsoft.PowerShell.Management\nCmdlet       Restart-Service  Microsoft.PowerShell.Management\nCmdlet       Set-Service      Microsoft.PowerShell.Management\nCmdlet       Start-Service    Microsoft.PowerShell.Management\nCmdlet       Stop-Service     Microsoft.PowerShell.Management', why: 'Verb-Noun naming makes cmdlets discoverable.' },
     { t: 'Show examples for Restart-Service.', accept: [/^get-help restart-service -examples$/i, /^help restart-service -examples$/i], show: 'Get-Help Restart-Service -Examples', hint: 'Get-Help <cmdlet> -Examples', out: 'Example 1: Restart a local Windows service\n    Restart-Service -Name winmgmt\nExample 2: Exclude a service\n    Restart-Service -DisplayName "net*" -Exclude "net logon"', why: '-Examples is the fastest way to learn a cmdlet. Run Update-Help (as admin) once to download full help.' },
     { t: 'Find what the alias "gsv" stands for.', accept: [/^get-alias gsv$/i, /^gal gsv$/i, /^get-alias -name gsv$/i], show: 'Get-Alias gsv', hint: 'Get-Alias <alias>', out: 'CommandType  Name               \n-----------  ----               \nAlias        gsv -> Get-Service', why: 'Aliases (ls, dir, cd, gsv) are handy at the prompt; write full names in scripts.' },
     { t: 'List the approved PowerShell verbs that start with "Re".', accept: [/^get-verb re\*$/i, /^get-verb -verb re\*$/i], show: 'Get-Verb Re*', hint: 'Get-Verb Re*', out: 'Verb     Group\n----     -----\nRedo     Common\nRemove   Common\nRename   Common\nReset    Common\nResize   Common\nRestart  Lifecycle\nRestore  Data\nResume   Lifecycle', why: 'Use approved verbs in your own functions so others can guess their names.' }],
    'Get-Command (find), Get-Help -Examples (learn), Get-Alias (decode), Get-Verb (name things right).',
    ['Get-Command -Noun, Get-Help -Examples, Get-Alias, Get-Verb.']);
  T('win-params', 'Parameters, tab completion and safety switches', 'Named parameters, -WhatIf, -Confirm',
    'Ticket: stop a misbehaving print spooler, but check what a risky command would do before it runs. Elevated PowerShell.',
    { shell: 'ps', prompt: 'PS C:\\Windows\\system32>' },
    [{ t: 'Get the Spooler service using the -Name parameter.', accept: [/^get-service -name spooler$/i], show: 'Get-Service -Name Spooler', hint: 'Get-Service -Name <name>', out: 'Status   Name     DisplayName\n------   ----     -----------\nRunning  Spooler  Print Spooler', why: 'Named parameters make commands readable.' },
     { t: 'Preview stopping every service whose name starts with "Spool" — without actually stopping it.', accept: [/^stop-service -name spool\* -whatif$/i, /^stop-service spool\* -whatif$/i], show: 'Stop-Service -Name Spool* -WhatIf', hint: 'Add -WhatIf', out: 'What if: Performing the operation "Stop-Service" on target "Print Spooler (Spooler)".', why: '-WhatIf shows exactly what would happen. Use it before anything with a wildcard.' },
     { t: 'Now stop it for real, but ask for confirmation.', accept: [/^stop-service -name spooler -confirm$/i, /^stop-service spooler -confirm$/i], show: 'Stop-Service -Name Spooler -Confirm', hint: 'Add -Confirm', out: 'Are you sure you want to perform this action?\nPerforming the operation "Stop-Service" on target "Print Spooler (Spooler)".\n[Y] Yes  [N] No: Y', why: '-Confirm prompts before each change.' },
     { t: 'Start it again.', accept: [/^start-service( -name)? spooler$/i], show: 'Start-Service -Name Spooler', hint: 'Start-Service', out: '', why: 'Verb-Noun pairs are predictable: Stop/Start/Restart-Service.' }],
    'Named parameters for clarity, wildcards with care, -WhatIf to preview, -Confirm to ask.',
    ['-Name, -WhatIf, -Confirm.']);
  M('win-ps-wrap', 'PowerShell basics', 'Combined 2.1',
    'Pick the command or concept.', ['Get-Command', 'Get-Help -Examples', 'Get-Alias', 'Update-Help', '-WhatIf', '-Confirm', 'Verb-Noun', 'Tab completion'],
    [['Find every cmdlet that works with processes', 'Get-Command', 'Discover.'], ['See usage examples for Get-ChildItem', 'Get-Help -Examples', 'Learn.'], ['What does "ls" run in PowerShell?', 'Get-Alias', 'ls → Get-ChildItem.'], ['Help shows only syntax because full help is missing', 'Update-Help', 'Download help.'], ['Preview a Remove-Item with a wildcard', '-WhatIf', 'Dry run.'], ['Be asked before each deletion', '-Confirm', 'Prompt.'], ['Naming pattern like Get-Service, Stop-Process', 'Verb-Noun', 'Discoverable.'], ['Type Get-Serv and press a key to finish the name and parameters', 'Tab completion', 'Tab.']],
    'You do not memorize PowerShell; you discover it.');

  RK.add({ track: TR, id: '2.1', dom: 2, short: 'Cmdlets & help', title: 'Discover and safely run PowerShell cmdlets',
    goal: 'Use Verb-Noun cmdlets, Get-Command, Get-Help, aliases and approved verbs, parameters, tab completion, -WhatIf and -Confirm.',
    kw: /\b(cmdlet|verb-noun|get-command|get-help|get-alias|get-verb|update-help|alias|whatif|-confirm|parameter|tab complet)/,
    parts: [
      P('Cmdlets and discovery', 'Find and learn cmdlets with Get-Command, Get-Help, Get-Alias and Get-Verb.',
        `<ul><li><b>Cmdlets</b> are named <b>Verb-Noun</b>: <code>Get-Service</code>, <code>Stop-Process</code>, <code>New-Item</code>. Names and parameters are case-insensitive.</li>
<li><code>Get-Command -Noun Service</code> or <code>Get-Command *dns*</code> — find commands.</li>
<li><code>Get-Help Name -Examples</code> (or <code>-Full</code>, <code>-Online</code>); <code>help</code> pages the output. Run <code>Update-Help</code> as admin once.</li>
<li><code>Get-Alias</code> — aliases: <code>ls</code>/<code>dir</code>/<code>gci</code> = Get-ChildItem, <code>cd</code> = Set-Location, <code>cat</code>/<code>type</code> = Get-Content, <code>gsv</code> = Get-Service.</li>
<li><code>Get-Verb</code> — the approved verbs (Get, Set, New, Remove, Start, Stop…).</li>
<li>Windows PowerShell 5.1 is built in; PowerShell 7 (<code>pwsh</code>) is the modern cross-platform version — install it alongside.</li></ul>` + pro('Learn the six common verbs (Get, Set, New, Remove, Start, Stop) and Get-Command will find the rest. That is how experienced admins work with modules they have never used.') + trap('Aliases like ls and dir run Get-ChildItem in PowerShell — they are not the Linux or CMD programs, and they take PowerShell parameters.'),
        [['Which cmdlet finds commands by noun?', 'Get-Command -Noun', ['Get-Help -Noun', 'Find-Command', 'Get-Alias -Noun'], 'Discovery.'],
         ['What does "ls" run in PowerShell?', 'Get-ChildItem', ['ls.exe', 'dir.exe', 'Get-Content'], 'Alias.']],
        'win-help'),
      P('Parameters and safety', 'Use named and positional parameters, wildcards, tab completion, -WhatIf and -Confirm.',
        `<ul><li><b>Parameters</b> start with a dash: <code>Get-Service -Name Spooler</code>. Some are <b>positional</b> (<code>Get-Service Spooler</code>). <b>Switch</b> parameters are on/off: <code>-Force</code>, <code>-Recurse</code>.</li>
<li><b>Tab completion</b> finishes cmdlet names, parameters and paths; <b>Ctrl+Space</b> lists choices.</li>
<li>Wildcards: <code>Get-Service *print*</code>.</li>
<li><b>-WhatIf</b> — describes what would happen without doing it. <b>-Confirm</b> — asks before each change.</li>
<li><b>Execution policy</b> controls whether scripts run (<code>Get-ExecutionPolicy</code>; RemoteSigned is common). It is a safety feature, not a security boundary.</li>
<li>Variables start with <code>$</code>: <code>$name = 'Spooler'</code>; environment variables are <code>$env:PATH</code>.</li></ul>` + pro('Make -WhatIf a reflex before any command with a wildcard or a pipeline into Remove-, Stop- or Set-. It costs two seconds and saves outages.') + trap('$env:PATH is PowerShell; %PATH% is CMD; $PATH is Linux.'),
        [['Which switch previews a change without making it?', '-WhatIf', ['-Confirm', '-Force', '-Verbose'], 'Dry run.'],
         ['How do you read the PATH variable in PowerShell?', '$env:PATH', ['%PATH%', '$PATH', 'env.PATH'], 'Env provider.']],
        'win-params')
    ],
    wrap: { recap: ['Verb-Noun cmdlets; case-insensitive.', 'Get-Command (-Noun, wildcards), Get-Help -Examples, Update-Help.', 'Aliases (ls, dir, cd, cat, gsv) map to cmdlets.', 'Named, positional and switch parameters; tab completion.', '-WhatIf to preview, -Confirm to ask, before risky commands.', '$variables, $env:PATH; execution policy is a safety feature.'], lab: 'win-ps-wrap' }
  });

  // ================= 2.2 Objects and the pipeline =================
  T('win-pipe', 'Answer questions with the pipeline', 'Where-Object, Sort-Object, Select-Object, Get-Member, Export-Csv',
    'Ticket: the manager wants (1) which stopped services are set to start automatically, and (2) the top 5 memory users exported to a CSV. PowerShell.',
    { shell: 'ps', prompt: 'PS C:\\Users\\tech>' },
    [{ t: 'Discover the properties a service object has.', accept: [/^get-service \| get-member$/i, /^get-service \| gm$/i, /^gsv \| gm$/i], show: 'Get-Service | Get-Member', hint: 'Get-Service | Get-Member', out: '   TypeName: System.ServiceProcess.ServiceController\nName         MemberType  Definition\n----         ----------  ----------\nStart        Method      void Start()\nStop         Method      void Stop()\nName         Property    string Name\nStartType    Property    ServiceStartMode StartType\nStatus       Property    ServiceControllerStatus Status', why: 'Get-Member shows what you can filter and sort on.' },
     { t: 'List services that are Stopped but set to Automatic start.', accept: [/^get-service \| where-object \{ ?\$_\.status -eq ['"]stopped['"] -and \$_\.starttype -eq ['"]automatic['"] ?\}$/i, /^get-service \| where \{ ?\$_\.status -eq ['"]stopped['"] -and \$_\.starttype -eq ['"]automatic['"] ?\}$/i, /^get-service \| \? \{ ?\$_\.status -eq ['"]stopped['"] -and \$_\.starttype -eq ['"]automatic['"] ?\}$/i], show: "Get-Service | Where-Object { $_.Status -eq 'Stopped' -and $_.StartType -eq 'Automatic' }", hint: "Where-Object { $_.Status -eq 'Stopped' -and $_.StartType -eq 'Automatic' }", out: 'Status   Name               DisplayName\n------   ----               -----------\nStopped  BackupAgent        Backup Agent\nStopped  gupdate            Google Update Service\nStopped  sppsvc             Software Protection', ask: { q: 'Which business service should be running but is stopped?', accept: ['backupagent', 'backup agent'], why: 'Some automatic services (gupdate, sppsvc) stop by design after running. BackupAgent should be running — investigate.' }, why: '$_ is the current object; -eq, -ne, -gt, -like, -and, -or.' },
     { t: 'Get the 5 processes using the most memory (working set), showing only Name and WS.', accept: [/^get-process \| sort-object( -property)? ws -descending \| select-object( -property)? name,\s?ws -first 5$/i, /^get-process \| sort-object( -property)? ws -descending \| select-object -first 5( -property)? name,\s?ws$/i, /^gps \| sort ws -desc(ending)? \| select name,\s?ws -first 5$/i], show: 'Get-Process | Sort-Object WS -Descending | Select-Object Name,WS -First 5', hint: 'Get-Process | Sort-Object WS -Descending | Select-Object Name,WS -First 5', out: 'Name        WS\n----        --\nmsedge      912384000\nTeams       640221184\nOUTLOOK     402653184\nsqlservr    301989888\nexplorer    188743680', why: 'Sort, then select — always in that order.' },
     { t: 'Export that same list to C:\\Temp\\topmem.csv without the type header line.', accept: [/^get-process \| sort-object( -property)? ws -descending \| select-object( -property)? name,\s?ws -first 5 \| export-csv( -path)? c:\\temp\\topmem\.csv -notypeinformation$/i, /^get-process \| sort-object( -property)? ws -descending \| select-object -first 5( -property)? name,\s?ws \| export-csv( -path)? c:\\temp\\topmem\.csv -notypeinformation$/i], show: 'Get-Process | Sort-Object WS -Descending | Select-Object Name,WS -First 5 | Export-Csv C:\\Temp\\topmem.csv -NoTypeInformation', hint: '… | Export-Csv <path> -NoTypeInformation', out: '', why: 'Objects → CSV the manager opens in Excel. No text parsing needed.' }],
    'Get → Where-Object (filter) → Sort-Object → Select-Object (shape) → Export-Csv/Format-Table (output). Get-Member tells you the property names.',
    ['Get-Member, Where-Object { $_.Prop -eq … }, Sort-Object -Descending, Select-Object -First, Export-Csv -NoTypeInformation.']);
  T('win-objs', 'Calculated output and grouping', 'Measure-Object, Group-Object, calculated properties, Format-Table',
    'Ticket: report how much space log files use in C:\\Logs, by extension, in MB. PowerShell.',
    { shell: 'ps', prompt: 'PS C:\\Logs>' },
    [{ t: 'Total the size of all files under C:\\Logs (recursively).', accept: [/^get-childitem -recurse -file \| measure-object -property length -sum$/i, /^gci -recurse -file \| measure -property length -sum$/i, /^get-childitem -file -recurse \| measure-object -property length -sum$/i], show: 'Get-ChildItem -Recurse -File | Measure-Object -Property Length -Sum', hint: 'Get-ChildItem -Recurse -File | Measure-Object -Property Length -Sum', out: 'Count    : 1904\nSum      : 8912896000\nProperty : Length', ask: { q: 'About how many GB is that? (round to whole GB, using 1 GB = 1,073,741,824 bytes)', accept: ['8', '8gb'], why: '8,912,896,000 ÷ 1,073,741,824 ≈ 8.3 GB. In PowerShell: (… ).Sum / 1GB.' }, why: 'Measure-Object sums, counts, averages.' },
     { t: 'Group the files by extension and show the count per extension.', accept: [/^get-childitem -recurse -file \| group-object( -property)? extension( \| sort-object count -descending)?$/i, /^gci -recurse -file \| group( -property)? extension( \| sort count -desc(ending)?)?$/i, /^get-childitem -file -recurse \| group-object( -property)? extension( \| sort-object count -descending)?$/i], show: 'Get-ChildItem -Recurse -File | Group-Object Extension | Sort-Object Count -Descending', hint: '… | Group-Object Extension', out: 'Count Name   Group\n----- ----   -----\n 1520 .log   {app-001.log, …}\n  301 .gz    {app-2025-12.gz, …}\n   83 .txt   {readme.txt, …}', why: 'Group-Object buckets objects by a property.' },
     { t: 'List the 3 largest files with their size in MB using a calculated property named SizeMB.', accept: [/^get-childitem -recurse -file \| sort-object( -property)? length -descending \| select-object -first 3 name,\s?@\{ ?(n|name|l|label) ?= ?['"]sizemb['"] ?; ?(e|expression) ?= ?\{ ?\[math\]::round\(\$_\.length ?\/ ?1mb(,\s?\d)?\) ?\} ?\}$/i, /^get-childitem -recurse -file \| sort-object( -property)? length -descending \| select-object -first 3 name,\s?@\{ ?(n|name|l|label) ?= ?['"]sizemb['"] ?; ?(e|expression) ?= ?\{ ?\$_\.length ?\/ ?1mb ?\} ?\}$/i], show: "Get-ChildItem -Recurse -File | Sort-Object Length -Descending | Select-Object -First 3 Name,@{n='SizeMB';e={[math]::Round($_.Length/1MB,1)}}", hint: "… | Select-Object -First 3 Name,@{n='SizeMB';e={[math]::Round($_.Length/1MB,1)}}", out: 'Name              SizeMB\n----              ------\napp-2026-11.log    812.4\napp-2026-10.log    790.1\ndebug-trace.log    655.0', why: 'Calculated properties reshape output for humans and reports. Format-Table -AutoSize is for screen display only — never pipe Format-* into Export-Csv.' }],
    'Measure-Object (totals), Group-Object (buckets), calculated properties @{n=;e=}, 1KB/1MB/1GB constants.',
    ['Measure-Object -Sum, Group-Object, @{n=\'SizeMB\';e={…}}.']);
  M('win-pipe-wrap', 'Pipeline desk', 'Combined 2.2',
    'Pick the cmdlet.', ['Where-Object', 'Sort-Object', 'Select-Object', 'Get-Member', 'Measure-Object', 'Group-Object', 'Export-Csv', 'Format-Table', 'ForEach-Object'],
    [['Keep only running processes', 'Where-Object', 'Filter.'], ['Order by CPU, highest first', 'Sort-Object', 'Sort.'], ['Keep only Name and Id, first 10', 'Select-Object', 'Shape.'], ['What properties does this object have?', 'Get-Member', 'Discover.'], ['Total size of a folder', 'Measure-Object', 'Sum/count.'], ['Count files per extension', 'Group-Object', 'Buckets.'], ['Save results for Excel', 'Export-Csv', 'CSV.'], ['Pretty columns on screen', 'Format-Table', 'Display only.'], ['Run an action on each object (e.g. restart each service)', 'ForEach-Object', 'Loop.']],
    'PowerShell passes objects, so you filter on properties instead of parsing text.');

  RK.add({ track: TR, id: '2.2', dom: 2, short: 'Objects & the pipeline', title: 'Filter, sort, shape and export objects with the PowerShell pipeline',
    goal: 'Use Get-Member, Where-Object, Sort-Object, Select-Object, Measure-Object, Group-Object, calculated properties and Export-Csv.',
    kw: /\b(pipeline|object|where-object|sort-object|select-object|get-member|measure-object|group-object|export-csv|format-table|foreach-object|\$_)/,
    parts: [
      P('Filter, sort and shape', 'Discover properties with Get-Member and filter, sort, select and export objects.',
        `<p>PowerShell pipes <b>objects</b>, not text: each item has properties (Name, Status, CPU) and methods.</p>
<ul><li><code>Get-Member</code> (<code>gm</code>) — list an object\'s properties and methods.</li>
<li><code>Where-Object { $_.Status -eq 'Running' }</code> — filter; <code>$_</code> is the current object. Operators: <code>-eq -ne -gt -lt -like -match -and -or -not</code>. Short form: <code>Where-Object Status -eq Running</code>.</li>
<li><code>Sort-Object CPU -Descending</code> — sort.</li>
<li><code>Select-Object Name,Id -First 5</code> — choose properties and how many.</li>
<li><code>Export-Csv file.csv -NoTypeInformation</code>, <code>ConvertTo-Json</code>, <code>Out-File</code> — save.</li>
<li><code>ForEach-Object { … }</code> — act on each item.</li></ul>
<p><b>Filter left</b>: filter as early as possible (use a cmdlet\'s own <code>-Name</code>/<code>-Filter</code> when it has one) for speed.</p>` + pro('Hand managers CSVs from Export-Csv instead of screenshots. They can sort and chart it, and you can rerun the same line next month.') + trap('PowerShell comparison uses -eq and -gt, not = or >. A > in PowerShell redirects output to a file.'),
        [['Which variable is the current object in Where-Object?', '$_', ['$this', '$obj', '$input'], 'Pipeline variable.'],
         ['Which cmdlet shows the properties an object has?', 'Get-Member', ['Get-Help', 'Get-Command', 'Select-Object'], 'Discover.']],
        'win-pipe'),
      P('Measure, group and calculate', 'Total, group and reshape output with Measure-Object, Group-Object and calculated properties.',
        `<ul><li><code>Measure-Object -Property Length -Sum -Average -Maximum</code> — totals and counts.</li>
<li><code>Group-Object Extension</code> — buckets with a Count.</li>
<li><b>Calculated properties</b> — <code>Select-Object Name,@{n='SizeMB';e={[math]::Round($_.Length/1MB,1)}}</code>. <code>n</code>=name, <code>e</code>=expression.</li>
<li>Size constants: <code>1KB</code>, <code>1MB</code>, <code>1GB</code>, <code>1TB</code>.</li>
<li><code>Format-Table -AutoSize</code> / <code>Format-List *</code> — for the screen only, always last.</li>
<li>Get one value: <code>(Get-Process -Name explorer).Id</code>; expand a property: <code>Select-Object -ExpandProperty Name</code>.</li></ul>` + pro('Get-ChildItem -Recurse -File | Measure-Object Length -Sum answers "what is filling this disk?" in seconds on any server — no tools to install.') + trap('Never pipe Format-Table into Export-Csv — Format-* produces display objects, and the CSV comes out as garbage. Select-Object, then export.'),
        [['Which cmdlet totals the Length of files?', 'Measure-Object -Property Length -Sum', ['Group-Object Length', 'Sort-Object Length', 'Format-Table Length'], 'Sum.'],
         ['Where must Format-Table go in a pipeline?', 'At the end, for display only', ['At the start', 'Before Export-Csv', 'Inside Where-Object'], 'Display only.']],
        'win-objs')
    ],
    wrap: { recap: ['Objects, not text: Get-Member shows properties and methods.', 'Where-Object { $_.Prop -eq … } with -eq -ne -gt -like -match -and -or.', 'Sort-Object (-Descending), Select-Object (properties, -First), filter left.', 'Measure-Object (-Sum), Group-Object, calculated properties @{n=;e=}.', 'Export-Csv -NoTypeInformation / ConvertTo-Json / Out-File to save.', 'Format-* only at the end, never before an export.'], lab: 'win-pipe-wrap' }
  });

  // ================= 2.3 Managing a PC =================
  T('win-manage', 'Run a PC from PowerShell', 'Services, events, network, IP config',
    'Ticket: a kiosk PC lost its network after someone changed settings; its app service also keeps stopping. Elevated PowerShell on the kiosk.',
    { shell: 'ps', prompt: 'PS C:\\Windows\\system32>' },
    [{ t: 'Show the IPv4 configuration of the "Ethernet" adapter.', accept: [/^get-netipaddress -interfacealias ['"]?ethernet['"]? -addressfamily ipv4$/i, /^get-netipconfiguration( -interfacealias ['"]?ethernet['"]?)?$/i], show: 'Get-NetIPAddress -InterfaceAlias "Ethernet" -AddressFamily IPv4', hint: 'Get-NetIPAddress -InterfaceAlias "Ethernet" -AddressFamily IPv4', out: 'IPAddress         : 192.168.50.20\nPrefixLength      : 24\nPrefixOrigin      : Manual', why: 'Someone set a static address from the wrong subnet (the kiosk VLAN is 10.40.8.0/24, DHCP).' },
     { t: 'Switch the adapter back to DHCP.', accept: [/^set-netipinterface -interfacealias ['"]?ethernet['"]? -dhcp enabled$/i], show: 'Set-NetIPInterface -InterfaceAlias "Ethernet" -Dhcp Enabled', hint: 'Set-NetIPInterface -InterfaceAlias "Ethernet" -Dhcp Enabled', out: '', why: 'Then remove the stale static address/gateway (Remove-NetIPAddress / Remove-NetRoute) or restart the adapter.' },
     { t: 'Restart the adapter to pick up a DHCP lease.', accept: [/^restart-netadapter( -name)? ['"]?ethernet['"]?$/i], show: 'Restart-NetAdapter -Name "Ethernet"', hint: 'Restart-NetAdapter -Name …', out: '', why: 'Adapter cycles.' },
     { t: 'Test reaching the app server KIOSK-API on port 443.', accept: [/^test-netconnection( -computername)? kiosk-api -port 443$/i, /^tnc kiosk-api -port 443$/i], show: 'Test-NetConnection KIOSK-API -Port 443', hint: 'Test-NetConnection <host> -Port 443', out: 'SourceAddress    : 10.40.8.31\nTcpTestSucceeded : True', why: 'Back on the right subnet with DHCP — network fixed.' },
     { t: 'Now the service: show the last 5 System-log errors from the Service Control Manager.', accept: [/^get-winevent -filterhashtable @\{ ?logname ?= ?['"]?system['"]?; ?providername ?= ?['"]?service control manager['"]?; ?level ?= ?2 ?\} -maxevents 5$/i, /^get-winevent -filterhashtable @\{ ?logname ?= ?['"]?system['"]?; ?level ?= ?2; ?providername ?= ?['"]?service control manager['"]? ?\} -maxevents 5$/i], show: "Get-WinEvent -FilterHashtable @{LogName='System'; ProviderName='Service Control Manager'; Level=2} -MaxEvents 5", hint: "Get-WinEvent -FilterHashtable @{LogName='System'; ProviderName='Service Control Manager'; Level=2} -MaxEvents 5", out: 'TimeCreated            Id Message\n-----------            -- -------\n11/17/2026 9:14:02 AM 7034 The Kiosk App service terminated unexpectedly. It has done this 6 time(s).', why: 'Event 7034: the service crashes (not stopped by a person).' },
     { t: 'Set the KioskApp service to restart itself after failures (use sc.exe — failure actions are not in Set-Service).', accept: [/^sc(\.exe)? failure kioskapp reset= 86400 actions= restart\/60000\/restart\/60000\/restart\/60000$/i], show: 'sc.exe failure KioskApp reset= 86400 actions= restart/60000/restart/60000/restart/60000', hint: 'sc.exe failure <svc> reset= 86400 actions= restart/60000/restart/60000/restart/60000', out: '[SC] ChangeServiceConfig2 SUCCESS', why: 'Self-healing while you chase the root cause with the vendor. In PowerShell, call sc.exe (plain "sc" is the Set-Content alias).' }],
    'PowerShell admin kit: Get/Set-NetIPAddress, Set-NetIPInterface, Restart-NetAdapter, Test-NetConnection, Get-WinEvent -FilterHashtable, services (+ sc.exe for failure actions).',
    ['Get-NetIPAddress, Set-NetIPInterface -Dhcp, Restart-NetAdapter, Test-NetConnection, Get-WinEvent, sc.exe failure.']);
  T('win-script', 'Your first .ps1 script', 'Execution policy, parameters, a loop',
    'Ticket: write a reusable script that checks free space on a list of drives and warns under a threshold. PowerShell in C:\\Scripts.',
    { shell: 'ps', prompt: 'PS C:\\Scripts>' },
    [{ t: 'Check the current execution policy.', accept: [/^get-executionpolicy( -list)?$/i], show: 'Get-ExecutionPolicy -List', hint: 'Get-ExecutionPolicy -List', out: '        Scope ExecutionPolicy\n        ----- ---------------\nMachinePolicy       Undefined\n  CurrentUser       Undefined\n LocalMachine      Restricted', why: 'Restricted = no scripts run.' },
     { t: 'Allow your own local scripts for the current user (downloaded scripts must be signed).', accept: [/^set-executionpolicy remotesigned -scope currentuser( -force)?$/i, /^set-executionpolicy -executionpolicy remotesigned -scope currentuser( -force)?$/i], show: 'Set-ExecutionPolicy RemoteSigned -Scope CurrentUser', hint: 'Set-ExecutionPolicy RemoteSigned -Scope CurrentUser', out: '', why: 'RemoteSigned: local scripts run; files downloaded from the Internet need a signature (or Unblock-File).' },
     { t: 'The script check-disk.ps1 already exists (param($Min=10) and a foreach loop over Get-Volume). Run it with a 15% threshold.', accept: [/^\.\\check-disk\.ps1 -min 15$/i, /^\.\\check-disk\.ps1 15$/i], show: '.\\check-disk.ps1 -Min 15', hint: '.\\check-disk.ps1 -Min 15 (scripts need the .\\ prefix)', out: 'C: 41% free  OK\nD: 12% free  WARNING\nE: 63% free  OK', ask: { q: 'Which drive is below the threshold?', accept: ['d', 'd:'], why: 'Scripts turn a one-off check into a repeatable tool. Next: schedule it with Task Scheduler.' }, why: 'Run scripts with .\\ — PowerShell does not run from the current folder by default.' },
     { t: 'Show the script\'s code to review it (print the file).', accept: [/^get-content \.?\\?check-disk\.ps1$/i, /^(cat|type|gc) \.?\\?check-disk\.ps1$/i], show: 'Get-Content .\\check-disk.ps1', hint: 'Get-Content <file>', out: "param([int]$Min = 10)\nforeach ($v in Get-Volume | Where-Object DriveLetter) {\n  $pct = [math]::Round($v.SizeRemaining / $v.Size * 100)\n  if ($pct -lt $Min) { $s = 'WARNING' } else { $s = 'OK' }\n  \"$($v.DriveLetter): $pct% free  $s\"\n}", why: 'param() for inputs, foreach for loops, if/else for decisions, "$( )" for expressions inside strings.' }],
    'Scripts: execution policy (RemoteSigned for your user), param(), foreach, if/else, run with .\\script.ps1 -Param.',
    ['Get/Set-ExecutionPolicy, .\\script.ps1 -Param, Get-Content.']);
  M('win-m2-pick', 'PowerShell admin desk', 'Combined 2.3',
    'Pick the cmdlet or setting.', ['Get-Service / Restart-Service', 'Get-WinEvent -FilterHashtable', 'Test-NetConnection', 'Get-NetIPAddress', 'Set-NetIPInterface -Dhcp Enabled', 'RemoteSigned', 'param()', 'Get-CimInstance'],
    [['Restart the spooler', 'Get-Service / Restart-Service', 'Services.'], ['Last 20 critical System events', 'Get-WinEvent -FilterHashtable', 'Events.'], ['Is port 1433 on SQL01 reachable?', 'Test-NetConnection', 'Ports.'], ['What IP does each adapter have?', 'Get-NetIPAddress', 'IP config.'], ['Return an adapter to DHCP', 'Set-NetIPInterface -Dhcp Enabled', 'DHCP.'], ['Let your own scripts run but require signatures on downloaded ones', 'RemoteSigned', 'Execution policy.'], ['Let a script accept a threshold value', 'param()', 'Inputs.'], ['Get the BIOS serial number', 'Get-CimInstance', 'WMI/CIM classes.']],
    'Services, events, network, scripts and CIM — the daily PowerShell admin set.');

  RK.add({ track: TR, id: '2.3', dom: 2, short: 'Managing a PC', title: 'Manage a Windows PC with PowerShell and your first scripts',
    goal: 'Manage services, event logs, IP settings and connectivity with PowerShell, and write and run simple .ps1 scripts safely.',
    kw: /\b(get-service|restart-service|get-winevent|test-netconnection|get-netipaddress|set-netipinterface|execution ?policy|\.ps1|script|param\(|foreach|get-ciminstance)/,
    parts: [
      P('Services, events and networking', 'Manage services, read event logs, and inspect and change network settings with PowerShell.',
        `<ul><li><b>Services</b>: <code>Get-Service</code>, <code>Start/Stop/Restart-Service</code>, <code>Set-Service -StartupType Automatic</code>. Recovery actions: <code>sc.exe failure</code>.</li>
<li><b>Events</b>: <code>Get-WinEvent -FilterHashtable @{LogName='System'; Level=2; StartTime=(Get-Date).AddDays(-1)}</code> (Level 1 critical, 2 error, 3 warning). Faster than <code>Get-EventLog</code> and works on all logs.</li>
<li><b>Network</b>: <code>Get-NetIPAddress</code>, <code>Get-NetIPConfiguration</code>, <code>New-NetIPAddress</code> (static), <code>Set-NetIPInterface -Dhcp Enabled</code>, <code>Set-DnsClientServerAddress</code>, <code>Restart-NetAdapter</code>, <code>Test-NetConnection host -Port n</code>, <code>Resolve-DnsName</code>.</li>
<li><b>Hardware/OS facts</b>: <code>Get-CimInstance Win32_BIOS / Win32_OperatingSystem / Win32_ComputerSystem</code>, <code>Get-ComputerInfo</code>.</li></ul>` + pro('Test-NetConnection -Port and Resolve-DnsName replace telnet and nslookup in modern troubleshooting, and they return objects you can script against.') + trap('In PowerShell, "sc" is an alias for Set-Content. Call sc.exe explicitly for the service control tool.'),
        [['Which cmdlet tests a TCP port on a remote host?', 'Test-NetConnection -Port', ['Get-NetIPAddress', 'Resolve-DnsName', 'Get-Service'], 'Port test.'],
         ['What Level value in Get-WinEvent is "Error"?', '2', ['1', '3', '4'], '1 critical, 2 error, 3 warning.']],
        'win-manage'),
      P('Your first scripts', 'Write and run .ps1 scripts with parameters, loops and decisions under the right execution policy.',
        `<ul><li>A script is a <code>.ps1</code> text file. Run it with <code>.\\name.ps1</code> (the <code>.\\</code> is required).</li>
<li><b>Execution policy</b>: Restricted (default on clients — no scripts), <b>RemoteSigned</b> (local scripts run; downloaded ones need a signature), AllSigned, Bypass. Set per user: <code>Set-ExecutionPolicy RemoteSigned -Scope CurrentUser</code>.</li>
<li><b>Building blocks</b>: <code>param([int]$Min = 10)</code> inputs; variables <code>$x</code>; <code>foreach ($i in $list) { }</code>; <code>if ($a -lt $b) { } else { }</code>; strings with <code>"$($v.Name) is $pct%"</code>; comments with <code>#</code>.</li>
<li>Errors: <code>try { } catch { }</code>, <code>-ErrorAction Stop</code>.</li>
<li>Schedule with Task Scheduler (<code>Register-ScheduledTask</code>) and log output with <code>Start-Transcript</code> or <code>Out-File</code>.</li></ul>` + pro('Write scripts in VS Code with the PowerShell extension and keep them in Git. Your scripts folder becomes your personal toolkit — and a portfolio for interviews.') + trap('Execution policy is not a security boundary — it stops accidental runs, not attackers. Signing and least privilege are the real controls.'),
        [['How do you run check.ps1 in the current folder?', '.\\check.ps1', ['check.ps1', 'run check.ps1', 'start check'], 'Path prefix required.'],
         ['Which execution policy runs local scripts but requires signatures on downloaded ones?', 'RemoteSigned', ['Restricted', 'AllSigned', 'Undefined'], 'Common choice.']],
        'win-script')
    ],
    wrap: { recap: ['Services: Get/Start/Stop/Restart/Set-Service; sc.exe failure for recovery.', 'Events: Get-WinEvent -FilterHashtable (LogName, Level, ProviderName, StartTime).', 'Network: Get-NetIPAddress, Set-NetIPInterface -Dhcp, Restart-NetAdapter, Test-NetConnection, Resolve-DnsName.', 'Facts: Get-CimInstance Win32_* / Get-ComputerInfo.', 'Scripts: .ps1, run with .\\, RemoteSigned for your user, param/foreach/if, try/catch.', 'Schedule and log scripts; keep them in Git.'], lab: 'win-m2-pick' }
  });

  // ================= Module wraps =================
  T('win-m1-wrap', 'Module 1 shift: CMD only', 'Command Prompt in one ticket',
    'A PC in a recovery-style environment where only CMD is available. Each task names its lesson.',
    { shell: 'cmd', prompt: 'C:\\Windows\\system32>' },
    [{ t: '<b>1.2</b> — Show the IP configuration including DNS servers.', accept: [/^ipconfig \/all$/i], show: 'ipconfig /all', hint: '1.2 — ipconfig', out: '   IPv4 Address. . . : 10.1.20.61\n   DNS Servers . . . : 10.1.1.5', why: 'Network OK.' },
     { t: '<b>1.3</b> — Map Z: to \\\\fs01\\it-tools (not persistent).', accept: [/^net use z: \\\\fs01\\it-tools( \/persistent:no)?$/i], show: 'net use Z: \\\\fs01\\it-tools', hint: '1.3 — net use', out: 'The command completed successfully.', why: 'Tools share mapped.' },
     { t: '<b>1.1</b> — List the .cmd files on Z: (bare format).', accept: [/^dir \/b z:\\\*\.cmd$/i, /^dir z:\\\*\.cmd \/b$/i], show: 'dir /b Z:\\*.cmd', hint: '1.1 — dir with a wildcard', out: 'collect-logs.cmd\nfix-print.cmd', why: 'Found the tools.' },
     { t: '<b>1.3</b> — Run Z:\\collect-logs.cmd and save its output to C:\\Temp\\logs.txt.', accept: [/^z:\\collect-logs\.cmd > c:\\temp\\logs\.txt$/i, /^call z:\\collect-logs\.cmd > c:\\temp\\logs\.txt$/i], show: 'Z:\\collect-logs.cmd > C:\\Temp\\logs.txt', hint: '1.3 — redirect with >', out: '', why: 'Evidence saved.' },
     { t: '<b>1.3</b> — Search the log for "error", ignoring case, with line numbers.', accept: [/^findstr \/i \/n "?error"? c:\\temp\\logs\.txt$/i, /^findstr \/n \/i "?error"? c:\\temp\\logs\.txt$/i], show: 'findstr /i /n "error" C:\\Temp\\logs.txt', hint: '1.3 — findstr', out: '42:ERROR Spooler service failed to start (1068: dependency)', why: 'A dependency failed — next step: check the service it depends on.' }],
    'Module 1 in one ticket: network check, drive map, file search, redirection and filtering.',
    ['Each task names its lesson.']);
  T('win-m2-wrap', 'Module 2 shift: PowerShell report', 'PowerShell in one ticket',
    'Build a quick health report for a manager. Each task names its lesson.',
    { shell: 'ps', prompt: 'PS C:\\Users\\tech>' },
    [{ t: '<b>2.1</b> — Find the cmdlets with the noun "Volume".', accept: [/^get-command -noun volume$/i, /^gcm -noun volume$/i], show: 'Get-Command -Noun Volume', hint: '2.1 — Get-Command', out: 'Get-Volume\nFormat-Volume\nRepair-Volume\nResize-Volume…', why: 'Get-Volume is the one.' },
     { t: '<b>2.2</b> — List volumes with less than 20% free (SizeRemaining divided by Size).', accept: [/^get-volume \| where-object \{ ?\$_\.size -gt 0 -and \$_\.sizeremaining ?\/ ?\$_\.size -lt 0?\.2 ?\}$/i, /^get-volume \| where-object \{ ?\$_\.sizeremaining ?\/ ?\$_\.size -lt 0?\.2 ?\}$/i, /^get-volume \| where \{ ?\$_\.sizeremaining ?\/ ?\$_\.size -lt 0?\.2 ?\}$/i], show: 'Get-Volume | Where-Object { $_.SizeRemaining / $_.Size -lt 0.2 }', hint: '2.2 — Where-Object with a calculation', out: 'DriveLetter FileSystemLabel SizeRemaining      Size\n----------- --------------- -------------      ----\nD           Data              48.2 GB     500 GB', why: 'D: is under 20%.' },
     { t: '<b>2.3</b> — Show the last 3 System errors.', accept: [/^get-winevent -filterhashtable @\{ ?logname ?= ?['"]?system['"]?; ?level ?= ?2 ?\} -maxevents 3$/i], show: "Get-WinEvent -FilterHashtable @{LogName='System'; Level=2} -MaxEvents 3", hint: '2.3 — Get-WinEvent', out: 'TimeCreated            Id ProviderName\n11/17/2026 8:02:11 AM 7034 Service Control Manager\n11/16/2026 6:40:55 PM   51 disk', ask: { q: 'Which event ID came from the "disk" provider?', accept: ['51'], why: 'Disk event 51 = paging/IO error — check that drive\'s health.' }, why: 'Events.' },
     { t: '<b>2.2</b> — Export all volumes (DriveLetter, Size, SizeRemaining) to C:\\Temp\\volumes.csv.', accept: [/^get-volume \| select-object( -property)? driveletter,\s?size,\s?sizeremaining \| export-csv( -path)? c:\\temp\\volumes\.csv -notypeinformation$/i], show: 'Get-Volume | Select-Object DriveLetter,Size,SizeRemaining | Export-Csv C:\\Temp\\volumes.csv -NoTypeInformation', hint: '2.2 — Select-Object | Export-Csv', out: '', why: 'Report delivered as a CSV.' }],
    'Module 2 in one ticket: discover, filter, events, export.',
    ['Each task names its lesson.']);

  // ---------- extras + cards ----------
  RK.extra(TR, '1.1', [
    ['How do you change to the D: drive in CMD?', 'Type D:', ['cd D', 'chdir /D only', 'drive D'], 'Drive letter.'],
    ['Which wildcard matches exactly one character?', '?', ['*', '%', '#'], 'Single character.'],
    ['How do you go to the root of the current drive?', 'cd \\', ['cd ~', 'cd /', 'cd root'], 'Root.'],
    ['Which dir switch shows subfolders too?', '/s', ['/a', '/b', '/q'], 'Recursive.'],
    ['Which command deletes a folder and everything in it without prompting?', 'rd /s /q', ['del /f', 'rd', 'md /d'], 'Careful — no undo.'],
    ['How do you open a path with spaces?', 'Put it in quotes', ['Use underscores', 'Use %20', 'Remove the spaces'], 'Quoting.'],
    ['Which command clears the CMD screen?', 'cls', ['clear', 'clr', 'reset'], 'Clear.'],
    ['Are Windows paths case-sensitive?', 'No', ['Yes', 'Only on C:', 'Only for folders'], 'Case-insensitive.'],
    ['Which environment variable points to the current user\'s profile?', '%USERPROFILE%', ['%HOME%', '$HOME', '%USER%'], 'Profile.'],
    ['Which command lists environment variables in CMD?', 'set', ['env', 'Get-ChildItem env:', 'vars'], 'set.'],
    ['Which command shows a text file\'s contents?', 'type', ['cat', 'show', 'read'], 'type = cat.']
  ]);
  RK.extra(TR, '1.2', [
    ['Which tracert switch skips reverse name lookups?', '-d', ['-n', '-t', '-a'], 'Faster.'],
    ['Which command renews a DHCP address?', 'ipconfig /renew', ['ipconfig /flushdns', 'ping -r', 'netstat -r'], 'DHCP.'],
    ['Which ping switch pings continuously?', '-t', ['-n', '-l', '-a'], 'Until Ctrl+C.'],
    ['Which command shows OS version and installed hotfixes?', 'systeminfo', ['tasklist', 'ipconfig', 'whoami'], 'System facts.'],
    ['Which taskkill switch also ends child processes?', '/T', ['/F', '/PID', '/IM'], 'Tree.'],
    ['Which command restarts a remote PC called PC22?', 'shutdown /r /m \\\\PC22', ['restart PC22', 'taskkill /m PC22', 'net restart PC22'], 'Remote.'],
    ['Which tool adds per-hop packet loss to a traceroute?', 'pathping', ['ping -t', 'nslookup', 'arp'], 'Loss stats.'],
    ['Which tasklist switch shows services inside each process?', '/svc', ['/v', '/m', '/fo'], 'Services.'],
    ['How do you ask a specific DNS server with nslookup?', 'nslookup name server', ['nslookup -server name', 'nslookup /dns name', 'dig name'], 'Second argument.'],
    ['Which command shows who you are logged in as?', 'whoami', ['who', 'id', 'net user'], 'Current user.']
  ]);
  RK.extra(TR, '1.3', [
    ['Which command disables a local account?', 'net user name /active:no', ['net user name /delete', 'net localgroup name /off', 'del user name'], 'Disable.'],
    ['Which command removes a mapped drive S:?', 'net use S: /delete', ['net use S: /off', 'rd S:', 'del S:'], 'Unmap.'],
    ['What should you run if sfc cannot repair files?', 'DISM /Online /Cleanup-Image /RestoreHealth', ['chkdsk /x', 'gpupdate', 'robocopy'], 'Repair source.'],
    ['Which chkdsk switch also scans for bad sectors?', '/r', ['/f only', '/s', '/b'], 'Surface scan.'],
    ['Which robocopy switch copies all subfolders including empty ones?', '/E', ['/S', '/MIR only', '/Z'], 'Subfolders.'],
    ['Which robocopy switch sets the number of threads?', '/MT', ['/R', '/W', '/LOG'], 'Multithreaded.'],
    ['Which command produces an HTML Group Policy report?', 'gpresult /h report.html', ['gpupdate /h', 'gpresult /r', 'rsop /html'], 'Report.'],
    ['How do you redirect errors only to a file?', '2> errors.txt', ['> errors.txt', '>> errors.txt', '| errors.txt'], 'Stream 2.'],
    ['Which findstr switch matches an exact phrase with spaces?', '/c:"phrase"', ['/i', '/n', '/s'], 'Literal.'],
    ['Why use net user name * /add instead of typing the password?', 'The password is not left in command history or logs', ['It is faster', 'It creates an admin', 'It is required by Windows'], 'Prompt.']
  ]);
  RK.extra(TR, '2.1', [
    ['What is the PowerShell naming pattern for cmdlets?', 'Verb-Noun', ['Noun-Verb', 'verb_noun', 'VerbNoun'], 'Discoverable.'],
    ['Which command downloads full help files?', 'Update-Help', ['Get-Help -Update', 'Install-Help', 'Save-Help only'], 'Admin once.'],
    ['Which alias runs Get-Content?', 'cat (and type, gc)', ['ls', 'cd', 'gsv'], 'Alias.'],
    ['Which executable starts PowerShell 7?', 'pwsh', ['powershell', 'ps7', 'cmd'], 'PowerShell 7.'],
    ['Which switch parameter forces an action without some prompts?', '-Force', ['-WhatIf', '-Confirm', '-Verbose'], 'Switch.'],
    ['Which key combination lists completion choices?', 'Ctrl+Space', ['Ctrl+C', 'Alt+F4', 'Ctrl+Z'], 'Menu complete.'],
    ['Which cmdlet shows help in a browser?', 'Get-Help Name -Online', ['Get-Help -Web', 'Show-Help', 'Open-Help'], 'Online help.'],
    ['How do you create a variable called name?', '$name = \'value\'', ['set name=value', 'name = value', 'var name'], '$ prefix.'],
    ['Are PowerShell cmdlet names case-sensitive?', 'No', ['Yes', 'Only verbs', 'Only in PowerShell 7'], 'Case-insensitive.'],
    ['Which cmdlet lists approved verbs?', 'Get-Verb', ['Get-Command -Verb', 'Get-Help verbs', 'Get-Alias'], 'Verbs.']
  ]);
  RK.extra(TR, '2.2', [
    ['Which operator tests wildcard matches in Where-Object?', '-like', ['-eq', '-gt', '='], 'Wildcards.'],
    ['Which operator tests a regular expression?', '-match', ['-like', '-contains', '-eq'], 'Regex.'],
    ['What does Select-Object -ExpandProperty Name return?', 'Just the Name values, not objects', ['Every property', 'A table', 'A CSV'], 'Raw values.'],
    ['What does "filter left" mean?', 'Filter as early as possible in the pipeline', ['Sort before filtering', 'Use the left mouse button', 'Filter at the end'], 'Performance.'],
    ['Which cmdlet loops over each pipeline object?', 'ForEach-Object', ['Where-Object', 'Measure-Object', 'Group-Object'], 'Loop.'],
    ['How do you sort descending?', 'Sort-Object Prop -Descending', ['Sort-Object -Reverse', 'Sort-Object Prop -Down', 'Reverse-Object'], 'Descending.'],
    ['Which cmdlet converts objects to JSON?', 'ConvertTo-Json', ['Export-Json', 'Out-Json', 'Format-Json'], 'JSON.'],
    ['What does 1GB mean in PowerShell?', '1,073,741,824 (a numeric constant)', ['A string', '1,000 bytes', 'An error'], 'Size constant.'],
    ['Which switch removes the #TYPE header from Export-Csv in Windows PowerShell 5.1?', '-NoTypeInformation', ['-NoHeader', '-Raw', '-Clean'], 'Clean CSV.'],
    ['How do you get just the Id of the explorer process?', '(Get-Process -Name explorer).Id', ['Get-Process explorer -Id', 'Id explorer', 'Get-Id explorer'], 'Member access.']
  ]);
  RK.extra(TR, '2.3', [
    ['Which cmdlet resolves a DNS name and returns objects?', 'Resolve-DnsName', ['Test-NetConnection -Dns', 'Get-DnsName', 'nslookup.ps1'], 'DNS lookup.'],
    ['Which cmdlet sets a static IPv4 address?', 'New-NetIPAddress', ['Set-NetIPInterface -Dhcp', 'Get-NetIPAddress', 'Restart-NetAdapter'], 'Static.'],
    ['Which cmdlet sets DNS servers on an adapter?', 'Set-DnsClientServerAddress', ['Set-DnsServer', 'Resolve-DnsName', 'Clear-DnsClientCache'], 'DNS client.'],
    ['Which cmdlet clears the DNS client cache?', 'Clear-DnsClientCache', ['ipconfig /dns', 'Remove-Dns', 'Reset-Dns'], 'Cache.'],
    ['Which cmdlet changes a service\'s startup type?', 'Set-Service -StartupType', ['Start-Service -Type', 'sc start', 'Get-Service -Set'], 'Startup type.'],
    ['Which script block catches errors?', 'try { } catch { }', ['if { } else { }', 'foreach { }', 'param { }'], 'Error handling.'],
    ['Which parameter makes a non-terminating error stop so catch sees it?', '-ErrorAction Stop', ['-Force', '-WhatIf', '-Verbose'], 'Terminating.'],
    ['Which cmdlet records everything you type and see to a file?', 'Start-Transcript', ['Out-File', 'Export-Csv', 'Tee-Object only'], 'Session log.'],
    ['Which cmdlet registers a scheduled task?', 'Register-ScheduledTask', ['New-Task', 'Start-Job', 'Set-Schedule'], 'Task Scheduler.'],
    ['How do you put a property inside a double-quoted string?', '"$($v.Name)"', ['"$v.Name"', '"{v.Name}"', '"%v.Name%"'], 'Subexpression.'],
    ['Which policy is the default on Windows client PCs?', 'Restricted', ['RemoteSigned', 'Unrestricted', 'Bypass'], 'No scripts.']
  ]);
  RK.cards(TR, '1.1', [['cd / cd ..', 'Print or change folder / up one.'], ['dir /s /b *.x', 'Find files recursively, bare paths.'], ['rd /s /q', 'Delete a folder tree — no undo.'], ['%VAR%', 'CMD environment variable.']]);
  RK.cards(TR, '1.2', [['ipconfig /all', 'Full IP config with DNS and MAC.'], ['tracert -d', 'Path without name lookups.'], ['netstat -ano', 'Connections and PIDs.'], ['taskkill /PID n /F', 'Force-end one process.']]);
  RK.cards(TR, '1.3', [['net use X: \\\\s\\sh', 'Map a drive.'], ['robocopy /MIR', 'Mirror — deletes extras.'], ['gpresult /r', 'Applied GPOs.'], ['> vs >>', 'Overwrite vs append.']]);
  RK.cards(TR, '2.1', [['Verb-Noun', 'Cmdlet naming.'], ['Get-Help -Examples', 'Fastest way to learn a cmdlet.'], ['-WhatIf', 'Preview a change.'], ['$env:PATH', 'Environment variable in PowerShell.']]);
  RK.cards(TR, '2.2', [['$_', 'Current pipeline object.'], ['Get-Member', 'Properties and methods.'], ['@{n=;e=}', 'Calculated property.'], ['Format-* last', 'Display only; never before export.']]);
  RK.cards(TR, '2.3', [['Get-WinEvent -FilterHashtable', 'Fast event queries.'], ['Set-NetIPInterface -Dhcp Enabled', 'Back to DHCP.'], ['RemoteSigned', 'Local scripts run; downloads need signing.'], ['.\\script.ps1', 'Run a script in the current folder.']]);
})();
