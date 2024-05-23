---
title: Aggregate data with Summary rules in Log Analytics
description: Aggregate data in Log Analytics workspace with Summary rules feature in Azure Monitor, including creating, starting, stopping, and troubleshooting rules. 
ms.service: azure-monitor
ms.subservice: logs
ms.topic: how-to
author: guywi-ms
ms.author: guywild
ms.reviewer: yossi-y
ms.date: 04/23/2024

# Customer intent: As a Log Analytics workspace administrator or developer, I want to optimize the cost-effectiveness, query performance, and analysis capabilities by using summary rules to aggregate data I ingest to specific tables.
---

# Aggregate data in Log Analytics workspace with Summary rules

Azure Monitor provides a complete observability solution that collects logs from multiple sources in Azure, other clouds, and on-premises environments. For large systems, the performance of logs consumption in queries depends on the amount of processed data, the time range, and results set. It's possible for the logs consumption to exceed query limits. 

Summary rules provide a way to aggregate ingested data to Log Analytics workspace per given query and cadence. The process supports ingesting the result back to a custom log table in Log Analytics workspace for optimal consumption experiences, including:

- **Perform analysis and reports** on large data sets and time ranges when you use summarized data in scenarios. Some examples include security and incident analysis, and month-over-month or annual business reports.

- **Optimize cost to ingest** verbose logs to tables in Basic or Auxiliary tiers, and summarize to Analytics table for analysis, reports, and long retention. Or, ingest to Analytics table with short retention, and summarize it to a table with longer retention.

- **Enhance with alerts, dashboards, and cross-referencing** on data ingested in Basic or Auxiliary tiers, when summarized and used in Analytics tier.

- **Segregate table-level access** for privacy and security by obfuscation of privacy details in summarized shareable data.


## Prerequisites

