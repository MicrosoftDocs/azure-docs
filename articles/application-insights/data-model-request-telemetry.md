---
title: Application Insights Telemetry Data Model - Request Telemetry | Microsoft Docs
description: Application Insights data model for request telemetry
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
# Request Telemetry

Request telemetry represents the code execution triggered externally and encapsulating the logical code execution. Every request execution is identified by unique `ID` and `url` containing all the execution parameters. You can group requests by logical `name` and define the `source` of this request. Code execution can result in `success` or fail and has a certain `duration`. Both - success and failure executions may be grouped further by `resultCode`. Start time for the request telemetry defined on the envelope level.

Request telemetry supports the standard extensibility model using custom `properties` and `measurements`.

## Identity

### Name

Name of the request represents code path taken to process the request. Low cardinality value to allow better grouping of requests. For HTTP requests it represents the HTTP method and URL path template like `GET /values/{id}` without the actual `id` value.

Application Insights web SDK will send request name "as is" with regards to letter case. Grouping on UI will be case sensitive so `GET /Home/Index` will be counted separately from `GET /home/INDEX` even though in many cases they will result in the same controller and action execution. The reason for that is that urls in general are [case sensitive](http://www.w3.org/TR/WD-html40-970708/htmlweb.html) and you may want to see if all `404` happened when customer were requesting the page in certain case. You can read more on request name collection by ASP.Net Web SDK in the [blog post](http://apmtips.com/blog/2015/02/23/request-name-and-url/).

Max length: 1024 characters

### ID

Identifier of a request call instance. Used for correlation between request and other telemetry items. ID should be globally unique. See [correlation](/correlation) page for more information.

Max length: 128 characters

### Url

Request URL with all query string parameters.

Max length: 2048 characters

### Source

Source of the request. Examples are the instrumentation key of the caller or the ip address of the caller. See [correlation](/correlation) page for more information.

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
