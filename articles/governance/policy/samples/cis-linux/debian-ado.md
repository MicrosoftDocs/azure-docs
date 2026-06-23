---
title: Reference - CIS Security Benchmarks for Debian Linux via Machine Configuration
description: Reference - CIS Security Benchmarks for Debian Linux via Machine Configuration
ms.date: 06/18/2026
author: pallakatos
ms.author: pallakatos
ms.topic: reference
ms.custom: generated
---

# Release notes - Debian Linux

This article provides detailed information about the CIS Security Benchmarks for Debian Linux, including supported benchmarks, mismatched rules, and configurable parameters across all supported versions.

## Supported benchmarks

|Debian Linux Version|Benchmark Title|
|---|---|
|Debian Linux 11|[CIS Debian Linux 11 Benchmark 2.0.0 Level 1 + Level 2 - Server](#cis-debian-linux-11-benchmark-200-level-1--level-2---server)|
|Debian Linux 12|[CIS Debian Linux 12 Benchmark 1.1.0 Level 1 + Level 2 - Server](#cis-debian-linux-12-benchmark-110-level-1--level-2---server)|

## CIS Debian Linux 11 Benchmark 2.0.0 Level 1 + Level 2 - Server

### Mismatched rules

> [!NOTE]
> The mismatched rules are the ones that in some circumstances the assessment might differ from CIS-CAT® Pro Assessor; usually our implementation enforces stricter criteria.

- None

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
|Ensure access to bootloader config is configured|filename|/boot/grub/grub.cfg|
||mask|0177|
||owner|root|
||group|root|
|Ensure access to /etc/issue is configured|filename|/etc/issue|
||mask|0133|
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
||packageName|avahi-daemon|
|Ensure dhcp server services are not in use|unitNameIscDhcpServerService|isc-dhcp-server.service|
||expectedUnitFileState|enabled|
||expectedActiveState|active|
||unitNameIscDhcpServer6Service|isc-dhcp-server6.service|
||packageName|isc-dhcp-server|
|Ensure dns server services are not in use|serviceName|named.service|
||expectedUnitFileState|enabled|
||expectedActiveState|active|
||packageName|bind9|
|Ensure dnsmasq services are not in use|unitName|dnsmasq.service|
||expectedUnitFileState|enabled|
||expectedActiveState|active|
||packageName|dnsmasq|
|Ensure ftp server services are not in use|serviceName|vsftpd.service|
||expectedUnitFileState|enabled|
||expectedActiveState|active|
||packageName|vsftpd|
|Ensure ldap server services are not in use|unitName|slapd.service|
||expectedUnitFileState|enabled|
||expectedActiveState|active|
||packageName|slapd|
|Ensure message access server services are not in use|packageNameDovecotImapd|dovecot-imapd|
||packageNameDovecotPop3d|dovecot-pop3d|
||unitNameDovecotService|dovecot.service|
||expectedUnitFileState|enabled|
||expectedActiveState|active|
||unitNameDovecotSocket|dovecot.socket|
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
|Ensure rsync services are not in use|unitName|rsync.service|
||expectedUnitFileState|enabled|
||expectedActiveState|active|
||packageName|rsync|
|Ensure samba file server services are not in use|unitName|smbd.service|
||expectedUnitFileState|enabled|
||expectedActiveState|active|
||packageName|samba|
|Ensure snmp services are not in use|unitName|snmpd.service|
||expectedUnitFileState|enabled|
||expectedActiveState|active|
||packageName|snmpd|
|Ensure tftp server services are not in use|unitName|tftpd-hpa.service|
||expectedUnitFileState|enabled|
||expectedActiveState|active|
||packageName|tftpd-hpa|
|Ensure web proxy server services are not in use|unitName|squid.service|
||expectedUnitFileState|enabled|
||expectedActiveState|active|
||packageName|squid|
|Ensure web server services are not in use|unitNameApache2Service|apache2.service|
||expectedUnitFileState|enabled|
||expectedActiveState|active|
||unitNameApache2Socket|apache2.socket|
||packageNameApache2|apache2|
||unitNameNginxService|nginx.service|
||packageNameNginx|nginx|
|Ensure xinetd services are not in use|unitName|xinetd.service|
||expectedUnitFileState|enabled|
||expectedActiveState|active|
||packageName|xinetd|
|Ensure telnet client is not installed|packageName|telnet|
|Ensure permissions on /etc/crontab are configured|mask|0177|
||owner|root|
||group|root|
|Ensure permissions on /etc/cron.hourly are configured|mask|0077|
||owner|root|
||group|root|
|Ensure permissions on /etc/cron.daily are configured|mask|0077|
||owner|root|
||group|root|
||packageName|cron|
||alternativePackageName|cronie|
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
|Ensure crontab is restricted to authorized users|filenameEtcCronDeny|/etc/cron.deny|
||mask|0137|
||owner|root|
||group|root|
||filenameEtcCronAllow|/etc/cron.allow|
|Ensure at is restricted to authorized users|mask|0137|
||owner|root|
||group|root\|daemon|
|Ensure bluetooth services are not in use|unitName|bluetooth.service|
||expectedUnitFileState|enabled|
||expectedActiveState|active|
||packageName|bluez|
|Ensure permissions on /etc/ssh/sshd_config are configured|mask|0177|
||owner|root|
||group|root|
|Ensure sshd access is configured|allowUsersValuePattern|[^ \t]+|
||allowGroupsValuePattern|[^ \t]+|
||denyUsersValuePattern|[^ \t]+|
||denyGroupsValuePattern|[^ \t]+|
|Ensure sshd Banner is configured|bannerValue|\/[^ \t]+|
|Ensure sshd Ciphers are configured|ciphersDisallowedValues|3des-cbc,aes128-cbc,aes192-cbc,aes256-cbc,arcfour,arcfour128,arcfour256,blowfish-cbc,cast128-cbc,rijndael-cbc@lysator\.liu\.se|
|Ensure sshd ClientAliveInterval and ClientAliveCountMax are configured|clientalivecountmaxValue|[1-9][0-9]*m?|
||clientaliveintervalValue|[1-9][0-9]*m?|
|Ensure sshd KexAlgorithms is configured|kexalgorithmsDisallowedValues|diffie-hellman-group1-sha1,diffie-hellman-group14-sha1,diffie-hellman-group-exchange-sha1|
|Ensure sshd LoginGraceTime is configured|logingracetimeValue|\b([1-9]\|[1-5][0-9]\|60)\b|
|Ensure sshd LogLevel is configured|loglevelValue|(VERBOSE\|INFO)\b|
|Ensure sshd MACs are configured|macsDisallowedValues|hmac-md5,hmac-md5-96,hmac-ripemd160,hmac-sha1-96,umac-64@openssh\.com,hmac-md5-etm@openssh\.com,hmac-md5-96-etm@openssh\.com,hmac-ripemd160-etm@openssh\.com,hmac-sha1-96-etm@openssh\.com,umac-64-etm@openssh\.com,umac-128-etm@openssh\.com|
|Ensure sshd MaxAuthTries is configured|maxauthtriesValue|[0-4]\b|
|Ensure sshd MaxSessions is configured|maxsessionsValue|([1-9]\|10)\b|
|Ensure sshd MaxStartups is configured|maxstartupsValue|`(10\|[1-9])[^ \t](30\|[1-2][0-9]\|[1-9])[^ \t](60\|[1-5][0-9]\|[1-9])\b`|
|Ensure password expiration is configured|maxDays|365|
||minDays|1|
|Ensure minimum password age is configured|minDays|1|
|Ensure password expiration warning days is configured|warnDays|7|
|Ensure strong password hashing algorithm is configured|hashAlgorithm|YESCRYPT|
||fallbackHashAlgorithm|SHA512|
|Ensure journald ForwardToSyslog is disabled|forwardToSyslogRegex|yes|
|Ensure journald Storage is configured|storageRegex|persistent|
|Ensure journald Compress is configured|compressRegex|yes|
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
|Ensure permissions on /etc/passwd are configured|mask|0133|
||owner|root|
||group|root|
|Ensure permissions on /etc/passwd- are configured|mask|0133|
||owner|root|
||group|root|
|Ensure permissions on /etc/group are configured|mask|0133|
||owner|root|
||group|root|
|Ensure permissions on /etc/group- are configured|mask|0133|
||owner|root|
||group|root|
|Ensure permissions on /etc/shadow are configured|mask|0137|
||owner|root|
||group|root\|shadow|
|Ensure permissions on /etc/shadow- are configured|mask|0137|
||owner|root|
||group|root\|shadow|
|Ensure permissions on /etc/gshadow are configured|mask|0137|
||owner|root|
||group|shadow\|root|
|Ensure permissions on /etc/gshadow- are configured|mask|0137|
||owner|root|
||group|shadow\|root|
|Ensure permissions on /etc/shells are configured|mask|0133|
||owner|root|
||group|root|
|Ensure permissions on /etc/security/opasswd are configured|mask|0177|
||owner|root|
||group|root|

## CIS Debian Linux 12 Benchmark 1.1.0 Level 1 + Level 2 - Server

### Mismatched rules

> [!NOTE]
> The mismatched rules are the ones that in some circumstances the assessment might differ from CIS-CAT® Pro Assessor; usually our implementation enforces stricter criteria.

- Ensure only one logging system is in use
- Ensure cryptographic mechanisms are used to protect the integrity of audit tools
- Ensure world writable files and directories are secured

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
|Ensure access to bootloader config is configured|filename|/boot/grub/grub.cfg|
||mask|0177|
||owner|root|
||group|root|
|Ensure access to /etc/issue is configured|filename|/etc/issue|
||mask|0133|
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
||packageName|avahi-daemon|
|Ensure dhcp server services are not in use|unitNameIscDhcpServerService|isc-dhcp-server.service|
||expectedUnitFileState|enabled|
||expectedActiveState|active|
||unitNameIscDhcpServer6Service|isc-dhcp-server6.service|
||packageName|isc-dhcp-server|
|Ensure dns server services are not in use|serviceName|named.service|
||expectedUnitFileState|enabled|
||expectedActiveState|active|
||packageName|bind9|
|Ensure dnsmasq services are not in use|unitName|dnsmasq.service|
||expectedUnitFileState|enabled|
||expectedActiveState|active|
||packageName|dnsmasq|
|Ensure ftp server services are not in use|serviceName|vsftpd.service|
||expectedUnitFileState|enabled|
||expectedActiveState|active|
||packageName|vsftpd|
|Ensure ldap server services are not in use|unitName|slapd.service|
||expectedUnitFileState|enabled|
||expectedActiveState|active|
||packageName|slapd|
|Ensure message access server services are not in use|packageNameDovecotImapd|dovecot-imapd|
||packageNameDovecotPop3d|dovecot-pop3d|
||unitNameDovecotService|dovecot.service|
||expectedUnitFileState|enabled|
||expectedActiveState|active|
||unitNameDovecotSocket|dovecot.socket|
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
|Ensure rsync services are not in use|unitName|rsync.service|
||expectedUnitFileState|enabled|
||expectedActiveState|active|
||packageName|rsync|
|Ensure samba file server services are not in use|unitName|smbd.service|
||expectedUnitFileState|enabled|
||expectedActiveState|active|
||packageName|samba|
|Ensure snmp services are not in use|unitName|snmpd.service|
||expectedUnitFileState|enabled|
||expectedActiveState|active|
||packageName|snmpd|
|Ensure tftp server services are not in use|unitName|tftpd-hpa.service|
||expectedUnitFileState|enabled|
||expectedActiveState|active|
||packageName|tftpd-hpa|
|Ensure web proxy server services are not in use|unitName|squid.service|
||expectedUnitFileState|enabled|
||expectedActiveState|active|
||packageName|squid|
|Ensure web server services are not in use|unitNameApache2Service|apache2.service|
||expectedUnitFileState|enabled|
||expectedActiveState|active|
||unitNameApache2Socket|apache2.socket|
||packageNameApache2|apache2|
||unitNameNginxService|nginx.service|
||packageNameNginx|nginx|
|Ensure xinetd services are not in use|unitName|xinetd.service|
||expectedUnitFileState|enabled|
||expectedActiveState|active|
||packageName|xinetd|
|Ensure telnet client is not installed|packageName|telnet|
|Ensure permissions on /etc/crontab are configured|mask|0177|
||owner|root|
||group|root|
|Ensure permissions on /etc/cron.hourly are configured|mask|0077|
||owner|root|
||group|root|
|Ensure permissions on /etc/cron.daily are configured|mask|0077|
||owner|root|
||group|root|
||packageName|cron|
||alternativePackageName|cronie|
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
|Ensure crontab is restricted to authorized users|filenameEtcCronAllow|/etc/cron.allow|
||owner|root|
||group|root\|crontab|
||filenameEtcCronDeny|/etc/cron.deny|
|Ensure at is restricted to authorized users|mask|0137|
||owner|root|
||group|root\|daemon|
|Ensure bluetooth services are not in use|unitName|bluetooth.service|
||expectedUnitFileState|enabled|
||expectedActiveState|active|
||packageName|bluez|
|Ensure permissions on /etc/ssh/sshd_config are configured|mask|0177|
||owner|root|
||group|root|
|Ensure sshd access is configured|allowUsersValuePattern|[^ \t]+|
||allowGroupsValuePattern|[^ \t]+|
||denyUsersValuePattern|[^ \t]+|
||denyGroupsValuePattern|[^ \t]+|
|Ensure sshd Banner is configured|bannerExpectedValueT|\/[^ \t]+|
||bannerDisallowedValuesNone|none|
|Ensure sshd Ciphers are configured|ciphersDisallowedValues|3des-cbc,aes128-cbc,aes192-cbc,aes256-cbc,arcfour,arcfour128,arcfour256,blowfish-cbc,cast128-cbc,rijndael-cbc@lysator\.liu\.se|
|Ensure sshd ClientAliveInterval and ClientAliveCountMax are configured|clientalivecountmaxThreshold|0|
||clientaliveintervalThreshold|0|
|Ensure sshd KexAlgorithms is configured|kexalgorithmsDisallowedValues|diffie-hellman-group1-sha1,diffie-hellman-group14-sha1,diffie-hellman-group-exchange-sha1|
|Ensure sshd LoginGraceTime is configured|logingracetimeThresholdValue60|60|
||logingracetimeThresholdValue0|0|
|Ensure sshd LogLevel is configured|loglevelExpectedValue|verbose,info|
|Ensure sshd MACs are configured|macsDisallowedValues|hmac-md5,hmac-md5-96,hmac-ripemd160,hmac-sha1-96,umac-64@openssh\.com,hmac-md5-etm@openssh\.com,hmac-md5-96-etm@openssh\.com,hmac-ripemd160-etm@openssh\.com,hmac-sha1-96-etm@openssh\.com,umac-64-etm@openssh\.com,umac-128-etm@openssh\.com|
|Ensure sshd MaxAuthTries is configured|maxauthtriesThreshold|4|
|Ensure sshd MaxSessions is configured|maxsessionsThreshold|10|
|Ensure sshd MaxStartups is configured|maxstartupsExpectedValue|10:30:60|
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
|Ensure permissions on /etc/passwd are configured|mask|0133|
||owner|root|
||group|root|
|Ensure permissions on /etc/passwd- are configured|mask|0133|
||owner|root|
||group|root|
|Ensure permissions on /etc/group are configured|mask|0133|
||owner|root|
||group|root|
|Ensure permissions on /etc/group- are configured|mask|0133|
||owner|root|
||group|root|
|Ensure permissions on /etc/shadow are configured|mask|0137|
||owner|root|
||group|root\|shadow|
|Ensure permissions on /etc/shadow- are configured|mask|0137|
||owner|root|
||group|root\|shadow|
|Ensure permissions on /etc/gshadow are configured|mask|0137|
||owner|root|
||group|shadow\|root|
|Ensure permissions on /etc/gshadow- are configured|mask|0137|
||owner|root|
||group|shadow\|root|
|Ensure permissions on /etc/shells are configured|mask|0133|
||owner|root|
||group|root|
|Ensure permissions on /etc/security/opasswd are configured|mask|0177|
||owner|root|
||group|root|
