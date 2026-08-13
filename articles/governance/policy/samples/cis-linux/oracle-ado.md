---
title: Reference - CIS Security Benchmarks for Oracle Linux via Machine Configuration
description: Reference - CIS Security Benchmarks for Oracle Linux via Machine Configuration
ms.date: 06/18/2026
author: pallakatos
ms.author: pallakatos
ms.topic: reference
ms.custom: generated
---

# Release notes - Oracle Linux

This article provides detailed information about the CIS Security Benchmarks for Oracle Linux, including supported benchmarks, mismatched rules, and configurable parameters across all supported versions.

## Supported benchmarks

|Oracle Linux Version|Benchmark Title|
|---|---|
|Oracle Linux 8|[CIS Oracle Linux 8 Benchmark 3.0.0 Level 1 + Level 2 - Server](#cis-oracle-linux-8-benchmark-300-level-1--level-2---server)|
|Oracle Linux 8|[CIS Oracle Linux 8 Benchmark 4.0.0 Level 1 + Level 2 - Server](#cis-oracle-linux-8-benchmark-400-level-1--level-2---server)|
|Oracle Linux 9|[CIS Oracle Linux 9 Benchmark 2.0.0 Level 1 + Level 2 - Server](#cis-oracle-linux-9-benchmark-200-level-1--level-2---server)|

## CIS Oracle Linux 8 Benchmark 3.0.0 Level 1 + Level 2 - Server

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
|Ensure core dump backtraces are disabled|processSizeMaxRegex|0|
|Ensure core dump storage is disabled|storageRegex|none|
|Ensure access to /etc/issue is configured|filename|/etc/issue|
||mask|0133|
||owner|root|
||group|root|
|Ensure time synchronization is in use|packageName|chrony|
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
||packageName|nfs-utils|
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
||packageName|rsync-daemon|
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
|Ensure web server services are not in use|unitNameHttpdService|httpd.service|
||expectedUnitFileState|enabled|
||expectedActiveState|active|
||unitNameHttpdSocket|httpd.socket|
||packageNameHttpd|httpd|
||unitNameNginxService|nginx.service|
||packageNameNginx|nginx|
|Ensure xinetd services are not in use|unitName|xinetd.service|
||expectedUnitFileState|enabled|
||expectedActiveState|active|
||packageName|xinetd|
|Ensure telnet client is not installed|packageName|telnet|
|Ensure bluetooth services are not in use|unitName|bluetooth.service|
||expectedUnitFileState|enabled|
||expectedActiveState|active|
||packageName|bluez|
|Ensure permissions on /etc/crontab are configured|mask|0177|
||owner|root|
||group|root|
|Ensure permissions on /etc/cron.hourly are configured|mask|0077|
||owner|root|
||group|root|
|Ensure permissions on /etc/cron.daily are configured|packageName|cron|
||alternativePackageName|cronie|
||mask|0077|
||owner|root|
||group|root|
|Ensure permissions on /etc/cron.weekly are configured|mask|0077|
||owner|root|
||group|root|
|Ensure permissions on /etc/cron.monthly are configured|alternativePackageName|cronie|
||mask|0077|
||owner|root|
||group|root|
|Ensure permissions on /etc/cron.d are configured|mask|0077|
||owner|root|
||group|root|
|Ensure crontab is restricted to authorized users|filenameEtcCronDeny|/etc/cron.deny|
||owner|root|
||group|root|
||mask|0137|
||filenameEtcCronAllow|/etc/cron.allow|
|Ensure at is restricted to authorized users|mask|0137|
||owner|root|
||group|root\|daemon|
|Ensure permissions on /etc/ssh/sshd_config are configured|fileMask|0077|
||owner|root|
||group|root|
||collectionMask|0177|
|Ensure sshd access is configured|allowUsersValuePattern|[^ \t]+|
||allowGroupsValuePattern|[^ \t]+|
||denyUsersValuePattern|[^ \t]+|
||denyGroupsValuePattern|[^ \t]+|
|Ensure sshd Banner is configured|bannerValue|[^ \t]+|
|Ensure sshd Ciphers are configured|ciphersDisallowedValues|3des-cbc,aes128-cbc,aes192-cbc,aes256-cbc,arcfour,arcfour128,arcfour256,blowfish-cbc,cast128-cbc,rijndael-cbc@lysator.liu.se|
|Ensure sshd ClientAliveInterval and ClientAliveCountMax are configured|clientalivecountmaxValue|[1-9][0-9]*m?|
|Ensure sshd KexAlgorithms is configured|kexalgorithmsDisallowedValues|diffie-hellman-group1-sha1,diffie-hellman-group14-sha1,diffie-hellman-group-exchange-sha1|
|Ensure sshd LoginGraceTime is configured|logingracetimeValue|([1-9]\|[1-5][0-9]\|60\|1m)|
|Ensure sshd LogLevel is configured|loglevelValue|(VERBOSE\|INFO)|
|Ensure sshd MACs are configured|macsDisallowedValues|hmac-md5,hmac-md5-96,hmac-ripemd160,hmac-sha1-96,umac-64@openssh\.com,hmac-md5-etm@openssh\.com,hmac-md5-96-etm@openssh\.com,hmac-ripemd160-etm@openssh\.com,hmac-sha1-96-etm@openssh\.com,umac-64-etm@openssh\.com|
|Ensure sshd MaxAuthTries is configured|maxauthtriesValue|[0-4]|
|Ensure sshd MaxSessions is configured|maxsessionsValue|([1-9]\|10)|
|Ensure sshd MaxStartups is configured|maxstartupsValue|(10\|[1-9])\:(30\|[1-2][0-9]\|[1-9])\:(60\|[1-5][0-9]\|[1-9])|
|Ensure password expiration is 365 days or less|maxDays|365|
|Ensure password expiration warning days is 7 or more|warnDays|7|
|Ensure journald is configured to send logs to rsyslog|forwardToSyslogRegex|yes|
|Ensure audit configuration files are 640 or more restrictive|directory|/etc/audit/|
||filePattern|^.*\.(conf\|rules)|
||mask|0137|
|Ensure audit configuration files are owned by root|directory|/etc/audit/|
||filePattern|^.*\.(conf\|rules)|
|Ensure audit configuration files belong to group root|directory|/etc/audit/|
||filePattern|^.*\.(conf\|rules)|
||group|root|
|Ensure audit tools are 755 or more restrictive|filenameSbinAuditctl|/sbin/auditctl|
||mask|0022|
||filenameSbinAureport|/sbin/aureport|
||filenameSbinAusearch|/sbin/ausearch|
||filenameSbinAutrace|/sbin/autrace|
||filenameSbinAuditd|/sbin/auditd|
||filenameSbinAugenrules|/sbin/augenrules|
|Ensure audit tools are owned by root|filenameSbinAuditctl|/sbin/auditctl|
||owner|root|
||filenameSbinAureport|/sbin/aureport|
||filenameSbinAusearch|/sbin/ausearch|
||filenameSbinAutrace|/sbin/autrace|
||filenameSbinAuditd|/sbin/auditd|
||filenameSbinAugenrules|/sbin/augenrules|
|Ensure audit tools belong to group root|filenameSbinAuditctl|/sbin/auditctl|
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
|Ensure permissions on /etc/opasswd are configured|mask|0177|
||owner|root|
||group|root|
|Ensure permissions on /etc/group are configured|mask|0133|
||owner|root|
||group|root|
|Ensure permissions on /etc/group- are configured|mask|0133|
||owner|root|
||group|root|
|Ensure permissions on /etc/shadow are configured|mask|0777|
||owner|root|
||group|root|
|Ensure permissions on /etc/shadow- are configured|mask|0777|
||owner|root|
||group|root|
|Ensure permissions on /etc/gshadow are configured|mask|0777|
||owner|root|
||group|root|
|Ensure permissions on /etc/gshadow- are configured|mask|0777|
||owner|root|
||group|root|
|Ensure permissions on /etc/shells are configured|mask|0133|
||owner|root|
||group|root|

## CIS Oracle Linux 8 Benchmark 4.0.0 Level 1 + Level 2 - Server

### Mismatched rules

> [!NOTE]
> The mismatched rules are the ones that in some circumstances the assessment might differ from CIS-CAT® Pro Assessor; usually our implementation enforces stricter criteria.

- None

### Configurable parameters

|Rule|Parameter|Default Value|
|---|---|---|
|Ensure /tmp is tmpfs or a separate partition|mountPoint|/tmp|
|Ensure nodev option set on /tmp partition|mountPoint|/tmp|
||requiredMountOptions|nodev|
|Ensure nosuid option set on /tmp partition|mountPoint|/tmp|
||requiredMountOptions|nosuid|
|Ensure noexec option set on /tmp partition|mountPoint|/tmp|
||requiredMountOptions|noexec|
|Ensure /dev/shm is tmpfs|mountPoint|/dev/shm|
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
|Ensure systemd-coredump ProcessSizeMax is configured|processSizeMaxValue|0|
|Ensure systemd-coredump Storage is configured|storageValue|none|
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
||packageName|avahi|
|Ensure cockpit web services are not in use|unitNameCockpitService|cockpit.service|
||expectedUnitFileState|enabled|
||unitNameCockpitSocket|cockpit.socket|
||expectedActiveState|active|
||packageName|cockpit-ws|
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
||packageName|nfs-utils|
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
||packageName|rsync-daemon|
|Ensure samba file server services are not in use|unitName|smb.service|
||expectedUnitFileState|enabled|
||expectedActiveState|active|
||packageName|samba|
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
|Ensure web server services are not in use|unitNameHttpdService|httpd.service|
||expectedUnitFileState|enabled|
||expectedActiveState|active|
||unitNameHttpdSocket|httpd.socket|
||packageNameHttpd|httpd|
||unitNameNginxService|nginx.service|
||packageNameNginx|nginx|
|Ensure xinetd services are not in use|unitName|xinetd.service|
||expectedUnitFileState|enabled|
||expectedActiveState|active|
||packageName|xinetd|
|Ensure telnet client is not installed|packageName|telnet|
|Ensure time synchronization is in use|packageName|chrony|
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
|Ensure access to /etc/cron.yearly is configured|mask|0077|
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
|Ensure access to /etc/sysconfig/sshd is configured|filename|/etc/sysconfig/sshd|
||mask|0137|
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
|Ensure journald ForwardToSyslog is disabled|forwardToSyslogValue|no|
|Ensure journald Storage is configured|storageValue|persistent|
|Ensure journald Compress is configured|compressValue|yes|
|Ensure journald is configured to send logs to rsyslog|forwardToSyslogValue|yes|
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
|Ensure access to /etc/shadow is configured|mask|0777|
||owner|root|
||group|root|
|Ensure access to /etc/shadow- is configured|mask|0777|
||owner|root|
||group|root|
|Ensure access to /etc/gshadow is configured|mask|0777|
||owner|root|
||group|root|
|Ensure access to /etc/gshadow- is configured|mask|0777|
||owner|root|
||group|root|
|Ensure access to /etc/shells is configured|mask|0133|
||owner|root|
||group|root|
|Ensure access to /etc/security/opasswd is configured|mask|0177|
||owner|root|
||group|root|

## CIS Oracle Linux 9 Benchmark 2.0.0 Level 1 + Level 2 - Server

### Mismatched rules

> [!NOTE]
> The mismatched rules are the ones that in some circumstances the assessment might differ from CIS-CAT® Pro Assessor; usually our implementation enforces stricter criteria.

- Ensure sshd IgnoreRhosts is enabled
- Ensure sshd LogLevel is configured
- Ensure sshd MaxSessions is configured
- Ensure sshd PermitEmptyPasswords is disabled
- Ensure sshd PermitUserEnvironment is disabled
- Ensure sshd UsePAM is enabled
- Ensure active authselect profile includes pam modules
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
|Ensure core dump backtraces are disabled|processSizeMaxRegex|0|
|Ensure core dump storage is disabled|storageRegex|none|
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
||packageName|nfs-utils|
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
||packageName|rsync-daemon|
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
|Ensure web server services are not in use|unitNameHttpdService|httpd.service|
||expectedUnitFileState|enabled|
||expectedActiveState|active|
||unitNameHttpdSocket|httpd.socket|
||packageNameHttpd|httpd|
||unitNameNginxService|nginx.service|
||packageNameNginx|nginx|
|Ensure xinetd services are not in use|unitName|xinetd.service|
||expectedUnitFileState|enabled|
||expectedActiveState|active|
||packageName|xinetd|
|Ensure telnet client is not installed|packageName|telnet|
|Ensure time synchronization is in use|packageName|chrony|
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
|Ensure sshd Ciphers are configured|ciphersDisallowedValues|3des-cbc,aes128-cbc,aes192-cbc,aes256-cbc,arcfour,arcfour128,arcfour256,blowfish-cbc,cast128-cbc,rijndael-cbc@lysator\.liu\.se|
|Ensure sshd KexAlgorithms is configured|kexalgorithmsDisallowedValues|diffie-hellman-group1-sha1,diffie-hellman-group14-sha1,diffie-hellman-group-exchange-sha1|
|Ensure sshd MACs are configured|macsDisallowedValues|hmac-md5,hmac-md5-96,hmac-ripemd160,hmac-sha1-96,umac-64@openssh\.com,hmac-md5-etm@openssh\.com,hmac-md5-96-etm@openssh\.com,hmac-ripemd160-etm@openssh\.com,hmac-sha1-96-etm@openssh\.com,umac-64-etm@openssh\.com,umac-128-etm@openssh\.com|
|Ensure sshd access is configured|allowUsersValuePattern|[^ \t]+|
||allowGroupsValuePattern|[^ \t]+|
||denyUsersValuePattern|[^ \t]+|
||denyGroupsValuePattern|[^ \t]+|
|Ensure sshd Banner is configured|bannerValue|\/[^ \t]+|
|Ensure sshd ClientAliveInterval and ClientAliveCountMax are configured|clientalivecountmaxValue|[1-9][0-9]*m?|
||clientaliveintervalValue|[1-9][0-9]*m?|
|Ensure sshd LoginGraceTime is configured|logingracetimeValue|\b([1-9]\|[1-5][0-9]\|60)\b|
|Ensure sshd LogLevel is configured|loglevelValue|(VERBOSE\|INFO)\b|
|Ensure sshd MaxAuthTries is configured|maxauthtriesValue|[0-4]\b|
|Ensure sshd MaxStartups is configured|maxstartupsValue|`(10\|[1-9])[^ \t](30\|[1-2][0-9]\|[1-9])[^ \t](60\|[1-5][0-9]\|[1-9])\b`|
|Ensure sshd MaxSessions is configured|maxsessionsValue|([1-9]\|10)\b|
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
|Ensure permissions on /etc/shadow are configured|mask|0777|
||owner|root|
||group|root|
|Ensure permissions on /etc/shadow- are configured|mask|0777|
||owner|root|
||group|root|
|Ensure permissions on /etc/gshadow are configured|mask|0777|
||owner|root|
||group|root|
|Ensure permissions on /etc/gshadow- are configured|mask|0777|
||owner|root|
||group|root|
|Ensure permissions on /etc/shells are configured|mask|0133|
||owner|root|
||group|root|
|Ensure permissions on /etc/security/opasswd are configured|mask|0177|
||owner|root|
||group|root|
