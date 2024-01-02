---
title: Application Insights telemetry data model
description: This article describes the Application Insights telemetry data model including request, dependency, exception, trace, event, metric, PageView, and context.
services: application-insights
documentationcenter: .net
manager: carmonm
ms.workload: TBD
ms.tgt_pltfrm: ibiza
ms.topic: conceptual
ms.date: 09/25/2023
ms.reviewer: mmcc
---
# Application Insights telemetry data model

[Application Insights](./app-insights-overview.md) sends telemetry from your web application to the Azure portal so that you can analyze the performance and usage of your application. The telemetry model is standardized, so it's possible to create platform- and language-independent monitoring.

Data collected by Application Insights models this typical application execution pattern.

:::image type="content" source="./media/data-model-complete/application-insights-data-model.png" lightbox="./media/data-model-complete/application-insights-data-model.png" alt-text="Diagram that shows an Application Insights telemetry data model.":::

The following types of telemetry are used to monitor the execution of your app. The Application Insights SDK from the web application framework automatically collects these three types:

* [Request](#request): Generated to log a request received by your app. For example, the Application Insights web SDK automatically generates a Request telemetry item for each HTTP request that your web app receives.

    An *operation* is made up of the threads of execution that process a request. You can also [write code](./api-custom-events-metrics.md#trackrequest) to monitor other types of operation, such as a "wake up" in a web job or function that periodically processes data. Each operation has an ID. The ID can be used to [group](distributed-tracing-telemetry-correlation.md) all telemetry generated while your app is processing the request. Each operation either succeeds or fails and has a duration of time.
* [Exception](#exception): Typically represents an exception that causes an operation to fail.
* [Dependency](#dependency): Represents a call from your app to an external service or storage, such as a REST API or SQL. In ASP.NET, dependency calls to SQL are defined by `System.Data`. Calls to HTTP endpoints are defined by `System.Net`.

Application Insights provides three data types for custom telemetry:

* [Trace](#trace): Used either directly or through an adapter to implement diagnostics logging by using an instrumentation framework that's familiar to you, such as `Log4Net` or `System.Diagnostics`.
* [Event](#event): Typically used to capture user interaction with your service to analyze usage patterns.
* [Metric](#metric): Used to report periodic scalar measurements.

Every telemetry item can define the [context information](#context) like application version or user session ID. Context is a set of strongly typed fields that unblocks certain scenarios. When application version is properly initialized, Application Insights can detect new patterns in application behavior correlated with redeployment.

You can use session ID to calculate an outage or an issue impact on users. Calculating the distinct count of session ID values for a specific failed dependency, error trace, or critical exception gives you a good understanding of an impact.

The Application Insights telemetry model defines a way to [correlate](distributed-tracing-telemetry-correlation.md) telemetry to the operation of which it's a part. For example, a request can make a SQL Database call and record diagnostics information. You can set the correlation context for those telemetry items that tie it back to the request telemetry.

## Schema improvements

The Application Insights data model is a basic yet powerful way to model your application telemetry. We strive to keep the model simple and slim to support essential scenarios and allow the schema to be extended for advanced use.

To report data model or schema problems and suggestions, use our [GitHub repository](https://github.com/microsoft/ApplicationInsights-dotnet/issues/new/choose).

## Request

A request telemetry item in [Application Insights](./app-insights-overview.md) represents the logical sequence of execution triggered by an external request to your application. Every request execution is identified by a unique `id` and `url` that contain all the execution parameters.

You can group requests by logical `name` and define the `source` of this request. Code execution can result in `success` or `fail` and has a certain `duration`. You can further group success and failure executions by using `resultCode`. Start time for the request telemetry is defined on the envelope level.

Request telemetry supports the standard extensibility model by using custom `properties` and `measurements`.

[!INCLUDE [azure-monitor-log-analytics-rebrand](../../../includes/azure-monitor-instrumentation-key-deprecation.md)]

### Name

This field is the name of the request and it represents the code path taken to process the request. A low cardinality value allows for better grouping of requests. For HTTP requests, it represents the HTTP method and URL path template like `GET /values/{id}` without the actual `id` value.

The Application Insights web SDK sends a request name "as is" about letter case. Grouping on the UI is case sensitive, so `GET /Home/Index` is counted separately from `GET /home/INDEX` even though often they result in the same controller and action execution. The reason for that is that URLs in general are [case sensitive](https://www.w3.org/TR/WD-html40-970708/htmlweb.html). You might want to see if all `404` errors happened for URLs typed in uppercase. You can read more about request name collection by the ASP.NET web SDK in the [blog post](https://apmtips.com/posts/2015-02-23-request-name-and-url/).

**Maximum length:** 1,024 characters

### ID

ID is the identifier of a request call instance. It's used for correlation between the request and other telemetry items. The ID should be globally unique. For more information, see [Telemetry correlation in Application Insights](distributed-tracing-telemetry-correlation.md).

**Maximum length:** 128 characters

### URL

URL is the request URL with all query string parameters.

**Maximum length:** 2,048 characters

### Source

Source is the source of the request. Examples are the instrumentation key of the caller or the IP address of the caller. For more information, see [Telemetry correlation in Application Insights](distributed-tracing-telemetry-correlation.md).

**Maximum length:** 1,024 characters

### Duration

The request duration is formatted as `DD.HH:MM:SS.MMMMMM`. It must be positive and less than `1000` days. This field is required because request telemetry represents the operation with the beginning and the end.

### Response code

The response code is the result of a request execution. It's the HTTP status code for HTTP requests. It might be an `HRESULT` value or an exception type for other request types.

**Maximum length:** 1,024 characters

### Success

Success indicates whether a call was successful or unsuccessful. This field is required. When a request isn't set explicitly to `false`, it's considered to be successful. If an exception or returned error result code interrupted the operation, set this value to `false`.

For web applications, Application Insights defines a request as successful when the response code is less than `400` or equal to `401`. However, there are cases when this default mapping doesn't match the semantics of the application.

Response code `404` might indicate "no records," which can be part of regular flow. It also might indicate a broken link. For broken links, you can implement more advanced logic. You can mark broken links as failures only when those links are located on the same site by analyzing the URL referrer. Or you can mark them as failures when they're accessed from the company's mobile application. Similarly, `301` and `302` indicate failure when they're accessed from the client that doesn't support redirect.

Partially accepted content `206` might indicate a failure of an overall request. For instance, an Application Insights endpoint might receive a batch of telemetry items as a single request. It returns `206` when some items in the batch weren't processed successfully. An increasing rate of `206` indicates a problem that needs to be investigated. Similar logic applies to `207` Multi-Status, where the success might be the worst of separate response codes.

### Custom properties

[!INCLUDE [application-insights-data-model-properties](../../../includes/application-insights-data-model-properties.md)]

### Custom measurements

[!INCLUDE [application-insights-data-model-measurements](../../../includes/application-insights-data-model-measurements.md)]

## Dependency

Dependency telemetry (in [Application Insights](./app-insights-overview.md)) represents an interaction of the monitored component with a remote component such as SQL or an HTTP endpoint.

### Name

This field is the name of the command initiated with this dependency call. It has a low cardinality value. Examples are stored procedure name and URL path template.

### ID

ID is the identifier of a dependency call instance. It's used for correlation with the request telemetry item that corresponds to this dependency call. For more information, see [Telemetry correlation in Application Insights](distributed-tracing-telemetry-correlation.md).

### Data

This field is the command initiated by this dependency call. Examples are SQL statement and HTTP URL with all query parameters.

### Type

This field is the dependency type name. It has a low cardinality value for logical grouping of dependencies and interpretation of other fields like `commandName` and `resultCode`. Examples are SQL, Azure table, and HTTP.

### Target

This field is the target site of a dependency call. Examples are server name and host address. For more information, see [Telemetry correlation in Application Insights](distributed-tracing-telemetry-correlation.md).

### Duration

The request duration is in the format `DD.HH:MM:SS.MMMMMM`. It must be less than `1000` days.

### Result code

This field is the result code of a dependency call. Examples are SQL error code and HTTP status code.

### Success

This field is the indication of a successful or unsuccessful call.

### Custom properties

[!INCLUDE [application-insights-data-model-properties](../../../includes/application-insights-data-model-properties.md)]

### Custom measurements

[!INCLUDE [application-insights-data-model-measurements](../../../includes/application-insights-data-model-measurements.md)]

## Exception

In [Application Insights](./app-insights-overview.md), an instance of exception represents a handled or unhandled exception that occurred during execution of the monitored application.

### Problem ID

The problem ID identifies where the exception was thrown in code. It's used for exceptions grouping. Typically, it's a combination of an exception type and a function from the call stack.

**Maximum length:** 1,024 characters

### Severity level

This field is the trace severity level. The value can be `Verbose`, `Information`, `Warning`, `Error`, or `Critical`.

### Exception details

(To be extended)

### Custom properties

[!INCLUDE [application-insights-data-model-properties](../../../includes/application-insights-data-model-properties.md)]

### Custom measurements

[!INCLUDE [application-insights-data-model-measurements](../../../includes/application-insights-data-model-measurements.md)]

## Trace

Trace telemetry in [Application Insights](./app-insights-overview.md) represents `printf`-style trace statements that are text searched. `Log4Net`, `NLog`, and other text-based log file entries are translated into instances of this type. The trace doesn't have measurements as an extensibility.

### Message

Trace message.

**Maximum length:** 32,768 characters

### Severity level

Trace severity level.

**Values:** `Verbose`, `Information`, `Warning`, `Error`, and `Critical`

### Custom properties

[!INCLUDE [application-insights-data-model-properties](../../../includes/application-insights-data-model-properties.md)]

## Event

You can create event telemetry items (in [Application Insights](./app-insights-overview.md)) to represent an event that occurred in your application. Typically, it's a user interaction such as a button click or an order checkout. It can also be an application lifecycle event like initialization or a configuration update.

Semantically, events might or might not be correlated to requests. If used properly, event telemetry is more important than requests or traces. Events represent business telemetry and should be subject to separate, less aggressive [sampling](./api-filtering-sampling.md).

### Name

**Event name:** To allow proper grouping and useful metrics, restrict your application so that it generates a few separate event names. For example, don't use a separate name for each generated instance of an event.

**Maximum length:** 512 characters

### Custom properties

[!INCLUDE [application-insights-data-model-properties](../../../includes/application-insights-data-model-properties.md)]

### Custom measurements

[!INCLUDE [application-insights-data-model-measurements](../../../includes/application-insights-data-model-measurements.md)]

## Metric

[Application Insights](./app-insights-overview.md) supports two types of metric telemetry: single measurement and preaggregated metric. Single measurement is just a name and value. Preaggregated metric specifies the minimum and maximum value of the metric in the aggregation interval and the standard deviation of it.

Preaggregated metric telemetry assumes that the aggregation period was one minute.

Application Insights supports several well-known metric names. These metrics are placed into the `performanceCounters` table.

The following table shows the metrics that represent system and process counters.

| .NET name            | Platform-agnostic name | Description
| ------------------------- | -------------------------- | ----------------
| `\Processor(_Total)\% Processor Time` | Work in progress... | Total machine CPU.
| `\Memory\Available Bytes`                 | Work in progress... | Shows the amount of physical memory, in bytes, available to processes running on the computer. It's calculated by summing the amount of space on the zeroed, free, and standby memory lists. Free memory is ready for use. Zeroed memory consists of pages of memory filled with zeros to prevent later processes from seeing data used by a previous process. Standby memory is memory that's been removed from a process's working set (its physical memory) en route to disk but is still available to be recalled. See [Memory Object](/previous-versions/ms804008(v=msdn.10)).
| `\Process(??APP_WIN32_PROC??)\% Processor Time` | Work in progress... | CPU of the process hosting the application.
| `\Process(??APP_WIN32_PROC??)\Private Bytes`      | Work in progress... | Memory used by the process hosting the application.
| `\Process(??APP_WIN32_PROC??)\IO Data Bytes/sec` | Work in progress... | Rate of I/O operations run by the process hosting the application.
| `\ASP.NET Applications(??APP_W3SVC_PROC??)\Requests/Sec`             | Work in progress... | Rate of requests processed by an application.
| `\.NET CLR Exceptions(??APP_CLR_PROC??)\# of Exceps Thrown / sec`    | Work in progress... | Rate of exceptions thrown by an application.
| `\ASP.NET Applications(??APP_W3SVC_PROC??)\Request Execution Time`   | Work in progress... | Average request execution time.
| `\ASP.NET Applications(??APP_W3SVC_PROC??)\Requests In Application Queue` | Work in progress... | Number of requests waiting for the processing in a queue.

For more information on the Metrics REST API, see [Metrics - Get](/rest/api/application-insights/metrics/get).

### Name

This field is the name of the metric you want to see in the Application Insights portal and UI.

### Value

This field is the single value for measurement. It's the sum of individual measurements for the aggregation.

### Count

This field is the metric weight of the aggregated metric. It shouldn't be set for a measurement.

### Min

This field is the minimum value of the aggregated metric. It shouldn't be set for a measurement.

### Max

This field is the maximum value of the aggregated metric. It shouldn't be set for a measurement.

### Standard deviation

This field is the standard deviation of the aggregated metric. It shouldn't be set for a measurement.

### Custom properties

The metric with the custom property `CustomPerfCounter` set to `true` indicates that the metric represents the Windows performance counter. These metrics are placed in the `performanceCounters` table, not in `customMetrics`. Also, the name of this metric is parsed to extract category, counter, and instance names.

[!INCLUDE [application-insights-data-model-properties](../../../includes/application-insights-data-model-properties.md)]

## PageView

PageView telemetry (in [Application Insights](./app-insights-overview.md)) is logged when an application user opens a new page of a monitored application. The `Page` in this context is a logical unit that's defined by the developer to be an application tab or a screen and isn't necessarily correlated to a browser webpage load or a refresh action. This distinction can be further understood in the context of single-page applications (SPAs), where the switch between pages isn't tied to browser page actions. The [`pageViews.duration`](/azure/azure-monitor/reference/tables/pageviews) is the time it takes for the application to present the page to the user.

> [!NOTE]
> * By default, Application Insights SDKs log single `PageView` events on each browser webpage load action, with [`pageViews.duration`](/azure/azure-monitor/reference/tables/pageviews) populated by [browser timing](#measure-browsertiming-in-application-insights). Developers can extend additional tracking of `PageView` events by using the [trackPageView API call](./api-custom-events-metrics.md#page-views).
> * The default logs retention is 30 days. If you want to view `PageView` statistics over a longer period of time, you must adjust the setting.

### Measure browserTiming in Application Insights

Modern browsers expose measurements for page load actions with the [Performance API](https://developer.mozilla.org/en-US/docs/Web/API/Performance_API). Application Insights simplifies these measurements by consolidating related timings into [standard browser metrics](../essentials/metrics-supported.md#microsoftinsightscomponents) as defined by these processing time definitions:

* **Client <--> DNS**: Client reaches out to DNS to resolve website hostname, and DNS responds with the IP address.
* **Client <--> Web Server**: Client creates TCP and then TLS handshakes with the web server.
* **Client <--> Web Server**: Client sends request payload, waits for the server to execute the request, and receives the first response packet.
* **Client <--Web Server**: Client receives the rest of the response payload bytes from the web server.
* **Client**: Client now has full response payload and has to render contents into the browser and load the DOM.

* `browserTimings/networkDuration` = #1 + #2
* `browserTimings/sendDuration` = #3
* `browserTimings/receiveDuration` = #4
* `browserTimings/processingDuration` = #5
* `browsertimings/totalDuration` = #1 + #2 + #3 + #4 + #5
* `pageViews/duration`
   * The `PageView` duration is from the browser's performance timing interface, [`PerformanceNavigationTiming.duration`](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceEntry/duration).
   * If `PerformanceNavigationTiming` is available, that duration is used.
     
     If it's not, the *deprecated* [`PerformanceTiming`](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceTiming) interface is used and the delta between [`NavigationStart`](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceTiming/navigationStart) and [`LoadEventEnd`](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceTiming/loadEventEnd) is calculated.
   * The developer specifies a duration value when logging custom `PageView` events by using the [trackPageView API call](./api-custom-events-metrics.md#page-views).

:::image type="content" source="./media/javascript/page-view-load-time.png" alt-text="Screenshot that shows the Metrics page in Application Insights showing graphic displays of metrics data for a web application." lightbox="./media/javascript/page-view-load-time.png" border="false":::

## Context

Every telemetry item might have a strongly typed context field. Every field enables a specific monitoring scenario. Use the custom properties collection to store custom or application-specific contextual information.

### Application version

Information in the application context fields is always about the application that's sending the telemetry. The application version is used to analyze trend changes in the application behavior and its correlation to the deployments.

**Maximum length:** 1,024

### Client IP address

This field is the IP address of the client device. IPv4 and IPv6 are supported. When telemetry is sent from a service, the location context is about the user who initiated the operation in the service. Application Insights extract the geo-location information from the client IP and then truncate it. The client IP by itself can't be used as user identifiable information.

**Maximum length:** 46

### Device type

Originally, this field was used to indicate the type of the device the user of the application is using. Today it's used primarily to distinguish JavaScript telemetry with the device type `Browser` from server-side telemetry with the device type `PC`.

**Maximum length:** 64

### Operation ID

This field is the unique identifier of the root operation. This identifier allows grouping telemetry across multiple components. For more information, see [Telemetry correlation](distributed-tracing-telemetry-correlation.md). Either a request or a page view creates the operation ID. All other telemetry sets this field to the value for the containing request or page view.

**Maximum length:** 128

### Parent operation ID

This field is the unique identifier of the telemetry item's immediate parent. For more information, see [Telemetry correlation](distributed-tracing-telemetry-correlation.md).

**Maximum length:** 128

### Operation name

This field is the name (group) of the operation. Either a request or a page view creates the operation name. All other telemetry items set this field to the value for the containing request or page view. The operation name is used for finding all the telemetry items for a group of operations (for example, `GET Home/Index`). This context property is used to answer questions like What are the typical exceptions thrown on this page?

**Maximum length:** 1,024

### Synthetic source of the operation

This field is the name of the synthetic source. Some telemetry from the application might represent synthetic traffic. It might be the web crawler indexing the website, site availability tests, or traces from diagnostic libraries like the Application Insights SDK itself.

**Maximum length:** 1,024

### Session ID

Session ID is the instance of the user's interaction with the app. Information in the session context fields is always about the user. When telemetry is sent from a service, the session context is about the user who initiated the operation in the service.

**Maximum length:** 64

### Anonymous user ID

The anonymous user ID (User.Id) represents the user of the application. When telemetry is sent from a service, the user context is about the user who initiated the operation in the service.

[Sampling](./sampling.md) is one of the techniques to minimize the amount of collected telemetry. A sampling algorithm attempts to either sample in or out all the correlated telemetry. An anonymous user ID is used for sampling score generation, so an anonymous user ID should be a random-enough value.

> [!NOTE]
> The count of anonymous user IDs isn't the same as the number of unique application users. The count of anonymous user IDs is typically higher because each time the user opens your app on a different device or browser, or cleans up browser cookies, a new unique anonymous user ID is allocated. This calculation might result in counting the same physical users multiple times.

User IDs can be cross-referenced with session IDs to provide unique telemetry dimensions and establish user activity over a session duration.

Using an anonymous user ID to store a username is a misuse of the field. Use an authenticated user ID.

**Maximum length:** 128

### Authenticated user ID

An authenticated user ID is the opposite of an anonymous user ID. This field represents the user with a friendly name. This ID is only collected by default with the ASP.NET Framework SDK's [`AuthenticatedUserIdTelemetryInitializer`](https://github.com/microsoft/ApplicationInsights-dotnet/blob/develop/WEB/Src/Web/Web/AuthenticatedUserIdTelemetryInitializer.cs).

Use the Application Insights SDK to initialize the authenticated user ID with a value that identifies the user persistently across browsers and devices. In this way, all telemetry items are attributed to that unique ID. This ID enables querying for all telemetry collected for a specific user (subject to [sampling configurations](./sampling.md) and [telemetry filtering](./api-filtering-sampling.md)).

User IDs can be cross-referenced with session IDs to provide unique telemetry dimensions and establish user activity over a session duration.

**Maximum length:** 1,024

### Account ID

The account ID, in multitenant applications, is the tenant account ID or name that the user is acting with. It's used for more user segmentation when a user ID and an authenticated user ID aren't sufficient. Examples might be a subscription ID for the Azure portal or the blog name for a blogging platform.

**Maximum length:** 1,024

### Cloud role

This field is the name of the role of which the application is a part. It maps directly to the role name in Azure. It can also be used to distinguish micro services, which are part of a single application.

**Maximum length:** 256

### Cloud role instance

This field is the name of the instance where the application is running. For example, it's the computer name for on-premises or the instance name for Azure.

**Maximum length:** 256

### Internal: SDK version

For more information, see [SDK version](https://github.com/MohanGsk/ApplicationInsights-Home/blob/master/EndpointSpecs/SDK-VERSIONS.md).

**Maximum length:** 64

### Internal: Node name

This field represents the node name used for billing purposes. Use it to override the standard detection of nodes.

**Maximum length:** 256

## Frequently asked questions

This section provides answers to common questions.

### How would I measure the impact of a monitoring campaign?

PageView Telemetry includes URL and you could parse the UTM parameter using a regex function in Kusto.
          
Occasionally, this data might be missing or inaccurate if the user or enterprise disables sending User Agent in browser settings. The [UA Parser regexes](https://github.com/ua-parser/uap-core/blob/master/regexes.yaml) might not include all device information. Or Application Insights might not have adopted the latest updates.

### Why would a custom measurement succeed without error but the log doesn't show up?

This can occur if you're using string values. Only numeric values work with custom measurements.

## Next steps

Learn how to use the [Application Insights API for custom events and metrics](./api-custom-events-metrics.md), including:
- [Custom request telemetry](./api-custom-events-metrics.md#trackrequest)
- [Custom dependency telemetry](./api-custom-events-metrics.md#trackdependency)
- [Custom trace telemetry](./api-custom-events-metrics.md#tracktrace)
- [Custom event telemetry](./api-custom-events-metrics.md#trackevent)
- [Custom metric telemetry](./api-custom-events-metrics.md#trackmetric)

Set up dependency tracking for:
- [.NET](./asp-net-dependencies.md)
- [Java](./opentelemetry-enable.md?tabs=java)

To learn more:

- Check out [platforms](./app-insights-overview.md#supported-languages) supported by Application Insights.
- Check out standard context properties collection [configuration](./configuration-with-applicationinsights-config.md#telemetry-initializers-aspnet).
- Explore [.NET trace logs in Application Insights](./asp-net-trace-logs.md).
- Explore [Java trace logs in Application Insights](./opentelemetry-add-modify.md?tabs=java#logs).
- Learn about the [Azure Functions built-in integration with Application Insights](../../azure-functions/functions-monitoring.md?toc=/azure/azure-monitor/toc.json) to monitor functions executions.
- Learn how to [configure an ASP.NET Core](./asp-net.md) application with Application Insights.
- Learn how to [diagnose exceptions in your web apps with Application Insights](./asp-net-exceptions.md).
- Learn how to [extend and filter telemetry](./api-filtering-sampling.md).
- Use [sampling](./sampling.md) to minimize the amount of telemetry based on data model.
