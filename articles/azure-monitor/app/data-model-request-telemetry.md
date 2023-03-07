---
title: Data model for request telemetry - Application Insights
description: This article describes the Application Insights data model for request telemetry.
ms.topic: conceptual
ms.date: 01/07/2019
ms.reviewer: mmcc
---

# Request telemetry: Application Insights data model

A request telemetry item in [Application Insights](./app-insights-overview.md) represents the logical sequence of execution triggered by an external request to your application. Every request execution is identified by a unique `id` and `url` that contain all the execution parameters.

You can group requests by logical `name` and define the `source` of this request. Code execution can result in `success` or `fail` and has a certain `duration`. Both success and failure executions can be grouped further by `resultCode`. Start time for the request telemetry is defined on the envelope level.

Request telemetry supports the standard extensibility model by using custom `properties` and `measurements`.

[!INCLUDE [azure-monitor-log-analytics-rebrand](../../../includes/azure-monitor-instrumentation-key-deprecation.md)]

## Name

The name of the request represents the code path taken to process the request. A low cardinality value allows for better grouping of requests. For HTTP requests, it represents the HTTP method and URL path template like `GET /values/{id}` without the actual `id` value.

The Application Insights web SDK sends a request name "as is" about letter case. Grouping on the UI is case sensitive, so `GET /Home/Index` is counted separately from `GET /home/INDEX` even though often they result in the same controller and action execution. The reason for that is that URLs in general are [case sensitive](https://www.w3.org/TR/WD-html40-970708/htmlweb.html). You might want to see if all `404` errors happened for URLs typed in uppercase. You can read more about request name collection by the ASP.NET web SDK in the [blog post](https://apmtips.com/posts/2015-02-23-request-name-and-url/).

**Maximum length**: 1,024 characters

## ID

ID is the identifier of a request call instance. It's used for correlation between the request and other telemetry items. The ID should be globally unique. For more information, see [Telemetry correlation in Application Insights](./correlation.md).

**Maximum length**: 128 characters

## URL

URL is the request URL with all query string parameters.

**Maximum length**: 2,048 characters

## Source

Source is the source of the request. Examples are the instrumentation key of the caller or the IP address of the caller. For more information, see [Telemetry correlation in Application Insights](./correlation.md).

**Maximum length**: 1,024 characters

## Duration

The request duration is formatted as `DD.HH:MM:SS.MMMMMM`. It must be positive and less than `1000` days. This field is required because request telemetry represents the operation with the beginning and the end.

## Response code

The response code is the result of a request execution. It's the HTTP status code for HTTP requests. It might be an `HRESULT` value or an exception type for other request types.

**Maximum length**: 1,024 characters

## Success

Success indicates whether a call was successful or unsuccessful. This field is required. When a request isn't set explicitly to `false`, it's considered to be successful. Set this value to `false` if the operation was interrupted by an exception or a returned error result code.

For web applications, Application Insights defines a request as successful when the response code is less than `400` or equal to `401`. However, there are cases when this default mapping doesn't match the semantics of the application.

Response code `404` might indicate "no records," which can be part of regular flow. It also might indicate a broken link. For broken links, you can implement more advanced logic. You can mark broken links as failures only when those links are located on the same site by analyzing the URL referrer. Or you can mark them as failures when they're accessed from the company's mobile application. Similarly, `301` and `302` indicate failure when they're accessed from the client that doesn't support redirect.

Partially accepted content `206` might indicate a failure of an overall request. For instance, an Application Insights endpoint might receive a batch of telemetry items as a single request. It returns `206` when some items in the batch weren't processed successfully. An increasing rate of `206` indicates a problem that needs to be investigated. Similar logic applies to `207` Multi-Status where the success might be the worst of separate response codes.

You can read more about the request result code and status code in the [blog post](https://apmtips.com/posts/2016-12-03-request-success-and-response-code/).

## Custom properties

[!INCLUDE [application-insights-data-model-properties](../../../includes/application-insights-data-model-properties.md)]

## Custom measurements

[!INCLUDE [application-insights-data-model-measurements](../../../includes/application-insights-data-model-measurements.md)]

## Next steps

- [Write custom request telemetry](./api-custom-events-metrics.md#trackrequest).
- See the [data model](data-model.md) for Application Insights types and data models.
- Learn how to [configure an ASP.NET Core](./asp-net.md) application with Application Insights.
- Check out [platforms](./app-insights-overview.md#supported-languages) supported by Application Insights.