---
title: Reference table for all security alerts
description: This article lists the security alerts visible in Microsoft Defender for Cloud.
ms.topic: reference
ms.date: 03/17/2024
ai-usage: ai-assisted
---

# Security alerts - a reference guide

This article lists the security alerts you might get from Microsoft Defender for Cloud and any Microsoft Defender plans you enabled. The alerts shown in your environment depend on the resources and services you're protecting, and your customized configuration.

At the bottom of this page, there's a table describing the Microsoft Defender for Cloud kill chain aligned with version 9 of the [MITRE ATT&CK matrix](https://attack.mitre.org/versions/v9/).

[Learn how to respond to these alerts](managing-and-responding-alerts.md).

[Learn how to export alerts](continuous-export.md).

> [!NOTE]
> Alerts from different sources might take different amounts of time to appear. For example, alerts that require analysis of network traffic might take longer to appear than alerts related to suspicious processes running on virtual machines.

## Alerts for Windows machines

Microsoft Defender for Servers Plan 2 provides unique detections and alerts, in addition to the ones provided by Microsoft Defender for Endpoint. The alerts provided for Windows machines are:

[Further details and notes](defender-for-servers-introduction.md)

### **A logon from a malicious IP has been detected. [seen multiple times]**

**Description**: A successful remote authentication for the account [account] and process [process] occurred, however the logon IP address (x.x.x.x) has previously been reported as malicious or highly unusual. A successful attack has probably occurred. Files with the .scr extensions are screen saver files and are normally reside and execute from the Windows system directory.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: High

### **Adaptive application control policy violation was audited**

VM_AdaptiveApplicationControlWindowsViolationAudited

**Description**: The below users ran applications that are violating the application control policy of your organization on this machine. It can possibly expose the machine to malware or application vulnerabilities.

**[MITRE tactics](#mitre-attck-tactics)**: Execution

**Severity**: Informational

### **Addition of Guest account to Local Administrators group**

**Description**: Analysis of host data has detected the addition of the built-in Guest account to the Local Administrators group on %{Compromised Host}, which is strongly associated with attacker activity.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: Medium

### **An event log was cleared**

**Description**: Machine logs indicate a suspicious event log clearing operation by user: '%{user name}' in Machine: '%{CompromisedEntity}'. The %{log channel} log was cleared.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: Informational

### **Antimalware Action Failed**

**Description**: Microsoft Antimalware has encountered an error when taking an action on malware or other potentially unwanted software.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: Medium

### **Antimalware Action Taken**

**Description**: Microsoft Antimalware for Azure has taken an action to protect this machine from malware or other potentially unwanted software.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: Medium

### **Antimalware broad files exclusion in your virtual machine**

(VM_AmBroadFilesExclusion)

**Description**: Files exclusion from antimalware extension with broad exclusion rule was detected in your virtual machine by analyzing the Azure Resource Manager operations in your subscription. Such exclusion practically disabling the Antimalware protection.
Attackers might exclude files from the antimalware scan on your virtual machine to prevent detection while running arbitrary code or infecting the machine with malware.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: Medium

### **Antimalware disabled and code execution in your virtual machine**

(VM_AmDisablementAndCodeExecution)

**Description**: Antimalware disabled at the same time as code execution on your virtual machine. This was detected by analyzing Azure Resource Manager operations in your subscription.
Attackers disable antimalware scanners to prevent detection while running unauthorized tools or infecting the machine with malware.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: High

### **Antimalware disabled in your virtual machine**

(VM_AmDisablement)

**Description**: Antimalware disabled in your virtual machine. This was detected by analyzing Azure Resource Manager operations in your subscription.
Attackers might disable the antimalware on your virtual machine to prevent detection.

**[MITRE tactics](#mitre-attck-tactics)**: Defense Evasion

**Severity**: Medium

### **Antimalware file exclusion and code execution in your virtual machine**

(VM_AmFileExclusionAndCodeExecution)

**Description**: File excluded from your antimalware scanner at the same time as code was executed via a custom script extension on your virtual machine. This was detected by analyzing Azure Resource Manager operations in your subscription.
Attackers might exclude files from the antimalware scan on your virtual machine to prevent detection while running unauthorized tools or infecting the machine with malware.

**[MITRE tactics](#mitre-attck-tactics)**: Defense Evasion, Execution

**Severity**: High

### **Antimalware file exclusion and code execution in your virtual machine**

(VM_AmTempFileExclusionAndCodeExecution)

**Description**: Temporary file exclusion from antimalware extension in parallel to execution of code via custom script extension was detected in your virtual machine by analyzing the Azure Resource Manager operations in your subscription.
Attackers might exclude files from the antimalware scan on your virtual machine to prevent detection while running arbitrary code or infecting the machine with malware.

**[MITRE tactics](#mitre-attck-tactics)**: Defense Evasion, Execution

**Severity**: High

### **Antimalware file exclusion in your virtual machine**

(VM_AmTempFileExclusion)

**Description**: File excluded from your antimalware scanner on your virtual machine. This was detected by analyzing Azure Resource Manager operations in your subscription.
Attackers might exclude files from the antimalware scan on your virtual machine to prevent detection while running unauthorized tools or infecting the machine with malware.

**[MITRE tactics](#mitre-attck-tactics)**: Defense Evasion

**Severity**: Medium

### **Antimalware real-time protection was disabled in your virtual machine**

(VM_AmRealtimeProtectionDisabled)

**Description**: Real-time protection disablement of the antimalware extension was detected in your virtual machine by analyzing the Azure Resource Manager operations in your subscription.
Attackers might disable real-time protection from the antimalware scan on your virtual machine to avoid detection while running arbitrary code or infecting the machine with malware.

**[MITRE tactics](#mitre-attck-tactics)**: Defense Evasion

**Severity**: Medium

### **Antimalware real-time protection was disabled temporarily in your virtual machine**

(VM_AmTempRealtimeProtectionDisablement)

**Description**: Real-time protection temporary disablement of the antimalware extension was detected in your virtual machine by analyzing the Azure Resource Manager operations in your subscription.
Attackers might disable real-time protection from the antimalware scan on your virtual machine to avoid detection while running arbitrary code or infecting the machine with malware.

**[MITRE tactics](#mitre-attck-tactics)**: Defense Evasion

**Severity**: Medium

### **Antimalware real-time protection was disabled temporarily while code was executed in your virtual machine**

(VM_AmRealtimeProtectionDisablementAndCodeExec)

**Description**: Real-time protection temporary disablement of the antimalware extension in parallel to code execution via custom script extension was detected in your virtual machine by analyzing the Azure Resource Manager operations in your subscription.
Attackers might disable real-time protection from the antimalware scan on your virtual machine to avoid detection while running arbitrary code or infecting the machine with malware.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: High

### **Antimalware scans blocked for files potentially related to malware campaigns on your virtual machine (Preview)**

(VM_AmMalwareCampaignRelatedExclusion)

**Description**: An exclusion rule was detected in your virtual machine to prevent your antimalware extension scanning certain files that are suspected of being related to a malware campaign. The rule was detected by analyzing the Azure Resource Manager operations in your subscription. Attackers might exclude files from antimalware scans to prevent detection while running arbitrary code or infecting the machine with malware.

**[MITRE tactics](#mitre-attck-tactics)**: Defense Evasion

**Severity**: Medium

### **Antimalware temporarily disabled in your virtual machine**

(VM_AmTemporarilyDisablement)

**Description**: Antimalware temporarily disabled in your virtual machine. This was detected by analyzing Azure Resource Manager operations in your subscription.
Attackers might disable the antimalware on your virtual machine to prevent detection.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: Medium

### **Antimalware unusual file exclusion in your virtual machine**

(VM_UnusualAmFileExclusion)

**Description**: Unusual file exclusion from antimalware extension was detected in your virtual machine by analyzing the Azure Resource Manager operations in your subscription.
Attackers might exclude files from the antimalware scan on your virtual machine to prevent detection while running arbitrary code or infecting the machine with malware.

**[MITRE tactics](#mitre-attck-tactics)**: Defense Evasion

**Severity**: Medium

### **Communication with suspicious domain identified by threat intelligence**

(AzureDNS_ThreatIntelSuspectDomain)

**Description**: Communication with suspicious domain was detected by analyzing DNS transactions from your resource and comparing against known malicious domains identified by threat intelligence feeds. Communication to malicious domains is frequently performed by attackers and could imply that your resource is compromised.

**[MITRE tactics](#mitre-attck-tactics)**: Initial Access, Persistence, Execution, Command And Control, Exploitation

**Severity**: Medium

### **Detected actions indicative of disabling and deleting IIS log files**

**Description**: Analysis of host data detected actions that show IIS log files being disabled and/or deleted.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: Medium

### **Detected anomalous mix of upper and lower case characters in command-line**

**Description**: Analysis of host data on %{Compromised Host} detected a command line with anomalous mix of upper and lower case characters. This kind of pattern, while possibly benign, is also typical of attackers trying to hide from case-sensitive or hash-based rule matching when performing administrative tasks on a compromised host.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: Medium

### **Detected change to a registry key that can be abused to bypass UAC**

**Description**: Analysis of host data on %{Compromised Host} detected that a registry key that can be abused to bypass UAC (User Account Control) was changed. This kind of configuration, while possibly benign, is also typical of attacker activity when trying to move from unprivileged (standard user) to privileged (for example administrator) access on a compromised host.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: Medium

### **Detected decoding of an executable using built-in certutil.exe tool**

**Description**: Analysis of host data on %{Compromised Host} detected that certutil.exe, a built-in administrator utility, was being used to decode an executable instead of its mainstream purpose that relates to manipulating certificates and certificate data. Attackers are known to abuse functionality of legitimate administrator tools to perform malicious actions, for example using a tool such as certutil.exe to decode a malicious executable that will then be subsequently executed.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: High

### **Detected enabling of the WDigest UseLogonCredential registry key**

**Description**: Analysis of host data detected a change in the registry key HKLM\SYSTEM\ CurrentControlSet\Control\SecurityProviders\WDigest\ "UseLogonCredential". Specifically this key has been updated to allow logon credentials to be stored in clear text in LSA memory. Once enabled, an attacker can dump clear text passwords from LSA memory with credential harvesting tools such as Mimikatz.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: Medium

### **Detected encoded executable in command line data**

**Description**: Analysis of host data on %{Compromised Host} detected a base-64 encoded executable. This has previously been associated with attackers attempting to construct executables on-the-fly through a sequence of commands, and attempting to evade intrusion detection systems by ensuring that no individual command would trigger an alert. This could be legitimate activity, or an indication of a compromised host.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: High

### **Detected obfuscated command line**

**Description**: Attackers use increasingly complex obfuscation techniques to evade detections that run against the underlying data. Analysis of host data on %{Compromised Host} detected suspicious indicators of obfuscation on the commandline.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: Informational

### **Detected possible execution of keygen executable**

**Description**: Analysis of host data on %{Compromised Host} detected execution of a process whose name is indicative of a keygen tool; such tools are typically used to defeat software licensing mechanisms but their download is often bundled with other malicious software. Activity group GOLD has been known to make use of such keygens to covertly gain back door access to hosts that they compromise.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: Medium

### **Detected possible execution of malware dropper**

**Description**: Analysis of host data on %{Compromised Host} detected a filename that has previously been associated with one of activity group GOLD's methods of installing malware on a victim host.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: High

### **Detected possible local reconnaissance activity**

**Description**: Analysis of host data on %{Compromised Host} detected a combination of systeminfo commands that has previously been associated with one of activity group GOLD's methods of performing reconnaissance activity. While 'systeminfo.exe' is a legitimate Windows tool, executing it twice in succession in the way that has occurred here is rare.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: Low

### **Detected potentially suspicious use of Telegram tool**

**Description**: Analysis of host data shows installation of Telegram, a free cloud-based instant messaging service that exists both for mobile and desktop system. Attackers are known to abuse this service to transfer malicious binaries to any other computer, phone, or tablet.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: Medium

### **Detected suppression of legal notice displayed to users at logon**

**Description**: Analysis of host data on %{Compromised Host} detected changes to the registry key that controls whether a legal notice is displayed to users when they log on. Microsoft security analysis has determined that this is a common activity undertaken by attackers after having compromised a host.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: Low

### **Detected suspicious combination of HTA and PowerShell**

**Description**: mshta.exe (Microsoft HTML Application Host) which is a signed Microsoft binary is being used by the attackers to launch malicious PowerShell commands. Attackers often resort to having an HTA file with inline VBScript. When a victim browses to the HTA file and chooses to run it, the PowerShell commands and scripts that it contains are executed. Analysis of host data on %{Compromised Host} detected mshta.exe launching PowerShell commands.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: Medium

### **Detected suspicious commandline arguments**

**Description**: Analysis of host data on %{Compromised Host} detected suspicious commandline arguments that have been used in conjunction with a reverse shell used by activity group HYDROGEN.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: High

### **Detected suspicious commandline used to start all executables in a directory**

**Description**: Analysis of host data has detected a suspicious process running on %{Compromised Host}. The commandline indicates an attempt to start all executables (*.exe) that might reside in a directory. This could be an indication of a compromised host.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: Medium

### **Detected suspicious credentials in commandline**

**Description**: Analysis of host data on %{Compromised Host} detected a suspicious password being used to execute a file by activity group BORON. This activity group has been known to use this password to execute Pirpi malware on a victim host.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: High

### **Detected suspicious document credentials**

**Description**: Analysis of host data on %{Compromised Host} detected a suspicious, common precomputed password hash used by malware being used to execute a file. Activity group HYDROGEN has been known to use this password to execute malware on a victim host.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: High

### **Detected suspicious execution of VBScript.Encode command**

**Description**: Analysis of host data on %{Compromised Host} detected the execution of VBScript.Encode command. This encodes the scripts into unreadable text, making it more difficult for users to examine the code. Microsoft threat research shows that attackers often use encoded VBscript files as part of their attack to evade detection systems. This could be legitimate activity, or an indication of a compromised host.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: Medium

### **Detected suspicious execution via rundll32.exe**

**Description**: Analysis of host data on %{Compromised Host} detected rundll32.exe being used to execute a process with an uncommon name, consistent with the process naming scheme previously seen used by activity group GOLD when installing their first stage implant on a compromised host.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: High

### **Detected suspicious file cleanup commands**

**Description**: Analysis of host data on %{Compromised Host} detected a combination of systeminfo commands that has previously been associated with one of activity group GOLD's methods of performing post-compromise self-cleanup activity. While 'systeminfo.exe' is a legitimate Windows tool, executing it twice in succession, followed by a delete command in the way that has occurred here is rare.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: High

### **Detected suspicious file creation**

**Description**: Analysis of host data on %{Compromised Host} detected creation or execution of a process that has previously indicated post-compromise action taken on a victim host by activity group BARIUM. This activity group has been known to use this technique to download more malware to a compromised host after an attachment in a phishing doc has been opened.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: High

### **Detected suspicious named pipe communications**

**Description**: Analysis of host data on %{Compromised Host} detected data being written to a local named pipe from a Windows console command. Named pipes are known to be a channel used by attackers to task and communicate with a malicious implant. This could be legitimate activity, or an indication of a compromised host.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: High

### **Detected suspicious network activity**

**Description**: Analysis of network traffic from %{Compromised Host} detected suspicious network activity. Such traffic, while possibly benign, is typically used by an attacker to communicate with malicious servers for downloading of tools, command-and-control and exfiltration of data. Typical related attacker activity includes copying remote administration tools to a compromised host and exfiltrating user data from it.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: Low

### **Detected suspicious new firewall rule**

**Description**: Analysis of host data detected a new firewall rule has been added via netsh.exe to allow traffic from an executable in a suspicious location.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: Medium

### **Detected suspicious use of Cacls to lower the security state of the system**

**Description**: Attackers use myriad ways like brute force, spear phishing etc. to achieve initial compromise and get a foothold on the network. Once initial compromise is achieved they often take steps to lower the security settings of a system. Caclsâ€”short for change access control list is Microsoft Windows native command-line utility often used for modifying the security permission on folders and files. A lot of time the binary is used by the attackers to lower the security settings of a system. This is done by giving Everyone full access to some of the system binaries like ftp.exe, net.exe, wscript.exe etc. Analysis of host data on %{Compromised Host} detected suspicious use of Cacls to lower the security of a system.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: Medium

### **Detected suspicious use of FTP -s Switch**

**Description**: Analysis of process creation data from the %{Compromised Host} detected the use of the FTP "-s:filename" switch. This switch is used to specify an FTP script file for the client to run. Malware or malicious processes are known to use this FTP switch (-s:filename) to point to a script file, which is configured to connect to a remote FTP server and download more malicious binaries.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: Medium

### **Detected suspicious use of Pcalua.exe to launch executable code**

**Description**: Analysis of host data on %{Compromised Host} detected the use of pcalua.exe to launch executable code. Pcalua.exe is component of the Microsoft Windows "Program Compatibility Assistant", which detects compatibility issues during the installation or execution of a program. Attackers are known to abuse functionality of legitimate Windows system tools to perform malicious actions, for example using pcalua.exe with the -a switch to launch malicious executables either locally or from remote shares.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: Medium

### **Detected the disabling of critical services**

**Description**: The analysis of host data on %{Compromised Host} detected execution of "net.exe stop" command being used to stop critical services like SharedAccess or the Windows Security app. The stopping of either of these services can be indication of a malicious behavior.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: Medium

### **Digital currency mining related behavior detected**

**Description**: Analysis of host data on %{Compromised Host} detected the execution of a process or command normally associated with digital currency mining.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: High

### **Dynamic PS script construction**

**Description**: Analysis of host data on %{Compromised Host} detected a PowerShell script being constructed dynamically. Attackers sometimes use this approach of progressively building up a script in order to evade IDS systems. This could be legitimate activity, or an indication that one of your machines has been compromised.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: Medium

### **Executable found running from a suspicious location**

**Description**: Analysis of host data detected an executable file on %{Compromised Host} that is running from a location in common with known suspicious files. This executable could either be legitimate activity, or an indication of a compromised host.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: High

### **Fileless attack behavior detected**

(VM_FilelessAttackBehavior.Windows)

**Description**: The memory of the process specified contains behaviors commonly used by fileless attacks. Specific behaviors include:

1) Shellcode, which is a small piece of code typically used as the payload in the exploitation of a software vulnerability.
2) Active network connections. See NetworkConnections below for details.
3) Function calls to security sensitive operating system interfaces. See Capabilities below for referenced OS capabilities.
4) Contains a thread that was started in a dynamically allocated code segment. This is a common pattern for process injection attacks.

**[MITRE tactics](#mitre-attck-tactics)**: Defense Evasion

**Severity**: Low

### **Fileless attack technique detected**

(VM_FilelessAttackTechnique.Windows)

**Description**: The memory of the process specified below contains evidence of a fileless attack technique. Fileless attacks are used by attackers to execute code while evading detection by security software. Specific behaviors include:

1) Shellcode, which is a small piece of code typically used as the payload in the exploitation of a software vulnerability.
2) Executable image injected into the process, such as in a code injection attack.
3) Active network connections. See NetworkConnections below for details.
4) Function calls to security sensitive operating system interfaces. See Capabilities below for referenced OS capabilities.
5) Process hollowing, which is a technique used by malware in which a legitimate process is loaded on the system to act as a container for hostile code.
6) Contains a thread that was started in a dynamically allocated code segment. This is a common pattern for process injection attacks.

**[MITRE tactics](#mitre-attck-tactics)**: Defense Evasion, Execution

**Severity**: High

### **Fileless attack toolkit detected**

(VM_FilelessAttackToolkit.Windows)

**Description**: The memory of the process specified contains a fileless attack toolkit: [toolkit name]. Fileless attack toolkits use techniques that minimize or eliminate traces of malware on disk, and greatly reduce the chances of detection by disk-based malware scanning solutions. Specific behaviors include:

1) Well-known toolkits and crypto mining software.
2) Shellcode, which is a small piece of code typically used as the payload in the exploitation of a software vulnerability.
3) Injected malicious executable in process memory.

