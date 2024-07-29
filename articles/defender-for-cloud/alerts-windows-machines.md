---
title: Alerts for Windows machines
description: This article lists the security alerts visible for Windows machines in Microsoft Defender for Cloud.
ms.topic: reference
ms.custom: linux-related-content
ms.date: 06/03/2024
ai-usage: ai-assisted
---

# Alerts for Windows machines

This article lists the security alerts you might get for Windows machines in Microsoft Defender for Cloud and any Microsoft Defender plans you enabled. The alerts shown in your environment depend on the resources and services you're protecting, and your customized configuration.  

[Learn how to respond to these alerts](managing-and-responding-alerts.yml).

[Learn how to export alerts](continuous-export.md).

## Windows machines alerts

Microsoft Defender for Servers Plan 2 provides unique detections and alerts, in addition to the ones provided by Microsoft Defender for Endpoint. The alerts provided for Windows machines are:

[Further details and notes](defender-for-servers-introduction.md)

### **A logon from a malicious IP has been detected. [seen multiple times]**

**Description**: A successful remote authentication for the account [account] and process [process] occurred, however the logon IP address (x.x.x.x) has previously been reported as malicious or highly unusual. A successful attack has probably occurred. Files with the .scr extensions are screen saver files and are normally reside and execute from the Windows system directory.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: High

### **Adaptive application control policy violation was audited**

VM_AdaptiveApplicationControlWindowsViolationAudited

**Description**: The below users ran applications that are violating the application control policy of your organization on this machine. It can possibly expose the machine to malware or application vulnerabilities.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Execution

**Severity**: Informational

### **Addition of Guest account to Local Administrators group**

**Description**: Analysis of host data has detected the addition of the built-in Guest account to the Local Administrators group on %{Compromised Host}, which is strongly associated with attacker activity.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: Medium

### **An event log was cleared**

**Description**: Machine logs indicate a suspicious event log clearing operation by user: '%{user name}' in Machine: '%{CompromisedEntity}'. The %{log channel} log was cleared.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: Informational

### **Antimalware Action Failed**

**Description**: Microsoft Antimalware has encountered an error when taking an action on malware or other potentially unwanted software.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: Medium

### **Antimalware Action Taken**

**Description**: Microsoft Antimalware for Azure has taken an action to protect this machine from malware or other potentially unwanted software.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: Medium

### **Antimalware broad files exclusion in your virtual machine**

(VM_AmBroadFilesExclusion)

**Description**: Files exclusion from antimalware extension with broad exclusion rule was detected in your virtual machine by analyzing the Azure Resource Manager operations in your subscription. Such exclusion practically disabling the Antimalware protection.
Attackers might exclude files from the antimalware scan on your virtual machine to prevent detection while running arbitrary code or infecting the machine with malware.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: Medium

### **Antimalware disabled and code execution in your virtual machine**

(VM_AmDisablementAndCodeExecution)

**Description**: Antimalware disabled at the same time as code execution on your virtual machine. This was detected by analyzing Azure Resource Manager operations in your subscription.
Attackers disable antimalware scanners to prevent detection while running unauthorized tools or infecting the machine with malware.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: High

### **Antimalware disabled in your virtual machine**

(VM_AmDisablement)

**Description**: Antimalware disabled in your virtual machine. This was detected by analyzing Azure Resource Manager operations in your subscription.
Attackers might disable the antimalware on your virtual machine to prevent detection.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Defense Evasion

**Severity**: Medium

### **Antimalware file exclusion and code execution in your virtual machine**

(VM_AmFileExclusionAndCodeExecution)

**Description**: File excluded from your antimalware scanner at the same time as code was executed via a custom script extension on your virtual machine. This was detected by analyzing Azure Resource Manager operations in your subscription.
Attackers might exclude files from the antimalware scan on your virtual machine to prevent detection while running unauthorized tools or infecting the machine with malware.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Defense Evasion, Execution

**Severity**: High

### **Antimalware file exclusion and code execution in your virtual machine (temporary)**

