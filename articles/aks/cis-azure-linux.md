---
title: Center for Internet Security (CIS) Azure Linux benchmark
description: Learn how AKS applies the CIS benchmark with an Azure Linux image
author: htaubenfeld
ms.author: htaubenfeld
ms.service: microsoft-linux
ms.topic: article
ms.date: 07/06/2023
---

# Center for Internet Security (CIS) Azure Linux benchmark

Azure Kubernetes Service (AKS) and the Microsoft Azure Linux image alignment with Center for Internet Security (CIS) benchmark

The security OS configuration applied to the Azure Linux Container Host for AKS image is based on the Azure Linux security baseline, which aligns with the CIS benchmark. As a secure service, AKS complies with SOC, ISO, PCI DSS, and HIPAA standards. For more information about the Azure Linux Container Host security, see [Security concepts for clusters in AKS][security-concepts-aks]. To learn more about the CIS benchmark, see [Center for Internet Security (CIS) Benchmarks][cis-benchmarks]. For more information on the Azure security baselines for Linux, see [Linux security baseline][linux-security-baseline].

## Azure Linux 2.0

This Azure Linux Container Host operating system is based on the **Azure Linux 2.0** image with built-in security configurations applied.

As part of the security-optimized operating system:

* AKS and Azure Linux provide a security-optimized host OS by default with no option to select an alternate operating system.
* The security-optimized host OS is built and maintained specifically for AKS and is **not** supported outside of the AKS platform.
* Unnecessary kernel module drivers have been disabled in the OS to reduce the attack surface.

## Recommendations

The below table has four sections:

* **CIS ID:** The associated rule ID with each of the baseline rules.
* **Recommendation description:** A description of the recommendation issued by the CIS benchmark.
* **Level:** L1, or Level 1, recommends essential basic security requirements that can be configured on any system and should cause little or no interruption of service or reduced functionality.
* **Status:**
    * *Pass* - The recommendation has been applied.
    * *Fail* - The recommendation hasn't been applied.
    * *N/A* - The recommendation relates to manifest file permission requirements that are not relevant to AKS.
    * *Depends on Environment* - The recommendation is applied in the user's specific environment and isn't controlled by AKS.
    * *Equivalent Control* - The recommendation has been implemented in a different equivalent manner.
* **Reason:**
    * *Potential Operation Impact* - The recommendation wasn't applied because it would have a negative effect on the service.
    * *Covered Elsewhere* - The recommendation is covered by another control in Azure cloud compute.

The following are the results from the [CIS Azure Linux 2.0 Benchmark v1.0][cis-benchmark-azure-linux] recommendations based on the CIS rules:

