---
title: Select a Defender for Servers plan
description: Select a Defender for Servers plan to protect Azure, AWS, GCP servers, and on-premises machines.
ms.topic: conceptual
ms.date: 11/06/2022
---
# Select a Defender for Servers plan

This article helps you select which Defender for Servers plan is right for your organization. Defender for Servers is one of the paid plans provided by [Microsoft Defender for Cloud](defender-for-cloud-introduction.md).


## Before you start 

This article is the fourth part of the Defender for Servers planning guide. Before you begin, review:

1. [Start planning your deployment](plan-defender-for-servers.md)
1. [Understand where you data is stored and Log Analytics workspace requirements](plan-defender-for-servers-data-workspace.md)
1. [Review access and role requirements](plan-defender-for-servers-roles.md)


## Review plans

Defender for Servers provides two plans you can choose from.

- **Defender for Servers Plan 1** is entry-level, and must be enabled at the subscription level. Features include:
    -  [Foundational cloud security posture management (CSPM)](concept-cloud-security-posture-management.md#defender-cspm-plan-options), provided by free by Defender for Cloud.
        - These features are available without a Defender for Cloud plan enabled for Azure VMs, and AWS/GCP machines.
        - To receive recommendations about your on-premises machine configuration, machines must be Azure Arc-enabled, with Defender for Servers enabled.
    - Endpoint detection and response (EDR) features provided by [Microsoft Defender for Endpoint Plan 2](/microsoft-365/security/defender-endpoint/defender-endpoint-plan-1-2).
- **Defender for Servers Plan 2** provides all features. It must be enabled at the subscription level, and at the workspace level to get full feature coverage. Features include:
    - All the functionality provided by Defender for Servers Plan 1.
    - Additional extended detection and response (XDR) capabilities.
  
## Plan features

| Feature | Details | Plan 1 | Plan 2 |
|:---|:---|:---:|:---:|
| **Defender for Endpoint integration** | Defender for Servers integrates with Defender for Endpoint and protects servers with all the features, including:<br/><br/>- [Attack surface reduction](/microsoft-365/security/defender-endpoint/overview-attack-surface-reduction) to lower the risk of attack.<br/><br/> - [Next-generation protection](/microsoft-365/security/defender-endpoint/next-generation-protection), including real-time scanning/protection and [Microsoft Defender Antivirus](/microsoft-365/security/defender-endpoint/next-generation-protection).<br/><br/> - EDR including [threat analytics](/microsoft-365/security/defender-endpoint/threat-analytics), [automated investigation and response](/microsoft-365/security/defender-endpoint/automated-investigations), [advanced hunting](/microsoft-365/security/defender-endpoint/advanced-hunting-overview), and [Microsoft Defender Experts](/microsoft-365/security/defender-endpoint/microsoft-threat-experts).<br/><br/> - Vulnerability assessment/mitigation, provided by Defender for Endpoint's integration with [Microsoft Defender Vulnerability Management](/microsoft-365/security/defender-vulnerability-management/defender-vulnerability-management-capabilities) | :::image type="icon" source="./media/icons/yes-icon.png"::: | :::image type="icon" source="./media/icons/yes-icon.png"::: |
| **Licensing** | Defender for Server charges Defender for Endpoint licenses per hour instead of per seat, lowering costs by protecting virtual machines only when they're in use.| :::image type="icon" source="./media/icons/yes-icon.png"::: | :::image type="icon" source="./media/icons/yes-icon.png"::: |
| **Defender for Endpoint provisioning** | Defender for Servers automatically provisions the Defender for Endpoint sensor on every supported machine that's connected to Defender for Cloud.| :::image type="icon" source="./media/icons/yes-icon.png"::: | :::image type="icon" source="./media/icons/yes-icon.png"::: | 
| **Unified view** | Defender for Endpoint alerts display in the Defender for Cloud portal. You can drill down into the Defender for Endpoint portal for more information.| :::image type="icon" source="./media/icons/yes-icon.png"::: | :::image type="icon" source="./media/icons/yes-icon.png"::: |
| **Qualys vulnerability assess** | <p style="color:red">As an alternative to Microsoft Defender Vulnerability Management, Defender for Cloud integrates with the Qualys scanner to [identify vulnerabilities](deploy-vulnerability-assessment-vm.md). You don't need a Qualys license or account.</p> | | :::image type="icon" source="./media/icons/yes-icon.png"::: |
**Adaptive application controls** | [Adaptive application controls](adaptive-application-controls.md) define allowlists of known safe applications for machines. Defender for Cloud must be enabled on a subscription to use this feature. | |:::image type="icon" source="./media/icons/yes-icon.png"::: |
| **Free data ingestion (500 MB) in workspaces** | <p style="color:red">Free data ingestion is available for [specific data types](#what-data-types-are-included-in-the-500-mb-data-daily-allowance), calculated per node, per reported workspace, per day, and available for every workspace that has a *Security* or *AntiMalware* solution installed.</p> | | :::image type="icon" source="./media/icons/yes-icon.png"::: |
| **Just-in-time VM access** | <p style="color:red">[Just-in-time VM access](just-in-time-access-overview.md) locks down machine ports to reduce the attack surface.</p> Defender for Cloud must be enabled on a subscription to use this feature. | | :::image type="icon" source="./media/icons/yes-icon.png"::: |
| **Adaptive network hardening** | Network hardening filters traffic to and from resources with network security groups (NSG) to improve your network security posture. Further improve security by [hardening the NSG rules](adaptive-network-hardening.md) based on actual traffic patterns. Defender for Cloud must be enabled on a subscription to use this feature. | | :::image type="icon" source="./media/icons/yes-icon.png"::: |
| **File Integrity Monitoring** | [File integrity monitoring](file-integrity-monitoring-overview.md) examines files and registries for changes that might indicate an attack. A comparison method is used to determine whether suspicious modifications have been made to files. | | :::image type="icon" source="./media/icons/yes-icon.png"::: |
| **Threat detection at the OS level and network layer (including fileless attack detection)** | Detailed security alerts are issued as threats are detected. | :::image type="icon" source="./media/icons/yes-icon.png"::: <br/>Provided by Defender for Endpoint | :::image type="icon" source="./media/icons/yes-icon.png":::<br/> Provided by Defender for Endpoint/Defender for Servers |
| **Docker host hardening** | Assess containers hosted on Linux machines running Docker containers, and compares them with the Center for Internet Security (CIS) Docker Benchmark. [Learn more](harden-docker-hosts.md). | | :::image type="icon" source="./media/icons/yes-icon.png"::: 
[Network map](protect-network-resources.md) | Provides a geographical view of recommendations for hardening your network resources. | | :::image type="icon" source="./media/icons/yes-icon.png":::
[Agentless scanning](concept-agentless-data-collection.md) | Scans Azure VMs, using cloud APIs to collect data | | :::image type="icon" source="./media/icons/yes-icon.png":::

## Select a vulnerability assessment solution

There are a couple of vulnerability assessment options available in Defender for Servers.

- [Microsoft Defender Vulnerability Management](/microsoft-365/security/defender-vulnerability-management/defender-vulnerability-management-capabilities): Integrated with Defender for Endpoint.
    - Available in both Defender for Servers Plan 1 and Plan 2.
    - Enabled by default on machines onboarded to Defender for Endpoint, if [Defender for Endpoint has Defender Vulnerability Management](/microsoft-365/security/defender-vulnerability-management/get-defender-vulnerability-management) enabled.
    - Has the same [Windows](/microsoft-365/security/defender-endpoint/configure-server-endpoints#prerequisites), [Linux](/microsoft-365/security/defender-endpoint/microsoft-defender-endpoint-linux#prerequisites), and [network](/microsoft-365/security/defender-endpoint/configure-proxy-internet#enable-access-to-microsoft-defender-for-endpoint-service-urls-in-the-proxy-server) prerequisites as Defender for Endpoint.
    - No additional software installation is needed.
- [Qualys vulnerability scanner](deploy-vulnerability-assessment-vm.md): Provided by Defender for Cloud's Qualys integration.
    - Available only in Defender for Servers Plan 2.
    - A great fit if you're using a third-party EDR solution, or a Fanotify-based solution, which might mean you can't deploy Defender for Endpoint for vulnerability assessment.
    - The integrated Defender for Cloud Qualys solution doesn't support a proxy configuration, and can't connect to an existing Qualys deployment. Vulnerability findings are only available in Defender for Cloud.


## Next steps

After working through these planning steps, [review Azure Arc, and agent/extension requirements](plan-defender-for-servers-agents.md).