(VM_AmTempFileExclusionAndCodeExecution)

**Description**: Temporary file exclusion from antimalware extension in parallel to execution of code via custom script extension was detected in your virtual machine by analyzing the Azure Resource Manager operations in your subscription.
Attackers might exclude files from the antimalware scan on your virtual machine to prevent detection while running arbitrary code or infecting the machine with malware.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Defense Evasion, Execution

**Severity**: High

### **Antimalware file exclusion in your virtual machine**

(VM_AmTempFileExclusion)

**Description**: File excluded from your antimalware scanner on your virtual machine. This was detected by analyzing Azure Resource Manager operations in your subscription.
Attackers might exclude files from the antimalware scan on your virtual machine to prevent detection while running unauthorized tools or infecting the machine with malware.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Defense Evasion

**Severity**: Medium

### **Antimalware real-time protection was disabled in your virtual machine**

(VM_AmRealtimeProtectionDisabled)

**Description**: Real-time protection disablement of the antimalware extension was detected in your virtual machine by analyzing the Azure Resource Manager operations in your subscription.
Attackers might disable real-time protection from the antimalware scan on your virtual machine to avoid detection while running arbitrary code or infecting the machine with malware.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Defense Evasion

**Severity**: Medium

### **Antimalware real-time protection was disabled temporarily in your virtual machine**

(VM_AmTempRealtimeProtectionDisablement)

**Description**: Real-time protection temporary disablement of the antimalware extension was detected in your virtual machine by analyzing the Azure Resource Manager operations in your subscription.
Attackers might disable real-time protection from the antimalware scan on your virtual machine to avoid detection while running arbitrary code or infecting the machine with malware.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Defense Evasion

**Severity**: Medium

### **Antimalware real-time protection was disabled temporarily while code was executed in your virtual machine**

(VM_AmRealtimeProtectionDisablementAndCodeExec)

**Description**: Real-time protection temporary disablement of the antimalware extension in parallel to code execution via custom script extension was detected in your virtual machine by analyzing the Azure Resource Manager operations in your subscription.
Attackers might disable real-time protection from the antimalware scan on your virtual machine to avoid detection while running arbitrary code or infecting the machine with malware.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: High

### **Antimalware scans blocked for files potentially related to malware campaigns on your virtual machine (Preview)**

(VM_AmMalwareCampaignRelatedExclusion)

**Description**: An exclusion rule was detected in your virtual machine to prevent your antimalware extension scanning certain files that are suspected of being related to a malware campaign. The rule was detected by analyzing the Azure Resource Manager operations in your subscription. Attackers might exclude files from antimalware scans to prevent detection while running arbitrary code or infecting the machine with malware.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Defense Evasion

**Severity**: Medium

### **Antimalware temporarily disabled in your virtual machine**

(VM_AmTemporarilyDisablement)

**Description**: Antimalware temporarily disabled in your virtual machine. This was detected by analyzing Azure Resource Manager operations in your subscription.
Attackers might disable the antimalware on your virtual machine to prevent detection.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: Medium

### **Antimalware unusual file exclusion in your virtual machine**

(VM_UnusualAmFileExclusion)

**Description**: Unusual file exclusion from antimalware extension was detected in your virtual machine by analyzing the Azure Resource Manager operations in your subscription.
Attackers might exclude files from the antimalware scan on your virtual machine to prevent detection while running arbitrary code or infecting the machine with malware.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Defense Evasion

**Severity**: Medium

### **Communication with suspicious domain identified by threat intelligence**

(AzureDNS_ThreatIntelSuspectDomain)

**Description**: Communication with suspicious domain was detected by analyzing DNS transactions from your resource and comparing against known malicious domains identified by threat intelligence feeds. Communication to malicious domains is frequently performed by attackers and could imply that your resource is compromised.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Initial Access, Persistence, Execution, Command And Control, Exploitation

**Severity**: Medium

### **Detected actions indicative of disabling and deleting IIS log files**

