---
title: Alerts for Linux machines
description: This article lists the security alerts for Linux machines visible in Microsoft Defender for Cloud.
ms.topic: reference
ms.custom: linux-related-content
ms.date: 06/03/2024
ai-usage: ai-assisted
---

# Alerts for Linux machines

This article lists the security alerts you might get for Linux machines from Microsoft Defender for Cloud and any Microsoft Defender plans you enabled. The alerts shown in your environment depend on the resources and services you're protecting, and your customized configuration.  

> [!NOTE]
> Some of the recently added alerts powered by Microsoft Defender Threat Intelligence and Microsoft Defender for Endpoint might be undocumented.

[Learn how to respond to these alerts](managing-and-responding-alerts.yml).

[Learn how to export alerts](continuous-export.md).

> [!NOTE]
> Alerts from different sources might take different amounts of time to appear. For example, alerts that require analysis of network traffic might take longer to appear than alerts related to suspicious processes running on virtual machines.

## Linux machines alerts

Microsoft Defender for Servers Plan 2 provides unique detections and alerts, in addition to the ones provided by Microsoft Defender for Endpoint. The alerts provided for Linux machines are:

[Further details and notes](defender-for-servers-introduction.md)

### **A history file has been cleared**

**Description**: Analysis of host data indicates that the command history log file has been cleared. Attackers might do this to cover their traces. The operation was performed by user: '%{user name}'.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: Medium

### **Adaptive application control policy violation was audited**

(VM_AdaptiveApplicationControlLinuxViolationAudited)

**Description**: The below users ran applications that are violating the application control policy of your organization on this machine. It can possibly expose the machine to malware or application vulnerabilities.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Execution

**Severity**: Informational

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

### **Behavior similar to ransomware detected [seen multiple times]**

**Description**: Analysis of host data on %{Compromised Host} detected the execution of files that have resemblance of known ransomware that can prevent users from accessing their system or personal files, and demands ransom payment in order to regain access. This behavior was seen [x] times today on the following machines: [Machine names]

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: High

### **Communication with suspicious domain identified by threat intelligence**

(AzureDNS_ThreatIntelSuspectDomain)

**Description**: Communication with suspicious domain was detected by analyzing DNS transactions from your resource and comparing against known malicious domains identified by threat intelligence feeds. Communication to malicious domains is frequently performed by attackers and could imply that your resource is compromised.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Initial Access, Persistence, Execution, Command And Control, Exploitation

**Severity**: Medium

### **Container with a miner image detected**

(VM_MinerInContainerImage)

**Description**: Machine logs indicate execution of a Docker container that runs an image associated with a digital currency mining.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Execution

**Severity**: High

### **Detected anomalous mix of upper and lower case characters in command line**

**Description**: Analysis of host data on %{Compromised Host} detected a command line with anomalous mix of upper and lower case characters. This kind of pattern, while possibly benign, is also typical of attackers trying to hide from case-sensitive or hash-based rule matching when performing administrative tasks on a compromised host.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: Medium

### **Detected file download from a known malicious source**

**Description**: Analysis of host data has detected the download of a file from a known malware source on %{Compromised Host}.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: Medium

### **Detected suspicious network activity**

**Description**: Analysis of network traffic from %{Compromised Host} detected suspicious network activity. Such traffic, while possibly benign, is typically used by an attacker to communicate with malicious servers for downloading of tools, command-and-control and exfiltration of data. Typical related attacker activity includes copying remote administration tools to a compromised host and exfiltrating user data from it.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: Low

### **Digital currency mining related behavior detected**

**Description**: Analysis of host data on %{Compromised Host} detected the execution of a process or command normally associated with digital currency mining.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: High

### **Disabling of auditd logging [seen multiple times]**

**Description**: The Linux Audit system provides a way to track security-relevant information on the system. It records as much information about the events that are happening on your system as possible. Disabling auditd logging could hamper discovering violations of security policies used on the system. This behavior was seen [x] times today on the following machines: [Machine names]

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: Low

### **Exploitation of Xorg vulnerability [seen multiple times]**

**Description**: Analysis of host data on %{Compromised Host} detected the user of Xorg with suspicious arguments. Attackers might use this technique in privilege escalation attempts. This behavior was seen [x] times today on the following machines: [Machine names]

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: Medium

### **Failed SSH brute force attack**

(VM_SshBruteForceFailed)

**Description**: Failed brute force attacks were detected from the following attackers: %{Attackers}. Attackers were trying to access the host with the following user names: %{Accounts used on failed sign in to host attempts}.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Probing

**Severity**: Medium

### **Fileless attack behavior detected**

(VM_FilelessAttackBehavior.Linux)

**Description**: The memory of the process specified below contains behaviors commonly used by fileless attacks.
Specific behaviors include: {list of observed behaviors}

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Execution

**Severity**: Low

### **Fileless attack technique detected**

(VM_FilelessAttackTechnique.Linux)

**Description**: The memory of the process specified below contains evidence of a fileless attack technique. Fileless attacks are used by attackers to execute code while evading detection by security software.
Specific behaviors include: {list of observed behaviors}

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Execution

**Severity**: High

### **Fileless attack toolkit detected**

(VM_FilelessAttackToolkit.Linux)

**Description**: The memory of the process specified below contains a fileless attack toolkit: {ToolKitName}. Fileless attack toolkits typically don't have a presence on the filesystem, making detection by traditional anti-virus software difficult.
Specific behaviors include: {list of observed behaviors}

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Defense Evasion, Execution

**Severity**: High

### **Hidden file execution detected**

**Description**: Analysis of host data indicates that a hidden file was executed by %{user name}. This activity could either be legitimate activity, or an indication of a compromised host.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: Informational

