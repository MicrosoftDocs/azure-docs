---
title: Troubleshooting log alerts in Azure Monitor | Microsoft Docs
description: Common issues, errors, and resolution for log alert rules in Azure.
author: msvijayn
services: azure-monitor
ms.service: azure-monitor
ms.topic: conceptual
ms.date: 10/29/2018
ms.author: vinagara
ms.subservice: alerts
---
# Troubleshooting log alerts in Azure Monitor  

## Overview

This article shows you how to resolve common issues seen when setting up log alerts in Azure Monitor. It also provides solutions to frequently asked questions regarding functionality or configuration of log alerts. 

The term **Log Alerts** describes alerts that fire based on a log query in a [Log Analytics workspace](../learn/tutorial-viewdata.md) or [Application Insights](../../azure-monitor/app/analytics.md). Learn more about functionality, terminology, and types in [Log alerts - Overview](../platform/alerts-unified-log.md).

> [!NOTE]
> This article doesn't consider cases when the Azure portal shows and alert rule triggered and a notification performed by an associated Action Group(s). For such cases, please refer to details in the article on [Action Groups](../platform/action-groups.md).

## Log alert didn't fire

Here are some common reasons why a configured [log alert rule in Azure Monitor](../platform/alerts-log.md) state doesn't show [as *fired* when expected](../platform/alerts-managing-alert-states.md). 

### Data Ingestion time for Logs

Log alert periodically runs your query based on [Log Analytics](../learn/tutorial-viewdata.md) or [Application Insights](../../azure-monitor/app/analytics.md). Because Azure Monitor processes many terabytes of data from thousands of customers from varied sources across the world, the service is susceptible to a varying time delay. For more information, see [Data ingestion time in Azure Monitor Logs](../platform/data-ingestion-time.md).

To mitigate data ingestion delay, the system waits and retries the alert query multiple times if it finds the needed data is not yet ingested. The system has an exponentially increasing wait time set. The log alert only triggers after the data is available so they delay could be due to slow log data ingestion. 

### Incorrect time period configured

