---
title: Azure Kubernetes Service (AKS) Ubuntu image alignment with Center for Internet Security (CIS) benchmark
description: Learn how AKS applies the CIS benchmark to Ubuntu image used by Azure Kubernetes Service.
ms.topic: article
ms.date: 09/27/2023
ms.reviewer: mattmcinnes
---

# Azure Kubernetes Service (AKS) Ubuntu image alignment with Center for Internet Security (CIS) benchmark

As a secure service, Azure Kubernetes Service (AKS) complies with SOC, ISO, PCI DSS, and HIPAA standards. This article covers the security OS configuration applied to Ubuntu image used by AKS. This security configuration is based on the Azure Linux security baseline, which aligns with CIS benchmark. For more information about AKS security, see Security concepts for applications and clusters in Azure Kubernetes Service (AKS). For more information about AKS security, see [Security concepts for applications and clusters in Azure Kubernetes Service (AKS)][security-concepts-aks-apps-clusters]. For more information on the CIS benchmark, see [Center for Internet Security (CIS) Benchmarks][cis-benchmarks]. For more information on the Azure security baselines for Linux, see [Linux security baseline][linux-security-baseline].

## Ubuntu LTS 18.04

AKS clusters are deployed on host virtual machines, which run an operating system with built-in secure configurations. This operating system is used for containers running on AKS. This host operating system is based on an **Ubuntu 18.04.LTS** image with security configurations applied. 

As a part of the security-optimized operating system:

* AKS provides a security-optimized host OS by default, but no option to select an alternate operating system.
* The security-optimized host OS is built and maintained specifically for AKS and is **not** supported outside of the AKS platform.
* Some unnecessary kernel module drivers have been disabled in the OS to reduce the attack surface area.

> [!NOTE]
> Unrelated to the CIS benchmarks, Azure applies daily patches, including security patches, to AKS virtual machine hosts.

The goal of the secure configuration built into the host OS is to reduce the surface area of attack and optimize for the deployment of containers in a secure manner.

The following are the results from the [CIS Ubuntu 18.04 LTS Benchmark v2.1.0][cis-benchmark-ubuntu] recommendations.

Recommendations can have one of the following reasons:

* *Potential Operation Impact* - Recommendation wasn't applied because it would have a negative effect on the service.
* *Covered Elsewhere* - Recommendation is covered by another control in Azure cloud compute.

The following are CIS rules implemented:

