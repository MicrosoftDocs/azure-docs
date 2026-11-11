---
title: Reference - DISA STIG benchmarks for Red Hat Enterprise Linux via Machine Configuration
description: Reference - DISA STIG benchmarks for Red Hat Enterprise Linux via Machine Configuration
ms.date: 11/04/2026
author: pallakatos
ms.author: pallakatos
ms.topic: reference
ms.custom: generated
---

# DISA STIG benchmarks for Red Hat Enterprise Linux

This article provides detailed information about the DISA STIG benchmarks for Red Hat Enterprise Linux, including supported benchmarks, mismatched rules, remediation support, and configurable parameters across all supported versions.

DISA STIG baselines are in **[Public Preview]**.

## Supported benchmarks

|Red Hat Enterprise Linux Version|Benchmark Title|
|---|---|
|RHEL 8|[DISA STIG RHEL 8 V2R6](#disa-stig-rhel-8-v2r6)|
|RHEL 9|[DISA STIG RHEL 9 V2R7](#disa-stig-rhel-9-v2r7)|

> [!NOTE]
> Auto-remediation is in **[Public Preview]**.
> Remediation must be enabled separately and is available only for rules marked **Yes** in the **Remediation** column. It uses configured parameter values, or the defaults shown when no overrides are provided. Other rules remain audit-only. Review and test changes before enabling remediation broadly.

Supported parameters and remediations will expand over time. To request additional support, [open an issue in the kompli repository](https://github.com/microsoft/kompli/issues).

## DISA STIG RHEL 8 V2R6

### Rules

|Rule|Parameters|Default values|Remediation|
|---|---|---|---|
|SV-230221 RHEL 8 must be a vendor-supported release.|None|-|No|
|SV-230228 All RHEL 8 remote access methods must be monitored.|None|-|No|
|SV-230231 RHEL 8 must encrypt all stored passwords with a FIPS 140-2 approved cryptographic hashing algorithm.|None|-|No|
|SV-230232 RHEL 8 must employ FIPS 140-2 approved cryptographic hashing algorithms for all stored passwords.|None|-|No|
|SV-230233 The RHEL 8 shadow password suite must be configured to use a sufficient number of hashing rounds.|None|-|No|
|SV-230234 RHEL 8 operating systems booted with United Extensible Firmware Interface (UEFI) must require authentication upon booting into single-user mode and maintenance.|None|-|No|
|SV-230235 RHEL 8 operating systems booted with a BIOS must require authentication upon booting into single-user and maintenance modes.|None|-|No|
|SV-230236 RHEL 8 operating systems must require authentication upon booting into rescue mode.|None|-|No|
|SV-230237 The RHEL 8 pam\_unix.so module must be configured in the password-auth file to use a FIPS 140-2 approved cryptographic hashing algorithm for system authentication.|None|-|No|
|SV-230238 RHEL 8 must prevent system daemons from using Kerberos for authentication.|None|-|No|
|SV-230239 The krb5-workstation package must not be installed on RHEL 8.|None|-|No|
|SV-230240 RHEL 8 must use a Linux Security Module configured to enforce limits on system services.|None|-|No|
|SV-230241 RHEL 8 must have policycoreutils package installed.|None|-|No|
|SV-230244 RHEL 8 must be configured so that all network connections associated with SSH traffic terminate after becoming unresponsive.|None|-|No|
|SV-230245 The RHEL 8 /var/log/messages file must have mode 0640 or less permissive.|None|-|Yes|
|SV-230246 The RHEL 8 /var/log/messages file must be owned by root.|None|-|Yes|
|SV-230247 The RHEL 8 /var/log/messages file must be group-owned by root.|None|-|Yes|
|SV-230248 The RHEL 8 /var/log directory must have mode 0755 or less permissive.|None|-|Yes|
|SV-230249 The RHEL 8 /var/log directory must be owned by root.|None|-|Yes|
|SV-230250 The RHEL 8 /var/log directory must be group-owned by root.|None|-|Yes|
|SV-230253 RHEL 8 must ensure the SSH server uses strong entropy.|None|-|No|
|SV-230257 RHEL 8 system commands must have mode 755 or less permissive.|None|-|No|
|SV-230258 RHEL 8 system commands must be owned by root.|None|-|No|
|SV-230259 RHEL 8 system commands must be group-owned by root or a system account.|None|-|No|
|SV-230260 RHEL 8 library files must have mode 755 or less permissive.|None|-|No|
|SV-230261 RHEL 8 library files must be owned by root.|None|-|No|
|SV-230262 RHEL 8 library files must be group-owned by root.|None|-|No|
|SV-230264 RHEL 8 must prevent the installation of software, patches, service packs, device drivers, or operating system components from a repository without verification they have been digitally signed using a certificate that is issued by a Certificate Authority (CA) that is recognized and approved by the organization.|None|-|No|
|SV-230265 RHEL 8 must prevent the installation of software, patches, service packs, device drivers, or operating system components of local packages without verification they have been digitally signed using a certificate that is issued by a Certificate Authority (CA) that is recognized and approved by the organization.|None|-|No|
|SV-230266 RHEL 8 must prevent the loading of a new kernel for later execution.|None|-|Yes|
|SV-230267 RHEL 8 must enable kernel parameters to enforce discretionary access control on symlinks.|None|-|Yes|
|SV-230268 RHEL 8 must enable kernel parameters to enforce discretionary access control on hardlinks.|None|-|Yes|
|SV-230269 RHEL 8 must restrict access to the kernel message buffer.|None|-|Yes|
|SV-230270 RHEL 8 must prevent kernel profiling by unprivileged users.|None|-|Yes|
|SV-230271 RHEL 8 must require users to provide a password for privilege escalation.|None|-|No|
|SV-230272 RHEL 8 must require users to reauthenticate for privilege escalation.|None|-|No|
|SV-230273 RHEL 8 must have the packages required for multifactor authentication installed.|None|-|No|
|SV-230280 RHEL 8 must implement address space layout randomization (ASLR) to protect its memory from unauthorized code execution.|None|-|Yes|
|SV-230281 YUM must remove all software components after updated versions have been installed on RHEL 8.|None|-|No|
|SV-230282 RHEL 8 must enable the SELinux targeted policy.|None|-|No|
|SV-230283 There must be no shosts.equiv files on the RHEL 8 operating system.|None|-|No|
|SV-230284 There must be no .shosts files on the RHEL 8 operating system.|None|-|No|
|SV-230286 The RHEL 8 SSH public host key files must have mode 0644 or less permissive.|None|-|No|
|SV-230287 The RHEL 8 SSH private host key files must have mode 0640 or less permissive.|None|-|No|
|SV-230288 The RHEL 8 SSH daemon must perform strict mode checking of home directory configuration files.|None|-|No|
|SV-230290 The RHEL 8 SSH daemon must not allow authentication using known host's authentication.|None|-|No|
|SV-230291 The RHEL 8 SSH daemon must not allow Kerberos authentication, except to fulfill documented and validated mission requirements.|None|-|No|
|SV-230292 RHEL 8 must use a separate file system for /var.|None|-|No|
|SV-230293 RHEL 8 must use a separate file system for /var/log.|None|-|No|
|SV-230294 RHEL 8 must use a separate file system for the system audit data path.|None|-|No|
|SV-230295 A separate RHEL 8 filesystem must be used for the /tmp directory.|None|-|No|
|SV-230296 RHEL 8 must not permit direct logons to the root account using remote access via SSH.|None|-|No|
|SV-230298 The rsyslog service must be running in RHEL 8.|None|-|No|
|SV-230299 RHEL 8 must prevent files with the setuid and setgid bit set from being executed on file systems that contain user home directories.|None|-|No|
|SV-230300 RHEL 8 must prevent files with the setuid and setgid bit set from being executed on the /boot directory.|None|-|No|
|SV-230301 RHEL 8 must prevent special devices on non-root local partitions.|None|-|No|
|SV-230306 RHEL 8 must prevent code from being executed on file systems that are imported via Network File System (NFS).|None|-|No|
|SV-230307 RHEL 8 must prevent special devices on file systems that are imported via Network File System (NFS).|None|-|No|
|SV-230308 RHEL 8 must prevent files with the setuid and setgid bit set from being executed on file systems that are imported via Network File System (NFS).|None|-|No|
|SV-230311 RHEL 8 must disable the kernel.core\_pattern.|None|-|No|
|SV-230312 RHEL 8 must disable acquiring, saving, and processing core dumps.|None|-|No|
|SV-230313 RHEL 8 must disable core dumps for all users.|None|-|No|
|SV-230314 RHEL 8 must disable storing core dumps.|None|-|No|
|SV-230315 RHEL 8 must disable core dump backtraces.|None|-|No|
|SV-230316 For RHEL 8 systems using Domain Name Servers (DNS) resolution, at least two name servers must be configured.|None|-|No|
|SV-230320 All RHEL 8 local interactive users must have a home directory assigned in the /etc/passwd file.|None|-|No|
|SV-230321 All RHEL 8 local interactive user home directories must have mode 0750 or less permissive.|None|-|No|
|SV-230324 All RHEL 8 local interactive user accounts must be assigned a home directory upon creation.|None|-|No|
|SV-230325 All RHEL 8 local initialization files must have mode 0740 or less permissive.|None|-|No|
|SV-230328 A separate RHEL 8 filesystem must be used for user home directories (such as /home or an equivalent).|None|-|No|
|SV-230329 Unattended or automatic logon via the RHEL 8 graphical user interface must not be allowed.|None|-|No|
|SV-230330 RHEL 8 must not allow users to override SSH environment variables.|None|-|No|
|SV-230332 RHEL 8 must automatically lock an account when three unsuccessful logon attempts occur.|None|-|No|
|SV-230333 RHEL 8 must automatically lock an account when three unsuccessful logon attempts occur.|None|-|No|
|SV-230334 RHEL 8 must automatically lock an account when three unsuccessful logon attempts occur during a 15-minute time period.|None|-|No|
|SV-230335 RHEL 8 must automatically lock an account when three unsuccessful logon attempts occur during a 15-minute time period.|None|-|No|
|SV-230336 RHEL 8 must automatically lock an account until the locked account is released by an administrator when three unsuccessful logon attempts occur during a 15-minute time period.|None|-|No|
|SV-230337 RHEL 8 must automatically lock an account until the locked account is released by an administrator when three unsuccessful logon attempts occur during a 15-minute time period.|None|-|No|
|SV-230340 RHEL 8 must prevent system messages from being presented when three unsuccessful logon attempts occur.|None|-|No|
|SV-230341 RHEL 8 must prevent system messages from being presented when three unsuccessful logon attempts occur.|None|-|No|
|SV-230342 RHEL 8 must log user name information when unsuccessful logon attempts occur.|None|-|No|
|SV-230343 RHEL 8 must log user name information when unsuccessful logon attempts occur.|None|-|No|
|SV-230344 RHEL 8 must include root when automatically locking an account until the locked account is released by an administrator when three unsuccessful logon attempts occur during a 15-minute time period.|None|-|No|
|SV-230345 RHEL 8 must include root when automatically locking an account until the locked account is released by an administrator when three unsuccessful logon attempts occur during a 15-minute time period.|None|-|No|
|SV-230346 RHEL 8 must limit the number of concurrent sessions to ten for all accounts and/or account types.|None|-|No|
|SV-230351 RHEL 8 must be able to initiate directly a session lock for all connection types using smartcard when the smartcard is removed.|None|-|No|
|SV-230354 RHEL 8 must prevent a user from overriding the session lock-delay setting for the graphical user interface.|None|-|No|
|SV-230356 RHEL 8 must ensure the password complexity module is enabled in the password-auth file.|None|-|No|
|SV-230357 RHEL 8 must enforce password complexity by requiring that at least one uppercase character be used.|None|-|No|
|SV-230358 RHEL 8 must enforce password complexity by requiring that at least one lower-case character be used.|None|-|No|
|SV-230359 RHEL 8 must enforce password complexity by requiring that at least one numeric character be used.|None|-|No|
|SV-230360 RHEL 8 must require the maximum number of repeating characters of the same character class be limited to four when passwords are changed.|None|-|No|
|SV-230361 RHEL 8 must require the maximum number of repeating characters be limited to three when passwords are changed.|None|-|No|
|SV-230362 RHEL 8 must require the change of at least four character classes when passwords are changed.|None|-|No|
|SV-230363 RHEL 8 must require the change of at least 8 characters when passwords are changed.|None|-|No|
|SV-230364 RHEL 8 passwords must have a 24 hours/1 day minimum password lifetime restriction in /etc/shadow.|None|-|No|
|SV-230365 RHEL 8 passwords for new users or password changes must have a 24 hours/1 day minimum password lifetime restriction in /etc/login.defs.|None|-|No|
|SV-230366 RHEL 8 user account passwords must have a 60-day maximum password lifetime restriction.|None|-|No|
|SV-230367 RHEL 8 user account passwords must be configured so that existing passwords are restricted to a 60-day maximum lifetime.|None|-|No|
|SV-230369 RHEL 8 passwords must have a minimum of 15 characters.|None|-|No|
|SV-230370 RHEL 8 passwords for new users must have a minimum of 15 characters.|None|-|No|
|SV-230371 RHEL 8 duplicate User IDs (UIDs) must not exist for interactive users.|None|-|No|
|SV-230373 RHEL 8 account identifiers (individuals, groups, roles, and devices) must be disabled after 35 days of inactivity.|None|-|No|
|SV-230375 All RHEL 8 passwords must contain at least one special character.|None|-|No|
|SV-230376 RHEL 8 must prohibit the use of cached authentications after one day.|None|-|No|
|SV-230377 RHEL 8 must prevent the use of dictionary words for passwords.|None|-|No|
|SV-230378 RHEL 8 must enforce a delay of at least four seconds between logon prompts following a failed logon attempt.|None|-|No|
|SV-230380 RHEL 8 must not allow accounts configured with blank or null passwords.|None|-|No|
|SV-230382 RHEL 8 must display the date and time of the last successful account logon upon an SSH logon.|None|-|No|
|SV-230383 RHEL 8 must define default permissions for all authenticated users in such a way that the user can only read and modify their own files.|None|-|No|
|SV-230386 The RHEL 8 audit system must be configured to audit the execution of privileged functions and prevent all software from executing at higher privilege levels than users executing the software.|None|-|No|
|SV-230388 The RHEL 8 System Administrator (SA) and Information System Security Officer (ISSO) (at a minimum) must be alerted of an audit processing failure event.|None|-|No|
|SV-230389 The RHEL 8 Information System Security Officer (ISSO) and System Administrator (SA) (at a minimum) must have mail aliases to be notified of an audit processing failure.|None|-|No|
|SV-230390 The RHEL 8 System must take appropriate action when an audit processing failure occurs.|None|-|No|
|SV-230392 The RHEL 8 audit system must take appropriate action when the audit storage volume is full.|None|-|No|
|SV-230393 The RHEL 8 audit system must audit local events.|None|-|No|
|SV-230394 RHEL 8 must label all off-loaded audit logs before sending them to the central log server.|None|-|No|
|SV-230395 RHEL 8 must resolve audit information before writing to disk.|None|-|No|
|SV-230396 RHEL 8 audit logs must have a mode of 0600 or less permissive to prevent unauthorized read access.|None|-|No|
|SV-230397 RHEL 8 audit logs must be owned by root to prevent unauthorized read access.|None|-|No|
|SV-230398 RHEL 8 audit logs must be group-owned by root to prevent unauthorized read access.|None|-|No|
|SV-230399 RHEL 8 audit log directory must be owned by root to prevent unauthorized read access.|None|-|No|
|SV-230400 RHEL 8 audit log directory must be group-owned by root to prevent unauthorized read access.|None|-|No|
|SV-230401 RHEL 8 audit log directory must have a mode of 0700 or less permissive to prevent unauthorized read access.|None|-|No|
|SV-230402 RHEL 8 audit system must protect auditing rules from unauthorized change.|None|-|No|
|SV-230403 RHEL 8 audit system must protect logon UIDs from unauthorized change.|None|-|No|
|SV-230404 RHEL 8 must generate audit records for all account creations, modifications, disabling, and termination events that affect /etc/shadow.|None|-|No|
|SV-230405 RHEL 8 must generate audit records for all account creations, modifications, disabling, and termination events that affect /etc/security/opasswd.|None|-|No|
|SV-230406 RHEL 8 must generate audit records for all account creations, modifications, disabling, and termination events that affect /etc/passwd.|None|-|No|
|SV-230407 RHEL 8 must generate audit records for all account creations, modifications, disabling, and termination events that affect /etc/gshadow.|None|-|No|
|SV-230408 RHEL 8 must generate audit records for all account creations, modifications, disabling, and termination events that affect /etc/group.|None|-|No|
|SV-230409 RHEL 8 must generate audit records for all account creations, modifications, disabling, and termination events that affect /etc/sudoers.|None|-|No|
|SV-230410 RHEL 8 must generate audit records for all account creations, modifications, disabling, and termination events that affect /etc/sudoers.d/.|None|-|No|
|SV-230411 The RHEL 8 audit package must be installed.|None|-|No|
|SV-230412 Successful/unsuccessful uses of the su command in RHEL 8 must generate an audit record.|None|-|No|
|SV-230413 The RHEL 8 audit system must be configured to audit any usage of the setxattr, fsetxattr, lsetxattr, removexattr, fremovexattr, and lremovexattr system calls.|None|-|No|
|SV-230418 Successful/unsuccessful uses of the chage command in RHEL 8 must generate an audit record.|None|-|No|
|SV-230419 Successful/unsuccessful uses of the chcon command in RHEL 8 must generate an audit record.|None|-|No|
|SV-230421 Successful/unsuccessful uses of the ssh-agent in RHEL 8 must generate an audit record.|None|-|No|
|SV-230422 Successful/unsuccessful uses of the passwd command in RHEL 8 must generate an audit record.|None|-|No|
|SV-230423 Successful/unsuccessful uses of the mount command in RHEL 8 must generate an audit record.|None|-|No|
|SV-230424 Successful/unsuccessful uses of the umount command in RHEL 8 must generate an audit record.|None|-|No|
|SV-230425 Successful/unsuccessful uses of the mount syscall in RHEL 8 must generate an audit record.|None|-|No|
|SV-230426 Successful/unsuccessful uses of the unix\_update in RHEL 8 must generate an audit record.|None|-|No|
|SV-230427 Successful/unsuccessful uses of postdrop in RHEL 8 must generate an audit record.|None|-|No|
|SV-230428 Successful/unsuccessful uses of postqueue in RHEL 8 must generate an audit record.|None|-|No|
|SV-230429 Successful/unsuccessful uses of semanage in RHEL 8 must generate an audit record.|None|-|No|
|SV-230430 Successful/unsuccessful uses of setfiles in RHEL 8 must generate an audit record.|None|-|No|
|SV-230431 Successful/unsuccessful uses of userhelper in RHEL 8 must generate an audit record.|None|-|No|
|SV-230432 Successful/unsuccessful uses of setsebool in RHEL 8 must generate an audit record.|None|-|No|
|SV-230433 Successful/unsuccessful uses of unix\_chkpwd in RHEL 8 must generate an audit record.|None|-|No|
|SV-230434 Successful/unsuccessful uses of the ssh-keysign in RHEL 8 must generate an audit record.|None|-|No|
|SV-230435 Successful/unsuccessful uses of the setfacl command in RHEL 8 must generate an audit record.|None|-|No|
|SV-230436 Successful/unsuccessful uses of the pam\_timestamp\_check command in RHEL 8 must generate an audit record.|None|-|No|
|SV-230437 Successful/unsuccessful uses of the newgrp command in RHEL 8 must generate an audit record.|None|-|No|
|SV-230438 Successful/unsuccessful uses of the init\_module and finit\_module system calls in RHEL 8 must generate an audit record.|None|-|No|
|SV-230439 Successful/unsuccessful uses of the rename, unlink, rmdir, renameat, and unlinkat system calls in RHEL 8 must generate an audit record.|None|-|No|
|SV-230444 Successful/unsuccessful uses of the gpasswd command in RHEL 8 must generate an audit record.|None|-|No|
|SV-230446 Successful/unsuccessful uses of the delete\_module command in RHEL 8 must generate an audit record.|None|-|No|
|SV-230447 Successful/unsuccessful uses of the crontab command in RHEL 8 must generate an audit record.|None|-|No|
|SV-230448 Successful/unsuccessful uses of the chsh command in RHEL 8 must generate an audit record.|None|-|No|
|SV-230449 Successful/unsuccessful uses of the truncate, ftruncate, creat, open, openat, and open\_by\_handle\_at system calls in RHEL 8 must generate an audit record.|None|-|No|
|SV-230455 Successful/unsuccessful uses of the chown, fchown, fchownat, and lchown system calls in RHEL 8 must generate an audit record.|None|-|No|
|SV-230456 Successful/unsuccessful uses of the chmod, fchmod, and fchmodat system calls in RHEL 8 must generate an audit record.|None|-|No|
|SV-230462 Successful/unsuccessful uses of the sudo command in RHEL 8 must generate an audit record.|None|-|No|
|SV-230463 Successful/unsuccessful uses of the usermod command in RHEL 8 must generate an audit record.|None|-|No|
|SV-230464 Successful/unsuccessful uses of the chacl command in RHEL 8 must generate an audit record.|None|-|No|
|SV-230465 Successful/unsuccessful uses of the kmod command in RHEL 8 must generate an audit record.|None|-|No|
|SV-230467 Successful/unsuccessful modifications to the lastlog file in RHEL 8 must generate an audit record.|None|-|No|
|SV-230471 RHEL 8 must allow only the Information System Security Manager (ISSM) (or individuals or roles appointed by the ISSM) to select which auditable events are to be audited.|None|-|Yes|
|SV-230472 RHEL 8 audit tools must have a mode of 0755 or less permissive.|None|-|Yes|
|SV-230473 RHEL 8 audit tools must be owned by root.|None|-|Yes|
|SV-230474 RHEL 8 audit tools must be group-owned by root.|None|-|Yes|
|SV-230477 RHEL 8 must have the packages required for offloading audit logs installed.|None|-|No|
|SV-230478 RHEL 8 must have the packages required for encrypting offloaded audit logs installed.|None|-|No|
|SV-230480 RHEL 8 must take appropriate action when the internal event queue is full.|None|-|No|
|SV-230482 RHEL 8 must authenticate the remote logging server for off-loading audit logs.|None|-|No|
|SV-230483 RHEL 8 must take action when allocated audit record storage volume reaches 75 percent of the repository maximum audit record storage capacity.|None|-|No|
|SV-230485 RHEL 8 must disable the chrony daemon from acting as a server.|None|-|No|
|SV-230486 RHEL 8 must disable network management of the chrony daemon.|None|-|No|
|SV-230487 RHEL 8 must not have the telnet-server package installed.|None|-|No|
|SV-230488 RHEL 8 must not have any automated bug reporting tools installed.|None|-|No|
|SV-230489 RHEL 8 must not have the sendmail package installed.|None|-|No|
|SV-230494 RHEL 8 must disable the asynchronous transfer mode (ATM) protocol.|None|-|No|
|SV-230495 RHEL 8 must disable the controller area network (CAN) protocol.|None|-|No|
|SV-230496 RHEL 8 must disable the stream control transmission protocol (SCTP).|None|-|No|
|SV-230497 RHEL 8 must disable the transparent inter-process communication (TIPC) protocol.|None|-|No|
|SV-230498 RHEL 8 must disable mounting of cramfs.|None|-|No|
|SV-230499 RHEL 8 must disable IEEE 1394 (FireWire) Support.|None|-|No|
|SV-230502 The RHEL 8 file system automounter must be disabled.|None|-|No|
|SV-230503 RHEL 8 must be configured to disable USB mass storage.|None|-|No|
|SV-230505 A firewall must be installed on RHEL 8.|None|-|No|
|SV-230507 RHEL 8 Bluetooth must be disabled.|None|-|No|
|SV-230508 RHEL 8 must mount /dev/shm with the nodev option.|None|-|No|
|SV-230509 RHEL 8 must mount /dev/shm with the nosuid option.|None|-|No|
|SV-230510 RHEL 8 must mount /dev/shm with the noexec option.|None|-|No|
|SV-230511 RHEL 8 must mount /tmp with the nodev option.|None|-|No|
|SV-230512 RHEL 8 must mount /tmp with the nosuid option.|None|-|No|
|SV-230513 RHEL 8 must mount /tmp with the noexec option.|None|-|No|
|SV-230514 RHEL 8 must mount /var/log with the nodev option.|None|-|No|
|SV-230515 RHEL 8 must mount /var/log with the nosuid option.|None|-|No|
|SV-230516 RHEL 8 must mount /var/log with the noexec option.|None|-|No|
|SV-230517 RHEL 8 must mount /var/log/audit with the nodev option.|None|-|No|
|SV-230518 RHEL 8 must mount /var/log/audit with the nosuid option.|None|-|No|
|SV-230519 RHEL 8 must mount /var/log/audit with the noexec option.|None|-|No|
|SV-230520 RHEL 8 must mount /var/tmp with the nodev option.|None|-|No|
|SV-230521 RHEL 8 must mount /var/tmp with the nosuid option.|None|-|No|
|SV-230522 RHEL 8 must mount /var/tmp with the noexec option.|None|-|No|
|SV-230523 The RHEL 8 fapolicy module must be installed.|None|-|No|
|SV-230525 A firewall must be able to protect against or limit the effects of Denial of Service (DoS) attacks by ensuring RHEL 8 can implement rate-limiting measures on impacted network interfaces.|None|-|No|
|SV-230526 All RHEL 8 networked systems must have and implement SSH to protect the confidentiality and integrity of transmitted and received information, as well as information during preparation for transmission.|None|-|No|
|SV-230527 RHEL 8 must force a frequent session key renegotiation for SSH connections to the server.|None|-|No|
|SV-230529 The x86 Ctrl-Alt-Delete key sequence must be disabled on RHEL 8.|None|-|No|
|SV-230530 The x86 Ctrl-Alt-Delete key sequence in RHEL 8 must be disabled if a graphical user interface is installed.|None|-|No|
|SV-230531 The systemd Ctrl-Alt-Delete burst key sequence in RHEL 8 must be disabled.|None|-|No|
|SV-230532 The debug-shell systemd service must be disabled on RHEL 8.|None|-|No|
|SV-230533 The Trivial File Transfer Protocol (TFTP) server package must not be installed if not required for RHEL 8 operational support.|None|-|No|
|SV-230534 The root account must be the only account having unrestricted access to the RHEL 8 system.|None|-|No|
|SV-230535 RHEL 8 must prevent IPv6 Internet Control Message Protocol (ICMP) redirect messages from being accepted.|None|-|Yes|
|SV-230536 RHEL 8 must not send Internet Control Message Protocol (ICMP) redirects.|None|-|Yes|
|SV-230537 RHEL 8 must not respond to Internet Control Message Protocol (ICMP) echoes sent to a broadcast address.|None|-|Yes|
|SV-230538 RHEL 8 must not forward IPv6 source-routed packets.|None|-|Yes|
|SV-230539 RHEL 8 must not forward IPv6 source-routed packets by default.|None|-|Yes|
|SV-230540 RHEL 8 must not enable IPv6 packet forwarding unless the system is a router.|None|-|Yes|
|SV-230541 RHEL 8 must not accept router advertisements on all IPv6 interfaces.|None|-|Yes|
|SV-230542 RHEL 8 must not accept router advertisements on all IPv6 interfaces by default.|None|-|Yes|
|SV-230543 RHEL 8 must not allow interfaces to perform Internet Control Message Protocol (ICMP) redirects by default.|None|-|Yes|
|SV-230544 RHEL 8 must ignore IPv6 Internet Control Message Protocol (ICMP) redirect messages.|None|-|Yes|
|SV-230545 RHEL 8 must disable access to network bpf syscall from unprivileged processes.|None|-|Yes|
|SV-230546 RHEL 8 must restrict usage of ptrace to descendant  processes.|None|-|Yes|
|SV-230547 RHEL 8 must restrict exposed kernel pointer addresses access.|None|-|No|
|SV-230548 RHEL 8 must disable the use of user namespaces.|None|-|Yes|
|SV-230549 RHEL 8 must use reverse path filtering on all IPv4 interfaces.|None|-|Yes|
|SV-230550 RHEL 8 must be configured to prevent unrestricted mail relaying.|None|-|No|
|SV-230553 The graphical display manager must not be installed on RHEL 8 unless approved.|None|-|No|
|SV-230554 RHEL 8 network interfaces must not be in promiscuous mode.|None|-|No|
|SV-230555 RHEL 8 remote X connections for interactive users must be disabled unless to fulfill documented and validated mission requirements.|None|-|No|
|SV-230556 The RHEL 8 SSH daemon must prevent remote hosts from connecting to the proxy display.|None|-|No|
|SV-230557 If the Trivial File Transfer Protocol (TFTP) server is required, the RHEL 8 TFTP daemon must be configured to operate in secure mode.|None|-|No|
|SV-230558 A File Transfer Protocol (FTP) server package must not be installed unless mission essential on RHEL 8.|None|-|No|
|SV-230559 The gssproxy package must not be installed unless mission essential on RHEL 8.|None|-|No|
|SV-230560 The iprutils package must not be installed unless mission essential on RHEL 8.|None|-|No|
|SV-230561 The tuned package must not be installed unless mission essential on RHEL 8.|None|-|No|
|SV-237640 The krb5-server package must not be installed on RHEL 8.|None|-|No|
|SV-237641 RHEL 8 must restrict privilege elevation to authorized personnel.|None|-|No|
|SV-237642 RHEL 8 must use the invoking user's password for privilege escalation when using "sudo".|None|-|No|
|SV-237643 RHEL 8 must require re-authentication when using the "sudo" command.|None|-|No|
|SV-244519 RHEL 8 must display a banner before granting local or remote access to the system via a graphical user logon.|None|-|No|
|SV-244523 RHEL 8 operating systems must require authentication upon booting into emergency mode.|None|-|No|
|SV-244524 The RHEL 8 pam\_unix.so module must be configured in the system-auth file to use a FIPS 140-2 approved cryptographic hashing algorithm for system authentication.|None|-|No|
|SV-244525 RHEL 8 must be configured so that all network connections associated with SSH traffic are terminated after 10 minutes of becoming unresponsive.|None|-|No|
|SV-244527 RHEL 8 must have the packages required to use the hardware random number generator entropy gatherer service.|None|-|No|
|SV-244528 The RHEL 8 SSH daemon must not allow GSSAPI authentication, except to fulfill documented and validated mission requirements.|None|-|No|
|SV-244529 RHEL 8 must use a separate file system for /var/tmp.|None|-|No|
|SV-244530 RHEL 8 must prevent files with the setuid and setgid bit set from being executed on the /boot/efi directory.|None|-|No|
|SV-244536 RHEL 8 must disable the user list at logon for graphical user interfaces.|None|-|No|
|SV-244539 RHEL 8 must prevent a user from overriding the screensaver lock-enabled setting for the graphical user interface.|None|-|No|
|SV-244541 RHEL 8 must not allow blank or null passwords in the password-auth file.|None|-|No|
|SV-244542 RHEL 8 audit records must contain information to establish what type of events occurred, the source of events, where events occurred, and the outcome of events.|None|-|No|
|SV-244543 RHEL 8 must notify the System Administrator (SA) and Information System Security Officer (ISSO) (at a minimum) when allocated audit record storage volume 75 percent utilization.|None|-|No|
|SV-244544 A firewall must be active on RHEL 8.|None|-|No|
|SV-244545 The RHEL 8 fapolicy module must be enabled.|None|-|No|
|SV-244547 RHEL 8 must have the USBGuard installed.|None|-|No|
|SV-244548 RHEL 8 must enable the USBGuard.|None|-|No|
|SV-244549 All RHEL 8 networked systems must have SSH installed.|None|-|No|
|SV-244550 RHEL 8 must prevent IPv4 Internet Control Message Protocol (ICMP) redirect messages from being accepted.|None|-|Yes|
|SV-244551 RHEL 8 must not forward IPv4 source-routed packets.|None|-|Yes|
|SV-244552 RHEL 8 must not forward IPv4 source-routed packets by default.|None|-|Yes|
|SV-244553 RHEL 8 must ignore IPv4 Internet Control Message Protocol (ICMP) redirect messages.|None|-|Yes|
|SV-244554 RHEL 8 must enable hardening for the Berkeley Packet Filter Just-in-time compiler.|None|-|Yes|
|SV-251706 The RHEL 8 operating system must not have accounts configured with blank or null passwords.|None|-|No|
|SV-251707 RHEL 8 library directories must have mode 755 or less permissive.|None|-|No|
|SV-251708 RHEL 8 library directories must be owned by root.|None|-|No|
|SV-251709 RHEL 8 library directories must be group-owned by root or a system account.|None|-|No|
|SV-251712 The RHEL 8 operating system must not be configured to bypass password requirements for privilege escalation.|None|-|No|
|SV-251713 RHEL 8 must ensure the password complexity module is enabled in the system-auth file.|None|-|No|
|SV-251718 The graphical display manager must not be the default target on RHEL 8 unless approved.|None|-|No|
|SV-257258 RHEL 8.7 and higher must terminate idle user sessions.|None|-|No|
|SV-279929 RHEL 8 must automatically exit interactive command shell user sessions after 10 minutes of inactivity.|None|-|No|
|SV-279930 RHEL 8 IP tunnels must use FIPS 140-3-approved cryptographic algorithms.|None|-|No|
|SV-279931 RHEL 8 must implement DOD-approved encryption in the bind package.|None|-|No|
|SV-279933 RHEL 8 must have the crypto-policies package installed.|None|-|No|

### Known assessment discrepancies

> [!NOTE]
> These rules can produce assessment results that differ from the DISA SCAP Compliance Checker (SCC).
> A rule is listed once if a discrepancy was observed in any tested scenario.

- SV-230232 RHEL 8 must employ FIPS 140-2 approved cryptographic hashing algorithms for all stored passwords.
- SV-230235 RHEL 8 operating systems booted with a BIOS must require authentication upon booting into single-user and maintenance modes.
- SV-230240 RHEL 8 must use a Linux Security Module configured to enforce limits on system services.
- SV-230300 RHEL 8 must prevent files with the setuid and setgid bit set from being executed on the /boot directory.
- SV-230306 RHEL 8 must prevent code from being executed on file systems that are imported via Network File System (NFS).
- SV-230307 RHEL 8 must prevent special devices on file systems that are imported via Network File System (NFS).
- SV-230308 RHEL 8 must prevent files with the setuid and setgid bit set from being executed on file systems that are imported via Network File System (NFS).
- SV-230324 All RHEL 8 local interactive user accounts must be assigned a home directory upon creation.
- SV-230328 A separate RHEL 8 filesystem must be used for user home directories (such as /home or an equivalent).
- SV-230329 Unattended or automatic logon via the RHEL 8 graphical user interface must not be allowed.
- SV-230332 RHEL 8 must automatically lock an account when three unsuccessful logon attempts occur.
- SV-230336 RHEL 8 must automatically lock an account until the locked account is released by an administrator when three unsuccessful logon attempts occur during a 15-minute time period.
- SV-230340 RHEL 8 must prevent system messages from being presented when three unsuccessful logon attempts occur.
- SV-230342 RHEL 8 must log user name information when unsuccessful logon attempts occur.
- SV-230344 RHEL 8 must include root when automatically locking an account until the locked account is released by an administrator when three unsuccessful logon attempts occur during a 15-minute time period.
- SV-230351 RHEL 8 must be able to initiate directly a session lock for all connection types using smartcard when the smartcard is removed.
- SV-230354 RHEL 8 must prevent a user from overriding the session lock-delay setting for the graphical user interface.
- SV-230357 RHEL 8 must enforce password complexity by requiring that at least one uppercase character be used.
- SV-230358 RHEL 8 must enforce password complexity by requiring that at least one lower-case character be used.
- SV-230359 RHEL 8 must enforce password complexity by requiring that at least one numeric character be used.
- SV-230375 All RHEL 8 passwords must contain at least one special character.
- SV-230502 The RHEL 8 file system automounter must be disabled.
- SV-230530 The x86 Ctrl-Alt-Delete key sequence in RHEL 8 must be disabled if a graphical user interface is installed.
- SV-230550 RHEL 8 must be configured to prevent unrestricted mail relaying.
- SV-230557 If the Trivial File Transfer Protocol (TFTP) server is required, the RHEL 8 TFTP daemon must be configured to operate in secure mode.
- SV-244519 RHEL 8 must display a banner before granting local or remote access to the system via a graphical user logon.
- SV-244525 RHEL 8 must be configured so that all network connections associated with SSH traffic are terminated after 10 minutes of becoming unresponsive.
- SV-244530 RHEL 8 must prevent files with the setuid and setgid bit set from being executed on the /boot/efi directory.
- SV-244536 RHEL 8 must disable the user list at logon for graphical user interfaces.
- SV-244539 RHEL 8 must prevent a user from overriding the screensaver lock-enabled setting for the graphical user interface.
- SV-279930 RHEL 8 IP tunnels must use FIPS 140-3-approved cryptographic algorithms.
- SV-279931 RHEL 8 must implement DOD-approved encryption in the bind package.

## DISA STIG RHEL 9 V2R7

### Rules

|Rule|Parameters|Default values|Remediation|
|---|---|---|---|
|SV-257777 RHEL 9 must be a vendor-supported release.|None|-|No|
|SV-257781 The graphical display manager must not be the default target on RHEL 9 unless approved.|None|-|No|
|SV-257782 RHEL 9 must enable the hardware random number generator entropy gatherer service.|None|-|No|
|SV-257783 RHEL 9 systemd-journald service must be enabled.|None|-|No|
|SV-257784 The systemd Ctrl-Alt-Delete burst key sequence in RHEL 9 must be disabled.|None|-|No|
|SV-257785 The x86 Ctrl-Alt-Delete key sequence must be disabled on RHEL 9.|None|-|No|
|SV-257786 RHEL 9 debug-shell systemd service must be disabled.|None|-|No|
|SV-257787 RHEL 9 must require a boot loader superuser password.|None|-|No|
|SV-257788 RHEL 9 must disable the ability of systemd to spawn an interactive boot process.|None|-|No|
|SV-257790 RHEL 9 /boot/grub2/grub.cfg file must be group-owned by root.|None|-|Yes|
|SV-257791 RHEL 9 /boot/grub2/grub.cfg file must be owned by root.|None|-|Yes|
|SV-257792 RHEL 9 must disable virtual system calls.|None|-|No|
|SV-257793 RHEL 9 must clear the page allocator to prevent use-after-free attacks.|None|-|No|
|SV-257794 RHEL 9 must clear memory when it is freed to prevent use-after-free attacks.|None|-|No|
|SV-257795 RHEL 9 must enable mitigations against processor-based vulnerabilities.|None|-|No|
|SV-257796 RHEL 9 must enable auditing of processes that start prior to the audit daemon.|None|-|No|
|SV-257797 RHEL 9 must restrict access to the kernel message buffer.|None|-|Yes|
|SV-257798 RHEL 9 must prevent kernel profiling by nonprivileged users.|None|-|Yes|
|SV-257799 RHEL 9 must prevent the loading of a new kernel for later execution.|None|-|Yes|
|SV-257800 RHEL 9 must restrict exposed kernel pointer addresses access.|None|-|Yes|
|SV-257801 RHEL 9 must enable kernel parameters to enforce discretionary access control (DAC) on hardlinks.|None|-|Yes|
|SV-257802 RHEL 9 must enable kernel parameters to enforce discretionary access (DAC) control on symlinks.|None|-|Yes|
|SV-257803 RHEL 9 must disable the kernel.core\_pattern.|None|-|No|
|SV-257804 RHEL 9 must be configured to disable the Asynchronous Transfer Mode kernel module.|None|-|No|
|SV-257805 RHEL 9 must be configured to disable the Controller Area Network kernel module.|None|-|No|
|SV-257806 RHEL 9 must be configured to disable the FireWire kernel module.|None|-|No|
|SV-257807 RHEL 9 must disable the Stream Control Transmission Protocol (SCTP) kernel module.|None|-|No|
|SV-257808 RHEL 9 must disable the Transparent Inter Process Communication (TIPC) kernel module.|None|-|No|
|SV-257809 RHEL 9 must implement address space layout randomization (ASLR) to protect its memory from unauthorized code execution.|None|-|Yes|
|SV-257810 RHEL 9 must disable access to network bpf system call from nonprivileged processes.|None|-|Yes|
|SV-257811 RHEL 9 must restrict usage of ptrace to descendant processes.|None|-|Yes|
|SV-257812 RHEL 9 must disable core dump backtraces.|None|-|No|
|SV-257813 RHEL 9 must disable storing core dumps.|None|-|No|
|SV-257814 RHEL 9 must disable core dumps for all users.|None|-|No|
|SV-257815 RHEL 9 must disable acquiring, saving, and processing core dumps.|None|-|No|
|SV-257816 RHEL 9 must disable the use of user namespaces.|None|-|Yes|
|SV-257818 The kdump service on RHEL 9 must be disabled.|None|-|No|
|SV-257820 RHEL 9 must check the GPG signature of software packages originating from external software repositories before installation.|None|-|No|
|SV-257821 RHEL 9 must check the GPG signature of locally installed software packages before installation.|None|-|No|
|SV-257822 RHEL 9 must have GPG signature verification enabled for all software repositories.|None|-|No|
|SV-257824 RHEL 9 must remove all software components after updated versions have been installed.|None|-|No|
|SV-257825 RHEL 9 subscription-manager package must be installed.|None|-|No|
|SV-257826 RHEL 9 must not have a File Transfer Protocol (FTP) server package installed.|None|-|No|
|SV-257827 RHEL 9 must not have the sendmail package installed.|None|-|No|
|SV-257828 RHEL 9 must not have the nfs-utils package installed.|None|-|No|
|SV-257829 RHEL 9 must not have the ypserv package installed.|None|-|No|
|SV-257831 RHEL 9 must not have the telnet-server package installed.|None|-|No|
|SV-257832 RHEL 9 must not have the gssproxy package installed.|None|-|No|
|SV-257833 RHEL 9 must not have the iprutils package installed.|None|-|No|
|SV-257834 RHEL 9 must not have the tuned package installed.|None|-|No|
|SV-257835 The Trivial File Transfer Protocol (TFTP) server must not be installed unless it is required, and if required, the RHEL 9 TFTP daemon must be configured to operate in secure mode.|None|-|No|
|SV-257836 RHEL 9 must not have the quagga package installed.|None|-|No|
|SV-257837 A graphical display manager must not be installed on RHEL 9 unless approved.|None|-|No|
|SV-257838 RHEL 9 must have the openssl-pkcs11 package installed.|None|-|No|
|SV-257839 RHEL 9 must have the gnutls-utils package installed.|None|-|No|
|SV-257840 RHEL 9 must have the nss-tools package installed.|None|-|No|
|SV-257841 RHEL 9 must have the rng-tools package installed.|None|-|No|
|SV-257842 RHEL 9 must have the s-nail package installed.|None|-|No|
|SV-257843 A separate RHEL 9 file system must be used for user home directories (such as /home or an equivalent).|None|-|No|
|SV-257844 RHEL 9 must use a separate file system for /tmp.|None|-|No|
|SV-257845 RHEL 9 must use a separate file system for /var.|None|-|No|
|SV-257846 RHEL 9 must use a separate file system for /var/log.|None|-|No|
|SV-257847 RHEL 9 must use a separate file system for the system audit data path.|None|-|No|
|SV-257848 RHEL 9 must use a separate file system for /var/tmp.|None|-|No|
|SV-257849 RHEL 9 file system automount function must be disabled unless required.|None|-|No|
|SV-257850 RHEL 9 must prevent device files from being interpreted on file systems that contain user home directories.|None|-|No|
|SV-257851 RHEL 9 must prevent files with the setuid and setgid bit set from being executed on file systems that contain user home directories.|None|-|No|
|SV-257852 RHEL 9 must prevent code from being executed on file systems that contain user home directories.|None|-|No|
|SV-257854 RHEL 9 must prevent special devices on file systems that are imported via Network File System (NFS).|None|-|No|
|SV-257855 RHEL 9  must prevent code from being executed on file systems that are imported via Network File System (NFS).|None|-|No|
|SV-257856 RHEL 9 must prevent files with the setuid and setgid bit set from being executed on file systems that are imported via Network File System (NFS).|None|-|No|
|SV-257860 RHEL 9 must mount /boot with the nodev option.|None|-|No|
|SV-257861 RHEL 9 must prevent files with the setuid and setgid bit set from being executed on the /boot directory.|None|-|No|
|SV-257862 RHEL 9 must prevent files with the setuid and setgid bit set from being executed on the /boot/efi directory.|None|-|No|
|SV-257863 RHEL 9 must mount /dev/shm with the nodev option.|None|-|No|
|SV-257864 RHEL 9 must mount /dev/shm with the noexec option.|None|-|No|
|SV-257865 RHEL 9 must mount /dev/shm with the nosuid option.|None|-|No|
|SV-257866 RHEL 9 must mount /tmp with the nodev option.|None|-|No|
|SV-257867 RHEL 9 must mount /tmp with the noexec option.|None|-|No|
|SV-257868 RHEL 9 must mount /tmp with the nosuid option.|None|-|No|
|SV-257869 RHEL 9 must mount /var with the nodev option.|None|-|No|
|SV-257870 RHEL 9 must mount /var/log with the nodev option.|None|-|No|
|SV-257871 RHEL 9 must mount /var/log with the noexec option.|None|-|No|
|SV-257872 RHEL 9 must mount /var/log with the nosuid option.|None|-|No|
|SV-257873 RHEL 9 must mount /var/log/audit with the nodev option.|None|-|No|
|SV-257874 RHEL 9 must mount /var/log/audit with the noexec option.|None|-|No|
|SV-257875 RHEL 9 must mount /var/log/audit with the nosuid option.|None|-|No|
|SV-257876 RHEL 9 must mount /var/tmp with the nodev option.|None|-|No|
|SV-257877 RHEL 9 must mount /var/tmp with the noexec option.|None|-|No|
|SV-257878 RHEL 9 must mount /var/tmp with the nosuid option.|None|-|No|
|SV-257880 RHEL 9 must disable mounting of cramfs.|None|-|No|
|SV-257881 RHEL 9 must prevent special devices on non-root local partitions.|None|-|No|
|SV-257882 RHEL 9 system commands must have mode 755 or less permissive.|None|-|No|
|SV-257883 RHEL 9 library directories must have mode 755 or less permissive.|None|-|No|
|SV-257884 RHEL 9 library files must have mode 755 or less permissive.|None|-|No|
|SV-257885 RHEL 9 /var/log directory must have mode 0755 or less permissive.|None|-|Yes|
|SV-257886 RHEL 9 /var/log/messages file must have mode 0640 or less permissive.|None|-|Yes|
|SV-257887 RHEL 9 audit tools must have a mode of 0755 or less permissive.|None|-|Yes|
|SV-257889 All RHEL 9 local initialization files must have mode 0740 or less permissive.|None|-|No|
|SV-257890 All RHEL 9 local interactive user home directories must have mode 0750 or less permissive.|None|-|No|
|SV-257891 RHEL 9 /etc/group file must have mode 0644 or less permissive to prevent unauthorized access.|None|-|Yes|
|SV-257892 RHEL 9 /etc/group- file must have mode 0644 or less permissive to prevent unauthorized access.|None|-|Yes|
|SV-257893 RHEL 9 /etc/gshadow file must have mode 0000 or less permissive to prevent unauthorized access.|None|-|Yes|
|SV-257894 RHEL 9 /etc/gshadow- file must have mode 0000 or less permissive to prevent unauthorized access.|None|-|Yes|
|SV-257895 RHEL 9 /etc/passwd file must have mode 0644 or less permissive to prevent unauthorized access.|None|-|Yes|
|SV-257896 RHEL 9 /etc/passwd- file must have mode 0644 or less permissive to prevent unauthorized access.|None|-|Yes|
|SV-257897 RHEL 9 /etc/shadow- file must have mode 0000 or less permissive to prevent unauthorized access.|None|-|Yes|
|SV-257898 RHEL 9 /etc/group file must be owned by root.|None|-|Yes|
|SV-257899 RHEL 9 /etc/group file must be group-owned by root.|None|-|Yes|
|SV-257900 RHEL 9 /etc/group- file must be owned by root.|None|-|Yes|
|SV-257901 RHEL 9 /etc/group- file must be group-owned by root.|None|-|Yes|
|SV-257902 RHEL 9 /etc/gshadow file must be owned by root.|None|-|Yes|
|SV-257903 RHEL 9 /etc/gshadow file must be group-owned by root.|None|-|Yes|
|SV-257904 RHEL 9 /etc/gshadow- file must be owned by root.|None|-|No|
|SV-257905 RHEL 9 /etc/gshadow- file must be group-owned by root.|None|-|Yes|
|SV-257906 RHEL 9 /etc/passwd file must be owned by root.|None|-|Yes|
|SV-257907 RHEL 9 /etc/passwd file must be group-owned by root.|None|-|Yes|
|SV-257908 RHEL 9 /etc/passwd- file must be owned by root.|None|-|Yes|
|SV-257909 RHEL 9 /etc/passwd- file must be group-owned by root.|None|-|Yes|
|SV-257910 RHEL 9 /etc/shadow file must be owned by root.|None|-|No|
|SV-257911 RHEL 9 /etc/shadow file must be group-owned by root.|None|-|Yes|
|SV-257912 RHEL 9 /etc/shadow- file must be owned by root.|None|-|No|
|SV-257913 RHEL 9 /etc/shadow- file must be group-owned by root.|None|-|Yes|
|SV-257914 RHEL 9 /var/log directory must be owned by root.|None|-|Yes|
|SV-257915 RHEL 9 /var/log directory must be group-owned by root.|None|-|Yes|
|SV-257916 RHEL 9 /var/log/messages file must be owned by root.|None|-|Yes|
|SV-257917 RHEL 9 /var/log/messages file must be group-owned by root.|None|-|Yes|
|SV-257918 RHEL 9 system commands must be owned by root.|None|-|No|
|SV-257919 RHEL 9 system commands must be group-owned by root or a system account.|None|-|No|
|SV-257920 RHEL 9 library files must be owned by root.|None|-|No|
|SV-257921 RHEL 9 library files must be group-owned by root or a system account.|None|-|No|
|SV-257922 RHEL 9 library directories must be owned by root.|None|-|No|
|SV-257923 RHEL 9 library directories must be group-owned by root or a system account.|None|-|No|
|SV-257924 RHEL 9 audit tools must be owned by root.|None|-|Yes|
|SV-257925 RHEL 9 audit tools must be group-owned by root.|None|-|Yes|
|SV-257926 RHEL 9 cron configuration files directory must be owned by root.|None|-|Yes|
|SV-257927 RHEL 9 cron configuration files directory must be group-owned by root.|None|-|No|
|SV-257934 RHEL 9 /etc/shadow file must have mode 0000 to prevent unauthorized access.|None|-|Yes|
|SV-257935 RHEL 9 must have the firewalld package installed.|None|-|No|
|SV-257936 The firewalld service on RHEL 9 must be active.|None|-|No|
|SV-257939 RHEL 9 must protect against or limit the effects of denial-of-service (DoS) attacks by ensuring rate-limiting measures on impacted network interfaces are implemented.|None|-|No|
|SV-257941 RHEL 9 network interfaces must not be in promiscuous mode.|None|-|No|
|SV-257942 RHEL 9 must enable hardening for the Berkeley Packet Filter just-in-time compiler.|None|-|Yes|
|SV-257943 RHEL 9 must have the chrony package installed.|None|-|No|
|SV-257944 RHEL 9 chronyd service must be enabled.|None|-|No|
|SV-257946 RHEL 9 must disable the chrony daemon from acting as a server.|None|-|No|
|SV-257947 RHEL 9 must disable network management of the chrony daemon.|None|-|No|
|SV-257948 RHEL 9 systems using Domain Name Servers (DNS) resolution must have at least two name servers configured.|None|-|No|
|SV-257949 RHEL 9 must configure a DNS processing mode in Network Manager.|None|-|No|
|SV-257951 RHEL 9 must be configured to prevent unrestricted mail relaying.|None|-|No|
|SV-257953 RHEL 9 must forward mail from postmaster to the root account using a postfix alias.|None|-|No|
|SV-257954 RHEL 9 libreswan package must be installed.|None|-|No|
|SV-257955 There must be no shosts.equiv files on RHEL 9.|None|-|No|
|SV-257956 There must be no .shosts files on RHEL 9.|None|-|No|
|SV-257957 RHEL 9 must be configured to use TCP syncookies.|None|-|Yes|
|SV-257958 RHEL 9 must ignore Internet Protocol version 4 (IPv4) Internet Control Message Protocol (ICMP) redirect messages.|None|-|Yes|
|SV-257959 RHEL 9 must not forward Internet Protocol version 4 (IPv4) source-routed packets.|None|-|Yes|
|SV-257960 RHEL 9 must log IPv4 packets with impossible addresses.|None|-|Yes|
|SV-257961 RHEL 9 must log IPv4 packets with impossible addresses by default.|None|-|Yes|
|SV-257962 RHEL 9 must use reverse path filtering on all IPv4 interfaces.|None|-|Yes|
|SV-257963 RHEL 9 must prevent IPv4 Internet Control Message Protocol (ICMP) redirect messages from being accepted.|None|-|Yes|
|SV-257964 RHEL 9 must not forward IPv4 source-routed packets by default.|None|-|Yes|
|SV-257965 RHEL 9 must use a reverse-path filter for IPv4 network traffic when possible by default.|None|-|Yes|
|SV-257966 RHEL 9 must not respond to Internet Control Message Protocol (ICMP) echoes sent to a broadcast address.|None|-|Yes|
|SV-257967 RHEL 9 must limit the number of bogus Internet Control Message Protocol (ICMP) response errors logs.|None|-|Yes|
|SV-257968 RHEL 9 must not send Internet Control Message Protocol (ICMP) redirects.|None|-|Yes|
|SV-257969 RHEL 9 must not allow interfaces to perform Internet Control Message Protocol (ICMP) redirects by default.|None|-|Yes|
|SV-257970 RHEL 9 must not enable IPv4 packet forwarding unless the system is a router.|None|-|Yes|
|SV-257971 RHEL 9 must not accept router advertisements on all IPv6 interfaces.|None|-|Yes|
|SV-257972 RHEL 9 must ignore IPv6 Internet Control Message Protocol (ICMP) redirect messages.|None|-|Yes|
|SV-257973 RHEL 9 must not forward IPv6 source-routed packets.|None|-|Yes|
|SV-257974 RHEL 9 must not enable IPv6 packet forwarding unless the system is a router.|None|-|Yes|
|SV-257975 RHEL 9 must not accept router advertisements on all IPv6 interfaces by default.|None|-|Yes|
|SV-257976 RHEL 9 must prevent IPv6 Internet Control Message Protocol (ICMP) redirect messages from being accepted.|None|-|Yes|
|SV-257977 RHEL 9 must not forward IPv6 source-routed packets by default.|None|-|Yes|
|SV-257978 All RHEL 9 networked systems must have SSH installed.|None|-|No|
|SV-257979 All RHEL 9 networked systems must have and implement SSH to protect the confidentiality and integrity of transmitted and received information, as well as information during preparation for transmission.|None|-|No|
|SV-257980 RHEL 9 must have the openssh-clients package installed.|None|-|No|
|SV-257981 RHEL 9 must display the Standard Mandatory DOD Notice and Consent Banner before granting local or remote access to the system via a SSH logon.|None|-|No|
|SV-257982 RHEL 9 must log SSH connection attempts and failures to the server.|None|-|No|
|SV-257983 RHEL 9 SSHD must accept public key authentication.|None|-|No|
|SV-257984 RHEL 9 SSHD must not allow blank passwords.|None|-|No|
|SV-257985 RHEL 9 must not permit direct logons to the root account using remote access via SSH.|None|-|No|
|SV-257986 RHEL 9 must enable the Pluggable Authentication Module (PAM) interface for SSHD.|None|-|No|
|SV-257989 The RHEL 9 SSH server must be configured to use only DOD-approved encryption ciphers employing FIPS 140-3 validated cryptographic hash algorithms to protect the confidentiality of SSH server connections.|None|-|No|
|SV-257991 The RHEL 9 SSH server must be configured to use only Message Authentication Codes (MACs) employing FIPS 140-3 validated cryptographic hash algorithms to protect the confidentiality of SSH server connections.|None|-|No|
|SV-257992 RHEL 9 must not allow a noncertificate trusted host SSH logon to the system.|None|-|No|
|SV-257993 RHEL 9 must not allow users to override SSH environment variables.|None|-|No|
|SV-257994 RHEL 9 must force a frequent session key renegotiation for SSH connections to the server.|None|-|No|
|SV-257995 RHEL 9 must be configured so that all network connections associated with SSH traffic terminate after becoming unresponsive.|None|-|No|
|SV-257996 RHEL 9 must be configured so that all network connections associated with SSH traffic are terminated after 10 minutes of becoming unresponsive.|None|-|No|
|SV-257997 RHEL 9 SSH server configuration file must be group-owned by root.|None|-|Yes|
|SV-257998 The RHEL 9 SSH server configuration file must be owned by root.|None|-|Yes|
|SV-258000 RHEL 9 SSH private host key files must have mode 0640 or less permissive.|None|-|No|
|SV-258001 RHEL 9 SSH public host key files must have mode 0644 or less permissive.|None|-|No|
|SV-258002 RHEL 9 SSH daemon must not allow compression or must only allow compression after successful authentication.|None|-|No|
|SV-258003 RHEL 9 SSH daemon must not allow GSSAPI authentication.|None|-|No|
|SV-258004 RHEL 9 SSH daemon must not allow Kerberos authentication.|None|-|No|
|SV-258005 RHEL 9 SSH daemon must not allow rhosts authentication.|None|-|No|
|SV-258006 RHEL 9 SSH daemon must not allow known hosts authentication.|None|-|No|
|SV-258007 RHEL 9 SSH daemon must disable remote X connections for interactive users.|None|-|No|
|SV-258008 RHEL 9 SSH daemon must perform strict mode checking of home directory configuration files.|None|-|No|
|SV-258009 RHEL 9 SSH daemon must display the date and time of the last successful account logon upon an SSH logon.|None|-|No|
|SV-258011 RHEL 9 SSH daemon must prevent remote hosts from connecting to the proxy display.|None|-|No|
|SV-258012 RHEL 9 must display the Standard Mandatory DOD Notice and Consent Banner before granting local or remote access to the system via a graphical user logon.|None|-|No|
|SV-258013 RHEL 9 must prevent a user from overriding the banner-message-enable setting for the graphical user interface.|None|-|No|
|SV-258014 RHEL 9 must disable the graphical user interface automount function unless required.|None|-|No|
|SV-258015 RHEL 9 must prevent a user from overriding the disabling of the graphical user interface automount function.|None|-|No|
|SV-258018 RHEL 9 must not allow unattended or automatic logon via the graphical user interface.|None|-|No|
|SV-258019 RHEL 9 must be able to initiate directly a session lock for all connection types using smart card when the smart card is removed.|None|-|No|
|SV-258020 RHEL 9 must prevent a user from overriding the disabling of the graphical user smart card removal action.|None|-|No|
|SV-258022 RHEL 9 must prevent a user from overriding the screensaver lock-enabled setting for the graphical user interface.|None|-|No|
|SV-258024 RHEL 9 must prevent a user from overriding the session idle-delay setting for the graphical user interface.|None|-|No|
|SV-258026 RHEL 9 must prevent a user from overriding the session lock-delay setting for the graphical user interface.|None|-|No|
|SV-258029 RHEL 9 must disable the ability of a user to restart the system from the login screen.|None|-|No|
|SV-258030 RHEL 9 must prevent a user from overriding the disable-restart-buttons setting for the graphical user interface.|None|-|No|
|SV-258032 RHEL 9 must prevent a user from overriding the Ctrl-Alt-Del sequence settings for the graphical user interface.|None|-|No|
|SV-258033 RHEL 9 must disable the user list at logon for graphical user interfaces.|None|-|No|
|SV-258034 RHEL 9 must be configured to disable USB mass storage.|None|-|No|
|SV-258035 RHEL 9 must have the USBGuard package installed.|None|-|No|
|SV-258036 RHEL 9 must have the USBGuard package enabled.|None|-|No|
|SV-258037 RHEL 9 must enable Linux audit logging for the USBGuard daemon.|None|-|No|
|SV-258039 RHEL 9 Bluetooth must be disabled.|None|-|No|
|SV-258041 RHEL 9 user account passwords for new users or password changes must have a 60-day maximum password lifetime restriction in /etc/login.defs.|None|-|No|
|SV-258042 RHEL 9 user account passwords must have a 60-day maximum password lifetime restriction.|None|-|No|
|SV-258043 All RHEL 9 local interactive user accounts must be assigned a home directory upon creation.|None|-|No|
|SV-258045 RHEL 9 duplicate User IDs (UIDs) must not exist for interactive users.|None|-|No|
|SV-258046 RHEL 9 system accounts must not have an interactive login shell.|None|-|No|
|SV-258048 All RHEL 9 interactive users must have a primary group that exists.|None|-|No|
|SV-258049 RHEL 9 must disable account identifiers (individuals, groups, roles, and devices) after 35 days of inactivity.|None|-|No|
|SV-258051 All RHEL 9 local interactive users must have a home directory assigned in the /etc/passwd file.|None|-|No|
|SV-258054 RHEL 9 must automatically lock an account when three unsuccessful logon attempts occur.|None|-|No|
|SV-258055 RHEL 9 must automatically lock the root account until the root account is released by an administrator when three unsuccessful logon attempts occur during a 15-minute time period.|None|-|No|
|SV-258056 RHEL 9 must automatically lock an account when three unsuccessful logon attempts occur during a 15-minute time period.|None|-|No|
|SV-258057 RHEL 9 must maintain an account lock until the locked account is released by an administrator.|None|-|No|
|SV-258059 The root account must be the only account having unrestricted access to RHEL 9 system.|None|-|No|
|SV-258060 RHEL 9 must ensure account lockouts persist.|None|-|No|
|SV-258061 RHEL 9 groups must have unique Group ID (GID).|None|-|No|
|SV-258068 RHEL 9 must automatically exit interactive command shell user sessions after 10 minutes of inactivity.|None|-|No|
|SV-258069 RHEL 9 must limit the number of concurrent sessions to ten for all accounts and/or account types.|None|-|No|
|SV-258070 RHEL 9 must log username information when unsuccessful logon attempts occur.|None|-|No|
|SV-258071 RHEL 9 must enforce a delay of at least four seconds between logon prompts following a failed logon attempt.|None|-|No|
|SV-258072 RHEL 9 must define default permissions for the bash shell.|None|-|No|
|SV-258073 RHEL 9 must define default permissions for the c shell.|None|-|No|
|SV-258074 RHEL 9 must define default permissions for all authenticated users in such a way that the user can only read and modify their own files.|None|-|No|
|SV-258075 RHEL 9 must define default permissions for the system default profile.|None|-|No|
|SV-258077 RHEL 9 must terminate idle user sessions.|None|-|No|
|SV-258078 RHEL 9 must use a Linux Security Module configured to enforce limits on system services.|None|-|No|
|SV-258079 RHEL 9 must enable the SELinux targeted policy.|None|-|No|
|SV-258081 RHEL 9 must have policycoreutils package installed.|None|-|No|
|SV-258082 RHEL 9 policycoreutils-python-utils package must be installed.|None|-|No|
|SV-258083 RHEL 9 must have the sudo package installed.|None|-|No|
|SV-258084 RHEL 9 must require reauthentication when using the "sudo" command.|None|-|No|
|SV-258085 RHEL 9 must use the invoking user's password for privilege escalation when using "sudo".|None|-|No|
|SV-258086 RHEL 9 must require users to reauthenticate for privilege escalation.|None|-|No|
|SV-258087 RHEL 9 must restrict privilege elevation to authorized personnel.|None|-|No|
|SV-258088 RHEL 9 must restrict the use of the "su" command.|None|-|No|
|SV-258089 RHEL 9 fapolicy module must be installed.|None|-|No|
|SV-258090 RHEL 9 fapolicy module must be enabled.|None|-|No|
|SV-258091 RHEL 9 must ensure the password complexity module in the system-auth file is configured for three retries or less.|None|-|No|
|SV-258094 RHEL 9 must not allow blank or null passwords.|None|-|No|
|SV-258097 RHEL 9 must ensure the password complexity module is enabled in the password-auth file.|None|-|No|
|SV-258098 RHEL 9 must ensure the password complexity module is enabled in the system-auth file.|None|-|No|
|SV-258099 RHEL 9 password-auth must be configured to use a sufficient number of hashing rounds.|None|-|No|
|SV-258100 RHEL 9 system-auth must be configured to use a sufficient number of hashing rounds.|None|-|No|
|SV-258101 RHEL 9 must enforce password complexity rules for the root account.|None|-|No|
|SV-258102 RHEL 9 must enforce password complexity by requiring that at least one lowercase character be used.|None|-|No|
|SV-258103 RHEL 9 must enforce password complexity by requiring that at least one numeric character be used.|None|-|No|
|SV-258104 RHEL 9 passwords for new users or password changes must have a 24 hours minimum password lifetime restriction in /etc/login.defs.|None|-|No|
|SV-258105 RHEL 9 passwords must have a 24 hours minimum password lifetime restriction in /etc/shadow.|None|-|No|
|SV-258106 RHEL 9 must require users to provide a password for privilege escalation.|None|-|No|
|SV-258107 RHEL 9 passwords must be created with a minimum of 15 characters.|None|-|No|
|SV-258109 RHEL 9 must enforce password complexity by requiring that at least one special character be used.|None|-|No|
|SV-258110 RHEL 9 must prevent the use of dictionary words for passwords.|None|-|No|
|SV-258111 RHEL 9 must enforce password complexity by requiring that at least one uppercase character be used.|None|-|No|
|SV-258112 RHEL 9 must require the change of at least eight characters when passwords are changed.|None|-|No|
|SV-258113 RHEL 9 must require the maximum number of repeating characters of the same character class be limited to four when passwords are changed.|None|-|No|
|SV-258114 RHEL 9 must require the maximum number of repeating characters be limited to three when passwords are changed.|None|-|No|
|SV-258115 RHEL 9 must require the change of at least four character classes when passwords are changed.|None|-|No|
|SV-258116 RHEL 9 must be configured so that user and group account administration utilities are configured to store only encrypted representations of passwords.|None|-|No|
|SV-258117 RHEL 9 must be configured to use the shadow file to store only encrypted representations of passwords.|None|-|No|
|SV-258118 RHEL 9 must not be configured to bypass password requirements for privilege escalation.|None|-|No|
|SV-258120 RHEL 9 must not have accounts configured with blank or null passwords.|None|-|No|
|SV-258121 RHEL 9 must use the common access card (CAC) smart card driver.|None|-|No|
|SV-258122 RHEL 9 must enable certificate based smart card authentication.|None|-|No|
|SV-258123 RHEL 9 must implement certificate status checking for multifactor authentication.|None|-|No|
|SV-258124 RHEL 9 must have the pcsc-lite package installed.|None|-|No|
|SV-258125 The pcscd service on RHEL 9 must be active.|None|-|No|
|SV-258126 RHEL 9 must have the opensc package installed.|None|-|No|
|SV-258128 RHEL 9 must require authentication to access emergency mode.|None|-|No|
|SV-258129 RHEL 9 must require authentication to access single-user mode.|None|-|No|
|SV-258133 RHEL 9 must prohibit the use of cached authenticators after one day.|None|-|No|
|SV-258137 RHEL 9 must use cryptographic mechanisms to protect the integrity of audit tools.|None|-|No|
|SV-258140 RHEL 9 must have the rsyslog package installed.|None|-|No|
|SV-258141 RHEL 9 must have the packages required for encrypting offloaded audit logs installed.|None|-|No|
|SV-258142 The rsyslog service on RHEL 9 must be active.|None|-|No|
|SV-258143 RHEL 9 must be configured so that the rsyslog daemon does not accept log messages from other servers unless the server is being used for log aggregation.|None|-|No|
|SV-258144 All RHEL 9 remote access methods must be monitored.|None|-|No|
|SV-258146 RHEL 9 must authenticate the remote logging server for offloading audit logs via rsyslog.|None|-|No|
|SV-258147 RHEL 9 must encrypt the transfer of audit records offloaded onto a different system or media from the system being audited via rsyslog.|None|-|No|
|SV-258148 RHEL 9 must encrypt via the gtls driver the transfer of audit records offloaded onto a different system or media from the system being audited via rsyslog.|None|-|No|
|SV-258149 RHEL 9 must be configured to forward audit records via TCP to a different system or media from the system being audited via rsyslog.|None|-|No|
|SV-258151 RHEL 9 audit package must be installed.|None|-|No|
|SV-258152 RHEL 9 audit service must be enabled.|None|-|No|
|SV-258153 RHEL 9 audit system must take appropriate action when an error writing to the audit storage volume occurs.|None|-|No|
|SV-258154 RHEL 9 audit system must take appropriate action when the audit storage volume is full.|None|-|No|
|SV-258155 RHEL 9 must allocate audit record storage capacity to store at least one week's worth of audit records.|None|-|No|
|SV-258156 RHEL 9 must take action when allocated audit record storage volume reaches 75 percent of the repository maximum audit record storage capacity.|None|-|No|
|SV-258157 RHEL 9 must notify the system administrator (SA) and information system security officer (ISSO) (at a minimum) when allocated audit record storage volume reaches 75 percent utilization.|None|-|No|
|SV-258158 RHEL 9 must take action when allocated audit record storage volume reaches 95 percent of the audit record storage capacity.|None|-|No|
|SV-258159 RHEL 9 must take action when allocated audit record storage volume reaches 95 percent of the repository maximum audit record storage capacity.|None|-|No|
|SV-258160 RHEL 9 audit system must take appropriate action when the audit files have reached maximum size.|None|-|No|
|SV-258161 RHEL 9 must label all offloaded audit logs before sending them to the central log server.|None|-|No|
|SV-258162 RHEL 9 must take appropriate action when the internal event queue is full.|None|-|No|
|SV-258163 RHEL 9 System Administrator (SA) and/or information system security officer (ISSO) (at a minimum) must be alerted of an audit processing failure event.|None|-|No|
|SV-258164 RHEL 9 audit system must audit local events.|None|-|No|
|SV-258165 RHEL 9 audit logs must be group-owned by root or by a restricted logging group to prevent unauthorized read access.|None|-|No|
|SV-258166 RHEL 9 audit log directory must be owned by root to prevent unauthorized read access.|None|-|No|
|SV-258167 RHEL 9 audit logs file must have mode 0600 or less permissive to prevent unauthorized access to the audit log.|None|-|No|
|SV-258168 RHEL 9 must periodically flush audit records to disk to prevent the loss of audit records.|None|-|No|
|SV-258169 RHEL 9 must produce audit records containing information to establish the identity of any individual or process associated with the event.|None|-|No|
|SV-258170 RHEL 9 must write audit records to disk.|None|-|No|
|SV-258171 RHEL 9 must allow only the information system security manager (ISSM) (or individuals or roles appointed by the ISSM) to select which auditable events are to be audited.|None|-|Yes|
|SV-258173 RHEL 9 must allocate an audit\_backlog\_limit of sufficient size to capture processes that start prior to the audit daemon.|None|-|No|
|SV-258175 RHEL 9 audispd-plugins package must be installed.|None|-|No|
|SV-258176 RHEL 9 must audit uses of the "execve" system call.|None|-|No|
|SV-258177 RHEL 9 must audit all uses of the chmod, fchmod, and fchmodat system calls.|None|-|No|
|SV-258178 RHEL 9 must audit all uses of the chown, fchown, fchownat, and lchown system calls.|None|-|No|
|SV-258179 RHEL 9 must audit all uses of the setxattr, fsetxattr, lsetxattr, removexattr, fremovexattr, and lremovexattr system calls.|None|-|No|
|SV-258180 RHEL 9 must audit all uses of umount system calls.|None|-|No|
|SV-258181 RHEL 9 must audit all uses of the chacl command.|None|-|No|
|SV-258182 RHEL 9 must audit all uses of the setfacl command.|None|-|No|
|SV-258183 RHEL 9 must audit all uses of the chcon command.|None|-|No|
|SV-258184 RHEL 9 must audit all uses of the semanage command.|None|-|No|
|SV-258185 RHEL 9 must audit all uses of the setfiles command.|None|-|No|
|SV-258186 RHEL 9 must audit all uses of the setsebool command.|None|-|No|
|SV-258187 RHEL 9 must audit all uses of the rename, unlink, rmdir, renameat, and unlinkat system calls.|None|-|No|
|SV-258188 RHEL 9 must audit all uses of the truncate, ftruncate, creat, open, openat, and open\_by\_handle\_at system calls.|None|-|No|
|SV-258189 RHEL 9 must audit all uses of the delete\_module system call.|None|-|No|
|SV-258190 RHEL 9 must audit all uses of the init\_module and finit\_module system calls.|None|-|No|
|SV-258191 RHEL 9 must audit all uses of the chage command.|None|-|No|
|SV-258192 RHEL 9 must audit all uses of the chsh command.|None|-|No|
|SV-258193 RHEL 9 must audit all uses of the crontab command.|None|-|No|
|SV-258194 RHEL 9 must audit all uses of the gpasswd command.|None|-|No|
|SV-258195 RHEL 9 must audit all uses of the kmod command.|None|-|No|
|SV-258196 RHEL 9 must audit all uses of the newgrp command.|None|-|No|
|SV-258197 RHEL 9 must audit all uses of the pam\_timestamp\_check command.|None|-|No|
|SV-258198 RHEL 9 must audit all uses of the passwd command.|None|-|No|
|SV-258199 RHEL 9 must audit all uses of the postdrop command.|None|-|No|
|SV-258200 RHEL 9 must audit all uses of the postqueue command.|None|-|No|
|SV-258201 RHEL 9 must audit all uses of the ssh-agent command.|None|-|No|
|SV-258202 RHEL 9 must audit all uses of the ssh-keysign command.|None|-|No|
|SV-258203 RHEL 9 must audit all uses of the su command.|None|-|No|
|SV-258204 RHEL 9 must audit all uses of the sudo command.|None|-|No|
|SV-258205 RHEL 9 must audit all uses of the sudoedit command.|None|-|No|
|SV-258206 RHEL 9 must audit all uses of the unix\_chkpwd command.|None|-|No|
|SV-258207 RHEL 9 must audit all uses of the unix\_update command.|None|-|No|
|SV-258208 RHEL 9 must audit all uses of the userhelper command.|None|-|No|
|SV-258209 RHEL 9 must audit all uses of the usermod command.|None|-|No|
|SV-258210 RHEL 9 must audit all uses of the mount command.|None|-|No|
|SV-258211 Successful/unsuccessful uses of the init command in RHEL 9 must generate an audit record.|None|-|No|
|SV-258212 Successful/unsuccessful uses of the poweroff command in RHEL 9 must generate an audit record.|None|-|No|
|SV-258213 Successful/unsuccessful uses of the reboot command in RHEL 9 must generate an audit record.|None|-|No|
|SV-258214 Successful/unsuccessful uses of the shutdown command in RHEL 9 must generate an audit record.|None|-|No|
|SV-258215 Successful/unsuccessful uses of the umount system call in RHEL 9 must generate an audit record.|None|-|No|
|SV-258216 Successful/unsuccessful uses of the umount2 system call in RHEL 9 must generate an audit record.|None|-|No|
|SV-258217 RHEL 9 must generate audit records for all account creations, modifications, disabling, and termination events that affect /etc/sudoers.|None|-|No|
|SV-258218 RHEL 9 must generate audit records for all account creations, modifications, disabling, and termination events that affect /etc/sudoers.d/ directory.|None|-|No|
|SV-258219 RHEL 9 must generate audit records for all account creations, modifications, disabling, and termination events that affect /etc/group.|None|-|No|
|SV-258220 RHEL 9 must generate audit records for all account creations, modifications, disabling, and termination events that affect /etc/gshadow.|None|-|No|
|SV-258221 RHEL 9 must generate audit records for all account creations, modifications, disabling, and termination events that affect /etc/opasswd.|None|-|No|
|SV-258222 RHEL 9 must generate audit records for all account creations, modifications, disabling, and termination events that affect /etc/passwd.|None|-|No|
|SV-258223 RHEL 9 must generate audit records for all account creations, modifications, disabling, and termination events that affect /etc/shadow.|None|-|No|
|SV-258224 RHEL 9 must generate audit records for all account creations, modifications, disabling, and termination events that affect /var/log/faillock.|None|-|No|
|SV-258225 RHEL 9 must generate audit records for all account creations, modifications, disabling, and termination events that affect /var/log/lastlog.|None|-|No|
|SV-258227 RHEL 9 must take appropriate action when a critical audit processing failure occurs.|None|-|No|
|SV-258228 RHEL 9 audit system must protect logon UIDs from unauthorized change.|None|-|No|
|SV-258229 RHEL 9 audit system must protect auditing rules from unauthorized change.|None|-|No|
|SV-258230 RHEL 9 must enable FIPS mode.|None|-|No|
|SV-258231 RHEL 9 must employ FIPS 140-3 approved cryptographic hashing algorithms for all stored passwords.|None|-|No|
|SV-258232 RHEL 9 IP tunnels must use FIPS 140-3 approved cryptographic algorithms.|None|-|No|
|SV-258233 RHEL 9 pam\_unix.so module must be configured in the password-auth file to use a FIPS 140-3 approved cryptographic hashing algorithm for system authentication.|None|-|No|
|SV-258234 RHEL 9 must have the crypto-policies package installed.|None|-|No|
|SV-258236 RHEL 9 cryptographic policy must not be overridden.|None|-|Yes|
|SV-258242 RHEL 9 must implement DOD-approved encryption in the bind package.|None|-|No|
|SV-270175 RHEL 9 "/etc/audit/" must be owned by root.|None|-|Yes|
|SV-270176 RHEL 9 "/etc/audit/" must be group-owned by root.|None|-|Yes|
|SV-270177 The RHEL 9 SSH client must be configured to use only DOD-approved encryption ciphers employing FIPS 140-3 validated cryptographic hash algorithms to protect the confidentiality of SSH client connections.|None|-|No|
|SV-270178 The RHEL 9 SSH client must be configured to use only DOD-approved Message Authentication Codes (MACs) employing FIPS 140-3 validated cryptographic hash algorithms to protect the confidentiality of SSH client connections.|None|-|No|
|SV-270180 The RHEL 9 fapolicy module must be configured to employ a deny-all, permit-by-exception policy to allow the execution of authorized software programs.|None|-|No|
|SV-272488 RHEL 9 must have the Postfix package installed.|None|-|No|
|SV-272496 RHEL 9 must elevate the SELinux context when an administrator calls the sudo command.|None|-|No|

### Known assessment discrepancies

> [!NOTE]
> These rules can produce assessment results that differ from the DISA SCAP Compliance Checker (SCC).
> A rule is listed once if a discrepancy was observed in any tested scenario.

- SV-257835 The Trivial File Transfer Protocol (TFTP) server must not be installed unless it is required, and if required, the RHEL 9 TFTP daemon must be configured to operate in secure mode.
- SV-257843 A separate RHEL 9 file system must be used for user home directories (such as /home or an equivalent).
- SV-257849 RHEL 9 file system automount function must be disabled unless required.
- SV-257854 RHEL 9 must prevent special devices on file systems that are imported via Network File System (NFS).
- SV-257855 RHEL 9  must prevent code from being executed on file systems that are imported via Network File System (NFS).
- SV-257856 RHEL 9 must prevent files with the setuid and setgid bit set from being executed on file systems that are imported via Network File System (NFS).
- SV-257862 RHEL 9 must prevent files with the setuid and setgid bit set from being executed on the /boot/efi directory.
- SV-257926 RHEL 9 cron configuration files directory must be owned by root.
- SV-257951 RHEL 9 must be configured to prevent unrestricted mail relaying.
- SV-257996 RHEL 9 must be configured so that all network connections associated with SSH traffic are terminated after 10 minutes of becoming unresponsive.
- SV-258012 RHEL 9 must display the Standard Mandatory DOD Notice and Consent Banner before granting local or remote access to the system via a graphical user logon.
- SV-258013 RHEL 9 must prevent a user from overriding the banner-message-enable setting for the graphical user interface.
- SV-258014 RHEL 9 must disable the graphical user interface automount function unless required.
- SV-258015 RHEL 9 must prevent a user from overriding the disabling of the graphical user interface automount function.
- SV-258018 RHEL 9 must not allow unattended or automatic logon via the graphical user interface.
- SV-258019 RHEL 9 must be able to initiate directly a session lock for all connection types using smart card when the smart card is removed.
- SV-258020 RHEL 9 must prevent a user from overriding the disabling of the graphical user smart card removal action.
- SV-258022 RHEL 9 must prevent a user from overriding the screensaver lock-enabled setting for the graphical user interface.
- SV-258024 RHEL 9 must prevent a user from overriding the session idle-delay setting for the graphical user interface.
- SV-258026 RHEL 9 must prevent a user from overriding the session lock-delay setting for the graphical user interface.
- SV-258029 RHEL 9 must disable the ability of a user to restart the system from the login screen.
- SV-258030 RHEL 9 must prevent a user from overriding the disable-restart-buttons setting for the graphical user interface.
- SV-258032 RHEL 9 must prevent a user from overriding the Ctrl-Alt-Del sequence settings for the graphical user interface.
- SV-258033 RHEL 9 must disable the user list at logon for graphical user interfaces.
- SV-258043 All RHEL 9 local interactive user accounts must be assigned a home directory upon creation.
- SV-258046 RHEL 9 system accounts must not have an interactive login shell.
- SV-258078 RHEL 9 must use a Linux Security Module configured to enforce limits on system services.
- SV-258102 RHEL 9 must enforce password complexity by requiring that at least one lowercase character be used.
- SV-258103 RHEL 9 must enforce password complexity by requiring that at least one numeric character be used.
- SV-258109 RHEL 9 must enforce password complexity by requiring that at least one special character be used.
- SV-258111 RHEL 9 must enforce password complexity by requiring that at least one uppercase character be used.
- SV-258143 RHEL 9 must be configured so that the rsyslog daemon does not accept log messages from other servers unless the server is being used for log aggregation.
- SV-258231 RHEL 9 must employ FIPS 140-3 approved cryptographic hashing algorithms for all stored passwords.
- SV-258232 RHEL 9 IP tunnels must use FIPS 140-3 approved cryptographic algorithms.
- SV-258242 RHEL 9 must implement DOD-approved encryption in the bind package.