- To create Summary rules in your Log Analytics workspace, you must register your Azure subscriptions during the Private Preview. [Sign up here](https://forms.office.com/r/yYLZ78rzHu?origin=lprLink).

- For limits and restrictions related to Summary rules in Log Analytics, see [Azure Monitor service limits](../service-limits.md#log-analytics-workspaces).

### Permissions required

<!-- Questions:

 - Since "summarylogs" is new, it's not yet mentioned in the permissions article. Need to identify section in the permissions article to link for each action in the table.

-->

| Action | Permissions required |
| --- | --- |
| Create or update rule | `Microsoft.Operationalinsights/workspaces/summarylogs/write` permissions to the Log Analytics workspace, as provided by the [Log Analytics Contributor built-in role](manage-access.md#log-analytics-contributor), for example |
| Create or update destination table | `Microsoft.OperationalInsights/workspaces/write` permissions to the Log Analytics workspace, as provided by the [Log Analytics Contributor built-in role](manage-access.md#log-analytics-contributor), for example |
| Enable query in workspace | `Microsoft.OperationalInsights/workspaces/query/read` permissions to the Log Analytics workspace, as provided by the [Log Analytics Reader built-in role](manage-access.md#log-analytics-reader), for example |
| Query all logs in workspace | `Microsoft.OperationalInsights/workspaces/query/*/read` permissions to the Log Analytics workspace, as provided by the [Log Analytics Reader built-in role](manage-access.md#log-analytics-reader), for example |
| Query logs in table | `Microsoft.OperationalInsights/workspaces/query/<table>/read` permissions to the Log Analytics workspace, as provided by the [Log Analytics Reader built-in role](manage-access.md#log-analytics-reader), for example |
| Query logs in table (table action) | `Microsoft.OperationalInsights/workspaces/tables/query/read` permissions to the Log Analytics workspace, as provided by the [Log Analytics Reader built-in role](manage-access.md#log-analytics-reader), for example |

## How summary rules work

Summary rules perform batch processing directly in your Log Analytics workspace. Use summary rules to process incoming data in small chunks and ingest the summarized results into a custom [Analytics table](basic-logs-configure.md) in your Log Analytics workspace. 

You can use summary rules to aggregate data from both [Analytics and Basic](basic-logs-query.md) log tables. The rules help to optimize costs when you need to retain raw data data in the cheap archiving tier for the time needed for your scenario and retain summarized data longer.

You can configure several rules to aggregate data from multiple tables and send the aggregated data to the same destination table or separate tables. 

When you run complex queries on large data sets, the process might time out. It's easier to do analysis and reporting for summarized data that's _cleaned_ and aggregated to a reduced set of data.

The summarized data in a custom log table can be exported to a Storage Account or Event Hubs for further integrations. Set the [Data Export rule](logs-data-export.md) in your workspace to enable the export.

:::image type="content" source="media/summary-rules/ingestion-flow.png" alt-text="Screenshot that shows how Summary rules ingest data through the Azure Monitor pipeline to Log Analytics workspace." border="false" lightbox="media/summary-rules/ingestion-flow.png":::

## Configure summary rule properties

A basic Summary rule can include a query, bin, and destination table. As an option, you can add a minimum delay (`binDelay`) before bin execution for late arriving data, along with rule execution time (`binStartTime`) to control the bin aggregation time.

The following table lists the Summary rules properties and descriptions:

| Property | Description |
| --- | --- |
| `ruleType` | Specifies the type of rule. <br> - `User` or `System.User`: Use these values for rules you author with a query, bin, and so on. <br> - `System`: Use this value for predefined rules managed by Azure services. |
| `description` | Provides details about the rule and its function. This property is helpful when you have several rules and can help with rule management. |
| `binSize` | Defines the interval query to perform and the query time range. The value can be every 20, 30, 60, 120, 180, 360, 720, or 1,440 minutes. The bin summarization is at the whole hour, for example, `02:00 to 04:00, 04:00 to 06:00` when the bin is 120. When the bin is smaller than an hour, execution is at the bin fraction, 20, and 30 minutes. |
| `query` | Defines the query to execute in the rule. A time range isn't needed because the `binSize` property determines the value, such as `02:00 to 03:00` for a 60-minutes bin. If you add a time filter in the query, the time rage used in the query is the intersection between the filter and the bin size. |
| `destinationTable` | Specifies the name of the destination custom log table. The name value must end with `_CL`. The table is created automatically in the workspace, if it doesn't already exist, including the schema derived by the query in the rule. If the table already exists in the workspace, new fields introduced in the query are automatically appended. <br><br> When a reserved field, such as `TimeGenerated`, `_IsBillable`, `_ResourceId`, `TenantId`, or `Type`, is included in the summary results, the `_Original` prefix is appended to the fields to preserve their original values. <br><br> The following standard fields are always included in the Summary rule results: <br> - `_BinStartTime`: The start time of each bin <br> - `_BinSize`: The interval query to perform and the query time range. The bin end time can be calculated as `_BinStartTime` plus `_BinSize`. <br> - `_RuleLastModifiedTime`: The time the rule was last modified, which is helpful for rule change tracking. <br> - `_RuleName`: The name of the rule, which is helpful with rules mapping, especially when multiple rules send data to a table. |
| `binDelay` (optional) | Identifies the time to delay before bin execution for late arriving data. The delay allows for most data to arrive and for service load distribution. The minimum delay is 3.5 minutes and up to 10% of the `binSize` value. <br><br> If you know that the data you query is typically ingested with delay, set the `binDelay` property with the known delay value or greater. The `binDelay` value can be between 3.5 minutes to 1,440 minutes. For example, for a 60-minutes bin and 10-minutes bin delay, execution of a bin 13:00 to 14:00 doesn't trigger before 14:10. |
| `binStartTime` (optional) | Specifies the date and time for the initial bin execution. The value can start at rule creation datetime minus the `binSize` value, or later and in whole hours. For example, if the datetime is `2023-12-03T12:13Z` and `binSize` is 1,440, the minimum `binStartTime` value can be `2023-12-02T13:00Z`, and execution of the first bin 02T13:00 to 03T13:00 is at 03T13:00 plus a specified delay. <br><br> The `binStartTime` property is useful in daily summary scenarios and helps specify the time of a bin. Suppose datetime is `2023-12-03T12:13Z` and you're located in the UTC-8 time zone, and you want a daily rule to complete before you start your day at 8:00 (00:00 UTC). Set the `binStartTime` property to `2023-12-02T22:00Z`. The first bin occurs at 02T:06:00 to 03T:06:00 local time and recurs daily. <br><br> When you update rules, you have several options: <br> - Use the existing `binStartTime` value: Execution continues per the initial definition. <br> - Remove the `binStartTime` property: Execution continues per the initial definition. <br> - Update the rule with a new `binStartTime` value: Executions adhere to the new datetime value. |
| `timeSelector` (optional) | Provides the datetime field for use by the query. Currently, the value can be `TimeGenerated`. |

After a rule configuration, the initial execution is at the next whole hour or per the `binStartTime` value (optional), plus a specified delay. Execution recurs per the value specified in the `binSize` property. 

The following sections provide example executions for a rule defined at `2023-06-07 14:44`.

### Use basic rule configuration

The first rule run is at the next whole hour after rule provisioning plus delay, which can be from 3.5 minutes to 10% of the `binSize` value. In this scenario, execution adds a delay of 4 minutes.

<!-- Questions:

- The document uses **bold** for the 15 and 4 in the second column. Is bold necessary? 

- If the rule is provisioned (defined) at 14:44 (see Markdown line 105 above), and the first run time is the next whole hour later plus a 4 minute delay (see Markdown line 109 above), why are the values in the second column not 15:48, rather than 15:04 ?
    
-->

| binSize (minutes) | Rule first run time | First bin time | Second bin time |
| --- | --- | --- | --- |
| 1440  | 2023-06-07 15:04 | 2023-06-06 15:00 -- 2023-06-07 15:00 | 2023-06-07 15:00 -- 2023-06-08 15:00 |
|  720  | 2023-06-07 15:04 | 2023-06-07 03:00 -- 2023-06-07 15:00 | 2023-06-07 15:00 -- 2023-06-08 03:00 |
|  360  | 2023-06-07 15:04 | 2023-06-07 09:00 -- 2023-06-07 15:00 | 2023-06-07 15:00 -- 2023-06-07 21:00 |
|  180  | 2023-06-07 15:04 | 2023-06-07 12:00 -- 2023-06-07 15:00 | 2023-06-07 15:00 -- 2023-06-07 18:00 |
|  120  | 2023-06-07 15:04 | 2023-06-07 13:00 -- 2023-06-07 15:00 | 2023-06-07 15:00 -- 2023-06-07 17:00 |
|   60  | 2023-06-07 15:04 | 2023-06-07 14:00 -- 2023-06-07 15:00 | 2023-06-07 15:00 -- 2023-06-07 16:00 |
|   30  | 2023-06-07 15:04 | 2023-06-07 14:30 -- 2023-06-07 15:00 | 2023-06-07 15:00 -- 2023-06-07 15:30 |
|   20  | 2023-06-07 15:04 | 2023-06-07 14:40 -- 2023-06-07 15:00 | 2023-06-07 15:00 -- 2023-06-07 15:20 |

### Use advanced rule configuration

The first rule run is at the next whole hour after rule provisioning plus a delay, which can be from 3.5 minutes to 10% of the binSize. If you want to control the execution hour for daily rules, or add a specified delay before bin is processed, include the `binStartTime`, `binDelay` value in the rule configuration. 

> [!NOTE]
> The `binStartTime` value starts at rule creation datetime minus the `binSize` value, or later in whole hours.

For this example, the rule includes the following configuration:
- `binStartTime`: 2023-06-08 07:00
- `binDelay`: 8 minutes

<!-- Questions:

- The document uses **bold** for the 8 in the second column, and also for the first full value in the third column. Is bold necessary?
    
-->

| binSize (minutes) | Rule first run time | First bin time | Second bin time |
| --- | --- | --- | --- |
| 1440 | 2023-06-09 07:08 | 2023-06-08 07:00 -- 2023-06-09 07:00 | 2023-06-09 07:00 -- 2023-06-10 07:00 |
|  720 | 2023-06-08 19:08 | 2023-06-08 07:00 -- 2023-06-08 19:00 | 2023-06-08 19:00 -- 2023-06-09 07:00 |
|  360 | 2023-06-08 13:08 | 2023-06-08 07:00 -- 2023-06-08 13:00 | 2023-06-08 13:00 -- 2023-06-08 19:00 |
|  180 | 2023-06-08 10:08 | 2023-06-08 07:00 -- 2023-06-08 10:00 | 2023-06-08 10:00 -- 2023-06-08 13:00 |
|  120 | 2023-06-08 09:08 | 2023-06-08 07:00 -- 2023-06-08 09:00 | 2023-06-08 09:00 -- 2023-06-08 11:00 |
|   60 | 2023-06-08 08:08 | 2023-06-08 07:00 -- 2023-06-08 08:00 | 2023-06-08 08:00 -- 2023-06-08 09:00 |
|   30 | 2023-06-08 07:38 | 2023-06-08 07:00 -- 2023-06-08 07:30 | 2023-06-08 07:30 -- 2023-06-08 08:00 |
|   20 | 2023-06-08 07:28 | 2023-06-08 07:00 -- 2023-06-08 07:20 | 2023-06-08 07:20 -- 2023-06-08 07:40 |

The initial rule execution is after the bin range plus an 8-minute delay. The typical delay can be between 4 minutes and up to 10% of the `binSize` value. For example, a rule with a 12-hours bin size can execute bin 02:00 to 14:00 at 15:12. 

## Create or update Summary rules

Azure services provide and manage two types of predefined Summary rules, `User` and `System`. For rules that you create and configure, the `ruleType` property is always `User` and the `destinationTable` name must end with `_CL`. When you update a query and output fields are omitted from the results set, existing fields aren't automatically removed from the destination table. You can remove the fields by using the [Table API](/rest/api/loganalytics/tables/update?tabs=HTTP). 

> [!NOTE]
> Before you create a rule configuration, first experiment with the intended query in Log Analytics Logs. Verify that the query doesn't hit or get close to the query limit. Confirm the query produces the intended schema shape and expected results. If the query is close to the query limits, consider using a smaller `binSize` to process less data per bin. You can also modify the query to return fewer records or remove fields with higher volume.

```kusto
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourcegroup}/providers/Microsoft.OperationalInsights/workspaces/{workspace}/summaryslogs/{ruleName}?api-version=2023-01-01-preview
Authorization: {credential}

{
  "properties": {
      "ruleType": "User",
      "description": "My test rule",
      "ruleDefinition": {
          "query": "StorageBlobLogs | summarize count() by AccountName",
          "binSize": 30,
          "destinationTable": "MySummaryLogs_CL"
      }
  }
}
```

The destination table is created after initial rule execution, which is at the next whole hour after rule configuration plus a specified delay. The destination table is always appended with the following fields:

- `_BinStartTime`: The start time of each bin.
- `_BinSize`: The interval query performed and query time range. The bin end time can be calculated as the `_BinStartTime` value plus the `_BinSize` value.
- `_RuleLastModifiedTime`: The time that the rule was last modified. This value is helpful for rule change tracking.
- `_RuleName`: The name of the rule. This value is helpful with rules mapping, especially when multiple rules send data to a table.

The following image shows the results for the example request:

:::image type="content" source="media/summary-rules/example-request.png" alt-text="Screenshot that shows the results for the example Summary rules request." lightbox="media/summary-rules/example-request.png":::

The next sections provide more examples for working with Summary rules.

### Get specific rule

The following example shows how to view the configuration for a specific Summary rule:

```kusto
GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourcegroup}/providers/Microsoft.OperationalInsights/workspaces/{workspace}/summarylogs/{ruleName1}?api-version=2023-01-01-preview
Authorization: {credential}
```

### Get all rules

The following example shows how to view the configuration for all Summary rules in your Log Analytics workspace:

```kusto
GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourcegroup}/providers/Microsoft.OperationalInsights/workspaces/{workspace}/summarylogs?api-version=2023-01-01-preview
Authorization: {credential}
```

### Stop rule

You can stop a rule for a time, such as when test data is ingested to a table and you don't want to affect the summarized table and reports. Starting the rule later starts processing data from the next whole hour or per the defined `binStartTime` (optional) hour.

The following example demonstrates how to stop a rule:

```kusto
POST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourcegroup}/providers/Microsoft.OperationalInsights/workspaces/{workspace}/summarylogs/{ruleName}/stop?api-version=2023-01-01-preview
Authorization: {credential}
```

### Start rule

If a Summary rule is deliberately stopped, or stopped due to bin execution exhaustion, you can start the rule. Processing starts from the next whole hour, or per the defined `binStartTime` (optional) hour.

The following example demonstrates how to start a rule:

```kusto
POST https://management.azure.com/subscriptions/{su	bscriptionId}/resourceGroups/{resourcegroup}/providers/Microsoft.OperationalInsights/workspaces/{workspace}/summarylogs/{ruleName}/start?api-version=2023-01-01-preview
Authorization: {credential}
```

### Delete rule

You can have up to 10 active Summary rules in your Log Analytics workspace. If you want to create a new rule, but you already have 10 active rules, you must stop or delete an active Summary rule. 

The following example demonstrates how to delete an active rule:

```kusto
DELETE https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourcegroup}/providers/Microsoft.OperationalInsights/workspaces/{workspace}/summarylogs/{ruleName}?api-version=2023-01-01-preview
Authorization: {credential}
```

## Examine data completeness

Summary rules are designed for scale, and include a retry mechanism that can overcome transient failure related to service or query, such as hitting [query limits](../service-limits.md#log-analytics-workspaces). The retry mechanism includes 10 attempts within 8 hours and skips a bin, if exhausted. The rule is set to `isActive: false` and put on hold after eight consecutive bins with retries. If diagnostic settings are enabled in your workspace, an event is sent to the LASummaryLogs table in your workspace.

Failed bins can`t be run again, but they can be detected by using the following query in your workspace. If the query reveals missing bins, see the [Monitor Summary rules](#monitor-summary-rules) section for rule remediation options and proactive alerts.

In the following query, the `step` value is equal to the bin size defined in the rule.

```kusto
let startTime = datetime("2024-02-16");
let endtTime = datetime("2024-03-03");
let ruleName = "myRuleName";
let stepSize = 20m;
LASummaryLogs
| where RuleName == ruleName
| where Status == 'Succeeded'
| make-series dcount(BinStartTime) default=0 on BinStartTime from startTime to endtTime step stepSize
| render timechart
```

The following graph charts the query results for failed bins in Summary rules:

:::image type="content" source="media/summary-rules/data-completeness.png" alt-text="Screenshot that shows a graph that charts the query results for failed bins in Summary rules." lightbox="media/summary-rules/data-completeness.png":::

## Monitor Summary rules

To receive diagnostics data in the LASummaryLogs table, enable Diagnostics settings for the **Summary Logs** category in your Log Analytics workspace. The data indicates the Summary rule run Start, Succeeded, and Failed information.

Summary rules are designed for scale, and include a retry mechanism that can overcome transient failure related to service or query, such as hitting [query limits](../service-limits.md#log-analytics-workspaces). After eight consecutive bins with failures, the rule operation is suspended. The rule configuration is updated to `isActive: false`, and the diagnostic event is sent to the LASummaryLogs table, if Diagnostic settings are enabled in your workspace.

Events in the LASummaryLogs diagnostic table include the `QueryDuationMs` value, which indicates the time for the query to complete. This value can help to indicate if the run is approaching the query timeout limit. The recommendation is to set alerts and receive notifications for bin failures, or when bin execution is nearing time-out. Depending on the failure reason, you can either reduce the bin size to process less data on each execution, or alter the query to return fewer records or fields with higher volume.

The following sections provide example queries for the LASummaryLogs diagnostic table.

### Exhausted bin execution

The following query searches rule date in the LASummaryLogs table for Failed runs:

```kusto
LASummaryLogs | where Status == "Failed"
```

### Summary execution at 90% of query timeout

The following query searches rule data in the LASummaryLogs table for entries where the `QueryDurationMs` value is greater than 0.9 x 600,000 milliseconds:

```kusto
LASummaryLogs | where QueryDurationMs > 0.9 * 600000
```

## Troubleshoot Summary rules

Review the following troubleshooting tips for working with Summary rules:

- **Destination table accidental delete**: If a table was deleted from the UI or by using an API while a Summary rule is active, the rule remains active although no data returned. The diagnostics logs to the LASummaryLogs table show the run as successful. 

   - If you don't need the summary results in the destination table, delete the rule.

   - If you need the summary results, see the instructions for a previously defined query in the [Create or update Summary rules](#create-or-update-summary-rules) section. The results table restores, including the data ingested before the delete, depending on the retention policy in the table.

- **Query operators allow output schema expansion**: If the query in the rule includes operators that allow output schema expansion per incoming data, such as `arg_max(expression, *)`, `bag_unpack()`, and so on, new fields can be generated in the output per the incoming data. New fields generated after rule creation or updates aren't added to the destination table and dropped. You can add the new fields to the destination table when you perform a [rule update](#create-or-update-summary-rules), or add fields manually in [Table management](manage-logs-tables.md#view-table-properties).

- **Data remains in workspace, subjected to retention period**: When you [delete fields or a custom log table](manage-logs-tables.md#view-table-properties), data remains in the workspace and is subjected to the [retention](data-retention-archive.md) period defined on the table or workspace. Recreating the table with the same name and fields, cause old data to show up. If you want to delete old data, [update the table retention period](/rest/api/loganalytics/tables/update) with the minimum retention supported (four days) and then delete the table.

## Pricing model

The cost of Summary rules includes the cost of queries and ingested results to the Analytics table, depending on the tier of tables you query.

| Plan of table used in query | Query cost | Results ingestion cost |
| --- | --- | --- |
| Analytics |            | Analytics ingested GB | 
| Basic     | Scanned GB | Analytics ingested GB | 
| Auxiliary | Scanned GB | Analytics ingested GB | 

Cost calculation for hourly rule returning 100 records per bin:

| Rule configuration | Monthly price calculation
| --- | --- |
| Query Analytics table  | Ingestion price x record size x number of records x 24 hours x 30 days | 
| Query Basic table scanning 1 GB each bin | Scanned GB price x scanned size + record size x number of records x 24 hours x 30 days | 

## Related content

- [Logs Ingestion API in Azure Monitor](logs-ingestion-api-overview.md)
- [Tutorial: Send data to Azure Monitor Logs with Logs ingestion API (Azure portal)](tutorial-logs-ingestion-portal.md)