| CIS paragraph number | Recommendation description|Status| Reason |
|---|---|---|---|
| 1 | Initial Setup |||
| 1.1 | Filesystem Configuration |||
| 1.1.1 | Disable unused filesystems |||
| 1.1.1.1 | Ensure mounting of cramfs filesystems is disabled | Pass ||
| 1.1.1.2 | Ensure mounting of freevxfs filesystems is disabled | Pass ||
| 1.1.1.3 | Ensure mounting of jffs2 filesystems is disabled | Pass ||
| 1.1.1.4 | Ensure mounting of hfs filesystems is disabled | Pass ||
| 1.1.1.5 | Ensure mounting of hfsplus filesystems is disabled | Pass ||
| 1.1.1.6 | Ensure mounting of udf filesystems is disabled | Fail | Potential Operational Impact |
| 1.1.2 | Ensure /tmp is configured | Fail |  |
| 1.1.3 | Ensure nodev option set on /tmp partition | Fail ||
| 1.1.4 | Ensure nosuid option set on /tmp partition | Pass ||
| 1.1.5 | Ensure noexec option set on /tmp partition | Pass ||
| 1.1.6 | Ensure /dev/shm is configured | Pass ||
| 1.1.7 | Ensure nodev option set on /dev/shm partition | Pass ||
| 1.1.8 | Ensure nosuid option set on /dev/shm partition | Pass ||
| 1.1.9 | Ensure noexec option set on /dev/shm partition | Fail | Potential Operational Impact |
| 1.1.12 | Ensure /var/tmp partition includes the nodev option | Pass ||
| 1.1.13 | Ensure /var/tmp partition includes the nosuid option | Pass ||
| 1.1.14 | Ensure /var/tmp partition includes the noexec option | Pass ||
| 1.1.18 | Ensure /home partition includes the nodev option | Pass ||
| 1.1.19 | Ensure nodev option set on removable media partitions | Not Applicable ||
| 1.1.20 | Ensure nosuid option set on removable media partitions | Not Applicable ||
| 1.1.21 | Ensure noexec option set on removable media partitions | Not Applicable ||
| 1.1.22 | Ensure sticky bit is set on all world-writable directories | Fail | Potential Operation Impact |
| 1.1.23 | Disable Automounting | Pass ||
| 1.1.24 | Disable USB Storage | Pass ||
| 1.2 | Configure Software Updates |||
| 1.2.1 | Ensure package manager repositories are configured | Pass | Covered Elsewhere |
| 1.2.2 | Ensure GPG keys are configured | Not Applicable ||
| 1.3 | Filesystem Integrity Checking |||
| 1.3.1 | Ensure AIDE is installed | Fail | Covered Elsewhere |
| 1.3.2 | Ensure filesystem integrity is regularly checked | Fail | Covered Elsewhere |
| 1.4 | Secure Boot Settings |||
| 1.4.1 | Ensure permissions on bootloader config aren't overridden | Fail |  |
| 1.4.2 | Ensure bootloader password is set | Fail | Not Applicable|
| 1.4.3 | Ensure permissions on bootloader config are configured | Fail |  |
| 1.4.4 | Ensure authentication required for single user mode | Fail | Not Applicable |
| 1.5 | Additional Process Hardening |||
| 1.5.1 | Ensure XD/NX support is enabled | Not Applicable ||
| 1.5.2 | Ensure address space layout randomization (ASLR) is enabled | Pass ||
| 1.5.3 | Ensure prelink is disabled | Pass ||
| 1.5.4 | Ensure core dumps are restricted | Pass ||
| 1.6 | Mandatory Access Control |||
| 1.6.1 | Configure AppArmor |||
| 1.6.1.1 | Ensure AppArmor is installed | Pass ||
| 1.6.1.2 | Ensure AppArmor is enabled in the bootloader configuration | Fail | Potential Operation Impact |
| 1.6.1.3 | Ensure all AppArmor Profiles are in enforce or complain mode | Pass ||
| 1.7 | Command Line Warning Banners |||
| 1.7.1 | Ensure message of the day is configured properly | Pass ||
| 1.7.2 | Ensure permissions on /etc/issue.net are configured | Pass ||
| 1.7.3 | Ensure permissions on /etc/issue are configured | Pass ||
| 1.7.4 | Ensure permissions on /etc/motd are configured | Pass ||
| 1.7.5 | Ensure remote login warning banner is configured properly | Pass ||
| 1.7.6 | Ensure local login warning banner is configured properly | Pass ||
| 1.8 | GNOME Display Manager |||
| 1.8.2 | Ensure GDM login banner is configured | Pass ||
| 1.8.3 | Ensure disable-user-list is enabled | Pass ||
| 1.8.4 | Ensure XDCMP isn't enabled | Pass ||
| 1.9 | Ensure updates, patches, and additional security software are installed | Pass ||
| 2 | Services |||
| 2.1 | Special Purpose Services |||
| 2.1.1 | Time Synchronization |||
| 2.1.1.1 | Ensure time synchronization is in use | Pass ||
| 2.1.1.2 | Ensure systemd-timesyncd is configured | Not Applicable | AKS uses ntpd for timesync |
| 2.1.1.3 | Ensure chrony is configured | Fail | Covered Elsewhere |
| 2.1.1.4 | Ensure ntp is configured | Pass ||
| 2.1.2 | Ensure X Window System isn't installed | Pass ||
| 2.1.3 | Ensure Avahi Server isn't installed | Pass ||
| 2.1.4 | Ensure CUPS isn't installed | Pass ||
| 2.1.5 | Ensure DHCP Server isn't installed | Pass ||
| 2.1.6 | Ensure LDAP server isn't installed | Pass ||
| 2.1.7 | Ensure NFS isn't installed | Pass ||
| 2.1.8 | Ensure DNS Server isn't installed | Pass ||
| 2.1.9 | Ensure FTP Server isn't installed | Pass ||
| 2.1.10 | Ensure HTTP server isn't installed | Pass ||
| 2.1.11 | Ensure IMAP and POP3 server aren't installed | Pass ||
| 2.1.12 | Ensure Samba isn't installed | Pass ||
| 2.1.13 | Ensure HTTP Proxy Server isn't installed | Pass ||
| 2.1.14 | Ensure SNMP Server isn't installed | Pass ||
| 2.1.15 | Ensure mail transfer agent is configured for local-only mode | Pass ||
| 2.1.16 | Ensure rsync service isn't installed | Fail |  |
| 2.1.17 | Ensure NIS Server isn't installed | Pass ||
| 2.2 | Service Clients |||
| 2.2.1 | Ensure NIS Client isn't installed | Pass ||
| 2.2.2 | Ensure rsh client isn't installed | Pass ||
| 2.2.3 | Ensure talk client isn't installed | Pass ||
| 2.2.4 | Ensure telnet client isn't installed | Fail |  |
| 2.2.5 | Ensure LDAP client isn't installed | Pass ||
| 2.2.6 | Ensure  RPC isn't installed | Fail | Potential Operational Impact |
| 2.3 | Ensure nonessential services are removed or masked | Pass |  |
| 3 | Network Configuration |||
| 3.1 | Disable unused network protocols and devices |||
| 3.1.2 | Ensure wireless interfaces are disabled | Pass ||
| 3.2 | Network Parameters (Host Only) |||
| 3.2.1 | Ensure packet redirect sending is disabled | Pass ||
| 3.2.2 | Ensure IP forwarding is disabled | Fail | Not Applicable |
| 3.3 | Network Parameters (Host and Router) |||
| 3.3.1 | Ensure source routed packets aren't accepted | Pass ||
| 3.3.2 | Ensure ICMP redirects aren't accepted | Pass ||
| 3.3.3 | Ensure secure ICMP redirects aren't accepted | Pass ||
| 3.3.4 | Ensure suspicious packets are logged | Pass ||
| 3.3.5 | Ensure broadcast ICMP requests are ignored | Pass ||
| 3.3.6 | Ensure bogus ICMP responses are ignored | Pass ||
| 3.3.7 | Ensure Reverse Path Filtering is enabled | Pass ||
| 3.3.8 | Ensure TCP SYN Cookies is enabled | Pass ||
| 3.3.9 | Ensure IPv6 router advertisements aren't accepted | Pass ||
| 3.4 | Uncommon Network Protocols |||
| 3.5 | Firewall Configuration |||
| 3.5.1 | Configure UncomplicatedFirewall |||
| 3.5.1.1 | Ensure ufw is installed | Pass ||
| 3.5.1.2 | Ensure iptables-persistent is not installed with ufw | Pass ||
| 3.5.1.3 | Ensure ufw service is enabled | Fail | Covered Elsewhere |
| 3.5.1.4 | Ensure ufw loopback traffic is configured | Fail | Covered Elsewhere |
| 3.5.1.5 | Ensure ufw outbound connections are configured | Not Applicable | Covered Elsewhere |
| 3.5.1.6 | Ensure ufw firewall rules exist for all open ports | Not Applicable | Covered Elsewhere |
| 3.5.1.7 | Ensure ufw default deny firewall policy | Fail | Covered Elsewhere |
| 3.5.2 | Configure nftables |||
| 3.5.2.1 | Ensure nftables is installed | Fail | Covered Elsewhere |
| 3.5.2.2 | Ensure ufw is uninstalled or disabled with nftables | Fail | Covered Elsewhere |
| 3.5.2.3 | Ensure iptables are flushed with nftables | Not Applicable | Covered Elsewhere |
| 3.5.2.4 | Ensure a nftables table exists | Fail | Covered Elsewhere |
| 3.5.2.5 | Ensure nftables base chains exist | Fail | Covered Elsewhere |
| 3.5.2.6 | Ensure nftables loopback traffic is configured | Fail | Covered Elsewhere |
| 3.5.2.7 | Ensure nftables outbound and established connections are configured | Not Applicable | Covered Elsewhere |
| 3.5.2.8 | Ensure nftables default deny firewall policy | Fail | Covered Elsewhere |
| 3.5.2.9 | Ensure nftables service is enabled | Fail | Covered Elsewhere |
| 3.5.2.10 | Ensure nftables rules are permanent | Fail | Covered Elsewhere |
| 3.5.3| Configure iptables |||
| 3.5.3.1 | Configure iptables software |||
| 3.5.3.1.1 | Ensure iptables packages are installed | Fail | Covered Elsewhere |
| 3.5.3.1.2 | Ensure nftables is not installed with iptables | Pass ||
| 3.5.3.1.3 | Ensure ufw is uninstalled or disabled with iptables | Fail | Covered Elsewhere |
| 3.5.3.2 | Configure IPv4 iptables |||
| 3.5.3.2.1 | Ensure iptables default deny firewall policy | Fail | Covered Elsewhere |
| 3.5.3.2.2 | Ensure iptables loopback traffic is configured | Fail | Not Applicable |
| 3.5.3.2.3 | Ensure iptables outbound and established connections are configured | Not Applicable ||
| 3.5.3.2.4 | Ensure iptables firewall rules exist for all open ports | Fail | Potential Operation Impact |
| 3.5.3.3 | Configure IPv6  ip6tables |||
| 3.5.3.3.1 | Ensure ip6tables default deny firewall policy | Fail | Covered Elsewhere |
| 3.5.3.3.2 | Ensure ip6tables loopback traffic is configured | Fail | Covered Elsewhere |
| 3.5.3.3.3 | Ensure ip6tables outbound and established connections are configured | Not Applicable | Covered Elsewhere |
| 3.5.3.3.4 | Ensure ip6tables firewall rules exist for all open ports | Fail | Covered Elsewhere |
| 4 | Logging and Auditing |||
| 4.1 | Configure System Accounting (auditd) |||
| 4.1.1.2 | Ensure auditing is enabled |||
| 4.1.2 | Configure Data Retention |||
| 4.2 | Configure Logging |||
| 4.2.1 | Configure rsyslog |||
| 4.2.1.1 | Ensure rsyslog is installed | Pass ||
| 4.2.1.2 | Ensure rsyslog Service is enabled | Pass ||
| 4.2.1.3 | Ensure logging is configured | Pass ||
| 4.2.1.4 | Ensure rsyslog default file permissions configured | Pass ||
| 4.2.1.5 | Ensure rsyslog is configured to send logs to a remote log host | Fail | Covered Elsewhere |
| 4.2.1.6 | Ensure remote rsyslog messages are only accepted on designated log hosts. | Not Applicable ||
| 4.2.2 | Configure journald |||
| 4.2.2.1 | Ensure journald is configured to send logs to rsyslog | Pass ||
| 4.2.2.2 | Ensure journald is configured to compress large log files | Fail ||
| 4.2.2.3 | Ensure journald is configured to write logfiles to persistent disk | Pass ||
| 4.2.3 | Ensure permissions on all logfiles are configured | Fail ||
| 4.3 | Ensure logrotate is configured | Pass ||
| 4.4 | Ensure logrotate assigns appropriate permissions | Fail ||
| 5 | Access, Authentication, and Authorization |||
| 5.1 | Configure time-based job schedulers |||
| 5.1.1 | Ensure cron daemon is enabled and running | Pass ||
| 5.1.2 | Ensure permissions on /etc/crontab are configured | Pass ||
| 5.1.3 | Ensure permissions on /etc/cron.hourly are configured | Pass ||
| 5.1.4 | Ensure permissions on /etc/cron.daily are configured | Pass ||
| 5.1.5 | Ensure permissions on /etc/cron.weekly are configured | Pass ||
| 5.1.6 | Ensure permissions on /etc/cron.monthly are configured | Pass ||
| 5.1.7 | Ensure permissions on /etc/cron.d are configured | Pass ||
| 5.1.8 | Ensure cron is restricted to authorized users | Fail ||
| 5.1.9 | Ensure at is restricted to authorized users | Fail ||
| 5.2 | Configure sudo |||
| 5.2.1 | Ensure sudo is installed | Pass ||
| 5.2.2 | Ensure sudo commands use pty | Fail | Potential Operational Impact |
| 5.2.3 | Ensure sudo log file exists | Fail ||
| 5.3 | Configure SSH Server |||
| 5.3.1 | Ensure permissions on /etc/ssh/sshd_config are configured | Pass ||
| 5.3.2 | Ensure permissions on SSH private host key files are configured | Pass ||
| 5.3.3 | Ensure permissions on SSH public host key files are configured | Pass ||
| 5.3.4 | Ensure SSH access is limited | Pass ||
| 5.3.5 | Ensure SSH LogLevel is appropriate | Pass ||
| 5.3.7 | Ensure SSH MaxAuthTries is set to 4 or less | Pass ||
| 5.3.8 | Ensure SSH IgnoreRhosts is enabled | Pass ||
| 5.3.9 | Ensure SSH HostbasedAuthentication is disabled | Pass ||
| 5.3.10 | Ensure SSH root login is disabled | Pass ||
| 5.3.11 | Ensure SSH PermitEmptyPasswords is disabled | Pass ||
| 5.3.12 | Ensure SSH PermitUserEnvironment is disabled | Pass ||
| 5.3.13 | Ensure only strong Ciphers are used | Pass ||
| 5.3.14 | Ensure only strong MAC algorithms are used | Pass ||
| 5.3.15 | Ensure only strong Key Exchange algorithms are used | Pass ||
| 5.3.16 | Ensure SSH Idle Timeout Interval is configured | Fail ||
| 5.3.17 | Ensure SSH LoginGraceTime is set to one minute or less | Pass ||
| 5.3.18 | Ensure SSH warning banner is configured | Pass ||
| 5.3.19 | Ensure SSH PAM is enabled | Pass ||
| 5.3.21 | Ensure SSH MaxStartups is configured | Fail ||
| 5.3.22 | Ensure SSH MaxSessions is limited | Pass ||
| 5.4 | Configure PAM |||
| 5.4.1 | Ensure password creation requirements are configured | Pass ||
| 5.4.2 | Ensure lockout for failed password attempts is configured | Fail ||
| 5.4.3 | Ensure password reuse is limited | Fail ||
| 5.4.4 | Ensure password hashing algorithm is SHA-512 | Pass ||
| 5.5 | User Accounts and Environment |||
| 5.5.1 | Set Shadow Password Suite Parameters |||
| 5.5.1.1 | Ensure minimum days between password changes is  configured | Pass ||
| 5.5.1.2 | Ensure password expiration is 365 days or less | Pass ||
| 5.5.1.3 | Ensure password expiration warning days is 7 or more | Pass ||
| 5.5.1.4 | Ensure inactive password lock is 30 days or less | Pass ||
| 5.5.1.5 | Ensure all users last password change date is in the past | Fail |  |
| 5.5.2 | Ensure system accounts are secured | Pass ||
| 5.5.3 | Ensure default group for the root account is GID 0 | Pass ||
| 5.5.4 | Ensure default user umask is 027 or more restrictive | Pass ||
| 5.5.5 | Ensure default user shell timeout is 900 seconds or less | Fail |  |
| 5.6 | Ensure root login is restricted to system console | Not Applicable | |
| 5.7 | Ensure access to the su command is restricted | Fail | Potential Operation Impact |
| 6 | System Maintenance |||
| 6.1 | System File Permissions |||
| 6.1.2 | Ensure permissions on /etc/passwd are configured | Pass ||
| 6.1.3 | Ensure permissions on /etc/passwd- are configured | Pass ||
| 6.1.4 | Ensure permissions on /etc/group are configured | Pass ||
| 6.1.5 | Ensure permissions on /etc/group- are configured | Pass ||
| 6.1.6 | Ensure permissions on /etc/shadow are configured | Pass ||
| 6.1.7 | Ensure permissions on /etc/shadow- are configured | Pass ||
| 6.1.8 | Ensure permissions on /etc/gshadow are configured | Pass ||
| 6.1.9 | Ensure permissions on /etc/gshadow- are configured | Pass ||
| 6.1.10 | Ensure no world writable files exist | Fail | Potential Operation Impact |
| 6.1.11 | Ensure no unowned files or directories exist | Fail |  Potential Operation Impact |
| 6.1.12 | Ensure no ungrouped files or directories exist | Fail |  Potential Operation Impact |
| 6.1.13 | Audit SUID executables | Not Applicable ||
| 6.1.14 | Audit SGID executables | Not Applicable ||
| 6.2 | User and Group Settings |||
| 6.2.1 | Ensure accounts in /etc/passwd use shadowed passwords | Pass ||
| 6.2.2 | Ensure password fields aren't empty | Pass ||
| 6.2.3 | Ensure all groups in /etc/passwd exist in /etc/group | Pass ||
| 6.2.4 | Ensure all users' home directories exist | Pass ||
| 6.2.5 | Ensure users own their home directories | Pass ||
| 6.2.6 | Ensure users' home directories permissions are 750 or more restrictive | Pass ||
| 6.2.7 | Ensure users' dot files aren't group or world writable | Pass ||
| 6.2.8 | Ensure no users have .netrc files | Pass ||
| 6.2.9 | Ensure no users have .forward files | Pass ||
| 6.2.10 | Ensure no users have .rhosts files | Pass ||
| 6.2.11 | Ensure root is the only UID 0 account | Pass ||
| 6.2.12 | Ensure root PATH Integrity | Pass ||
| 6.2.13 | Ensure no duplicate UIDs exist | Pass ||
| 6.2.14 | Ensure no duplicate GIDs exist | Pass ||
| 6.2.15 | Ensure no duplicate user names exist | Pass ||
| 6.2.16 | Ensure no duplicate group names exist | Pass ||
| 6.2.17 | Ensure shadow group is empty | Pass ||

## Next steps  

For more information about AKS security, see the following articles:

* [Azure Kubernetes Service (AKS)](./intro-kubernetes.md)
* [AKS security considerations](./concepts-security.md)
* [AKS best practices](./best-practices.md)

<!-- EXTERNAL LINKS -->
[cis-benchmark-ubuntu]: https://www.cisecurity.org/benchmark/ubuntu/

<!-- INTERNAL LINKS -->
[cis-benchmarks]: /compliance/regulatory/offering-CIS-Benchmark
[linux-security-baseline]: ../governance/policy/samples/guest-configuration-baseline-linux.md
[security-concepts-aks-apps-clusters]: concepts-security.md