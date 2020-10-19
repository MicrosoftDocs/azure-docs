---
title: Monitor health of Log Analytics workspace in Azure Monitor
description: Describes how to monitor the health of your Log Analytics workspace using data in the Operation table.
ms.subservice: logs
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 10/03/2020

---

# Monitor health of Log Analytics workspace in Azure Monitor
To maintain the performance and availability of your Log Analytics workspace in Azure Monitor, you need to be able to proactively detect any issues that arise. This article describes how to monitor the health of your Log Analytics workspace using data in the [Operation](/azure-monitor/reference/tables/operation) table. This table is included in every Log Analytics workspace and contains error and warnings that occur in your workspace. You should regularly review this data and create alerts to be proactively notified when there are any important incidents in your workspace.

## _LogsOperation function
Azure Monitor Logs sends details on any issues to the [Operation](/azure-monitor/reference/tables/operation) table in the workspace where the issue occurred. The **_LogsOperation** system function is based on the **Operation** table and provides a simplified set of information for analysis and alerting.

## Columns

The **_LogsOperation** function returns the columns in the following table.

| Column | Description |
|:---|:---|
| TimeGenerated | Time that the incident occurred in UTC. |
| Category  | Operation category group. Can be used to filter on types of operations and help create more precise system auditing and alerts. See the section below for a list of categories. |
| Operation  | Description of the operation type. This can indicate one of the Log Analytics limits, type of operation, or part of a process. |
| Level | Severity level of the issue.<br>- Info: No specific attention needed.<br>- Warning: Process was not completed as expected, and attention is needed.<br>- Error: Process failed and urgent attention is needed. 
| Detail | Detailed description of the operation include specific error message if it exists. |
| _ResourceId | Resource ID of the Azure resource related to the operation.  |
| Computer | Computer name if the operation is related to an Azure Monitor agent. |
| CorrelationId | Used to group consecutive related operations. |


## Categories
The following table describes the categories from the _LogsOperations function. 

| Category | Description |
|:---|:---|
| Ingestion           | Operations that are part of the data ingestion process. See below for more details. |
| Agent               | Indicates an issue with agent installation. |
| Data collection     | Operations related to data collections processes. |
| Solution targeting  | Operation of type *ConfigurationScope* was processed. |
| Assessment solution | An assessment process was executed. |


### Ingestion
Ingestion operations are issues that occurred during data ingestion including notification about reaching the Azure Log Analytics workspace limits. Error conditions in this category might suggest data loss, so they are particularly important to monitor. The table below provides details on these operations. See [Azure Monitor service limits](../service-limits.md#log-analytics-workspaces) for service limits for Log Analytics workspaces.


| Operation | Level | Detail |
|:---|:---|:---|
| Ingestion volume rate limit | Warning | Reached 80% of daily limit.         |
|                             | Error   | Rate limit reached.                 |
| Daily ingestion cap         | Info    | Daily limit reset.                  |
| Free tier ingestion limit   | Warning | Free tier limit reached.            |
| Max column limit            | Error   | Custom fields column limit reached. |
| Max column size limit       | Warning | Field value trimmed as size limit reached. |
| JSON parsing                | Error   | Failed to parse JSON message.       |





## Alert rules
Use [log query alerts](../platform/alerts-log-query.md) in Azure Monitor to be proactively notified when an issue is detected in your Log Analytics workspace. You should use a strategy that allows you to respond in a timely manner to issues while minimizing your costs. Your subscription is charged for each alert rule with a cost depending on the frequency that it's evaluated.

A recommended strategy is to start with two alert rules based on the level of the issue. Use a short frequency such as every 5 minutes for Errors and a longer frequency such as 24 hours for Warnings. Since Errors indicate potential data loss, you want to respond to them quickly to minimize any loss. Warnings typically indicate an issue that does not require immediate attention, so you can review them daily.

Use the process in [Create, view, and manage log alerts using Azure Monitor](../platform/alerts-log.md) to create the log alert rules. The following sections describe the details for each rule.


| Query | Threshold value | Period | Frequency |
|:---|:---|:---|:---|
| `_LogsOperation | where Level == "Error"`   | 0 | 5 | 5 |
| `_LogsOperation | where Level == "Warning"` | 0 | 1440 | 1440 |

These alert rules will respond the same to all operations with Error or Warning. As you become more familiar with the operations that are generating alerts, you may want to respond differently for particular operations. For example, you may want to send notifications to different people for particular operations. 

To create an alert rule for a specific operation, use a query that includes the **Category** and **Operation** columns. The following example creates a warning alert when the ingestion volume rate has reached 80% of the limit.

```kusto
_LogsOperation
| where Category == "Ingestion"
| where Operation == "Ingestion volume rate limit"
| where Level == "Warning"
```



## Next steps

- Learn more about [log alerts](alerts-log.md).
- [Collect query audit data](../log-query/query-audit.md) for your workspace.