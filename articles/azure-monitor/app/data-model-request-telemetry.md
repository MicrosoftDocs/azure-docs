---
title: Data model for request telemetry - Azure Application Insights
description: Application Insights data model for request telemetry
ms.topic: conceptual
ms.date: 01/07/2019

ms.reviewer: sergkanz
---

# Request telemetry: Application Insights data model

A request telemetry item (in [Application Insights](../../azure-monitor/app/app-insights-overview.md)) represents the logical sequence of execution triggered by an external request to your application. Every request execution is identified by unique `ID` and `url` containing all the execution parameters. You can group requests by logical `name` and define the `source` of this request. Code execution can result in `success` or `fail` and has a certain `duration`. Both success and failure executions may be grouped further by `resultCode`. Start time for the request telemetry defined on the envelope level.

Request telemetry supports the standard extensibility model using custom `properties` and `measurements`.

## Name

Name of the request represents code path taken to process the request. Low cardinality value to allow better grouping of requests. For HTTP requests it represents the HTTP method and URL path template like `GET /values/{id}` without the actual `id` value.

Application Insights web SDK sends request name "as is" with regards to letter case. Grouping on UI is case-sensitive so `GET /Home/Index` is counted separately from `GET /home/INDEX` even though often they result in the same controller and action execution. The reason for that is that urls in general are [case-sensitive](https://www.w3.org/TR/WD-html40-970708/htmlweb.html). You may want to see if all `404` happened for the urls typed in uppercase. You can read more on request name collection by ASP.NET Web SDK in the [blog post](https://apmtips.com/blog/2015/02/23/request-name-and-url/).

Max length: 1024 characters

## ID

Identifier of a request call instance. Used for correlation between request and other telemetry items. ID should be globally unique. For more information, see [correlation](../../azure-monitor/app/correlation.md) page.

Max length: 128 characters

## Url

Request URL with all query string parameters.

Max length: 2048 characters

## Source

Source of the request. Examples are the instrumentation key of the caller or the ip address of the caller. For more information, see [correlation](../../azure-monitor/app/correlation.md) page.

Max length: 1024 characters

## Duration

Request duration in format: `DD.HH:MM:SS.MMMMMM`. Must be positive and less than `1000` days. This field is required as request telemetry represents the operation with the beginning and the end.

## Response code

Result of a request execution. HTTP status code for HTTP requests. It may be `HRESULT` value or exception type for other request types.

Max length: 1024 characters

## Success

Indication of successful or unsuccessful call. This field is required. When not set explicitly to `false` - a request is considered to be successful. Set this value to `false` if operation was interrupted by exception or returned error result code.

For the web applications, Application Insights define a request as successful when the response code is less than `400` or equal to `401`. However there are cases when this default mapping does not match the semantic of the application. Response code `404` may indicate "no records", which can be part of regular flow. It also may indicate a broken link. For the broken links, you can even implement more advanced logic. You can mark broken links as failures only when those links are located on the same site by analyzing url referrer. Or mark them as failures when accessed from the company's mobile application. Similarly `301` and `302` indicates failure when accessed from the client that doesn't support redirect.

Partially accepted content `206` may indicate a failure of an overall request. For instance, Application Insights endpoint receives a batch of telemetry items as a single request. It returns `206` when some items in the batch were not processed successfully. Increasing rate of `206` indicates a problem that needs to be investigated. Similar logic applies to `207` Multi-Status where the success may be the worst of separate response codes.

You can read more on request result code and status code in the [blog post](https://apmtips.com/blog/2016/12/03/request-success-and-response-code/).

## Custom properties

[!INCLUDE [application-insights-data-model-properties](../../../includes/application-insights-data-model-properties.md)]

## Custom measurements

[!INCLUDE [application-insights-data-model-measurements](../../../includes/application-insights-data-model-measurements.md)]

## Next steps

- [Write custom request telemetry](../../azure-monitor/app/api-custom-events-metrics.md#trackrequest)
- See [data model](data-model.md) for Application Insights types and data model.
- Learn how to [configure ASP.NET Core](../../azure-monitor/app/asp-net.md) application with Application Insights.
- Check out [platforms](../../azure-monitor/app/platforms.md) supported by Application Insights.
