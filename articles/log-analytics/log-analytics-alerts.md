---
title: Overview of alerts in OMS Log Analytics | Microsoft Docs
description: Alerts in Log Analytics identify important information in your OMS repository and can proactively notify you of issues or invoke actions to attempt to correct them.  This article describes how to create an alert rule and details the different actions they can take.
services: log-analytics
documentationcenter: ''
author: bwren
manager: jwhit
editor: tysonn

ms.assetid: 6cfd2a46-b6a2-4f79-a67b-08ce488f9a91
ms.service: log-analytics
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 02/28/2017
ms.author: bwren

ms.custom: H1Hack27Feb2017

---
# Respond to issues in Log Analytics using alerts

Alerts in Log Analytics identify important information in your Log Analytics repository.  You can use them to proactively notify you of a problem or to take automated actions in response to the issue.  This article provides an overview of how alerts are created and used.  


>[!NOTE]
> For information on metric measurement alert rules which are currently in public preview, see [New metric measurement alert rule type in Public Preview!](https://blogs.technet.microsoft.com/msoms/2016/11/22/new-metric-measurement-alert-rule-type-in-public-preview/).

## Alert rules

Alerts are created by alert rules that automatically run log searches at regular intervals.  If the results of the log search match particular criteria then an alert record is created.  The rule can also automatically run one or more actions to proactively notify you of the alert or invoke another process.  

![Log Analytics alerts](media/log-analytics-alerts/overview.png)


Alert Rules are defined by the following details.

- **Log search**.  This is the query that will be run every time the alert rule fires.  The records returned by this query will be used to determine whether an alert is created.
- **Time window**.  Specifies the time range for the query.  The query returns only records that were created within this range of the current time.  This can be any value between 5 minutes and 24 hours. For example, If the time window is set to 60 minutes, and the query is run at 1:15 PM, only records created between 12:15 PM and 1:15 PM will be returned.
- **Frequency**.  Specifies how often the query should be run. Can be any value between 5 minutes and 24 hours. Should be equal to or less than the time window.  If the value is greater than the time window, then you risk records being missed.<br>For example, consider a time window of 30 minutes and a frequency of 60 minutes.  If the query is run at 1:00, it returns records between 12:30 and 1:00 PM.  The next time the query would run is 2:00 when it would return records between 1:30 and 2:00.  Any records created between 1:00 and 1:30 would never be evaluated.
- **Threshold**.  If the number of records returned from the log search exceeds the threshold, an alert is created.

## Creating alert rules
You can create and modify alert rules multiple methods.  See the following articles for detailed guidance.  

- Create alert rules using [OMS portal](log-analytics-alerts-creating.md).
- Create alert rules using [Resource Manager template](log-analytics-template-workspace-configuration.md).
- Create alert rules using [REST API](log-analytics-api-alerts.md).

## Alert actions

In addition to creating an alert record, an alert rule can take one or more actions when it creates an alert.  You can use actions to send a mail in response to the alert or start a process that attempts to take corrective action.  

You can also leverage actions to augment Log Analytics functionality with other services.  For example, it does not currently provide features to notify you using SMS or telephone.  You could use a webhook action in an alert rule though to call a service such as [PagerDuty](https://www.pagerduty.com/) that does provide these features.  You can walkthrough an example of creating a webhook to send a message using [Slack](https://slack.com/) in [Create an alert webhook action in OMS Log Analytics to send message to Slack](log-analytics-alerts-webhooks.md).

The following table lists the actions you can take.  You can learn about each of these in [Adding actions to alert rules in Log Analytics](log-analytics-alerts-actions.md). 

| Action | Description |
|:--|:--|
| Email  | 	Send an e-mail with the details of the alert to one or more recipients. |
| Webhook | Invoke an external process through a single HTTP POST request. |
| Runbook | Start a runbook in Azure Automation. |


## Alerting scenarios

### Events
To alert on a single event, create an alert rule with the number of results to **greater than 0** and both the frequency and time window to **5 minutes**.  That will run the query every 5 minutes and check for the occurrence of a single event that was created since the last time the query was run.  A longer frequency may delay the time between the event being collected and the alert being created.  You would use a query similar to the following to specify the event you're interested in.

	Type=Event Source=MyApplication EventID=7019 

Some applications may log an occasional error that shouldn't necessarily raise an alert.  For example, the application may retry the process that created the error event and then succeed the next time.  In this case, you may not want to create the alert unless multiple events are created within a particular time window.  To do this you would use the same query but set the threshold to a higher number.  For example, to alert on 5 events in 30 minutes, you set the frequency to **5 minutes**, the time window to **30 minutes**, and the number of results to **greater than 4**.    

In some cases, you may want to create an alert in the absence of an event.  For example, a process may log regular events to indicate that it's working properly.  If it doesn't log one of these events within a particular time window, then an alert should be created.  In this case you would set the number of results to **less than 1**.

### Performance alerts
[Performance data](log-analytics-data-sources-performance-counters.md) is stored as records in the Log Analytics< repository similar to events.  If you want to alert when a performance counter exceeds a particular threshold, then that threshold should be included in the query.

For example, if you want an alert when the processor runs over 90%, you would use a query like the following with the number of results for the alert rule **greater than 0**.

	Type=Perf ObjectName=Processor CounterName="% Processor Time" CounterValue>90

If you want to alert when the processor averages over 90% for a particular time window, you would use a query using the [measure command](log-analytics-search-reference.md#commands) like the following with the threshold for the alert rule **greater than 0**. 

	Type=Perf ObjectName=Processor CounterName="% Processor Time" | measure avg(CounterValue) by Computer | where AggregatedValue>90


## Alert records
Alert records created by alert rules in Log Analytics have a **Type** of **Alert** and a **SourceSystem** of **OMS**.  They have the properties in the following table.

| Property | Description |
|:--- |:--- |
| Type |*Alert* |
| SourceSystem |*OMS* |
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
* Create an alert rule using the [OMS portal](log-analytics-alerts-creating.md).
* Install the [Alert Management solution](log-analytics-solution-alert-management.md) to analyze alerts created in Log Analytics along with alerts collected from System Center Operations Manager (SCOM).
* Read more about [log searches](log-analytics-log-searches.md) that can generate alerts.
* Complete a walkthrough for [configuring a webook](log-analytics-alerts-webhooks.md) with an alert rule.  
* Learn how to write [runbooks in Azure Automation](https://azure.microsoft.com/documentation/services/automation) to remediate problems identified by alerts.

