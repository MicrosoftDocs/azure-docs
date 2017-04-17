---
title: Application Insights Telemetry Data Model | Microsoft Docs
description: Application Insights data model overview
services: application-insights
documentationcenter: .net
author: SergeyKanzhelev
manager: azakonov

ms.service: application-insights
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.devlang: multiple
ms.topic: article
ms.date: 04/17/2017
ms.author: sergkanz

---
# Overview

Application Insights defines the telemetry data model for Application Performance Management (APM) that standardize the data collection.  and enables to define platform and language independent monitoring scenarios. Data collected by Application Insights models the typical application execution pattern:

![Application Insights Application Model](./media/application-insights-data-model/application-insights-data-model.png)

There are two types of applications — applications with an endpoint that receive external ***requests*** - Web Applications, and applications that periodically "wake up" to process data stored somewhere - WebJobs or Functions. In both cases, we'll call unique execution an ***operation***. Operation succeeds or fails through ***exception*** or it might depend on other services/storage to carry its business logic. To reflect these concepts, Application Insights data model defines three telemetry types: [Request](#request-telemetry), [exception](#exception-telemetry) and [dependency](#dependency-telemetry).

Typically, these types are defined by the application framework and are automatically collected by the SDK. For example, `ASP.NET MVC` defines the notion of a request execution in its model-view-controller plumbing – it defines when request starts and stops, dependency calls to SQL are defined by `System.Data`, and calls to HTTP endpoints are defined by `System.Net`. You can extend telemetry types collected by specific platform and framework using custom properties and measurements. However there are cases when you want to report custom telemetry. For example, you might want to implement diagnostics logging using a familiar-to-you instrumentation framework, such as `Log4Net` or `System.Diagnostics`, or you might want to capture user interaction with your service to analyze usage patterns. Application Insights recognizes three additional data types [Trace](#trace-telemetry), [Event](#event-telemetry) and [Metric](#metric-telemetry)

Application Insights telemetry model allows to correlate telemetry to the operation of which it’s a part. For example, if while processing a request you make some SQL Database calls and recorded diagnostics info, you can correlate those telemetry items by setting correlation context property. 


# Request Telemetry

Request telemetry represents the code execution triggered externally and encapsulating the logical code execution. Every request execution is identified by unique `ID` and `url` containing all the execution parameters. You can group requests by logical `name` and define the `source` of this request. Code execution can result in `success` or fail and has a certain `duration`. Both - success and failure executions may be grouped further by `resultCode`. Start time for the request telemetry defined on the envelope level.

Request telemetry supports the standard extensibility model using custom `properties` and `measurements`.

## Identity

### Name

http://apmtips.com/blog/2015/02/23/request-name-and-url/

[!INCLUDE [application-insights-data-model-request-name](../includes/application-insights-data-model-operation-name.md)]

### ID

[!INCLUDE [application-insights-data-model-request-id](../includes/application-insights-data-model-operation-id.md)]

### Url

[!INCLUDE [application-insights-data-model-request-url](../includes/application-insights-data-model-request-url.md)]

### Source

[!INCLUDE [application-insights-data-model-request-source](../includes/application-insights-data-model-request-source.md)]

## Result

### Duration

[!INCLUDE [application-insights-data-model-request-duration](../includes/application-insights-data-model-operation-duration.md)]

### Response code

http://apmtips.com/blog/2016/12/03/request-success-and-response-code/

[!INCLUDE [application-insights-data-model-request-responseCode](../includes/application-insights-data-model-request-response-code.md)]

### Success

http://apmtips.com/blog/2016/12/03/request-success-and-response-code/

[!INCLUDE [application-insights-data-model-request-success](../includes/application-insights-data-model-operation-success.md)]

## Extensibility

### Custom properties

[!INCLUDE [application-insights-data-model-properties](../includes/application-insights-data-model-properties.md)]

### Custom measurements

[!INCLUDE [application-insights-data-model-measurements](../includes/application-insights-data-model-measurements.md)]



# Dependency Telemetry

## Identity

### Name

[!INCLUDE [application-insights-data-model-request-name](../includes/application-insights-data-model-operation-name.md)]

### ID

[!INCLUDE [application-insights-data-model-request-id](../includes/application-insights-data-model-operation-id.md)]

### Data

[!INCLUDE [application-insights-data-model-request-id](../includes/application-insights-data-model-dependency-data.md)]

### Type

[!INCLUDE [application-insights-data-model-request-id](../includes/application-insights-data-model-dependency-type.md)]

### Target

[!INCLUDE [application-insights-data-model-request-id](../includes/application-insights-data-model-dependency-target.md)]

## Result

### Duration

[!INCLUDE [application-insights-data-model-request-duration](../includes/application-insights-data-model-operation-duration.md)]

### Result code

[!INCLUDE [application-insights-data-model-request-responseCode](../includes/application-insights-data-model-dependency-resultCode.md)]

### Success

[!INCLUDE [application-insights-data-model-request-success](../includes/application-insights-data-model-operation-success.md)]

## Extensibility

### Custom properties

[!INCLUDE [application-insights-data-model-properties](../includes/application-insights-data-model-properties.md)]

### Custom measurements

[!INCLUDE [application-insights-data-model-measurements](../includes/application-insights-data-model-measurements.md)]




# Exception Telemetry

TBD


# Page View Telemetry

TBD


# Page View Performance Telemetry

TBD


# Event Telemetry

Events represent a point in time action happened in the application. Typically it will be user interaction like button click, order checkout or application life cycle events like initialization or configuration update. Event name expected to be a short low cardinality string. 

Semantically events may or may now be correlated to requests. However if used properly event telemetry is more important than requests or traces as it represent business telemetry and should be a subject to separate, less aggressive sampling.

### Name

[!INCLUDE [application-insights-data-model-event-name](../includes/application-insights-data-model-event-name.md)]

## Extensibility

### Custom properties

[!INCLUDE [application-insights-data-model-properties](../includes/application-insights-data-model-properties.md)]

### Custom measurements

[!INCLUDE [application-insights-data-model-measurements](../includes/application-insights-data-model-measurements.md)]



# Trace Telemetry

### Name

[!INCLUDE [application-insights-data-model-trace-message](../includes/application-insights-data-model-trace-message.md)]

### Severity level

[!INCLUDE [application-insights-data-model-trace-severity-level](../includes/application-insights-data-model-trace-severity-level.md)]

## Extensibility

### Custom properties

[!INCLUDE [application-insights-data-model-properties](../includes/application-insights-data-model-properties.md)]

### Custom measurements

[!INCLUDE [application-insights-data-model-measurements](../includes/application-insights-data-model-measurements.md)]



# Metric Telemetry

Well-known metric names:

Metric representing system and process counters. These metrics will appear 

| **.NET Name**             | **Platform Agnostic Name** | **REST API name** | **Description**
| ------------------------- | -------------------------- | ----------------- | ---------------- 
| '\Processor(_Total)\% Processor Time' | TBD | [processorCpuPercentage](https://dev.applicationinsights.io/apiexplorer/metrics?appId=DEMO_APP&apiKey=DEMO_KEY&metricId=performanceCounters%2FprocessorCpuPercentage) | total machine CPU
| '\Memory\Available Bytes'                 | TBD | [memoryAvailableBytes](https://dev.applicationinsights.io/apiexplorer/metrics?appId=DEMO_APP&apiKey=DEMO_KEY&metricId=performanceCounters%2FmemoryAvailableBytes) | memory available on disk
| '\Process(??APP_WIN32_PROC??)\% Processor Time'   | TBD | [processCpuPercentage](https://dev.applicationinsights.io/apiexplorer/metrics?appId=DEMO_APP&apiKey=DEMO_KEY&metricId=performanceCounters%2FprocessCpuPercentage) | CPU of the process hosting the application
| '\Process(??APP_WIN32_PROC??)\Private Bytes'      | TBD | [processPrivateBytes](https://dev.applicationinsights.io/apiexplorer/metrics?appId=DEMO_APP&apiKey=DEMO_KEY&metricId=performanceCounters%2FprocessPrivateBytes) | memory used by the process hosting the application
| '\Process(??APP_WIN32_PROC??)\IO Data Bytes/sec'  | TBD | [processIOBytesPerSecond](https://dev.applicationinsights.io/apiexplorer/metrics?appId=DEMO_APP&apiKey=DEMO_KEY&metricId=performanceCounters%2FprocessIOBytesPerSecond) | rate of I/O operations run by process hosting the application
| '\ASP.NET Applications(??APP_W3SVC_PROC??)\Requests/Sec'              | TBD | [requestsPerSecond](https://dev.applicationinsights.io/apiexplorer/metrics?appId=DEMO_APP&apiKey=DEMO_KEY&metricId=performanceCounters%2FrequestsPerSecond) | rate of requests processed by application 
| '\.NET CLR Exceptions(??APP_CLR_PROC??)\# of Exceps Thrown / sec'     | TBD | [exceptionsPerSecond](https://dev.applicationinsights.io/apiexplorer/metrics?appId=DEMO_APP&apiKey=DEMO_KEY&metricId=performanceCounters%2FexceptionsPerSecond) | rate of exceptions thrown by application
| '\ASP.NET Applications(??APP_W3SVC_PROC??)\Request Execution Time'    | TBD | [requestExecutionTime](https://dev.applicationinsights.io/apiexplorer/metrics?appId=DEMO_APP&apiKey=DEMO_KEY&metricId=performanceCounters%2FrequestExecutionTime) | average requests execution time
| '\ASP.NET Applications(??APP_W3SVC_PROC??)\Requests In Application Queue' | TBD | [requestsInQueue](https://dev.applicationinsights.io/apiexplorer/metrics?appId=DEMO_APP&apiKey=DEMO_KEY&metricId=performanceCounters%2FrequestsInQueue) | number of requests waiting for the processing in a queue


### Name

[!INCLUDE [application-insights-data-model-metric-name](../includes/application-insights-data-model-metric-name.md)]

## Extensibility

### Custom properties

[!INCLUDE [application-insights-data-model-properties](../includes/application-insights-data-model-properties.md)]
