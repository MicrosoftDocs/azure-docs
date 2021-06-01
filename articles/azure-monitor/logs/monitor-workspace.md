---
title: Monitor health of Log Analytics workspace in Azure Monitor
description: Describes how to monitor the health of your Log Analytics workspace using data in the Operation table.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 10/20/2020

---

# Monitor health of Log Analytics workspace in Azure Monitor
To maintain the performance and availability of your Log Analytics workspace in Azure Monitor, you need to be able to proactively detect any issues that arise. This article describes how to monitor the health of your Log Analytics workspace using data in the [Operation](/azure/azure-monitor/reference/tables/operation) table. This table is included in every Log Analytics workspace and contains error and warnings that occur in your workspace. You should regularly review this data and create alerts to be proactively notified when there are any important incidents in your workspace.

## _LogOperation function

Azure Monitor Logs sends details on any issues to the [Operation](/azure/azure-monitor/reference/tables/operation) table in the workspace where the issue occurred. The **_LogOperation** system function is based on the **Operation** table and provides a simplified set of information for analysis and alerting.

## Columns

The **_LogOperation** function returns the columns in the following table.

| Column | Description |
|:---|:---|
| TimeGenerated | Time that the incident occurred in UTC. |
| Category  | Operation category group. Can be used to filter on types of operations and help create more precise system auditing and alerts. See the section below for a list of categories. |
| Operation  | Description of the operation type. This can indicate one of the Log Analytics limits, type of operation, or part of a process. |
| Level | Severity level of the issue:<br>- Info: No specific attention needed.<br>- Warning: Process was not completed as expected, and attention is needed.<br>- Error: Process failed and urgent attention is needed. 
| Detail | Detailed description of the operation include specific error message if it exists. |
| _ResourceId | Resource ID of the Azure resource related to the operation.  |
| Computer | Computer name if the operation is related to an Azure Monitor agent. |
| CorrelationId | Used to group consecutive related operations. |


## Categories

The following table describes the categories from the _LogOperation function. 

| Category | Description |
|:---|:---|
| Ingestion           | Operations that are part of the data ingestion process. See below for more details. |
| Agent               | Indicates an issue with agent installation. |
| Data collection     | Operations related to data collections processes. |
| Solution targeting  | Operation of type *ConfigurationScope* was processed. |
| Assessment solution | An assessment process was executed. |


