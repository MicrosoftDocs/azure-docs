---
title: Monitor operational issues logged in your Azure Monitor Log Analytics workspace 
description: The article describes how to monitor the health of your Log Analytics workspace by using data in the Operation table.
ms.topic: how-to
ms.reviewer: MeirMen
ms.date: 07/02/2023

---

# Monitor operational issues in your Azure Monitor Log Analytics workspace

To maintain the performance and availability of your Log Analytics workspace in Azure Monitor, you need to be able to proactively detect any issues that arise. This article describes how to monitor the health of your Log Analytics workspace by using data in the [Operation](/azure/azure-monitor/reference/tables/operation) table. This table is included in every Log Analytics workspace. It contains error messages and warnings that occur in your workspace. We recommend that you create alerts for issues with the level of Warning and Error.

[!INCLUDE [log-analytics-query-permissions](../../../includes/log-analytics-query-permissions.md)]

## _LogOperation function

Azure Monitor Logs sends information on any issues to the [Operation](/azure/azure-monitor/reference/tables/operation) table in the workspace where the issue occurred. The `_LogOperation` system function is based on the **Operation** table and provides a simplified set of information for analysis and alerting.

## Columns

The `_LogOperation` function returns the columns in the following table.

| Column | Description |
|:---|:---|
| TimeGenerated | Time that the incident occurred in UTC. |
| Category  | Operation category group. Can be used to filter on types of operations and help create more precise system auditing and alerts. See the following section for a list of categories. |
| Operation  | Description of the operation type. The operation can indicate that one of the Log Analytics limits was reached, a back-end process related issue, or any other service message. |
| Level | Severity level of the issue:<br>- Info: No specific attention needed.<br>- Warning: Process wasn't completed as expected, and attention is needed.<br>- Error: Process failed, and attention is needed.
| Detail | Detailed description of the operation, includes the specific error message. |
| _ResourceId | Resource ID of the Azure resource related to the operation.  |
| Computer | Computer name if the operation is related to an Azure Monitor agent. |
| CorrelationId | Used to group consecutive related operations. |

## Categories

The following table describes the categories from the `_LogOperation` function.

| Category | Description |
|:---|:---|
| Ingestion           | Operations that are part of the data ingestion process. |
| Agent               | Indicates an issue with agent installation. |
| Data collection     | Operations related to data collection processes. |
| Solution targeting  | Operation of type `ConfigurationScope` was processed. |
| Assessment solution | An assessment process was executed. |

### Ingestion

Ingestion operations are issues that occurred during data ingestion and include notification about reaching the Log Analytics workspace limits. Error conditions in this category might suggest data loss, so they're important to monitor. For service limits for Log Analytics workspaces, see [Azure Monitor service limits](../service-limits.md#log-analytics-workspaces).

#### Operation: Data collection stopped

"Data collection stopped due to daily limit of free data reached. Ingestion status = OverQuota"

In the past seven days, logs collection reached the daily set limit. The limit is set either as the workspace is set to **Free tier** or the daily collection limit was configured for this workspace.
After your data collection reaches the set limit, it automatically stops for the day and will resume only during the next collection day.

Recommended actions:

