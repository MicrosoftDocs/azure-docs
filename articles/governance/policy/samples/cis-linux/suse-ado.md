---
title: Reference - CIS Security Benchmarks for SUSE Linux Enterprise via Machine Configuration
description: Reference - CIS Security Benchmarks for SUSE Linux Enterprise via Machine Configuration
ms.date: 06/18/2026
author: pallakatos
ms.author: pallakatos
ms.topic: reference
ms.custom: generated
---

# Release notes - SUSE Linux Enterprise

This article provides detailed information about the CIS Security Benchmarks for SUSE Linux Enterprise, including supported benchmarks, mismatched rules, and configurable parameters across all supported versions.

## Supported benchmarks

|SUSE Linux Enterprise Version|Benchmark Title|
|---|---|
|SUSE Linux Enterprise 12|[CIS SUSE Linux Enterprise 12 Benchmark 3.2.1 Level 1 + Level 2 - Server](#cis-suse-linux-enterprise-12-benchmark-321-level-1--level-2---server)|
|SUSE Linux Enterprise 15|[CIS SUSE Linux Enterprise 15 Benchmark 2.0.1 Level 1 + Level 2 - Server](#cis-suse-linux-enterprise-15-benchmark-201-level-1--level-2---server)|

## CIS SUSE Linux Enterprise 12 Benchmark 3.2.1 Level 1 + Level 2 - Server

### Mismatched rules

> [!NOTE]
> The mismatched rules are the ones that in some circumstances the assessment might differ from CIS-CAT® Pro Assessor; usually our implementation enforces stricter criteria.

- None

### Configurable parameters

|Rule|Parameter|Default Value|
|---|---|---|
|Ensure permissions on bootloader config are configured|filename|/boot/grub2/grub.cfg|
||owner|root|
||group|root|
||mask|0077|
|Ensure permissions on /etc/motd are configured|filename|/etc/motd|
||mask|644|
||owner|root|
||group|root|
|Ensure permissions on /etc/issue.net are configured|filename|/etc/issue.net|
||owner|root|
||group|root|
||mask|7133|
|Ensure time synchronization is in use|packageName|chrony|
|Ensure telnet client is not installed|packageName|telnet|
|Ensure permissions on all logfiles are configured|directory|/var/log|
||filePattern|.*|
||mask|0037|
|Ensure permissions on /etc/crontab are configured|mask|0177|
||owner|root|
||group|root|
|Ensure permissions on /etc/cron.hourly are configured|mask|0077|
||owner|root|
||group|root|
|Ensure permissions on /etc/cron.daily are configured|mask|0077|
||owner|root|
||group|root|
||packageName|cronie|
|Ensure permissions on /etc/cron.weekly are configured|mask|0077|
||owner|root|
||group|root|
|Ensure permissions on /etc/cron.monthly are configured|mask|0077|
||owner|root|
||group|root|
||alternativePackageName|cronie|
|Ensure permissions on /etc/cron.d are configured|mask|0077|
||owner|root|
||group|root|
|Ensure cron is restricted to authorized users|filename|/etc/cron.allow|
||owner|root|
||group|root|
||mask|0177|
|Ensure at is restricted to authorized users|owner|root|
||group|root|
||mask|0177|
|Ensure permissions on /etc/ssh/sshd_config are configured|mask|0077|
||owner|root|
||group|root|
|Ensure permissions on SSH public host key files are configured|directory|/etc/ssh|
||filePattern|^(ssh\_host\_.*\_key\.pub)$|
||group|root|
||mask|0033|
|Ensure SSH access is limited|allowUsersValuePattern|[^ \t]+|
||allowGroupsValuePattern|[^ \t]+|
||denyUsersValuePattern|[^ \t]+|
||denyGroupsValuePattern|[^ \t]+|
|Ensure SSH LogLevel is appropriate|loglevelValue|[ \t]*(VERBOSE\|INFO)[ \t]*|
|Ensure SSH MaxAuthTries is set to 4 or less|maxauthtriesValue|[ \t]*[0-4][ \t]*|
|Ensure only strong Ciphers are used|ciphersDisallowedValues|3des-cbc,aes128-cbc,aes192-cbc,aes256-cbc,arcfour,arcfour128,arcfour256,blowfish-cbc,cast128-cbc,rijndael-cbc@lysator.liu.se|
|Ensure only strong MAC algorithms are used|macsDisallowedValues|hmac-md5,hmac-md5-96,hmac-ripemd160,hmac-sha1,hmac-sha1-96,umac-64@openssh\.com,hmac-md5-etm@openssh\.com,hmac-md5-96-etm@openssh\.com,hmac-ripemd160-etm@openssh\.com,hmac-sha1-etm@openssh\.com,hmac-sha1-96-etm@openssh\.com,umac-64-etm@openssh\.com,umac-128-etm@openssh\.com|
|Ensure only strong Key Exchange algorithms are used|kexalgorithmsDisallowedValues|diffie-hellman-group1-sha1,diffie-hellman-group14-sha1,diffie-hellman-group-exchange-sha1|
|Ensure SSH Idle Timeout Interval is configured|clientaliveintervalValue|[ \t]*([1-9]\|[1-9][0-9]\|[0-2][0-9][0-9]\|300)[ \t]*|
||clientalivecountmaxValue|[ \t]*[1-3][ \t]*|
|Ensure SSH LoginGraceTime is set to one minute or less|logingracetimeValue|[ \t]*([1-9]\|[1-5][0-9]\|60\|1m)[ \t]*|
|Ensure SSH warning banner is configured|bannerValue|\/(\S+)|
|Ensure SSH MaxStartups is configured|maxstartupsValue|(10\|[1-9])\:(30\|[1-2][0-9]\|[1-9])\:(60\|[1-5][0-9]\|[1-9])[ \t]*|
|Ensure SSH MaxSessions is limited|maxsessionsValue|([1-9]\|10)[ \t]*|
|Ensure password expiration is 365 days or less|maxDays|365|
|Ensure minimum days between password changes is configured|minDays|1|
|Ensure password expiration warning days is 7 or more|warnDays|7|
|Ensure permissions on /etc/passwd are configured|mask|0133|
||owner|root|
||group|root|
|Ensure permissions on /etc/shadow are configured|mask|0137|
||owner|root|
|Ensure permissions on /etc/group are configured|mask|0133|
||owner|root|
||group|root|
|Ensure permissions on /etc/passwd- are configured|mask|0133|
||owner|root|
||group|root|
|Ensure permissions on /etc/shadow- are configured|mask|0137|
||owner|root|
|Ensure permissions on /etc/group- are configured|mask|0133|
||owner|root|
||group|root|

## CIS SUSE Linux Enterprise 15 Benchmark 2.0.1 Level 1 + Level 2 - Server

### Mismatched rules

> [!NOTE]
> The mismatched rules are the ones that in some circumstances the assessment might differ from CIS-CAT® Pro Assessor; usually our implementation enforces stricter criteria.

- Ensure a single time synchronization daemon is in use
- Ensure password history remember is configured
- Ensure password history is enforced for the root user
- Ensure only one logging system is in use

### Configurable parameters

|Rule|Parameter|Default Value|
|---|---|---|
|Ensure /tmp is a separate partition|mountPoint|/tmp|
|Ensure nodev option set on /tmp partition|mountPoint|/tmp|
||requiredMountOptions|nodev|
|Ensure nosuid option set on /tmp partition|mountPoint|/tmp|
||requiredMountOptions|nosuid|
|Ensure noexec option set on /tmp partition|mountPoint|/tmp|
||requiredMountOptions|noexec|
|Ensure /dev/shm is a separate partition|mountPoint|/dev/shm|
|Ensure nodev option set on /dev/shm partition|mountPoint|/dev/shm|
||requiredMountOptions|nodev|
|Ensure nosuid option set on /dev/shm partition|mountPoint|/dev/shm|
||requiredMountOptions|nosuid|
|Ensure noexec option set on /dev/shm partition|mountPoint|/dev/shm|
||requiredMountOptions|noexec|
|Ensure separate partition exists for /home|mountPoint|/home|
|Ensure nodev option set on /home partition|mountPoint|/home|
||requiredMountOptions|nodev|
|Ensure nosuid option set on /home partition|mountPoint|/home|
||requiredMountOptions|nosuid|
|Ensure separate partition exists for /var|mountPoint|/var|
|Ensure nodev option set on /var partition|mountPoint|/var|
||requiredMountOptions|nodev|
|Ensure nosuid option set on /var partition|mountPoint|/var|
||requiredMountOptions|nosuid|
|Ensure separate partition exists for /var/tmp|mountPoint|/var/tmp|
|Ensure nodev option set on /var/tmp partition|mountPoint|/var/tmp|
||requiredMountOptions|nodev|
|Ensure nosuid option set on /var/tmp partition|mountPoint|/var/tmp|
||requiredMountOptions|nosuid|
|Ensure noexec option set on /var/tmp partition|mountPoint|/var/tmp|
||requiredMountOptions|noexec|
|Ensure separate partition exists for /var/log|mountPoint|/var/log|
|Ensure nodev option set on /var/log partition|mountPoint|/var/log|
||requiredMountOptions|nodev|
|Ensure nosuid option set on /var/log partition|mountPoint|/var/log|
||requiredMountOptions|nosuid|
|Ensure noexec option set on /var/log partition|mountPoint|/var/log|
||requiredMountOptions|noexec|
|Ensure separate partition exists for /var/log/audit|mountPoint|/var/log/audit|
|Ensure nodev option set on /var/log/audit partition|mountPoint|/var/log/audit|
||requiredMountOptions|nodev|
|Ensure nosuid option set on /var/log/audit partition|mountPoint|/var/log/audit|
||requiredMountOptions|nosuid|
|Ensure noexec option set on /var/log/audit partition|mountPoint|/var/log/audit|
||requiredMountOptions|noexec|
|Ensure access to bootloader config is configured|filename|/boot/grub2/grub.cfg|
||owner|root|
||group|root|
||mask|0077|
|Ensure access to /etc/issue is configured|filename|/etc/issue|
||mask|0133|
||owner|root|
||group|root|
|Ensure access to /etc/issue.net is configured|mask|0133|
||owner|root|
||group|root|
|Ensure autofs services are not in use|unitName|autofs.service|
||expectedUnitFileState|enabled|
||expectedActiveState|active|
||packageName|autofs|
|Ensure avahi daemon services are not in use|unitNameAvahiDaemonService|avahi-daemon.service|
||expectedUnitFileState|enabled|
||expectedActiveState|active|
||unitNameAvahiDaemonSocket|avahi-daemon.socket|
||packageName|avahi|
|Ensure dhcp server services are not in use|unitNameDhcpdService|dhcpd.service|
||expectedUnitFileState|enabled|
||expectedActiveState|active|
||unitNameDhcpd6Service|dhcpd6.service|
||packageName|dhcp-server|
|Ensure dns server services are not in use|serviceName|named.service|
||expectedUnitFileState|enabled|
||expectedActiveState|active|
||packageName|bind|
|Ensure dnsmasq services are not in use|unitName|dnsmasq.service|
||expectedUnitFileState|enabled|
||expectedActiveState|active|
||packageName|dnsmasq|
|Ensure samba file server services are not in use|unitName|smb.service|
||expectedUnitFileState|enabled|
||expectedActiveState|active|
||packageName|samba|
|Ensure ldap server services are not in use|packageNameOpenldap2|openldap2|
||packageNameOpenldap25|openldap2_5|
||unitName|slapd.service|
||expectedUnitFileState|enabled|
||expectedActiveState|active|
|Ensure ftp server services are not in use|serviceName|vsftpd.service|
||expectedUnitFileState|enabled|
||expectedActiveState|active|
||packageName|vsftpd|
|Ensure message access server services are not in use|unitNameDovecotService|dovecot.service|
||expectedUnitFileState|enabled|
||expectedActiveState|active|
||unitNameDovecotSocket|dovecot.socket|
||packageNameDovecot|dovecot|
||unitNameCyrusImapdService|cyrus-imapd.service|
||packageNameCyrusImapd|cyrus-imapd|
|Ensure network file system services are not in use|unitName|nfs-server.service|
||expectedUnitFileState|enabled|
||expectedActiveState|active|
||packageName|nfs-kernel-server|
|Ensure nis server services are not in use|unitName|ypserv.service|
||expectedUnitFileState|enabled|
||expectedActiveState|active|
||packageName|ypserv|
|Ensure print server services are not in use|unitNameCupsService|cups.service|
||expectedUnitFileState|enabled|
||expectedActiveState|active|
||unitNameCupsSocket|cups.socket|
||packageName|cups|
|Ensure rpcbind services are not in use|unitNameRpcbindService|rpcbind.service|
||expectedUnitFileState|enabled|
||expectedActiveState|active|
||unitNameRpcbindSocket|rpcbind.socket|
||packageName|rpcbind|
|Ensure rsync services are not in use|unitNameRsyncdService|rsyncd.service|
||expectedUnitFileState|enabled|
||expectedActiveState|active|
||unitNameRsyncdSocket|rsyncd.socket|
||packageName|rsync|
|Ensure snmp services are not in use|unitName|snmpd.service|
||expectedUnitFileState|enabled|
||expectedActiveState|active|
||packageName|net-snmp|
|Ensure telnet server services are not in use|unitName|telnet.socket|
||expectedUnitFileState|enabled|
||expectedActiveState|active|
||packageName|telnet-server|
|Ensure tftp server services are not in use|unitNameTftpService|tftp.service|
||expectedUnitFileState|enabled|
||expectedActiveState|active|
||unitNameTftpSocket|tftp.socket|
||packageName|tftp-server|
|Ensure web proxy server services are not in use|unitName|squid.service|
||expectedUnitFileState|enabled|
||expectedActiveState|active|
||packageName|squid|
|Ensure web server services are not in use|unitNameApache2Service|apache2.service|
||expectedUnitFileState|enabled|
||expectedActiveState|active|
||packageNameApache2|apache2|
||unitNameNginxService|nginx.service|
||packageNameNginx|nginx|
|Ensure xinetd services are not in use|unitName|xinetd.service|
||expectedUnitFileState|enabled|
||expectedActiveState|active|
||packageName|xinetd|
|Ensure telnet client is not installed|packageName|telnet|
|Ensure access to /etc/crontab is configured|mask|0177|
||owner|root|
||group|root|
|Ensure access to /etc/cron.hourly is configured|mask|0077|
||owner|root|
||group|root|
|Ensure access to /etc/cron.daily is configured|mask|0077|
||owner|root|
||group|root|
|Ensure access to /etc/cron.weekly is configured|mask|0077|
||owner|root|
||group|root|
|Ensure access to /etc/cron.monthly is configured|mask|0077|
||owner|root|
||group|root|
|Ensure access to /etc/cron.d is configured|mask|0077|
||owner|root|
||group|root|
|Ensure access to crontab is configured|owner|root|
||group|root\|crontab|
|Ensure access to at is configured|filenameEtcAtAllow|/etc/at.allow|
||mask|0137|
||owner|root|
||group|root\|daemon|
||filenameEtcAtDeny|/etc/at.deny|
|Ensure bluetooth services are not in use|unitName|bluetooth.service|
||expectedUnitFileState|enabled|
||expectedActiveState|active|
||packageName|bluez|
|Ensure access to /etc/ssh/sshd_config is configured|mask|0177|
||owner|root|
||group|root|
|Ensure sshd Ciphers are configured|ciphersDisallowedValues|3des-cbc,aes128-cbc,aes192-cbc,aes256-cbc,arcfour,arcfour128,arcfour256,blowfish-cbc,cast128-cbc,rijndael-cbc@lysator\.liu\.se|
|Ensure sshd KexAlgorithms is configured|kexalgorithmsDisallowedValues|diffie-hellman-group1-sha1,diffie-hellman-group14-sha1,diffie-hellman-group-exchange-sha1|
|Ensure sshd MACs are configured|macsDisallowedValues|hmac-md5,hmac-md5-96,hmac-ripemd160,hmac-sha1-96,umac-64@openssh\.com,hmac-md5-etm@openssh\.com,hmac-md5-96-etm@openssh\.com,hmac-ripemd160-etm@openssh\.com,hmac-sha1-96-etm@openssh\.com,umac-64-etm@openssh\.com,umac-128-etm@openssh\.com|
|Ensure sshd access is configured|allowUsersValuePattern|[^ \t]+|
||allowGroupsValuePattern|[^ \t]+|
||denyUsersValuePattern|[^ \t]+|
||denyGroupsValuePattern|[^ \t]+|
|Ensure sshd Banner is configured|bannerExpectedValueT|\/[^ \t]+|
||bannerDisallowedValuesNone|none|
|Ensure sshd ClientAliveInterval and ClientAliveCountMax are configured|clientalivecountmaxThreshold|0|
||clientaliveintervalThreshold|0|
|Ensure sshd LoginGraceTime is configured|logingracetimeThresholdValue60|60|
||logingracetimeThresholdValue0|0|
|Ensure sshd LogLevel is configured|loglevelExpectedValue|verbose,info|
|Ensure sshd MaxAuthTries is configured|maxauthtriesThreshold|4|
|Ensure sshd MaxStartups is configured|maxstartupsExpectedValue|10:30:60|
|Ensure sshd MaxSessions is configured|maxsessionsThreshold|10|
|Ensure password expiration is configured|maxDays|365|
||minDays|1|
|Ensure minimum password days is configured|minDays|1|
|Ensure password expiration warning days is configured|warnDays|7|
|Ensure strong password hashing algorithm is configured|hashAlgorithm|YESCRYPT|
||fallbackHashAlgorithm|SHA512|
|Ensure journald ForwardToSyslog is disabled|forwardToSyslogRegex|no|
|Ensure journald Compress is configured|compressRegex|yes|
|Ensure journald Storage is configured|storageRegex|persistent|
|Ensure journald is configured to send logs to rsyslog|forwardToSyslogRegex|yes|
|Ensure audit configuration files mode is configured|directory|/etc/audit/|
||filePatternConf|*.conf|
||mask|0137|
||filePatternRules|*.rules|
|Ensure audit configuration files owner is configured|directory|/etc/audit/|
||filePatternConf|*.conf|
||owner|root|
||filePatternRules|*.rules|
|Ensure audit configuration files group owner is configured|directory|/etc/audit/|
||filePatternConf|*.conf|
||group|root|
||filePatternRules|*.rules|
|Ensure audit tools mode is configured|filenameSbinAuditctl|/sbin/auditctl|
||mask|0022|
||filenameSbinAureport|/sbin/aureport|
||filenameSbinAusearch|/sbin/ausearch|
||filenameSbinAutrace|/sbin/autrace|
||filenameSbinAuditd|/sbin/auditd|
||filenameSbinAugenrules|/sbin/augenrules|
|Ensure audit tools owner is configured|filenameSbinAuditctl|/sbin/auditctl|
||owner|root|
||filenameSbinAureport|/sbin/aureport|
||filenameSbinAusearch|/sbin/ausearch|
||filenameSbinAutrace|/sbin/autrace|
||filenameSbinAuditd|/sbin/auditd|
||filenameSbinAugenrules|/sbin/augenrules|
|Ensure audit tools group owner is configured|filenameSbinAuditctl|/sbin/auditctl|
||group|root|
||filenameSbinAureport|/sbin/aureport|
||filenameSbinAusearch|/sbin/ausearch|
||filenameSbinAutrace|/sbin/autrace|
||filenameSbinAuditd|/sbin/auditd|
||filenameSbinAugenrules|/sbin/augenrules|
|Ensure access to /etc/passwd is configured|mask|0133|
||owner|root|
||group|root|
|Ensure access to /etc/passwd- is configured|mask|0133|
||owner|root|
||group|root|
|Ensure access to /etc/group is configured|mask|0133|
||owner|root|
||group|root|
|Ensure access to /etc/group- is configured|mask|0133|
||owner|root|
||group|root|
|Ensure access to /etc/shadow is configured|mask|0137|
||owner|root|
||group|root\|shadow|
|Ensure access to /etc/shadow- is configured|mask|0137|
||owner|root|
||group|root\|shadow|
|Ensure access to /etc/gshadow is configured|mask|0137|
||owner|root|
||group|shadow\|root|
|Ensure access to /etc/gshadow- is configured|mask|0137|
||owner|root|
||group|shadow\|root|
|Ensure access to /etc/shells is configured|mask|0133|
||owner|root|
||group|root|
|Ensure access to /etc/security/opasswd is configured|mask|0177|
||owner|root|
||group|root|
