---
title: Reference - DISA STIG benchmarks for Oracle Linux via Machine Configuration
description: Reference - DISA STIG benchmarks for Oracle Linux via Machine Configuration
ms.date: 11/04/2026
author: pallakatos
ms.author: pallakatos
ms.topic: reference
ms.custom: generated
---

# DISA STIG benchmarks for Oracle Linux

This article provides detailed information about the DISA STIG benchmarks for Oracle Linux, including supported benchmarks, mismatched rules, remediation support, and configurable parameters across all supported versions.

DISA STIG baselines are in **[Public Preview]**.

## Supported benchmarks

|Oracle Linux Version|Benchmark Title|
|---|---|
|Oracle Linux 8|[DISA STIG Oracle Linux 8 V2R7](#disa-stig-oracle-linux-8-v2r7)|
|Oracle Linux 9|[DISA STIG Oracle Linux 9 V1R2](#disa-stig-oracle-linux-9-v1r2)|

> [!NOTE]
> Auto-remediation is in **[Public Preview]**.
> Remediation must be enabled separately and is available only for rules marked **Yes** in the **Remediation** column. It uses configured parameter values, or the defaults shown when no overrides are provided. Other rules remain audit-only. Review and test changes before enabling remediation broadly.

Supported parameters and remediations will expand over time. To request additional support, [open an issue in the kompli repository](https://github.com/microsoft/kompli/issues).

## DISA STIG Oracle Linux 8 V2R7

### Rules

|Rule|Parameters|Default values|Remediation|
|---|---|---|---|
|SV-248519 The OL 8 audit package must be installed.|None|-|No|
|SV-248520 OL 8 audit records must contain information to establish what type of events occurred, the source of events, where events occurred, and the outcome of events.|None|-|No|
|SV-248521 OL 8 must be a vendor-supported release.|None|-|No|
|SV-248524 OL 8 must implement NIST FIPS-validated cryptography for the following: To provision digital signatures, to generate cryptographic hashes, and to protect data requiring data-at-rest protections in accordance with applicable federal laws, Executive Orders, directives, policies, regulations, and standards.|None|-|No|
|SV-248527 OL 8 must display a banner before granting local or remote access to the system via a graphical user logon.|None|-|No|
|SV-248530 All OL 8 remote access methods must be monitored.|None|-|No|
|SV-248533 OL 8 must encrypt all stored passwords with a FIPS 140-2 approved cryptographic hashing algorithm.|None|-|No|
|SV-248534 OL 8 must employ FIPS 140-2 approved cryptographic hashing algorithms for all stored passwords.|None|-|No|
|SV-248535 The OL 8 shadow password suite must be configured to use a sufficient number of hashing rounds.|None|-|No|
|SV-248537 OL 8 operating systems booted with United Extensible Firmware Interface (UEFI) must require authentication upon booting into single-user mode and maintenance.|None|-|No|
|SV-248540 OL 8 operating systems booted with a BIOS must require authentication upon booting into single-user and maintenance modes.|None|-|No|
|SV-248541 OL 8 operating systems must require authentication upon booting into rescue mode.|None|-|No|
|SV-248542 OL 8 operating systems must require authentication upon booting into emergency mode.|None|-|No|
|SV-248543 The OL 8 "pam\_unix.so" module must be configured in the system-auth file to use a FIPS 140-2 approved cryptographic hashing algorithm for system authentication.|None|-|No|
|SV-248544 The OL 8 "pam\_unix.so" module must be configured in the password-auth file to use a FIPS 140-2 approved cryptographic hashing algorithm for system authentication.|None|-|No|
|SV-248545 OL 8 must prevent system daemons from using Kerberos for authentication.|None|-|No|
|SV-248546 The krb5-workstation package must not be installed on OL 8.|None|-|No|
|SV-248547 The krb5-server package must not be installed on OL 8.|None|-|No|
|SV-248548 OL 8 must use a Linux Security Module configured to enforce limits on system services.|None|-|No|
|SV-248549 OL 8 must have the "policycoreutils" package installed.|None|-|No|
|SV-248552 OL 8 must be configured so that all network connections associated with SSH traffic terminate after becoming unresponsive.|None|-|No|
|SV-248553 OL 8 must be configured so that all network connections associated with SSH traffic are terminated after 10 minutes of becoming unresponsive.|None|-|No|
|SV-248554 The OL 8 "/var/log/messages" file must have mode 0640 or less permissive.|None|-|Yes|
|SV-248555 The OL 8 "/var/log/messages" file must be owned by root.|None|-|Yes|
|SV-248556 The OL 8 "/var/log/messages" file must be group-owned by root.|None|-|Yes|
|SV-248557 The OL 8 "/var/log" directory must have mode 0755 or less permissive.|None|-|Yes|
|SV-248558 The OL 8 "/var/log" directory must be owned by root.|None|-|Yes|
|SV-248559 The OL 8 "/var/log" directory must be group-owned by root.|None|-|Yes|
|SV-248563 The OL 8 SSH server must be configured to use strong entropy.|None|-|No|
|SV-248565 The OL 8 operating system must implement DoD-approved TLS encryption in the OpenSSL package.|None|-|No|
|SV-248567 OL 8 system commands must have mode 755 or less permissive.|None|-|No|
|SV-248568 OL 8 system commands must be owned by root.|None|-|No|
|SV-248569 OL 8 system commands must be group-owned by root or a system account.|None|-|No|
|SV-248570 OL 8 library files must have mode 755 or less permissive.|None|-|No|
|SV-248571 OL 8 library files must be owned by root.|None|-|No|
|SV-248572 OL 8 library files must be group-owned by root.|None|-|No|
|SV-248574 YUM must be configured to prevent the installation of patches, service packs, device drivers, or OL 8 system components that have not been digitally signed using a certificate that is recognized and approved by the organization.|None|-|No|
|SV-248575 OL 8 must prevent the installation of software, patches, service packs, device drivers, or operating system components of local packages without verification they have been digitally signed using a certificate that is issued by a Certificate Authority (CA) that is recognized and approved by the organization.|None|-|No|
|SV-248577 OL 8 must enable kernel parameters to enforce Discretionary Access Control (DAC) on symlinks.|None|-|Yes|
|SV-248578 OL 8 must enable kernel parameters to enforce Discretionary Access Control (DAC) on hardlinks.|None|-|Yes|
|SV-248579 OL 8 must restrict access to the kernel message buffer.|None|-|Yes|
|SV-248580 OL 8 must prevent kernel profiling by nonprivileged users.|None|-|Yes|
|SV-248581 OL 8 must require users to provide a password for privilege escalation.|None|-|No|
|SV-248582 OL 8 must require users to reauthenticate for privilege escalation and changing roles.|None|-|No|
|SV-248583 OL 8 must restrict privilege elevation to authorized personnel.|None|-|No|
|SV-248584 OL 8 must use the invoking user's password for privilege escalation when using "sudo".|None|-|No|
|SV-248585 OL 8 must require reauthentication when using the "sudo" command.|None|-|No|
|SV-248586 OL 8 must have the package required for multifactor authentication installed.|None|-|No|
|SV-248594 OL 8 must implement address space layout randomization (ASLR) to protect its memory from unauthorized code execution.|None|-|Yes|
|SV-248595 YUM must remove all software components after updated versions have been installed on OL 8.|None|-|No|
|SV-248596 OL 8 must enable the SELinux targeted policy.|None|-|No|
|SV-248597 There must be no "shosts.equiv" files on the OL 8 operating system.|None|-|No|
|SV-248598 There must be no ".shosts" files on the OL 8 operating system.|None|-|No|
|SV-248600 OL 8 must have the packages required to use the hardware random number generator entropy gatherer service.|None|-|No|
|SV-248601 The OL 8 SSH public host key files must have mode "0644" or less permissive.|None|-|No|
|SV-248602 The OL 8 SSH private host key files must have mode "0640" or less permissive.|None|-|No|
|SV-248603 The OL 8 SSH daemon must perform strict mode checking of home directory configuration files.|None|-|No|
|SV-248605 The OL 8 SSH daemon must not allow authentication using known host's authentication.|None|-|No|
|SV-248606 The OL 8 SSH daemon must not allow Kerberos authentication, except to fulfill documented and validated mission requirements.|None|-|No|
|SV-248607 The OL 8 SSH daemon must not allow GSSAPI authentication, except to fulfill documented and validated mission requirements.|None|-|No|
|SV-248608 OL 8 must use a separate file system for "/var".|None|-|No|
|SV-248609 OL 8 must use a separate file system for "/var/log".|None|-|No|
|SV-248610 OL 8 must use a separate file system for the system audit data path.|None|-|No|
|SV-248611 OL 8 must use a separate file system for "/tmp".|None|-|No|
|SV-248612 OL 8 must use a separate file system for /var/tmp.|None|-|No|
|SV-248613 OL 8 must not permit direct logons to the root account using remote access via SSH.|None|-|No|
|SV-248615 OL 8 must have the rsyslog service enabled and active.|None|-|No|
|SV-248616 OL 8 must prevent files with the setuid and setgid bit set from being executed on file systems that contain user home directories.|None|-|No|
|SV-248617 OL 8 must prevent files with the setuid and setgid bit set from being executed on the /boot directory.|None|-|No|
|SV-248618 OL 8 must prevent files with the setuid and setgid bit set from being executed on the /boot/efi directory.|None|-|No|
|SV-248619 OL 8 must prevent special devices on nonroot local partitions.|None|-|No|
|SV-248624 OL 8 file systems must not execute binary files that are imported via Network File System (NFS).|None|-|No|
|SV-248625 OL 8 file systems must not interpret character or block special devices that are imported via Network File System (NFS).|None|-|No|
|SV-248626 OL 8 must prevent files with the setuid and setgid bit set from being executed on file systems that are imported via Network File System (NFS).|None|-|No|
|SV-248629 OL 8 must disable the "kernel.core\_pattern".|None|-|No|
|SV-248630 OL 8 must disable acquiring, saving, and processing core dumps.|None|-|No|
|SV-248631 OL 8 must disable core dumps for all users.|None|-|No|
|SV-248632 OL 8 must disable storing core dumps.|None|-|No|
|SV-248633 OL 8 must disable core dump backtraces.|None|-|No|
|SV-248634 For OL 8 systems using Domain Name Servers (DNS) resolution, at least two name servers must be configured.|None|-|No|
|SV-248638 All OL 8 local interactive users must have a home directory assigned in the "/etc/passwd" file.|None|-|No|
|SV-248639 All OL 8 local interactive user home directories must have mode "0750" or less permissive.|None|-|No|
|SV-248644 All OL 8 local interactive user accounts must be assigned a home directory upon creation.|None|-|No|
|SV-248645 All OL 8 local initialization files must have mode "0740" or less permissive.|None|-|No|
|SV-248648 A separate OL 8 filesystem must be used for user home directories (such as "/home" or an equivalent).|None|-|No|
|SV-248649 Unattended or automatic logon via the OL 8 graphical user interface must not be allowed.|None|-|No|
|SV-248650 OL 8 must not allow users to override SSH environment variables.|None|-|No|
|SV-248652 OL 8 systems below version 8.2 must automatically lock an account when three unsuccessful logon attempts occur.|None|-|No|
|SV-248653 OL 8 systems, versions 8.2 and above, must automatically lock an account when three unsuccessful logon attempts occur.|None|-|No|
|SV-248654 OL 8 systems below version 8.2 must automatically lock an account when three unsuccessful logon attempts occur during a 15-minute time period.|None|-|No|
|SV-248655 OL 8 systems, versions 8.2 and above, must automatically lock an account when three unsuccessful logon attempts occur during a 15-minute time period.|None|-|No|
|SV-248656 OL 8 systems below version 8.2 must automatically lock an account until the locked account is released by an administrator when three unsuccessful logon attempts occur during a 15-minute time period.|None|-|No|
|SV-248657 OL 8 systems, versions 8.2 and above, must automatically lock an account until the locked account is released by an administrator when three unsuccessful logon attempts occur during a 15-minute time period.|None|-|No|
|SV-248660 OL 8 systems below version 8.2 must prevent system messages from being presented when three unsuccessful logon attempts occur.|None|-|No|
|SV-248661 OL 8 systems, versions 8.2 and above, must prevent system messages from being presented when three unsuccessful logon attempts occur.|None|-|No|
|SV-248662 OL 8 systems below version 8.2 must log user name information when unsuccessful logon attempts occur.|None|-|No|
|SV-248663 OL 8 systems, versions 8.2 and above, must log user name information when unsuccessful logon attempts occur.|None|-|No|
|SV-248664 OL 8 systems below version 8.2 must include root when automatically locking an account until the locked account is released by an administrator when three unsuccessful logon attempts occur during a 15-minute time period.|None|-|No|
|SV-248665 OL 8 systems, versions 8.2 and above, must include root when automatically locking an account until the locked account is released by an administrator when three unsuccessful logon attempts occur during a 15-minute time period.|None|-|No|
|SV-248666 OL 8 must limit the number of concurrent sessions to 10 for all accounts and/or account types.|None|-|No|
|SV-248673 OL 8 must disable the user list at logon for graphical user interfaces.|None|-|No|
|SV-248679 OL 8 must be able to initiate directly a session lock for all connection types using smartcard when the smartcard is removed.|None|-|No|
|SV-248682 OL 8 must prevent a user from overriding the session lock-delay setting for the graphical user interface.|None|-|No|
|SV-248684 OL 8 must prevent a user from overriding the session lock-enabled setting for the graphical user interface.|None|-|No|
|SV-248686 OL 8 must ensure the password complexity module is enabled in the password-auth file.|None|-|No|
|SV-248687 OL 8 must enforce password complexity by requiring that at least one uppercase character be used.|None|-|No|
|SV-248688 OL 8 must enforce password complexity by requiring that at least one lowercase character be used.|None|-|No|
|SV-248689 OL 8 must enforce password complexity by requiring that at least one numeric character be used.|None|-|No|
|SV-248690 OL 8 must require the maximum number of repeating characters of the same character class be limited to four when passwords are changed.|None|-|No|
|SV-248691 OL 8 must require the maximum number of repeating characters be limited to three when passwords are changed.|None|-|No|
|SV-248692 OL 8 must require the change of at least four character classes when passwords are changed.|None|-|No|
|SV-248693 OL 8 must require the change of at least eight characters when passwords are changed.|None|-|No|
|SV-248694 OL 8 passwords for new users or password changes must have a 24 hours/one day minimum password lifetime restriction in "/etc/shadow".|None|-|No|
|SV-248695 OL 8 passwords for new users or password changes must have a 24 hours/one day minimum password lifetime restriction in "/etc/login.defs".|None|-|No|
|SV-248696 OL 8 user account passwords must have a 60-day maximum password lifetime restriction.|None|-|No|
|SV-248697 OL 8 user account passwords must be configured so that existing passwords are restricted to a 60-day maximum lifetime.|None|-|No|
|SV-248699 OL 8 passwords must have a minimum of 15 characters.|None|-|No|
|SV-248700 OL 8 passwords for new users must have a minimum of 15 characters.|None|-|No|
|SV-248701 OL 8 duplicate User IDs (UIDs) must not exist for interactive users.|None|-|No|
|SV-248705 The OL 8 lastlog command must have a mode of "0750" or less permissive.|None|-|Yes|
|SV-248706 The OL 8 lastlog command must be owned by root.|None|-|Yes|
|SV-248707 The OL 8 lastlog command must be group-owned by root.|None|-|Yes|
|SV-248709 All OL 8 passwords must contain at least one special character.|None|-|No|
|SV-248710 OL 8 must prohibit the use of cached authentications after one day.|None|-|No|
|SV-248711 OL 8 must prevent the use of dictionary words for passwords.|None|-|No|
|SV-248712 OL 8 must enforce a delay of at least four seconds between logon prompts following a failed logon attempt.|None|-|No|
|SV-248714 OL 8 must not allow accounts configured with blank or null passwords.|None|-|No|
|SV-248715 OL 8 must not allow blank or null passwords in the system-auth file.|None|-|No|
|SV-248716 OL 8 must not allow blank or null passwords in the password-auth file.|None|-|No|
|SV-248718 OL 8 must display the date and time of the last successful account logon upon an SSH logon.|None|-|No|
|SV-248719 OL 8 default permissions must be defined in such a way that all authenticated users can read and modify only their own files.|None|-|No|
|SV-248722 The OL 8 audit system must be configured to audit the execution of privileged functions and prevent all software from executing at higher privilege levels than users executing the software.|None|-|No|
|SV-248724 The OL 8 System Administrator (SA) and Information System Security Officer (ISSO) (at a minimum) must be alerted of an audit processing failure event.|None|-|No|
|SV-248725 The OL 8 Information System Security Officer (ISSO) and System Administrator (SA) (at a minimum) must have mail aliases to be notified of an audit processing failure.|None|-|No|
|SV-248726 The OL 8 System must take appropriate action when an audit processing failure occurs.|None|-|No|
|SV-248728 The OL 8 audit system must take appropriate action when the audit storage volume is full.|None|-|No|
|SV-248729 The OL 8 audit system must audit local events.|None|-|No|
|SV-248730 OL 8 must label all offloaded audit logs before sending them to the central log server.|None|-|No|
|SV-248731 OL 8 must resolve audit information before writing to disk.|None|-|No|
|SV-248732 OL 8 audit logs must have a mode of "0600" or less permissive to prevent unauthorized read access.|None|-|No|
|SV-248733 OL 8 audit logs must be owned by root to prevent unauthorized read access.|None|-|No|
|SV-248734 OL 8 audit logs must be group-owned by root to prevent unauthorized read access.|None|-|No|
|SV-248735 The OL 8 audit log directory must be owned by root to prevent unauthorized read access.|None|-|No|
|SV-248736 The OL 8 audit log directory must be group-owned by root to prevent unauthorized read access.|None|-|No|
|SV-248737 The OL 8 audit log directory must have a mode of 0700 or less permissive to prevent unauthorized read access.|None|-|No|
|SV-248738 The OL 8 audit system must protect auditing rules from unauthorized change.|None|-|No|
|SV-248739 The OL 8 audit system must protect logon UIDs from unauthorized change.|None|-|No|
|SV-248740 OL 8 must generate audit records for all account creation events that affect "/etc/shadow".|None|-|No|
|SV-248741 OL 8 must generate audit records for all account creation events that affect "/etc/security/opasswd".|None|-|No|
|SV-248742 OL 8 must generate audit records for all account creation events that affect "/etc/passwd".|None|-|No|
|SV-248743 OL 8 must generate audit records for all account creation events that affect "/etc/gshadow".|None|-|No|
|SV-248744 OL 8 must generate audit records for all account creation events that affect "/etc/group".|None|-|No|
|SV-248745 OL 8 must generate audit records for all account creations, modifications, disabling, and termination events that affect "/etc/sudoers".|None|-|No|
|SV-248746 OL 8 must generate audit records for all account creations, modifications, disabling, and termination events that affect "/etc/sudoers.d/".|None|-|No|
|SV-248747 OL 8 must generate audit records for any use of the "su" command.|None|-|No|
|SV-248748 The OL 8 audit system must be configured to audit any use of the "setxattr", "fsetxattr", "lsetxattr", "removexattr", "fremovexattr", and "lremovexattr" system calls.|None|-|No|
|SV-248753 OL 8 must generate audit records for any use of the "chage" command.|None|-|No|
|SV-248754 OL 8 must generate audit records for any uses of the "chcon" command.|None|-|No|
|SV-248756 OL 8 must generate audit records for any use of the "ssh-agent" command.|None|-|No|
|SV-248757 OL 8 must generate audit records for any use of the "passwd" command.|None|-|No|
|SV-248758 OL 8 must generate audit records for any use of the "mount" command.|None|-|No|
|SV-248759 OL 8 must generate audit records for any use of the "umount" command.|None|-|No|
|SV-248760 OL 8 must generate audit records for any use of the "mount" syscall.|None|-|No|
|SV-248761 OL 8 must generate audit records for any use of the "unix\_update" command.|None|-|No|
|SV-248762 OL 8 must generate audit records for any use of the "postdrop" command.|None|-|No|
|SV-248763 OL 8 must generate audit records for any use of the "postqueue" command.|None|-|No|
|SV-248764 OL 8 must generate audit records for any use of the "semanage" command.|None|-|No|
|SV-248765 OL 8 must generate audit records for any use of the "setfiles" command.|None|-|No|
|SV-248766 OL 8 must generate audit records for any use of the "userhelper" command.|None|-|No|
|SV-248767 OL 8 must generate audit records for any use of the "setsebool" command.|None|-|No|
|SV-248768 OL 8 must generate audit records for any use of the "unix\_chkpwd" command.|None|-|No|
|SV-248769 OL 8 must generate audit records for any use of the "ssh-keysign" command.|None|-|No|
|SV-248770 OL 8 must generate audit records for any use of the "setfacl" command.|None|-|No|
|SV-248771 OL 8 must generate audit records for any use of the "pam\_timestamp\_check" command.|None|-|No|
|SV-248772 OL 8 must generate audit records for any use of the "newgrp" command.|None|-|No|
|SV-248773 OL 8 must generate audit records for any use of the "init\_module" and "finit\_module" system calls.|None|-|No|
|SV-248774 OL 8 must generate audit records for any use of the "rename", "unlink", "rmdir", "renameat", and "unlinkat" system calls.|None|-|No|
|SV-248779 OL 8 must generate audit records for any use of the "gpasswd" command.|None|-|No|
|SV-248781 OL 8 must generate audit records for any use of the delete\_module syscall.|None|-|No|
|SV-248782 OL 8 must generate audit records for any use of the "crontab" command.|None|-|No|
|SV-248783 OL 8 must generate audit records for any use of the "chsh" command.|None|-|No|
|SV-248784 OL 8 must generate audit records for any use of the "truncate", "ftruncate", "creat", "open", "openat", and "open\_by\_handle\_at" system calls.|None|-|No|
|SV-248790 OL 8 must generate audit records for any use of the "chown", "fchown", "fchownat", and "lchown" system calls.|None|-|No|
|SV-248791 OL 8 must generate audit records for any use of the "chmod", "fchmod", and "fchmodat" system calls.|None|-|No|
|SV-248797 OL 8 must generate audit records for any use of the "sudo" command.|None|-|No|
|SV-248798 OL 8 must generate audit records for any use of the "usermod" command.|None|-|No|
|SV-248799 OL 8 must generate audit records for any use of the "chacl" command.|None|-|No|
|SV-248800 OL 8 must generate audit records for any use of the "kmod" command.|None|-|No|
|SV-248802 OL 8 must generate audit records for any attempted modifications to the "lastlog" file.|None|-|No|
|SV-248806 OL 8 must allow only the Information System Security Manager (ISSM) (or individuals or roles appointed by the ISSM) to select which auditable events are to be audited.|None|-|Yes|
|SV-248807 OL 8 audit tools must have a mode of "0755" or less permissive.|None|-|Yes|
|SV-248808 OL 8 audit tools must be owned by root.|None|-|Yes|
|SV-248809 OL 8 audit tools must be group-owned by root.|None|-|Yes|
|SV-248812 OL 8 must have the packages required for offloading audit logs installed.|None|-|No|
|SV-248813 OL 8 must have the packages required for encrypting offloaded audit logs installed.|None|-|No|
|SV-248815 OL 8 must take appropriate action when the internal event queue is full.|None|-|No|
|SV-248817 OL 8 must authenticate the remote logging server for offloading audit logs.|None|-|No|
|SV-248818 OL 8 must take action when allocated audit record storage volume reaches 75 percent of the repository maximum audit record storage capacity.|None|-|No|
|SV-248819 OL 8 must notify the System Administrator (SA) and Information System Security Officer (ISSO) (at a minimum) when allocated audit record storage volume 75 percent utilization.|None|-|No|
|SV-248821 OL 8 must disable the chrony daemon from acting as a server.|None|-|No|
|SV-248822 OL 8 must disable network management of the chrony daemon.|None|-|No|
|SV-248823 OL 8 must not have the telnet-server package installed.|None|-|No|
|SV-248824 OL 8 must not have any automated bug reporting tools installed.|None|-|No|
|SV-248825 OL 8 must not have the sendmail package installed.|None|-|No|
|SV-248829 OL 8 must not have the asynchronous transfer mode (ATM) kernel module installed if not required for operational support.|None|-|No|
|SV-248830 OL 8 must not have the Controller Area Network (CAN) kernel module installed if not required for operational support.|None|-|No|
|SV-248831 OL 8 must not have the stream control transmission protocol (SCTP) kernel module installed if not required for operational support.|None|-|No|
|SV-248832 OL 8 must disable the transparent inter-process communication (TIPC) protocol.|None|-|No|
|SV-248833 OL 8 must disable mounting of cramfs.|None|-|No|
|SV-248834 OL 8 must disable IEEE 1394 (FireWire) Support.|None|-|No|
|SV-248836 The OL 8 file system automounter must be disabled.|None|-|No|
|SV-248837 OL 8 must be configured to disable the ability to use USB mass storage devices.|None|-|No|
|SV-248840 A firewall must be installed on OL 8.|None|-|No|
|SV-248841 A firewall must be active on OL 8.|None|-|No|
|SV-248843 OL 8 Bluetooth must be disabled.|None|-|No|
|SV-248844 OL 8 must mount "/dev/shm" with the "nodev" option.|None|-|No|
|SV-248845 OL 8 must mount "/dev/shm" with the "nosuid" option.|None|-|No|
|SV-248846 OL 8 must mount "/dev/shm" with the "noexec" option.|None|-|No|
|SV-248847 OL 8 must mount "/tmp" with the "nodev" option.|None|-|No|
|SV-248848 OL 8 must mount "/tmp" with the "nosuid" option.|None|-|No|
|SV-248849 OL 8 must mount "/tmp" with the "noexec" option.|None|-|No|
|SV-248850 OL 8 must mount "/var/log" with the "nodev" option.|None|-|No|
|SV-248851 OL 8 must mount "/var/log" with the "nosuid" option.|None|-|No|
|SV-248852 OL 8 must mount "/var/log" with the "noexec" option.|None|-|No|
|SV-248853 OL 8 must mount "/var/log/audit" with the "nodev" option.|None|-|No|
|SV-248854 OL 8 must mount "/var/log/audit" with the "nosuid" option.|None|-|No|
|SV-248855 OL 8 must mount "/var/log/audit" with the "noexec" option.|None|-|No|
|SV-248856 OL 8 must mount "/var/tmp" with the "nodev" option.|None|-|No|
|SV-248857 OL 8 must mount "/var/tmp" with the "nosuid" option.|None|-|No|
|SV-248858 OL 8 must mount "/var/tmp" with the "noexec" option.|None|-|No|
|SV-248859 The OL 8 "fapolicy" module must be installed.|None|-|No|
|SV-248860 The OL 8 "fapolicy" module must be enabled.|None|-|No|
|SV-248862 OL 8 must have the USBGuard installed.|None|-|No|
|SV-248864 OL 8 must enable the USBGuard.|None|-|No|
|SV-248865 A firewall must be able to protect against or limit the effects of denial-of-service (DoS) attacks by ensuring OL 8 can implement rate-limiting measures on impacted network interfaces.|None|-|No|
|SV-248866 All OL 8 networked systems must have SSH installed.|None|-|No|
|SV-248867 All OL 8 networked systems must have and implement SSH to protect the confidentiality and integrity of transmitted and received information, as well as information during preparation for transmission.|None|-|No|
|SV-248868 OL 8 must force a frequent session key renegotiation for SSH connections to the server.|None|-|No|
|SV-248869 The x86 Ctrl-Alt-Delete key sequence must be disabled on OL 8.|None|-|No|
|SV-248870 The x86 Ctrl-Alt-Delete key sequence in OL 8 must be disabled if a graphical user interface is installed.|None|-|No|
|SV-248871 OL 8 must disable the systemd Ctrl-Alt-Delete burst key sequence.|None|-|No|
|SV-248872 OL 8 must disable the debug-shell systemd service.|None|-|No|
|SV-248873 The Trivial File Transfer Protocol (TFTP) server package must not be installed if not required for OL 8 operational support.|None|-|No|
|SV-248874 The root account must be the only account having unrestricted access to the OL 8 system.|None|-|No|
|SV-248875 OL 8 must prevent IPv4 Internet Control Message Protocol (ICMP) redirect messages from being accepted.|None|-|Yes|
|SV-248876 OL 8 must prevent IPv6 Internet Control Message Protocol (ICMP) redirect messages from being accepted.|None|-|Yes|
|SV-248877 OL 8 must not send Internet Control Message Protocol (ICMP) redirects.|None|-|Yes|
|SV-248878 OL 8 must not respond to Internet Control Message Protocol (ICMP) echoes sent to a broadcast address.|None|-|Yes|
|SV-248879 OL 8 must not forward IPv4 source-routed packets.|None|-|Yes|
|SV-248880 OL 8 must not forward IPv6 source-routed packets.|None|-|Yes|
|SV-248881 OL 8 must not forward IPv4 source-routed packets by default.|None|-|Yes|
|SV-248882 OL 8 must not forward IPv6 source-routed packets by default.|None|-|Yes|
|SV-248883 OL 8 must not enable IPv6 packet forwarding unless the system is a router.|None|-|Yes|
|SV-248884 OL 8 must not accept router advertisements on all IPv6 interfaces.|None|-|Yes|
|SV-248885 OL 8 must not accept router advertisements on all IPv6 interfaces by default.|None|-|Yes|
|SV-248886 OL 8 must not allow interfaces to perform Internet Control Message Protocol (ICMP) redirects by default.|None|-|Yes|
|SV-248887 OL 8 must ignore IPv4 Internet Control Message Protocol (ICMP) redirect messages.|None|-|Yes|
|SV-248888 OL 8 must ignore IPv6 Internet Control Message Protocol (ICMP) redirect messages.|None|-|Yes|
|SV-248889 OL 8 must disable access to the network "bpf" syscall from nonprivileged processes.|None|-|Yes|
|SV-248890 OL 8 must restrict the use of "ptrace" to descendant processes.|None|-|Yes|
|SV-248891 OL 8 must restrict exposed kernel pointer addresses access.|None|-|Yes|
|SV-248892 OL 8 must disable the use of user namespaces.|None|-|Yes|
|SV-248893 OL 8 must use reverse path filtering on all IPv4 interfaces.|None|-|Yes|
|SV-248894 OL 8 must enable hardening for the Berkeley Packet Filter Just-in-time compiler.|None|-|Yes|
|SV-248895 OL 8 must be configured to prevent unrestricted mail relaying.|None|-|No|
|SV-248898 The graphical display manager must not be installed on OL 8 unless approved.|None|-|No|
|SV-248899 OL 8 network interfaces must not be in promiscuous mode.|None|-|No|
|SV-248900 OL 8 remote X connections for interactive users must be disabled unless to fulfill documented and validated mission requirements.|None|-|No|
|SV-248901 The OL 8 SSH daemon must prevent remote hosts from connecting to the proxy display.|None|-|No|
|SV-248902 If the Trivial File Transfer Protocol (TFTP) server is required, the OL 8 TFTP daemon must be configured to operate in secure mode.|None|-|No|
|SV-248903 A File Transfer Protocol (FTP) server package must not be installed unless mission essential on OL 8.|None|-|No|
|SV-248904 OL 8 must not have the "gssproxy" package installed if not required for operational support.|None|-|No|
|SV-248905 OL 8 must not have the "iprutils" package installed if not required for operational support.|None|-|No|
|SV-248906 OL 8 must not have the "tuned" package installed if not required for operational support.|None|-|No|
|SV-252650 The OL 8 operating system must not have accounts configured with blank or null passwords.|None|-|No|
|SV-252651 OL 8 library directories must have mode 755 or less permissive.|None|-|No|
|SV-252652 OL 8 library directories must be owned by root.|None|-|No|
|SV-252653 OL 8 library directories must be group-owned by root or a system account.|None|-|No|
|SV-252656 The OL 8 operating system must not be configured to bypass password requirements for privilege escalation.|None|-|No|
|SV-252657 OL 8 must ensure the password complexity module is enabled in the system-auth file.|None|-|No|
|SV-252658 OL 8 systems below version 8.4 must ensure the password complexity module in the system-auth file is configured for three retries or less.|None|-|No|
|SV-252659 OL 8 systems below version 8.4 must ensure the password complexity module in the password-auth file is configured for three retries or less.|None|-|No|
|SV-252663 The graphical display manager must not be the default target on OL 8 unless approved.|None|-|No|
|SV-257259 OL 8 must terminate idle user sessions.|None|-|No|

### Known assessment discrepancies

> [!NOTE]
> These rules can produce assessment results that differ from the DISA SCAP Compliance Checker (SCC).
> A rule is listed once if a discrepancy was observed in any tested scenario.

Comparison data with DISA SCAP Compliance Checker (SCC) is not available for this benchmark in this release. Assessment differences and unimplemented rules cannot be determined from comparison results.

## DISA STIG Oracle Linux 9 V1R2

### Rules

|Rule|Parameters|Default values|Remediation|
|---|---|---|---|
|SV-271432 OL 9 must use a separate file system for the system audit data path.|None|-|No|
|SV-271433 OL 9 must be configured so that a separate file system must be used for user home directories (such as /home or an equivalent).|None|-|No|
|SV-271434 OL 9 must use a separate file system for /tmp.|None|-|No|
|SV-271435 OL 9 must use a separate file system for /var.|None|-|No|
|SV-271436 OL 9 must use a separate file system for /var/log.|None|-|No|
|SV-271437 OL 9 must use a separate file system for /var/tmp.|None|-|No|
|SV-271438 OL 9 must be a vendor supported release.|None|-|No|
|SV-271440 OL 9 must be configured so that the graphical display manager is not the default target unless approved.|None|-|No|
|SV-271441 OL 9 must require authentication to access emergency mode.|None|-|No|
|SV-271442 OL 9 must require authentication to access single-user mode.|None|-|No|
|SV-271443 OL 9 must be configured to disable the Asynchronous Transfer Mode (ATM) kernel module.|None|-|No|
|SV-271444 OL 9 must be configured to disable the Controller Area Network (CAN) kernel module.|None|-|No|
|SV-271445 OL 9 must be configured to disable the FireWire kernel module.|None|-|No|
|SV-271446 OL 9 must disable the Stream Control Transmission Protocol (SCTP) kernel module.|None|-|No|
|SV-271447 OL 9 must disable the Transparent Inter Process Communication (TIPC) kernel module.|None|-|No|
|SV-271448 OL 9 must disable mounting of cramfs.|None|-|No|
|SV-271449 OL 9 Bluetooth must be disabled.|None|-|No|
|SV-271450 OL 9 must be configured to disable USB mass storage.|None|-|No|
|SV-271452 OL 9 must use a Linux Security Module configured to enforce limits on system services.|None|-|No|
|SV-271453 OL 9 must enable the SELinux targeted policy.|None|-|No|
|SV-271454 OL 9 must enable FIPS mode.|None|-|No|
|SV-271456 OL 9 must not have the nfs-utils package installed.|None|-|No|
|SV-271458 OL 9 must not have the telnet-server package installed.|None|-|No|
|SV-271459 OL 9 must not have the gssproxy package installed.|None|-|No|
|SV-271460 OL 9 must not have the iprutils package installed.|None|-|No|
|SV-271461 OL 9 must not have the tuned package installed.|None|-|No|
|SV-271462 OL 9 must not have a File Transfer Protocol (FTP) server package installed.|None|-|No|
|SV-271463 OL 9 must not have a Trivial File Transfer Protocol (TFTP) server package installed.|None|-|No|
|SV-271464 OL 9 must not have the quagga package installed.|None|-|No|
|SV-271465 OL 9 must not have a graphical display manager installed unless approved.|None|-|No|
|SV-271466 OL 9 must not have the sendmail package installed.|None|-|No|
|SV-271467 OL 9 must have policycoreutils package installed.|None|-|No|
|SV-271468 OL 9 policycoreutils-python-utils package must be installed.|None|-|No|
|SV-271469 OL 9 must have the firewalld package installed.|None|-|No|
|SV-271470 OL 9 must be configured so that the firewalld service is active.|None|-|No|
|SV-271474 OL 9 must have the sudo package installed.|None|-|No|
|SV-271475 OL 9 must use the invoking user's password for privilege escalation when using sudo.|None|-|No|
|SV-271476 OL 9 must restrict privilege elevation to authorized personnel.|None|-|No|
|SV-271477 OL 9 must have the crypto-policies package installed.|None|-|No|
|SV-271482 OL 9 networked systems must have SSH installed.|None|-|No|
|SV-271483 OL 9 networked systems must have and implement SSH to protect the confidentiality and integrity of transmitted and received information, as well as information during preparation for transmission.|None|-|No|
|SV-271484 The OL 9 SSH daemon must be configured to use systemwide cryptographic policies.|None|-|No|
|SV-271485 OL 9 SSH server must be configured to use only ciphers employing FIPS 140-3 validated cryptographic hash algorithms to protect the confidentiality of SSH server connections.|None|-|No|
|SV-271486 OL 9 SSH server must be configured to use only Message Authentication Codes (MACs) employing FIPS 140-3 validated cryptographic hash algorithms to protect the confidentiality of SSH server connections.|None|-|No|
|SV-271487 OL 9 must display the Standard Mandatory DOD Notice and Consent Banner before granting local or remote access to the system via a SSH logon.|None|-|No|
|SV-271488 OL 9 must have the openssh-clients package installed.|None|-|No|
|SV-271489 OL 9 SSH client must be configured to use only DOD-approved encryption ciphers employing FIPS 140-3 validated cryptographic hash algorithms to protect the confidentiality of SSH client connections.|None|-|No|
|SV-271490 OL 9 SSH client must be configured to use only DOD-approved Message Authentication Codes (MACs) employing FIPS 140-3 validated cryptographic hash algorithms to protect the confidentiality of SSH client connections.|None|-|No|
|SV-271491 OL 9 must have the openssl-pkcs11 package installed.|None|-|No|
|SV-271493 OL 9 must have the SSSD package installed.|None|-|No|
|SV-271494 OL 9 must use the SSSD package for multifactor authentication services.|None|-|No|
|SV-271495 OL 9 must have the s-nail package installed.|None|-|No|
|SV-271496 OL 9 must have the Advanced Intrusion Detection Environment (AIDE) package installed.|None|-|Yes|
|SV-271501 OL 9 must have the chrony package installed.|None|-|No|
|SV-271502 OL 9 must enable the chronyd service.|None|-|No|
|SV-271503 OL 9 must have the USBGuard package installed.|None|-|No|
|SV-271504 OL 9 must enable the USBGuard package.|None|-|No|
|SV-271505 OL 9 must have the subscription-manager package installed.|None|-|No|
|SV-271506 OL 9 must have the fapolicy module installed.|None|-|No|
|SV-271507 OL 9 must enable the fapolicy module.|None|-|No|
|SV-271508 OL 9 must have the rsyslog package installed.|None|-|No|
|SV-271509 OL 9 must be configured so that the rsyslog service is active.|None|-|No|
|SV-271510 OL 9 must have the packages required for encrypting offloaded audit logs installed.|None|-|No|
|SV-271511 OL 9 must enable the hardware random number generator entropy gatherer service.|None|-|No|
|SV-271512 OL 9 must have the rng-tools package installed.|None|-|No|
|SV-271513 OL 9 must have the nss-tools package installed.|None|-|No|
|SV-271514 OL 9 must have the pcsc-lite package installed.|None|-|No|
|SV-271515 OL 9 must have the opensc package installed.|None|-|No|
|SV-271516 OL 9 must be configured so that the pcscd service is active.|None|-|No|
|SV-271517 OL 9 must have the libreswan package installed.|None|-|No|
|SV-271518 OL 9 must have the gnutls-utils package installed.|None|-|No|
|SV-271519 OL 9 must have the audit package installed.|None|-|No|
|SV-271520 OL 9 audit service must be enabled.|None|-|No|
|SV-271521 OL 9 must have the audispd-plugins package installed.|None|-|No|
|SV-271522 OL 9 must remove all software components after updated versions have been installed.|None|-|No|
|SV-271523 OL 9 must check the GPG signature of locally installed software packages before installation.|None|-|No|
|SV-271524 OL 9 must check the GPG signature of software packages originating from external software repositories before installation.|None|-|No|
|SV-271525 OL 9 must have GPG signature verification enabled for all software repositories.|None|-|No|
|SV-271527 OL 9 must generate audit records for all account creations, modifications, disabling, and termination events that affect /etc/sudoers.|None|-|No|
|SV-271528 OL 9 must generate audit records for all account creations, modifications, disabling, and termination events that affect /etc/sudoers.d/ directory.|None|-|No|
|SV-271529 OL 9 must generate audit records for all account creations, modifications, disabling, and termination events that affect /etc/group.|None|-|No|
|SV-271530 OL 9 must generate audit records for all account creations, modifications, disabling, and termination events that affect /etc/gshadow.|None|-|No|
|SV-271531 OL 9 must generate audit records for all account creations, modifications, disabling, and termination events that affect /etc/opasswd.|None|-|No|
|SV-271532 OL 9 must generate audit records for all account creations, modifications, disabling, and termination events that affect /etc/passwd.|None|-|No|
|SV-271533 OL 9 must generate audit records for all account creations, modifications, disabling, and termination events that affect /etc/shadow.|None|-|No|
|SV-271534 OL 9 must audit all uses of the unix\_update command.|None|-|No|
|SV-271535 OL 9 must audit all uses of the su command.|None|-|No|
|SV-271536 OL 9 must audit all uses of the setxattr, fsetxattr, lsetxattr, removexattr, fremovexattr, and lremovexattr system calls.|None|-|No|
|SV-271537 OL 9 must audit all uses of the chage command.|None|-|No|
|SV-271538 OL 9 must audit all uses of the chcon command.|None|-|No|
|SV-271539 OL 9 must audit all uses of the setfacl command.|None|-|No|
|SV-271540 OL 9 must audit all uses of the chsh command.|None|-|No|
|SV-271541 OL 9 must audit all uses of the crontab command.|None|-|No|
|SV-271542 OL 9 must audit all uses of the gpasswd command.|None|-|No|
|SV-271543 OL 9 must audit all uses of the newgrp command.|None|-|No|
|SV-271544 OL 9 must audit all uses of the pam\_timestamp\_check command.|None|-|No|
|SV-271545 OL 9 must audit all uses of the passwd command.|None|-|No|
|SV-271546 OL 9 must audit all uses of the postdrop command.|None|-|No|
|SV-271547 OL 9 must audit all uses of the postqueue command.|None|-|No|
|SV-271548 OL 9 must audit all uses of the ssh-agent command.|None|-|No|
|SV-271549 OL 9 must audit all uses of the ssh-keysign command.|None|-|No|
|SV-271550 OL 9 must audit all uses of the sudoedit command.|None|-|No|
|SV-271551 OL 9 must audit all uses of the unix\_chkpwd command.|None|-|No|
|SV-271552 OL 9 must audit all uses of the userhelper command.|None|-|No|
|SV-271553 OL 9 must audit all uses of the mount command.|None|-|No|
|SV-271554 OL 9 must audit all uses of the truncate, ftruncate, creat, open, openat, and open\_by\_handle\_at system calls.|None|-|No|
|SV-271555 OL 9 must audit all uses of the chmod, fchmod, and fchmodat system calls.|None|-|No|
|SV-271556 OL 9 must audit all uses of the chown, fchown, fchownat, and lchown system calls.|None|-|No|
|SV-271557 OL 9 must audit all uses of the semanage command.|None|-|No|
|SV-271558 OL 9 must audit all uses of the setfiles command.|None|-|No|
|SV-271559 OL 9 must audit all uses of the setsebool command.|None|-|No|
|SV-271560 OL 9 must audit all uses of the chacl command.|None|-|No|
|SV-271561 OL 9 must audit all uses of the sudo command.|None|-|No|
|SV-271562 OL 9 must audit all uses of the usermod command.|None|-|No|
|SV-271563 OL 9 must audit all uses of the rename, unlink, rmdir, renameat, and unlinkat system calls.|None|-|No|
|SV-271564 OL 9 must audit all uses of the delete\_module system call.|None|-|No|
|SV-271565 OL 9 must audit all uses of the init\_module and finit\_module system calls.|None|-|No|
|SV-271566 OL 9 must audit all uses of the kmod command.|None|-|No|
|SV-271567 OL 9 must generate audit records for all account creations, modifications, disabling, and termination events that affect /var/log/lastlog.|None|-|No|
|SV-271568 OL 9 must audit all uses of umount system calls.|None|-|No|
|SV-271569 OL 9 must use cryptographic mechanisms to protect the integrity of audit tools.|None|-|No|
|SV-271570 OL 9 must audit uses of the execve system call.|None|-|No|
|SV-271571 OL 9 must generate audit records for all account creations, modifications, disabling, and termination events that affect /var/log/faillock.|None|-|No|
|SV-271572 OL 9 must generate audit records for all account creations, modifications, disabling, and termination events that affect /var/log/tallylog.|None|-|No|
|SV-271573 OL 9 must be configured so that successful/unsuccessful uses of the init command generate an audit record.|None|-|No|
|SV-271574 OL 9 must be configured so that successful/unsuccessful uses of the poweroff command generate an audit record.|None|-|No|
|SV-271575 OL 9 must be configured so that successful/unsuccessful uses of the reboot command generate an audit record.|None|-|No|
|SV-271576 OL 9 must be configured so that successful/unsuccessful uses of the shutdown command generate an audit record.|None|-|No|
|SV-271577 OL 9 must enable auditing of processes that start prior to the audit daemon.|None|-|No|
|SV-271578 OL 9 must label all offloaded audit logs before sending them to the central log server.|None|-|No|
|SV-271579 OL 9 audit system must take appropriate action when an error writing to the audit storage volume occurs.|None|-|No|
|SV-271580 OL 9 audit system must take appropriate action when the audit storage volume is full.|None|-|No|
|SV-271581 OL 9 audit system must take appropriate action when the audit files have reached maximum size.|None|-|No|
|SV-271582 OL 9 must periodically flush audit records to disk to prevent the loss of audit records.|None|-|No|
|SV-271583 OL 9 audit logs must be group-owned by root or by a restricted logging group to prevent unauthorized read access.|None|-|No|
|SV-271584 OL 9 audit log directory must be owned by root to prevent unauthorized read access.|None|-|No|
|SV-271585 OL 9 audit logs file must have mode 0600 or less permissive to prevent unauthorized access to the audit log.|None|-|No|
|SV-271586 OL 9 audit system must audit local events.|None|-|No|
|SV-271587 OL 9 must allow only the information system security manager (ISSM) (or individuals or roles appointed by the ISSM) to select which auditable events are to be audited.|None|-|Yes|
|SV-271588 OL 9 /etc/audit/auditd.conf file must have 0640 or less permissive to prevent unauthorized access.|None|-|Yes|
|SV-271589 OL 9 must forward mail from postmaster to the root account using a postfix alias.|None|-|No|
|SV-271590 OL 9 must take appropriate action when a critical audit processing failure occurs.|None|-|No|
|SV-271591 The OL 9 system administrator (SA) and/or information system security officer (ISSO) (at a minimum) must be alerted of an audit processing failure event.|None|-|No|
|SV-271592 OL 9 must allocate an audit\_backlog\_limit of sufficient size to capture processes that start prior to the audit daemon.|None|-|No|
|SV-271593 OL 9 must produce audit records containing information to establish the identity of any individual or process associated with the event.|None|-|No|
|SV-271594 OL 9 must be configured so that successful/unsuccessful uses of the umount system call generate an audit record.|None|-|No|
|SV-271595 OL 9 must be configured so that successful/unsuccessful uses of the umount2 system call generate an audit record.|None|-|No|
|SV-271596 OL 9 must allocate audit record storage capacity to store at least one week's worth of audit records.|None|-|No|
|SV-271597 OL 9 must be configured to offload audit records onto a different system from the system being audited via syslog.|None|-|No|
|SV-271598 OL 9 must take appropriate action when the internal event queue is full.|None|-|No|
|SV-271599 OL 9 must take action when allocated audit record storage volume reaches 75 percent of the repository maximum audit record storage capacity.|None|-|No|
|SV-271600 OL 9 must notify the system administrator (SA) and information system security officer (ISSO) (at a minimum) when allocated audit record storage volume reaches 75 percent utilization.|None|-|No|
|SV-271601 OL 9 must take action when allocated audit record storage volume reaches 95 percent of the audit record storage capacity.|None|-|No|
|SV-271602 OL 9 must write audit records to disk.|None|-|No|
|SV-271603 OL 9 must act when allocated audit record storage volume reaches 95 percent of the repository maximum audit record storage capacity.|None|-|No|
|SV-271607 OL 9 must enable certificate-based smart card authentication.|None|-|No|
|SV-271608 OL 9 must implement certificate status checking for multifactor authentication (MFA).|None|-|No|
|SV-271609 OL 9 must prohibit the use of cached authenticators after one day.|None|-|No|
|SV-271610 OL 9 must use the CAC smart card driver.|None|-|No|
|SV-271611 OL 9 must ensure the password complexity module is enabled in the system-auth file.|None|-|No|
|SV-271612 OL 9 must ensure the password complexity module in the system-auth file is configured for three retries or less.|None|-|No|
|SV-271613 OL 9 must enforce password complexity by requiring that at least one uppercase character be used.|None|-|No|
|SV-271614 OL 9 must ensure the password complexity module is enabled in the password-auth file.|None|-|No|
|SV-271615 OL 9 must enforce password complexity by requiring that at least one lowercase character be used.|None|-|No|
|SV-271616 OL 9 must enforce password complexity by requiring that at least one numeric character be used.|None|-|No|
|SV-271617 OL 9 must require the change of at least eight characters when passwords are changed.|None|-|No|
|SV-271618 OL 9 must require the maximum number of repeating characters of the same character class be limited to four when passwords are changed.|None|-|No|
|SV-271619 OL 9 must require the maximum number of repeating characters be limited to three when passwords are changed.|None|-|No|
|SV-271620 OL 9 must require the change of at least four character classes when passwords are changed.|None|-|No|
|SV-271621 OL 9 must enforce password complexity rules for the root account.|None|-|No|
|SV-271622 OL 9 must be configured so that user and group account administration utilities are configured to store only encrypted representations of passwords.|None|-|No|
|SV-271623 OL 9 must be configured to use the shadow file to store only encrypted representations of passwords.|None|-|No|
|SV-271624 OL 9 pam\_unix.so module must be configured in the password-auth file to use a FIPS 140-3 approved cryptographic hashing algorithm for system authentication.|None|-|No|
|SV-271625 OL 9 password-auth must be configured to use a sufficient number of hashing rounds.|None|-|No|
|SV-271626 OL 9 system-auth must be configured to use a sufficient number of hashing rounds.|None|-|No|
|SV-271627 OL 9 shadow password suite must be configured to use a sufficient number of hashing rounds.|None|-|No|
|SV-271628 OL 9 must employ FIPS 140-3 approved cryptographic hashing algorithms for all stored passwords.|None|-|No|
|SV-271629 OL 9 passwords for new users or password changes must have a 24-hour minimum password lifetime restriction in /etc/login.defs.|None|-|No|
|SV-271630 OL 9 passwords must have a 24-hour minimum password lifetime restriction in /etc/shadow.|None|-|No|
|SV-271631 OL 9 user account passwords for new users or password changes must have a 60-day maximum password lifetime restriction in /etc/login.defs.|None|-|No|
|SV-271632 OL 9 user account passwords must have a 60-day maximum password lifetime restriction.|None|-|No|
|SV-271633 OL 9 passwords must be created with a minimum of 15 characters.|None|-|No|
|SV-271634 OL 9 must not allow blank or null passwords.|None|-|No|
|SV-271635 OL 9 must require a boot loader superuser password.|None|-|No|
|SV-271636 OL 9 must enforce password complexity by requiring that at least one special character be used.|None|-|No|
|SV-271637 OL 9 must prevent the use of dictionary words for passwords.|None|-|No|
|SV-271638 OL 9 must not have accounts configured with blank or null passwords.|None|-|No|
|SV-271639 OL 9 file system automount function must be disabled unless required.|None|-|No|
|SV-271641 OL 9 must prevent special devices on file systems that are imported via Network File System (NFS).|None|-|No|
|SV-271642 OL 9 must prevent code from being executed on file systems that are imported via Network File System (NFS).|None|-|No|
|SV-271643 OL 9 must prevent files with the setuid and setgid bit set from being executed on file systems that are imported via Network File System (NFS).|None|-|No|
|SV-271647 OL 9 must mount /boot with the nodev option.|None|-|No|
|SV-271648 OL 9 must prevent files with the setuid and setgid bit set from being executed on the /boot directory.|None|-|No|
|SV-271649 OL 9 must prevent files with the setuid and setgid bit set from being executed on the /boot/efi directory.|None|-|No|
|SV-271650 OL 9 must mount /dev/shm with the nodev option.|None|-|No|
|SV-271651 OL 9 must mount /dev/shm with the noexec option.|None|-|No|
|SV-271652 OL 9 must mount /dev/shm with the nosuid option.|None|-|No|
|SV-271653 OL 9 must mount /tmp with the nodev option.|None|-|No|
|SV-271654 OL 9 must mount /tmp with the noexec option.|None|-|No|
|SV-271655 OL 9 must mount /tmp with the nosuid option.|None|-|No|
|SV-271656 OL 9 must mount /var with the nodev option.|None|-|No|
|SV-271657 OL 9 must mount /var/log with the nodev option.|None|-|No|
|SV-271658 OL 9 must mount /var/log with the noexec option.|None|-|No|
|SV-271659 OL 9 must mount /var/log with the nosuid option.|None|-|No|
|SV-271660 OL 9 must mount /var/log/audit with the nodev option.|None|-|No|
|SV-271661 OL 9 must mount /var/log/audit with the noexec option.|None|-|No|
|SV-271662 OL 9 must mount /var/log/audit with the nosuid option.|None|-|No|
|SV-271663 OL 9 must mount /var/tmp with the nodev option.|None|-|No|
|SV-271664 OL 9 must mount /var/tmp with the noexec option.|None|-|No|
|SV-271665 OL 9 must mount /var/tmp with the nosuid option.|None|-|No|
|SV-271666 OL 9 must prevent device files from being interpreted on file systems that contain user home directories.|None|-|No|
|SV-271667 OL 9 must prevent files with the setuid and setgid bit set from being executed on file systems that contain user home directories.|None|-|No|
|SV-271668 OL 9 must prevent code from being executed on file systems that contain user home directories.|None|-|No|
|SV-271669 OL 9 must prevent special devices on nonroot local partitions.|None|-|No|
|SV-271670 OL 9 must disable the graphical user interface automount function unless required.|None|-|No|
|SV-271678 OL 9 must prevent a user from overriding the disabling of the graphical user interface automount function.|None|-|No|
|SV-271679 OL 9 must prevent a user from overriding the disabling of the graphical user interface autorun function.|None|-|No|
|SV-271680 OL 9 must prevent a user from overriding the banner-message-enable setting for the graphical user interface.|None|-|No|
|SV-271681 OL 9 must prevent a user from overriding the screensaver lock-enabled setting for the graphical user interface.|None|-|No|
|SV-271682 OL 9 must prevent a user from overriding the session idle-delay setting for the graphical user interface.|None|-|No|
|SV-271683 OL 9 must prevent a user from overriding the session lock-delay setting for the graphical user interface.|None|-|No|
|SV-271684 OL 9 must prevent a user from overriding the disabling of the graphical user smart card removal action.|None|-|No|
|SV-271685 OL 9 must disable the ability of a user to restart the system from the login screen.|None|-|No|
|SV-271686 OL 9 must prevent a user from overriding the disable-restart-buttons setting for the graphical user interface.|None|-|No|
|SV-271687 OL 9 must prevent a user from overriding the Ctrl-Alt-Del sequence settings for the graphical user interface.|None|-|No|
|SV-271688 OL 9 must be configured to enable the display of the Standard Mandatory DOD Notice and Consent Banner before granting local or remote access to the system via a graphical user logon.|None|-|No|
|SV-271690 OL 9 must be able to directly initiate a session lock for all connection types using smart card when the smart card is removed.|None|-|No|
|SV-271691 OL 9 must not allow unattended or automatic logon via the graphical user interface.|None|-|No|
|SV-271693 OL 9 must define default permissions for the bash shell.|None|-|No|
|SV-271694 OL 9 must define default permissions for the c shell.|None|-|No|
|SV-271695 OL 9 must define default permissions for the system default profile.|None|-|No|
|SV-271696 OL 9 must define default permissions for all authenticated users in such a way that the user can only read and modify their own files.|None|-|No|
|SV-271697 OL 9 must disable the chrony daemon from acting as a server.|None|-|No|
|SV-271698 OL 9 must disable network management of the chrony daemon.|None|-|No|
|SV-271700 OL 9 must enable Linux audit logging for the USBGuard daemon.|None|-|No|
|SV-271703 OL 9 must log SSH connection attempts and failures to the server.|None|-|No|
|SV-271704 OL 9 SSH daemon must not allow Generic Security Service Application Program Interface (GSSAPI) authentication.|None|-|No|
|SV-271705 OL 9 must force a frequent session key renegotiation for SSH connections to the server.|None|-|No|
|SV-271706 OL 9 SSHD must not allow blank passwords.|None|-|No|
|SV-271707 OL 9 must enable the Pluggable Authentication Module (PAM) interface for SSHD.|None|-|No|
|SV-271708 OL 9 must not permit direct logons to the root account using remote access via SSH.|None|-|No|
|SV-271709 OL 9 must be configured so that all network connections associated with SSH traffic terminate after becoming unresponsive.|None|-|No|
|SV-271710 OL 9 must be configured so that all network connections associated with SSH traffic are terminated after 10 minutes of becoming unresponsive.|None|-|No|
|SV-271711 OL 9 SSH daemon must not allow rhosts authentication.|None|-|No|
|SV-271712 OL 9 SSH daemon must not allow known hosts authentication.|None|-|No|
|SV-271713 OL 9 SSH daemon must disable remote X connections for interactive users.|None|-|No|
|SV-271714 OL 9 SSH daemon must perform strict mode checking of home directory configuration files.|None|-|No|
|SV-271715 OL 9 SSH daemon must display the date and time of the last successful account logon upon an SSH logon.|None|-|No|
|SV-271716 OL 9 SSH daemon must prevent remote hosts from connecting to the proxy display.|None|-|No|
|SV-271717 OL 9 SSH daemon must not allow compression or must only allow compression after successful authentication.|None|-|No|
|SV-271718 OL 9 SSH daemon must not allow Kerberos authentication.|None|-|No|
|SV-271719 OL 9 must not allow a noncertificate trusted host SSH logon to the system.|None|-|No|
|SV-271720 OL 9 must not allow users to override SSH environment variables.|None|-|No|
|SV-271721 OL 9 SSHD must accept public key authentication.|None|-|No|
|SV-271722 OL 9 must require reauthentication when using the "sudo" command.|None|-|No|
|SV-271723 OL 9 must restrict the use of the su command.|None|-|No|
|SV-271724 OL 9 must require users to reauthenticate for privilege escalation.|None|-|No|
|SV-271725 OL 9 must require users to provide a password for privilege escalation.|None|-|No|
|SV-271726 OL 9 must not be configured to bypass password requirements for privilege escalation.|None|-|No|
|SV-271727 OL 9 must disable the use of user namespaces.|None|-|Yes|
|SV-271728 OL 9 must disable the kernel.core\_pattern.|None|-|No|
|SV-271729 OL 9 must disable core dump backtraces.|None|-|No|
|SV-271730 OL 9 must disable storing core dumps.|None|-|No|
|SV-271731 OL 9 must disable core dumps for all users.|None|-|No|
|SV-271732 OL 9 must disable acquiring, saving, and processing core dumps.|None|-|No|
|SV-271733 OL 9 must be configured so that the kdump service is disabled.|None|-|No|
|SV-271734 OL 9 must clear SLUB/SLAB objects to prevent use-after-free attacks.|None|-|No|
|SV-271735 OL 9 must enable mitigations against processor-based vulnerabilities.|None|-|No|
|SV-271736 OL 9 must disable the ability of systemd to spawn an interactive boot process.|None|-|No|
|SV-271737 OL 9 must disable virtual system calls.|None|-|No|
|SV-271738 OL 9 must clear the page allocator to prevent use-after-free attacks.|None|-|No|
|SV-271739 OL 9 systemd-journald service must be enabled.|None|-|No|
|SV-271740 OL 9 must enable kernel parameters to enforce discretionary access control on hardlinks.|None|-|Yes|
|SV-271741 OL 9 must enable kernel parameters to enforce discretionary access control on symlinks.|None|-|Yes|
|SV-271742 OL 9 debug-shell systemd service must be disabled.|None|-|No|
|SV-271743 OL 9 IP tunnels must use 140-3 approved cryptographic algorithms.|None|-|No|
|SV-271745 OL 9 must restrict access to the kernel message buffer.|None|-|Yes|
|SV-271746 OL 9 must prevent kernel profiling by nonprivileged users.|None|-|Yes|
|SV-271747 OL 9 must restrict exposed kernel pointer addresses access.|None|-|Yes|
|SV-271748 OL 9 must disable access to network bpf system call from nonprivileged processes.|None|-|Yes|
|SV-271749 OL 9 must restrict usage of ptrace to descendant processes.|None|-|Yes|
|SV-271750 OL 9 must automatically exit interactive command shell user sessions after 15 minutes of inactivity.|None|-|No|
|SV-271751 OL 9 must be configured so that the systemd Ctrl-Alt-Delete burst key sequence is disabled.|None|-|No|
|SV-271752 OL 9 must be configured so that the x86 Ctrl-Alt-Delete key sequence is disabled.|None|-|No|
|SV-271753 OL 9 must limit the number of concurrent sessions to ten for all accounts and/or account types.|None|-|No|
|SV-271754 OL 9 must automatically lock an account when three unsuccessful logon attempts occur during a 15-minute time period.|None|-|No|
|SV-271755 OL 9 must maintain an account lock until the locked account is released by an administrator.|None|-|No|
|SV-271757 OL 9 file systems must not contain shosts.equiv files.|None|-|No|
|SV-271758 OL 9 file systems must not contain .shosts files.|None|-|No|
|SV-271759 OL 9 must implement DOD-approved encryption in the bind package.|None|-|No|
|SV-271761 OL 9 must implement address space layout randomization (ASLR) to protect its memory from unauthorized code execution.|None|-|Yes|
|SV-271763 OL 9 must be configured to prevent unrestricted mail relaying.|None|-|No|
|SV-271766 OL 9 must prevent the loading of a new kernel for later execution.|None|-|Yes|
|SV-271768 OL 9 must enable hardening for the Berkeley Packet Filter (BPF) just-in-time compiler.|None|-|Yes|
|SV-271771 OL 9 SSH private host key files must have mode 0640 or less permissive.|None|-|No|
|SV-271772 OL 9 SSH public host key files must have mode 0644 or less permissive.|None|-|No|
|SV-271773 OL 9 system commands must be group-owned by root or a system account.|None|-|No|
|SV-271774 OL 9 system commands must be owned by root.|None|-|No|
|SV-271775 OL 9 system commands must have mode 755 or less permissive.|None|-|No|
|SV-271776 OL 9 SSH server configuration file must be group-owned by root.|None|-|Yes|
|SV-271777 OL 9 SSH server configuration file must be owned by root.|None|-|Yes|
|SV-271778 OL 9 SSH server configuration file must have mode 0600 or less permissive.|None|-|Yes|
|SV-271782 OL 9 local initialization files must have mode 0740 or less permissive.|None|-|No|
|SV-271784 OL 9 local interactive user home directories must have mode 0750 or less permissive.|None|-|No|
|SV-271786 OL 9 library directories must be group-owned by root or a system account.|None|-|No|
|SV-271787 OL 9 library directories must be owned by root.|None|-|No|
|SV-271788 OL 9 library directories must have mode 755 or less permissive.|None|-|No|
|SV-271789 OL 9 library files must be group owned by root or a system account.|None|-|No|
|SV-271790 OL 9 library files must be owned by root.|None|-|No|
|SV-271791 OL 9 library files must have mode 0755 or less permissive.|None|-|No|
|SV-271792 OL 9 /boot/grub2/grub.cfg file must be group-owned by root.|None|-|Yes|
|SV-271793 OL 9 /boot/grub2/grub.cfg file must be owned by root.|None|-|Yes|
|SV-271794 OL 9 /etc/group file must be group-owned by root.|None|-|Yes|
|SV-271795 OL 9 /etc/group- file must be group-owned by root.|None|-|Yes|
|SV-271796 OL 9 /etc/group file must be owned by root.|None|-|Yes|
|SV-271797 OL 9 /etc/group- file must be owned by root.|None|-|Yes|
|SV-271798 OL 9 /etc/group file must have mode 0644 or less permissive to prevent unauthorized access.|None|-|Yes|
|SV-271799 OL 9 /etc/group- file must have mode 0644 or less permissive to prevent unauthorized access.|None|-|Yes|
|SV-271800 OL 9 /etc/gshadow file must be group-owned by root.|None|-|Yes|
|SV-271801 OL 9 /etc/gshadow- file must be group-owned by root.|None|-|Yes|
|SV-271802 OL 9 /etc/gshadow file must be owned by root.|None|-|Yes|
|SV-271803 OL 9 /etc/gshadow- file must be owned by root.|None|-|No|
|SV-271804 OL 9 /etc/gshadow file must have mode 0000 or less permissive to prevent unauthorized access.|None|-|Yes|
|SV-271805 OL 9 /etc/gshadow- file must have mode 0000 or less permissive to prevent unauthorized access.|None|-|Yes|
|SV-271806 OL 9 /etc/passwd file must be group-owned by root.|None|-|Yes|
|SV-271807 OL 9 /etc/passwd- file must be group-owned by root.|None|-|Yes|
|SV-271808 OL 9 /etc/passwd file must be owned by root.|None|-|Yes|
|SV-271809 OL 9 /etc/passwd- file must be owned by root.|None|-|Yes|
|SV-271810 OL 9 /etc/passwd file must have mode 0644 or less permissive to prevent unauthorized access.|None|-|Yes|
|SV-271811 OL 9 /etc/passwd- file must have mode 0644 or less permissive to prevent unauthorized access.|None|-|Yes|
|SV-271812 OL 9 /etc/shadow file must be group-owned by root.|None|-|Yes|
|SV-271813 OL 9 /etc/shadow- file must be group-owned by root.|None|-|Yes|
|SV-271814 OL 9 /etc/shadow file must be owned by root.|None|-|No|
|SV-271815 OL 9 /etc/shadow- file must be owned by root.|None|-|No|
|SV-271816 OL 9 /etc/shadow- file must have mode 0000 or less permissive to prevent unauthorized access.|None|-|Yes|
|SV-271817 OL 9 /etc/shadow file must have mode 0000 to prevent unauthorized access.|None|-|Yes|
|SV-271818 OL 9 /var/log directory must be group-owned by root.|None|-|Yes|
|SV-271819 OL 9 /var/log directory must be owned by root.|None|-|Yes|
|SV-271820 OL 9 /var/log directory must have mode 0755 or less permissive.|None|-|Yes|
|SV-271821 OL 9 /var/log/messages file must be group-owned by root.|None|-|Yes|
|SV-271822 OL 9 /var/log/messages file must be owned by root.|None|-|Yes|
|SV-271823 OL 9 /var/log/messages file must have mode 0640 or less permissive.|None|-|Yes|
|SV-271824 OL 9 audit tools must be group-owned by root.|None|-|Yes|
|SV-271825 OL 9 audit tools must be owned by root.|None|-|Yes|
|SV-271826 OL 9 audit tools must have a mode of 0755 or less permissive.|None|-|Yes|
|SV-271827 OL 9 cron configuration directories must have a mode of 0700 or less permissive.|None|-|Yes|
|SV-271828 OL 9 cron configuration files directory must be group-owned by root.|None|-|No|
|SV-271829 OL 9 cron configuration files directory must be owned by root.|None|-|Yes|
|SV-271830 OL 9 /etc/crontab file must have mode 0600.|None|-|Yes|
|SV-271831 OL 9 must be configured so that the root account is the only account having unrestricted access to the system.|None|-|No|
|SV-271832 OL 9 duplicate User IDs (UIDs) must not exist for interactive users.|None|-|No|
|SV-271833 OL 9 local interactive users must have a home directory assigned in the /etc/passwd file.|None|-|No|
|SV-271834 OL 9 interactive users must have a primary group that exists.|None|-|No|
|SV-271835 OL 9 groups must have unique Group ID (GID).|None|-|No|
|SV-271836 OL 9 must configure SELinux context type to allow the use of a nondefault faillock tally directory.|None|-|No|
|SV-271839 OL 9 must automatically lock an account when three unsuccessful logon attempts occur.|None|-|No|
|SV-271840 OL 9 must automatically lock the root account until the root account is released by an administrator when three unsuccessful logon attempts occur during a 15-minute time period.|None|-|No|
|SV-271841 OL 9 must log username information when unsuccessful logon attempts occur.|None|-|No|
|SV-271842 OL 9 must ensure account lockouts persist.|None|-|No|
|SV-271845 OL 9 system accounts must not have an interactive login shell.|None|-|No|
|SV-271846 OL 9 local interactive user accounts must be assigned a home directory upon creation.|None|-|No|
|SV-271849 OL 9 must disable account identifiers (individuals, groups, roles, and devices) after 35 days of inactivity.|None|-|No|
|SV-271850 OL 9 must enforce a delay of at least four seconds between logon prompts following a failed logon attempt.|None|-|No|
|SV-271851 OL 9 remote access methods must be monitored.|None|-|No|
|SV-271852 OL 9 must be configured to forward audit records via TCP to a different system or media from the system being audited via rsyslog.|None|-|No|
|SV-271854 OL 9 must authenticate the remote logging server for offloading audit logs via rsyslog.|None|-|No|
|SV-271855 OL 9 must encrypt the transfer of audit records offloaded onto a different system or media from the system being audited via rsyslog.|None|-|No|
|SV-271856 OL 9 must encrypt via the gtls driver the transfer of audit records offloaded onto a different system or media from the system being audited via rsyslog.|None|-|No|
|SV-271857 OL 9 must be configured so that the rsyslog daemon does not accept log messages from other servers unless the server is being used for log aggregation.|None|-|No|
|SV-271858 OL 9 must protect against or limit the effects of denial-of-service (DoS) attacks by ensuring rate-limiting measures on impacted network interfaces are implemented.|None|-|No|
|SV-271860 OL 9 must configure a DNS processing mode set be Network Manager.|None|-|No|
|SV-271861 OL 9 systems using Domain Name Servers (DNS) resolution must have at least two name servers configured.|None|-|No|
|SV-271862 OL 9 network interfaces must not be in promiscuous mode.|None|-|No|
|SV-271864 OL 9 must ignore Internet Protocol version 4 (IPv4) Internet Control Message Protocol (ICMP) redirect messages.|None|-|Yes|
|SV-271865 OL 9 must not forward Internet Protocol version 4 (IPv4) source-routed packets.|None|-|Yes|
|SV-271866 OL 9 must log IPv4 packets with impossible addresses.|None|-|Yes|
|SV-271867 OL 9 must log IPv4 packets with impossible addresses by default.|None|-|Yes|
|SV-271868 OL 9 must use reverse path filtering on all IPv4 interfaces.|None|-|Yes|
|SV-271869 OL 9 must prevent IPv4 Internet Control Message Protocol (ICMP) redirect messages from being accepted.|None|-|Yes|
|SV-271870 OL 9 must not forward IPv4 source-routed packets by default.|None|-|Yes|
|SV-271871 OL 9 must use a reverse-path filter for IPv4 network traffic, when possible, by default.|None|-|Yes|
|SV-271872 OL 9 must not enable IPv4 packet forwarding unless the system is a router.|None|-|Yes|
|SV-271873 OL 9 must not respond to Internet Control Message Protocol (ICMP) echoes sent to a broadcast address.|None|-|Yes|
|SV-271874 OL 9 must limit the number of bogus Internet Control Message Protocol (ICMP) response errors logs.|None|-|Yes|
|SV-271875 OL 9 must not send Internet Control Message Protocol (ICMP) redirects.|None|-|Yes|
|SV-271876 OL 9 must not allow interfaces to perform Internet Control Message Protocol (ICMP) redirects by default.|None|-|Yes|
|SV-271877 OL 9 must not accept router advertisements on all IPv6 interfaces.|None|-|Yes|
|SV-271878 OL 9 must ignore IPv6 Internet Control Message Protocol (ICMP) redirect messages.|None|-|Yes|
|SV-271879 OL 9 must not forward IPv6 source-routed packets.|None|-|Yes|
|SV-271880 OL 9 must not enable IPv6 packet forwarding unless the system is a router.|None|-|Yes|
|SV-271881 OL 9 must not accept router advertisements on all IPv6 interfaces by default.|None|-|Yes|
|SV-271882 OL 9 must prevent IPv6 Internet Control Message Protocol (ICMP) redirect messages from being accepted.|None|-|Yes|
|SV-271883 OL 9 must not forward IPv6 source-routed packets by default.|None|-|Yes|
|SV-271884 OL 9 must be configured to use TCP syncookies.|None|-|Yes|
|SV-271885 OL 9 audit system must protect logon UIDs from unauthorized change.|None|-|No|
|SV-271886 OL 9 audit system must protect auditing rules from unauthorized change.|None|-|No|
|SV-278952 OL 9 must audit any script or executable called by cron as root or by any privileged user.|None|-|No|
|SV-279935 OL 9 must terminate idle user sessions.|None|-|No|

### Known assessment discrepancies

> [!NOTE]
> These rules can produce assessment results that differ from the DISA SCAP Compliance Checker (SCC).
> A rule is listed once if a discrepancy was observed in any tested scenario.

- SV-271438 OL 9 must be a vendor supported release.
- SV-271452 OL 9 must use a Linux Security Module configured to enforce limits on system services.
- SV-271628 OL 9 must employ FIPS 140-3 approved cryptographic hashing algorithms for all stored passwords.
- SV-271639 OL 9 file system automount function must be disabled unless required.
- SV-271641 OL 9 must prevent special devices on file systems that are imported via Network File System (NFS).
- SV-271642 OL 9 must prevent code from being executed on file systems that are imported via Network File System (NFS).
- SV-271643 OL 9 must prevent files with the setuid and setgid bit set from being executed on file systems that are imported via Network File System (NFS).
- SV-271649 OL 9 must prevent files with the setuid and setgid bit set from being executed on the /boot/efi directory.
- SV-271670 OL 9 must disable the graphical user interface automount function unless required.
- SV-271678 OL 9 must prevent a user from overriding the disabling of the graphical user interface automount function.
- SV-271679 OL 9 must prevent a user from overriding the disabling of the graphical user interface autorun function.
- SV-271680 OL 9 must prevent a user from overriding the banner-message-enable setting for the graphical user interface.
- SV-271681 OL 9 must prevent a user from overriding the screensaver lock-enabled setting for the graphical user interface.
- SV-271682 OL 9 must prevent a user from overriding the session idle-delay setting for the graphical user interface.
- SV-271683 OL 9 must prevent a user from overriding the session lock-delay setting for the graphical user interface.
- SV-271684 OL 9 must prevent a user from overriding the disabling of the graphical user smart card removal action.
- SV-271685 OL 9 must disable the ability of a user to restart the system from the login screen.
- SV-271686 OL 9 must prevent a user from overriding the disable-restart-buttons setting for the graphical user interface.
- SV-271687 OL 9 must prevent a user from overriding the Ctrl-Alt-Del sequence settings for the graphical user interface.
- SV-271688 OL 9 must be configured to enable the display of the Standard Mandatory DOD Notice and Consent Banner before granting local or remote access to the system via a graphical user logon.
- SV-271690 OL 9 must be able to directly initiate a session lock for all connection types using smart card when the smart card is removed.
- SV-271691 OL 9 must not allow unattended or automatic logon via the graphical user interface.
- SV-271710 OL 9 must be configured so that all network connections associated with SSH traffic are terminated after 10 minutes of becoming unresponsive.
- SV-271743 OL 9 IP tunnels must use 140-3 approved cryptographic algorithms.
- SV-271759 OL 9 must implement DOD-approved encryption in the bind package.
- SV-271763 OL 9 must be configured to prevent unrestricted mail relaying.
- SV-271829 OL 9 cron configuration files directory must be owned by root.
- SV-271845 OL 9 system accounts must not have an interactive login shell.
- SV-271846 OL 9 local interactive user accounts must be assigned a home directory upon creation.
- SV-271857 OL 9 must be configured so that the rsyslog daemon does not accept log messages from other servers unless the server is being used for log aggregation.
