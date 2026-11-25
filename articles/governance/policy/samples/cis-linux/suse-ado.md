---
title: Reference - CIS Security Benchmarks for SUSE Linux Enterprise via Machine Configuration
description: Reference - CIS Security Benchmarks for SUSE Linux Enterprise via Machine Configuration
ms.date: 11/04/2026
author: pallakatos
ms.author: pallakatos
ms.topic: reference
ms.custom: generated
---

# Release notes - SUSE Linux Enterprise

This article provides detailed information about the CIS Security Benchmarks for SUSE Linux Enterprise, including supported benchmarks, mismatched rules, remediation support, and configurable parameters across all supported versions.

## Supported benchmarks

|SUSE Linux Enterprise Version|Benchmark Title|
|---|---|
|SUSE Linux Enterprise 12|[CIS SUSE Linux Enterprise 12 Benchmark 3.2.1 Level 1 + Level 2 - Server](#cis-suse-linux-enterprise-12-benchmark-321-level-1--level-2---server)|
|SUSE Linux Enterprise 15|[CIS SUSE Linux Enterprise 15 Benchmark 2.0.1 Level 1 + Level 2 - Server](#cis-suse-linux-enterprise-15-benchmark-201-level-1--level-2---server)|

> [!NOTE]
> Auto-remediation is in **[Public Preview]**.
> Remediation must be enabled separately and is available only for rules marked **Yes** in the **Remediation** column. It uses configured parameter values, or the defaults shown when no overrides are provided. Other rules remain audit-only. Review and test changes before enabling remediation broadly.

Supported parameters and remediations will expand over time. To request additional support, [open an issue in the kompli repository](https://github.com/microsoft/kompli/issues).

## CIS SUSE Linux Enterprise 12 Benchmark 3.2.1 Level 1 + Level 2 - Server

### Rules

|Rule|Parameters|Default values|Remediation|
|---|---|---|---|
|1.1.1.1 Ensure mounting of squashfs filesystems is disabled|None|-|No|
|1.1.1.2 Ensure mounting of udf filesystems is disabled|None|-|No|
|1.1.1.3 Ensure mounting of FAT filesystems is limited|None|-|No|
|1.1.2 Ensure /tmp is configured|None|-|No|
|1.1.3 Ensure noexec option set on /tmp partition|None|-|No|
|1.1.4 Ensure nodev option set on /tmp partition|None|-|No|
|1.1.5 Ensure nosuid option set on /tmp partition|None|-|No|
|1.1.6 Ensure /dev/shm is configured|None|-|No|
|1.1.7 Ensure noexec option set on /dev/shm partition|None|-|No|
|1.1.8 Ensure nodev option set on /dev/shm partition|None|-|No|
|1.1.9 Ensure nosuid option set on /dev/shm partition|None|-|No|
|1.1.10 Ensure separate partition exists for /var|None|-|No|
|1.1.11 Ensure separate partition exists for /var/tmp|None|-|No|
|1.1.12 Ensure noexec option set on /var/tmp partition|None|-|No|
|1.1.13 Ensure nodev option set on /var/tmp partition|None|-|No|
|1.1.14 Ensure nosuid option set on /var/tmp partition|None|-|No|
|1.1.15 Ensure separate partition exists for /var/log|None|-|No|
|1.1.16 Ensure separate partition exists for /var/log/audit|None|-|No|
|1.1.17 Ensure separate partition exists for /home|None|-|No|
|1.1.18 Ensure nodev option set on /home partition|None|-|No|
|1.1.19 Ensure noexec option set on removable media partitions|None|-|No|
|1.1.20 Ensure nodev option set on removable media partitions|None|-|No|
|1.1.21 Ensure nosuid option set on removable media partitions|None|-|No|
|1.1.22 Ensure sticky bit is set on all world-writable directories|None|-|No|
|1.1.23 Disable Automounting|None|-|No|
|1.2.1 Ensure GPG keys are configured|None|-|No|
|1.2.2 Ensure package manager repositories are configured|None|-|No|
|1.2.3 Ensure gpgcheck is globally activated|None|-|No|
|1.3.1 Ensure sudo is installed|None|-|No|
|1.3.2 Ensure sudo commands use pty|None|-|No|
|1.3.3 Ensure sudo log file exists|None|-|No|
|1.4.1 Ensure AIDE is installed|None|-|No|
|1.4.2 Ensure filesystem integrity is regularly checked|None|-|No|
|1.5.1 Ensure bootloader password is set|None|-|No|
|1.5.2 Ensure permissions on bootloader config are configured|`filename`<br>`owner`<br>`group`<br>`mask`|`/boot/grub2/grub.cfg`<br>`root`<br>`root`<br>`0077`|Yes|
|1.5.3 Ensure authentication required for single user mode|None|-|No|
|1.6.1 Ensure core dumps are restricted|None|-|No|
|1.6.2 Ensure XD/NX support is enabled|None|-|No|
|1.6.3 Ensure address space layout randomization (ASLR) is enabled|None|-|No|
|1.6.4 Ensure prelink is disabled|None|-|No|
|1.7.1.1 Ensure AppArmor is installed|None|-|No|
|1.7.1.2 Ensure AppArmor is enabled in the bootloader configuration|None|-|No|
|1.7.1.3 Ensure all AppArmor Profiles are in enforce or complain mode|None|-|No|
|1.7.1.4 Ensure all AppArmor Profiles are enforcing|None|-|No|
|1.8.1.1 Ensure message of the day is configured properly|None|-|No|
|1.8.1.2 Ensure local login warning banner is configured properly|None|-|No|
|1.8.1.3 Ensure remote login warning banner is configured properly|None|-|No|
|1.8.1.4 Ensure permissions on /etc/motd are configured|`filename`<br>`mask`<br>`owner`<br>`group`|`/etc/motd`<br>`644`<br>`root`<br>`root`|Yes|
|1.8.1.5 Ensure permissions on /etc/issue are configured|None|-|Yes|
|1.8.1.6 Ensure permissions on /etc/issue.net are configured|`filename`<br>`owner`<br>`group`<br>`mask`|`/etc/issue.net`<br>`root`<br>`root`<br>`7133`|Yes|
|1.9 Ensure updates, patches, and additional security software are installed|None|-|No|
|1.10 Ensure GDM is removed or login is configured|None|-|No|
|2.1.1 Ensure xinetd is not installed|None|-|No|
|2.2.1.1 Ensure time synchronization is in use|`packageName`|`chrony`|No|
|2.2.1.2 Ensure systemd-timesyncd is configured|None|-|No|
|2.2.1.3 Ensure chrony is configured|None|-|No|
|2.2.1.4 Ensure ntp is configured|None|-|No|
|2.2.2 Ensure X11 Server components are not installed|None|-|No|
|2.2.3 Ensure Avahi Server is not installed|None|-|No|
|2.2.4 Ensure CUPS is not installed|None|-|No|
|2.2.5 Ensure DHCP Server is not installed|None|-|No|
|2.2.6 Ensure LDAP server is not installed|None|-|No|
|2.2.7 Ensure nfs-utils is not installed or the  nfs-server service is masked|None|-|No|
|2.2.8 Ensure rpcbind is not installed or the  rpcbind services are masked|None|-|No|
|2.2.9 Ensure DNS Server is not installed|None|-|No|
|2.2.10 Ensure FTP Server is not installed|None|-|No|
|2.2.11 Ensure HTTP server is not installed|None|-|No|
|2.2.12 Ensure IMAP and POP3 server is not installed|None|-|No|
|2.2.13 Ensure Samba is not installed|None|-|No|
|2.2.14 Ensure HTTP Proxy Server is not installed|None|-|No|
|2.2.15 Ensure net-snmp is not installed|None|-|No|
|2.2.16 Ensure mail transfer agent is configured for local-only mode|None|-|No|
|2.2.17 Ensure rsync is not installed or the rsyncd service is masked|None|-|No|
|2.2.18 Ensure NIS server is not installed|None|-|No|
|2.2.19 Ensure telnet-server is not installed|None|-|No|
|2.3.1 Ensure NIS Client is not installed|None|-|No|
|2.3.2 Ensure rsh client is not installed|None|-|No|
|2.3.3 Ensure talk client is not installed|None|-|No|
|2.3.4 Ensure telnet client is not installed|`packageName`|`telnet`|No|
|2.3.5 Ensure LDAP client is not installed|None|-|No|
|2.4 Ensure nonessential services are removed or masked|None|-|No|
|3.1.1 Disable IPv6|None|-|No|
|3.1.2 Ensure wireless interfaces are disabled|None|-|No|
|3.2.1 Ensure IP forwarding is disabled|None|-|No|
|3.2.2 Ensure packet redirect sending is disabled|None|-|No|
|3.3.1 Ensure source routed packets are not accepted|None|-|No|
|3.3.2 Ensure ICMP redirects are not accepted|None|-|No|
|3.3.3 Ensure secure ICMP redirects are not accepted|None|-|No|
|3.3.4 Ensure suspicious packets are logged|None|-|No|
|3.3.5 Ensure broadcast ICMP requests are ignored|None|-|No|
|3.3.6 Ensure bogus ICMP responses are ignored|None|-|No|
|3.3.7 Ensure Reverse Path Filtering is enabled|None|-|No|
|3.3.8 Ensure TCP SYN Cookies is enabled|None|-|No|
|3.3.9 Ensure IPv6 router advertisements are not accepted|None|-|No|
|3.4.1 Ensure DCCP is disabled|None|-|No|
|3.4.2 Ensure SCTP is disabled|None|-|No|
|3.5.1.1 Ensure iptables package is installed|None|-|No|
|3.5.2.1 Ensure loopback traffic is configured|None|-|No|
|3.5.2.2 Ensure outbound and established connections are configured|None|-|No|
|3.5.2.3 Ensure firewall rules exist for all open ports|None|-|No|
|3.5.2.4 Ensure default deny firewall policy|None|-|No|
|3.5.3.1 Ensure IPv6 loopback traffic is configured|None|-|No|
|3.5.3.2 Ensure IPv6 outbound and established connections are configured|None|-|No|
|3.5.3.3 Ensure IPv6 firewall rules exist for all open ports|None|-|No|
|3.5.3.4 Ensure IPv6 default deny firewall policy|None|-|No|
|4.1.1.1 Ensure auditd is installed|None|-|No|
|4.1.1.2 Ensure auditd service is enabled and running|None|-|No|
|4.1.1.3 Ensure auditing for processes that start prior to auditd is enabled|None|-|No|
|4.1.2.1 Ensure audit log storage size is configured|None|-|No|
|4.1.2.2 Ensure audit logs are not automatically deleted|None|-|No|
|4.1.2.3 Ensure system is disabled when audit logs are full|None|-|No|
|4.1.2.4 Ensure audit\_backlog\_limit is sufficient|None|-|No|
|4.1.3 Ensure events that modify date and time information are collected|None|-|No|
|4.1.4 Ensure events that modify user/group information are collected|None|-|No|
|4.1.5 Ensure events that modify the system's network environment are collected|None|-|No|
|4.1.6 Ensure events that modify the system's Mandatory Access Controls are collected|None|-|No|
|4.1.7 Ensure login and logout events are collected|None|-|No|
|4.1.8 Ensure session initiation information is collected|None|-|No|
|4.1.9 Ensure discretionary access control permission modification events are collected|None|-|No|
|4.1.10 Ensure unsuccessful unauthorized file access attempts are collected|None|-|No|
|4.1.11 Ensure use of privileged commands is collected|None|-|No|
|4.1.12 Ensure successful file system mounts are collected|None|-|No|
|4.1.13 Ensure file deletion events by users are collected|None|-|No|
|4.1.14 Ensure changes to system administration scope (sudoers) is collected|None|-|No|
|4.1.15 Ensure system administrator actions (sudolog) are collected|None|-|No|
|4.1.16 Ensure kernel module loading and unloading is collected|None|-|No|
|4.1.17 Ensure the audit configuration is immutable|None|-|No|
|4.2.1.1 Ensure rsyslog is installed|None|-|No|
|4.2.1.2 Ensure rsyslog Service is enabled and running|None|-|No|
|4.2.1.3 Ensure rsyslog default file permissions configured|None|-|No|
|4.2.1.4 Ensure logging is configured|None|-|No|
|4.2.1.5 Ensure rsyslog is configured to send logs to a remote log host|None|-|No|
|4.2.1.6 Ensure remote rsyslog messages are only accepted on designated log hosts.|None|-|No|
|4.2.2.1 Ensure journald is configured to send logs to rsyslog|None|-|No|
|4.2.2.2 Ensure journald is configured to compress large log files|None|-|No|
|4.2.2.3 Ensure journald is configured to write logfiles to persistent disk|None|-|No|
|4.2.3 Ensure permissions on all logfiles are configured|`directory`<br>`filePattern`<br>`mask`|`/var/log`<br>`.*`<br>`0037`|No|
|4.2.4 Ensure logrotate is configured|None|-|No|
|5.1.1 Ensure cron daemon is enabled and running|None|-|No|
|5.1.2 Ensure permissions on /etc/crontab are configured|`mask`<br>`owner`<br>`group`|`0177`<br>`root`<br>`root`|Yes|
|5.1.3 Ensure permissions on /etc/cron.hourly are configured|`mask`<br>`owner`<br>`group`|`0077`<br>`root`<br>`root`|Yes|
|5.1.4 Ensure permissions on /etc/cron.daily are configured|`mask`<br>`owner`<br>`group`<br>`packageName`|`0077`<br>`root`<br>`root`<br>`cronie`|Yes|
|5.1.5 Ensure permissions on /etc/cron.weekly are configured|`mask`<br>`owner`<br>`group`|`0077`<br>`root`<br>`root`|Yes|
|5.1.6 Ensure permissions on /etc/cron.monthly are configured|`mask`<br>`owner`<br>`group`<br>`alternativePackageName`|`0077`<br>`root`<br>`root`<br>`cronie`|Yes|
|5.1.7 Ensure permissions on /etc/cron.d are configured|`mask`<br>`owner`<br>`group`|`0077`<br>`root`<br>`root`|Yes|
|5.1.8 Ensure cron is restricted to authorized users|`filename`<br>`owner`<br>`group`<br>`mask`|`/etc/cron.allow`<br>`root`<br>`root`<br>`0177`|Yes|
|5.1.9 Ensure at is restricted to authorized users|`owner`<br>`group`<br>`mask`|`root`<br>`root`<br>`0177`|Yes|
|5.2.1 Ensure permissions on /etc/ssh/sshd\_config are configured|`mask`<br>`owner`<br>`group`|`0077`<br>`root`<br>`root`|Yes|
|5.2.2 Ensure permissions on SSH private host key files are configured|None|-|No|
|5.2.3 Ensure permissions on SSH public host key files are configured|`directory`<br>`filePattern`<br>`group`<br>`mask`|`/etc/ssh`<br>`^(ssh\_host\_.*\_key\.pub)$`<br>`root`<br>`0033`|No|
|5.2.4 Ensure SSH access is limited|`allowUsersValuePattern`<br>`allowGroupsValuePattern`<br>`denyUsersValuePattern`<br>`denyGroupsValuePattern`|`[^ \t]+`<br>`[^ \t]+`<br>`[^ \t]+`<br>`[^ \t]+`|No|
|5.2.5 Ensure SSH LogLevel is appropriate|`loglevelValue`|`[ \t]*(VERBOSE\|INFO)[ \t]*`|No|
|5.2.6 Ensure SSH X11 forwarding is disabled|None|-|No|
|5.2.7 Ensure SSH MaxAuthTries is set to 4 or less|`maxauthtriesValue`|`^([ \t]*[0-4][ \t]*)$`|No|
|5.2.8 Ensure SSH IgnoreRhosts is enabled|None|-|No|
|5.2.9 Ensure SSH HostbasedAuthentication is disabled|None|-|No|
|5.2.10 Ensure SSH root login is disabled|None|-|No|
|5.2.11 Ensure SSH PermitEmptyPasswords is disabled|None|-|No|
|5.2.12 Ensure SSH PermitUserEnvironment is disabled|None|-|No|
|5.2.13 Ensure only strong Ciphers are used|`ciphersDisallowedValues`|`3des-cbc,aes128-cbc,aes192-cbc,aes256-cbc,arcfour,arcfour128,arcfour256,blowfish-cbc,cast128-cbc,rijndael-cbc@lysator.liu.se`|No|
|5.2.14 Ensure only strong MAC algorithms are used|`macsDisallowedValues`|`hmac-md5,hmac-md5-96,hmac-ripemd160,hmac-sha1,hmac-sha1-96,umac-64@openssh\.com,hmac-md5-etm@openssh\.com,hmac-md5-96-etm@openssh\.com,hmac-ripemd160-etm@openssh\.com,hmac-sha1-etm@openssh\.com,hmac-sha1-96-etm@openssh\.com,umac-64-etm@openssh\.com,umac-128-etm@openssh\.com`|No|
|5.2.15 Ensure only strong Key Exchange algorithms are used|`kexalgorithmsDisallowedValues`|`diffie-hellman-group1-sha1,diffie-hellman-group14-sha1,diffie-hellman-group-exchange-sha1`|No|
|5.2.16 Ensure SSH Idle Timeout Interval is configured|`clientaliveintervalValue`<br>`clientalivecountmaxValue`|`[ \t]*([1-9]\|[1-9][0-9]\|[0-2][0-9][0-9]\|300)[ \t]*`<br>`[ \t]*[1-3][ \t]*`|No|
|5.2.17 Ensure SSH LoginGraceTime is set to one minute or less|`logingracetimeValue`|`^([ \t]*([1-9]\|[1-5][0-9]\|60\|1m)[ \t]*)$`|No|
|5.2.18 Ensure SSH warning banner is configured|`bannerValue`|`\/([^ \t]+)`|No|
|5.2.19 Ensure SSH PAM is enabled|None|-|No|
|5.2.20 Ensure SSH AllowTcpForwarding is disabled|None|-|No|
|5.2.21 Ensure SSH MaxStartups is configured|`maxstartupsValue`|`^((10\|[1-9])\:(30\|[1-2][0-9]\|[1-9])\:(60\|[1-5][0-9]\|[1-9])[ \t]*)$`|No|
|5.2.22 Ensure SSH MaxSessions is limited|`maxsessionsValue`|`([1-9]\|10)[ \t]*`|No|
|5.3.1 Ensure password creation requirements are configured|None|-|No|
|5.3.2 Ensure lockout for failed password attempts is configured|None|-|No|
|5.3.3 Ensure password reuse is limited|None|-|No|
|5.4.1.1 Ensure password hashing algorithm is SHA-512|None|-|No|
|5.4.1.2 Ensure password expiration is 365 days or less|`maxDays`|`365`|Yes|
|5.4.1.3 Ensure minimum days between password changes is configured|`minDays`|`1`|Yes|
|5.4.1.4 Ensure password expiration warning days is 7 or more|`warnDays`|`7`|Yes|
|5.4.1.5 Ensure inactive password lock is 30 days or less|None|-|No|
|5.4.1.6 Ensure all users last password change date is in the past|None|-|No|
|5.4.2 Ensure system accounts are secured|None|-|No|
|5.4.3 Ensure default group for the root account is GID 0|None|-|No|
|5.4.4 Ensure default user shell timeout is configured|None|-|Yes|
|5.4.5 Ensure default user umask is configured|None|-|No|
|5.5 Ensure root login is restricted to system console|None|-|No|
|5.6 Ensure access to the su command is restricted|None|-|No|
|6.1.1 Audit system file permissions|None|-|No|
|6.1.2 Ensure permissions on /etc/passwd are configured|`mask`<br>`owner`<br>`group`|`0133`<br>`root`<br>`root`|Yes|
|6.1.3 Ensure permissions on /etc/shadow are configured|`mask`<br>`owner`|`0137`<br>`root`|Yes|
|6.1.4 Ensure permissions on /etc/group are configured|`mask`<br>`owner`<br>`group`|`0133`<br>`root`<br>`root`|Yes|
|6.1.5 Ensure permissions on /etc/passwd- are configured|`mask`<br>`owner`<br>`group`|`0133`<br>`root`<br>`root`|Yes|
|6.1.6 Ensure permissions on /etc/shadow- are configured|`mask`<br>`owner`|`0137`<br>`root`|Yes|
|6.1.7 Ensure permissions on /etc/group- are configured|`mask`<br>`owner`<br>`group`|`0133`<br>`root`<br>`root`|Yes|
|6.1.8 Ensure no world writable files exist|None|-|No|
|6.1.9 Ensure no unowned files or directories exist|None|-|No|
|6.1.10 Ensure no ungrouped files or directories exist|None|-|No|
|6.1.11 Audit SUID executables|None|-|No|
|6.1.12 Audit SGID executables|None|-|No|
|6.2.1 Ensure accounts in /etc/passwd use shadowed passwords|None|-|No|
|6.2.2 Ensure /etc/shadow password fields are not empty|None|-|No|
|6.2.3 Ensure root is the only UID 0 account|None|-|No|
|6.2.4 Ensure root PATH Integrity|None|-|No|
|6.2.5 Ensure all users' home directories exist|None|-|No|
|6.2.6 Ensure users' home directories permissions are 750 or more restrictive|None|-|No|
|6.2.7 Ensure users own their home directories|None|-|No|
|6.2.8 Ensure users' dot files are not group or world writable|None|-|No|
|6.2.9 Ensure no users have .forward files|None|-|No|
|6.2.10 Ensure no users have .netrc files|None|-|No|
|6.2.11 Ensure users' .netrc Files are not group or world accessible|None|-|No|
|6.2.12 Ensure no users have .rhosts files|None|-|No|
|6.2.13 Ensure all groups in /etc/passwd exist in /etc/group|None|-|No|
|6.2.14 Ensure no duplicate UIDs exist|None|-|No|
|6.2.15 Ensure no duplicate GIDs exist|None|-|No|
|6.2.16 Ensure no duplicate user names exist|None|-|No|
|6.2.17 Ensure no duplicate group names exist|None|-|No|
|6.2.18 Ensure shadow group is empty|None|-|No|

### Known assessment discrepancies

> [!NOTE]
> These rules may produce assessment results that differ from CIS-CAT® Pro Assessor; our implementation may enforce stricter criteria.
> A rule is listed once if a discrepancy was observed in any tested scenario.

Comparison data with CIS-CAT Pro Assessor is not available for this benchmark in this release. Assessment differences and unimplemented rules cannot be determined from comparison results.

## CIS SUSE Linux Enterprise 15 Benchmark 2.0.1 Level 1 + Level 2 - Server

### Rules

|Rule|Parameters|Default values|Remediation|
|---|---|---|---|
|1.1.1.1 Ensure cramfs kernel module is not available|None|-|Yes|
|1.1.1.2 Ensure freevxfs kernel module is not available|None|-|Yes|
|1.1.1.3 Ensure hfs kernel module is not available|None|-|Yes|
|1.1.1.4 Ensure hfsplus kernel module is not available|None|-|Yes|
|1.1.1.5 Ensure jffs2 kernel module is not available|None|-|Yes|
|1.1.1.6 Ensure overlay kernel module is not available|None|-|Yes|
|1.1.1.7 Ensure squashfs kernel module is not available|None|-|Yes|
|1.1.1.8 Ensure udf kernel module is not available|None|-|Yes|
|1.1.1.9 Ensure unused filesystems kernel modules are not available|None|-|No|
|1.1.2.1.1 Ensure /tmp is a separate partition|`mountPoint`|`/tmp`|No|
|1.1.2.1.2 Ensure nodev option set on /tmp partition|`mountPoint`<br>`requiredMountOptions`|`/tmp`<br>`nodev`|No|
|1.1.2.1.3 Ensure nosuid option set on /tmp partition|`mountPoint`<br>`requiredMountOptions`|`/tmp`<br>`nosuid`|No|
|1.1.2.1.4 Ensure noexec option set on /tmp partition|`mountPoint`<br>`requiredMountOptions`|`/tmp`<br>`noexec`|No|
|1.1.2.2.1 Ensure /dev/shm is a separate partition|`mountPoint`|`/dev/shm`|No|
|1.1.2.2.2 Ensure nodev option set on /dev/shm partition|`mountPoint`<br>`requiredMountOptions`|`/dev/shm`<br>`nodev`|No|
|1.1.2.2.3 Ensure nosuid option set on /dev/shm partition|`mountPoint`<br>`requiredMountOptions`|`/dev/shm`<br>`nosuid`|No|
|1.1.2.2.4 Ensure noexec option set on /dev/shm partition|`mountPoint`<br>`requiredMountOptions`|`/dev/shm`<br>`noexec`|No|
|1.1.2.3.1 Ensure separate partition exists for /home|`mountPoint`|`/home`|No|
|1.1.2.3.2 Ensure nodev option set on /home partition|`mountPoint`<br>`requiredMountOptions`|`/home`<br>`nodev`|No|
|1.1.2.3.3 Ensure nosuid option set on /home partition|`mountPoint`<br>`requiredMountOptions`|`/home`<br>`nosuid`|No|
|1.1.2.4.1 Ensure separate partition exists for /var|`mountPoint`|`/var`|No|
|1.1.2.4.2 Ensure nodev option set on /var partition|`mountPoint`<br>`requiredMountOptions`|`/var`<br>`nodev`|No|
|1.1.2.4.3 Ensure nosuid option set on /var partition|`mountPoint`<br>`requiredMountOptions`|`/var`<br>`nosuid`|No|
|1.1.2.5.1 Ensure separate partition exists for /var/tmp|`mountPoint`|`/var/tmp`|No|
|1.1.2.5.2 Ensure nodev option set on /var/tmp partition|`mountPoint`<br>`requiredMountOptions`|`/var/tmp`<br>`nodev`|No|
|1.1.2.5.3 Ensure nosuid option set on /var/tmp partition|`mountPoint`<br>`requiredMountOptions`|`/var/tmp`<br>`nosuid`|No|
|1.1.2.5.4 Ensure noexec option set on /var/tmp partition|`mountPoint`<br>`requiredMountOptions`|`/var/tmp`<br>`noexec`|No|
|1.1.2.6.1 Ensure separate partition exists for /var/log|`mountPoint`|`/var/log`|No|
|1.1.2.6.2 Ensure nodev option set on /var/log partition|`mountPoint`<br>`requiredMountOptions`|`/var/log`<br>`nodev`|No|
|1.1.2.6.3 Ensure nosuid option set on /var/log partition|`mountPoint`<br>`requiredMountOptions`|`/var/log`<br>`nosuid`|No|
|1.1.2.6.4 Ensure noexec option set on /var/log partition|`mountPoint`<br>`requiredMountOptions`|`/var/log`<br>`noexec`|No|
|1.1.2.7.1 Ensure separate partition exists for /var/log/audit|`mountPoint`|`/var/log/audit`|No|
|1.1.2.7.2 Ensure nodev option set on /var/log/audit partition|`mountPoint`<br>`requiredMountOptions`|`/var/log/audit`<br>`nodev`|No|
|1.1.2.7.3 Ensure nosuid option set on /var/log/audit partition|`mountPoint`<br>`requiredMountOptions`|`/var/log/audit`<br>`nosuid`|No|
|1.1.2.7.4 Ensure noexec option set on /var/log/audit partition|`mountPoint`<br>`requiredMountOptions`|`/var/log/audit`<br>`noexec`|No|
|1.2.1.1 Ensure GPG keys are configured|None|-|No|
|1.2.1.2 Ensure gpgcheck is globally activated|None|-|No|
|1.2.1.3 Ensure repo\_gpgcheck is globally activated|None|-|No|
|1.2.1.4 Ensure package manager repositories are configured|None|-|No|
|1.2.2.1 Ensure updates, patches, and additional security software are installed|None|-|No|
|1.3.1.1 Ensure AppArmor is installed|None|-|No|
|1.3.1.2 Ensure AppArmor is enabled in the bootloader configuration|None|-|No|
|1.3.1.3 Ensure all AppArmor Profiles are not disabled|None|-|No|
|1.3.1.4 Ensure all AppArmor Profiles are enforcing|None|-|No|
|1.4.1 Ensure bootloader password is set|None|-|No|
|1.4.2 Ensure access to bootloader config is configured|`filename`<br>`owner`<br>`group`<br>`mask`|`/boot/grub2/grub.cfg`<br>`root`<br>`root`<br>`0077`|Yes|
|1.5.1 Ensure address space layout randomization is enabled|None|-|No|
|1.5.2 Ensure core dumps are restricted|None|-|No|
|1.5.3 Ensure prelink is disabled|None|-|No|
|1.6.1 Ensure crypto-policies-scripts package is installed|None|-|No|
|1.6.2 Ensure system wide crypto policy is not set to legacy|None|-|No|
|1.6.3 Ensure system wide crypto policy is not set in sshd configuration|None|-|No|
|1.6.4 Ensure system wide crypto policy disables sha1 hash and signature support|None|-|No|
|1.6.5 Ensure system wide crypto policy disables macs less than 128 bits|None|-|No|
|1.6.6 Ensure system wide crypto policy disables cbc for ssh|None|-|No|
|1.6.7 Ensure system wide crypto policy disables chacha20-poly1305 for ssh|None|-|No|
|1.7.1 Ensure /etc/motd is configured|None|-|No|
|1.7.2 Ensure /etc/issue is configured|None|-|No|
|1.7.3 Ensure /etc/issue.net is configured|None|-|No|
|1.7.4 Ensure access to /etc/motd is configured|None|-|Yes|
|1.7.5 Ensure access to /etc/issue is configured|`filename`<br>`mask`<br>`owner`<br>`group`|`/etc/issue`<br>`0133`<br>`root`<br>`root`|Yes|
|1.7.6 Ensure access to /etc/issue.net is configured|`mask`<br>`owner`<br>`group`|`0133`<br>`root`<br>`root`|Yes|
|1.8.1 Ensure GNOME Display Manager is removed|None|-|No|
|1.8.2 Ensure GDM login banner is configured|None|-|Yes|
|1.8.3 Ensure GDM disable-user-list option is enabled|None|-|Yes|
|1.8.4 Ensure GDM screen locks when the user is idle|None|-|No|
|1.8.5 Ensure GDM screen locks cannot be overridden|None|-|No|
|1.8.6 Ensure GDM automatic mounting of removable media is disabled|None|-|Yes|
|1.8.7 Ensure GDM disabling automatic mounting of removable media is not overridden|None|-|Yes|
|1.8.8 Ensure GDM autorun-never is enabled|None|-|Yes|
|1.8.9 Ensure GDM autorun-never is not overridden|None|-|No|
|1.8.10 Ensure XDMCP is not enabled|None|-|No|
|2.1.1 Ensure autofs services are not in use|`unitName`<br>`expectedUnitFileState`<br>`expectedActiveState`<br>`packageName`|`autofs.service`<br>`enabled`<br>`active`<br>`autofs`|No|
|2.1.2 Ensure avahi daemon services are not in use|`unitNameAvahiDaemonService`<br>`expectedUnitFileState`<br>`expectedActiveState`<br>`unitNameAvahiDaemonSocket`<br>`packageName`|`avahi-daemon.service`<br>`enabled`<br>`active`<br>`avahi-daemon.socket`<br>`avahi`|No|
|2.1.3 Ensure dhcp server services are not in use|`unitNameDhcpdService`<br>`expectedUnitFileState`<br>`expectedActiveState`<br>`unitNameDhcpd6Service`<br>`packageName`|`dhcpd.service`<br>`enabled`<br>`active`<br>`dhcpd6.service`<br>`dhcp-server`|No|
|2.1.4 Ensure dns server services are not in use|`serviceName`<br>`expectedUnitFileState`<br>`expectedActiveState`<br>`packageName`|`named.service`<br>`enabled`<br>`active`<br>`bind`|No|
|2.1.5 Ensure dnsmasq services are not in use|`unitName`<br>`expectedUnitFileState`<br>`expectedActiveState`<br>`packageName`|`dnsmasq.service`<br>`enabled`<br>`active`<br>`dnsmasq`|No|
|2.1.6 Ensure samba file server services are not in use|`unitName`<br>`expectedUnitFileState`<br>`expectedActiveState`<br>`packageName`|`smb.service`<br>`enabled`<br>`active`<br>`samba`|No|
|2.1.7 Ensure ldap server services are not in use|`packageNameOpenldap2`<br>`packageNameOpenldap25`<br>`unitName`<br>`expectedUnitFileState`<br>`expectedActiveState`|`openldap2`<br>`openldap2_5`<br>`slapd.service`<br>`enabled`<br>`active`|No|
|2.1.8 Ensure ftp server services are not in use|`serviceName`<br>`expectedUnitFileState`<br>`expectedActiveState`<br>`packageName`|`vsftpd.service`<br>`enabled`<br>`active`<br>`vsftpd`|No|
|2.1.9 Ensure message access server services are not in use|`unitNameDovecotService`<br>`expectedUnitFileState`<br>`expectedActiveState`<br>`unitNameDovecotSocket`<br>`packageNameDovecot`<br>`unitNameCyrusImapdService`<br>`packageNameCyrusImapd`|`dovecot.service`<br>`enabled`<br>`active`<br>`dovecot.socket`<br>`dovecot`<br>`cyrus-imapd.service`<br>`cyrus-imapd`|No|
|2.1.10 Ensure network file system services are not in use|`unitName`<br>`expectedUnitFileState`<br>`expectedActiveState`<br>`packageName`|`nfs-server.service`<br>`enabled`<br>`active`<br>`nfs-kernel-server`|No|
|2.1.11 Ensure nis server services are not in use|`unitName`<br>`expectedUnitFileState`<br>`expectedActiveState`<br>`packageName`|`ypserv.service`<br>`enabled`<br>`active`<br>`ypserv`|No|
|2.1.12 Ensure print server services are not in use|`unitNameCupsService`<br>`expectedUnitFileState`<br>`expectedActiveState`<br>`unitNameCupsSocket`<br>`packageName`|`cups.service`<br>`enabled`<br>`active`<br>`cups.socket`<br>`cups`|No|
|2.1.13 Ensure rpcbind services are not in use|`unitNameRpcbindService`<br>`expectedUnitFileState`<br>`expectedActiveState`<br>`unitNameRpcbindSocket`<br>`packageName`|`rpcbind.service`<br>`enabled`<br>`active`<br>`rpcbind.socket`<br>`rpcbind`|No|
|2.1.14 Ensure rsync services are not in use|`unitNameRsyncdService`<br>`expectedUnitFileState`<br>`expectedActiveState`<br>`unitNameRsyncdSocket`<br>`packageName`|`rsyncd.service`<br>`enabled`<br>`active`<br>`rsyncd.socket`<br>`rsync`|No|
|2.1.15 Ensure snmp services are not in use|`unitName`<br>`expectedUnitFileState`<br>`expectedActiveState`<br>`packageName`|`snmpd.service`<br>`enabled`<br>`active`<br>`net-snmp`|No|
|2.1.16 Ensure telnet server services are not in use|`unitName`<br>`expectedUnitFileState`<br>`expectedActiveState`<br>`packageName`|`telnet.socket`<br>`enabled`<br>`active`<br>`telnet-server`|No|
|2.1.17 Ensure tftp server services are not in use|`unitNameTftpService`<br>`expectedUnitFileState`<br>`expectedActiveState`<br>`unitNameTftpSocket`<br>`packageName`|`tftp.service`<br>`enabled`<br>`active`<br>`tftp.socket`<br>`tftp-server`|No|
|2.1.18 Ensure web proxy server services are not in use|`unitName`<br>`expectedUnitFileState`<br>`expectedActiveState`<br>`packageName`|`squid.service`<br>`enabled`<br>`active`<br>`squid`|No|
|2.1.19 Ensure web server services are not in use|`unitNameApache2Service`<br>`expectedUnitFileState`<br>`expectedActiveState`<br>`packageNameApache2`<br>`unitNameNginxService`<br>`packageNameNginx`|`apache2.service`<br>`enabled`<br>`active`<br>`apache2`<br>`nginx.service`<br>`nginx`|No|
|2.1.20 Ensure xinetd services are not in use|`unitName`<br>`expectedUnitFileState`<br>`expectedActiveState`<br>`packageName`|`xinetd.service`<br>`enabled`<br>`active`<br>`xinetd`|No|
|2.1.21 Ensure X window server services are not in use|None|-|No|
|2.1.22 Ensure mail transfer agents are configured for local-only mode|None|-|No|
|2.1.23 Ensure only approved services are listening on a network interface|None|-|No|
|2.2.1 Ensure ftp client is not installed|None|-|No|
|2.2.2 Ensure ldap client is not installed|None|-|No|
|2.2.3 Ensure nis client is not installed|None|-|No|
|2.2.4 Ensure telnet client is not installed|`packageName`|`telnet`|No|
|2.2.5 Ensure tftp client is not installed|None|-|No|
|2.3.1.1 Ensure a single time synchronization daemon is in use|None|-|No|
|2.3.2.1 Ensure systemd-timesyncd configured with authorized timeserver|None|-|No|
|2.3.2.2 Ensure systemd-timesyncd is enabled and running|None|-|No|
|2.3.3.1 Ensure chrony is configured|None|-|No|
|2.3.3.2 Ensure chrony is enabled and running|None|-|No|
|2.4.1.1 Ensure cron daemon is enabled and active|None|-|No|
|2.4.1.2 Ensure access to /etc/crontab is configured|`mask`<br>`owner`<br>`group`|`0177`<br>`root`<br>`root`|Yes|
|2.4.1.3 Ensure access to /etc/cron.hourly is configured|`mask`<br>`owner`<br>`group`|`0077`<br>`root`<br>`root`|Yes|
|2.4.1.4 Ensure access to /etc/cron.daily is configured|`mask`<br>`owner`<br>`group`|`0077`<br>`root`<br>`root`|Yes|
|2.4.1.5 Ensure access to /etc/cron.weekly is configured|`mask`<br>`owner`<br>`group`|`0077`<br>`root`<br>`root`|Yes|
|2.4.1.6 Ensure access to /etc/cron.monthly is configured|`mask`<br>`owner`<br>`group`|`0077`<br>`root`<br>`root`|Yes|
|2.4.1.7 Ensure access to /etc/cron.d is configured|`mask`<br>`owner`<br>`group`|`0077`<br>`root`<br>`root`|Yes|
|2.4.1.8 Ensure access to crontab is configured|`owner`<br>`group`<br>`mask`|`root`<br>`root\|crontab`<br>`0137`|Yes|
|2.4.2.1 Ensure access to at is configured|`filenameEtcAtAllow`<br>`mask`<br>`owner`<br>`group`<br>`filenameEtcAtDeny`|`/etc/at.allow`<br>`0137`<br>`root`<br>`root\|daemon`<br>`/etc/at.deny`|Yes|
|3.1.1 Ensure IPv6 status is identified|None|-|No|
|3.1.2 Ensure wireless interfaces are not available|None|-|No|
|3.1.3 Ensure bluetooth services are not in use|`unitName`<br>`expectedUnitFileState`<br>`expectedActiveState`<br>`packageName`|`bluetooth.service`<br>`enabled`<br>`active`<br>`bluez`|No|
|3.2.1 Ensure dccp kernel module is not available|None|-|Yes|
|3.2.2 Ensure tipc kernel module is not available|None|-|Yes|
|3.2.3 Ensure rds kernel module is not available|None|-|Yes|
|3.2.4 Ensure sctp kernel module is not available|None|-|Yes|
|3.3.1 Ensure ip forwarding is disabled|None|-|No|
|3.3.2 Ensure packet redirect sending is disabled|None|-|No|
|3.3.3 Ensure bogus icmp responses are ignored|None|-|No|
|3.3.4 Ensure broadcast icmp requests are ignored|None|-|No|
|3.3.5 Ensure icmp redirects are not accepted|None|-|No|
|3.3.6 Ensure secure icmp redirects are not accepted|None|-|No|
|3.3.7 Ensure reverse path filtering is enabled|None|-|No|
|3.3.8 Ensure source routed packets are not accepted|None|-|No|
|3.3.9 Ensure suspicious packets are logged|None|-|No|
|3.3.10 Ensure tcp syn cookies is enabled|None|-|No|
|3.3.11 Ensure ipv6 router advertisements are not accepted|None|-|No|
|4.1.1 Ensure a single firewall configuration utility is in use|None|-|No|
|4.2.1 Ensure firewalld is installed|None|-|No|
|4.2.2 Ensure firewalld drops unnecessary services and ports|None|-|No|
|4.2.3 Ensure firewalld loopback traffic is configured|None|-|No|
|4.2.4 Ensure default zone is set|None|-|No|
|4.2.5 Ensure firewalld service is enabled and running|None|-|No|
|5.1.1 Ensure access to /etc/ssh/sshd\_config is configured|`mask`<br>`owner`<br>`group`|`0177`<br>`root`<br>`root`|Yes|
|5.1.2 Ensure access to SSH private host key files is configured|None|-|No|
|5.1.3 Ensure access to SSH public host key files is configured|None|-|No|
|5.1.4 Ensure sshd Ciphers are configured|`ciphersDisallowedValues`|`3des-cbc,aes128-cbc,aes192-cbc,aes256-cbc,arcfour,arcfour128,arcfour256,blowfish-cbc,cast128-cbc,rijndael-cbc@lysator\.liu\.se`|No|
|5.1.5 Ensure sshd KexAlgorithms is configured|`kexalgorithmsDisallowedValues`|`diffie-hellman-group1-sha1,diffie-hellman-group14-sha1,diffie-hellman-group-exchange-sha1`|No|
|5.1.6 Ensure sshd MACs are configured|`macsDisallowedValues`|`hmac-md5,hmac-md5-96,hmac-ripemd160,hmac-sha1-96,umac-64@openssh\.com,hmac-md5-etm@openssh\.com,hmac-md5-96-etm@openssh\.com,hmac-ripemd160-etm@openssh\.com,hmac-sha1-96-etm@openssh\.com,umac-64-etm@openssh\.com,umac-128-etm@openssh\.com`|No|
|5.1.7 Ensure sshd access is configured|`allowUsersValuePattern`<br>`allowGroupsValuePattern`<br>`denyUsersValuePattern`<br>`denyGroupsValuePattern`|`[^ \t]+`<br>`[^ \t]+`<br>`[^ \t]+`<br>`[^ \t]+`|No|
|5.1.8 Ensure sshd Banner is configured|`bannerExpectedValueT`<br>`bannerDisallowedValuesNone`|`\/[^ \t]+`<br>`none`|No|
|5.1.9 Ensure sshd ClientAliveInterval and ClientAliveCountMax are configured|`clientalivecountmaxThreshold`<br>`clientaliveintervalThreshold`|`0`<br>`0`|No|
|5.1.10 Ensure sshd DisableForwarding is enabled|None|-|No|
|5.1.11 Ensure sshd GSSAPIAuthentication is disabled|None|-|No|
|5.1.12 Ensure sshd HostbasedAuthentication is disabled|None|-|No|
|5.1.13 Ensure sshd IgnoreRhosts is enabled|None|-|No|
|5.1.14 Ensure sshd LoginGraceTime is configured|`logingracetimeThresholdValue60`<br>`logingracetimeThresholdValue0`|`60`<br>`0`|No|
|5.1.15 Ensure sshd LogLevel is configured|`loglevelExpectedValue`|`verbose,info`|No|
|5.1.16 Ensure sshd MaxAuthTries is configured|`maxauthtriesThreshold`|`4`|No|
|5.1.17 Ensure sshd MaxStartups is configured|`maxstartupsExpectedValue`|`10:30:60`|No|
|5.1.18 Ensure sshd MaxSessions is configured|`maxsessionsThreshold`|`10`|No|
|5.1.19 Ensure sshd PermitEmptyPasswords is disabled|None|-|No|
|5.1.20 Ensure sshd PermitRootLogin is disabled|None|-|No|
|5.1.21 Ensure sshd PermitUserEnvironment is disabled|None|-|No|
|5.1.22 Ensure sshd UsePAM is enabled|None|-|No|
|5.2.1 Ensure sudo is installed|None|-|No|
|5.2.2 Ensure sudo commands use pty|None|-|No|
|5.2.3 Ensure sudo log file exists|None|-|No|
|5.2.4 Ensure users must provide password for escalation|None|-|No|
|5.2.5 Ensure re-authentication for privilege escalation is not disabled globally|None|-|No|
|5.2.6 Ensure sudo authentication timeout is configured correctly|None|-|No|
|5.2.7 Ensure access to the su command is restricted|None|-|No|
|5.3.1.1 Ensure latest version of pam is installed|None|-|No|
|5.3.2.1.1 Ensure password failed attempts lockout is configured|None|-|No|
|5.3.2.1.2 Ensure password unlock time is configured|None|-|No|
|5.3.2.1.3 Ensure password failed attempts lockout includes root account|None|-|No|
|5.3.2.2.1 Ensure password dictionary check is enabled|None|-|No|
|5.3.2.2.2 Ensure password number of changed characters is configured|None|-|No|
|5.3.2.2.3 Ensure password length is configured|None|-|No|
|5.3.2.2.4 Ensure password complexity is configured|None|-|No|
|5.3.2.2.5 Ensure password same consecutive characters is configured|None|-|No|
|5.3.2.2.6 Ensure password maximum sequential characters is configured|None|-|No|
|5.3.2.2.7 Ensure password quality is enforced for the root user|None|-|No|
|5.3.2.3.1 Ensure password history remember is configured|None|-|No|
|5.3.2.3.2 Ensure password history is enforced for the root user|None|-|No|
|5.3.2.3.3 Ensure pam\_pwhistory includes use\_authtok|None|-|No|
|5.3.2.4.1 Ensure pam\_unix does not include nullok|None|-|No|
|5.3.2.4.2 Ensure pam\_unix does not include remember|None|-|No|
|5.3.2.4.3 Ensure pam\_unix includes a strong password hashing algorithm|None|-|No|
|5.3.2.4.4 Ensure pam\_unix includes use\_authtok|None|-|No|
|5.4.1.1 Ensure password expiration is configured|`maxDays`<br>`minDays`|`365`<br>`1`|Yes|
|5.4.1.2 Ensure minimum password days is configured|`minDays`|`1`|No|
|5.4.1.3 Ensure password expiration warning days is configured|`warnDays`|`7`|Yes|
|5.4.1.4 Ensure strong password hashing algorithm is configured|`hashAlgorithm`<br>`fallbackHashAlgorithm`|`YESCRYPT`<br>`SHA512`|Yes|
|5.4.1.5 Ensure inactive password lock is configured|None|-|No|
|5.4.1.6 Ensure all users last password change date is in the past|None|-|No|
|5.4.2.1 Ensure root is the only UID 0 account|None|-|No|
|5.4.2.2 Ensure root is the only GID 0 account|None|-|No|
|5.4.2.3 Ensure group root is the only GID 0 group|None|-|No|
|5.4.2.4 Ensure root account access is controlled|None|-|No|
|5.4.2.5 Ensure root path integrity|None|-|No|
|5.4.2.6 Ensure root user umask is configured|None|-|No|
|5.4.2.7 Ensure system accounts do not have a valid login shell|None|-|No|
|5.4.2.8 Ensure accounts without a valid login shell are locked|None|-|No|
|5.4.3.1 Ensure nologin is not listed in /etc/shells|None|-|No|
|5.4.3.2 Ensure default user shell timeout is configured|None|-|Yes|
|5.4.3.3 Ensure default user umask is configured|None|-|Yes|
|6.1.1 Ensure AIDE is installed|None|-|No|
|6.1.2 Ensure filesystem integrity is regularly checked|None|-|No|
|6.1.3 Ensure cryptographic mechanisms are used to protect the integrity of audit tools|None|-|No|
|6.2.1.1 Ensure journald service is enabled and active|None|-|No|
|6.2.1.2 Ensure journald log file access is configured|None|-|No|
|6.2.1.3 Ensure journald log file rotation is configured|None|-|No|
|6.2.1.4 Ensure only one logging system is in use|None|-|No|
|6.2.2.1.1 Ensure systemd-journal-remote is installed|None|-|No|
|6.2.2.1.2 Ensure systemd-journal-upload authentication is configured|None|-|No|
|6.2.2.1.3 Ensure systemd-journal-upload is enabled and active|None|-|No|
|6.2.2.1.4 Ensure systemd-journal-remote service is not in use|None|-|No|
|6.2.2.2 Ensure journald ForwardToSyslog is disabled|`forwardToSyslogRegex`|`no`|No|
|6.2.2.3 Ensure journald Compress is configured|`compressRegex`|`yes`|No|
|6.2.2.4 Ensure journald Storage is configured|`storageRegex`|`persistent`|No|
|6.2.3.1.1 Ensure rsyslog is configured to send logs to a remote log host|None|-|No|
|6.2.3.1.2 Ensure rsyslog is not configured to receive logs from a remote client|None|-|No|
|6.2.3.2 Ensure rsyslog is installed|None|-|No|
|6.2.3.3 Ensure rsyslog service is enabled and active|None|-|No|
|6.2.3.4 Ensure journald is configured to send logs to rsyslog|`forwardToSyslogRegex`|`yes`|No|
|6.2.3.5 Ensure rsyslog log file creation mode is configured|None|-|No|
|6.2.3.6 Ensure rsyslog logging is configured|None|-|No|
|6.2.3.7 Ensure rsyslog logrotate is configured|None|-|No|
|6.2.4.1 Ensure access to all logfiles has been configured|None|-|No|
|6.3.1.1 Ensure auditd packages are installed|None|-|No|
|6.3.1.2 Ensure auditing for processes that start prior to auditd is enabled|None|-|No|
|6.3.1.3 Ensure audit\_backlog\_limit is sufficient|None|-|No|
|6.3.1.4 Ensure auditd service is enabled and active|None|-|No|
|6.3.2.1 Ensure audit log storage size is configured|None|-|No|
|6.3.2.2 Ensure audit logs are not automatically deleted|None|-|No|
|6.3.2.3 Ensure system is disabled when audit logs are full|None|-|No|
|6.3.2.4 Ensure system warns when audit logs are low on space|None|-|No|
|6.3.3.1 Ensure changes to system administration scope (sudoers) is collected|None|-|No|
|6.3.3.2 Ensure actions as another user are always logged|None|-|No|
|6.3.3.3 Ensure events that modify the sudo log file are collected|None|-|No|
|6.3.3.4 Ensure events that modify date and time information are collected|None|-|No|
|6.3.3.5 Ensure events that modify the system's network environment are collected|None|-|No|
|6.3.3.6 Ensure use of privileged commands are collected|None|-|No|
|6.3.3.7 Ensure unsuccessful file access attempts are collected|None|-|No|
|6.3.3.8 Ensure events that modify user/group information are collected|None|-|No|
|6.3.3.9 Ensure discretionary access control permission modification events are collected|None|-|No|
|6.3.3.10 Ensure successful file system mounts are collected|None|-|No|
|6.3.3.11 Ensure session initiation information is collected|None|-|No|
|6.3.3.12 Ensure login and logout events are collected|None|-|No|
|6.3.3.13 Ensure file deletion events by users are collected|None|-|No|
|6.3.3.14 Ensure events that modify the system's Mandatory Access Controls are collected|None|-|No|
|6.3.3.15 Ensure successful and unsuccessful attempts to use the chcon command are collected|None|-|No|
|6.3.3.16 Ensure successful and unsuccessful attempts to use the setfacl command are collected|None|-|No|
|6.3.3.17 Ensure successful and unsuccessful attempts to use the chacl command are collected|None|-|No|
|6.3.3.18 Ensure successful and unsuccessful attempts to use the usermod command are collected|None|-|No|
|6.3.3.19 Ensure kernel module loading unloading and modification is collected|None|-|No|
|6.3.3.20 Ensure the audit configuration is immutable|None|-|No|
|6.3.3.21 Ensure the running and on disk configuration is the same|None|-|No|
|6.3.4.1 Ensure the audit log file directory mode is configured|None|-|No|
|6.3.4.2 Ensure audit log files mode is configured|None|-|No|
|6.3.4.3 Ensure audit log files owner is configured|None|-|No|
|6.3.4.4 Ensure audit log files group owner is configured|None|-|No|
|6.3.4.5 Ensure audit configuration files mode is configured|`directory`<br>`filePatternConf`<br>`mask`<br>`filePatternRules`|`/etc/audit/`<br>`*.conf`<br>`0137`<br>`*.rules`|No|
|6.3.4.6 Ensure audit configuration files owner is configured|`directory`<br>`filePatternConf`<br>`owner`<br>`filePatternRules`|`/etc/audit/`<br>`*.conf`<br>`root`<br>`*.rules`|No|
|6.3.4.7 Ensure audit configuration files group owner is configured|`directory`<br>`filePatternConf`<br>`group`<br>`filePatternRules`|`/etc/audit/`<br>`*.conf`<br>`root`<br>`*.rules`|No|
|6.3.4.8 Ensure audit tools mode is configured|`filenameSbinAuditctl`<br>`mask`<br>`filenameSbinAureport`<br>`filenameSbinAusearch`<br>`filenameSbinAutrace`<br>`filenameSbinAuditd`<br>`filenameSbinAugenrules`|`/sbin/auditctl`<br>`0022`<br>`/sbin/aureport`<br>`/sbin/ausearch`<br>`/sbin/autrace`<br>`/sbin/auditd`<br>`/sbin/augenrules`|Yes|
|6.3.4.9 Ensure audit tools owner is configured|`filenameSbinAuditctl`<br>`owner`<br>`filenameSbinAureport`<br>`filenameSbinAusearch`<br>`filenameSbinAutrace`<br>`filenameSbinAuditd`<br>`filenameSbinAugenrules`|`/sbin/auditctl`<br>`root`<br>`/sbin/aureport`<br>`/sbin/ausearch`<br>`/sbin/autrace`<br>`/sbin/auditd`<br>`/sbin/augenrules`|Yes|
|6.3.4.10 Ensure audit tools group owner is configured|`filenameSbinAuditctl`<br>`group`<br>`filenameSbinAureport`<br>`filenameSbinAusearch`<br>`filenameSbinAutrace`<br>`filenameSbinAuditd`<br>`filenameSbinAugenrules`|`/sbin/auditctl`<br>`root`<br>`/sbin/aureport`<br>`/sbin/ausearch`<br>`/sbin/autrace`<br>`/sbin/auditd`<br>`/sbin/augenrules`|Yes|
|7.1.1 Ensure access to /etc/passwd is configured|`mask`<br>`owner`<br>`group`|`0133`<br>`root`<br>`root`|Yes|
|7.1.2 Ensure access to /etc/passwd- is configured|`mask`<br>`owner`<br>`group`|`0133`<br>`root`<br>`root`|Yes|
|7.1.3 Ensure access to /etc/group is configured|`mask`<br>`owner`<br>`group`|`0133`<br>`root`<br>`root`|Yes|
|7.1.4 Ensure access to /etc/group- is configured|`mask`<br>`owner`<br>`group`|`0133`<br>`root`<br>`root`|Yes|
|7.1.5 Ensure access to /etc/shadow is configured|`mask`<br>`owner`<br>`group`|`0137`<br>`root`<br>`root\|shadow`|Yes|
|7.1.6 Ensure access to /etc/shadow- is configured|`mask`<br>`owner`<br>`group`|`0137`<br>`root`<br>`root\|shadow`|Yes|
|7.1.7 Ensure access to /etc/gshadow is configured|`mask`<br>`owner`<br>`group`|`0137`<br>`root`<br>`shadow\|root`|Yes|
|7.1.8 Ensure access to /etc/gshadow- is configured|`mask`<br>`owner`<br>`group`|`0137`<br>`root`<br>`shadow\|root`|Yes|
|7.1.9 Ensure access to /etc/shells is configured|`mask`<br>`owner`<br>`group`|`0133`<br>`root`<br>`root`|Yes|
|7.1.10 Ensure access to /etc/security/opasswd is configured|`mask`<br>`owner`<br>`group`|`0177`<br>`root`<br>`root`|Yes|
|7.1.11 Ensure world writable files and directories are secured|None|-|No|
|7.1.12 Ensure no files or directories without an owner and a group exist|None|-|No|
|7.1.13 Ensure SUID and SGID files are reviewed|None|-|No|
|7.2.1 Ensure accounts in /etc/passwd use shadowed passwords|None|-|No|
|7.2.2 Ensure /etc/shadow password fields are not empty|None|-|No|
|7.2.3 Ensure all groups in /etc/passwd exist in /etc/group|None|-|No|
|7.2.4 Ensure no duplicate UIDs exist|None|-|No|
|7.2.5 Ensure no duplicate GIDs exist|None|-|No|
|7.2.6 Ensure no duplicate user names exist|None|-|No|
|7.2.7 Ensure no duplicate group names exist|None|-|No|
|7.2.8 Ensure local interactive user home directories are configured|None|-|No|
|7.2.9 Ensure local interactive user dot files access is configured|None|-|No|

### Known assessment discrepancies

> [!NOTE]
> These rules may produce assessment results that differ from CIS-CAT® Pro Assessor; our implementation may enforce stricter criteria.
> A rule is listed once if a discrepancy was observed in any tested scenario.

- 5.3.2.2.4 Ensure password complexity is configured
- 5.3.2.3.1 Ensure password history remember is configured
- 5.3.2.3.2 Ensure password history is enforced for the root user
- 6.1.3 Ensure cryptographic mechanisms are used to protect the integrity of audit tools
