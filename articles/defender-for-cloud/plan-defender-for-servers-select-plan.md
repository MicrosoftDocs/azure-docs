---
title: Select a Defender for Servers plan
description: Select a Microsoft Defender for Servers plan in Microsoft Defender for Cloud to protect Azure, AWS, and GCP servers and on-premises machines.
ms.topic: conceptual
ms.author: dacurwin
author: dcurwin
ms.date: 11/06/2022
---

# Select a Defender for Servers plan

This article helps you select the Microsoft Defender for Servers plan that's right for your organization.

Defender for Servers is one of the paid plans provided by [Microsoft Defender for Cloud](defender-for-cloud-introduction.md).

## Before you begin

This article is the *fourth* article in the Defender for Servers planning guide. Before you begin, review the earlier articles:

1. [Start planning your deployment](plan-defender-for-servers.md)
1. [Understand where your data is stored and Log Analytics workspace requirements](plan-defender-for-servers-data-workspace.md)
1. [Review access and role requirements](plan-defender-for-servers-roles.md)

## Review plans

You can choose from two Defender for Servers paid plans:

- **Defender for Servers Plan 1** is entry-level and must be enabled at the subscription level. Features include:

  - [Foundational cloud security posture management (CSPM)](concept-cloud-security-posture-management.md#defender-cspm-plan-options), which is provided free by Defender for Cloud.

    - For Azure virtual machines and Amazon Web Services (AWS) and Google Cloud Platform (GCP) machines, you don't need a Defender for Cloud plan enabled to use foundational CSPM features.
    - For on-premises server, to receive configuration recommendations machines must be onboarded to Azure with Azure Arc, and Defender for Servers must be enabled.

  - Endpoint detection and response (EDR) features that are provided by [Microsoft Defender for Endpoint Plan 2](/microsoft-365/security/defender-endpoint/defender-endpoint-plan-1-2).

- **Defender for Servers Plan 2** provides all features. The plan must be enabled at the subscription level and at the workspace level to get full feature coverage. Features include:

  - All the functionality that's provided by Defender for Servers Plan 1.
  - More extended detection and response (XDR) capabilities.

> [!NOTE]
> Plan 1 and Plan 2 for Defender for Servers aren't the same as Plan 1 and Plan 2 for Defender for Endpoint.

## Plan features

| Feature | Details | Plan 1 | Plan 2 |
|:---|:---|:---:|:---:|
| **Defender for Endpoint integration** | Defender for Servers integrates with Defender for Endpoint and protects servers with all the features, including:<br/><br/>- [Attack surface reduction](/microsoft-365/security/defender-endpoint/overview-attack-surface-reduction) to lower the risk of attack.<br/><br/> - [Next-generation protection](/microsoft-365/security/defender-endpoint/next-generation-protection), including real-time scanning and protection and [Microsoft Defender Antivirus](/microsoft-365/security/defender-endpoint/next-generation-protection).<br/><br/> - EDR, including [threat analytics](/microsoft-365/security/defender-endpoint/threat-analytics), [automated investigation and response](/microsoft-365/security/defender-endpoint/automated-investigations), [advanced hunting](/microsoft-365/security/defender-endpoint/advanced-hunting-overview), and [Microsoft Defender Experts](/microsoft-365/security/defender-endpoint/endpoint-attack-notifications).<br/><br/> - Vulnerability assessment and mitigation provided by [Microsoft Defender Vulnerability Management (MDVM)](/microsoft-365/security/defender-vulnerability-management/defender-vulnerability-management-capabilities) as part of the Defender for Endpoint integration. With Plan 2, you can get premium MDVM features, provided by the [MDVM add-on](/microsoft-365/security/defender-vulnerability-management/defender-vulnerability-management-capabilities#vulnerability-managment-capabilities-for-servers).| :::image type="icon" source="./media/icons/yes-icon.png" ::: | :::image type="icon" source="./media/icons/yes-icon.png"::: |
| **Licensing** | Defender for Servers covers licensing for Defender for Endpoint. Licensing is charged per hour instead of per seat, lowering costs by protecting virtual machines only when they're in use.| :::image type="icon" source="./media/icons/yes-icon.png"::: | :::image type="icon" source="./media/icons/yes-icon.png"::: |
| **Defender for Endpoint provisioning** | Defender for Servers automatically provisions the Defender for Endpoint sensor on every supported machine that's connected to Defender for Cloud.| :::image type="icon" source="./media/icons/yes-icon.png"::: | :::image type="icon" source="./media/icons/yes-icon.png"::: |
| **Unified view** | Defender for Endpoint alerts appear in the Defender for Cloud portal. You can get detailed information in the Defender for Endpoint portal.| :::image type="icon" source="./media/icons/yes-icon.png"::: | :::image type="icon" source="./media/icons/yes-icon.png"::: |
| **Threat detection for OS-level (agent-based)** | Defender for Servers and Defender for Endpoint detect threats at the OS level, including virtual machine behavioral detections and *fileless attack detection*, which generates detailed security alerts that accelerate alert triage, correlation, and downstream response time.<br><br />[Learn more about alerts for Windows machines](alerts-reference.md#alerts-windows)<br /><br />[Learn more about alerts for Linux machines](alerts-reference.md#alerts-linux)<br /><br /><br />[Learn more about alerts for DNS](alerts-reference.md#alerts-dns) | :::image type="icon" source="./media/icons/yes-icon.png":::</br>[Provided by MDE](/microsoft-365/security/defender-endpoint/overview-endpoint-detection-response) | :::image type="icon" source="./media/icons/yes-icon.png"::: |
| **Threat detection for network-level (agentless security alerts)** | Defender for Servers detects threats that are directed at the control plane on the network, including network-based security alerts for Azure virtual machines. | Not supported in Plan 1 | :::image type="icon" source="./media/icons/yes-icon.png"::: |
| **Microsoft Defender Vulnerability Management (MDVM) Add-on** | Enhance your vulnerability management program consolidated asset inventories, security baselines assessments, application block feature, and more. [Learn more](deploy-vulnerability-assessment-defender-vulnerability-management.md). | Not supported in Plan 1 | :::image type="icon" source="./media/icons/yes-icon.png"::: |
| **Security Policy and Regulatory Compliance** | Customize a security policy for your subscription and also compare the configuration of your resources with requirements in industry standards, regulations, and benchmarks. Learn more about [regulatory compliance](regulatory-compliance-dashboard.md) and [security policies](security-policy-concept.md) | Not supported in Plan 1 | :::image type="icon" source="./media/icons/yes-icon.png":::|
| **[Qualys vulnerability assessment](deploy-vulnerability-assessment-vm.md)** | As an alternative to Defender Vulnerability Management, Defender for Cloud can deploy a Qualys scanner and display the findings. You don't need a Qualys license or account. | Not supported in Plan 1 | :::image type="icon" source="./media/icons/yes-icon.png":::|
|**[Adaptive application controls](adaptive-application-controls.md)** | Adaptive application controls define allowlists of known safe applications for machines. To use this feature, Defender for Cloud must be enabled on the subscription. | Not supported in Plan 1 |:::image type="icon" source="./media/icons/yes-icon.png"::: |
| **Free data ingestion (500 MB) to Log Analytics workspaces** | Free data ingestion is available for [specific data types](faq-defender-for-servers.yml#what-data-types-are-included-in-the-daily-allowance-) to Log Analytics workspaces. Data ingestion is calculated per node, per reported workspace, and per day. It's available for every workspace that has a *Security* or *AntiMalware* solution installed. | Not supported in Plan 1 | :::image type="icon" source="./media/icons/yes-icon.png"::: |
| **Free Azure Update Manager Remediation for Arc machines** | [Azure Update Manager remediation of unhealthy resources and recommendations](../update-center/update-manager-faq.md#im-a-defender-for-server-customer-and-use-update-recommendations-powered-by-azure-update-manager-namely-periodic-assessment-should-be-enabled-on-your-machines-and-system-updates-should-be-installed-on-your-machines-would-i-be-charged-for-azure-update-manager) is available at no additional cost for Arc enabled machines. | Not supported in Plan 1 | :::image type="icon" source="./media/icons/yes-icon.png"::: |
| **[Just-in-time virtual machine access](just-in-time-access-overview.md)** | Just-in-time virtual machine access locks down machine ports to reduce the attack surface. To use this feature, Defender for Cloud must be enabled on the subscription. | Not supported in Plan 1 | :::image type="icon" source="./media/icons/yes-icon.png"::: |
| **[Adaptive network hardening](adaptive-network-hardening.md)** | Network hardening filters traffic to and from resources by using network security groups (NSGs) to improve your network security posture. Further improve security by hardening the NSG rules based on actual traffic patterns. To use this feature, Defender for Cloud must be enabled on the subscription. | Not supported in Plan 1 | :::image type="icon" source="./media/icons/yes-icon.png"::: |
| **[File integrity monitoring](file-integrity-monitoring-overview.md)** | File integrity monitoring examines files and registries for changes that might indicate an attack. A comparison method is used to determine whether suspicious modifications have been made to files. | Not supported in Plan 1 | :::image type="icon" source="./media/icons/yes-icon.png"::: |
| **[Docker host hardening](harden-docker-hosts.md)** | Assesses containers hosted on Linux machines running Docker containers, and then compares them with the Center for Internet Security (CIS) Docker Benchmark. | Not supported in Plan 1 | :::image type="icon" source="./media/icons/yes-icon.png"::: |
|[Network map](protect-network-resources.md) | Provides a geographical view of recommendations for hardening your network resources. | Not supported in Plan 1| :::image type="icon" source="./media/icons/yes-icon.png"::: |
|[Agentless scanning](concept-agentless-data-collection.md) | Scans Azure virtual machines by using cloud APIs to collect data. | Not supported in Plan 1 | :::image type="icon" source="./media/icons/yes-icon.png":::|

>[!Note]
>Once a plan is enabled, a 30-day trial period begins. There is no way to stop, pause, or extend this trial period.
>To enjoy the full 30-day trial, make sure to plan ahead to meet your evaluation purposes.

## Select a vulnerability assessment solution

A couple of vulnerability assessment options are available in Defender for Servers:

- [Microsoft Defender Vulnerability Management](/microsoft-365/security/defender-vulnerability-management/defender-vulnerability-management-capabilities): Integrated with Defender for Endpoint.

  - Available in Defender for Servers Plan 1 and Defender for Servers Plan 2.
  - Defender Vulnerability Management is enabled by default on machines that are onboarded to Defender for Endpoint.
  - Has the same [Windows](/microsoft-365/security/defender-endpoint/configure-server-endpoints#prerequisites), [Linux](/microsoft-365/security/defender-endpoint/microsoft-defender-endpoint-linux#prerequisites), and [network](/microsoft-365/security/defender-endpoint/configure-proxy-internet#enable-access-to-microsoft-defender-for-endpoint-service-urls-in-the-proxy-server) prerequisites as Defender for Endpoint.
  - No extra software is required.

    >[!Note]
    > Microsoft Defender Vulnerability Management Add-on capabilities are included in Defender for Servers Plan 2. This provides consolidated inventories, new assessments, and mitigation tools to further enhance your vulnerability management program. To learn more, see [Vulnerability Management capabilities for servers](/microsoft-365/security/defender-vulnerability-management/defender-vulnerability-management-capabilities#vulnerability-managment-capabilities-for-servers).
    >
    > Defender Vulnerability Management add-on capabilities are only available through the [Microsoft Defender 365 portal](https://security.microsoft.com/homepage).

- [Qualys vulnerability scanner](deploy-vulnerability-assessment-vm.md): Provided by Defender for Cloud Qualys integration.

  - Available only in Defender for Servers Plan 2.
  - A great fit if you're using a third-party EDR solution or a Fanotify-based solution. In these scenarios, you might not be able to deploy the Defender for Endpoint for vulnerability assessment.
  - The integrated Defender for Cloud Qualys solution doesn't support a proxy configuration, and it can't connect to an existing Qualys deployment. Vulnerability findings are available only in Defender for Cloud.

## Next steps

After you work through these planning steps, [review Azure Arc and agent and extension requirements](plan-defender-for-servers-agents.md).

