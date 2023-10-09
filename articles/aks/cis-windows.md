---
title: Azure Kubernetes Service (AKS) Windows image alignment with Center for Internet Security (CIS) benchmark
description: Learn how AKS applies the CIS benchmark to Windows Server 2022 image used by Azure Kubernetes Service.
ms.topic: article
ms.date: 09/27/2023
---

# Azure Kubernetes Service (AKS) Windows image alignment with Center for Internet Security (CIS) benchmark

As a secure service, Azure Kubernetes Service (AKS) complies with SOC, ISO, PCI DSS, and HIPAA standards. This article covers the security OS configuration applied to Windows image used by AKS. This security configuration is based on the Azure X security baseline, which aligns with CIS benchmark. For more information about AKS security, see Security concepts for applications and clusters in Azure Kubernetes Service (AKS). For more information about AKS security, see [Security concepts for applications and clusters in Azure Kubernetes Service (AKS)][security-concepts-aks-apps-clusters]. For more information on the CIS benchmark, see [Center for Internet Security (CIS) Benchmarks][cis-benchmarks]. For more information on the Azure security baselines for Windows, see [Windows security baseline][Windows-security-baseline].

## Windows Server 2022

AKS clusters are deployed on host virtual machines, which run an operating system with built-in secure configurations. This operating system is used for containers running on AKS. This host operating system is based on a **Windows Server 2022** image with security configurations applied.

As a part of the security-optimized operating system:

* AKS provides a security-optimized host OS by default, but no option to select an alternate operating system.
* The security-optimized host OS is built and maintained specifically for AKS and is **not** supported outside of the AKS platform.
* Some unnecessary kernel module drivers have been disabled in the OS to reduce the attack surface area.

> [!NOTE]
> Unrelated to the CIS benchmarks, Azure applies daily patches, including security patches, to AKS virtual machine hosts.

The goal of the secure configuration built into the host OS is to reduce the surface area of attack and optimize for the deployment of containers in a secure manner.

The following are the results from the [CIS Azure Compute Microsoft Windows Server 2022 Benchmark v1.0.0 - 01-26-2023][cis-benchmark-windows] recommendations.

Recommendations can have one of the following reasons:

* *Potential Operation Impact* - Recommendation wasn't applied because it would have a negative effect on the service.
* *Covered Elsewhere* - Recommendation is covered by another control in Azure cloud compute.

The following are CIS rules implemented:

