---
title: Azure Defender for servers - the benefits and features
description: Learn about the benefits and features of Azure Defender for servers.
author: memildin
ms.author: memildin
ms.date: 08/09/2021
ms.topic: overview
ms.service: security-center
manager: rkarlin

---

# Introduction to Azure Defender for servers

Azure Defender for servers adds threat detection and advanced defenses for your Windows and Linux machines.

For Windows, Azure Defender integrates with Azure services to monitor and protect your Windows-based machines. Security Center presents the alerts and remediation suggestions from all of these services in an easy-to-use format.

For Linux, Azure Defender collects audit records from Linux machines by using auditd, one of the most common Linux auditing frameworks.


## What are the benefits of Azure Defender for servers?

The threat detection and protection capabilities provided with Azure Defender for servers include:

- **Integrated license for Microsoft Defender for Endpoint** - Azure Defender for servers includes  [Microsoft Defender for Endpoint](https://www.microsoft.com/microsoft-365/security/endpoint-defender). Together, they provide comprehensive endpoint detection and response (EDR) capabilities. For more information, see [Protect your endpoints](security-center-wdatp.md).

    When Defender for Endpoint detects a threat, it triggers an alert. The alert is shown in Security Center. From Security Center, you can also pivot to the Defender for Endpoint console, and perform a detailed investigation to uncover the scope of the attack. Learn more about Microsoft Defender for Endpoint.

    > [!IMPORTANT]
    > The **Microsoft Defender for Endpoint** sensor is automatically enabled on Windows machines that use Security Center.
    >
    > We're currently offering the sensor for Linux machines in preview. Learn more in [Protect your endpoints with Security Center's integrated EDR solution: Microsoft Defender for Endpoint](security-center-wdatp.md). 

- **Vulnerability assessment scanning for VMs** - The vulnerability scanner included with Azure Security Center is powered by Qualys. 

    Qualys' scanner is one of the leading tools for real-time identification of vulnerabilities in your Azure and hybrid virtual machines. You don't need a Qualys license or even a Qualys account - everything's handled seamlessly inside Security Center. For more information, see [Azure Defender's integrated vulnerability assessment solution for Azure and hybrid machines](deploy-vulnerability-assessment-vm.md).

- **Just-in-time (JIT) virtual machine (VM) access** - Threat actors actively hunt accessible machines with open management ports, like RDP or SSH. All of your virtual machines are potential targets for an attack. When a VM is successfully compromised, it's used as the entry point to attack further resources within your environment.

    When you enable Azure Defender for servers, you can use just-in-time VM access to lock down the inbound traffic to your VMs, reducing exposure to attacks while providing easy access to connect to VMs when needed. For more information, see [Understanding JIT VM access](just-in-time-explained.md).

- **File integrity monitoring (FIM)** - File integrity monitoring (FIM), also known as change monitoring, examines files and registries of operating system, application software, and others for changes that might indicate an attack. A comparison method is used to determine if the current state of the file is different from the last scan of the file. You can use this comparison to determine if valid or suspicious modifications have been made to your files.

    When you enable Azure Defender for servers, you can use FIM to validate the integrity of Windows files, your Windows registries, and Linux files. For more information, see [File integrity monitoring in Azure Security Center](security-center-file-integrity-monitoring.md).

- **Adaptive application controls (AAC)** - Adaptive application controls are an intelligent and automated solution for defining allowlists of known-safe applications for your machines.

    When you've enabled and configured adaptive application controls, you'll get security alerts if any application runs other than the ones you've defined as safe. For more information, see [Use adaptive application controls to reduce your machines' attack surfaces](security-center-adaptive-application.md).

- **Adaptive network hardening (ANH)** - Applying network security groups (NSG) to filter traffic to and from resources, improves your network security posture. However, there can still be some cases in which the actual traffic flowing through the NSG is a subset of the NSG rules defined. In these cases, further improving the security posture can be achieved by hardening the NSG rules, based on the actual traffic patterns.

    Adaptive Network Hardening provides recommendations to further harden the NSG rules. It uses a machine learning algorithm that factors in actual traffic, known trusted configuration, threat intelligence, and other indicators of compromise, and then provides recommendations to allow traffic only from specific IP/port tuples. For more information, see [Improve your network security posture with adaptive network hardening](security-center-adaptive-network-hardening.md).

- **Docker host hardening** -  Azure Security Center identifies unmanaged containers hosted on IaaS Linux VMs, or other Linux machines running Docker containers. Security Center continuously assesses the configurations of these containers. It then compares them with the Center for Internet Security (CIS) Docker Benchmark. Security Center includes the entire ruleset of the CIS Docker Benchmark and alerts you if your containers don't satisfy any of the controls. For more information, see [Harden your Docker hosts](harden-docker-hosts.md).

- **Fileless attack detection (Windows only)** - Fileless attacks inject malicious payloads into memory to avoid detection by disk-based scanning techniques. The attacker’s payload then persists within the memory of compromised processes and performs a wide range of malicious activities.

  With fileless attack detection, automated memory forensic techniques identify fileless attack toolkits, techniques, and behaviors. This solution periodically scans your machine at runtime, and extracts insights directly from the memory of processes. Specific insights include the identification of: 

  - Well-known toolkits and crypto mining software 

  - Shellcode, which is a small piece of code typically used as the payload in the exploitation of a software vulnerability.

  - Injected malicious executable in process memory

  Fileless attack detection generates detailed security alerts that include descriptions with process metadata such as network activity. These details accelerate alert triage, correlation, and downstream response time. This approach complements event-based EDR solutions, and provides increased detection coverage.

  For details of the fileless attack detection alerts, see the [Reference table of alerts](alerts-reference.md#alerts-windows).

- **Linux auditd alerts and Log Analytics agent integration (Linux only)** - The auditd system consists of a kernel-level subsystem, which is responsible for monitoring system calls. It filters them by a specified rule set, and writes messages for them to a socket. Security Center integrates functionalities from the auditd package within the Log Analytics agent. This integration enables collection of auditd events in all supported Linux distributions, without any prerequisites.

    Log Analytics agent for Linux collects auditd records and enriches and aggregates them into events. Security Center continuously adds new analytics that use Linux signals to detect malicious behaviors on cloud and on-premises Linux machines. Similar to Windows capabilities, these analytics span across suspicious processes, dubious sign-in attempts, kernel module loading, and other activities. These activities can indicate a machine is either under attack or has been breached.  

    For a list of the Linux alerts, see the [Reference table of alerts](alerts-reference.md#alerts-linux).


## Simulating alerts

You can simulate alerts by downloading one of the following playbooks:

- For Windows: [Azure Security Center Playbook: Security Alerts](https://github.com/Azure/Azure-Security-Center/blob/master/Simulations/Azure%20Security%20Center%20Security%20Alerts%20Playbook_v2.pdf)

- For Linux: [Azure Security Center Playbook: Linux Detections](https://github.com/Azure/Azure-Security-Center/blob/master/Simulations/Azure%20Security%20Center%20Linux%20Detections_v2.pdf).




## Next steps

In this article, you learned about Azure Defender for servers. 

> [!div class="nextstepaction"]
> [Enable Azure Defender](enable-azure-defender.md)

For related material, see the following page:

- Whether an alert is generated by Security Center, or received by Security Center from a different security product, you can export it. To export your alerts to Azure Sentinel, any third-party SIEM, or any other external tool, follow the instructions in [Exporting alerts to a SIEM](continuous-export.md).