**Description**: Analysis of host data detected actions that show IIS log files being disabled and/or deleted.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: Medium

### **Detected anomalous mix of upper and lower case characters in command-line**

**Description**: Analysis of host data on %{Compromised Host} detected a command line with anomalous mix of upper and lower case characters. This kind of pattern, while possibly benign, is also typical of attackers trying to hide from case-sensitive or hash-based rule matching when performing administrative tasks on a compromised host.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: Medium

### **Detected change to a registry key that can be abused to bypass UAC**

**Description**: Analysis of host data on %{Compromised Host} detected that a registry key that can be abused to bypass UAC (User Account Control) was changed. This kind of configuration, while possibly benign, is also typical of attacker activity when trying to move from unprivileged (standard user) to privileged (for example administrator) access on a compromised host.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: Medium

### **Detected decoding of an executable using built-in certutil.exe tool**

**Description**: Analysis of host data on %{Compromised Host} detected that certutil.exe, a built-in administrator utility, was being used to decode an executable instead of its mainstream purpose that relates to manipulating certificates and certificate data. Attackers are known to abuse functionality of legitimate administrator tools to perform malicious actions, for example using a tool such as certutil.exe to decode a malicious executable that will then be subsequently executed.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: High

### **Detected enabling of the WDigest UseLogonCredential registry key**

**Description**: Analysis of host data detected a change in the registry key HKLM\SYSTEM\ CurrentControlSet\Control\SecurityProviders\WDigest\ "UseLogonCredential". Specifically this key has been updated to allow logon credentials to be stored in clear text in LSA memory. Once enabled, an attacker can dump clear text passwords from LSA memory with credential harvesting tools such as Mimikatz.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: Medium

### **Detected encoded executable in command line data**

**Description**: Analysis of host data on %{Compromised Host} detected a base-64 encoded executable. This has previously been associated with attackers attempting to construct executables on-the-fly through a sequence of commands, and attempting to evade intrusion detection systems by ensuring that no individual command would trigger an alert. This could be legitimate activity, or an indication of a compromised host.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: High

### **Detected obfuscated command line**

**Description**: Attackers use increasingly complex obfuscation techniques to evade detections that run against the underlying data. Analysis of host data on %{Compromised Host} detected suspicious indicators of obfuscation on the commandline.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: Informational

### **Detected possible execution of keygen executable**

**Description**: Analysis of host data on %{Compromised Host} detected execution of a process whose name is indicative of a keygen tool; such tools are typically used to defeat software licensing mechanisms but their download is often bundled with other malicious software. Activity group GOLD has been known to make use of such keygens to covertly gain back door access to hosts that they compromise.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: Medium

### **Detected possible execution of malware dropper**

**Description**: Analysis of host data on %{Compromised Host} detected a filename that has previously been associated with one of activity group GOLD's methods of installing malware on a victim host.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: High

### **Detected possible local reconnaissance activity**

**Description**: Analysis of host data on %{Compromised Host} detected a combination of systeminfo commands that has previously been associated with one of activity group GOLD's methods of performing reconnaissance activity. While 'systeminfo.exe' is a legitimate Windows tool, executing it twice in succession in the way that has occurred here is rare.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: Low

### **Detected potentially suspicious use of Telegram tool**

**Description**: Analysis of host data shows installation of Telegram, a free cloud-based instant messaging service that exists both for mobile and desktop system. Attackers are known to abuse this service to transfer malicious binaries to any other computer, phone, or tablet.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: Medium

### **Detected suppression of legal notice displayed to users at logon**

**Description**: Analysis of host data on %{Compromised Host} detected changes to the registry key that controls whether a legal notice is displayed to users when they log on. Microsoft security analysis has determined that this is a common activity undertaken by attackers after having compromised a host.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: Low

### **Detected suspicious combination of HTA and PowerShell**

