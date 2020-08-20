---
title: Log alerts in Azure Monitor
description: Trigger emails, notifications, call websites URLs (webhooks), or automation when the log query condition you specify is met
author: yanivlavi
ms.author: yalavi
ms.topic: conceptual
ms.date: 5/31/2019
ms.subservice: alerts
---

# Log alerts in Azure Monitor

> [!NOTE]
> Popular log data from [Azure Monitor Logs](../log-query/get-started-portal.md) is now also available on the metric platform in Azure Monitor. For details review [Metric Alert for Logs](./alerts-metric-logs.md)

## Condition parameters definition

Log alerts are one of the alert types that are supported in [Azure Alerts](./alerts-overview.md). Log alerts allow users to use a [Log Analytics](../log-query/get-started-portal.md) query to evaluated resources logs every set frequency, and an alert fired if the criteria is met. Rules can trigger run one or more actions using [Action Groups](./action-groups.md). 

[Azure Monitoring Contributor](./roles-permissions-security.md) is a common role needed for creating, modifying, and updating log alerts; along with access & query execution rights for the rule scope logs. In the case the user creating the rule doesn't have full access to all of the scope logs, the query may fail or execute with partial results. [Learn more about configuring log alerts in Azure](./alerts-log.md).

Log search rules are defined by the following details:

### Log Query
The [Log Analytics](../log-query/get-started-portal.md) query used to evaluate the rule. The results returned by this query are used to determine whether an alert is to be triggered. The query scoped to a specific resource, such as a virtual machine, an at scale resource, such as a subscription and resource group, or multiple resources using [cross-resource query](../log-query/cross-workspace-query.md#querying-across-log-analytics-workspaces-and-from-application-insights). 
 
> [!IMPORTANT]
> Some queries are not allowed in log alerts. Learn more [here](./alerts-log-query.md#unsupported-queries).

> [!IMPORTANT]
> Resource centric and [cross-resource query](../log-query/cross-workspace-query.md#querying-across-log-analytics-workspaces-and-from-application-insights) are only supported using the current scheduledQueryRules API. If you use the legacy [Log Analytics Alert API](api-alerts.md), you will need to switch. [Learn more about switching](./alerts-log-api-switch.md)

### Measure

Log alerts turn log into metric values that can be evaluated. You can measure two different things:

#### Count of the results table rows
This is the default measure. This field is called **Based on** with selection **[Number of results](#number-of-results-alert-rules)** for workspaces and Application Insights, and called **Measure** with selection **Table rows** for all other resource types.

Ideal for working with events such as Windows event logs, syslog, application exceptions. Triggers when log records happen or doesn't happen in the evaluated time window. Log alerts works best when trying to detect data in the log, and less well when trying to detect lack of data in the logs (for example, on virtual machine heartbeat).

> [!NOTE]
> Since logs are semi-structured data, they are inherently more latent than metric, you may experience misfires when trying to detect lack of data in the logs, and you should consider using [metric alerts](alerts-metric-overview.md). You can send data to the metric store from logs using [metric alerts for logs](alerts-metric-logs.md).

##### Example of results table rows count use case

You want to know when your application responded with error code 500 (Internal Server Error). You would create an alert rule with the following details:

- **Query:** 

```Kusto
requests
| where resultCode == "500"
```

- **Time period:** 15 minutes
- **Alert frequency:** 15 minutes
- **Threshold value:** Greater than 0

Then alert would run the query every 15 minutes, with 15 minutes of data, looking records where result code was 500. If even one such record is found, it fires the alert and triggers the actions configured.

#### Calculation of measure based on a number column (such as CPU counter value)

This field is called **Based on** with selection **Metric measurement** for workspaces and Application Insights, and called **Measure** with selection of any number column name for all other resource types.

### Aggregation type

Determines the calculation that is performed on multiple records to aggregate them to one numeric value. For example, **Count** returns the number of records in the query, **Average** returns the average of the measure column (**Aggregation granularity**)[#aggregation-granularity] defined.

In workspaces and Application Insights this is supported only in **Metric measurement** measure type. The query result must contain a column called AggregatedValue that provide a numeric value after user defined aggregation. In all other resource types, **Aggregation type** is selected from the field of that name.

### Aggregation granularity

Determines the interval that is used to aggregate multiple records to one numeric value. For example, if you specified **5 minutes**, records would be grouped by 5-minute intervals using the **Aggregation type** specified.

In workspaces and Application Insights this is supported only in **Metric measurement** measure type. The query result must contain [bin()](/azure/kusto/query/binfunction) that sets interval in the query results. In all other resource types, **Aggregation granularity** is selected from the field of that name.

> [!NOTE]
> As [bin()](/azure/kusto/query/binfunction) can result in uneven time intervals, the alert service will automatically convert bin command to bin_at command with appropriate time at runtime, to ensure results with a fixed point.

### Split by alert dimensions

Split alerts by number or string columns into separate alerts by grouping into unique combinations. When performing resource centric alerting at scale (subscription or resource group scope), you can also split by Azure resource ID column which will change target of the alert to the specified resource.

In workspaces and Application Insights this is supported only in **Metric measurement** measure type and the field is called **Aggregate On**. It is limited to three columns (having more than three group by columns in results could lead to unexpected results). In all other resource types, this is configured in **Split by dimensions** section of the condition and it is limited to six columns.

#### Example of splitting by alert dimensions

For example, you want to monitor error code 500 (Internal Server Error) for multiple virtual machines running your web site/app in a specific resource group. You can do that using a log alert rule as follows:

- **Query:** 

```Kusto
// Reported errors 
union Event, Syslog // Event table stores Windows event records, Syslog stores Linux records
| where EventLevelName == "Error" // EventLevelName is used in the Event (Windows) records
or SeverityLevel== "err" // SeverityLevel is used in Syslog (Linux) records
```

- **Resource ID Column:** _ResourceId (Splitting by resource ID column in alert rules is not available currently for workspaces and Application Insights)
- **Dimensions / Aggregated on:**
  - Computer = VM1, VM2 (filtering values in alert rules is not available currently for workspaces and Application Insights)
- **Time period:** 15 minutes
- **Alert frequency:** 15 minutes
- **Threshold value:** Greater than 0

This rule monitors if the event errors happened in the last 15 minutes in the virtual machines. Each instance will get monitored individually and you will trigger actions individually.

> [!NOTE]
> Split by alert dimensions is only available for the current scheduledQueryRules API. If you use the legacy [Log Analytics Alert API](api-alerts.md), you will need to switch. [Learn more about switching](./alerts-log-api-switch.md). Resource centric alerting at scale at scale is only supported in the API version `2020-05-01-preview` and above.

### Threshold and operator

The query results are transformed into a number that is compared against the threshold and operator.

### Frequency

The interval in which the query is run. Can be set from 5 minutes to 1 day. Must be equal to or less than the time period to not miss data records. For example, if you set the time period to 30 minutes and frequency to 1 hour.  If the query is run at 00:00, it returns records between 23:30 and 00:00. The next time the query would run is 01:00 which would return records between 00:30 and 01:00. Any records created between 00:00 and 00:30 would never be evaluated.

### Time Range

You specific the query time range in the rule condition definition. This field is called **Period** for workspaces and Application Insights, and called **Override query time range** for all other resource types. Like in log analytics time range limits query data to the specified range. Even if **ago** command is used in the query, the time range will apply. 

For example, If the time range is set to 60 minutes and the query contains **ago(1d)**, the query will still only scan 60 minutes, because of the time period definition. The query time range and query text need to match, so you should change the **Period** / **Override query time range** to one day, if that is what the query requires.

### Number of violations to trigger alert

You can specify the alert evaluation period and the amount of failures needed to trigger an alert. This can help you better define an impact time to trigger an alert. 

For example, if your rule (**Aggregation granularity**)[#aggregation-granularity] is defined as '5 minutes', you can decide to only trigger an alert if 3 failures (15 minutes) of the last hour is breaching, since this is you application defined business policy.

## Log search alert rule - state and resolving alerts

Log alerts are stateless and alerts fire each time the evaluation of the alert condition is met, regardless of it is fired previously. Fired alerts do not resolved. You can [mark the alert as closed](alerts-managing-alert-states.md) as needed and **Mute Actions** in alert details to prevent actions from being triggered after an alert rule fires.

See this alert evaluation example:

| Time    | Log condition evaluation | Result 
| ------- | ----------| ----------| ------- 
| 00:05 | FALSE | Alert does not fire. No actions called.
| 00:10 | TRUE  | Alert fires and action groups called. New alert state ACTIVE.
| 00:15 | TRUE  | Alert fires and action groups called. New alert state ACTIVE.
| 00:20 | FALSE | Alert does not fire. No actions called. Pervious alerts state remains ACTIVE.

## Pricing and Billing of Log Alerts

Pricing information is located in the [Azure Monitor pricing page](https://azure.microsoft.com/pricing/details/monitor/). Log Alerts are listed under resource provider `microsoft.insights/scheduledqueryrules` with:

- Log Alerts on Application Insights shown with exact resource name along with resource group and alert properties.
- Log Alerts on Log Analytics shown with exact resource name along with resource group and alert properties; when created using [scheduledQueryRules API](/rest/api/monitor/scheduledqueryrules).
- Log alerts created from [legacy Log Analytics API](./api-alerts.md) are not tracked [Azure Resources](../../azure-resource-manager/management/overview.md) and do not have enforced unique resource names. These alerts are still created on `microsoft.insights/scheduledqueryrules` as hidden resources, which have this resource naming structure `<WorkspaceName>|<savedSearchId>|<scheduleId>|<ActionId>`. Log Alerts on legacy API are shown with above hidden resource name along with resource group and alert properties.

> [!NOTE]
> Unsupported resource characters such as `<, >, %, &, \, ?, /` are replaced with `_` in the hidden resource names and this will also reflect in the billing information.

> [!NOTE]
> Log alerts for Log Analytics used to be managed using legacy [Log Analytics Alert API](api-alerts.md) and legacy templates of [Log Analytics saved searches and alerts](../insights/solutions.md). [Learn more about switching to the current ScheduledQueryRules API](alerts-log-api-switch.md). Any alert rule management should be done using [legacy Log Analytics API](api-alerts.md) until user decides to switch and not using the hidden resources.

## Next steps

* Learn about [creating in log alerts in Azure](./alerts-log.md).
* Understand [webhooks in log alerts in Azure](alerts-log-webhook.md).
* Learn about [Azure Alerts](./alerts-overview.md).
* Learn more about [Application Insights](../log-query/log-query-overview.md).
* Learn more about [Log Analytics](../log-query/log-query-overview.md).

