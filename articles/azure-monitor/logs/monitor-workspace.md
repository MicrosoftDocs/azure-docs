---
title: Monitor health of Log Analytics workspace in Azure Monitor
description: Describes how to monitor the health of your Log Analytics workspace using data in the Operation table.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 10/20/2020

---

# Monitor health of Log Analytics workspace in Azure Monitor
To maintain the performance and availability of your Log Analytics workspace in Azure Monitor, you need to be able to proactively detect any issues that arise. This article describes how to monitor the health of your Log Analytics workspace using data in the [Operation](/azure/azure-monitor/reference/tables/operation) table. This table is included in every Log Analytics workspace and contains error and warnings that occur in your workspace. It is recommended to create alerts for issues in level "Warning" and "Error".

## _LogOperation function

Azure Monitor Logs sends details on any issues to the [Operation](/azure/azure-monitor/reference/tables/operation) table in the workspace where the issue occurred. The **_LogOperation** system function is based on the **Operation** table and provides a simplified set of information for analysis and alerting.

## Columns

The **_LogOperation** function returns the columns in the following table.

| Column | Description |
|:---|:---|
| TimeGenerated | Time that the incident occurred in UTC. |
| Category  | Operation category group. Can be used to filter on types of operations and help create more precise system auditing and alerts. See the section below for a list of categories. |
| Operation  | Description of the operation type. The operation can indicate that one of the Log Analytics limits was reached, a backend process related issue, or any other service message. |
| Level | Severity level of the issue:<br>- Info: No specific attention needed.<br>- Warning: Process was not completed as expected, and attention is needed.<br>- Error: Process failed, attention needed. 
| Detail | Detailed description of the operation, includes the specific error message. |
| _ResourceId | Resource ID of the Azure resource related to the operation.  |
| Computer | Computer name if the operation is related to an Azure Monitor agent. |
| CorrelationId | Used to group consecutive related operations. |


## Categories

The following table describes the categories from the _LogOperation function. 

| Category | Description |
|:---|:---|
| Ingestion           | Operations that are part of the data ingestion process. |
| Agent               | Indicates an issue with agent installation. |
| Data collection     | Operations related to data collections processes. |
| Solution targeting  | Operation of type *ConfigurationScope* was processed. |
| Assessment solution | An assessment process was executed. |


