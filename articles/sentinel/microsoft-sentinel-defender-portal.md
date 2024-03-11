---
title: Microsoft Sentinel in the Microsoft Defender portal
description: Learn about changes in the Microsoft Defender portal with the integration of Microsoft Sentinel.
author: cwatson-cat
ms.author: cwatson
ms.topic: conceptual
ms.date: 03/09/2024
appliesto: Microsoft Sentinel in the Azure portal and the Microsoft Defender portal
ms.collection: usx-security
---

# Microsoft Sentinel in the Microsoft Defender portal

Combine the power of Microsoft Sentinel with Microsoft Defender XDR into the Microsoft Defender portal, your unified security operations center (SOC) platform. The Defender portal is enhanced with the following features:

- Advanced hunting that spans Microsoft Sentinel and Microsoft Defender XDR
- Unified incidents
- AI
- Automation
- Guided experiences
- Curated threat intelligence

This article describes the Microsoft Sentinel experience in the Microsoft Defender portal.

[!INCLUDE [unified-soc-preview](includes/unified-soc-preview.md)]


## Quick reference

Some Microsoft Sentinel capabilities are integrated with Microsoft Defender XDR in the unified SOC platform like the unified incident queue. Many other Microsoft Sentinel capabilities are available in the **Microsoft Sentinel** section of the Defender portal.

:::image type="content" source="media/microsoft-sentinel-defender-portal/sentinel-defender-portal.png" alt-text="Screenshot of the Defender portal left navigation with the Microsoft Sentinel section.":::

The following sections describe where to find Microsoft Sentinel features in the Defender portal. The sections are organized as Microsoft Sentinel is in the Azure portal.

### General

The **General** section in the Azure portal includes the features listed in the following table. This table lists the changes in navigation between the Azure and Defender portals for features in this section.

|Azure portal  |Defender portal  |
|---------|---------|
|Overview    |  Overview        |
|Logs     |     Investigation & response > Hunting > Advanced hunting    |
|News & guides     |  Not available      |
|Search     | Microsoft Sentinel > Search        |


### Threat management

The **Threat management** section in the Azure portal includes the features listed in the following table. This table lists the changes in navigation between the Azure and Defender portals for features in this section.

|Azure portal  |Defender portal  |
|---------|---------|
|Incidents    |   Investigation & response > Incidents & alerts       |
|Workbooks     | Microsoft Sentinel > Threat management> Workbooks      |
|Hunting     | Microsoft Sentinel > Threat management >  Hunting      |
|Notebooks     | Microsoft Sentinel > Threat management >  Notebooks         |
|Entity behavior     |  **Not available??** OR Microsoft Sentinel > Threat management >  Entity behavior       |
|Threat intelligence    | Microsoft Sentinel > Threat management >  Threat intelligence        |
|MITRE ATT&CK|Microsoft Sentinel > Threat management > MITRE ATT&CK  |

### Content management

The **Content management** section in the Azure portal includes the features listed in the following table. This table lists the changes in navigation between the Azure and Defender portals for features in this section.

|Azure portal  |Defender portal  |
|---------|---------|
|Content hub    |  Microsoft Sentinel > Content management > Content hub      |
|Repositories     |    Microsoft Sentinel > Content management > Repositories     |
|Community   |   Not available      |

### Configuration

The **Configuration** section in the Azure portal includes the features listed in the following table. This table lists the changes in navigation between the Azure and Defender portals for features in this section.

|Azure portal  |Defender portal  |
|---------|---------|
|Workspace manager  |  Not available       |
|Data connectors     | Microsoft Sentinel > Configuration > Data connectors        |
|Analytics     |  Microsoft Sentinel > Configuration > Analytics       |
|Watchlists    |      Microsoft Sentinel > Configuration > Watchlists    |
|Automation   |   Microsoft Sentinel > Configuration > Automation       |
|Settings   | System > Settings > Microsoft Sentinel       |

## New and improved capabilities

The following table describes the new or improved capabilities available in the Defender portal with the integration of  Microsoft Sentinel and Defender XDR.

|Capabilities |Description |
|---------|---------|
|Advanced hunting | Query from a single portal across different data sets to make hunting more efficient and remove the need for context-switching. View and query all data including data from Microsoft security services and Microsoft Sentinel. Use all your existing Microsoft Sentinel workspace content, including queries and functions.<br><br>  For more information, see [Advanced hunting in the Microsoft Defender portal](/microsoft-365/security/defender/advanced-hunting-microsoft-defender).|
|Attack disrupt      |  Deploy automatic attack disruption in the Microsoft Defender portal for SAP, together with Microsoft Sentinel integrated into the Microsoft Defender portal and the Microsoft Sentinel solution for SAP applications.  <br><br>  For more information, see the following articles: <br> - [Automatic attack disruption in Microsoft Defender XDR](/microsoft-365/security/defender/automatic-attack-disruption)  <br>- [Configure automatic attack disruption capabilities in Microsoft Defender XDR](/microsoft-365/security/defender/configure-attack-disruption)<br>- [Deploy automatic attack disruption for SAP](/azure/sentinel/sap/deployment-attack-disrupt)  |
|SOC optimizations   | Get high-fidelity and actionable recommendations to help you identify areas to:<br>- Reduce costs <br>- Add security controls<br>- Add missing data<br>SOC optimizations are tailored to your environment and based on your current coverage and threat landscape.  <br><br>For more information, see the following articles:<br>- [Optimize your security operations with Microsoft Defender XDR](/microsoft-365/security/defender/soc-optimization-access) <br>- [SOC optimization reference of recommendations](/microsoft-365/security/defender/soc-optimization-reference)   |
|Unified entities| TBD  <br><br>For more information, see  <br>- []()|
|Unified incidents| Manage and investigate security information and event management (SIEM), and extended detection and response (XDR) incidents from a single place with a unfied queue.<br><br> For more information, see  <br>- []()|

## Related content

- [Connect Microsoft Sentinel to Microsoft Defender XDR](/microsoft-365/security/defender/microsoft-sentinel-onboard)