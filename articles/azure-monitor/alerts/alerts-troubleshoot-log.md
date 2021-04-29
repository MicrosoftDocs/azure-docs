---
title: Troubleshoot log alerts in Azure Monitor | Microsoft Docs
description: Common issues, errors, and resolutions for log alert rules in Azure.
author: yanivlavi
ms.author: yalavi
ms.topic: conceptual
ms.date: 09/22/2020

---
# Troubleshoot log alerts in Azure Monitor  

This article shows you how to resolve common issues with log alerts in Azure Monitor. It also provides solutions to common problems with the functionality and configuration of log alerts.

Log alerts allow users to use a [Log Analytics](../logs/log-analytics-tutorial.md) query to evaluate resources logs every set frequency, and fire an alert based on the results. Rules can trigger one or more actions using [Action Groups](./action-groups.md). [Learn more about functionality and terminology of log alerts](alerts-unified-log.md).

> [!NOTE]
> This article doesn't consider cases where the Azure portal shows an alert rule triggered and a notification is not performed by an associated action group. For such cases, see the details on troubleshooting [here](./alerts-troubleshoot.md#action-or-notification-on-my-alert-did-not-work-as-expected).

## Log alert didn't fire

### Data ingestion time for logs

Azure Monitor processes terabytes of customers' logs from across the world, which can cause [logs ingestion latency](../logs/data-ingestion-time.md).

Logs are semi-structured data and inherently more latent than metrics. If you're experiencing more than 4-minutes delay in fired alerts, you should consider using [metric alerts](alerts-metric-overview.md). You can send data to the metric store from logs using [metric alerts for logs](alerts-metric-logs.md).

The system retries the alert evaluation multiple times to mitigate latency. Once the data arrives, the alert fires, which in most cases don't equal the log record time.

### Incorrect query time range configured

Query time range is set in the rule condition definition. This field is called **Period** for workspaces and Application Insights, and called **Override query time range** for all other resource types. Like in log analytics, the time range limits query data to the specified period. Even if **ago** command is used in the query, the time range will apply. 

For example, a query scans 60 minutes, when time range is 60 minutes, even if the text contains **ago(1d)**. The time range and query time filtering need to match. In the example case, changing the **Period** / **Override query time range** to one day, would work as expected.

![Time period](media/alerts-troubleshoot-log/LogAlertTimePeriod.png)

### Actions are muted in the alert rule

Log alerts provide an option to mute fired alert actions for a set amount of time. This field is called **Suppress alerts** in workspaces and Application Insights. In all other resource types, it's called **Mute actions**. 

A common issue is that you think that the alert didn't fire the actions because of a service issue. Even tough it was muted by the rule configuration.

![Suppress alerts](media/alerts-troubleshoot-log/LogAlertSuppress.png)

### Metric measurement alert rule with splitting using the legacy Log Analytics API

