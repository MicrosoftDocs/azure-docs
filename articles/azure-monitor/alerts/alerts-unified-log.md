---
title: Log alerts in Azure Monitor
description: Trigger emails, notifications, call websites URLs (webhooks), or automation when the log query condition you specify is met
author: yanivlavi
ms.author: yalavi
ms.topic: conceptual
ms.date: 09/22/2020
---

# Log alerts in Azure Monitor

## Overview

Log alerts are one of the alert types that are supported in [Azure Alerts](./alerts-overview.md). Log alerts allow users to use a [Log Analytics](../logs/log-analytics-tutorial.md) query to evaluate resources logs every set frequency, and fire an alert based on the results. Rules can trigger one or more actions using [Action Groups](./action-groups.md).

> [!NOTE]
> Log data from a [Log Analytics workspace](../logs/log-analytics-tutorial.md) can be sent to the Azure Monitor metrics store. Metrics alerts have [different behavior](alerts-metric-overview.md), which may be more desirable depending on the data you are working with. For information on what and how you can route logs to metrics, see [Metric Alert for Logs](alerts-metric-logs.md).

> [!NOTE]
> There are currently no additional charges for the API version `2020-05-01-preview` and resource centric log alerts.  Pricing for features that are in preview will be announced in the future and a notice provided prior to start of billing. Should you choose to continue using new API version and resource centric log alerts after the notice period, you will be billed at the applicable rate.

## Prerequisites

Log alerts run queries on Log Analytics data. First you should start [collecting log data](../essentials/resource-logs.md) and query the log data for issues. You can use the [alert query examples topic](../logs/example-queries.md) in Log Analytics to understand what you can discover or [get started on writing your own query](../logs/log-analytics-tutorial.md).

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

Time range is set in the rule condition definition. In workspaces and Application Insights, it's called **Period**. In all other resource types, it's called **Override query time range**.

Like in log analytics, the time range limits query data to the specified range. Even if **ago** command is used in the query, the time range will apply.

For example, a query scans 60 minutes, when time range is 60 minutes, even if the text contains **ago(1d)**. The time range and query time filtering need to match. In the example case, changing the **Period** / **Override query time range** to one day, would work as expected.

### Measure

Log alerts turn log into numeric values that can be evaluated. You can measure two different things:

#### Count of the results table rows

Count of results is the default measure. Ideal for working with events such as Windows event logs, syslog, application exceptions. Triggers when log records happen or doesn't happen in the evaluated time window.

Log alerts work best when you try to detect data in the log. It works less well when you try to detect lack of data in the logs. For example, alerting on virtual machine heartbeat.

For workspaces and Application Insights, it's called **Based on** with selection **Number of results**. In all other resource types, it's called **Measure** with selection **Table rows**.

> [!NOTE]
> Since logs are semi-structured data, they are inherently more latent than metric, you may experience misfires when trying to detect lack of data in the logs, and you should consider using [metric alerts](alerts-metric-overview.md). You can send data to the metric store from logs using [metric alerts for logs](alerts-metric-logs.md).

##### Example of results table rows count use case

You want to know when your application responded with error code 500 (Internal Server Error). You would create an alert rule with the following details:

- **Query:** 

```Kusto
requests
| where resultCode == "500"
```

- **Time period / Aggregation granularity:** 15 minutes
- **Alert frequency:** 15 minutes
- **Threshold value:** Greater than 0

Then alert rules monitors for any requests ending with 500 error code. The query runs every 15 minutes, over the last 15 minutes. If even one record is found, it fires the alert and triggers the actions configured.

#### Calculation of measure based on a numeric column (such as CPU counter value)

For workspaces and Application Insights, it's called **Based on** with selection **Metric measurement**. In all other resource types, it's called **Measure** with selection of any number column name.

### Aggregation type

