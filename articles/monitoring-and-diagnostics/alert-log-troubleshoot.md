---
title: "Troubleshooting log alerts in Azure Monitor"
description: Common issues, errors and resolution for log alert rules in Azure.
author: msvijayn
services: azure-monitor
ms.service: azure-monitor
ms.topic: conceptual
ms.date: 10/29/2018
ms.author: vinagara
ms.component: alerts
---
# Troubleshooting log alerts in Azure Monitor  

## Overview
This article shows you handle common issues seen while setting up log alerts inside Azure monitor. And provide solution to frequently asked questions regarding functionality or configuration of log alerts. 
The term **Log Alerts** to describe alerts where signal is custom query based on [Log Analytics](../log-analytics/log-analytics-tutorial-viewdata.md) or [Application Insights](../application-insights/app-insights-analytics.md). Learn more about functionality, terminology, and types from [Log alerts - Overview](monitor-alerts-unified-log.md).

> [!NOTE]
> This article doesn't consider cases when the alert rule is shown as triggered in Azure portal and notification via associated Action Group(s). For such cases, please refer to details in the article on [Action Groups](monitoring-action-groups.md).


## Log alert didn't fire

Detailed next are some common reasons why a configured [log alert rule in Azure Monitor](alert-log.md) doesn't get triggered when viewed in [Azure Alerts](monitoring-alerts-managing-alert-states.md), when you expect it to be fired. 

### Data Ingestion time for Logs
Log alert works by periodically running customer provided query based on [Log Analytics](../log-analytics/log-analytics-tutorial-viewdata.md) or [Application Insights](../application-insights/app-insights-analytics.md). Both are powered by the power of Analytics, which processes vast amounts of log data and provides functionality on the same. As the Log Analytics service involves processing many terabytes of data from thousands of customers and from varied sources across the world - the service is susceptible to time delay. For more information, see [Data ingestion time in Log Analytics](../log-analytics/log-analytics-data-ingestion-time.md).

To overcome the data ingestion delay that may occur in Log Analytics or Application Insights logs; log alert waits and retries after some time when it finds data is not yet ingested for the alerting time period. Log Alerts has an exponentially increasing wait time set, so as to make sure we wait necessary time for data to be ingested by Log Analytics. Hence if the logs queried by your log alert rule are affected by ingestion delays, then log alert will trigger only after the data is available in Log Analytics post-ingestion and after exponential time gap due to log alert service retrying multiple times in the interim.

