---
title: Data model for metric telemetry - Azure Application Insights
description: Application Insights data model for metric telemetry
ms.topic: conceptual
ms.date: 04/25/2017

ms.reviewer: sergkanz
---

# Metric telemetry: Application Insights data model

There are two types of metric telemetry supported by [Application Insights](../../azure-monitor/app/app-insights-overview.md): single measurement and pre-aggregated metric. Single measurement is just a name and value. Pre-aggregated metric specifies minimum and maximum value of the metric in the aggregation interval and standard deviation of it.

Pre-aggregated metric telemetry assumes that aggregation period was one minute.

There are several well-known metric names supported by Application Insights. These metrics placed into performanceCounters table.

Metric representing system and process counters:

| **.NET name**             | **Platform agnostic name** | **REST API name** | **Description**
| ------------------------- | -------------------------- | ----------------- | ---------------- 
| `\Processor(_Total)\% Processor Time` | Work in progress... | [processorCpuPercentage](https://dev.applicationinsights.io/apiexplorer/metrics?appId=DEMO_APP&apiKey=DEMO_KEY&metricId=performanceCounters%2FprocessorCpuPercentage) | total machine CPU
| `\Memory\Available Bytes`                 | Work in progress... | [memoryAvailableBytes](https://dev.applicationinsights.io/apiexplorer/metrics?appId=DEMO_APP&apiKey=DEMO_KEY&metricId=performanceCounters%2FmemoryAvailableBytes) | Shows the amount of physical memory, in bytes, available to processes running on the computer. It is calculated by summing the amount of space on the zeroed, free, and standby memory lists. Free memory is ready for use; zeroed memory consists of pages of memory filled with zeros to prevent later processes from seeing data used by a previous process; standby memory is memory that has been removed from a process's working set (its physical memory) en route to disk but is still available to be recalled. See [Memory Object](https://msdn.microsoft.com/library/ms804008.aspx)
| `\Process(??APP_WIN32_PROC??)\% Processor Time` | Work in progress... | [processCpuPercentage](https://dev.applicationinsights.io/apiexplorer/metrics?appId=DEMO_APP&apiKey=DEMO_KEY&metricId=performanceCounters%2FprocessCpuPercentage) | CPU of the process hosting the application
| `\Process(??APP_WIN32_PROC??)\Private Bytes`      | Work in progress... | [processPrivateBytes](https://dev.applicationinsights.io/apiexplorer/metrics?appId=DEMO_APP&apiKey=DEMO_KEY&metricId=performanceCounters%2FprocessPrivateBytes) | memory used by the process hosting the application
| `\Process(??APP_WIN32_PROC??)\IO Data Bytes/sec` | Work in progress... | [processIOBytesPerSecond](https://dev.applicationinsights.io/apiexplorer/metrics?appId=DEMO_APP&apiKey=DEMO_KEY&metricId=performanceCounters%2FprocessIOBytesPerSecond) | rate of I/O operations runs by process hosting the application
| `\ASP.NET Applications(??APP_W3SVC_PROC??)\Requests/Sec`             | Work in progress... | [requestsPerSecond](https://dev.applicationinsights.io/apiexplorer/metrics?appId=DEMO_APP&apiKey=DEMO_KEY&metricId=performanceCounters%2FrequestsPerSecond) | rate of requests processed by application 
| `\.NET CLR Exceptions(??APP_CLR_PROC??)\# of Exceps Thrown / sec`    | Work in progress... | [exceptionsPerSecond](https://dev.applicationinsights.io/apiexplorer/metrics?appId=DEMO_APP&apiKey=DEMO_KEY&metricId=performanceCounters%2FexceptionsPerSecond) | rate of exceptions thrown by application
| `\ASP.NET Applications(??APP_W3SVC_PROC??)\Request Execution Time`   | Work in progress... | [requestExecutionTime](https://dev.applicationinsights.io/apiexplorer/metrics?appId=DEMO_APP&apiKey=DEMO_KEY&metricId=performanceCounters%2FrequestExecutionTime) | average requests execution time
| `\ASP.NET Applications(??APP_W3SVC_PROC??)\Requests In Application Queue` | Work in progress... | [requestsInQueue](https://dev.applicationinsights.io/apiexplorer/metrics?appId=DEMO_APP&apiKey=DEMO_KEY&metricId=performanceCounters%2FrequestsInQueue) | number of requests waiting for the processing in a queue

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

Metric with the custom property `CustomPerfCounter` set to `true` indicate that the metric represents the windows performance counter. These metrics placed in performanceCounters table. Not in customMetrics. Also the name of this metric is parsed to extract category, counter, and instance names.

[!INCLUDE [application-insights-data-model-properties](../../../includes/application-insights-data-model-properties.md)]

## Next steps

- Learn how to use [Application Insights API for custom events and metrics](../../azure-monitor/app/api-custom-events-metrics.md#trackmetric).
- See [data model](data-model.md) for Application Insights types and data model.
- Check out [platforms](../../azure-monitor/app/platforms.md) supported by Application Insights.
