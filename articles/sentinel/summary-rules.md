---
title: Aggregate Microsoft Sentinel data with summary rules | Microsoft Sentinel
description: Learn how to aggregate large sets of Microsoft Sentinel data across log tiers with summary rules.
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

- **Access summary rule results via Kusto Query Language (KQL)** across detection, investigation, hunting, and reporting activities.
- **Run high performance KQL queries** on summarized data.
- **Use summary rule results for longer** in historical investigations, hunting, and compliance activities. <!--how does this make sense if you can't access historical data?-->


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

1. We recommend that you enable **SummaryLogs** diagnostic settings on your workspace to get visibility for historical runes and failures. If **SummaryLogs** diagnostic settings aren't enabled, you're prompted to enable them in the **Diagnostic settings** area.

    If **SummaryLogs** diagnostic settings are already enabled, but you want to modify the settings, select **Configure advanced diagnostic settings**. When you come back to the **Summary rule wizard** page, make sure to select **Refresh** to refresh your setting details. 

    > [!IMPORTANT]
    > The **SummaryLogs** diagnostic settings has additional costs. For more information, see [Diagnostic settings in Azure Monitor](/azure/azure-monitor/essentials/diagnostic-settings?WT.mc_id=Portal-Microsoft_Azure_Monitoring).
    >

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

    The time you defined is `timegenerated`. <!--what does this mean?-->

1. Select **Next: Review + create >** > **Save** to complete the summary rule.

Existing summary rules are listed on the **Summary rules (Preview)** page, where you can review your rule status. For each rule, select the options menu at the end of the row to take any of the following actions:

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

1. **Create a summary data set** for each IP address related to the incident, including the `SourceIP`, `DestinationIP`, `MaliciousIP`, `RemoteIP`, each listing important attributes, such as `IPType`, `FirstTimeSeen`, and `LastTimeSeen`.

    The summary dataset enables Shay to quickly search for a specific IP address and narrow down the time range where the IP address is found. Shay can do this even when the searched events happened more than 90 days ago, which is beyond their workspace retention period.

    In this example, Shay configured the summary to run daily, so that the query adds new summary records every day until it expires.

1. **Create an analytics rule** that runs for less than two minutes against the summary dataset, quickly drilling into the specific time range when the malicious IP address interacted with the company network.

    Make sure to configure run intervals of up to five minutes at a minimum, to accommodate different summary payload sizes. This ensures that there's no loss even when there's an event ingestion delay. <!--what does this mean? •	Support both frontfill (scheduled queries on a fixed-interval schedule).-->

1. **Run a subsequent search or correlation with other data** to complete the attack story.

### Detect when an event feed stops

Detect when an event feed stops by summarizing multiple tables at once.

**Scenario**: Bobby has data in 65 Microsoft Sentinel table, and one of their team goals is to detect and report whenever a specific event feed stops running. Bobby needs to create an analytics rule for this detection scenario and configure the rule to run every 10 minutes.

Currently, Bobby has a logic app that runs every 10 minutes to generate a summary of all 65 tables into a custom table named `EventFeed_CL`. 

**Challenge**: With 65 feeds to monitor, using a logic app that must be monitored frequently is an inefficient use of system and team resources.

**Solution**: We recommend that Bobby use summary rules to do the following:

1. Summarize data volume for all event feeds every 10 minutes, collecting the updated results in a single summary table.

    To avoid duplication and data loss, the summary must consider both the `TimeGenerate` for query lookbacks and the `ingestion_time` for the summary. For more information, see [Handle ingestion delay in scheduled analytics rules](ingestion-delay.md).

1. Create an analytics rule on the summary data to raise alerts for any event feed disruptions. Configure the rule to run every 15 minutes.

    If there are delayed events, Bobby can reconcile and audit the summary data, such as considering both timestamps in the query run.

<!--not sure what this means-->
### Enrich alerts with summaries on entities

Speed up and improve your investigations by adding summary data to alerts.

**Scenario**: Rami's team needs to create an analytics rule for Microsoft Sentinel customers to detect suspicious sign-ins to their system from sensitive and privileged accounts.

**Challenge**: While analytics rules only look back on the last 75 minutes of user sign-in events, Rami's team needs to watch user information from the last seven days. Also, queries that run directly against the `IdentityInfo` table often time out when there are a large number of records, resulting in missing alerts.

**Solution**: Use summary rules to do the following:

1. Create a summary dataset of user information from the `IdentityInfo` table, including a daily snapshot of all user profile data, such as user roles, risk levels, and so on. 

1. Configure an analytics rule to generate an alert if any suspicious SAP sign-ins are found from a privileged user account.

### Detect potential SPN scanning in your network

Detect potential Service Principal Name (SPN) scanning in your network traffic.

**Scenario**: Prateek is a SOC engineer who needs to create a highly accurate detection for any SPN scanning performed by a user account. The detection currently does the following:

1. Looks for Security events with EventID 4796 (A Kerberos service ticket was requested).
1. Creates a baseline with the number of unique tickets typically requested by a user account per day.
1. Generates an alert when there's a major deviation from that baseline.

**Challenge**: The current detection runs on 14 days, or the maximum data lookback in the Analytics table, and creates many false positives. While the detection includes thresholds that are designed to prevent false positives, alerts are still generated for legitimate requests as long as there are more requests than usual. This might happen for vulnerability scanners, administration systems, and in misconfigured systems. In Prateeks team, there were so many false positives that they needed to turn off some of the analytics rules. To create a more accurate baseline, Prateek needs more than 14 days of baseline data.

The current detection also runs a summary query on a separate logic app for each alert. This involves extra work for the setup and maintenance of those logic apps, and incurs extra costs.

**Solution**: We recommend that Prateek use summary rules to do the following:

1. Generate a daily summary of the count of unique tickets per user. This summarizes the `SecurityEvents` table data for EventID 4769, with extra filtering for specific user accounts.

1. In the summary rule, to generate potential SPN scanning alerts:

    - Reference at least 30 days worth of summary data to create a strong baseline.
    - Apply `percentile()` in your query to calculate the deviation from the baseline

### Generate alerts on threat intelligence matches against network data

Generate alerts on threat intelligence matches against noisy, high volume, and low-security value network data.

**Scenario**: Shain needs to build an analytics rule for firewall logs to match domain names in the system that have been visted agsinst a threat intelligece domain name list. 

Most of the data sources are raw logs that are noisy and have high volume, but have lower security value, including IP addresses, Azure Firewall traffic, Fortigate traffic, and so on. There's a total volume of about 1 TB per day.

**Challenge**: Creating separate rules requires multiple logic apps, requiring extra setup and maintenance overhead and costs.

**Solution**: We recommed that Shain use summary rules to do the following:

1. Summarize McAfee firewall logs every 10 minutes, updating the data in the same custom table with each run. ASIM functions might be helpful in the summary query. <!--why?-->

1. Create an analytics rule to trigger an alert for anytime a domain name in the summary data matches an entry on the threat intelligence list. 


## Related content

- [Aggregate data in Log Analytics workspace with Summary rules](/azure/azure-monitor/logs/summary-rules)
- [Plan costs and understand Microsoft Sentinel pricing and billing](billing.md)
- [Log sources to use for Basic Logs or Auxiliary Logs ingestion](basic-logs-use-cases.md)