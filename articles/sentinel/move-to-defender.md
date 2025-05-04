---
title: Move Your Microsoft Sentinel Environment to the Defender Portal
description: Move Microsoft Sentinel operations from the Azure portal to the Microsoft Defender portal.
author: batamig
ms.author: bagol
ms.topic: how-to #Required; leave this attribute/value as-is
ms.date: 05/04/2025
ms.collection: usx-security

#Customer intent: As a security operations team member, I want to understand the process involved in moving our Microsoft Sentinel experience from the Azure portal to the Defender portal so that I can benefit from unified security operations across my entire environment.
---

# Move your Microsoft Sentinel environment to the Defender portal

Microsoft Sentinel is generally available in the Microsoft Defender portal, either with [Microsoft Defender XDR](/microsoft-365/security/defender), or on its own, delivering a unified experience across SIEM and XDR for faster and more accurate threat detection and response, simplified workflows, and enhanced operational efficiency.

This article describes the process of moving your Microsoft Sentinel experience from the Azure portal to the Defender portal. We recommend that customers using Microsoft Sentinel in the Azure portal move into Microsoft Defender to take advantage of the unified SecOps experience and the latest capabilities. For more information, see [Microsoft Sentinel in the Microsoft Defender portal](microsoft-sentinel-defender-portal.md).

## Prerequisites

Before you start, note:

