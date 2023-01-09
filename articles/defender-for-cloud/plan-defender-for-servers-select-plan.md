---
title: Select a Microsoft Defender for Servers plan with Microsoft Defender for Cloud
description: Select a Defender for Servers plan to protect Azure, AWS, GCP servers, and on-premises machines.
ms.topic: conceptual
ms.author: benmansheim
author: bmansheim
ms.date: 11/06/2022
---
# Select a Defender for Servers plan

This article helps you select which Microsoft Defender for Servers plan is right for your organization. Defender for Servers is one of the paid plans provided by [Microsoft Defender for Cloud](defender-for-cloud-introduction.md).


## Before you start 

This article is the fourth in the Defender for Servers planning guide series. Before you begin, review the earlier articles:

1. [Start planning your deployment](plan-defender-for-servers.md)
1. [Understand where your data is stored, and Log Analytics workspace requirements](plan-defender-for-servers-data-workspace.md)
1. [Review access and role requirements](plan-defender-for-servers-roles.md)


## Review plans

Defender for Servers provides two plans you can choose from.

- **Defender for Servers Plan 1** is entry-level, and must be enabled at the subscription level. Features include:
    -  [Foundational cloud security posture management (CSPM)](concept-cloud-security-posture-management.md#defender-cspm-plan-options), which is provided for free by Defender for Cloud.
        - For Azure VMs, and AWS/GCP machines, you don't need a Defender for Cloud plan enabled to use foundational CSPM features.
        - For on-premises server, to receive configuration recommendations machines must be onboarded to Azure with Azure Arc, and Defender for Servers must be enabled.
    - Endpoint detection and response (EDR) features that are provided by [Microsoft Defender for Endpoint Plan 2](/microsoft-365/security/defender-endpoint/defender-endpoint-plan-1-2).
- **Defender for Servers Plan 2** provides all features. It must be enabled at the subscription level and at the workspace level to get full feature coverage. Features include:
    - All the functionality provided by Defender for Servers Plan 1.
    - Additional extended detection and response (XDR) capabilities.
  
## Plan features

| Feature | Details | Plan 1 | Plan 2 |
|:---|:---|:---:|:---:|
| **Defender for Endpoint integration** | Defender for Servers integrates with Defender for Endpoint and protects servers with all the features, including:<br/><br/>- [Attack surface reduction](/microsoft-365/security/defender-endpoint/overview-attack-surface-reduction) to lower the risk of attack.<br/><br/> - [Next-generation protection](/microsoft-365/security/defender-endpoint/next-generation-protection), including real-time scanning/protection and [Microsoft Defender Antivirus](/microsoft-365/security/defender-endpoint/next-generation-protection).<br/><br/> - EDR including [threat analytics](/microsoft-365/security/defender-endpoint/threat-analytics), [automated investigation and response](/microsoft-365/security/defender-endpoint/automated-investigations), [advanced hunting](/microsoft-365/security/defender-endpoint/advanced-hunting-overview), and [Microsoft Defender Experts](/microsoft-365/security/defender-endpoint/endpoint-attack-notifications).<br/><br/> - Vulnerability assessment/mitigation, provided by Defender for Endpoint's integration with [Microsoft Defender Vulnerability Management](/microsoft-365/security/defender-vulnerability-management/defender-vulnerability-management-capabilities) | :::image type="icon" source="./media/icons/yes-icon.png" alt-text="Icon that shows it's supported in Plan 1."::: | :::image type="icon" source="./media/icons/yes-icon.png" alt-text="Icon that shows it's supported in Plan 2."::: |
| **Licensing** | Defender for Servers covers licensing for Defender for Endpoint, and is charged per hour instead of per seat, lowering costs by protecting virtual machines only when they're in use.| :::image type="icon" source="./media/icons/yes-icon.png" alt-text="Icon that shows it's supported in Plan 1."::: | :::image type="icon" source="./media/icons/yes-icon.png" alt-text="Icon that shows it's supported in Plan 2."::: |
| **Defender for Endpoint provisioning** | Defender for Servers automatically provisions the Defender for Endpoint sensor on every supported machine that's connected to Defender for Cloud.| :::image type="icon" source="./media/icons/yes-icon.png" alt-text="Icon that shows it's supported in Plan 1."::: | :::image type="icon" source="./media/icons/yes-icon.png" alt-text="Icon that shows it's supported in Plan 2."::: | 
| **Unified view** | Defender for Endpoint alerts display in the Defender for Cloud portal. You can drill down into the Defender for Endpoint portal for more information.| :::image type="icon" source="./media/icons/yes-icon.png" alt-text="Icon that shows it's supported in Plan 1."::: | :::image type="icon" source="./media/icons/yes-icon.png" alt-text="Icon that shows it's supported in Plan 2."::: |
| **Threat detection for OS-level (Agent-based)** | Defender for Servers and Microsoft Defender for Endpoint (MDE) detect threats at the OS level, including VM behavioral detections and **Fileless attack detection**, which generates detailed security alerts that accelerate alert triage, correlation, and downstream response time.<br>[Learn more](alerts-reference.md#alerts-windows) | :::image type="icon" source="./media/icons/yes-icon.png"::: | :::image type="icon" source="./media/icons/yes-icon.png" alt-text="Icon that shows it's supported in Plan 2."::: |
| **Threat detection for network-level (Agentless)** | Defender for Servers detects threats directed at the control plane on the network, including network-based detections for Azure virtual machines. | Not supported in Plan 1 | :::image type="icon" source="./media/icons/yes-icon.png" alt-text="Icon that shows it's supported in Plan 2."::: |
| **Microsoft Defender Vulnerability Management Add-on** | See a deeper analysis of the security posture of your protected servers, including risks related to browser extensions, network shares, and digital certificates. [Learn more](deploy-vulnerability-assessment-defender-vulnerability-management.md). | Not supported in Plan 1 | :::image type="icon" source="./media/icons/yes-icon.png" alt-text="Icon that shows it's supported in Plan 2."::: |
| **[Qualys vulnerability assessment](deploy-vulnerability-assessment-vm.md)** | As an alternative to Microsoft Defender Vulnerability Management, Defender for Cloud integrates with the Qualys scanner to identify vulnerabilities. You don't need a Qualys license or account. | Not supported in Plan 1 | :::image type="icon" source="./media/icons/yes-icon.png" alt-text="Icon that shows it's supported in Plan 2.":::|
**[Adaptive application controls](adaptive-application-controls.md)** | Adaptive application controls define allowlists of known safe applications for machines. Defender for Cloud must be enabled on a subscription to use this feature. | Not supported in Plan 1 |:::image type="icon" source="./media/icons/yes-icon.png" alt-text="Icon that shows it's supported in Plan 2."::: |
| **Free data ingestion (500 MB) in workspaces** | Free data ingestion is available for [specific data types](faq-defender-for-servers.yml#what-data-types-are-included-in-the-daily-allowance-), calculated per node, per reported workspace, per day, and available for every workspace that has a *Security* or *AntiMalware* solution installed. | Not supported in Plan 1 | :::image type="icon" source="./media/icons/yes-icon.png" alt-text="Icon that shows it's supported in Plan 2."::: |
| **[Just-in-time VM access](just-in-time-access-overview.md)** | Just-in-time VM access locks down machine ports to reduce the attack surface. Defender for Cloud must be enabled on a subscription to use this feature. | Not supported in Plan 1 | :::image type="icon" source="./media/icons/yes-icon.png" alt-text="Icon that shows it's supported in Plan 2."::: |
| **[Adaptive network hardening](adaptive-network-hardening.md)** | Network hardening filters traffic to and from resources with network security groups (NSG) to improve your network security posture. Further improve security by hardening the NSG rules based on actual traffic patterns. Defender for Cloud must be enabled on a subscription to use this feature. | Not supported in Plan 1 | :::image type="icon" source="./media/icons/yes-icon.png" alt-text="Icon that shows it's supported in Plan 2."::: |
| **[File Integrity Monitoring](file-integrity-monitoring-overview.md)** | File integrity monitoring examines files and registries for changes that might indicate an attack. A comparison method is used to determine whether suspicious modifications have been made to files. | Not supported in Plan 1 | :::image type="icon" source="./media/icons/yes-icon.png" alt-text="Icon that shows it's supported in Plan 2."::: |
| **[Docker host hardening](harden-docker-hosts.md)** | Assesses containers hosted on Linux machines running Docker containers, and compares them with the Center for Internet Security (CIS) Docker Benchmark. | Not supported in Plan 1 | :::image type="icon" source="./media/icons/yes-icon.png" alt-text="Icon that shows it's supported in Plan 2."::: |
[Network map](protect-network-resources.md) | Provides a geographical view of recommendations for hardening your network resources. | Not supported in Plan 1| :::image type="icon" source="./media/icons/yes-icon.png" alt-text="Icon that shows it's supported in Plan 2."::: |
[Agentless scanning](concept-agentless-data-collection.md) | Scans Azure VMs, using cloud APIs to collect data | Not supported in Plan 1 | :::image type="icon" source="./media/icons/yes-icon.png" alt-text="Icon that shows it's supported in Plan 2.":::

## Select a vulnerability assessment solution

There are a couple of vulnerability assessment options available in Defender for Servers.

- [Microsoft Defender Vulnerability Management](/microsoft-365/security/defender-vulnerability-management/defender-vulnerability-management-capabilities): Integrated with Defender for Endpoint.
    - Available in both Defender for Servers Plan 1 and Plan 2.
    - It's enabled by default on machines onboarded to Defender for Endpoint, if [Defender for Endpoint has Defender Vulnerability Management](/microsoft-365/security/defender-vulnerability-management/get-defender-vulnerability-management) enabled.
    - Has the same [Windows](/microsoft-365/security/defender-endpoint/configure-server-endpoints#prerequisites), [Linux](/microsoft-365/security/defender-endpoint/microsoft-defender-endpoint-linux#prerequisites), and [network](/microsoft-365/security/defender-endpoint/configure-proxy-internet#enable-access-to-microsoft-defender-for-endpoint-service-urls-in-the-proxy-server) prerequisites as Defender for Endpoint.
    - No additional software installation is needed.
- [Qualys vulnerability scanner](deploy-vulnerability-assessment-vm.md): Provided by Defender for Cloud's Qualys integration.
    - Available only in Defender for Servers Plan 2.
    - A great fit if you're using a third-party EDR solution, or a Fanotify-based solution, which might mean you can't deploy Defender for Endpoint for vulnerability assessment.
    - The integrated Defender for Cloud Qualys solution doesn't support a proxy configuration, and can't connect to an existing Qualys deployment. Vulnerability findings are only available in Defender for Cloud.


## Next steps

After working through these planning steps, [review Azure Arc and agent/extension requirements](plan-defender-for-servers-agents.md).

