---
title: Microsoft Sentinel in the Microsoft Defender portal
description: Learn about the Microsoft Sentinel experience when you onboard Microsoft Sentinel to the Microsoft Defender portal.
author: batamig
ms.author: bagol
ms.topic: conceptual
ms.date: 06/12/2025
appliesto: 
    - Microsoft Sentinel in the Microsoft Defender portal
ms.collection: usx-security


#Customer intent: As a security operations analyst, I want to understand the integration of Microsoft Sentinel within the Microsoft Defender portal so that I can effectively navigate and utilize the new and improved security capabilities.

---

# Microsoft Sentinel in the Microsoft Defender portal

Microsoft Defender provides a unified cybersecurity solution that integrates endpoint protection, cloud security, identity protection, email security, threat intelligence, exposure management, and SIEM into a centralized platform. It uses AI-driven defense to help organizations anticipate and stop attacks, ensuring efficient and effective security operations.

Microsoft Sentinel is generally available in the Microsoft Defender portal, either with [Microsoft Defender XDR](/microsoft-365/security/defender), or on its own, delivering a unified experience across SIEM and XDR for faster and more accurate threat detection and response, simplified workflows, and enhanced operational efficiency.

This article describes the Microsoft Sentinel experience in the Defender portal. New customers who've onboarded to Microsoft Sentinel after July 1, 2025 with permissions of a subscription [Owner](/azure/role-based-access-control/built-in-roles#owner) or a [User access administrator](/azure/role-based-access-control/built-in-roles#user-access-administrator) are automatically onboarded to the Defender portal, and use Microsoft Sentinel in the Defender portal only. While existing customers and other new customers without the relevant permissions can continue using Microsoft Sentinel in the Azure portal, we recommend that you [onboard to the Defender portal](/defender-xdr/microsoft-sentinel-onboard) for a [unified security operations experience](/unified-secops-platform/overview-unified-security). For more information, see [Transition your Microsoft Sentinel environment to the Defender portal](move-to-defender.md).

## New and improved capabilities

The following table describes the new or improved capabilities available in the Defender portal with the integration of Microsoft Sentinel. Microsoft continues to innovate in this new experience with features that might be exclusive to the Defender portal.