**Description**: mshta.exe (Microsoft HTML Application Host) which is a signed Microsoft binary is being used by the attackers to launch malicious PowerShell commands. Attackers often resort to having an HTA file with inline VBScript. When a victim browses to the HTA file and chooses to run it, the PowerShell commands and scripts that it contains are executed. Analysis of host data on %{Compromised Host} detected mshta.exe launching PowerShell commands.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: Medium

### **Detected suspicious commandline arguments**

**Description**: Analysis of host data on %{Compromised Host} detected suspicious commandline arguments that have been used in conjunction with a reverse shell used by activity group HYDROGEN.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: High

### **Detected suspicious commandline used to start all executables in a directory**

**Description**: Analysis of host data has detected a suspicious process running on %{Compromised Host}. The commandline indicates an attempt to start all executables (*.exe) that might reside in a directory. This could be an indication of a compromised host.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: Medium

### **Detected suspicious credentials in commandline**

**Description**: Analysis of host data on %{Compromised Host} detected a suspicious password being used to execute a file by activity group BORON. This activity group has been known to use this password to execute Pirpi malware on a victim host.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: High

### **Detected suspicious document credentials**

**Description**: Analysis of host data on %{Compromised Host} detected a suspicious, common precomputed password hash used by malware being used to execute a file. Activity group HYDROGEN has been known to use this password to execute malware on a victim host.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: High

### **Detected suspicious execution of VBScript.Encode command**

**Description**: Analysis of host data on %{Compromised Host} detected the execution of VBScript.Encode command. This encodes the scripts into unreadable text, making it more difficult for users to examine the code. Microsoft threat research shows that attackers often use encoded VBscript files as part of their attack to evade detection systems. This could be legitimate activity, or an indication of a compromised host.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: Medium

### **Detected suspicious execution via rundll32.exe**

**Description**: Analysis of host data on %{Compromised Host} detected rundll32.exe being used to execute a process with an uncommon name, consistent with the process naming scheme previously seen used by activity group GOLD when installing their first stage implant on a compromised host.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: High

### **Detected suspicious file cleanup commands**

**Description**: Analysis of host data on %{Compromised Host} detected a combination of systeminfo commands that has previously been associated with one of activity group GOLD's methods of performing post-compromise self-cleanup activity. While 'systeminfo.exe' is a legitimate Windows tool, executing it twice in succession, followed by a delete command in the way that has occurred here is rare.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: High

### **Detected suspicious file creation**

**Description**: Analysis of host data on %{Compromised Host} detected creation or execution of a process that has previously indicated post-compromise action taken on a victim host by activity group BARIUM. This activity group has been known to use this technique to download more malware to a compromised host after an attachment in a phishing doc has been opened.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: High

### **Detected suspicious named pipe communications**

**Description**: Analysis of host data on %{Compromised Host} detected data being written to a local named pipe from a Windows console command. Named pipes are known to be a channel used by attackers to task and communicate with a malicious implant. This could be legitimate activity, or an indication of a compromised host.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: High

### **Detected suspicious network activity**

**Description**: Analysis of network traffic from %{Compromised Host} detected suspicious network activity. Such traffic, while possibly benign, is typically used by an attacker to communicate with malicious servers for downloading of tools, command-and-control and exfiltration of data. Typical related attacker activity includes copying remote administration tools to a compromised host and exfiltrating user data from it.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: Low

### **Detected suspicious new firewall rule**

**Description**: Analysis of host data detected a new firewall rule has been added via netsh.exe to allow traffic from an executable in a suspicious location.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: Medium

### **Detected suspicious use of Cacls to lower the security state of the system**

**Description**: Attackers use myriad ways like brute force, spear phishing etc. to achieve initial compromise and get a foothold on the network. Once initial compromise is achieved they often take steps to lower the security settings of a system. Caclsâ€”short for change access control list is Microsoft Windows native command-line utility often used for modifying the security permission on folders and files. A lot of time the binary is used by the attackers to lower the security settings of a system. This is done by giving Everyone full access to some of the system binaries like ftp.exe, net.exe, wscript.exe etc. Analysis of host data on %{Compromised Host} detected suspicious use of Cacls to lower the security of a system.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: Medium