| CIS paragraph number | Recommendation description|Status| Reason |
|---|---|---|---|
| 1.1.1 | Ensure 'Enforce password history' is set to '24 or more password(s)' | Fail ||
| 1.1.2 | Ensure 'Maximum password age' is set to '365 or fewer days, but not 0' | Pass ||
| 1.1.3 | Ensure 'Minimum password age' is set to '1 or more day(s)' | Fail |
| 1.1.4 | Ensure 'Minimum password length' is set to '14 or more character(s)' | Fail ||
| 1.1.5 | Ensure 'Password must meet complexity requirements' is set to 'Enabled' | Pass ||
| 1.1.6 | Ensure 'Store passwords using reversible encryption' is set to 'Disabled' | Pass ||
| 2.2.1 | Ensure 'Access Credential Manager as a trusted caller' is set to 'No One' | Pass ||
| 2.2.2 | Ensure 'Access this computer from the network' is set to 'Administrators, Authenticated Users, ENTERPRISE DOMAIN CONTROLLERS' (DC only) | Fail ||
| 2.2.4 | Ensure 'Act as part of the operating system' is set to 'No One' | Pass ||
| 2.2.5 | Ensure 'Add workstations to domain' is set to 'Administrators' (DC only) | N/A ||
| 2.2.6 | Ensure 'Adjust memory quotas for a process' is set to 'Administrators, LOCAL SERVICE, NETWORK SERVICE' | Pass ||
| 2.2.7 | Ensure 'Allow log on locally' is set to 'Administrators' | Fail ||
| 2.2.8 | Ensure 'Allow log on through Remote Desktop Services' is set to 'Administrators' (DC only) | Pass ||
| 2.2.10 | Ensure 'Back up files and directories' is set to 'Administrators, Backup Operators' | Pass ||
| 2.2.11 | Ensure 'Change the system time' is set to 'Administrators, LOCAL SERVICE' | Pass ||
| 2.2.12 | Ensure 'Change the time zone' is set to 'Administrators, LOCAL SERVICE' | Pass ||
| 2.2.13 | Ensure 'Create a pagefile' is set to 'Administrators' | Pass ||
| 2.2.14 | Ensure 'Create a token object' is set to 'No One' | Pass ||
| 2.2.15 | Ensure 'Create global objects' is set to 'Administrators, LOCAL SERVICE, NETWORK SERVICE, SERVICE' | Pass ||
| 2.2.16 | Ensure 'Create permanent shared objects' is set to 'No One' | Pass ||
| 2.2.17 | Ensure 'Create symbolic links' is set to 'Administrators' (DC only) | Pass ||
| 2.2.19 | Ensure 'Debug programs' is set to 'Administrators' | Pass ||
| 2.2.20 | Ensure 'Deny access to this computer from the network' to include 'Guests' | Fail ||
| 2.2.21 | Ensure 'Deny log on as a batch job' to include 'Guests' | Fail ||
| 2.2.22 | Ensure 'Deny log on as a service' to include 'Guests' | Fail ||
| 2.2.23 | Ensure 'Deny log on locally' to include 'Guests' | Fail ||
| 2.2.24 | Ensure 'Deny log on through Remote Desktop Services' to include 'Guests' | Fail ||
| 2.2.25 | Ensure 'Enable computer and user accounts to be trusted for delegation' is set to 'Administrators' (DC only) | Pass ||
| 2.2.27 | Ensure 'Force shutdown from a remote system' is set to 'Administrators' | Pass ||
| 2.2.28 | Ensure 'Generate security audits' is set to 'LOCAL SERVICE, NETWORK SERVICE' | N/A ||
| 2.2.29 | Ensure 'Impersonate a client after authentication' is set to 'Administrators, LOCAL SERVICE, NETWORK SERVICE, SERVICE' (DC only) | Pass ||
| 2.2.31 | Ensure 'Increase scheduling priority' is set to 'Administrators' | Fail ||
| 2.2.32 | Ensure 'Load and unload device drivers' is set to 'Administrators' | Pass ||
| 2.2.33 | Ensure 'Lock pages in memory' is set to 'No One' | Pass ||
| 2.2.34 | Ensure 'Manage auditing and security log' is set to 'Administrators' and (when Exchange is running in the environment) 'Exchange Servers' (DC only) | Pass ||
| 2.2.36 | Ensure 'Modify an object label' is set to 'No One' | Pass ||
| 2.2.37 | Ensure 'Modify firmware environment values' is set to 'Administrators' | Pass ||
| 2.2.38 | Ensure 'Perform volume maintenance tasks' is set to 'Administrators' | Pass ||
| 2.2.39 | Ensure 'Profile single process' is set to 'Administrators' | Pass ||
| 2.2.40 | Ensure 'Profile system performance' is set to 'Administrators, NT SERVICE\WdiServiceHost' | Pass ||
| 2.2.41 | Ensure 'Replace a process level token' is set to 'LOCAL SERVICE, NETWORK SERVICE' | Pass ||
| 2.2.42 | Ensure 'Restore files and directories' is set to 'Administrators, Backup Operators' | Pass ||
| 2.2.43 | Ensure 'Shut down the system' is set to 'Administrators, Backup Operators' | Pass ||
| 2.2.44 | Ensure 'Synchronize directory service data' is set to 'No One' (DC only) | N/A ||
| 2.2.45 | Ensure 'Take ownership of files or other objects' is set to 'Administrators' | Pass ||
| 2.3.1.1 | Ensure 'Accounts: Block Microsoft accounts' is set to 'Users can't add or log on with Microsoft accounts' | Pass ||
| 2.3.1.3 | Ensure 'Accounts: Limit local account use of blank passwords to console logon only' is set to 'Enabled' | Pass ||
| 2.3.1.4 | Configure 'Accounts: Rename administrator account' | Pass ||
| 2.3.1.5 | Configure 'Accounts: Rename guest account' | Pass ||
| 2.3.2.1 | Ensure 'Audit: Force audit policy subcategory settings (Windows Vista or later) to override audit policy category settings' is set to 'Enabled' | Pass ||
| 2.3.2.2 | Ensure 'Audit: Shut down system immediately if unable to log security audits' is set to 'Disabled' | Pass ||
| 2.3.4.1 | Ensure 'Devices: Allowed to format and eject removable media' is set to 'Administrators' | Pass ||
| 2.3.4.2 | Ensure 'Devices: Prevent users from installing printer drivers' is set to 'Enabled' | Pass ||
| 2.3.5.1 | Ensure 'Domain controller: Allow server operators to schedule tasks' is set to 'Disabled' (DC only) | N/A ||
| 2.3.5.2 | Ensure 'Domain controller: Allow vulnerable Netlogon secure channel connections' is set to 'Not Configured' (DC Only) | N/A ||
| 2.3.5.3 | Ensure 'Domain controller: LDAP server channel binding token requirements' is set to 'Always' (DC Only) | N/A ||
| 2.3.5.4 | Ensure 'Domain controller: LDAP server signing requirements' is set to 'Require signing' (DC only) | N/A ||
| 2.3.5.5 | Ensure 'Domain controller: Refuse machine account password changes' is set to 'Disabled' (DC only) | N/A ||
| 2.3.6.1 | Ensure 'Domain member: Digitally encrypt or sign secure channel data (always)' is set to 'Enabled' | Pass ||
| 2.3.6.2 | Ensure 'Domain member: Digitally encrypt secure channel data (when possible)' is set to 'Enabled' | Pass ||
| 2.3.6.3 | Ensure 'Domain member: Digitally sign secure channel data (when possible)' is set to 'Enabled' | Pass ||
| 2.3.6.4 | Ensure 'Domain member: Disable machine account password changes' is set to 'Disabled' | Pass ||
| 2.3.6.5 | Ensure 'Domain member: Maximum machine account password age' is set to '30 or fewer days, but not 0' | Pass ||
| 2.3.7.1 | Ensure 'Interactive logon: Machine inactivity limit' is set to '900 or fewer second(s), but not 0' | Pass ||
| 2.3.7.2 | Configure 'Interactive logon: Message text for users attempting to log on' | Fail ||
| 2.3.7.3 | Configure 'Interactive logon: Message title for users attempting to log on' | Fail ||
| 2.3.7.4 | Ensure 'Interactive logon: Prompt user to change password before expiration' is set to 'between 5 and 14 days' | Pass ||
| 2.3.8.1 | Ensure 'Microsoft network client: Digitally sign communications (always)' is set to 'Enabled' | Fail ||
| 2.3.8.2 | Ensure 'Microsoft network client: Digitally sign communications (if server agrees)' is set to 'Enabled' | Pass ||
| 2.3.8.3 | Ensure 'Microsoft network client: Send unencrypted password to third-party SMB servers' is set to 'Disabled' | Pass ||
| 2.3.9.1 | Ensure 'Microsoft network server: Amount of idle time required before suspending session' is set to '15 or fewer minute(s)' | Pass ||
| 2.3.9.2 | Ensure 'Microsoft network server: Digitally sign communications (always)' is set to 'Enabled' | Fail ||
| 2.3.9.3 | Ensure 'Microsoft network server: Digitally sign communications (if client agrees)' is set to 'Enabled' | Fail ||
| 2.3.9.4 | Ensure 'Microsoft network server: Disconnect clients when logon hours expire' is set to 'Enabled' | Pass ||
| 2.3.10.1 | Ensure 'Network access: Allow anonymous SID/Name translation' is set to 'Disabled' | Pass ||
| 2.3.10.4 | Ensure 'Network access: Let Everyone permissions apply to anonymous users' is set to 'Disabled' | Pass ||
| 2.3.10.5 | Configure 'Network access: Named Pipes that can be accessed anonymously' (DC only) | Pass ||
| 2.3.10.7 | Configure 'Network access: Remotely accessible registry paths' is configured | Pass ||
| 2.3.10.8 | Configure 'Network access: Remotely accessible registry paths and sub-paths' is configured | Pass ||
| 2.3.10.9 | Ensure 'Network access: Restrict anonymous access to Named Pipes and Shares' is set to 'Enabled' | Pass ||
| 2.3.10.11 | Ensure 'Network access: Shares that can be accessed anonymously' is set to 'None' | N/A ||
| 2.3.10.12 | Ensure 'Network access: Sharing and security model for local accounts' is set to 'Classic - local users authenticate as themselves' | Pass ||
| 2.3.11.1 | Ensure 'Network security: Allow Local System to use computer identity for NTLM' is set to 'Enabled' | Fail ||
| 2.3.11.2 | Ensure 'Network security: Allow LocalSystem NULL session fallback' is set to 'Disabled' | Pass ||
| 2.3.11.3 | Ensure 'Network Security: Allow PKU2U authentication requests to this computer to use online identities' is set to 'Disabled' | Pass ||
| 2.3.11.4 | Ensure 'Network security: Configure encryption types allowed for Kerberos' is set to 'AES128_HMAC_SHA1, AES256_HMAC_SHA1, Future encryption types' | Pass ||
| 2.3.11.5 | Ensure 'Network security: Do not store LAN Manager hash value on next password change' is set to 'Enabled' | Pass ||
| 2.3.11.6 | Ensure 'Network security: LAN Manager authentication level' is set to 'Send NTLMv2 response only. Refuse LM & NTLM' | Fail ||
| 2.3.11.7 | Ensure 'Network security: LDAP client signing requirements' is set to 'Negotiate signing' or higher | Pass ||
| 2.3.11.8 | Ensure 'Network security: Minimum session security for NTLM SSP based (including secure RPC) clients' is set to 'Require NTLMv2 session security, Require 128-bit encryption' | Fail ||
| 2.3.11.9 | Ensure 'Network security: Minimum session security for NTLM SSP based (including secure RPC) servers' is set to 'Require NTLMv2 session security, Require 128-bit encryption' | Fail ||
| 2.3.13.1 | Ensure 'Shutdown: Allow system to be shut down without having to log on' is set to 'Disabled' | Pass ||
| 2.3.15.1 | Ensure 'System objects: Require case insensitivity for non-Windows subsystems' is set to 'Enabled' | Pass ||
| 2.3.15.2 | Ensure 'System objects: Strengthen default permissions of internal system objects (e.g. Symbolic Links)' is set to 'Enabled' | Pass ||
| 2.3.17.1 | Ensure 'User Account Control: Admin Approval Mode for the Built-in Administrator account' is set to 'Enabled' | Fail ||
| 2.3.17.2 | Ensure 'User Account Control: Behavior of the elevation prompt for administrators in Admin Approval Mode' is set to 'Prompt for consent on the secure desktop' | Fail ||
| 2.3.17.3 | Ensure 'User Account Control: Behavior of the elevation prompt for standard users' is set to 'Automatically deny elevation requests' | Fail ||
| 2.3.17.4 | Ensure 'User Account Control: Detect application installations and prompt for elevation' is set to 'Enabled' | Pass ||
| 2.3.17.5 | Ensure 'User Account Control: Only elevate UIAccess applications that are installed in secure locations' is set to 'Enabled' | Pass ||
| 2.3.17.6 | Ensure 'User Account Control: Run all administrators in Admin Approval Mode' is set to 'Enabled' | Pass ||
| 2.3.17.7 | Ensure 'User Account Control: Switch to the secure desktop when prompting for elevation' is set to 'Enabled' | Pass ||
| 2.3.17.8 | Ensure 'User Account Control: Virtualize file and registry write failures to per-user locations' is set to 'Enabled' | Pass ||
| 5.1 | Ensure 'Print Spooler (Spooler)' is set to 'Disabled' (DC only) | N/A ||
| 9.1.1 | Ensure 'Windows Firewall: Domain: Firewall state' is set to 'On (recommended)' | Fail ||
| 9.1.2 | Ensure 'Windows Firewall: Domain: Inbound connections' is set to 'Block (default)' | Pass ||
| 9.1.3 | Ensure 'Windows Firewall: Domain: Outbound connections' is set to 'Allow (default)' | Pass ||
| 9.1.4 | Ensure 'Windows Firewall: Domain: Logging: Name' is set to '%SystemRoot%\System32\logfiles\firewall\domainfw.log' | Pass ||
| 9.1.5 | Ensure 'Windows Firewall: Domain: Logging: Size limit (KB)' is set to '16,384 KB or greater' | Pass ||
| 9.1.6 | Ensure 'Windows Firewall: Domain: Logging: Log dropped packets' is set to 'Yes' | Pass ||
| 9.1.7 | Ensure 'Windows Firewall: Domain: Logging: Log successful connections' is set to 'Yes' | Fail ||
| 9.2.1 | Ensure 'Windows Firewall: Private: Firewall state' is set to 'On (recommended)' | Fail ||
| 9.2.2 | Ensure 'Windows Firewall: Private: Inbound connections' is set to 'Block (default)' | Pass ||
| 9.2.3 | Ensure 'Windows Firewall: Private: Outbound connections' is set to 'Allow (default)' | Fail ||
| 9.2.4 | Ensure 'Windows Firewall: Private: Logging: Name' is set to '%SystemRoot%\System32\logfiles\firewall\privatefw.log' | Pass ||
| 9.2.5 | Ensure 'Windows Firewall: Private: Logging: Size limit (KB)' is set to '16,384 KB or greater' | Pass ||
| 9.2.6 | Ensure 'Windows Firewall: Private: Logging: Log dropped packets' is set to 'Yes' | Pass ||
| 9.2.7 | Ensure 'Windows Firewall: Private: Logging: Log successful connections' is set to 'Yes' | Pass ||
| 9.3.1 | Ensure 'Windows Firewall: Public: Firewall state' is set to 'On (recommended)' | Fail ||
| 9.3.2 | Ensure 'Windows Firewall: Public: Inbound connections' is set to 'Block (default)' | Pass ||
| 9.3.3 | Ensure 'Windows Firewall: Public: Outbound connections' is set to 'Allow (default)' | Fail ||
| 9.3.4 | Ensure 'Windows Firewall: Public: Logging: Name' is set to '%SystemRoot%\System32\logfiles\firewall\publicfw.log' | Pass ||
| 9.3.5 | Ensure 'Windows Firewall: Public: Logging: Size limit (KB)' is set to '16,384 KB or greater' | Fail ||
| 9.3.6 | Ensure 'Windows Firewall: Public: Logging: Log dropped packets' is set to 'Yes' | Pass ||
| 9.3.7 | Ensure 'Windows Firewall: Public: Logging: Log successful connections' is set to 'Yes' | Pass ||
| 17.1.1 | Ensure 'Audit Credential Validation' is set to 'Success and Failure' | Pass ||
| 17.1.2 | Ensure 'Audit Kerberos Authentication Service' is set to 'Success and Failure' (DC Only) | Pass ||
| 17.2.1 | Ensure 'Audit Computer Account Management' is set to include 'Success and Failure' (DC only) | Pass ||
| 17.2.2 | Ensure 'Audit Distribution Group Management' is set to include 'Success and Failure' (DC only) | Pass ||
| 17.2.3 | Ensure 'Audit Other Account Management Events' is set to include 'Success' (DC only) | Pass ||
| 17.2.4 | Ensure 'Audit Security Group Management' is set to include 'Success' | Pass ||
| 17.2.5 | Ensure 'Audit User Account Management' is set to 'Success and Failure' | Pass ||
| 17.3.1 | Ensure 'Audit PNP Activity' is set to include 'Success' | Pass ||
| 17.3.2 | Ensure 'Audit Process Creation' is set to include 'Success' | Pass ||
| 17.5.1 | Ensure 'Audit Account Lockout' is set to include 'Success and Failure' | Pass ||
| 17.5.2 | Ensure 'Audit Group Membership' is set to include 'Success' | Pass ||
| 17.5.3 | Ensure 'Audit Logoff' is set to include 'Success' | Pass ||
| 17.5.4 | Ensure 'Audit Logon' is set to 'Success and Failure' | Pass ||
| 17.5.5 | Ensure 'Audit Other Logon/Logoff Events' is set to 'Success and Failure' | Pass ||
| 17.5.6 | Ensure 'Audit Special Logon' is set to include 'Success' | Pass ||
| 17.6.1 | Ensure 'Audit Other Object Access Events' is set to 'Success and Failure' | Fail ||
| 17.6.2 | Ensure 'Audit Removable Storage' is set to 'Success and Failure' | Fail ||
| 17.7.1 | Ensure 'Audit Audit Policy Change' is set to include 'Success' | Pass ||
| 17.7.2 | Ensure 'Audit Authentication Policy Change' is set to include 'Success' | Pass ||
| 17.7.3 | Ensure 'Audit MPSSVC Rule-Level Policy Change' is set to 'Success and Failure' | Fail ||
| 17.8.1 | Ensure 'Audit Sensitive Privilege Use' is set to 'Success and Failure' | Pass ||
| 17.9.1 | Ensure 'Audit Security State Change' is set to include 'Success' | Fail ||
| 17.9.2 | Ensure 'Audit Security System Extension' is set to include 'Success' | Pass ||
| 17.9.3 | Ensure 'Audit System Integrity' is set to 'Success and Failure' | Pass ||
| 18.1.2.2 | Ensure 'Allow users to enable online speech recognition services' is set to 'Disabled' | Fail ||
| 18.3.1 | Ensure 'Configure SMB v1 client driver' is set to 'Enabled: Disable driver (recommended)' | Pass ||
| 18.3.2 | Ensure 'Configure SMB v1 server' is set to 'Disabled' | Pass ||
| 18.3.3 | Ensure 'Enable Structured Exception Handling Overwrite Protection (SEHOP)' is set to 'Enabled' | Pass ||
| 18.3.4 | Ensure 'NetBT NodeType configuration' is set to 'Enabled: P-node (recommended)' | Pass ||
| 18.3.5 | Ensure 'WDigest Authentication' is set to 'Disabled' | Pass ||
| 18.4.1 | Ensure 'MSS: (DisableIPSourceRouting IPv6) IP source routing protection level (protects against packet spoofing)' is set to 'Enabled: Highest protection, source routing is completely disabled' | Pass ||
| 18.4.2 | Ensure 'MSS: (DisableIPSourceRouting) IP source routing protection level (protects against packet spoofing)' is set to 'Enabled: Highest protection, source routing is completely disabled' | Pass ||
| 18.4.3 | Ensure 'MSS: (EnableICMPRedirect) Allow ICMP redirects to override OSPF generated routes' is set to 'Disabled' | Fail ||
| 18.4.4 | Ensure 'MSS: (NoNameReleaseOnDemand) Allow the computer to ignore NetBIOS name release requests except from WINS servers' is set to 'Enabled' | Pass ||
| 18.5.4.1 | Ensure 'Turn off multicast name resolution' is set to 'Enabled' | Fail ||
| 18.5.8.1 | Ensure 'Enable insecure guest logons' is set to 'Disabled' | Fail ||
| 18.5.11.2 | Ensure 'Prohibit installation and configuration of Network Bridge on your DNS domain network' is set to 'Enabled' | Fail ||
| 18.5.11.3 | Ensure 'Prohibit use of Internet Connection Sharing on your DNS domain network' is set to 'Enabled' | Fail ||
| 18.5.14.1 | Ensure 'Hardened UNC Paths' is set to 'Enabled, with "Require Mutual Authentication" and "Require Integrity" set for all NETLOGON and SYSVOL shares' | Pass ||
| 18.5.21.1 | Ensure 'Minimize the number of simultaneous connections to the Internet or a Windows Domain' is set to 'Enabled: 1 = Minimize simultaneous connections' | Pass ||
| 18.8.3.1 | Ensure 'Include command line in process creation events' is set to 'Enabled' | Fail ||
| 18.8.4.1 | Ensure 'Encryption Oracle Remediation' is set to 'Enabled: Force Updated Clients' | Pass ||
| 18.8.4.2 | Ensure 'Remote host allows delegation of non-exportable credentials' is set to 'Enabled' | Pass ||
| 18.8.14.1 | Ensure 'Boot-Start Driver Initialization Policy' is set to 'Enabled: Good, unknown and bad but critical' | Pass ||
| 18.8.21.2 | Ensure 'Configure registry policy processing: Do not apply during periodic background processing' is set to 'Enabled: FALSE' | Pass ||
| 18.8.21.3 | Ensure 'Configure registry policy processing: Process even if the Group Policy objects have not changed' is set to 'Enabled: TRUE' | Pass ||
| 18.8.21.4 | Ensure 'Continue experiences on this device' is set to 'Disabled' | Pass ||
| 18.8.21.5 | Ensure 'Turn off background refresh of Group Policy' is set to 'Disabled' | Pass ||
| 18.8.22.1.1 | Ensure 'Turn off downloading of print drivers over HTTP' is set to 'Enabled' | Fail ||
| 18.8.28.1 | Ensure 'Block user from showing account details on sign-in' is set to 'Enabled' | Fail ||
| 18.8.28.2 | Ensure 'Do not display network selection UI' is set to 'Enabled' | Fail ||
| 18.8.36.1 | Ensure 'Configure Offer Remote Assistance' is set to 'Disabled' | Pass ||
| 18.8.36.2 | Ensure 'Configure Solicited Remote Assistance' is set to 'Disabled' | Fail ||
| 18.8.40.1 | Ensure 'Configure validation of ROCA-vulnerable WHfB keys during authentication' is set to 'Enabled: Audit' or higher (DC only) | N/A |
| 18.9.6.1 | Ensure 'Allow Microsoft accounts to be optional' is set to 'Enabled' | Fail ||
| 18.9.14.1 | Ensure 'Turn off cloud consumer account state content' is set to 'Enabled' | Pass ||
| 18.9.14.2 | Ensure 'Turn off Microsoft consumer experiences' is set to 'Enabled' | Pass ||
| 18.9.16.1 | Ensure 'Do not display the password reveal button' is set to 'Enabled' | Fail ||
| 18.9.16.2 | Ensure 'Enumerate administrator accounts on elevation' is set to 'Disabled' | Pass ||
| 18.9.17.1 | Ensure 'Allow Diagnostic Data' is set to 'Enabled: Send required diagnostic data' | Fail ||
| 18.9.27.1.1 | Ensure 'Application: Control Event Log behavior when the log file reaches its maximum size' is set to 'Disabled' | Pass ||
| 18.9.27.1.2 | Ensure 'Application: Specify the maximum log file size (KB)' is set to 'Enabled: 32,768 or greater' | Fail ||
| 18.9.27.2.1 | Ensure 'Security: Control Event Log behavior when the log file reaches its maximum size' is set to 'Disabled' | Pass ||
| 18.9.27.2.2 | Ensure 'Security: Specify the maximum log file size (KB)' is set to 'Enabled: 196,608 or greater' | Fail ||
| 18.9.27.3.1 | Ensure 'Setup: Control Event Log behavior when the log file reaches its maximum size' is set to 'Disabled' | Pass ||
| 18.9.27.3.2 | Ensure 'Setup: Specify the maximum log file size (KB)' is set to 'Enabled: 32,768 or greater' | Fail ||
| 18.9.27.4.1 | Ensure 'System: Control Event Log behavior when the log file reaches its maximum size' is set to 'Disabled' | Pass ||
| 18.9.27.4.2 | Ensure 'System: Specify the maximum log file size (KB)' is set to 'Enabled: 32,768 or greater' | Fail ||
| 18.9.31.2 | Ensure 'Turn off Data Execution Prevention for Explorer' is set to 'Disabled' | Pass ||
| 18.9.31.3 | Ensure 'Turn off heap termination on corruption' is set to 'Disabled' | Pass ||
| 18.9.31.4 | Ensure 'Turn off shell protocol protected mode' is set to 'Disabled' | Pass ||
| 18.9.46.1 | Ensure 'Block all consumer Microsoft account user authentication' is set to 'Enabled' | Pass ||
| 18.9.47.15 | Ensure 'Configure detection for potentially unwanted applications' is set to 'Enabled: Block' | Pass ||
| 18.9.47.16 | Ensure 'Turn off Microsoft Defender AntiVirus' is set to 'Disabled' | Pass ||
| 18.9.47.4.1 | Ensure 'Configure local setting override for reporting to Microsoft MAPS' is set to 'Disabled' | Pass ||
| 18.9.47.5.1.1 | Ensure 'Configure Attack Surface Reduction rules' is set to 'Enabled' | Pass ||
| 18.9.47.5.1.2 | Ensure 'Configure Attack Surface Reduction rules: Set the state for each ASR rule' is configured | Pass ||
| 18.9.47.5.3.1 | Ensure 'Prevent users and apps from accessing dangerous websites' is set to 'Enabled: Block' | Pass ||
| 18.9.47.9.1 | Ensure 'Scan all downloaded files and attachments' is set to 'Enabled' | Pass ||
| 18.9.47.9.2 | Ensure 'Turn off real-time protection' is set to 'Disabled' | Pass ||
| 18.9.47.9.3 | Ensure 'Turn on behavior monitoring' is set to 'Enabled' | Pass ||
| 18.9.47.9.4 | Ensure 'Turn on script scanning' is set to 'Enabled' | Pass ||
| 18.9.47.12.1 | Ensure 'Turn on e-mail scanning' is set to 'Enabled' | Fail ||
| 18.9.65.2.2 | Ensure 'Do not allow passwords to be saved' is set to 'Enabled' | Fail ||
| 18.9.65.3.3.1 | Ensure 'Do not allow drive redirection' is set to 'Enabled' | Pass ||
| 18.9.65.3.9.1 | Ensure 'Always prompt for password upon connection' is set to 'Enabled' | Fail ||
| 18.9.65.3.9.2 | Ensure 'Require secure RPC communication' is set to 'Enabled' | Fail ||
| 18.9.65.3.9.3 | Ensure 'Set client connection encryption level' is set to 'Enabled: High Level' | Pass ||
| 18.9.65.3.11.1 | Ensure 'Do not delete temp folders upon exit' is set to 'Disabled' | Pass ||
| 18.9.65.3.11.2 | Ensure 'Do not use temporary folders per session' is set to 'Disabled' | Pass ||
| 18.9.66.1 | Ensure 'Prevent downloading of enclosures' is set to 'Enabled' | Fail ||
| 18.9.67.2 | Ensure 'Allow indexing of encrypted files' is set to 'Disabled' | Pass ||
| 18.9.85.1.1 | Ensure 'Configure Windows Defender SmartScreen' is set to 'Enabled: Warn and prevent bypass' | Fail ||
| 18.9.90.1 | Ensure 'Allow user control over installs' is set to 'Disabled' | Pass ||
| 18.9.90.2 | Ensure 'Always install with elevated privileges' is set to 'Disabled' | Pass ||
| 18.9.91.1 | Ensure 'Sign-in and lock last interactive user automatically after a restart' is set to 'Disabled' | Pass ||
| 18.9.100.1 | Ensure 'Turn on PowerShell Script Block Logging' is set to 'Enabled' | Fail ||
| 18.9.100.2 | Ensure 'Turn on PowerShell Transcription' is set to 'Disabled' | Pass ||
| 18.9.102.1.1 | Ensure 'Allow Basic authentication' is set to 'Disabled' | Pass ||
| 18.9.102.1.2 | Ensure 'Allow unencrypted traffic' is set to 'Disabled' | Pass ||
| 18.9.102.1.3 | Ensure 'Disallow Digest authentication' is set to 'Enabled' | Fail ||
| 18.9.102.2.1 | Ensure 'Allow Basic authentication' is set to 'Disabled' | Pass ||
| 18.9.102.2.2 | Ensure 'Allow unencrypted traffic' is set to 'Disabled' | Pass ||
| 18.9.102.2.3 | Ensure 'Disallow WinRM from storing RunAs credentials' is set to 'Enabled' | Fail ||
| 18.9.105.2.1 | Ensure 'Prevent users from modifying settings' is set to 'Enabled' | Pass ||

## Next steps  

For more information about AKS security, see the following articles:

* [Azure Kubernetes Service (AKS)](./intro-kubernetes.md)
* [AKS security considerations](./concepts-security.md)
* [AKS best practices](./best-practices.md)

<!-- EXTERNAL LINKS -->
[cis-benchmark-windows]: https://www.cisecurity.org/benchmark/windows/

<!-- INTERNAL LINKS -->
[cis-benchmarks]: /compliance/regulatory/offering-CIS-Benchmark
[security-concepts-aks-apps-clusters]: concepts-security.md
[windows-security-baseline]: ../governance/policy/samples/guest-configuration-baseline-windows.md