---
title: Transition Your Microsoft Sentinel Environment to the Defender Portal
description: Move Microsoft Sentinel operations from the Azure portal to the Microsoft Defender portal.
author: batamig
ms.author: bagol
ms.topic: how-to #Required; leave this attribute/value as-is
ms.date: 07/29/2025
ms.collection: usx-security

#Customer intent: As a security operations team member, I want to understand the process involved in moving our Microsoft Sentinel experience from the Azure portal to the Defender portal so that I can benefit from unified security operations across my entire environment.
---

# Transition your Microsoft Sentinel environment to the Defender portal

Microsoft Sentinel is available in the Microsoft Defender portal with [Microsoft Defender XDR](/microsoft-365/security/defender) or on its own. It delivers a unified experience across SIEM and XDR for faster, more accurate threat detection and response, simpler workflows, and better operational efficiency.

This article explains how to transition your Microsoft Sentinel experience from the Azure portal to the Defender portal. If you use Microsoft Sentinel in the Azure portal, transition to Microsoft Defender for unified security operations and the latest features. For more information, see [Microsoft Sentinel in the Microsoft Defender portal](microsoft-sentinel-defender-portal.md) or watch our [YouTube playlist](https://www.youtube.com/playlist?list=PL3ZTgFEc7Lyska6WLWBzc8sob-kYA2jPj).

## Prerequisites

Before you start, note:

- This article is for customers with an existing workspace enabled for Microsoft Sentinel who want to transition their Microsoft Sentinel experience to the Defender portal. If you're a new customer who onboarded with permissions of a subscription [Owner](/azure/role-based-access-control/built-in-roles#owner) or a [User access administrator](/azure/role-based-access-control/built-in-roles#user-access-administrator), your workspaces are [automatically onboarded to the Defender portal](quickstart-onboard.md).

- Some Microsoft Sentinel features have new locations in the Defender portal. For more information, see [Quick reference](microsoft-sentinel-defender-portal.md#quick-reference).

- When relevant, detailed prerequisites are in the linked articles for each step.


## Plan and set up your transition environment

**Audience**: Security architects

**Videos**:

- [Onboarding a Microsoft Sentinel workspace in Microsoft Defender](https://youtu.be/Hgcz87XdJx0?si=n78kqKVoLvbwZp5k)
- [Managing unified RBAC in Microsoft Defender](https://youtu.be/0xvPy1zWIfg?si=sBuxxOVr1O_yuTyS)

### Review planning guidance, complete prerequisites, and onboard
 
Review all planning guidance and finish all prerequisites before you onboard your workspace to the Defender portal. For more information, see the following articles:

- [**Plan for unified security operations in the Defender portal**](/unified-secops-platform/overview-plan). After onboarding to the Defender portal, the **[Microsoft Sentinel Contributor](/azure/role-based-access-control/built-in-roles/security#microsoft-sentinel-contributor)** role is assigned to the **Microsoft Threat Protection** and **WindowsDefenderATP** apps in your subscription.

- [**Deploy for unified security operations in the Defender portal**](/unified-secops-platform/overview-deploy). While this article is for new customers who don't yet have a workspace for Microsoft Sentinel or other services onboarded to the Defender portal, use it as a reference if you're moving to the Defender portal.

- [**Connect Microsoft Sentinel to the Defender portal**](/unified-secops-platform/microsoft-sentinel-onboard). This article lists the prerequisites for onboarding your workspace to the Defender portal. If you plan to use Microsoft Sentinel without Defender XDR, you need to take an extra step to trigger the connection between Microsoft Sentinel and the Defender portal.

### Review differences for data storage and privacy

When you use the Azure portal, the [Microsoft Sentinel policies](geographical-availability-data-residency.md) for data storage, process, retention, and sharing apply. When you use the Defender portal, the [Microsoft Defender XDR policies](/defender-xdr/data-privacy) apply instead, even when you work with Microsoft Sentinel data.

The following table provides additional details and links so that you can compare experiences across the Azure and Defender portals.

|Area of support |Azure portal |Defender portal  |
|---------|---------|---------|
|**BCDR**     | Customers are responsible for replicating their data        |  Microsoft Defender uses automation for BCDR on control panes.       |
|**Data storage and processing**  |   - [Data storage location](geographical-availability-data-residency.md#data-storage-location) <br>- [Supported regions](geographical-availability-data-residency.md#supported-regions)      |  [Data storage location](/defender-xdr/data-privacy#data-storage-location)       |
|**Data retention**     |  [Data retention](geographical-availability-data-residency.md#data-retention)    | [Data retention](/defender-xdr/data-privacy#data-retention)      |
|**Data sharing**     |  [Data sharing](geographical-availability-data-residency.md#data-sharing-for-microsoft-sentinel)       |  [Data sharing](/defender-xdr/data-privacy#data-sharing)       |

For more information, see:

- [Geographical availability and data residency in Microsoft Sentinel](geographical-availability-data-residency.md)
- [Data security and retention in Microsoft Defender XDR](/defender-xdr/data-privacy)

### Onboarding to the Defender portal with customer-managed keys (CMK)

If you onboard your Microsoft Sentinel-enabled workspace to the Defender portal, ingested workspace data/logs remain encrypted with CMK. Other data isn't encrypted with CMK and uses a Microsoft-managed key.

For more information, see [Set up Microsoft Sentinel customer-managed key](customer-managed-keys.md).

### Configure multi-workspace and multitenant management

Defender supports one or more workspaces across multiple tenants through the [multitenant portal](https://mto.security.microsoft.com), which serves as a central place to manage incidents and alerts, hunt for threats across tenants, and lets Managed Security Service Partners (MSSPs) see across customers.

In multi-workspace scenarios, the multitenant portal lets you connect one primary workspace and multiple secondary workspaces per tenant. Onboard each workspace to the Defender portal separately for each tenant, just like onboarding for a single tenant.

For more information, see:

- [**Set up Microsoft Defender multitenant management**](/unified-secops-platform/mto-requirements)

- [**Azure Lighthouse documentation**](/azure/lighthouse/how-to/manage-sentinel-workspaces). Azure Lighthouse lets you use Microsoft Sentinel data from other tenants across onboarded workspaces. For example, you can run cross-workspace queries with the `workspace()` operator in Advanced hunting and analytics rules.

- [**Microsoft Entra B2B**](/entra/identity/multi-tenant-organizations/overview#b2b-direct-connect). Microsoft Entra B2B lets you access data across tenants. GDAP isn't supported for Microsoft Sentinel data.

## Configure and review your settings and content

**Audience**: Security engineers

**Video**: [Managing connectors in Microsoft Defender](https://youtu.be/IW9WOhhLbmY?si=XX4IXe47o9bXnWlV)

### Confirm and configure data collection

When Microsoft Sentinel is integrated with Microsoft Defender, the fundamental architecture of data collection and telemetry flow remains intact. Existing connectors that were configured in Microsoft Sentinel, whether for Microsoft Defender products or other data sources, continue operating without interruption.

Alerts related to Defender products are streamed directly from the Microsoft Defender XDR data connector to ensure consistency. Make sure that you have incidents and alerts from this connector turned on in your workspace. For more information, see [Connect data from Microsoft Defender XDR to Microsoft Sentinel](connect-microsoft-365-defender.md).

From a Log Analytics perspective, Microsoft Sentinel’s integration into Microsoft Defender introduces no change to the underlying ingestion pipeline or data schema. Despite the front-end unification, the Microsoft Sentinel backend remains fully integrated with Log Analytics for data storage, search, and correlation.

#### Integrate with Microsoft Defender for Cloud

- If you're using the tenant-based data connector for Defender for Cloud, make sure to take action to prevent duplicate events and alerts. 
- If you're using the legacy, subscription-based connector instead, make sure to opt out of syncing incidents and alerts to Microsoft Defender.

For more information, see [Alerts and incidents in Microsoft Defender](/azure/defender-for-cloud/concept-integration-365#microsoft-sentinel-customers).

#### Data connector visibility in the Defender portal

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

- [**Deploy content as code from your repository** (Public preview)](ci-cd.md). Use YAML or JSON files in GitHub or Azure DevOps to manage and deploy configurations across Microsoft Sentinel and Defender using unified CI/CD workflows.

- [**Multitenant portal**](/unified-secops-platform/mto-overview). The Microsoft Defender multitenant portal supports managing and distributing content across multiple tenants.

Otherwise, continue to deploy solution packages that include various types of security content from the Content hub in the Defender portal. For more information, see [Discover and manage Microsoft Sentinel out-of-the-box content](sentinel-solutions-deploy.md).

### Configure analytics rules

Microsoft Sentinel analytics rules are [available in the Defender portal](microsoft-sentinel-defender-portal.md#configuration) for detection, configuration, and management. The functionalities of analytics rules remain the same, including creation, updating, and management through the wizard, repositories, and the Microsoft Sentinel API. Incident correlation and multi-stage attack detection also continue to work in the Defender portal. The alert correlation functionality managed by the Fusion analytics rule in the Azure portal is handled by the Defender XDR engine in the Defender portal, which consolidates all signals in one place.

When moving to the Defender portal, the following changes are important to note:

| Feature    | Description    |
|--------------|-----|
| **Custom detection rules**   | If you have detection use cases that involve both Defender XDR and Microsoft Sentinel data,  where you don't need to retain Defender XDR data for more than 30 days, we recommend creating [custom detection rules](/defender-xdr/custom-detections-overview) that query data from both Microsoft Sentinel and Defender XDR tables. <br><br>This is supported without needing to ingest Defender XDR data into Microsoft Sentinel. For more information, see [Use Microsoft Sentinel custom functions in advanced hunting in Microsoft Defender](/defender-xdr/advanced-hunting-defender-use-custom-rules#custom-detection-rules). |
| **Alert correlation**     | In the Defender portal, correlations are automatically applied to alerts against both Microsoft Defender data and third-party data ingested from Microsoft Sentinel, regardless of alert scenarios. <br><br>The criteria used to correlate alerts together in a single incident are part of the Defender portal's proprietary, internal correlation logic. For more information, see [Alert correlation and incident merging in the Defender portal](/defender-xdr/alerts-incidents-correlation).  |
| **Alert grouping and incident merging**       | While you will still see the alert grouping configuration in Analytics rules, the [Defender XDR correlation engine](/defender-xdr/alerts-incidents-correlation) fully controls alert grouping and incident merging when necessary in the Defender portal. This ensures a comprehensive view of the full attack story by stitching together relevant alerts for multi-stage attacks. <br><br>For example, multiple individual analytics rules configured to generate an incident for each alert may result in merged incidents if they match Defender XDR correlation logic. |
| **Alert visibility**   | If you have Microsoft Sentinel analytics rules [configured to trigger alerts only](create-analytics-rules.md#configure-the-incident-creation-settings), with incident creation turned off, these alerts aren't visible in the Defender portal. <br><br>However, while the **Advanced hunting** query editor doesn't recognize the `SecurityAlerts` table schema, you can still use the table in queries and analytics rules.               |
| **Alert tuning**  | Once your Microsoft Sentinel workspace is onboarded to Defender, all incidents, including those from your Microsoft Sentinel analytics rules, are generated by the Defender XDR engine. As a result, the [alert tuning capabilities](/defender-xdr/investigate-alerts#tune-an-alert) in the Defender portal, previously available only for Defender XDR alerts, can now be applied to alerts from Microsoft Sentinel. <br><br>This feature allows you to streamline incident response by automating the resolution of common alerts, reducing false positives, and minimizing noise, so analysts can prioritize significant security incidents. |
| **Fusion: Advanced multistate attack detection** | The Fusion analytics rule, which in the Azure portal, creates incidents based on alert correlations made by the Fusion correlation engine, is disabled when you onboard Microsoft Sentinel to the Defender portal. <br><br>You don't lose alert correlation functionality because the Defender portal uses Microsoft Defender XDR's incident-creation and correlation functionalities to replace those of the Fusion engine. <br><br>For more information, see [Advanced multistage attack detection in Microsoft Sentinel](fusion.md) |

### Configure automation rules and playbooks

In Microsoft Sentinel, playbooks are based on workflows built in [Azure Logic Apps](/azure/logic-apps/logic-apps-overview), a cloud service that helps you schedule, automate, and orchestrate tasks and workflows across systems throughout the enterprise.

The following limitations apply to Microsoft Sentinel automation rules and playbooks when working in the Defender portal. You might need to make some changes in your environment when making the transition.

[!INCLUDE [automation-in-defender](includes/automation-in-defender.md)]

### Configure APIs

The unified experience in the Defender portal introduces notable changes to incidents and alerts from APIs. It supports API calls based on the [Microsoft Graph REST API v1.0](/graph/api/resources/security-api-overview?view=graph-rest-1.0), which can be used for automation related to alerts, incidents, advanced hunting, and more.

The [Microsoft Sentinel API](/rest/api/securityinsights/api-versions) continues to support actions against Microsoft Sentinel resources, like analytics rules, automation rules and more.   For interacting with unified incidents and alerts, we recommend that you use the Microsoft Graph REST API.
If you're using the Microsoft Sentinel `SecurityInsights` API to interact with Microsoft Sentinel incidents, you may need to update your automation conditions and trigger criteria due to changes in the response body.

The following table lists fields that are important in the response snippets, and compares them across the Azure and Defender portals:

| Functionality | Azure portal | Defender portal |
|----------------|--------------|----------------|
| **Link to the incident**| `incidentUrl`: The direct URL to the incident in the Microsoft Sentinel portal | `providerIncidentUrl` : This additional field provides a direct link to the incident, which can be used to synchronize this information with a third-party ticketing system like ServiceNow. <br><br>`incidentUrl` is still available, but it points to the Microsoft Sentinel portal. |
| **The sources that triggered the detection and published the alert** | `alertProductNames` | `alertProductNames`: Requires adding `?$expand=alerts` to the GET. <br><br>For example, `https://graph.microsoft.com/v1.0/security/incidents/368?$expand=alerts`|
| **The name of the alert provider**| `providerName` = "Azure Sentinel" | `providerName` = "Microsoft XDR" |
| **The service or product that created the alert** |Doesn't exist in the Azure portal |`serviceSource` <br><br>For example, "microsoftDefenderForCloudApps" | 
| **The detection technology or sensor that identified the notable component or activity** | Doesn't exist in the Azure portal| `detectionSource` For example, "cloudAppSecurity"|
| **The name of the product which published this alert** |Doesn't exist in the Azure portal |`productName` For example, "Microsoft Defender for Cloud Apps" |

## Run operations in the Defender portal

**Audience**: Security analysts

**Videos**:

- [Discover and manage Microsoft Sentinel content and threat intelligence in Microsoft Defender](https://youtu.be/HQ4JxM8-v5g?si=tMdCCMYOkPv28m_w)
- [Create automation and workbooks in Microsoft Defender](https://youtu.be/Lc0T_hPTug4?si=TgEpXViwxet7M7t1)
- [Alert correlation in Microsoft Defender](https://youtu.be/GIIxN1dMJTc?si=7VEO6asJA6dBC-V0)
- [Incident investigation in Microsoft Defender](https://youtu.be/BnZBVm8ZGsY?si=I-uHGASquUrr4xN5)
- [Case management in Microsoft Defender](https://youtu.be/TxLz-NsxcrM?si=hgg3DujUICLozuYt)
- [Advanced hunting in Microsoft Defender](https://youtu.be/06ukKCHMkeY?si=520Gg8JNmRVYUXKD)
- [SOC optimizations in Microsoft Defender](https://youtu.be/-Cv5K8A4kfY?si=3o9xVB7WnfH0E3VR)

### Update incident triage processes for the Defender portal

If you've used Microsoft Sentinel in the Azure portal, you'll notice significant user experience enhancements in the Defender portal. While you may need to update SOC processes and retrain your analysts, the design consolidates all relevant information in a single place to provide more streamlined and efficient workflows.

The unified incident queue in the Defender portal consolidates all incidents across products into a single view, impacting how analysts triage incidents that now contain multiple, cross-security domain alerts. For example:

- Traditionally, analysts triage incidents based on specific security domains or expertise, often handling tickets per entity, such as a user or host. This approach can create blind spots, which the unified experience aims to address.
- When an attacker moves laterally, related alerts might end up in separate incidents due to different security domains. The unified experience eliminates this issue by providing a comprehensive view, ensuring all related alerts are correlated and managed cohesively.

Analysts can also view detection sources and product names in the Defender portal, and apply and share filters for more efficient incident and alert triage.

The unified triage process can help reduce analyst workloads and even potentially combine the roles of tier 1 and tier 2 analysts. However, the unified triage process can also require broader and deeper analyst knowledge. We recommend training on the new portal interface to ensure a smooth transition.

For more information, see [Incidents and alerts in the Microsoft Defender portal](/defender-xdr/incidents-overview?toc=%2Fazure%2Fsentinel%2FTOC.json&bc=%2Fazure%2Fsentinel%2Fbreadcrumb%2Ftoc.json).

### Understand how alerts are correlated and incidents are merged in the Defender portal

Defender’s correlation engine merges incidents when it recognizes common elements between alerts in separate incidents. When a new alert meets correlation criteria, Microsoft Defender aggregates and correlates it with other related alerts from all the detection sources into a new incident. After onboarding Microsoft Sentinel to the Defender portal, the unified incident queue reveals a more comprehensive attack, making analysts more efficient and providing a complete attack story.

In multi-workspace scenarios, only alerts from a primary workspace are correlated with Microsoft Defender XDR data. There are also specific scenarios in which incidents aren't merged.

After onboarding Microsoft Sentinel to the Defender portal, the following changes apply to incidents and alerts:

|Feature |Description |
|---------|---------|
|**Delay just after onboarding your workspace**  <a name="5min"></a>   | It may take up to 5 minutes for Microsoft Defender incidents to fully integrate with Microsoft Sentinel. This doesn't affect features provided directly by Microsoft Defender, such as automatic attack disruption.        |
|**Security incident creation rules**     | Any active [Microsoft security incident creation rules](create-incidents-from-alerts.md) are deactivated to avoid creating duplicate incidents. The incident creation settings in other types of analytics rules remain as they are, and are configurable in the Defender portal.   |
|**Incident provider name**     | In the Defender portal, the **Incident provider name** is always Microsoft XDR.        |
|**Adding / removing alerts from incidents**     | Adding or removing Microsoft Sentinel alerts to or from incidents is supported only in the Defender portal. To remove an alert from an incident in the Defender portal, you must [add the alert to another incident](/defender-xdr/move-alert-to-another-incident).        |
|**Editing comments**     |  Add comments to incidents in either the Defender or Azure portal, but editing existing comments isn't supported in the Defender portal. Edits made to comments in the Azure portal aren't synchronized to the Defender portal.       |
|**Programmatic and manual creation of incidents**     |    Incidents created in Microsoft Sentinel through the API, by a Logic App playbook, or manually from the Azure portal, aren't synchronized to the Defender portal. These incidents are still supported in the Azure portal and the API. See [Create your own incidents manually in Microsoft Sentinel](create-incident-manually.md).     |
| **Reopening closed incidents** | In the Defender portal, you can't set alert grouping in Microsoft Sentinel analytics rules to reopen closed incidents if new alerts are added. <br>Closed incidents aren't reopened in this case, and new alerts trigger new incidents.|
| **Tasks** | Incident tasks are unavailable in the Defender portal. <br><br>For more information, see [Use tasks to manage incidents in Microsoft Sentinel](incident-tasks.md). |

For more information, see [Incidents and alerts in the Microsoft Defender portal](/defender-xdr/incidents-overview) and [Alert correlation and incident merging in the Microsoft Defender portal](/defender-xdr/alerts-incidents-correlation).

### Note changes for investigations with Advanced hunting

After onboarding Microsoft Sentinel to the Defender portal, access and use all your existing log tables, Kusto Query Language (KQL) queries, and functions in the **Advanced hunting** page. All Microsoft Sentinel alerts that are tied to incidents are ingested into the `AlertInfo` table, accessible from the **Advanced hunting** page.

Some differences exist, such as:

- Bookmarks aren't supported in **Advanced hunting**. Instead, bookmarks are supported in the Defender portal under **Microsoft Sentinel > Threat management > Hunting**.
- While the **SecurityAlert** table doesn't appear in **Advanced hunting** > **Schema** list of tables, it's still supported in your queries.

For more information, see [Advanced hunting with Microsoft Sentinel data in Microsoft Defender](/defender-xdr/advanced-hunting-microsoft-defender), especially the list of [known issues](/defender-xdr/advanced-hunting-microsoft-defender), and [Keep track of data during hunting with Microsoft Sentinel](/azure/sentinel/bookmarks).

### Investigate with entities in the Defender portal

In the Microsoft Defender portal, entities are generally either *assets*, such as accounts, hosts, or mailboxes, or *evidence*, such as IP addresses, files, or URLs. 

After onboarding Microsoft Sentinel to the Defender portal, entity pages for [users](/defender-xdr/investigate-users), [devices](/defender-xdr/entity-page-device), and IP addresses are consolidated into a single view with a comprehensive view of the entity's activity and context and data from both Microsoft Sentinel and Microsoft Defender XDR.

The Defender portal also provides a global search bar that centralizes results from all entities so that you can search across SIEM and XDR.

For more information, see [Entity pages in Microsoft Sentinel](/azure/sentinel/entity-pages?tabs=defender-portal).

### Investigate with UEBA in the Defender portal

Most functionalities of User and Entity Behavior Analytics (UEBA) remain the same in the Defender portal as they were in the Azure portal, with the following exceptions:

- Adding entities to threat intelligence from incidents is supported only in the Azure portal. For more information, see [Add entity to threat indicators](add-entity-to-threat-intelligence.md).

- After onboarding Microsoft Sentinel to the Defender portal, the `IdentityInfo` table used in the Defender portal includes unified fields from both Defender XDR and Microsoft Sentinel. Some fields that existed when used in the Azure portal are either renamed in the Defender portal, or aren't supported at all. We recommend that you check your queries for any references to these fields and update them as needed. For more information, see [IdentityInfo table](ueba-reference.md?tabs=unified-table#identityinfo-table).

### Update investigation processes to use Microsoft Defender threat intelligence

For Microsoft Sentinel customers moving from the Azure portal to the Defender portal, the familiar threat intelligence features are retained in the Defender portal under **Intel management**, and enhanced with other threat intelligence features available in the Defender portal. Supported features depend on the licenses you have, such as:

| Feature          | Description         |
|-------------------|------------|
| **Threat analytics** | Supported for [Microsoft Defender XDR](/defender-xdr/) customers. An in-product solution provided by Microsoft security researchers, designed to help security teams by offering insights on emerging threats, active threats, and their impacts. The data is presented in an intuitive dashboard with cards, rows of data, filters, and more.  |
| **Intel Profiles**   | Supported for [Microsoft Defender Threat Intelligence](/defender/threat-intelligence/) customers. Categorize threats and behaviors by a Threat Actor Profile, making it easier to track and correlate. These profiles include any Indicators of Compromise (IoC) related to tactics, techniques, and tools used in attacks. |
| **Intel Explorer**   | Supported for [Microsoft Defender Threat Intelligence](/defender/threat-intelligence/) customers.  Consolidates available IoCs and provides threat-related articles as they are posted, enabling security teams to stay updated on emerging threats.                                                        |
| **Intel Projects**    | Supported for [Microsoft Defender Threat Intelligence](/defender/threat-intelligence/) customers. Allows teams to consolidate threat intelligence into a 'project' for reviewing all artifacts related to a specific scenario of interest.            |

In the Defender portal, use the `ThreatIntelOjbects` and `ThreatIntelIndicators` together with Indicators for Compromise for threat hunting, incident response, Copilot, reporting, and to create relational graphs showing connections between indicators and entities.

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

### Similar incidents (Preview) aren't supported in the Defender portal

The Microsoft Sentinel [similar incidents](investigate-cases.md#similar-incidents-preview) feature is in Preview, isn't supported in the Defender portal. This means that when viewing an incident details page in the Defender portal, the **Similar incidents** tab isn't available.

## Related content

- [The Best of Microsoft Sentinel - now in Microsoft Defender](https://techcommunity.microsoft.com/blog/MicrosoftThreatProtectionBlog/the-best-of-microsoft-sentinel-%E2%80%94-now-in-microsoft-defender/4415822) (blog)
- Watch the webinar: [Transition to the Unified SOC Platform: Deep Dive and Interactive Q&A for SOC Professionals](https://www.youtube.com/watch?v=WIM6fbJDkK4).
- See frequently asked questions in the [TechCommunity blog](https://techcommunity.microsoft.com/blog/microsoftsentinelblog/unified-security-operations-platform---technical-faq/4189136) or the [Microsoft Community Hub](https://techcommunity.microsoft.com/blog/microsoftsentinelblog/frequently-asked-questions-about-the-unified-security-operations-platform/4212048).