### **Detected suspicious use of FTP -s Switch**

**Description**: Analysis of process creation data from the %{Compromised Host} detected the use of the FTP "-s:filename" switch. This switch is used to specify an FTP script file for the client to run. Malware or malicious processes are known to use this FTP switch (-s:filename) to point to a script file, which is configured to connect to a remote FTP server and download more malicious binaries.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: Medium

### **Detected suspicious use of Pcalua.exe to launch executable code**

**Description**: Analysis of host data on %{Compromised Host} detected the use of pcalua.exe to launch executable code. Pcalua.exe is component of the Microsoft Windows "Program Compatibility Assistant", which detects compatibility issues during the installation or execution of a program. Attackers are known to abuse functionality of legitimate Windows system tools to perform malicious actions, for example using pcalua.exe with the -a switch to launch malicious executables either locally or from remote shares.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: Medium

### **Detected the disabling of critical services**

**Description**: The analysis of host data on %{Compromised Host} detected execution of "net.exe stop" command being used to stop critical services like SharedAccess or the Windows Security app. The stopping of either of these services can be indication of a malicious behavior.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: Medium

### **Digital currency mining related behavior detected**

**Description**: Analysis of host data on %{Compromised Host} detected the execution of a process or command normally associated with digital currency mining.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: High

### **Dynamic PS script construction**

**Description**: Analysis of host data on %{Compromised Host} detected a PowerShell script being constructed dynamically. Attackers sometimes use this approach of progressively building up a script in order to evade IDS systems. This could be legitimate activity, or an indication that one of your machines has been compromised.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: Medium

### **Executable found running from a suspicious location**

**Description**: Analysis of host data detected an executable file on %{Compromised Host} that is running from a location in common with known suspicious files. This executable could either be legitimate activity, or an indication of a compromised host.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: High

### **Fileless attack behavior detected**

(VM_FilelessAttackBehavior.Windows)

**Description**: The memory of the process specified contains behaviors commonly used by fileless attacks. Specific behaviors include:

1) Shellcode, which is a small piece of code typically used as the payload in the exploitation of a software vulnerability.
2) Active network connections. See NetworkConnections below for details.
3) Function calls to security sensitive operating system interfaces. See Capabilities below for referenced OS capabilities.
4) Contains a thread that was started in a dynamically allocated code segment. This is a common pattern for process injection attacks.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Defense Evasion

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

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Defense Evasion, Execution

**Severity**: High

### **Fileless attack toolkit detected**

(VM_FilelessAttackToolkit.Windows)

**Description**: The memory of the process specified contains a fileless attack toolkit: [toolkit name]. Fileless attack toolkits use techniques that minimize or eliminate traces of malware on disk, and greatly reduce the chances of detection by disk-based malware scanning solutions. Specific behaviors include:

1) Well-known toolkits and crypto mining software.
2) Shellcode, which is a small piece of code typically used as the payload in the exploitation of a software vulnerability.
3) Injected malicious executable in process memory.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Defense Evasion, Execution

**Severity**: Medium

### **High risk software detected**

**Description**: Analysis of host data from %{Compromised Host} detected the usage of software that has been associated with the installation of malware in the past. A common technique utilized in the distribution of malicious software is to package it within otherwise benign tools such as the one seen in this alert. When you use these tools, the malware can be silently installed in the background.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: Medium

### **Local Administrators group members were enumerated**

**Description**: Machine logs indicate a successful enumeration on group %{Enumerated Group Domain Name}\%{Enumerated Group Name}. Specifically, %{Enumerating User Domain Name}\%{Enumerating User Name} remotely enumerated the members of the %{Enumerated Group Domain Name}\%{Enumerated Group Name} group. This activity could either be legitimate activity, or an indication that a machine in your organization has been compromised and used to reconnaissance %{vmname}.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: Informational

### **Malicious firewall rule created by ZINC server implant [seen multiple times]**

