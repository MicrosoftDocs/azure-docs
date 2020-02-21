---
title: Threat detection for VMs and servers in Azure Security Center | Microsoft Docs
description: This topic presents the VM and server alerts available in Azure Security Center.
services: security-center
documentationcenter: na
author: memildin
manager: rkarlin
ms.assetid: dd2eb069-4c76-4154-96bb-6e6ae553ef46
ms.service: security-center
ms.topic: conceptual
ms.date: 01/05/2020
ms.author: memildin
---
# Threat detection for VMs and servers in Azure Security Center

This topic presents the different types of detection methods and alerts available for VMs and servers with the following operating systems. 
For a list of supported versions, see [Platforms and features supported by Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-os-coverage).

* [Windows](#windows-machines)
* [Linux](#linux-machines)

## Windows <a name="windows-machines"></a>

Azure Security Center integrates with Azure services to monitor and protect your Windows-based machines. Security Center presents the alerts and remediation suggestions from all of these services in an easy-to-use format.

* **Microsoft Defender ATP** <a name="windows-atp"></a> -  Security Center extends its cloud workload protection platforms by integrating with Microsoft Defender Advanced Threat Protection (ATP). This provides comprehensive endpoint detection and response (EDR) capabilities.

    > [!NOTE]
    > The Microsoft Defender ATP sensor is automatically enabled on Windows servers that use Security Center.

    When Microsoft Defender ATP detects a threat, it triggers an alert. The alert is shown on the Security Center dashboard. From the dashboard, you can pivot to the Microsoft Defender ATP console, and perform a detailed investigation to uncover the scope of the attack. For more information about Microsoft Defender ATP, see [Onboard servers to the Microsoft Defender ATP service](https://docs.microsoft.com/windows/security/threat-protection/microsoft-defender-atp/configure-server-endpoints).

* **Crash dump analysis** <a name="windows-dump"></a> - When software crashes, a crash dump captures a portion of memory at the time of the crash.

    A crash might have been caused by malware or contain malware. To avoid being detected by security products, various forms of malware use a fileless attack, which avoids writing to disk or encrypting software components written to disk. This type of attack is difficult to detect by using traditional disk-based approaches.

    However, by using memory analysis, you can detect this kind of attack. By analyzing the memory in the crash dump, Security Center can detect the techniques the attack is using. For example, the attack might be attempting to exploit vulnerabilities in the software, access confidential data, and surreptitiously persist within a compromised machine. Security Center does this work with minimal performance impact to hosts.

    For details of the crash dump analysis alerts, see the [Reference table of alerts](alerts-reference.md#alerts-windows).

* **Fileless attack detection** <a name="windows-fileless"></a> - Fileless attacks targeting your endpoints are common. To avoid detection, fileless attacks inject malicious payloads into memory. Attacker payloads persist within the memory of compromised processes, and perform a wide range of malicious activities.

    With fileless attack detection, automated memory forensic techniques identify fileless attack toolkits, techniques, and behaviors. This solution periodically scans your machine at runtime, and extracts insights directly from the memory of security-critical processes.

    It finds evidence of exploitation, code injection, and execution of malicious payloads. Fileless attack detection generates detailed security alerts to accelerate alert triage, correlation, and downstream response time. This approach complements event-based EDR solutions, providing greater detection coverage.

    For details of the fileless attack detection alerts, see the [Reference table of alerts](alerts-reference.md#alerts-windows).

> [!NOTE]
> You can simulate Windows alerts by downloading [Azure Security Center Playbook: Security Alerts](https://gallery.technet.microsoft.com/Azure-Security-Center-f621a046).

## Linux <a name="linux-machines"></a>

Security Center collects audit records from Linux machines by using **auditd**, one of the most common Linux auditing frameworks. auditd lives in the mainline kernel. 

* **Linux auditd alerts and Microsoft Monitoring Agent (MMA) integration** <a name="linux-auditd"></a> - The auditd system consists of a kernel-level subsystem, which is responsible for monitoring system calls. It filters them by a specified rule set, and writes messages for them to a socket. Security Center integrates functionalities from the auditd package within the Microsoft Monitoring Agent (MMA). This integration enables collection of auditd events in all supported Linux distributions, without any prerequisites.  

    auditd records are collected, enriched, and aggregated into events by using the Linux MMA agent. Security Center continuously adds new analytics that use Linux signals to detect malicious behaviors on cloud and on-premises Linux machines. Similar to Windows capabilities, these analytics span across suspicious processes, dubious sign-in attempts, kernel module loading, and other activities. These activities can indicate a machine is either under attack or has been breached.  

    The following are several examples of analytics that span across different stages of the attack life cycle.

    For a list of the Linux alerts, see the [Reference table of alerts](alerts-reference.md#alerts-linux).

> [!NOTE]
> You can simulate Linux alerts by downloading [Azure Security Center Playbook: Linux Detections](https://gallery.technet.microsoft.com/Azure-Security-Center-0ac8a5ef).

 
 ## Next steps

For examples and more information about Security Center detection, see:

* [How Azure Security Center automates the detection of cyber attack](https://azure.microsoft.com/blog/leverage-azure-security-center-to-detect-when-compromised-linux-machines-attack/)
* [How Azure Security Center detects vulnerabilities using administrative tools](https://azure.microsoft.com/blog/azure-security-center-can-detect-emerging-vulnerabilities-in-linux/)
* [Leverage Azure Security Center to detect when compromised Linux machines attack](https://azure.microsoft.com/blog/leverage-azure-security-center-to-detect-when-compromised-linux-machines-attack/)
* [Azure Security Center can detect emerging vulnerabilities in Linux](https://azure.microsoft.com/blog/azure-security-center-can-detect-emerging-vulnerabilities-in-linux/)