[Metric measurement](alerts-unified-log.md#calculation-of-measure-based-on-a-numeric-column-such-as-cpu-counter-value) is a type of log alert that is based on summarized time series results. These rules allow grouping by columns to [split alerts](alerts-unified-log.md#split-by-alert-dimensions). If you're using the legacy Log Analytics API, splitting won't work as expected. Choosing the grouping in the legacy API isn't supported.

The current ScheduledQueryRules API allows you to set **Aggregate On** in [Metric measurement](alerts-unified-log.md#calculation-of-measure-based-on-a-numeric-column-such-as-cpu-counter-value) rules, which will work as expected. [Learn more about switching to the current ScheduledQueryRules API](../alerts/alerts-log-api-switch.md).

## Log alert fired unnecessarily

A configured [log alert rule in Azure Monitor](./alerts-log.md) might be triggered unexpectedly. The following sections describe some common reasons.

### Alert triggered by partial data

Azure Monitor processes terabytes of customers' logs from across the world, which can cause [logs ingestion latency](../logs/data-ingestion-time.md).

Logs are semi-structured data and inherently more latent than metrics. If you're experiencing many misfires in fired alerts, you should consider using [metric alerts](alerts-metric-overview.md). You can send data to the metric store from logs using [metric alerts for logs](alerts-metric-logs.md).

Log alerts work best when you try to detect data in the logs. It works less well when you try to detect lack of data in the logs. For example, alerting on virtual machine heartbeat. 

While there are builtin capabilities to prevent false alerts, they can still occur on very latent data (over ~30 minutes) and data with latency spikes.

### Query optimization issues

The alerting service changes your query to optimize for lower load and alert latency. The alert flow was built to transform the results that indicate the issue to an alert. For example, in a case of a query like:

``` Kusto
SecurityEvent
| where EventID == 4624
```

If the intent of the user is to alert, when this event type happens, the alerting logic appends `count` to the query. The query that will run will be:

``` Kusto
SecurityEvent
| where EventID == 4624
| count
```

There's no need to add alerting logic to the query and doing that may even cause issues. In the above example, if you include `count` in your query, it will always result in the value 1, since the alert service will do `count` of `count`.

The optimized query is what the log alert service runs. You can run the modified query in Log Analytics [portal](../logs/log-query-overview.md) or [API](/rest/api/loganalytics/).

For workspaces and Application Insights, it's called **Query to be executed** in the condition pane. In all other resource types, select **See final alert Query** in the condition tab.

![Query to be executed](media/alerts-troubleshoot-log/LogAlertPreview.png)

## Log alert was disabled

The following sections list some reasons why Azure Monitor might disable a log alert rule. We also included an [example of the activity log that is sent when a rule is disabled](#activity-log-example-when-rule-is-disabled).

### Alert scope no longer exists or was moved

When the scope resources of an alert rule are no longer valid, execution of the rule fails. In this case, billing stops as well.

Azure Monitor will disable the log alert after a week if it fails continuously.

### Query used in a log alert isn't valid

When a log alert rule is created, the query is validated for correct syntax. But sometimes, the query provided in the log alert rule can start to fail. Some common reasons are:

- Rules were created via the API and validation was skipped by the user.
- The query [runs on multiple resources](../logs/cross-workspace-query.md) and one or more of the resources was deleted or moved.
- The [query fails](https://dev.loganalytics.io/documentation/Using-the-API/Errors) because:
    - The logging solution wasn't [deployed to the workspace](../insights/solutions.md#install-a-monitoring-solution), so tables aren't created.
    - Data stopped flowing to a table in the query for over 30 days.
    - [Custom logs tables](../agents/data-sources-custom-logs.md) aren't yet created, since data flow hasn't started.
- Changes in [query language](/azure/kusto/query/) include a revised format for commands and functions. So the query provided earlier is no longer valid.

[Azure Advisor](../../advisor/advisor-overview.md) warns you about this behavior. It adds a recommendation about the log alert rule affected. The category used is 'High Availability' with medium impact and a description of 'Repair your log alert rule to ensure monitoring'.

## Alert rule quota was reached

The number of log search alert rules per subscription and resource are subject to the quota limits described [here](../service-limits.md).

### Recommended Steps
    
If you've reached the quota limit, the following steps may help resolve the issue.

1. Try deleting or disabling log search alert rules that aren’t used anymore.
1. Try to use [splitting of alerts by dimensions](alerts-unified-log.md#split-by-alert-dimensions) to reduce rules count. These rules can monitor many resources and detection cases.
1. If you need the quota limit to be increased, continue to open a support request, and provide the following information:

    - Subscription IDs and Resource IDs for which the quota limit needs to be increased.
    - Reason for quota increase.
    - Resource type for the quota increase: **Log Analytics**, **Application Insights**, and so on.
    - Requested quota limit.


### To check the current usage of new log alert rules
	
#### From the Azure portal

1. Open the *Alerts* screen, and select *Manage alert rules*
2. Filter to the relevant subscription using the *Subscription* dropdown control
3. Make sure NOT to filter to a specific resource group, resource type, or resource
4. In the *Signal type* dropdown control, select 'Log Search'
5. Verify that the *Status* dropdown control is set to ‘Enabled’
6. The total number of log search alert rules will be displayed above the rules list

#### From API

- PowerShell - [Get-AzScheduledQueryRule](/powershell/module/az.monitor/get-azscheduledqueryrule)
- REST API - [List by subscription](/rest/api/monitor/scheduledqueryrules/listbysubscription)

## Activity log example when rule is disabled

If query fails for seven days continuously, Azure Monitor will disable the log alert and stop billing of the rule. You can find out the exact time when Azure Monitor disabled the log alert in the [Azure Activity Log](../../azure-resource-manager/management/view-activity-logs.md). See this example:

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

## Next steps

- Learn about [log alerts in Azure](./alerts-unified-log.md).
- Learn more about [configuring log alerts](../logs/log-query-overview.md).
- Learn more about [log queries](../logs/log-query-overview.md).