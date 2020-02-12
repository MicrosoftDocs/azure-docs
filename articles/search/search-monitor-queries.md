---
title: Monitor query requests
titleSuffix: Azure Cognitive Search
description: Monitor query metrics for performance and throughput. Collect and analyze query string inputs in diagnostic logs.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 02/12/2020
---

# Monitor query requests in Azure Cognitive Search

This article describes metrics that reflect query performance and volumes. It also explains how to collect the input terms used in queries, which gives you a way to measure the utility and effectiveness of your search corpus.

Historical data that feeds into metrics is preserved for 30 days. To retain a longer history, or to report on operational data, be sure to enable a diagnostic setting that specifies a storage option.

> [!Tip]
> With additional client-side code and Application Insights, you can also capture clickthrough data for deeper insight into what interests the users of your application. For more information, see [Search traffic analytics](search-traffic-analytics.md).

## Query volume (QPS)

Volume is measured as **SearchQueriesPerSecond** (QPS), a built-in metric that can be reported as an average, count, minimum, or maximum values of queries that execute within a one minute window.

| Aggregation Type | Description |
|------------------|-------------|
| Average | The average number of seconds within a minute during which query execution occurred.|
| Count | The number of raw samples used to generate the metric. |
| Maximum | The highest number of search queries per second registered during a minute. |
| Minimum | The lowest number of search queries per second registered during a minute.  |
| Sum | The sum of all queries executed within the minute.  |

For example, within one minute, you might have a pattern like this: one second of high load that is the maximum for SearchQueriesPerSecond, followed by 58 seconds of average load, and finally one second with only one query, which is the minimum.

## Query performance

Service-wide, query performance is measured as search latency (how long a query takes to complete) and throttled queries that were dropped as a result of resource contention.

### Search latency

| Aggregation Type | Latency | 
|------------------|---------|
| Average | Average query duration in milliseconds. | 
| Count | The number of raw samples used to generate the metric. |
| Maximum | Longest running query in the sample. | 
| Minimum | Shortest running query in the sample.  | 
| Total | Total execution time of all queries in the sample, executing within the interval (one minute).  |

Consider the following example of Latency metrics: 86 queries were sampled, with an average duration of 23.26 milliseconds. A minimum of 0 indicates some queries were dropped. The longest running query took 1000 milliseconds to complete. Total execution time was 2 seconds.

![Latency aggregations](./media/search-monitor-usage/metrics-latency.png "Latency aggregations")

### Throttled queries

For queries that were dropped within the sampling interval, use *Total* to get the number of queries that did not execute.

| Aggregation Type | Throttling |
|------------------|-----------|
| Average |  Not applicable (shows as 0%). |
| Count | The number of raw samples used to generate the metric. |
| Maximum | Not applicable (shows as 0%). |
| Minimum | Not applicable (shows as 0%). |
| Total | Total number of queries dropped within the interval. |

## Explore metrics in the portal

For a quick look at the current numbers, the **Monitoring** tab on the service Overview page shows **Search queries per second (per search unit)** over fixed intervals measured in hours, days, and weeks, with the option of changing the aggregation from the default to another type.

For deeper exploration, open metrics explorer from the **Monitoring** menu so that you can layer, zoom in, and visualize data to explore trends or anomalies. Learn more about metrics explorer by completing this [tutorial on creating a metrics chart](https://docs.microsoft.com/azure/azure-monitor/learn/tutorial-metrics-explorer).

1. Under the Monitoring section, select **Metrics** to open the metrics explorer with the scope set to your search service.

1. Under Metric, choose one from the dropdown list and review the list of available aggregations for a preferred type. The aggregation defines how the collected values will be sampled over each time interval.

   ![Metrics explorer for QPS metric](./media/search-monitor-usage/metrics-explorer-qps.png "Metrics explorer for QPS metric")

1. In the top right corner, set the time interval.

1. Choose a visualization. The default is a line chart.

1. Layer additional aggregations by choosing **Add metric** and selecting different aggregations.

1. Zoom into an area of interest on the line chart. Put the mouse pointer at the beginning of the area, click and hold the left mouse button, drag to the other side of area, and release the button. The chart will zoom in on that time range.

## Create a metric alert

A  metric alert establishes a threshold at which you will either receive a notification or trigger a corrective action that you define in advance. 

For a search service, it's common to create a metric alert for throttled queries. If you know when queries are dropped, you can look for remedies that reduce load or increase capacity. For example, if throttled queries increase during indexing, you could postpone it until query activity subsides.

When pushing the limits of a particular replica-partition configuration, setting up alerts for query volume thresholds (QPS) is also helpful.

1. Under the Monitoring section, select **Alerts** and then click **+ New alert rule**. Make sure your search service is selected as the resource.

1. Under Condition, click **Add**.

1. Configure signal logic. For signal type, choose **metrics** and then select the signal.

1. After selecting the signal, you can use a chart to visualize historical data for an informed decision on how to proceed with setting up conditions.

1. Next, scroll down to Alert logic. For proof-of-concept, you could specify an artificially low value for testing purposes.

   ![Alert logic](./media/search-monitor-usage/alert-logic-qps.png "Alert logic")

1. Next, specify or create an Action Group. This is the response to invoke when the threshold is met. It might be a push notification or an automated response.

1. Last, specify Alert details. Name and describe the alert, assign a severity value, and specify whether to create the rule in an enabled or disabled state.

   ![Alert details](./media/search-monitor-usage/alert-details.png "Alert details")

If you specified an email notification, you will receive an email from "Microsoft Azure" with a subject line of "Azure: Activated Severity: 3 `<your rule name>`".

## Collect search term inputs

When you enable diagnostic logging, the system captures query requests in the **AzureDiagnostic** log. As a prerequisite, you must have already enabled diagnostic logging, specifying a log analytics workspace or another storage option.

1. Under the Monitoring section, select **Logs** to open up an empty query window in Log Analytics.

1. Run the following query to return query operations. The last statement excludes query strings consisting of an empty or unspecified search, which cuts down the noise in your results.

   ```
   AzureDiagnostics
    | where OperationName == "Query.Search" 
    | where Query_s != "?api-version=2019-05-06&search=*" 
   ```

1. Initially, the results consist of the full operation, with the query string collapsed inside the structure. Set the Column filter to *Query_s* to show just that column. You can now scroll through a list of query strings submitted to the service.

   ![Logged query strings](./media/search-monitor-usage/log-query-strings.png "Logged query strings")

While this technique works for ad hoc exploration, building a report lets you consolidate and present the query strings in a layout more conducive to analysis.

## Report query data

Power BI is an analytical reporting tool that you can use against log data stored in Blob storage or a Log Analytics workspace.

## Next steps

If you haven't done so already, review the fundamentals of search service monitoring to learn about the full range of oversight capabilities.

> [!div class="nextstepaction"]
> [Monitor operations and activity in Azure Cognitive Search](search-monitor-usage.md)