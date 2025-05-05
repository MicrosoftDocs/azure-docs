---
title: Microsoft Sentinel in the Microsoft Defender portal
description: Learn about the Microsoft Sentinel experience when you onboard Microsoft Sentinel to the Microsoft Defender portal.
author: batamig
ms.author: bagol
ms.topic: conceptual
ms.date: 05/04/2025
appliesto: 
    - Microsoft Sentinel in the Microsoft Defender portal
ms.collection: usx-security


#Customer intent: As a security operations analyst, I want to understand the integration of Microsoft Sentinel within the Microsoft Defender portal so that I can effectively navigate and utilize the new and improved security capabilities.

---

# Microsoft Sentinel in the Microsoft Defender portal

Microsoft Defender provides a unified cybersecurity solution that integrates endpoint protection, cloud security, identity protection, email security, threat intelligence, exposure management, and SIEM into a centralized platform. It uses AI-driven defense to help organizations anticipate and stop attacks, ensuring efficient and effective security operations.

Microsoft Sentinel is generally available in the Microsoft Defender portal, either with [Microsoft Defender XDR](/microsoft-365/security/defender), or on its own, delivering a unified experience across SIEM and XDR for faster and more accurate threat detection and response, simplified workflows, and enhanced operational efficiency.

This article describes the Microsoft Sentinel experience in the Defender portal. We recommend that customers using Microsoft Sentinel in the Azure portal move into Microsoft Defender to take advantage of the unified SecOps experience and the latest capabilities. For more information, see [Move your Microsoft Sentinel environment to the Defender portal](move-to-defender.md).


## New and improved capabilities

The following table describes the new or improved capabilities available in the Defender portal with the integration of Microsoft Sentinel. Microsoft continues to innovate in this new experience with features that might be exclusive to the Defender portal.