### Ingestion
Ingestion operations are issues that occurred during data ingestion including notification about reaching the Azure Log Analytics workspace limits. Error conditions in this category might suggest data loss, so they are important to monitor. The table below provides details on these operations. See [Azure Monitor service limits](../service-limits.md#log-analytics-workspaces) for service limits for Log Analytics workspaces.

 
#### Operation: Data collection stopped  
"Data collection stopped due to daily limit of free data reached. Ingestion status = OverQuota"

In the past 7 days, logs collection reached the daily set limit. The limit is set either as the workspace is set to "free tier", or daily collection limit was configured for this workspace.
Note, after reaching the set limit, your data collection will automatically stop for the day and will resume only during the next collection day. 
 
Recommended Actions: 
*	Check _LogOperation table for collection stopped and collection resumed events.</br>
`_LogOperation | where TimeGenerated >= ago(7d) | where Category == "Ingestion" | where Operation has "Data collection"`
*	[Create an alert](./manage-cost-storage.md#alert-when-daily-cap-is-reached) on "Data collection stopped" Operation event, this alert will allow you to get notified when the collection limit was reached.
*	Data collected after the daily collection limit is reached will be lost, use ‘workspace insights’ blade to review usage rates from each source. 
Or, you can decide to ([Manage your maximum daily data volume](./manage-cost-storage.md#manage-your-maximum-daily-data-volume) \ [change the pricing tier](./manage-cost-storage.md#changing-pricing-tier) to one that will suite your collection rates pattern). 
* Data collection rate is calculated per day, and will reset at the start of the next day, you can also monitor collection resume event by [Create an alert](./manage-cost-storage.md#alert-when-daily-cap-is-reached) on "Data collection resumed" Operation event.

#### Operation: Ingestion rate
"The data ingestion volume rate crossed the threshold in your workspace: {0:0.00} MB per one minute and data has been dropped." 

Recommended Actions:
*	Check _LogOperation table for ingestion rate event 
`_LogOperation | where TimeGenerated >= ago(7d) | where Category == "Ingestion" | where Operation has "Ingestion rate"` 
      Note: Operation table in the workspace every 6 hours while the threshold continues to be exceeded. 
*	[Create an alert](./manage-cost-storage.md#alert-when-daily-cap-is-reached) on "Data collection stopped" Operation event, this alert will allow you to get notified when the limit is reached.
*	Data collected while ingestion rate reached 100% will be dropped and lost. 

'workspace insights' blade to review your usage patterns and try to reduce them.</br>
For further information: </br>
[Azure Monitor service limits](../service-limits.md#data-ingestion-volume-rate) </br>
[Manage usage and costs for Azure Monitor Logs](./manage-cost-storage.md#alert-when-daily-cap-is-reached)  

 
#### Operation: Maximum table column count
"Data of type \<**table name**\> was dropped because number of fields \<**new fields count**\> is above the limit of \<**current field count limit**\> custom fields per data type." 

Recommended Actions: 
For custom tables, you can move to [Parsing the data](./parse-text.md) in queries.

#### Operation: Field content validation
"The following fields' values \<**field name**\> of type \<**table name**\> have been trimmed to the max allowed size, \<**field size limit**\> bytes. Please adjust your input accordingly." 

Field larger then the limit size was proccessed by Azure logs, the field was trimed to the allowed field limit. We don’t recommend sending fields larger than the allowed limit as this will resualt in data loss. 

Recommended Actions:
Check the source of the affected data type:
*	If the data is being sent through the HTTP Data Collector API, you will need to change your code\script to split the data before it’s ingested.
*	For custom logs, collected by Log Analytics agent, change the logging settings of the application\tool.
*	For any other data type, raise a support case. 
</br>Read more: [Azure Monitor service limits](../service-limits.md#data-ingestion-volume-rate) 

### Data collection
#### Operation: Azure Activity Log collection
"Access to the subscription was lost. Ensure that the \<**subscription id**\> subscription is in the \<**tenant id**\> Azure Active Directory tenant. If the subscription is transferred to another tenant, there is no impact to the services, but information for the tenant could take up to an hour to propagate. '"

Description: In some situations, like moving a subscription to a different tenant, the Azure Activity logs might stop flowing in into the workspace. In those situations, we need to reconnect the subscription following the process described in this article.

Recommended Actions: 
* If the subscription mentioned on the warning message no longer exists, navigate to the ‘Azure Activity log’ blade under ‘Workspace Data Sources’, select the relevant subscription, and finally select the ‘Disconnect’ button.
* If you no longer have access to the subscription mentioned on the warning message:
  * Follow step 1 to disconnect the subscription. 
  * To continue collecting logs from this subscription, contact the subscription owner to fix the permissions, re-enable activity log collection.
* [Create a diagnostic setting](../essentials/activity-log.md#send-to-log-analytics-workspace) to send the Activity log to a Log Analytics workspace. 

### Agent
#### Operation: Linux Agent
"Two successive configuration applications from OMS Settings failed"

Config settings on the portal have changed.

Recommended Action
This issue is raised in case there is an issue for the Agent to retrieve the new config settings. 
To mitigate this issue, you will need to reinstall the agent. 
Check _LogOperation table for agent event.</br>

 `_LogOperation | where TimeGenerated >= ago(6h) | where Category == "Agent" | where Operation == "Linux Agent"  | distinct _ResourceId`

The list will list the resource IDs where the Agent has the wrong configuration.
To mitigate the issue, you will need to reinstall the Agents listed.

   

## Alert rules
Use [log query alerts](../alerts/alerts-log-query.md) in Azure Monitor to be proactively notified when an issue is detected in your Log Analytics workspace. Use a strategy that allows you to respond in a timely manner to issues while minimizing your costs. Your subscription will be charged for each alert rule as listed in [Azure Monitor pricing](https://azure.microsoft.com/pricing/details/monitor/#platform-logs).

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