**Description**: A firewall rule was created using techniques that match a known actor, ZINC. The rule was possibly used to open a port on %{Compromised Host} to allow for Command & Control communications. This behavior was seen [x] times today on the following machines: [Machine names]

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: High

### **Malicious SQL activity**

**Description**: Machine logs indicate that '%{process name}' was executed by account: %{user name}. This activity is considered malicious.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: High

### **Multiple Domain Accounts Queried**

**Description**: Analysis of host data has determined that an unusual number of distinct domain accounts are being queried within a short time period from %{Compromised Host}. This kind of activity could be legitimate, but can also be an indication of compromise.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: Medium

### **Possible credential dumping detected [seen multiple times]**

**Description**: Analysis of host data has detected use of native windows tool (for example, sqldumper.exe) being used in a way that allows to extract credentials from memory. Attackers often use these techniques to extract credentials that they then further use for lateral movement and privilege escalation. This behavior was seen [x] times today on the following machines: [Machine names]

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: Medium

### **Potential attempt to bypass AppLocker detected**

**Description**: Analysis of host data on %{Compromised Host} detected a potential attempt to bypass AppLocker restrictions. AppLocker can be configured to implement a policy that limits what executables are allowed to run on a Windows system. The command-line pattern similar to that identified in this alert has been previously associated with attacker attempts to circumvent AppLocker policy by using trusted executables (allowed by AppLocker policy) to execute untrusted code. This could be legitimate activity, or an indication of a compromised host.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: High

### **Rare SVCHOST service group executed**

(VM_SvcHostRunInRareServiceGroup)

**Description**: The system process SVCHOST was observed running a rare service group. Malware often uses SVCHOST to masquerade its malicious activity.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Defense Evasion, Execution

**Severity**: Informational

### **Sticky keys attack detected**

**Description**: Analysis of host data indicates that an attacker might be subverting an accessibility binary (for example sticky keys, onscreen keyboard, narrator) in order to provide backdoor access to the host %{Compromised Host}.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: Medium

### **Successful brute force attack**

(VM_LoginBruteForceSuccess)

**Description**: Several sign in attempts were detected from the same source. Some successfully authenticated to the host.
This resembles a burst attack, in which an attacker performs numerous authentication attempts to find valid account credentials.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Exploitation

**Severity**: Medium/High

### **Suspect integrity level indicative of RDP hijacking**

**Description**: Analysis of host data has detected the tscon.exe running with SYSTEM privileges - this can be indicative of an attacker abusing this binary in order to switch context to any other logged on user on this host; it's a known attacker technique to compromise more user accounts and move laterally across a network.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: Medium

### **Suspect service installation**

**Description**: Analysis of host data has detected the installation of tscon.exe as a service: this binary being started as a service potentially allows an attacker to trivially switch to any other logged on user on this host by hijacking RDP connections; it's a known attacker technique to compromise more user accounts and move laterally across a network.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: Medium

### **Suspected Kerberos Golden Ticket attack parameters observed**

**Description**: Analysis of host data detected commandline parameters consistent with a Kerberos Golden Ticket attack.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: Medium

### **Suspicious Account Creation Detected**

**Description**: Analysis of host data on %{Compromised Host} detected creation or use of a local account %{Suspicious account name} : this account name closely resembles a standard Windows account or group name '%{Similar To Account Name}'. This is potentially a rogue account created by an attacker, so named in order to avoid being noticed by a human administrator.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: Medium

### **Suspicious Activity Detected**

(VM_SuspiciousActivity)

**Description**: Analysis of host data has detected a sequence of one or more processes running on %{machine name} that have historically been associated with malicious activity. While individual commands might appear benign the alert is scored based on an aggregation of these commands. This could either be legitimate activity, or an indication of a compromised host.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Execution

**Severity**: Medium

### **Suspicious authentication activity**

(VM_LoginBruteForceValidUserFailed)

**Description**: Although none of them succeeded, some of them used accounts were recognized by the host. This resembles a dictionary attack, in which an attacker performs numerous authentication attempts using a dictionary of predefined account names and passwords in order to find valid credentials to access the host. This indicates that some of your host account names might exist in a well-known account name dictionary.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Probing

