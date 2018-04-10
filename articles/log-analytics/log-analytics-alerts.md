---
title: Understanding alerts in Azure Log Analytics | Microsoft Docs
description: Alerts in Log Analytics identify important information in your OMS repository and can proactively notify you of issues or invoke actions to attempt to correct them.  This article describes the different kinds of alert rules and how they are defined.
services: log-analytics
documentationcenter: ''
author: bwren
manager: carmonm
editor: tysonn

ms.assetid: 6cfd2a46-b6a2-4f79-a67b-08ce488f9a91
ms.service: log-analytics
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 01/05/2018
ms.author: bwren

---
# Understanding alerts in Log Analytics

Alerts in Log Analytics identify important information in your Log Analytics repository.  This article discusses some of the design decisions that must be made based on the collection frequency of the data being queried, random delays with data ingestion possibly caused by network latency or processing capacity, and committing the data into the Log Analytics repository.  It also provides details of how alert rules in Log Analytics work and describes the differences between different types of alert rules.

For the process of creating alert rules, see the following articles:

- Create alert rules using [Azure portal](log-analytics-alerts-creating.md)
- Create alert rules using [Resource Manager template](../operations-management-suite/operations-management-suite-solutions-resources-searches-alerts.md)
- Create alert rules using [REST API](log-analytics-api-alerts.md)

## Considerations

