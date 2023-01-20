---
title: Data model for metric telemetry - Azure Application Insights
description: Application Insights data model for metric telemetry
ms.topic: conceptual
ms.date: 04/25/2017
ms.reviewer: vitalyg
---

# Metric telemetry: Application Insights data model

There are two types of metric telemetry supported by [Application Insights](./app-insights-overview.md): single measurement and pre-aggregated metric. Single measurement is just a name and value. Pre-aggregated metric specifies minimum and maximum value of the metric in the aggregation interval and standard deviation of it.

Pre-aggregated metric telemetry assumes that aggregation period was one minute.

There are several well-known metric names supported by Application Insights. These metrics placed into performanceCounters table.

Metric representing system and process counters:

| **.NET name**             | **Platform agnostic name** | **Description**
| ------------------------- | -------------------------- | ---------------- 
| `\Processor(_Total)\% Processor Time` | Work in progress... | total machine CPU
| `\Memory\Available Bytes`                 | Work in progress... | Shows the amount of physical memory, in bytes, available to processes running on the computer. It is calculated by summing the amount of space on the zeroed, free, and standby memory lists. Free memory is ready for use; zeroed memory consists of pages of memory filled with zeros to prevent later processes from seeing data used by a previous process; standby memory is memory that has been removed from a process's working set (its physical memory) en route to disk but is still available to be recalled. See [Memory Object](/previous-versions/ms804008(v=msdn.10))
| `\Process(??APP_WIN32_PROC??)\% Processor Time` | Work in progress... | CPU of the process hosting the application
| `\Process(??APP_WIN32_PROC??)\Private Bytes`      | Work in progress... | memory used by the process hosting the application
| `\Process(??APP_WIN32_PROC??)\IO Data Bytes/sec` | Work in progress... | rate of I/O operations runs by process hosting the application
| `\ASP.NET Applications(??APP_W3SVC_PROC??)\Requests/Sec`             | Work in progress... | rate of requests processed by application 
| `\.NET CLR Exceptions(??APP_CLR_PROC??)\# of Exceps Thrown / sec`    | Work in progress... | rate of exceptions thrown by application
| `\ASP.NET Applications(??APP_W3SVC_PROC??)\Request Execution Time`   | Work in progress... | average requests execution time
| `\ASP.NET Applications(??APP_W3SVC_PROC??)\Requests In Application Queue` | Work in progress... | number of requests waiting for the processing in a queue

See [Metrics - Get](/rest/api/application-insights/metrics/get) for more information on the Metrics REST API.

## Name

Name of the metric you'd like to see in Application Insights portal and UI. 

## Value

Single value for measurement. Sum of individual measurements for the aggregation.

## Count

Metric weight of the aggregated metric. Should not be set for a measurement.

## Min

Minimum value of the aggregated metric. Should not be set for a measurement.

## Max

Maximum value of the aggregated metric. Should not be set for a measurement.

## Standard deviation

Standard deviation of the aggregated metric. Should not be set for a measurement.

## Custom properties

Metric with the custom property `CustomPerfCounter` set to `true` indicate that the metric represents the Windows performance counter. These metrics placed in performanceCounters table. Not in customMetrics. Also the name of this metric is parsed to extract category, counter, and instance names.

[!INCLUDE [application-insights-data-model-properties](../../../includes/application-insights-data-model-properties.md)]

## Next steps

- Learn how to use [Application Insights API for custom events and metrics](./api-custom-events-metrics.md#trackmetric).
- See [data model](data-model.md) for Application Insights types and data model.
- Check out [platforms](./app-insights-overview.md#supported-languages) supported by Application Insights.