| CIS ID | Recommendation description | Status | Reason |
|---|---|---|---|
|1.1.4| Disable Automounting|Pass||
|1.1.1.1|Ensure mounting of cramfs filesystems is disabled|Pass||
|1.1.2.1|Ensure /tmp is a separate partition|Pass||
|1.1.2.2|Ensure nodev option set on /tmp partition|Pass||
|1.1.2.3|Ensure nosuid option set on /tmp partition|Pass||
|1.1.8.1|Ensure nodev option set on /dev/shm partition|Pass||
|1.1.8.2|Ensure nosuid option set on /dev/shm partition|Pass||
|1.2.1|Ensure DNF gpgcheck is globally activated|Pass||
|1.2.2|Ensure TDNF gpgcheck is globally activated|Pass||
|1.5.1|Ensure core dump storage is disabled|Pass||
|1.5.2|Ensure core dump backtraces are disabled|Pass||
|1.5.3|Ensure address space layout randomization (ASLR) is enabled|Pass||
|1.7.1|Ensure local login warning banner is configured properly|Pass||
|1.7.2|Ensure remote login warning banner is configured properly|Pass||
|1.7.3|Ensure permissions on /etc/motd are configured|Pass||
|1.7.4|Ensure permissions on /etc/issue are configured|Pass||
|1.7.5|Ensure permissions on /etc/issue.net are configured|Pass||
|2.1.1|Ensure time synchronization is in use|Pass||
|2.1.2|Ensure chrony is configured|Pass||
|2.2.1|Ensure xinetd is not installed|Pass||
|2.2.2|Ensure xorg-x11-server-common is not installed|Pass||
|2.2.3|Ensure avahi is not installed|Pass||
|2.2.4|Ensure a print server is not installed|Pass||
|2.2.5|Ensure a dhcp server is not installed|Pass||
|2.2.6|Ensure a dns server is not installed|Pass||
|2.2.7|Ensure FTP client is not installed|Pass||
|2.2.8|Ensure an ftp server is not installed|Pass||
|2.2.9|Ensure a tftp server is not installed|Pass||
|2.2.10|Ensure a web server is not installed|Pass||
|2.2.11|Ensure IMAP and POP3 server is not installed|Pass||
|2.2.12|Ensure Samba is not installed|Pass||
|2.2.13|Ensure HTTP Proxy Server is not installed|Pass||
|2.2.14|Ensure net-snmp is not installed or the snmpd service is not enabled|Pass||
|2.2.15|Ensure NIS server is not installed|Pass||
|2.2.16|Ensure telnet-server is not installed|Pass||
|2.2.17|Ensure mail transfer agent is configured for local-only mode|Pass||
|2.2.18|Ensure nfs-utils is not installed or the  nfs-server service is masked|Pass||
|2.2.19|Ensure rsync-daemon is not installed or the rsyncd service is masked|Pass||
|2.3.1|Ensure NIS Client is not installed|Pass||
|2.3.2|Ensure rsh client is not installed|Pass||
|2.3.3|Ensure talk client is not installed|Pass||
|2.3.4|Ensure telnet client is not installed|Pass||
|2.3.5|Ensure LDAP client is not installed|Pass||
|2.3.6|Ensure TFTP client is not installed|Pass||
|3.1.1|Ensure IPv6 is enabled|Pass||
|3.2.1|Ensure packet redirect sending is disabled|Pass||
|3.3.1|Ensure source routed packets are not accepted|Pass||
|3.3.2|Ensure ICMP redirects are not accepted|Pass||
|3.3.3|Ensure secure ICMP redirects are not accepted|Pass||
|3.3.4|Ensure suspicious packets are logged|Pass||
|3.3.5|Ensure broadcast ICMP requests are ignored|Pass||
|3.3.6|Ensure bogus ICMP responses are ignored|Pass||
|3.3.7|Ensure Reverse Path Filtering is enabled|Pass||
|3.3.8|Ensure TCP SYN Cookies is enabled|Pass||
|3.3.9|Ensure IPv6 router advertisements are not accepted|Pass||
|3.4.3.1.1|Ensure iptables package is installed|Pass||
|3.4.3.1.2|Ensure nftables is not installed with iptables|Pass||
|3.4.3.1.3|Ensure firewalld is either not installed or masked with iptables|Pass||
|4.2|Ensure logrotate is configured|Pass||
|4.2.2|Ensure all logfiles have appropriate access configured|Pass||
|4.2.1.1|Ensure rsyslog is installed|Pass||
|4.2.1.2|Ensure rsyslog service is enabled|Pass||
|4.2.1.3|Ensure rsyslog default file permissions are configured|Pass||
|4.2.1.4|Ensure logging is configured|Pass||
|4.2.1.5|Ensure rsyslog is not configured to receive logs from a remote client|Pass||
|5.1.1|Ensure cron daemon is enabled|Pass||
|5.1.2|Ensure permissions on /etc/crontab are configured|Pass||
|5.1.3|Ensure permissions on /etc/cron.hourly are configured|Pass||
|5.1.4|Ensure permissions on /etc/cron.daily are configured|Pass||
|5.1.5|Ensure permissions on /etc/cron.weekly are configured|Pass||
|5.1.6|Ensure permissions on /etc/cron.monthly are configured|Pass||
|5.1.7|Ensure permissions on /etc/cron.d are configured|Pass||
|5.1.8|Ensure cron is restricted to authorized users|Pass||
|5.1.9|Ensure at is restricted to authorized users|Pass||
|5.2.1|Ensure permissions on /etc/ssh/sshd_config are configured|Pass||
|5.2.2|Ensure permissions on SSH private host key files are configured|Pass||
|5.2.3|Ensure permissions on SSH public host key files are configured|Pass||
|5.2.4|Ensure SSH access is limited|Pass||
|5.2.5|Ensure SSH LogLevel is appropriate|Pass||
|5.2.6|Ensure SSH PAM is enabled|Pass||
|5.2.7|Ensure SSH root login is disabled|Pass||
|5.2.8|Ensure SSH HostbasedAuthentication is disabled|Pass||
|5.2.9|Ensure SSH PermitEmptyPasswords is disabled|Pass||
|5.2.10|Ensure SSH PermitUserEnvironment is disabled|Pass||
|5.2.11|Ensure SSH IgnoreRhosts is enabled|Pass||
|5.2.12|Ensure only strong Ciphers are used|Pass||
|5.2.13|Ensure only strong MAC algorithms are used|Pass||
|5.2.14|Ensure only strong Key Exchange algorithms are used|Pass||
|5.2.15|Ensure SSH warning banner is configured|Pass||
|5.2.16|Ensure SSH MaxAuthTries is set to 4 or less|Pass||
|5.2.17|Ensure SSH MaxStartups is configured|Pass||
|5.2.18|Ensure SSH LoginGraceTime is set to one minute or less|Pass||
|5.2.19|Ensure SSH MaxSessions is set to 10 or less|Pass||
|5.2.20|Ensure SSH Idle Timeout Interval is configured|Pass||
|5.3.1|Ensure sudo is installed|Pass||
|5.3.2|Ensure re-authentication for privilege escalation is not disabled globally|Pass||
|5.3.3|Ensure sudo authentication timeout is configured correctly|Pass||
|5.4.1|Ensure password creation requirements are configured|Pass||
|5.4.2|Ensure lockout for failed password attempts is configured|Pass||
|5.4.3|Ensure password hashing algorithm is SHA-512|Pass||
|5.4.4|Ensure password reuse is limited|Pass||
|5.5.2|Ensure system accounts are secured|Pass||
|5.5.3|Ensure default group for the root account is GID 0|Pass||
|5.5.4|Ensure default user umask is 027 or more restrictive|Pass||
|5.5.1.1|Ensure password expiration is 365 days or less|Pass||
|5.5.1.2|Ensure minimum days between password changes is configured|Pass||
|5.5.1.3|Ensure password expiration warning days is 7 or more|Pass||
|5.5.1.4|Ensure inactive password lock is 30 days or less|Pass||
|5.5.1.5|Ensure all users last password change date is in the past|Pass||
|6.1.1|Ensure permissions on /etc/passwd are configured|Pass||
|6.1.2|Ensure permissions on /etc/passwd- are configured|Pass||
|6.1.3|Ensure permissions on /etc/group are configured|Pass||
|6.1.4|Ensure permissions on /etc/group- are configured|Pass||
|6.1.5|Ensure permissions on /etc/shadow are configured|Pass||
|6.1.6|Ensure permissions on /etc/shadow- are configured|Pass||
|6.1.7|Ensure permissions on /etc/gshadow are configured|Pass||
|6.1.8|Ensure permissions on /etc/gshadow- are configured|Pass||
|6.1.9|Ensure no unowned or ungrouped files or directories exist|Pass||
|6.1.10|Ensure world writable files and directories are secured|Pass||
|6.2.1|Ensure password fields are not empty|Pass||
|6.2.2|Ensure all groups in /etc/passwd exist in /etc/group|Pass||
|6.2.3|Ensure no duplicate UIDs exist|Pass||
|6.2.4|Ensure no duplicate GIDs exist|Pass||
|6.2.5|Ensure no duplicate user names exist|Pass||
|6.2.6|Ensure no duplicate group names exist|Pass||
|6.2.7|Ensure root PATH Integrity|Pass||
|6.2.8|Ensure root is the only UID 0 account|Pass||
|6.2.9|Ensure all users' home directories exist|Pass||
|6.2.10|Ensure users' own their home directories|Pass||
|6.2.11|Ensure users' home directories permissions are 750 or more restrictive|Pass||
|6.2.12|Ensure users' dot files are not group or world writable|Pass||
|6.2.13|Ensure users' .netrc Files are not group or world accessible|Pass||
|6.2.14|Ensure no users have .forward files|Pass||
|6.2.15|Ensure no users have .netrc files|Pass||
|6.2.16|Ensure no users have .rhosts files|Pass||

## Next steps

For more information about Azure Linux Container Host security, see the following articles:

* [Azure Linux Container Host for AKS][linux-container-host-aks]
* [Security concepts for clusters in AKS][security-concepts-aks]

<!-- LINKS - external -->

<!-- LINKS - internal -->
[security-concepts-aks]: concepts-security.md
[cis-benchmarks]: /compliance/regulatory/offering-CIS-Benchmark
[cis-benchmark-azure-linux]: https://www.cisecurity.org/benchmark/azure_linux
[linux-security-baseline]: ../governance/policy/samples/guest-configuration-baseline-linux.md
[linux-container-host-aks]: ../azure-linux/intro-azure-linux.md