*	Check the `_LogOperation` table for collection stopped and collection resumed events:</br>
`_LogOperation | where TimeGenerated >= ago(7d) | where Category == "Ingestion" | where Detail has "Data collection"`
*	[Create an alert](daily-cap.md#alert-when-daily-cap-is-reached) on the "Data collection stopped" Operation event. This alert notifies you when the collection limit is reached.
*	Data collected after the daily collection limit is reached will be lost. Use the **Workspace insights** pane to review usage rates from each source. Or you can decide to [manage your maximum daily data volume](daily-cap.md) or [change the pricing tier](cost-logs.md#commitment-tiers) to one that suits your collection rates pattern.
* The data collection rate is calculated per day and resets at the start of the next day. You can also monitor a collection resume event by [creating an alert](./daily-cap.md#alert-when-daily-cap-is-reached) on the "Data collection resumed" Operation event.

#### Operation: Ingestion rate

"The data ingestion volume rate crossed the threshold in your workspace: {0:0.00} MB per one minute and data has been dropped."

Recommended actions:

*	Check the  `_LogOperation` table for an ingestion rate event:</br>
`_LogOperation | where TimeGenerated >= ago(7d) | where Category == "Ingestion" | where Operation has "Ingestion rate"`
      </br>An event is sent to the **Operation** table in the workspace every six hours while the threshold continues to be exceeded.
*	[Create an alert](daily-cap.md#alert-when-daily-cap-is-reached) on the "Data collection stopped" Operation event. This alert notifies you when the limit is reached.
*	Data collected while the ingestion rate reached 100 percent will be dropped and lost. Use the **Workspace insights** pane to review your usage patterns and try to reduce them.</br>
For more information, see: </br>
    - [Azure Monitor service limits](../service-limits.md#data-ingestion-volume-rate) </br>
    - [Analyze usage in Log Analytics workspace](analyze-usage.md)

#### Operation: Maximum table column count

"Data of type \<**table name**\> was dropped because number of fields \<**new fields count**\> is above the limit of \<**current field count limit**\> custom fields per data type."

Recommended action: For custom tables, you can move to [parsing the data](./parse-text.md) in queries.

#### Operation: Field content validation

"The following fields' values \<**field name**\> of type \<**table name**\> have been trimmed to the max allowed size, \<**field size limit**\> bytes. Please adjust your input accordingly."

A field larger than the limit size was processed by Azure logs. The field was trimmed to the allowed field limit. We don't recommend sending fields larger than the allowed limit because it results in data loss.

Recommended actions:

Check the source of the affected data type:

*	If the data is being sent through the HTTP Data Collector API, you need to change your code\script to split the data before it's ingested.
*	For custom logs, collected by a Log Analytics agent, change the logging settings of the application or tool.
*	For any other data type, raise a support case. For more information, see [Azure Monitor service limits](../service-limits.md#data-ingestion-volume-rate).

### Data collection

The following section provides information on data collection.

#### Operation: Azure Activity Log collection

"Access to the subscription was lost. Ensure that the \<**subscription id**\> subscription is in the \<**tenant id**\> Azure Active Directory tenant. If the subscription is transferred to another tenant, there's no impact to the services, but information for the tenant could take up to an hour to propagate."

In some situations, like moving a subscription to a different tenant, the Azure activity logs might stop flowing into the workspace. In those situations, you need to reconnect the subscription following the process described in this article.

Recommended actions:

* If the subscription mentioned in the warning message no longer exists, go to the **Legacy activity log connector** pane under **Classic**. Select the relevant subscription, and then select the **Disconnect** button.
* If you no longer have access to the subscription mentioned in the warning message:
  * Follow the preceding step to disconnect the subscription.
  * To continue collecting logs from this subscription, contact the subscription owner to fix the permissions and re-enable activity log collection.
* [Create a diagnostic setting](../essentials/activity-log.md#send-to-log-analytics-workspace) to send the activity log to a Log Analytics workspace.

### Agent

The following section provides information on agents.

#### Operation: Linux Agent

"Two successive configuration applications from OMS Settings failed."

Configuration settings on the portal have changed.

Recommended action:
This issue is raised in case there's an issue for the agent to retrieve the new config settings. To mitigate this issue, reinstall the agent.
Check the `_LogOperation` table for the agent event:</br>

 `_LogOperation | where TimeGenerated >= ago(6h) | where Category == "Agent" | where Operation == "Linux Agent"  | distinct _ResourceId`

The list shows the resource IDs where the agent has the wrong configuration. To mitigate the issue, reinstall the agents listed.

## Alert rules

Use [log query alerts](../alerts/alerts-log-query.md) in Azure Monitor to be proactively notified when an issue is detected in your Log Analytics workspace. Use a strategy that allows you to respond in a timely manner to issues while minimizing your costs. Your subscription will be charged for each alert rule as listed in [Azure Monitor pricing](https://azure.microsoft.com/pricing/details/monitor/#platform-logs).

A recommended strategy is to start with two alert rules based on the level of the issue. Use a short frequency such as every 5 minutes for Errors and a longer frequency such as 24 hours for Warnings. Because Errors indicate potential data loss, you want to respond to them quickly to minimize any loss. Warnings typically indicate an issue that doesn't require immediate attention, so you can review them daily.

Use the process in [Create, view, and manage log alerts by using Azure Monitor](../alerts/alerts-log.md) to create the log alert rules. The following sections describe the details for each rule.

| Query | Threshold value | Period | Frequency |
|:---|:---|:---|:---|
| `_LogOperation | where Level == "Error"`   | 0 | 5 | 5 |
| `_LogOperation | where Level == "Warning"` | 0 | 1,440 | 1,440 |

These alert rules respond the same to all operations with Error or Warning. As you become more familiar with the operations that are generating alerts, you might want to respond differently for particular operations. For example, you might want to send notifications to different people for particular operations.

To create an alert rule for a specific operation, use a query that includes the **Category** and **Operation** columns.

The following example creates a Warning alert when the ingestion volume rate has reached 80 percent of the limit:

- Target: Select your Log Analytics workspace
- Criteria:
  - Signal name: Custom log search
  - Search query: `_LogOperation | where Category == "Ingestion" | where Operation == "Ingestion rate" | where Level == "Warning"`
  - Based on: Number of results
  - Condition: Greater than
  - Threshold: 0
  - Period: 5 (minutes)
  - Frequency: 5 (minutes)
- Alert rule name: Daily data limit reached
- Severity: Warning (Sev 1)

The following example creates a Warning alert when the data collection has reached the daily limit:

- Target: Select your Log Analytics workspace
- Criteria:
  - Signal name: Custom log search
  - Search query: `_LogOperation | where Category == "Ingestion" | where Operation == "Data collection Status" | where Level == "Warning"`
  - Based on: Number of results
  - Condition: Greater than
  - Threshold: 0
  - Period: 5 (minutes)
  - Frequency: 5 (minutes)
- Alert rule name: Daily data limit reached
- Severity: Warning (Sev 1)

## Next steps

- Learn more about [log alerts](../alerts/alerts-log.md).
- [Collect query audit data](./query-audit.md) for your workspace.
