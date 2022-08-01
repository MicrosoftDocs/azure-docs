---
title: Microsoft Defender for Servers - the benefits and features
description: Learn about the benefits and features of Microsoft Defender for Servers.
ms.date: 07/14/2022
ms.topic: overview
---
# Overview of Microsoft Defender for Servers

Defender for Servers is one of the enhanced security features available in Microsoft Defender for Cloud. You can use it to add threat detection and advanced defenses to your Windows and Linux machines that exist in hybrid and multicloud environments.

To protect your machines, Defender for Cloud uses [Azure Arc](../azure-arc/index.yml). You can [Connect your non-Azure machines to Microsoft Defender for Cloud](quickstart-onboard-machines.md), [Connect your AWS accounts to Microsoft Defender for Cloud](quickstart-onboard-aws.md) or [Connect your GCP projects to Microsoft Defender for Cloud](quickstart-onboard-gcp.md).

> [!TIP]
> You can check out the [Supported features for virtual machines and servers](supported-machines-endpoint-solutions-clouds-servers.md?tabs=features-windows#supported-features-for-virtual-machines-and-servers) for details on which Defender for Servers features are relevant for machines running on other cloud environments.

You can learn more by watching these videos from the Defender for Cloud in the Field video series:
- [Microsoft Defender for Servers](episode-five.md)
- [Enhanced workload protection features in Defender for Servers](episode-twelve.md)
- [Deploy in Defender for Servers in AWS and GCP](episode-fourteen.md)

## Available Defender for Server plans

Defender for Servers offers you a choice between two paid plans:

| Feature | [Defender for Servers Plan 1](#plan-1) | [Defender for Servers Plan 2](#plan-2-formerly-defender-for-servers) |
|:---|:---:|:---:|
| Automatic onboarding for resources in Azure, AWS, GCP | :::image type="icon" source="./media/icons/yes-icon.png"::: | :::image type="icon" source="./media/icons/yes-icon.png"::: |
| Microsoft threat and vulnerability management | :::image type="icon" source="./media/icons/yes-icon.png"::: | :::image type="icon" source="./media/icons/yes-icon.png"::: |
| Flexibility to use Microsoft Defender for Cloud or Microsoft 365 Defender portal | :::image type="icon" source="./media/icons/yes-icon.png"::: | :::image type="icon" source="./media/icons/yes-icon.png"::: |
| [Integration of Microsoft Defender for Cloud and Microsoft Defender for Endpoint](#integrated-license-for-microsoft-defender-for-endpoint) (alerts, software inventory, Vulnerability Assessment) | :::image type="icon" source="./media/icons/yes-icon.png"::: | :::image type="icon" source="./media/icons/yes-icon.png"::: |
| Security Policy and Regulatory Compliance | | :::image type="icon" source="./media/icons/yes-icon.png"::: |
| Log-analytics (500 MB free) | | :::image type="icon" source="./media/icons/yes-icon.png"::: |
| [Vulnerability Assessment using Qualys](#vulnerability-scanner-powered-by-qualys) | | :::image type="icon" source="./media/icons/yes-icon.png"::: |
| Threat detections: OS level, network layer, control plane | | :::image type="icon" source="./media/icons/yes-icon.png"::: |
| [Adaptive application controls](#adaptive-application-controls-aac) | | :::image type="icon" source="./media/icons/yes-icon.png"::: |
| [File integrity monitoring](#file-integrity-monitoring-fim) | | :::image type="icon" source="./media/icons/yes-icon.png"::: |
| [Just-in time VM access](#just-in-time-jit-virtual-machine-vm-access) | | :::image type="icon" source="./media/icons/yes-icon.png"::: |
| [Adaptive network hardening](#adaptive-network-hardening-anh) | | :::image type="icon" source="./media/icons/yes-icon.png"::: |

You can learn more about the different [benefits for each server plan](#benefits-of-the-defender-for-servers-plans) .

### Plan 1

Plan 1 includes the following benefits:

- Automatic onboarding for resources in Azure, AWS, GCP
- Microsoft threat and vulnerability management
- Flexibility to use Microsoft Defender for Cloud or Microsoft 365 Defender portal
- A Microsoft Defender for Endpoint subscription that includes access to alerts, software inventory, Vulnerability Assessment and an automatic integration with Microsoft Defender for Cloud.

The subscription to [Microsoft Defender for Endpoint](/microsoft-365/security/defender-endpoint/microsoft-defender-endpoint?view=o365-worldwide) allows you to deploy Defender for Endpoint to your servers. Defender for Endpoint includes the following capabilities:

- Licenses are charged per hour instead of per seat, lowering your costs to protect virtual machines only when they are in use.
- Microsoft Defender for Endpoint deploys automatically to all cloud workloads so that you know that they're protected when they spin up.
- Alerts and vulnerability data is shown in Microsoft Defender for Cloud.

### Plan 2 (formerly Defender for Servers)

Plan 2 includes all of the benefits included with Plan 1. However, plan 2 also includes all of the following features:

- Security Policy and Regulatory Compliance
- Log-analytics (500 MB free)
- [Vulnerability Assessment using Qualys](#vulnerability-scanner-powered-by-qualys)
- Threat detections: OS level, network layer, control plane
- [Adaptive application controls](#adaptive-application-controls-aac)
- [File integrity monitoring](#file-integrity-monitoring-fim)
- [Just-in time VM access](#just-in-time-jit-virtual-machine-vm-access)
- [Adaptive network hardening](#adaptive-network-hardening-anh)

For pricing details in your currency of choice and according to your region, see the [pricing page](https://azure.microsoft.com/pricing/details/defender-for-cloud/).

## Select a plan

You can select your plan when you [Enable enhanced security features on your subscriptions and workspaces](enable-enhanced-security.md#enable-enhanced-security-features-from-the-azure-portal). By default, plan 2 is selected when you set the Defender for Servers plan to **On**.

If at any point, you want to change the Defender for Servers plan, you can change it on the Defender plans page by selecting **Change plan**.

:::image type="content" source="media/defender-for-servers-introduction/change-plan.png" alt-text="Screenshot that shows you where the option to select your plan is located on the Defender plans page." lightbox="media/defender-for-servers-introduction/change-plan.png":::

## Benefits of the Defender for Servers plans

Defender for Servers offers both threat detection and protection capabilities that consist of:

### Included in plan 1 & plan 2

#### Microsoft threat and vulnerability management 

Defender for Servers includes a selection of vulnerability discovery and management tools for your machines. You can select which tools to deploy to your machines. The discovered vulnerabilities are shown in a security recommendation.

Discovers vulnerabilities and misconfigurations in real time with Microsoft Defender for Endpoint, and without the need of other agents or periodic scans. [Threat and vulnerability management](/microsoft-365/security/defender-endpoint/next-gen-threat-and-vuln-mgt) prioritizes vulnerabilities according to the threat landscape, detections in your organization, sensitive information on vulnerable devices, and the business context. Learn more in [Investigate weaknesses with Microsoft Defender for Endpoint's threat and vulnerability management](deploy-vulnerability-assessment-tvm.md)

#### Integrated license for Microsoft Defender for Endpoint

Defender for Servers includes [Microsoft Defender for Endpoint](https://www.microsoft.com/microsoft-365/security/endpoint-defender). Together, they provide comprehensive endpoint detection and response (EDR) capabilities. When you enable Defender for Servers, Defender for Cloud gains access to the Defender for Endpoint data that is related to vulnerabilities, installed software, and alerts for your endpoints.

When Defender for Endpoint detects a threat, it triggers an alert. The alert is shown on Defender for Cloud's Recommendation page. From Defender for Cloud, you can also pivot to the Defender for Endpoint console, and perform a detailed investigation to uncover the scope of the attack. Learn how to [Protect your endpoints](integration-defender-for-endpoint.md).

### Included in plan 2 only

#### Vulnerability scanner powered by Qualys

Defender for Servers includes a selection of vulnerability discovery and management tools for your machines. You can select which tools to deploy to your machines. The discovered vulnerabilities are shown in a security recommendation.

The Qualys scanner is one of the leading tools for real-time identification of vulnerabilities in your Azure and hybrid virtual machines. You don't need a Qualys license or a Qualys account - everything's handled seamlessly inside Defender for Cloud. You can learn more about [Defender for Cloud's integrated Qualys scanner for Azure and hybrid machines](deploy-vulnerability-assessment-vm.md).

#### Adaptive application controls (AAC)

Adaptive application controls are an intelligent and automated solution for defining allowlists of known-safe applications for your machines.

After you enable and configure adaptive application controls, you get security alerts if any application runs other than the ones you defined as safe. Learn how to [use adaptive application controls to reduce your machines' attack surfaces](adaptive-application-controls.md).

#### File integrity monitoring (FIM)

File integrity monitoring (FIM), also known as change monitoring, examines files and registries of operating system, application software, and others for changes that might indicate an attack. A comparison method is used to determine if the current state of the file is different from the last scan of the file. You can use this comparison to determine if valid or suspicious modifications have been made to your files.

When you enable Defender for Servers, you can use FIM to validate the integrity of Windows files, your Windows registries, and Linux files. Learn more about [File integrity monitoring in Microsoft Defender for Cloud](file-integrity-monitoring-overview.md).

#### Just-in-time (JIT) virtual machine (VM) access 

Threat actors actively hunt accessible machines with open management ports, like RDP or SSH. All of your virtual machines are potential targets for an attack. When a VM is successfully compromised, it's used as the entry point to attack further resources within your environment.

When you enable Microsoft Defender for Servers, you can use just-in-time VM access to lock down the inbound traffic to your VMs. This reduces exposure to attacks and provides easy access to connect to VMs when needed. Learn more about [JIT VM access](just-in-time-access-overview.md).

#### Adaptive network hardening (ANH)

Applying network security groups (NSG) to filter traffic to and from resources, improves your network security posture. However, there can still be some cases in which the actual traffic flowing through the NSG is a subset of the NSG rules defined. In these cases, further improving the security posture can be achieved by hardening the NSG rules, based on the actual traffic patterns.

Adaptive network hardening provides recommendations to further harden the NSG rules. It uses a machine learning algorithm that factors in actual traffic, known trusted configuration, threat intelligence, and other indicators of compromise. ANH then provides recommendations to allow traffic only from specific IP and port tuples. Learn how to [improve your network security posture with adaptive network hardening](adaptive-network-hardening.md).

#### Docker host hardening

Defender for Cloud identifies containers hosted on IaaS Linux VMs, or other Linux machines running Docker containers that are not managed. Defender for Cloud continuously assesses the configurations of these containers. It then compares them with the Center for Internet Security (CIS) Docker Benchmark. Defender for Cloud includes the entire ruleset of the CIS Docker Benchmark and alerts you if your containers don't satisfy any of the controls. For more information, see [Harden your Docker hosts](harden-docker-hosts.md).

#### Fileless attack detection

Fileless attacks inject malicious payloads into memory to avoid detection by disk-based scanning techniques. The attacker’s payload then persists within the memory of compromised processes and performs a wide range of malicious activities.

With fileless attack detection, automated memory forensic techniques identify fileless attack toolkits, techniques, and behaviors. This solution periodically scans your machine at runtime, and extracts insights directly from the memory of processes. Specific insights include the identification of: 

- Well-known toolkits and crypto mining software 

- Shellcode - a small piece of code typically used as the payload in the exploitation of a software vulnerability.

- Injected malicious executable in process memory

Fileless attack detection generates detailed security alerts that include descriptions with process metadata such as network activity. These details accelerate alert triage, correlation, and downstream response time. This approach complements event-based EDR solutions, and provides increased detection coverage.

For details of the fileless attack detection alerts, see the [Reference table of alerts](alerts-reference.md#alerts-windows).

#### Linux auditd alerts and Log Analytics agent integration (Linux only)

The auditd system consists of a kernel-level subsystem, which is responsible for monitoring system calls. It filters them by a specified rule set, and writes messages for them to a socket. Defender for Cloud integrates functionalities from the auditd package within the Log Analytics agent. This integration enables collection of auditd events in all supported Linux distributions, without any prerequisites.

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

## Learn more

To learn more about Defender for Servers, you can check out the following blogs:

- [Security posture management and server protection for AWS and GCP are now generally available](https://techcommunity.microsoft.com/t5/microsoft-defender-for-cloud/security-posture-management-and-server-protection-for-aws-and/ba-p/3271388)

- [Microsoft Defender for Cloud Server Monitoring Dashboard](https://techcommunity.microsoft.com/t5/microsoft-defender-for-cloud/microsoft-defender-for-cloud-server-monitoring-dashboard/ba-p/2869658)


For related material, see the following page:

- Whether Defender for Cloud generates an alert or receives an alert from a different security product, you can export alerts from Defender for Cloud. To export your alerts to Microsoft Sentinel, any third-party SIEM, or any other external tool, follow the instructions in [Exporting alerts to a SIEM](continuous-export.md).

## Next steps

In this article, you learned about Microsoft Defender for Servers. 

> [!div class="nextstepaction"]
> [Enable enhanced protections](enable-enhanced-security.md)
