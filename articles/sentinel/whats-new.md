---
title: What's new in Microsoft Sentinel
description: This article describes new features in Microsoft Sentinel from the past few months.
author: yelevin
ms.author: yelevin
ms.topic: conceptual
ms.date: 09/06/2022
ms.custom: ignite-fall-2021
---

# What's new in Microsoft Sentinel

This article lists recent features added for Microsoft Sentinel, and new features in related services that provide an enhanced user experience in Microsoft Sentinel.

If you're looking for items older than six months, you'll find them in the [Archive for What's new in Sentinel](whats-new-archive.md). For information about earlier features delivered, see our [Tech Community blogs](https://techcommunity.microsoft.com/t5/azure-sentinel/bg-p/AzureSentinelBlog/label-name/What's%20New).

> [!IMPORTANT]
> Noted features are currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

> [!TIP]
> Our threat hunting teams across Microsoft contribute queries, playbooks, workbooks, and notebooks to the [Microsoft Sentinel Community](https://github.com/Azure/Azure-Sentinel), including specific [hunting queries](https://github.com/Azure/Azure-Sentinel) that your teams can adapt and use.
>
> You can also contribute! Join us in the [Microsoft Sentinel Threat Hunters GitHub community](https://github.com/Azure/Azure-Sentinel/wiki).

## October 2022

### Out of the box anomaly detection on the SAP audit log (Preview)

The SAP audit log records audit and security events on SAP systems, like failed sign-in attempts or other over 200 security related actions. Customers monitor the SAP audit log and generate alerts and incidents out of the box using Microsoft Sentinel built-in analytics rules.

The Microsoft Sentinel for SAP solution now includes the [**SAP - Dynamic Anomaly Detection analytics** rule](https://aka.ms/Sentinel4sapDynamicAnomalyAuditRuleBlog), adding an out of the box capability to identify suspicious anomalies across the SAP audit log events. 

Now, together with the existing ability to identify threats deterministically based on predefined patterns and thresholds, customers can easily identify suspicious anomalies in the SAP security log, out of the box, with no coding required.

You can fine-tune the new capability by editing the [SAP_Dynamic_Audit_Log_Monitor_Configuration and SAP_User_Config watchlists](sap-solution-security-content.md#available-watchlists).

Learn more:
- [Learn about the new feature (blog)](https://aka.ms/Sentinel4sapDynamicAnomalyAuditRuleBlog)
- [Use the new rule for anomaly detection](sap/configure-audit-log-rules.md#anomaly-detection)

## September 2022

- [Create automation rule conditions based on custom details (Preview)](#create-automation-rule-conditions-based-on-custom-details-preview)
- [Add advanced "Or" conditions to automation rules (Preview)](#add-advanced-or-conditions-to-automation-rules-preview)
- [Heads up: Name fields being removed from UEBA UserPeerAnalytics table](#heads-up-name-fields-being-removed-from-ueba-userpeeranalytics-table)
- [Windows DNS Events via AMA connector (Preview)](#windows-dns-events-via-ama-connector-preview)
- [Create and delete incidents manually (Preview)](#create-and-delete-incidents-manually-preview)
- [Add entities to threat intelligence (Preview)](#add-entities-to-threat-intelligence-preview)

### Create automation rule conditions based on custom details (Preview)

You can set the value of a [custom detail surfaced in an incident](surface-custom-details-in-alerts.md) as a condition of an automation rule. Recall that custom details are data points in raw event log records that can be surfaced and displayed in alerts and the incidents generated from them. Through custom details you can get to the actual relevant content in your alerts without having to dig through query results.

Learn how to [add a condition based on a custom detail](create-manage-use-automation-rules.md#conditions-based-on-custom-details-preview).

### Add advanced "Or" conditions to automation rules (Preview)

You can now add OR conditions to automation rules. Also known as condition groups, these allow you to combine several rules with identical actions into a single rule, greatly increasing your SOC's efficiency.

For more information, see [Add advanced conditions to Microsoft Sentinel automation rules](add-advanced-conditions-to-automation-rules.md).

### Heads up: Name fields being removed from UEBA UserPeerAnalytics table

As of **September 30, 2022**, the UEBA engine will no longer perform automatic lookups of user IDs and resolve them into names. This change will result in the removal of four name fields from the *UserPeerAnalytics* table: 

- UserName
- UserPrincipalName
- PeerUserName
- PeerUserPrincipalName 

The corresponding ID fields remain part of the table, and any built-in queries and other operations will execute the appropriate name lookups in other ways (using the IdentityInfo table), so you shouldn’t be affected by this change in nearly all circumstances. 

The only exception to this is if you’ve built custom queries or rules directly referencing any of these name fields. In this scenario, you can incorporate the following lookup queries into your own, so you can access the values that would have been in these name fields. 

The following query resolves **user** and **peer identifier fields**: 

```kusto
UserPeerAnalytics 
| where TimeGenerated > ago(24h) 
// join to resolve user identifier fields 
| join kind=inner ( 
    IdentityInfo  
    | where TimeGenerated > ago(14d) 
    | distinct AccountTenantId, AccountObjectId, AccountUPN, AccountDisplayName 
    | extend UserPrincipalNameIdentityInfo = AccountUPN 
    | extend UserNameIdentityInfo = AccountDisplayName 
    | project AccountTenantId, AccountObjectId, UserPrincipalNameIdentityInfo, UserNameIdentityInfo 
) on $left.AADTenantId == $right.AccountTenantId, $left.UserId == $right.AccountObjectId 
// join to resolve peer identifier fields 
| join kind=inner ( 
    IdentityInfo  
    | where TimeGenerated > ago(14d) 
    | distinct AccountTenantId, AccountObjectId, AccountUPN, AccountDisplayName 
    | extend PeerUserPrincipalNameIdentityInfo = AccountUPN 
    | extend PeerUserNameIdentityInfo = AccountDisplayName 
    | project AccountTenantId, AccountObjectId, PeerUserPrincipalNameIdentityInfo, PeerUserNameIdentityInfo 
) on $left.AADTenantId == $right.AccountTenantId, $left.PeerUserId == $right.AccountObjectId 
```
If your original query referenced the user or peer names (not just their IDs), substitute this query in its entirety for the table name (“UserPeerAnalytics”) in your original query. 

### Windows DNS Events via AMA connector (Preview)

You can now use the new [Windows DNS Events via AMA connector](connect-dns-ama.md) to stream and filter events from your Windows Domain Name System (DNS) server logs to the `ASimDnsActivityLog` normalized schema table. You can then dive into your data to protect your DNS servers from threats and attacks.

The Azure Monitor Agent (AMA) and its DNS extension are installed on your Windows Server to upload data from your DNS analytical logs to your Microsoft Sentinel workspace.

Here are some benefits of using AMA for DNS log collection:

- AMA is faster compared to the existing Log Analytics Agent (MMA/OMS). AMA handles up to 5000 events per second (EPS) compared to 2000 EPS with the existing agent.
- AMA provides centralized configuration using Data Collection Rules (DCRs), and also supports multiple DCRs.
- AMA supports transformation from the incoming stream into other data tables.
- AMA supports basic and advanced filtering of the data. The data is filtered on the DNS server and before the data is uploaded, which saves time and resources.

### Create and delete incidents manually (Preview)

Microsoft Sentinel **incidents** have two main sources: 

- They are generated automatically by detection mechanisms that operate on the logs and alerts that Sentinel ingests from its connected data sources.

- They are ingested directly from other connected Microsoft security services (such as [Microsoft 365 Defender](microsoft-365-defender-sentinel-integration.md)) that created them.

There can, however, be data from sources *not ingested into Microsoft Sentinel*, or events not recorded in any log, that justify launching an investigation. For this reason, Microsoft Sentinel now allows security analysts to manually create incidents from scratch for any type of event, regardless of its source or associated data, in order to manage and document the investigation.

Since this capability raises the possibility that you'll create an incident in error, Microsoft Sentinel also allows you to delete incidents right from the portal as well.

- [Learn more about creating incidents manually](create-incident-manually.md).
- [Learn more about deleting incidents](delete-incident.md).

### Add entities to threat intelligence (Preview)

When investigating an incident, you examine entities and their context as an important part of understanding the scope and nature of the incident. In the course of the investigation, you may discover an entity in the incident that should be labeled and tracked as an indicator of compromise (IOC), a threat indicator.

Microsoft Sentinel allows you to flag the entity as malicious, right from within the investigation graph. You'll then be able to view this indicator both in Logs and in the Threat Intelligence blade in Sentinel.

Learn how to [add an entity to your threat intelligence](add-entity-to-threat-intelligence.md).

## August 2022

- [Heads up: Microsoft 365 Defender now integrates Azure Active Directory Identity Protection (AADIP)](#heads-up-microsoft-365-defender-now-integrates-azure-active-directory-identity-protection-aadip)
- [Azure resource entity page (Preview)](#azure-resource-entity-page-preview)
- [New data sources for User and entity behavior analytics (UEBA) (Preview)](#new-data-sources-for-user-and-entity-behavior-analytics-ueba-preview)
- [Microsoft Sentinel Solution for SAP is now generally available](#microsoft-sentinel-solution-for-sap-is-now-generally-available)

### Heads up: Microsoft 365 Defender now integrates Azure Active Directory Identity Protection (AADIP)

[Microsoft 365 Defender](/microsoft-365/security/defender/) is gradually rolling out the integration of [Azure Active Directory Identity Protection (AADIP)](../active-directory/identity-protection/index.yml) alerts and incidents.

Microsoft Sentinel customers with the [Microsoft 365 Defender connector](microsoft-365-defender-sentinel-integration.md) enabled will automatically start receiving AADIP alerts and incidents in their Microsoft Sentinel incidents queue. Depending on your configuration, this may affect you as follows:

- If you already have your AADIP connector enabled in Microsoft Sentinel, you may receive duplicate incidents. To avoid this, you have a few choices, listed here in descending order of preference:

    - Disable incident creation in your AADIP data connector.

    - Disable AADIP integration at the source, in your Microsoft 365 Defender portal.

    - Create an automation rule in Microsoft Sentinel to automatically close incidents created by the [Microsoft Security analytics rule](create-incidents-from-alerts.md) that creates AADIP incidents.

- If you don't have your AADIP connector enabled, you may receive AADIP incidents, but without any data in them. To correct this, simply [enable your AADIP connector](data-connectors-reference.md#azure-active-directory-identity-protection). Be sure **not** to enable incident creation on the connector page.

- If you're first enabling your Microsoft 365 Defender connector now, the AADIP connection will be made automatically behind the scenes. You won't need to do anything else.

### Azure resource entity page (Preview)

Azure resources such as Azure Virtual Machines, Azure Storage Accounts, Azure Key Vault, Azure DNS, and more are essential parts of your network. Threat actors might attempt to obtain sensitive data from your storage account, gain access to your key vault and the secrets it contains, or infect your virtual machine with malware. The new [Azure resource entity page](entity-pages.md) is designed to help your SOC investigate incidents that involve Azure resources in your environment, hunt for potential attacks, and assess risk.

You can now gain a 360-degree view of your resource security with the new entity page, which provides several layers of security information about your resources. 

First, it provides some basic details about the resource: where it is located, when it was created, to which resource group it belongs, the Azure tags it contains, etc. Further, it surfaces information about access management: how many owners, contributors, and other roles are authorized to access the resource, and what networks are allowed access to it; what is the permission model of the key vault, is public access to blobs allowed in the storage account, and more. Finally, the page also includes some integrations, such as Microsoft Defender for Cloud, Defender for Endpoint, and Purview that enrich the information about the resource.

### New data sources for User and entity behavior analytics (UEBA) (Preview)

The [Security Events data source](ueba-reference.md#ueba-data-sources) for UEBA, which until now included only event ID 4624 (An account was successfully logged on), now includes four more event IDs and types, currently in **PREVIEW**:

   - 4625: An account failed to log on.
   - 4648: A logon was attempted using explicit credentials.
   - 4672: Special privileges assigned to new logon.
   - 4688: A new process has been created.

Having user data for these new event types in your workspace will provide you with more and higher-quality insights into the described user activities, from Active Directory and Azure AD enrichments to anomalous activity to matching with internal Microsoft threat intelligence, all further enabling your incident investigations to piece together the attack story.

As before, to use this data source you must enable the [Windows Security Events data connector](data-connectors-reference.md#windows-security-events-via-ama). If you have enabled the Security Events data source for UEBA, you will automatically begin receiving these new event types without having to take any additional action.

It's likely that the inclusion of these new event types will result in the ingestion of somewhat more *Security Events* data, billed accordingly. Individual event IDs cannot be enabled or disabled independently; only the whole Security Events data set together. You can, however, filter the event data at the source if you're using the new [AMA-based version of the Windows Security Events data connector](data-connectors-reference.md#windows-security-events-via-ama).

### Microsoft Sentinel Solution for SAP is now generally available

The Microsoft Sentinel Solution for SAP is now generally available (GA). The solution is free until February 2023, when an additional cost will be added on top of the ingested data. [Learn more about pricing](https://azure.microsoft.com/pricing/offers/microsoft-sentinel-sap-promo/).

With previous versions, every solution update would duplicate content, creating new objects alongside the previous version objects. The GA version uses rule and workbook templates, so that for every solution update, you can clearly understand what has changed, using a dedicated wizard. [Learn more about rule templates](manage-analytics-rule-templates.md).

[Learn more about the updated solution](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/protect-critical-information-within-sap-systems-against/ba-p/3586943).

#### Solution highlights

The Microsoft Sentinel solution for SAP allows you to monitor, detect, and respond to suspicious activities within the SAP ecosystem, protecting your sensitive data against sophisticated cyber attacks. 

Use the solution to: 

- Monitor all SAP system layers 
- Gain visibility across business logic, application, databases, and operating system layers with built-in investigation and threat detection tools 
- Detect and automatically respond to threats 
- Discover suspicious activity including privilege escalation, unauthorized changes, sensitive transactions, and suspicious data downloads with out-of-the-box detection capabilities 
- Customize based on your needs: build your own threat detection solutions to monitor specific business risks and extend built-in security content

## July 2022

- [Sync user entities from your on-premises Active Directory with Microsoft Sentinel (Preview)](#sync-user-entities-from-your-on-premises-active-directory-with-microsoft-sentinel-preview)
- [Automation rules for alerts (Preview)](#automation-rules-for-alerts-preview)

### Sync user entities from your on-premises Active Directory with Microsoft Sentinel (Preview)

Until now, you've been able to bring your user account entities from your Azure Active Directory (Azure AD) into the IdentityInfo table in Microsoft Sentinel, so that User and Entity Behavior Analytics (UEBA) can use that information to provide context and give insight into user activities, to enrich your investigations.

Now you can do the same with your on-premises (non-Azure) Active Directory as well.

If you have Microsoft Defender for Identity, [enable and configure User and Entity Behavior Analytics (UEBA)](enable-entity-behavior-analytics.md#how-to-enable-user-and-entity-behavior-analytics) to collect and sync your Active Directory user account information into Microsoft Sentinel's IdentityInfo table, so you can get the same insight value from your on-premises users as you do from your cloud users.

Learn more about the [requirements for using Microsoft Defender for Identity](/defender-for-identity/prerequisites) this way.

### Automation rules for alerts (Preview)

In addition to their incident-management duties, [automation rules](automate-incident-handling-with-automation-rules.md) have a new, added function: they are the preferred mechanism for running playbooks built on the **alert trigger**. 

Previously, these playbooks could be automated only by attaching them to analytics rules on an individual basis. With the alert trigger for automation rules, a single automation rule can apply to any number of analytics rules, enabling you to centrally manage the running of playbooks for alerts as well as those for incidents.

Learn more about [migrating your alert-trigger playbooks to be invoked by automation rules](migrate-playbooks-to-automation-rules.md).

## June 2022

- [Microsoft Purview Data Loss Prevention (DLP) integration in Microsoft Sentinel (Preview)](#microsoft-purview-data-loss-prevention-dlp-integration-in-microsoft-sentinel-preview)
- [Incident update trigger for automation rules (Preview)](#incident-update-trigger-for-automation-rules-preview)

### Microsoft Purview Data Loss Prevention (DLP) integration in Microsoft Sentinel (Preview)

[Microsoft 365 Defender integration with Microsoft Sentinel](microsoft-365-defender-sentinel-integration.md) now includes the integration of Microsoft Purview DLP alerts and incidents in Microsoft Sentinel's incidents queue.

With this feature, you will be able to do the following:

- View all DLP alerts grouped under incidents in the Microsoft 365 Defender incident queue.

- View intelligent inter-solution (DLP-MDE, DLP-MDO) and intra-solution (DLP-DLP) alerts correlated under a single incident.

- Retain DLP alerts and incidents for **180 days**.

- Hunt for compliance logs along with security logs under Advanced Hunting.

- Take in-place administrative remediation actions on users, files, and devices.

- Associate custom tags to DLP incidents and filter by them.

- Filter the unified incident queue by DLP policy name, tag, Date, service source, incident status, and user.

In addition to the native experience in the Microsoft 365 Defender Portal, customers will also be able to use the one-click Microsoft 365 Defender connector to [ingest and investigate DLP incidents in Microsoft Sentinel](/microsoft-365/security/defender/investigate-dlp).


### Incident update trigger for automation rules (Preview)

Automation rules are an essential tool for triaging your incidents queue, reducing the noise in it, and generally coping with the high volume of incidents in your SOC seamlessly and transparently. Previously you could create and run automation rules and playbooks that would run upon the creation of an incident, but your automation options were more limited past that point in the incident lifecycle. 

You can now create automation rules and playbooks that will run when incident fields are modified - for example, when an owner is assigned, when its status or severity is changed, or when alerts and comments are added.

Learn more about the [update trigger in automation rules](automate-incident-handling-with-automation-rules.md).

## May 2022

- [Relate alerts to incidents](#relate-alerts-to-incidents-preview)
- [Similar incidents](#similar-incidents-preview)

### Relate alerts to incidents (Preview)

You can now add alerts to, or remove alerts from, existing incidents, either manually or automatically, as part of your investigation processes. This allows you to refine the incident scope as the investigation unfolds. For example, relate Microsoft Defender for Cloud alerts, or alerts from third-party products, to incidents synchronized from Microsoft 365 Defender. Use this feature from the investigation graph, the API, or through automation playbooks.

Learn more about [relating alerts to incidents](relate-alerts-to-incidents.md).

### Similar incidents (Preview)

When you triage or investigate an incident, the context of the entirety of incidents in your SOC can be extremely useful. For example, other incidents involving the same entities can represent useful context that will allow you to reach the right decision faster. Now there's a new tab in the incident page that lists other incidents that are similar to the incident you are investigating. Some common use cases for using similar incidents are:

- Finding other incidents that might be part of a larger attack story.
- Using a similar incident as a reference for incident handling. The way the previous incident was handled can act as a guide for handling the current one.
- Finding relevant people in your SOC that have handled similar incidents for guidance or consult.

Learn more about [similar incidents](investigate-cases.md#similar-incidents-preview).

## March 2022

- [Automation rules now generally available](#automation-rules-now-generally-available)
- [Create a large watchlist from file in Azure Storage (public preview)](#create-a-large-watchlist-from-file-in-azure-storage-public-preview)

### Automation rules now generally available

Automation rules are now generally available (GA) in Microsoft Sentinel.

[Automation rules](automate-incident-handling-with-automation-rules.md) allow users to centrally manage the automation of incident handling. They allow you to assign playbooks to incidents, automate responses for multiple analytics rules at once, automatically tag, assign, or close incidents without the need for playbooks, and control the order of actions that are executed. Automation rules streamline automation use in Microsoft Sentinel and enable you to simplify complex workflows for your incident orchestration processes.

### Create a large watchlist from file in Azure Storage (public preview)

Create a watchlist from a large file that's up to 500 MB in size by uploading the file to your Azure Storage account. When you add the watchlist to your workspace, you provide a shared access signature URL. Microsoft Sentinel uses the shared access signature URL to retrieve the watchlist data from Azure Storage.

For more information, see:

- [Use watchlists in Microsoft Sentinel](watchlists.md)
- [Create watchlists in Microsoft Sentinel](watchlists-create.md)

## February 2022

- [New custom log ingestion and data transformation at ingestion time (Public preview)](#new-custom-log-ingestion-and-data-transformation-at-ingestion-time-public-preview)
- [View MITRE support coverage (Public preview)](#view-mitre-support-coverage-public-preview)
- [View Microsoft Purview data in Microsoft Sentinel (Public preview)](#view-microsoft-purview-data-in-microsoft-sentinel-public-preview)
- [Manually run playbooks based on the incident trigger (Public preview)](#manually-run-playbooks-based-on-the-incident-trigger-public-preview)
- [Search across long time spans in large datasets (public preview)](#search-across-long-time-spans-in-large-datasets-public-preview)
- [Restore archived logs from search (public preview)](#restore-archived-logs-from-search-public-preview)

### New custom log ingestion and data transformation at ingestion time (Public preview)

Microsoft Sentinel supports two new features for data ingestion and transformation. These features, provided by Log Analytics, act on your data even before it's stored in your workspace.

The first of these features is the [**Logs ingestion API**](../azure-monitor/logs/logs-ingestion-api-overview.md). It allows you to send custom-format logs from any data source to your Log Analytics workspace, and store those logs either in certain specific standard tables, or in custom-formatted tables that you create. The actual ingestion of these logs can be done by direct API calls. You use Log Analytics [**data collection rules (DCRs)**](../azure-monitor/essentials/data-collection-rule-overview.md) to define and configure these workflows.

The second feature is [**workspace transformations**](../azure-monitor/essentials/data-collection-transformations.md#workspace-transformation-dcr) for standard logs. It uses [**DCRs**](../azure-monitor/essentials/data-collection-rule-overview.md) to filter out irrelevant data, to enrich or tag your data, or to hide sensitive or personal information. Data transformation can be configured at ingestion time for the following types of built-in data connectors:

- AMA-based data connectors (based on the new Azure Monitor Agent)
- MMA-based data connectors (based on the legacy Log Analytics Agent)
- Data connectors that use Diagnostic settings
- Service-to-service data connectors

For more information, see:

- [Find your Microsoft Sentinel data connector](data-connectors-reference.md)
- [Data transformation in Microsoft Sentinel (preview)](data-transformation.md)
- [Configure ingestion-time data transformation for Microsoft Sentinel (preview)](configure-data-transformation.md).

### View MITRE support coverage (Public preview)

Microsoft Sentinel now provides a new **MITRE** page, which highlights the MITRE tactic and technique coverage you currently have, and can configure, for your organization.

Select items from the **Active** and **Simulated** menus at the top of the page to view the detections currently active in your workspace, and the simulated detections available for you to configure.

For example:

:::image type="content" source="media/whats-new/mitre-coverage.png" alt-text="Screenshot of the MITRE coverage page with both active and simulated indicators selected.":::

For more information, see [Understand security coverage by the MITRE ATT&CK® framework](mitre-coverage.md).

### View Microsoft Purview data in Microsoft Sentinel (Public Preview)

Microsoft Sentinel now integrates directly with Microsoft Purview by providing an out-of-the-box solution.

The Microsoft Purview solution includes the Microsoft Purview data connector, related analytics rule templates, and a workbook that you can use to visualize sensitivity data detected by Microsoft Purview, together with other data ingested in Microsoft Sentinel.

:::image type="content" source="media/purview-solution/purview-workbook.png" alt-text="Screenshot of the Microsoft Purview workbook in Microsoft Sentinel.":::

For more information, see [Tutorial: Integrate Microsoft Sentinel and Microsoft Purview](purview-solution.md).

### Manually run playbooks based on the incident trigger (Public preview)

While full automation is the best solution for many incident-handling, investigation, and mitigation tasks, there may often be cases where you would prefer your analysts have more human input and control over the situation. Also, you may want your SOC engineers to be able to test the playbooks they write before fully deploying them in automation rules.

For these and other reasons, Microsoft Sentinel now allows you to [**run playbooks manually on-demand for incidents**](automate-responses-with-playbooks.md#run-a-playbook-manually) as well as alerts.

Learn more about [running incident-trigger playbooks manually](tutorial-respond-threats-playbook.md#run-a-playbook-manually-on-an-incident).

### Search across long time spans in large datasets (public preview)

Use a search job when you start an investigation to find specific events in logs within a given time frame. You can search all your logs, filter through them, and look for events that match your criteria.

Search jobs are asynchronous queries that fetch records. The results are returned to a search table that's created in your Log Analytics workspace after you start the search job. The search job uses parallel processing to run the search across long time spans, in extremely large datasets. So search jobs don't impact the workspace's performance or availability.

Use search to find events in any of the following log types:

- [Analytics logs](../azure-monitor/logs/data-platform-logs.md)
- [Basic logs (preview)](../azure-monitor/logs/basic-logs-configure.md)

You can also search analytics or basic log data stored in [archived logs (preview)](../azure-monitor/logs/data-retention-archive.md).

For more information, see:

- [Start an investigation by searching large datasets (preview)](investigate-large-datasets.md)
- [Search across long time spans in large datasets (preview)](search-jobs.md)

For information about billing for basic logs or log data stored in archived logs, see [Plan costs for Microsoft Sentinel](billing.md#understand-the-full-billing-model-for-microsoft-sentinel).

### Restore archived logs from search (public preview)

When you need to do a full investigation on data stored in archived logs, restore a table from the **Search** page in Microsoft Sentinel. Specify a target table and time range for the data you want to restore. Within a few minutes, the log data is restored and available within the Log Analytics workspace. Then you can use the data in high-performance queries that support full KQL.

For more information, see:

- [Start an investigation by searching large datasets (preview)](investigate-large-datasets.md)
- [Restore archived logs from search (preview)](restore.md)

## January 2022

- [Support for MITRE ATT&CK techniques (Public preview)](#support-for-mitre-attck-techniques-public-preview)
- [Codeless data connectors (Public preview)](#codeless-data-connectors-public-preview)
- [Maturity Model for Event Log Management (M-21-31) Solution (Public preview)](#maturity-model-for-event-log-management-m-21-31-solution-public-preview)
- [SentinelHealth data table (Public preview)](#sentinelhealth-data-table-public-preview)
- [More workspaces supported for Multiple Workspace View](#more-workspaces-supported-for-multiple-workspace-view)
- [Kusto Query Language workbook and tutorial](#kusto-query-language-workbook-and-tutorial)

### Support for MITRE ATT&CK techniques (Public preview)

In addition to supporting MITRE ATT&CK tactics, your entire Microsoft Sentinel user flow now also supports MITRE ATT&CK techniques.

When creating or editing [analytics rules](detect-threats-custom.md), map the rule to one or more specific tactics *and* techniques. When you search for rules on the **Analytics** page, filter by tactic and technique to narrow your search results.

:::image type="content" source="media/whats-new/mitre-in-analytics-rules.png" alt-text="Screenshot of MITRE technique and tactic filtering." lightbox="media/whats-new/mitre-in-analytics-rules.png":::

Check for mapped tactics and techniques throughout Microsoft Sentinel, in:

- **[Incidents](investigate-cases.md)**. Incidents created from alerts that are detected by rules mapped to MITRE ATT&CK tactics and techniques automatically inherit the rule's tactic and technique mapping.

- **[Bookmarks](bookmarks.md)**. Bookmarks that capture results from hunting queries mapped to MITRE ATT&CK tactics and techniques automatically inherit the query's mapping.

#### MITRE ATT&CK framework version upgrade

We also upgraded the MITRE ATT&CK support throughout Microsoft Sentinel to use the MITRE ATT&CK framework *version 9*. This update includes support for the following new tactics:

**Replacing the deprecated *PreAttack* tactic**:

- [Reconnaissance](https://attack.mitre.org/versions/v9/tactics/TA0043/)
- [Resource Development](https://attack.mitre.org/versions/v9/tactics/TA0042/)

**Industrial Control System (ICS) tactics**:

- [Impair Process Control](https://collaborate.mitre.org/attackics/index.php/Impair_Process_Control)
- [Inhibit Response Function](https://collaborate.mitre.org/attackics/index.php/Inhibit_Response_Function)

### Codeless data connectors (Public preview)

Partners, advanced users, and developers can now use the new Codeless Connector Platform (CCP) to create custom connectors, connect their data sources, and ingest data to Microsoft Sentinel.

The Codeless Connector Platform (CCP) provides support for new data connectors via ARM templates, API, or via a solution in the Microsoft Sentinel [content hub](sentinel-solutions.md).

Connectors created using CCP are fully SaaS, without any requirements for service installations, and also include [health monitoring](monitor-data-connector-health.md) and full support from Microsoft Sentinel.

For more information, see [Create a codeless connector for Microsoft Sentinel](create-codeless-connector.md).

### Maturity Model for Event Log Management (M-21-31) Solution (Public preview)

The Microsoft Sentinel content hub now includes the **Maturity Model for Event Log Management (M-21-31)** solution, which integrates Microsoft Sentinel and Microsoft Defender for Cloud to provide an industry differentiator for meeting challenging requirements in regulated industries.

The Maturity Model for Event Log Management (M-21-31) solution provides a quantifiable framework to measure maturity. Use the analytics rules, hunting queries, playbooks, and workbook provided with the solution to do any of the following:

- Design and build log management architectures
- Monitor and alert on log health issues, coverage, and blind spots
- Respond to notifications with Security Orchestration Automation & Response (SOAR) activities
- Remediate with Cloud Security Posture Management (CSPM)

For more information, see:

- [Modernize Log Management with the Maturity Model for Event Log Management (M-21-31) Solution](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/modernize-log-management-with-the-maturity-model-for-event-log/ba-p/3072842) (blog)
- [Centrally discover and deploy Microsoft Sentinel out-of-the-box content and solutions](sentinel-solutions-deploy.md)
- [The Microsoft Sentinel content hub catalog](sentinel-solutions-catalog.md#domain-solutions)

### SentinelHealth data table (Public preview)

Microsoft Sentinel now provides the **SentinelHealth** data table to help you monitor your connector health, providing insights on health drifts, such as latest failure events per connector, or connectors with changes from success to failure states. Use this data to create alerts and other automated actions, such as Microsoft Teams messages, new tickets in a ticketing system, and so on.

Turn on the Microsoft Sentinel health feature for your workspace in order to have the **SentinelHealth** data table created at the next success or failure event generated for supported data connectors.

For more information, see [Use the SentinelHealth data table (Public preview)](monitor-data-connector-health.md#use-the-sentinelhealth-data-table-public-preview).

### More workspaces supported for Multiple Workspace View

Now, instead of being limited to 10 workspaces in Microsoft Sentinel's [Multiple Workspace View](multiple-workspace-view.md), you can view data from up to 30 workspaces simultaneously.

While we often recommend a single-workspace environment, some use cases require multiple use cases, such as for Managed Security Service Providers (MSSPs) and their customers. **Multiple Workspace View** lets you see and work with security incidents across several workspaces at the same time, even across tenants, allowing you to maintain full visibility and control of your organization’s security responsiveness.

For more information, see:

- [Use multiple Microsoft Sentinel workspaces](extend-sentinel-across-workspaces-tenants.md#the-need-to-use-multiple-microsoft-sentinel-workspaces)
- [Work with incidents in many workspaces at once](multiple-workspace-view.md)
- [Manage multiple tenants in Microsoft Sentinel as an MSSP](multiple-tenants-service-providers.md)

### Kusto Query Language workbook and tutorial

Kusto Query Language is used in Microsoft Sentinel to search, analyze, and visualize data, as the basis for detection rules, workbooks, hunting, and more.

The new **Advanced KQL for Microsoft Sentinel** interactive workbook is designed to help you improve your Kusto Query Language proficiency by taking a use case-driven approach.

The workbook:

- Groups Kusto Query Language operators / commands by category for easy navigation.
- Lists the possible tasks a user would perform with Kusto Query Language in Microsoft Sentinel. Each task includes operators used, sample queries, and use cases.
- Compiles a list of existing content found in Microsoft Sentinel (analytics rules, hunting queries, workbooks and so on) to provide additional references specific to the operators you want to learn.
- Allows you to execute sample queries on-the-fly, within your own environment or in "LA Demo" - a public [Log Analytics demo environment](https://aka.ms/lademo). Try the sample Kusto Query Language statements in real time without the need to navigate away from the workbook.

Accompanying the new workbook is an explanatory [blog post](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/advanced-kql-framework-workbook-empowering-you-to-become-kql/ba-p/3033766), as well as a new [introduction to Kusto Query Language](kusto-overview.md) and a [collection of learning and skilling resources](kusto-resources.md) in the Microsoft Sentinel documentation.

## Next steps

> [!div class="nextstepaction"]
>[On-board Azure Sentinel](quickstart-onboard.md)

> [!div class="nextstepaction"]
>[Get visibility into alerts](get-visibility.md)