The calculation that is done on multiple records to aggregate them to one numeric value. For example:
- **Count** returns the number of records in the query
- **Average** returns the average of the measure column [**Aggregation granularity**](#aggregation-granularity) defined.

In workspaces and Application Insights, it's supported only in **Metric measurement** measure type. The query result must contain a column called AggregatedValue that provide a numeric value after a user-defined aggregation. In all other resource types, **Aggregation type** is selected from the field of that name.

### Aggregation granularity

Determines the interval that is used to aggregate multiple records to one numeric value. For example, if you specified **5 minutes**, records would be grouped by 5-minute intervals using the **Aggregation type** specified.

In workspaces and Application Insights, it's supported only in **Metric measurement** measure type. The query result must contain [bin()](/azure/kusto/query/binfunction) that sets interval in the query results. In all other resource types, the field that controls this setting is called **Aggregation granularity**.

> [!NOTE]
> As [bin()](/azure/kusto/query/binfunction) can result in uneven time intervals, the alert service will automatically convert [bin()](/azure/kusto/query/binfunction) function to [bin_at()](/azure/kusto/query/binatfunction) function with appropriate time at runtime, to ensure results with a fixed point.

### Split by alert dimensions

Split alerts by number or string columns into separate alerts by grouping into unique combinations. When creating resource-centric alerts at scale (subscription or resource group scope), you can split by Azure resource ID column. Splitting on Azure resource ID column will change the target of the alert to the specified resource.

Splitting by Azure resource ID column is recommended when you want to monitor the same condition on multiple Azure resources. For example, monitoring all virtual machines for CPU usage over 80%. You may also decide not to split when you want a condition on multiple resources in the scope, such as monitoring that at least five machines in the resource group scope have CPU usage over 80%.

In workspaces and Application Insights, it's supported only in **Metric measurement** measure type. The field is called **Aggregate On**. It's limited to three columns. Having more than three groups by columns in the query could lead to unexpected results. In all other resource types, it's configured in **Split by dimensions** section of the condition (limited to six splits).

#### Example of splitting by alert dimensions

For example, you want to monitor errors for multiple virtual machines running your web site/app in a specific resource group. You can do that using a log alert rule as follows:

- **Query:** 

    ```Kusto
    // Reported errors
    union Event, Syslog // Event table stores Windows event records, Syslog stores Linux records
    | where EventLevelName == "Error" // EventLevelName is used in the Event (Windows) records
    or SeverityLevel== "err" // SeverityLevel is used in Syslog (Linux) records
    ```

    When using workspaces and Application Insights with **Metric measurement** alert logic, this line needs to be added to the query text:

    ```Kusto
    | summarize AggregatedValue = count() by Computer, bin(TimeGenerated, 15m)
    ```

- **Resource ID Column:** _ResourceId (Splitting by resource ID column in alert rules is only available for subscriptions and resource groups currently)
- **Dimensions / Aggregated on:**
  - Computer = VM1, VM2 (Filtering values in alert rules definition isn't available currently for workspaces and Application Insights. Filter in the query text.)
- **Time period / Aggregation granularity:** 15 minutes
- **Alert frequency:** 15 minutes
- **Threshold value:** Greater than 0

This rule monitors if any virtual machine had error events in the last 15 minutes. Each virtual machine is monitored separately and will trigger actions individually.

> [!NOTE]
> Split by alert dimensions is only available for the current scheduledQueryRules API. If you use the legacy [Log Analytics Alert API](./api-alerts.md), you will need to switch. [Learn more about switching](./alerts-log-api-switch.md). Resource centric alerting at scale is only supported in the API version `2020-05-01-preview` and above.

## Alert logic definition

Once you define the query to run and evaluation of the results, you need to define the alerting logic and when to fire actions. The following sections describe the different parameters you can use:

### Threshold and operator

The query results are transformed into a number that is compared against the threshold and operator.

### Frequency

The interval in which the query is run. Can be set from 5 minutes to one day. Must be equal to or less than the [query time range](#query-time-range) to not miss log records.

For example, if you set the time period to 30 minutes and frequency to 1 hour.  If the query is run at 00:00, it returns records between 23:30 and 00:00. The next time the query would run is 01:00 that would return records between 00:30 and 01:00. Any records created between 00:00 and 00:30 would never be evaluated.

### Number of violations to trigger alert

You can specify the alert evaluation period and the number of failures needed to trigger an alert. Allowing you to better define an impact time to trigger an alert. 

For example, if your rule [**Aggregation granularity**](#aggregation-granularity) is defined as '5 minutes', you can trigger an alert only if three failures (15 minutes) of the last hour occurred. This setting is defined by your application business policy.

## State and resolving alerts

Log alerts are stateless. Alerts fire each time the condition is met, even if fired previously. Fired alerts don't resolve. You can [mark the alert as closed](../alerts/alerts-managing-alert-states.md). You can also mute actions to prevent them from triggering for a period after an alert rule fired.

In workspaces and Application Insights, it's called **Suppress Alerts**. In all other resource types, it's called **Mute Actions**. 

See this alert evaluation example:

| Time    | Log condition evaluation | Result 
| ------- | ----------| ----------| ------- 
| 00:05 | FALSE | Alert doesn't fire. No actions called.
| 00:10 | TRUE  | Alert fires and action groups called. New alert state ACTIVE.
| 00:15 | TRUE  | Alert fires and action groups called. New alert state ACTIVE.
| 00:20 | FALSE | Alert doesn't fire. No actions called. Pervious alerts state remains ACTIVE.

## Pricing and billing of log alerts

Pricing information is located in the [Azure Monitor pricing page](https://azure.microsoft.com/pricing/details/monitor/). Log Alerts are listed under resource provider `microsoft.insights/scheduledqueryrules` with:

- Log Alerts on Application Insights shown with exact resource name along with resource group and alert properties.
- Log Alerts on Log Analytics shown with exact resource name along with resource group and alert properties; when created using [scheduledQueryRules API](/rest/api/monitor/scheduledqueryrules).
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