**Severity**: Medium

### **Suspicious code segment detected**

**Description**: Indicates that a code segment has been allocated by using non-standard methods, such as reflective injection and process hollowing. The alert provides more characteristics of the code segment that have been processed to provide context for the capabilities and behaviors of the reported code segment.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: Medium

### **Suspicious double extension file executed**

**Description**: Analysis of host data indicates an execution of a process with a suspicious double extension. This extension might trick users into thinking files are safe to be opened and might indicate the presence of malware on the system.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: High

### **Suspicious download using Certutil detected [seen multiple times]**

**Description**: Analysis of host data on %{Compromised Host} detected the use of certutil.exe, a built-in administrator utility, for the download of a binary instead of its mainstream purpose that relates to manipulating certificates and certificate data. Attackers are known to abuse functionality of legitimate administrator tools to perform malicious actions, for example using certutil.exe to download and decode a malicious executable that will then be subsequently executed. This behavior was seen [x] times today on the following machines: [Machine names]

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: Medium

### **Suspicious download using Certutil detected**

**Description**: Analysis of host data on %{Compromised Host} detected the use of certutil.exe, a built-in administrator utility, for the download of a binary instead of its mainstream purpose that relates to manipulating certificates and certificate data. Attackers are known to abuse functionality of legitimate administrator tools to perform malicious actions, for example using certutil.exe to download and decode a malicious executable that will then be subsequently executed.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: Medium

### **Suspicious PowerShell Activity Detected**

**Description**: Analysis of host data detected a PowerShell script running on %{Compromised Host} that has features in common with known suspicious scripts. This script could either be legitimate activity, or an indication of a compromised host.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: High

### **Suspicious PowerShell cmdlets executed**

**Description**: Analysis of host data indicates execution of known malicious PowerShell PowerSploit cmdlets.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: Medium

### **Suspicious process executed [seen multiple times]**

**Description**: Machine logs indicate that the suspicious process: '%{Suspicious Process}' was running on the machine, often associated with attacker attempts to access credentials. This behavior was seen [x] times today on the following machines: [Machine names]

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: High

### **Suspicious process executed**

**Description**: Machine logs indicate that the suspicious process: '%{Suspicious Process}' was running on the machine, often associated with attacker attempts to access credentials.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: High

### **Suspicious process name detected [seen multiple times]**

**Description**: Analysis of host data on %{Compromised Host} detected a process whose name is suspicious, for example corresponding to a known attacker tool or named in a way that is suggestive of attacker tools that try to hide in plain sight. This process could be legitimate activity, or an indication that one of your machines has been compromised. This behavior was seen [x] times today on the following machines: [Machine names]

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: Medium

### **Suspicious process name detected**

**Description**: Analysis of host data on %{Compromised Host} detected a process whose name is suspicious, for example corresponding to a known attacker tool or named in a way that is suggestive of attacker tools that try to hide in plain sight. This process could be legitimate activity, or an indication that one of your machines has been compromised.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: Medium

### **Suspicious SQL activity**

**Description**: Machine logs indicate that '%{process name}' was executed by account: %{user name}. This activity is uncommon with this account.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: Medium

### **Suspicious SVCHOST process executed**

**Description**: The system process SVCHOST was observed running in an abnormal context. Malware often uses SVCHOST to masquerade its malicious activity.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: High

### **Suspicious system process executed**

(VM_SystemProcessInAbnormalContext)

**Description**: The system process %{process name} was observed running in an abnormal context. Malware often uses this process name to masquerade its malicious activity.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Defense Evasion, Execution

**Severity**: High

### **Suspicious Volume Shadow Copy Activity**

**Description**: Analysis of host data has detected a shadow copy deletion activity on the resource. Volume Shadow Copy (VSC) is an important artifact that stores data snapshots. Some malware and specifically Ransomware, targets VSC to sabotage backup strategies.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: High