Details about the data collection frequency for various solutions and data type are available in the [Data collection details](log-analytics-add-solutions.md#data-collection-details) of the Solutions overview article. As noted in this article, collection frequency can be as infrequent as once every seven days to *on notification*. It is important to understand and consider the data collection frequency before setting up an alert. 

- The collection frequency determines how often the OMS agent on machines will send data to Log Analytics. For instance, if the collection frequency is 10 minutes and there are no other delays in the system, then time stamps of the transmitted data may be anywhere between zero and 10 minutes old before being added to the repository and is searchable in Log Analytics.

- Before an alert can be triggered, the data must be written to the repository so that it is available when queried. Because of the latency described above, the collection frequency is not the same as the time the data is available to queries. For instance, while the data may be collected precisely every 10 min, the data will be available in the data repository at irregular intervals. Hypothetically, data collected at zero, 10, and 20 minute intervals might be available for search at 25, 28, and 35 minutes respectively, or at some other irregular interval influenced by ingestion latency. The worst case for these delays is documented in the [SLA for Log Analytics](https://azure.microsoft.com/support/legal/sla/log-analytics/v1_1), which does not include a delay introduced by the collection frequency or network latency between the computer and Log Analytics service.


## Alert rules

Alerts are created by alert rules that automatically run log searches at regular intervals.  If the results of the log search match particular criteria then an alert record is created.  The rule can then automatically run one or more actions to proactively notify you of the alert or invoke another process.  Different types of alert rules use different logic to perform this analysis.

![Log Analytics alerts](media/log-analytics-alerts/overview.png)

Because there is an anticipated latency with the ingestion of log data, the absolute time between indexing data and when it is available to search can be unpredictable.  The near-real-time availability of data collected should be taken into consideration while defining alert rules.    

There is a trade-off between reliability of alerts and the responsiveness of alerts. You can choose to configure alert parameters to minimize false alerts and missing alerts, or you can choose alert parameters to respond quickly to the conditions that are being monitored, but will occasionally generate false or missed alerts.

Alert Rules are defined by the following details:

- **Log search**.  The query that runs every time the alert rule fires.  The records returned by this query is used to determine whether an alert is created.
- **Time window**.  Specifies the time range for the query.  The query returns only records that were created within this range of the current time.  This can be any value between five minutes and 24 hours. The range needs to be wide enough to accommodate reasonable delays in ingestion. The time window needs to be two times the length of the longest delay you want to be able to handle.<br> For instance, if you want alerts to be reliable for 30 minute delays, then the range needs to be one hour.  

    There are two symptoms you could experience if the time range is too small.

    - **Missing alerts**. Assume the ingestion delay is 60 minutes sometimes, but most of the time it is fifteen minutes.  If the time window is set to 30 minutes then it will miss an alert when the delay is 60 minutes because the data will not be available for search when the alert query is executed. 
   
        >[!NOTE]
        >Trying to diagnose why the alert is missed is impossible. For example, in the case above, the data is written to the repository 60 minutes after the alert query was executed. If it is noticed the next day that an alert was missed, and the next day the query is executed over the correct time interval, the log search criteria would match the result. It would appear that the alert should have been triggered. In fact, the alert was not triggered because the data was not yet available when the alert query was executed. 
        >
 
    - **False Alerts**. Sometimes alert queries are designed to identify the absence of events. One example of this is detecting when a virtual machine is off-line by searching for missed heartbeats. As above, if the heartbeat is not available for search within the Alert time window, then an alert will be generated because the heartbeat data was not yet searchable, and therefore absent. This is the same result as if the VM  was legitimately off-line and there was no heartbeat data generated by it. Executing the query the next day over the correct time window will show that there were heartbeats and alerting failed. In fact, the heartbeats were not yet available for search because the Alert time window was set too small.  

- **Frequency**.  Specifies how often the query should be run and can be used to make alerts more responsive for the normal case. The value can be between five minutes and 24 hours and should be equal to or less than the Alert time window.  If the value is greater than the time window, then you risk records being missed.<br>If the goal is to be reliable for delays up to 30 minutes and the normal delay is 10 minutes, the time window should be one hour and the frequency value should be 10 minutes. This would trigger an alert with data that has a 10 minute ingestion delay between 10 and 20 minutes of when the alert data was generated.<br>To avoid creating multiple alerts for the same data because the time window is too wide, the [Suppress Alerts](log-analytics-tutorial-response.md#create-alerts) option can be used to suppress alerts for at least as long as the time window.
  
- **Threshold**.  The results of the log search are evaluated to determine whether an alert should be created.  The threshold is different for the different types of alert rules.

Each alert rule in Log Analytics is one of two types.  Each of these types is described in detail in the sections that follow.

- **[Number of results](#number-of-results-alert-rules)**. Single alert created when the number records returned by the log search exceed a specified number.
- **[Metric measurement](#metric-measurement-alert-rules)**.  Alert created for each object in the results of the log search with values that exceed specified threshold.

The differences between alert rule types are as follows.

- **Number of results** alert rule will always create a single alert while **Metric measurement** alert rule creates an alert for each object that exceeds the threshold.
- **Number of results** alert rules create an alert when the threshold is exceeded a single time. **Metric measurement** alert rules can create an alert when the threshold is exceeded a certain number of times over a particular time interval.

## Number of results alert rules
**Number of results** alert rules create a single alert when the number of records returned by the search query exceed the specified threshold.

### Threshold
The threshold for a **Number of results** alert rule is simply greater than or less than a particular value.  If the number of records returned by the log search match this criteria, then an alert is created.

### Scenarios

#### Events
This type of alert rule is ideal for working with events such as Windows event logs, Syslog, and Custom logs.  You may want to create an alert when a particular error event gets created, or when multiple error events are created within a particular time window.

To alert on a single event, set the number of results to greater than 0 and both the frequency and time window to 5 minutes.  That runs the query every 5 minutes and check for the occurrence of a single event that was created since the last time the query was run.  A longer frequency may delay the time between the event being collected and the alert being created.

Some applications may log an occasional error that shouldn't necessarily raise an alert.  For example, the application may retry the process that created the error event and then succeed the next time.  In this case, you may not want to create the alert unless multiple events are created within a particular time window.  

In some cases, you may want to create an alert in the absence of an event.  For example, a process may log regular events to indicate that it's working properly.  If it doesn't log one of these events within a particular time window, then an alert should be created.  In this case you would set the threshold to **less than 1**.

#### Performance alerts
[Performance data](log-analytics-data-sources-performance-counters.md) is stored as records in the OMS repository similar to events.  If you want to alert when a performance counter exceeds a particular threshold, then that threshold should be included in the query.

For example, if you wanted to alert when the processor runs over 90%, you would use a query like the following with the threshold for the alert rule **greater than 0**.

	Type=Perf ObjectName=Processor CounterName="% Processor Time" CounterValue>90

If you wanted to alert when the processor averaged over 90% for a particular time window, you would use a query using the `measure` command like the following with the threshold for the alert rule **greater than 0**.

	Type=Perf ObjectName=Processor CounterName="% Processor Time" | measure avg(CounterValue) by Computer | where AggregatedValue>90

>[!NOTE]
> If your workspace has been upgraded to the [new Log Analytics query language](log-analytics-log-search-upgrade.md), then the above queries would change to the following:
> `Perf | where ObjectName=="Processor" and CounterName=="% Processor Time" and CounterValue>90`
> `Perf | where ObjectName=="Processor" and CounterName=="% Processor Time" | summarize avg(CounterValue) by Computer | where CounterValue>90`


## Metric measurement alert rules

>[!NOTE]
> Metric measurement alert rules are currently in public preview.

**Metric measurement** alert rules create an alert for each object in a query with a value that exceeds a specified threshold.  They have the following distinct differences from **Number of results** alert rules.

#### Log search
While you can use any query for a **Number of results** alert rule, there are specific requirements the query for a metric measurement alert rule.  It must include a `measure` command to group the results on a particular field. This command must include the following elements.

- **Aggregate function**.  Determines the calculation that is performed and potentially a numeric field to aggregate.  For example, **count()** will return the number of records in the query, **avg(CounterValue)** will return the average of the CounterValue field over the interval.
- **Group Field**.  A record with an aggregated value is created for each instance of this field, and an alert can be generated for each.  For example, if you wanted to generate an alert for each computer, you would use **by Computer**.   
- **Interval**.  Defines the time interval over which the data is aggregated.  For example, if you specified **5 minutes**, a record would be created for each instance of the group field aggregated at 5 minute intervals over the time window specified for the alert.

#### Threshold
The threshold for Metric measurement alert rules is defined by an aggregate value and a number of breaches.  If any data point in the log search exceeds this value, it's considered a breach.  If the number of breaches in for any object in the results exceeds the specified value, then an alert is created for that object.

#### Example
Consider a scenario where you wanted an alert if any computer exceeded processor utilization of 90% three times over 30 minutes.  You would create an alert rule with the following details.  

**Query:** Type=Perf ObjectName=Processor CounterName="% Processor Time" | measure avg(CounterValue) by Computer Interval 5minute<br>
**Time window:** 30 minutes<br>
**Alert frequency:** 5 minutes<br>
**Aggregate value:** Greater than 90<br>
**Trigger alert based on:** Total breaches Greater than 5<br>

The query would create an average value for each computer at 5 minute intervals.  This query would be run every 5 minutes for data collected over the previous 30 minutes.  Sample data is shown below for three computers.

![Sample query results](media/log-analytics-alerts/metrics-measurement-sample-graph.png)

In this example, separate alerts would be created for srv02 and srv03 since they breached the 90% threshold 3 times over the time window.  If the **Trigger alert based on:** were changed to **Consecutive** then an alert would be created only for srv03 since it breached the threshold for 3 consecutive samples.

## Alert records
Alert records created by alert rules in Log Analytics have a **Type** of **Alert** and a **SourceSystem** of **OMS**.  They have the properties in the following table.

| Property | Description |
|:--- |:--- |
| Type |*Alert* |
| SourceSystem |*OMS* |
| *Object*  | [Metric measurement alerts](#metric-measurement-alert-rules) will have a property for the group field.  For example, if the log search groups on Computer, the alert record with have a Computer field with the name of the computer as the value.
| AlertName |Name of the alert. |
| AlertSeverity |Severity level of the alert. |
| LinkToSearchResults |Link to Log Analytics log search that returns the records from the query that created the alert. |
| Query |Text of the query that was run. |
| QueryExecutionEndTime |End of the time range for the query. |
| QueryExecutionStartTime |Start of the time range for the query. |
| ThresholdOperator | Operator that was used by the alert rule. |
| ThresholdValue | Value that was used by the alert rule. |
| TimeGenerated |Date and time the alert was created. |

There are other kinds of alert records created by the [Alert Management solution](log-analytics-solution-alert-management.md) and by [Power BI exports](log-analytics-powerbi.md).  These all have a **Type** of **Alert** but are distinguished by their **SourceSystem**.


## Next steps
* Install the [Alert Management solution](log-analytics-solution-alert-management.md) to analyze alerts created in Log Analytics along with alerts collected from System Center Operations Manager.
* Read more about [log searches](log-analytics-log-searches.md) that can generate alerts.
* Complete a walkthrough for [configuring a webook](log-analytics-alerts-webhooks.md) with an alert rule.  
* Learn how to write [runbooks in Azure Automation](https://azure.microsoft.com/documentation/services/automation) to remediate problems identified by alerts.
