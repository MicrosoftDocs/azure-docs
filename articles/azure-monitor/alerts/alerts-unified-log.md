---
title: Log alerts in Azure Monitor
description: Trigger emails, notifications, call websites URLs (webhooks), or automation when the log query condition you specify is met
author: yanivlavi
ms.author: yalavi
ms.topic: conceptual
ms.date: 2/23/2022
---

# Log alerts in Azure Monitor

## Overview

Log alerts are one of the alert types that are supported in [Azure Alerts](./alerts-overview.md). Log alerts allow users to use a [Log Analytics](../logs/log-analytics-tutorial.md) query to evaluate resources logs every set frequency, and fire an alert based on the results. Rules can trigger one or more actions using [Action Groups](./action-groups.md).

> [!NOTE]
> Log data from a [Log Analytics workspace](../logs/log-analytics-tutorial.md) can be sent to the Azure Monitor metrics store. Metrics alerts have [different behavior](alerts-metric-overview.md), which may be more desirable depending on the data you are working with. For information on what and how you can route logs to metrics, see [Metric Alert for Logs](alerts-metric-logs.md).

## Prerequisites

Log alerts run queries on Log Analytics data. First you should start [collecting log data](../essentials/resource-logs.md) and query the log data for issues. You can use the [alert query examples topic](../logs/queries.md) in Log Analytics to understand what you can discover or [get started on writing your own query](../logs/log-analytics-tutorial.md).

[Azure Monitoring Contributor](../roles-permissions-security.md) is a common role that is needed for creating, modifying, and updating log alerts. Access & query execution rights for the resource logs are also needed. Partial access to resource logs can fail queries or return partial results. [Learn more about configuring log alerts in Azure](./alerts-log.md).

> [!NOTE]
> Log alerts for Log Analytics used to be managed using the legacy [Log Analytics Alert API](./api-alerts.md). [Learn more about switching to the current ScheduledQueryRules API](../alerts/alerts-log-api-switch.md).

## Query evaluation definition

Log search rules condition definition starts from:

- What query to run?
- How to use the results?

The following sections describe the different parameters you can use to set the above logic.

### Log query
The [Log Analytics](../logs/log-analytics-tutorial.md) query used to evaluate the rule. The results returned by this query are used to determine whether an alert is to be triggered. The query can be scoped to:

- A specific resource, such as a virtual machine.
- An at scale resource, such as a subscription or resource group.
- Multiple resources using [cross-resource query](../logs/cross-workspace-query.md#querying-across-log-analytics-workspaces-and-from-application-insights). 
 
> [!IMPORTANT]
> Alert queries have constraints to ensure optimal performance and the relevance of the results. [Learn more here](./alerts-log-query.md).

> [!IMPORTANT]
> Resource centric and [cross-resource query](../logs/cross-workspace-query.md#querying-across-log-analytics-workspaces-and-from-application-insights) are only supported using the current scheduledQueryRules API. If you use the legacy [Log Analytics Alert API](./api-alerts.md), you will need to switch. [Learn more about switching](./alerts-log-api-switch.md)

#### Query time Range

Time range is set in the rule condition definition. It's called **Override query time range** in the advance settings section.

Unlike log analytics, the time range in alerts is limited to a maximum of two days of data. Even if longer range **ago** command is used in the query, the time range will apply. For example, a query scans up to 2 days, even if the text contains **ago(7d)**.

If you use **ago** command in the query, the range is automatically set to two days. You can also change time range manually in cases the query requires more data than the alert evaluation even if there is no **ago** command in the query.

### Measure

Log alerts turn log into numeric values that can be evaluated. You can measure two different things:
* Result count
* Calculation of a value

#### Result count

Count of results is the default measure and is used when you set a **Measure** with a selection of **Table rows**. Ideal for working with events such as Windows event logs, syslog, application exceptions. Triggers when log records happen or doesn't happen in the evaluated time window.

Log alerts work best when you try to detect data in the log. It works less well when you try to detect lack of data in the logs. For example, alerting on virtual machine heartbeat.

> [!NOTE]
> Since logs are semi-structured data, they are inherently more latent than metric, you may experience misfires when trying to detect lack of data in the logs, and you should consider using [metric alerts](alerts-metric-overview.md). You can send data to the metric store from logs using [metric alerts for logs](alerts-metric-logs.md).

##### Example of result count use case

You want to know when your application responded with error code 500 (Internal Server Error). You would create an alert rule with the following details:

- **Query:** 

```Kusto
requests
| where resultCode == "500"
```

- **Aggregation granularity:** 15 minutes
- **Alert frequency:** 15 minutes
- **Threshold value:** Greater than 0

Then alert rules monitors for any requests ending with 500 error code. The query runs every 15 minutes, over the last 15 minutes. If even one record is found, it fires the alert and triggers the actions configured.

### Calculation of a value

Calculation of a value is used when you select a column name of a numeric column for the **Measure**, and the result is a calculation that you perform on the values in that column. This would be used, for example, as CPU counter value.
### Aggregation type

The calculation that is done on multiple records to aggregate them to one numeric value using the [**Aggregation granularity**](#aggregation-granularity) defined. For example:
- **Sum** returns the sum of measure column.
- **Average** returns the average of the measure column.

### Aggregation granularity

Determines the interval that is used to aggregate multiple records to one numeric value. For example, if you specified **5 minutes**, records would be grouped by 5-minute intervals using the **Aggregation type** specified.

> [!NOTE]
> As [bin()](/azure/kusto/query/binfunction) can result in uneven time intervals, the alert service will automatically convert [bin()](/azure/kusto/query/binfunction) function to [bin_at()](/azure/kusto/query/binatfunction) function with appropriate time at runtime, to ensure results with a fixed point.

### Split by alert dimensions

Split alerts by number or string columns into separate alerts by grouping into unique combinations. It's configured in **Split by dimensions** section of the condition (limited to six splits). When creating resource-centric alerts at scale (subscription or resource group scope), you can split by Azure resource ID column. Splitting on Azure resource ID column will change the target of the alert to the specified resource.

Splitting by Azure resource ID column is recommended when you want to monitor the same condition on multiple Azure resources. For example, monitoring all virtual machines for CPU usage over 80%. You may also decide not to split when you want a condition on multiple resources in the scope. Such as monitoring that at least five machines in the resource group scope have CPU usage over 80%.
#### Example of splitting by alert dimensions

For example, you want to monitor errors for multiple virtual machines running your web site/app in a specific resource group. You can do that using a log alert rule as follows:

- **Query:** 

    ```Kusto
    // Reported errors
    union Event, Syslog // Event table stores Windows event records, Syslog stores Linux records
    | where EventLevelName == "Error" // EventLevelName is used in the Event (Windows) records
    or SeverityLevel== "err" // SeverityLevel is used in Syslog (Linux) records
    ```

- **Resource ID Column:** _ResourceId
- **Dimensions:**
  - Computer = VM1, VM2 (Filtering values in alert rules definition isn't available currently for workspaces and Application Insights. Filter in the query text.)
- **Aggregation granularity:** 15 minutes
- **Alert frequency:** 15 minutes
- **Threshold value:** Greater than 0

This rule monitors if any virtual machine had error events in the last 15 minutes. Each virtual machine is monitored separately and will trigger actions individually.

> [!NOTE]
> Split by alert dimensions is only available for the current scheduledQueryRules API. If you use the legacy [Log Analytics Alert API](./api-alerts.md), you will need to switch. [Learn more about switching](./alerts-log-api-switch.md). Resource centric alerting at scale is only supported in the API version `2021-08-01` and above.

## Alert logic definition

Once you define the query to run and evaluation of the results, you need to define the alerting logic and when to fire actions. The following sections describe the different parameters you can use:

### Threshold and operator

The query results are transformed into a number that is compared against the threshold and operator.

### Frequency

The interval in which the query is run. Can be set from a minute to a day.

### Number of violations to trigger alert

You can specify the alert evaluation period and the number of failures needed to trigger an alert. Allowing you to better define an impact time to trigger an alert. 

For example, if your rule [**Aggregation granularity**](#aggregation-granularity) is defined as '5 minutes', you can trigger an alert only if three failures (15 minutes) of the last hour occurred. This setting is defined by your application business policy.

## State and resolving alerts

Log alerts can either be stateless or stateful (currently in preview).

Stateless alerts fire each time the condition is met, even if fired previously. You can [mark the alert as closed](../alerts/alerts-managing-alert-states.md) once the alert instance is resolved. You can also mute actions to prevent them from triggering for a period after an alert rule fired using the **Mute Actions** option in the alert details section.

See this alert stateless evaluation example:

| Time    | Log condition evaluation | Result 
| ------- | ----------| ----------| ------- 
| 00:05 | FALSE | Alert doesn't fire. No actions called.
| 00:10 | TRUE  | Alert fires and action groups called. New alert state ACTIVE.
| 00:15 | TRUE  | Alert fires and action groups called. New alert state ACTIVE.
| 00:20 | FALSE | Alert doesn't fire. No actions called. Pervious alerts state remains ACTIVE.

Stateful alerts fire once per incident and resolve. The alert rule resolves when the alert condition isn't met for 30 minutes for a specific evaluation period (to account for [log ingestion delay](../alerts/alerts-troubleshoot-log.md#data-ingestion-time-for-logs)), and for three consecutive evaluations to reduce noise if there is flapping conditions. For example, with a frequency of 5 minutes, the alert resolve after 40 minutes or with a frequency of 1 minute, the alert resolve after 32 minutes. The resolved notification is sent out via web-hooks or email, the status of the alert instance (called monitor state) in Azure portal is also set to resolved.

Stateful alerts feature is currently in preview. You can set this using **Automatically resolve alerts** in the alert details section.

## Location selection in log alerts

Log alerts allow you to set a location for alert rules. You can select any of the supported locations, which align to [Log Analytics supported region list](https://azure.microsoft.com/global-infrastructure/services/?products=monitor).

Location affects which region the alert rule is evaluated in. Queries are executed on the log data in the selected region, that said, the alert service end to end is global. Meaning alert rule definition, fired alerts, notifications, and actions aren't bound to the location in the alert rule. Data is transfer from the set region since the Azure Monitor alerts service is a [non-regional service](https://azure.microsoft.com/global-infrastructure/services/?products=monitor&regions=non-regional).

## Pricing model

Each Log Alert rule is billed based the interval at which the log query is evaluated (more frequent query evaluation results in a higher cost).  Additionally, for Log Alerts configured for [at scale monitoring](#split-by-alert-dimensions), the cost will also depend on the number of time series created by the dimensions resulting from your query.

Prices for Log Alert rules are available on the [Azure Monitor pricing page](https://azure.microsoft.com/pricing/details/monitor/). 

### Calculating the price for a Log Alert rule without dimensions 

The price of an alert rule which queries 1 resource event every 15-minutes can be calculated as: 

Total monthly price = 1 resource * 1 log alert rule * price per 15-minute internal log alert rule per month.

### Calculating the price for a Log Alert rule with dimensions 

The price of an alert rule which monitors 10 VM resources at 1-minute frequency, using resource centric log monitoring, can be calculated as Price of alert rule + Price of number of dimensions. For example:

Total monthly price = price per 1-minute log alert rule per month + ( 10 time series - 1 included free time series ) * price per 1-min interval monitored per month.

Pricing of at scale log monitoring is applicable from Scheduled Query Rules API version 2021-02-01.

## View log alerts usage on your Azure bill

Log Alerts are listed under resource provider `microsoft.insights/scheduledqueryrules` with:

- Log Alerts on Application Insights shown with exact resource name along with resource group and alert properties.
- Log Alerts on Log Analytics shown with exact resource name along with resource group and alert properties; when created using [scheduledQueryRules API](/rest/api/monitor/scheduledqueryrule-2021-08-01/scheduled-query-rules).
- Log alerts created from [legacy Log Analytics API](./api-alerts.md) aren't tracked [Azure Resources](../../azure-resource-manager/management/overview.md) and don't have enforced unique resource names. These alerts are still created on `microsoft.insights/scheduledqueryrules` as hidden resources, which have this resource naming structure `<WorkspaceName>|<savedSearchId>|<scheduleId>|<ActionId>`. Log Alerts on legacy API are shown with above hidden resource name along with resource group and alert properties.

> [!NOTE]
> Unsupported resource characters such as `<, >, %, &, \, ?, /` are replaced with `_` in the hidden resource names and this will also reflect in the billing information.

> [!NOTE]
> Log alerts for Log Analytics used to be managed using the legacy [Log Analytics Alert API](./api-alerts.md) and legacy templates of [Log Analytics saved searches and alerts](../insights/solutions.md). [Learn more about switching to the current ScheduledQueryRules API](../alerts/alerts-log-api-switch.md). Any alert rule management should be done using [legacy Log Analytics API](./api-alerts.md) until you decide to switch and you can't use the hidden resources.

## Next steps

* Learn about [creating in log alerts in Azure](./alerts-log.md).
* Understand [webhooks in log alerts in Azure](../alerts/alerts-log-webhook.md).
* Learn about [Azure Alerts](./alerts-overview.md).
* Learn more about [Log Analytics](../logs/log-query-overview.md).
