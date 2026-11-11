---
title: Reference - DISA STIG benchmarks for Ubuntu via Machine Configuration
description: Reference - DISA STIG benchmarks for Ubuntu via Machine Configuration
ms.date: 11/04/2026
author: pallakatos
ms.author: pallakatos
ms.topic: reference
ms.custom: generated
---

# DISA STIG benchmarks for Ubuntu

This article provides detailed information about the DISA STIG benchmarks for Ubuntu, including supported benchmarks, mismatched rules, remediation support, and configurable parameters across all supported versions.

DISA STIG baselines are in **[Public Preview]**.

## Supported benchmarks

|Ubuntu Version|Benchmark Title|
|---|---|
|Ubuntu 22.04 LTS|[DISA STIG Ubuntu 22.04 LTS V2R5](#disa-stig-ubuntu-2204-lts-v2r5)|
|Ubuntu 24.04 LTS|[DISA STIG Ubuntu 24.04 LTS V1R3](#disa-stig-ubuntu-2404-lts-v1r3)|

> [!NOTE]
> Auto-remediation is in **[Public Preview]**.
> Remediation must be enabled separately and is available only for rules marked **Yes** in the **Remediation** column. It uses configured parameter values, or the defaults shown when no overrides are provided. Other rules remain audit-only. Review and test changes before enabling remediation broadly.

Supported parameters and remediations will expand over time. To request additional support, [open an issue in the kompli repository](https://github.com/microsoft/kompli/issues).

## DISA STIG Ubuntu 22.04 LTS V2R5

### Rules

|Rule|Parameters|Default values|Remediation|
|---|---|---|---|
|SV-260469 Ubuntu 22.04 LTS must disable the x86 Ctrl-Alt-Delete key sequence.|None|-|No|
|SV-260470 Ubuntu 22.04 LTS, when booted, must require authentication upon booting into single-user and maintenance modes.|None|-|No|
|SV-260471 Ubuntu 22.04 LTS must initiate session audits at system startup.|None|-|No|
|SV-260472 Ubuntu 22.04 LTS must restrict access to the kernel message buffer.|None|-|Yes|
|SV-260473 Ubuntu 22.04 LTS must disable kernel core dumps so that it can fail to a secure state if system initialization fails, shutdown fails or aborts fail.|None|-|No|
|SV-260474 Ubuntu 22.04 LTS must implement address space layout randomization to protect its memory from unauthorized code execution.|None|-|Yes|
|SV-260476 Ubuntu 22.04 LTS must be configured so that the Advance Package Tool (APT) prevents the installation of patches, service packs, device drivers, or operating system components without verification they have been digitally signed using a certificate that is recognized and approved by the organization.|None|-|No|
|SV-260477 Ubuntu 22.04 LTS must be configured so that the Advance Package Tool (APT) removes all software components after updated versions have been installed.|None|-|No|
|SV-260478 Ubuntu 22.04 LTS must have the "libpam-pwquality" package installed.|None|-|No|
|SV-260479 Ubuntu 22.04 LTS must have the "chrony" package installed.|None|-|No|
|SV-260480 Ubuntu 22.04 LTS must not have the "systemd-timesyncd" package installed.|None|-|No|
|SV-260481 Ubuntu 22.04 LTS must not have the "ntp" package installed.|None|-|No|
|SV-260482 Ubuntu 22.04 LTS must not have the "rsh-server" package installed.|None|-|No|
|SV-260483 Ubuntu 22.04 LTS must not have the "telnet" package installed.|None|-|No|
|SV-260485 Ubuntu 22.04 LTS must have directories that contain system commands set to a mode of "755" or less permissive.|None|-|No|
|SV-260486 Ubuntu 22.04 LTS must have system commands set to a mode of "755" or less permissive.|None|-|No|
|SV-260487 Ubuntu 22.04 LTS library files must have mode "755" or less permissive.|None|-|No|
|SV-260488 Ubuntu 22.04 LTS must configure the "/var/log" directory to have mode "755" or less permissive.|None|-|Yes|
|SV-260489 Ubuntu 22.04 LTS must generate error messages that provide information necessary for corrective actions without revealing information that could be exploited by adversaries.|None|-|No|
|SV-260490 Ubuntu 22.04 LTS must generate system journal entries without revealing information that could be exploited by adversaries.|None|-|Yes|
|SV-260491 Ubuntu 22.04 LTS must configure "/var/log/syslog" file with mode "640" or less permissive.|None|-|Yes|
|SV-260492 Ubuntu 22.04 LTS must configure audit tools with a mode of "755" or less permissive.|None|-|Yes|
|SV-260493 Ubuntu 22.04 LTS must have directories that contain system commands owned by "root".|None|-|No|
|SV-260494 Ubuntu 22.04 LTS must have directories that contain system commands group-owned by "root".|None|-|No|
|SV-260495 Ubuntu 22.04 LTS must have system commands owned by "root" or a system account.|None|-|No|
|SV-260496 Ubuntu 22.04 LTS must have system commands group-owned by "root" or a system account.|None|-|No|
|SV-260497 Ubuntu 22.04 LTS library directories must be owned by "root".|None|-|No|
|SV-260498 Ubuntu 22.04 LTS library directories must be group-owned by "root".|None|-|No|
|SV-260499 Ubuntu 22.04 LTS library files must be owned by "root".|None|-|No|
|SV-260500 Ubuntu 22.04 LTS library files must be group-owned by "root".|None|-|No|
|SV-260501 Ubuntu 22.04 LTS must configure the directories used by the system journal to be owned by "root".|None|-|No|
|SV-260502 Ubuntu 22.04 LTS must configure the directories used by the system journal to be group-owned by "systemd-journal".|None|-|No|
|SV-260503 Ubuntu 22.04 LTS must configure the files used by the system journal to be owned by "root".|None|-|No|
|SV-260504 Ubuntu 22.04 LTS must configure the files used by the system journal to be group-owned by "systemd-journal".|None|-|No|
|SV-260505 Ubuntu 22.04 LTS must be configured so that the "journalctl" command is owned by "root".|None|-|Yes|
|SV-260506 Ubuntu 22.04 LTS must be configured so that the "journalctl" command is group-owned by "root".|None|-|Yes|
|SV-260507 Ubuntu 22.04 LTS must configure audit tools to be owned by "root".|None|-|Yes|
|SV-260508 Ubuntu 22.04 LTS must configure the "/var/log" directory to be owned by "root".|None|-|Yes|
|SV-260509 Ubuntu 22.04 LTS must configure the "/var/log" directory to be group-owned by "syslog".|None|-|Yes|
|SV-260510 Ubuntu 22.04 LTS must configure "/var/log/syslog" file to be owned by "syslog".|None|-|No|
|SV-260511 Ubuntu 22.04 LTS must configure the "/var/log/syslog" file to be group-owned by "adm".|None|-|Yes|
|SV-260512 Ubuntu 22.04 LTS must be configured so that the "journalctl" command is not accessible by unauthorized users.|None|-|Yes|
|SV-260514 Ubuntu 22.04 LTS must have an application firewall installed in order to control remote access methods.|None|-|No|
|SV-260515 Ubuntu 22.04 LTS must enable and run the Uncomplicated Firewall (ufw).|None|-|No|
|SV-260516 Ubuntu 22.04 LTS must have an application firewall enabled.|None|-|No|
|SV-260521 Ubuntu 22.04 LTS must record time stamps for audit records that can be mapped to Coordinated Universal Time (UTC).|None|-|No|
|SV-260522 Ubuntu 22.04 LTS must be configured to use TCP syncookies.|None|-|Yes|
|SV-260523 Ubuntu 22.04 LTS must have SSH installed.|None|-|No|
|SV-260524 Ubuntu 22.04 LTS must use SSH to protect the confidentiality and integrity of transmitted information.|None|-|No|
|SV-260526 Ubuntu 22.04 LTS must not allow unattended or automatic login via SSH.|None|-|No|
|SV-260527 Ubuntu 22.04 LTS must be configured so that all network connections associated with SSH traffic terminate after becoming unresponsive.|None|-|No|
|SV-260528 Ubuntu 22.04 LTS must be configured so that all network connections associated with SSH traffic are terminated after 10 minutes of becoming unresponsive.|None|-|No|
|SV-260529 Ubuntu 22.04 LTS must be configured so that remote X connections are disabled, unless to fulfill documented and validated mission requirements.|None|-|No|
|SV-260530 Ubuntu 22.04 LTS SSH daemon must prevent remote hosts from connecting to the proxy display.|None|-|No|
|SV-260531 Ubuntu 22.04 LTS must configure the SSH daemon to use FIPS 140-3-approved ciphers to prevent the unauthorized disclosure of information and/or detect changes to information during transmission.|None|-|No|
|SV-260532 Ubuntu 22.04 LTS must configure the SSH daemon to use Message Authentication Codes (MACs) employing FIPS 140-3-approved cryptographic hashes to prevent the unauthorized disclosure of information and/or detect changes to information during transmission.|None|-|No|
|SV-260533 Ubuntu 22.04 LTS SSH server must be configured to use only FIPS-validated key exchange algorithms.|None|-|No|
|SV-260534 Ubuntu 22.04 LTS must use strong authenticators in establishing nonlocal maintenance and diagnostic sessions.|None|-|No|
|SV-260535 Ubuntu 22.04 LTS must enable the graphical user logon banner to display the Standard Mandatory DOD Notice and Consent Banner before granting local access to the system via a graphical user logon.|None|-|No|
|SV-260540 Ubuntu 22.04 LTS must disable automatic mounting of Universal Serial Bus (USB) mass storage driver.|None|-|No|
|SV-260542 Ubuntu 22.04 LTS must prevent direct login into the root account.|None|-|No|
|SV-260543 Ubuntu 22.04 LTS must uniquely identify interactive users.|None|-|No|
|SV-260545 Ubuntu 22.04 LTS must enforce 24 hours/one day as the minimum password lifetime. Passwords for new users must have a 24 hours/one day minimum password lifetime restriction.|None|-|No|
|SV-260546 Ubuntu 22.04 LTS must enforce a 60-day maximum password lifetime restriction. Passwords for new users must have a 60-day maximum password lifetime restriction.|None|-|No|
|SV-260547 Ubuntu 22.04 LTS must disable account identifiers (individuals, groups, roles, and devices) after 35 days of inactivity.|None|-|No|
|SV-260549 Ubuntu 22.04 LTS must automatically lock an account until the locked account is released by an administrator when three unsuccessful logon attempts have been made.|None|-|No|
|SV-260550 Ubuntu 22.04 LTS must enforce a delay of at least four seconds between logon prompts following a failed logon attempt.|None|-|No|
|SV-260552 Ubuntu 22.04 LTS must limit the number of concurrent sessions to ten for all accounts and/or account types.|None|-|No|
|SV-260553 Ubuntu 22.04 LTS must allow users to directly initiate a session lock for all connection types.|None|-|No|
|SV-260554 Ubuntu 22.04 LTS must automatically exit interactive command shell user sessions after 15 minutes of inactivity.|None|-|No|
|SV-260555 Ubuntu 22.04 LTS default filesystem permissions must be defined in such a way that all authenticated users can read and modify only their own files.|None|-|No|
|SV-260556 Ubuntu 22.04 LTS must have the "apparmor" package installed.|None|-|No|
|SV-260558 Ubuntu 22.04 LTS must require users to reauthenticate for privilege escalation or when changing roles.|None|-|No|
|SV-260560 Ubuntu 22.04 LTS must enforce password complexity by requiring at least one uppercase character be used.|None|-|No|
|SV-260561 Ubuntu 22.04 LTS must enforce password complexity by requiring at least one lowercase character be used.|None|-|No|
|SV-260562 Ubuntu 22.04 LTS must enforce password complexity by requiring that at least one numeric character be used.|None|-|No|
|SV-260563 Ubuntu 22.04 LTS must enforce password complexity by requiring that at least one special character be used.|None|-|No|
|SV-260564 Ubuntu 22.04 LTS must prevent the use of dictionary words for passwords.|None|-|No|
|SV-260565 Ubuntu 22.04 LTS must enforce a minimum 15-character password length.|None|-|No|
|SV-260566 Ubuntu 22.04 LTS must require the change of at least eight characters when passwords are changed.|None|-|No|
|SV-260567 Ubuntu 22.04 LTS must be configured so that when passwords are changed or new passwords are established, pwquality must be used.|None|-|No|
|SV-260569 Ubuntu 22.04 LTS must store only encrypted representations of passwords.|None|-|No|
|SV-260570 Ubuntu 22.04 LTS must not allow accounts configured with blank or null passwords.|None|-|No|
|SV-260571 Ubuntu 22.04 LTS must not have accounts configured with blank or null passwords.|None|-|No|
|SV-260572 Ubuntu 22.04 LTS must encrypt all stored passwords with a FIPS 140-3-approved cryptographic hashing algorithm.|None|-|No|
|SV-260573 Ubuntu 22.04 LTS must implement multifactor authentication for remote access to privileged accounts in such a way that one of the factors is provided by a device separate from the system gaining access.|None|-|No|
|SV-260574 Ubuntu 22.04 LTS must accept personal identity verification (PIV) credentials.|None|-|No|
|SV-260575 Ubuntu 22.04 LTS must implement smart card logins for multifactor authentication for local and network access to privileged and nonprivileged accounts.|None|-|No|
|SV-260576 Ubuntu 22.04 LTS must electronically verify personal identity verification (PIV) credentials.|None|-|No|
|SV-260577 Ubuntu 22.04 LTS, for PKI-based authentication, must validate certificates by constructing a certification path (which includes status information) to an accepted trust anchor.|None|-|No|
|SV-260578 Ubuntu 22.04 LTS for PKI-based authentication, must implement a local cache of revocation data in case of the inability to access revocation information via the network.|None|-|No|
|SV-260579 Ubuntu 22.04 LTS must map the authenticated identity to the user or group account for PKI-based authentication.|None|-|No|
|SV-260581 Ubuntu 22.04 LTS must be configured such that Pluggable Authentication Module (PAM) prohibits the use of cached authentications after one day.|None|-|No|
|SV-260582 Ubuntu 22.04 LTS must use a file integrity tool to verify correct operation of all security functions.|None|-|No|
|SV-260584 Ubuntu 22.04 LTS must notify designated personnel if baseline configurations are changed in an unauthorized manner. The file integrity tool must notify the system administrator when changes to the baseline configuration or anomalies in the operation of any security functions are discovered.|None|-|No|
|SV-260586 Ubuntu 22.04 LTS must use cryptographic mechanisms to protect the integrity of audit tools.|None|-|No|
|SV-260588 Ubuntu 22.04 LTS must be configured to preserve log records from failure events.|None|-|No|
|SV-260589 Ubuntu 22.04 LTS must monitor remote access methods.|None|-|No|
|SV-260590 Ubuntu 22.04 LTS must have the "auditd" package installed.|None|-|No|
|SV-260591 Ubuntu 22.04 LTS must produce audit records and reports containing information to establish when, where, what type, the source, and the outcome for all DOD-defined auditable events and actions in near real time.|None|-|No|
|SV-260594 Ubuntu 22.04 LTS must shut down by default upon audit failure.|None|-|No|
|SV-260596 Ubuntu 22.04 LTS must immediately notify the system administrator (SA) and information system security officer (ISSO) when the audit record storage volume reaches 25 percent remaining of the allocated capacity.|None|-|No|
|SV-260597 Ubuntu 22.04 LTS must be configured so that audit log files are not read- or write-accessible by unauthorized users.|None|-|No|
|SV-260598 Ubuntu 22.04 LTS must be configured to permit only authorized users ownership of the audit log files.|None|-|No|
|SV-260599 Ubuntu 22.04 LTS must permit only authorized groups ownership of the audit log files.|None|-|No|
|SV-260600 Ubuntu 22.04 LTS must be configured so that the audit log directory is not write-accessible by unauthorized users.|None|-|No|
|SV-260601 Ubuntu 22.04 LTS must be configured so that audit configuration files are not write-accessible by unauthorized users.|None|-|Yes|
|SV-260602 Ubuntu 22.04 LTS must permit only authorized accounts to own the audit configuration files.|None|-|Yes|
|SV-260603 Ubuntu 22.04 LTS must permit only authorized groups to own the audit configuration files.|None|-|Yes|
|SV-260604 Ubuntu 22.04 LTS must generate audit records for successful/unsuccessful uses of the apparmor\_parser command.|None|-|No|
|SV-260605 Ubuntu 22.04 LTS must generate audit records for successful/unsuccessful uses of the chacl command.|None|-|No|
|SV-260606 Ubuntu 22.04 LTS must generate audit records for successful/unsuccessful uses of the chage command.|None|-|No|
|SV-260607 Ubuntu 22.04 LTS must generate audit records for successful/unsuccessful uses of the chcon command.|None|-|No|
|SV-260608 Ubuntu 22.04 LTS must generate audit records for successful/unsuccessful uses of the chfn command.|None|-|No|
|SV-260609 Ubuntu 22.04 LTS must generate audit records for successful/unsuccessful uses of the chsh command.|None|-|No|
|SV-260610 Ubuntu 22.04 LTS must generate audit records for successful/unsuccessful uses of the crontab command.|None|-|No|
|SV-260611 Ubuntu 22.04 LTS must generate audit records for successful/unsuccessful attempts to use the fdisk command.|None|-|No|
|SV-260612 Ubuntu 22.04 LTS must generate audit records for successful/unsuccessful uses of the gpasswd command.|None|-|No|
|SV-260613 Ubuntu 22.04 LTS must generate audit records for successful/unsuccessful attempts to use the kmod command.|None|-|No|
|SV-260614 Ubuntu 22.04 LTS must generate audit records for successful/unsuccessful attempts to use modprobe command.|None|-|No|
|SV-260615 Ubuntu 22.04 LTS must generate audit records for successful/unsuccessful uses of the mount command.|None|-|No|
|SV-260616 Ubuntu 22.04 LTS must generate audit records for successful/unsuccessful uses of the newgrp command.|None|-|No|
|SV-260617 Ubuntu 22.04 LTS must generate audit records for successful/unsuccessful uses of the pam\_timestamp\_check command.|None|-|No|
|SV-260618 Ubuntu 22.04 LTS must generate audit records for successful/unsuccessful uses of the passwd command.|None|-|No|
|SV-260619 Ubuntu 22.04 LTS must generate audit records for successful/unsuccessful uses of the setfacl command.|None|-|No|
|SV-260620 Ubuntu 22.04 LTS must generate audit records for successful/unsuccessful uses of the ssh-agent command.|None|-|No|
|SV-260621 Ubuntu 22.04 LTS must generate audit records for successful/unsuccessful uses of the ssh-keysign command.|None|-|No|
|SV-260622 Ubuntu 22.04 LTS must generate audit records for successful/unsuccessful uses of the su command.|None|-|No|
|SV-260623 Ubuntu 22.04 LTS must generate audit records for successful/unsuccessful uses of the sudo command.|None|-|No|
|SV-260624 Ubuntu 22.04 LTS must generate audit records for successful/unsuccessful uses of the sudoedit command.|None|-|No|
|SV-260625 Ubuntu 22.04 LTS must generate audit records for successful/unsuccessful uses of the umount command.|None|-|No|
|SV-260626 Ubuntu 22.04 LTS must generate audit records for successful/unsuccessful uses of the unix\_update command.|None|-|No|
|SV-260627 Ubuntu 22.04 LTS must generate audit records for successful/unsuccessful uses of the usermod command.|None|-|No|
|SV-260628 Ubuntu 22.04 LTS must generate audit records for all account creations, modifications, disabling, and termination events that affect /etc/group.|None|-|No|
|SV-260629 Ubuntu 22.04 LTS must generate audit records for all account creations, modifications, disabling, and termination events that affect /etc/gshadow.|None|-|No|
|SV-260630 Ubuntu 22.04 LTS must generate audit records for all account creations, modifications, disabling, and termination events that affect /etc/opasswd.|None|-|No|
|SV-260631 Ubuntu 22.04 LTS must generate audit records for all account creations, modifications, disabling, and termination events that affect /etc/passwd.|None|-|No|
|SV-260632 Ubuntu 22.04 LTS must generate audit records for all account creations, modifications, disabling, and termination events that affect /etc/shadow.|None|-|No|
|SV-260633 Ubuntu 22.04 LTS must generate audit records for successful/unsuccessful uses of the chmod, fchmod, and fchmodat system calls.|None|-|No|
|SV-260634 Ubuntu 22.04 LTS must generate audit records for successful/unsuccessful uses of the chown, fchown, fchownat, and lchown system calls.|None|-|No|
|SV-260635 Ubuntu 22.04 LTS must generate audit records for successful/unsuccessful uses of the creat, open, openat, open\_by\_handle\_at, truncate, and ftruncate system calls.|None|-|No|
|SV-260636 Ubuntu 22.04 LTS must generate audit records for successful/unsuccessful uses of the delete\_module system call.|None|-|No|
|SV-260637 Ubuntu 22.04 LTS must generate audit records for successful/unsuccessful uses of the init\_module and finit\_module system calls.|None|-|No|
|SV-260638 Ubuntu 22.04 LTS must generate audit records for any use of the setxattr, fsetxattr, lsetxattr, removexattr, fremovexattr, and lremovexattr system calls.|None|-|No|
|SV-260639 Ubuntu 22.04 LTS must generate audit records for any successful/unsuccessful use of unlink, unlinkat, rename, renameat, and rmdir system calls.|None|-|No|
|SV-260640 Ubuntu 22.04 LTS must generate audit records for all events that affect the systemd journal files.|None|-|No|
|SV-260641 Ubuntu 22.04 LTS must generate audit records for the /var/log/btmp file.|None|-|No|
|SV-260642 Ubuntu 22.04 LTS must generate audit records for the /var/log/wtmp file.|None|-|No|
|SV-260643 Ubuntu 22.04 LTS must generate audit records for the /var/run/utmp file.|None|-|No|
|SV-260644 Ubuntu 22.04 LTS must generate audit records for the use and modification of faillog file.|None|-|No|
|SV-260645 Ubuntu 22.04 LTS must generate audit records for the use and modification of the lastlog file.|None|-|No|
|SV-260646 Ubuntu 22.04 LTS must generate audit records when successful/unsuccessful attempts to modify the /etc/sudoers file occur.|None|-|No|
|SV-260647 Ubuntu 22.04 LTS must generate audit records when successful/unsuccessful attempts to modify the /etc/sudoers.d directory occur.|None|-|No|
|SV-260648 Ubuntu 22.04 LTS must prevent all software from executing at higher privilege levels than users executing the software and the audit system must be configured to audit the execution of privileged functions.|None|-|No|
|SV-260649 Ubuntu 22.04 LTS must generate audit records for privileged activities, nonlocal maintenance, diagnostic sessions and other system-level access.|None|-|No|
|SV-260650 Ubuntu 22.04 LTS must implement NIST FIPS-validated cryptography to protect classified information and for the following: To provision digital signatures, to generate cryptographic hashes, and to protect unclassified information requiring confidentiality and cryptographic protection in accordance with applicable federal laws, Executive Orders, directives, policies, regulations, and standards.|None|-|No|
|SV-278951 Ubuntu 22.04 LTS must be a vendor-supported release.|None|-|No|

### Known assessment discrepancies

> [!NOTE]
> These rules can produce assessment results that differ from the DISA SCAP Compliance Checker (SCC).
> A rule is listed once if a discrepancy was observed in any tested scenario.

- SV-260488 Ubuntu 22.04 LTS must configure the "/var/log" directory to have mode "755" or less permissive.
- SV-260528 Ubuntu 22.04 LTS must be configured so that all network connections associated with SSH traffic are terminated after 10 minutes of becoming unresponsive.
- SV-260535 Ubuntu 22.04 LTS must enable the graphical user logon banner to display the Standard Mandatory DOD Notice and Consent Banner before granting local access to the system via a graphical user logon.
- SV-260602 Ubuntu 22.04 LTS must permit only authorized accounts to own the audit configuration files.
- SV-260603 Ubuntu 22.04 LTS must permit only authorized groups to own the audit configuration files.

## DISA STIG Ubuntu 24.04 LTS V1R3

### Rules

|Rule|Parameters|Default values|Remediation|
|---|---|---|---|
|SV-270645 Ubuntu 24.04 LTS must not have the "systemd-timesyncd" package installed.|None|-|No|
|SV-270646 Ubuntu 24.04 LTS must not have the "ntp" package installed.|None|-|No|
|SV-270647 Ubuntu 24.04 LTS must not have the telnet package installed.|None|-|No|
|SV-270648 Ubuntu 24.04 LTS must not have the rsh-server package installed.|None|-|No|
|SV-270649 Ubuntu 24.04 LTS must use a file integrity tool to verify correct operation of all security functions.|None|-|No|
|SV-270652 Ubuntu 24.04 LTS must notify designated personnel if baseline configurations are changed in an unauthorized manner. The file integrity tool must notify the system administrator (SA) when changes to the baseline configuration or anomalies in the operation of any security functions are discovered.|None|-|No|
|SV-270653 Ubuntu 24.04 LTS must be configured to preserve log records from failure events.|None|-|No|
|SV-270654 Ubuntu 24.04 LTS must have an application firewall installed in order to control remote access methods.|None|-|No|
|SV-270655 Ubuntu 24.04 LTS must enable and run the Uncomplicated Firewall (ufw).|None|-|No|
|SV-270656 Ubuntu 24.04 LTS must have the "auditd" package installed.|None|-|No|
|SV-270657 Ubuntu 24.04 LTS must produce audit records and reports containing information to establish when, where, what type, the source, and the outcome for all DOD-defined auditable events and actions in near real time.|None|-|No|
|SV-270659 Ubuntu 24.04 LTS must have AppArmor installed.|None|-|No|
|SV-270660 Ubuntu 24.04 LTS must be configured to use AppArmor.|None|-|No|
|SV-270661 Ubuntu 24.04 LTS must have the "libpam-pwquality" package installed.|None|-|No|
|SV-270662 Ubuntu 24.04 LTS must have the "SSSD" package installed.|None|-|No|
|SV-270663 Ubuntu 24.04 LTS must use the "SSSD" package for multifactor authentication services.|None|-|No|
|SV-270664 Ubuntu 24.04 LTS must have the "chrony" package installed.|None|-|No|
|SV-270665 Ubuntu 24.04 LTS must have SSH installed.|None|-|No|
|SV-270666 Ubuntu 24.04 LTS must use SSH to protect the confidentiality and integrity of transmitted information.|None|-|No|
|SV-270667 Ubuntu 24.04 LTS must configure the SSH daemon to use FIPS 140-3 approved ciphers to prevent the unauthorized disclosure of information and/or detect changes to information during transmission.|None|-|No|
|SV-270668 Ubuntu 24.04 LTS must configure the SSH daemon to use Message Authentication Codes (MACs) employing FIPS 140-3 approved cryptographic hashes to prevent the unauthorized disclosure of information and/or detect changes to information during transmission.|None|-|No|
|SV-270669 Ubuntu 24.04 LTS SSH server must be configured to use only FIPS 140-3 validated key exchange algorithms.|None|-|No|
|SV-270670 Ubuntu 24.04 LTS must configure the SSH client to use FIPS 140-3 approved ciphers to prevent the unauthorized disclosure of information and/or detect changes to information during transmission.|None|-|No|
|SV-270671 Ubuntu 24.04 LTS SSH client must be configured to use only Message Authentication Codes (MACs) employing FIPS 140-3 validated cryptographic hash algorithms.|None|-|No|
|SV-270672 Ubuntu 24.04 LTS must accept Personal Identity Verification (PIV) credentials.|None|-|No|
|SV-270673 Ubuntu 24.04 LTS must accept Personal Identity Verification (PIV) credentials managed through the Privileged Access Management (PAM) framework.|None|-|No|
|SV-270674 Ubuntu 24.04 LTS must allow users to directly initiate a session lock for all connection types.|None|-|No|
|SV-270675 Ubuntu 24.04 LTS when booted must require authentication upon booting into single-user and maintenance modes.|None|-|No|
|SV-270676 Ubuntu 24.04 LTS must initiate session audits at system startup.|None|-|No|
|SV-270677 Ubuntu 24.04 LTS must limit the number of concurrent sessions to 10 for all accounts and/or account types.|None|-|No|
|SV-270680 Ubuntu 24.04 LTS must automatically terminate a user session after inactivity timeouts have expired.|None|-|No|
|SV-270681 Ubuntu 24.04 LTS must monitor remote access methods.|None|-|No|
|SV-270683 Ubuntu 24.04 LTS must disable account identifiers (individuals, groups, roles, and devices) after 35 days of inactivity.|None|-|No|
|SV-270684 Ubuntu 24.04 LTS must generate audit records for all account creations, modifications, disabling, and termination events that affect /etc/passwd.|None|-|No|
|SV-270685 Ubuntu 24.04 LTS must generate audit records for all account creations, modifications, disabling, and termination events that affect /etc/group.|None|-|No|
|SV-270686 Ubuntu 24.04 LTS must generate audit records for all account creations, modifications, disabling, and termination events that affect /etc/shadow.|None|-|No|
|SV-270687 Ubuntu 24.04 LTS must generate audit records for all account creations, modifications, disabling, and termination events that affect /etc/gshadow.|None|-|No|
|SV-270688 Ubuntu 24.04 LTS must generate audit records for all account creations, modifications, disabling, and termination events that affect /etc/opasswd.|None|-|No|
|SV-270689 Ubuntu 24.04 LTS must prevent all software from executing at higher privilege levels than users executing the software and the audit system must be configured to audit the execution of privileged functions.|None|-|No|
|SV-270690 Ubuntu 24.04 LTS must automatically lock an account until the locked account is released by an administrator when three unsuccessful logon attempts have been made.|None|-|No|
|SV-270692 Ubuntu 24.04 LTS must enable the graphical user logon banner to display the Standard Mandatory DOD Notice and Consent Banner before granting local access to the system via a graphical user logon.|None|-|No|
|SV-270695 Ubuntu 24.04 LTS Advance Package Tool (APT) must be configured to prevent the installation of patches, service packs, device drivers, or Ubuntu 24.04 LTS components without verification they have been digitally signed using a certificate that is recognized and approved by the organization.|None|-|No|
|SV-270696 Ubuntu 24.04 LTS library files must have mode 0755 or less permissive.|None|-|No|
|SV-270697 Ubuntu 24.04 LTS library files must be owned by root.|None|-|No|
|SV-270698 Ubuntu 24.04 LTS library directories must be owned by root.|None|-|No|
|SV-270699 Ubuntu 24.04 LTS library files must be group-owned by root or a system account.|None|-|No|
|SV-270700 Ubuntu 24.04 LTS library directories must be group-owned by root.|None|-|No|
|SV-270701 Ubuntu 24.04 LTS must have system commands set to a mode of 0755 or less permissive.|None|-|No|
|SV-270702 Ubuntu 24.04 LTS must have system commands owned by root or a system account.|None|-|No|
|SV-270703 Ubuntu 24.04 LTS must have system commands group-owned by root or a system account.|None|-|No|
|SV-270704 Ubuntu 24.04 LTS must prevent the use of dictionary words for passwords.|None|-|No|
|SV-270705 Ubuntu 24.04 LTS must be configured so that when passwords are changed or new passwords are established, pwquality must be used.|None|-|No|
|SV-270706 Ubuntu 24.04 LTS must enforce a delay of at least four seconds between logon prompts following a failed logon attempt.|None|-|No|
|SV-270707 Ubuntu 24.04 LTS must require users to reauthenticate for privilege escalation or when changing roles.|None|-|No|
|SV-270708 Ubuntu 24.04 LTS must be configured so that remote X connections are disabled, unless to fulfill documented and validated mission requirements.|None|-|No|
|SV-270709 Ubuntu 24.04 LTS SSH daemon must prevent remote hosts from connecting to the proxy display.|None|-|No|
|SV-270712 Ubuntu 24.04 LTS must disable the x86 Ctrl-Alt-Delete key sequence.|None|-|No|
|SV-270713 Ubuntu 24.04 LTS must not have accounts configured with blank or null passwords.|None|-|No|
|SV-270714 Ubuntu 24.04 LTS must not allow accounts configured in Pluggable Authentication Modules (PAM) with blank or null passwords.|None|-|No|
|SV-270715 Ubuntu 24.04 LTS must generate audit records for all events that affect the systemd journal files.|None|-|No|
|SV-270716 Ubuntu 24.04 LTS default filesystem permissions must be defined in such a way that all authenticated users can read and modify only their own files.|None|-|No|
|SV-270717 Ubuntu 24.04 LTS must not allow unattended or automatic login via SSH.|None|-|No|
|SV-270718 Ubuntu 24.04 LTS must disable automatic mounting of Universal Serial Bus (USB) mass storage driver.|None|-|No|
|SV-270720 Ubuntu 24.04 LTS must uniquely identify interactive users.|None|-|No|
|SV-270721 Ubuntu 24.04 LTS must implement smart card logins for multifactor authentication for local and network access to privileged and nonprivileged accounts.|None|-|No|
|SV-270722 Ubuntu 24.04 LTS must implement smart card logins for multifactor authentication for local and network access to privileged and nonprivileged accounts over SSH.|None|-|No|
|SV-270723 Ubuntu 24.04 LTS must electronically verify Personal Identity Verification (PIV) credentials.|None|-|No|
|SV-270724 Ubuntu 24.04 LTS must prevent direct login to the root account.|None|-|No|
|SV-270725 Ubuntu 24.04 LTS must store only encrypted representations of passwords.|None|-|No|
|SV-270726 Ubuntu 24.04 LTS must enforce password complexity by requiring that at least one uppercase character be used.|None|-|No|
|SV-270727 Ubuntu 24.04 LTS must enforce password complexity by requiring that at least one lowercase character be used.|None|-|No|
|SV-270728 Ubuntu 24.04 LTS must enforce password complexity by requiring that at least one numeric character be used.|None|-|No|
|SV-270729 Ubuntu 24.04 LTS must require the change of at least eight characters when passwords are changed.|None|-|No|
|SV-270730 Ubuntu 24.04 LTS must enforce 24 hours/1 day as the minimum password lifetime. Passwords for new users must have a 24 hours/1 day minimum password lifetime restriction.|None|-|No|
|SV-270731 Ubuntu 24.04 LTS must enforce a 60-day maximum password lifetime restriction. Passwords for new users must have a 60-day maximum password lifetime restriction.|None|-|No|
|SV-270732 Ubuntu 24.04 LTS must enforce a minimum 15-character password length.|None|-|No|
|SV-270733 Ubuntu 24.04 LTS must enforce password complexity by requiring that at least one special character be used.|None|-|No|
|SV-270734 Ubuntu 24.04 LTS must be configured such that Pluggable Authentication Module (PAM) prohibits the use of cached authentications after one day.|None|-|No|
|SV-270736 Ubuntu 24.04 LTS must map the authenticated identity to the user or group account for PKI-based authentication.|None|-|No|
|SV-270737 Ubuntu 24.04 LTS, for PKI-based authentication, Privileged Access Management (PAM) must validate certificates by constructing a certification path (which includes status information) to an accepted trust anchor.|None|-|No|
|SV-270738 Ubuntu 24.04 LTS for PKI-based authentication, must implement a local cache of revocation data in case of the inability to access revocation information via the network.|None|-|No|
|SV-270739 Ubuntu 24.04 LTS must encrypt all stored passwords with a FIPS 140-3 approved cryptographic hashing algorithm.|None|-|No|
|SV-270740 Ubuntu 24.04 LTS must generate audit records for privileged activities, nonlocal maintenance, diagnostic sessions, and other system-level access.|None|-|No|
|SV-270741 Ubuntu 24.04 LTS must use strong authenticators in establishing nonlocal maintenance and diagnostic sessions.|None|-|No|
|SV-270742 Ubuntu 24.04 LTS must immediately terminate all network connections associated with SSH traffic after a period of inactivity.|None|-|No|
|SV-270743 Ubuntu 24.04 LTS must immediately terminate all network connections associated with SSH traffic at the end of the session or after 10 minutes of inactivity.|None|-|No|
|SV-270744 Ubuntu 24.04 LTS must implement NIST FIPS-validated cryptography to protect classified information and for the following: To provision digital signatures, to generate cryptographic hashes, and to protect unclassified information requiring confidentiality and cryptographic protection in accordance with applicable federal laws, Executive Orders, directives, policies, regulations, and standards.|None|-|No|
|SV-270746 Ubuntu 24.04 LTS must disable kernel core dumps.|None|-|No|
|SV-270749 Ubuntu 24.04 LTS must restrict access to the kernel message buffer.|None|-|Yes|
|SV-270753 Ubuntu 24.04 LTS must be configured to use TCP syncookies.|None|-|Yes|
|SV-270756 Ubuntu 24.04 LTS must generate error messages that provide information necessary for corrective actions without revealing information that could be exploited by adversaries.|None|-|No|
|SV-270757 Ubuntu 24.04 LTS must generate system journal entries without revealing information that could be exploited by adversaries.|None|-|Yes|
|SV-270758 Ubuntu 24.04 LTS must be configured so that the "journalctl" command is not accessible by unauthorized users.|None|-|Yes|
|SV-270759 Ubuntu 24.04 LTS must be configured so that the "journalctl" command is owned by "root".|None|-|Yes|
|SV-270760 Ubuntu 24.04 LTS must be configured so that the "journalctl" command is group-owned by "root".|None|-|Yes|
|SV-270761 Ubuntu 24.04 LTS must configure the directories used by the system journal to be group-owned by "systemd-journal".|None|-|No|
|SV-270762 Ubuntu 24.04 LTS must configure the files used by the system journal to be group-owned by "systemd-journal".|None|-|No|
|SV-270763 Ubuntu 24.04 LTS must configure the directories used by the system journal to be owned by "root".|None|-|No|
|SV-270764 Ubuntu 24.04 LTS must configure the files used by the system journal to be owned by "root"|None|-|No|
|SV-270765 Ubuntu 24.04 LTS must configure the /var/log directory to be group-owned by syslog.|None|-|Yes|
|SV-270766 Ubuntu 24.04 LTS must configure the /var/log directory to be owned by root.|None|-|Yes|
|SV-270767 Ubuntu 24.04 LTS must configure the /var/log directory to have mode "0755" or less permissive.|None|-|Yes|
|SV-270768 Ubuntu 24.04 LTS must configure the /var/log/syslog file to be group-owned by adm.|None|-|Yes|
|SV-270769 Ubuntu 24.04 LTS must configure /var/log/syslog file to be owned by syslog.|None|-|No|
|SV-270770 Ubuntu 24.04 LTS must configure /var/log/syslog file with mode "0640" or less permissive.|None|-|Yes|
|SV-270772 Ubuntu 24.04 LTS must implement address space layout randomization to protect its memory from unauthorized code execution.|None|-|Yes|
|SV-270773 Ubuntu 24.04 LTS must be configured so that Advance Package Tool (APT) removes all software components after updated versions have been installed.|None|-|No|
|SV-270775 Ubuntu 24.04 LTS must be configured so that audit configuration files are not write-accessible by unauthorized users.|None|-|Yes|
|SV-270776 Ubuntu 24.04 LTS must permit only authorized accounts to own the audit configuration files.|None|-|Yes|
|SV-270777 Ubuntu 24.04 LTS must permit only authorized groups to own the audit configuration files.|None|-|Yes|
|SV-270778 Ubuntu 24.04 LTS must generate audit records for successful/unsuccessful uses of the su command.|None|-|No|
|SV-270779 Ubuntu 24.04 LTS must generate audit records for successful/unsuccessful uses of the chfn command.|None|-|No|
|SV-270780 Ubuntu 24.04 LTS must generate audit records for successful/unsuccessful uses of the mount command.|None|-|No|
|SV-270781 Ubuntu 24.04 LTS must generate audit records for successful/unsuccessful uses of the umount command.|None|-|No|
|SV-270782 Ubuntu 24.04 LTS must generate audit records for successful/unsuccessful uses of the ssh-agent command.|None|-|No|
|SV-270783 Ubuntu 24.04 LTS must generate audit records for successful/unsuccessful uses of the ssh-keysign command.|None|-|No|
|SV-270784 Ubuntu 24.04 LTS must generate audit records for any use of the setxattr, fsetxattr, lsetxattr, removexattr, fremovexattr, and lremovexattr system calls.|None|-|No|
|SV-270785 Ubuntu 24.04 LTS must generate audit records for successful/unsuccessful uses of the chown, fchown, fchownat, and lchown system calls.|None|-|No|
|SV-270786 Ubuntu 24.04 LTS must generate audit records for successful/unsuccessful uses of the chmod, fchmod, and fchmodat system calls.|None|-|No|
|SV-270787 Ubuntu 24.04 LTS must generate audit records for successful/unsuccessful uses of the creat, open, openat, open\_by\_handle\_at, truncate, and ftruncate system calls.|None|-|No|
|SV-270788 Ubuntu 24.04 LTS must generate audit records for successful/unsuccessful uses of the sudo command.|None|-|No|
|SV-270789 Ubuntu 24.04 LTS must generate audit records for successful/unsuccessful uses of the sudoedit command.|None|-|No|
|SV-270790 Ubuntu 24.04 LTS must generate audit records for successful/unsuccessful uses of the chsh command.|None|-|No|
|SV-270791 Ubuntu 24.04 LTS must generate audit records for successful/unsuccessful uses of the newgrp command.|None|-|No|
|SV-270792 Ubuntu 24.04 LTS must generate audit records for successful/unsuccessful uses of the chcon command.|None|-|No|
|SV-270793 Ubuntu 24.04 LTS must generate audit records for successful/unsuccessful uses of the apparmor\_parser command.|None|-|No|
|SV-270794 Ubuntu 24.04 LTS must generate audit records for successful/unsuccessful uses of the setfacl command.|None|-|No|
|SV-270795 Ubuntu 24.04 LTS must generate audit records for successful/unsuccessful uses of the chacl command.|None|-|No|
|SV-270796 Ubuntu 24.04 LTS must generate audit records for the use and modification of faillog file.|None|-|No|
|SV-270797 Ubuntu 24.04 LTS must generate audit records for the use and modification of the lastlog file.|None|-|No|
|SV-270798 Ubuntu 24.04 LTS must generate audit records for successful/unsuccessful uses of the passwd command.|None|-|No|
|SV-270799 Ubuntu 24.04 LTS must generate audit records for successful/unsuccessful uses of the unix\_update command.|None|-|No|
|SV-270800 Ubuntu 24.04 LTS must generate audit records for successful/unsuccessful uses of the gpasswd command.|None|-|No|
|SV-270801 Ubuntu 24.04 LTS must generate audit records for successful/unsuccessful uses of the chage command.|None|-|No|
|SV-270802 Ubuntu 24.04 LTS must generate audit records for successful/unsuccessful uses of the usermod command.|None|-|No|
|SV-270803 Ubuntu 24.04 LTS must generate audit records for successful/unsuccessful uses of the crontab command.|None|-|No|
|SV-270804 Ubuntu 24.04 LTS must generate audit records for successful/unsuccessful uses of the pam\_timestamp\_check command.|None|-|No|
|SV-270805 Ubuntu 24.04 LTS must generate audit records for successful/unsuccessful uses of the init\_module and finit\_module syscalls.|None|-|No|
|SV-270806 Ubuntu 24.04 LTS must generate audit records for successful/unsuccessful uses of the delete\_module syscall.|None|-|No|
|SV-270807 Ubuntu 24.04 LTS must generate audit records when successful/unsuccessful attempts to modify the /etc/sudoers file occur.|None|-|No|
|SV-270808 Ubuntu 24.04 LTS must generate audit records when successful/unsuccessful attempts to modify the /etc/sudoers.d directory occur.|None|-|No|
|SV-270809 Ubuntu 24.04 LTS must generate audit records for any successful/unsuccessful use of unlink, unlinkat, rename, renameat, and rmdir system calls.|None|-|No|
|SV-270810 Ubuntu 24.04 LTS must generate audit records for the /var/log/wtmp file.|None|-|No|
|SV-270811 Ubuntu 24.04 LTS must generate audit records for the /var/run/utmp file.|None|-|No|
|SV-270812 Ubuntu 24.04 LTS must generate audit records for the /var/log/btmp file.|None|-|No|
|SV-270813 Ubuntu 24.04 LTS must generate audit records when successful/unsuccessful attempts to use modprobe command.|None|-|No|
|SV-270814 Ubuntu 24.04 LTS must generate audit records when successful/unsuccessful attempts to use the kmod command.|None|-|No|
|SV-270815 Ubuntu 24.04 LTS must generate audit records when successful/unsuccessful attempts to use the fdisk command.|None|-|No|
|SV-270820 Ubuntu 24.04 LTS must record time stamps for audit records that can be mapped to Coordinated Universal Time (UTC) or Greenwich Mean Time (GMT).|None|-|No|
|SV-270821 Ubuntu 24.04 LTS must configure audit tools with a mode of "0755" or less permissive.|None|-|Yes|
|SV-270822 Ubuntu 24.04 LTS must configure audit tools to be owned by root.|None|-|Yes|
|SV-270823 Ubuntu 24.04 LTS must configure the audit tools to be group owned by root.|None|-|Yes|
|SV-270824 Ubuntu 24.04 LTS must have directories that contain system commands set to a mode of "0755" or less permissive.|None|-|No|
|SV-270825 Ubuntu 24.04 LTS must have directories that contain system commands owned by root.|None|-|No|
|SV-270826 Ubuntu 24.04 LTS must have directories that contain system commands group-owned by root.|None|-|No|
|SV-270827 Ubuntu 24.04 LTS must be configured so that audit log files are not read or write-accessible by unauthorized users.|None|-|No|
|SV-270828 Ubuntu 24.04 LTS must be configured to permit only authorized users ownership of the audit log files.|None|-|No|
|SV-270829 Ubuntu 24.04 LTS must permit only authorized groups ownership of the audit log files.|None|-|No|
|SV-270830 Ubuntu 24.04 LTS must be configured so that the audit log directory is not write-accessible by unauthorized users.|None|-|No|
|SV-270831 Ubuntu 24.04 LTS must use cryptographic mechanisms to protect the integrity of audit tools.|None|-|No|
|SV-270832 Ubuntu 24.04 LTS audit system must protect auditing rules from unauthorized change.|None|-|No|
|SV-274868 Ubuntu 24.04 LTS must require users to provide a password for privilege escalation.|None|-|No|
|SV-274869 Ubuntu 24.04 LTS must restrict privilege elevation to authorized personnel.|None|-|No|
|SV-274870 Ubuntu 24.04 LTS must audit any script or executable called by cron as root or by any privileged user.|None|-|No|
|SV-278917 Ubuntu 24.04 LTS must be a vendor-supported release.|None|-|No|

### Known assessment discrepancies

> [!NOTE]
> These rules can produce assessment results that differ from the DISA SCAP Compliance Checker (SCC).
> A rule is listed once if a discrepancy was observed in any tested scenario.

- SV-270692 Ubuntu 24.04 LTS must enable the graphical user logon banner to display the Standard Mandatory DOD Notice and Consent Banner before granting local access to the system via a graphical user logon.
- SV-270743 Ubuntu 24.04 LTS must immediately terminate all network connections associated with SSH traffic at the end of the session or after 10 minutes of inactivity.
- SV-270746 Ubuntu 24.04 LTS must disable kernel core dumps.
- SV-270767 Ubuntu 24.04 LTS must configure the /var/log directory to have mode "0755" or less permissive.
- SV-270776 Ubuntu 24.04 LTS must permit only authorized accounts to own the audit configuration files.
- SV-270777 Ubuntu 24.04 LTS must permit only authorized groups to own the audit configuration files.