### **New SSH key added [seen multiple times]**

(VM_SshKeyAddition)

**Description**: A new SSH key was added to the authorized keys file. This behavior was seen [x] times today on the following machines: [Machine names]

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Persistence

**Severity**: Low

### **New SSH key added**

**Description**: A new SSH key was added to the authorized keys file.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: Low

### **Possible backdoor detected [seen multiple times]**

**Description**: Analysis of host data has detected a suspicious file being downloaded then run on %{Compromised Host} in your subscription. This activity has previously been associated with installation of a backdoor. This behavior was seen [x] times today on the following machines: [Machine names]

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: Medium

### **Possible exploitation of the mailserver detected**

(VM_MailserverExploitation )

**Description**: Analysis of host data on %{Compromised Host} detected an unusual execution under the mail server account

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Exploitation

**Severity**: Medium

### **Possible malicious web shell detected**

**Description**: Analysis of host data on %{Compromised Host} detected a possible web shell. Attackers will often upload a web shell to a machine they've compromised to gain persistence or for further exploitation.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: Medium

### **Possible password change using crypt-method detected [seen multiple times]**

**Description**: Analysis of host data on %{Compromised Host} detected password change using crypt method. Attackers can make this change to continue access and gaining persistence after compromise. This behavior was seen [x] times today on the following machines: [Machine names]

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: Medium

### **Process associated with digital currency mining detected [seen multiple times]**

**Description**: Analysis of host data on %{Compromised Host} detected the execution of a process normally associated with digital currency mining. This behavior was seen over 100 times today on the following machines: [Machine name]

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: Medium

### **Process associated with digital currency mining detected**

**Description**: Host data analysis detected the execution of a process that is normally associated with digital currency mining.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Exploitation, Execution

**Severity**: Medium

### **Python encoded downloader detected [seen multiple times]**

**Description**: Analysis of host data on %{Compromised Host} detected the execution of encoded Python that downloads and runs code from a remote location. This might be an indication of malicious activity. This behavior was seen [x] times today on the following machines: [Machine names]

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: Low

### **Screenshot taken on host [seen multiple times]**

**Description**: Analysis of host data on %{Compromised Host} detected the user of a screen capture tool. Attackers might use these tools to access private data. This behavior was seen [x] times today on the following machines: [Machine names]

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: Low

### **Shellcode detected [seen multiple times]**

**Description**: Analysis of host data on %{Compromised Host} detected shellcode being generated from the command line. This process could be legitimate activity, or an indication that one of your machines has been compromised. This behavior was seen [x] times today on the following machines: [Machine names]

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: Medium

### **Successful SSH brute force attack**

(VM_SshBruteForceSuccess)

**Description**: Analysis of host data has detected a successful brute force attack. The IP %{Attacker source IP} was seen making multiple login attempts. Successful logins were made from that IP with the following user(s): %{Accounts used to successfully sign in to host}. This means that the host might be compromised and controlled by a malicious actor.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Exploitation

**Severity**: High

### **Suspicious Account Creation Detected**

**Description**: Analysis of host data on %{Compromised Host} detected creation or use of a local account %{Suspicious account name} : this account name closely resembles a standard Windows account or group name '%{Similar To Account Name}'. This is potentially a rogue account created by an attacker, so named in order to avoid being noticed by a human administrator.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: Medium

### **Suspicious kernel module detected [seen multiple times]**

**Description**: Analysis of host data on %{Compromised Host} detected a shared object file being loaded as a kernel module. This could be legitimate activity, or an indication that one of your machines has been compromised. This behavior was seen [x] times today on the following machines: [Machine names]

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: Medium

### **Suspicious password access [seen multiple times]**

**Description**: Analysis of host data has detected suspicious access to encrypted user passwords on %{Compromised Host}. This behavior was seen [x] times today on the following machines: [Machine names]

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: Informational

### **Suspicious password access**

**Description**: Analysis of host data has detected suspicious access to encrypted user passwords on %{Compromised Host}.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: Informational

### **Suspicious request to the Kubernetes Dashboard**

(VM_KubernetesDashboard)

**Description**: Machine logs indicate that a suspicious request was made to the Kubernetes Dashboard. The request was sent from a Kubernetes node, possibly from one of the containers running in the node. Although this behavior can be intentional, it might indicate that the node is running a compromised container.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: LateralMovement

**Severity**: Medium

### **Unusual config reset in your virtual machine**

(VM_VMAccessUnusualConfigReset)

**Description**: An unusual config reset was detected in your virtual machine by analyzing the Azure Resource Manager operations in your subscription.
While this action might be legitimate, attackers can try utilizing VM Access extension to reset the configuration in your virtual machine and compromise it.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Credential Access

**Severity**: Medium

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

### **Suspicious installation of GPU extension in your virtual machine (Preview)**

 (VM_GPUDriverExtensionUnusualExecution)

**Description**: Suspicious installation of a GPU extension was detected in your virtual machine by analyzing the Azure Resource Manager operations in your subscription. Attackers might use the GPU driver extension to install GPU drivers on your virtual machine via the Azure Resource Manager to perform cryptojacking.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Impact

**Severity**: Low

> [!NOTE]
> For alerts that are in preview: [!INCLUDE [Legalese](../../includes/defender-for-cloud-preview-legal-text.md)]

## Next steps

- [Security alerts in Microsoft Defender for Cloud](alerts-overview.md)
- [Manage and respond to security alerts in Microsoft Defender for Cloud](managing-and-responding-alerts.yml)
- [Continuously export Defender for Cloud data](continuous-export.md)
