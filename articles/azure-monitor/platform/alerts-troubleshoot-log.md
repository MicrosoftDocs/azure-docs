---
title: Troubleshoot log alerts in Azure Monitor | Microsoft Docs
description: Common issues, errors, and resolutions for log alert rules in Azure.
author: yanivlavi
ms.author: yalavi
ms.topic: conceptual
ms.subservice: alerts
ms.date: 10/29/2018

---
# Troubleshoot log alerts in Azure Monitor  

This article shows you how to resolve common issues with log alerts in Azure Monitor. It also provides solutions to common problems with the functionality and configuration of log alerts.

The term **Log Alert** describes alerts where a log query is evaluated on resources logs every set frequency, and an alert fired if the criteria is met. Learn more about functionality, terminology, and types from [Log alerts - Overview](alerts-unified-log.md).

> [!NOTE]
> This article doesn't consider cases where the Azure portal shows an alert rule triggered and a notification is not performed by an associated action group. For such cases, see the details on troubleshooting [here](./alerts-troubleshoot.md#action-or-notification-on-my-alert-did-not-work-as-expected).

## Log alert didn't fire

### Data ingestion time for logs

Azure Monitor processes many terabytes of data from thousands of customers from varied sources across the world, this can cause [logs ingestion latency](./data-ingestion-time.md). 

Since logs are semi-structured data they are inherently more latent than metric, if you are experiencing more than 4 minutes delay in fired alerts, you should consider using [metric alerts](alerts-metric-overview.md). You can send data to the metric store from logs using [metric alerts for logs](alerts-metric-logs.md).

To mitigate log data delays, the system waits and retries the alert query multiple times. The log alert is triggered only after the data is available, which might not be the log record time.

### Incorrect query time range configured

You specific the query time range in the rule condition definition. This field is called **Period** for workspaces and Application Insights, and called **Override query time range** for all other resource types. Like in log analytics time range limits query data to the specified range.

Even if **ago** command is used in the query, the time range will apply. For example, If the time range is set to 60 minutes and the query contains **ago(1d)**, the query will still only scan 60 minutes, because of the time period definition. The query time range and query text need to match, so you should change the **Period** / **Override query time range** to one day, if that is what the query requires.

![Time period](media/alert-log-troubleshoot/LogAlertTimePeriod.png)

### Suppress Alerts option is set

Log alerts provide an option to mute fired alert actions for a set amount of time. This field is called **Suppress alerts** for workspaces and Application Insights, and called **Mute actions** for all other resource types. As a result, you might think that an alert didn't fire the actions, because of a service issue, but was actually muted by the rule configuration.

![Suppress alerts](media/alert-log-troubleshoot/LogAlertSuppress.png)

### Metric measurement alert rule with grouping using legacy Log Analytics API

*Metric measurement log alerts* are a type of log alerts that are based on summarized time series results. In cases where you wanted to split alerts by dimensions you can use grouping by columns to achieve this. If you are using the legacy Log Analytics API, this will not work as expected as you can't choose the grouping. The current ScheduledQueryRules API allows you to set **Aggregate On**, which will work as expected. [Learn more about switching to the current ScheduledQueryRules API](alerts-log-api-switch.md).

## Log alert fired unnecessarily

A configured [log alert rule in Azure Monitor](./alerts-log.md) might be triggered unexpectedly when you view it in [Azure Alerts](./alerts-managing-alert-states.md). The following sections describe some common reasons.

### Alert triggered by partial data

Azure Monitor processes many terabytes of data from thousands of customers from varied sources across the world, this can cause [logs ingestion latency](./data-ingestion-time.md). 

Since logs are semi-structured data, they are inherently more latent than metric, if you are experiencing many misfires in fired alerts, you should consider using [metric alerts](alerts-metric-overview.md). You can send data to the metric store from logs using [metric alerts for logs](alerts-metric-logs.md).

While there are builtin capabilities to prevent false alerts, they can still occur on latent data in the following cases:

- Log alerts works best when trying to detect data in the log, and less well when trying to detect lack of data in the logs (for example, on virtual machine heartbeat).
- Partial data can cause false alerts due to latency changes, if only some the data arrived.

### Query optimization issues

Since the alert service runs your query frequently, it makes changes to the query to optimize for lower load and alert latency. You can review these changes in the **Query to be executed** in the condition tab for workspaces and Application Insights, and **See final alert Query** for all other resource types.

The optimized query is what the log alert service runs. If you want to understand what the alert query output might be before you create the alert, you can run the stated query via the [Analytics portal](../log-query/log-query-overview.md) or the [Analytics API](/rest/api/loganalytics/).

![Query to be executed](media/alert-log-troubleshoot/LogAlertPreview.png)

## Log alert was disabled

The following sections list some reasons why Azure Monitor might disable the [log alert rule](./alerts-log.md).

### Resource where the alert was created no longer exists or was moved

Log alert rules created in Azure Monitor target a specific resource like an Azure Log Analytics workspace, an Azure Application Insights app, and an Azure resource. When the target of the alert rule is no longer valid, execution of the rule fails. In this case, billing stops as well.

Azure Monitor will disable the log alert after a week and post an event to [Azure Activity Log](../../azure-resource-manager/management/view-activity-logs.md). You can find out the exact time when Azure Monitor disabled the log alert in the activity log. See this example:

