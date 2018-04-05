---
title: Log alerts in Azure Monitor - Alerts | Microsoft Docs
description: Trigger emails, notifications, call websites URLs (webhooks), or automation when the complex query conditions you specify are met for Azure Alerts .
author: msvijayn
manager: kmadnani1
editor: ''
services: monitoring-and-diagnostics
documentationcenter: monitoring-and-diagnostics

ms.assetid: f7457655-ced6-4102-a9dd-7ddf2265c0e2
ms.service: monitoring-and-diagnostics
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/17/2018
ms.author: vinagara

---
# Log alerts in Azure Monitor - Alerts 
This article provides details of how alert rules in Analytics queries work in Azure Alerts  and describes the differences between different types of log alert rules. For details of Metric Alerts using Logs, refer to [Near Real Time Metric Alerts](monitoring-near-real-time-metric-alerts.md)

Currently Azure Alerts, supports log alerts on queries from [Azure Log Analytics](../log-analytics/log-analytics-tutorial-viewdata.md) and [Application Insights](../application-insights/app-insights-cloudservices.md#view-azure-diagnostic-events).

> [!WARNING]

> Currently, log alert in Azure Alerts  doesn't support cross-workspace or cross-app queries. And Log Alerts for Application Insights is in public preview - the functionality and user experience is subject to change.

Also, users can perfect their queries in Analytics platform of choice in Azure and then *import them for use in Alerts  by saving the query*. Steps to follow:
- For Application Insights: Go-to Analytics portal, validate query and its results. Then save with unique name into *Shared Queries*.
- For Log Analytics: Go-to Log Search, validate query and its results. Then use save with unique name into any category.

Then when [creating a log alert in Alerts ](monitor-alerts-unified-usage.md), you see the saved query listed as signal type **Log (Saved Query)**; as illustrated in below example:
 ![Saved Query imported to Alerts](./media/monitor-alerts-unified/AlertsPreviewResourceSelectionLog-new.png)

> [!NOTE]
> Using **Log (Saved Query)** results in an import to Alerts. Hence any changes done after in Analytics will not be reflective in saved alert rules and vice-versa.

## Log Alert rules

Alerts are created by Azure Alerts  to automatically run log queries at regular intervals.  If the results of the log query match particular criteria, then an alert record is created. The rule can then automatically run one or more actions to proactively notify you of the alert or invoke another process like sending data to external application using [json based webhook](monitor-alerts-unified-log-webhook.md), using [Action Groups](monitoring-action-groups.md). Different types of alert rules use different logic to perform this analysis.

Alert Rules are defined by the following details:

- **Log Query**.  The query that runs every time the alert rule fires.  The records returned by this query are used to determine whether an alert is created.
- **Time window**.  Specifies the time range for the query.  The query returns only records that were created within this range of the current time.  Time window can be any value between 5 minutes and 1440 minutes or 24 hours. For example, If the time window is set to 60 minutes, and the query is run at 1:15 PM, only records created between 12:15 PM and 1:15 PM is returned.
- **Frequency**.  Specifies how often the query should be run. Can be any value between 5 minutes and 24 hours. Should be equal to or less than the time window.  If the value is greater than the time window, then you risk records being missed.<br>For example, consider a time window of 30 minutes and a frequency of 60 minutes.  If the query is run at 1:00, it returns records between 12:30 and 1:00 PM.  The next time the query would run is 2:00 when it would return records between 1:30 and 2:00.  Any records created between 1:00 and 1:30 would never be evaluated.
- **Threshold**.  The results of the log search are evaluated to determine whether an alert should be created.  The threshold is different for the different types of alert rules.

Each alert rule in Log Analytics is one of two types.  Each of these types is described in detail in the sections that follow.

- **[Number of results](#number-of-results-alert-rules)**. Single alert created when the number records returned by the log search exceed a specified number.
- **[Metric measurement](#metric-measurement-alert-rules)**.  Alert created for each object in the results of the log search with values that exceed specified threshold.

The differences between alert rule types are as follows.

- **Number of results alert rules always creates a single alert while **Metric measurement** alert rule creates an alert for each object that exceeds the threshold.
- **Number of results** alert rules create an alert when the threshold is exceeded a single time. **Metric measurement** alert rules can create an alert when the threshold is exceeded a certain number of times over a particular time interval.

## Number of results alert rules
**Number of results** alert rules create a single alert when the number of records returned by the search query exceed the specified threshold. This type of alert rule is ideal for working with events such as Windows event logs, Syslog, WebApp Response, and Custom logs.  You may want to create an alert when a particular error event gets created, or when multiple error events are created within a particular time window.

**Threshold**: The threshold for a **Number of results alert rules is greater than or less than a particular value.  If the number of records returned by the log search match this criteria, then an alert is created.

To alert on a single event, set the number of results to greater than 0 and check for the occurrence of a single event that was created since the last time the query was run. Some applications may log an occasional error that shouldn't necessarily raise an alert.  For example, the application may retry the process that created the error event and then succeed the next time.  In this case, you may not want to create the alert unless multiple events are created within a particular time window.  

In some cases, you may want to create an alert in the absence of an event.  For example, a process may log regular events to indicate that it's working properly.  If it doesn't log one of these events within a particular time window, then an alert should be created.  In this case, you would set the threshold to **less than 1**.

### Example
Consider a scenario where you want to know when your web-based App gives a response to users with code 500 (that is) Internal Server Error. You would create an alert rule with the following details:  
**Query:** requests | where resultCode == "500"<br>
**Time window:** 30 minutes<br>
**Alert frequency:** five minutes<br>
**Threshold value:** Great than 0<br>

Then alert would run the query every 5 minutes, with 30 minutes of data - to look for any record where result code was 500. If even one such record is found, it fires the alert and triggers the action configured.

## Metric measurement alert rules

**Metric measurement** alert rules create an alert for each object in a query with a value that exceeds a specified threshold.  They have the following distinct differences from **Number of results** alert rules.

**Aggregate function**: Determines the calculation that is performed and potentially a numeric field to aggregate.  For example, **count()** returns the number of records in the query, **avg(CounterValue)** returns the average of the CounterValue field over the interval.

> [!NOTE]

> Aggregate function in query must be named/called: AggregatedValue and provide a numeric value. 


**Group Field**: A record with an aggregated value is created for each instance of this field, and an alert can be generated for each.  For example, if you wanted to generate an alert for each computer, you would use **by Computer**   

> [!NOTE]

> For Metric measurement alert rules that are based on Application Insights, you can specify the field for grouping the data. To do this, use the **Aggregate on** option in the rule definition.   

**Interval**:  Defines the time interval over which the data is aggregated.  For example, if you specified **five minutes**, a record would be created for each instance of the group field aggregated at 5-minute intervals over the time window specified for the alert.
> [!NOTE]
> Bin function must be used in query. As bin() can result in unequal time intervals  - Alert will instead use bin_at function with appropriate time at runtime, to ensure results with a fixed point

**Threshold**: The threshold for Metric measurement alert rules is defined by an aggregate value and a number of breaches.  If any data point in the log search exceeds this value, it's considered a breach.  If the number of breaches in for any object in the results exceeds the specified value, then an alert is created for that object.

#### Example
Consider a scenario where you wanted an alert if any computer exceeded processor utilization of 90% three times over 30 minutes.  You would create an alert rule with the following details:  

**Query:** Perf | where ObjectName == "Processor" and CounterName == "% Processor Time" | summarize AggregatedValue = avg(CounterValue) by bin(TimeGenerated, 5 m), Computer<br>
**Time window:** 30 minutes<br>
**Alert frequency:** five minutes<br>
**Aggregate value:** Great than 90<br>
**Trigger alert based on:** Total breaches Greater than 5<br>

The query would create an average value for each computer at 5-minute intervals.  This query would be run every 5 minutes for data collected over the previous 30 minutes.  Sample data is shown below for three computers.

![Sample query results](../log-analytics/media/log-analytics-alerts/metrics-measurement-sample-graph.png)

In this example, separate alerts would be created for srv02 and srv03 since they breached the 90% threshold 3 times over the time window.  If the **Trigger alert based on:** were changed to **Consecutive** then an alert would be created only for srv03 since it breached the threshold for three consecutive samples.


## Next steps
* Understand [Webhook actions for log alerts](monitor-alerts-unified-log-webhook.md)
* [Get an overview of Azure Alerts ](monitoring-overview-unified-alerts.md)
* Learn about [Using Azure Alerts ](monitor-alerts-unified-usage.md)
* Learn more about [Application Insights](../application-insights/app-insights-analytics.md)
* Learn more about [Log Analytics](../log-analytics/log-analytics-overview.md).    
