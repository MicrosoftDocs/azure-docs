---
title: Overview of Microsoft Defender for Servers 
description: Learn about the benefits and features of Microsoft Defender for Servers.
author: bmansheim
ms.author: benmansheim
ms.date: 06/22/2022
ms.topic: conceptual
ms.custom: ignite-2022
---
# Overview of Microsoft Defender for Servers

Microsoft Defender for Servers is one of the plans provided by Microsoft Defender for Cloud's [enhanced security features](enhanced-security-features-overview.md). Defender for Servers protects your Windows and Linux machines in Azure, AWS, GCP, and on-premises.

- Watch a [Defender for Servers introduction](episode-five.md) in our Defender for Cloud in the Field series.
- Get pricing details for [Defender for Servers](https://azure.microsoft.com/pricing/details/defender-for-cloud/).
- [Enable Defender for Servers on your subscriptions](enable-enhanced-security.md).

## Defender for Servers plans

Defender for Servers provides two plans you can choose from:

- **Plan 1**
    - **MDE Integration**: Plan 1 integrates with [Microsoft Defender for Endpoint Plan 2](/microsoft-365/security/defender-endpoint/defender-endpoint-plan-1-2) to provide a full endpoint detection and response (EDR) solution for machines running a [range of operating systems](/microsoft-365/security/defender-endpoint/minimum-requirements). Defender for Endpoint features include:
        - [Reducing the attack surface](/microsoft-365/security/defender-endpoint/overview-attack-surface-reduction) for machines.
        - Providing [antivirus](/microsoft-365/security/defender-endpoint/next-generation-protection) capabilities.
        - Threat management, including [threat hunting](/microsoft-365/security/defender-endpoint/advanced-hunting-overview), [detection](/microsoft-365/security/defender-endpoint/overview-endpoint-detection-response), [analytics](/microsoft-365/security/defender-endpoint/threat-analytics), and [automated investigation and response](/microsoft-365/security/defender-endpoint/overview-endpoint-detection-response).
    - **Provisioning**: Automatically provisions the Defender for Endpoint sensor on every supported machine that's connected to Defender for Cloud.
    - **Licensing**: Charges Defender for Endpoint licenses per hour instead of per seat, lowering costs by protecting virtual machines only when they are in use.
- **Plan 2**
    - **Plan 1**: Includes everything in Defender for Servers Plan 1.
    - **Additional features**: All other enhanced Defender for Servers security features.

## Plan features

The following table summarizes what's included in each plan.

| Feature | Details | Defender for Servers Plan 1 | Defender for Servers Plan 2 |
|:---|:---|:---:|:---:|
| **Unified view** | The Defender for Cloud portal displays Defender for Endpoint alerts. You can then drill down into Defender for Endpoint portal, with additional information such as the alert process tree, the incident graph, and a detailed machine timeline showing historical data up to six months.| :::image type="icon" source="./media/icons/yes-icon.png"::: | :::image type="icon" source="./media/icons/yes-icon.png"::: |
| **Automatic MDE provisioning** | Automatic provisioning of Defender for Endpoint on Azure, AWS, and GCP resources. | :::image type="icon" source="./media/icons/yes-icon.png"::: | :::image type="icon" source="./media/icons/yes-icon.png"::: |
| **Microsoft threat and vulnerability management** |  Discover vulnerabilities and misconfigurations in real time with Microsoft Defender for Endpoint, without needing  other agents or periodic scans. [Learn more](deploy-vulnerability-assessment-tvm.md). | :::image type="icon" source="./media/icons/yes-icon.png"::: | :::image type="icon" source="./media/icons/yes-icon.png"::: |
| **Fileless attack detection** | Fileless attack detection in Defender for Servers and Microsoft Defender for Endpoint (MDE) generate detailed security alerts that accelerate alert triage, correlation, and downstream response time. | :::image type="icon" source="./media/icons/yes-icon.png"::: <br>(Provided by MDE) | :::image type="icon" source="./media/icons/yes-icon.png"::: <br>(Provided by MDE & Defender for Servers) |
| **Threat detection for OS and network** | Defender for Servers and Microsoft Defender for Endpoint (MDE) detect threats at the OS and network levels, including VM behavioral detections. | :::image type="icon" source="./media/icons/yes-icon.png"::: <br>(Provided by MDE) | :::image type="icon" source="./media/icons/yes-icon.png"::: <br>(Provided by MDE & Defender for Servers) |
| **Threat detection for the control plane** | Defender for Servers detects threats directed at the control plane, including network-based detections. | | :::image type="icon" source="./media/icons/yes-icon.png"::: |
| **Security Policy and Regulatory Compliance** | Customize a security policy for your subscription and also compare the configuration of your resources with requirements in industry standards, regulations, and benchmarks. | | :::image type="icon" source="./media/icons/yes-icon.png"::: |
| **Integrated vulnerability assessment powered by Qualys** | Use the Qualys scanner for real-time identification of vulnerabilities in Azure and hybrid VMs. Everything's handled by Defender for Cloud. You don't need a Qualys license or even a Qualys account. [Learn more](deploy-vulnerability-assessment-vm.md). | | :::image type="icon" source="./media/icons/yes-icon.png"::: |
| **Log Analytics 500 MB free data ingestion** | Defender for Cloud leverages Azure Monitor to collect data from Azure VMs and servers, using the Log Analytics agent. | | :::image type="icon" source="./media/icons/yes-icon.png"::: |
| **Adaptive application controls (AAC)** | [AACs](adaptive-application-controls.md) in Defender for Cloud define allowlists of known safe applications for machines.  | |:::image type="icon" source="./media/icons/yes-icon.png"::: |
| **File Integrity Monitoring (FIM)** | [FIM](file-integrity-monitoring-overview.md) (change monitoring) examines files and registries for changes that might indicate an attack. A comparison method is used to determine whether suspicious modifications have been made to files. | | :::image type="icon" source="./media/icons/yes-icon.png"::: |
| **Just-in-time VM access for management ports** | Defender for Cloud provides [JIT access](just-in-time-access-overview.md), locking down machine ports to reduce the machine's attack surface.| | :::image type="icon" source="./media/icons/yes-icon.png"::: |
| **Adaptive network hardening** | Filtering traffic to and from resources with network security groups (NSG) improves your network security posture. You can further improve security by [hardening the NSG rules](adaptive-network-hardening.md) based on actual traffic patterns. | | :::image type="icon" source="./media/icons/yes-icon.png"::: |
| **Docker host hardening** | Defender for Cloud assesses containers hosted on Linux machines running Docker containers, and compares them with the Center for Internet Security (CIS) Docker Benchmark. [Learn more](harden-docker-hosts.md). | | :::image type="icon" source="./media/icons/yes-icon.png"::: |
<!-- 
 [Learn more](fileless-attack-detection.md).
| Future – TVM P2 | | :::image type="icon" source="./media/icons/yes-icon.png"::: |
| Future – disk scanning insights | | :::image type="icon" source="./media/icons/yes-icon.png"::: | -->

> [!NOTE]
> If you only enable Defender for Cloud at the workspace level, Defender for Cloud won't enable just-in-time VM access, adaptive application controls, and network detections for Azure resources.

Want to learn more? Watch an overview of enhanced workload protection features in Defender for Servers in our [Defender for Cloud in the Field](episode-twelve.md) series.

## Provisioning 

When you enable Defender for Servers Plan 1 or Plan 2 and then enable Defender for Endpoint unified integration, the Defender for Endpoint agent is automatically provisioned on all supported machines in the subscription.

- Azure Windows machines: Defender for Cloud deploys the MDE.Windows extension. The extension provisions Defender for Endpoint and connects it to the Defender for Endpoint backend.
- Azure Linux machines: Defender for Cloud collects audit records from Linux machines by using auditd, one of the most common Linux auditing frameworks. For a list of the Linux alerts, see the [Reference table of alerts](alerts-reference.md#alerts-linux).
- On-premises: Defender for Cloud integrates with [Azure Arc](../azure-arc/index.yml) using the Azure Connected Machine agent. Learn how to [connect your on-premises machines](quickstart-onboard-machines.md) to Microsoft Defender for Cloud.
- Multicloud: Defender for Cloud uses [Azure Arc](../azure-arc/index.yml) to ensure these non-Azure machines are seen as Azure resources. Learn how to [connect your AWS accounts](quickstart-onboard-aws.md) and your [GCP accounts](quickstart-onboard-gcp.md) to Microsoft Defender for Cloud.

> [!TIP]
> For details of which Defender for Servers features are relevant for machines running on other cloud environments, see [Supported features for virtual machines and servers](supported-machines-endpoint-solutions-clouds-servers.md?tabs=features-windows#supported-features-for-virtual-machines-and-servers).

## Simulating alerts

You can simulate alerts by downloading one of the following playbooks:

- For Windows: [Microsoft Defender for Cloud Playbook: Security Alerts](https://github.com/Azure/Azure-Security-Center/blob/master/Simulations/Azure%20Security%20Center%20Security%20Alerts%20Playbook_v2.pdf)

- For Linux: [Microsoft Defender for Cloud Playbook: Linux Detections](https://github.com/Azure/Azure-Security-Center/blob/master/Simulations/Azure%20Security%20Center%20Linux%20Detections_v2.pdf).

## Learn more

You can check out the following blogs:

- [Security posture management and server protection for AWS and GCP are now generally available](https://techcommunity.microsoft.com/t5/microsoft-defender-for-cloud/security-posture-management-and-server-protection-for-aws-and/ba-p/3271388)

- [Microsoft Defender for Cloud Server Monitoring Dashboard](https://techcommunity.microsoft.com/t5/microsoft-defender-for-cloud/microsoft-defender-for-cloud-server-monitoring-dashboard/ba-p/2869658)

- [Export alerts to a SIEM](continuous-export.md)

## Next steps

In this article, you learned about Microsoft Defender for Servers. 

> [!div class="nextstepaction"]
> [Enable enhanced protections](enable-enhanced-security.md)
