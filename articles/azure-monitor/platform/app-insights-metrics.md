---
title: Application Insights log-based metrics
description: This article lists metrics with supported aggregations and dimensions. The details about log-based metrics include the underlying Kusto query statements.
author: vgorbenko
services: azure-monitor
ms.service: azure-monitor
ms.topic: reference
ms.date: 06/26/2019
ms.author: vitalyg
ms.subservice: application-insights
---

# Application Insights log-based metrics

Application Insights log-based metrics let you analyze the health of your monitored apps, create powerful dashboards, and configure alerts. There are two kinds of metrics:

* [Log-based metrics](pre-aggregated-metrics-log-metrics.md#log-based-metrics) behind the scene are translated into [Kusto queries](/azure/kusto/query) from stored events.
* [Standard metrics](pre-aggregated-metrics-log-metrics.md#pre-aggregated-metrics) are stored as pre-aggregated time series.

Since *standard metrics* are pre-aggregated during collection, they have better performance at query time. This makes them a better choice on dashboard and in real-time alerting. The *log-based metrics* have more dimensions, which makes them the superior option for data analysis and ad-hoc diagnostics. Use the [namespace selector](../platform/metrics-getting-started.md#create-your-first-metric-chart) to switch between log-based and standard metrics in [metrics explorer](../platform/metrics-getting-started.md).

## Interpreting and using queries from this article

This article lists metrics with supported aggregations and dimensions. The details about log-based metrics include the underlying Kusto query statements. For convenience, each query defaults to time granularity, chart type, and, sometimes, splitting dimension that simplifies using the query in Log Analytics with no modifications.

When you plot the same metric in [metrics explorer](../platform/metrics-getting-started.md), there are no defaults - the query is dynamically adjusted based on your chart settings:

1. The selected **Time range** is translated into an additional *where timestamp...* clause to only pick the events from selected time range. For example, a chart showing data for the most recent 24 hours, the query includes *| where timestamp > ago(24 h))*.

1. The selected **Time granularity** is put into the final *summarize ... by bin(timestamp, [time grain]) clause.

1. Any selected **Filter** dimensions are translated into additional *where* clauses.

1. The selected **Split chart** dimension is translated into an extra summarize property. For example, if you split your chart by *location*, and plot using 5-minute time granularity, the *summarize* clause is summarized ... by bin(timestamp, 5 m), location*.

> [!NOTE]
> If you are new to Kusto query language, you start by copying and pasting Kusto statements into the Log Analytics query pane without making any modifications. Click **Run** to see basic chart. As you begin to understand the syntax of query language, you can start making small modifications and see the impact of your change. Exploring your own data is a great way to start realizing the full power of [Log Analytics](../log-query/get-started-portal.md) and [Azure Monitor](../overview.md).

## Availability metrics

The metrics in **Availability** category enable you to see the health of your web application as observed from points around the world. [Configure the availability tests](../app/monitor-web-app-availability.md) to start using any metrics from this category.

### Availability (availabilityResults/availabilityPercentage)
The *Availability* metric shows the percentage of the web test runs that didn't detect any issues. The lowest possible value is 0, which indicates that all of the web test runs have failed. The value of 100 means that all of the web test runs passed the validation criteria.

|Unit of measure|Supported aggregations|Supported dimensions|
|---|---|---|---|---|---|
|Percentage|Average|Run location, Test name|

```Kusto
availabilityResults 
| summarize sum(todouble(success == 1) * 100) / count() by bin(timestamp, 5m), location
| render timechart
```

### Availability test duration (availabilityResults/duration)

The *Availability test duration* metric shows how much time it took for the web test to run. For the [multi-step web tests](../app/monitor-web-app-availability.md#multi-step-web-teststhe metric reflects the total execution time of all steps.

|Unit of measure|Supported aggregations|Supported dimensions|
|---|---|---|---|---|---|
|Milliseconds|Average, Min, Max|Run location, Test name, Test result

```Kusto
availabilityResults
| where notempty(duration)
| extend availabilityResult_duration = iif(itemTybilityResult', durationtodouble(''))
| summarize sum(availabilityResult_duration)/sum(itemCount) by bin(timestamp, 5m), location
| render timechart
```

### Availability tests (availabilityResults/count)

The *Availability tests* metric reflects the count of the web tests runs by Azure Monitor.

|Unit of measure|Supported aggregations|Supported dimensions|
|---|---|---|---|---|---|
|Count|Count|Run location, Test name, Test result|

```Kusto
availabilityResults
| summarize sum(itemCount) by bin(timestamp, 5m)
| render timechart
```

## Browser metrics

The browser metrics are collected by the Application Insights SDK from the real end-user browsers. They provide great insights into your users' experience with your web app. Browser metrics are typically not sampled, which means that they provide higher precision of the usage numbers comparing to server-side metrics that might be skewed by sampling.

> [!NOTE]
> To collect browser metrics, your application must be instrumented with the [Application Insights JavaScript SDK snippet](../../azure-monitor/app/javascript.md#add-the-sdk-script-to-your-app-or-web-pages).

### Browser page load time (browserTimings/totalDuration)

|Unit of measure|Supported aggregations|Pre-aggregated dimensions|
|---|---|---|
|Milliseconds|Average, Min, Max|None|

```Kusto
browserTimings
| where notempty(td _sum = totalDuration
| extend _count = itemCount
| extend _sum = _sum * _count
| summarize sum(_sum) / sum(_count) by bin(timestamp, 5m)
| render timechart
```

### Client processing time (browserTiming/processingDuration)

|Unit of measure|Supported aggregations|Pre-aggregated dimensions|
|---|---|---|
|Milliseconds|Average, Min, Max|None|

```Kusto
browserTimings
| where notempty(processingDuration)
| extend _sum = processingDuration
| extend _count = itemCount
| extend _sum = _sum * _count
| summarize sum(_sum)/sum(_count) by bin(timestamp, 5m)
| render timechart
```

### Page load network connect time (browserTimings/networkDuration)

|Unit of measure|Supported aggregations|Pre-aggregated dimensions|
|---|---|---|
|Milliseconds|Average, Min, Max|None|

```Kusto
browserTimings
| where notempty(networkDuration)
| extend _sum = networkDuration
| extend _count = itemCount
| extend _sum = _sum * _count
| summarize sum(_sum) / sum(_count) by bin(timestamp, 5m)
| render timechart
```

### Receiving response time (browserTimings/receiveDuration)

|Unit of measure|Supported aggregations|Pre-aggregated dimensions|
|---|---|---|
|Milliseconds|Average, Min, Max|None|

```Kusto
browserTimings
| where notempty(receiveDuration)
| extend _sum = receiveDuration
| extend _count = itemCount
| extend _sum = _sum * _count
| summarize sum(_sum) / sum(_count) by bin(timestamp, 5m)
| render timechart
```

### Send request time (browserTimings/sendDuration)

|Unit of measure|Supported aggregations|Pre-aggregated dimensions|
|---|---|---|
|Milliseconds|Average, Min, Max|None|

```Kusto
browserTimings
| where notempty(sendDuration)
| extend _sum = sendDuration
| extend _count = itemCount
| extend _sum = _sum * _count
| summarize sum(_sum) / sum(_count) by bin(timestamp, 5m)
| render timechart
```

## Failure metrics

The metrics in **Failures** show problems with processing requests, dependency calls, and thrown exceptions.

### Browser exceptions (exceptions/browser)

This metric reflects the number of thrown exceptions from your application code running in browser. Only exceptions that are tracked with a ```trackException()``` Application Insights API call are included in the metric.

|Unit of measure|Supported aggregations|Pre-aggregated dimensions|Notes|
|---|---|---|---|
|Count|Count|None|Log-based version uses **Sum** aggregation|

```Kusto
exceptions
| where notempty(client_Browser)
| summarize sum(itemCount) by bin(timestamp, 5m)
| render barchart
```

### Dependency call failures (dependencies/failed)

The number of failed dependency calls.

|Unit of measure|Supported aggregations|Pre-aggregated dimensions|Notes|
|---|---|---|---|
|Count|Count|None|Log-based version uses **Sum** aggregation|

```Kusto
dependencies
| where success == 'False'
| summarize sum(itemCount) by bin(timestamp, 5m)
| render barchart
```

### Exceptions (exceptions/count)

Each time when you log an exception to Application Insights, 1. The selected **Time range** is translated into an additional *where timestamp...* clause to only pick the events from selected time range. For example, a chart showing data for the most recent 24 hours, the query includes *| where timestamp > ago(24 h))*.

1. The selected **Time granularity** is put into the final *summarize ... by bin(timestamp, [time grain]) clause.

1. Any selected **Filter** dimensions are translated into additional *where* clauses.

1. The selected **Split chart** dimension is translated into an extra summarize property. For example, if you split your chart by *location*, and plot using 5-minute time granularity, the *summarize* clause is summarized ... by bin(timestamp, 5 m), location*.

> [!NOTE]
> If you are new to Kusto query language, you start by copying and pasting Kusto statements into the Log Analytics query pane without making any modifications. Click **Run** to see basic chart. As you begin to understand the syntax of query language, you can start making small modifications and see the impact of your change. Exploring your own data is a great way to start realizing the full power of [Log Analytics](../log-query/get-started-portal.md) and [Azure Monitor](../overview.md).

## Availability metrics

The metrics in **Availability** category enable you to see the health of your web application as observed from points around the world. [Configure the availability tests](../app/monitor-web-app-availability.md) to start using any metrics from this category.

### Availability (availabilityResults/availabilityPercentage)
The *Availability* metric shows the percentage of the web test runs that didn't detect any issues. The lowest possible value is 0, which indicates that all of the web test runs have failed. The value of 100 means that all of the web test runs passed the validation criteria.

|Unit of measure|Supported aggregations|Supported dimensions|
|---|---|---|---|---|---|
|Percentage|Average|Run location, Test name|

```Kusto
availabilityResults 
| summarize sum(todouble(success == 1) * 100) / count() by bin(timestamp, 5m), location
| render timechart
```

### Availability test duration (availabilityResults/duration)

The *Availability test duration* metric shows how much time it took for the web test to run. For the [multi-step web tests](../../azure-monitor/app/monitor-web-app-availability.md#multi-step-web-tests), the metric reflects the total execution time of all steps.

|Unit of measure|Supported aggregations|Supported dimensions|
|---|---|---|---|---|---|
|Milliseconds|Average, Min, Max|Run location, Test name, Test result

```Kusto
availabilityResults
| where notempty(duration)
| extend availabilityResult_duration = iif(itemType == 'availabilityResult', duration, todouble(''))
| summarize sum(availabilityResult_duration)/sum(itemCount) by bin(timestamp, 5m), location
| render timechart
```

### Availability tests (availabilityResults/count)

The *Availability tests* metric reflects the count of the web tests runs by Azure Monitor.

|Unit of measure|Supported aggregations|Supported dimensions|
|---|---|---|---|---|---|
|Count|Count|Run location, Test name, Test result|

```Kusto
availabilityResults
| summarize sum(itemCount) by bin(timestamp, 5m)
| render timechart
```

## Browser metrics

The browser metrics are collected by the Application Insights SDK from the real end-user browsers. They provide great insights into your users' experience with your web app. Browser metrics are typically not sampled, which means that they provide higher precision of the usage numbers comparing to server-side metrics that might be skewed by sampling.

> [!NOTE]
> To collect browser metrics, your application must be instrumented with the [Application Insights JavaScript SDK snippet](../../azure-monitor/app/javascript.md#add-the-sdk-script-to-your-app-or-web-pages).

### Browser page load time (browserTimings/totalDuration)

|Unit of measure|Supported aggregations|Pre-aggregated dimensions|
|---|---|---|
|Milliseconds|Average, Min, Max|None|

```Kusto
browserTimings
| where notempty(totalDuration)
| extend _sum = totalDuration
| extend _count = itemCount
| extend _sum = _sum * _count
| summarize sum(_sum) / sum(_count) by bin(timestamp, 5m)
| render timechart
```

### Client processing time (browserTiming/processingDuration)

|Unit of measure|Supported aggregations|Pre-aggregated dimensions|
|---|---|---|
|Milliseconds|Average, Min, Max|None|

```Kusto
browserTimings
| where notempty(processingDuration)
| extend _sum = processingDuration
| extend _count = itemCount
| extend _sum = _sum * _count
| summarize sum(_sum)/sum(_count) by bin(timestamp, 5m)
| render timechart
```

### Page load network connect time (browserTimings/networkDuration)

|Unit of measure|Supported aggregations|Pre-aggregated dimensions|
|---|---|---|
|Milliseconds|Average, Min, Max|None|

```Kusto
browserTimings
| where notempty(networkDuration)
| extend _sum = networkDuration
| extend _count = itemCount
| extend _sum = _sum * _count
| summarize sum(_sum) / sum(_count) by bin(timestamp, 5m)
| render timechart
```

### Receiving response time (browserTimings/receiveDuration)

|Unit of measure|Supported aggregations|Pre-aggregated dimensions|
|---|---|---|
|Milliseconds|Average, Min, Max|None|

```Kusto
browserTimings
| where notempty(receiveDuration)
| extend _sum = receiveDuration
| extend _count = itemCount
| extend _sum = _sum * _count
| summarize sum(_sum) / sum(_count) by bin(timestamp, 5m)
| render timechart
```

### Send request time (browserTimings/sendDuration)

|Unit of measure|Supported aggregations|Pre-aggregated dimensions|
|---|---|---|
|Milliseconds|Average, Min, Max|None|

```Kusto
browserTimings
| where notempty(sendDuration)
| extend _sum = sendDuration
| extend _count = itemCount
| extend _sum = _sum * _count
| summarize sum(_sum) / sum(_count) by bin(timestamp, 5m)
| render timechart
```

## Failure metrics

The metrics in **Failures** show problems with processing requests, dependency calls, and thrown exceptions.

### Browser exceptions (exceptions/browser)

This metric reflects the number of thrown exceptions from your application code running in browser. Only exceptions that are tracked with a ```trackException()``` Application Insights API call are included in the metric.

|Unit of measure|Supported aggregations|Pre-aggregated dimensions|Notes|
|---|---|---|---|
|Count|Count|None|Log-based version uses **Sum** aggregation|

```Kusto
exceptions
| where notempty(client_Browser)
| summarize sum(itemCount) by bin(timestamp, 5m)
| render barchart
```

### Dependency call failures (dependencies/failed)

The number of failed dependency calls.

|Unit of measure|Supported aggregations|Pre-aggregated dimensions|Notes|
|---|---|---|---|
|Count|Count|None|Log-based version uses **Sum** aggregation|

```Kusto
dependencies
| where success == 'False'
| summarize sum(itemCount) by bin(timestamp, 5m)
| render barchart
```

### Exceptions (exceptions/count)

Each time when you log an exception to Application Insights, there is a cal