---
title: Aggregate Microsoft Sentinel data with summary rules | Microsoft Sentinel
description: Learn how to aggregate large sets of Microsoft Sentinel data across log tiers with dynamic summary rules.
author: batamig
ms.author: bagol
ms.topic: how-to #Don't change
ms.date: 05/05/2024

#customer intent: As a SOC engineer, I want to create summary rules in Microsoft Sentinel to aggregate large sets of data for use across my SOC team activities.

---

# Aggregate Microsoft Sentinel data with summary rules (preview)

This article describes summary rules in Microsoft Sentinel, which you can use to aggregate large sets of data in the background for a smoother security operations experience across all log tiers. Summary data is pre-compiled to provide a fast query performance, including queries run on data derived from low-cost log tiers.

- Access dynamic summary data via Kusto Query Language (KQL) across detection, investigation, hunting, and reporting activities.
- Run high performance Kusto Query Language (KQL) queries on summarized data.
- Use dynamic summary data for longer in historical investigations, hunting, and compliance activities.

Dynamic summaries are stored separately from the raw data, and can therefore be retained for longer periods of time. While raw data is stored in low-cost data lake logs, summarized data is stored in analytics log data for high performance and full feature support.

> [!IMPORTANT]
> Summary rules are currently in PREVIEW. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

[!INCLUDE [unified-soc-preview](includes/unified-soc-preview.md)]


## Prerequisites

To use summary rules in Microsoft Sentinel:

- Microsoft Sentinel must be enabled in at least one workspace, and actively consume logs.
- You must be able to access Microsoft Sentinel with [**Microsoft Sentinel Contributor**](../role-based-access-control/built-in-roles.md#microsoft-sentinel-contributor) permissions. For more information, see [Roles and permissions in Microsoft Sentinel](roles.md).
- **SummaryLogs** diagnostic settings must be enabled on your workspace. If this isn't done ahead of time, you'll be prompted to enable this when creating your first rule. For more information, see TBD xref.<!--fix xref-->

## Create a summary rule

Create a new summary rule to aggregate a specific large set of data into a dynamic table. Configure your rule frequency to determine how often your aggregated data set is updated from the raw data.

1. From the Microsoft Sentinel navigation menu, under **Configuration**, select **Summary rules (Preview)**.

1. Select **+ Create** and enter the following details:

    - **Name**. Enter a meaningful name for your rule.
    - **Description**. Enter an optional description.
    - **Destination table**. Define the custom log table where your data is aggregated. If you select **Existing custom log table**, select the table you want to use. If you select **New custom log table**, enter a meaningful name for your table. Your full table name uses the following syntax: *<tableName>_CL*.

1. If **SummaryLogs** diagnostic settings aren't yet enabled, in the **Diagnostic settings** area, select **Enable**.

    If they're already enabled, but you want to modify the settings, select **Configure advanced diagnostic settings**. When you come back to the **Summary rule wizard** page, make sure to select **Refresh** to refresh your setting details. 

    For more information, see [Diagnostic settings in Azure Monitor](/azure/azure-monitor/essentials/diagnostic-settings?WT.mc_id=Portal-Microsoft_Azure_Monitoring).

1. Select **Next: Set summary logic >** to continue.

1. On the **Set summary logic** page, enter your summary query. For example, to pull content from Google Cloud Platform, you might want to enter:

    ```kusto
    GCPAuditLogs
    | where ServiceName == 'pubsub.googleapis.com'
    | summarize count() by Severity
    ```

    <!--we need some more robust examples-->

1. Select **Preview results** to show an example of the data you'd collect with the configured query.

1. In the **Query scheduling** area, define the following details:

    - How often you want the rule to run
    - Whether you want the rule to run with any sort of delay, in minutes
    - When you want the rule to start running

1. Select **Next: Review + create >** > **Save** to complete the summary rule.

Existing summary rules are listed on the **Summary rules (Preview)** page, where you can review your rule status. For each rule, select the options menu at the end of the row to do any of the following:

- View the rule's current data in the **Logs** page, as if you were to run the query immediately
- View the run history for the selected rule
- Disable or enable the rule
- Edit the rule configuration
 
To delete a rule, select the rule row and then select **Delete** in the toolbar at the top of the page.

## Sample summary rule usage

The following sections describe sample scenarios where we'd recommend using summary rules to create large sets of aggregated data.

### Quick searches for a malicious IP address activity 

If your team regularly needs to identify when a malicious IP address interacts within the network traffic logs from an active incident, searching through the multiple terabytes of data that comes in from your firewalls every day can be painstakingly slow.

Instead we recommend that you use summary rules to do the following:

1. Create a summary dataset for each IP address in the incident, including:

    - SourceIP
    - DestinationIP
    - MaliciousIP
    - RemoteIP

    Include important attributes, such as IPType, FirstTimeSeen, and LastTimeSeen.

    Configure the summary rule to run daily, so that the query adds new records every day.

1. Create a fast search, intended to run in less than two minutes, against your summary dataset to quickly narrow down on the time range when a malicious IP address interacted with the company network.

1. Run a subsequent search or correlation with other data to complete your attack story, including events that may have occurred more than 90 days ago.

Requirements:
•	Allow configuration of run intervals (up to 5 minutes at minimum) to accommodate different summary payload size.
•	Support both frontfill (scheduled queries on a fixed-interval schedule).
•	No loss in summary records even when there’s event ingestion delay.

Generate visualization and reports for trending analysis.
Context: Agency has 18 M365 tenants. Currently they have 3 actively used tenants integrated into Sentinel Lighthouse with about 8000 devices and will eventually have ~85,000 active devices onboarded to MDE when all tenancies are covered by Sentinel Lighthouse. 
Currently they have 5 reporting use cases with summaries that come from their delivery/implementation/configuration/reporting team. Their list of use cases will grow, and they expect SOC team to add more over the coming months. 
Philip is a technical security consultant in the reporting team, and one of his tasks is to build a weekly report for device discovery to identify which devices are already onboarded to MDE and which ones can be onboarded.
Problem: With 18 tenants and 8000+ devices to report, it’s cumbersome and not efficient to run the same summary queries across the tenants and generate individual reports for devices in each tenant. 
Jobs-to-be-done:
•	Run a summary query that queries the onboarded devices and filters out a high number of duplicate devices. Query runs hourly. 
•	Persist the summary results in a Sentinel table or repository that can be used later for queries to generate a dashboard.
•	The dashboard is dynamically updated based on the latest summary dataset.
Requirements:
•	Support summarization for multi-X (multi-workspaces and multi-tenants).
•	Support cross-workspaces and tenants query functions to retrieve summary items.
•	User can use join & union of multiple tables in summary queries.
Create a graph to analyze trend in evolution of different malware families.
Context: Ray is a threat hunter and Threat Intelligence engineer in a large company. His main goal is to is to do trending analysis on malware families and their evolutions. He pulls malware analysis from various malware repositories and detonates them in a sandbox with custom yara rules for tagging then exports the data into a large json file in Azure blob storage. Over the last 3 months, he pulled in about 1.7 million samples including Windows 7/10 has 2 detonations, MacOS, Android, and Linux have single detonation. 
Problem: Query time takes too long to call out of blob storage via externaldata feature. Ray is trying to figure out a method to pull these into Sentinel table regularly. 
Jobs-to-be-done: 
•	Regularly pull new data for Static and Dynamic Malware Analysis out of Blob storage. Append and persist new results pertaining to each mlware family in a Sentinel table.
•	Querying this summary dataset, create a graph to show trends in malware family evolutions. Here’s an example of the graph that demonstrates a normal trend and a huge spike in C2 count related to “qakbot” malware family.
 
Requirements:
•	Support summarization on ADLS/Azure blob storage. Provide a way to connect to Blob storage from Sentinel and configurable experience via Sentinel UX. 
Detect when an event feed stops by summarizing multiple tables at once.
Context: Bob has data in 65 tables in Sentinel and one of their detection & reporting goals is to detect and report when an event feed stops. Bob from the team needs to create an Analytics rule for this detection scenario. To monitor the health of the event feeds, this rule needs to run frequently at 10 minutes frequency. He currently schedules a Logic app that runs every 10 minutes to generate a summary of the 65 tables in a custom table called EventFeed_CL. 
Problem/Requirements Rationale:
•	With 65 feeds to monitor, it’s extremely inefficient and time-consuming to set up a different rule for each table, so summarizing multiple tables at once is required. 
•	Also, with frequent monitoring, it’s required to run summary at small intervals (10 mins).  
Jobs-to-be-done:
•	Summarize data volume every 10 minutes for 65 event feeds and persist the results in a single summary in Sentinel table. 
•	To ensure no duplication and data loss, summary must consider both TimeGenerated for query lookback and ingestion_time for summary. Refer to this article for more context.
•	Create an Analytics rule on this summary data to raise alerts on possible event feed disruption.
Requirements
•	User can configure 15-minute interval at minimum for scheduled summary.
•	User can use Union of multiple tables in summary query.
•	User can reconcile and audit summary in case of delayed events. (DSR suggest considering these two timestamps in each query run to handle ingestion delay).
Raise alerts on threat intel match against network data.
Context: Shain’s needs to build a detection rule on Firewall logs. Most of the data sources are IPS, Azure Firewall traffic, Fortigate, etc. raw logs with noisy and high-volume but lower security value with a total volume of about 1TB/day.
Shain’s goal is to create a detection rule to match domain names that have been visited in the system with Threat Intel domain name list. 
Problem:
•	Each rule requires a separate Logic App so setting up & maintaining a high number of logic apps results in additional overhead and extra costs.
•	No native mechanism in Sentinel to create alerts on cheaper long tiers, hence using ADX.
Jobs-to-be-done:
•	Summarize McAfee firewall logs every 10 minutes and persist this summary in a Sentinel table. 
•	Create an alert rule to alert off any TI matches for domain name with this summary data.
Requirements:
•	Support summarization on low-cost log solutions to enable detection, investigation, and hunting scenarios on these cost-effective datasets. 
•	User can summarize mega volume of data in ADLS at scale 
•	User can use ASIM functions for summary query.
Enrich alerts with summaries on entities.  
Context: Team needs to build an alert rule for Sentinel customers to detect suspicious logins to their system from sensitive, privileged users. 
Jobs-to-be-done:
•	The rule looks back only last 75 minutes for user login events but need to look up user information from the last 7 days. 
•	Find if the user has any privilege access by querying against a summary dataset of user information from the IdentityInfo table. To create this summary, they need to generate a table that will hold a daily snapshot of all users' profile such as user roles, risk level, etc.
•	Alert if any suspicious SAP logins from a privileged user are found.
Problem:
•	Query against the IdentityInfo table often gets timed out when there are a large number of user records, hence resulting in missing alerts from failed alert rule. As a result, a daily summary of user profiles is needed to solve this query timeout problem.
Requirements:
•	Support scalable summarization of large datasets.
Detect potential Service Principal Name (SPN) scanning performed by a user account. 
Context: Detection engineering team currently generate 20-30 detections that require data summaries. Prateek is a detection engineer and his goal is to create a highly accurate detection that detects SPN scanning performed by a user account. The detection looks for Security events with EventID 4796 (A Kerberos service ticket was requested). It creates a baseline on the number of unique tickets requested by a user account per day and then alerts when there is a major deviation from that baseline.
Problem:
•	Because the detection rule runs on 14 days or max data lookback in Analytics, it creates a lot of false positives. While thresholds have been defined in the detection to prevent false positives, the detection can trigger if a user legitimately requests considerably more service tickets than they generally do. Possible false positive scenarios include but are not limited to scheduled vulnerability scanners, administration systems and misconfigured systems. To create a more accurate baseline, Shain needs more than 14 days of baseline data. 
•	Team had to disable some detection rules because of too many false positives due to the short (14 days) baseline detection.
•	For each detection, he runs a summary query on a separate Logic App, which adds additional work for setup, maintenance and incur extra costs. 
Jobs-to-be-done:
•	Generate a daily summary of the count of unique tickets per user. This summarizes SecurityEvents on EventID 4769 with additional filtering for user account. 
•	Reference at least 30 days’ worth of summary data to create a strong baseline and apply percentile() to calculate deviations from this baseline and generate potential SPN scanning alerts. 

## Known issues

<!--how many of the following are still relevant?-->

- Summarization of historical data isn’t supported 
- The number of rules that can be defined in workspace is 10 
- Bin processing time-out is 10 minutes 
- Max number of results per bin is 500,000 
- Max results volume is 100MB  
- Supported bins (run interval) – 20,30,60,120,180,360,720,1440 minutes 

## Related content

- [Aggregate data in Log Analytics workspace with Summary rules](/azure/azure-monitor/logs/summary-rules)