### Ingestion
Ingestion operations are issues that occurred during data ingestion including notification about reaching the Azure Log Analytics workspace limits. Error conditions in this category might suggest data loss, so they are particularly important to monitor. The table below provides details on these operations. See [Azure Monitor service limits](../../service-limits.md#log-analytics-workspaces) for service limits for Log Analytics workspaces.

 
#### Operation: Data collection Stopped  
Data collection stopped due to daily limit reached.

In the past 7 Days you have reached your ingestion daily limit; this is either due to your workspace being in the free tier or that you have set a daily ingestion limit.
Note, after reaching the set limit, your data collection will automatically stop for the day and will resume only during the next collection day. 
 
Recommended Actions: 
*	Check _LogOperation table for collection stopped and collection resumed events.</br>
`_LogOperation | where TimeGenerated >= ago(7d) | where Category == "Ingestion" | where Operation has "Data collection"`
*	[Create an alert](./manage-cost-storage.md#alert-when-daily-cap-reached) on "Data collection stopped" Operation event, this will allow you to get notified when the limit is reached.
*	Reaching the daily limit is not recommended, as this will result in data loss, you might want to either check why the limit is reached, you can use the ‘workspace insights’ blade to review your usage patterns and try to reduce them.
Or, you can decide to ([increase your daily ingestion limit](./manage-cost-storage.md#manage-your-maximum-daily-data-volume) \ [change the pricing tier](./manage-cost-storage.md#changing-pricing-tier) to one that will suite your ingestion pattern). 
* As mentioned, data ingestion will resume during the start of the next day, you can also monitor this event by [Create an alert](./manage-cost-storage.md#alert-when-daily-cap-reached) on "Data collection resumed" Operation event, this will allow you to get notified when the limit is reached.

#### Operation: Ingestion rate
Ingestion rate limit approaching\passed the limit.

 Your ingestion rate has passed the 80%; at this point there is not issue. Please note, data collected exceeding the threshold will be dropped. </br>

Recommended Actions:
*	Check _LogOperation table for ingestion rate event 
`_LogOperation | where TimeGenerated >= ago(7d) | where Category == "Ingestion" | where Operation has "Ingestion rate"` 
      Note: Operation table in the workspace every 6 hours while the threshold continues to be exceeded. 
*	[Create an alert](./manage-cost-storage.md#alert-when-daily-cap-reached) on "Data collection stopped" Operation even, this will allow you to get notified when the limit is reached.
*	We recommend making sure you do not exceed the ingestion rate limit, as this will result in data loss.

You might want to either check why the limit is reached, you can use the workspace insights blade to review your usage patterns and try to reduce them.
For further information: 
[Azure Monitor service limits](../../service-limits.md#data-ingestion-volume-rate) 
[Manage usage and costs for Azure Monitor Logs](./manage-cost-storage.md#alert-when-daily-cap-reached)  

 
#### Operation: Maximum table column count
Custom fields has reached the limit.

Recommended Actions: 
For custom tables, you can move to [Parsing the data](./parse-text.md) in queries, 
If for any reason this is not possible, please proceed with case creation and request to increase the filed limit for this specific table.  

#### Operation: Field content validation
One of the fields of the data being ingested had more than 32Kb in size, so it got truncated.

Log Analytics limits ingested fields size to 32Kb, larger size fields will be trimmed to 32Kb. We don’t recommend sending fields larger then 32Kb as the trim process might remove important information. 

Recommended Actions:
Check the source of the affected data type:
*	If the data is being sent thru the HTTP Data Collector API, you will need to change your code\script to split the data before it’s ingested.
*	In case it’s a custom log, collected from a Log Analytics agent, then you’ll to change the logging settings of the application\tool to prevent this.
*	For any other data type, please raise a support case.
</br>Read more: [Azure Monitor service limits](../../service-limits.md#data-ingestion-volume-rate) 

### Data Collection
#### Operation: Azure Activity Log Collection
Description: In some situations, like moving a subscription to a different tenant, the Azure Activity logs might stop flowing in into the workspace. In those situations, we need to reconnect the subscription following the process described in this article.

Recommended Actions: 
* If the subscription mentioned on the warning message no longer exists, please navigate to the ‘Azure Activity log’ blade under ‘Workspace Data Sources’, select the relevant subscription and finally select the ‘Disconnect’ button.
* If you no longer have access to the subscription mentioned on the warning message:
  * If you no longer want to collect logs from this subscription, then please follow the same actions as step 1
  * If you still want to collect logs from this subscription, then please follow the same actions as step 1, contact the subscription owner to verify and fix your permissions and re-enable activity log collection 
* If you need to enable or re-enable activity log collection, we strongly recommend that you switch to the new collection method that leverages diagnostic settings, as it includes : [Azure Activity log](../../essentials/activity-log.md#send-to-log-analytics-workspace)

### Agent
#### Operation: Linux Agent
Config settings on the portal have changed.

Recommended Action
This issue is raised in case there is an issue for the Agent to retrieve the new config settings, 
To mitigate this, you will need to reinstall the agent. 
Check _LogOperation table for agent event.</br>

 `_LogOperation | where TimeGenerated >= ago(6h) | where Category == "Agent" | where Operation == "Linux Agent"  | distinct _ResourceId`

The list will list the resource Ids where the Agent has the wrong configuration.
To mitigate the issue, you will need to reinstall the Agents listed.

   

## Alert rules
Use [log query alerts](../alerts/alerts-log-query.md) in Azure Monitor to be proactively notified when an issue is detected in your Log Analytics workspace. You should use a strategy that allows you to respond in a timely manner to issues while minimizing your costs. Your subscription is charged for each alert rule with a cost depending on the frequency that it's evaluated.

A recommended strategy is to start with two alert rules based on the level of the issue. Use a short frequency such as every 5 minutes for Errors and a longer frequency such as 24 hours for Warnings. Since Errors indicate potential data loss, you want to respond to them quickly to minimize any loss. Warnings typically indicate an issue that does not require immediate attention, so you can review them daily.

Use the process in [Create, view, and manage log alerts using Azure Monitor](../alerts/alerts-log.md) to create the log alert rules. The following sections describe the details for each rule.


| Query | Threshold value | Period | Frequency |
|:---|:---|:---|:---|
| `_LogOperation | where Level == "Error"`   | 0 | 5 | 5 |
| `_LogOperation | where Level == "Warning"` | 0 | 1440 | 1440 |

These alert rules will respond the same to all operations with Error or Warning. As you become more familiar with the operations that are generating alerts, you may want to respond differently for particular operations. For example, you may want to send notifications to different people for particular operations. 

To create an alert rule for a specific operation, use a query that includes the **Category** and **Operation** columns. 

The following example creates a warning alert when the ingestion volume rate has reached 80% of the limit.

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


The following example creates a warning alert when the data collection has reached the daily limit. 

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
