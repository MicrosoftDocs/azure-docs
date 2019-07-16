---
title: Threat detection for VMs & servers in Azure Security Center | Microsoft Docs
description: This topic presents the VM and server alerts available in Azure Security Center.
services: security-center
documentationcenter: na
author: monhaber
manager: rkarlin
editor: ''

ms.assetid: dd2eb069-4c76-4154-96bb-6e6ae553ef46
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date:  7/02/2019
ms.author: v-monhabe

---
# Threat detection for VMs & servers in Azure Security Center

This topic presents the different types of detection methods and alerts available for VMs and Servers with the following operation systems. 
For a list of supported versions, see [Platforms and features supported by Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-os-coverage).

* [Windows](#windows-machines)
* [Linux](#linux-machines)

## Windows <a name="windows-machines"></a>

Security Center integrates with Azure services to monitor and protect your Windows-based machines.  Security Center presents the alerts and remediation suggestions from all of these services in an easy-to-use format.

### Microsoft Server Defender ATP <a nanme="windows-atp"></a>

Azure Security Center extends its Cloud Workload Protection Platforms by integrating with Windows Defender Advanced Threat Protection (ATP). This provides comprehensive Endpoint Detection and Response (EDR) capabilities.

> [!NOTE]
> Windows Server Defender ATP sensor is automatically enabled on Windows Servers that are onboarded to Azure Security Center.

When Windows Server Defender ATP detects a threat, it triggers an alert. The alert is shown on the Security Center dashboard. From the dashboard, you can pivot to the Windows Defender ATP console to perform a detailed investigation to uncover the scope of the attack. For more information about Windows Server Defender ATP, see [Onboard servers to the Windows Defender ATP service](https://docs.microsoft.com/windows/security/threat-protection/microsoft-defender-atp/configure-server-endpoints).

### Crash Dump Analysis <a nanme="windows-dump"></a>

When software crashes, a crash dump captures a portion of memory at the time of the crash.

A crash may have been caused by malware or contain malware. To avoid being detected by security products, various forms of malware use a fileless attack, which avoids writing to disk or encrypting software components written to disk. This type of attack is difficult to detect by using traditional disk-based approaches.

However, this kind of attack can be detected by using memory analysis. By analyzing the memory in the crash dump, Security Center can detect the techniques the attack is using to exploit vulnerabilities in the software, access confidential data, and surreptitiously persist within a compromised machine. This is done by the Security Center back end with minimum performance impact to hosts.

> [!div class="mx-tableFixed"]

|Alert|Description|
|---|---|
|**Code injection discovered**|Code injection is the insertion of executable modules into running processes or threads. This technique is used by malware to access data, while successfully hiding itself to prevent being found and removed. <br/>This alert indicates that an injected module is present in the crash dump. To differentiate between malicious and non-malicious injected modules, Security Center checks whether the injected module conforms to a profile of suspicious behavior.|
|**Suspicious code segment discovered**|Indicates that a code segment has been allocated using non-standard methods, such as reflective injection and process hollowing. The alert provides additional characteristics of the code segment that have been processed to provide context for the capabilities and behaviors of the reported code segment.|
|**Shellcode discovered**|Shellcode is the payload that is run after malware exploits a software vulnerability.<br/>This alert indicates that crash dump analysis has detected executable code that exhibits behavior commonly performed by malicious payloads. Although non-malicious software may also perform this behavior, it is not typical of normal software development practices.|

### Fileless Attack Detection <a nanme="windows-fileless"></a>

In Azure, we regularly see fileless attacks targeting our customers’ endpoints.

To avoid detection, fileless attacks inject malicious payloads into memory. Attacker payloads persist within the memory of compromised processes and perform a wide range of malicious activities.

With fileless attack detection, automated memory forensic techniques identify fileless attack toolkits, techniques, and behaviors. This solution periodically scans your machine at runtime and extracts insights directly from the memory of security-critical processes.

It finds evidence of exploitation, code injection, and execution of malicious payloads. Fileless Attack Detection generates detailed security alerts to accelerate alert triage, correlation, and downstream response time. This approach complements event-based EDR solutions providing greater detection coverage.

> [!NOTE]
> You can simulate Windows alerts by download [Azure Security Center Playbook](https://gallery.technet.microsoft.com/Azure-Security-Center-0ac8a5ef): Security Alerts and follow the provided guidelines

> [!div class="mx-tableFixed"]

|Alert|Description|
|---|---|
|**Fileless attack technique detected**|The memory of the process specified below contains a fileless attack toolkit: Meterpreter. Fileless attack toolkits typically do not have a presence on the file system, making detection by traditional anti-virus difficult.|

### Further reading

For examples and more information about Security Center detection:

* [How Azure Security Center automates the detection of cyber attack](https://azure.microsoft.com/blog/leverage-azure-security-center-to-detect-when-compromised-linux-machines-attack/)
* [How Azure Security Center detects vulnerabilities using administrative tools](https://azure.microsoft.com/blog/azure-security-center-can-detect-emerging-vulnerabilities-in-linux/)

## Linux <a name="linux-machines"></a>

Security Center collects audit records from Linux machines using **auditd**, one of the most common Linux auditing frameworks. auditd has the advantage of having been around for a long time and living in the mainline kernel. 

### Linux auditd alerts and Microsoft Monitoring Agent (MMA) integration <a name="linux-auditd"></a>

The auditd system consists of a kernel-level subsystem, which is responsible for monitoring system calls, filtering them by a given rule set, and writing messages for them to a socket. Security Center integrates functionalities from the auditd package within the Microsoft Monitoring Agent (MMA). This integration enables auditd events collection in all supported Linux distributions without any prerequisites.  

auditd records are collected, enriched, and aggregated into events using the Linux MMA agent. Security Center is constantly working on adding new analytics, that leverage Linux signals to detect malicious behaviors on cloud and on-premises Linux machines. Similar to Windows capabilities, these analytics span across suspicious processes, dubious login attempts, kernel module loading, and other activities, which indicate a machine is either under attack or has been breached.  

Below are several examples of analytics, that demonstrate how we span across different stages of the attack life cycle.

> [!div class="mx-tableFixed"]

|Alert|Description|
|---|---|
|**Process seen accessing the SSH authorized keys file in an unusual way**|An SSH authorized keys file has been accessed in a method similar to known malware campaigns. This access could indicate that an attacker is attempting to gain persistent access to a machine|
|**Detected Persistence Attempt**|Host data analysis has detected that a startup script for single-user mode has been installed. <br/>Since it's rare that any legitimate process would be required to execute in that mode, this may indicate that an attacker has added a malicious process to every run-level to guarantee persistence.|
|**Manipulation of scheduled tasks detected**|Host data analysis has detected possible manipulation of scheduled tasks. Attackers often add scheduled tasks to machines they've compromised to gain persistence.|
|**Suspicious file timestamp modification**|Host data analysis detected a suspicious timestamp modification. Attackers often copy timestamps from existing legitimate files to new tools to avoid detection of these newly dropped files|
|**A new user was added to the sudoers group**|Host data analysis detected that a user was added to the sudoers group, which enables its members to run commands with high privileges.|
|**Likely exploit of DynoRoot vulnerability in dhcp client**|Host data analysis detected the execution of an unusual command with parent process of dhclient script.|
|**Suspicious kernel module detected**|Host data analysis detected a shared object file being loaded as a kernel module. This could be legitimate activity, or an indication that one of your machines has been compromised.|
|**Process associated with digital currency mining detected**|Host data analysis detected the execution of a process normally associated with digital currency mining|
|**Potential port forwarding to external IP address**|Host data analysis detected the initiation of port forwarding to an external IP address.|

> [!NOTE]
> You can simulate Windows alerts by downloading [Azure Security Center Playbook: Security Alerts](https://gallery.technet.microsoft.com/Azure-Security-Center-0ac8a5ef) and follow the provided guidelines.


For more information, see these articles:  

* [Leverage Azure Security Center to detect when compromised Linux machines attack](https://azure.microsoft.com/blog/leverage-azure-security-center-to-detect-when-compromised-linux-machines-attack/)

* [Azure Security Center can detect emerging vulnerabilities in Linux](https://azure.microsoft.com/blog/azure-security-center-can-detect-emerging-vulnerabilities-in-linux/)

 