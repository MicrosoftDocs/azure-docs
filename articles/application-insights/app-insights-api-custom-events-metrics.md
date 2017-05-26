---
title: Application Insights API for custom events and metrics | Microsoft Docs
description: Insert a few lines of code in your device or desktop app, webpage, or service, to track usage and diagnose issues.
services: application-insights
documentationcenter: ''
author: CFreemanwa
manager: carmonm

ms.assetid: 80400495-c67b-4468-a92e-abf49793a54d
ms.service: application-insights
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.devlang: multiple
ms.topic: article
ms.date: 05/17/2017
ms.author: cfreeman

---
# Application Insights API for custom events and metrics


Insert a few lines of code in your application to find out what users are doing with it, or to help diagnose issues. You can send telemetry from device and desktop apps, web clients, and web servers. Use the [Azure Application Insights](app-insights-overview.md) core telemetry API to send custom events and metrics, and your own versions of standard telemetry. This API is the same API that the standard Application Insights data collectors use.

## API summary
The API is uniform across all platforms, apart from a few small variations.

| Method | Used for |
| --- | --- |
| [`TrackPageView`](#page-views) |Pages, screens, blades, or forms. |
| [`TrackEvent`](#trackevent) |User actions and other events. Used to track user behavior or to monitor performance. |
| [`TrackMetric`](#trackmetric) |Performance measurements such as queue lengths not related to specific events. |
| [`TrackException`](#trackexception) |Logging exceptions for diagnosis. Trace where they occur in relation to other events and examine stack traces. |
| [`TrackRequest`](#trackrequest) |Logging the frequency and duration of server requests for performance analysis. |
| [`TrackTrace`](#tracktrace) |Diagnostic log messages. You can also capture third-party logs. |
| [`TrackDependency`](#trackdependency) |Logging the duration and frequency of calls to external components that your app depends on. |

You can [attach properties and metrics](#properties) to most of these telemetry calls.

## <a name="prep"></a>Before you start
If you haven't done these yet:

* Add the Application Insights SDK to your project:

  * [ASP.NET project](app-insights-asp-net.md)
  * [Java project](app-insights-java-get-started.md)
  * [JavaScript in each webpage](app-insights-javascript.md) 
* In your device or web server code, include:

    *C#:* `using Microsoft.ApplicationInsights;`

    *Visual Basic:* `Imports Microsoft.ApplicationInsights`

    *Java:* `import com.microsoft.applicationinsights.TelemetryClient;`

## Constructing a TelemetryClient instance
Construct an instance of TelemetryClient (except in JavaScript in webpages):

*C#*

    private TelemetryClient telemetry = new TelemetryClient();

*Visual Basic*

    Private Dim telemetry As New TelemetryClient

*Java*

    private TelemetryClient telemetry = new TelemetryClient();

TelemetryClient is thread-safe.

We recommend that you use an instance of TelemetryClient for each module of your app. For instance, you may have one TelemetryClient instance in your web service to report incoming HTTP requests, and another in a middleware class to report business logic events. You can set properties such as `TelemetryClient.Context.User.Id` to track users and sessions, or `TelemetryClient.Context.Device.Id` to identify the machine. This information is attached to all events that the instance sends.

## TrackEvent
In Application Insights, a *custom event* is a data point that you can display in [Metrics Explorer](app-insights-metrics-explorer.md) as an aggregated count, and in [Diagnostic Search](app-insights-diagnostic-search.md) as individual occurrences. (It isn't related to MVC or other framework "events.")

Insert TrackEvent calls in your code to count how often users choose a particular feature, how often they achieve particular goals, or maybe how often they make particular types of mistakes.

For example, in a game app, send an event whenever a user wins the game:

*JavaScript*

    appInsights.trackEvent("WinGame");

*C#*

    telemetry.TrackEvent("WinGame");

*Visual Basic*

    telemetry.TrackEvent("WinGame")

*Java*

    telemetry.trackEvent("WinGame");


### View your events in the Azure portal
To see a count of your events, open a [Metrics Explorer](app-insights-metrics-explorer.md) blade, add a new chart, and select **Events**.  

![See a count of custom events](./media/app-insights-api-custom-events-metrics/01-custom.png)

To compare the counts of different events, set the chart type to **Grid**, and group by event name:

![Set the chart type and grouping](./media/app-insights-api-custom-events-metrics/07-grid.png)

On the grid, click through an event name to see individual occurrences of that event. Click any occurrence to see more detail.

![Drill through the events](./media/app-insights-api-custom-events-metrics/03-instances.png)

To focus on specific events in either Search or Metrics Explorer, set the blade's filter to the event names that you're interested in:

![Open Filters, expand Event name, and select one or more values](./media/app-insights-api-custom-events-metrics/06-filter.png)

### Custom events in Analytics

The telemetry is available in the `customEvents` table in [Application Insights Analytics](app-insights-analytics.md). Each row represents a call to `trackEvent(..)` in your app. 

If [sampling](app-insights-sampling.md) is in operation, the itemCount property will show a value greater than 1. For example itemCount==10 means that of 10 calls to trackEvent(), the sampling process only transmitted one of them. To get a correct count of custom events, you should use therefore use code such as `customEvent | summarize sum(itemCount)`.


## TrackMetric

Application Insights can chart metrics that are not attached to particular events. For example, you could monitor a queue length at regular intervals. With metrics, the individual measurements are of less interest than the variations and trends, and so statistical charts are useful.

In order to send metrics to Application Insights, you can use the `TrackMetric(..)` API. There are two ways to send a metric: 

* Single value. Every time you perform a measurement in your application, you send the corresponding value to Application Insights. For example, assume that you have a metric describing the number of items in a container. During a particular time period, you first put 3 items into the container and then you remove 2 items. Accordingly, you would call `TrackMetric` twice: first passing the value `3` and then the value `-2`. Application Insights will store both values on your behalf. 

* Aggregation. When working with metrics, every single measurement is rarely of interest. Instead a summary of what happened during a particular time period is important. Such a summary is called _aggregation_. In the above example the aggregate metric sum for that time period is `1` and the count of the metric values is `2`. When using the aggregation approach, you will only invoke `TrackMetric` once per time period and send the aggregate values. This is the recommended approach since it can significantly reduce the cost and performance overhead by sending fewer data points to Application Insights, while still collecting all relevant information.

### Examples:

#### Single values

To send a single metric value:

*JavaScript*

 ```Javascript
     appInsights.trackMetric("queueLength", 42.0);
 ```

*C#, Java*

```C#
    var sample = new MetricTelemetry();
    sample.Name = "metric name";
    sample.Value = 42.3;
    telemetryClient.TrackMetric(sample);
```

#### Aggregating metrics

It is recommended to aggregate metrics before sending them from your app, to reduce bandwidth, cost and to improve performance.
Here is an example of aggregating code:

*C#*

```C#
using System;
using System.Threading;
using System.Threading.Tasks;

using Microsoft.ApplicationInsights;
using Microsoft.ApplicationInsights.DataContracts;

namespace MetricAggregationExample
{
    /// <summary>
    /// Aggregates metric values for a single time period.
    /// </summary>
    internal class MetricAggregator
    {
        private SpinLock _trackLock = new SpinLock();

        public DateTimeOffset StartTimestamp    { get; }
        public int Count                        { get; private set; }
        public double Sum                       { get; private set; }
        public double SumOfSquares              { get; private set; }
        public double Min                       { get; private set; }
        public double Max                       { get; private set; }
        public double Average                   { get { return (Count == 0) ? 0 : (Sum / Count); } }
        public double Variance                  { get { return (Count == 0) ? 0 : (SumOfSquares / Count)
                                                                                  - (Average * Average); } }
        public double StandardDeviation         { get { return Math.Sqrt(Variance); } }

        public MetricAggregator(DateTimeOffset startTimestamp)
        {
            this.StartTimestamp = startTimestamp;
        }

        public void TrackValue(double value)
        {
            bool lockAcquired = false;

            try
            {
                _trackLock.Enter(ref lockAcquired);

                if ((Count == 0) || (value < Min))  { Min = value; }
                if ((Count == 0) || (value > Max))  { Max = value; }
                Count++;
                Sum += value;
                SumOfSquares += value * value;
            }
            finally
            {
                if (lockAcquired)
                {
                    _trackLock.Exit();
                }
            }
        }
    }   // internal class MetricAggregator

    /// <summary>
    /// Accepts metric values and sends the aggregated values at 1-minute intervals.
    /// </summary>
    public sealed class Metric : IDisposable
    {
        private static readonly TimeSpan AggregationPeriod = TimeSpan.FromSeconds(60);

        private bool _isDisposed = false;
        private MetricAggregator _aggregator = null;
        private readonly TelemetryClient _telemetryClient;

        public string Name { get; }

        public Metric(string name, TelemetryClient telemetryClient)
        {
            this.Name = name ?? "null";
            this._aggregator = new MetricAggregator(DateTimeOffset.UtcNow);
            this._telemetryClient = telemetryClient ?? throw new ArgumentNullException(nameof(telemetryClient));

            Task.Run(this.AggregatorLoopAsync);
        }

        public void TrackValue(double value)
        {
            MetricAggregator currAggregator = _aggregator;
            if (currAggregator != null)
            {
                currAggregator.TrackValue(value);
            }
        }

        private async Task AggregatorLoopAsync()
        {
            while (_isDisposed == false)
            {
                try
                {
                    // Wait for end end of the aggregation period:
                    await Task.Delay(AggregationPeriod).ConfigureAwait(continueOnCapturedContext: false);

                    // Atomically snap the current aggregation:
                    MetricAggregator nextAggregator = new MetricAggregator(DateTimeOffset.UtcNow);
                    MetricAggregator prevAggregator = Interlocked.Exchange(ref _aggregator, nextAggregator);

                    // Only send anything is at least one value was measured:
                    if (prevAggregator != null && prevAggregator.Count > 0)
                    {
                        // Compute the actual aggregation period length:
                        TimeSpan aggPeriod = nextAggregator.StartTimestamp - prevAggregator.StartTimestamp;
                        if (aggPeriod.TotalMilliseconds < 1)
                        {
                            aggPeriod = TimeSpan.FromMilliseconds(1);
                        }

                        // Construct the metric telemetry item and send:
                        var aggregatedMetricTelemetry = new MetricTelemetry(
                                Name,
                                prevAggregator.Count,
                                prevAggregator.Sum,
                                prevAggregator.Min,
                                prevAggregator.Max,
                                prevAggregator.StandardDeviation);
                        aggregatedMetricTelemetry.Properties["AggregationPeriod"] = aggPeriod.ToString("c");

                        _telemetryClient.Track(aggregatedMetricTelemetry);
                    }
                }
                catch(Exception ex)
                {
                    // log ex as appropriate for your application
                }
            }
        }

        void IDisposable.Dispose()
        {
            _isDisposed = true;
            _aggregator = null;
        }
    }   // public sealed class Metric
}
```

### Custom metrics in Metrics Explorer

To see the results, open Metrics Explorer and add a new chart. Edit the chart to show your metric.

> [!NOTE]
> Your custom metric might take several minutes to appear in the list of available metrics.
>

![Add a new chart or select a chart, and under Custom, select your metric](./media/app-insights-api-custom-events-metrics/03-track-custom.png)

### Custom metrics in Analytics

The telemetry is available in the `customMetrics` table in [Application Insights Analytics](app-insights-analytics.md). Each row represents a call to `trackMetric(..)` in your app.
* `valueSum` - This is the sum of the measurements. To get the mean value, divide by `valueCount`.
* `valueCount` - The number of measurements that were aggregated into this `trackMetric(..)` call.

## Page views
In a device or webpage app, page view telemetry is sent by default when each screen or page is loaded. But you can change that to track page views at additional or different times. For example, in an app that displays tabs or blades, you might want to track a page whenever the user opens a new blade.

![Usage lens on Overview blade](./media/app-insights-api-custom-events-metrics/appinsights-47usage-2.png)

User and session data is sent as properties along with page views, so the user and session charts come alive when there is page view telemetry.

### Custom page views
*JavaScript*

    appInsights.trackPageView("tab1");

*C#*

    telemetry.TrackPageView("GameReviewPage");

*Visual Basic*

    telemetry.TrackPageView("GameReviewPage")


If you have several tabs within different HTML pages, you can specify the URL too:

    appInsights.trackPageView("tab1", "http://fabrikam.com/page1.htm");

### Timing page views
By default, the times reported as **Page view load time** are measured from when the browser sends the request, until the browser's page load event is called.

Instead, you can either:

* Set an explicit duration in the [trackPageView](https://github.com/Microsoft/ApplicationInsights-JS/blob/master/API-reference.md#trackpageview) call: `appInsights.trackPageView("tab1", null, null, null, durationInMilliseconds);`.
* Use the page view timing calls `startTrackPage` and `stopTrackPage`.

*JavaScript*

    // To start timing a page:
    appInsights.startTrackPage("Page1");

...

    // To stop timing and log the page:
    appInsights.stopTrackPage("Page1", url, properties, measurements);

The name that you use as the first parameter associates the start and stop calls. It defaults to the current page name.

The resulting page load durations displayed in Metrics Explorer are derived from the interval between the start and stop calls. It's up to you what interval you actually time.

### Page telemetry in Analytics

In [Analytics](app-insights-analytics.md) two tables show data from browser operations:

* The `pageViews` table contains data about the URL and page title
* The `browserTimings` table contains data about client performance, such as the time taken to process the incoming data

To find how long the browser takes to process different pages:

```
browserTimings | summarize avg(networkDuration), avg(processingDuration), avg(totalDuration) by name 
```

To discover the popularities of different browsers:

```
pageViews | summarize count() by client_Browser
```

To associate page views to AJAX calls, join with dependencies:

```
pageViews | join (dependencies) on operation_Id 
```

## TrackRequest
The server SDK uses TrackRequest to log HTTP requests.

You can also call it yourself if you want to simulate requests in a context where you don't have the web service module running.

However, the recommended way to send request telemetry is where the request acts as an <a href="#operation-context">operation context</a>.

## Operation context
You can associate telemetry items together by attaching to them a common operation ID. The standard request-tracking module does this for exceptions and other events that are sent while an HTTP request is being processed. In [Search](app-insights-diagnostic-search.md) and [Analytics](app-insights-analytics.md), you can use the ID to easily find any events associated with the request.

The easiest way to set the ID is to set an operation context by using this pattern:

*C#*

```C#

    // Establish an operation context and associated telemetry item:
    using (var operation = telemetry.StartOperation<RequestTelemetry>("operationName"))
    {
        // Telemetry sent in here will use the same operation ID.
        ...
        telemetry.TrackEvent(...); // or other Track* calls
        ...
        // Set properties of containing telemetry item--for example:
        operation.Telemetry.ResponseCode = "200";

        // Optional: explicitly send telemetry item:
        telemetry.StopOperation(operation);

    } // When operation is disposed, telemetry item is sent.
```

Along with setting an operation context, `StartOperation` creates a telemetry item of the type that you specify. It sends the telemetry item when you dispose the operation, or if you explicitly call `StopOperation`. If you use `RequestTelemetry` as the telemetry type, its duration is set to the timed interval between start and stop.

Operation contexts can't be nested. If there is already an operation context, then its ID is associated with all the contained items, including the item created with `StartOperation`.

In Search, the operation context is used to create the **Related Items** list:

![Related items](./media/app-insights-api-custom-events-metrics/21.png)

### Requests in Analytics 

In [Application Insights Analytics](app-insights-analytics.md), requests show up in the `requests` table.

If [sampling](app-insights-sampling.md) is in operation, the itemCount property will show a value greater than 1. For example itemCount==10 means that of 10 calls to trackRequest(), the sampling process only transmitted one of them. To get a correct count of requests and average duration segmented by request names, use code such as:

```AIQL
requests | summarize count = sum(itemCount), avgduration = avg(duration) by name
```


## TrackException
Send exceptions to Application Insights:

* To [count them](app-insights-metrics-explorer.md), as an indication of the frequency of a problem.
* To [examine individual occurrences](app-insights-diagnostic-search.md).

The reports include the stack traces.

*C#*

    try
    {
        ...
    }
    catch (Exception ex)
    {
       telemetry.TrackException(ex);
    }

*JavaScript*

    try
    {
       ...
    }
    catch (ex)
    {
       appInsights.trackException(ex);
    }

The SDKs catch many exceptions automatically, so you don't always have to call TrackException explicitly.

* ASP.NET: [Write code to catch exceptions](app-insights-asp-net-exceptions.md).
* J2EE: [Exceptions are caught automatically](app-insights-java-get-started.md#exceptions-and-request-failures).
* JavaScript: Exceptions are caught automatically. If you want to disable automatic collection, add a line to the code snippet that you insert in your webpages:

    ```
    ({
      instrumentationKey: "your key"
      , disableExceptionTracking: true
    })
    ```

### Exceptions in Analytics

In [Application Insights Analytics](app-insights-analytics.md), exceptions show up in the `exceptions` table.

If [sampling](app-insights-sampling.md) is in operation, the itemCount property will show a value greater than 1. For example itemCount==10 means that of 10 calls to trackException(), the sampling process only transmitted one of them. To get a correct count of exceptions segmented by type of exception, use code such as:

```
exceptions | summarize sum(itemCount) by type
```

Most of the important stack information is already extracted into separate variables, but you can pull apart the 'details' structure to get more. Since this is a dynamic structure, you should cast the result to the type you expect. For example:

```AIQL
exceptions
| extend method2 = tostring(details[0].parsedStack[1].method)
```

To associate exceptions with their related requests, use a join:

```
exceptions
| join (requests) on operation_Id 
```

## TrackTrace
Use TrackTrace to help diagnose problems by sending a "breadcrumb trail" to Application Insights. You can send chunks of diagnostic data and inspect them in [Diagnostic Search](app-insights-diagnostic-search.md).

[Log adapters](app-insights-asp-net-trace-logs.md) use this API to send third-party logs to the portal.

*C#*

    telemetry.TrackTrace(message, SeverityLevel.Warning, properties);


You can search on message content, but (unlike property values) you can't filter on it.

The size limit on `message` is much higher than the limit on properties.
An advantage of TrackTrace is that you can put relatively long data in the message. For example, you can encode POST data there.  

In addition, you can add a severity level to your message. And, like other telemetry, you can add property values to help you filter or search for different sets of traces. For example:

    var telemetry = new Microsoft.ApplicationInsights.TelemetryClient();
    telemetry.TrackTrace("Slow database response",
                   SeverityLevel.Warning,
                   new Dictionary<string,string> { {"database", db.ID} });

In [Search](app-insights-diagnostic-search.md), you can then easily filter out all the messages of a particular severity level that relate to a particular database.


### Traces in Analytics

In [Application Insights Analytics](app-insights-analytics.md), calls to TrackTrace show up in the `traces` table.

If [sampling](app-insights-sampling.md) is in operation, the itemCount property will show a value greater than 1. For example itemCount==10 means that of 10 calls to trackTrace(), the sampling process only transmitted one of them. To get a correct count of trace calls, you should use therefore use code such as `traces | summarize sum(itemCount)`.

## TrackDependency
Use the TrackDependency call to track the response times and success rates of calls to an external piece of code. The results appear in the dependency charts in the portal.

```C#

            var success = false;
            var startTime = DateTime.UtcNow;
            var timer = System.Diagnostics.Stopwatch.StartNew();
            try
            {
                success = dependency.Call();
            }
            finally
            {
                timer.Stop();
                telemetry.TrackDependency("myDependency", "myCall", startTime, timer.Elapsed, success);
            }
```

Remember that the server SDKs include a [dependency module](app-insights-asp-net-dependencies.md) that discovers and tracks certain dependency calls automatically--for example, to databases and REST APIs. You have to install an agent on your server to make the module work. You use this call if you want to track calls that the automated tracking doesn't catch, or if you don't want to install the agent.

To turn off the standard dependency-tracking module, edit [ApplicationInsights.config](app-insights-configuration-with-applicationinsights-config.md) and delete the reference to `DependencyCollector.DependencyTrackingTelemetryModule`.

### Dependencies in Analytics

In [Application Insights Analytics](app-insights-analytics.md), trackDependency calls show up in the `dependencies` table.

If [sampling](app-insights-sampling.md) is in operation, the itemCount property will show a value greater than 1. For example itemCount==10 means that of 10 calls to trackDependency(), the sampling process only transmitted one of them. To get a correct count of dependencies segmented by target component, use code such as:

```
dependencies | summarize sum(itemCount) by target
```

To associate dependencies with their related requests, use a join:

```
dependencies
| join (requests) on operation_Id 
```

## Flushing data
Normally, the SDK sends data at times chosen to minimize the impact on the user. However, in some cases, you might want to flush the buffer--for example, if you are using the SDK in an application that shuts down.

*C#*

    telemetry.Flush();

    // Allow some time for flushing before shutdown.
    System.Threading.Thread.Sleep(1000);

Note that the function is asynchronous for the [server telemetry channel](https://www.nuget.org/packages/Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel/).

## Authenticated users
In a web app, users are (by default) identified by cookies. A user might be counted more than once if they access your app from a different machine or browser, or if they delete cookies.

If users sign in to your app, you can get a more accurate count by setting the authenticated user ID in the browser code:

*JavaScript*

```JS
    // Called when my app has identified the user.
    function Authenticated(signInId) {
      var validatedId = signInId.replace(/[,;=| ]+/g, "_");
      appInsights.setAuthenticatedUserContext(validatedId);
      ...
    }
```

In an ASP.NET web MVC application, for example:

*Razor*

        @if (Request.IsAuthenticated)
        {
            <script>
                appInsights.setAuthenticatedUserContext("@User.Identity.Name
                   .Replace("\\", "\\\\")"
                   .replace(/[,;=| ]+/g, "_"));
            </script>
        }

It isn't necessary to use the user's actual sign-in name. It only has to be an ID that is unique to that user. It must not include spaces or any of the characters `,;=|`.

The user ID is also set in a session cookie and sent to the server. If the server SDK is installed, the authenticated user ID will be sent as part of the context properties of both client and server telemetry. You can then filter and search on it.

If your app groups users into accounts, you can also pass an identifier for the account (with the same character restrictions).

      appInsights.setAuthenticatedUserContext(validatedId, accountId);

In [Metrics Explorer](app-insights-metrics-explorer.md), you can create a chart that counts **Users, Authenticated** and **User accounts**.

You can also [search](app-insights-diagnostic-search.md) for client data points with specific user names and accounts.

## <a name="properties"></a>Filtering, searching, and segmenting your data by using properties
You can attach properties and measurements to your events (and also to metrics, page views, exceptions, and other telemetry data).

*Properties* are string values that you can use to filter your telemetry in the usage reports. For example, if your app provides several games, you can attach the name of the game to each event so that you can see which games are more popular.

There's a limit of 8192 on the string length. (If you want to send large chunks of data, use the message parameter of [TrackTrace](#track-trace).)

*Metrics* are numeric values that can be presented graphically. For example, you might want to see if there's a gradual increase in the scores that your gamers achieve. The graphs can be segmented by the properties that are sent with the event, so that you can get separate or stacked graphs for different games.

For metric values to be correctly displayed, they should be greater than or equal to 0.

There are some [limits on the number of properties, property values, and metrics](#limits) that you can use.

*JavaScript*

    appInsights.trackEvent
      ("WinGame",
         // String properties:
         {Game: currentGame.name, Difficulty: currentGame.difficulty},
         // Numeric metrics:
         {Score: currentGame.score, Opponents: currentGame.opponentCount}
         );

    appInsights.trackPageView
        ("page name", "http://fabrikam.com/pageurl.html",
          // String properties:
         {Game: currentGame.name, Difficulty: currentGame.difficulty},
         // Numeric metrics:
         {Score: currentGame.score, Opponents: currentGame.opponentCount}
         );


*C#*

    // Set up some properties and metrics:
    var properties = new Dictionary <string, string>
       {{"game", currentGame.Name}, {"difficulty", currentGame.Difficulty}};
    var metrics = new Dictionary <string, double>
       {{"Score", currentGame.Score}, {"Opponents", currentGame.OpponentCount}};

    // Send the event:
    telemetry.TrackEvent("WinGame", properties, metrics);


*Visual Basic*

    ' Set up some properties:
    Dim properties = New Dictionary (Of String, String)
    properties.Add("game", currentGame.Name)
    properties.Add("difficulty", currentGame.Difficulty)

    Dim metrics = New Dictionary (Of String, Double)
    metrics.Add("Score", currentGame.Score)
    metrics.Add("Opponents", currentGame.OpponentCount)

    ' Send the event:
    telemetry.TrackEvent("WinGame", properties, metrics)


*Java*

    Map<String, String> properties = new HashMap<String, String>();
    properties.put("game", currentGame.getName());
    properties.put("difficulty", currentGame.getDifficulty());

    Map<String, Double> metrics = new HashMap<String, Double>();
    metrics.put("Score", currentGame.getScore());
    metrics.put("Opponents", currentGame.getOpponentCount());

    telemetry.trackEvent("WinGame", properties, metrics);


> [!NOTE]
> Take care not to log personally identifiable information in properties.
>
>

*If you used metrics*, open Metrics Explorer and select the metric from the **Custom** group:

![Open Metrics Explorer, select the chart, and select the metric](./media/app-insights-api-custom-events-metrics/03-track-custom.png)

> [!NOTE]
> If your metric doesn't appear, or if the **Custom** heading isn't there, close the selection blade and try again later. Metrics can sometimes take an hour to be aggregated through the pipeline.

*If you used properties and metrics*, segment the metric by the property:

![Set grouping, and then select the property under Group by](./media/app-insights-api-custom-events-metrics/04-segment-metric-event.png)

*In Diagnostic Search*, you can view the properties and metrics of individual occurrences of an event.

![Select an instance, and then select "..."](./media/app-insights-api-custom-events-metrics/appinsights-23-customevents-4.png)

Use the **Search** field to see event occurrences that have a particular property value.

![Type a term into Search](./media/app-insights-api-custom-events-metrics/appinsights-23-customevents-5.png)

[Learn more about search expressions](app-insights-diagnostic-search.md).

### Alternative way to set properties and metrics
If it's more convenient, you can collect the parameters of an event in a separate object:

    var event = new EventTelemetry();

    event.Name = "WinGame";
    event.Metrics["processingTime"] = stopwatch.Elapsed.TotalMilliseconds;
    event.Properties["game"] = currentGame.Name;
    event.Properties["difficulty"] = currentGame.Difficulty;
    event.Metrics["Score"] = currentGame.Score;
    event.Metrics["Opponents"] = currentGame.Opponents.Length;

    telemetry.TrackEvent(event);

> [!WARNING]
> Don't reuse the same telemetry item instance (`event` in this example) to call Track*() multiple times. This may cause telemetry to be sent with incorrect configuration.
>
>

### Custom measurements and properties in Analytics

In [Analytics](app-insights-analytics.md), custom metrics and properties show in the `customMeasurements` and `customDimensions` attributes of each telemetry record.

For example, if you have added a property named "game" to your request telemetry, this query will count the occurences of different values of "game", and show the average of the custom metric "score":

```
requests
| summarize sum(itemCount), avg(todouble(customMeasurements.score)) by tostring(customDimensions.game) 
```

Notice that:

* When you extract a value from the customDimensions or customMeasurements JSON, it has dynamic type, and so you must cast it `tostring` or `todouble`.
* To take account of the possibility of [sampling](app-insights-sampling.md), you should use `sum(itemCount)`, not `count()`.



## <a name="timed"></a> Timing events
Sometimes you want to chart how long it takes to perform an action. For example, you might want to know how long users take to consider choices in a game. You can use the measurement parameter for this.

*C#*

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



## <a name="defaults"></a>Default properties for custom telemetry
If you want to set default property values for some of the custom events that you write, you can set them in a TelemetryClient instance. They are attached to every telemetry item that's sent from that client.

*C#*

    using Microsoft.ApplicationInsights.DataContracts;

    var gameTelemetry = new TelemetryClient();
    gameTelemetry.Context.Properties["Game"] = currentGame.Name;
    // Now all telemetry will automatically be sent with the context property:
    gameTelemetry.TrackEvent("WinGame");

*Visual Basic*

    Dim gameTelemetry = New TelemetryClient()
    gameTelemetry.Context.Properties("Game") = currentGame.Name
    ' Now all telemetry will automatically be sent with the context property:
    gameTelemetry.TrackEvent("WinGame")

*Java*

    import com.microsoft.applicationinsights.TelemetryClient;
    import com.microsoft.applicationinsights.TelemetryContext;
    ...


    TelemetryClient gameTelemetry = new TelemetryClient();
    TelemetryContext context = gameTelemetry.getContext();
    context.getProperties().put("Game", currentGame.Name);

    gameTelemetry.TrackEvent("WinGame");



Individual telemetry calls can override the default values in their property dictionaries.

*For JavaScript web clients*, [use JavaScript telemetry initializers](#js-initializer).

*To add properties to all telemetry*, including the data from standard collection modules, [implement `ITelemetryInitializer`](app-insights-api-filtering-sampling.md#add-properties).

## Sampling, filtering, and processing telemetry
You can write code to process your telemetry before it's sent from the SDK. The processing includes data that's sent from the standard telemetry modules, such as HTTP request collection and dependency collection.

[Add properties](app-insights-api-filtering-sampling.md#add-properties) to telemetry by implementing `ITelemetryInitializer`. For example, you can add version numbers or values that are calculated from other properties.

[Filtering](app-insights-api-filtering-sampling.md#filtering) can modify or discard telemetry before it's sent from the SDK by implementing `ITelemetryProcesor`. You control what is sent or discarded, but you have to account for the effect on your metrics. Depending on how you discard items, you might lose the ability to navigate between related items.

[Sampling](app-insights-api-filtering-sampling.md) is a packaged solution to reduce the volume of data that's sent from your app to the portal. It does so without affecting the displayed metrics. And it does so without affecting your ability to diagnose problems by navigating between related items such as exceptions, requests, and page views.

[Learn more](app-insights-api-filtering-sampling.md).

## Disabling telemetry
To *dynamically stop and start* the collection and transmission of telemetry:

*C#*

```C#

    using  Microsoft.ApplicationInsights.Extensibility;

    TelemetryConfiguration.Active.DisableTelemetry = true;
```

To *disable selected standard collectors*--for example, performance counters, HTTP requests, or dependencies--delete or comment out the relevant lines in [ApplicationInsights.config](app-insights-configuration-with-applicationinsights-config.md). You can do this, for example, if you want to send your own TrackRequest data.

## <a name="debug"></a>Developer mode
During debugging, it's useful to have your telemetry expedited through the pipeline so that you can see results immediately. You also get additional messages that help you trace any problems with the telemetry. Switch it off in production, because it may slow down your app.

*C#*

    TelemetryConfiguration.Active.TelemetryChannel.DeveloperMode = true;

*Visual Basic*

    TelemetryConfiguration.Active.TelemetryChannel.DeveloperMode = True


## <a name="ikey"></a> Setting the instrumentation key for selected custom telemetry
*C#*

    var telemetry = new TelemetryClient();
    telemetry.InstrumentationKey = "---my key---";
    // ...


## <a name="dynamic-ikey"></a> Dynamic instrumentation key
To avoid mixing up telemetry from development, test, and production environments, you can [create separate Application Insights resources](app-insights-create-new-resource.md) and change their keys, depending on the environment.

Instead of getting the instrumentation key from the configuration file, you can set it in your code. Set the key in an initialization method, such as global.aspx.cs in an ASP.NET service:

*C#*

    protected void Application_Start()
    {
      Microsoft.ApplicationInsights.Extensibility.
        TelemetryConfiguration.Active.InstrumentationKey =
          // - for example -
          WebConfigurationManager.Settings["ikey"];
      ...

*JavaScript*

    appInsights.config.instrumentationKey = myKey;



In webpages, you might want to set it from the web server's state, rather than coding it literally into the script. For example, in a webpage generated in an ASP.NET app:

*JavaScript in Razor*

    <script type="text/javascript">
    // Standard Application Insights webpage script:
    var appInsights = window.appInsights || function(config){ ...
    // Modify this part:
    }({instrumentationKey:  
      // Generate from server property:
      @Microsoft.ApplicationInsights.Extensibility.
         TelemetryConfiguration.Active.InstrumentationKey"
    }) // ...


## TelemetryContext
TelemetryClient has a Context property, which contains values that are sent along with all telemetry data. They are normally set by the standard telemetry modules, but you can also set them yourself. For example:

    telemetry.Context.Operation.Name = "MyOperationName";

If you set any of these values yourself, consider removing the relevant line from [ApplicationInsights.config](app-insights-configuration-with-applicationinsights-config.md), so that your values and the standard values don't get confused.

* **Component**: The app and its version.
* **Device**: Data about the device where the app is running. (In web apps, this is the server or client device that the telemetry is sent from.)
* **InstrumentationKey**: The Application Insights resource in Azure where the telemetry will appear. It's usually picked up from ApplicationInsights.config.
* **Location**: The geographic location of the device.
* **Operation**: In web apps, the current HTTP request. In other app types, you can set this to group events together.
  * **Id**: A generated value that correlates different events, so that when you inspect any event in Diagnostic Search, you can find related items.
  * **Name**: An identifier, usually the URL of the HTTP request.
  * **SyntheticSource**: If not null or empty, a string that indicates that the source of the request has been identified as a robot or web test. By default, it will be excluded from calculations in Metrics Explorer.
* **Properties**: Properties that are sent with all telemetry data. It can be overridden in individual Track* calls.
* **Session**: The user's session. The ID is set to a generated value, which is changed when the user has not been active for a while.
* **User**: User information.

## Limits
[!INCLUDE [application-insights-limits](../../includes/application-insights-limits.md)]

To avoid hitting the data rate limit, use [sampling](app-insights-sampling.md).

To determine how long data is kept, see [Data retention and privacy](app-insights-data-retention-privacy.md).

## Reference docs
* [ASP.NET reference](https://msdn.microsoft.com/library/dn817570.aspx)
* [Java reference](http://dl.windowsazure.com/applicationinsights/javadoc/)
* [JavaScript reference](https://github.com/Microsoft/ApplicationInsights-JS/blob/master/API-reference.md)
* [Android SDK](https://github.com/Microsoft/ApplicationInsights-Android)
* [iOS SDK](https://github.com/Microsoft/ApplicationInsights-iOS)

## SDK code
* [ASP.NET Core SDK](https://github.com/Microsoft/ApplicationInsights-dotnet)
* [ASP.NET 5](https://github.com/Microsoft/ApplicationInsights-aspnet5)
* [Windows Server packages](https://github.com/Microsoft/applicationInsights-dotnet-server)
* [Java SDK](https://github.com/Microsoft/ApplicationInsights-Java)
* [JavaScript SDK](https://github.com/Microsoft/ApplicationInsights-JS)
* [All platforms](https://github.com/Microsoft?utf8=%E2%9C%93&query=applicationInsights)

## Questions
* *What exceptions might Track_() calls throw?*

    None. You don't need to wrap them in try-catch clauses. If the SDK encounters problems, it will log messages in the debug console output and--if the messages get through--in Diagnostic Search.
* *Is there a REST API to get data from the portal?*

    Yes, the [data access API](https://dev.applicationinsights.io/). Other ways to extract data include [export from Analytics to Power BI](app-insights-export-power-bi.md) and [continuous export](app-insights-export-telemetry.md).

## <a name="next"></a>Next steps
* [Search events and logs](app-insights-diagnostic-search.md)

* [Troubleshooting](app-insights-troubleshoot-faq.md)