| Capabilities      | Description              | Learn more |
| ----------------- | ------------------------ | ---------- |
| **Streamlined operations** | Manage all security incidents, alerts, and investigations from a single, unified interface.<br><br>- **Unified entity pages** for devices, users, IP addresses, and Azure resources in the Defender portal display information from Microsoft Sentinel and Defender data sources. These entity pages give you an expanded context for your investigations of incidents and alerts in the Defender portal.<br><br>- **Unified incidents** let you manage and investigate security incidents in a single location and from a single queue in the Defender portal. Use Security Copilot to summarize, respond, and report. Unified incidents include data from the breadth of sources, AI analytics tools of security information and event management (SIEM), and context and mitigation tools offered by extended detection and response (XDR).<br><br>- Use **Advanced hunting** to query from a single portal across different data sets to make hunting more efficient and remove the need for context-switching. Use Security Copilot to help generate your KQL, view and query all data including data from Microsoft security services and Microsoft Sentinel, and then use all your existing Microsoft Sentinel workspace content, including queries and functions, to investigate. | - [Investigate entities with entity pages in Microsoft Sentinel](/azure/sentinel/entity-pages)<br><br>-  [Incident response in the Microsoft Defender portal](/microsoft-365/security/defender/incidents-overview)<br><br>- [Investigate Microsoft Sentinel incidents in Security Copilot](sentinel-security-copilot.md)<br><br>- [Advanced hunting in the Microsoft Defender portal](https://go.microsoft.com/fwlink/p/?linkid=2264410)<br>[Security Copilot in advanced hunting](/defender-xdr/advanced-hunting-security-copilot) |
| **Enhanced threat detection** | Use advanced AI and machine learning for faster and more accurate threat detection and response. Benefit from an improved signal-to-noise ratio and enhanced alert correlation, ensuring critical threats are addressed promptly. | [Threat detection for unified security operations](/unified-secops-platform/detect-threats-overview) |
| **New features** | Access robust tools like [Case management](/unified-secops-platform/cases-overview) for organizing and managing security incidents, [automatic attack disruption](/defender-xdr/automatic-attack-disruption?toc=%2Funified-secops-platform%2Ftoc.json&bc=%2Funified-secops-platform%2Fbreadcrumb%2Ftoc.json) for remediating compromised entities on high-fidelity true positives, and an embedded Security Copilot experience for [automated incident summary](/defender-xdr/security-copilot-m365d-incident-summary) and [guided response actions](/microsoft-365/security/defender/security-copilot-m365d-guided-response), and more.<br><br>For example, when investigating incidents in the Defender portal, use Security Copilot to [analyze scripts](/defender-xdr/security-copilot-m365d-script-analysis), [analyze files](/defender-xdr/copilot-in-defender-file-analysis), and [create incident reports](/defender-xdr/security-copilot-m365d-create-incident-report). When hunting for threats in advanced hunting, [create ready-to-run KQL queries](/defender-xdr/advanced-hunting-security-copilot) by using the query assistant. | - [Case management](/unified-secops-platform/cases-overview)<br><br>- [Automatic attack disruption](/defender-xdr/automatic-attack-disruption?toc=%2Funified-secops-platform%2Ftoc.json&bc=%2Funified-secops-platform%2Fbreadcrumb%2Ftoc.json)<br><br>- [Automated incident summary](/defender-xdr/security-copilot-m365d-incident-summary)<br><br>- [Guided response actions](/microsoft-365/security/defender/security-copilot-m365d-guided-response)<br><br>- [Analyze scripts](/defender-xdr/security-copilot-m365d-script-analysis)<br><br>- [Analyze files](/defender-xdr/copilot-in-defender-file-analysis)<br><br>- [Create incident reports](/defender-xdr/security-copilot-m365d-create-incident-report)<br><br>- [Create ready-to-run KQL queries](/defender-xdr/advanced-hunting-security-copilot) |
| **Enhanced visibility and reduced risk exposure** | Analyze attack paths to see how a cyber attacker could exploit vulnerabilities. Use guided SOC optimization recommendations to reduce costs and exposure, and prioritize actions based on potential impact. | - [Optimize your security operations](soc-optimization/soc-optimization-access.md)<br><br>- [Use SOC optimizations programmatically](soc-optimization/soc-optimization-api.md)<br><br>- [SOC optimization reference of recommendations](soc-optimization/soc-optimization-reference.md) |
| **Tailored post-incident recommendations** | Prevent similar or repeat cyberattacks with tailored recommendations tied to Microsoft Security Exposure Management initiatives. | [Microsoft Security Exposure Management for enhanced security posture](/unified-secops-platform/overview-msem-strategy) |
| **Cost and data optimization** | Customers can access both Microsoft Sentinel and Defender XDR data in a unified and consistent schema in the Defender portal. <br><br>Advanced hunting raw logs are available for 30 days for hunting free of charge without needing to ingest them into Microsoft Sentinel. | [What to expect to for Defender XDR tables streamed to Microsoft Sentinel](/defender-xdr/advanced-hunting-microsoft-defender#what-to-expect-for-defender-xdr-tables-streamed-to-microsoft-sentinel) |

## Limited or unavailable capabilities with Microsoft Sentinel only in the Defender portal

When you onboard Microsoft Sentinel to the Defender portal without Defender XDR or other services enabled, the following capabilities are limited or unavailable:

- [Microsoft Security Exposure Management](/security-exposure-management/)
- [Custom detection rules](/defender-xdr/custom-detections-overview), provided by Microsoft Defender XDR
- The [Action center](/defender-xdr/m365d-action-center), provided by Microsoft Defender XDR

## Quick reference

Some Microsoft Sentinel capabilities, like the unified incident queue, are integrated with Microsoft Defender XDR in the Defender portal. Many other Microsoft Sentinel capabilities are available in the **Microsoft Sentinel** section of the Defender portal.

The following image shows the  Microsoft Sentinel  menu in the Defender portal:

:::image type="content" source="media/microsoft-sentinel-defender-portal/navigation-defender-portal.png" alt-text="Screenshot of the Defender portal left navigation with the Microsoft Sentinel section." lightbox="media/microsoft-sentinel-defender-portal/navigation-defender-portal.png":::

The following sections describe where to find Microsoft Sentinel features in the Defender portal, and are intended for existing customers who are moving to the Defender portal. The sections are organized as Microsoft Sentinel is in the Azure portal.

For more information, see [Transition your Microsoft Sentinel environment to the Defender portal](move-to-defender.md).

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

- [What are unified security operations?](/unified-secops-platform/overview-unified-security)
- [Microsoft Defender XDR integration with Microsoft Sentinel](microsoft-365-defender-sentinel-integration.md)
- [Connect Microsoft Sentinel to Microsoft Defender XDR](/microsoft-365/security/defender/microsoft-sentinel-onboard)