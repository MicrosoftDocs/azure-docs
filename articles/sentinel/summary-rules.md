---
title: Aggregate Microsoft Sentinel data with summary rules | Microsoft Sentinel
description: Learn how to aggregate large sets of Microsoft Sentinel data across log tiers with dynamic summary rules.
author: batamig
ms.author: bagol
ms.topic: how-to #Don't change
ms.date: 05/05/2024
appliesto:
    - Microsoft Sentinel in the Azure portal
    - Microsoft Sentinel in the Microsoft Defender portal
ms.collection: usx-security

#customer intent: As a SOC engineer, I want to create summary rules in Microsoft Sentinel to aggregate large sets of data for use across my SOC team activities.

---

# Aggregate Microsoft Sentinel data with summary rules (preview)

This article describes summary rules in Microsoft Sentinel, which you can use to aggregate large sets of data in the background for a smoother security operations experience across all log tiers. Summary data is precompiled to provide a fast query performance, including queries run on data derived from [low-cost log tiers](billing.md#how-youre-charged-for-microsoft-sentinel).

- **Access dynamic summary data via Kusto Query Language (KQL)** across detection, investigation, hunting, and reporting activities.
- **Run high performance KQL queries** on summarized data.
- **Use dynamic summary data for longer** in historical investigations, hunting, and compliance activities. <!--how does this make sense if you can't access historical data?-->


Microsoft Sentinel summary rules are based on Azure Monitor summary rules. For more information, see [Aggregate data in Log Analytics workspaces with summary rules](https://aka.ms/summary-rules-azmon) and **Summary rule limits** in [Service Limits for Log Analytics workspaces](/azure/azure-monitor/service-limits).

> [!IMPORTANT]
> Summary rules are currently in PREVIEW. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>
> [!INCLUDE [unified-soc-preview-without-alert](includes/unified-soc-preview-without-alert.md)]
>

## Prerequisites

To use summary rules in Microsoft Sentinel:

- Microsoft Sentinel must be enabled in at least one workspace, and actively consume logs.
- You must be able to access Microsoft Sentinel with [**Microsoft Sentinel Contributor**](../role-based-access-control/built-in-roles.md#microsoft-sentinel-contributor) permissions. For more information, see [Roles and permissions in Microsoft Sentinel](roles.md).
- **SummaryLogs** diagnostic settings must be enabled on your workspace. If this isn't done ahead of time, you're prompted to enable SummaryLogs diagnostic settings when creating your first rule. For more information, see [Diagnostic settings in Azure Monitor](/azure/azure-monitor/essentials/diagnostic-settings?WT.mc_id=Portal-Microsoft_Azure_Monitoring).

- To use summary rules in the Microsoft Defender portal, you must first onboard your workspace to the unified security operations platform. For more information, see [Connect Microsoft Sentinel to Microsoft Defender XDR](/microsoft-365/security/defender/microsoft-sentinel-onboard).

## Create a summary rule

Create a new summary rule to aggregate a specific large set of data into a dynamic table. Configure your rule frequency to determine how often your aggregated data set is updated from the raw data.

1. In the Azure portal, from the Microsoft Sentinel navigation menu, under **Configuration**, select **Summary rules (Preview)**. In the Defender portal, select **Microsoft Sentinel > Configuration > Summary rules (Preview)**. For example:

    :::image type="content" source="media/summary-rules/summary-rules-azure.png" alt-text="Screenshot of the Summary rules page in the Azure portal.":::

1. Select **+ Create** and enter the following details:

    - **Name**. Enter a meaningful name for your rule.
    - **Description**. Enter an optional description.
    - **Destination table**. Define the custom log table where your data is aggregated:
        - If you select **Existing custom log table**, select the table you want to use.
        - If you select **New custom log table**, enter a meaningful name for your table. Your full table name uses the following syntax: *<tableName>_CL*.

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
- Disable or enable the rule.
- Edit the rule configuration
 
To delete a rule, select the rule row and then select **Delete** in the toolbar at the top of the page.

## Sample summary rule scenarios

This section reviews common scenarios for creating summary rules in Microsoft Sentinel, and our recommendations for how to configure each rule.

### Quickly find a malicious IP address in your network traffic

**Scenario**: Shay is a threat hunter. One of their team's goals is to identify all instances of when a malicious IP address interacted in the network traffic logs from an active incident, in the last 90 days.

**Challenge**: Microsoft Sentinel currently ingests multiple terabytes of network logs a day. Shay needs to move through them quickly to find matches for the malicious IP address.

**Solution**: We recommend that Shay use summary rules to do the following:

1. **Use a summary rule to create a summary data set** for each IP address related to the incident, including the `SourceIP`, `DestinationIP`, `MaliciousIP`, `RemoteIP`, each listing important attributes, such as `IPType`, `FirstTimeSeen`, and `LastTimeSeen`.

    The summary dataset enables Shay to quickly search for a specific IP address and narrow down the time range where the IP address is found. Shay can do this even when the searched events happened more than 90 days ago, which is beyond their workspace retention period.

1. **Create a query** that runs for less than two minutes against the summary dataset, quickly drilling into the specific time range when the malicious IP address interacted with the company network.

    Make sure to configure run intervals of up to five minutes at a minimum, to accomodate different summary payload sizes. This ensures that there's no loss even when there's an event ingestion delay. <!--what does this mean? •	Support both frontfill (scheduled queries on a fixed-interval schedule).-->

    In this example, Shay configured the summary to run daily, so that the query adds new summary records every day until it expires.

1. **Run a subsequent search or correlation with other data** to complete the attack story.

### Detect when an event feed stops

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

### Enrich alerts with summaries on entities

Context: Team needs to build an alert rule for Sentinel customers to detect suspicious logins to their system from sensitive, privileged users. 
Jobs-to-be-done:
•	The rule looks back only last 75 minutes for user login events but need to look up user information from the last 7 days. 
•	Find if the user has any privilege access by querying against a summary dataset of user information from the IdentityInfo table. To create this summary, they need to generate a table that will hold a daily snapshot of all users' profile such as user roles, risk level, etc.
•	Alert if any suspicious SAP logins from a privileged user are found.
Problem:
•	Query against the IdentityInfo table often gets timed out when there are a large number of user records, hence resulting in missing alerts from failed alert rule. As a result, a daily summary of user profiles is needed to solve this query timeout problem.
Requirements:
•	Support scalable summarization of large datasets.

### Detect potential SPN scanning by a specific user

Service Principal Name (SPN) scanning performed by a user account.

Context: Detection engineering team currently generate 20-30 detections that require data summaries. Prateek is a detection engineer and his goal is to create a highly accurate detection that detects SPN scanning performed by a user account. The detection looks for Security events with EventID 4796 (A Kerberos service ticket was requested). It creates a baseline on the number of unique tickets requested by a user account per day and then alerts when there is a major deviation from that baseline.
Problem:
•	Because the detection rule runs on 14 days or max data lookback in Analytics, it creates a lot of false positives. While thresholds have been defined in the detection to prevent false positives, the detection can trigger if a user legitimately requests considerably more service tickets than they generally do. Possible false positive scenarios include but are not limited to scheduled vulnerability scanners, administration systems and misconfigured systems. To create a more accurate baseline, Shain needs more than 14 days of baseline data. 
•	Team had to disable some detection rules because of too many false positives due to the short (14 days) baseline detection.
•	For each detection, he runs a summary query on a separate Logic App, which adds additional work for setup, maintenance and incur extra costs. 
Jobs-to-be-done:
•	Generate a daily summary of the count of unique tickets per user. This summarizes SecurityEvents on EventID 4769 with additional filtering for user account. 
•	Reference at least 30 days’ worth of summary data to create a strong baseline and apply percentile() to calculate deviations from this baseline and generate potential SPN scanning alerts. 

## Related content

- [Aggregate data in Log Analytics workspace with Summary rules](/azure/azure-monitor/logs/summary-rules)
- [Plan costs and understand Microsoft Sentinel pricing and billing](billing.md)
- [Log sources to use for Basic Logs or Auxiliary Logs ingestion](basic-logs-use-cases.md)