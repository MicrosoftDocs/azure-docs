---
title: Azure Application Insights Telemetry Data Model - Metric Telemetry | Microsoft Docs
description: Application Insights data model for metric telemetry
services: application-insights
documentationcenter: .net
author: SergeyKanzhelev
manager: carmonm

ms.service: application-insights
ms.workload: TBD
ms.tgt_pltfrm: ibiza
ms.devlang: multiple
ms.topic: article
ms.date: 04/25/2017
ms.author: cfreeman

---
# Metric telemetry: Application Insights data model

There are two types of metric telemetry supported by [Application Insights](app-insights-overview.md): single measurement and pre-aggregated metric. Single measurement is just a name and value. Pre-aggregated metric specifies minimum and maximum value of the metric in the aggregation interval and standard deviation of it.

Pre-aggregated metric telemetry assumes that aggregation period was one minute.

There are several well-known metric names supported by Application Insights. 

Metric representing system and process counters:

| **.NET name**             | **Platform agnostic name** | **REST API name** | **Description**
| ------------------------- | -------------------------- | ----------------- | ---------------- 
| `\Processor(_Total)\% Processor Time` | Work in progress... | [processorCpuPercentage](https://dev.applicationinsights.io/apiexplorer/metrics?appId=DEMO_APP&apiKey=DEMO_KEY&metricId=performanceCounters%2FprocessorCpuPercentage) | total machine CPU
| `\Memory\Available Bytes`                 | Work in progress... | [memoryAvailableBytes](https://dev.applicationinsights.io/apiexplorer/metrics?appId=DEMO_APP&apiKey=DEMO_KEY&metricId=performanceCounters%2FmemoryAvailableBytes) | memory available on disk
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

[!INCLUDE [application-insights-data-model-properties](../../includes/application-insights-data-model-properties.md)]

## Next steps

- Learn how to use [Application Insights API for custom events and metrics](app-insights-api-custom-events-metrics.md#trackmetric).
- See [data model](application-insights-data-model.md) for Application Insights types and data model.
- Check out [platforms](app-insights-platforms.md) supported by Application Insights.
