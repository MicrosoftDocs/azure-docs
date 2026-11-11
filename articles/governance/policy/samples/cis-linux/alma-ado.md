---
title: Reference - CIS Security Benchmarks for AlmaLinux via Machine Configuration
description: Reference - CIS Security Benchmarks for AlmaLinux via Machine Configuration
ms.date: 11/04/2026
author: pallakatos
ms.author: pallakatos
ms.topic: reference
ms.custom: generated
---

# Release notes - AlmaLinux

This article provides detailed information about the CIS Security Benchmarks for AlmaLinux, including supported benchmarks, mismatched rules, remediation support, and configurable parameters across all supported versions.

## Supported benchmarks

|AlmaLinux Version|Benchmark Title|
|---|---|
|AlmaLinux OS 8|[CIS AlmaLinux OS 8 Benchmark 3.0.0 Level 1 + Level 2 - Server](#cis-almalinux-os-8-benchmark-300-level-1--level-2---server)|
|AlmaLinux OS 8|[CIS AlmaLinux OS 8 Benchmark 4.0.0 Level 1 + Level 2 - Server](#cis-almalinux-os-8-benchmark-400-level-1--level-2---server)|
|AlmaLinux OS 9|[CIS AlmaLinux OS 9 Benchmark 2.0.0 Level 1 + Level 2 - Server](#cis-almalinux-os-9-benchmark-200-level-1--level-2---server)|

> [!NOTE]
> Auto-remediation is in **[Public Preview]**.
> Remediation must be enabled separately and is available only for rules marked **Yes** in the **Remediation** column. It uses configured parameter values, or the defaults shown when no overrides are provided. Other rules remain audit-only. Review and test changes before enabling remediation broadly.

Supported parameters and remediations will expand over time. To request additional support, [open an issue in the kompli repository](https://github.com/microsoft/kompli/issues).

## CIS AlmaLinux OS 8 Benchmark 3.0.0 Level 1 + Level 2 - Server

### Rules

|Rule|Parameters|Default values|Remediation|
|---|---|---|---|
|1.1.1.1 Ensure cramfs kernel module is not available|None|-|Yes|
|1.1.1.2 Ensure freevxfs kernel module is not available|None|-|Yes|
|1.1.1.3 Ensure hfs kernel module is not available|None|-|Yes|
|1.1.1.4 Ensure hfsplus kernel module is not available|None|-|Yes|
|1.1.1.5 Ensure jffs2 kernel module is not available|None|-|Yes|
|1.1.1.6 Ensure squashfs kernel module is not available|None|-|Yes|
|1.1.1.7 Ensure udf kernel module is not available|None|-|Yes|
|1.1.1.8 Ensure usb-storage kernel module is not available|None|-|Yes|
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
|1.2.1 Ensure GPG keys are configured|None|-|No|
|1.2.2 Ensure gpgcheck is globally activated|None|-|No|
|1.2.3 Ensure repo\_gpgcheck is globally activated|None|-|No|
|1.2.4 Ensure package manager repositories are configured|None|-|No|
|1.2.5 Ensure updates, patches, and additional security software are installed|None|-|No|
|1.3.1 Ensure bootloader password is set|None|-|No|
|1.3.2 Ensure permissions on bootloader config are configured|None|-|No|
|1.4.1 Ensure address space layout randomization (ASLR) is enabled|None|-|No|
|1.4.2 Ensure ptrace\_scope is restricted|None|-|No|
|1.4.3 Ensure core dump backtraces are disabled|`processSizeMaxRegex`|`0`|No|
|1.4.4 Ensure core dump storage is disabled|`storageRegex`|`none`|No|
|1.5.1.1 Ensure SELinux is installed|None|-|No|
|1.5.1.2 Ensure SELinux is not disabled in bootloader configuration|None|-|No|
|1.5.1.3 Ensure SELinux policy is configured|None|-|No|
|1.5.1.4 Ensure the SELinux mode is not disabled|None|-|No|
|1.5.1.5 Ensure the SELinux mode is enforcing|None|-|No|
|1.5.1.6 Ensure no unconfined services exist|None|-|No|
|1.5.1.7 Ensure the MCS Translation Service (mcstrans) is not installed|None|-|No|
|1.5.1.8 Ensure SETroubleshoot is not installed|None|-|No|
|1.6.1 Ensure system wide crypto policy is not set to legacy|None|-|No|
|1.6.2 Ensure system wide crypto policy disables sha1 hash and signature support|None|-|No|
|1.6.3 Ensure system wide crypto policy disables cbc for ssh|None|-|No|
|1.6.4 Ensure system wide crypto policy disables macs less than 128 bits|None|-|No|
|1.7.1 Ensure message of the day is configured properly|None|-|No|
|1.7.2 Ensure local login warning banner is configured properly|None|-|No|
|1.7.3 Ensure remote login warning banner is configured properly|None|-|No|
|1.7.4 Ensure access to /etc/motd is configured|None|-|Yes|
|1.7.5 Ensure access to /etc/issue is configured|`filename`<br>`mask`<br>`owner`<br>`group`|`/etc/issue`<br>`0133`<br>`root`<br>`root`|Yes|
|1.7.6 Ensure access to /etc/issue.net is configured|None|-|Yes|
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
|2.1.1 Ensure time synchronization is in use|`packageName`|`chrony`|No|
|2.1.2 Ensure chrony is configured|None|-|No|
|2.1.3 Ensure chrony is not run as the root user|None|-|No|
|2.2.1 Ensure autofs services are not in use|`unitName`<br>`expectedUnitFileState`<br>`expectedActiveState`<br>`packageName`|`autofs.service`<br>`enabled`<br>`active`<br>`autofs`|No|
|2.2.2 Ensure avahi daemon services are not in use|`unitNameAvahiDaemonService`<br>`expectedUnitFileState`<br>`expectedActiveState`<br>`unitNameAvahiDaemonSocket`<br>`packageName`|`avahi-daemon.service`<br>`enabled`<br>`active`<br>`avahi-daemon.socket`<br>`avahi`|No|
|2.2.3 Ensure dhcp server services are not in use|`unitNameDhcpdService`<br>`expectedUnitFileState`<br>`expectedActiveState`<br>`unitNameDhcpd6Service`<br>`packageName`|`dhcpd.service`<br>`enabled`<br>`active`<br>`dhcpd6.service`<br>`dhcp-server`|No|
|2.2.4 Ensure dns server services are not in use|`serviceName`<br>`expectedUnitFileState`<br>`expectedActiveState`<br>`packageName`|`named.service`<br>`enabled`<br>`active`<br>`bind`|No|
|2.2.5 Ensure dnsmasq services are not in use|`unitName`<br>`expectedUnitFileState`<br>`expectedActiveState`<br>`packageName`|`dnsmasq.service`<br>`enabled`<br>`active`<br>`dnsmasq`|No|
|2.2.6 Ensure samba file server services are not in use|`unitName`<br>`expectedUnitFileState`<br>`expectedActiveState`<br>`packageName`|`smb.service`<br>`enabled`<br>`active`<br>`samba`|No|
|2.2.7 Ensure ftp server services are not in use|`serviceName`<br>`expectedUnitFileState`<br>`expectedActiveState`<br>`packageName`|`vsftpd.service`<br>`enabled`<br>`active`<br>`vsftpd`|No|
|2.2.8 Ensure message access server services are not in use|`unitNameDovecotService`<br>`expectedUnitFileState`<br>`expectedActiveState`<br>`unitNameDovecotSocket`<br>`packageNameDovecot`<br>`unitNameCyrusImapdService`<br>`packageNameCyrusImapd`|`dovecot.service`<br>`enabled`<br>`active`<br>`dovecot.socket`<br>`dovecot`<br>`cyrus-imapd.service`<br>`cyrus-imapd`|No|
|2.2.9 Ensure network file system services are not in use|`unitName`<br>`expectedUnitFileState`<br>`expectedActiveState`<br>`packageName`|`nfs-server.service`<br>`enabled`<br>`active`<br>`nfs-utils`|No|
|2.2.10 Ensure nis server services are not in use|`unitName`<br>`expectedUnitFileState`<br>`expectedActiveState`<br>`packageName`|`ypserv.service`<br>`enabled`<br>`active`<br>`ypserv`|No|
|2.2.11 Ensure print server services are not in use|`unitNameCupsService`<br>`expectedUnitFileState`<br>`expectedActiveState`<br>`unitNameCupsSocket`<br>`packageName`|`cups.service`<br>`enabled`<br>`active`<br>`cups.socket`<br>`cups`|No|
|2.2.12 Ensure rpcbind services are not in use|`unitNameRpcbindService`<br>`expectedUnitFileState`<br>`expectedActiveState`<br>`unitNameRpcbindSocket`<br>`packageName`|`rpcbind.service`<br>`enabled`<br>`active`<br>`rpcbind.socket`<br>`rpcbind`|No|
|2.2.13 Ensure rsync services are not in use|`unitNameRsyncdService`<br>`expectedUnitFileState`<br>`expectedActiveState`<br>`unitNameRsyncdSocket`<br>`packageName`|`rsyncd.service`<br>`enabled`<br>`active`<br>`rsyncd.socket`<br>`rsync-daemon`|No|
|2.2.14 Ensure snmp services are not in use|`unitName`<br>`expectedUnitFileState`<br>`expectedActiveState`<br>`packageName`|`snmpd.service`<br>`enabled`<br>`active`<br>`net-snmp`|No|
|2.2.15 Ensure telnet server services are not in use|`unitName`<br>`expectedUnitFileState`<br>`expectedActiveState`<br>`packageName`|`telnet.socket`<br>`enabled`<br>`active`<br>`telnet-server`|No|
|2.2.16 Ensure tftp server services are not in use|`unitNameTftpService`<br>`expectedUnitFileState`<br>`expectedActiveState`<br>`unitNameTftpSocket`<br>`packageName`|`tftp.service`<br>`enabled`<br>`active`<br>`tftp.socket`<br>`tftp-server`|No|
|2.2.17 Ensure web proxy server services are not in use|`unitName`<br>`expectedUnitFileState`<br>`expectedActiveState`<br>`packageName`|`squid.service`<br>`enabled`<br>`active`<br>`squid`|No|
|2.2.18 Ensure web server services are not in use|`unitNameHttpdService`<br>`expectedUnitFileState`<br>`expectedActiveState`<br>`unitNameHttpdSocket`<br>`packageNameHttpd`<br>`unitNameNginxService`<br>`packageNameNginx`|`httpd.service`<br>`enabled`<br>`active`<br>`httpd.socket`<br>`httpd`<br>`nginx.service`<br>`nginx`|No|
|2.2.19 Ensure xinetd services are not in use|`unitName`<br>`expectedUnitFileState`<br>`expectedActiveState`<br>`packageName`|`xinetd.service`<br>`enabled`<br>`active`<br>`xinetd`|No|
|2.2.20 Ensure X window server services are not in use|None|-|No|
|2.2.21 Ensure mail transfer agents are configured for local-only mode|None|-|No|
|2.2.22 Ensure only approved services are listening on a network interface|None|-|No|
|2.3.1 Ensure ftp client is not installed|None|-|No|
|2.3.2 Ensure ldap client is not installed|None|-|No|
|2.3.3 Ensure nis client is not installed|None|-|No|
|2.3.4 Ensure telnet client is not installed|`packageName`|`telnet`|No|
|2.3.5 Ensure tftp client is not installed|None|-|No|
|3.1.1 Ensure IPv6 status is identified|None|-|No|
|3.1.2 Ensure wireless interfaces are disabled|None|-|No|
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
|3.4.1.1 Ensure nftables is installed|None|-|No|
|3.4.1.2 Ensure a single firewall configuration utility is in use|None|-|No|
|3.4.2.1 Ensure nftables base chains exist|None|-|No|
|3.4.2.2 Ensure host based firewall loopback traffic is configured|None|-|No|
|3.4.2.3 Ensure firewalld drops unnecessary services and ports|None|-|No|
|3.4.2.4 Ensure nftables established connections are configured|None|-|No|
|3.4.2.5 Ensure nftables default deny firewall policy|None|-|No|
|4.1.1.1 Ensure cron daemon is enabled and active|None|-|No|
|4.1.1.2 Ensure permissions on /etc/crontab are configured|`mask`<br>`owner`<br>`group`|`0177`<br>`root`<br>`root`|Yes|
|4.1.1.3 Ensure permissions on /etc/cron.hourly are configured|`mask`<br>`owner`<br>`group`|`0077`<br>`root`<br>`root`|Yes|
|4.1.1.4 Ensure permissions on /etc/cron.daily are configured|`packageName`<br>`alternativePackageName`<br>`mask`<br>`owner`<br>`group`|`cron`<br>`cronie`<br>`0077`<br>`root`<br>`root`|Yes|
|4.1.1.5 Ensure permissions on /etc/cron.weekly are configured|`mask`<br>`owner`<br>`group`|`0077`<br>`root`<br>`root`|Yes|
|4.1.1.6 Ensure permissions on /etc/cron.monthly are configured|`alternativePackageName`<br>`mask`<br>`owner`<br>`group`|`cronie`<br>`0077`<br>`root`<br>`root`|Yes|
|4.1.1.7 Ensure permissions on /etc/cron.d are configured|`mask`<br>`owner`<br>`group`|`0077`<br>`root`<br>`root`|Yes|
|4.1.1.8 Ensure crontab is restricted to authorized users|`filenameEtcCronDeny`<br>`owner`<br>`group`<br>`mask`<br>`filenameEtcCronAllow`|`/etc/cron.deny`<br>`root`<br>`root`<br>`0137`<br>`/etc/cron.allow`|Yes|
|4.1.2.1 Ensure at is restricted to authorized users|`mask`<br>`owner`<br>`group`|`0137`<br>`root`<br>`root\|daemon`|Yes|
|4.2.1 Ensure permissions on /etc/ssh/sshd\_config are configured|`fileMask`<br>`owner`<br>`group`<br>`collectionMask`|`0077`<br>`root`<br>`root`<br>`0177`|Yes|
|4.2.2 Ensure permissions on SSH private host key files are configured|None|-|No|
|4.2.3 Ensure permissions on SSH public host key files are configured|None|-|No|
|4.2.4 Ensure sshd access is configured|`allowUsersValuePattern`<br>`allowGroupsValuePattern`<br>`denyUsersValuePattern`<br>`denyGroupsValuePattern`|`[^ \t]+`<br>`[^ \t]+`<br>`[^ \t]+`<br>`[^ \t]+`|No|
|4.2.5 Ensure sshd Banner is configured|`bannerValue`|`[^ \t]+`|No|
|4.2.6 Ensure sshd Ciphers are configured|`ciphersDisallowedValues`|`3des-cbc,aes128-cbc,aes192-cbc,aes256-cbc,arcfour,arcfour128,arcfour256,blowfish-cbc,cast128-cbc,rijndael-cbc@lysator.liu.se`|No|
|4.2.7 Ensure sshd ClientAliveInterval and ClientAliveCountMax are configured|`clientalivecountmaxValue`|`[1-9][0-9]*m?`|No|
|4.2.8 Ensure sshd DisableForwarding is enabled|None|-|No|
|4.2.9 Ensure sshd HostbasedAuthentication is disabled|None|-|No|
|4.2.10 Ensure sshd IgnoreRhosts is enabled|None|-|No|
|4.2.11 Ensure sshd KexAlgorithms is configured|`kexalgorithmsDisallowedValues`|`diffie-hellman-group1-sha1,diffie-hellman-group14-sha1,diffie-hellman-group-exchange-sha1`|No|
|4.2.12 Ensure sshd LoginGraceTime is configured|`logingracetimeValue`|`^(([1-9]\|[1-5][0-9]\|60\|1m))$`|No|
|4.2.13 Ensure sshd LogLevel is configured|`loglevelValue`|`(VERBOSE\|INFO)`|No|
|4.2.14 Ensure sshd MACs are configured|`macsDisallowedValues`|`hmac-md5,hmac-md5-96,hmac-ripemd160,hmac-sha1-96,umac-64@openssh\.com,hmac-md5-etm@openssh\.com,hmac-md5-96-etm@openssh\.com,hmac-ripemd160-etm@openssh\.com,hmac-sha1-96-etm@openssh\.com,umac-64-etm@openssh\.com`|No|
|4.2.15 Ensure sshd MaxAuthTries is configured|`maxauthtriesValue`|`^([0-4])$`|No|
|4.2.16 Ensure sshd MaxSessions is configured|`maxsessionsValue`|`([1-9]\|10)`|No|
|4.2.17 Ensure sshd MaxStartups is configured|`maxstartupsValue`|`^((10\|[1-9])\:(30\|[1-2][0-9]\|[1-9])\:(60\|[1-5][0-9]\|[1-9]))$`|No|
|4.2.18 Ensure sshd PermitEmptyPasswords is disabled|None|-|No|
|4.2.19 Ensure sshd PermitRootLogin is disabled|None|-|No|
|4.2.20 Ensure sshd PermitUserEnvironment is disabled|None|-|No|
|4.2.21 Ensure sshd UsePAM is enabled|None|-|No|
|4.2.22 Ensure sshd crypto\_policy is not set|None|-|No|
|4.3.1 Ensure sudo is installed|None|-|No|
|4.3.2 Ensure sudo commands use pty|None|-|No|
|4.3.3 Ensure sudo log file exists|None|-|No|
|4.3.4 Ensure users must provide password for escalation|None|-|No|
|4.3.5 Ensure re-authentication for privilege escalation is not disabled globally|None|-|No|
|4.3.6 Ensure sudo authentication timeout is configured correctly|None|-|No|
|4.3.7 Ensure access to the su command is restricted|None|-|No|
|4.4.1.1 Ensure latest version of pam is installed|None|-|No|
|4.4.1.2 Ensure latest version of authselect is installed|None|-|No|
|4.4.2.1 Ensure active authselect profile includes pam modules|None|-|No|
|4.4.2.2 Ensure pam\_faillock module is enabled|None|-|No|
|4.4.2.3 Ensure pam\_pwquality module is enabled|None|-|No|
|4.4.2.4 Ensure pam\_pwhistory module is enabled|None|-|No|
|4.4.2.5 Ensure pam\_unix module is enabled|None|-|No|
|4.4.3.1.1 Ensure password failed attempts lockout is configured|None|-|No|
|4.4.3.1.2 Ensure password unlock time is configured|None|-|No|
|4.4.3.1.3 Ensure password failed attempts lockout includes root account|None|-|No|
|4.4.3.2.1 Ensure password number of changed characters is configured|None|-|No|
|4.4.3.2.2 Ensure password length is configured|None|-|No|
|4.4.3.2.3 Ensure password complexity is configured|None|-|No|
|4.4.3.2.4 Ensure password same consecutive characters is configured|None|-|No|
|4.4.3.2.5 Ensure password maximum sequential characters is configured|None|-|No|
|4.4.3.2.6 Ensure password dictionary check is enabled|None|-|No|
|4.4.3.2.7 Ensure password quality is enforced for the root user|None|-|No|
|4.4.3.3.1 Ensure password history remember is configured|None|-|No|
|4.4.3.3.2 Ensure password history is enforced for the root user|None|-|No|
|4.4.3.3.3 Ensure pam\_pwhistory includes use\_authtok|None|-|No|
|4.4.3.4.1 Ensure pam\_unix does not include nullok|None|-|No|
|4.4.3.4.2 Ensure pam\_unix does not include remember|None|-|No|
|4.4.3.4.3 Ensure pam\_unix includes a strong password hashing algorithm|None|-|No|
|4.4.3.4.4 Ensure pam\_unix includes use\_authtok|None|-|No|
|4.5.1.1 Ensure strong password hashing algorithm is configured|None|-|No|
|4.5.1.2 Ensure password expiration is 365 days or less|`maxDays`|`365`|Yes|
|4.5.1.3 Ensure password expiration warning days is 7 or more|`warnDays`|`7`|Yes|
|4.5.1.4 Ensure inactive password lock is 30 days or less|None|-|No|
|4.5.1.5 Ensure all users last password change date is in the past|None|-|No|
|4.5.2.1 Ensure default group for the root account is GID 0|None|-|No|
|4.5.2.2 Ensure root user umask is configured|None|-|No|
|4.5.2.3 Ensure system accounts are secured|None|-|No|
|4.5.2.4 Ensure root password is set|None|-|No|
|4.5.3.1 Ensure nologin is not listed in /etc/shells|None|-|No|
|4.5.3.2 Ensure default user shell timeout is configured|None|-|Yes|
|4.5.3.3 Ensure default user umask is configured|None|-|Yes|
|5.1.1.1 Ensure rsyslog is installed|None|-|No|
|5.1.1.2 Ensure rsyslog service is enabled|None|-|No|
|5.1.1.3 Ensure journald is configured to send logs to rsyslog|`forwardToSyslogRegex`|`yes`|No|
|5.1.1.4 Ensure rsyslog default file permissions are configured|None|-|No|
|5.1.1.5 Ensure logging is configured|None|-|No|
|5.1.1.6 Ensure rsyslog is configured to send logs to a remote log host|None|-|No|
|5.1.1.7 Ensure rsyslog is not configured to receive logs from a remote client|None|-|No|
|5.1.2.1.1 Ensure systemd-journal-remote is installed|None|-|No|
|5.1.2.1.2 Ensure systemd-journal-remote is configured|None|-|No|
|5.1.2.1.3 Ensure systemd-journal-remote is enabled|None|-|No|
|5.1.2.1.4 Ensure journald is not configured to receive logs from a remote client|None|-|No|
|5.1.2.2 Ensure journald service is enabled|None|-|No|
|5.1.2.3 Ensure journald is configured to compress large log files|None|-|No|
|5.1.2.4 Ensure journald is configured to write logfiles to persistent disk|None|-|No|
|5.1.2.5 Ensure journald is not configured to send logs to rsyslog|None|-|No|
|5.1.2.6 Ensure journald log rotation is configured per site policy|None|-|No|
|5.1.3 Ensure logrotate is configured|None|-|No|
|5.1.4 Ensure all logfiles have appropriate access configured|None|-|No|
|5.2.1.1 Ensure audit is installed|None|-|No|
|5.2.1.2 Ensure auditing for processes that start prior to auditd is enabled|None|-|No|
|5.2.1.3 Ensure audit\_backlog\_limit is sufficient|None|-|No|
|5.2.1.4 Ensure auditd service is enabled|None|-|No|
|5.2.2.1 Ensure audit log storage size is configured|None|-|No|
|5.2.2.2 Ensure audit logs are not automatically deleted|None|-|No|
|5.2.2.3 Ensure system is disabled when audit logs are full|None|-|No|
|5.2.2.4 Ensure system warns when audit logs are low on space|None|-|No|
|5.2.3.1 Ensure changes to system administration scope (sudoers) is collected|None|-|No|
|5.2.3.2 Ensure actions as another user are always logged|None|-|No|
|5.2.3.3 Ensure events that modify the sudo log file are collected|None|-|No|
|5.2.3.4 Ensure events that modify date and time information are collected|None|-|No|
|5.2.3.5 Ensure events that modify the system's network environment are collected|None|-|No|
|5.2.3.6 Ensure use of privileged commands are collected|None|-|No|
|5.2.3.7 Ensure unsuccessful file access attempts are collected|None|-|No|
|5.2.3.8 Ensure events that modify user/group information are collected|None|-|No|
|5.2.3.9 Ensure discretionary access control permission modification events are collected|None|-|No|
|5.2.3.10 Ensure successful file system mounts are collected|None|-|No|
|5.2.3.11 Ensure session initiation information is collected|None|-|No|
|5.2.3.12 Ensure login and logout events are collected|None|-|No|
|5.2.3.13 Ensure file deletion events by users are collected|None|-|No|
|5.2.3.14 Ensure events that modify the system's Mandatory Access Controls are collected|None|-|No|
|5.2.3.15 Ensure successful and unsuccessful attempts to use the chcon command are recorded|None|-|No|
|5.2.3.16 Ensure successful and unsuccessful attempts to use the setfacl command are recorded|None|-|No|
|5.2.3.17 Ensure successful and unsuccessful attempts to use the chacl command are recorded|None|-|No|
|5.2.3.18 Ensure successful and unsuccessful attempts to use the usermod command are recorded|None|-|No|
|5.2.3.19 Ensure kernel module loading unloading and modification is collected|None|-|No|
|5.2.3.20 Ensure the audit configuration is immutable|None|-|No|
|5.2.3.21 Ensure the running and on disk configuration is the same|None|-|No|
|5.2.4.1 Ensure the audit log directory is 0750 or more restrictive|None|-|No|
|5.2.4.2 Ensure audit log files are mode 0640 or less permissive|None|-|No|
|5.2.4.3 Ensure only authorized users own audit log files|None|-|No|
|5.2.4.4 Ensure only authorized groups are assigned ownership of audit log files|None|-|No|
|5.2.4.5 Ensure audit configuration files are 640 or more restrictive|`directory`<br>`filePattern`<br>`mask`|`/etc/audit/`<br>`^.*\.(conf\|rules)`<br>`0137`|No|
|5.2.4.6 Ensure audit configuration files are owned by root|`directory`<br>`filePattern`|`/etc/audit/`<br>`^.*\.(conf\|rules)`|No|
|5.2.4.7 Ensure audit configuration files belong to group root|`directory`<br>`filePattern`<br>`group`|`/etc/audit/`<br>`^.*\.(conf\|rules)`<br>`root`|No|
|5.2.4.8 Ensure audit tools are 755 or more restrictive|`filenameSbinAuditctl`<br>`mask`<br>`filenameSbinAureport`<br>`filenameSbinAusearch`<br>`filenameSbinAutrace`<br>`filenameSbinAuditd`<br>`filenameSbinAugenrules`|`/sbin/auditctl`<br>`0022`<br>`/sbin/aureport`<br>`/sbin/ausearch`<br>`/sbin/autrace`<br>`/sbin/auditd`<br>`/sbin/augenrules`|Yes|
|5.2.4.9 Ensure audit tools are owned by root|`filenameSbinAuditctl`<br>`owner`<br>`filenameSbinAureport`<br>`filenameSbinAusearch`<br>`filenameSbinAutrace`<br>`filenameSbinAuditd`<br>`filenameSbinAugenrules`|`/sbin/auditctl`<br>`root`<br>`/sbin/aureport`<br>`/sbin/ausearch`<br>`/sbin/autrace`<br>`/sbin/auditd`<br>`/sbin/augenrules`|Yes|
|5.2.4.10 Ensure audit tools belong to group root|`filenameSbinAuditctl`<br>`group`<br>`filenameSbinAureport`<br>`filenameSbinAusearch`<br>`filenameSbinAutrace`<br>`filenameSbinAuditd`<br>`filenameSbinAugenrules`|`/sbin/auditctl`<br>`root`<br>`/sbin/aureport`<br>`/sbin/ausearch`<br>`/sbin/autrace`<br>`/sbin/auditd`<br>`/sbin/augenrules`|Yes|
|5.3.1 Ensure AIDE is installed|None|-|No|
|5.3.2 Ensure filesystem integrity is regularly checked|None|-|No|
|5.3.3 Ensure cryptographic mechanisms are used to protect the integrity of audit tools|None|-|No|
|6.1.1 Ensure permissions on /etc/passwd are configured|`mask`<br>`owner`<br>`group`|`0133`<br>`root`<br>`root`|Yes|
|6.1.2 Ensure permissions on /etc/passwd- are configured|`mask`<br>`owner`<br>`group`|`0133`<br>`root`<br>`root`|Yes|
|6.1.3 Ensure permissions on /etc/opasswd are configured|`mask`<br>`owner`<br>`group`|`0177`<br>`root`<br>`root`|Yes|
|6.1.4 Ensure permissions on /etc/group are configured|`mask`<br>`owner`<br>`group`|`0133`<br>`root`<br>`root`|Yes|
|6.1.5 Ensure permissions on /etc/group- are configured|`mask`<br>`owner`<br>`group`|`0133`<br>`root`<br>`root`|Yes|
|6.1.6 Ensure permissions on /etc/shadow are configured|`mask`<br>`owner`<br>`group`|`0777`<br>`root`<br>`root`|Yes|
|6.1.7 Ensure permissions on /etc/shadow- are configured|`mask`<br>`owner`<br>`group`|`0777`<br>`root`<br>`root`|Yes|
|6.1.8 Ensure permissions on /etc/gshadow are configured|`mask`<br>`owner`<br>`group`|`0777`<br>`root`<br>`root`|Yes|
|6.1.9 Ensure permissions on /etc/gshadow- are configured|`mask`<br>`owner`<br>`group`|`0777`<br>`root`<br>`root`|Yes|
|6.1.10 Ensure permissions on /etc/shells are configured|`mask`<br>`owner`<br>`group`|`0133`<br>`root`<br>`root`|Yes|
|6.1.11 Ensure world writable files and directories are secured|None|-|No|
|6.1.12 Ensure no unowned or ungrouped files or directories exist|None|-|No|
|6.1.13 Ensure SUID and SGID files are reviewed|None|-|No|
|6.1.14 Audit system file permissions|None|-|No|
|6.2.1 Ensure accounts in /etc/passwd use shadowed passwords|None|-|No|
|6.2.2 Ensure /etc/shadow password fields are not empty|None|-|No|
|6.2.3 Ensure all groups in /etc/passwd exist in /etc/group|None|-|No|
|6.2.4 Ensure no duplicate UIDs exist|None|-|No|
|6.2.5 Ensure no duplicate GIDs exist|None|-|No|
|6.2.6 Ensure no duplicate user names exist|None|-|No|
|6.2.7 Ensure no duplicate group names exist|None|-|No|
|6.2.8 Ensure root path integrity|None|-|No|
|6.2.9 Ensure root is the only UID 0 account|None|-|No|
|6.2.10 Ensure local interactive user home directories are configured|None|-|No|
|6.2.11 Ensure local interactive user dot files access is configured|None|-|No|

### Known assessment discrepancies

> [!NOTE]
> These rules may produce assessment results that differ from CIS-CAT® Pro Assessor; our implementation may enforce stricter criteria.
> A rule is listed once if a discrepancy was observed in any tested scenario.

- 5.2.4.6 Ensure audit configuration files are owned by root
- 5.3.3 Ensure cryptographic mechanisms are used to protect the integrity of audit tools

## CIS AlmaLinux OS 8 Benchmark 4.0.0 Level 1 + Level 2 - Server

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
|1.1.1.9 Ensure firewire-core kernel module is not available|None|-|Yes|
|1.1.1.10 Ensure usb-storage kernel module is not available|None|-|Yes|
|1.1.1.11 Ensure unused filesystems kernel modules are not available|None|-|No|
|1.1.2.1.1 Ensure /tmp is tmpfs or a separate partition|`mountPoint`|`/tmp`|No|
|1.1.2.1.2 Ensure nodev option set on /tmp partition|`mountPoint`<br>`requiredMountOptions`|`/tmp`<br>`nodev`|No|
|1.1.2.1.3 Ensure nosuid option set on /tmp partition|`mountPoint`<br>`requiredMountOptions`|`/tmp`<br>`nosuid`|No|
|1.1.2.1.4 Ensure noexec option set on /tmp partition|`mountPoint`<br>`requiredMountOptions`|`/tmp`<br>`noexec`|No|
|1.1.2.2.1 Ensure /dev/shm is tmpfs|`mountPoint`|`/dev/shm`|No|
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
|1.2.1.2 Ensure gpgcheck is configured|None|-|No|
|1.2.1.3 Ensure repo\_gpgcheck is globally activated|None|-|No|
|1.2.1.4 Ensure package manager repositories are configured|None|-|No|
|1.2.1.5 Ensure weak dependencies are configured|None|-|No|
|1.2.2.1 Ensure updates, patches, and additional security software are installed|None|-|No|
|1.3.1.1 Ensure SELinux is installed|None|-|No|
|1.3.1.2 Ensure SELinux is not disabled in bootloader configuration|None|-|No|
|1.3.1.3 Ensure SELinux policy is configured|None|-|No|
|1.3.1.4 Ensure the SELinux mode is not disabled|None|-|No|
|1.3.1.5 Ensure the SELinux mode is enforcing|None|-|No|
|1.3.1.6 Ensure no unconfined services exist|None|-|No|
|1.3.1.7 Ensure the MCS Translation Service (mcstrans) is not installed|None|-|No|
|1.3.1.8 Ensure SETroubleshoot is not installed|None|-|No|
|1.4.1 Ensure bootloader password is set|None|-|No|
|1.4.2 Ensure access to bootloader config is configured|None|-|No|
|1.5.1 Ensure core file size is configured|None|-|No|
|1.5.2 Ensure fs.protected\_hardlinks is configured|None|-|No|
|1.5.3 Ensure fs.protected\_symlinks is configured|None|-|No|
|1.5.4 Ensure fs.suid\_dumpable is configured|None|-|No|
|1.5.5 Ensure kernel.dmesg\_restrict is configured|None|-|No|
|1.5.6 Ensure kernel.kptr\_restrict is configured|None|-|No|
|1.5.7 Ensure kernel.yama.ptrace\_scope is configured|None|-|No|
|1.5.8 Ensure kernel.randomize\_va\_space is configured|None|-|No|
|1.5.9 Ensure systemd-coredump ProcessSizeMax is configured|`processSizeMaxValue`|`0`|No|
|1.5.10 Ensure systemd-coredump Storage is configured|`storageValue`|`none`|No|
|1.6.1 Ensure system wide crypto policy is not set to legacy|None|-|No|
|1.6.2 Ensure system wide crypto policy disables sha1 hash and signature support|None|-|No|
|1.6.3 Ensure system wide crypto policy macs are configured|None|-|No|
|1.6.4 Ensure system wide crypto policy disables cbc for ssh|None|-|No|
|1.6.5 Ensure system wide crypto policy disables chacha20-poly1305 for ssh|None|-|No|
|1.6.6 Ensure system wide crypto policy disables EtM for ssh|None|-|No|
|1.7.1 Ensure /etc/motd is configured|None|-|No|
|1.7.2 Ensure /etc/issue is configured|None|-|No|
|1.7.3 Ensure /etc/issue.net is configured|None|-|No|
|1.7.4 Ensure access to /etc/motd is configured|None|-|Yes|
|1.7.5 Ensure access to /etc/issue is configured|`filename`<br>`mask`<br>`owner`<br>`group`|`/etc/issue`<br>`0133`<br>`root`<br>`root`|Yes|
|1.7.6 Ensure access to /etc/issue.net is configured|None|-|Yes|
|1.8.1 Ensure GDM login banner is configured|None|-|Yes|
|1.8.2 Ensure GDM disable-user-list is configured|None|-|Yes|
|1.8.3 Ensure GDM screen lock is configured|None|-|Yes|
|1.8.4 Ensure GDM automount is configured|None|-|Yes|
|1.8.5 Ensure GDM autorun-never is configured|None|-|Yes|
|1.8.6 Ensure XDMCP is not enabled|None|-|No|
|1.8.7 Ensure Xwayland is configured|None|-|No|
|2.1.1 Ensure autofs services are not in use|`unitName`<br>`expectedUnitFileState`<br>`expectedActiveState`<br>`packageName`|`autofs.service`<br>`enabled`<br>`active`<br>`autofs`|No|
|2.1.2 Ensure avahi daemon services are not in use|`unitNameAvahiDaemonService`<br>`expectedUnitFileState`<br>`expectedActiveState`<br>`unitNameAvahiDaemonSocket`<br>`packageName`|`avahi-daemon.service`<br>`enabled`<br>`active`<br>`avahi-daemon.socket`<br>`avahi`|No|
|2.1.3 Ensure cockpit web services are not in use|`unitNameCockpitService`<br>`expectedUnitFileState`<br>`unitNameCockpitSocket`<br>`expectedActiveState`<br>`packageName`|`cockpit.service`<br>`enabled`<br>`cockpit.socket`<br>`active`<br>`cockpit-ws`|No|
|2.1.4 Ensure dhcp server services are not in use|`unitNameDhcpdService`<br>`expectedUnitFileState`<br>`expectedActiveState`<br>`unitNameDhcpd6Service`<br>`packageName`|`dhcpd.service`<br>`enabled`<br>`active`<br>`dhcpd6.service`<br>`dhcp-server`|No|
|2.1.5 Ensure dns server services are not in use|`serviceName`<br>`expectedUnitFileState`<br>`expectedActiveState`<br>`packageName`|`named.service`<br>`enabled`<br>`active`<br>`bind`|No|
|2.1.6 Ensure dnsmasq services are not in use|`unitName`<br>`expectedUnitFileState`<br>`expectedActiveState`<br>`packageName`|`dnsmasq.service`<br>`enabled`<br>`active`<br>`dnsmasq`|No|
|2.1.7 Ensure ftp server services are not in use|`serviceName`<br>`expectedUnitFileState`<br>`expectedActiveState`<br>`packageName`|`vsftpd.service`<br>`enabled`<br>`active`<br>`vsftpd`|No|
|2.1.8 Ensure message access server services are not in use|`unitNameDovecotService`<br>`expectedUnitFileState`<br>`expectedActiveState`<br>`unitNameDovecotSocket`<br>`packageNameDovecot`<br>`unitNameCyrusImapdService`<br>`packageNameCyrusImapd`|`dovecot.service`<br>`enabled`<br>`active`<br>`dovecot.socket`<br>`dovecot`<br>`cyrus-imapd.service`<br>`cyrus-imapd`|No|
|2.1.9 Ensure network file system services are not in use|`unitName`<br>`expectedUnitFileState`<br>`expectedActiveState`<br>`packageName`|`nfs-server.service`<br>`enabled`<br>`active`<br>`nfs-utils`|No|
|2.1.10 Ensure nis server services are not in use|`unitName`<br>`expectedUnitFileState`<br>`expectedActiveState`<br>`packageName`|`ypserv.service`<br>`enabled`<br>`active`<br>`ypserv`|No|
|2.1.11 Ensure print server services are not in use|`unitNameCupsService`<br>`expectedUnitFileState`<br>`expectedActiveState`<br>`unitNameCupsSocket`<br>`packageName`|`cups.service`<br>`enabled`<br>`active`<br>`cups.socket`<br>`cups`|No|
|2.1.12 Ensure rpcbind services are not in use|`unitNameRpcbindService`<br>`expectedUnitFileState`<br>`expectedActiveState`<br>`unitNameRpcbindSocket`<br>`packageName`|`rpcbind.service`<br>`enabled`<br>`active`<br>`rpcbind.socket`<br>`rpcbind`|No|
|2.1.13 Ensure rsync services are not in use|`unitNameRsyncdService`<br>`expectedUnitFileState`<br>`expectedActiveState`<br>`unitNameRsyncdSocket`<br>`packageName`|`rsyncd.service`<br>`enabled`<br>`active`<br>`rsyncd.socket`<br>`rsync-daemon`|No|
|2.1.14 Ensure samba file server services are not in use|`unitName`<br>`expectedUnitFileState`<br>`expectedActiveState`<br>`packageName`|`smb.service`<br>`enabled`<br>`active`<br>`samba`|No|
|2.1.15 Ensure snmp services are not in use|`unitName`<br>`expectedUnitFileState`<br>`expectedActiveState`<br>`packageName`|`snmpd.service`<br>`enabled`<br>`active`<br>`net-snmp`|No|
|2.1.16 Ensure telnet server services are not in use|`unitName`<br>`expectedUnitFileState`<br>`expectedActiveState`<br>`packageName`|`telnet.socket`<br>`enabled`<br>`active`<br>`telnet-server`|No|
|2.1.17 Ensure tftp server services are not in use|`unitNameTftpService`<br>`expectedUnitFileState`<br>`expectedActiveState`<br>`unitNameTftpSocket`<br>`packageName`|`tftp.service`<br>`enabled`<br>`active`<br>`tftp.socket`<br>`tftp-server`|No|
|2.1.18 Ensure web proxy server services are not in use|`unitName`<br>`expectedUnitFileState`<br>`expectedActiveState`<br>`packageName`|`squid.service`<br>`enabled`<br>`active`<br>`squid`|No|
|2.1.19 Ensure web server services are not in use|`unitNameHttpdService`<br>`expectedUnitFileState`<br>`expectedActiveState`<br>`unitNameHttpdSocket`<br>`packageNameHttpd`<br>`unitNameNginxService`<br>`packageNameNginx`|`httpd.service`<br>`enabled`<br>`active`<br>`httpd.socket`<br>`httpd`<br>`nginx.service`<br>`nginx`|No|
|2.1.20 Ensure xinetd services are not in use|`unitName`<br>`expectedUnitFileState`<br>`expectedActiveState`<br>`packageName`|`xinetd.service`<br>`enabled`<br>`active`<br>`xinetd`|No|
|2.1.21 Ensure GNOME Display Manager is removed|None|-|No|
|2.1.22 Ensure X window server services are not in use|None|-|No|
|2.1.23 Ensure mail transfer agents are configured for local-only mode|None|-|No|
|2.1.24 Ensure only approved services are listening on a network interface|None|-|No|
|2.2.1 Ensure ftp client is not installed|None|-|No|
|2.2.2 Ensure ldap client is not installed|None|-|No|
|2.2.3 Ensure nis client is not installed|None|-|No|
|2.2.4 Ensure telnet client is not installed|`packageName`|`telnet`|No|
|2.2.5 Ensure tftp client is not installed|None|-|No|
|2.3.1 Ensure time synchronization is in use|`packageName`|`chrony`|No|
|2.3.2 Ensure chrony is configured|None|-|No|
|2.3.3 Ensure chrony is not run as the root user|None|-|No|
|2.4.1.1 Ensure cron daemon is enabled and active|None|-|No|
|2.4.1.2 Ensure access to /etc/crontab is configured|`mask`<br>`owner`<br>`group`|`0177`<br>`root`<br>`root`|Yes|
|2.4.1.3 Ensure access to /etc/cron.hourly is configured|`mask`<br>`owner`<br>`group`|`0077`<br>`root`<br>`root`|Yes|
|2.4.1.4 Ensure access to /etc/cron.daily is configured|`mask`<br>`owner`<br>`group`|`0077`<br>`root`<br>`root`|Yes|
|2.4.1.5 Ensure access to /etc/cron.weekly is configured|`mask`<br>`owner`<br>`group`|`0077`<br>`root`<br>`root`|Yes|
|2.4.1.6 Ensure access to /etc/cron.monthly is configured|`mask`<br>`owner`<br>`group`|`0077`<br>`root`<br>`root`|Yes|
|2.4.1.7 Ensure access to /etc/cron.yearly is configured|None|-|Yes|
|2.4.1.8 Ensure access to /etc/cron.d is configured|`mask`<br>`owner`<br>`group`|`0077`<br>`root`<br>`root`|Yes|
|2.4.1.9 Ensure access to crontab is configured|`owner`<br>`group`<br>`mask`|`root`<br>`root\|crontab`<br>`0137`|Yes|
|2.4.2.1 Ensure access to at is configured|`filenameEtcAtAllow`<br>`mask`<br>`owner`<br>`group`<br>`filenameEtcAtDeny`|`/etc/at.allow`<br>`0137`<br>`root`<br>`root\|daemon`<br>`/etc/at.deny`|Yes|
|3.1.1 Ensure IPv6 status is identified|None|-|No|
|3.1.2 Ensure wireless interfaces are not available|None|-|No|
|3.1.3 Ensure bluetooth services are not in use|`unitName`<br>`expectedUnitFileState`<br>`expectedActiveState`<br>`packageName`|`bluetooth.service`<br>`enabled`<br>`active`<br>`bluez`|No|
|3.2.1 Ensure atm kernel module is not available|None|-|Yes|
|3.2.2 Ensure can kernel module is not available|None|-|Yes|
|3.2.3 Ensure dccp kernel module is not available|None|-|Yes|
|3.2.4 Ensure rds kernel module is not available|None|-|Yes|
|3.2.5 Ensure sctp kernel module is not available|None|-|Yes|
|3.2.6 Ensure tipc kernel module is not available|None|-|Yes|
|3.3.1.1 Ensure net.ipv4.ip\_forward is configured|None|-|No|
|3.3.1.2 Ensure net.ipv4.conf.all.forwarding is configured|None|-|No|
|3.3.1.3 Ensure net.ipv4.conf.default.forwarding is configured|None|-|No|
|3.3.1.4 Ensure net.ipv4.conf.all.send\_redirects is configured|None|-|No|
|3.3.1.5 Ensure net.ipv4.conf.default.send\_redirects is configured|None|-|No|
|3.3.1.6 Ensure net.ipv4.icmp\_ignore\_bogus\_error\_responses is configured|None|-|No|
|3.3.1.7 Ensure net.ipv4.icmp\_echo\_ignore\_broadcasts is configured|None|-|No|
|3.3.1.8 Ensure net.ipv4.conf.all.accept\_redirects is configured|None|-|No|
|3.3.1.9 Ensure net.ipv4.conf.default.accept\_redirects is configured|None|-|No|
|3.3.1.10 Ensure net.ipv4.conf.all.secure\_redirects is configured|None|-|No|
|3.3.1.11 Ensure net.ipv4.conf.default.secure\_redirects is configured|None|-|No|
|3.3.1.12 Ensure net.ipv4.conf.all.rp\_filter is configured|None|-|No|
|3.3.1.13 Ensure net.ipv4.conf.default.rp\_filter is configured|None|-|No|
|3.3.1.14 Ensure net.ipv4.conf.all.accept\_source\_route is configured|None|-|No|
|3.3.1.15 Ensure net.ipv4.conf.default.accept\_source\_route is configured|None|-|No|
|3.3.1.16 Ensure net.ipv4.conf.all.log\_martians is configured|None|-|No|
|3.3.1.17 Ensure net.ipv4.conf.default.log\_martians is configured|None|-|No|
|3.3.1.18 Ensure net.ipv4.tcp\_syncookies is configured|None|-|No|
|3.3.2.1 Ensure  net.ipv6.conf.all.forwarding is configured|None|-|No|
|3.3.2.2 Ensure  net.ipv6.conf.default.forwarding is configured|None|-|No|
|3.3.2.3 Ensure net.ipv6.conf.all.accept\_redirects is configured|None|-|No|
|3.3.2.4 Ensure net.ipv6.conf.default.accept\_redirects is configured|None|-|No|
|3.3.2.5 Ensure net.ipv6.conf.all.accept\_source\_route is configured|None|-|No|
|3.3.2.6 Ensure net.ipv6.conf.default.accept\_source\_route is configured|None|-|No|
|3.3.2.7 Ensure net.ipv6.conf.all.accept\_ra is configured|None|-|No|
|3.3.2.8 Ensure net.ipv6.conf.default.accept\_ra is configured|None|-|No|
|4.1.1 Ensure firewalld is installed|None|-|No|
|4.1.2 Ensure firewalld backend is configured|None|-|No|
|4.1.3 Ensure firewalld.service is configured|None|-|No|
|4.1.4 Ensure firewalld active zone target is configured|None|-|No|
|4.1.5 Ensure firewalld loopback traffic is configured|None|-|No|
|4.1.6 Ensure firewalld loopback source address traffic is configured|None|-|No|
|4.1.7 Ensure firewalld services and ports are configured|None|-|No|
|5.1.1 Ensure sshd crypto\_policy is not set|None|-|No|
|5.1.2 Ensure access to /etc/ssh/sshd\_config is configured|`mask`<br>`owner`<br>`group`|`0177`<br>`root`<br>`root`|Yes|
|5.1.3 Ensure access to /etc/sysconfig/sshd is configured|`filename`<br>`mask`<br>`owner`<br>`group`|`/etc/sysconfig/sshd`<br>`0137`<br>`root`<br>`root`|Yes|
|5.1.4 Ensure access to SSH private host key files is configured|None|-|No|
|5.1.5 Ensure access to SSH public host key files is configured|None|-|No|
|5.1.6 Ensure sshd access is configured|`allowUsersValuePattern`<br>`allowGroupsValuePattern`<br>`denyUsersValuePattern`<br>`denyGroupsValuePattern`|`[^ \t]+`<br>`[^ \t]+`<br>`[^ \t]+`<br>`[^ \t]+`|No|
|5.1.7 Ensure sshd Banner is configured|`bannerExpectedValueT`<br>`bannerDisallowedValuesNone`|`\/[^ \t]+`<br>`none`|No|
|5.1.8 Ensure sshd Ciphers are configured|`ciphersDisallowedValues`|`3des-cbc,aes128-cbc,aes192-cbc,aes256-cbc,arcfour,arcfour128,arcfour256,blowfish-cbc,cast128-cbc,rijndael-cbc@lysator\.liu\.se`|No|
|5.1.9 Ensure sshd ClientAliveInterval and ClientAliveCountMax are configured|`clientalivecountmaxThreshold`<br>`clientaliveintervalThreshold`|`0`<br>`0`|No|
|5.1.10 Ensure sshd DisableForwarding is enabled|None|-|No|
|5.1.11 Ensure sshd GSSAPIAuthentication is disabled|None|-|No|
|5.1.12 Ensure sshd HostbasedAuthentication is disabled|None|-|No|
|5.1.13 Ensure sshd IgnoreRhosts is enabled|None|-|No|
|5.1.14 Ensure sshd KexAlgorithms is configured|`kexalgorithmsDisallowedValues`|`diffie-hellman-group1-sha1,diffie-hellman-group14-sha1,diffie-hellman-group-exchange-sha1`|No|
|5.1.15 Ensure sshd LoginGraceTime is configured|`logingracetimeThresholdValue60`<br>`logingracetimeThresholdValue0`|`60`<br>`0`|No|
|5.1.16 Ensure sshd LogLevel is configured|`loglevelExpectedValue`|`verbose,info`|No|
|5.1.17 Ensure sshd MACs are configured|`macsDisallowedValues`|`hmac-md5,hmac-md5-96,hmac-ripemd160,hmac-sha1-96,umac-64@openssh\.com,hmac-md5-etm@openssh\.com,hmac-md5-96-etm@openssh\.com,hmac-ripemd160-etm@openssh\.com,hmac-sha1-96-etm@openssh\.com,umac-64-etm@openssh\.com,umac-128-etm@openssh\.com`|No|
|5.1.18 Ensure sshd MaxAuthTries is configured|`maxauthtriesThreshold`|`4`|No|
|5.1.19 Ensure sshd MaxSessions is configured|`maxsessionsThreshold`|`10`|No|
|5.1.20 Ensure sshd MaxStartups is configured|`maxstartupsExpectedValue`|`10:30:60`|No|
|5.1.21 Ensure sshd PermitEmptyPasswords is disabled|None|-|No|
|5.1.22 Ensure sshd PermitRootLogin is disabled|None|-|No|
|5.1.23 Ensure sshd PermitUserEnvironment is disabled|None|-|No|
|5.1.24 Ensure sshd UsePAM is enabled|None|-|No|
|5.2.1 Ensure sudo is installed|None|-|No|
|5.2.2 Ensure sudo commands use pty|None|-|No|
|5.2.3 Ensure sudo log file exists|None|-|No|
|5.2.4 Ensure users must provide password for escalation|None|-|No|
|5.2.5 Ensure re-authentication for privilege escalation is not disabled globally|None|-|No|
|5.2.6 Ensure sudo timestamp\_timeout is configured|None|-|No|
|5.2.7 Ensure access to the su command is restricted|None|-|No|
|5.3.1.1 Ensure latest version of pam is installed|None|-|No|
|5.3.1.2 Ensure latest version of authselect is installed|None|-|No|
|5.3.2.1 Ensure active authselect profile includes pam modules|None|-|No|
|5.3.2.2 Ensure pam\_faillock module is enabled|None|-|No|
|5.3.2.3 Ensure pam\_pwquality module is enabled|None|-|No|
|5.3.2.4 Ensure pam\_pwhistory module is enabled|None|-|No|
|5.3.2.5 Ensure pam\_unix module is enabled|None|-|No|
|5.3.3.1.1 Ensure password failed attempts lockout is configured|None|-|No|
|5.3.3.1.2 Ensure password unlock time is configured|None|-|No|
|5.3.3.1.3 Ensure password failed attempts lockout includes root account|None|-|No|
|5.3.3.2.1 Ensure password number of changed characters is configured|None|-|No|
|5.3.3.2.2 Ensure password length is configured|None|-|No|
|5.3.3.2.3 Ensure password complexity is configured|None|-|No|
|5.3.3.2.4 Ensure password same consecutive characters is configured|None|-|No|
|5.3.3.2.5 Ensure password maximum sequential characters is configured|None|-|No|
|5.3.3.2.6 Ensure password dictionary check is enabled|None|-|No|
|5.3.3.2.7 Ensure password quality is enforced for the root user|None|-|No|
|5.3.3.3.1 Ensure password history remember is configured|None|-|No|
|5.3.3.3.2 Ensure password history is enforced for the root user|None|-|No|
|5.3.3.3.3 Ensure pam\_pwhistory includes use\_authtok|None|-|No|
|5.3.3.4.1 Ensure pam\_unix does not include nullok|None|-|No|
|5.3.3.4.2 Ensure pam\_unix does not include remember|None|-|No|
|5.3.3.4.3 Ensure pam\_unix includes a strong password hashing algorithm|None|-|No|
|5.3.3.4.4 Ensure pam\_unix includes use\_authtok|None|-|No|
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
|5.4.3.3 Ensure default user umask is configured|None|-|No|
|6.1.1 Ensure AIDE is installed|None|-|No|
|6.1.2 Ensure filesystem integrity is regularly checked|None|-|No|
|6.1.3 Ensure cryptographic mechanisms are used to protect the integrity of audit tools|None|-|No|
|6.2.1.1.1 Ensure journald service is active|None|-|No|
|6.2.1.1.2 Ensure journald log file access is configured|None|-|No|
|6.2.1.1.3 Ensure journald log file rotation is configured|None|-|No|
|6.2.1.1.4 Ensure journald ForwardToSyslog is disabled|`forwardToSyslogValue`|`no`|No|
|6.2.1.1.5 Ensure journald Storage is configured|`storageValue`|`persistent`|No|
|6.2.1.1.6 Ensure journald Compress is configured|`compressValue`|`yes`|No|
|6.2.1.2.1 Ensure systemd-journal-remote is installed|None|-|No|
|6.2.1.2.2 Ensure systemd-journal-remote authentication is configured|None|-|No|
|6.2.1.2.3 Ensure systemd-journal-upload is enabled and active|None|-|No|
|6.2.1.2.4 Ensure systemd-journal-remote service is not in use|None|-|No|
|6.2.2.1 Ensure rsyslog is installed|None|-|No|
|6.2.2.2 Ensure rsyslog service is enabled and active|None|-|No|
|6.2.2.3 Ensure journald is configured to send logs to rsyslog|`forwardToSyslogValue`|`yes`|No|
|6.2.2.4 Ensure rsyslog log file creation mode is configured|None|-|No|
|6.2.2.5 Ensure rsyslog logging is configured|None|-|No|
|6.2.2.6 Ensure rsyslog is configured to send logs to a remote log host|None|-|No|
|6.2.2.7 Ensure rsyslog is not configured to receive logs from a remote client|None|-|No|
|6.2.2.8 Ensure logrotate is configured|None|-|No|
|6.2.3.1 Ensure access to all logfiles has been configured|None|-|No|
|6.3.1.1 Ensure auditd packages are installed|None|-|No|
|6.3.1.2 Ensure auditing for processes that start prior to auditd is enabled|None|-|No|
|6.3.1.3 Ensure audit\_backlog\_limit is configured|None|-|No|
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
|6.3.3.20 Ensure the audit configuration is loaded regardless of errors|None|-|No|
|6.3.3.21 Ensure the audit configuration is immutable|None|-|No|
|6.3.3.22 Ensure the running and on disk configuration is the same|None|-|No|
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
|7.1.5 Ensure access to /etc/shadow is configured|`mask`<br>`owner`<br>`group`|`0777`<br>`root`<br>`root`|Yes|
|7.1.6 Ensure access to /etc/shadow- is configured|`mask`<br>`owner`<br>`group`|`0777`<br>`root`<br>`root`|Yes|
|7.1.7 Ensure access to /etc/gshadow is configured|`mask`<br>`owner`<br>`group`|`0777`<br>`root`<br>`root`|Yes|
|7.1.8 Ensure access to /etc/gshadow- is configured|`mask`<br>`owner`<br>`group`|`0777`<br>`root`<br>`root`|Yes|
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

No discrepancies found among compared rules.

## CIS AlmaLinux OS 9 Benchmark 2.0.0 Level 1 + Level 2 - Server

### Rules

|Rule|Parameters|Default values|Remediation|
|---|---|---|---|
|1.1.1.1 Ensure cramfs kernel module is not available|None|-|Yes|
|1.1.1.2 Ensure freevxfs kernel module is not available|None|-|Yes|
|1.1.1.3 Ensure hfs kernel module is not available|None|-|Yes|
|1.1.1.4 Ensure hfsplus kernel module is not available|None|-|Yes|
|1.1.1.5 Ensure jffs2 kernel module is not available|None|-|Yes|
|1.1.1.6 Ensure squashfs kernel module is not available|None|-|Yes|
|1.1.1.7 Ensure udf kernel module is not available|None|-|Yes|
|1.1.1.8 Ensure usb-storage kernel module is not available|None|-|Yes|
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
|1.3.1.1 Ensure SELinux is installed|None|-|No|
|1.3.1.2 Ensure SELinux is not disabled in bootloader configuration|None|-|No|
|1.3.1.3 Ensure SELinux policy is configured|None|-|No|
|1.3.1.4 Ensure the SELinux mode is not disabled|None|-|No|
|1.3.1.5 Ensure the SELinux mode is enforcing|None|-|No|
|1.3.1.6 Ensure no unconfined services exist|None|-|No|
|1.3.1.7 Ensure the MCS Translation Service (mcstrans) is not installed|None|-|No|
|1.3.1.8 Ensure SETroubleshoot is not installed|None|-|No|
|1.4.1 Ensure bootloader password is set|None|-|No|
|1.4.2 Ensure access to bootloader config is configured|None|-|No|
|1.5.1 Ensure address space layout randomization is enabled|None|-|No|
|1.5.2 Ensure ptrace\_scope is restricted|None|-|No|
|1.5.3 Ensure core dump backtraces are disabled|`processSizeMaxRegex`|`0`|No|
|1.5.4 Ensure core dump storage is disabled|`storageRegex`|`none`|No|
|1.6.1 Ensure system wide crypto policy is not set to legacy|None|-|No|
|1.6.2 Ensure system wide crypto policy is not set in sshd configuration|None|-|No|
|1.6.3 Ensure system wide crypto policy disables sha1 hash and signature support|None|-|No|
|1.6.4 Ensure system wide crypto policy disables macs less than 128 bits|None|-|No|
|1.6.5 Ensure system wide crypto policy disables cbc for ssh|None|-|No|
|1.6.6 Ensure system wide crypto policy disables chacha20-poly1305 for ssh|None|-|No|
|1.6.7 Ensure system wide crypto policy disables EtM for ssh|None|-|No|
|1.7.1 Ensure message of the day is configured properly|None|-|No|
|1.7.2 Ensure local login warning banner is configured properly|None|-|No|
|1.7.3 Ensure remote login warning banner is configured properly|None|-|No|
|1.7.4 Ensure access to /etc/motd is configured|None|-|Yes|
|1.7.5 Ensure access to /etc/issue is configured|`filename`<br>`mask`<br>`owner`<br>`group`|`/etc/issue`<br>`0133`<br>`root`<br>`root`|Yes|
|1.7.6 Ensure access to /etc/issue.net is configured|None|-|Yes|
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
|2.1.7 Ensure ftp server services are not in use|`serviceName`<br>`expectedUnitFileState`<br>`expectedActiveState`<br>`packageName`|`vsftpd.service`<br>`enabled`<br>`active`<br>`vsftpd`|No|
|2.1.8 Ensure message access server services are not in use|`unitNameDovecotService`<br>`expectedUnitFileState`<br>`expectedActiveState`<br>`unitNameDovecotSocket`<br>`packageNameDovecot`<br>`unitNameCyrusImapdService`<br>`packageNameCyrusImapd`|`dovecot.service`<br>`enabled`<br>`active`<br>`dovecot.socket`<br>`dovecot`<br>`cyrus-imapd.service`<br>`cyrus-imapd`|No|
|2.1.9 Ensure network file system services are not in use|`unitName`<br>`expectedUnitFileState`<br>`expectedActiveState`<br>`packageName`|`nfs-server.service`<br>`enabled`<br>`active`<br>`nfs-utils`|No|
|2.1.10 Ensure nis server services are not in use|`unitName`<br>`expectedUnitFileState`<br>`expectedActiveState`<br>`packageName`|`ypserv.service`<br>`enabled`<br>`active`<br>`ypserv`|No|
|2.1.11 Ensure print server services are not in use|`unitNameCupsService`<br>`expectedUnitFileState`<br>`expectedActiveState`<br>`unitNameCupsSocket`<br>`packageName`|`cups.service`<br>`enabled`<br>`active`<br>`cups.socket`<br>`cups`|No|
|2.1.12 Ensure rpcbind services are not in use|`unitNameRpcbindService`<br>`expectedUnitFileState`<br>`expectedActiveState`<br>`unitNameRpcbindSocket`<br>`packageName`|`rpcbind.service`<br>`enabled`<br>`active`<br>`rpcbind.socket`<br>`rpcbind`|No|
|2.1.13 Ensure rsync services are not in use|`unitNameRsyncdService`<br>`expectedUnitFileState`<br>`expectedActiveState`<br>`unitNameRsyncdSocket`<br>`packageName`|`rsyncd.service`<br>`enabled`<br>`active`<br>`rsyncd.socket`<br>`rsync-daemon`|No|
|2.1.14 Ensure snmp services are not in use|`unitName`<br>`expectedUnitFileState`<br>`expectedActiveState`<br>`packageName`|`snmpd.service`<br>`enabled`<br>`active`<br>`net-snmp`|No|
|2.1.15 Ensure telnet server services are not in use|`unitName`<br>`expectedUnitFileState`<br>`expectedActiveState`<br>`packageName`|`telnet.socket`<br>`enabled`<br>`active`<br>`telnet-server`|No|
|2.1.16 Ensure tftp server services are not in use|`unitNameTftpService`<br>`expectedUnitFileState`<br>`expectedActiveState`<br>`unitNameTftpSocket`<br>`packageName`|`tftp.service`<br>`enabled`<br>`active`<br>`tftp.socket`<br>`tftp-server`|No|
|2.1.17 Ensure web proxy server services are not in use|`unitName`<br>`expectedUnitFileState`<br>`expectedActiveState`<br>`packageName`|`squid.service`<br>`enabled`<br>`active`<br>`squid`|No|
|2.1.18 Ensure web server services are not in use|`unitNameHttpdService`<br>`expectedUnitFileState`<br>`expectedActiveState`<br>`unitNameHttpdSocket`<br>`packageNameHttpd`<br>`unitNameNginxService`<br>`packageNameNginx`|`httpd.service`<br>`enabled`<br>`active`<br>`httpd.socket`<br>`httpd`<br>`nginx.service`<br>`nginx`|No|
|2.1.19 Ensure xinetd services are not in use|`unitName`<br>`expectedUnitFileState`<br>`expectedActiveState`<br>`packageName`|`xinetd.service`<br>`enabled`<br>`active`<br>`xinetd`|No|
|2.1.20 Ensure X window server services are not in use|None|-|No|
|2.1.21 Ensure mail transfer agents are configured for local-only mode|None|-|No|
|2.1.22 Ensure only approved services are listening on a network interface|None|-|No|
|2.2.1 Ensure ftp client is not installed|None|-|No|
|2.2.2 Ensure ldap client is not installed|None|-|No|
|2.2.3 Ensure nis client is not installed|None|-|No|
|2.2.4 Ensure telnet client is not installed|`packageName`|`telnet`|No|
|2.2.5 Ensure tftp client is not installed|None|-|No|
|2.3.1 Ensure time synchronization is in use|`packageName`|`chrony`|No|
|2.3.2 Ensure chrony is configured|None|-|No|
|2.3.3 Ensure chrony is not run as the root user|None|-|No|
|2.4.1.1 Ensure cron daemon is enabled and active|None|-|No|
|2.4.1.2 Ensure permissions on /etc/crontab are configured|`mask`<br>`owner`<br>`group`|`0177`<br>`root`<br>`root`|Yes|
|2.4.1.3 Ensure permissions on /etc/cron.hourly are configured|`mask`<br>`owner`<br>`group`|`0077`<br>`root`<br>`root`|Yes|
|2.4.1.4 Ensure permissions on /etc/cron.daily are configured|`mask`<br>`owner`<br>`group`<br>`packageName`<br>`alternativePackageName`|`0077`<br>`root`<br>`root`<br>`cron`<br>`cronie`|Yes|
|2.4.1.5 Ensure permissions on /etc/cron.weekly are configured|`mask`<br>`owner`<br>`group`|`0077`<br>`root`<br>`root`|Yes|
|2.4.1.6 Ensure permissions on /etc/cron.monthly are configured|`mask`<br>`owner`<br>`group`<br>`alternativePackageName`|`0077`<br>`root`<br>`root`<br>`cronie`|Yes|
|2.4.1.7 Ensure permissions on /etc/cron.d are configured|`mask`<br>`owner`<br>`group`|`0077`<br>`root`<br>`root`|Yes|
|2.4.1.8 Ensure crontab is restricted to authorized users|`filenameEtcCronDeny`<br>`mask`<br>`owner`<br>`group`<br>`filenameEtcCronAllow`|`/etc/cron.deny`<br>`0137`<br>`root`<br>`root`<br>`/etc/cron.allow`|Yes|
|2.4.2.1 Ensure at is restricted to authorized users|`mask`<br>`owner`<br>`group`|`0137`<br>`root`<br>`root\|daemon`|Yes|
|3.1.1 Ensure IPv6 status is identified|None|-|No|
|3.1.2 Ensure wireless interfaces are disabled|None|-|No|
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
|4.1.1 Ensure nftables is installed|None|-|No|
|4.1.2 Ensure a single firewall configuration utility is in use|None|-|No|
|4.2.1 Ensure firewalld drops unnecessary services and ports|None|-|No|
|4.2.2 Ensure firewalld loopback traffic is configured|None|-|No|
|4.3.1 Ensure nftables base chains exist|None|-|No|
|4.3.2 Ensure nftables established connections are configured|None|-|No|
|4.3.3 Ensure nftables default deny firewall policy|None|-|No|
|4.3.4 Ensure nftables loopback traffic is configured|None|-|No|
|5.1.1 Ensure permissions on /etc/ssh/sshd\_config are configured|`mask`<br>`owner`<br>`group`|`0177`<br>`root`<br>`root`|Yes|
|5.1.2 Ensure permissions on SSH private host key files are configured|None|-|No|
|5.1.3 Ensure permissions on SSH public host key files are configured|None|-|No|
|5.1.4 Ensure sshd Ciphers are configured|`ciphersDisallowedValues`|`3des-cbc,aes128-cbc,aes192-cbc,aes256-cbc,arcfour,arcfour128,arcfour256,blowfish-cbc,cast128-cbc,rijndael-cbc@lysator\.liu\.se`|No|
|5.1.5 Ensure sshd KexAlgorithms is configured|`kexalgorithmsDisallowedValues`|`diffie-hellman-group1-sha1,diffie-hellman-group14-sha1,diffie-hellman-group-exchange-sha1`|No|
|5.1.6 Ensure sshd MACs are configured|`macsDisallowedValues`|`hmac-md5,hmac-md5-96,hmac-ripemd160,hmac-sha1-96,umac-64@openssh\.com,hmac-md5-etm@openssh\.com,hmac-md5-96-etm@openssh\.com,hmac-ripemd160-etm@openssh\.com,hmac-sha1-96-etm@openssh\.com,umac-64-etm@openssh\.com,umac-128-etm@openssh\.com`|No|
|5.1.7 Ensure sshd access is configured|`allowUsersValuePattern`<br>`allowGroupsValuePattern`<br>`denyUsersValuePattern`<br>`denyGroupsValuePattern`|`[^ \t]+`<br>`[^ \t]+`<br>`[^ \t]+`<br>`[^ \t]+`|No|
|5.1.8 Ensure sshd Banner is configured|`bannerValue`|`\/[^ \t]+`|No|
|5.1.9 Ensure sshd ClientAliveInterval and ClientAliveCountMax are configured|`clientalivecountmaxValue`<br>`clientaliveintervalValue`|`[1-9][0-9]*m?`<br>`[1-9][0-9]*m?`|No|
|5.1.10 Ensure sshd DisableForwarding is enabled|None|-|No|
|5.1.11 Ensure sshd GSSAPIAuthentication is disabled|None|-|No|
|5.1.12 Ensure sshd HostbasedAuthentication is disabled|None|-|No|
|5.1.13 Ensure sshd IgnoreRhosts is enabled|None|-|No|
|5.1.14 Ensure sshd LoginGraceTime is configured|`logingracetimeValue`|`^(\b([1-9]\|[1-5][0-9]\|60)\b)$`|No|
|5.1.15 Ensure sshd LogLevel is configured|`loglevelValue`|`(VERBOSE\|INFO)\b`|No|
|5.1.16 Ensure sshd MaxAuthTries is configured|`maxauthtriesValue`|`^([0-4]\b)$`|No|
|5.1.17 Ensure sshd MaxStartups is configured|`maxstartupsValue`|`^((10\|[1-9])[^ \t](30\|[1-2][0-9]\|[1-9])[^ \t](60\|[1-5][0-9]\|[1-9])\b)$`|No|
|5.1.18 Ensure sshd MaxSessions is configured|`maxsessionsValue`|`([1-9]\|10)\b`|No|
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
|5.3.1.2 Ensure latest version of authselect is installed|None|-|No|
|5.3.1.3 Ensure latest version of libpwquality is installed|None|-|No|
|5.3.2.1 Ensure active authselect profile includes pam modules|None|-|No|
|5.3.2.2 Ensure pam\_faillock module is enabled|None|-|No|
|5.3.2.3 Ensure pam\_pwquality module is enabled|None|-|No|
|5.3.2.4 Ensure pam\_pwhistory module is enabled|None|-|No|
|5.3.2.5 Ensure pam\_unix module is enabled|None|-|No|
|5.3.3.1.1 Ensure password failed attempts lockout is configured|None|-|No|
|5.3.3.1.2 Ensure password unlock time is configured|None|-|No|
|5.3.3.1.3 Ensure password failed attempts lockout includes root account|None|-|No|
|5.3.3.2.1 Ensure password number of changed characters is configured|None|-|No|
|5.3.3.2.2 Ensure password length is configured|None|-|No|
|5.3.3.2.3 Ensure password complexity is configured|None|-|No|
|5.3.3.2.4 Ensure password same consecutive characters is configured|None|-|No|
|5.3.3.2.5 Ensure password maximum sequential characters is configured|None|-|No|
|5.3.3.2.6 Ensure password dictionary check is enabled|None|-|No|
|5.3.3.2.7 Ensure password quality is enforced for the root user|None|-|No|
|5.3.3.3.1 Ensure password history remember is configured|None|-|No|
|5.3.3.3.2 Ensure password history is enforced for the root user|None|-|No|
|5.3.3.3.3 Ensure pam\_pwhistory includes use\_authtok|None|-|No|
|5.3.3.4.1 Ensure pam\_unix does not include nullok|None|-|No|
|5.3.3.4.2 Ensure pam\_unix does not include remember|None|-|No|
|5.3.3.4.3 Ensure pam\_unix includes a strong password hashing algorithm|None|-|No|
|5.3.3.4.4 Ensure pam\_unix includes use\_authtok|None|-|No|
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
|6.2.3.1 Ensure rsyslog is installed|None|-|No|
|6.2.3.2 Ensure rsyslog service is enabled and active|None|-|No|
|6.2.3.3 Ensure journald is configured to send logs to rsyslog|`forwardToSyslogRegex`|`yes`|No|
|6.2.3.4 Ensure rsyslog log file creation mode is configured|None|-|No|
|6.2.3.5 Ensure rsyslog logging is configured|None|-|No|
|6.2.3.6 Ensure rsyslog is configured to send logs to a remote log host|None|-|No|
|6.2.3.7 Ensure rsyslog is not configured to receive logs from a remote client|None|-|No|
|6.2.3.8 Ensure rsyslog logrotate is configured|None|-|No|
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
|7.1.1 Ensure permissions on /etc/passwd are configured|`mask`<br>`owner`<br>`group`|`0133`<br>`root`<br>`root`|Yes|
|7.1.2 Ensure permissions on /etc/passwd- are configured|`mask`<br>`owner`<br>`group`|`0133`<br>`root`<br>`root`|Yes|
|7.1.3 Ensure permissions on /etc/group are configured|`mask`<br>`owner`<br>`group`|`0133`<br>`root`<br>`root`|Yes|
|7.1.4 Ensure permissions on /etc/group- are configured|`mask`<br>`owner`<br>`group`|`0133`<br>`root`<br>`root`|Yes|
|7.1.5 Ensure permissions on /etc/shadow are configured|`mask`<br>`owner`<br>`group`|`0777`<br>`root`<br>`root`|Yes|
|7.1.6 Ensure permissions on /etc/shadow- are configured|`mask`<br>`owner`<br>`group`|`0777`<br>`root`<br>`root`|Yes|
|7.1.7 Ensure permissions on /etc/gshadow are configured|`mask`<br>`owner`<br>`group`|`0777`<br>`root`<br>`root`|Yes|
|7.1.8 Ensure permissions on /etc/gshadow- are configured|`mask`<br>`owner`<br>`group`|`0777`<br>`root`<br>`root`|Yes|
|7.1.9 Ensure permissions on /etc/shells are configured|`mask`<br>`owner`<br>`group`|`0133`<br>`root`<br>`root`|Yes|
|7.1.10 Ensure permissions on /etc/security/opasswd are configured|`mask`<br>`owner`<br>`group`|`0177`<br>`root`<br>`root`|Yes|
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

- 6.1.3 Ensure cryptographic mechanisms are used to protect the integrity of audit tools