### **Suspicious WindowPosition registry value detected**

**Description**: Analysis of host data on %{Compromised Host} detected an attempted WindowPosition registry configuration change that could be indicative of hiding application windows in nonvisible sections of the desktop. This could be legitimate activity, or an indication of a compromised machine: this type of activity has been previously associated with known adware (or unwanted software) such as Win32/OneSystemCare and Win32/SystemHealer and malware such as Win32/Creprote. When the WindowPosition value is set to 201329664, (Hex: 0x0c00 0c00, corresponding to X-axis=0c00 and the Y-axis=0c00) this places the console app's window in a non-visible section of the user's screen in an area that is hidden from view below the visible start menu/taskbar. Known suspect Hex value includes, but not limited to c000c000.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: Low

### **Suspiciously named process detected**

**Description**: Analysis of host data on %{Compromised Host} detected a process whose name is very similar to but different from a very commonly run process (%{Similar To Process Name}). While this process could be benign attackers are known to sometimes hide in plain sight by naming their malicious tools to resemble legitimate process names.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: Medium

### **Unusual config reset in your virtual machine**

(VM_VMAccessUnusualConfigReset)

**Description**: An unusual config reset was detected in your virtual machine by analyzing the Azure Resource Manager operations in your subscription.
While this action might be legitimate, attackers can try utilizing VM Access extension to reset the configuration in your virtual machine and compromise it.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Credential Access

**Severity**: Medium

### **Unusual process execution detected**

**Description**: Analysis of host data on %{Compromised Host} detected the execution of a process by %{User Name} that was unusual. Accounts such as %{User Name} tend to perform a limited set of operations, this execution was determined to be out of character and might be suspicious.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: High

### **Unusual user password reset in your virtual machine**

(VM_VMAccessUnusualPasswordReset)

**Description**: An unusual user password reset was detected in your virtual machine by analyzing the Azure Resource Manager operations in your subscription.
While this action might be legitimate, attackers can try utilizing the VM Access extension to reset the credentials of a local user in your virtual machine and compromise it.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Credential Access

**Severity**: Medium

### **Unusual user SSH key reset in your virtual machine**

(VM_VMAccessUnusualSSHReset)

**Description**: An unusual user SSH key reset was detected in your virtual machine by analyzing the Azure Resource Manager operations in your subscription.
While this action might be legitimate, attackers can try utilizing VM Access extension to reset SSH key of a user account in your virtual machine and compromise it.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Credential Access

**Severity**: Medium

### **VBScript HTTP object allocation detected**

**Description**: Creation of a VBScript file using Command Prompt has been detected. The following script contains HTTP object allocation command. This action can be used to download malicious files.

### **Suspicious installation of GPU extension in your virtual machine (Preview)**

 (VM_GPUDriverExtensionUnusualExecution)

**Description**: Suspicious installation of a GPU extension was detected in your virtual machine by analyzing the Azure Resource Manager operations in your subscription. Attackers might use the GPU driver extension to install GPU drivers on your virtual machine via the Azure Resource Manager to perform cryptojacking.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Impact

**Severity**: Low

### **AzureHound tool invocation detected**

(ARM_AzureHound)

**Description**: AzureHound was run in your subscription and performed information gathering operations to enumerate resources. Threat actors use automated tools, like AzureHound, to enumerate resources and use them to access sensitive data or perform lateral movement. This was detected by analyzing Azure Resource Manager operations in your subscription. This operation might indicate that an identity in your organization was breached, and that the threat actor is trying to compromise your environment.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Discovery

**Severity**: Medium

> [!NOTE]
> For alerts that are in preview: [!INCLUDE [Legalese](../../includes/defender-for-cloud-preview-legal-text.md)]

## Next steps

- [Security alerts in Microsoft Defender for Cloud](alerts-overview.md)
- [Manage and respond to security alerts in Microsoft Defender for Cloud](managing-and-responding-alerts.yml)
- [Continuously export Defender for Cloud data](continuous-export.md)