| Capabilities      | Description              |
| ----------------- | ------------------------ |
| **Streamlined operations** | Manage all security incidents, alerts, and investigations from a single, unified interface.<br><br>- **Unified entity pages** for devices, users, IP addresses, and Azure resources in the Defender portal display information from Microsoft Sentinel and Defender data sources. These entity pages give you an expanded context for your investigations of incidents and alerts in the Defender portal. For more information, see [Investigate entities with entity pages in Microsoft Sentinel](/azure/sentinel/entity-pages). <br><br>- **Unified incidents** let you manage and investigate security incidents in a single location and from a single queue in the Defender portal. Use Security Copilot to summarize, respond, and report. Unified incidents include data from the breadth of sources, AI analytics tools of security information and event management (SIEM), and context and mitigation tools offered by extended detection and response (XDR). For more information, see [Incident response in the Microsoft Defender portal](/microsoft-365/security/defender/incidents-overview) and [Investigate Microsoft Sentinel incidents in Security Copilot](sentinel-security-copilot.md).  <br><br>- Use **Advanced hunting** to query from a single portal across different data sets to make hunting more efficient and remove the need for context-switching. Use Security Copilot to help generate your KQL, view and query all data including data from Microsoft security services and Microsoft Sentinel, and then use all your existing Microsoft Sentinel workspace content, including queries and functions, to investigate. For more information, see [Advanced hunting in the Microsoft Defender portal](https://go.microsoft.com/fwlink/p/?linkid=2264410) and[Security Copilot in advanced hunting](/defender-xdr/advanced-hunting-security-copilot). |
| **Enhanced threat detection**	| Use advanced AI and machine learning for faster and more accurate threat detection and response. Benefit from an improved signal-to-noise ratio and enhanced alert correlation, ensuring critical threats are addressed promptly. <br><br>For more information, see [Threat detection for unified security operations](/unified-secops-platform/detect-threats-overview).
|**New features** | Access robust tools like [Case management](/unified-secops-platform/cases-overview) for organizing and managing security incidents, [automatic attack disruption](/defender-xdr/automatic-attack-disruption?toc=%2Funified-secops-platform%2Ftoc.json&bc=%2Funified-secops-platform%2Fbreadcrumb%2Ftoc.json) for remediating compromised entities on high-fidelity true positives, and an embedded Security Copilot experience for [automated incident summary](/defender-xdr/security-copilot-m365d-incident-summary) and [guided response actions](/microsoft-365/security/defender/security-copilot-m365d-guided-response), and more.<br><br>For example, when investigating incidents in the Defender portal, use Security Copilot to [analyze scripts](/defender-xdr/security-copilot-m365d-script-analysis), [analyze files](/defender-xdr/copilot-in-defender-file-analysis), and [create incident reports](/defender-xdr/security-copilot-m365d-create-incident-report). When hunting for threats in advanced hunting, [create ready-to-run KQL queries](/defender-xdr/advanced-hunting-security-copilot) by using the query assistant. |
| **Enhanced visibility and reduced risk exposure** | Analyze attack paths to see how a cyber attacker could exploit vulnerabilities. Use guided SOC optimization recommendations to reduce costs and exposure, and prioritize actions based on potential impact. <br><br>For more information, see: <br>- [Optimize your security operations](soc-optimization/soc-optimization-access.md) <br>- [Use SOC optimizations programmatically](soc-optimization/soc-optimization-api.md)<br>- [SOC optimization reference of recommendations](soc-optimization/soc-optimization-reference.md)  |
|**Tailored post-incident recommendations** |	Prevent similar or repeat cyberattacks with tailored recommendations tied to Microsoft Security Exposure Management initiatives. <br><br>For more information, see [Microsoft Security Exposure Management for enhanced security posture](/unified-secops-platform/overview-msem-strategy).|
| **Cost and data optimization** | Customers can access both Microsoft Sentinel and Defender XDR data in a unified and consistent schema in the Defender portal. Advanced hunting raw logs are available for 30 days for hunting free of charge without needing to ingest them into Microsoft Sentinel. For more information, see [Plan costs and understand Microsoft Sentinel pricing and billing](billing.md).|

<!--where else in the billing doc do we say this about the 30 days?-->

## Limited or unavailable capabilities with Microsoft Sentinel only in the Defender portal

When you onboard Microsoft Sentinel to the Defender portal without Defender XDR or other services enabled, the following capabilities are limited or unavailable. 

| Capability | Service required |
| ---------- | ---------------- |
| **Exposure management**    | [Microsoft Security Exposure Management](/security-exposure-management/) |
| **Custom detection rules** | [Microsoft Defender XDR](/defender-xdr/microsoft-365-defender)           |
| **Action center**          | [Microsoft Defender XDR](/defender-xdr/microsoft-365-defender)           |

The following limitations also apply to Microsoft Sentinel in Defender portal without Defender XDR or other services enabled:

- New Microsoft Sentinel customers aren't eligible to onboard a Log Analytics workspace that's created in the Israel region. To onboard to the Defender portal, create another workspace for Microsoft Sentinel in a different region. This additional workspace doesn't need to contain any data. <!--what does this mean and is it still true?-->
- Customers that use Microsoft Sentinel user and entity behavior analytics (UEBA) are provided with a limited version of the [IdentityInfo table](ueba-reference.md#identityinfo-table). <!--is this still true after the unified identityinfo table?-->


## Quick reference

Some Microsoft Sentinel capabilities, like the unified incident queue, are integrated with Microsoft Defender XDR in Microsoft's unified security operations platform. Many other Microsoft Sentinel capabilities are available in the  Microsoft Sentinel  section of the Defender portal.

The following image shows the  Microsoft Sentinel  menu in the Defender portal:

:::image type="content" source="media/microsoft-sentinel-defender-portal/navigation-defender-portal.png" alt-text="Screenshot of the Defender portal left navigation with the Microsoft Sentinel section." lightbox="media/microsoft-sentinel-defender-portal/navigation-defender-portal.png":::

The following sections describe where to find Microsoft Sentinel features in the Defender portal, and are intended for existing customers who are moving to the Defender portal. The sections are organized as Microsoft Sentinel is in the Azure portal.

For more information, see [Move Microsoft Sentinel to the Defender portal](move-to-defender.md).

### General

The following table lists the changes in navigation between the Azure and Defender portals for the **General** section in the Azure portal.

| Azure portal  | Defender portal                                       |
| ------------- | ----------------------------------------------------- |
| **Overview**      | **Overview**                                              |
| **Logs**          | **Investigation & response** > **Hunting** > **Advanced hunting** |
| **News & guides** | Not available                                         |
| **Search**        | **Microsoft Sentinel** > **Search**                           |

### Threat management

The following table lists the changes in navigation between the Azure and Defender portals for the **Threat management**  section in the Azure portal.

| Azure portal        | Defender portal                                              |
| ------------------- | ------------------------------------------------------------ |
| **Incidents**           | **Investigation & response** > **Incidents & alerts** > **Incidents**    |
| **Workbooks**           | **Microsoft Sentinel** > **Threat management** > **Workbooks**            |
| **Hunting**             |**Microsoft Sentinel** > **Threat management** >  **Hunting**            |
| **Notebooks**           |**Microsoft Sentinel** > **Threat management** >  **Notebooks**          |
| **Entity behavior**     | *User entity page:* **Assets** > **Identities** > *{user}* > **Sentinel events**<br>AND<br>*Device entity page:* **Assets** > **Devices** > *{device}* > **Sentinel events**<br><br>Also, find the entity pages for the user, device, IP, and Azure resource entity types from incidents and alerts as they appear.                               |
| **Threat intelligence** | **Threat intelligence** > **Intel management** |
| **MITRE ATT&CK**        |**Microsoft Sentinel** > **Threat management** > **MITRE ATT&CK**        |

### Content management

The following table lists the changes in navigation between the Azure and Defender portals for the **Content management** section in the Azure portal.

| Azure portal | Defender portal                                        |
| ------------ | ------------------------------------------------------ |
| **Content hub**  |**Microsoft Sentinel** > **Content management** > **Content hub**  |
| **Repositories** |**Microsoft Sentinel** > **Content management** > **Repositories** |
| **Community**    |**Microsoft Sentinel** > **Content management** > **Community**    |

### Configuration

The following table lists the changes in navigation between the Azure and Defender portals for the **Configuration** section in the Azure portal.

| Azure portal      | Defender portal                                      |
| ----------------- | ---------------------------------------------------- |
| **Workspace manager** | Not available                                        |
| **Data connectors**   |**Microsoft Sentinel** > **Configuration** > **Data connectors** |
| **Analytics**         |**Microsoft Sentinel** > **Configuration** > **Analytics**<br>AND<br>**Investigation and response** > **Hunting** > **Custom detection rules**      |
| **Watchlists**        |**Microsoft Sentinel** > **Configuration** > **Watchlists**      |
| **Automation**        |**Microsoft Sentinel** > **Configuration** > **Automation**      |
| **Settings**          | **System** > **Settings** >**Microsoft Sentinel**              |

## Related content

- [What is Microsoft's unified security operations platform?](/unified-secops-platform/overview-unified-security)
- [Microsoft Defender XDR integration with Microsoft Sentinel](microsoft-365-defender-sentinel-integration.md)
- [Connect Microsoft Sentinel to Microsoft Defender XDR](/microsoft-365/security/defender/microsoft-sentinel-onboard)