### Incorrect time period configured
As described in the article on [terminology for log alerts](monitor-alerts-unified-log.md#log-search-alert-rule---definition-and-types), time period stated in configuration specifies the time range for the query. The query returns only records that were created within this range of time. Time period restricts the data fetched for log query to prevent abuse and circumvents any time command (like ago) used in log query. 
*For example, If the time period is set to 60 minutes, and the query is run at 1:15 PM, only records created between 12:15 PM and 1:15 PM is returned to execute log query. Now if the log query uses time command like ago (1d), the log query would be run only for data between 12:15 PM and 1:15 PM - as if data exists for only the past 60 minutes. And not for seven days of data as specified in log query.*

Based on your query logic, check if appropriate time period in the configuration has been provided. For the example stated earlier, if the log query uses ago (1d) as shown with Green marker - then the time period should be set to 24 hours or 1440 minutes (as indicated in Red), to ensure the query provided executes correctly as envisaged.
    ![Time Period](./media/monitor-alerts-unified/LogAlertTimePeriod.png)

### Suppress Alerts option is set
As described in step 8 of the article on [creating a log alert rule in Azure portal](alert-log.md#managing-log-alerts-from-the-azure-portal), log alert provides an option configure automatic suppression of the alert rule and prevent notification/trigger for stipulated amount of time. Suppress Alerts option will cause log alert to execute while not triggering action group for the time specified in **Suppress Alerts** option and hence user may feel that alert didn't fire while in actuality it was suppressed as configured.
    ![Suppress Alerts](./media/monitor-alerts-unified/LogAlertSuppress.png)

### Metric measurement alert rule is incorrect
Metric measurement type of log alert rule is subtype of log alerts, which have special capabilities but in turn employs restriction on the alert query syntax. Metric measurement log alert rule requires the output of alert query to provide a metric time series - a table with distinct equally sized time periods along with corresponding values of AggregatedValue computed. Additionally, users can choose to have in the table additional variables alongside AggregatedValue like Computer, Node, etc. using which data in the table can be sorted.

For example, suppose metric measurement log alert rule was configured as:
- query was: `search *| summarize AggregatedValue = count() by $table, bin(timestamp, 1h)`  
- time period of 6 hours
- threshold of 50
- alert logic of three consecutive breaches
- Aggregate Upon chosen as $table

Now since in command, we have used summarize … by and provided two variables: timestamp & $table; alert service will choose $table to “Aggregate Upon” - basically sort the result table by field: $table - as shown below and then look at the multiple AggregatedValue for each table type (like availabilityResults) to see if there was consecutive breaches of 3 or more.

   ![Metric Measurement query execution with multiple values](./media/monitor-alerts-unified/LogMMQuery.png)

As “Aggregate Upon” is $table – the data is sorted on $table column (as in RED); then we group and look for types of “Aggregate Upon” field (that is) $table – for example: values for availabilityResults will be considered as one plot/entity (as highlighted in Orange). In this value plot/entity – alert service checks for three consecutive breaches occurring (as shown in Green) for which alert will get triggered for table value 'availabilityResults'. Similarly, if for any other value of $table if three consecutive breaches are seen - another alert notification will be triggered for the same; with alert service automatically sorting the values in one plot/entity (as in Orange) by time.

Now suppose, metric measurement log alert rule was modified and query was `search *| summarize AggregatedValue = count() by bin(timestamp, 1h)` with rest of the config remaining same as before including alert logic for three consecutive breaches. "Aggregate Upon" option in this case will be by default: timestamp. Since only one value is provided in query for summarize…by (that is) timestamp; similar to earlier example, at end of execution the output would be as illustrated below. 

   ![Metric Measurement query execution with singular value](./media/monitor-alerts-unified/LogMMtimestamp.png)

As “Aggregate Upon” is timestamp – the data is sorted on timestamp column (as in RED); then we group by timestamp – for example: values for `2018-10-17T06:00:00Z` will be considered as one plot/entity (as highlighted in Orange). In this value plot/entity – alert service will find no consecutive breaches occurring (as each timestamp value has only one entry) and hence alert will never get triggered. Hence in such case, user must either -
- Add a dummy variable or an existing variable (like $table) to correctly sorting done using "Aggregate Upon" field configured
- (Or) reconfigure alert rule to use alert logic based on *total breach* instead appropriately
 
## Log alert fired unnecessarily
Detailed next are some common reasons why a configured [log alert rule in Azure Monitor](alert-log.md) may be triggered when viewed in [Azure Alerts](monitoring-alerts-managing-alert-states.md), when you don't expect it to be fired.

### Alert triggered by partial data
Analytics powering Log Analytics and Application Insights are subject to ingestion delays and processing; due to which, at the time when provided log alert query is run - there may be a case of no data being available or only some data being available. For more information, see [Data ingestion time in Log Analytics](../log-analytics/log-analytics-data-ingestion-time.md).

Depending on how the alert rule is configured, there may be mis-firing in case there is no or partial data in Logs at the time of alert execution. In such cases, it is advised that alert query or config is changed. *For example, if the log alert rule is configured to trigger when number of results from analytics query is less than (say) 5; then when there is no data (zero record) or partial results (one record) the alert rule will get triggered. Where-as after ingestion delay, when same query is run in Analytics the query with full data might provide result as 10 records.*

### Alert query output misunderstood
For log alerts the logic for alerting is provided by user via analytics query. The analytics query provided can employ various Big Data and Mathematical functions to create specific constructs. The alerting service will execute the customer provided query at intervals specified with data for time period specified; alerting service makes subtle changes to query provided - based on the alert type chosen and the same can be witnessed in the "Query to be executed" section in Configure signal logic screen, as illustrated below:
    ![Query to be executed](./media/monitor-alerts-unified/LogAlertPreview.png)
 
What is shown in **query to be executed** section is what log alert service will run; user can run the stated query as well as timespan via [Analytics portal](../log-analytics/log-analytics-log-search-portals.md) or [Analytics API](https://docs.microsoft.com/rest/api/loganalytics/) - if they want to understand before alert creation, what alert query output may be.
 
## Next steps

* Learn about [Log Alerts in Azure Alerts](monitor-alerts-unified-log.md)
* Learn more about [Application Insights](../application-insights/app-insights-analytics.md)
* Learn more about [Log Analytics](../log-analytics/log-analytics-queries.md). 