- This article is intended for customers with an existing workspace enabled for Microsoft Sentinel, who are moving their Microsoft Sentinel experience to the Defender portal. If you're a new customer, see [Deploy unified security operations in the Defender portal](/unified-secops-platform/overview-deploy) for information about creating a new workspace for Microsoft Sentinel to use in the Defender portal.
- When relevant, detailed prerequisites are included in the linked articles for each step.
- Understand the new locations of some Microsoft Sentinel features in the Defender portal. For more information, see [Quick reference](microsoft-sentinel-defender-portal.md#quick-reference).

## Plan and set up your transition environment

**Persona**: Security architects

**Video demo**s:

- [Onboard a workspace enabled for Microsoft Sentinel to the Defender portal](https://aka.ms/onboardSentinel_in_Defender)
- [Managing unified RBAC in Microsoft Defender](https://aka.ms/defender_RBAC)

Make sure to review all planning guidance complete all prerequisites before you start onboarding your workspace to the Defender portal. For more information, see the following articles:

- [Plan for unified security operations in the Defender portal](/unified-secops-platform/overview-plan)
- [Unified security operations in the Defender portal for US government customers](/unified-secops-platform/gov-support)
- [Deploy unified security operations in the Defender portal](/unified-secops-platform/overview-deploy). While this article is aimed at new customers, who don't yet have a workspace for Microsoft Sentinel or other services onboarded to the Defender portal, we also recommend using it as a reference for existing customers who are moving to the Defender portal.
- [Connect Microsoft Sentinel to the Defender portal](/unified-secops-platform/microsoft-sentinel-onboard). This article includes detailed prerequisites for onboarding your workspace to the Defender portal. Note that if you're planning to use Microsoft Sentinel without Defender XDR, there's an extra step to trigger the connection between Microsoft Sentinel and Defender portal.

Defender supports one or more workspaces across multiple tenants via the [multitenant portal](mto.security.microsoft.com), which services as a centralized place to manage incidents and alerts, hunt for threats across tenants, and for Managed Security Service Partners (MSSPs) to gain visibility across customers.

In multi-workspace scenarios, the multitenant portal supports connecting one primary workspace and multiple secondary workspaces per tenant. Each workspace must be onboarded to the Defender portal separately for each tenant, similar to onboarding for a single tenant.

For more information, see:

- [Azure Lighthouse documentation](/azure/lighthouse/how-to/manage-sentinel-workspaces). Azure Lighthouse is required to access other tenants’ Microsoft Sentinel data across onboarded workspaces. For example, this enables cross-workspace queries using the `workspace()` operator in Advanced hunting and analytics rules.
- [Microsoft Entra B2B](/entra/identity/multi-tenant-organizations/overview#b2b-direct-connect). Microsoft Entra B2B is required to access data across tenant. GDAP isn't supported for Microsoft Sentinel data.
- [Set up Microsoft Defender multitenant management](/unified-secops-platform/mto-requirements)

## Configure and review your settings and content

**Persona**: Security engineers

**Video demos**:

- [Discover and manage Microsoft Sentinel content and threat intelligence in Microsoft Defender](https://aka.ms/discover_defender)
- [Alert correlation in Microsoft Defender](https://aka.ms/defender_alertcorrelation)
- [Create Microsoft Sentinel automations and workbooks in Microsoft Defender](https://aka.ms/defender_automations)

### Confirm and configure data collection

When Microsoft Sentinel is integrated with Microsoft Defender, the fundamental architecture of data collection and telemetry flow remains intact. Existing connectors that were configured in Microsoft Sentinel, whether for Microsoft Defender products or other data sources, continue operating without interruption.

From a Log Analytics perspective, Microsoft Sentinel’s integration into Microsoft Defender introduces no change to the underlying ingestion pipeline or data schema. Despite the front-end unification, the Microsoft Sentinel backend remains fully integrated with Log Analytics for data storage, search, and correlation.

When integrating with Defender for Cloud:

- If you're using the tenant-based data connector for Defender for Cloud, make sure to take action to prevent duplicate events and alerts. 
- If you're using the legacy, subscription-based connector instead, make sure to opt out of synching incidents and alerts to Microsoft Defender.

For more information, see [Alerts and incidents in Microsoft Defender](/azure/defender-for-cloud/concept-integration-365#microsoft-sentinel-customers).

After onboarding your workspace to Defender, the following data connectors are used for unified security operations and aren't shown in the **Data connectors** page in the Defender portal:

- Microsoft Defender for Cloud Apps
- Microsoft Defender for Endpoint
- Microsoft Defender for Identity
- Microsoft Defender for Office 365 (Preview)
- Microsoft Defender XDR
- Subscription-based Microsoft Defender for Cloud (Legacy)
- Tenant-based Microsoft Defender for Cloud (Preview)

These data connectors continue to be listed in Microsoft Sentinel in the Azure portal.

### Configure your ecosystem

While Microsoft Sentinel's [Workspace Manager](workspace-manager.md) isn't available in the Defender portal, use one of the following alternative capabilities for distributing content as code across workspaces:

- [Deploy content as code from your repository (Public preview)](ci-cd.md). Use YAML or JSON files in GitHub or Azure DevOps to manage and deploy configurations across Microsoft Sentinel and Defender using unified CI/CD workflows.

- [Multitenant portal](/unified-secops-platform/mto-overview). The Microsoft Defender multitenant portal supports managing and distributing content across multiple tenants.

Otherwise, continue to deploy solution packages that include various types of security content from the Content hub in the Defender portal. For more information, see [Discover and manage Microsoft Sentinel out-of-the-box content](sentinel-solutions-deploy.md).

### Configure analytics rules

Microsoft Sentinel analytics rules are [available in the Defender portal](microsoft-sentinel-defender-portal.md#configuration) for detection, configuration, and management. The functionalities of analytics rules remain the same, including creation, updating, and management through the wizard, repositories, and the Microsoft Sentinel API. Incident correlation and multi-stage attack detection also continue to work in the Defender portal. The alert correlation functionality managed by the Fusion analytics rule in the Azure portal is handled by the Defender XDR engine in the Defender portal, which consolidates all signals in one place.

When moving to the Defender portal, the following changes are important to note:

<!--add xrefs to all of these-->
| Feature    | Description    |
|--------------|-----|
| **Custom detection rules**   | If you have detection use cases that involve both Defender XDR and Microsoft Sentinel data,  where you don't need to retain Defender XDR data for more than 30 days, we recommend creating [custom detection rules](/defender-xdr/custom-detections-overview) that query data from both Microsoft Sentinel and Defender XDR tables. This is supported without needing to ingest Defender XDR data into Microsoft Sentinel. For more information, see [Use Microsoft Sentinel custom functions in advanced hunting in Microsoft Defender](/defender-xdr/advanced-hunting-defender-use-custom-rules#custom-detection-rules). |
| **Alert correlation**     | In the Defender portal, correlations are automatically applied to alerts against both Microsoft Defender data and third-party data ingested from Microsoft Sentinel, regardless of alert scenarios. The criteria used to correlate alerts together in a single incident are part of the Defender portal's proprietary, internal correlation logic.  |
| **Alert grouping and incident merging**       | While you will still see the alert grouping configuration in Analytics rules, the Defender XDR correlation engine fully controls alert grouping and incident merging when necessary in the Defender portal. This ensures a comprehensive view of the full attack story by stitching together relevant alerts for multi-stage attacks. For example, multiple individual analytics rules configured to generate an incident for each alert may result in merged incidents if they match Defender XDR correlation logic. |
| **Alert visibility**   | If you have Microsoft Sentinel analytics rules configured to trigger alerts only, with incident creation turned off, these alerts aren't visible in the Defender portal. However, while the **Advanced hunting** query editor doesn't recognize the `SecurityAlerts` table schema, you can still use the table in queries and analytics rules.               |
| **Alert tuning**  | Once your Microsoft Sentinel workspace is onboarded to Defender, all incidents, including those from your Microsoft Sentinel analytics rules, are generated by the Defender XDR engine. As a result, the [alert tuning capabilities](/defender-xdr/investigate-alerts#tune-an-alert) in the Defender portal, previously available only for Defender XDR alerts, can now be applied to alerts from Microsoft Sentinel. This feature allows you to streamline incident response by automating the resolution of common alerts, reducing false positives, and minimizing noise, so analysts can prioritize significant security incidents. |
| **Fusion: Advanced multistate attack detection** | The Fusion analytics rule, which in the Azure portal, creates incidents based on alert correlations made by the Fusion correlation engine, is disabled when you onboard Microsoft Sentinel to the Defender portal. You don't lose alert correlation functionality because the Defender portal uses Microsoft Defender XDR's incident-creation and correlation functionalities to replace those of the Fusion engine. <br><br>For more information, see [Advanced multistage attack detection in Microsoft Sentinel](fusion.md) |


### Configure automation rules and playbooks

Specific limitations and changes apply to Microsoft Sentinel automation rules and playbooks, which are specifically relevant when moving your Microsoft Sentinel experience from the Azure portal to the Defender portal. 

In Microsoft Sentinel, playbooks are based on workflows built in [Azure Logic Apps](/azure/logic-apps/logic-apps-overview), a cloud service that helps you schedule, automate, and orchestrate tasks and workflows across systems throughout the enterprise.

For more information, see [Automation in the Microsoft Defender portal](/azure/sentinel/automation/automation).

### Configure APIs

The unified experience in the Defender portal introduces notable changes to incidents and alerts from APIs. It supports API calls based on the [Microsoft Graph REST API v1.0](/graph/api/resources/security-api-overview?view=graph-rest-1.0), which can be used for automation related to alerts, incidents, advanced hunting, and more.

The [Microsoft Sentinel API](/rest/api/securityinsights/api-versions) continues to support actions against Microsoft Sentinel resources, like analytics rules, automation rules and more.   For interacting with unified incidents and alerts, we recommend that you use the Microsoft Graph REST API.

If you're using the Microsoft Sentinel `SecurityInsights` API to interact with Microsoft Sentinel incidents, you may need to update your automation conditions and trigger criteria due to changes in the response body. For more information, see [API responses](/azure/sentinel/microsoft-sentinel-defender-portal?branch=pr-en-us-299307#api-responses). <!--fix link-->


## Run operations in the Defender portal

**Persona**: Security analysts

**Video demos**: 

- [SOC optimizations in Microsoft Defender](https://aka.ms/defender_soc_optimization)
- [Advanced hunting in Microsoft Defender](https://aka.ms/defender_hunting)

### Update incident triage processes for the Defender portal

If you've used Microsoft Sentinel in the Azure portal, you'll notice significant user experience enhancements in the Defender portal. While you may need to update SOC processes and retrain your analysts, the design consolidates all relevant information in a single place to provide more streamlined and efficient workflows.



Analysts can now view detection sources and product names, apply and share filters for more efficient triaging of incidents and alerts. The unified incident queue consolidates all incidents across products into a single view, offering a better single pane of glass. These changes impact how analysts triage incidents, as incidents may now contain multiple cross-security domain alerts. This helps reduce the analysts workload and potentially combines the roles of tier 1 and tier 2 analysts, however, it requires broader and deeper analyst knowledg, and the etraining on the new portal UI will ensure a smooth transition.
Singleton incidents based on domains or specific entities 

Traditionally, analysts triage incidents based on specific security domains or expertise, often handling tickets per entity, such as a user or host. This approach can create blind spots, which the unified experience aims to address. When an attacker moves laterally, related alerts might end up in separate incidents due to different security domains. The unified experience eliminates this issue by providing a comprehensive view, ensuring all related alerts are correlated and managed cohesively.

Alert correlation and incident merging in Defender

When a new alert meets correlation criteria, Defender aggregates and correlates it with other related alerts from all the detection sources into a new incident. The unified incident queue reveals a more comprehensive attack, making analysts more efficient and providing a complete attack story. Learn more about the alert correlation behaviors. Watch the demo: Alert correlation in Microsoft Defender https://aka.ms/defender_alertcorrelation
In multi-workspace scenarios, only alerts from a primary workspace are correlated with Microsoft Defender XDR data. For more information about alert correlation by workspace, refer to the documentation. 

Defender’s correlation engine merges incidents when it recognizes common elements between alerts in separate incidents. Learn more about the criteria for merging incidents. There are scenarios, however, that incidents cannot be merged. Check out the specific scenarios when incidents aren't merged.


| Incidents: Adding alerts to incidents /<br>Removing alerts from incidents | Defender portal only | After onboarding Microsoft Sentinel to the Defender portal, you can no longer add alerts to, or remove alerts from, incidents in the Azure portal. <br><br>You can remove an alert from an incident in the Defender portal, but only by linking the alert to another incident (existing or new). |

| <a name="5min"></a>Incidents: Creation | After onboarding to the Defender portal: Incidents are created by the correlation engine in the Microsoft Defender portal. | Incidents created in the Defender portal for alerts generated by Microsoft Sentinel have <b>Incident provider name</b> = <b>Microsoft Defender XDR</b>. <br><br>Any active Microsoft security incident creation rules are deactivated to avoid creating duplicate incidents. The incident creation settings in other types of analytics rules remain as they were, but those settings are implemented in the Defender portal, not in Microsoft Sentinel.<br><br>It may take up to 5 minutes for Microsoft Defender incidents to show in Microsoft Sentinel. This doesn't affect features provided directly by Microsoft Defender, such as automatic attack disruption.<br><br>For more information, see the following articles: <br>- [Incidents and alerts in the Microsoft Defender portal](/defender-xdr/incidents-overview) <br>- [Alert correlation and incident merging in the Microsoft Defender portal](/defender-xdr/alerts-incidents-correlation) |

| Incidents: Editing comments | Azure portal only | After onboarding Microsoft Sentinel to the Defender portal, you can add comments to incidents in either portal, but you can't edit existing comments. <br><br>Edits made to comments in the Azure portal don't synchronize to the Defender portal. |
| Incidents: Programmatic and manual creation of incidents | Azure portal only  | Incidents created in Microsoft Sentinel through the API, by a Logic App playbook, or manually from the Azure portal, aren't synchronized to the Defender portal. These incidents are still supported in the Azure portal and the API. See [Create your own incidents manually in Microsoft Sentinel](create-incident-manually.md). |
| Incidents: Reopening closed incidents | Azure portal only  | In the Defender portal, you can't set alert grouping in Microsoft Sentinel analytics rules to reopen closed incidents if new alerts are added. <br>Closed incidents aren't reopened in this case, and new alerts trigger new incidents. |
| Incidents: Tasks | Azure portal only | Tasks are unavailable in the Defender portal. <br><br>For more information, see [Use tasks to manage incidents in Microsoft Sentinel](incident-tasks.md). |


### Note changes for investigations with Advanced hunting

After onboarding Microsoft Sentinel to the Defender portal, access and use all your existing Kusto Query Language (KQL) queries and functions in the **Advanced hunting** page.

Some differences exist, such as that bookmarks aren't supported in **Advanced hunting**. Instead, bookmarks are supported in the Defender portal under **Microsoft Sentinel > Threat management > Hunting**.

For more information, see [Advanced hunting with Microsoft Sentinel data in Microsoft Defender](/defender-xdr/advanced-hunting-microsoft-defender), especially the list of [known issues](/defender-xdr/advanced-hunting-microsoft-defender), and [Keep track of data during hunting with Microsoft Sentinel](/azure/sentinel/bookmarks).


### Investigate entities with UEBA

Entities
In the Microsoft Defender portal, entities generally fall into two main categories:
 
The entity pages for devices, users, IP addresses, and Azure resources in the Defender portal now consolidate both Microsoft Sentinel and Defender data sources.
The user or device entity page provides expanded context for investigatiing  incidents and alerts in the Defender portal.including timeline and insights from the Sentinel events tab. The device entity page rnow supports  unified timelines to simplify investigations by providing a unified view of device activities.
 
At the top right of the Defender portal is an enhanced global search bar that centralizes the results from all entities so that you can search across SIEM and XDR .
UEBA
Most functionalities of User and Entity Behavior Analytics (UEBA) remain the same;  however, you need to be aware of the following changes:
1.	The location to enable / disable or configure Entity behavior. With relevant permission, you can now access it via Defender portal -> Settings -> Microsoft Sentinel -> Entity behavior analytics -> Set UEBA.
2.	As part of the unification, the dedicated page/menu for Entity Behavior is no longer available in the Defender portal but you can access entities as follows:
•	User entity page: Assets > Identities > {user} > Sentinel events
•	Device entity page: Assets > Devices > {device} > Sentinel events
You can also find the entity pages for the user, device, IP, and Azure resource entity 	types from incidents and alerts as they appear or use the global search. 
To see a list of top users, IPs, and hosts to investigate, you can leverage the User 	and Entity Behavior Analytics workbook available from the Content Hub. This 	workbook is based on the BehaviorAnalytics table.
3.	IdentityInfo table in the Defender portal uses the Advanced hunting version of this table and the differences are documented here. We will soon release a unified version of this table, and all differences will be documented here. Depending on the type of Sentinel configuration scenarios, these may include breaking changes. Our recommendation is reviewing your existing content such as detection and hunting queries, workbooks, etc. and updating the content with the table changes accordingly. 

| IdentityInfo table changes                                                                                                      |                                                                                                                                       |                                                                                                                                                                                      |                                                                                             |                                                                  |
| --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Sentinel on Azure portal                                                                                                          | XDR only customer                                                                                                                     | USX customers (Sentinel + Defender)                                                                                                                                                  | Sentinel Only in Defender (without UEBA)                                                    | Sentinel Only in Defender (with UEBA)                            |
| Existing IdentityInfo table from Sentinel                                                                                         | New MDI / AH version of IdentityInfo table/ New fields + breaking changes (SourceProvider column replacement)                         | New unified IdentityInfo table including MDI and UEBA fields + breaking changes (SourceProvider column replacement)                                                                  | Light version of MDI IdentityInfo table which was not present before for Sentinel customers | Existing IdentityInfo table from Sentinel                        |
| existing IdentityInfo table in Sentinel                                                                                           |                                                                                                                                       |                                                                                                                                                                                      |                                                                                             |                                                                  |
| On May 9th: comparison with the previous experience and detailed information will be published in the XDR documentation           |                                                                                                                                       |                                                                                                                                                                                      |                                                                                             |                                                                  |
| On May 9th: comparison with the previous experience and detailed information will be published in the Sentinel UEBA documentation |                                                                                                                                       |                                                                                                                                                                                      |                                                                                             |                                                                  |
| On May 9th: comparison with the previous experience and detailed information will be published in the XDR documentation           |                                                                                                                                       |                                                                                                                                                                                      |                                                                                             |                                                                  |
| existing IdentityInfo table in Sentinel                                                                                          |                                                                                                                                       |                                                                                                                                                                                      |                                                                                             |                                                                  |
| No change needed unless you have Playbooks that query the AH API                                                                  | Defender features such as Custom detections or Advanced Hunting queries needs to be updated with new fields from  IdentityInfo table. | Defender features such as Custom detections or Advanced Hunting queries needs to be updated with the new schema from the unified IdentityInfo table. Playbooks that query the AH API | No change needed                                                                            | No change needed unless you have Playbooks that query the AH API |
|                                                                                                                                  |                                                                                                                                      | Sentinel features in Defender portal: no need to update queries in Analytic Rules, Workbook, Watchlist, Playbooks, Automation                                                        |                                                                                            |                                                                 |
| Blog post will also be published in the Sentinel Tech Community                                                                  |                                                                                                                                       |                                                                                                                                                                                      |                                                                                             |                                                                  |
| Other communications includes announcement in Message Center, CCP, Support team (CSS), internal announcements                     |                                                                                                                                       |                                                                                                                                                                                      |                                                                                             |                                                                  |

| Entities: Add entities to threat intelligence from incidents | Azure portal only | This functionality is unavailable in the Defender portal. <Br><br>For more information, see [Add entity to threat indicators](add-entity-to-threat-intelligence.md). |


### Update investigation processes to use Microsoft Defender threat intelligence

For Microsoft Sentinel customers moving from the Azure portal to the Defender portal, the familiar threat intelligence features are retained and enhanced with Defender's extensive threat intelligence capabilities, including:
<!--are these XDR only features or do they come w sentinel only too? if they come w sentinel only should they move to the usx docset? last one only comes with TI?-->

| Feature          | Description         |
|-------------------|------------|
| **Threat analytics** | An in-product solution provided by Microsoft security researchers, designed to help security teams by offering insights on emerging threats, active threats, and their impacts. The data is presented in an intuitive dashboard with cards, rows of data, filters, and more.  |
| **Intel Profiles**   | Categorize threats and behaviors by a Threat Actor Profile, making it easier to track and correlate. These profiles include any Indicators of Compromise (IoC) related to tactics, techniques, and tools used in attacks. |
| **Intel Explorer**   | Consolidates available IoCs and provides threat-related articles as they are posted, enabling security teams to stay updated on emerging threats.                                                        |
| **Intel Projects**    | Allows teams to consolidate threat intelligence into a 'project' for reviewing all artifacts related to a specific scenario of interest.            |

In the Defender portal, use the `ThreatIntelOjbects` and `ThreatIntelIndicators` together with Indicators or Compromise for threat hunting, incident response, Copilot, reporting, and to create relational graphs showing connections between indicators and entities.

For customers using the Microsoft Defender Threat Intelligence (MDTI) feed, a free version is available via Microsoft Sentinel's data connector for MDTI. Users with MDTI licenses can also ingest MDTI data and use Security Copilot for threat analysis, active threat review, and threat actor research.

For more information, see:

- [Threat management](microsoft-sentinel-defender-portal.md#threat-management)
- [Threat analytics in Microsoft Defender XDR](/defender-xdr/threat-analytics)
- [Using projects](/defender/threat-intelligence/using-projects)
- [Threat intelligence in Microsoft Sentinel](/azure/sentinel/understand-threat-intelligence)

### Use workbooks to visualize and report on Microsoft Defender data

Azure workbooks continue to be the primary tool for data visualization and interaction in the Defender portal, functioning as they did in the Azure portal.

To use workbooks with data from Advanced hunting, make sure that you ingest logs into Microsoft Sentinel. While workbooks themselves keep you in the Defender portal, buttons or links that are programmed to open pages or resources in the Azure portal continue to open a separate tab for the Azure portal.

For more information, see [Visualize and monitor your data by using workbooks in Microsoft Sentinel](monitor-your-data.md).

## Related content

- Find all related demo videos at [https://aka.ms/Sentinel_in_Defender_demos](https://aka.ms/Sentinel_in_Defender_demos)
- Watch our webinar: [Transition to the Unified SOC Platform: Deep Dive and Interactive Q&A for SOC Professionals](https://www.youtube.com/watch?v=WIM6fbJDkK4)
- Frequently asked questions: [TechCommunity blog](https://techcommunity.microsoft.com/blog/microsoftsentinelblog/unified-security-operations-platform---technical-faq/4189136) | [Microsoft Community Hub](https://techcommunity.microsoft.com/blog/microsoftsentinelblog/frequently-asked-questions-about-the-unified-security-operations-platform/4212048)