As described in the article on [terminology for log alerts](../platform/alerts-unified-log.md#log-search-alert-rule---definition-and-types), the time period stated in configuration specifies the time range for the query. The query returns only records that were created within this range of time. Time period restricts the data fetched for log query to prevent abuse and circumvents any time command (like *ago*) used in log query. For example, If the time period is set to 60 minutes, and the query is run at 1:15 PM, only records created between 12:15 PM and 1:15 PM are used for the log query. If the log query uses a time command like *ago (1d)*, the query still only uses data between 12:15 PM and 1:15 PM because the time period is set to that interval.*

Therefore, check that time period in the configuration matches your query. For the example stated earlier, if the log query uses *ago (1d)* as shown with Green marker, then the time period should be set to 24 hours or 1440 minutes (as indicated in Red), to ensure the query executes as intended.

![Time Period](media/alert-log-troubleshoot/LogAlertTimePeriod.png)

### Suppress Alerts option is set

As described in step 8 of the article on [creating a log alert rule in Azure portal](../platform/alerts-log.md#managing-log-alerts-from-the-azure-portal), log alerts provide a **Suppress Alerts** option to suppress triggering and notification actions for a configured amount of time. As a result, you may think that an alert didn't fire while in actuality it did, but was suppressed.  

![Suppress Alerts](media/alert-log-troubleshoot/LogAlertSuppress.png)

### Metric measurement alert rule is incorrect

**Metric measurement log alerts** are a subtype of log alerts, which have special capabilities and a restricted alert query syntax. A metric measurement log alert rule requires the query output to be a metric time series; that is, a table with distinct equally sized time periods along with corresponding aggregated values. Additionally, users can choose to have additional variables in the table alongside AggregatedValue. These variables may be used to sort the table. 

For example, suppose a metric measurement log alert rule was configured as:

- query was: `search *| summarize AggregatedValue = count() by $table, bin(timestamp, 1h)`  
- time period of 6 hours
- threshold of 50
- alert logic of three consecutive breaches
- Aggregate Upon chosen as $table

Since the command includes *summarize ... by* and provided two variables (timestamp & $table), the system chooses $table to *Aggregate Upon*. It sorts the result table by the field *$table* as shown below and then looks at the multiple AggregatedValue for each table type (like availabilityResults) to see if there was consecutive breaches of 3 or more.

![Metric Measurement query execution with multiple values](media/alert-log-troubleshoot/LogMMQuery.png)

As *Aggregate Upon* is defined on *$table*, the data is sorted on $table column (as in RED); then we group and look for types of *Aggregate Upon* field (that is) $table for example: values for availabilityResults will be considered as one plot/entity (as highlighted in Orange). In this value plot/entity  alert service checks for three consecutive breaches occurring (as shown in Green) for which alert will get triggered for table value 'availabilityResults'. Similarly, if for any other value of $table if three consecutive breaches are seen - another alert notification will be triggered for the same thing; with alert service automatically sorting the values in one plot/entity (as in Orange) by time.

Now suppose, metric measurement log alert rule was modified and query was `search *| summarize AggregatedValue = count() by bin(timestamp, 1h)` with rest of the config remaining same as before including alert logic for three consecutive breaches. "Aggregate Upon" option in this case will be by default: timestamp. Since only one value is provided in query for *summarize ... by* (that is) *timestamp*; similar to earlier example, at end of execution the output would be as illustrated below.

   ![Metric Measurement query execution with singular value](media/alert-log-troubleshoot/LogMMtimestamp.png)

As *Aggregate Upon* is defined on timestamp, the data is sorted on *timestamp* column (as in RED); then we group by timestamp  for example: values for `2018-10-17T06:00:00Z` will be considered as one plot/entity (as highlighted in Orange). In this value plot/entity  alert service will find no consecutive breaches occurring (as each timestamp value has only one entry) and hence alert will never get triggered. Hence in such case, user must either:

- Add a dummy variable or an existing variable (like $table) to correctly sorting done using "Aggregate Upon" field configured
- (Or) reconfigure alert rule to use alert logic based on *total breach* instead appropriately

## Log alert fired unnecessarily

Detailed next are some common reasons why a configured [log alert rule in Azure Monitor](../platform/alerts-log.md) may be triggered when viewed in [Azure Alerts](../platform/alerts-managing-alert-states.md), when you don't expect it to be fired.

### Alert triggered by partial data

Analytics powering Log Analytics and Application Insights are subject to ingestion delays and processing; due to which, at the time when provided log alert query is run - there may be a case of no data being available or only some data being available. For more information, see [Log data ingestion time in Azure Monitor](../platform/data-ingestion-time.md).

Depending on how the alert rule is configured, there may be mis-firing if there is no or partial data in logs at the time of alert execution. In such cases, we advise you to change the alert query or config. 

For example, if the log alert rule is configured to trigger when number of results from an analytics query is less than 5, then the alert triggers when there is no data (zero record) or partial results (one record). However, after the data ingestion delay, the same query with full data might provide a result of 10 records.

### Alert query output misunderstood

You provide the logic for log alerts in an analytics query. The analytics query may use various big data and mathematical functions.  The alerting service executes your query at intervals specified with data for time period specified. The alerting service makes subtle changes to query provided based on the alert type chosen. This change can be viewed in the "Query to be executed" section in *Configure signal logic* screen, as shown below:
    ![Query to be executed](media/alert-log-troubleshoot/LogAlertPreview.png)

What is shown in the **query to be executed** box is what the log alert service runs. You can run the stated query as well as timespan via [Analytics portal](../log-query/portals.md) or the [Analytics API](https://docs.microsoft.com/rest/api/loganalytics/) if you want to understand what the alert query output may be before you actually create the alert.

## Log alert was disabled

Listed below are some reasons due to which [log alert rule in Azure Monitor](../platform/alerts-log.md) may be disabled by Azure Monitor.

### Resource on which alert was created no longer exists

Log alert rules created in Azure Monitor target a specific resource like an Azure Log Analytics workspace, Azure Application Insights app, and Azure resource. And the log alert service will then run analytics query provided in the rule for the specified target. But after the rule creation, often users go on to delete from Azure or move inside Azure - the target of the alert rule. As the target of the log alert rule is no longer valid, execution of the rule fails.

In such cases, Azure Monitor will disable the log alert and ensure customers are not billed unnecessarily, when the rule itself is not able to execute continually for sizeable period like a week. Users can find out on the exact time at which the log alert rule was disabled by Azure Monitor via [Azure Activity Log](../../azure-resource-manager/resource-group-audit.md). In Azure Activity Log when the log alert rule is disabled by Azure, an event is added in Azure Activity Log.

A sample event in Azure Activity Log for alert rule disabling due to its continual failure; is shown below.

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

### Query used in Log Alert is not valid

Each log alert rule created in Azure Monitor as part of its configuration must specify an analytics query to be executed periodically by the alert service. While the analytics query may have correct syntax at the time of rule creation or update. Some times over a period of time, the query provide in the log alert rule can develop syntax issues and cause the rule execution to start failing. Some common reasons why analytics query provided in a log alert rule can develop errors are:

- Query is written to [run across multiple resources](../log-query/cross-workspace-query.md) and one or more of the resources specified, now do not exist.
- There has been no data flow to the analytics platform, due to which the [query execution gives error](https://dev.loganalytics.io/documentation/Using-the-API/Errors) as there is no data for the provided query.
- Changes in [Query Language](https://docs.microsoft.com/azure/kusto/query/) have occurred in which commands and functions have a revised format. Hence the earlier provided query in alert rule is no longer valid.

The user shall be warned of this behavior first via [Azure Advisor](../../advisor/advisor-overview.md). A recommendation would be added for the specific log alert rule on Azure Advisor, under the category of High Availability with medium impact and description as "Repair your log alert rule to ensure monitoring". If after seven days of the providing recommendation on Azure Advisor the alert query in the specified log alert rule is not rectified. Then Azure Monitor will disable the log alert and ensure customers are not billed unnecessarily, when the rule itself is not able to execute continually for sizeable period like a week.

Users can find out on the exact time at which the log alert rule was disabled by Azure Monitor via [Azure Activity Log](../../azure-resource-manager/resource-group-audit.md). In Azure Activity Log, when the log alert rule is disabled by Azure - an event is added in Azure Activity Log.

## Next steps

- Learn about [Log Alerts in Azure Alerts](../platform/alerts-unified-log.md)
- Learn more about [Application Insights](../../azure-monitor/app/analytics.md)
- Learn more about [log queries](../log-query/log-query-overview.md)
