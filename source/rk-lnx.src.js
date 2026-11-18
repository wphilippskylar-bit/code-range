/* Code Range — Linux track converted to RangeKit parts (4 modules, 7 lessons). Replaces old stages lnx1–lnx7.
   Original sections via SEC() (filled by build-sec.py) + callouts, quick checks; parts paired with the existing sh simulator labs,
   plus new bash terminal labs for admin essentials and module wraps. Bash patterns are case-sensitive. */
(function () {
  var RK = window.RK, P = RK.P, M = RK.M, O = RK.O, T = RK.T, TR = 'linux';
  function pro(t) { return '<div class="callout pro"><b class="k">On the job</b>' + t + '</div>'; }
  function trap(t) { return '<div class="callout trap"><b class="k">Exam trap</b>' + t + '</div>'; }
  var SH = { shell: 'bash', prompt: 'phil@srv01:~$' };

  // ================= Module 1 · 1.1 Navigating the filesystem =================
  M('lxx-nav-wrap', 'Linux ↔ Windows', 'Combined 1.1',
    'Pick the Linux command for each job.', ['pwd', 'ls -la', 'cd ~', 'cd -', 'mkdir -p', 'cp -r', 'mv', 'rm -r', 'cat', 'less', 'tree / find'],
    [['Where am I?', 'pwd', 'Print working directory.'], ['List everything including hidden dotfiles, with details', 'ls -la', 'Long + all.'], ['Go to my home folder', 'cd ~', 'Home.'], ['Jump back to the previous folder', 'cd -', 'Toggle.'], ['Create a/b/c in one go', 'mkdir -p', 'Parents.'], ['Copy a folder and its contents', 'cp -r', 'Recursive.'], ['Rename a file', 'mv', 'Move/rename.'], ['Delete a folder and everything in it', 'rm -r', 'No recycle bin.'], ['Print a short file', 'cat', 'Concatenate.'], ['Page through a long log', 'less', 'q to quit.'], ['See the structure of a folder tree', 'tree / find', 'Overview.']],
    'Linux is case-sensitive, uses / and has one tree starting at / — no drive letters.');

  RK.add({ track: TR, id: '1.1', dom: 1, short: 'Navigating the filesystem', title: 'Navigate and organise the Linux filesystem from the shell',
    goal: 'Use the shell to move around the single directory tree, list and inspect files, and create, copy, move and delete them safely.',
    kw: /\b(shell|terminal|pwd|\bls\b|\bcd\b|mkdir|rmdir|\bcp\b|\bmv\b|\brm\b|touch|cat|less|head|tail|absolute|relative|home directory|hidden|dotfile|tab complet|\/etc|\/var|\/home|filesystem)/,
    parts: [
      P('The shell and the tree', 'Explain what the shell is, read paths in the single Linux directory tree, and find hidden files.',
        SEC('lnx1', [0, 1, 3]) + pro('Learn the standard folders: /etc (config), /var/log (logs), /home (users), /tmp (scratch), /usr/bin (programs). Half of Linux troubleshooting is knowing where to look.') + trap('Linux is case-sensitive: Report.txt and report.txt are two different files. Windows habits cause "No such file or directory".'),
        [['Which folder holds most system configuration files?', '/etc', ['/var', '/home', '/bin'], 'Config.'],
         ['How do you show hidden files?', 'ls -a', ['ls -h', 'ls -r', 'ls --hidden-only'], 'Dotfiles.']],
        'lx-nav'),
      P('Core commands and moving fast', 'Create, copy, move, inspect and delete files, and move around efficiently.',
        SEC('lnx1', [2, 4]) + pro('Before any rm -r, run ls on the same path and read it. On a server there is no recycle bin, and rm -rf on the wrong folder ends careers.') + trap('cp needs -r to copy a directory; without it you get "omitting directory".'),
        [['Which command copies a directory and its contents?', 'cp -r src dst', ['cp src dst', 'mv -c src dst', 'copy src dst'], 'Recursive.'],
         ['What does cd - do?', 'Returns to the previous directory', ['Goes up one level', 'Goes home', 'Deletes the directory'], 'Toggle.']],
        'lx-organize')
    ],
    wrap: { recap: ['The shell reads commands; one tree from / with no drive letters; case-sensitive.', 'Key folders: /etc, /var/log, /home, /tmp, /usr/bin.', 'pwd, ls -la, cd (~, .., -), absolute vs relative paths.', 'Hidden dotfiles; Tab completion.', 'mkdir -p, touch, cp -r, mv, rm (-r), cat, less, head, tail.', 'Look before you rm.'], lab: 'lxx-nav-wrap' }
  });

  // ================= Module 2 · 2.1 Pipes, redirection, text tools =================
  M('lxx-text-wrap', 'Which text tool?', 'Combined 2.1',
    'Pick the tool.', ['grep', 'grep -v', 'grep -c', 'cut', 'sort', 'uniq -c', 'wc -l', 'sed', 'awk', 'tee', '2>/dev/null'],
    [['Show lines containing "ERROR"', 'grep', 'Filter.'], ['Show lines NOT containing "DEBUG"', 'grep -v', 'Invert.'], ['Count matching lines', 'grep -c', 'Count.'], ['Take the 3rd comma-separated field', 'cut', 'Fields.'], ['Put lines in order', 'sort', 'Sort.'], ['Count duplicates (after sort)', 'uniq -c', 'Count runs.'], ['How many lines?', 'wc -l', 'Line count.'], ['Replace "http:" with "https:" in a stream', 'sed', 'Substitute.'], ['Sum column 5 grouped by column 2', 'awk', 'Fields + logic.'], ['Save output to a file and still see it', 'tee', 'Split.'], ['Hide error messages', '2>/dev/null', 'Discard stderr.']],
    'Small tools, connected by pipes: grep → cut/awk → sort → uniq -c → sort -n → head.');
  T('lxx-m2-wrap', 'Module 2 shift: who is hammering the server?', 'Pipes in one ticket',
    'Alert: the web server is slow. Find the IP sending the most requests in /var/log/nginx/access.log. Each task names its lesson part.', SH,
    [{ t: '<b>2.1</b> — Count the lines in the access log.', accept: [/^wc -l \/var\/log\/nginx\/access\.log$/, /^cat \/var\/log\/nginx\/access\.log \| wc -l$/], show: 'wc -l /var/log/nginx/access.log', hint: 'wc -l <file>', out: '184220 /var/log/nginx/access.log', why: '184k requests today.' },
     { t: '<b>2.1</b> — Top 5 client IPs (field 1), most requests first.', accept: [/^(cut -d' ' -f1|awk '\{print \$1\}') \/var\/log\/nginx\/access\.log \| sort \| uniq -c \| sort -(rn|nr) \| head -5$/, /^(cut -d" " -f1|awk "\{print \$1\}") \/var\/log\/nginx\/access\.log \| sort \| uniq -c \| sort -(rn|nr) \| head -5$/], show: "awk '{print $1}' /var/log/nginx/access.log | sort | uniq -c | sort -rn | head -5", hint: "awk '{print $1}' file | sort | uniq -c | sort -rn | head -5", out: ' 96112 203.0.113.77\n  4120 198.51.100.4\n  3011 10.1.20.15\n  2880 192.0.2.10\n  1904 198.51.100.9', ask: { q: 'Which IP sent the most requests?', accept: ['203.0.113.77'], why: 'Over half of all traffic from one address — a scraper or a small DoS. Block it at the firewall/WAF and report it.' }, why: 'The classic counting pipeline.' },
     { t: '<b>2.1</b> — Save that IP\'s requests to /tmp/suspect.log while also counting them (use tee).', accept: [/^grep '?203\.0\.113\.77'? \/var\/log\/nginx\/access\.log \| tee \/tmp\/suspect\.log \| wc -l$/, /^grep "203\.0\.113\.77" \/var\/log\/nginx\/access\.log \| tee \/tmp\/suspect\.log \| wc -l$/], show: 'grep 203.0.113.77 /var/log/nginx/access.log | tee /tmp/suspect.log | wc -l', hint: 'grep … | tee <file> | wc -l', out: '96112', why: 'Evidence saved for the ticket.' }],
    'Count, rank, isolate, save: the pipeline answers "who/what is causing this" in seconds.',
    ['wc -l, awk/cut | sort | uniq -c | sort -rn | head, tee.']);

  RK.add({ track: TR, id: '2.1', dom: 2, short: 'Pipes & text tools', title: 'Chain commands with pipes and redirection and process text',
    goal: 'Use stdin/stdout/stderr, redirection and pipes, and grep, cut, sort, uniq, wc, sed and awk to answer questions from text and logs.',
    kw: /\b(pipe|redirect|stdin|stdout|stderr|2>|>>|\/dev\/null|\btee\b|grep|\bcut\b|\bsort\b|uniq|\bwc\b|\bsed\b|\bawk\b|xargs)/,
    parts: [
      P('Streams and redirection', 'Use standard input, output and error with redirection and pipes.',
        SEC('lnx2', [0, 4]) + pro('Append 2>&1 | tee run.log to long admin commands. You see the output live and keep a copy for the ticket, errors included.') + trap('cmd > file 2>&1 captures both streams; cmd 2>&1 > file sends errors to the screen — the order of redirections matters.'),
        [['Which stream number is standard error?', '2', ['0', '1', '3'], 'stderr.'],
         ['What does >> do?', 'Appends to a file', ['Overwrites a file', 'Reads a file', 'Pipes to a command'], 'Append.']],
        'lx-streams'),
      P('grep, cut, sort, uniq, wc', 'Filter lines with grep and slice, sort, count and de-duplicate with cut, sort, uniq and wc.',
        SEC('lnx2', [1, 2]) + pro('sort | uniq -c | sort -rn | head is the single most useful pipeline in operations: top talkers, top errors, top users — from any log.') + trap('uniq only removes adjacent duplicates. Always sort first.'),
        [['Which grep option shows lines that do NOT match?', '-v', ['-i', '-c', '-n'], 'Invert.'],
         ['Why put sort before uniq -c?', 'uniq only counts adjacent duplicate lines', ['uniq needs numbers', 'sort removes errors', 'It is optional'], 'Adjacent.']],
        'lx-pipes'),
      P('sed and awk', 'Substitute text with sed and extract and summarise fields with awk.',
        SEC('lnx2', [3]) + pro('Test a sed substitution without -i first and read the output. Only then add -i (and keep a .bak: sed -i.bak).') + trap('In awk, $0 is the whole line and $1 the first field — not the first argument like in a shell script.'),
        [['Which sed command replaces every "foo" with "bar" on each line?', "sed 's/foo/bar/g'", ["sed 's/foo/bar/'", "sed 'd/foo/'", "sed -n 'foo'"], 'g = global.'],
         ['In awk, what is $3?', 'The third field of the current line', ['The third line', 'The third argument', 'The third file'], 'Fields.']],
        'lx-logs')
    ],
    wrap: { recap: ['Streams: 0 stdin, 1 stdout, 2 stderr; > overwrite, >> append, 2> errors, 2>&1 both, < input.', '| pipes output into the next command; tee saves and passes through; /dev/null discards.', 'grep (-i -v -c -n -r -E), cut -d -f, sort (-n -r -k), uniq -c, wc -l.', 'sed s/old/new/g (test before -i).', 'awk \'{print $1}\', -F for separators, $0 whole line.', 'Top-N pipeline: … | sort | uniq -c | sort -rn | head.'], lab: 'lxx-text-wrap' }
  });

  // ================= Module 3 · 3.1 Variables, permissions & scripts =================
  M('lxx-perm-wrap', 'Permissions and scripts', 'Combined 3.1',
    'Pick the answer.', ['chmod 755', 'chmod 644', 'chmod 600', 'chmod +x', 'chown user:group', 'export VAR=value', '#!/bin/bash', 'find -mtime +30', 'echo $?'],
    [['Script/program: owner full, others read+execute', 'chmod 755', 'rwxr-xr-x.'], ['Normal file: owner read/write, others read', 'chmod 644', 'rw-r--r--.'], ['Private key or secret file', 'chmod 600', 'Owner only.'], ['Make deploy.sh runnable', 'chmod +x', 'Execute bit.'], ['Give a folder to the www-data user and group', 'chown user:group', 'Ownership.'], ['Make a variable visible to child processes', 'export VAR=value', 'Environment.'], ['First line telling Linux which interpreter runs the script', '#!/bin/bash', 'Shebang.'], ['Files not modified in over 30 days', 'find -mtime +30', 'Age.'], ['Exit code of the last command', 'echo $?', '0 = success.']],
    'Octal: r=4, w=2, x=1 for owner/group/others.');
  T('lxx-m3-wrap', 'Module 3 shift: fix a broken deploy', 'Permissions + script in one ticket',
    'Ticket: ./deploy.sh fails with "Permission denied" and the app cannot read its config. Each task names its lesson part.', { shell: 'bash', prompt: 'phil@app01:/opt/app$' },
    [{ t: '<b>3.1</b> — Show the permissions of deploy.sh and config.env.', accept: [/^ls -l deploy\.sh config\.env$/, /^ls -l config\.env deploy\.sh$/, /^ls -l$/, /^ls -la$/], show: 'ls -l deploy.sh config.env', hint: 'ls -l <files>', out: '-rw------- 1 root root  412 Nov 18 09:10 config.env\n-rw-r--r-- 1 phil phil 1288 Nov 18 09:12 deploy.sh', ask: { q: 'Who owns config.env?', accept: ['root'], why: 'Owned by root with 600 — the app user cannot read it. And deploy.sh has no x bit.' }, why: 'Read the mode string.' },
     { t: '<b>3.1</b> — Make deploy.sh executable for its owner.', accept: [/^chmod (u\+x|\+x|755|744|700) deploy\.sh$/], show: 'chmod u+x deploy.sh', hint: 'chmod u+x <file>', out: '', why: 'Fixes "Permission denied" on ./deploy.sh.' },
     { t: '<b>3.1</b> — Give config.env to the app user and group (appsvc).', accept: [/^sudo chown appsvc:appsvc config\.env$/], show: 'sudo chown appsvc:appsvc config.env', hint: 'sudo chown user:group <file>', out: '', why: 'Keep 600 (it holds secrets) but owned by the service account.' },
     { t: '<b>3.1</b> — Run the script and print its exit code.', accept: [/^\.\/deploy\.sh; echo \$\?$/, /^\.\/deploy\.sh && echo \$\?$/], show: './deploy.sh; echo $?', hint: './deploy.sh; echo $?', out: 'Deploying build 2026.11.18-3 … done\n0', why: 'Exit code 0 = success.' }],
    'Read ls -l → fix execute bit → fix ownership (keep secrets 600) → run → check $?.',
    ['ls -l, chmod u+x, chown, $?.']);

  RK.add({ track: TR, id: '3.1', dom: 3, short: 'Variables, permissions & scripts', title: 'Use variables and permissions and write your first shell scripts',
    goal: 'Use shell and environment variables, read and set permissions and ownership, write and run scripts, and use find and other extras.',
    kw: /\b(variable|export|\$path|env|chmod|chown|permission|rwx|755|644|600|umask|owner|shebang|#!|script|\.sh\b|\bfind\b|which|alias|history|exit code|\$\?)/,
    parts: [
      P('Variables and permissions', 'Use variables and the environment, and read and change permissions and ownership.',
        SEC('lnx3', [0, 1]) + pro('Secrets (keys, .env files, credentials) get 600 and the service account as owner. A world-readable .env is one of the most common findings in security reviews.') + trap('chmod 777 "fixes" permission errors by giving everyone write access — never use it on a server; fix ownership instead.'),
        [['What does chmod 640 give the group?', 'Read only', ['Read and write', 'Nothing', 'Execute'], '6=rw owner, 4=r group, 0 others.'],
         ['Which command makes a variable available to child processes?', 'export', ['set', 'local', 'alias'], 'Environment.']],
        'lx-perms'),
      P('Writing and running scripts', 'Write a script with a shebang, make it executable and run it.',
        SEC('lnx3', [2, 4]) + pro('Start every script with #!/usr/bin/env bash and set -euo pipefail. Scripts then stop at the first error instead of carrying on and doing damage.') + trap('Running script.sh without ./ fails unless the folder is in $PATH — Linux does not search the current directory.'),
        [['What does the first line #!/bin/bash do?', 'Tells Linux which interpreter runs the script', ['Comments the file', 'Makes it executable', 'Sets a variable'], 'Shebang.'],
         ['How do you run deploy.sh in the current folder?', './deploy.sh', ['deploy.sh', 'run deploy.sh', 'exec deploy'], 'Path required.']],
        'lx-sc-first'),
      P('find and useful extras', 'Locate files with find and use other everyday shell extras.',
        SEC('lnx3', [3]) + pro('find /var/log -name "*.log" -mtime +30 -size +100M answers "what is filling the disk?" — add -delete only after you have read the list.') + trap('find\'s -delete acts on everything the expression matches; put it last, after testing the same command without it.'),
        [['Which find test matches files modified more than 7 days ago?', '-mtime +7', ['-mtime -7', '-atime 7', '-newer 7'], 'Age.'],
         ['Which command shows where a program is on $PATH?', 'which', ['find', 'whereis -all', 'locate only'], 'Locate binary.']],
        'lx-script')
    ],
    wrap: { recap: ['Variables: name=value (no spaces), $name, export for children, $PATH.', 'Permissions: r=4 w=2 x=1 for owner/group/others; chmod, chown user:group.', 'Common modes: 755 programs, 644 files, 600 secrets; never 777.', 'Scripts: shebang, chmod +x, ./script.sh, $? exit codes.', 'set -euo pipefail for safer scripts.', 'find by name/type/mtime/size; test before -delete.'], lab: 'lxx-perm-wrap' }
  });

  // ================= Module 4 · 4.1 awk =================
  M('lxx-awk-wrap', 'awk patterns', 'Combined 4.1',
    'Pick the awk program.', ["awk '{print $2}'", "awk -F, '{print $3}'", "awk '$9 == 500'", "awk '{s+=$5} END {print s}'", "awk '{c[$1]++} END {for (k in c) print c[k], k}'", "awk 'NR>1'", "awk '{printf \"%-10s %8.2f\\n\", $1, $2}'", "awk 'BEGIN {FS=\":\"} {print $1}'"],
    [['Second whitespace-separated field', "awk '{print $2}'", 'Default separator.'], ['Third column of a CSV', "awk -F, '{print $3}'", 'Field separator.'], ['Only lines whose 9th field is 500', "awk '$9 == 500'", 'Pattern only.'], ['Total of column 5', "awk '{s+=$5} END {print s}'", 'Accumulate.'], ['Count lines per value of field 1 (group-by)', "awk '{c[$1]++} END {for (k in c) print c[k], k}'", 'Associative array.'], ['Skip the header line', "awk 'NR>1'", 'Record number.'], ['Aligned columns with two decimals', "awk '{printf \"%-10s %8.2f\\n\", $1, $2}'", 'printf.'], ['Usernames from /etc/passwd', "awk 'BEGIN {FS=\":\"} {print $1}'", 'BEGIN block.']],
    'pattern { action }; BEGIN/END; arrays for group-by; printf for reports.');

  RK.add({ track: TR, id: '4.1', dom: 4, short: 'awk mastery', title: 'Turn raw data and logs into reports with awk',
    goal: 'Use awk\'s pattern-action model, variables, BEGIN/END, associative arrays, conditions and printf to build reports and investigate logs.',
    kw: /\b(awk|pattern.?action|begin|end block|\bnr\b|\bnf\b|\bfs\b|associative array|printf|group.by|access\.log|status code)/,
    parts: [
      P('The awk model, variables, BEGIN and END', 'Use awk patterns and actions, built-in variables and BEGIN/END blocks.',
        SEC('lnx4', [0, 1]) + pro('Prototype awk one-liners on head -20 of the file first. When the output looks right, run it on the whole file.') + trap('Without -F, awk splits on whitespace; a CSV needs -F, (and quoted commas inside fields need a real CSV tool).'),
        [['Which block runs once after all lines are read?', 'END', ['BEGIN', 'MAIN', 'FINAL'], 'Totals.'],
         ['Which built-in variable is the current line number?', 'NR', ['NF', 'FS', 'OFS'], 'Record number.']],
        'lx-awk-revenue'),
      P('Arrays, conditions and printf', 'Group data with associative arrays, filter with conditions and format reports with printf.',
        SEC('lnx4', [2, 3]) + pro('Associative arrays turn awk into a mini database: c[$1]++ counts, s[$2]+=$5 sums per key. Most "can you pull me a report" requests are one line.') + trap('for (k in arr) returns keys in no particular order — pipe to sort for a stable report.'),
        [['What does c[$1]++ do?', 'Counts how many times each value of field 1 appears', ['Prints field 1', 'Deletes field 1', 'Sorts field 1'], 'Group-by count.'],
         ['Which awk function formats aligned columns?', 'printf', ['print only', 'format', 'echo'], 'Formatted output.']],
        'lx-report'),
      P('Reading logs like a defender', 'Investigate web access logs with awk to find suspicious activity.',
        SEC('lnx4', [4]) + pro('For any incident, three awk questions come first: who (top IPs), what (top URLs and status codes), when (requests per minute).') + trap('A spike of 404s from one IP is usually scanning; a spike of 401/403 is credential guessing. Read the status codes before you conclude.'),
        [['Which status code pattern suggests directory scanning?', 'Many 404s from one IP', ['A few 200s', 'Many 304s', 'One 500'], 'Probing.'],
         ['In a common nginx log line, which field is the client IP?', '$1', ['$9', '$7', '$NF'], 'First field.']],
        'lx-weblog')
    ],
    wrap: { recap: ['awk = pattern { action } per line; $0, $1…$NF; -F separator.', 'NR, NF, FS, OFS; BEGIN and END blocks.', 'Associative arrays for group-by counts and sums.', 'Conditions (==, ~, &&) and printf for aligned reports.', 'Logs: top IPs, URLs, status codes, per-minute rates.', 'Prototype on head, then run on the whole file.'], lab: 'lxx-awk-wrap' }
  });

  // ================= 4.2 sed, find & admin pipelines =================
  M('lxx-sed-wrap', 'sed, find and grep flags', 'Combined 4.2',
    'Pick the command.', ["sed -i.bak 's/old/new/' file", "sed -n '10,20p' file", "sed '/^#/d' file", 'find / -perm -4000 -type f', 'find . -type f -size +100M', 'find . -name "*.php" -mtime -1', 'grep -rn', 'grep -l', 'grep -q (exit code)', 'xargs'],
    [['Edit a config in place but keep a backup', "sed -i.bak 's/old/new/' file", 'Backup suffix.'], ['Print only lines 10 to 20', "sed -n '10,20p' file", 'Range.'], ['Remove comment lines', "sed '/^#/d' file", 'Delete matches.'], ['Find SUID binaries during an audit', 'find / -perm -4000 -type f', 'Privilege escalation risk.'], ['Find files over 100 MB', 'find . -type f -size +100M', 'Disk hog.'], ['PHP files changed in the last day (possible web shell)', 'find . -name "*.php" -mtime -1', 'Recent changes.'], ['Search a whole tree with line numbers', 'grep -rn', 'Recursive.'], ['Just the names of files that match', 'grep -l', 'Files only.'], ['Use grep in an if statement', 'grep -q (exit code)', 'Quiet.'], ['Pass find results to another command', 'xargs', 'Build commands.']],
    'sed edits streams; find selects files by any attribute; grep flags and exit codes glue them into pipelines.');

  RK.add({ track: TR, id: '4.2', dom: 4, short: 'sed, find & pipelines', title: 'Edit configs with sed and hunt files with find in admin pipelines',
    goal: 'Edit text safely with sed (groups, in-place with backup), find files by name, type, age, size and permissions, use grep\'s power flags and exit codes, and build triage pipelines.',
    kw: /\b(sed|in.place|-i\.bak|capture group|find .*-(name|type|mtime|size|perm|exec)|xargs|grep -(r|l|q|E|o)|exit code|triage|suid|world.writable)/,
    parts: [
      P('sed in depth', 'Substitute, delete and print lines with sed, use groups and &, and edit in place with a backup.',
        SEC('lnx5', [0, 1]) + pro('Always sed -i.bak on configs, then diff file.bak file before restarting the service. The backup is your one-command rollback.') + trap('sed -i on macOS needs an argument (sed -i \'\' …); on Linux, -i alone works. Scripts that must run on both need care.'),
        [['Which sed option edits a file in place keeping file.bak?', '-i.bak', ['-n', '-e', '-r only'], 'Backup.'],
         ['In sed replacement text, what does & mean?', 'The whole matched text', ['A literal &', 'Line number', 'Next line'], 'Match.']],
        'lx-sedconf'),
      P('find and grep power flags', 'Find files by name, type, time, size and permissions, and use grep flags and exit codes.',
        SEC('lnx5', [2, 3]) + pro('A permission audit is three finds: SUID files (-perm -4000), world-writable files (-perm -o+w), and files owned by nobody (-nouser). Run them on every new server.') + trap('-mtime -1 means modified within the last day; +1 means more than a day ago. The sign flips the meaning.'),
        [['Which find test matches world-writable files?', '-perm -o+w', ['-perm 644', '-writable-all', '-type w'], 'Others write.'],
         ['What exit code does grep return when it finds a match?', '0', ['1', '2', '-1'], 'Success = found.']],
        'lx-perm-audit'),
      P('Triage pipelines', 'Combine find, grep, sed and awk into incident-triage pipelines.',
        SEC('lnx5', [4]) + pro('Save good triage pipelines in a personal cheatsheet repo. During an incident you want to paste, not invent.') + trap('Filenames with spaces break naive pipelines; use find … -print0 | xargs -0, or find -exec … {} +.'),
        [['Which pair safely handles filenames with spaces?', 'find -print0 | xargs -0', ['find | xargs', 'ls | grep', 'cat | sed'], 'Null-separated.'],
         ['Which find action runs a command on the matches?', '-exec … {} +', ['-run', '-do', '-pipe'], 'Exec.']],
        'lx-triage')
    ],
    wrap: { recap: ['sed s///g, d, p with -n, ranges, groups \\( \\) / -E ( ) and &.', 'In-place edits with -i.bak; diff before restart.', 'find -name/-iname, -type f/d, -mtime ±n, -size ±n, -perm, -user/-nouser, -exec/-delete.', 'grep -r -n -l -i -E -o -q and exit codes 0/1/2.', 'xargs (-0 with -print0) to build commands.', 'Triage: find recent/odd files → grep indicators → awk summary.'], lab: 'lxx-sed-wrap' }
  });

  // ================= 4.3 Bash scripting =================
  RK.add({ track: TR, id: '4.3', dom: 4, short: 'Bash scripting', title: 'Automate admin work with robust Bash scripts',
    goal: 'Write scripts with arguments, tests and exit codes, loops and file reading, functions and robust habits.',
    kw: /\b(bash script|\$1|\$@|\$#|getopts|test|\[\[|if |then|elif|fi\b|for |while |read |case |function|local|set -e|pipefail|trap|exit code|shellcheck)/,
    parts: [
      P('Arguments, tests and exit codes', 'Read script arguments, test conditions and return meaningful exit codes.',
        SEC('lnx6', [0]) + pro('Validate arguments at the top and print a usage line with exit 2 when they are wrong. Future-you running the script at 3 a.m. will thank you.') + trap('Spaces matter in tests: [ "$a" = "$b" ] works; [$a=$b] does not. Quote variables so empty values do not break the test.'),
        [['Which variable holds the number of arguments?', '$#', ['$@', '$0', '$?'], 'Count.'],
         ['Which exit code conventionally means success?', '0', ['1', '255', '-1'], 'Success.']],
        'lx-sc-args'),
      P('Loops and reading files', 'Loop over lists and read files line by line.',
        SEC('lnx6', [1]) + pro('while IFS= read -r line; do …; done < file is the safe way to process a list of servers, users or paths one per line.') + trap('for f in $(cat file) splits on spaces, not lines — names with spaces break. Use while read.'),
        [['Which loop reads a file line by line safely?', 'while IFS= read -r line; do …; done < file', ['for line in file', 'foreach line', 'loop file'], 'while read.'],
         ['What does "$@" expand to?', 'All arguments, each kept as a separate word', ['The script name', 'The last exit code', 'The PID'], 'Arguments.']],
        'lx-sc-rotate'),
      P('Functions and robust habits', 'Organise scripts with functions and make them fail safely.',
        SEC('lnx6', [2]) + pro('Run shellcheck on every script before it goes near a server. It catches unquoted variables and other bugs that only show up on the worst day.') + trap('Without set -e (and pipefail), a script keeps going after a failed command — e.g. cd fails, then rm -rf runs in the wrong folder.'),
        [['Which option makes a pipeline fail if any command in it fails?', 'set -o pipefail', ['set -x', 'set -u', 'set +e'], 'Pipefail.'],
         ['What does local do inside a function?', 'Limits a variable to the function', ['Exports it', 'Makes it read-only', 'Deletes it'], 'Scope.']],
        'lx-sc-health')
    ],
    wrap: { recap: ['$1…$9, $@, $#, $0; validate and print usage.', 'Tests: [[ ]], -f -d -z -n, = != -eq -lt; quote variables.', 'Exit codes: 0 success; exit n; $? to read.', 'for over lists; while IFS= read -r for files.', 'Functions with local variables.', 'set -euo pipefail, trap for cleanup, shellcheck before deploy.'], lab: 'lx-fix-script' }
  });

  // ================= 4.4 Admin essentials =================
  T('lxx-proc', 'A service that keeps dying', 'Processes, systemd and logs',
    'Ticket: the nginx web service on web01 is down again. You are on web01 with sudo.', { shell: 'bash', prompt: 'phil@web01:~$' },
    [{ t: 'Check the nginx service status.', accept: [/^(sudo )?systemctl status nginx(\.service)?$/], show: 'systemctl status nginx', hint: 'systemctl status <unit>', out: '× nginx.service - A high performance web server\n     Active: failed (Result: exit-code) since Wed 2026-11-18 10:02:14 UTC\n    Process: 4112 ExecStartPre=/usr/sbin/nginx -t (code=exited, status=1/FAILURE)', why: 'Failed during the config test (ExecStartPre nginx -t).' },
     { t: 'Read the last 20 log lines for the nginx unit.', accept: [/^(sudo )?journalctl -u nginx(\.service)? -n 20( --no-pager)?$/, /^(sudo )?journalctl -n 20 -u nginx(\.service)?( --no-pager)?$/], show: 'sudo journalctl -u nginx -n 20 --no-pager', hint: 'journalctl -u <unit> -n 20', out: 'nginx[4112]: nginx: [emerg] unknown directive "proxy_passs" in /etc/nginx/sites-enabled/app:14\nnginx[4112]: nginx: configuration file /etc/nginx/nginx.conf test failed', ask: { q: 'On which line of the site config is the typo?', accept: ['14'], why: 'proxy_passs (three s) on line 14 — a bad edit, not a crash.' }, why: 'The journal tells you why.' },
     { t: 'Fix the typo in place with sed (keep a .bak).', accept: [/^sudo sed -i\.bak 's\/proxy_passs\/proxy_pass\/' \/etc\/nginx\/sites-enabled\/app$/], show: "sudo sed -i.bak 's/proxy_passs/proxy_pass/' /etc/nginx/sites-enabled/app", hint: "sudo sed -i.bak 's/proxy_passs/proxy_pass/' <file>", out: '', why: 'Module 4.2 skill in use.' },
     { t: 'Test the config, then restart nginx only if the test passes (one line).', accept: [/^sudo nginx -t && sudo systemctl restart nginx$/], show: 'sudo nginx -t && sudo systemctl restart nginx', hint: 'sudo nginx -t && sudo systemctl restart nginx', out: 'nginx: configuration file /etc/nginx/nginx.conf test is successful', why: '&& runs the restart only on success.' },
     { t: 'Confirm nginx is listening on port 80/443.', accept: [/^(sudo )?ss -tlnp( \| grep (nginx|:80|:443))?$/, /^(sudo )?ss -tulpn( \| grep (nginx|:80|:443))?$/], show: 'sudo ss -tlnp | grep nginx', hint: 'ss -tlnp', out: 'LISTEN 0 511 0.0.0.0:80   0.0.0.0:* users:(("nginx",pid=4290,fd=6))\nLISTEN 0 511 0.0.0.0:443  0.0.0.0:* users:(("nginx",pid=4290,fd=7))', why: 'Back up. Make sure it starts on boot: systemctl is-enabled nginx.' }],
    'Service down: systemctl status → journalctl -u → fix → test config → restart → ss to verify listening.',
    ['systemctl status/restart, journalctl -u -n, nginx -t &&, ss -tlnp.']);
  T('lxx-users', 'Onboard a new admin', 'Users, groups and sudo',
    'Ticket: create an account for new sysadmin Dana (dana), give her sudo, and check it. You are on app01 with sudo.', { shell: 'bash', prompt: 'phil@app01:~$' },
    [{ t: 'Create user dana with a home directory and bash as her shell.', accept: [/^sudo useradd -m -s \/bin\/bash dana$/, /^sudo useradd -s \/bin\/bash -m dana$/, /^sudo adduser dana$/], show: 'sudo useradd -m -s /bin/bash dana', hint: 'sudo useradd -m -s /bin/bash <user>', out: '', why: '-m creates /home/dana; adduser is the interactive Debian/Ubuntu wrapper.' },
     { t: 'Add dana to the sudo group (keep her other groups).', accept: [/^sudo usermod -aG sudo dana$/, /^sudo usermod -a -G sudo dana$/, /^sudo gpasswd -a dana sudo$/], show: 'sudo usermod -aG sudo dana', hint: 'sudo usermod -aG <group> <user>', out: '', why: '-a appends. Without -a, -G replaces all her supplementary groups.' },
     { t: 'Check dana\'s groups.', accept: [/^id dana$/, /^groups dana$/], show: 'id dana', hint: 'id <user>', out: 'uid=1004(dana) gid=1004(dana) groups=1004(dana),27(sudo)', ask: { q: 'Which group gives sudo rights on Ubuntu?', accept: ['sudo'], why: 'On RHEL-family systems it is the wheel group.' }, why: 'Verify.' },
     { t: 'Install her SSH public key (dana.pub is in your home) into her authorized_keys with the right owner and mode — use the install command from the hint.', accept: [/^sudo install -d -m 700 -o dana -g dana \/home\/dana\/\.ssh && sudo install -m 600 -o dana -g dana dana\.pub \/home\/dana\/\.ssh\/authorized_keys$/], show: 'sudo install -d -m 700 -o dana -g dana /home/dana/.ssh && sudo install -m 600 -o dana -g dana dana.pub /home/dana/.ssh/authorized_keys', hint: 'sudo install -d -m 700 -o dana -g dana /home/dana/.ssh && sudo install -m 600 -o dana -g dana dana.pub /home/dana/.ssh/authorized_keys', out: '', why: 'install creates and sets owner/mode in one step — no permission mistakes.' },
     { t: 'List what dana may run with sudo.', accept: [/^sudo -l -U dana$/], show: 'sudo -l -U dana', hint: 'sudo -l -U <user>', out: 'User dana may run the following commands on app01:\n    (ALL : ALL) ALL', why: 'Full sudo via the group. For least privilege, use a sudoers.d file with specific commands (edit with visudo).' }],
    'Onboard: useradd -m -s → usermod -aG → id → keys with correct owner/mode → sudo -l. Offboard: usermod -L / -e, remove keys.',
    ['useradd -m -s, usermod -aG, id, install -m -o -g, sudo -l -U.']);
  T('lxx-sysinfo', 'The disk is full', 'Disks, packages and network',
    'Alert: app01\'s root filesystem is at 97%. Find what is using space, free it, and patch while you are there.', { shell: 'bash', prompt: 'phil@app01:~$' },
    [{ t: 'Show filesystem usage in human-readable units.', accept: [/^df -h( \/)?$/], show: 'df -h /', hint: 'df -h', out: 'Filesystem      Size  Used Avail Use% Mounted on\n/dev/sda2        40G   39G  1.2G  97% /', why: '1.2 GB left.' },
     { t: 'Find the biggest folders under /var (one level deep), largest last.', accept: [/^sudo du -h --max-depth=1 \/var \| sort -h$/, /^sudo du -h -d 1 \/var \| sort -h$/, /^sudo du -sh \/var\/\* \| sort -h$/], show: 'sudo du -h --max-depth=1 /var | sort -h', hint: 'sudo du -h --max-depth=1 /var | sort -h', out: '120M    /var/cache\n310M    /var/lib\n24G     /var/log\n25G     /var', ask: { q: 'Which folder is the problem?', accept: ['/var/log', 'var/log', 'log'], why: '24 GB of logs — logrotate is broken or an app is logging in debug mode.' }, why: 'du + sort -h finds the hog.' },
     { t: 'Shrink the systemd journal to 500 MB.', accept: [/^sudo journalctl --vacuum-size=500M$/], show: 'sudo journalctl --vacuum-size=500M', hint: 'sudo journalctl --vacuum-size=500M', out: 'Vacuuming done, freed 18.4G of archived journals from /var/log/journal.', why: 'Space back. Set SystemMaxUse= in journald.conf so it cannot happen again.' },
     { t: 'Refresh package lists and install updates (Ubuntu).', accept: [/^sudo apt update && sudo apt upgrade -y$/, /^sudo apt update && sudo apt full-upgrade -y$/, /^sudo apt-get update && sudo apt-get upgrade -y$/], show: 'sudo apt update && sudo apt upgrade -y', hint: 'sudo apt update && sudo apt upgrade -y', out: '42 upgraded, 0 newly installed, 0 to remove and 0 not upgraded.', why: 'On RHEL-family: sudo dnf upgrade -y.' },
     { t: 'Show the server\'s IP addresses.', accept: [/^ip a(ddr)?( show)?$/, /^ip -br a(ddr)?$/], show: 'ip -br addr', hint: 'ip addr (ifconfig is legacy)', out: 'lo        UNKNOWN  127.0.0.1/8 ::1/128\nens18     UP       10.0.4.33/24 fe80::be24:11ff:fe2a:3c1/64', why: 'ip replaces ifconfig; ip route shows the gateway; resolvectl status shows DNS.' }],
    'Disk full: df -h → du | sort -h → clean the cause (journal/logs) → prevent recurrence. Then patch (apt/dnf) and verify networking (ip, ss).',
    ['df -h, du --max-depth=1 | sort -h, journalctl --vacuum-size, apt update && upgrade, ip -br addr.']);
  M('lxx-admin-wrap', 'Linux admin desk', 'Combined 4.4',
    'Pick the command.', ['systemctl restart', 'systemctl enable', 'journalctl -u', 'ps aux | grep', 'kill / kill -9', 'useradd -m', 'usermod -aG', 'passwd -l', 'df -h', 'du -sh', 'ss -tulpn', 'crontab -e'],
    [['Apply a config change to a service', 'systemctl restart', 'Restart.'], ['Make a service start at boot', 'systemctl enable', 'Boot.'], ['Why did the service fail?', 'journalctl -u', 'Unit logs.'], ['Find a process by name', 'ps aux | grep', 'Processes.'], ['Stop a hung process (try plain first)', 'kill / kill -9', 'SIGTERM then SIGKILL.'], ['Create an account with a home folder', 'useradd -m', 'Users.'], ['Add a user to a group without removing others', 'usermod -aG', 'Append.'], ['Lock a leaver\'s password', 'passwd -l', 'Lock.'], ['Free space per filesystem', 'df -h', 'Disk free.'], ['Size of one folder', 'du -sh', 'Disk usage.'], ['Which ports are listening and by which process?', 'ss -tulpn', 'Sockets.'], ['Schedule a nightly job', 'crontab -e', 'Cron.']],
    'Services, processes, users, disks, network, scheduling — the Linux admin core.');
  T('lxx-m4-wrap', 'Module 4 shift: a server under strain', 'Pro skills in one ticket',
    'Alert: app01 is slow and its disk is filling. Each task names its lesson.', { shell: 'bash', prompt: 'phil@app01:~$' },
    [{ t: '<b>4.4</b> — Show the top CPU processes once (batch mode, first 15 lines).', accept: [/^top -b -n 1 \| head -15$/, /^ps aux --sort=-%cpu \| head( -\d+)?$/], show: 'top -b -n 1 | head -15', hint: '4.4 — top -b -n 1 | head -15', out: '  PID USER     %CPU %MEM COMMAND\n 3112 appsvc   98.7  4.1 python3 export.py --debug\n  901 root      2.0  0.3 systemd-journald', why: 'A debug export job is pegging CPU (and logging heavily).' },
     { t: '<b>4.2</b> — Find files over 1 GB under /var/log.', accept: [/^sudo find \/var\/log -type f -size \+1G$/, /^sudo find \/var\/log -size \+1G -type f$/], show: 'sudo find /var/log -type f -size +1G', hint: '4.2 — find -size +1G', out: '/var/log/app/export-debug.log', why: 'The debug job\'s log.' },
     { t: '<b>4.1</b> — Count ERROR lines per hour in that log (hour = first 13 chars of field 1, e.g. 2026-11-18T10).', accept: [/^sudo awk '\/ERROR\/ \{c\[substr\(\$1,1,13\)\]\+\+\} END \{for \(h in c\) print h, c\[h\]\}' \/var\/log\/app\/export-debug\.log \| sort$/], show: "sudo awk '/ERROR/ {c[substr($1,1,13)]++} END {for (h in c) print h, c[h]}' /var/log/app/export-debug.log | sort", hint: "4.1 — awk '/ERROR/ {c[substr($1,1,13)]++} END {for (h in c) print h, c[h]}' <file> | sort", out: '2026-11-18T08 12\n2026-11-18T09 18334\n2026-11-18T10 22410', why: 'Errors exploded at 09:00 — when the job was started in debug mode.' },
     { t: '<b>4.4</b> — Stop the job politely (SIGTERM) by PID.', accept: [/^(sudo )?kill 3112$/, /^(sudo )?kill -15 3112$/, /^(sudo )?kill -TERM 3112$/], show: 'sudo kill 3112', hint: '4.4 — kill <pid>', out: '', why: 'SIGTERM lets it clean up; kill -9 only if it ignores this. Then truncate the log (sudo truncate -s 0 …) and ask the owner to rerun without --debug.' }],
    'Module 4: processes, find, awk reporting and signals in one incident.',
    ['Each task names its lesson.']);
  T('lxx-m1-wrap', 'Module 1 shift: find your way on a new server', 'Navigation in one ticket',
    'First login to a server you have never seen. Each task names its lesson part.', SH,
    [{ t: '<b>1.1</b> — Where are you?', accept: [/^pwd$/], show: 'pwd', hint: '1.1 — pwd', out: '/home/phil', why: 'Home.' },
     { t: '<b>1.1</b> — List /etc with details, newest first, and show only the first 5 lines.', accept: [/^ls -lt \/etc \| head -5$/, /^ls -lt \/etc\/ \| head -5$/, /^ls -lat \/etc \| head -5$/], show: 'ls -lt /etc | head -5', hint: '1.1 — ls -lt | head', out: 'total 812\n-rw-r--r-- 1 root root  2981 Nov 18 09:58 passwd\n-rw-r--r-- 1 root root  1120 Nov 18 09:58 group\ndrwxr-xr-x 2 root root  4096 Nov 17 16:20 cron.d', ask: { q: 'Which file in /etc changed most recently?', accept: ['passwd', '/etc/passwd'], why: 'passwd changed this morning — someone added or changed a user. Worth checking who.' }, why: 'Newest changes first.' },
     { t: '<b>1.1</b> — Show the last 10 lines of /etc/passwd.', accept: [/^tail \/etc\/passwd$/, /^tail -n ?10 \/etc\/passwd$/], show: 'tail -n 10 /etc/passwd', hint: '1.1 — tail', out: '…\ndana:x:1004:1004::/home/dana:/bin/bash', why: 'The new account is dana — matches yesterday\'s onboarding ticket.' }],
    'Module 1: pwd, ls -lt, head/tail on a real server.',
    ['Each task names its lesson part.']);

  RK.add({ track: TR, id: '4.4', dom: 4, short: 'Admin essentials', title: 'Run a Linux server: processes, services, users, packages, disks, network, SSH and cron',
    goal: 'Manage processes and systemd services, users, groups and sudo, packages, disks and networking, SSH keys and cron jobs.',
    kw: /\b(process|ps aux|top|kill|systemctl|systemd|journalctl|service|useradd|usermod|passwd|sudo|sudoers|visudo|apt|dnf|yum|package|df -h|du |mount|ip addr|ifconfig|ss -|netstat|cron|crontab|ssh key)/,
    parts: [
      P('Processes and services', 'Inspect and control processes and manage systemd services and their logs.',
        SEC('lnx7', [0]) + pro('systemctl status shows the last log lines; journalctl -u name -n 50 shows the rest. Read them before restarting — the restart erases the moment of failure.') + trap('kill sends SIGTERM (polite). kill -9 cannot be caught — use it only when TERM fails, because the process cannot clean up.'),
        [['Which command shows why a systemd service failed?', 'journalctl -u name', ['ps aux', 'systemctl enable name', 'df -h'], 'Unit logs.'],
         ['Which command makes a service start at boot?', 'systemctl enable name', ['systemctl start name', 'service boot name', 'crontab -e'], 'Enable.']],
        'lxx-proc'),
      P('Users, groups and sudo', 'Create and manage users and groups and control sudo access.',
        SEC('lnx7', [1]) + pro('Give admins individual accounts plus sudo, never a shared root password. sudo logs who ran what — shared root logs nothing useful.') + trap('usermod -G without -a replaces every supplementary group the user had. Always -aG.'),
        [['Which command adds an existing user to the docker group safely?', 'usermod -aG docker user', ['usermod -G docker user', 'useradd -G docker user', 'groupadd docker user'], 'Append.'],
         ['Which file defines sudo rules (edit with visudo)?', '/etc/sudoers (and /etc/sudoers.d/)', ['/etc/passwd', '/etc/shadow', '/etc/group'], 'sudoers.']],
        'lxx-users'),
      P('Packages, disks and networking', 'Install updates, check disk usage and inspect network configuration.',
        SEC('lnx7', [2]) + pro('Alert on disks at 80%, not 97%. And put a size cap on logs (logrotate, journald SystemMaxUse) on every server.') + trap('Deleting a log file that a process still has open does not free the space until the process restarts — truncate it instead (truncate -s 0 file).'),
        [['Which command shows free space per filesystem?', 'df -h', ['du -sh', 'free -h', 'lsblk -f'], 'Disk free.'],
         ['Which modern command replaces ifconfig?', 'ip addr', ['netstat -i', 'route', 'iwconfig'], 'iproute2.']],
        'lxx-sysinfo'),
      P('SSH keys and cron', 'Set up SSH key logins and schedule jobs with cron.',
        SEC('lnx7', [3]) + pro('Redirect cron job output to a log (>> /var/log/job.log 2>&1). Silent cron failures are found weeks later, when the backups you thought you had are missing.') + trap('Cron runs with a minimal PATH and no profile — use full paths to commands and files in crontab entries.'),
        [['What does the cron schedule "0 2 * * *" mean?', 'Every day at 02:00', ['Every 2 minutes', 'Every 2 hours', 'At 00:02 on day 2'], 'min hour dom mon dow.'],
         ['Which command edits the current user\'s crontab?', 'crontab -e', ['cron -e', 'vi /etc/cron', 'systemctl edit cron'], 'Edit.']],
        'lx-cron')
    ],
    wrap: { recap: ['ps aux, top, kill (TERM before -9); systemctl status/start/stop/restart/enable; journalctl -u.', 'useradd -m -s, usermod -aG, passwd -l, id; sudo via sudo/wheel group; visudo.', 'apt update && upgrade (dnf upgrade on RHEL); df -h, du -sh | sort -h; truncate open logs.', 'ip addr, ip route, ss -tulpn, resolvectl.', 'SSH keys: ~/.ssh 700, authorized_keys 600, owned by the user.', 'cron: m h dom mon dow; full paths; log output.'], lab: 'lxx-admin-wrap' }
  });

  // ---------- extras + cards ----------
  RK.extra(TR, '4.3', [
    ['Which test checks that a file exists and is a regular file?', '[ -f file ]', ['[ -d file ]', '[ -z file ]', '[ -x file ]'], 'File test.'],
    ['Which variable holds the script\'s own name?', '$0', ['$1', '$#', '$$'], 'Script name.'],
    ['What does set -u do?', 'Treats use of an unset variable as an error', ['Prints each command', 'Ignores errors', 'Exports variables'], 'Unset variables.'],
    ['Which construct runs cleanup when the script exits?', 'trap \'cleanup\' EXIT', ['on_exit cleanup', 'finally cleanup', 'defer cleanup'], 'trap.'],
    ['Which statement matches a value against several patterns?', 'case … esac', ['switch', 'select only', 'match'], 'case.'],
    ['What does set -x do?', 'Prints each command as it runs (debugging)', ['Exits on error', 'Disables globbing', 'Exports all variables'], 'Trace.']
  ]);
  RK.extra(TR, '4.4', [
    ['Which command shows memory usage in human units?', 'free -h', ['df -h', 'du -h', 'top -m'], 'Memory.'],
    ['Which group grants sudo on RHEL-family systems?', 'wheel', ['sudo', 'admin', 'root'], 'wheel.'],
    ['Which command locks a user\'s password?', 'passwd -l user', ['userdel user', 'usermod -G user', 'chage -l user'], 'Lock.'],
    ['Which command lists block devices and partitions?', 'lsblk', ['df', 'ls /dev only', 'mount -a'], 'Block devices.'],
    ['Which signal does kill send by default?', 'SIGTERM (15)', ['SIGKILL (9)', 'SIGHUP (1)', 'SIGSTOP'], 'Polite stop.']
  ]);
  RK.cards(TR, '1.1', [['/etc /var/log /home', 'Config, logs, users.'], ['ls -la', 'All files with details.'], ['rm -r', 'No recycle bin — look first.']]);
  RK.cards(TR, '2.1', [['2>&1', 'Send stderr to where stdout goes.'], ['sort | uniq -c | sort -rn', 'Top-N counts.'], ['tee', 'Save and pass through.']]);
  RK.cards(TR, '3.1', [['755 / 644 / 600', 'Programs / files / secrets.'], ['Shebang', '#!/usr/bin/env bash.'], ['find -mtime +30', 'Older than 30 days.']]);
  RK.cards(TR, '4.1', [['awk BEGIN/END', 'Before/after all lines.'], ['c[$1]++', 'Group-by count.'], ['printf', 'Aligned reports.']]);
  RK.cards(TR, '4.2', [['sed -i.bak', 'In-place edit with backup.'], ['find -perm -4000', 'SUID audit.'], ['-print0 | xargs -0', 'Spaces-safe pipelines.']]);
  RK.cards(TR, '4.3', [['$# $@ $?', 'Arg count, all args, last exit code.'], ['set -euo pipefail', 'Fail fast.'], ['while IFS= read -r', 'Read a file line by line.']]);
  RK.cards(TR, '4.4', [['journalctl -u', 'Logs for one service.'], ['usermod -aG', 'Append a group.'], ['du | sort -h', 'Find what fills the disk.']]);
})();
