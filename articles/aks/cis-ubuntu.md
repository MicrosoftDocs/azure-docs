---
title: Center for Internet Security (CIS) benchmark
description: Learn how AKS applies the CIS benchmark
services: container-service
ms.topic: article
ms.date: 03/23/2022
---

# Center for Internet Security (CIS) benchmark

As a secure service, Azure Kubernetes Service (AKS) complies with SOC, ISO, PCI DSS, and HIPAA standards. This article covers the security hardening applied to AKS based on the CIS benchmark. For more information about AKS security, see [Security concepts for applications and clusters in Azure Kubernetes Service (AKS)](./concepts-security.md). For more information on the CIS benchmark, see [Center for Internet Security (CIS) Benchmarks][cis-benchmarks].

## Ubuntu CIS baseline

AKS clusters are deployed on host virtual machines, which run a security-optimized operating system. This operating system is used for containers running on AKS. This host operating system is based on an **Ubuntu 18.04.LTS** image with more security hardening and optimizations applied. In addition to **Ubuntu 18.04.LTS**, the CIS rules also apply to **Ubuntu 20.04.LTS**.

As a part of the security-optimized operating system:

* AKS provides a security-optimized host OS by default, but no option to select an alternate operating system.
* Azure applies daily patches (including security patches) to AKS virtual machine hosts.
    * Some of these patches require a reboot, while others will not.
    * You're responsible for scheduling AKS VM host reboots as needed.
    * For guidance on how to automate AKS patching, see [patching AKS nodes](./node-updates-kured.md).

The goal of the security hardened host OS is to reduce the surface area of attack and optimize for the deployment of containers in a secure manner.

The following are the results from the [CIS Ubuntu 18.04 LTS Benchmark v2.1.0][cis-benchmark-ubuntu] recommendations.

*Scored* recommendations affect the benchmark score if they are not applied, while *Not Scored* recommendations don't.

CIS benchmarks provide two levels of security settings:

* *L1*, or Level 1, recommends essential basic security requirements that can be configured on any system and should cause little or no interruption of service or reduced functionality.
* *L2*, or Level 2, recommends security settings for environments requiring greater security that could result in some reduced functionality.

Recommendations can have one of the following statuses:

* *Pass* - The recommendation has been applied.
* *Fail* - The recommendation has not been applied.
* *N/A* - The recommendation relates to manifest file permission requirements that are not relevant to AKS. Kubernetes clusters by default use a manifest model to deploy the control plane pods, which rely on files from the node VM. The CIS Kubernetes benchmark recommends these files must have certain permission requirements. AKS clusters use a Helm chart to deploy control plane pods and don't rely on files in the node VM.
* *Depends on Environment* - The recommendation is applied in the user's specific environment and is not controlled by AKS. *Scored* recommendations affect the benchmark score whether the recommendation applies to the user's specific environment or not.
* *Equivalent Control* - The recommendation has been implemented in a different, equivalent manner.

The following are CIS rules implemented:

| CIS paragraph number | Recommendation description| Manual or Automated| Level |Scoring Type|Status|
|---|---|---|---|---|
| 1 | Initial Setup ||||| 
| 1.1 | Filesystem Configuration ||||| 
| 1.1.1 | Disable unused filesystems ||||| 
| 1.1.1.1 | Ensure mounting of cramfs filesystems is disabled | Automated | L1 | | |
| 1.1.1.2 | Ensure mounting of freevxfs filesystems is disabled | Automated | L1 | | |
| 1.1.1.3 | Ensure mounting of jffs2 filesystems is disabled | Automated | L1 | | |
| 1.1.1.4 | Ensure mounting of hfs filesystems is disabled | Automated | L1 | | |
| 1.1.1.5 | Ensure mounting of hfsplus filesystems is disabled | Automated | L1 | | |
| 1.1.1.6 | Ensure mounting of udf filesystems is disabled | Automated | L1 | | |
| 1.1.2 | Ensure /tmp is configured | Automated | L1 | | |
| 1.1.3 | Ensure nodev option set on /tmp partition | Automated | L1 | | |
| 1.1.4 | Ensure nosuid option set on /tmp partition | Automated | L1 | | |
| 1.1.5 | Ensure noexec option set on /tmp partition | Automated | L1 | | |
| 1.1.6 | Ensure /dev/shm is configured | Automated | L1 | | |
| 1.1.7 | Ensure nodev option set on /dev/shm partition | Automated | L1 | | |
| 1.1.8 | Ensure nosuid option set on /dev/shm partition | Automated | L1 | | |
| 1.1.9 | Ensure noexec option set on /dev/shm partition | Automated | L1 | | |
| 1.1.12 | Ensure /var/tmp partition includes the nodev option | Automated | L1 | | |
| 1.1.13 | Ensure /var/tmp partition includes the nosuid option | Automated | L1 | | |
| 1.1.14 | Ensure /var/tmp partition includes the noexec option | Automated | L1 | | |
| 1.1.18 | Ensure /home partition includes the nodev option | Automated | L1 | | |
| 1.1.19 | Ensure nodev option set on removable media partitions | Manual | L1 | | |
| 1.1.20 | Ensure nosuid option set on removable media partitions | Manual | L1 | | |
| 1.1.21 | Ensure noexec option set on removable media partitions | Manual | L1 | | |
| 1.1.22 | Ensure sticky bit is set on all world-writable directories | Automated | L1 | | |
| 1.1.23 | Disable Automounting | Automated | L1 | | |
| 1.1.24 | Disable USB Storage | Automated | L1 | | |
| 1.2 | Configure Software Updates ||||| 
| 1.2.1 | Ensure package manager repositories are configured | Manual | L1 | | |
| 1.2.2 | Ensure GPG keys are configured | Manual | L1 | | |
| 1.3 | Filesystem Integrity Checking ||||| 
| 1.3.1 | Ensure AIDE is installed | Automated | L1 | | |
| 1.3.2 | Ensure filesystem integrity is regularly checked | Automated | L1 | | |
| 1.4 | Secure Boot Settings ||||| 
| 1.4.1 | Ensure permissions on bootloader config are not overridden | Automated | L1 | | |
| 1.4.2 | Ensure bootloader password is set | Automated | L1 | | |
| 1.4.3 | Ensure permissions on bootloader config are configured | Automated | L1 | | |
| 1.4.4 | Ensure authentication required for single user mode | Automated | L1 | | |
| 1.5 | Additional Process Hardening |||||
| 1.5.1 | Ensure XD/NX support is enabled | Manual | L1 | | |
| 1.5.2 | Ensure address space layout randomization (ASLR) is enabled | Automated | L1 | | |
| 1.5.3 | Ensure prelink is disabled | Automated | L1 | | |
| 1.5.4 | Ensure core dumps are restricted | Automated | L1 | | |
| 1.6 | Mandatory Access Control ||||| 
| 1.6.1 | Configure AppArmor ||||| 
| 1.6.1.1 | Ensure AppArmor is installed | Automated | L1 | | |
| 1.6.1.2 | Ensure AppArmor is enabled in the bootloader configuration | Automated | L1 | | |
| 1.6.1.3 | Ensure all AppArmor Profiles are in enforce or complain mode | Automated | L1 | | |
| 1.7 | Command Line Warning Banners |||||
| 1.7.1 | Ensure message of the day is configured properly | Automated | L1 | | |
| 1.7.2 | Ensure permissions on /etc/issue.net are configured | Automated | L1 | | |
| 1.7.3 | Ensure permissions on /etc/issue are configured | Automated | L1 | | |
| 1.7.4 | Ensure permissions on /etc/motd are configured | Automated | L1 | | |
| 1.7.5 | Ensure remote login warning banner is configured properly | Automated | L1 | | |
| 1.7.6 | Ensure local login warning banner is configured properly | Automated | L1 | | |
| 1.8 | GNOME Display Manager ||||| 
| 1.8.2 | Ensure GDM login banner is configured | Automated | L1 | | |
| 1.8.3 | Ensure disable-user-list is enabled | Automated | L1 | | |
| 1.8.4 | Ensure XDCMP is not enabled | Automated | L1 | | |
| 1.9 | Ensure updates, patches, and additional security software are installed | Manual | L1 | | |
| 2 | Services ||||| 
| 2.1 | Special Purpose Services ||||| 
| 2.1.1 | Time Synchronization ||||| 
| 2.1.1.1 | Ensure time synchronization is in use | Automated | L1 | | |
| 2.1.1.2 | Ensure systemd-timesyncd is configured | Manual | L1 | | |
| 2.1.1.3 | Ensure chrony is configured | Automated | L1 | | |
| 2.1.1.4 | Ensure ntp is configured | Automated | L1 | | |
| 2.1.2 | Ensure X Window System is not installed | Automated | L1 | | |
| 2.1.3 | Ensure Avahi Server is not installed | Automated | L1 | | |
| 2.1.4 | Ensure CUPS is not installed | Automated | L1 | | |
| 2.1.5 | Ensure DHCP Server is not installed | Automated | L1 | | |
| 2.1.6 | Ensure LDAP server is not installed | Automated | L1 | | |
| 2.1.7 | Ensure NFS is not installed | Automated | L1 | | |
| 2.1.8 | Ensure DNS Server is not installed | Automated | L1 | | |
| 2.1.9 | Ensure FTP Server is not installed | Automated | L1 | | |
| 2.1.10 | Ensure HTTP server is not installed | Automated | L1 | | |
| 2.1.11 | Ensure IMAP and POP3 server are not installed | Automated | L1 | | |
| 2.1.12 | Ensure Samba is not installed | Automated | L1 | | |
| 2.1.13 | Ensure HTTP Proxy Server is not installed | Automated | L1 | | |
| 2.1.14 | Ensure SNMP Server is not installed | Automated | L1 | | |
| 2.1.15 | Ensure mail transfer agent is configured for local-only mode | Automated | L1 | | |
| 2.1.16 | Ensure rsync service is not installed | Automated | L1 | | |
| 2.1.17 | Ensure NIS Server is not installed | Automated | L1 | | |
| 2.2 | Service Clients |||||
| 2.2.1 | Ensure NIS Client is not installed | Automated | L1 | | |
| 2.2.2 | Ensure rsh client is not installed | Automated | L1 | | |
| 2.2.3 | Ensure talk client is not installed | Automated | L1 | | |
| 2.2.4 | Ensure telnet client is not installed | Automated | L1 | | |
| 2.2.5 | Ensure LDAP client is not installed | Automated | L1 | | |
| 2.2.6 | Ensure  RPC is not installed | Automated | L1 | | |
| 2.3 | Ensure nonessential services are removed or masked | Manual | L1 | | |
| 3 | Network Configuration ||||| 
| 3.1 | Disable unused network protocols and devices |||||
| 3.1.2 | Ensure wireless interfaces are disabled | Automated | L1 | | |
| 3.2 | Network Parameters (Host Only) |||||
| 3.2.1 | Ensure packet redirect sending is disabled | Automated | L1 | | |
| 3.2.2 | Ensure IP forwarding is disabled | Automated | L1 | | |
| 3.3 | Network Parameters (Host and Router) |||||
| 3.3.1 | Ensure source routed packets are not accepted | Automated | L1 | | |
| 3.3.2 | Ensure ICMP redirects are not accepted | Automated | L1 | | |
| 3.3.3 | Ensure secure ICMP redirects are not accepted | Automated | L1 | | |
| 3.3.4 | Ensure suspicious packets are logged | Automated | L1 | | |
| 3.3.5 | Ensure broadcast ICMP requests are ignored | Automated | L1 | | |
| 3.3.6 | Ensure bogus ICMP responses are ignored | Automated | L1 | | |
| 3.3.7 | Ensure Reverse Path Filtering is enabled | Automated | L1 | | |
| 3.3.8 | Ensure TCP SYN Cookies is enabled | Automated | L1 | | |
| 3.3.9 | Ensure IPv6 router advertisements are not accepted | Automated | L1 | | |
| 3.4 | Uncommon Network Protocols |||||
| 3.5 | Firewall Configuration |||||
| 3.5.1 | Configure UncomplicatedFirewall |||||
| 3.5.1.1 | Ensure ufw is installed | Automated | L1 | | |
| 3.5.1.2 | Ensure iptables-persistent is not installed with ufw | Automated | L1 | | |
| 3.5.1.3 | Ensure ufw service is enabled | Automated | L1 | | |
| 3.5.1.4 | Ensure ufw loopback traffic is configured | Automated | L1 | | |
| 3.5.1.5 | Ensure ufw outbound connections are configured | Manual | L1 | | |
| 3.5.1.6 | Ensure ufw firewall rules exist for all open ports | Manual | L1 | | |
| 3.5.1.7 | Ensure ufw default deny firewall policy | Automated | L1 | | |
| 3.5.2 | Configure nftables |||||
| 3.5.2.1 | Ensure nftables is installed | Automated | L1 | | |
| 3.5.2.2 | Ensure ufw is uninstalled or disabled with nftables | Automated | L1 | | |
| 3.5.2.3 | Ensure iptables are flushed with nftables | Manual | L1 | | |
| 3.5.2.4 | Ensure a nftables table exists | Automated | L1 | | |
| 3.5.2.5 | Ensure nftables base chains exist | Automated | L1 | | |
| 3.5.2.6 | Ensure nftables loopback traffic is configured | Automated | L1 | | |
| 3.5.2.7 | Ensure nftables outbound and established connections are configured | Manual | L1 | | |
| 3.5.2.8 | Ensure nftables default deny firewall policy | Automated | L1 | | |
| 3.5.2.9 | Ensure nftables service is enabled | Automated | L1 | | |
| 3.5.2.10 | Ensure nftables rules are permanent | Automated | L1 | | |
| 3.5.3| Configure iptables |||||
| 3.5.3.1 | Configure iptables software ||||| 
| 3.5.3.1.1 | Ensure iptables packages are installed | Automated | L1 | | |
| 3.5.3.1.2 | Ensure nftables is not installed with iptables | Automated | L1 | | |
| 3.5.3.1.3 | Ensure ufw is uninstalled or disabled with iptables | Automated | L1 | | |
| 3.5.3.2 | Configure IPv4 iptables |||||
| 3.5.3.2.1 | Ensure iptables default deny firewall policy | Automated | L1 | | |
| 3.5.3.2.2 | Ensure iptables loopback traffic is configured | Automated | L1 | | |
| 3.5.3.2.3 | Ensure iptables outbound and established connections are configured | Manual | L1 | | |
| 3.5.3.2.4 | Ensure iptables firewall rules exist for all open ports | Automated | L1 | | |
| 3.5.3.3 | Configure IPv6  ip6tables |||||
| 3.5.3.3.1 | Ensure ip6tables default deny firewall policy | Automated | L1 | | |
| 3.5.3.3.2 | Ensure ip6tables loopback traffic is configured | Automated | L1 | | |
| 3.5.3.3.3 | Ensure ip6tables outbound and established connections are configured | Manual | L1 | | |
| 3.5.3.3.4 | Ensure ip6tables firewall rules exist for all open ports | Automated | L1 | | |
| 4 | Logging and Auditing |||||
| 4.1 | Configure System Accounting (auditd) |||||
| 4.1.1.2 | Ensure auditing is enabled |||||
| 4.1.2 | Configure Data Retention |||||
| 4.2 | Configure Logging |||||
| 4.2.1 | Configure rsyslog |||||
| 4.2.1.1 | Ensure rsyslog is installed | Automated | L1 | | |
| 4.2.1.2 | Ensure rsyslog Service is enabled | Automated | L1 | | |
| 4.2.1.3 | Ensure logging is configured | Manual | L1 | | |
| 4.2.1.4 | Ensure rsyslog default file permissions configured | Automated | L1 | | |
| 4.2.1.5 | Ensure rsyslog is configured to send logs to a remote log host | Automated | L1 | | |
| 4.2.1.6 | Ensure remote rsyslog messages are only accepted on designated log hosts. | Manual | L1 | | |
| 4.2.2 | Configure journald |||||
| 4.2.2.1 | Ensure journald is configured to send logs to rsyslog | Automated | L1 | | |
| 4.2.2.2 | Ensure journald is configured to compress large log files | Automated | L1 | | |
| 4.2.2.3 | Ensure journald is configured to write logfiles to persistent disk | Automated | L1 | | |
| 4.2.3 | Ensure permissions on all logfiles are configured | Automated | L1 | | |
| 4.3 | Ensure logrotate is configured | Manual | L1 | | |
| 4.4 | Ensure logrotate assigns appropriate permissions | Automated | L1 | | |
| 5 | Access, Authentication, and Authorization ||||| 
| 5.1 | Configure time-based job schedulers |||||
| 5.1.1 | Ensure cron daemon is enabled and running | Automated | L1 | | |
| 5.1.2 | Ensure permissions on /etc/crontab are configured | Automated | L1 | | |
| 5.1.3 | Ensure permissions on /etc/cron.hourly are configured | Automated | L1 | | |
| 5.1.4 | Ensure permissions on /etc/cron.daily are configured | Automated | L1 | | |
| 5.1.5 | Ensure permissions on /etc/cron.weekly are configured | Automated | L1 | | |
| 5.1.6 | Ensure permissions on /etc/cron.monthly are configured | Automated | L1 | | |
| 5.1.7 | Ensure permissions on /etc/cron.d are configured | Automated | L1 | | |
| 5.1.8 | Ensure cron is restricted to authorized users | Automated | L1 | | |
| 5.1.9 | Ensure at is restricted to authorized users | Automated | L1 | | |
| 5.2 | Configure sudo |||||
| 5.2.1 | Ensure sudo is installed | Automated | L1 | | |
| 5.2.2 | Ensure sudo commands use pty | Automated | L1 | | |
| 5.2.3 | Ensure sudo log file exists | Automated | L1 | | |
| 5.3 | Configure SSH Server |||||
| 5.3.1 | Ensure permissions on /etc/ssh/sshd_config are configured | Automated | L1 | | |
| 5.3.2 | Ensure permissions on SSH private host key files are configured | Automated | L1 | | |
| 5.3.3 | Ensure permissions on SSH public host key files are configured | Automated | L1 | | |
| 5.3.4 | Ensure SSH access is limited | Automated | L1 | | |
| 5.3.5 | Ensure SSH LogLevel is appropriate | Automated | L1 | | |
| 5.3.7 | Ensure SSH MaxAuthTries is set to 4 or less | Automated | L1 | | |
| 5.3.8 | Ensure SSH IgnoreRhosts is enabled | Automated | L1 | | |
| 5.3.9 | Ensure SSH HostbasedAuthentication is disabled | Automated | L1 | | |
| 5.3.10 | Ensure SSH root login is disabled | Automated | L1 | | |
| 5.3.11 | Ensure SSH PermitEmptyPasswords is disabled | Automated | L1 | | |
| 5.3.12 | Ensure SSH PermitUserEnvironment is disabled | Automated | L1 | | |
| 5.3.13 | Ensure only strong Ciphers are used | Automated | L1 | | |
| 5.3.14 | Ensure only strong MAC algorithms are used | Automated | L1 | | |
| 5.3.15 | Ensure only strong Key Exchange algorithms are used | Automated | L1 | | |
| 5.3.16 | Ensure SSH Idle Timeout Interval is configured | Automated | L1 | | |
| 5.3.17 | Ensure SSH LoginGraceTime is set to one minute or less | Automated | L1 | | |
| 5.3.18 | Ensure SSH warning banner is configured | Automated | L1 | | |
| 5.3.19 | Ensure SSH PAM is enabled | Automated | L1 | | |
| 5.3.21 | Ensure SSH MaxStartups is configured | Automated | L1 | | |
| 5.3.22 | Ensure SSH MaxSessions is limited | Automated | L1 | | |
| 5.4 | Configure PAM |||||
| 5.4.1 | Ensure password creation requirements are configured | Automated | L1 | | |
| 5.4.2 | Ensure lockout for failed password attempts is configured | Automated | L1 | | |
| 5.4.3 | Ensure password reuse is limited | Automated | L1 | | |
| 5.4.4 | Ensure password hashing algorithm is SHA-512 | Automated | L1 | | |
| 5.5 | User Accounts and Environment |||||
| 5.5.1 | Set Shadow Password Suite Parameters |||||
| 5.5.1.1 | Ensure minimum days between password changes is  configured | Automated | L1 | | |
| 5.5.1.2 | Ensure password expiration is 365 days or less | Automated | L1 | | |
| 5.5.1.3 | Ensure password expiration warning days is 7 or more | Automated | L1 | | |
| 5.5.1.4 | Ensure inactive password lock is 30 days or less | Automated | L1 | | |
| 5.5.1.5 | Ensure all users last password change date is in the past | Automated | L1 | | |
| 5.5.2 | Ensure system accounts are secured | Automated | L1 | | |
| 5.5.3 | Ensure default group for the root account is GID 0 | Automated | L1 | | |
| 5.5.4 | Ensure default user umask is 027 or more restrictive | Automated | L1 | | |
| 5.5.5 | Ensure default user shell timeout is 900 seconds or less | Automated | L1 | | |
| 5.6 | Ensure root login is restricted to system console | Manual | L1 | | |
| 5.7 | Ensure access to the su command is restricted | Automated | L1 | | |
| 6 | System Maintenance |||||
| 6.1 | System File Permissions |||||
| 6.1.2 | Ensure permissions on /etc/passwd are configured | Automated | L1 | | |
| 6.1.3 | Ensure permissions on /etc/passwd- are configured | Automated | L1 | | |
| 6.1.4 | Ensure permissions on /etc/group are configured | Automated | L1 | | |
| 6.1.5 | Ensure permissions on /etc/group- are configured | Automated | L1 | | |
| 6.1.6 | Ensure permissions on /etc/shadow are configured | Automated | L1 | | |
| 6.1.7 | Ensure permissions on /etc/shadow- are configured | Automated | L1 | | |
| 6.1.8 | Ensure permissions on /etc/gshadow are configured | Automated | L1 | | |
| 6.1.9 | Ensure permissions on /etc/gshadow- are configured | Automated | L1 | | |
| 6.1.10 | Ensure no world writable files exist | Automated | L1 | | |
| 6.1.11 | Ensure no unowned files or directories exist | Automated | L1 | | |
| 6.1.12 | Ensure no ungrouped files or directories exist | Automated | L1 | | |
| 6.1.13 | Audit SUID executables | Manual | L1 | | |
| 6.1.14 | Audit SGID executables | Manual | L1 | | |
| 6.2 | User and Group Settings |||||
| 6.2.1 | Ensure accounts in /etc/passwd use shadowed passwords | Automated | L1 | | |
| 6.2.2 | Ensure password fields are not empty | Automated | L1 | | |
| 6.2.3 | Ensure all groups in /etc/passwd exist in /etc/group | Automated | L1 | | |
| 6.2.4 | Ensure all users' home directories exist | Automated | L1 | | |
| 6.2.5 | Ensure users own their home directories | Automated | L1 | | |
| 6.2.6 | Ensure users' home directories permissions are 750 or more restrictive | Automated | L1 | | |
| 6.2.7 | Ensure users' dot files are not group or world writable | Automated | L1 | | |
| 6.2.8 | Ensure no users have .netrc files | Automated | L1 | | |
| 6.2.9 | Ensure no users have .forward files | Automated | L1 | | |
| 6.2.10 | Ensure no users have .rhosts files | Automated | L1 | | |
| 6.2.11 | Ensure root is the only UID 0 account | Automated | L1 | | |
| 6.2.12 | Ensure root PATH Integrity | Automated | L1 | | |
| 6.2.13 | Ensure no duplicate UIDs exist | Automated | L1 | | |
| 6.2.14 | Ensure no duplicate GIDs exist | Automated | L1 | | |
| 6.2.15 | Ensure no duplicate user names exist | Automated | L1 | | |
| 6.2.16 | Ensure no duplicate group names exist | Automated | L1 | | |
| 6.2.17 | Ensure shadow group is empty | Automated | L1 | | |

## Additional notes

* The security hardened OS is built and maintained specifically for AKS and is **not** supported outside of the AKS platform.
* To further reduce the attack surface area, some unnecessary kernel module drivers have been disabled in the OS.

## Next steps  

For more information about AKS security, see the following articles:

* [Azure Kubernetes Service (AKS)](./intro-kubernetes.md)
* [AKS security considerations](./concepts-security.md)
* [AKS best practices](./best-practices.md)


[azure-update-management]: ../automation/update-management/overview.md
[azure-file-integrity-monotoring]: ../security-center/security-center-file-integrity-monitoring.md
[azure-time-sync]: ../virtual-machines/linux/time-sync.md
[auzre-log-analytics-agent-overview]: ../azure-monitor/platform/log-analytics-agent.md
[cis-benchmarks]: /compliance/regulatory/offering-CIS-Benchmark
[cis-benchmark-aks]: https://www.cisecurity.org/benchmark/kubernetes/
[cis-benchmark-ubuntu]: https://www.cisecurity.org/benchmark/ubuntu/