**[MITRE tactics](#mitre-attck-tactics)**: Defense Evasion, Execution

**Severity**: Medium

### **High risk software detected**

**Description**: Analysis of host data from %{Compromised Host} detected the usage of software that has been associated with the installation of malware in the past. A common technique utilized in the distribution of malicious software is to package it within otherwise benign tools such as the one seen in this alert. When you use these tools, the malware can be silently installed in the background.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: Medium

### **Local Administrators group members were enumerated**

**Description**: Machine logs indicate a successful enumeration on group %{Enumerated Group Domain Name}\%{Enumerated Group Name}. Specifically, %{Enumerating User Domain Name}\%{Enumerating User Name} remotely enumerated the members of the %{Enumerated Group Domain Name}\%{Enumerated Group Name} group. This activity could either be legitimate activity, or an indication that a machine in your organization has been compromised and used to reconnaissance %{vmname}.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: Informational

### **Malicious firewall rule created by ZINC server implant [seen multiple times]**

**Description**: A firewall rule was created using techniques that match a known actor, ZINC. The rule was possibly used to open a port on %{Compromised Host} to allow for Command & Control communications. This behavior was seen [x] times today on the following machines: [Machine names]

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: High

### **Malicious SQL activity**

**Description**: Machine logs indicate that '%{process name}' was executed by account: %{user name}. This activity is considered malicious.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: High

### **Multiple Domain Accounts Queried**

**Description**: Analysis of host data has determined that an unusual number of distinct domain accounts are being queried within a short time period from %{Compromised Host}. This kind of activity could be legitimate, but can also be an indication of compromise.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: Medium

### **Possible credential dumping detected [seen multiple times]**

**Description**: Analysis of host data has detected use of native windows tool (for example, sqldumper.exe) being used in a way that allows to extract credentials from memory. Attackers often use these techniques to extract credentials that they then further use for lateral movement and privilege escalation. This behavior was seen [x] times today on the following machines: [Machine names]

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: Medium

### **Potential attempt to bypass AppLocker detected**

**Description**: Analysis of host data on %{Compromised Host} detected a potential attempt to bypass AppLocker restrictions. AppLocker can be configured to implement a policy that limits what executables are allowed to run on a Windows system. The command-line pattern similar to that identified in this alert has been previously associated with attacker attempts to circumvent AppLocker policy by using trusted executables (allowed by AppLocker policy) to execute untrusted code. This could be legitimate activity, or an indication of a compromised host.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: High

### **Rare SVCHOST service group executed**

(VM_SvcHostRunInRareServiceGroup)

**Description**: The system process SVCHOST was observed running a rare service group. Malware often uses SVCHOST to masquerade its malicious activity.

**[MITRE tactics](#mitre-attck-tactics)**: Defense Evasion, Execution

**Severity**: Informational

### **Sticky keys attack detected**

**Description**: Analysis of host data indicates that an attacker might be subverting an accessibility binary (for example sticky keys, onscreen keyboard, narrator) in order to provide backdoor access to the host %{Compromised Host}.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: Medium

### **Successful brute force attack**

(VM_LoginBruteForceSuccess)

**Description**: Several sign in attempts were detected from the same source. Some successfully authenticated to the host.
This resembles a burst attack, in which an attacker performs numerous authentication attempts to find valid account credentials.

**[MITRE tactics](#mitre-attck-tactics)**: Exploitation

**Severity**: Medium/High

### **Suspect integrity level indicative of RDP hijacking**

**Description**: Analysis of host data has detected the tscon.exe running with SYSTEM privileges - this can be indicative of an attacker abusing this binary in order to switch context to any other logged on user on this host; it's a known attacker technique to compromise more user accounts and move laterally across a network.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: Medium

### **Suspect service installation**

**Description**: Analysis of host data has detected the installation of tscon.exe as a service: this binary being started as a service potentially allows an attacker to trivially switch to any other logged on user on this host by hijacking RDP connections; it's a known attacker technique to compromise more user accounts and move laterally across a network.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: Medium

### **Suspected Kerberos Golden Ticket attack parameters observed**

**Description**: Analysis of host data detected commandline parameters consistent with a Kerberos Golden Ticket attack.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: Medium

### **Suspicious Account Creation Detected**

**Description**: Analysis of host data on %{Compromised Host} detected creation or use of a local account %{Suspicious account name} : this account name closely resembles a standard Windows account or group name '%{Similar To Account Name}'. This is potentially a rogue account created by an attacker, so named in order to avoid being noticed by a human administrator.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: Medium

### **Suspicious Activity Detected**

(VM_SuspiciousActivity)

**Description**: Analysis of host data has detected a sequence of one or more processes running on %{machine name} that have historically been associated with malicious activity. While individual commands might appear benign the alert is scored based on an aggregation of these commands. This could either be legitimate activity, or an indication of a compromised host.

**[MITRE tactics](#mitre-attck-tactics)**: Execution

**Severity**: Medium

### **Suspicious authentication activity**

(VM_LoginBruteForceValidUserFailed)

**Description**: Although none of them succeeded, some of them used accounts were recognized by the host. This resembles a dictionary attack, in which an attacker performs numerous authentication attempts using a dictionary of predefined account names and passwords in order to find valid credentials to access the host. This indicates that some of your host account names might exist in a well-known account name dictionary.

**[MITRE tactics](#mitre-attck-tactics)**: Probing

**Severity**: Medium

### **Suspicious code segment detected**

**Description**: Indicates that a code segment has been allocated by using non-standard methods, such as reflective injection and process hollowing. The alert provides more characteristics of the code segment that have been processed to provide context for the capabilities and behaviors of the reported code segment.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: Medium

### **Suspicious double extension file executed**

**Description**: Analysis of host data indicates an execution of a process with a suspicious double extension. This extension might trick users into thinking files are safe to be opened and might indicate the presence of malware on the system.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: High

### **Suspicious download using Certutil detected [seen multiple times]**

**Description**: Analysis of host data on %{Compromised Host} detected the use of certutil.exe, a built-in administrator utility, for the download of a binary instead of its mainstream purpose that relates to manipulating certificates and certificate data. Attackers are known to abuse functionality of legitimate administrator tools to perform malicious actions, for example using certutil.exe to download and decode a malicious executable that will then be subsequently executed. This behavior was seen [x] times today on the following machines: [Machine names]

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: Medium

### **Suspicious download using Certutil detected**

**Description**: Analysis of host data on %{Compromised Host} detected the use of certutil.exe, a built-in administrator utility, for the download of a binary instead of its mainstream purpose that relates to manipulating certificates and certificate data. Attackers are known to abuse functionality of legitimate administrator tools to perform malicious actions, for example using certutil.exe to download and decode a malicious executable that will then be subsequently executed.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: Medium

### **Suspicious PowerShell Activity Detected**

**Description**: Analysis of host data detected a PowerShell script running on %{Compromised Host} that has features in common with known suspicious scripts. This script could either be legitimate activity, or an indication of a compromised host.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: High

### **Suspicious PowerShell cmdlets executed**

**Description**: Analysis of host data indicates execution of known malicious PowerShell PowerSploit cmdlets.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: Medium

### **Suspicious process executed [seen multiple times]**

**Description**: Machine logs indicate that the suspicious process: '%{Suspicious Process}' was running on the machine, often associated with attacker attempts to access credentials. This behavior was seen [x] times today on the following machines: [Machine names]

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: High

### **Suspicious process executed**

**Description**: Machine logs indicate that the suspicious process: '%{Suspicious Process}' was running on the machine, often associated with attacker attempts to access credentials.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: High

### **Suspicious process name detected [seen multiple times]**

**Description**: Analysis of host data on %{Compromised Host} detected a process whose name is suspicious, for example corresponding to a known attacker tool or named in a way that is suggestive of attacker tools that try to hide in plain sight. This process could be legitimate activity, or an indication that one of your machines has been compromised. This behavior was seen [x] times today on the following machines: [Machine names]

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: Medium

### **Suspicious process name detected**

**Description**: Analysis of host data on %{Compromised Host} detected a process whose name is suspicious, for example corresponding to a known attacker tool or named in a way that is suggestive of attacker tools that try to hide in plain sight. This process could be legitimate activity, or an indication that one of your machines has been compromised.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: Medium

### **Suspicious SQL activity**

**Description**: Machine logs indicate that '%{process name}' was executed by account: %{user name}. This activity is uncommon with this account.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: Medium

### **Suspicious SVCHOST process executed**

**Description**: The system process SVCHOST was observed running in an abnormal context. Malware often uses SVCHOST to masquerade its malicious activity.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: High

### **Suspicious system process executed**

(VM_SystemProcessInAbnormalContext)

**Description**: The system process %{process name} was observed running in an abnormal context. Malware often uses this process name to masquerade its malicious activity.

**[MITRE tactics](#mitre-attck-tactics)**: Defense Evasion, Execution

**Severity**: High

### **Suspicious Volume Shadow Copy Activity**

**Description**: Analysis of host data has detected a shadow copy deletion activity on the resource. Volume Shadow Copy (VSC) is an important artifact that stores data snapshots. Some malware and specifically Ransomware, targets VSC to sabotage backup strategies.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: High

### **Suspicious WindowPosition registry value detected**

**Description**: Analysis of host data on %{Compromised Host} detected an attempted WindowPosition registry configuration change that could be indicative of hiding application windows in nonvisible sections of the desktop. This could be legitimate activity, or an indication of a compromised machine: this type of activity has been previously associated with known adware (or unwanted software) such as Win32/OneSystemCare and Win32/SystemHealer and malware such as Win32/Creprote. When the WindowPosition value is set to 201329664, (Hex: 0x0c00 0c00, corresponding to X-axis=0c00 and the Y-axis=0c00) this places the console app's window in a non-visible section of the user's screen in an area that is hidden from view below the visible start menu/taskbar. Known suspect Hex value includes, but not limited to c000c000.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: Low

### **Suspiciously named process detected**

**Description**: Analysis of host data on %{Compromised Host} detected a process whose name is very similar to but different from a very commonly run process (%{Similar To Process Name}). While this process could be benign attackers are known to sometimes hide in plain sight by naming their malicious tools to resemble legitimate process names.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: Medium

### **Unusual config reset in your virtual machine**

(VM_VMAccessUnusualConfigReset)

**Description**: An unusual config reset was detected in your virtual machine by analyzing the Azure Resource Manager operations in your subscription.
While this action might be legitimate, attackers can try utilizing VM Access extension to reset the configuration in your virtual machine and compromise it.

**[MITRE tactics](#mitre-attck-tactics)**: Credential Access

**Severity**: Medium

### **Unusual process execution detected**

**Description**: Analysis of host data on %{Compromised Host} detected the execution of a process by %{User Name} that was unusual. Accounts such as %{User Name} tend to perform a limited set of operations, this execution was determined to be out of character and might be suspicious.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: High

### **Unusual user password reset in your virtual machine**

(VM_VMAccessUnusualPasswordReset)

**Description**: An unusual user password reset was detected in your virtual machine by analyzing the Azure Resource Manager operations in your subscription.
While this action might be legitimate, attackers can try utilizing the VM Access extension to reset the credentials of a local user in your virtual machine and compromise it.

**[MITRE tactics](#mitre-attck-tactics)**: Credential Access

**Severity**: Medium

### **Unusual user SSH key reset in your virtual machine**

(VM_VMAccessUnusualSSHReset)

**Description**: An unusual user SSH key reset was detected in your virtual machine by analyzing the Azure Resource Manager operations in your subscription.
While this action might be legitimate, attackers can try utilizing VM Access extension to reset SSH key of a user account in your virtual machine and compromise it.

**[MITRE tactics](#mitre-attck-tactics)**: Credential Access

**Severity**: Medium

### **VBScript HTTP object allocation detected**

**Description**: Creation of a VBScript file using Command Prompt has been detected. The following script contains HTTP object allocation command. This action can be used to download malicious files.

### **Suspicious installation of GPU extension in your virtual machine (Preview)**

 (VM_GPUDriverExtensionUnusualExecution)

**Description**: Suspicious installation of a GPU extension was detected in your virtual machine by analyzing the Azure Resource Manager operations in your subscription. Attackers might use the GPU driver extension to install GPU drivers on your virtual machine via the Azure Resource Manager to perform cryptojacking.

**[MITRE tactics](#mitre-attck-tactics)**: Impact

**Severity**: Low

## Alerts for Linux machines

Microsoft Defender for Servers Plan 2 provides unique detections and alerts, in addition to the ones provided by Microsoft Defender for Endpoint. The alerts provided for Linux machines are:

[Further details and notes](defender-for-servers-introduction.md)

### **a history file has been cleared**

**Description**: Analysis of host data indicates that the command history log file has been cleared. Attackers might do this to cover their traces. The operation was performed by user: '%{user name}'.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: Medium

### **Adaptive application control policy violation was audited**

(VM_AdaptiveApplicationControlLinuxViolationAudited)

**Description**: The below users ran applications that are violating the application control policy of your organization on this machine. It can possibly expose the machine to malware or application vulnerabilities.

**[MITRE tactics](#mitre-attck-tactics)**: Execution

**Severity**: Informational

### **Antimalware broad files exclusion in your virtual machine**

(VM_AmBroadFilesExclusion)

**Description**: Files exclusion from antimalware extension with broad exclusion rule was detected in your virtual machine by analyzing the Azure Resource Manager operations in your subscription. Such exclusion practically disabling the Antimalware protection.
Attackers might exclude files from the antimalware scan on your virtual machine to prevent detection while running arbitrary code or infecting the machine with malware.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: Medium

### **Antimalware disabled and code execution in your virtual machine**

(VM_AmDisablementAndCodeExecution)

**Description**: Antimalware disabled at the same time as code execution on your virtual machine. This was detected by analyzing Azure Resource Manager operations in your subscription.
Attackers disable antimalware scanners to prevent detection while running unauthorized tools or infecting the machine with malware.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: High

### **Antimalware disabled in your virtual machine**

(VM_AmDisablement)

**Description**: Antimalware disabled in your virtual machine. This was detected by analyzing Azure Resource Manager operations in your subscription.
Attackers might disable the antimalware on your virtual machine to prevent detection.

**[MITRE tactics](#mitre-attck-tactics)**: Defense Evasion

**Severity**: Medium

### **Antimalware file exclusion and code execution in your virtual machine**

(VM_AmFileExclusionAndCodeExecution)

**Description**: File excluded from your antimalware scanner at the same time as code was executed via a custom script extension on your virtual machine. This was detected by analyzing Azure Resource Manager operations in your subscription.
Attackers might exclude files from the antimalware scan on your virtual machine to prevent detection while running unauthorized tools or infecting the machine with malware.

**[MITRE tactics](#mitre-attck-tactics)**: Defense Evasion, Execution

**Severity**: High

### **Antimalware file exclusion and code execution in your virtual machine**

(VM_AmTempFileExclusionAndCodeExecution)

**Description**: Temporary file exclusion from antimalware extension in parallel to execution of code via custom script extension was detected in your virtual machine by analyzing the Azure Resource Manager operations in your subscription.
Attackers might exclude files from the antimalware scan on your virtual machine to prevent detection while running arbitrary code or infecting the machine with malware.

**[MITRE tactics](#mitre-attck-tactics)**: Defense Evasion, Execution

**Severity**: High

### **Antimalware file exclusion in your virtual machine**

(VM_AmTempFileExclusion)

**Description**: File excluded from your antimalware scanner on your virtual machine. This was detected by analyzing Azure Resource Manager operations in your subscription.
Attackers might exclude files from the antimalware scan on your virtual machine to prevent detection while running unauthorized tools or infecting the machine with malware.

**[MITRE tactics](#mitre-attck-tactics)**: Defense Evasion

**Severity**: Medium

### **Antimalware real-time protection was disabled in your virtual machine**

(VM_AmRealtimeProtectionDisabled)

**Description**: Real-time protection disablement of the antimalware extension was detected in your virtual machine by analyzing the Azure Resource Manager operations in your subscription.
Attackers might disable real-time protection from the antimalware scan on your virtual machine to avoid detection while running arbitrary code or infecting the machine with malware.

**[MITRE tactics](#mitre-attck-tactics)**: Defense Evasion

**Severity**: Medium

### **Antimalware real-time protection was disabled temporarily in your virtual machine**

(VM_AmTempRealtimeProtectionDisablement)

**Description**: Real-time protection temporary disablement of the antimalware extension was detected in your virtual machine by analyzing the Azure Resource Manager operations in your subscription.
Attackers might disable real-time protection from the antimalware scan on your virtual machine to avoid detection while running arbitrary code or infecting the machine with malware.

**[MITRE tactics](#mitre-attck-tactics)**: Defense Evasion

**Severity**: Medium

### **Antimalware real-time protection was disabled temporarily while code was executed in your virtual machine**

(VM_AmRealtimeProtectionDisablementAndCodeExec)

**Description**: Real-time protection temporary disablement of the antimalware extension in parallel to code execution via custom script extension was detected in your virtual machine by analyzing the Azure Resource Manager operations in your subscription.
Attackers might disable real-time protection from the antimalware scan on your virtual machine to avoid detection while running arbitrary code or infecting the machine with malware.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: High

### **Antimalware scans blocked for files potentially related to malware campaigns on your virtual machine (Preview)**

(VM_AmMalwareCampaignRelatedExclusion)

**Description**: An exclusion rule was detected in your virtual machine to prevent your antimalware extension scanning certain files that are suspected of being related to a malware campaign. The rule was detected by analyzing the Azure Resource Manager operations in your subscription. Attackers might exclude files from antimalware scans to prevent detection while running arbitrary code or infecting the machine with malware.

**[MITRE tactics](#mitre-attck-tactics)**: Defense Evasion

**Severity**: Medium

### **Antimalware temporarily disabled in your virtual machine**

(VM_AmTemporarilyDisablement)

**Description**: Antimalware temporarily disabled in your virtual machine. This was detected by analyzing Azure Resource Manager operations in your subscription.
Attackers might disable the antimalware on your virtual machine to prevent detection.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: Medium

### **Antimalware unusual file exclusion in your virtual machine**

(VM_UnusualAmFileExclusion)

**Description**: Unusual file exclusion from antimalware extension was detected in your virtual machine by analyzing the Azure Resource Manager operations in your subscription.
Attackers might exclude files from the antimalware scan on your virtual machine to prevent detection while running arbitrary code or infecting the machine with malware.

**[MITRE tactics](#mitre-attck-tactics)**: Defense Evasion

**Severity**: Medium

### **Behavior similar to ransomware detected [seen multiple times]**

**Description**: Analysis of host data on %{Compromised Host} detected the execution of files that have resemblance of known ransomware that can prevent users from accessing their system or personal files, and demands ransom payment in order to regain access. This behavior was seen [x] times today on the following machines: [Machine names]

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: High

### **Communication with suspicious domain identified by threat intelligence**

(AzureDNS_ThreatIntelSuspectDomain)

**Description**: Communication with suspicious domain was detected by analyzing DNS transactions from your resource and comparing against known malicious domains identified by threat intelligence feeds. Communication to malicious domains is frequently performed by attackers and could imply that your resource is compromised.

**[MITRE tactics](#mitre-attck-tactics)**: Initial Access, Persistence, Execution, Command And Control, Exploitation

**Severity**: Medium

### **Container with a miner image detected**

(VM_MinerInContainerImage)

**Description**: Machine logs indicate execution of a Docker container that runs an image associated with a digital currency mining.

**[MITRE tactics](#mitre-attck-tactics)**: Execution

**Severity**: High

### **Detected anomalous mix of upper and lower case characters in command line**

**Description**: Analysis of host data on %{Compromised Host} detected a command line with anomalous mix of upper and lower case characters. This kind of pattern, while possibly benign, is also typical of attackers trying to hide from case-sensitive or hash-based rule matching when performing administrative tasks on a compromised host.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: Medium

### **Detected file download from a known malicious source**

**Description**: Analysis of host data has detected the download of a file from a known malware source on %{Compromised Host}.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: Medium

### **Detected suspicious network activity**

**Description**: Analysis of network traffic from %{Compromised Host} detected suspicious network activity. Such traffic, while possibly benign, is typically used by an attacker to communicate with malicious servers for downloading of tools, command-and-control and exfiltration of data. Typical related attacker activity includes copying remote administration tools to a compromised host and exfiltrating user data from it.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: Low

### **Digital currency mining related behavior detected**

**Description**: Analysis of host data on %{Compromised Host} detected the execution of a process or command normally associated with digital currency mining.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: High

### **Disabling of auditd logging [seen multiple times]**

**Description**: The Linux Audit system provides a way to track security-relevant information on the system. It records as much information about the events that are happening on your system as possible. Disabling auditd logging could hamper discovering violations of security policies used on the system. This behavior was seen [x] times today on the following machines: [Machine names]

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: Low

### **Exploitation of Xorg vulnerability [seen multiple times]**

**Description**: Analysis of host data on %{Compromised Host} detected the user of Xorg with suspicious arguments. Attackers might use this technique in privilege escalation attempts. This behavior was seen [x] times today on the following machines: [Machine names]

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: Medium

### **Failed SSH brute force attack**

(VM_SshBruteForceFailed)

**Description**: Failed brute force attacks were detected from the following attackers: %{Attackers}. Attackers were trying to access the host with the following user names: %{Accounts used on failed sign in to host attempts}.

**[MITRE tactics](#mitre-attck-tactics)**: Probing

**Severity**: Medium

### **Fileless Attack Behavior Detected**

(VM_FilelessAttackBehavior.Linux)

**Description**: The memory of the process specified below contains behaviors commonly used by fileless attacks.
Specific behaviors include: {list of observed behaviors}

**[MITRE tactics](#mitre-attck-tactics)**: Execution

**Severity**: Low

### **Fileless Attack Technique Detected**

(VM_FilelessAttackTechnique.Linux)

**Description**: The memory of the process specified below contains evidence of a fileless attack technique. Fileless attacks are used by attackers to execute code while evading detection by security software.
Specific behaviors include: {list of observed behaviors}

**[MITRE tactics](#mitre-attck-tactics)**: Execution

**Severity**: High

### **Fileless Attack Toolkit Detected**

(VM_FilelessAttackToolkit.Linux)

**Description**: The memory of the process specified below contains a fileless attack toolkit: {ToolKitName}. Fileless attack toolkits typically don't have a presence on the filesystem, making detection by traditional anti-virus software difficult.
Specific behaviors include: {list of observed behaviors}

**[MITRE tactics](#mitre-attck-tactics)**: Defense Evasion, Execution

**Severity**: High

### **Hidden file execution detected**

**Description**: Analysis of host data indicates that a hidden file was executed by %{user name}. This activity could either be legitimate activity, or an indication of a compromised host.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: Informational

### **New SSH key added [seen multiple times]**

(VM_SshKeyAddition)

**Description**: A new SSH key was added to the authorized keys file. This behavior was seen [x] times today on the following machines: [Machine names]

**[MITRE tactics](#mitre-attck-tactics)**: Persistence

**Severity**: Low

### **New SSH key added**

**Description**: A new SSH key was added to the authorized keys file.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: Low

### **Possible backdoor detected [seen multiple times]**

**Description**: Analysis of host data has detected a suspicious file being downloaded then run on %{Compromised Host} in your subscription. This activity has previously been associated with installation of a backdoor. This behavior was seen [x] times today on the following machines: [Machine names]

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: Medium

### **Possible exploitation of the mailserver detected**

(VM_MailserverExploitation )

**Description**: Analysis of host data on %{Compromised Host} detected an unusual execution under the mail server account

**[MITRE tactics](#mitre-attck-tactics)**: Exploitation

**Severity**: Medium

### **Possible malicious web shell detected**

**Description**: Analysis of host data on %{Compromised Host} detected a possible web shell. Attackers will often upload a web shell to a machine they've compromised to gain persistence or for further exploitation.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: Medium

### **Possible password change using crypt-method detected [seen multiple times]**

**Description**: Analysis of host data on %{Compromised Host} detected password change using crypt method. Attackers can make this change to continue access and gaining persistence after compromise. This behavior was seen [x] times today on the following machines: [Machine names]

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: Medium

### **Process associated with digital currency mining detected [seen multiple times]**

**Description**: Analysis of host data on %{Compromised Host} detected the execution of a process normally associated with digital currency mining. This behavior was seen over 100 times today on the following machines: [Machine name]

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: Medium

### **Process associated with digital currency mining detected**

**Description**: Host data analysis detected the execution of a process that is normally associated with digital currency mining.

**[MITRE tactics](#mitre-attck-tactics)**: Exploitation, Execution

**Severity**: Medium

### **Python encoded downloader detected [seen multiple times]**

**Description**: Analysis of host data on %{Compromised Host} detected the execution of encoded Python that downloads and runs code from a remote location. This might be an indication of malicious activity. This behavior was seen [x] times today on the following machines: [Machine names]

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: Low

### **Screenshot taken on host [seen multiple times]**

**Description**: Analysis of host data on %{Compromised Host} detected the user of a screen capture tool. Attackers might use these tools to access private data. This behavior was seen [x] times today on the following machines: [Machine names]

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: Low

### **Shellcode detected [seen multiple times]**

**Description**: Analysis of host data on %{Compromised Host} detected shellcode being generated from the command line. This process could be legitimate activity, or an indication that one of your machines has been compromised. This behavior was seen [x] times today on the following machines: [Machine names]

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: Medium

### **Successful SSH brute force attack**

(VM_SshBruteForceSuccess)

**Description**: Analysis of host data has detected a successful brute force attack. The IP %{Attacker source IP} was seen making multiple login attempts. Successful logins were made from that IP with the following user(s): %{Accounts used to successfully sign in to host}. This means that the host might be compromised and controlled by a malicious actor.

**[MITRE tactics](#mitre-attck-tactics)**: Exploitation

**Severity**: High

### **Suspicious Account Creation Detected**

**Description**: Analysis of host data on %{Compromised Host} detected creation or use of a local account %{Suspicious account name} : this account name closely resembles a standard Windows account or group name '%{Similar To Account Name}'. This is potentially a rogue account created by an attacker, so named in order to avoid being noticed by a human administrator.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: Medium

### **Suspicious kernel module detected [seen multiple times]**

**Description**: Analysis of host data on %{Compromised Host} detected a shared object file being loaded as a kernel module. This could be legitimate activity, or an indication that one of your machines has been compromised. This behavior was seen [x] times today on the following machines: [Machine names]

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: Medium

### **Suspicious password access [seen multiple times]**

**Description**: Analysis of host data has detected suspicious access to encrypted user passwords on %{Compromised Host}. This behavior was seen [x] times today on the following machines: [Machine names]

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: Informational

### **Suspicious password access**

**Description**: Analysis of host data has detected suspicious access to encrypted user passwords on %{Compromised Host}.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: Informational

### **Suspicious request to the Kubernetes Dashboard**

(VM_KubernetesDashboard)

**Description**: Machine logs indicate that a suspicious request was made to the Kubernetes Dashboard. The request was sent from a Kubernetes node, possibly from one of the containers running in the node. Although this behavior can be intentional, it might indicate that the node is running a compromised container.

**[MITRE tactics](#mitre-attck-tactics)**: LateralMovement

**Severity**: Medium

### **Unusual config reset in your virtual machine**

(VM_VMAccessUnusualConfigReset)

**Description**: An unusual config reset was detected in your virtual machine by analyzing the Azure Resource Manager operations in your subscription.
While this action might be legitimate, attackers can try utilizing VM Access extension to reset the configuration in your virtual machine and compromise it.

**[MITRE tactics](#mitre-attck-tactics)**: Credential Access

**Severity**: Medium

### **Unusual user password reset in your virtual machine**

(VM_VMAccessUnusualPasswordReset)

**Description**: An unusual user password reset was detected in your virtual machine by analyzing the Azure Resource Manager operations in your subscription.
While this action might be legitimate, attackers can try utilizing the VM Access extension to reset the credentials of a local user in your virtual machine and compromise it.

**[MITRE tactics](#mitre-attck-tactics)**: Credential Access

**Severity**: Medium

### **Unusual user SSH key reset in your virtual machine**

(VM_VMAccessUnusualSSHReset)

**Description**: An unusual user SSH key reset was detected in your virtual machine by analyzing the Azure Resource Manager operations in your subscription.
While this action might be legitimate, attackers can try utilizing VM Access extension to reset SSH key of a user account in your virtual machine and compromise it.

**[MITRE tactics](#mitre-attck-tactics)**: Credential Access

**Severity**: Medium

### **Suspicious installation of GPU extension in your virtual machine (Preview)**

 (VM_GPUDriverExtensionUnusualExecution)

**Description**: Suspicious installation of a GPU extension was detected in your virtual machine by analyzing the Azure Resource Manager operations in your subscription. Attackers might use the GPU driver extension to install GPU drivers on your virtual machine via the Azure Resource Manager to perform cryptojacking.

**[MITRE tactics](#mitre-attck-tactics)**: Impact

**Severity**: Low

## Alerts for DNS

[!INCLUDE [Defender for DNS note](./includes/defender-for-dns-note.md)]

[Further details and notes](plan-defender-for-servers-select-plan.md)

### **Anomalous network protocol usage**

(AzureDNS_ProtocolAnomaly)

**Description**: Analysis of DNS transactions from %{CompromisedEntity} detected anomalous protocol usage. Such traffic, while possibly benign, might indicate abuse of this common protocol to bypass network traffic filtering. Typical related attacker activity includes copying remote administration tools to a compromised host and exfiltrating user data from it.

**[MITRE tactics](#mitre-attck-tactics)**: Exfiltration

**Severity**: -

### **Anonymity network activity**

(AzureDNS_DarkWeb)

**Description**: Analysis of DNS transactions from %{CompromisedEntity} detected anonymity network activity. Such activity, while possibly legitimate user behavior, is frequently employed by attackers to evade tracking and fingerprinting of network communications. Typical related attacker activity is likely to include the download and execution of malicious software or remote administration tools.

**[MITRE tactics](#mitre-attck-tactics)**: Exfiltration

**Severity**: Low

### **Anonymity network activity using web proxy**

(AzureDNS_DarkWebProxy)

**Description**: Analysis of DNS transactions from %{CompromisedEntity} detected anonymity network activity. Such activity, while possibly legitimate user behavior, is frequently employed by attackers to evade tracking and fingerprinting of network communications. Typical related attacker activity is likely to include the download and execution of malicious software or remote administration tools.

**[MITRE tactics](#mitre-attck-tactics)**: Exfiltration

**Severity**: Low

### **Attempted communication with suspicious sinkholed domain**

(AzureDNS_SinkholedDomain)

**Description**: Analysis of DNS transactions from %{CompromisedEntity} detected request for sinkholed domain. Such activity, while possibly legitimate user behavior, is frequently an indication of the download or execution of malicious software. Typical related attacker activity is likely to include the download and execution of further malicious software or remote administration tools.

**[MITRE tactics](#mitre-attck-tactics)**: Exfiltration

**Severity**: Medium

### **Communication with possible phishing domain**

(AzureDNS_PhishingDomain)

**Description**: Analysis of DNS transactions from %{CompromisedEntity} detected a request for a possible phishing domain. Such activity, while possibly benign, is frequently performed by attackers to harvest credentials to remote services. Typical related attacker activity is likely to include the exploitation of any credentials on the legitimate service.

**[MITRE tactics](#mitre-attck-tactics)**: Exfiltration

**Severity**: Informational

### **Communication with suspicious algorithmically generated domain**

(AzureDNS_DomainGenerationAlgorithm)

**Description**: Analysis of DNS transactions from %{CompromisedEntity} detected possible usage of a domain generation algorithm. Such activity, while possibly benign, is frequently performed by attackers to evade network monitoring and filtering. Typical related attacker activity is likely to include the download and execution of malicious software or remote administration tools.

**[MITRE tactics](#mitre-attck-tactics)**: Exfiltration

**Severity**: Informational

### **Communication with suspicious domain identified by threat intelligence**

(AzureDNS_ThreatIntelSuspectDomain)

**Description**: Communication with suspicious domain was detected by analyzing DNS transactions from your resource and comparing against known malicious domains identified by threat intelligence feeds. Communication to malicious domains is frequently performed by attackers and could imply that your resource is compromised.

**[MITRE tactics](#mitre-attck-tactics)**: Initial Access

**Severity**: Medium

### **Communication with suspicious random domain name**

(AzureDNS_RandomizedDomain)

**Description**: Analysis of DNS transactions from %{CompromisedEntity} detected usage of a suspicious randomly generated domain name. Such activity, while possibly benign, is frequently performed by attackers to evade network monitoring and filtering. Typical related attacker activity is likely to include the download and execution of malicious software or remote administration tools.

**[MITRE tactics](#mitre-attck-tactics)**: Exfiltration

**Severity**: Informational

### **Digital currency mining activity**

(AzureDNS_CurrencyMining)

**Description**: Analysis of DNS transactions from %{CompromisedEntity} detected digital currency mining activity. Such activity, while possibly legitimate user behavior, is frequently performed by attackers following compromise of resources. Typical related attacker activity is likely to include the download and execution of common mining tools.

**[MITRE tactics](#mitre-attck-tactics)**: Exfiltration

**Severity**: Low

### **Network intrusion detection signature activation**

(AzureDNS_SuspiciousDomain)

**Description**: Analysis of DNS transactions from %{CompromisedEntity} detected a known malicious network signature. Such activity, while possibly legitimate user behavior, is frequently an indication of the download or execution of malicious software. Typical related attacker activity is likely to include the download and execution of further malicious software or remote administration tools.

**[MITRE tactics](#mitre-attck-tactics)**: Exfiltration

**Severity**: Medium

### **Possible data download via DNS tunnel**

(AzureDNS_DataInfiltration)

**Description**: Analysis of DNS transactions from %{CompromisedEntity} detected a possible DNS tunnel. Such activity, while possibly legitimate user behavior, is frequently performed by attackers to evade network monitoring and filtering. Typical related attacker activity is likely to include the download and execution of malicious software or remote administration tools.

**[MITRE tactics](#mitre-attck-tactics)**: Exfiltration

**Severity**: Low

### **Possible data exfiltration via DNS tunnel**

(AzureDNS_DataExfiltration)

**Description**: Analysis of DNS transactions from %{CompromisedEntity} detected a possible DNS tunnel. Such activity, while possibly legitimate user behavior, is frequently performed by attackers to evade network monitoring and filtering. Typical related attacker activity is likely to include the download and execution of malicious software or remote administration tools.

**[MITRE tactics](#mitre-attck-tactics)**: Exfiltration

**Severity**: Low

### **Possible data transfer via DNS tunnel**

(AzureDNS_DataObfuscation)

**Description**: Analysis of DNS transactions from %{CompromisedEntity} detected a possible DNS tunnel. Such activity, while possibly legitimate user behavior, is frequently performed by attackers to evade network monitoring and filtering. Typical related attacker activity is likely to include the download and execution of malicious software or remote administration tools.

**[MITRE tactics](#mitre-attck-tactics)**: Exfiltration

**Severity**: Low

## Alerts for Azure VM extensions

These alerts focus on detecting suspicious activities of Azure virtual machine extensions and provides insights into attackers' attempts to compromise and perform malicious activities on your virtual machines.

Azure virtual machine extensions are small applications that run post-deployment on virtual machines and provide capabilities such as configuration, automation, monitoring, security, and more. While extensions are a powerful tool, they can be used by threat actors for various malicious intents, for example:

- Data collection and monitoring

- Code execution and configuration deployment with high privileges

- Resetting credentials and creating administrative users

- Encrypting disks

Learn more about [Defender for Cloud latest protections against the abuse of Azure VM extensions](https://techcommunity.microsoft.com/t5/microsoft-defender-for-cloud/microsoft-defender-for-cloud-latest-protection-against/ba-p/3970121).

### **Suspicious failure installing GPU extension in your subscription (Preview)**

(VM_GPUExtensionSuspiciousFailure)

**Description**: Suspicious intent of installing a GPU extension on unsupported VMs. This extension should be installed on virtual machines equipped with a graphic processor, and in this case the virtual machines are not equipped with such. These failures can be seen when malicious adversaries execute multiple installations of such extension for crypto-mining purposes.

**[MITRE tactics](#mitre-attck-tactics)**: Impact

**Severity**: Medium

### **Suspicious installation of a GPU extension was detected on your virtual machine (Preview)**

(VM_GPUDriverExtensionUnusualExecution)

**Description**: Suspicious installation of a GPU extension was detected on your virtual machine by analyzing the Azure Resource Manager operations in your subscription. Attackers might use the GPU driver extension to install GPU drivers on your virtual machine via the Azure Resource Manager to perform cryptojacking. This activity is deemed suspicious as the principal's behavior departs from its usual patterns.

**[MITRE tactics](#mitre-attck-tactics)**: Impact

**Severity**: Low

### **Run Command with a suspicious script was detected on your virtual machine (Preview)**

(VM_RunCommandSuspiciousScript)

**Description**: A Run Command with a suspicious script was detected on your virtual machine by analyzing the Azure Resource Manager operations in your subscription. Attackers might use Run Command to execute malicious code with high privileges on your virtual machine via the Azure Resource Manager. The script is deemed suspicious as certain parts were identified as being potentially malicious.

**[MITRE tactics](#mitre-attck-tactics)**: Execution

**Severity**: High

### **Suspicious unauthorized Run Command usage was detected on your virtual machine (Preview)**

(VM_RunCommandSuspiciousFailure)

**Description**: Suspicious unauthorized usage of Run Command has failed and was detected on your virtual machine by analyzing the Azure Resource Manager operations in your subscription. Attackers might attempt to use Run Command to execute malicious code with high privileges on your virtual machines via the Azure Resource Manager. This activity is deemed suspicious as it hasn't been commonly seen before.

**[MITRE tactics](#mitre-attck-tactics)**: Execution

**Severity**: Medium

### **Suspicious Run Command usage was detected on your virtual machine (Preview)**

(VM_RunCommandSuspiciousUsage)

**Description**: Suspicious usage of Run Command was detected on your virtual machine by analyzing the Azure Resource Manager operations in your subscription. Attackers might use Run Command to execute malicious code with high privileges on your virtual machines via the Azure Resource Manager. This activity is deemed suspicious as it hasn't been commonly seen before.

**[MITRE tactics](#mitre-attck-tactics)**: Execution

**Severity**: Low

### **Suspicious usage of multiple monitoring or data collection extensions was detected on your virtual machines (Preview)**

(VM_SuspiciousMultiExtensionUsage)

**Description**: Suspicious usage of multiple monitoring or data collection extensions was detected on your virtual machines by analyzing the Azure Resource Manager operations in your subscription. Attackers might abuse such extensions for data collection, network traffic monitoring, and more, in your subscription. This usage is deemed suspicious as it hasn't been commonly seen before.

**[MITRE tactics](#mitre-attck-tactics)**: Reconnaissance

**Severity**: Medium

### **Suspicious installation of disk encryption extensions was detected on your virtual machines (Preview)**

(VM_DiskEncryptionSuspiciousUsage)

**Description**: Suspicious installation of disk encryption extensions was detected on your virtual machines by analyzing the Azure Resource Manager operations in your subscription. Attackers might abuse the disk encryption extension to deploy full disk encryptions on your virtual machines via the Azure Resource Manager in an attempt to perform ransomware activity. This activity is deemed suspicious as it hasn't been commonly seen before and due to the high number of extension installations.

**[MITRE tactics](#mitre-attck-tactics)**: Impact

**Severity**: Medium

### **Suspicious usage of VMAccess extension was detected on your virtual machines (Preview)**

(VM_VMAccessSuspiciousUsage)

**Description**: Suspicious usage of VMAccess extension was detected on your virtual machines. Attackers might abuse the VMAccess extension to gain access and compromise your virtual machines with high privileges by resetting access or managing administrative users. This activity is deemed suspicious as the principal's behavior departs from its usual patterns, and due to the high number of the extension installations.

**[MITRE tactics](#mitre-attck-tactics)**: Persistence

**Severity**: Medium

### **Desired State Configuration (DSC) extension with a suspicious script was detected on your virtual machine (Preview)**

(VM_DSCExtensionSuspiciousScript)

**Description**: Desired State Configuration (DSC) extension with a suspicious script was detected on your virtual machine by analyzing the Azure Resource Manager operations in your subscription. Attackers might use the Desired State Configuration (DSC) extension to deploy malicious configurations, such as persistence mechanisms, malicious scripts, and more, with high privileges, on your virtual machines. The script is deemed suspicious as certain parts were identified as being potentially malicious.

**[MITRE tactics](#mitre-attck-tactics)**: Execution

**Severity**: High

### **Suspicious usage of a Desired State Configuration (DSC) extension was detected on your virtual machines (Preview)**

(VM_DSCExtensionSuspiciousUsage)

**Description**: Suspicious usage of a Desired State Configuration (DSC) extension was detected on your virtual machines by analyzing the Azure Resource Manager operations in your subscription. Attackers might use the Desired State Configuration (DSC) extension to deploy malicious configurations, such as persistence mechanisms, malicious scripts, and more, with high privileges, on your virtual machines. This activity is deemed suspicious as the principal's behavior departs from its usual patterns, and due to the high number of the extension installations.

**[MITRE tactics](#mitre-attck-tactics)**: Execution

**Severity**: Low

### **Custom script extension with a suspicious script was detected on your virtual machine (Preview)**

(VM_CustomScriptExtensionSuspiciousCmd)

**Description**: Custom script extension with a suspicious script was detected on your virtual machine by analyzing the Azure Resource Manager operations in your subscription. Attackers might use Custom script extension to execute malicious code with high privileges on your virtual machine via the Azure Resource Manager. The script is deemed suspicious as certain parts were identified as being potentially malicious.

**[MITRE tactics](#mitre-attck-tactics)**: Execution

**Severity**: High

### **Suspicious failed execution of custom script extension in your virtual machine**

(VM_CustomScriptExtensionSuspiciousFailure)

**Description**: Suspicious failure of a custom script extension was detected in your virtual machine by analyzing the Azure Resource Manager operations in your subscription. Such failures might be associated with malicious scripts run by this extension.

**[MITRE tactics](#mitre-attck-tactics)**: Execution

**Severity**: Medium

### **Unusual deletion of custom script extension in your virtual machine**

(VM_CustomScriptExtensionUnusualDeletion)

**Description**: Unusual deletion of a custom script extension was detected in your virtual machine by analyzing the Azure Resource Manager operations in your subscription. Attackers might use custom script extensions to execute malicious code on your virtual machines via the Azure Resource Manager.

**[MITRE tactics](#mitre-attck-tactics)**: Execution

**Severity**: Medium

### **Unusual execution of custom script extension in your virtual machine**

(VM_CustomScriptExtensionUnusualExecution)

**Description**: Unusual execution of a custom script extension was detected in your virtual machine by analyzing the Azure Resource Manager operations in your subscription. Attackers might use custom script extensions to execute malicious code on your virtual machines via the Azure Resource Manager.

**[MITRE tactics](#mitre-attck-tactics)**: Execution

**Severity**: Medium

### **Custom script extension with suspicious entry-point in your virtual machine**

(VM_CustomScriptExtensionSuspiciousEntryPoint)

**Description**: Custom script extension with a suspicious entry-point was detected in your virtual machine by analyzing the Azure Resource Manager operations in your subscription. The entry-point refers to a suspicious GitHub repository. Attackers might use custom script extensions to execute malicious code on your virtual machines via the Azure Resource Manager.

**[MITRE tactics](#mitre-attck-tactics)**: Execution

**Severity**: Medium

### **Custom script extension with suspicious payload in your virtual machine**

(VM_CustomScriptExtensionSuspiciousPayload)

**Description**: Custom script extension with a payload from a suspicious GitHub repository was detected in your virtual machine by analyzing the Azure Resource Manager operations in your subscription. Attackers might use custom script extensions to execute malicious code on your virtual machines via the Azure Resource Manager.

**[MITRE tactics](#mitre-attck-tactics)**: Execution

**Severity**: Medium

## Alerts for Azure App Service

[Further details and notes](defender-for-app-service-introduction.md)

### **An attempt to run Linux commands on a Windows App Service**

(AppServices_LinuxCommandOnWindows)

**Description**: Analysis of App Service processes detected an attempt to run a Linux command on a Windows App Service. This action was running by the web application. This behavior is often seen during campaigns that exploit a vulnerability in a common web application.
(Applies to: App Service on Windows)

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: Medium

### **An IP that connected to your Azure App Service FTP Interface was found in Threat Intelligence**

(AppServices_IncomingTiClientIpFtp)

**Description**: Azure App Service FTP log indicates a connection from a source address that was found in the threat intelligence feed. During this connection, a user accessed the pages listed.
(Applies to: App Service on Windows and App Service on Linux)

**[MITRE tactics](#mitre-attck-tactics)**: Initial Access

**Severity**: Medium

### **Attempt to run high privilege command detected**

(AppServices_HighPrivilegeCommand)

**Description**: Analysis of App Service processes detected an attempt to run a command that requires high privileges.
The command ran in the web application context. While this behavior can be legitimate, in web applications this behavior is also observed in malicious activities.
(Applies to: App Service on Windows)

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: Medium

### **Communication with suspicious domain identified by threat intelligence**

(AzureDNS_ThreatIntelSuspectDomain)

**Description**: Communication with suspicious domain was detected by analyzing DNS transactions from your resource and comparing against known malicious domains identified by threat intelligence feeds. Communication to malicious domains is frequently performed by attackers and could imply that your resource is compromised.

**[MITRE tactics](#mitre-attck-tactics)**: Initial Access, Persistence, Execution, Command And Control, Exploitation

**Severity**: Medium

### **Connection to web page from anomalous IP address detected**

(AppServices_AnomalousPageAccess)

**Description**: Azure App Service activity log indicates an anomalous connection to a sensitive web page from the listed source IP address. This might indicate that someone is attempting a brute force attack into your web app administration pages. It might also be the result of a new IP address being used by a legitimate user. If the source IP address is trusted, you can safely suppress this alert for this resource. To learn how to suppress security alerts, see [Suppress alerts from Microsoft Defender for Cloud](alerts-suppression-rules.md).
(Applies to: App Service on Windows and App Service on Linux)

**[MITRE tactics](#mitre-attck-tactics)**: Initial Access

**Severity**: Low

### **Dangling DNS record for an App Service resource detected**

(AppServices_DanglingDomain)

**Description**: A DNS record that points to a recently deleted App Service resource (also known as "dangling DNS" entry) has been detected. This leaves you susceptible to a subdomain takeover. Subdomain takeovers enable malicious actors to redirect traffic intended for an organization's domain to a site performing malicious activity.
(Applies to: App Service on Windows and App Service on Linux)

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: High

### **Detected encoded executable in command line data**

(AppServices_Base64EncodedExecutableInCommandLineParams)

**Description**: Analysis of host data on {Compromised host} detected a base-64 encoded executable. This has previously been associated with attackers attempting to construct executables on-the-fly through a sequence of commands, and attempting to evade intrusion detection systems by ensuring that no individual command would trigger an alert. This could be legitimate activity, or an indication of a compromised host.
(Applies to: App Service on Windows)

**[MITRE tactics](#mitre-attck-tactics)**: Defense Evasion, Execution

**Severity**: High

### **Detected file download from a known malicious source**

(AppServices_SuspectDownload)

**Description**: Analysis of host data has detected the download of a file from a known malware source on your host.
(Applies to: App Service on Linux)

**[MITRE tactics](#mitre-attck-tactics)**: Privilege Escalation, Execution, Exfiltration, Command and Control

**Severity**: Medium

### **Detected suspicious file download**

(AppServices_SuspectDownloadArtifacts)

**Description**: Analysis of host data has detected suspicious download of remote file.
(Applies to: App Service on Linux)

**[MITRE tactics](#mitre-attck-tactics)**: Persistence

**Severity**: Medium

### **Digital currency mining related behavior detected**

(AppServices_DigitalCurrencyMining)

**Description**: Analysis of host data on Inn-Flow-WebJobs detected the execution of a process or command normally associated with digital currency mining.
(Applies to: App Service on Windows and App Service on Linux)

**[MITRE tactics](#mitre-attck-tactics)**: Execution

**Severity**: High

### **Executable decoded using certutil**

(AppServices_ExecutableDecodedUsingCertutil)

**Description**: Analysis of host data on [Compromised entity] detected that certutil.exe, a built-in administrator utility, was being used to decode an executable instead of its mainstream purpose that relates to manipulating certificates and certificate data. Attackers are known to abuse functionality of legitimate administrator tools to perform malicious actions, for example using a tool such as certutil.exe to decode a malicious executable that will then be subsequently executed.
(Applies to: App Service on Windows)

**[MITRE tactics](#mitre-attck-tactics)**: Defense Evasion, Execution

**Severity**: High

### **Fileless Attack Behavior Detected**

(AppServices_FilelessAttackBehaviorDetection)

**Description**: The memory of the process specified below contains behaviors commonly used by fileless attacks.
Specific behaviors include: {list of observed behaviors}
(Applies to: App Service on Windows and App Service on Linux)

**[MITRE tactics](#mitre-attck-tactics)**: Execution

**Severity**: Medium

### **Fileless Attack Technique Detected**

(AppServices_FilelessAttackTechniqueDetection)

**Description**: The memory of the process specified below contains evidence of a fileless attack technique. Fileless attacks are used by attackers to execute code while evading detection by security software.
Specific behaviors include: {list of observed behaviors}
(Applies to: App Service on Windows and App Service on Linux)

**[MITRE tactics](#mitre-attck-tactics)**: Execution

**Severity**: High

### **Fileless Attack Toolkit Detected**

(AppServices_FilelessAttackToolkitDetection)

**Description**: The memory of the process specified below contains a fileless attack toolkit: {ToolKitName}. Fileless attack toolkits typically do not have a presence on the filesystem, making detection by traditional anti-virus software difficult.
Specific behaviors include: {list of observed behaviors}
(Applies to: App Service on Windows and App Service on Linux)

**[MITRE tactics](#mitre-attck-tactics)**: Defense Evasion, Execution

**Severity**: High

### **Microsoft Defender for Cloud test alert for App Service (not a threat)**

(AppServices_EICAR)

**Description**: This is a test alert generated by Microsoft Defender for Cloud. No further action is needed.
(Applies to: App Service on Windows and App Service on Linux)

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: High

### **NMap scanning detected**

(AppServices_Nmap)

**Description**: Azure App Service activity log indicates a possible web fingerprinting activity on your App Service resource.
The suspicious activity detected is associated with NMAP. Attackers often use this tool for probing the web application to find vulnerabilities.
(Applies to: App Service on Windows and App Service on Linux)

**[MITRE tactics](#mitre-attck-tactics)**: PreAttack

**Severity**: Informational

### **Phishing content hosted on Azure Webapps**

(AppServices_PhishingContent)

**Description**: URL used for phishing attack found on the Azure AppServices website. This URL was part of a phishing attack sent to Microsoft 365 customers. The content typically lures visitors into entering their corporate credentials or financial information into a legitimate looking website.
(Applies to: App Service on Windows and App Service on Linux)

**[MITRE tactics](#mitre-attck-tactics)**: Collection

**Severity**: High

### **PHP file in upload folder**

(AppServices_PhpInUploadFolder)

**Description**: Azure App Service activity log indicates an access to a suspicious PHP page located in the upload folder.
This type of folder doesn't usually contain PHP files. The existence of this type of file might indicate an exploitation taking advantage of arbitrary file upload vulnerabilities.
(Applies to: App Service on Windows and App Service on Linux)

**[MITRE tactics](#mitre-attck-tactics)**: Execution

**Severity**: Medium

### **Possible Cryptocoinminer download detected**

(AppServices_CryptoCoinMinerDownload)

**Description**: Analysis of host data has detected the download of a file normally associated with digital currency mining.
(Applies to: App Service on Linux)

**[MITRE tactics](#mitre-attck-tactics)**: Defense Evasion, Command and Control, Exploitation

**Severity**: Medium

### **Possible data exfiltration detected**

(AppServices_DataEgressArtifacts)

**Description**: Analysis of host/device data detected a possible data egress condition. Attackers will often egress data from machines they have compromised.
(Applies to: App Service on Linux)

**[MITRE tactics](#mitre-attck-tactics)**: Collection, Exfiltration

**Severity**: Medium

### **Potential dangling DNS record for an App Service resource detected**

(AppServices_PotentialDanglingDomain)

**Description**: A DNS record that points to a recently deleted App Service resource (also known as "dangling DNS" entry) has been detected. This might leave you susceptible to a subdomain takeover. Subdomain takeovers enable malicious actors to redirect traffic intended for an organization's domain to a site performing malicious activity. In this case, a text record with the Domain Verification ID was found. Such text records prevent subdomain takeover but we still recommend removing the dangling domain. If you leave the DNS record pointing at the subdomain you're at risk if anyone in your organization deletes the TXT file or record in the future.
(Applies to: App Service on Windows and App Service on Linux)

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: Low

### **Potential reverse shell detected**

(AppServices_ReverseShell)

**Description**: Analysis of host data  detected a potential reverse shell. These are used to get a compromised machine to call back into a machine an attacker owns.
(Applies to: App Service on Linux)

**[MITRE tactics](#mitre-attck-tactics)**: Exfiltration, Exploitation

**Severity**: Medium

### **Raw data download detected**

(AppServices_DownloadCodeFromWebsite)

**Description**: Analysis of App Service processes detected an attempt to download code from raw-data websites such as Pastebin. This action was run by a PHP process. This behavior is associated with attempts to download web shells or other malicious components to the App Service.
(Applies to: App Service on Windows)

**[MITRE tactics](#mitre-attck-tactics)**: Execution

**Severity**: Medium

### **Saving curl output to disk detected**

(AppServices_CurlToDisk)

**Description**: Analysis of App Service processes detected the running of a curl command in which the output was saved to the disk. While this behavior can be legitimate, in web applications this behavior is also observed in malicious activities such as attempts to infect websites with web shells.
(Applies to: App Service on Windows)

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: Low

### **Spam folder referrer detected**

(AppServices_SpamReferrer)

**Description**: Azure App Service activity log indicates web activity that was identified as originating from a web site associated with spam activity. This can occur if your website is compromised and used for spam activity.
(Applies to: App Service on Windows and App Service on Linux)

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: Low

### **Suspicious access to possibly vulnerable web page detected**

(AppServices_ScanSensitivePage)

**Description**: Azure App Service activity log indicates a web page that seems to be sensitive was accessed. This suspicious activity originated from a source IP address whose access pattern resembles that of a web scanner.
This activity is often associated with an attempt by an attacker to scan your network to try to gain access to sensitive or vulnerable web pages.
(Applies to: App Service on Windows and App Service on Linux)

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: Low

### **Suspicious domain name reference**

(AppServices_CommandlineSuspectDomain)

**Description**: Analysis of host data detected reference to suspicious domain name. Such activity, while possibly legitimate user behavior, is frequently an indication of the download or execution of malicious software. Typical related attacker activity is likely to include the download and execution of further malicious software or remote administration tools.
(Applies to: App Service on Linux)

**[MITRE tactics](#mitre-attck-tactics)**: Exfiltration

**Severity**: Low

### **Suspicious download using Certutil detected**

(AppServices_DownloadUsingCertutil)

**Description**: Analysis of host data on {NAME} detected the use of certutil.exe, a built-in administrator utility, for the download of a binary instead of its mainstream purpose that relates to manipulating certificates and certificate data. Attackers are known to abuse functionality of legitimate administrator tools to perform malicious actions, for example using certutil.exe to download and decode a malicious executable that will then be subsequently executed.
(Applies to: App Service on Windows)

**[MITRE tactics](#mitre-attck-tactics)**: Execution

**Severity**: Medium

### **Suspicious PHP execution detected**

(AppServices_SuspectPhp)

**Description**: Machine logs indicate that a suspicious PHP process is running. The action included an attempt to run operating system commands or PHP code from the command line, by using the PHP process. While this behavior can be legitimate, in web applications this behavior might indicate malicious activities, such as attempts to infect websites with web shells.
(Applies to: App Service on Windows and App Service on Linux)

**[MITRE tactics](#mitre-attck-tactics)**: Execution

**Severity**: Medium

### **Suspicious PowerShell cmdlets executed**

(AppServices_PowerShellPowerSploitScriptExecution)

**Description**: Analysis of host data indicates execution of known malicious PowerShell PowerSploit cmdlets.
(Applies to: App Service on Windows)

**[MITRE tactics](#mitre-attck-tactics)**: Execution

**Severity**: Medium

### **Suspicious process executed**

(AppServices_KnownCredential AccessTools)

**Description**: Machine logs indicate that the suspicious process: '%{process path}' was running on the machine, often associated with attacker attempts to access credentials.
(Applies to: App Service on Windows)

**[MITRE tactics](#mitre-attck-tactics)**: Credential Access

**Severity**: High

### **Suspicious process name detected**

(AppServices_ProcessWithKnownSuspiciousExtension)

**Description**: Analysis of host data on {NAME} detected a process whose name is suspicious, for example corresponding to a known attacker tool or named in a way that is suggestive of attacker tools that try to hide in plain sight. This process could be legitimate activity, or an indication that one of your machines has been compromised.
(Applies to: App Service on Windows)

**[MITRE tactics](#mitre-attck-tactics)**: Persistence, Defense Evasion

**Severity**: Medium

### **Suspicious SVCHOST process executed**

(AppServices_SVCHostFromInvalidPath)

**Description**: The system process SVCHOST was observed running in an abnormal context. Malware often uses SVCHOST to mask its malicious activity.
(Applies to: App Service on Windows)

**[MITRE tactics](#mitre-attck-tactics)**: Defense Evasion, Execution

**Severity**: High

### **Suspicious User Agent detected**

(AppServices_UserAgentInjection)

**Description**: Azure App Service activity log indicates requests with suspicious user agent. This behavior can indicate on attempts to exploit a vulnerability in your App Service application.
(Applies to: App Service on Windows and App Service on Linux)

**[MITRE tactics](#mitre-attck-tactics)**: Initial Access

**Severity**: Informational

### **Suspicious WordPress theme invocation detected**

(AppServices_WpThemeInjection)

**Description**: Azure App Service activity log indicates a possible code injection activity on your App Service resource.
The suspicious activity detected resembles that of a manipulation of WordPress theme to support server side execution of code, followed by a direct web request to invoke the manipulated theme file.
This type of activity was seen in the past as part of an attack campaign over WordPress.
If your App Service resource isn't hosting a WordPress site, it isn't vulnerable to this specific code injection exploit and you can safely suppress this alert for the resource. To learn how to suppress security alerts, see [Suppress alerts from Microsoft Defender for Cloud](alerts-suppression-rules.md).
(Applies to: App Service on Windows and App Service on Linux)

**[MITRE tactics](#mitre-attck-tactics)**: Execution

**Severity**: High

### **Vulnerability scanner detected**

(AppServices_DrupalScanner)

**Description**: Azure App Service activity log indicates that a possible vulnerability scanner was used on your App Service resource.
The suspicious activity detected resembles that of tools targeting a content management system (CMS).
If your App Service resource isn't hosting a Drupal site, it isn't vulnerable to this specific code injection exploit and you can safely suppress this alert for the resource. To learn how to suppress security alerts, see [Suppress alerts from Microsoft Defender for Cloud](alerts-suppression-rules.md).
(Applies to: App Service on Windows)

**[MITRE tactics](#mitre-attck-tactics)**: PreAttack

**Severity**: Low

### **Vulnerability scanner detected**

(AppServices_JoomlaScanner)

**Description**: Azure App Service activity log indicates that a possible vulnerability scanner was used on your App Service resource.
The suspicious activity detected resembles that of tools targeting Joomla applications.
If your App Service resource isn't hosting a Joomla site, it isn't vulnerable to this specific code injection exploit and you can safely suppress this alert for the resource. To learn how to suppress security alerts, see [Suppress alerts from Microsoft Defender for Cloud](alerts-suppression-rules.md).
(Applies to: App Service on Windows and App Service on Linux)

**[MITRE tactics](#mitre-attck-tactics)**: PreAttack

**Severity**: Low

### **Vulnerability scanner detected**

(AppServices_WpScanner)

**Description**: Azure App Service activity log indicates that a possible vulnerability scanner was used on your App Service resource.
The suspicious activity detected resembles that of tools targeting WordPress applications.
If your App Service resource isn't hosting a WordPress site, it isn't vulnerable to this specific code injection exploit and you can safely suppress this alert for the resource. To learn how to suppress security alerts, see [Suppress alerts from Microsoft Defender for Cloud](alerts-suppression-rules.md).
(Applies to: App Service on Windows and App Service on Linux)

**[MITRE tactics](#mitre-attck-tactics)**: PreAttack

**Severity**: Low

### **Web fingerprinting detected**

(AppServices_WebFingerprinting)

**Description**: Azure App Service activity log indicates a possible web fingerprinting activity on your App Service resource.
The suspicious activity detected is associated with a tool called Blind Elephant. The tool fingerprint web servers and tries to detect the installed applications and version.
Attackers often use this tool for probing the web application to find vulnerabilities.
(Applies to: App Service on Windows and App Service on Linux)

**[MITRE tactics](#mitre-attck-tactics)**: PreAttack

**Severity**: Medium

### **Website is tagged as malicious in threat intelligence feed**

(AppServices_SmartScreen)

**Description**: Your website as described below is marked as a malicious site by Windows SmartScreen. If you think this is a false positive, contact Windows SmartScreen via report feedback link provided.
(Applies to: App Service on Windows and App Service on Linux)

**[MITRE tactics](#mitre-attck-tactics)**: Collection

**Severity**: Medium

## Alerts for containers - Kubernetes clusters

Microsoft Defender for Containers provides security alerts on the cluster level and on the underlying cluster nodes by monitoring both control plane (API server) and the containerized workload itself. Control plane security alerts can be recognized by a prefix of `K8S_` of the alert type. Security alerts for runtime workload in the clusters can be recognized by the `K8S.NODE_` prefix of the alert type. All alerts are supported on Linux only, unless otherwise indicated.

[Further details and notes](defender-for-containers-introduction.md#run-time-protection-for-kubernetes-nodes-and-clusters)

### **Exposed Postgres service with trust authentication configuration in Kubernetes detected (Preview)**

(K8S_ExposedPostgresTrustAuth)

**Description**: Kubernetes cluster configuration analysis detected exposure of a Postgres service by a load balancer. The service is configured with trust authentication method, which doesn't require credentials.

**[MITRE tactics](#mitre-attck-tactics)**: InitialAccess

**Severity**: Medium

### **Exposed Postgres service with risky configuration in Kubernetes detected (Preview)**

(K8S_ExposedPostgresBroadIPRange)

**Description**: Kubernetes cluster configuration analysis detected exposure of a Postgres service by a load balancer with a risky configuration. Exposing the service to a wide range of IP addresses poses a security risk.

**[MITRE tactics](#mitre-attck-tactics)**: InitialAccess

**Severity**: Medium

### **Attempt to create a new Linux namespace from a container detected**

(K8S.NODE_NamespaceCreation) <sup>[1](#footnote1)</sup>

**Description**: Analysis of processes running within a container in Kubernetes cluster detected an attempt to create a new Linux namespace. While this behavior might be legitimate, it might indicate that an attacker tries to escape from the container to the node. Some CVE-2022-0185 exploitations use this technique.

**[MITRE tactics](#mitre-attck-tactics)**: PrivilegeEscalation

**Severity**: Informational

### **A history file has been cleared**

(K8S.NODE_HistoryFileCleared) <sup>[1](#footnote1)</sup>

**Description**: Analysis of processes running within a container or directly on a Kubernetes node, has detected that the command history log file has been cleared. Attackers might do this to cover their tracks. The operation was performed by the specified user account.

**[MITRE tactics](#mitre-attck-tactics)**: DefenseEvasion

**Severity**: Medium

### **Abnormal activity of managed identity associated with Kubernetes (Preview)**

(K8S_AbnormalMiActivity)

**Description**: Analysis of Azure Resource Manager operations detected an abnormal behavior of a managed identity used by an AKS addon. The detected activity isn\'t consistent with the behavior of the associated addon. While this activity can be legitimate, such behavior might indicate that the identity was gained by an attacker, possibly from a compromised container in the Kubernetes cluster.

**[MITRE tactics](#mitre-attck-tactics)**: Lateral Movement

**Severity**: Medium

### **Abnormal Kubernetes service account operation detected**

(K8S_ServiceAccountRareOperation)

**Description**: Kubernetes audit log analysis detected abnormal behavior by a service account in your Kubernetes cluster. The service account was used for an operation, which isn't common for this service account. While this activity can be legitimate, such behavior might indicate that the service account is being used for malicious purposes.

**[MITRE tactics](#mitre-attck-tactics)**: Lateral Movement, Credential Access

**Severity**: Medium

### **An uncommon connection attempt detected**

(K8S.NODE_SuspectConnection) <sup>[1](#footnote1)</sup>

**Description**: Analysis of processes running within a container or directly on a Kubernetes node, has detected an uncommon connection attempt utilizing a socks protocol. This is very rare in normal operations, but a known technique for attackers attempting to bypass network-layer detections.

**[MITRE tactics](#mitre-attck-tactics)**: Execution, Exfiltration, Exploitation

**Severity**: Medium

### **Attempt to stop apt-daily-upgrade.timer service detected**

(K8S.NODE_TimerServiceDisabled) <sup>[1](#footnote1)</sup>

**Description**: Analysis of processes running within a container or directly on a Kubernetes node, has detected an attempt to stop apt-daily-upgrade.timer service. Attackers have been observed stopping this service to download malicious files and grant execution privileges for their attacks. This activity can also happen if the service is updated through normal administrative actions.

**[MITRE tactics](#mitre-attck-tactics)**: DefenseEvasion

**Severity**: Informational

### **Behavior similar to common Linux bots detected (Preview)**

(K8S.NODE_CommonBot)

**Description**: Analysis of processes running within a container or directly on a Kubernetes node, has detected the execution of a process normally associated with common Linux botnets.

**[MITRE tactics](#mitre-attck-tactics)**: Execution, Collection, Command And Control

**Severity**: Medium

### **Command within a container running with high privileges**

(K8S.NODE_PrivilegedExecutionInContainer) <sup>[1](#footnote1)</sup>

**Description**: Machine logs indicate that a privileged command was run in a Docker container. A privileged command has extended privileges on the host machine.

**[MITRE tactics](#mitre-attck-tactics)**: PrivilegeEscalation

**Severity**: Informational

### **Container running in privileged mode**

(K8S.NODE_PrivilegedContainerArtifacts) <sup>[1](#footnote1)</sup>

**Description**: Analysis of processes running within a container or directly on a Kubernetes node, has detected the execution of a Docker command that is running a privileged container. The privileged container has full access to the hosting pod or host resource. If compromised, an attacker might use the privileged container to gain access to the hosting pod or host.

**[MITRE tactics](#mitre-attck-tactics)**: PrivilegeEscalation, Execution

**Severity**: Informational

### **Container with a sensitive volume mount detected**

(K8S_SensitiveMount)

**Description**: Kubernetes audit log analysis detected a new container with a sensitive volume mount. The volume that was detected is a hostPath type which mounts a sensitive file or folder from the node to the container. If the container gets compromised, the attacker can use this mount for gaining access to the node.

**[MITRE tactics](#mitre-attck-tactics)**: Privilege Escalation

**Severity**: Informational

### **CoreDNS modification in Kubernetes detected**

(K8S_CoreDnsModification) <sup>[2](#footnote2)</sup> <sup>[3](#footnote3)</sup>

**Description**: Kubernetes audit log analysis detected a modification of the CoreDNS configuration. The configuration of CoreDNS can be modified by overriding its configmap. While this activity can be legitimate, if attackers have permissions to modify the configmap, they can change the behavior of the cluster's DNS server and poison it.

**[MITRE tactics](#mitre-attck-tactics)**: Lateral Movement

**Severity**: Low

### **Creation of admission webhook configuration detected**

(K8S_AdmissionController) <sup>[3](#footnote3)</sup>

**Description**: Kubernetes audit log analysis detected a new admission webhook configuration. Kubernetes has two built-in generic admission controllers: MutatingAdmissionWebhook and ValidatingAdmissionWebhook. The behavior of these admission controllers is determined by an admission webhook that the user deploys to the cluster. The usage of such admission controllers can be legitimate, however attackers can use such webhooks for modifying the requests (in case of MutatingAdmissionWebhook) or inspecting the requests and gain sensitive information (in case of ValidatingAdmissionWebhook).

**[MITRE tactics](#mitre-attck-tactics)**: Credential Access, Persistence

**Severity**: Informational

### **Detected file download from a known malicious source**

(K8S.NODE_SuspectDownload) <sup>[1](#footnote1)</sup>

**Description**: Analysis of processes running within a container or directly on a Kubernetes node, has detected a download of a file from a source frequently used to distribute malware.

**[MITRE tactics](#mitre-attck-tactics)**: PrivilegeEscalation, Execution, Exfiltration, Command And Control

**Severity**: Medium

### **Detected suspicious file download**

(K8S.NODE_SuspectDownloadArtifacts) <sup>[1](#footnote1)</sup>

**Description**: Analysis of processes running within a container or directly on a Kubernetes node, has detected a suspicious download of a remote file.

**[MITRE tactics](#mitre-attck-tactics)**: Persistence

**Severity**: Informational

### **Detected suspicious use of the nohup command**

(K8S.NODE_SuspectNohup) <sup>[1](#footnote1)</sup>

**Description**: Analysis of processes running within a container or directly on a Kubernetes node, has detected a suspicious use of the nohup command. Attackers have been seen using the command nohup to run hidden files from a temporary directory to allow their executables to run in the background. It's rare to see this command run on hidden files located in a temporary directory.

**[MITRE tactics](#mitre-attck-tactics)**: Persistence, DefenseEvasion

**Severity**: Medium

### **Detected suspicious use of the useradd command**

(K8S.NODE_SuspectUserAddition) <sup>[1](#footnote1)</sup>

**Description**: Analysis of processes running within a container or directly on a Kubernetes node, has detected a suspicious use of the useradd command.

**[MITRE tactics](#mitre-attck-tactics)**: Persistence

**Severity**: Medium

### **Digital currency mining container detected**

(K8S_MaliciousContainerImage) <sup>[3](#footnote3)</sup>

**Description**: Kubernetes audit log analysis detected a container that has an image associated with a digital currency mining tool.

**[MITRE tactics](#mitre-attck-tactics)**: Execution

**Severity**: High

### **Digital currency mining related behavior detected**

(K8S.NODE_DigitalCurrencyMining) <sup>[1](#footnote1)</sup>

**Description**: Analysis of processes running within a container or directly on a Kubernetes node, has detected an execution of a process or command normally associated with digital currency mining.

**[MITRE tactics](#mitre-attck-tactics)**: Execution

**Severity**: High

### **Docker build operation detected on a Kubernetes node**

(K8S.NODE_ImageBuildOnNode) <sup>[1](#footnote1)</sup>

**Description**: Analysis of processes running within a container or directly on a Kubernetes node, has detected a build operation of a container image on a Kubernetes node. While this behavior might be legitimate, attackers might build their malicious images locally to avoid detection.

**[MITRE tactics](#mitre-attck-tactics)**: DefenseEvasion

**Severity**: Informational

### **Exposed Kubeflow dashboard detected**

(K8S_ExposedKubeflow)

**Description**: The Kubernetes audit log analysis detected exposure of the Istio Ingress by a load balancer in a cluster that runs Kubeflow. This action might expose the Kubeflow dashboard to the internet. If the dashboard is exposed to the internet, attackers can access it and run malicious containers or code on the cluster. Find more details in the following article: <https://aka.ms/exposedkubeflow-blog>

**[MITRE tactics](#mitre-attck-tactics)**: Initial Access

**Severity**: Medium

### **Exposed Kubernetes dashboard detected**

(K8S_ExposedDashboard)

**Description**: Kubernetes audit log analysis detected exposure of the Kubernetes Dashboard by a LoadBalancer service. Exposed dashboard allows an unauthenticated access to the cluster management and poses a security threat.

**[MITRE tactics](#mitre-attck-tactics)**: Initial Access

**Severity**: High

### **Exposed Kubernetes service detected**

(K8S_ExposedService)

**Description**: The Kubernetes audit log analysis detected exposure of a service by a load balancer. This service is related to a sensitive application that allows high impact operations in the cluster such as running processes on the node or creating new containers. In some cases, this service doesn't require authentication. If the service doesn't require authentication, exposing it to the internet poses a security risk.

**[MITRE tactics](#mitre-attck-tactics)**: Initial Access

**Severity**: Medium

### **Exposed Redis service in AKS detected**

(K8S_ExposedRedis)

**Description**: The Kubernetes audit log analysis detected exposure of a Redis service by a load balancer. If the service doesn't require authentication, exposing it to the internet poses a security risk.

**[MITRE tactics](#mitre-attck-tactics)**: Initial Access

**Severity**: Low

### **Indicators associated with DDOS toolkit detected**

(K8S.NODE_KnownLinuxDDoSToolkit) <sup>[1](#footnote1)</sup>

**Description**: Analysis of processes running within a container or directly on a Kubernetes node, has detected file names that are part of a toolkit associated with malware capable of launching DDoS attacks, opening ports and services, and taking full control over the infected system. This could also possibly be legitimate activity.

**[MITRE tactics](#mitre-attck-tactics)**: Persistence, LateralMovement, Execution, Exploitation

**Severity**: Medium

### **K8S API requests from proxy IP address detected**

(K8S_TI_Proxy) <sup>[3](#footnote3)</sup>

**Description**: Kubernetes audit log analysis detected API requests to your cluster from an IP address that is associated with proxy services, such as TOR. While this behavior can be legitimate, it's often seen in malicious activities, when attackers try to hide their source IP.

**[MITRE tactics](#mitre-attck-tactics)**: Execution

**Severity**: Low

### **Kubernetes events deleted**

(K8S_DeleteEvents) <sup>[2](#footnote2)</sup> <sup>[3](#footnote3)</sup>

**Description**: Defender for Cloud detected that some Kubernetes events have been deleted. Kubernetes events are objects in Kubernetes that contain information about changes in the cluster. Attackers might delete those events for hiding their operations in the cluster.

**[MITRE tactics](#mitre-attck-tactics)**: Defense Evasion

**Severity**: Low

### **Kubernetes penetration testing tool detected**

(K8S_PenTestToolsKubeHunter)

**Description**: Kubernetes audit log analysis detected usage of Kubernetes penetration testing tool in the AKS cluster. While this behavior can be legitimate, attackers might use such public tools for malicious purposes.

**[MITRE tactics](#mitre-attck-tactics)**: Execution

**Severity**: Low

### **Microsoft Defender for Cloud test alert (not a threat).**

(K8S.NODE_EICAR) <sup>[1](#footnote1)</sup>

**Description**: This is a test alert generated by Microsoft Defender for Cloud. No further action is needed.

**[MITRE tactics](#mitre-attck-tactics)**: Execution

**Severity**: High

### **New container in the kube-system namespace detected**

(K8S_KubeSystemContainer) <sup>[3](#footnote3)</sup>

**Description**: Kubernetes audit log analysis detected a new container in the kube-system namespace that isn't among the containers that normally run in this namespace. The kube-system namespaces shouldn't contain user resources. Attackers can use this namespace for hiding malicious components.

**[MITRE tactics](#mitre-attck-tactics)**: Persistence

**Severity**: Informational

### **New high privileges role detected**

(K8S_HighPrivilegesRole) <sup>[3](#footnote3)</sup>

**Description**: Kubernetes audit log analysis detected a new role with high privileges. A binding to a role with high privileges gives the user\group high privileges in the cluster. Unnecessary privileges might cause privilege escalation in the cluster.

**[MITRE tactics](#mitre-attck-tactics)**: Persistence

**Severity**: Informational

### **Possible attack tool detected**

(K8S.NODE_KnownLinuxAttackTool) <sup>[1](#footnote1)</sup>

**Description**: Analysis of processes running within a container or directly on a Kubernetes node, has detected a suspicious tool invocation. This tool is often associated with malicious users attacking others.

**[MITRE tactics](#mitre-attck-tactics)**: Execution, Collection, Command And Control, Probing

**Severity**: Medium

### **Possible backdoor detected**

(K8S.NODE_LinuxBackdoorArtifact) <sup>[1](#footnote1)</sup>

**Description**: Analysis of processes running within a container or directly on a Kubernetes node, has detected a suspicious file being downloaded and run. This activity has previously been associated with installation of a backdoor.

**[MITRE tactics](#mitre-attck-tactics)**: Persistence, DefenseEvasion, Execution, Exploitation

**Severity**: Medium

### **Possible command line exploitation attempt**

(K8S.NODE_ExploitAttempt) <sup>[1](#footnote1)</sup>

**Description**: Analysis of processes running within a container or directly on a Kubernetes node, has detected a possible exploitation attempt against a known vulnerability.

**[MITRE tactics](#mitre-attck-tactics)**: Exploitation

**Severity**: Medium

### **Possible credential access tool detected**

(K8S.NODE_KnownLinuxCredentialAccessTool) <sup>[1](#footnote1)</sup>

**Description**: Analysis of processes running within a container or directly on a Kubernetes node, has detected a possible known credential access tool was running on the container, as identified by the specified process and commandline history item. This tool is often associated with attacker attempts to access credentials.

**[MITRE tactics](#mitre-attck-tactics)**: CredentialAccess

**Severity**: Medium

### **Possible Cryptocoinminer download detected**

(K8S.NODE_CryptoCoinMinerDownload) <sup>[1](#footnote1)</sup>

**Description**: Analysis of processes running within a container or directly on a Kubernetes node, has detected download of a file normally associated with digital currency mining.

**[MITRE tactics](#mitre-attck-tactics)**: DefenseEvasion, Command And Control, Exploitation

**Severity**: Medium

### **Possible Log Tampering Activity Detected**

(K8S.NODE_SystemLogRemoval) <sup>[1](#footnote1)</sup>

**Description**: Analysis of processes running within a container or directly on a Kubernetes node, has detected a possible removal of files that tracks user's activity during the course of its operation. Attackers often try to evade detection and leave no trace of malicious activities by deleting such log files.

**[MITRE tactics](#mitre-attck-tactics)**: DefenseEvasion

**Severity**: Medium

### **Possible password change using crypt-method detected**

(K8S.NODE_SuspectPasswordChange) <sup>[1](#footnote1)</sup>

**Description**: Analysis of processes running within a container or directly on a Kubernetes node, has detected a password change using the crypt method. Attackers can make this change to continue access and gain persistence after compromise.

**[MITRE tactics](#mitre-attck-tactics)**: CredentialAccess

**Severity**: Medium

### **Potential port forwarding to external IP address**

(K8S.NODE_SuspectPortForwarding) <sup>[1](#footnote1)</sup>

**Description**: Analysis of processes running within a container or directly on a Kubernetes node, has detected an initiation of port forwarding to an external IP address.

**[MITRE tactics](#mitre-attck-tactics)**: Exfiltration, Command And Control

**Severity**: Medium

### **Potential reverse shell detected**

(K8S.NODE_ReverseShell) <sup>[1](#footnote1)</sup>

**Description**: Analysis of processes running within a container or directly on a Kubernetes node, has detected a potential reverse shell. These are used to get a compromised machine to call back into a machine an attacker owns.

**[MITRE tactics](#mitre-attck-tactics)**: Exfiltration, Exploitation

**Severity**: Medium

### **Privileged container detected**

(K8S_PrivilegedContainer)

**Description**: Kubernetes audit log analysis detected a new privileged container. A privileged container has access to the node's resources and breaks the isolation between containers. If compromised, an attacker can use the privileged container to gain access to the node.

**[MITRE tactics](#mitre-attck-tactics)**: Privilege Escalation

**Severity**: Informational

### **Process associated with digital currency mining detected**

(K8S.NODE_CryptoCoinMinerArtifacts) <sup>[1](#footnote1)</sup>

**Description**: Analysis of processes running within a container detected the execution of a process normally associated with digital currency mining.

**[MITRE tactics](#mitre-attck-tactics)**: Execution, Exploitation

**Severity**: Medium

### **Process seen accessing the SSH authorized keys file in an unusual way**

(K8S.NODE_SshKeyAccess) <sup>[1](#footnote1)</sup>

**Description**: An SSH authorized_keys file was accessed in a method similar to known malware campaigns. This access could signify that an actor is attempting to gain persistent access to a machine.

**[MITRE tactics](#mitre-attck-tactics)**: Unknown

**Severity**: Informational

### **Role binding to the cluster-admin role detected**

(K8S_ClusterAdminBinding)

**Description**: Kubernetes audit log analysis detected a new binding to the cluster-admin role which gives administrator privileges. Unnecessary administrator privileges might cause privilege escalation in the cluster.

**[MITRE tactics](#mitre-attck-tactics)**: Persistence

**Severity**: Informational

### **Security-related process termination detected**

(K8S.NODE_SuspectProcessTermination) <sup>[1](#footnote1)</sup>

**Description**: Analysis of processes running within a container or directly on a Kubernetes node, has detected an attempt to terminate processes related to security monitoring on the container. Attackers will often try to terminate such processes using predefined scripts post-compromise.

**[MITRE tactics](#mitre-attck-tactics)**: Persistence

**Severity**: Low

### **SSH server is running inside a container**

(K8S.NODE_ContainerSSH) <sup>[1](#footnote1)</sup>

**Description**: Analysis of processes running within a container detected an SSH server running inside the container.

**[MITRE tactics](#mitre-attck-tactics)**: Execution

**Severity**: Informational

### **Suspicious file timestamp modification**

(K8S.NODE_TimestampTampering) <sup>[1](#footnote1)</sup>

**Description**: Analysis of processes running within a container or directly on a Kubernetes node, has detected a suspicious timestamp modification. Attackers will often copy timestamps from existing legitimate files to new tools to avoid detection of these newly dropped files.

**[MITRE tactics](#mitre-attck-tactics)**: Persistence, DefenseEvasion

**Severity**: Low

### **Suspicious request to Kubernetes API**

(K8S.NODE_KubernetesAPI) <sup>[1](#footnote1)</sup>

**Description**: Analysis of processes running within a container indicates that a suspicious request was made to the Kubernetes API. The request was sent from a container in the cluster. Although this behavior can be intentional, it might indicate that a compromised container is running in the cluster.

**[MITRE tactics](#mitre-attck-tactics)**: LateralMovement

**Severity**: Medium

### **Suspicious request to the Kubernetes Dashboard**

(K8S.NODE_KubernetesDashboard) <sup>[1](#footnote1)</sup>

**Description**: Analysis of processes running within a container indicates that a suspicious request was made to the Kubernetes Dashboard. The request was sent from a container in the cluster. Although this behavior can be intentional, it might indicate that a compromised container is running in the cluster.

**[MITRE tactics](#mitre-attck-tactics)**: LateralMovement

**Severity**: Medium

### **Potential crypto coin miner started**

(K8S.NODE_CryptoCoinMinerExecution) <sup>[1](#footnote1)</sup>

**Description**: Analysis of processes running within a container or directly on a Kubernetes node, has detected a process being started in a way normally associated with digital currency mining.

**[MITRE tactics](#mitre-attck-tactics)**: Execution

**Severity**: Medium

### **Suspicious password access**

(K8S.NODE_SuspectPasswordFileAccess) <sup>[1](#footnote1)</sup>

**Description**: Analysis of processes running within a container or directly on a Kubernetes node, has detected suspicious attempt to access encrypted user passwords.

**[MITRE tactics](#mitre-attck-tactics)**: Persistence

**Severity**: Informational

### **Possible malicious web shell detected.**

(K8S.NODE_Webshell) <sup>[1](#footnote1)</sup>

**Description**: Analysis of processes running within a container detected a possible web shell. Attackers will often upload a web shell to a compute resource they have compromised to gain persistence or for further exploitation.

**[MITRE tactics](#mitre-attck-tactics)**: Persistence, Exploitation

**Severity**: Medium

### **Burst of multiple reconnaissance commands could indicate initial activity after compromise**

(K8S.NODE_ReconnaissanceArtifactsBurst) <sup>[1](#footnote1)</sup>

**Description**: Analysis of host/device data detected execution of multiple reconnaissance commands related to gathering system or host details performed by attackers after initial compromise.

**[MITRE tactics](#mitre-attck-tactics)**: Discovery, Collection

**Severity**: Low

### **Suspicious Download Then Run Activity**

(K8S.NODE_DownloadAndRunCombo) <sup>[1](#footnote1)</sup>

**Description**: Analysis of processes running within a container or directly on a Kubernetes node, has detected a file being downloaded then run in the same command. While this isn't always malicious, this is a very common technique attackers use to get malicious files onto victim machines.

**[MITRE tactics](#mitre-attck-tactics)**: Execution, CommandAndControl, Exploitation

**Severity**: Medium

### **Access to kubelet kubeconfig file detected**

(K8S.NODE_KubeConfigAccess) <sup>[1](#footnote1)</sup>

**Description**: Analysis of processes running on a Kubernetes cluster node detected access to kubeconfig file on the host. The kubeconfig file, normally used by the Kubelet process, contains credentials to the Kubernetes cluster API server. Access to this file is often associated with attackers attempting to access those credentials, or with security scanning tools which check if the file is accessible.

**[MITRE tactics](#mitre-attck-tactics)**: CredentialAccess

**Severity**: Medium

### **Access to cloud metadata service detected**

(K8S.NODE_ImdsCall) <sup>[1](#footnote1)</sup>

**Description**: Analysis of processes running within a container detected access to the cloud metadata service for acquiring identity token. The container doesn't normally perform such operation. While this behavior might be legitimate, attackers might use this technique to access cloud resources after gaining initial access to a running container.

**[MITRE tactics](#mitre-attck-tactics)**: CredentialAccess

**Severity**: Medium

### **MITRE Caldera agent detected**

(K8S.NODE_MitreCalderaTools) <sup>[1](#footnote1)</sup>

**Description**: Analysis of processes running within a container or directly on a Kubernetes node, has detected a suspicious process. This is often associated with the MITRE 54ndc47 agent, which could be used maliciously to attack other machines.

**[MITRE tactics](#mitre-attck-tactics)**: Persistence, PrivilegeEscalation, DefenseEvasion, CredentialAccess, Discovery, LateralMovement, Execution, Collection, Exfiltration, Command And Control, Probing, Exploitation

**Severity**: Medium

<sup><a name="footnote1"></a>1</sup>: **Preview for non-AKS clusters**: This alert is generally available for AKS clusters, but it is in preview for other environments, such as Azure Arc, EKS, and GKE.

<sup><a name="footnote2"></a>2</sup>: **Limitations on GKE clusters**: GKE uses a Kubernetes audit policy that doesn't support all alert types. As a result, this security alert, which is based on Kubernetes audit events, is not supported for GKE clusters.

<sup><a name="footnote3"></a>3</sup>: This alert is supported on Windows nodes/containers.

## Alerts for SQL Database and Azure Synapse Analytics

[Further details and notes](defender-for-sql-introduction.md)

### **A possible vulnerability to SQL Injection**

(SQL.DB_VulnerabilityToSqlInjection
SQL.VM_VulnerabilityToSqlInjection
SQL.MI_VulnerabilityToSqlInjection
SQL.DW_VulnerabilityToSqlInjection
Synapse.SQLPool_VulnerabilityToSqlInjection)

**Description**: An application has generated a faulty SQL statement in the database. This can indicate a possible vulnerability to SQL injection attacks. There are two possible reasons for a faulty statement. A defect in application code might have constructed the faulty SQL statement. Or, application code or stored procedures didn't sanitize user input when constructing the faulty SQL statement, which can be exploited for SQL injection.

**[MITRE tactics](#mitre-attck-tactics)**: PreAttack

**Severity**: Medium

### **Attempted logon by a potentially harmful application**

(SQL.DB_HarmfulApplication
SQL.VM_HarmfulApplication
SQL.MI_HarmfulApplication
SQL.DW_HarmfulApplication
Synapse.SQLPool_HarmfulApplication)

**Description**: A potentially harmful application attempted to access your resource.

**[MITRE tactics](#mitre-attck-tactics)**: PreAttack

**Severity**: High

### **Log on from an unusual Azure Data Center**

(SQL.DB_DataCenterAnomaly
SQL.VM_DataCenterAnomaly
SQL.DW_DataCenterAnomaly
SQL.MI_DataCenterAnomaly
Synapse.SQLPool_DataCenterAnomaly)

**Description**: There has been a change in the access pattern to an SQL Server, where someone has signed in to the server from an unusual Azure Data Center. In some cases, the alert detects a legitimate action (a new application or Azure service). In other cases, the alert detects a malicious action (attacker operating from breached resource in Azure).

**[MITRE tactics](#mitre-attck-tactics)**: Probing

**Severity**: Low

### **Log on from an unusual location**

(SQL.DB_GeoAnomaly
SQL.VM_GeoAnomaly
SQL.DW_GeoAnomaly
SQL.MI_GeoAnomaly
Synapse.SQLPool_GeoAnomaly)

**Description**: There has been a change in the access pattern to SQL Server, where someone has signed in to the server from an unusual geographical location. In some cases, the alert detects a legitimate action (a new application or developer maintenance). In other cases, the alert detects a malicious action (a former employee or external attacker).

**[MITRE tactics](#mitre-attck-tactics)**: Exploitation

**Severity**: Medium

### **Login from a principal user not seen in 60 days**

(SQL.DB_PrincipalAnomaly
SQL.VM_PrincipalAnomaly
SQL.DW_PrincipalAnomaly
SQL.MI_PrincipalAnomaly
Synapse.SQLPool_PrincipalAnomaly)

**Description**: A principal user not seen in the last 60 days has logged into your database. If this database is new or this is expected behavior caused by recent changes in the users accessing the database, Defender for Cloud will identify significant changes to the access patterns and attempt to prevent future false positives.

**[MITRE tactics](#mitre-attck-tactics)**: Exploitation

**Severity**: Medium

### **Login from a domain not seen in 60 days**

(SQL.DB_DomainAnomaly
SQL.VM_DomainAnomaly
SQL.DW_DomainAnomaly
SQL.MI_DomainAnomaly
Synapse.SQLPool_DomainAnomaly)

**Description**: A user has logged in to your resource from a domain no other users have connected from in the last 60 days. If this resource is new or this is expected behavior caused by recent changes in the users accessing the resource, Defender for Cloud will identify significant changes to the access patterns and attempt to prevent future false positives.

**[MITRE tactics](#mitre-attck-tactics)**: Exploitation

**Severity**: Medium

### **Login from a suspicious IP**

(SQL.DB_SuspiciousIpAnomaly
SQL.VM_SuspiciousIpAnomaly
SQL.DW_SuspiciousIpAnomaly
SQL.MI_SuspiciousIpAnomaly
Synapse.SQLPool_SuspiciousIpAnomaly)

**Description**: Your resource has been accessed successfully from an IP address that Microsoft Threat Intelligence has associated with suspicious activity.

**[MITRE tactics](#mitre-attck-tactics)**: PreAttack

**Severity**: Medium

### **Potential SQL injection**

(SQL.DB_PotentialSqlInjection
SQL.VM_PotentialSqlInjection
SQL.MI_PotentialSqlInjection
SQL.DW_PotentialSqlInjection
Synapse.SQLPool_PotentialSqlInjection)

**Description**: An active exploit has occurred against an identified application vulnerable to SQL injection. This means an attacker is trying to inject malicious SQL statements by using the vulnerable application code or stored procedures.

**[MITRE tactics](#mitre-attck-tactics)**: PreAttack

**Severity**: High

### **Suspected brute force attack using a valid user**

(SQL.DB_BruteForce
SQL.VM_BruteForce
SQL.DW_BruteForce
SQL.MI_BruteForce
Synapse.SQLPool_BruteForce)

**Description**: A potential brute force attack has been detected on your resource. The attacker is using the valid user (username), which has permissions to log in.

**[MITRE tactics](#mitre-attck-tactics)**: PreAttack

**Severity**: High

### **Suspected brute force attack**

(SQL.DB_BruteForce
SQL.VM_BruteForce
SQL.DW_BruteForce
SQL.MI_BruteForce
Synapse.SQLPool_BruteForce)

**Description**: A potential brute force attack has been detected on your resource.

**[MITRE tactics](#mitre-attck-tactics)**: PreAttack

**Severity**: High

### **Suspected successful brute force attack**

(SQL.DB_BruteForce
SQL.VM_BruteForce
SQL.DW_BruteForce
SQL.MI_BruteForce
Synapse.SQLPool_BruteForce)

**Description**: A successful login occurred after an apparent brute force attack on your resource.

**[MITRE tactics](#mitre-attck-tactics)**: PreAttack

**Severity**: High

### **SQL Server potentially spawned a Windows command shell and accessed an abnormal external source**

(SQL.DB_ShellExternalSourceAnomaly
SQL.VM_ShellExternalSourceAnomaly
SQL.DW_ShellExternalSourceAnomaly
SQL.MI_ShellExternalSourceAnomaly
Synapse.SQLPool_ShellExternalSourceAnomaly)

**Description**: A suspicious SQL statement potentially spawned a Windows command shell with an external source that hasn't been seen before. Executing a shell that accesses an external source is a method used by attackers to download malicious payload and then execute it on the machine and compromise it. This enables an attacker to perform malicious tasks under remote direction. Alternatively, accessing an external source can be used to exfiltrate data to an external destination.

**[MITRE tactics](#mitre-attck-tactics)**: Execution

**Severity**: High

### **Unusual payload with obfuscated parts has been initiated by SQL Server**

(SQL.VM_PotentialSqlInjection)

**Description**: Someone has initiated a new payload utilizing the layer in SQL Server that communicates with the operating system while concealing the command in the SQL query. Attackers commonly hide impactful commands which are popularly monitored like xp_cmdshell, sp_add_job and others. Obfuscation techniques abuse legitimate commands like string concatenation, casting, base changing, and others, to avoid regex detection and hurt the readability of the logs.

**[MITRE tactics](#mitre-attck-tactics)**: Execution

**Severity**: High

## Alerts for open-source relational databases

[Further details and notes](defender-for-databases-introduction.md)

### **Suspected brute force attack using a valid user**

(SQL.PostgreSQL_BruteForce
SQL.MariaDB_BruteForce
SQL.MySQL_BruteForce)

**Description**: A potential brute force attack has been detected on your resource. The attacker is using the valid user (username), which has permissions to log in.

**[MITRE tactics](#mitre-attck-tactics)**: PreAttack

**Severity**: High

### **Suspected successful brute force attack**

(SQL.PostgreSQL_BruteForce
SQL.MySQL_BruteForce
SQL.MariaDB_BruteForce)

**Description**: A successful login occurred after an apparent brute force attack on your resource.

**[MITRE tactics](#mitre-attck-tactics)**: PreAttack

**Severity**: High

### **Suspected brute force attack**

(SQL.PostgreSQL_BruteForce
SQL.MySQL_BruteForce
SQL.MariaDB_BruteForce)

**Description**: A potential brute force attack has been detected on your resource.

**[MITRE tactics](#mitre-attck-tactics)**: PreAttack

**Severity**: High

### **Attempted logon by a potentially harmful application**

(SQL.PostgreSQL_HarmfulApplication
SQL.MariaDB_HarmfulApplication
SQL.MySQL_HarmfulApplication)

**Description**: A potentially harmful application attempted to access your resource.

**[MITRE tactics](#mitre-attck-tactics)**: PreAttack

**Severity**: High

### **Login from a principal user not seen in 60 days**

(SQL.PostgreSQL_PrincipalAnomaly
SQL.MariaDB_PrincipalAnomaly
SQL.MySQL_PrincipalAnomaly)

**Description**: A principal user not seen in the last 60 days has logged into your database. If this database is new or this is expected behavior caused by recent changes in the users accessing the database, Defender for Cloud will identify significant changes to the access patterns and attempt to prevent future false positives.

**[MITRE tactics](#mitre-attck-tactics)**: Exploitation

**Severity**: Medium

### **Login from a domain not seen in 60 days**

(SQL.MariaDB_DomainAnomaly
SQL.PostgreSQL_DomainAnomaly
SQL.MySQL_DomainAnomaly)

**Description**: A user has logged in to your resource from a domain no other users have connected from in the last 60 days. If this resource is new or this is expected behavior caused by recent changes in the users accessing the resource, Defender for Cloud will identify significant changes to the access patterns and attempt to prevent future false positives.

**[MITRE tactics](#mitre-attck-tactics)**: Exploitation

**Severity**: Medium

### **Log on from an unusual Azure Data Center**

(SQL.PostgreSQL_DataCenterAnomaly
SQL.MariaDB_DataCenterAnomaly
SQL.MySQL_DataCenterAnomaly)

**Description**: Someone logged on to your resource from an unusual Azure Data Center.

**[MITRE tactics](#mitre-attck-tactics)**: Probing

**Severity**: Low

### **Logon from an unusual cloud provider**

(SQL.PostgreSQL_CloudProviderAnomaly
SQL.MariaDB_CloudProviderAnomaly
SQL.MySQL_CloudProviderAnomaly)

**Description**: Someone logged on to your resource from a cloud provider not seen in the last 60 days. It's quick and easy for threat actors to obtain disposable compute power for use in their campaigns. If this is expected behavior caused by the recent adoption of a new cloud provider, Defender for Cloud will learn over time and attempt to prevent future false positives.

**[MITRE tactics](#mitre-attck-tactics)**: Exploitation

**Severity**: Medium

### **Log on from an unusual location**

(SQL.MariaDB_GeoAnomaly
SQL.PostgreSQL_GeoAnomaly
SQL.MySQL_GeoAnomaly)

**Description**: Someone logged on to your resource from an unusual Azure Data Center.

**[MITRE tactics](#mitre-attck-tactics)**: Exploitation

**Severity**: Medium

### **Login from a suspicious IP**

(SQL.PostgreSQL_SuspiciousIpAnomaly
SQL.MariaDB_SuspiciousIpAnomaly
SQL.MySQL_SuspiciousIpAnomaly)

**Description**: Your resource has been accessed successfully from an IP address that Microsoft Threat Intelligence has associated with suspicious activity.

**[MITRE tactics](#mitre-attck-tactics)**: PreAttack

**Severity**: Medium

## Alerts for Resource Manager

> [!NOTE]
> Alerts with a **delegated access** indication are triggered due to activity of third-party service providers. learn more about [service providers activity indications](defender-for-resource-manager-usage.md).

[Further details and notes](defender-for-resource-manager-introduction.md)

### **Azure Resource Manager operation from suspicious IP address**

(ARM_OperationFromSuspiciousIP)

**Description**: Microsoft Defender for Resource Manager detected an operation from an IP address that has been marked as suspicious in threat intelligence feeds.

**[MITRE tactics](#mitre-attck-tactics)**: Execution

**Severity**: Medium

### **Azure Resource Manager operation from suspicious proxy IP address**

(ARM_OperationFromSuspiciousProxyIP)

**Description**: Microsoft Defender for Resource Manager detected a resource management operation from an IP address that is associated with proxy services, such as TOR. While this behavior can be legitimate, it's often seen in malicious activities, when threat actors try to hide their source IP.

**[MITRE tactics](#mitre-attck-tactics)**: Defense Evasion

**Severity**: Medium

### **MicroBurst exploitation toolkit used to enumerate resources in your subscriptions**

(ARM_MicroBurst.AzDomainInfo)

**Description**: A PowerShell script was run in your subscription and performed suspicious pattern of executing an information gathering operations to discover resources, permissions, and network structures. Threat actors use automated scripts, like MicroBurst, to gather information for malicious activities. This was detected by analyzing Azure Resource Manager operations in your subscription. This operation might indicate that an identity in your organization was breached, and that the threat actor is trying to compromise your environment for malicious intentions.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: Low

### **MicroBurst exploitation toolkit used to enumerate resources in your subscriptions**

(ARM_MicroBurst.AzureDomainInfo)

**Description**: A PowerShell script was run in your subscription and performed suspicious pattern of executing an information gathering operations to discover resources, permissions, and network structures. Threat actors use automated scripts, like MicroBurst, to gather information for malicious activities. This was detected by analyzing Azure Resource Manager operations in your subscription.  This operation might indicate that an identity in your organization was breached, and that the threat actor is trying to compromise your environment for malicious intentions.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: Low

### **MicroBurst exploitation toolkit used to execute code on your virtual machine**

(ARM_MicroBurst.AzVMBulkCMD)

**Description**: A PowerShell script was run in your subscription and performed a suspicious pattern of executing code on a VM or a list of VMs. Threat actors use automated scripts, like MicroBurst, to run a script on a VM for malicious activities. This was detected by analyzing Azure Resource Manager operations in your subscription. This operation might indicate that an identity in your organization was breached, and that the threat actor is trying to compromise your environment for malicious intentions.

**[MITRE tactics](#mitre-attck-tactics)**: Execution

**Severity**: High

### **MicroBurst exploitation toolkit used to execute code on your virtual machine**

(RM_MicroBurst.AzureRmVMBulkCMD)

**Description**: MicroBurst's exploitation toolkit was used to execute code on your virtual machines. This was detected by analyzing Azure Resource Manager operations in your subscription.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: High

### **MicroBurst exploitation toolkit used to extract keys from your Azure key vaults**

(ARM_MicroBurst.AzKeyVaultKeysREST)

**Description**: A PowerShell script was run in your subscription and performed a suspicious pattern of extracting keys from an Azure Key Vault(s). Threat actors use automated scripts, like MicroBurst, to list keys and use them to access sensitive data or perform lateral movement. This was detected by analyzing Azure Resource Manager operations in your subscription. This operation might indicate that an identity in your organization was breached, and that the threat actor is trying to compromise your environment for malicious intentions.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: High

### **MicroBurst exploitation toolkit used to extract keys to your storage accounts**

(ARM_MicroBurst.AZStorageKeysREST)

**Description**: A PowerShell script was run in your subscription and performed a suspicious pattern of extracting keys to Storage Account(s). Threat actors use automated scripts, like MicroBurst, to list keys and use them to access sensitive data in your Storage Account(s). This was detected by analyzing Azure Resource Manager operations in your subscription. This operation might indicate that an identity in your organization was breached, and that the threat actor is trying to compromise your environment for malicious intentions.

**[MITRE tactics](#mitre-attck-tactics)**: Collection

**Severity**: High

### **MicroBurst exploitation toolkit used to extract secrets from your Azure key vaults**

(ARM_MicroBurst.AzKeyVaultSecretsREST)

**Description**: A PowerShell script was run in your subscription and performed a suspicious pattern of extracting secrets from an Azure Key Vault(s). Threat actors use automated scripts, like MicroBurst, to list secrets and use them to access sensitive data or perform lateral movement. This was detected by analyzing Azure Resource Manager operations in your subscription. This operation might indicate that an identity in your organization was breached, and that the threat actor is trying to compromise your environment for malicious intentions.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: High

### **PowerZure exploitation toolkit used to elevate access from Azure AD to Azure**

(ARM_PowerZure.AzureElevatedPrivileges)

**Description**: PowerZure exploitation toolkit was used to elevate access from AzureAD to Azure. This was detected by analyzing Azure Resource Manager operations in your tenant.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: High

### **PowerZure exploitation toolkit used to enumerate resources**

(ARM_PowerZure.GetAzureTargets)

**Description**: PowerZure exploitation toolkit was used to enumerate resources on behalf of a legitimate user account in your organization. This was detected by analyzing Azure Resource Manager operations in your subscription.

**[MITRE tactics](#mitre-attck-tactics)**: Collection

**Severity**: High

### **PowerZure exploitation toolkit used to enumerate storage containers, shares, and tables**

(ARM_PowerZure.ShowStorageContent)

**Description**: PowerZure exploitation toolkit was used to enumerate storage shares, tables, and containers. This was detected by analyzing Azure Resource Manager operations in your subscription.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: High

### **PowerZure exploitation toolkit used to execute a Runbook in your subscription**

(ARM_PowerZure.StartRunbook)

**Description**: PowerZure exploitation toolkit was used to execute a Runbook. This was detected by analyzing Azure Resource Manager operations in your subscription.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: High

### **PowerZure exploitation toolkit used to extract Runbooks content**

(ARM_PowerZure.AzureRunbookContent)

**Description**: PowerZure exploitation toolkit was used to extract Runbook content. This was detected by analyzing Azure Resource Manager operations in your subscription.

**[MITRE tactics](#mitre-attck-tactics)**: Collection

**Severity**: High

### **PREVIEW - Azurite toolkit run detected**

(ARM_Azurite)

**Description**: A known cloud-environment reconnaissance toolkit run has been detected in your environment. The tool [Azurite](https://github.com/mwrlabs/Azurite) can be used by an attacker (or penetration tester) to map your subscriptions' resources and identify insecure configurations.

**[MITRE tactics](#mitre-attck-tactics)**: Collection

**Severity**: High

### **PREVIEW - Suspicious creation of compute resources detected**

(ARM_SuspiciousComputeCreation)

**Description**: Microsoft Defender for Resource Manager identified a suspicious creation of compute resources in your subscription utilizing Virtual Machines/Azure Scale Set. The identified operations are designed to allow administrators to efficiently manage their environments by deploying new resources when needed. While this activity might be legitimate, a threat actor might utilize such operations to conduct crypto mining.
 The activity is deemed suspicious as the compute resources scale is higher than previously observed in the subscription.
 This can indicate that the principal is compromised and is being used with malicious intent.

**[MITRE tactics](#mitre-attck-tactics)**: Impact

**Severity**: Medium

### **PREVIEW - Suspicious key vault recovery detected**

(Arm_Suspicious_Vault_Recovering)

**Description**: Microsoft Defender for Resource Manager detected a suspicious recovery operation for a soft-deleted key vault resource.
 The user recovering the resource is different from the user that deleted it. This is highly suspicious because the user rarely invokes such an operation. In addition, the user logged on without multifactor authentication (MFA).
 This might indicate that the user is compromised and is attempting to discover secrets and keys to gain access to sensitive resources, or to perform lateral movement across your network.

**[MITRE tactics](#mitre-attck-tactics)**: Lateral movement

**Severity**: Medium/high

### **PREVIEW - Suspicious management session using an inactive account detected**

(ARM_UnusedAccountPersistence)

**Description**: Subscription activity logs analysis has detected suspicious behavior. A principal not in use for a long period of time is now performing actions that can secure persistence for an attacker.

**[MITRE tactics](#mitre-attck-tactics)**: Persistence

**Severity**: Medium

### **PREVIEW - Suspicious invocation of a high-risk 'Credential Access' operation by a service principal detected**

(ARM_AnomalousServiceOperation.CredentialAccess)

**Description**: Microsoft Defender for Resource Manager identified a suspicious invocation of a high-risk operation in your subscription, which might indicate an attempt to access credentials. The identified operations are designed to allow administrators to efficiently manage their environments. While this activity might be legitimate, a threat actor might utilize such operations to access restricted credentials and compromise resources in your environment. This can indicate that the service principal is compromised and is being used with malicious intent.

**[MITRE tactics](#mitre-attck-tactics)**: Credential access

**Severity**: Medium

### **PREVIEW - Suspicious invocation of a high-risk 'Data Collection' operation by a service principal detected**

(ARM_AnomalousServiceOperation.Collection)

**Description**: Microsoft Defender for Resource Manager identified a suspicious invocation of a high-risk operation in your subscription, which might indicate an attempt to collect data. The identified operations are designed to allow administrators to efficiently manage their environments. While this activity might be legitimate, a threat actor might utilize such operations to collect sensitive data on resources in your environment. This can indicate that the service principal is compromised and is being used with malicious intent.

**[MITRE tactics](#mitre-attck-tactics)**: Collection

**Severity**: Medium

### **PREVIEW - Suspicious invocation of a high-risk 'Defense Evasion' operation by a service principal detected**

(ARM_AnomalousServiceOperation.DefenseEvasion)

**Description**: Microsoft Defender for Resource Manager identified a suspicious invocation of a high-risk operation in your subscription, which might indicate an attempt to evade defenses. The identified operations are designed to allow administrators to efficiently manage the security posture of their environments. While this activity might be legitimate, a threat actor might utilize such operations to avoid being detected while compromising resources in your environment. This can indicate that the service principal is compromised and is being used with malicious intent.

**[MITRE tactics](#mitre-attck-tactics)**: Defense Evasion

**Severity**: Medium

### **PREVIEW - Suspicious invocation of a high-risk 'Execution' operation by a service principal detected**

(ARM_AnomalousServiceOperation.Execution)

**Description**: Microsoft Defender for Resource Manager identified a suspicious invocation of a high-risk operation on a machine in your subscription, which might indicate an attempt to execute code. The identified operations are designed to allow administrators to efficiently manage their environments. While this activity might be legitimate, a threat actor might utilize such operations to access restricted credentials and compromise resources in your environment. This can indicate that the service principal is compromised and is being used with malicious intent.

**[MITRE tactics](#mitre-attck-tactics)**: Defense Execution

**Severity**: Medium

### **PREVIEW - Suspicious invocation of a high-risk 'Impact' operation by a service principal detected**

(ARM_AnomalousServiceOperation.Impact)

**Description**: Microsoft Defender for Resource Manager identified a suspicious invocation of a high-risk operation in your subscription, which might indicate an attempted configuration change. The identified operations are designed to allow administrators to efficiently manage their environments. While this activity might be legitimate, a threat actor might utilize such operations to access restricted credentials and compromise resources in your environment. This can indicate that the service principal is compromised and is being used with malicious intent.

**[MITRE tactics](#mitre-attck-tactics)**: Impact

**Severity**: Medium

### **PREVIEW - Suspicious invocation of a high-risk 'Initial Access' operation by a service principal detected**

(ARM_AnomalousServiceOperation.InitialAccess)

**Description**: Microsoft Defender for Resource Manager identified a suspicious invocation of a high-risk operation in your subscription, which might indicate an attempt to access restricted resources. The identified operations are designed to allow administrators to efficiently access their environments. While this activity might be legitimate, a threat actor might utilize such operations to gain initial access to restricted resources in your environment. This can indicate that the service principal is compromised and is being used with malicious intent.

**[MITRE tactics](#mitre-attck-tactics)**: Initial access

**Severity**: Medium

### **PREVIEW - Suspicious invocation of a high-risk 'Lateral Movement Access' operation by a service principal detected**

(ARM_AnomalousServiceOperation.LateralMovement)

**Description**: Microsoft Defender for Resource Manager identified a suspicious invocation of a high-risk operation in your subscription, which might indicate an attempt to perform lateral movement. The identified operations are designed to allow administrators to efficiently manage their environments. While this activity might be legitimate, a threat actor might utilize such operations to compromise more resources in your environment. This can indicate that the service principal is compromised and is being used with malicious intent.

**[MITRE tactics](#mitre-attck-tactics)**: Lateral movement

**Severity**: Medium

### **PREVIEW - Suspicious invocation of a high-risk 'persistence' operation by a service principal detected**

(ARM_AnomalousServiceOperation.Persistence)

**Description**: Microsoft Defender for Resource Manager identified a suspicious invocation of a high-risk operation in your subscription, which might indicate an attempt to establish persistence. The identified operations are designed to allow administrators to efficiently manage their environments. While this activity might be legitimate, a threat actor might utilize such operations to establish persistence in your environment. This can indicate that the service principal is compromised and is being used with malicious intent.

**[MITRE tactics](#mitre-attck-tactics)**: Persistence

**Severity**: Medium

### **PREVIEW - Suspicious invocation of a high-risk 'Privilege Escalation' operation by a service principal detected**

(ARM_AnomalousServiceOperation.PrivilegeEscalation)

**Description**: Microsoft Defender for Resource Manager identified a suspicious invocation of a high-risk operation in your subscription, which might indicate an attempt to escalate privileges. The identified operations are designed to allow administrators to efficiently manage their environments. While this activity might be legitimate, a threat actor might utilize such operations to escalate privileges while compromising resources in your environment. This can indicate that the service principal is compromised and is being used with malicious intent.

**[MITRE tactics](#mitre-attck-tactics)**: Privilege escalation

**Severity**: Medium

### **PREVIEW - Suspicious management session using an inactive account detected**

(ARM_UnusedAccountPersistence)

**Description**: Subscription activity logs analysis has detected suspicious behavior. A principal not in use for a long period of time is now performing actions that can secure persistence for an attacker.

**[MITRE tactics](#mitre-attck-tactics)**: Persistence

**Severity**: Medium

### **PREVIEW - Suspicious management session using PowerShell detected**

(ARM_UnusedAppPowershellPersistence)

**Description**: Subscription activity logs analysis has detected suspicious behavior. A principal that doesn't regularly use PowerShell to manage the subscription environment is now using PowerShell, and performing actions that can secure persistence for an attacker.

**[MITRE tactics](#mitre-attck-tactics)**: Persistence

**Severity**: Medium

### **PREVIEW â€“ Suspicious management session using Azure portal detected**

(ARM_UnusedAppIbizaPersistence)

**Description**: Analysis of your subscription activity logs has detected a suspicious behavior. A principal that doesn't regularly use the Azure portal (Ibiza) to manage the subscription environment (hasn't used Azure portal to manage for the last 45 days, or a subscription that it is actively managing), is now using the Azure portal and performing actions that can secure persistence for an attacker.

**[MITRE tactics](#mitre-attck-tactics)**: Persistence

**Severity**: Medium

### **Privileged custom role created for your subscription in a suspicious way (Preview)**

(ARM_PrivilegedRoleDefinitionCreation)

**Description**: Microsoft Defender for Resource Manager detected a suspicious creation of privileged custom role definition in your subscription. This operation might have been performed by a legitimate user in your organization. Alternatively, it might indicate that an account in your organization was breached, and that the threat actor is trying to create a privileged role to use in the future to evade detection.

**[MITRE tactics](#mitre-attck-tactics)**: Privilege Escalation, Defense Evasion

**Severity**: Informational

### **Suspicious Azure role assignment detected (Preview)**

(ARM_AnomalousRBACRoleAssignment)

**Description**: Microsoft Defender for Resource Manager identified a suspicious Azure role assignment / performed using PIM (Privileged Identity Management) in your tenant, which might indicate that an account in your organization was compromised. The identified operations are designed to allow administrators to grant principals access to Azure resources. While this activity might be legitimate, a threat actor might utilize role assignment to escalate their permissions allowing them to advance their attack.

**[MITRE tactics](#mitre-attck-tactics)**: Lateral Movement, Defense Evasion

**Severity**: Low (PIM) / High

### **Suspicious invocation of a high-risk 'Credential Access' operation detected (Preview)**

(ARM_AnomalousOperation.CredentialAccess)

**Description**: Microsoft Defender for Resource Manager identified a suspicious invocation of a high-risk operation in your subscription, which might indicate an attempt to access credentials. The identified operations are designed to allow administrators to efficiently access their environments. While this activity might be legitimate, a threat actor might utilize such operations to access restricted credentials and compromise resources in your environment. This can indicate that the account is compromised and is being used with malicious intent.

**[MITRE tactics](#mitre-attck-tactics)**: Credential Access

**Severity**: Medium

### **Suspicious invocation of a high-risk 'Data Collection' operation detected (Preview)**

(ARM_AnomalousOperation.Collection)

**Description**: Microsoft Defender for Resource Manager identified a suspicious invocation of a high-risk operation in your subscription, which might indicate an attempt to collect data. The identified operations are designed to allow administrators to efficiently manage their environments. While this activity might be legitimate, a threat actor might utilize such operations to collect sensitive data on resources in your environment. This can indicate that the account is compromised and is being used with malicious intent.

**[MITRE tactics](#mitre-attck-tactics)**: Collection

**Severity**: Medium

### **Suspicious invocation of a high-risk 'Defense Evasion' operation detected (Preview)**

(ARM_AnomalousOperation.DefenseEvasion)

**Description**: Microsoft Defender for Resource Manager identified a suspicious invocation of a high-risk operation in your subscription, which might indicate an attempt to evade defenses. The identified operations are designed to allow administrators to efficiently manage the security posture of their environments. While this activity might be legitimate, a threat actor might utilize such operations to avoid being detected while compromising resources in your environment. This can indicate that the account is compromised and is being used with malicious intent.

**[MITRE tactics](#mitre-attck-tactics)**: Defense Evasion

**Severity**: Medium

### **Suspicious invocation of a high-risk 'Execution' operation detected (Preview)**

(ARM_AnomalousOperation.Execution)

**Description**: Microsoft Defender for Resource Manager identified a suspicious invocation of a high-risk operation on a machine in your subscription, which might indicate an attempt to execute code. The identified operations are designed to allow administrators to efficiently manage their environments. While this activity might be legitimate, a threat actor might utilize such operations to access restricted credentials and compromise resources in your environment. This can indicate that the account is compromised and is being used with malicious intent.

**[MITRE tactics](#mitre-attck-tactics)**: Execution

**Severity**: Medium

### **Suspicious invocation of a high-risk 'Impact' operation detected (Preview)**

(ARM_AnomalousOperation.Impact)

**Description**: Microsoft Defender for Resource Manager identified a suspicious invocation of a high-risk operation in your subscription, which might indicate an attempted configuration change. The identified operations are designed to allow administrators to efficiently manage their environments. While this activity might be legitimate, a threat actor might utilize such operations to access restricted credentials and compromise resources in your environment. This can indicate that the account is compromised and is being used with malicious intent.

**[MITRE tactics](#mitre-attck-tactics)**: Impact

**Severity**: Medium

### **Suspicious invocation of a high-risk 'Initial Access' operation detected (Preview)**

(ARM_AnomalousOperation.InitialAccess)

**Description**: Microsoft Defender for Resource Manager identified a suspicious invocation of a high-risk operation in your subscription, which might indicate an attempt to access restricted resources. The identified operations are designed to allow administrators to efficiently access their environments. While this activity might be legitimate, a threat actor might utilize such operations to gain initial access to restricted resources in your environment. This can indicate that the account is compromised and is being used with malicious intent.

**[MITRE tactics](#mitre-attck-tactics)**: Initial Access

**Severity**: Medium

### **Suspicious invocation of a high-risk 'Lateral Movement' operation detected (Preview)**

(ARM_AnomalousOperation.LateralMovement)

**Description**: Microsoft Defender for Resource Manager identified a suspicious invocation of a high-risk operation in your subscription, which might indicate an attempt to perform lateral movement. The identified operations are designed to allow administrators to efficiently manage their environments. While this activity might be legitimate, a threat actor might utilize such operations to compromise more resources in your environment. This can indicate that the account is compromised and is being used with malicious intent.

**[MITRE tactics](#mitre-attck-tactics)**: Lateral Movement

**Severity**: Medium

### **Suspicious elevate access operation (Preview)**(ARM_AnomalousElevateAccess)

**Description**: Microsoft Defender for Resource Manager identified a suspicious "Elevate Access" operation. The activity is deemed suspicious, as this principal rarely invokes such operations. While this activity might be legitimate, a threat actor might utilize an "Elevate Access" operation to perform privilege escalation for a compromised user.

**[MITRE tactics](#mitre-attck-tactics)**: Privilege Escalation

**Severity**: Medium

### **Suspicious invocation of a high-risk 'Persistence' operation detected (Preview)**

(ARM_AnomalousOperation.Persistence)

**Description**: Microsoft Defender for Resource Manager identified a suspicious invocation of a high-risk operation in your subscription, which might indicate an attempt to establish persistence. The identified operations are designed to allow administrators to efficiently manage their environments. While this activity might be legitimate, a threat actor might utilize such operations to establish persistence in your environment. This can indicate that the account is compromised and is being used with malicious intent.

**[MITRE tactics](#mitre-attck-tactics)**: Persistence

**Severity**: Medium

### **Suspicious invocation of a high-risk 'Privilege Escalation' operation detected (Preview)**

(ARM_AnomalousOperation.PrivilegeEscalation)

**Description**: Microsoft Defender for Resource Manager identified a suspicious invocation of a high-risk operation in your subscription, which might indicate an attempt to escalate privileges. The identified operations are designed to allow administrators to efficiently manage their environments. While this activity might be legitimate, a threat actor might utilize such operations to escalate privileges while compromising resources in your environment. This can indicate that the account is compromised and is being used with malicious intent.

**[MITRE tactics](#mitre-attck-tactics)**: Privilege Escalation

**Severity**: Medium

### **Usage of MicroBurst exploitation toolkit to run an arbitrary code or exfiltrate Azure Automation account credentials**

(ARM_MicroBurst.RunCodeOnBehalf)

**Description**: A PowerShell script was run in your subscription and performed a suspicious pattern of executing an arbitrary code or exfiltrate Azure Automation account credentials. Threat actors use automated scripts, like MicroBurst, to run arbitrary code for malicious activities. This was detected by analyzing Azure Resource Manager operations in your subscription. This operation might indicate that an identity in your organization was breached, and that the threat actor is trying to compromise your environment for malicious intentions.

**[MITRE tactics](#mitre-attck-tactics)**: Persistence, Credential Access

**Severity**: High

### **Usage of NetSPI techniques to maintain persistence in your Azure environment**

(ARM_NetSPI.MaintainPersistence)

**Description**: Usage of NetSPI persistence technique to create a webhook backdoor and maintain persistence in your Azure environment. This was detected by analyzing Azure Resource Manager operations in your subscription.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: High

### **Usage of PowerZure exploitation toolkit to run an arbitrary code or exfiltrate Azure Automation account credentials**

(ARM_PowerZure.RunCodeOnBehalf)

**Description**: PowerZure exploitation toolkit detected attempting to run code or exfiltrate Azure Automation account credentials. This was detected by analyzing Azure Resource Manager operations in your subscription.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: High

### **Usage of PowerZure function to maintain persistence in your Azure environment**

(ARM_PowerZure.MaintainPersistence)

**Description**: PowerZure exploitation toolkit detected creating a webhook backdoor to maintain persistence in your Azure environment. This was detected by analyzing Azure Resource Manager operations in your subscription.

**[MITRE tactics](#mitre-attck-tactics)**: -

**Severity**: High

### **Suspicious classic role assignment detected (Preview)**

(ARM_AnomalousClassicRoleAssignment)

**Description**: Microsoft Defender for Resource Manager identified a suspicious classic role assignment in your tenant, which might indicate that an account in your organization was compromised. The identified operations are designed to provide backward compatibility with classic roles that are no longer commonly used. While this activity might be legitimate, a threat actor might utilize such assignment to grant permissions to another user account under their control.

**[MITRE tactics](#mitre-attck-tactics)**: Lateral Movement, Defense Evasion

**Severity**: High

## Alerts for Azure Storage

[Further details and notes](defender-for-storage-introduction.md)

### **Access from a suspicious application**

(Storage.Blob_SuspiciousApp)

**Description**: Indicates that a suspicious application has successfully accessed a container of a storage account with authentication.
This might indicate that an attacker has obtained the credentials necessary to access the account, and is exploiting it. This could also be an indication of a penetration test carried out in your organization.
Applies to: Azure Blob Storage, Azure Data Lake Storage Gen2

**[MITRE tactics](#mitre-attck-tactics)**: Initial Access

**Severity**: High/Medium

### **Access from a suspicious IP address**

(Storage.Blob_SuspiciousIp
Storage.Files_SuspiciousIp)

**Description**: Indicates that this storage account has been successfully accessed from an IP address that is considered suspicious. This alert is powered by Microsoft Threat Intelligence.
Learn more about [Microsoft's threat intelligence capabilities](https://go.microsoft.com/fwlink/?linkid=2128684).
Applies to: Azure Blob Storage, Azure Files, Azure Data Lake Storage Gen2

**[MITRE tactics](#mitre-attck-tactics)**: Pre Attack

**Severity**: High/Medium/Low

### **Phishing content hosted on a storage account**

(Storage.Blob_PhishingContent
Storage.Files_PhishingContent)

**Description**: A URL used in a phishing attack points to your Azure Storage account. This URL was part of a phishing attack affecting users of Microsoft 365.
Typically, content hosted on such pages is designed to trick visitors into entering their corporate credentials or financial information into a web form that looks legitimate.
This alert is powered by Microsoft Threat Intelligence.
Learn more about [Microsoft's threat intelligence capabilities](https://go.microsoft.com/fwlink/?linkid=2128684).
Applies to: Azure Blob Storage, Azure Files

**[MITRE tactics](#mitre-attck-tactics)**: Collection

**Severity**: High

### **Storage account identified as source for distribution of malware**

(Storage.Files_WidespreadeAm)

**Description**: Antimalware alerts indicate that an infected file(s) is stored in an Azure file share that is mounted to multiple VMs. If attackers gain access to a VM with a mounted Azure file share, they can use it to spread malware to other VMs that mount the same share.
Applies to: Azure Files

**[MITRE tactics](#mitre-attck-tactics)**: Execution

**Severity**: Medium

### **The access level of a potentially sensitive storage blob container was changed to allow unauthenticated public access**

(Storage.Blob_OpenACL)

**Description**: The alert indicates that someone has changed the access level of a blob container in the storage account, which might contain sensitive data, to the 'Container' level, to allow unauthenticated (anonymous) public access. The change was made through the Azure portal.
Based on statistical analysis, the blob container is flagged as possibly containing sensitive data. This analysis suggests that blob containers or storage accounts with similar names are typically not exposed to public access.
Applies to: Azure Blob (Standard general-purpose v2, Azure Data Lake Storage Gen2, or premium block blobs) storage accounts.

**[MITRE tactics](#mitre-attck-tactics)**: Collection

**Severity**: Medium

### **Authenticated access from a Tor exit node**

(Storage.Blob_TorAnomaly
Storage.Files_TorAnomaly)

**Description**: One or more storage container(s) / file share(s) in your storage account were successfully accessed from an IP address known to be an active exit node of Tor (an anonymizing proxy). Threat actors use Tor to make it difficult to trace the activity back to them. Authenticated access from a Tor exit node is a likely indication that a threat actor is trying to hide their identity.
Applies to: Azure Blob Storage, Azure Files, Azure Data Lake Storage Gen2

**[MITRE tactics](#mitre-attck-tactics)**: Initial Access / Pre Attack

**Severity**: High/Medium

### **Access from an unusual location to a storage account**

(Storage.Blob_GeoAnomaly
Storage.Files_GeoAnomaly)

**Description**: Indicates that there was a change in the access pattern to an Azure Storage account. Someone has accessed this account from an IP address considered unfamiliar when compared with recent activity. Either an attacker has gained access to the account, or a legitimate user has connected from a new or unusual geographic location. An example of the latter is remote maintenance from a new application or developer.
Applies to: Azure Blob Storage, Azure Files, Azure Data Lake Storage Gen2

**[MITRE tactics](#mitre-attck-tactics)**: Initial Access

**Severity**: High/Medium/Low

### **Unusual unauthenticated access to a storage container**

(Storage.Blob_AnonymousAccessAnomaly)

**Description**: This storage account was accessed without authentication, which is a change in the common access pattern. Read access to this container is usually authenticated. This might indicate that a threat actor was able to exploit public read access to storage container(s) in this storage account(s).
Applies to: Azure Blob Storage

**[MITRE tactics](#mitre-attck-tactics)**: Initial Access

**Severity**: High/Low

### **Potential malware uploaded to a storage account**

(Storage.Blob_MalwareHashReputation
Storage.Files_MalwareHashReputation)

**Description**: Indicates that a blob containing potential malware has been uploaded to a blob container or a file share in a storage account. This alert is based on hash reputation analysis leveraging the power of Microsoft threat intelligence, which includes hashes for viruses, trojans, spyware and ransomware. Potential causes might include an intentional malware upload by an attacker, or an unintentional upload of a potentially malicious blob by a legitimate user.
Applies to: Azure Blob Storage, Azure Files (Only for transactions over REST API)
Learn more about [Microsoft's threat intelligence capabilities](https://go.microsoft.com/fwlink/?linkid=2128684).

**[MITRE tactics](#mitre-attck-tactics)**: Lateral Movement

**Severity**: High

### **Publicly accessible storage containers successfully discovered**

(Storage.Blob_OpenContainersScanning.SuccessfulDiscovery)

**Description**: A successful discovery of   publicly open storage container(s) in your storage account was performed in the last hour by a scanning script or tool.

This usually indicates a reconnaissance attack, where the threat actor tries to list blobs by guessing container names, in the hope of finding misconfigured open storage containers with sensitive data in them.

The threat actor might use their own script or use known scanning tools like   Microburst to scan for publicly open containers.

✔ Azure Blob Storage
✖ Azure Files
✖ Azure Data Lake Storage Gen2

**[MITRE tactics](#mitre-attck-tactics)**: Collection

**Severity**: High/Medium

### **Publicly accessible storage containers unsuccessfully scanned**

(Storage.Blob_OpenContainersScanning.FailedAttempt)

**Description**: A series of failed attempts to scan for publicly open storage containers were performed in the last hour.

This usually indicates a reconnaissance attack, where the threat actor tries to list blobs by guessing container names, in the hope of finding misconfigured open storage containers with sensitive data in them.

The threat actor might use their own script or use known scanning tools like Microburst to scan for publicly open containers.

✔ Azure Blob Storage
✖ Azure Files
✖ Azure Data Lake Storage Gen2

**[MITRE tactics](#mitre-attck-tactics)**: Collection

**Severity**: High/Low

### **Unusual access inspection in a storage account**

(Storage.Blob_AccessInspectionAnomaly
Storage.Files_AccessInspectionAnomaly)

**Description**: Indicates that the access permissions of a storage account have been inspected in an unusual way, compared to recent activity on this account. A potential cause is that an attacker has performed reconnaissance for a future attack.
Applies to: Azure Blob Storage, Azure Files

**[MITRE tactics](#mitre-attck-tactics)**: Discovery

**Severity**: High/Medium

### **Unusual amount of data extracted from a storage account**

(Storage.Blob_DataExfiltration.AmountOfDataAnomaly
Storage.Blob_DataExfiltration.NumberOfBlobsAnomaly
Storage.Files_DataExfiltration.AmountOfDataAnomaly
Storage.Files_DataExfiltration.NumberOfFilesAnomaly)

**Description**: Indicates that an unusually large amount of data has been extracted compared to recent activity on this storage container. A potential cause is that an attacker has extracted a large amount of data from a container that holds blob storage.
Applies to: Azure Blob Storage, Azure Files, Azure Data Lake Storage Gen2

**[MITRE tactics](#mitre-attck-tactics)**: Exfiltration

**Severity**: High/Low

### **Unusual application accessed a storage account**

(Storage.Blob_ApplicationAnomaly
Storage.Files_ApplicationAnomaly)

**Description**: Indicates that an unusual application has accessed this storage account. A potential cause is that an attacker has accessed your storage account by using a new application.
Applies to: Azure Blob Storage, Azure Files

**[MITRE tactics](#mitre-attck-tactics)**: Execution

**Severity**: High/Medium

### **Unusual data exploration in a storage account**

(Storage.Blob_DataExplorationAnomaly
Storage.Files_DataExplorationAnomaly)

**Description**: Indicates that blobs or containers in a storage account have been enumerated in an abnormal way, compared to recent activity on this account. A potential cause is that an attacker has performed reconnaissance for a future attack.
Applies to: Azure Blob Storage, Azure Files

**[MITRE tactics](#mitre-attck-tactics)**: Execution

**Severity**: High/Medium

### **Unusual deletion in a storage account**

(Storage.Blob_DeletionAnomaly
Storage.Files_DeletionAnomaly)

**Description**: Indicates that one or more unexpected delete operations has occurred in a storage account, compared to recent activity on this account. A potential cause is that an attacker has deleted data from your storage account.
Applies to: Azure Blob Storage, Azure Files, Azure Data Lake Storage Gen2

**[MITRE tactics](#mitre-attck-tactics)**: Exfiltration

**Severity**: High/Medium

### **Unusual unauthenticated public access to a sensitive blob container (Preview)**

Storage.Blob_AnonymousAccessAnomaly.Sensitive

**Description**: The alert indicates that someone accessed a blob container with sensitive data in the storage account without authentication, using an external (public) IP address. This access is suspicious since the blob container is open to public access and is typically only accessed with authentication from internal networks (private IP addresses). This access could indicate that the blob container's access level is misconfigured, and a malicious actor might have exploited the public access. The security alert includes the discovered sensitive information context (scanning time, classification label, information types, and file types). Learn more on sensitive data threat detection.
 Applies to: Azure Blob (Standard general-purpose v2, Azure Data Lake Storage Gen2, or premium block blobs) storage accounts with the new Defender for Storage plan with the data sensitivity threat detection feature enabled.

**[MITRE tactics](#mitre-attck-tactics)**: Initial Access

**Severity**: High

### **Unusual amount of data extracted from a sensitive blob container (Preview)**

Storage.Blob_DataExfiltration.AmountOfDataAnomaly.Sensitive

**Description**: The alert indicates that someone has extracted an unusually large amount of data from a blob container with sensitive data in the storage account. Applies to: Azure Blob (Standard general-purpose v2, Azure Data Lake Storage Gen2, or premium block blobs) storage accounts with the new Defender for Storage plan with the data sensitivity threat detection feature enabled.

**[MITRE tactics](#mitre-attck-tactics)**: Exfiltration

**Severity**: Medium

### **Unusual number of blobs extracted from a sensitive blob container (Preview)**

Storage.Blob_DataExfiltration.NumberOfBlobsAnomaly.Sensitive

**Description**: The alert indicates that someone has extracted an unusually large number of blobs from a blob container with sensitive data in the storage account. Applies to: Azure Blob (Standard general-purpose v2, Azure Data Lake Storage Gen2 or premium block blobs) storage accounts with the new Defender for Storage plan with the data sensitivity threat detection feature enabled.

**[MITRE tactics](#mitre-attck-tactics)**: Exfiltration

### **Access from a known suspicious application to a sensitive blob container (Preview)**

Storage.Blob_SuspiciousApp.Sensitive

**Description**: The alert indicates that someone with a known suspicious application accessed a blob container with sensitive data in the storage account and performed authenticated operations.  
The access might indicate that a threat actor obtained credentials to access the storage account by using a known suspicious application. However, the access could also indicate a penetration test carried out in the organization.
Applies to: Azure Blob (Standard general-purpose v2, Azure Data Lake Storage Gen2 or premium block blobs) storage accounts with the new Defender for Storage plan with the data sensitivity threat detection feature enabled.

**[MITRE tactics](#mitre-attck-tactics)**: Initial Access

**Severity**: High

### **Access from a known suspicious IP address to a sensitive blob container (Preview)**

Storage.Blob_SuspiciousIp.Sensitive

**Description**: The alert indicates that someone accessed a blob container with sensitive data in the storage account from a known suspicious IP address associated with threat intel by Microsoft Threat Intelligence. Since the access was authenticated, it's possible that the credentials allowing access to this storage account were compromised.
Learn more about [Microsoft's threat intelligence capabilities](https://go.microsoft.com/fwlink/?linkid=2128684).
Applies to: Azure Blob (Standard general-purpose v2, Azure Data Lake Storage Gen2, or premium block blobs) storage accounts with the new Defender for Storage plan with the data sensitivity threat detection feature enabled.

**[MITRE tactics](#mitre-attck-tactics)**: Pre-Attack

**Severity**: High

### **Access from a Tor exit node to a sensitive blob container (Preview)**

Storage.Blob_TorAnomaly.Sensitive

**Description**: The alert indicates that someone with an IP address known to be a Tor exit node accessed a blob container with sensitive data in the storage account with authenticated access. Authenticated access from a Tor exit node strongly indicates that the actor is attempting to remain anonymous for possible malicious intent. Since the access was authenticated, it's possible that the credentials allowing access to this storage account were compromised.
Applies to: Azure Blob (Standard general-purpose v2, Azure Data Lake Storage Gen2, or premium block blobs) storage accounts with the new Defender for Storage plan with the data sensitivity threat detection feature enabled.

**[MITRE tactics](#mitre-attck-tactics)**: Pre-Attack

**Severity**: High

### **Access from an unusual location to a sensitive blob container (Preview)**

Storage.Blob_GeoAnomaly.Sensitive

**Description**: The alert indicates that someone has accessed blob container with sensitive data in the storage account with authentication from an unusual location. Since the access was authenticated, it's possible that the credentials allowing access to this storage account were compromised.
Applies to: Azure Blob (Standard general-purpose v2, Azure Data Lake Storage Gen2, or premium block blobs) storage accounts with the new Defender for Storage plan with the data sensitivity threat detection feature enabled.

**[MITRE tactics](#mitre-attck-tactics)**: Initial Access

**Severity**: Medium

### **The access level of a sensitive storage blob container was changed to allow unauthenticated public access (Preview)**

Storage.Blob_OpenACL.Sensitive

**Description**: The alert indicates that someone has changed the access level of a blob container in the storage account, which contains sensitive data, to the 'Container' level, which allows unauthenticated (anonymous) public access. The change was made through the Azure portal.
The access level change might compromise the security of the data. We recommend taking immediate action to secure the data and prevent unauthorized access in case this alert is triggered.
Applies to: Azure Blob (Standard general-purpose v2, Azure Data Lake Storage Gen2, or premium block blobs) storage accounts with the new Defender for Storage plan with the data sensitivity threat detection feature enabled.

**[MITRE tactics](#mitre-attck-tactics)**: Collection

**Severity**: High

### **Suspicious external access to an Azure storage account with overly permissive SAS token (Preview)**

Storage.Blob_AccountSas.InternalSasUsedExternally

**Description**: The alert indicates that someone with an external (public) IP address accessed the storage account using an overly permissive SAS token with a long expiration date. This type of access is considered suspicious because the SAS token is typically only used in internal networks (from private IP addresses).
The activity might indicate that a SAS token has been leaked by a malicious actor or leaked unintentionally from a legitimate source.
Even if the access is legitimate, using a high-permission SAS token with a long expiration date goes against security best practices and poses a potential security risk.
Applies to: Azure Blob (Standard general-purpose v2, Azure Data Lake Storage Gen2, or premium block blobs) storage accounts with the new Defender for Storage plan.

**[MITRE tactics](#mitre-attck-tactics)**: Exfiltration /  Resource Development / Impact

**Severity**: Medium

### **Suspicious external operation to an Azure storage account with overly permissive SAS token (Preview)**

Storage.Blob_AccountSas.UnusualOperationFromExternalIp

**Description**: The alert indicates that someone with an external (public) IP address accessed the storage account using an overly permissive SAS token with a long expiration date. The access is considered suspicious because operations invoked outside your network (not from private IP addresses) with this SAS token are typically used for a specific set of Read/Write/Delete operations, but other operations occurred, which makes this access suspicious.
This activity might indicate that a SAS token has been leaked by a malicious actor or leaked unintentionally from a legitimate source.
Even if the access is legitimate, using a high-permission SAS token with a long expiration date goes against security best practices and poses a potential security risk.
Applies to: Azure Blob (Standard general-purpose v2, Azure Data Lake Storage Gen2, or premium block blobs) storage accounts with the new Defender for Storage plan.

**[MITRE tactics](#mitre-attck-tactics)**: Exfiltration /  Resource Development / Impact

**Severity**: Medium

### **Unusual SAS token was used to access an Azure storage account from a public IP address (Preview)**

Storage.Blob_AccountSas.UnusualExternalAccess

**Description**: The alert indicates that someone with an external (public) IP address has accessed the storage account using an account SAS token. The access is highly unusual and considered suspicious, as access to the storage account using SAS tokens typically comes only from internal (private) IP addresses.
It's possible that a SAS token was leaked or generated by a malicious actor either from within your organization or externally to gain access to this storage account.
Applies to: Azure Blob (Standard general-purpose v2, Azure Data Lake Storage Gen2, or premium block blobs) storage accounts with the new Defender for Storage plan.

**[MITRE tactics](#mitre-attck-tactics)**: Exfiltration /  Resource Development / Impact

**Severity**: Low

### **Malicious file uploaded to storage account**

Storage.Blob_AM.MalwareFound

**Description**: The alert indicates that a malicious blob was uploaded to a storage account. This security alert is generated by the Malware Scanning feature in Defender for Storage.
Potential causes might include an intentional upload of malware by a threat actor or an unintentional upload of a malicious file by a legitimate user.
Applies to: Azure Blob (Standard general-purpose v2, Azure Data Lake Storage Gen2, or premium block blobs) storage accounts with the new Defender for Storage plan with the Malware Scanning feature enabled.

**[MITRE tactics](#mitre-attck-tactics)**: Lateral Movement

**Severity**: High

### **Malicious blob was downloaded from a storage account (Preview)**

Storage.Blob_MalwareDownload

**Description**: The alert indicates that a malicious blob was downloaded from a storage account. Potential causes might include malware that was uploaded to the storage account and not removed or quarantined, thereby enabling a threat actor to download it, or an unintentional download of the malware by legitimate users or applications.
Applies to: Azure Blob (Standard general-purpose v2, Azure Data Lake Storage Gen2 or premium block blobs) storage accounts with the new Defender for Storage plan with the Malware Scanning feature enabled.

**[MITRE tactics](#mitre-attck-tactics)**: Lateral Movement

**Severity**: High, if Eicar - low

## Alerts for Azure Cosmos DB

[Further details and notes](concept-defender-for-cosmos.md)

### **Access from a Tor exit node**

 (CosmosDB_TorAnomaly)

**Description**: This Azure Cosmos DB account was successfully accessed from an IP address known to be an active exit node of Tor, an anonymizing proxy. Authenticated access from a Tor exit node is a likely indication that a threat actor is trying to hide their identity.

**[MITRE tactics](#mitre-attck-tactics)**: Initial Access

**Severity**: High/Medium

### **Access from a suspicious IP**

(CosmosDB_SuspiciousIp)

**Description**: This Azure Cosmos DB account was successfully accessed from an IP address that was identified as a threat by Microsoft Threat Intelligence.

**[MITRE tactics](#mitre-attck-tactics)**: Initial Access

**Severity**: Medium

### **Access from an unusual location**

(CosmosDB_GeoAnomaly)

**Description**: This Azure Cosmos DB account was accessed from a location considered unfamiliar, based on the usual access pattern.

 Either a threat actor has gained access to the account, or a legitimate user has connected from a new or unusual geographic location

**[MITRE tactics](#mitre-attck-tactics)**: Initial Access

**Severity**: Low

### **Unusual volume of data extracted**

(CosmosDB_DataExfiltrationAnomaly)

**Description**: An unusually large volume of data has been extracted from this Azure Cosmos DB account. This might indicate that a threat actor exfiltrated data.

**[MITRE tactics](#mitre-attck-tactics)**: Exfiltration

**Severity**: Medium

### **Extraction of Azure Cosmos DB accounts keys via a potentially malicious script**

(CosmosDB_SuspiciousListKeys.MaliciousScript)

**Description**: A PowerShell script was run in your subscription and performed a suspicious pattern of key-listing operations to get the keys of Azure Cosmos DB accounts in your subscription. Threat actors use automated scripts, like Microburst, to list keys and find Azure Cosmos DB accounts they can access.

 This operation might indicate that an identity in your organization was breached, and that the threat actor is trying to compromise Azure Cosmos DB accounts in your environment for malicious intentions.

 Alternatively, a malicious insider could be trying to access sensitive data and perform lateral movement.

**[MITRE tactics](#mitre-attck-tactics)**: Collection

**Severity**: Medium

### **Suspicious extraction of Azure Cosmos DB account keys** (AzureCosmosDB_SuspiciousListKeys.SuspiciousPrincipal)

**Description**: A suspicious source extracted Azure Cosmos DB account access keys from your subscription. If this source is not a legitimate source, this might be a high impact issue. The access key that was extracted provides full control over the associated databases and the data stored within. See the details of each specific alert to understand why the source was flagged as suspicious.

**[MITRE tactics](#mitre-attck-tactics)**: Credential Access

**Severity**: high

### **SQL injection: potential data exfiltration**

(CosmosDB_SqlInjection.DataExfiltration)

**Description**: A suspicious SQL statement was used to query a container in this Azure Cosmos DB account.

 The injected statement might have succeeded in exfiltrating data that the threat actor isn't authorized to access.

 Due to the structure and capabilities of Azure Cosmos DB queries, many known SQL injection attacks on Azure Cosmos DB accounts can't work. However, the variation used in this attack might work and threat actors can exfiltrate data.

**[MITRE tactics](#mitre-attck-tactics)**: Exfiltration

**Severity**: Medium

### **SQL injection: fuzzing attempt**

(CosmosDB_SqlInjection.FailedFuzzingAttempt)

**Description**: A suspicious SQL statement was used to query a container in this Azure Cosmos DB account.

 Like other well-known SQL injection attacks, this attack won't succeed in compromising the Azure Cosmos DB account.

 Nevertheless, it's an indication that a threat actor is trying to attack the resources in this account, and your application might be compromised.

 Some SQL injection attacks can succeed and be used to exfiltrate data. This means that if the attacker continues performing SQL injection attempts, they might be able to compromise your Azure Cosmos DB account and exfiltrate data.

 You can prevent this threat by using parameterized queries.

**[MITRE tactics](#mitre-attck-tactics)**: Pre-attack

**Severity**: Low

## Alerts for Azure network layer

[Further details and notes](other-threat-protections.md#network-layer)

### **Network communication with a malicious machine detected**

(Network_CommunicationWithC2)

**Description**: Network traffic analysis indicates that your machine (IP %{Victim IP}) has communicated with what is possibly a Command and Control center. When the compromised resource is a load balancer or an application gateway, the suspected activity might indicate that one or more of the resources in the backend pool (of the load balancer or application gateway) has communicated with what is possibly a Command and Control center.

**[MITRE tactics](#mitre-attck-tactics)**: Command and Control

**Severity**: Medium

### **Possible compromised machine detected**

(Network_ResourceIpIndicatedAsMalicious)

**Description**: Threat intelligence indicates that your machine (at IP %{Machine IP}) might have been compromised by a malware of type Conficker. Conficker was a computer worm that targets the Microsoft Windows operating system and was first detected in November 2008. Conficker infected millions of computers including government, business and home computers in over 200 countries/regions, making it the largest known computer worm infection since the 2003 Welchia worm.

**[MITRE tactics](#mitre-attck-tactics)**: Command and Control

**Severity**: Medium

### **Possible incoming %{Service Name} brute force attempts detected**

(Generic_Incoming_BF_OneToOne)

**Description**: Network traffic analysis detected incoming %{Service Name} communication to %{Victim IP}, associated with your resource %{Compromised Host} from %{Attacker IP}. When the compromised resource is a load balancer or an application gateway, the suspected incoming traffic has been forwarded to one or more of the resources in the backend pool (of the load balancer or application gateway). Specifically, sampled network data shows suspicious activity between %{Start Time} and %{End Time} on port %{Victim Port}. This activity is consistent with brute force attempts against %{Service Name} servers.

**[MITRE tactics](#mitre-attck-tactics)**: PreAttack

**Severity**: Informational

### **Possible incoming SQL brute force attempts detected**

(SQL_Incoming_BF_OneToOne)

**Description**: Network traffic analysis detected incoming SQL communication to %{Victim IP}, associated with your resource %{Compromised Host}, from %{Attacker IP}. When the compromised resource is a load balancer or an application gateway, the suspected incoming traffic has been forwarded to one or more of the resources in the backend pool (of the load balancer or application gateway). Specifically, sampled network data shows suspicious activity between %{Start Time} and %{End Time} on port %{Port Number} (%{SQL Service Type}). This activity is consistent with brute force attempts against SQL servers.

**[MITRE tactics](#mitre-attck-tactics)**: PreAttack

**Severity**: Medium

### **Possible outgoing denial-of-service attack detected**

(DDOS)

**Description**: Network traffic analysis detected anomalous outgoing activity originating from %{Compromised Host}, a resource in your deployment. This activity might indicate that your resource was compromised and is now engaged in denial-of-service attacks against external endpoints. When the compromised resource is a load balancer or an application gateway, the suspected activity might indicate that one or more of the resources in the backend pool (of the load balancer or application gateway) was compromised. Based on the volume of connections, we believe that the following IPs are possibly the targets of the DOS attack: %{Possible Victims}.  Note that it is possible that the communication to some of these IPs is legitimate.

**[MITRE tactics](#mitre-attck-tactics)**: Impact

**Severity**: Medium

### **Suspicious incoming RDP network activity from multiple sources**

(RDP_Incoming_BF_ManyToOne)

**Description**: Network traffic analysis detected anomalous incoming Remote Desktop Protocol (RDP) communication to %{Victim IP}, associated with your resource %{Compromised Host}, from multiple sources. When the compromised resource is a load balancer or an application gateway, the suspected incoming traffic has been forwarded to one or more of the resources in the backend pool (of the load balancer or application gateway). Specifically, sampled network data shows %{Number of Attacking IPs} unique IPs connecting to your resource, which is considered abnormal for this environment. This activity might indicate an attempt to brute force your RDP end point from multiple hosts (Botnet).

**[MITRE tactics](#mitre-attck-tactics)**: PreAttack

**Severity**: Medium

### **Suspicious incoming RDP network activity**

(RDP_Incoming_BF_OneToOne)

**Description**: Network traffic analysis detected anomalous incoming Remote Desktop Protocol (RDP) communication to %{Victim IP}, associated with your resource %{Compromised Host}, from %{Attacker IP}. When the compromised resource is a load balancer or an application gateway, the suspected incoming traffic has been forwarded to one or more of the resources in the backend pool (of the load balancer or application gateway). Specifically, sampled network data shows %{Number of Connections} incoming connections to your resource, which is considered abnormal for this environment. This activity might indicate an attempt to brute force your RDP end point

**[MITRE tactics](#mitre-attck-tactics)**: PreAttack

**Severity**: Medium

### **Suspicious incoming SSH network activity from multiple sources**

(SSH_Incoming_BF_ManyToOne)

**Description**: Network traffic analysis detected anomalous incoming SSH communication to %{Victim IP}, associated with your resource %{Compromised Host}, from multiple sources. When the compromised resource is a load balancer or an application gateway, the suspected incoming traffic has been forwarded to one or more of the resources in the backend pool (of the load balancer or application gateway). Specifically, sampled network data shows %{Number of Attacking IPs} unique IPs connecting to your resource, which is considered abnormal for this environment. This activity might indicate an attempt to brute force your SSH end point from multiple hosts (Botnet)

**[MITRE tactics](#mitre-attck-tactics)**: PreAttack

**Severity**: Medium

### **Suspicious incoming SSH network activity**

(SSH_Incoming_BF_OneToOne)

**Description**: Network traffic analysis detected anomalous incoming SSH communication to %{Victim IP}, associated with your resource %{Compromised Host}, from %{Attacker IP}. When the compromised resource is a load balancer or an application gateway, the suspected incoming traffic has been forwarded to one or more of the resources in the backend pool (of the load balancer or application gateway). Specifically, sampled network data shows %{Number of Connections} incoming connections to your resource, which is considered abnormal for this environment. This activity might indicate an attempt to brute force your SSH end point

**[MITRE tactics](#mitre-attck-tactics)**: PreAttack

**Severity**: Medium

### **Suspicious outgoing %{Attacked Protocol} traffic detected**

(PortScanning)

**Description**: Network traffic analysis detected suspicious outgoing traffic from %{Compromised Host} to destination port %{Most Common Port}. When the compromised resource is a load balancer or an application gateway, the suspected outgoing traffic has been originated from to one or more of the resources in the backend pool (of the load balancer or application gateway). This behavior might indicate that your resource is taking part in %{Attacked Protocol} brute force attempts or port sweeping attacks.

**[MITRE tactics](#mitre-attck-tactics)**: Discovery

**Severity**: Medium

### **Suspicious outgoing RDP network activity to multiple destinations**

(RDP_Outgoing_BF_OneToMany)

**Description**: Network traffic analysis detected anomalous outgoing Remote Desktop Protocol (RDP) communication to multiple destinations originating from %{Compromised Host} (%{Attacker IP}), a resource in your deployment. When the compromised resource is a load balancer or an application gateway, the suspected outgoing traffic has been originated from to one or more of the resources in the backend pool (of the load balancer or application gateway). Specifically, sampled network data shows your machine connecting to %{Number of Attacked IPs} unique IPs, which is considered abnormal for this environment. This activity might indicate that your resource was compromised and is now used to brute force external RDP end points. Note that this type of activity could possibly cause your IP to be flagged as malicious by external entities.

**[MITRE tactics](#mitre-attck-tactics)**: Discovery

**Severity**: High

### **Suspicious outgoing RDP network activity**

(RDP_Outgoing_BF_OneToOne)

**Description**: Network traffic analysis detected anomalous outgoing Remote Desktop Protocol (RDP) communication to %{Victim IP} originating from %{Compromised Host} (%{Attacker IP}), a resource in your deployment. When the compromised resource is a load balancer or an application gateway, the suspected outgoing traffic has been originated from to one or more of the resources in the backend pool (of the load balancer or application gateway). Specifically, sampled network data shows %{Number of Connections} outgoing connections from your resource, which is considered abnormal for this environment. This activity might indicate that your machine was compromised and is now used to brute force external RDP end points. Note that this type of activity could possibly cause your IP to be flagged as malicious by external entities.

**[MITRE tactics](#mitre-attck-tactics)**: Lateral Movement

**Severity**: High

### **Suspicious outgoing SSH network activity to multiple destinations**

(SSH_Outgoing_BF_OneToMany)

**Description**: Network traffic analysis detected anomalous outgoing SSH communication to multiple destinations originating from %{Compromised Host} (%{Attacker IP}), a resource in your deployment. When the compromised resource is a load balancer or an application gateway, the suspected outgoing traffic has been originated from to one or more of the resources in the backend pool (of the load balancer or application gateway). Specifically, sampled network data shows your resource connecting to %{Number of Attacked IPs} unique IPs, which is considered abnormal for this environment. This activity might indicate that your resource was compromised and is now used to brute force external SSH end points. Note that this type of activity could possibly cause your IP to be flagged as malicious by external entities.

**[MITRE tactics](#mitre-attck-tactics)**: Discovery

**Severity**: Medium

### **Suspicious outgoing SSH network activity**

(SSH_Outgoing_BF_OneToOne)

**Description**: Network traffic analysis detected anomalous outgoing SSH communication to %{Victim IP} originating from %{Compromised Host} (%{Attacker IP}), a resource in your deployment. When the compromised resource is a load balancer or an application gateway, the suspected outgoing traffic has been originated from to one or more of the resources in the backend pool (of the load balancer or application gateway). Specifically, sampled network data shows %{Number of Connections} outgoing connections from your resource, which is considered abnormal for this environment. This activity might indicate that your resource was compromised and is now used to brute force external SSH end points. Note that this type of activity could possibly cause your IP to be flagged as malicious by external entities.

**[MITRE tactics](#mitre-attck-tactics)**: Lateral Movement

**Severity**: Medium

### **Traffic detected from IP addresses recommended for blocking**

(Network_TrafficFromUnrecommendedIP)

**Description**: Microsoft Defender for Cloud detected inbound traffic from IP addresses that are recommended to be blocked. This typically occurs when this IP address doesn't communicate regularly with this resource. Alternatively, the IP address has been flagged as malicious by Defender for Cloud's threat intelligence sources.

**[MITRE tactics](#mitre-attck-tactics)**: Probing

**Severity**: Informational

## Alerts for Azure Key Vault

[Further details and notes](defender-for-key-vault-introduction.md)

### **Access from a suspicious IP address to a key vault**

(KV_SuspiciousIPAccess)

**Description**: A key vault has been successfully accessed by an IP that has been identified by Microsoft Threat Intelligence as a suspicious IP address. This might indicate that your infrastructure has been compromised. We recommend further investigation. Learn more about [Microsoft's threat intelligence capabilities](https://go.microsoft.com/fwlink/?linkid=2128684).

**[MITRE tactics](#mitre-attck-tactics)**: Credential Access

**Severity**: Medium

### **Access from a TOR exit node to a key vault**

(KV_TORAccess)

**Description**: A key vault has been accessed from a known TOR exit node. This could be an indication that a threat actor has accessed the key vault and is using the TOR network to hide their source location. We recommend further investigations.

**[MITRE tactics](#mitre-attck-tactics)**: Credential Access

**Severity**: Medium

### **High volume of operations in a key vault**

(KV_OperationVolumeAnomaly)

**Description**: An anomalous number of key vault operations were performed by a user, service principal, and/or a specific key vault. This anomalous activity pattern might be legitimate, but it could be an indication that a threat actor has gained access to the key vault and the secrets contained within it. We recommend further investigations.

**[MITRE tactics](#mitre-attck-tactics)**: Credential Access

**Severity**: Medium

### **Suspicious policy change and secret query in a key vault**

(KV_PutGetAnomaly)

**Description**: A user or service principal has performed an anomalous Vault Put policy change operation followed by one or more Secret Get operations. This pattern is not normally performed by the specified user or service principal. This might be legitimate activity, but it could be an indication that a threat actor  has updated the key vault policy to access previously inaccessible secrets. We recommend further investigations.

**[MITRE tactics](#mitre-attck-tactics)**: Credential Access

**Severity**: Medium

### **Suspicious secret listing and query in a key vault**

(KV_ListGetAnomaly)

**Description**: A user or service principal has performed an anomalous Secret List operation followed by one or more Secret Get operations. This pattern is not normally performed by the specified user or service principal and is typically associated with secret dumping. This might be legitimate activity, but it could be an indication that a threat actor  has gained access to the key vault and is trying to discover secrets that can be used to move laterally through your network and/or gain access to sensitive resources. We recommend further investigations.

**[MITRE tactics](#mitre-attck-tactics)**: Credential Access

**Severity**: Medium

### **Unusual access denied - User accessing high volume of key vaults denied**

(KV_AccountVolumeAccessDeniedAnomaly)

**Description**: A user or service principal has attempted access to anomalously high volume of key vaults in the last 24 hours. This anomalous access pattern might be legitimate activity. Though this attempt was unsuccessful, it could be an indication of a possible attempt to gain access of key vault and the secrets contained within it. We recommend further investigations.

**[MITRE tactics](#mitre-attck-tactics)**: Discovery

**Severity**: Low

### **Unusual access denied - Unusual user accessing key vault denied**

(KV_UserAccessDeniedAnomaly)

**Description**: A key vault access was attempted by a user that does not normally access it, this anomalous access pattern might be legitimate activity. Though this attempt was unsuccessful, it could be an indication of a possible attempt to gain access of key vault and the secrets contained within it.

**[MITRE tactics](#mitre-attck-tactics)**: Initial Access, Discovery

**Severity**: Low

### **Unusual application accessed a key vault**

(KV_AppAnomaly)

**Description**: A key vault has been accessed by a service principal that doesn't normally access it. This anomalous access pattern might be legitimate activity, but it could be an indication that a threat actor  has gained access to the key vault in an attempt to access the secrets contained within it. We recommend further investigations.

**[MITRE tactics](#mitre-attck-tactics)**: Credential Access

**Severity**: Medium

### **Unusual operation pattern in a key vault**

(KV_OperationPatternAnomaly)

**Description**: An anomalous pattern of key vault operations was performed by a user, service principal, and/or a specific key vault. This anomalous activity pattern might be legitimate, but it could be an indication that a threat actor has gained access to the key vault and the secrets contained within it. We recommend further investigations.

**[MITRE tactics](#mitre-attck-tactics)**: Credential Access

**Severity**: Medium

### **Unusual user accessed a key vault**

(KV_UserAnomaly)

**Description**: A key vault has been accessed by a user that does not normally access it. This anomalous access pattern might be legitimate activity, but it could be an indication that a threat actor  has gained access to the key vault in an attempt to access the secrets contained within it. We recommend further investigations.

**[MITRE tactics](#mitre-attck-tactics)**: Credential Access

**Severity**: Medium

### **Unusual user-application pair accessed a key vault**

(KV_UserAppAnomaly)

**Description**: A key vault has been accessed by a user-service principal pair that doesn't normally access it. This anomalous access pattern might be legitimate activity, but it could be an indication that a threat actor  has gained access to the key vault in an attempt to access the secrets contained within it. We recommend further investigations.

**[MITRE tactics](#mitre-attck-tactics)**: Credential Access

**Severity**: Medium

### **User accessed high volume of key vaults**

(KV_AccountVolumeAnomaly)

**Description**: A user or service principal has accessed an anomalously high volume of key vaults. This anomalous access pattern might be legitimate activity, but it could be an indication that a threat actor  has gained access to multiple key vaults in an attempt to access the secrets contained within them. We recommend further investigations.

**[MITRE tactics](#mitre-attck-tactics)**: Credential Access

**Severity**: Medium

### **Denied access from a suspicious IP to a key vault**

(KV_SuspiciousIPAccessDenied)

**Description**: An unsuccessful key vault access has been attempted by an IP that has been identified by Microsoft Threat Intelligence as a suspicious IP address. Though this attempt was unsuccessful, it indicates that your infrastructure might have been compromised. We recommend further investigations.

**[MITRE tactics](#mitre-attck-tactics)**: Credential Access

**Severity**: Low

### **Unusual access to the key vault from a suspicious IP (Non-Microsoft or External)**

(KV_UnusualAccessSuspiciousIP)

**Description**: A user or service principal has attempted anomalous access to key vaults from a non-Microsoft IP in the last 24 hours. This anomalous access pattern might be legitimate activity. It could be an indication of a possible attempt to gain access of the key vault and the secrets contained within it. We recommend further investigations.

**[MITRE tactics](#mitre-attck-tactics)**: Credential Access

**Severity**: Medium

## Alerts for Azure DDoS Protection

[Further details and notes](other-threat-protections.md#azure-ddos)

### **DDoS Attack detected for Public IP**

(NETWORK_DDOS_DETECTED)

**Description**: DDoS Attack detected for Public IP (IP address) and being mitigated.

**[MITRE tactics](#mitre-attck-tactics)**: Probing

**Severity**: High

### **DDoS Attack mitigated for Public IP**

(NETWORK_DDOS_MITIGATED)

**Description**: DDoS Attack mitigated for Public IP (IP address).

**[MITRE tactics](#mitre-attck-tactics)**: Probing

**Severity**: Low

## Alerts for Defender for APIs

### **Suspicious population-level spike in API traffic to an API endpoint**

 (API_PopulationSpikeInAPITraffic)

**Description**: A suspicious spike in API traffic was detected at one of the API endpoints. The detection system used historical traffic patterns to establish a baseline for routine API traffic volume between all IPs and the endpoint, with the baseline being specific to API traffic for each status code (such as 200 Success). The detection system flagged an unusual deviation from this baseline leading to the detection of suspicious activity.

**[MITRE tactics](#mitre-attck-tactics)**: Impact

**Severity**: Medium

### **Suspicious spike in API traffic from a single IP address to an API endpoint**

 (API_SpikeInAPITraffic)

**Description**: A suspicious spike in API traffic was detected from a client IP to the API endpoint. The detection system used historical traffic patterns to establish a baseline for routine API traffic volume to the endpoint coming from a specific IP to the endpoint. The detection system flagged an unusual deviation from this baseline leading to the detection of suspicious activity.

**[MITRE tactics](#mitre-attck-tactics)**: Impact

**Severity**: Medium

### **Unusually large response payload transmitted between a single IP address and an API endpoint**

 (API_SpikeInPayload)

**Description**: A suspicious spike in API response payload size was observed for traffic between a single IP and one of the API endpoints. Based on historical traffic patterns from the last 30 days, Defender for APIs learns a baseline that represents the typical API response payload size between a specific IP and API endpoint. The learned baseline is specific to API traffic for each status code (for example, 200 Success). The alert was triggered because an API response payload size deviated significantly from the historical baseline.

**[MITRE tactics](#mitre-attck-tactics)**: Initial access

**Severity**: Medium

### **Unusually large request body transmitted between a single IP address and an API endpoint**

 (API_SpikeInPayload)

**Description**: A suspicious spike in API request body size was observed for traffic between a single IP and one of the API endpoints. Based on historical traffic patterns from the last 30 days, Defender for APIs learns a baseline that represents the typical API request body size between a specific IP and API endpoint. The learned baseline is specific to API traffic for each status code (for example, 200 Success). The alert was triggered because an API request size deviated significantly from the historical baseline.

**[MITRE tactics](#mitre-attck-tactics)**: Initial access

**Severity**: Medium

### **(Preview) Suspicious spike in latency for traffic between a single IP address and an API endpoint**

 (API_SpikeInLatency)

**Description**: A suspicious spike in latency was observed for traffic between a single IP and one of the API endpoints. Based on historical traffic patterns from the last 30 days, Defender for APIs learns a baseline that represents the routine API traffic latency between a specific IP and API endpoint. The learned baseline is specific to API traffic for each status code (for example, 200 Success). The alert was triggered because an API call latency deviated significantly from the historical baseline.

**[MITRE tactics](#mitre-attck-tactics)**: Initial access

**Severity**: Medium

### **API requests spray from a single IP address to an unusually large number of distinct API endpoints**

(API_SprayInRequests)

**Description**: A single IP was observed making API calls to an unusually large number of distinct endpoints. Based on historical traffic patterns from the last 30 days, Defenders for APIs learns a baseline that represents the typical number of distinct endpoints called by a single IP across 20-minute windows. The alert was triggered because a single IP's behavior deviated significantly from the historical baseline.

**[MITRE tactics](#mitre-attck-tactics)**: Discovery

**Severity**: Medium

### **Parameter enumeration on an API endpoint**

 (API_ParameterEnumeration)

**Description**: A single IP was observed enumerating parameters when accessing one of the API endpoints. Based on historical traffic patterns from the last 30 days, Defender for APIs learns a baseline that represents the typical number of distinct parameter values used by a single IP when accessing this endpoint across 20-minute windows. The alert was triggered because a single client IP recently accessed an endpoint using an unusually large number of distinct parameter values.

**[MITRE tactics](#mitre-attck-tactics)**: Initial access

**Severity**: Medium

### **Distributed parameter enumeration on an API endpoint**

 (API_DistributedParameterEnumeration)

**Description**: The aggregate user population (all IPs) was observed enumerating parameters when accessing one of the API endpoints. Based on historical traffic patterns from the last 30 days, Defender for APIs learns a baseline that represents the typical number of distinct parameter values used by the user population (all IPs) when accessing an endpoint across 20-minute windows. The alert was triggered because the user population recently accessed an endpoint using an unusually large number of distinct parameter values.

**[MITRE tactics](#mitre-attck-tactics)**: Initial access

**Severity**: Medium

### **Parameter value(s) with anomalous data types in an API call**

 (API_UnseenParamType)

**Description**: A single IP was observed accessing one of your API endpoints and using parameter values of a low probability data type (for example, string, integer, etc.). Based on historical traffic patterns from the last 30 days, Defender for APIs learns the expected data types for each API parameter. The alert was triggered because an IP recently accessed an endpoint using a previously low probability data type as a parameter input.

**[MITRE tactics](#mitre-attck-tactics)**: Impact

**Severity**: Medium

### **Previously unseen parameter used in an API call**

 (API_UnseenParam)

**Description**: A single IP was observed accessing one of the API endpoints using a previously unseen or out-of-bounds parameter in the request. Based on historical traffic patterns from the last 30 days, Defender for APIs learns a set of expected parameters associated with calls to an endpoint. The alert was triggered because an IP recently accessed an endpoint using a previously unseen parameter.

**[MITRE tactics](#mitre-attck-tactics)**: Impact

**Severity**: Medium

### **Access from a Tor exit node to an API endpoint**

 (API_AccessFromTorExitNode)

**Description**: An IP address from the Tor network accessed one of your API endpoints. Tor is a network that allows people to access the Internet while keeping their real IP hidden. Though there are legitimate uses, it is frequently used by attackers to hide their identity when they target people's systems online.

**[MITRE tactics](#mitre-attck-tactics)**: Pre-attack

**Severity**: Medium

### **API Endpoint access from suspicious IP**

 (API_AccessFromSuspiciousIP)

**Description**: An IP address accessing one of your API endpoints was identified by Microsoft Threat Intelligence as having a high probability of being a threat. While observing malicious Internet traffic, this IP came up as involved in attacking other online targets.

**[MITRE tactics](#mitre-attck-tactics)**: Pre-attack

**Severity**: High

### **Suspicious User Agent detected**

 (API_AccessFromSuspiciousUserAgent)

**Description**: The user agent of a request accessing one of your API endpoints contained anomalous values indicative of an attempt at remote code execution. This does not mean that any of your API endpoints have been breached, but it does suggest that an attempted attack is underway.

**[MITRE tactics](#mitre-attck-tactics)**: Execution

**Severity**: Medium

## Deprecated Defender for Containers alerts

The following lists include the Defender for Containers security alerts which were deprecated.

### **Manipulation of host firewall detected**

(K8S.NODE_FirewallDisabled)

**Description**: Analysis of processes running within a container or directly on a Kubernetes node, has detected a possible manipulation of the on-host firewall. Attackers will often disable this to exfiltrate data.

**[MITRE tactics](#mitre-attck-tactics)**: DefenseEvasion, Exfiltration

**Severity**: Medium

### **Suspicious use of DNS over HTTPS**

(K8S.NODE_SuspiciousDNSOverHttps)

**Description**: Analysis of processes running within a container or directly on a Kubernetes node, has detected the use of a DNS call over HTTPS in an uncommon fashion. This technique is used by attackers to hide calls out to suspect or malicious sites.

**[MITRE tactics](#mitre-attck-tactics)**: DefenseEvasion, Exfiltration

**Severity**: Medium

### **A possible connection to malicious location has been detected.**

(K8S.NODE_ThreatIntelCommandLineSuspectDomain)

**Description**: Analysis of processes running within a container or directly on a Kubernetes node, has detected a connection to a location that has been reported to be malicious or unusual. This is an indicator that a compromise might have occurred.

**[MITRE tactics](#mitre-attck-tactics)**: InitialAccess

**Severity**: Medium

### **Digital currency mining activity**

(K8S.NODE_CurrencyMining)

**Description**: Analysis of DNS transactions detected digital currency mining activity. Such activity, while possibly legitimate user behavior, is frequently performed by attackers following compromise of resources. Typical related attacker activity is likely to include the download and execution of common mining tools.

**[MITRE tactics](#mitre-attck-tactics)**: Exfiltration

**Severity**: Low

## Deprecated Defender for Servers Linux alerts

### VM_AbnormalDaemonTermination

**Alert Display Name**: Abnormal Termination

**Severity**: Low

### VM_BinaryGeneratedFromCommandLine

**Alert Display Name**: Suspicious binary detected

**Severity**: Medium

### VM_CommandlineSuspectDomain  Suspicious

**Alert Display Name**: domain name reference

**Severity**: Low

### VM_CommonBot

**Alert Display Name**: Behavior similar to common Linux bots detected

**Severity**: Medium

### VM_CompCommonBots

**Alert Display Name**: Commands similar to common Linux bots detected

**Severity**: Medium

### VM_CompSuspiciousScript

**Alert Display Name**: Shell Script Detected

**Severity**: Medium

### VM_CompTestRule

**Alert Display Name**: Composite Analytic Test Alert

**Severity**: Low

### VM_CronJobAccess

**Alert Display Name**: Manipulation of scheduled tasks detected

**Severity**: Informational

### VM_CryptoCoinMinerArtifacts

**Alert Display Name**: Process associated with digital currency mining detected

**Severity**: Medium

### VM_CryptoCoinMinerDownload

**Alert Display Name**: Possible Cryptocoinminer download detected

**Severity**: Medium

### VM_CryptoCoinMinerExecution

**Alert Display Name**: Potential crypto coin miner started

**Severity**: Medium

### VM_DataEgressArtifacts

**Alert Display Name**: Possible data exfiltration detected

**Severity**: Medium

### VM_DigitalCurrencyMining

**Alert Display Name**: Digital currency mining related behavior detected

**Severity**: High

### VM_DownloadAndRunCombo

**Alert Display Name**: Suspicious Download Then Run Activity

**Severity**: Medium

### VM_EICAR

**Alert Display Name**: Microsoft Defender for Cloud test alert (not a threat)

**Severity**: High

### VM_ExecuteHiddenFile

**Alert Display Name**: Execution of hidden file

**Severity**: Informational

### VM_ExploitAttempt

**Alert Display Name**: Possible command line exploitation attempt

**Severity**: Medium

### VM_ExposedDocker

**Alert Display Name**: Exposed Docker daemon on TCP socket

**Severity**: Medium

### VM_FairwareMalware

**Alert Display Name**: Behavior similar to Fairware ransomware detected

**Severity**: Medium

### VM_FirewallDisabled

**Alert Display Name**: Manipulation of host firewall detected

**Severity**: Medium

### VM_HadoopYarnExploit

**Alert Display Name**: Possible exploitation of Hadoop Yarn

**Severity**: Medium

### VM_HistoryFileCleared

**Alert Display Name**: A history file has been cleared

**Severity**: Medium

### VM_KnownLinuxAttackTool

**Alert Display Name**: Possible attack tool detected

**Severity**: Medium

### VM_KnownLinuxCredentialAccessTool

**Alert Display Name**: Possible credential access tool detected

**Severity**: Medium

### VM_KnownLinuxDDoSToolkit

**Alert Display Name**: Indicators associated with DDOS toolkit detected

**Severity**: Medium

### VM_KnownLinuxScreenshotTool

**Alert Display Name**: Screenshot taken on host

**Severity**: Low

### VM_LinuxBackdoorArtifact

**Alert Display Name**: Possible backdoor detected

**Severity**: Medium

### VM_LinuxReconnaissance

**Alert Display Name**: Local host reconnaissance detected

**Severity**: Medium

### VM_MismatchedScriptFeatures

**Alert Display Name**: Script extension mismatch detected

**Severity**: Medium

### VM_MitreCalderaTools

**Alert Display Name**: MITRE Caldera agent detected

**Severity**: Medium

### VM_NewSingleUserModeStartupScript

**Alert Display Name**: Detected Persistence Attempt

**Severity**: Medium

### VM_NewSudoerAccount

**Alert Display Name**: Account added to sudo group

**Severity**: Low

### VM_OverridingCommonFiles

**Alert Display Name**: Potential overriding of common files

**Severity**: Medium

### VM_PrivilegedContainerArtifacts

**Alert Display Name**: Container running in privileged mode

**Severity**: Low

### VM_PrivilegedExecutionInContainer

**Alert Display Name**: Command within a container running with high privileges

**Severity**: Low

### VM_ReadingHistoryFile

**Alert Display Name**: Unusual access to bash history file

**Severity**: Informational

### VM_ReverseShell

**Alert Display Name**: Potential reverse shell detected

**Severity**: Medium

### VM_SshKeyAccess

**Alert Display Name**: Process seen accessing the SSH authorized keys file in an unusual way

**Severity**: Low

### VM_SshKeyAddition

**Alert Display Name**: New SSH key added

**Severity**: Low

### VM_SuspectCompilation

**Alert Display Name**: Suspicious compilation detected

**Severity**: Medium

### VM_SuspectConnection

**Alert Display Name**: An uncommon connection attempt detected

**Severity**: Medium

### VM_SuspectDownload

**Alert Display Name**: Detected file download from a known malicious source

**Severity**: Medium

### VM_SuspectDownloadArtifacts

**Alert Display Name**: Detected suspicious file download

**Severity**: Low

### VM_SuspectExecutablePath

**Alert Display Name**: Executable found running from a suspicious location

**Severity**: Medium

### VM_SuspectHtaccessFileAccess

**Alert Display Name**: Access of htaccess file detected

**Severity**: Medium

### VM_SuspectInitialShellCommand

**Alert Display Name**: Suspicious first command in shell

**Severity**: Low

### VM_SuspectMixedCaseText

**Alert Display Name**: Detected anomalous mix of uppercase and lowercase characters in command line

**Severity**: Medium

### VM_SuspectNetworkConnection

**Alert Display Name**: Suspicious network connection

**Severity**: Informational

### VM_SuspectNohup

**Alert Display Name**: Detected suspicious use of the nohup command

**Severity**: Medium

### VM_SuspectPasswordChange

**Alert Display Name**: Possible password change using crypt-method detected

**Severity**: Medium

### VM_SuspectPasswordFileAccess

**Alert Display Name**: Suspicious password access

**Severity**: Informational

### VM_SuspectPhp

**Alert Display Name**: Suspicious PHP execution detected

**Severity**: Medium

### VM_SuspectPortForwarding

**Alert Display Name**: Potential port forwarding to external IP address

**Severity**: Medium

### VM_SuspectProcessAccountPrivilegeCombo

**Alert Display Name**: Process running in a service account became root unexpectedly

**Severity**: Medium

### VM_SuspectProcessTermination

**Alert Display Name**: Security-related process termination detected

**Severity**: Low

### VM_SuspectUserAddition

**Alert Display Name**: Detected suspicious use of the useradd command

**Severity**: Medium

### VM_SuspiciousCommandLineExecution

**Alert Display Name**: Suspicious command execution

**Severity**: High

### VM_SuspiciousDNSOverHttps

**Alert Display Name**: Suspicious use of DNS over HTTPS

**Severity**: Medium

### VM_SystemLogRemoval

**Alert Display Name**: Possible Log Tampering Activity Detected

**Severity**: Medium

### VM_ThreatIntelCommandLineSuspectDomain

**Alert Display Name**: A possible connection to malicious location has been detected

**Severity**: Medium

### VM_ThreatIntelSuspectLogon

**Alert Display Name**: A logon from a malicious IP has been detected

**Severity**: High

### VM_TimerServiceDisabled

**Alert Display Name**: Attempt to stop apt-daily-upgrade.timer service detected

**Severity**: Informational

### VM_TimestampTampering

**Alert Display Name**: Suspicious file timestamp modification

**Severity**: Low

### VM_Webshell

**Alert Display Name**: Possible malicious web shell detected

**Severity**: Medium

## Deprecated Defender for Servers Windows alerts

### SCUBA_MULTIPLEACCOUNTCREATE

**Alert Display Name**: Suspicious creation of accounts on multiple hosts

**Severity**: Medium

### SCUBA_PSINSIGHT_CONTEXT

**Alert Display Name**: Suspicious use of PowerShell detected

**Severity**: Informational

### SCUBA_RULE_AddGuestToAdministrators

**Alert Display Name**: Addition of Guest account to Local Administrators group

**Severity**: Medium

### SCUBA_RULE_Apache_Tomcat_executing_suspicious_commands

**Alert Display Name**: Apache_Tomcat_executing_suspicious_commands

**Severity**: Medium

### SCUBA_RULE_KnownBruteForcingTools

**Alert Display Name**: Suspicious process executed

**Severity**: High

### SCUBA_RULE_KnownCollectionTools

**Alert Display Name**: Suspicious process executed

**Severity**: High

### SCUBA_RULE_KnownDefenseEvasionTools

**Alert Display Name**: Suspicious process executed

**Severity**: High

### SCUBA_RULE_KnownExecutionTools

**Alert Display Name**: Suspicious process executed

**Severity**: High

### SCUBA_RULE_KnownPassTheHashTools

**Alert Display Name**: Suspicious process executed

**Severity**: High

### SCUBA_RULE_KnownSpammingTools

**Alert Display Name**: Suspicious process executed

**Severity**: Medium

### SCUBA_RULE_Lowering_Security_Settings

**Alert Display Name**: Detected the disabling of critical services

**Severity**: Medium

### SCUBA_RULE_OtherKnownHackerTools

**Alert Display Name**: Suspicious process executed

**Severity**: High

### SCUBA_RULE_RDP_session_hijacking_via_tscon

**Alert Display Name**: Suspect integrity level indicative of RDP hijacking

**Severity**: Medium

### SCUBA_RULE_RDP_session_hijacking_via_tscon_service

**Alert Display Name**: Suspect service installation

**Severity**: Medium

### SCUBA_RULE_Suppress_pesky_unauthorized_use_prohibited_notices

**Alert Display Name**: Detected suppression of legal notice displayed to users at logon

**Severity**: Low

### SCUBA_RULE_WDigest_Enabling

**Alert Display Name**: Detected enabling of the WDigest UseLogonCredential registry key

**Severity**: Medium

### VM.Windows_ApplockerBypass

**Alert Display Name**: Potential attempt to bypass AppLocker detected

**Severity**: High

### VM.Windows_BariumKnownSuspiciousProcessExecution

**Alert Display Name**: Detected suspicious file creation

**Severity**: High

### VM.Windows_Base64EncodedExecutableInCommandLineParams

**Alert Display Name**: Detected encoded executable in command line data

**Severity**: High

### VM.Windows_CalcsCommandLineUse

**Alert Display Name**: Detected suspicious use of Cacls to lower the security state of the system

**Severity**: Medium

### VM.Windows_CommandLineStartingAllExe

**Alert Display Name**: Detected suspicious command line used to start all executables in a directory

**Severity**: Medium

### VM.Windows_DisablingAndDeletingIISLogFiles

**Alert Display Name**: Detected actions indicative of disabling and deleting IIS log files

**Severity**: Medium

### VM.Windows_DownloadUsingCertutil

**Alert Display Name**: Suspicious download using Certutil detected

**Severity**: Medium

### VM.Windows_EchoOverPipeOnLocalhost

**Alert Display Name**: Detected suspicious named pipe communications

**Severity**: High

### VM.Windows_EchoToConstructPowerShellScript

**Alert Display Name**: Dynamic PowerShell script construction

**Severity**: Medium

### VM.Windows_ExecutableDecodedUsingCertutil

**Alert Display Name**: Detected decoding of an executable using built-in certutil.exe tool

**Severity**: Medium

### VM.Windows_FileDeletionIsSospisiousLocation

**Alert Display Name**: Suspicious file deletion detected

**Severity**: Medium

### VM.Windows_KerberosGoldenTicketAttack

**Alert Display Name**: Suspected Kerberos Golden Ticket attack parameters observed

**Severity**: Medium

### VM.Windows_KeygenToolKnownProcessName

**Alert Display Name**: Detected possible execution of keygen executable Suspicious process executed

**Severity**: Medium

### VM.Windows_KnownCredentialAccessTools

**Alert Display Name**: Suspicious process executed

**Severity**: High

### VM.Windows_KnownSuspiciousPowerShellScript

**Alert Display Name**: Suspicious use of PowerShell detected

**Severity**: High

### VM.Windows_KnownSuspiciousSoftwareInstallation

**Alert Display Name**: High risk software detected

**Severity**: Medium

### VM.Windows_MsHtaAndPowerShellCombination

**Alert Display Name**: Detected suspicious combination of HTA and PowerShell

**Severity**: Medium

### VM.Windows_MultipleAccountsQuery

**Alert Display Name**: Multiple Domain Accounts Queried

**Severity**: Medium

### VM.Windows_NewAccountCreation

**Alert Display Name**: Account creation detected

**Severity**: Informational

### VM.Windows_ObfuscatedCommandLine

**Alert Display Name**: Detected obfuscated command line.

**Severity**: High

### VM.Windows_PcaluaUseToLaunchExecutable

**Alert Display Name**: Detected suspicious use of Pcalua.exe to launch executable code

**Severity**: Medium

### VM.Windows_PetyaRansomware

**Alert Display Name**: Detected Petya ransomware indicators

**Severity**: High

### VM.Windows_PowerShellPowerSploitScriptExecution

**Alert Display Name**: Suspicious PowerShell cmdlets executed

**Severity**: Medium

### VM.Windows_RansomwareIndication

**Alert Display Name**: Ransomware indicators detected

**Severity**: High

### VM.Windows_SqlDumperUsedSuspiciously

**Alert Display Name**: Possible credential dumping detected [seen multiple times]

**Severity**: Medium

### VM.Windows_StopCriticalServices

**Alert Display Name**: Detected the disabling of critical services

**Severity**: Medium

### VM.Windows_SubvertingAccessibilityBinary

**Alert Display Name**: Sticky keys attack detected
 Suspicious account creation detected  Medium

### VM.Windows_SuspiciousAccountCreation

**Alert Display Name**: Suspicious Account Creation Detected

**Severity**: Medium

### VM.Windows_SuspiciousFirewallRuleAdded

**Alert Display Name**: Detected suspicious new firewall rule

**Severity**: Medium

### VM.Windows_SuspiciousFTPSSwitchUsage

**Alert Display Name**: Detected suspicious use of FTP -s switch

**Severity**: Medium

### VM.Windows_SuspiciousSQLActivity

**Alert Display Name**: Suspicious SQL activity

**Severity**: Medium

### VM.Windows_SVCHostFromInvalidPath

**Alert Display Name**: Suspicious process executed

**Severity**: High

### VM.Windows_SystemEventLogCleared

**Alert Display Name**: The Windows Security log was cleared

**Severity**: Informational

### VM.Windows_TelegramInstallation

**Alert Display Name**: Detected potentially suspicious use of Telegram tool

**Severity**: Medium

### VM.Windows_UndercoverProcess

**Alert Display Name**: Suspiciously named process detected

**Severity**: High

### VM.Windows_UserAccountControlBypass

**Alert Display Name**: Detected change to a registry key that can be abused to bypass UAC

**Severity**: Medium

### VM.Windows_VBScriptEncoding

**Alert Display Name**: Detected suspicious execution of VBScript.Encode command

**Severity**: Medium

### VM.Windows_WindowPositionRegisteryChange

**Alert Display Name**: Suspicious WindowPosition registry value detected

**Severity**: Low

### VM.Windows_ZincPortOpenningUsingFirewallRule

**Alert Display Name**: Malicious firewall rule created by ZINC server implant

**Severity**: High

### VM_DigitalCurrencyMining

**Alert Display Name**: Digital currency mining related behavior detected

**Severity**: High

### VM_MaliciousSQLActivity

**Alert Display Name**: Malicious SQL activity

**Severity**: High

### VM_ProcessWithDoubleExtensionExecution

**Alert Display Name**: Suspicious double extension file executed

**Severity**: High

### VM_RegistryPersistencyKey

**Alert Display Name**: Windows registry persistence method detected

**Severity**: Low

### VM_ShadowCopyDeletion

**Alert Display Name**: Suspicious Volume Shadow Copy Activity
 Executable found running from a suspicious location

**Severity**: High

### VM_SuspectExecutablePath

**Alert Display Name**: Executable found running from a suspicious location
 Detected anomalous mix of uppercase and lowercase characters in command line

**Severity**: Informational
  
 Medium

### VM_SuspectPhp

**Alert Display Name**: Suspicious PHP execution detected

**Severity**: Medium

### VM_SuspiciousCommandLineExecution

**Alert Display Name**: Suspicious command execution

**Severity**: High

### VM_SuspiciousScreenSaverExecution

**Alert Display Name**: Suspicious Screensaver process executed

**Severity**: Medium

### VM_SvcHostRunInRareServiceGroup

**Alert Display Name**: Rare SVCHOST service group executed

**Severity**: Informational

### VM_SystemProcessInAbnormalContext

**Alert Display Name**: Suspicious system process executed

**Severity**: Medium

### VM_ThreatIntelCommandLineSuspectDomain

**Alert Display Name**: A possible connection to malicious location has been detected

**Severity**: Medium

### VM_ThreatIntelSuspectLogon

**Alert Display Name**: A logon from a malicious IP has been detected

**Severity**: High

### VM_VbScriptHttpObjectAllocation

**Alert Display Name**: VBScript HTTP object allocation detected

**Severity**: High

### VM_TaskkillBurst

**Alert Display Name**: Suspicious process termination burst

**Severity**: Low

### VM_RunByPsExec

**Alert Display Name**: PsExec execution detected

**Severity**: Informational

## MITRE ATT&CK tactics

Understanding the intention of an attack can help you investigate and report the event more easily. To help with these efforts, Microsoft Defender for Cloud alerts include the MITRE tactics with many alerts.

The series of steps that describe the progression of a cyberattack from reconnaissance to data exfiltration is often referred to as a "kill chain".

Defender for Cloud's supported kill chain intents are based on [version 9 of the MITRE ATT&CK matrix](https://attack.mitre.org/versions/v9/) and described in the table below.

| Tactic                   | ATT&CK Version | Description                                                  |
| ------------------------ | -------------- | ------------------------------------------------------------ |
| **PreAttack**            |                | [PreAttack](https://attack.mitre.org/matrices/enterprise/pre/) could be either an attempt to access a certain resource regardless of a malicious intent, or a failed attempt to gain access to a target system to gather information prior to exploitation. This step is usually detected as an attempt, originating from outside the network, to scan the target system and identify an entry point. |
| **Initial Access**       | V7, V9         | Initial Access is the stage where an attacker manages to get a foothold on the attacked resource. This stage is relevant for compute hosts and resources such as user accounts, certificates etc. Threat actors will often be able to control the resource after this stage. |
| **Persistence**          | V7, V9         | Persistence is any access, action, or configuration change to a system that gives a threat actor a persistent presence on that system. Threat actors will often need to maintain access to systems through interruptions such as system restarts, loss of credentials, or other failures that would require a remote access tool to restart or provide an alternate backdoor for them to regain access. |
| **Privilege Escalation** | V7, V9         | Privilege escalation is the result of actions that allow an adversary to obtain a higher level of permissions on a system or network. Certain tools or actions require a higher level of privilege to work and are likely necessary at many points throughout an operation. User accounts with permissions to access specific systems or perform specific functions necessary for adversaries to achieve their objective might also be considered an escalation of privilege. |
| **Defense Evasion**      | V7, V9         | Defense evasion consists of techniques an adversary might use to evade detection or avoid other defenses. Sometimes these actions are the same as (or variations of) techniques in other categories that have the added benefit of subverting a particular defense or mitigation. |
| **Credential Access**    | V7, V9         | Credential access represents techniques resulting in access to or control over system, domain, or service credentials that are used within an enterprise environment. Adversaries will likely attempt to obtain legitimate credentials from users or administrator accounts (local system administrator or domain users with administrator access) to use within the network. With sufficient access within a network, an adversary can create accounts for later use within the environment. |
| **Discovery**            | V7, V9         | Discovery consists of techniques that allow the adversary to gain knowledge about the system and internal network. When adversaries gain access to a new system, they must orient themselves to what they now have control of and what benefits operating from that system give to their current objective or overall goals during the intrusion. The operating system provides many native tools that aid in this post-compromise information-gathering phase. |
| **LateralMovement**      | V7, V9         | Lateral movement consists of techniques that enable an adversary to access and control remote systems on a network and could, but does not necessarily, include execution of tools on remote systems. The lateral movement techniques could allow an adversary to gather information from a system without needing more tools, such as a remote access tool. An adversary can use lateral movement for many purposes, including remote Execution of tools, pivoting to more systems, access to specific information or files, access to more credentials, or to cause an effect. |
| **Execution**            | V7, V9         | The execution tactic represents techniques that result in execution of adversary-controlled code on a local or remote system. This tactic is often used in conjunction with lateral movement to expand access to remote systems on a network. |
| **Collection**           | V7, V9         | Collection consists of techniques used to identify and gather information, such as sensitive files, from a target network prior to exfiltration. This category also covers locations on a system or network where the adversary might look for information to exfiltrate. |
| **Command and Control**  | V7, V9         | The command and control tactic represents how adversaries communicate with systems under their control within a target network. |
| **Exfiltration**         | V7, V9         | Exfiltration refers to techniques and attributes that result or aid in the adversary removing files and information from a target network. This category also covers locations on a system or network where the adversary might look for information to exfiltrate. |
| **Impact**               | V7, V9         | Impact events primarily try to directly reduce the availability or integrity of a system, service, or network; including manipulation of data to impact a business or operational process. This would often refer to techniques such as ransomware, defacement, data manipulation, and others. |

> [!NOTE]
> For alerts that are in preview: [!INCLUDE [Legalese](../../includes/defender-for-cloud-preview-legal-text.md)]

## Next steps

- [Security alerts in Microsoft Defender for Cloud](alerts-overview.md)
- [Manage and respond to security alerts in Microsoft Defender for Cloud](managing-and-responding-alerts.md)
- [Continuously export Defender for Cloud data](continuous-export.md)
