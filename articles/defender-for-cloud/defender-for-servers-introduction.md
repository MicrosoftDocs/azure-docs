---
title: Microsoft Defender for Servers - the benefits and features
description: Learn about the benefits and features of Microsoft Defender for Servers.
ms.date: 03/28/2022
ms.topic: overview
ms.author: benmansheim
author: bmansheim
---
# Introduction to Microsoft Defender for Servers

Microsoft Defender for Servers is one of the enhanced security features of Microsoft Defender for Cloud. Use it to add threat detection and advanced defenses to your Windows and Linux machines whether they're running in Azure, AWS, GCP, and on-premises environment.

To protect machines in hybrid and multicloud environments, Defender for Cloud uses [Azure Arc](../azure-arc/index.yml). Connect your hybrid and multicloud machines as explained in the relevant quickstart:
- [Connect your non-Azure machines to Microsoft Defender for Cloud](quickstart-onboard-machines.md)
- [Connect your AWS accounts to Microsoft Defender for Cloud](quickstart-onboard-aws.md)

> [!TIP]
> For details of which Defender for Servers features are relevant for machines running on other cloud environments, see [Supported features for virtual machines and servers](supported-machines-endpoint-solutions-clouds-servers.md?tabs=features-windows#supported-features-for-virtual-machines-and-servers-).

## What are the Microsoft Defender for server plans?

Microsoft Defender for Servers provides threat detection and advanced defenses to your Windows and Linux machines whether they're running in Azure, AWS, GCP, or on-premises. Microsoft Defender for Servers is available in two plans:

- **Microsoft Defender for Servers Plan 1** - deploys Microsoft Defender for Endpoint to your servers and provides these capabilities:
    - Microsoft Defender for Endpoint licenses are charged per hour instead of per seat, lowering costs for protecting virtual machines only when they are in use.
    - Microsoft Defender for Endpoint deploys automatically to all cloud workloads so that you know they're protected when they spin up.
    - Alerts and vulnerability data from Microsoft Defender for Endpoint is shown in Microsoft Defender for Cloud

- **Microsoft Defender for Servers Plan 2** (formerly Defender for Servers) - includes the benefits of Plan 1 and support for all of the other Microsoft Defender for Servers features.

For pricing details in your currency of choice and according to your region, see the [pricing page](https://azure.microsoft.com/pricing/details/defender-for-cloud/).

To enable the Microsoft Defender for Servers plans:

1. Go to **Environment settings** and select your subscription.
2. If Microsoft Defender for Servers isn't enabled, set it to **On**.
    Plan 2 is selected by default.

    If you want to change the Defender for Servers plan:
   1. In the **Plan/Pricing** column, select **Change plan**.
   2. Select the plan that you want and select **Confirm**.

The following table describes what's included in each plan at a high level.

| Feature | Defender for Servers Plan 1 | Defender for Servers Plan 2 |
|:---|:---:|:---:|
| Automatic onboarding for resources in Azure, AWS, GCP | :::image type="icon" source="./media/icons/yes-icon.png"::: | :::image type="icon" source="./media/icons/yes-icon.png"::: |
| Microsoft threat and vulnerability management | :::image type="icon" source="./media/icons/yes-icon.png"::: | :::image type="icon" source="./media/icons/yes-icon.png"::: |
| Flexibility to use Microsoft Defender for Cloud or Microsoft 365 Defender portal | :::image type="icon" source="./media/icons/yes-icon.png"::: | :::image type="icon" source="./media/icons/yes-icon.png"::: |
| Integration of Microsoft Defender for Cloud and Microsoft Defender for Endpoint (alerts, software inventory, Vulnerability Assessment) | :::image type="icon" source="./media/icons/yes-icon.png"::: | :::image type="icon" source="./media/icons/yes-icon.png"::: |
| Log-analytics (500 MB free) | | :::image type="icon" source="./media/icons/yes-icon.png"::: |
| Vulnerability Assessment using Qualys | | :::image type="icon" source="./media/icons/yes-icon.png"::: |
| Threat detections: OS level, network layer, control plane | | :::image type="icon" source="./media/icons/yes-icon.png"::: |
| Adaptive application controls | | :::image type="icon" source="./media/icons/yes-icon.png"::: |
| File integrity monitoring | | :::image type="icon" source="./media/icons/yes-icon.png"::: |
| Just-in time VM access | | :::image type="icon" source="./media/icons/yes-icon.png"::: |
| Adaptive network hardening | | :::image type="icon" source="./media/icons/yes-icon.png"::: |
<!-- | Future – TVM P2 | | :::image type="icon" source="./media/icons/yes-icon.png"::: |
| Future – disk scanning insights | | :::image type="icon" source="./media/icons/yes-icon.png"::: | -->

## What are the benefits of Defender for Servers?

The threat detection and protection capabilities provided with Microsoft Defender for Servers include:

- **Integrated license for Microsoft Defender for Endpoint** - Microsoft Defender for Servers includes  [Microsoft Defender for Endpoint](https://www.microsoft.com/microsoft-365/security/endpoint-defender). Together, they provide comprehensive endpoint detection and response (EDR) capabilities. When you enable Microsoft Defender for Servers, Defender for Cloud gets access to the Microsoft Defender for Endpoint data that is related to vulnerabilities, installed software, and alerts for your endpoints.

    When Defender for Endpoint detects a threat, it triggers an alert. The alert is shown in Defender for Cloud. From Defender for Cloud, you can also pivot to the Defender for Endpoint console, and perform a detailed investigation to uncover the scope of the attack. For more information, see [Protect your endpoints](integration-defender-for-endpoint.md).

- **Vulnerability assessment tools for machines** - Microsoft Defender for Servers includes a choice of  vulnerability discovery and management tools for your machines. From Defender for Cloud's settings pages, you can select the tools to deploy to your machines. The discovered vulnerabilities are shown in a security recommendation.

    - **Microsoft threat and vulnerability management** - Discover vulnerabilities and misconfigurations in real time with Microsoft Defender for Endpoint, and without the need of other agents or periodic scans. [Threat and vulnerability management](/microsoft-365/security/defender-endpoint/next-gen-threat-and-vuln-mgt) prioritizes vulnerabilities according to the threat landscape, detections in your organization, sensitive information on vulnerable devices, and the business context. Learn more in [Investigate weaknesses with Microsoft Defender for Endpoint's threat and vulnerability management](deploy-vulnerability-assessment-tvm.md)

    - **Vulnerability scanner powered by Qualys** - The Qualys scanner is one of the leading tools for real-time identification of vulnerabilities in your Azure and hybrid virtual machines. You don't need a Qualys license or even a Qualys account - everything's handled seamlessly inside Defender for Cloud. Learn more in [Defender for Cloud's integrated Qualys scanner for Azure and hybrid machines](deploy-vulnerability-assessment-vm.md).

- **Just-in-time (JIT) virtual machine (VM) access** - Threat actors actively hunt accessible machines with open management ports, like RDP or SSH. All of your virtual machines are potential targets for an attack. When a VM is successfully compromised, it's used as the entry point to attack further resources within your environment.

    When you enable Microsoft Defender for Servers, you can use just-in-time VM access to lock down the inbound traffic to your VMs. This reduces exposure to attacks and provides easy access to connect to VMs when needed. For more information, see [Understanding JIT VM access](just-in-time-access-overview.md).

- **File integrity monitoring (FIM)** - File integrity monitoring (FIM), also known as change monitoring, examines files and registries of operating system, application software, and others for changes that might indicate an attack. A comparison method is used to determine if the current state of the file is different from the last scan of the file. You can use this comparison to determine if valid or suspicious modifications have been made to your files.

    When you enable Microsoft Defender for Servers, you can use FIM to validate the integrity of Windows files, your Windows registries, and Linux files. For more information, see [File integrity monitoring in Microsoft Defender for Cloud](file-integrity-monitoring-overview.md).

- **Adaptive application controls (AAC)** - Adaptive application controls are an intelligent and automated solution for defining allowlists of known-safe applications for your machines.

    After you enable and configure adaptive application controls, you get security alerts if any application runs other than the ones you defined as safe. For more information, see [Use adaptive application controls to reduce your machines' attack surfaces](adaptive-application-controls.md).

- **Adaptive network hardening (ANH)** - Applying network security groups (NSG) to filter traffic to and from resources, improves your network security posture. However, there can still be some cases in which the actual traffic flowing through the NSG is a subset of the NSG rules defined. In these cases, further improving the security posture can be achieved by hardening the NSG rules, based on the actual traffic patterns.

    Adaptive network hardening provides recommendations to further harden the NSG rules. It uses a machine learning algorithm that factors in actual traffic, known trusted configuration, threat intelligence, and other indicators of compromise. ANH then provides recommendations to allow traffic only from specific IP and port tuples. For more information, see [Improve your network security posture with adaptive network hardening](adaptive-network-hardening.md).


- **Docker host hardening** -  Microsoft Defender for Cloud identifies unmanaged containers hosted on IaaS Linux VMs, or other Linux machines running Docker containers. Defender for Cloud continuously assesses the configurations of these containers. It then compares them with the Center for Internet Security (CIS) Docker Benchmark. Defender for Cloud includes the entire ruleset of the CIS Docker Benchmark and alerts you if your containers don't satisfy any of the controls. For more information, see [Harden your Docker hosts](harden-docker-hosts.md).

- **Fileless attack detection** - Fileless attacks inject malicious payloads into memory to avoid detection by disk-based scanning techniques. The attacker’s payload then persists within the memory of compromised processes and performs a wide range of malicious activities.

  With fileless attack detection, automated memory forensic techniques identify fileless attack toolkits, techniques, and behaviors. This solution periodically scans your machine at runtime, and extracts insights directly from the memory of processes. Specific insights include the identification of: 

  - Well-known toolkits and crypto mining software 

  - Shellcode - a small piece of code typically used as the payload in the exploitation of a software vulnerability.

  - Injected malicious executable in process memory

  Fileless attack detection generates detailed security alerts that include descriptions with process metadata such as network activity. These details accelerate alert triage, correlation, and downstream response time. This approach complements event-based EDR solutions, and provides increased detection coverage.

  For details of the fileless attack detection alerts, see the [Reference table of alerts](alerts-reference.md#alerts-windows).

- **Linux auditd alerts and Log Analytics agent integration (Linux only)** - The auditd system consists of a kernel-level subsystem, which is responsible for monitoring system calls. It filters them by a specified rule set, and writes messages for them to a socket. Defender for Cloud integrates functionalities from the auditd package within the Log Analytics agent. This integration enables collection of auditd events in all supported Linux distributions, without any prerequisites.

    Log Analytics agent for Linux collects auditd records and enriches and aggregates them into events. Defender for Cloud continuously adds new analytics that use Linux signals to detect malicious behaviors on cloud and on-premises Linux machines. Similar to Windows capabilities, these analytics include tests that check for suspicious processes, dubious sign-in attempts, kernel module loading, and other activities. These activities can indicate a machine is either under attack or has been breached.  

    For a list of the Linux alerts, see the [Reference table of alerts](alerts-reference.md#alerts-linux).

## How does Defender for Servers collect data?

For Windows, Microsoft Defender for Cloud integrates with Azure services to monitor and protect your Windows-based machines. Defender for Cloud presents the alerts and remediation suggestions from all of these services in an easy-to-use format.

For Linux, Defender for Cloud collects audit records from Linux machines by using auditd, one of the most common Linux auditing frameworks.

For hybrid and multicloud scenarios, Defender for Cloud integrates with [Azure Arc](../azure-arc/index.yml) to ensure these non-Azure machines are seen as Azure resources. 


## Simulating alerts

You can simulate alerts by downloading one of the following playbooks:

- For Windows: [Microsoft Defender for Cloud Playbook: Security Alerts](https://github.com/Azure/Azure-Security-Center/blob/master/Simulations/Azure%20Security%20Center%20Security%20Alerts%20Playbook_v2.pdf)

- For Linux: [Microsoft Defender for Cloud Playbook: Linux Detections](https://github.com/Azure/Azure-Security-Center/blob/master/Simulations/Azure%20Security%20Center%20Linux%20Detections_v2.pdf).




## Next steps

In this article, you learned about Microsoft Defender for Servers. 

> [!div class="nextstepaction"]
> [Enable enhanced protections](enable-enhanced-security.md)

For related material, see the following page:

- Whether Defender for Cloud generates an alert or receives an alert from a different security product, you can export alerts from Defender for Cloud. To export your alerts to Microsoft Sentinel, any third-party SIEM, or any other external tool, follow the instructions in [Exporting alerts to a SIEM](continuous-export.md).
