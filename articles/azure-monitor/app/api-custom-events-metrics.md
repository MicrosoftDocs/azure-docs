---
title: Application Insights API for custom events and metrics | Microsoft Docs
description: Insert a few lines of code in your device or desktop app, webpage, or service to track usage and diagnose issues.
ms.topic: conceptual
ms.date: 09/12/2023
ms.devlang: csharp, java, javascript, vb
ms.custom: devx-track-csharp
ms.reviewer: mmcc
---

# Application Insights API for custom events and metrics

Insert a few lines of code in your application to find out what users are doing with it, or to help diagnose issues. You can send telemetry from device and desktop apps, web clients, and web servers. Use the [Application Insights](./app-insights-overview.md) core telemetry API to send custom events and metrics and your own versions of standard telemetry. This API is the same API that the standard Application Insights data collectors use.

[!INCLUDE [azure-monitor-log-analytics-rebrand](../../../includes/azure-monitor-instrumentation-key-deprecation.md)]

## API summary

The core API is uniform across all platforms, apart from a few variations like `GetMetric` (.NET only).

| Method | Used for |
| --- | --- |
| [`TrackPageView`](#page-views) |Pages, screens, panes, or forms. |
| [`TrackEvent`](#trackevent) |User actions and other events. Used to track user behavior or to monitor performance. |
| [`GetMetric`](#getmetric) |Zero and multidimensional metrics, centrally configured aggregation, C# only. |
| [`TrackMetric`](#trackmetric) |Performance measurements such as queue lengths not related to specific events. |
| [`TrackException`](#trackexception) |Logging exceptions for diagnosis. Trace where they occur in relation to other events and examine stack traces. |
| [`TrackRequest`](#trackrequest) |Logging the frequency and duration of server requests for performance analysis. |
| [`TrackTrace`](#tracktrace) |Resource Diagnostic log messages. You can also capture third-party logs. |
| [`TrackDependency`](#trackdependency) |Logging the duration and frequency of calls to external components that your app depends on. |

You can [attach properties and metrics](#properties) to most of these telemetry calls.

## <a name="prep"></a>Before you start

If you don't have a reference on Application Insights SDK yet:

* Add the Application Insights SDK to your project:

  * [ASP.NET project](./asp-net.md)
  * [ASP.NET Core project](./asp-net-core.md)
  * [Java project](./opentelemetry-enable.md?tabs=java)
  * [Node.js project](./nodejs.md)
  * [JavaScript in each webpage](./javascript.md)
* In your device or web server code, include:

    *C#:* `using Microsoft.ApplicationInsights;`

    *Visual Basic:* `Imports Microsoft.ApplicationInsights`

    *Java:* `import com.microsoft.applicationinsights.TelemetryClient;`

    *Node.js:* `var applicationInsights = require("applicationinsights");`

## Get a TelemetryClient instance

Get an instance of `TelemetryClient` (except in JavaScript in webpages):

For [ASP.NET Core](asp-net-core.md) apps and [Non-HTTP/Worker for .NET/.NET Core](worker-service.md#how-can-i-track-telemetry-thats-not-automatically-collected) apps, get an instance of `TelemetryClient` from the dependency injection container as explained in their respective documentation.

If you use Azure Functions v2+ or Azure WebJobs v3+, see [Monitor Azure Functions](../../azure-functions/functions-monitoring.md).

*C#*

```csharp
private TelemetryClient telemetry = new TelemetryClient();
```

If you see a message that tells you this method is obsolete, see [microsoft/ApplicationInsights-dotnet#1152](https://github.com/microsoft/ApplicationInsights-dotnet/issues/1152) for more information.

*Visual Basic*

```vb
Private Dim telemetry As New TelemetryClient
```

*Java*

```java
private TelemetryClient telemetry = new TelemetryClient();
```

*Node.js*

```javascript
var telemetry = applicationInsights.defaultClient;
```

`TelemetryClient` is thread safe.

For ASP.NET and Java projects, incoming HTTP requests are automatically captured. You might want to create more instances of `TelemetryClient` for other modules of your app. For example, you might have one `TelemetryClient` instance in your middleware class to report business logic events. You can set properties such as `UserId` and `DeviceId` to identify the machine. This information is attached to all events that the instance sends.

*C#*

```csharp
TelemetryClient.Context.User.Id = "...";
TelemetryClient.Context.Device.Id = "...";
```

*Java*

```java
telemetry.getContext().getUser().setId("...");
telemetry.getContext().getDevice().setId("...");
```

In Node.js projects, you can use `new applicationInsights.TelemetryClient(instrumentationKey?)` to create a new instance. We recommend this approach only for scenarios that require isolated configuration from the singleton `defaultClient`.

## TrackEvent

In Application Insights, a *custom event* is a data point that you can display in [Metrics Explorer](../essentials/metrics-charts.md) as an aggregated count and in [Diagnostic Search](./search-and-transaction-diagnostics.md?tabs=transaction-search) as individual occurrences. (It isn't related to MVC or other framework "events.")

Insert `TrackEvent` calls in your code to count various events. For example, you might want to track how often users choose a particular feature. Or you might want to know how often they achieve certain goals or make specific types of mistakes.

For example, in a game app, send an event whenever a user wins the game:

*JavaScript*

```javascript
appInsights.trackEvent({name:"WinGame"});
```

*C#*

```csharp
telemetry.TrackEvent("WinGame");
```

*Visual Basic*

```vb
telemetry.TrackEvent("WinGame")
```

*Java*

```java
telemetry.trackEvent("WinGame");
```

*Node.js*

```javascript
telemetry.trackEvent({name: "WinGame"});
```

### Custom events in Log Analytics

The telemetry is available in the `customEvents` table on the [Application Insights Logs tab](../logs/log-query-overview.md) or [usage experience](usage-overview.md). Events might come from `trackEvent(..)` or the [Click Analytics Auto-collection plug-in](javascript-feature-extensions.md).

If [sampling](./sampling.md) is in operation, the `itemCount` property shows a value greater than `1`. For example, `itemCount==10` means that of 10 calls to `trackEvent()`, the sampling process transmitted only one of them. To get a correct count of custom events, use code such as `customEvents | summarize sum(itemCount)`.

> [!NOTE]
> itemCount has a minimum value of one; the record itself represents an entry.

## GetMetric

To learn how to effectively use the `GetMetric()` call to capture locally pre-aggregated metrics for .NET and .NET Core applications, see [Custom metric collection in .NET and .NET Core](./get-metric.md).

## TrackMetric

> [!NOTE]
> `Microsoft.ApplicationInsights.TelemetryClient.TrackMetric` isn't the preferred method for sending metrics. Metrics should always be pre-aggregated across a time period before being sent. Use one of the `GetMetric(..)` overloads to get a metric object for accessing SDK pre-aggregation capabilities.
>
> If you're implementing your own pre-aggregation logic, you can use the `TrackMetric()` method to send the resulting aggregates. If your application requires sending a separate telemetry item on every occasion without aggregation across time, you likely have a use case for event telemetry. See `TelemetryClient.TrackEvent
(Microsoft.ApplicationInsights.DataContracts.EventTelemetry)`.

Application Insights can chart metrics that aren't attached to particular events. For example, you could monitor a queue length at regular intervals. With metrics, the individual measurements are of less interest than the variations and trends, and so statistical charts are useful.

To send metrics to Application Insights, you can use the `TrackMetric(..)` API. There are two ways to send a metric:

* **Single value**. Every time you perform a measurement in your application, you send the corresponding value to Application Insights.

  For example, assume you have a metric that describes the number of items in a container. During a particular time period, you first put three items into the container and then you remove two items. Accordingly, you would call `TrackMetric` twice. First, you would pass the value `3` and then pass the value `-2`. Application Insights stores both values for you.

* **Aggregation**. When you work with metrics, every single measurement is rarely of interest. Instead, a summary of what happened during a particular time period is important. Such a summary is called _aggregation_.

  In the preceding example, the aggregate metric sum for that time period is `1` and the count of the metric values is `2`. When you use the aggregation approach, you invoke `TrackMetric` only once per time period and send the aggregate values. We recommend this approach because it can significantly reduce the cost and performance overhead by sending fewer data points to Application Insights, while still collecting all relevant information.

### Single value examples

To send a single metric value:

*JavaScript*

```javascript
appInsights.trackMetric({name: "queueLength", average: 42});
```

*C#*

```csharp
var sample = new MetricTelemetry();
sample.Name = "queueLength";
sample.Sum = 42.3;
telemetryClient.TrackMetric(sample);
```

*Java*

```java
telemetry.trackMetric("queueLength", 42.0);
```

*Node.js*

```javascript
telemetry.trackMetric({name: "queueLength", value: 42.0});
```

### Custom metrics in Log Analytics

The telemetry is available in the `customMetrics` table in [Application Insights Analytics](../logs/log-query-overview.md). Each row represents a call to `trackMetric(..)` in your app.

* `valueSum`: The sum of the measurements. To get the mean value, divide by `valueCount`.
* `valueCount`: The number of measurements that were aggregated into this `trackMetric(..)` call.

> [!NOTE]
> valueCount has a minimum value of one; the record itself represents an entry.

## Page views

In a device or webpage app, page view telemetry is sent by default when each screen or page is loaded. But you can change the default to track page views at more or different times. For example, in an app that displays tabs or panes, you might want to track a page whenever the user opens a new pane.

User and session data is sent as properties along with page views, so the user and session charts come alive when there's page view telemetry.

### Custom page views

*JavaScript*

```javascript
appInsights.trackPageView("tab1");
```

*C#*

```csharp
telemetry.TrackPageView("GameReviewPage");
```

*Visual Basic*

```vb
telemetry.TrackPageView("GameReviewPage")
```

*Java*

```java
telemetry.trackPageView("GameReviewPage");
```

If you have several tabs within different HTML pages, you can specify the URL too:

```javascript
appInsights.trackPageView("tab1", "http://fabrikam.com/page1.htm");
```

### Timing page views

By default, the times reported as **Page view load time** are measured from when the browser sends the request until the browser's page load event is called.

Instead, you can either:

* Set an explicit duration in the [trackPageView](https://github.com/microsoft/ApplicationInsights-JS/blob/17ef50442f73fd02a758fbd74134933d92607ecf/legacy/API.md#trackpageview) call: `appInsights.trackPageView("tab1", null, null, null, durationInMilliseconds);`.
* Use the page view timing calls `startTrackPage` and `stopTrackPage`.

*JavaScript*

```javascript
// To start timing a page:
appInsights.startTrackPage("Page1");

...

// To stop timing and log the page:
appInsights.stopTrackPage("Page1", url, properties, measurements);
```

The name that you use as the first parameter associates the start and stop calls. It defaults to the current page name.

The resulting page load durations displayed in Metrics Explorer are derived from the interval between the start and stop calls. It's up to you what interval you actually time.

### Page telemetry in Log Analytics

In [Log Analytics](../logs/log-query-overview.md), two tables show data from browser operations:

* `pageViews`: Contains data about the URL and page title.
* `browserTimings`: Contains data about client performance like the time taken to process the incoming data.

To find how long the browser takes to process different pages:

```kusto
browserTimings
| summarize avg(networkDuration), avg(processingDuration), avg(totalDuration) by name
```

To discover the popularity of different browsers:

```kusto
pageViews
| summarize count() by client_Browser
```

To associate page views to AJAX calls, join with dependencies:

```kusto
pageViews
| join (dependencies) on operation_Id
```

## TrackRequest

The server SDK uses `TrackRequest` to log HTTP requests.

You can also call it yourself if you want to simulate requests in a context where you don't have the web service module running.

The recommended way to send request telemetry is where the request acts as an <a href="#operation-context">operation context</a>.

## Operation context

You can correlate telemetry items together by associating them with operation context. The standard request-tracking module does this for exceptions and other events that are sent while an HTTP request is being processed. In [Search](./search-and-transaction-diagnostics.md?tabs=transaction-search) and [Analytics](../logs/log-query-overview.md), you can easily find any events associated with the request by using its operation ID.

For more information on correlation, see [Telemetry correlation in Application Insights](distributed-tracing-telemetry-correlation.md).

When you track telemetry manually, the easiest way to ensure telemetry correlation is by using this pattern:

*C#*

```csharp
// Establish an operation context and associated telemetry item:
using (var operation = telemetryClient.StartOperation<RequestTelemetry>("operationName"))
{
    // Telemetry sent in here will use the same operation ID.
    ...
    telemetryClient.TrackTrace(...); // or other Track* calls
    ...

    // Set properties of containing telemetry item--for example:
    operation.Telemetry.ResponseCode = "200";

    // Optional: explicitly send telemetry item:
    telemetryClient.StopOperation(operation);

} // When operation is disposed, telemetry item is sent.
```

Along with setting an operation context, `StartOperation` creates a telemetry item of the type that you specify. It sends the telemetry item when you dispose of the operation or if you explicitly call `StopOperation`. If you use `RequestTelemetry` as the telemetry type, its duration is set to the timed interval between start and stop.

Telemetry items reported within a scope of operation become children of such an operation. Operation contexts could be nested.

In **Search**, the operation context is used to create the **Related Items** list.

:::image type="content" source="./media/api-custom-events-metrics/21.png" lightbox="./media/api-custom-events-metrics/21.png" alt-text="Screenshot that shows the Related Items list.":::

For more information on custom operations tracking, see [Track custom operations with Application Insights .NET SDK](./custom-operations-tracking.md).

### Requests in Log Analytics

In [Application Insights Analytics](../logs/log-query-overview.md), requests show up in the `requests` table.

If [sampling](./sampling.md) is in operation, the `itemCount` property shows a value greater than `1`. For example, `itemCount==10` means that of 10 calls to `trackRequest()`, the sampling process transmitted only one of them. To get a correct count of requests and average duration segmented by request names, use code such as:

```kusto
requests
| summarize count = sum(itemCount), avgduration = avg(duration) by name
```

## TrackException

Send exceptions to Application Insights:

* To [count them](../essentials/metrics-charts.md), as an indication of the frequency of a problem.
* To [examine individual occurrences](./search-and-transaction-diagnostics.md?tabs=transaction-search).

The reports include the stack traces.

*C#*

```csharp
try
{
    ...
}
catch (Exception ex)
{
    telemetry.TrackException(ex);
}
```

*Java*

```java
try {
    ...
} catch (Exception ex) {
    telemetry.trackException(ex);
}
```

*JavaScript*

```javascript
try
{
    ...
}
catch (ex)
{
    appInsights.trackException({exception: ex});
}
```

*Node.js*

```javascript
try
{
    ...
}
catch (ex)
{
    telemetry.trackException({exception: ex});
}
```

The SDKs catch many exceptions automatically, so you don't always have to call `TrackException` explicitly:

* **ASP.NET**: [Write code to catch exceptions](./asp-net-exceptions.md).
* **Java EE**: [Exceptions are caught automatically](./opentelemetry-enable.md?tabs=java).
* **JavaScript**: Exceptions are caught automatically. If you want to disable automatic collection, add a line to the JavaScript (Web) SDK Loader Script that you insert in your webpages:

```javascript
({
    instrumentationKey: "your key",
    disableExceptionTracking: true
})
```

### Exceptions in Log Analytics

In [Application Insights Analytics](../logs/log-query-overview.md), exceptions show up in the `exceptions` table.

If [sampling](./sampling.md) is in operation, the `itemCount` property shows a value greater than `1`. For example, `itemCount==10` means that of 10 calls to `trackException()`, the sampling process transmitted only one of them. To get a correct count of exceptions segmented by type of exception, use code such as:

```kusto
exceptions
| summarize sum(itemCount) by type
```

Most of the important stack information is already extracted into separate variables, but you can pull apart the `details` structure to get more. Because this structure is dynamic, you should cast the result to the type you expect. For example:

```kusto
exceptions
| extend method2 = tostring(details[0].parsedStack[1].method)
```

To associate exceptions with their related requests, use a join:

```kusto
exceptions
| join (requests) on operation_Id
```

## TrackTrace

Use `TrackTrace` to help diagnose problems by sending a "breadcrumb trail" to Application Insights. You can send chunks of diagnostic data and inspect them in [Diagnostic Search](./search-and-transaction-diagnostics.md?tabs=transaction-search).

In .NET [Log adapters](./asp-net-trace-logs.md), use this API to send third-party logs to the portal.

In Java, the [Application Insights Java agent](opentelemetry-enable.md?tabs=java) autocollects and sends logs to the portal.

*C#*

```csharp
telemetry.TrackTrace(message, SeverityLevel.Warning, properties);
```

*Java*

```java
telemetry.trackTrace(message, SeverityLevel.Warning, properties);
```

*Node.js*

```javascript
telemetry.trackTrace({
    message: message,
    severity: applicationInsights.Contracts.SeverityLevel.Warning,
    properties: properties
});
```

*Client/Browser-side JavaScript*

```javascript
trackTrace({
    message: string,
    properties?: {[string]:string},
    severityLevel?: SeverityLevel
})
```

Log a diagnostic event such as entering or leaving a method.

 Parameter | Description
---|---
`message` | Diagnostic data. Can be much longer than a name.
`properties` | Map of string to string. More data is used to [filter exceptions](#properties) in the portal. Defaults to empty.
`severityLevel` | Supported values: [SeverityLevel.ts](https://github.com/microsoft/ApplicationInsights-JS/blob/17ef50442f73fd02a758fbd74134933d92607ecf/shared/AppInsightsCommon/src/Interfaces/Contracts/Generated/SeverityLevel.ts).

You can search on message content, but unlike property values, you can't filter on it.

The size limit on `message` is much higher than the limit on properties. An advantage of `TrackTrace` is that you can put relatively long data in the message. For example, you can encode POST data there.

You can also add a severity level to your message. And, like other telemetry, you can add property values to help you filter or search for different sets of traces. For example:

*C#*

```csharp
var telemetry = new Microsoft.ApplicationInsights.TelemetryClient();
telemetry.TrackTrace("Slow database response",
                SeverityLevel.Warning,
                new Dictionary<string,string> { {"database", db.ID} });
```

*Java*

```java
Map<String, Integer> properties = new HashMap<>();
properties.put("Database", db.ID);
telemetry.trackTrace("Slow Database response", SeverityLevel.Warning, properties);
```

In [Search](./search-and-transaction-diagnostics.md?tabs=transaction-search), you can then easily filter out all the messages of a particular severity level that relate to a particular database.

### Traces in Log Analytics

In [Application Insights Analytics](../logs/log-query-overview.md), calls to `TrackTrace` show up in the `traces` table.

If [sampling](./sampling.md) is in operation, the `itemCount` property shows a value greater than `1`. For example, `itemCount==10` means that of 10 calls to `trackTrace()`, the sampling process transmitted only one of them. To get a correct count of trace calls, use code such as `traces | summarize sum(itemCount)`.

## TrackDependency

Use the `TrackDependency` call to track the response times and success rates of calls to an external piece of code. The results appear in the dependency charts in the portal. The following code snippet must be added wherever a dependency call is made.

> [!NOTE]
> For .NET and .NET Core, you can alternatively use the `TelemetryClient.StartOperation` (extension) method that fills the `DependencyTelemetry` properties that are needed for correlation and some other properties like the start time and duration, so you don't need to create a custom timer as with the following examples. For more information, see the section on outgoing dependency tracking in [Track custom operations with Application Insights .NET SDK](./custom-operations-tracking.md#outgoing-dependencies-tracking).

*C#*

```csharp
var success = false;
var startTime = DateTime.UtcNow;
var timer = System.Diagnostics.Stopwatch.StartNew();
try
{
    success = dependency.Call();
}
catch(Exception ex)
{
    success = false;
    telemetry.TrackException(ex);
    throw new Exception("Operation went wrong", ex);
}
finally
{
    timer.Stop();
    telemetry.TrackDependency("DependencyType", "myDependency", "myCall", startTime, timer.Elapsed, success);
}
```

*Java*

```java
boolean success = false;
Instant startTime = Instant.now();
try {
    success = dependency.call();
}
finally {
    Instant endTime = Instant.now();
    Duration delta = Duration.between(startTime, endTime);
    RemoteDependencyTelemetry dependencyTelemetry = new RemoteDependencyTelemetry("My Dependency", "myCall", delta, success);
    dependencyTelemetry.setTimeStamp(startTime);
    telemetry.trackDependency(dependencyTelemetry);
}
```

*Node.js*

```javascript
var success = false;
var startTime = new Date().getTime();
try
{
    success = dependency.Call();
}
finally
{
    var elapsed = new Date() - startTime;
    telemetry.trackDependency({
        dependencyTypeName: "myDependency",
        name: "myCall",
        duration: elapsed,
        success: success
    });
}
```

Remember that the server SDKs include a [dependency module](./asp-net-dependencies.md) that discovers and tracks certain dependency calls automatically, for example, to databases and REST APIs. You have to install an agent on your server to make the module work.

In Java, many dependency calls can be automatically tracked by using the
[Application Insights Java agent](opentelemetry-enable.md?tabs=java).

You use this call if you want to track calls that the automated tracking doesn't catch.

To turn off the standard dependency-tracking module in C#, edit [ApplicationInsights.config](./configuration-with-applicationinsights-config.md) and delete the reference to `DependencyCollector.DependencyTrackingTelemetryModule`. For Java, see
[Suppressing specific autocollected telemetry](./java-standalone-config.md#suppress-specific-autocollected-telemetry).

### Dependencies in Log Analytics

In [Application Insights Analytics](../logs/log-query-overview.md), `trackDependency` calls show up in the `dependencies` table.

If [sampling](./sampling.md) is in operation, the `itemCount` property shows a value greater than 1. For example, `itemCount==10` means that of 10 calls to `trackDependency()`, the sampling process transmitted only one of them. To get a correct count of dependencies segmented by target component, use code such as:

```kusto
dependencies
| summarize sum(itemCount) by target
```

To associate dependencies with their related requests, use a join:

```kusto
dependencies
| join (requests) on operation_Id
```

## Flushing data

Normally, the SDK sends data at fixed intervals, typically 30 seconds, or whenever the buffer is full, which is typically 500 items. In some cases, you might want to flush the buffer. An example is if you're using the SDK in an application that shuts down.

*.NET*

When you use `Flush()`, we recommend this [pattern](./console.md#full-example):

```csharp
telemetry.Flush();
// Allow some time for flushing before shutdown.
System.Threading.Thread.Sleep(5000);
```

When you use `FlushAsync()`, we recommend this pattern:

```csharp
await telemetryClient.FlushAsync()
// No need to sleep
```

We recommend always flushing as part of the application shutdown to guarantee that telemetry isn't lost.

*Java*

```java
telemetry.flush();
//Allow some time for flushing before shutting down
Thread.sleep(5000);
```

*Node.js*

```javascript
telemetry.flush();
```

The function is asynchronous for the [server telemetry channel](https://www.nuget.org/packages/Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel/).

> [!NOTE]
> The Java and JavaScript SDKs automatically flush on application shutdown.

## Authenticated users

In a web app, users are [identified by cookies](./usage-segmentation.md#the-users-sessions-and-events-segmentation-tool) by default. A user might be counted more than once if they access your app from a different machine or browser, or if they delete cookies.

If users sign in to your app, you can get a more accurate count by setting the authenticated user ID in the browser code:

*JavaScript*

```javascript
// Called when my app has identified the user.
function Authenticated(signInId) {
    var validatedId = signInId.replace(/[,;=| ]+/g, "_");
    appInsights.setAuthenticatedUserContext(validatedId);
    ...
}
```

In an ASP.NET web MVC application, for example:

*Razor*

```cshtml
@if (Request.IsAuthenticated)
{
    <script>
        appInsights.setAuthenticatedUserContext("@User.Identity.Name
            .Replace("\\", "\\\\")"
            .replace(/[,;=| ]+/g, "_"));
    </script>
}
```

It isn't necessary to use the user's actual sign-in name. It only has to be an ID that is unique to that user. It must not include spaces or any of the characters `,;=|`.

The user ID is also set in a session cookie and sent to the server. If the server SDK is installed, the authenticated user ID is sent as part of the context properties of both client and server telemetry. You can then filter and search on it.

If your app groups users into accounts, you can also pass an identifier for the account. The same character restrictions apply.

```javascript
appInsights.setAuthenticatedUserContext(validatedId, accountId);
```

In [Metrics Explorer](../essentials/metrics-charts.md), you can create a chart that counts **Users, Authenticated**, and **User accounts**.

You can also [search](./search-and-transaction-diagnostics.md?tabs=transaction-search) for client data points with specific user names and accounts.

> [!NOTE]
> The [EnableAuthenticationTrackingJavaScript property in the ApplicationInsightsServiceOptions class](https://github.com/microsoft/ApplicationInsights-dotnet/blob/develop/NETCORE/src/Shared/Extensions/ApplicationInsightsServiceOptions.cs) in the .NET Core SDK simplifies the JavaScript configuration needed to inject the user name as the Auth ID for each trace sent by the Application Insights JavaScript SDK.
>
>When this property is set to `true`, the user name from the user in the ASP.NET Core is printed along with [client-side telemetry](asp-net-core.md#enable-client-side-telemetry-for-web-applications). For this reason, adding `appInsights.setAuthenticatedUserContext` manually wouldn't be needed anymore because it's already injected by the SDK for ASP.NET Core. The Auth ID will also be sent to the server where the SDK in .NET Core will identify it and use it for any server-side telemetry, as described in the [JavaScript API reference](https://github.com/microsoft/ApplicationInsights-JS/blob/master/API-reference.md#setauthenticatedusercontext).
>
>For JavaScript applications that don't work in the same way as ASP.NET Core MVC, such as SPA web apps, you would still need to add `appInsights.setAuthenticatedUserContext` manually.

## <a name="properties"></a>Filter, search, and segment your data by using properties

You can attach properties and measurements to your events, metrics, page views, exceptions, and other telemetry data.

*Properties* are string values that you can use to filter your telemetry in the usage reports. For example, if your app provides several games, you can attach the name of the game to each event so that you can see which games are more popular.

There's a limit of 8,192 on the string length. If you want to send large chunks of data, use the message parameter of `TrackTrace`.

*Metrics* are numeric values that can be presented graphically. For example, you might want to see if there's a gradual increase in the scores that your gamers achieve. The graphs can be segmented by the properties that are sent with the event so that you can get separate or stacked graphs for different games.

Metric values should be greater than or equal to 0 to display correctly.

There are some [limits on the number of properties, property values, and metrics](#limits) that you can use.

*JavaScript*

```javascript
appInsights.trackEvent({
  name: 'some event',
  properties: { // accepts any type
    prop1: 'string',
    prop2: 123.45,
    prop3: { nested: 'objects are okay too' }
  }
});

appInsights.trackPageView({
  name: 'some page',
  properties: { // accepts any type
    prop1: 'string',
    prop2: 123.45,
    prop3: { nested: 'objects are okay too' }
  }
});
```

*C#*

```csharp
// Set up some properties and metrics:
var properties = new Dictionary <string, string>
    {{"game", currentGame.Name}, {"difficulty", currentGame.Difficulty}};
var metrics = new Dictionary <string, double>
    {{"Score", currentGame.Score}, {"Opponents", currentGame.OpponentCount}};

// Send the event:
telemetry.TrackEvent("WinGame", properties, metrics);
```

*Node.js*

```javascript
// Set up some properties and metrics:
var properties = {"game": currentGame.Name, "difficulty": currentGame.Difficulty};
var metrics = {"Score": currentGame.Score, "Opponents": currentGame.OpponentCount};

// Send the event:
telemetry.trackEvent({name: "WinGame", properties: properties, measurements: metrics});
```

*Visual Basic*

```vb
' Set up some properties:
Dim properties = New Dictionary (Of String, String)
properties.Add("game", currentGame.Name)
properties.Add("difficulty", currentGame.Difficulty)

Dim metrics = New Dictionary (Of String, Double)
metrics.Add("Score", currentGame.Score)
metrics.Add("Opponents", currentGame.OpponentCount)

' Send the event:
telemetry.TrackEvent("WinGame", properties, metrics)
```

*Java*

```java
Map<String, String> properties = new HashMap<String, String>();
properties.put("game", currentGame.getName());
properties.put("difficulty", currentGame.getDifficulty());

Map<String, Double> metrics = new HashMap<String, Double>();
metrics.put("Score", currentGame.getScore());
metrics.put("Opponents", currentGame.getOpponentCount());

telemetry.trackEvent("WinGame", properties, metrics);
```

> [!NOTE]
> Make sure you don't log personally identifiable information in properties.

### Alternative way to set properties and metrics

If it's more convenient, you can collect the parameters of an event in a separate object:

```csharp
var event = new EventTelemetry();

event.Name = "WinGame";
event.Metrics["processingTime"] = stopwatch.Elapsed.TotalMilliseconds;
event.Properties["game"] = currentGame.Name;
event.Properties["difficulty"] = currentGame.Difficulty;
event.Metrics["Score"] = currentGame.Score;
event.Metrics["Opponents"] = currentGame.Opponents.Length;

telemetry.TrackEvent(event);
```

> [!WARNING]
> Don't reuse the same telemetry item instance (`event` in this example) to call `Track*()` multiple times. This practice might cause telemetry to be sent with incorrect configuration.

### Custom measurements and properties in Log Analytics

In [Log Analytics](../logs/log-query-overview.md), custom metrics and properties show in the `customMeasurements` and `customDimensions` attributes of each telemetry record.

For example, if you add a property named "game" to your request telemetry, this query counts the occurrences of different values of "game" and shows the average of the custom metric "score":

```kusto
requests
| summarize sum(itemCount), avg(todouble(customMeasurements.score)) by tostring(customDimensions.game)
```

Notice that:

* When you extract a value from the `customDimensions` or `customMeasurements` JSON, it has dynamic type, so you must cast it `tostring` or `todouble`.
* To take account of the possibility of [sampling](./sampling.md), use `sum(itemCount)` not `count()`.

## <a name="timed"></a> Timing events

Sometimes you want to chart how long it takes to perform an action. For example, you might want to know how long users take to consider choices in a game. To obtain this information, use the measurement parameter.

*C#*

```csharp
var stopwatch = System.Diagnostics.Stopwatch.StartNew();

// ... perform the timed action ...

stopwatch.Stop();

var metrics = new Dictionary <string, double>
    {{"processingTime", stopwatch.Elapsed.TotalMilliseconds}};

// Set up some properties:
var properties = new Dictionary <string, string>
    {{"signalSource", currentSignalSource.Name}};

// Send the event:
telemetry.TrackEvent("SignalProcessed", properties, metrics);
```

*Java*

```java
long startTime = System.currentTimeMillis();

// Perform timed action

long endTime = System.currentTimeMillis();
Map<String, Double> metrics = new HashMap<>();
metrics.put("ProcessingTime", (double)endTime-startTime);

// Setup some properties
Map<String, String> properties = new HashMap<>();
properties.put("signalSource", currentSignalSource.getName());

// Send the event
telemetry.trackEvent("SignalProcessed", properties, metrics);
```

## <a name="defaults"></a>Default properties for custom telemetry

If you want to set default property values for some of the custom events that you write, set them in a `TelemetryClient` instance. They're attached to every telemetry item that's sent from that client.

*C#*

```csharp
using Microsoft.ApplicationInsights.DataContracts;

var gameTelemetry = new TelemetryClient();
gameTelemetry.Context.GlobalProperties["Game"] = currentGame.Name;
// Now all telemetry will automatically be sent with the context property:
gameTelemetry.TrackEvent("WinGame");
```

*Visual Basic*

```vb
Dim gameTelemetry = New TelemetryClient()
gameTelemetry.Context.GlobalProperties("Game") = currentGame.Name
' Now all telemetry will automatically be sent with the context property:
gameTelemetry.TrackEvent("WinGame")
```

*Java*

```java
import com.microsoft.applicationinsights.TelemetryClient;
import com.microsoft.applicationinsights.TelemetryContext;
...

TelemetryClient gameTelemetry = new TelemetryClient();
TelemetryContext context = gameTelemetry.getContext();
context.getProperties().put("Game", currentGame.Name);

gameTelemetry.TrackEvent("WinGame");
```

*Node.js*

```javascript
var gameTelemetry = new applicationInsights.TelemetryClient();
gameTelemetry.commonProperties["Game"] = currentGame.Name;

gameTelemetry.TrackEvent({name: "WinGame"});
```

Individual telemetry calls can override the default values in their property dictionaries.

*For JavaScript web clients*, use JavaScript telemetry initializers.

*To add properties to all telemetry*, including the data from standard collection modules, [implement `ITelemetryInitializer`](./api-filtering-sampling.md#add-properties).

## Sample, filter, and process telemetry

See [Filter and preprocess telemetry in the Application Insights SDK](./api-filtering-sampling.md).

## Disable telemetry

To *dynamically stop and start* the collection and transmission of telemetry:

*C#*

```csharp
using  Microsoft.ApplicationInsights.Extensibility;

TelemetryConfiguration.Active.DisableTelemetry = true;
```

*Java*

```java
telemetry.getConfiguration().setTrackingDisabled(true);
```

To *disable selected standard collectors*, for example, performance counters, HTTP requests, or dependencies, delete or comment out the relevant lines in [ApplicationInsights.config](./configuration-with-applicationinsights-config.md). An example is if you want to send your own `TrackRequest` data.

*Node.js*

```javascript
telemetry.config.disableAppInsights = true;
```

To *disable selected standard collectors*, for example, performance counters, HTTP requests, or dependencies, at initialization time, chain configuration methods to your SDK initialization code.

```javascript
applicationInsights.setup()
    .setAutoCollectRequests(false)
    .setAutoCollectPerformance(false)
    .setAutoCollectExceptions(false)
    .setAutoCollectDependencies(false)
    .setAutoCollectConsole(false)
    .start();
```

To disable these collectors after initialization, use the Configuration object: `applicationInsights.Configuration.setAutoCollectRequests(false)`.

## <a name="debug"></a>Developer mode

During debugging, it's useful to have your telemetry expedited through the pipeline so that you can see results immediately. You also get other messages that help you trace any problems with the telemetry. Switch it off in production because it might slow down your app.

*C#*

```csharp
TelemetryConfiguration.Active.TelemetryChannel.DeveloperMode = true;
```

*Visual Basic*

```vb
TelemetryConfiguration.Active.TelemetryChannel.DeveloperMode = True
```

*Node.js*

For Node.js, you can enable developer mode by enabling internal logging via `setInternalLogging` and setting `maxBatchSize` to `0`, which causes your telemetry to be sent as soon as it's collected.

```js
applicationInsights.setup("ikey")
  .setInternalLogging(true, true)
  .start()
applicationInsights.defaultClient.config.maxBatchSize = 0;
```

## <a name="ikey"></a> Set the instrumentation key for selected custom telemetry

*C#*

```csharp
var telemetry = new TelemetryClient();
telemetry.InstrumentationKey = "---my key---";
// ...
```

## <a name="dynamic-ikey"></a> Dynamic instrumentation key

To avoid mixing up telemetry from development, test, and production environments, you can [create separate Application Insights resources](./create-workspace-resource.md) and change their keys, depending on the environment.

Instead of getting the instrumentation key from the configuration file, you can set it in your code. Set the key in an initialization method, such as `global.aspx.cs` in an ASP.NET service:

*C#*

```csharp
protected void Application_Start()
{
    Microsoft.ApplicationInsights.Extensibility.
    TelemetryConfiguration.Active.InstrumentationKey =
        // - for example -
        WebConfigurationManager.Settings["ikey"];
    ...
}
```

*JavaScript*

```javascript
appInsights.config.instrumentationKey = myKey;
```

In webpages, you might want to set it from the web server's state instead of coding it literally into the script. For example, in a webpage generated in an ASP.NET app:

*JavaScript in Razor*

```cshtml
<script type="text/javascript">
// Standard Application Insights webpage script:
var appInsights = window.appInsights || function(config){ ...
// Modify this part:
}({instrumentationKey:
    // Generate from server property:
    @Microsoft.ApplicationInsights.Extensibility.
        TelemetryConfiguration.Active.InstrumentationKey;
}) // ...
```

```java
    String instrumentationKey = "00000000-0000-0000-0000-000000000000";

    if (instrumentationKey != null)
    {
        TelemetryConfiguration.getActive().setInstrumentationKey(instrumentationKey);
    }
```

## TelemetryContext

`TelemetryClient` has a Context property, which contains values that are sent along with all telemetry data. They're normally set by the standard telemetry modules, but you can also set them yourself. For example:

```csharp
telemetry.Context.Operation.Name = "MyOperationName";
```

If you set any of these values yourself, consider removing the relevant line from [ApplicationInsights.config](./configuration-with-applicationinsights-config.md) so that your values and the standard values don't get confused.

* **Component**: The app and its version.
* **Device**: Data about the device where the app is running. In web apps, it's the server or client device that the telemetry is sent from.
* **InstrumentationKey**: The Application Insights resource in Azure where the telemetry appears. It's usually picked up from `ApplicationInsights.config`.
* **Location**: The geographic location of the device.
* **Operation**: In web apps, the current HTTP request. In other app types, you can set this value to group events together.
  * **ID**: A generated value that correlates different events so that when you inspect any event in Diagnostic Search, you can find related items.
  * **Name**: An identifier, usually the URL of the HTTP request.
  * **SyntheticSource**: If not null or empty, a string that indicates that the source of the request has been identified as a robot or web test. By default, it's excluded from calculations in Metrics Explorer.
* **Session**: The user's session. The ID is set to a generated value, which is changed when the user hasn't been active for a while.
* **User**: User information.

## Limits

[!INCLUDE [application-insights-limits](../../../includes/application-insights-limits.md)]

To avoid hitting the data rate limit, use [sampling](./sampling.md).

To determine how long data is kept, see [Data retention and privacy](/previous-versions/azure/azure-monitor/app/data-retention-privacy).

## Reference docs

* [.NET reference](/dotnet/api/overview/azure/insights)
* [Java reference](/java/api/overview/azure/appinsights)
* [JavaScript reference](https://github.com/Microsoft/ApplicationInsights-JS/blob/master/API-reference.md)

## SDK code

* [.NET](https://github.com/Microsoft/ApplicationInsights-dotnet)
* [Windows Server packages](https://github.com/Microsoft/ApplicationInsights-dotnet)
* [Java SDK](https://github.com/Microsoft/ApplicationInsights-Java)
* [Node.js SDK](https://github.com/Microsoft/ApplicationInsights-Node.js)
* [JavaScript SDK](https://github.com/Microsoft/ApplicationInsights-JS)

## Frequently asked questions

This section provides answers to common questions.

### Why am I missing telemetry data?

Both [TelemetryChannels](telemetry-channels.md#what-are-telemetry-channels) will lose buffered telemetry if it isn't flushed before an application shuts down.

To avoid data loss, flush the TelemetryClient when an application is shutting down.

For more information, see [Flushing data](#flushing-data).

### What exceptions might `Track_()` calls throw?

None. You don't need to wrap them in try-catch clauses. If the SDK encounters problems, it will log messages in the debug console output and, if the messages get through, in Diagnostic Search.

### Is there a REST API to get data from the portal?

Yes, the [data access API](/rest/api/application-insights/). Other ways to extract data include [Power BI](..\logs\log-powerbi.md) if you've [migrated to a workspace-based resource](convert-classic-resource.md) or [continuous export](./export-telemetry.md) if you're still on a classic resource.

### Why are my calls to custom events and metrics APIs ignored?

The Application Insights SDK isn't compatible with autoinstrumentation. If autoinstrumentation is enabled, calls to <code class="notranslate">Track()</code> and other custom events and metrics APIs will be ignored.

Turn off autoinstrumentation in the Azure portal on the Application Insights tab of the App Service page or set <code class="notranslate">ApplicationInsightsAgent_EXTENSION_VERSION</code> to <code class="notranslate">disabled</code>.

### Why are the counts in Search and Metrics charts unequal?

[Sampling](./sampling.md) reduces the number of telemetry items (like requests and custom events) that are sent from your app to the portal. In Search, you see the number of items received. In metric charts that display a count of events, you see the number of original events that occurred.
          
Each item that's transmitted carries an `itemCount` property that shows how many original events that item represents. To observe sampling in operation, you can run this query in Log Analytics:
          
```
    requests | summarize original_events = sum(itemCount), transmitted_events = count()
```

### How can I set an alert on an event?

Azure alerts are only on metrics. Create a custom metric that crosses a value threshold whenever your event occurs. Then set an alert on the metric. You get a notification whenever the metric crosses the threshold in either direction. You won't get a notification until the first crossing, no matter whether the initial value is high or low. There's always a latency of a few minutes.


## <a name="next"></a>Next steps

* [Search events and logs](./search-and-transaction-diagnostics.md?tabs=transaction-search)
