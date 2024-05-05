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

TBD

## Related content

- [Aggregate data in Log Analytics workspace with Summary rules](/azure/azure-monitor/logs/summary-rules)
