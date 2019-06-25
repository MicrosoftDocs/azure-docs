---
title: IaaS VM and server alerts Azure Security Center | Microsoft Docs
description: Azure policy definitions monitored in Azure Security Center.
services: security-center
documentationcenter: na
author: monhaber
manager: rkarlin
editor: ''

ms.assetid: 
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 6/25/2019
ms.author: monhaber

---
# IaaS VM and server alerts

## Windows 

### Integration with Microsoft Server Defender ATP 

The section that follows will cover in more details the categories of detections available for VMs and Servers using supported versions of Windows operating system.  

Azure Security Center is extending its Cloud Workload Protection Platforms offering by integrating with Windows Defender Advanced Threat Protection (ATP). This change brings comprehensive Endpoint Detection and Response (EDR) capabilities. With Windows Defender ATP integration, you can spot abnormalities. You can also detect and respond to advanced attacks on server endpoints monitored by Azure Security Center. 

Windows Server Defender ATP sensor is automatically enabled on Windows Servers that are onboarded to Azure Security Center. When Windows Server Defender ATP detects a threat, it will trigger an alert that can be access from Security Center dashboard. From there you can pivot to Windows Defender ATP console to perform detailed investigation to uncover scope of the attack. For more information about Windows Server Defender ATP read Onboard servers to the Windows Defender ATP service. 

In addition to Microsoft Server Defender ATP, Security Center also offers: 

### Crash Dump Analysis 

When software crashes, a crash dump captures a portion of memory at the time of the crash. The crash may be caused by malware or contain malware. Various forms of malware try to use fileless attack to reduce the chance of being detected by security products.  This type of malware will avoid writing to disk or encrypt software components written to disk. This technique makes the malware difficult to detect by using traditional disk-based approaches.  

However, this kind of malware can be detected by using memory analysis. By analyzing the memory in the crash dump, Security Center can detect techniques used to exploit vulnerabilities in software, access confidential data and surreptitiously persist within a compromised machine. This is accomplished with minimum performance impact to hosts as the analysis is performed by the Security Center back end. 

Several examples below: 

### Fileless Attack Detection 

As the security solutions get better at detecting attacks, attackers are increasingly employing stealthier methods to avoid detection. In Azure, we regularly see fileless attacks targeting our customers’ endpoints. To avoid detection, fileless attacks inject malicious payloads into memory. Attacker payloads persist within the memory of compromised processes and perform a wide range of malicious activities. With Fileless Attack Detection, automated memory forensic techniques identify fileless attack toolkits, techniques, and behaviors. This solution periodically scans your machine at runtime and extracts insights directly from the memory of security-critical processes. It finds evidence of exploitation, code injection and execution of malicious payloads. Fileless Attack Detection generates detailed security alerts to accelerate alert triage, correlation, and downstream response time. This approach complements event based EDR solutions providing greater detection coverage. An example below: 

Note: You can simulate Windows alerts by download [Azure Security Center Playbook](https://gallery.technet.microsoft.com/Azure-Security-Center-0ac8a5ef): Security Alerts and follow the provided guidelines.  


### For additional read on Security Center findings and examples:

[How Azure Security Center automates the detection of cyber attack](https://azure.microsoft.com/en-us/blog/leverage-azure-security-center-to-detect-when-compromised-linux-machines-attack/)

[How Azure Security Center detects vulnerabilities using administrative tools](https://azure.microsoft.com/en-us/blog/azure-security-center-can-detect-emerging-vulnerabilities-in-linux/)

 

## Linux 

Security Center collects audit records from Linux machines using auditd, one of the most common Linux auditing frameworks. auditd has the advantage of having been around for a long time and living in the mainline kernel. The auditd system consists of a kernel-level subsystem which is responsible for monitoring system calls, filtering them by given rule set, and writing match messages to a socket. Security Center implemented functionalities from auditd package within the Microsoft Monitoring Agent (MMA) to enable auditd events collection in all supported Linux distributions without any prerequisites.  

auditd records are collected, enriched and aggregated into events using the Linux MMA agent. Security Center has applied, and constantly working on adding new analytics, that leverage Linux signals to detect malicious behaviors on cloud and on-premises Linux machines. Similar to Windows capabilities, these analytics spans across suspicious processes, dubious login attempts, kernel module loading and other activities that could indicate that a machine is under attack or has been breached.  

Below are several examples of analytics, that demonstrate how we spans across different stages on attack life cycle.

|Alert|Description|
|---|---|
|**Process seen accessing the SSH authorized keys file in an unusual way**|An SSH authorized keys file was accessed in a method similar to known malware campaigns. This access could signify that an actor is attempting to gain persistent access to a machine|
|**Detected Persistence Attempt**|Analysis of host data detected installation of a startup script for single-user mode. It is extremely rare than any legitimate process has any requirement to execute in that mode so may indicate an attacker has added a malicious process to every run-level to guarantee persistence|
|**Manipulation of scheduled tasks detected**|Analysis of host data detected possible manipulation of scheduled tasks. Attackers will often add scheduled tasks to machines they have compromised to gain persistence|
|**Suspicious file timestamp modification**|Analysis of host data on detected a suspicious timestamp modification. Attackers will often copy timestamps from existing legitimate files to new tools to avoid detection of these newly dropped files|
|**A new user was added to the sudoers group**|Analysis of host data indicates that a user was added to the sudoers group, which enables its members to run commands with high privileges|
|**Likely exploit of DynoRoot vulnerability in dhcp client**|Analysis of host data detected the execution of an unusual command with parent process of dhclient script|
|**Suspicious kernel module detected**|Analysis of host data detected a shared object file being loaded as a kernel module. This could be legitimate activity, or an indication that one of your machines has been compromised|
|**Process associated with digital currency mining detected**|Analysis of host data detected the execution of a process normally associated with digital currency mining|
|**Potential port forwarding to external IP address**|Analysis of host data detected the initiation of port forwarding to an external IP address|

> [!NOTE]
> You can simulate Windows alerts by downloading [Azure Security Center Playbook: Security Alerts](https://gallery.technet.microsoft.com/Azure-Security-Center-0ac8a5ef) and follow the provided guidelines.


For additional read on Security Center findings and examples:  

Leverage Azure Security Center to detect when compromised Linux machines attack. 

Azure Security Center can detect emerging vulnerabilities in Linux 

 