```json
{
    "caller": "Microsoft.Insights/ScheduledQueryRules",
    "channels": "Operation",
    "claims": {
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/spn": "Microsoft.Insights/ScheduledQueryRules"
    },
    "correlationId": "abcdefg-4d12-1234-4256-21233554aff",
    "description": "Alert: test-bad-alerts is disabled by the System due to : Alert has been failing consistently with the same exception for the past week",
    "eventDataId": "f123e07-bf45-1234-4565-123a123455b",
    "eventName": {
        "value": "",
        "localizedValue": ""
    },
    "category": {
        "value": "Administrative",
        "localizedValue": "Administrative"
    },
    "eventTimestamp": "2019-03-22T04:18:22.8569543Z",
    "id": "/SUBSCRIPTIONS/<subscriptionId>/RESOURCEGROUPS/<ResourceGroup>/PROVIDERS/MICROSOFT.INSIGHTS/SCHEDULEDQUERYRULES/TEST-BAD-ALERTS",
    "level": "Informational",
    "operationId": "",
    "operationName": {
        "value": "Microsoft.Insights/ScheduledQueryRules/disable/action",
        "localizedValue": "Microsoft.Insights/ScheduledQueryRules/disable/action"
    },
    "resourceGroupName": "<Resource Group>",
    "resourceProviderName": {
        "value": "MICROSOFT.INSIGHTS",
        "localizedValue": "Microsoft Insights"
    },
    "resourceType": {
        "value": "MICROSOFT.INSIGHTS/scheduledqueryrules",
        "localizedValue": "MICROSOFT.INSIGHTS/scheduledqueryrules"
    },
    "resourceId": "/SUBSCRIPTIONS/<subscriptionId>/RESOURCEGROUPS/<ResourceGroup>/PROVIDERS/MICROSOFT.INSIGHTS/SCHEDULEDQUERYRULES/TEST-BAD-ALERTS",
    "status": {
        "value": "Succeeded",
        "localizedValue": "Succeeded"
    },
    "subStatus": {
        "value": "",
        "localizedValue": ""
    },
    "submissionTimestamp": "2019-03-22T04:18:22.8569543Z",
    "subscriptionId": "<SubscriptionId>",
    "properties": {
        "resourceId": "/SUBSCRIPTIONS/<subscriptionId>/RESOURCEGROUPS/<ResourceGroup>/PROVIDERS/MICROSOFT.INSIGHTS/SCHEDULEDQUERYRULES/TEST-BAD-ALERTS",
        "subscriptionId": "<SubscriptionId>",
        "resourceGroup": "<ResourceGroup>",
        "eventDataId": "12e12345-12dd-1234-8e3e-12345b7a1234",
        "eventTimeStamp": "03/22/2019 04:18:22",
        "issueStartTime": "03/22/2019 04:18:22",
        "operationName": "Microsoft.Insights/ScheduledQueryRules/disable/action",
        "status": "Succeeded",
        "reason": "Alert has been failing consistently with the same exception for the past week"
    },
    "relatedEvents": []
}
```

### Query used in a log alert is not valid

When a log alert rule is created the query is validated for correct syntax. But sometimes, the query provided in the log alert rule can start to fail. Some common reasons are:

- Rules was created via the API and validation was skipped by the user.
- The query is written to [run across multiple resources](../log-query/cross-workspace-query.md) and one or more of the specified resources no longer exist or was moved.
- The [query execution gives an error](https://dev.loganalytics.io/documentation/Using-the-API/Errors) because solution was not deployed to the workspace or data stopped flowing in the tables of the query. This can also happen with custom logs that has not started flowing.
- Changes in [query language](/azure/kusto/query/) include a revised format for commands and functions. So the query provided earlier in an alert rule is no longer valid.

[Azure Advisor](../../advisor/advisor-overview.md) can warns you about this behavior. A recommendation is added for the specific log alert rule on Azure Advisor, under the category of 'High Availability' with medium impact and a description of "Repair your log alert rule to ensure monitoring".

> [!NOTE]
> If query fails for seven days, Azure Monitor will disable the log alert and stop billing of the rule. You can find out the exact time when Azure Monitor disabled the log alert in the [Azure Activity Log](../../azure-resource-manager/management/view-activity-logs.md).

## Alert rule quota was reached

The number of log search alert rules per subscription and resource are subject to the quota limits described [here](../service-limits.md).

### Recommended Steps
    
If you have reached the quota limit, the following steps may help resolve the issue.

1. Try deleting or disabling log search alert rules that aren’t used anymore.
1. Try to use splitting of alerts by dimensions to use one rule for many resources, detection cases.
1. If you need the quota limit to be increased, please proceed to open a support request, and provide the following information:

    - Subscription Id(s) for which the quota limit need to be increased
    - Reason for quota increase
    - Resource type for the quota increase: **Log Analytics**, **Application Insights**, etc.
    - Requested quota limit


### To check the current usage of new log alert rules
	
#### From the Azure portal

1. Open the *Alerts* screen, and click *Manage alert rules*
2. Filter to the relevant subscription using the *Subscription* dropdown control
3. Make sure NOT to filter to a specific resource group, resource type or resource
4. In the *Signal type* dropdown control, select 'Log Search'
5. Verify that the *Status* dropdown control is set to ‘Enabled’
6. The total number of log search alert rules will be displayed above the rules list

#### From API

- PowerShell - [Get-AzScheduledQueryRule](/powershell/module/az.monitor/get-azscheduledqueryrule?view=azps-3.7.0)
- REST API - [List by subscription](/rest/api/monitor/scheduledqueryrules/listbysubscription)

## Next steps

- Learn about [log alerts in Azure](./alerts-unified-log.md).
- Learn more about [configuring log alerts](../log-query/log-query-overview.md).
- Learn more about [log queries](../log-query/log-query-overview.md).
