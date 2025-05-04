---
title: Move Microsoft Microsoft Sentinel in the Microsoft Defender portal
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

All Microsoft Sentinel use cases are now generally available in Microsoft Defender—delivering a unified experience across SIEM and XDR for faster and more accurate threat detection and response, simplified workflows, and enhanced operational efficiency. The unified experience reduces tool switching and builds a more context-focused investigation that expedites incident response and stops breaches faster.
We encourage all customers to move Azure Sentinel portals into Microsoft Defender to take advantage of the unified SecOps experience and the latest capabilities. Moving forward, all new features and innovations will be delivered in Microsoft Defender. 
For more information, see the relevant documentation for each feature and Capability differences between portals. In addition, we’ve created a demo video series with step-by-step instructions to guide you through the process of moving your Azure portal into Microsoft Defender.


## Capability differences between portals

Most Microsoft Sentinel capabilities are available in both the Azure and Defender portals. In the Defender portal, some Microsoft Sentinel experiences open out to the Azure portal for you to complete a task.

This section covers the Microsoft Sentinel capabilities or integrations that are only available in either the Azure portal or Defender portal or other significant differences between the portals. It excludes the Microsoft Sentinel experiences that open the Azure portal from the Defender portal.

| Capability | Availability | Description |
| ---------- | ------------ | ----------- |
| Advanced hunting using bookmarks | Azure portal only | Bookmarks aren't supported in the advanced hunting experience in the Microsoft Defender portal. In the Defender portal, they're supported in the **Microsoft Sentinel > Threat management > Hunting**. <br><br> For more information, see [Keep track of data during hunting with Microsoft Sentinel](/azure/sentinel/bookmarks). |
| Attack disruption for SAP | Defender portal only with Defender XDR | This functionality is unavailable in the Azure portal. <br><br>For more information, see [Automatic attack disruption in the Microsoft Defender portal](/microsoft-365/security/defender/automatic-attack-disruption). |
| Automation | Some automation procedures are available only in the Azure portal.<br><br>Other automation procedures are the same in the Defender and Azure portals, but differ in the Azure portal between workspaces that are onboarded to the Defender portal and workspaces that aren't.  | <br><br>For more information, see [Automation with the unified security operations platform](automation.md#automation-with-the-unified-security-operations-platform). |
| Data connectors: visibility of connectors used by the unified security operations platform | Azure portal only | In the Defender portal, after you onboard Microsoft Sentinel, the following data connectors that are part of the unified security operations platform aren't shown in the **Data connectors** page:<li>Microsoft Defender for Cloud Apps<li>Microsoft Defender for Endpoint<li>Microsoft Defender for Identity<li>Microsoft Defender for Office 365 (Preview)<li>Microsoft Defender XDR<li>Subscription-based Microsoft Defender for Cloud (Legacy)<li>Tenant-based Microsoft Defender for Cloud (Preview)<br><br>In the Azure portal, these data connectors are still listed with the installed data connectors in Microsoft Sentinel. |
| Entities: Add entities to threat intelligence from incidents | Azure portal only | This functionality is unavailable in the Defender portal. <Br><br>For more information, see [Add entity to threat indicators](add-entity-to-threat-intelligence.md). |
| Fusion: Advanced multistage attack detection | Azure portal only  | The Fusion analytics rule, which creates incidents based on alert correlations made by the Fusion correlation engine, is disabled when you onboard Microsoft Sentinel to the Defender portal. <br><br>The Defender portal uses Microsoft Defender XDR's incident-creation and correlation functionalities to replace those of the Fusion engine. <br><br>For more information, see [Advanced multistage attack detection in Microsoft Sentinel](fusion.md) |
| Incidents: Adding alerts to incidents /<br>Removing alerts from incidents | Defender portal only | After onboarding Microsoft Sentinel to the Defender portal, you can no longer add alerts to, or remove alerts from, incidents in the Azure portal. <br><br>You can remove an alert from an incident in the Defender portal, but only by linking the alert to another incident (existing or new). |
| <a name="5min"></a>Incidents: Creation | After onboarding to the Defender portal: Incidents are created by the correlation engine in the Microsoft Defender portal. | Incidents created in the Defender portal for alerts generated by Microsoft Sentinel have <b>Incident provider name</b> = <b>Microsoft Defender XDR</b>. <br><br>Any active Microsoft security incident creation rules are deactivated to avoid creating duplicate incidents. The incident creation settings in other types of analytics rules remain as they were, but those settings are implemented in the Defender portal, not in Microsoft Sentinel.<br><br>It may take up to 5 minutes for Microsoft Defender incidents to show in Microsoft Sentinel. This doesn't affect features provided directly by Microsoft Defender, such as automatic attack disruption.<br><br>For more information, see the following articles: <br>- [Incidents and alerts in the Microsoft Defender portal](/defender-xdr/incidents-overview) <br>- [Alert correlation and incident merging in the Microsoft Defender portal](/defender-xdr/alerts-incidents-correlation) |
| Incidents: Editing comments | Azure portal only | After onboarding Microsoft Sentinel to the Defender portal, you can add comments to incidents in either portal, but you can't edit existing comments. <br><br>Edits made to comments in the Azure portal don't synchronize to the Defender portal. |
| Incidents: Programmatic and manual creation of incidents | Azure portal only  | Incidents created in Microsoft Sentinel through the API, by a Logic App playbook, or manually from the Azure portal, aren't synchronized to the Defender portal. These incidents are still supported in the Azure portal and the API. See [Create your own incidents manually in Microsoft Sentinel](create-incident-manually.md). |
| Incidents: Reopening closed incidents | Azure portal only  | In the Defender portal, you can't set alert grouping in Microsoft Sentinel analytics rules to reopen closed incidents if new alerts are added. <br>Closed incidents aren't reopened in this case, and new alerts trigger new incidents. |
| Incidents: Tasks | Azure portal only | Tasks are unavailable in the Defender portal. <br><br>For more information, see [Use tasks to manage incidents in Microsoft Sentinel](incident-tasks.md). |
| Multiple workspace management for Microsoft Sentinel | Defender portal: Manage a primary workspace and multiple secondary workspaces for a tenant. <br><br>Azure portal: Centrally manage multiple Microsoft Sentinel workspaces for tenants  | The Defender portal allows you to connect to one primary workspace and multiple secondary workspaces for Microsoft Sentinel. A primary workspace's alerts are correlated with Defender XDR data, which results in incidents that include alerts from Microsoft Sentinel's primary workspace and Defender XDR. All other onboarded workspaces are considered secondary workspaces.<br><br> For more information, see the following articles:<br>- Defender portal: [Multiple Microsoft Sentinel workspaces in the Defender portal](workspaces-defender-portal.md)<br>- Azure portal: [Manage multiple Microsoft Sentinel workspaces with workspace manager](/azure/sentinel/workspace-manager)|

## Limited or unavailable capabilities 

When you onboard Microsoft Sentinel to the Defender portal without Defender XDR or other services enabled, the following features that show in the Defender portal are currently limited or unavailable.

| Capability | Service required |
| ---------- | ---------------- |
| Exposure management    | [Microsoft Security Exposure Management](/security-exposure-management/) |
| Custom detection rules | [Microsoft Defender XDR](/defender-xdr/microsoft-365-defender)           |
| Action center          | [Microsoft Defender XDR](/defender-xdr/microsoft-365-defender)           |

The following limitations also apply to Microsoft Sentinel in Defender portal without Defender XDR or other services enabled:

- New Microsoft Sentinel customers aren't eligible to onboard a Log Analytics workspace that's created in the Israel region. To onboard to the Defender portal, create another workspace for Microsoft Sentinel in a different region. This additional workspace doesn't need to contain any data.
- Customers that use Microsoft Sentinel user and entity behavior analytics (UEBA) are provided with a limited version of the [IdentityInfo table](ueba-reference.md#identityinfo-table). 
