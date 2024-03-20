---
title: Microsoft Sentinel in the Microsoft Defender portal
description: Learn about changes in the Microsoft Defender portal with the integration of Microsoft Sentinel.
author: cwatson-cat
ms.author: cwatson
ms.topic: conceptual
ms.date: 03/19/2024
appliesto: Microsoft Sentinel in the Microsoft Defender portal
ms.collection: usx-security
---

# Microsoft Sentinel in the Microsoft Defender portal

Microsoft Sentinel is available as part of the public preview for the unified security operations platform in the Microsoft Defender portal. This article describes the Microsoft Sentinel experience in the Microsoft Defender portal.

## New and improved capabilities

The following table describes the new or improved capabilities available in the Defender portal with the integration of Microsoft Sentinel and Defender XDR.

|Capabilities |Description |
|---------|---------|
|Advanced hunting | Query from a single portal across different data sets to make hunting more efficient and remove the need for context-switching. View and query all data including data from Microsoft security services and Microsoft Sentinel. Use all your existing Microsoft Sentinel workspace content, including queries and functions.<br><br>  For more information, see [Advanced hunting in the Microsoft Defender portal](https://go.microsoft.com/fwlink/p/?linkid=2264410).|
|Attack disrupt      |  Deploy automatic attack disruption in the Microsoft Defender portal for SAP, together with Microsoft Sentinel integrated into the Microsoft Defender portal and the Microsoft Sentinel solution for SAP applications.  <br><br>Attack disrupt for SAP is available in the Defender portal only.<br><br>  For more information, see the following articles: <br> - [Automatic attack disruption in the Microsoft Defender portal](/microsoft-365/security/defender/automatic-attack-disruption)  <br>- [Configure automatic attack disruption capabilities in Microsoft Defender XDR](/microsoft-365/security/defender/configure-attack-disruption)<br>- [Microsoft Sentinel solution for SAP® applications overview](/azure/sentinel/sap/solution-overview) <br>- [Deploy automatic attack disruption for SAP](https://go.microsoft.com/fwlink/p/?linkid=2264356)  |
|SOC optimizations   | Get high-fidelity and actionable recommendations to help you identify areas to:<br>- Reduce costs <br>- Add security controls<br>- Add missing data<br>SOC optimizations are available in the Defender portal only, are tailored to your environment, and are based on your current coverage and threat landscape.  <br><br>For more information, see the following articles:<br>- [Optimize your security operations with Microsoft Defender XDR](https://go.microsoft.com/fwlink/p/?linkid=2264237) <br>- [SOC optimization reference of recommendations](https://go.microsoft.com/fwlink/p/?linkid=2263879)   |
|Unified entities|  Use an expanded list of entities types for your investigations in the Microsoft Defender portal. Find entity pages for devices, users, IP addresses, and Azure resources as they're available from incidents and alerts.  <br><br>For more information, see [Investigate entities with entity pages in Microsoft Sentinel](/azure/sentinel/entity-pages).|
|Unified incidents| Manage and investigate security information and event management (SIEM), and extended detection and response (XDR) incidents from a single place with a unified queue. <br><br> For more information, see [Incident response in the Microsoft Defender portal](/microsoft-365/security/defender/incidents-overview).|

## Capability differences between portals

 Most Microsoft Sentinel capabilities are available in both the Azure and Defender portals. In the Defender portal, some Microsoft Sentinel experiences open out to the Azure portal for you to complete a task.

This section covers the Microsoft Sentinel capabilities or integrations in the unified SOC platform that are only available in either the Azure portal or Defender portal. It excludes the Microsoft Sentinel experiences that open the Azure portal from the Defender portal.

### Defender portal only

The following capabilities are only available in the Defender portal.

|Capability  |Learn more  |
|---------|---------|
|Attack disrupt for SAP  |  [Automatic attack disruption in the Microsoft Defender portal](/microsoft-365/security/defender/automatic-attack-disruption)         |
|SOC optimization   |   [Optimize your security operations with Microsoft Defender XDR](https://go.microsoft.com/fwlink/p/?linkid=2264237)      |

### Azure portal only

The following capabilities are only available in the Azure portal.

|Capability  |Learn more  |
|---------|---------|
|Tasks   |     [Use tasks to manage incidents in Microsoft Sentinel](incident-tasks.md)    |
|Add entities to threat intelligence from incidents | [Add entity to threat indicators](add-entity-to-threat-intelligence.md)   |


## Quick reference

Some Microsoft Sentinel capabilities, like the unified incident queue, are integrated with Microsoft Defender XDR in the unified SOC platform. Many other Microsoft Sentinel capabilities are available in the **Microsoft Sentinel** section of the Defender portal.

The following image shows the **Microsoft Sentinel** menu in the Defender portal:

:::image type="content" source="media/microsoft-sentinel-defender-portal/navigation-defender-portal.png" alt-text="Screenshot of the Defender portal left navigation with the Microsoft Sentinel section." lightbox="media/microsoft-sentinel-defender-portal/navigation-defender-portal.png":::

The following sections describe where to find Microsoft Sentinel features in the Defender portal. The sections are organized as Microsoft Sentinel is in the Azure portal.

### General

The following table lists the changes in navigation between the Azure and Defender portals for the **General** section in the Azure portal.

|Azure portal  |Defender portal  |
|---------|---------|
|Overview    |  Overview        |
|Logs     |     Investigation & response > Hunting > Advanced hunting    |
|News & guides     |  Not available      |
|Search     | Microsoft Sentinel > Search        |


### Threat management

The following table lists the changes in navigation between the Azure and Defender portals for the **Threat management**  section in the Azure portal.

|Azure portal  |Defender portal  |
|---------|---------|
|Incidents    |   Investigation & response > Incidents & alerts > Incidents      |
|Workbooks     | Microsoft Sentinel > Threat management> Workbooks      |
|Hunting     | Microsoft Sentinel > Threat management >  Hunting      |
|Notebooks     | Microsoft Sentinel > Threat management >  Notebooks         |
|Entity behavior     | Assets > Identities<br> Assets > Devices<br><br>  Find the entity pages for the user, device, IP, and Azure resource entity types from incidents and alerts as they appear.       |
|Threat intelligence    | Microsoft Sentinel > Threat management >  Threat intelligence        |
|MITRE ATT&CK|Microsoft Sentinel > Threat management > MITRE ATT&CK  |


### Content management

The following table lists the changes in navigation between the Azure and Defender portals for the **Content management** section in the Azure portal.

|Azure portal  |Defender portal  |
|---------|---------|
|Content hub    |  Microsoft Sentinel > Content management > Content hub      |
|Repositories     |    Microsoft Sentinel > Content management > Repositories     |
|Community   |   Not available      |

### Configuration

The following table lists the changes in navigation between the Azure and Defender portals for the **Configuration** section in the Azure portal.

|Azure portal  |Defender portal  |
|---------|---------|
|Workspace manager  |  Not available       |
|Data connectors     | Microsoft Sentinel > Configuration > Data connectors        |
|Analytics     |  Microsoft Sentinel > Configuration > Analytics       |
|Watchlists    |      Microsoft Sentinel > Configuration > Watchlists    |
|Automation   |   Microsoft Sentinel > Configuration > Automation       |
|Settings   | System > Settings > Microsoft Sentinel       |



## Related content

- [Connect Microsoft Sentinel to Microsoft Defender XDR](/microsoft-365/security/defender/microsoft-sentinel-onboard)
