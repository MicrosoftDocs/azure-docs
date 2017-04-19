---
title: Application Insights Telemetry Data Model | Microsoft Docs
description: Application Insights data model overview
services: application-insights
documentationcenter: .net
author: SergeyKanzhelev
manager: azakonov

ms.service: application-insights
ms.workload: TBD
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

Name of the request represents code path taken to process the request. Low cardinality value to allow better grouping of requests. For HTTP requests it represents the HTTP method and URL path template like `GET /values/{id}` without the actual `id` value.

Application Insights web SDK will send request name "as is" with regards to letter case. Grouping on UI will be case sensitive so `GET /Home/Index` will be counted separately from `GET /home/INDEX` even though in many cases they will result in the same controller and action execution. The reason for that is that urls in general are [case sensitive](http://www.w3.org/TR/WD-html40-970708/htmlweb.html) and you may want to see if all `404` happened when customer were requesting the page in certain case. You can read more on request name collection by ASP.Net Web SDK in the [blog post](http://apmtips.com/blog/2015/02/23/request-name-and-url/).

Max length: 1024 characters

### ID

Identifier of a request call instance. Used for correlation between request and other telemetry items. ID should be globally unique.

Max length: 128 characters

### Url

Request URL with all query string parameters.

Max length: 2048 characters

### Source

Source of the request. Examples are the instrumentation key of the caller or the ip address of the caller.

Max length: 1024 characters

## Result

### Duration

Request duration in format: `DD.HH:MM:SS.MMMMMM`. Must be positive and less than `1000` days. This is a required field as request telemetry represents the operation with the beggining and the end.

### Response code

Result of a request execution. HTTP status code for HTTP requests. For non-HTTP it may be `HRESULT` value or exception type.

Max length: 1024 characters

### Success

Indication of successful or unsuccessful call. This is a required field and when not set explicitly to `false` - request considered to be successful. Set this value to `false` if operation was interrupted by exception or returned error result code.

For the web applications Application Insights defines request as failed when the response code is less the `400` or equal to `401`. However there are cases when this default mapping does not match the semantic of the application. Response code `404` may indicate "no records" which can be part of regular flow. It also may indicate a broken link. For the broken links you can even implement a logic that will mark broken links as failures only when those links are located on the same web page (by analyzing `urlReferrer` header value) or accessed from the company's mobile application. Similarly `301` and `302` will indicate failure when accessed from the client that doesn't support redirect.

Partially accepted content `206` may indicate a failure of an overall request. For instance, Application Insights endpoint allows to send a batch of telemetry items as a single request. It will return `206` when some items sent in request were not processed successfully. Increasing rate of `206` indicates a problem that needs to be investigated. Similar logic applies to `207` Multi-Status where the success may be the worst of separate response codes.

You can read more on request result code and status code in the [blog post](http://apmtips.com/blog/2016/12/03/request-success-and-response-code/).

## Extensibility

### Custom properties

[!INCLUDE [application-insights-data-model-properties](../includes/application-insights-data-model-properties.md)]

### Custom measurements

[!INCLUDE [application-insights-data-model-measurements](../includes/application-insights-data-model-measurements.md)]



# Dependency Telemetry

An instance of Remote Dependency represents an interaction of the monitored component with a remote component/service like SQL or an HTTP endpoint.

## Identity

### Name

Name of the command initiated with this dependency call. Low cardinality value. Examples are stored procedure name and URL path template.

### ID

Identifier of a dependency call instance. Used for correlation with the request telemetry item corresponding to this dependency call.

### Data

Command initiated by this dependency call. Examples are SQL statement and HTTP URL's with all query parameters.

### Type

Dependency type name. Very low cardinality value for logical grouping of dependencies and interpretation of other fields like commandName and resultCode. Examples are SQL, Azure table, and HTTP.

### Target

Target site of a dependency call. Examples are server name, host address.

## Result

### Duration

Request duration in format: `DD.HH:MM:SS.MMMMMM`. Must be less than `1000` days.

### Result code

Result code of a dependency call. Examples are SQL error code and HTTP status code.

### Success

Indication of successfull or unsuccessfull call.

## Extensibility

### Custom properties

[!INCLUDE [application-insights-data-model-properties](../includes/application-insights-data-model-properties.md)]

### Custom measurements

[!INCLUDE [application-insights-data-model-measurements](../includes/application-insights-data-model-measurements.md)]




# Event Telemetry

Events represent a point in time action happened in the application. Typically it will be user interaction like button click, order checkout or application life cycle events like initialization or configuration update. Event name expected to be a short low cardinality string. 

Semantically events may or may now be correlated to requests. However if used properly event telemetry is more important than requests or traces as it represent business telemetry and should be a subject to separate, less aggressive sampling.

### Name

Event name. Keep it low cardinality to allow proper grouping and useful metrics.

Max length: 512 characters

## Extensibility

### Custom properties

[!INCLUDE [application-insights-data-model-properties](../includes/application-insights-data-model-properties.md)]

### Custom measurements

[!INCLUDE [application-insights-data-model-measurements](../includes/application-insights-data-model-measurements.md)]



# Trace Telemetry

Instances of Message represent printf-like trace statements that are text-searched. Log4Net, NLog and other text-based log file entries are translated into intances of this type. The message does not have measurements.

### Message

Trace message.

Max length: 32768 characters

### Severity level

Trace severity level. Value can be `Verbose`, `Information`, `Warning`, `Error`, `Critical`.

## Extensibility

### Custom properties

[!INCLUDE [application-insights-data-model-properties](../includes/application-insights-data-model-properties.md)]



# Metric Telemetry

There are two types of metric telemetry supported by Application Insights - single measurement and pre-aggregated metric. Single measurement is just a name and value, when pre-aggregated metric specifies minimum and maximum value of the metric in the aggregation interval of time as well as standard deviation of it.

Pre-aggregated metric telemetry assumes that aggregation period was 1 minute.

There is a number of well-known metric names supported by Application Insights. 


Metric representing system and process counters. These metrics will appear:

| **.NET Name**             | **Platform Agnostic Name** | **REST API name** | **Description**
| ------------------------- | -------------------------- | ----------------- | ---------------- 
| \Processor(_Total)\% Processor Time | Work in progress... | [processorCpuPercentage](https://dev.applicationinsights.io/apiexplorer/metrics?appId=DEMO_APP&apiKey=DEMO_KEY&metricId=performanceCounters%2FprocessorCpuPercentage) | total machine CPU
| \Memory\Available Bytes                 | Work in progress... | [memoryAvailableBytes](https://dev.applicationinsights.io/apiexplorer/metrics?appId=DEMO_APP&apiKey=DEMO_KEY&metricId=performanceCounters%2FmemoryAvailableBytes) | memory available on disk
| \Process(??APP_WIN32_PROC??)\% Processor Time  | Work in progress... | [processCpuPercentage](https://dev.applicationinsights.io/apiexplorer/metrics?appId=DEMO_APP&apiKey=DEMO_KEY&metricId=performanceCounters%2FprocessCpuPercentage) | CPU of the process hosting the application
| \Process(??APP_WIN32_PROC??)\Private Bytes      | Work in progress... | [processPrivateBytes](https://dev.applicationinsights.io/apiexplorer/metrics?appId=DEMO_APP&apiKey=DEMO_KEY&metricId=performanceCounters%2FprocessPrivateBytes) | memory used by the process hosting the application
| \Process(??APP_WIN32_PROC??)\IO Data Bytes/sec | Work in progress... | [processIOBytesPerSecond](https://dev.applicationinsights.io/apiexplorer/metrics?appId=DEMO_APP&apiKey=DEMO_KEY&metricId=performanceCounters%2FprocessIOBytesPerSecond) | rate of I/O operations run by process hosting the application
| \ASP.NET Applications(??APP_W3SVC_PROC??)\Requests/Sec             | Work in progress... | [requestsPerSecond](https://dev.applicationinsights.io/apiexplorer/metrics?appId=DEMO_APP&apiKey=DEMO_KEY&metricId=performanceCounters%2FrequestsPerSecond) | rate of requests processed by application 
| \.NET CLR Exceptions(??APP_CLR_PROC??)\# of Exceps Thrown / sec    | Work in progress... | [exceptionsPerSecond](https://dev.applicationinsights.io/apiexplorer/metrics?appId=DEMO_APP&apiKey=DEMO_KEY&metricId=performanceCounters%2FexceptionsPerSecond) | rate of exceptions thrown by application
| \ASP.NET Applications(??APP_W3SVC_PROC??)\Request Execution Time   | Work in progress... | [requestExecutionTime](https://dev.applicationinsights.io/apiexplorer/metrics?appId=DEMO_APP&apiKey=DEMO_KEY&metricId=performanceCounters%2FrequestExecutionTime) | average requests execution time
| \ASP.NET Applications(??APP_W3SVC_PROC??)\Requests In Application Queue | Work in progress... | [requestsInQueue](https://dev.applicationinsights.io/apiexplorer/metrics?appId=DEMO_APP&apiKey=DEMO_KEY&metricId=performanceCounters%2FrequestsInQueue) | number of requests waiting for the processing in a queue


### Name

Name of the metric you'd like to see in Application Insights portal and UI. 

### Value

Single value for measurement. Sum of individual measurements for the aggregation.

### Count

Metric weight of the aggregated metric. Should not be set for a measurement.

### Min

Minimum value of the aggregated metric. Should not be set for a measurement.

### Max

Maximum value of the aggregated metric. Should not be set for a measurement.

### Standard deviation

Standard deviation of the aggregated metric. Should not be set for a measurement.

## Extensibility

### Custom properties

[!INCLUDE [application-insights-data-model-properties](../includes/application-insights-data-model-properties.md)]


# Exception Telemetry

Work in progress...


# Page View Telemetry

Work in progress...


# Page View Performance Telemetry

Work in progress...

