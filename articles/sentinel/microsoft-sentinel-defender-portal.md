---
title: Microsoft Sentinel in the Microsoft Defender portal
description: Learn about the Microsoft Sentinel experience when you onboard Microsoft Sentinel to the Microsoft Defender portal.
author: cwatson-cat
ms.author: cwatson
ms.topic: conceptual
ms.date: 01/08/2025
appliesto: 
    - Microsoft Sentinel in the Microsoft Defender portal
ms.collection: usx-security


#Customer intent: As a security operations analyst, I want to understand the integration of Microsoft Sentinel within the Microsoft Defender portal so that I can effectively navigate and utilize the new and improved security capabilities.

---

# Microsoft Sentinel in the Microsoft Defender portal

This article describes the Microsoft Sentinel experience in the Microsoft Defender portal. Microsoft Sentinel is generally available within Microsoft's unified security operations platform in the Microsoft Defender portal with Microsoft Defender XDR. For more information, see:

- Blog post: [General availability of the Microsoft unified security operations platform](https://aka.ms/unified-soc-announcement)
- Blog post: [Frequently asked questions about the unified security operations platform](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/frequently-asked-questions-about-the-unified-security-operations/ba-p/4212048)
- [Connect Microsoft Sentinel to Microsoft Defender XDR](/microsoft-365/security/defender/microsoft-sentinel-onboard)
- [Microsoft Sentinel feature support for Azure commercial/other clouds](feature-availability.md)

For preview, Microsoft Sentinel is available in the Defender portal without Microsoft Defender XDR or an E5 license.

## New and improved capabilities

The following table describes the new or improved capabilities available in the Defender portal with the integration of Microsoft Sentinel. Microsoft continues to innovate in this new experience with features that might be exclusive to the Defender portal.

| Capabilities      | Description              |
| ----------------- | ------------------------ |
| Advanced hunting  | Query from a single portal across different data sets to make hunting more efficient and remove the need for context-switching. Use Security Copilot to help generate your KQL. View and query all data including data from Microsoft security services and Microsoft Sentinel. Use all your existing Microsoft Sentinel workspace content, including queries and functions.<br><br>  For more information, see the following articles:<br>- [Advanced hunting in the Microsoft Defender portal](https://go.microsoft.com/fwlink/p/?linkid=2264410)<br>- [Security Copilot in advanced hunting](/defender-xdr/advanced-hunting-security-copilot) |
| SOC optimizations   | Get high-fidelity and actionable recommendations to help you identify areas to:<br>- Reduce costs <br>- Add security controls<br>- Add missing data<br>SOC optimizations are available in the Defender and Azure portals, are tailored to your environment, and are based on your current coverage and threat landscape.  <br><br>For more information, see the following articles:<br>- [Optimize your security operations](soc-optimization/soc-optimization-access.md) <br>- [Use SOC optimizations programmatically](soc-optimization/soc-optimization-api.md)<br>- [SOC optimization reference of recommendations](soc-optimization/soc-optimization-reference.md)  |
| Microsoft Copilot in Microsoft Defender | When investigating incidents in the Defender portal, <br>- [Summarize incidents](/defender-xdr/security-copilot-m365d-incident-summary) <br>- [Analyze scripts](/defender-xdr/security-copilot-m365d-script-analysis)<br>- [Analyze files](/defender-xdr/copilot-in-defender-file-analysis)<br>- [Create incident reports](/defender-xdr/security-copilot-m365d-create-incident-report) <br><br>When hunting for threats in advanced hunting, create ready-to-run KQL queries by using the query assistant. For more information, see [Microsoft Security Copilot in advanced hunting](/defender-xdr/advanced-hunting-security-copilot).|

The following table describes the additional capabilities available in the Defender portal with the integration of Microsoft Sentinel and Microsoft Defender XDR as part of Microsoft's unified security operations platform. 

| Capabilities      | Description              |
| ----------------- | ------------------------ |
| Attack disrupt    |  Deploy automatic attack disruption for SAP with both the Defender portal and the Microsoft Sentinel solution for SAP applications. For example, contain compromised assets by locking suspicious SAP users in case of a financial process manipulation attack.  <br><br>Attack disruption capabilities for SAP are available in the Defender portal only. To use attack disruption for SAP, update your data connector agent version and ensure that the relevant Azure role is assigned to your agent's identity. <br><br>  For more information, see [Automatic attack disruption for SAP](sap/deployment-attack-disrupt.md).  |
| Unified entities  | Entity pages for devices, users, IP addresses, and Azure resources in the Defender portal display information from Microsoft Sentinel and Defender data sources. These entity pages give you an expanded context for your investigations of incidents and alerts in the Defender portal.<br><br>For more information, see [Investigate entities with entity pages in Microsoft Sentinel](/azure/sentinel/entity-pages). |
| Unified incidents | Manage and investigate security incidents in a single location and from a single queue in the Defender portal. Use Security Copilot to summarize, respond, and report. Incidents include:<br>- Data from the breadth of sources<br>- AI analytics tools of security information and event management (SIEM)<br>- Context and mitigation tools offered by extended detection and response (XDR) <br><br> For more information, see the following articles:<br>- [Incident response in the Microsoft Defender portal](/microsoft-365/security/defender/incidents-overview)<br>- [Investigate Microsoft Sentinel incidents in Security Copilot](sentinel-security-copilot.md) |
| Microsoft Copilot in Microsoft Defender | When investigating incidents with Microsoft Sentinel integrated with Defender XDR, <br>- [Triage and investigate incidents with guided responses](/defender-xdr/security-copilot-m365d-guided-response)<br>- [Summarize device information](/defender-xdr/copilot-in-defender-device-summary)<br>- [Summarize identity information](/defender-xdr/security-copilot-defender-identity-summary) <br><br>Summarize the relevant threats impacting your environment, to prioritize resolving threats based on your exposure levels, or to find threat actors that might be targeting your industry by using Security Copilot in threat intelligence. For more information, see [Using Microsoft Security Copilot for threat intelligence](/defender/threat-intelligence/using-copilot-threat-intelligence-defender-xdr). |

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
| Multiple workspace management for Microsoft Sentinel | Defender portal: Limited to one Microsoft Sentinel workspace per tenant <br><br>Azure portal: Centrally manage multiple Microsoft Sentinel workspaces for tenants  | Only one Microsoft Sentinel workspace per tenant is currently supported in the Defender portal. So, Microsoft Defender multitenant management supports one Microsoft Sentinel workspace per tenant.<br><br> For more information, see the following articles:<br>- Defender portal: [Microsoft Defender multitenant management](/defender-xdr/mto-overview) <br>- Azure portal: [Manage multiple Microsoft Sentinel workspaces with workspace manager](/azure/sentinel/workspace-manager)|

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

## Quick reference

Some Microsoft Sentinel capabilities, like the unified incident queue, are integrated with Microsoft Defender XDR in Microsoft's unified security operations platform. Many other Microsoft Sentinel capabilities are available in the **Microsoft Sentinel** section of the Defender portal.

The following image shows the **Microsoft Sentinel** menu in the Defender portal:

:::image type="content" source="media/microsoft-sentinel-defender-portal/navigation-defender-portal.png" alt-text="Screenshot of the Defender portal left navigation with the Microsoft Sentinel section." lightbox="media/microsoft-sentinel-defender-portal/navigation-defender-portal.png":::

The following sections describe where to find Microsoft Sentinel features in the Defender portal. The sections are organized as Microsoft Sentinel is in the Azure portal.

### General

The following table lists the changes in navigation between the Azure and Defender portals for the **General** section in the Azure portal.

| Azure portal  | Defender portal                                       |
| ------------- | ----------------------------------------------------- |
| Overview      | Overview                                              |
| Logs          | Investigation & response > Hunting > Advanced hunting |
| News & guides | Not available                                         |
| Search        | Microsoft Sentinel > Search                           |

### Threat management

The following table lists the changes in navigation between the Azure and Defender portals for the **Threat management**  section in the Azure portal.

| Azure portal        | Defender portal                                              |
| ------------------- | ------------------------------------------------------------ |
| Incidents           | Investigation & response > Incidents & alerts > Incidents    |
| Workbooks           | Microsoft Sentinel > Threat management> Workbooks            |
| Hunting             | Microsoft Sentinel > Threat management >  Hunting            |
| Notebooks           | Microsoft Sentinel > Threat management >  Notebooks          |
| Entity behavior     | *User entity page:* Assets > Identities > *{user}* > Sentinel events<br>*Device entity page:* Assets > Devices > *{device}* > Sentinel events<br><br>Also, find the entity pages for the user, device, IP, and Azure resource entity types from incidents and alerts as they appear.                               |
| Threat intelligence | Microsoft Sentinel > Threat management > Threat intelligence |
| MITRE ATT&CK        | Microsoft Sentinel > Threat management > MITRE ATT&CK        |

### Content management

The following table lists the changes in navigation between the Azure and Defender portals for the **Content management** section in the Azure portal.

| Azure portal | Defender portal                                        |
| ------------ | ------------------------------------------------------ |
| Content hub  | Microsoft Sentinel > Content management > Content hub  |
| Repositories | Microsoft Sentinel > Content management > Repositories |
| Community    | Microsoft Sentinel > Content management > Community    |

### Configuration

The following table lists the changes in navigation between the Azure and Defender portals for the **Configuration** section in the Azure portal.

| Azure portal      | Defender portal                                      |
| ----------------- | ---------------------------------------------------- |
| Workspace manager | Not available                                        |
| Data connectors   | Microsoft Sentinel > Configuration > Data connectors |
| Analytics         | Microsoft Sentinel > Configuration > Analytics       |
| Watchlists        | Microsoft Sentinel > Configuration > Watchlists      |
| Automation        | Microsoft Sentinel > Configuration > Automation      |
| Settings          | System > Settings > Microsoft Sentinel               |

## Related content

- [Microsoft Defender XDR integration with Microsoft Sentinel](microsoft-365-defender-sentinel-integration.md)
- [Connect Microsoft Sentinel to Microsoft Defender XDR](/microsoft-365/security/defender/microsoft-sentinel-onboard)
- [Microsoft Defender XDR documentation](/microsoft-365/security/defender)
