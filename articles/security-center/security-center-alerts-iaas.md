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
# IaaS VM and server alerts in Azure Security Center

This topic presents the different types of detection methods and alerts available for VMs and Servers on the following operation systems.

* [Windows](#windows-machines)
* [Linux](#linux-machines)

For a list of supported versions, see [Platforms and features supported by Azure Security Center](https://docs.microsoft.com/en-us/azure/security-center/security-center-os-coverage).

## Windows <a name="windows-machines"></a>

Security Center integrates with Azure services to monitor and protect your Windows-based machines.  Security Center presents the alerts and remediation suggestions from all of these services in an easy-to-use format.

### Microsoft Server Defender ATP <a nanme="windows-atp"></a>

Azure Security Center extends its Cloud Workload Protection Platforms by integrating with Windows Defender Advanced Threat Protection (ATP). This provides comprehensive Endpoint Detection and Response (EDR) capabilities.

> [!NOTE]
> Windows Server Defender ATP sensor is automatically enabled on Windows Servers that are onboarded to Azure Security Center.

When Windows Server Defender ATP detects a threat, it triggers an alert. The alert is shown on the Security Center dashboard. From the dashboard, you can pivot to the Windows Defender ATP console to perform a detailed investigation to uncover scope of the attack. For more information about Windows Server Defender ATP, see [Onboard servers to the Windows Defender ATP service](https://docs.microsoft.com/en-us/windows/security/threat-protection/microsoft-defender-atp/configure-server-endpoints).

In addition to Microsoft Server Defender ATP, Security Center also offers: 

### Crash Dump Analysis <a nanme="windows-dump"></a>

When software crashes, a crash dump captures a portion of memory at the time of the crash.

A crash may have been caused by malware or contain malware. To avoid being detected by security products, various forms of malware use a fileless attack which avoids writing to disk or encrypting software components written to disk. This type of attack is difficult to detect by using traditional disk-based approaches.

However, this kind of attack can be detected by using memory analysis. By analyzing the memory in the crash dump, Security Center can detect the techniques the attack is using to exploit vulnerabilities in the software, access confidential data, and surreptitiously persist within a compromised machine. This is done by the Security Center back end with minimum performance impact to hosts.

Several examples below: 

### Fileless Attack Detection <a nanme="windows-fileless"></a>

In Azure, we regularly see fileless attacks targeting our customers’ endpoints.

To avoid detection, fileless attacks inject malicious payloads into memory. Attacker payloads persist within the memory of compromised processes and perform a wide range of malicious activities.

With Fileless attack detection, automated memory forensic techniques identify fileless attack toolkits, techniques, and behaviors. This solution periodically scans your machine at runtime and extracts insights directly from the memory of security-critical processes.

It finds evidence of exploitation, code injection, and execution of malicious payloads. Fileless Attack Detection generates detailed security alerts to accelerate alert triage, correlation, and downstream response time. This approach complements event-based EDR solutions providing greater detection coverage.

> [!NOTE]
> You can simulate Windows alerts by download [Azure Security Center Playbook](https://gallery.technet.microsoft.com/Azure-Security-Center-0ac8a5ef): Security Alerts and follow the provided guidelines.  


### For additional read on Security Center findings and examples:

[How Azure Security Center automates the detection of cyber attack](https://azure.microsoft.com/en-us/blog/leverage-azure-security-center-to-detect-when-compromised-linux-machines-attack/)

[How Azure Security Center detects vulnerabilities using administrative tools](https://azure.microsoft.com/en-us/blog/azure-security-center-can-detect-emerging-vulnerabilities-in-linux/)

## Linux <a name="linux-machines"></a>

Security Center collects audit records from Linux machines using **auditd**, one of the most common Linux auditing frameworks. auditd has the advantage of having been around for a long time and living in the mainline kernel. 

### Linux auditd alerts and Microsoft Monitoring Agent (MMA) integration <a name="linux-auditd"></a>

The auditd system consists of a kernel-level subsystem which is responsible for monitoring system calls, filtering them by given rule set, and writing match messages to a socket. Security Center implemented functionalities from auditd package within the Microsoft Monitoring Agent (MMA) to enable auditd events collection in all supported Linux distributions without any prerequisites.  

auditd records are collected, enriched and aggregated into events using the Linux MMA agent. Security Center has applied, and constantly working on adding new analytics, that leverage Linux signals to detect malicious behaviors on cloud and on-premises Linux machines. Similar to Windows capabilities, these analytics spans across suspicious processes, dubious login attempts, kernel module loading and other activities that could indicate that a machine is under attack or has been breached.  

Below are several examples of analytics, that demonstrate how we span across different stages on attack life cycle.

|Alert|Description|
|---|---|
|**Process seen accessing the SSH authorized keys file in an unusual way**|An SSH authorized keys file was accessed in a method similar to known malware campaigns. This access could signify that an actor is attempting to gain persistent access to a machine|
|**Detected Persistence Attempt**|Analysis of host data detected installation of a startup script for single-user mode. It is extremely rare that any legitimate process has any requirement to execute in that mode so may indicate an attacker has added a malicious process to every run-level to guarantee persistence|
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

* [Leverage Azure Security Center to detect when compromised Linux machines attack](https://azure.microsoft.com/en-us/blog/leverage-azure-security-center-to-detect-when-compromised-linux-machines-attack/)

* [Azure Security Center can detect emerging vulnerabilities in Linux](https://azure.microsoft.com/en-us/blog/azure-security-center-can-detect-emerging-vulnerabilities-in-linux/)

 