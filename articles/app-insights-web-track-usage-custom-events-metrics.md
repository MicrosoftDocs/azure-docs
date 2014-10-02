<properties title="Track custom usage events and metrics in your web app with Application Insights" pageTitle="Track usage events and metrics in your web app with Application Insights" description="Insert a few lines of code to find out what users are doing with your website." metaKeywords="analytics monitoring application insights" authors="awills" manager="kamrani"  />
 
<tags ms.service="application-insights" ms.workload="tbd" ms.tgt_pltfrm="ibiza" ms.devlang="na" ms.topic="article" ms.date="2014-10-01" ms.author="awills" />

# Track custom usage events and metrics in your web app

*Application Insights is in preview.*

Insert a few lines of code in your web application to find out what users are doing with it. You can track events, metrics, and page views. You'll see charts and tables of the data, aggregated across all your users. 

> [AZURE.NOTE] Currently the full user experience isn't in place. You can send custom events and metrics to Application Insights, and search the raw telemetry in [Diagnostic Search][diagnostic]. But you can't yet see the digested statistical charts - they're coming soon.

<!-- Sample pic -->

* [Client and server tracking](#clientServer)
* [Before you start](#prep)
* [Track metrics](#metrics)
* [Track events](#events)
* [Track page views](#pageViews)
* [Filter, search and segment your data with properties](#properties)
* [Combine metrics and events](#measurements)
* [Set default property values](#defaults)
* [Define multiple contexts](#contexts)
* [Switch telemetry off and on](#disable)
* [Next steps](#next)



## <a name="clientServer"></a> Client and server tracking

You can send telemetry from the client (web page) or the server sides of your app, or both.

The client and server APIs are very similar. You can send the same types of telemetry both from your users' web browsers, and from your web server. The difference is in the scope of the data you can send.

* Tracking at the web client is particularly useful if you have richly active web pages with lots of JavaScript. For example, you could monitor how frequently users click a particular button or how often they encounter validation errors.
* Tracking at the web server is more useful for monitoring business metrics and events such as the value of a customer's shopping cart or the count of abandoned orders.

In a typical ASP.NET web application, you have the default JavaScript call to trackPageView() in the web master page, and you'll add some calls to track events and metrics in the server code. If your client-side code is quite rich, you might also add some calls to track events and metrics at the client.


## <a name="prep"></a>Before you start

* If you haven't yet [added Application Insights to your project][start], do that now.
* Make sure you see data in the **Usage analytics** section. If not, take another look at [Set up web usage analytics][webclient]. The JavaScript initialization code should be included in every web page where you want to write monitoring code, or in a master page.
* To send telemetry from the server, you have to include:

C# at server

    using Microsoft.ApplicationInsights; 

VB at server

    Imports Microsoft.ApplicationInsights

When you run your app on your development machine in debug mode, results will appear in Application Insights within seconds. When you deploy the app, data takes longer to move through the pipeline from your server and clients.

## <a name="metrics"></a> Track metrics

You don't have to do any more to get basic usage data such as page views. But you can write a few lines of code to find out more about what your users are doing with your app.

For example, if your app is a game, you might like to know the average score that users achieve, and see if they find it easier or more difficult after you publish a new version.

To track a metric – that is, a numeric value like a score - insert a line of script like this at a suitable place in your app:

JavaScript at client

    appInsights.trackMetric("Score", currentGame.Score);

C# at server

    var telemetryContext = new TelemetryContext();
    telemetryContext.TrackMetric ("Opponents", game.Opponent.Count);

VB at server

    Dim telemetryContext = New TelemetryContext
    telemetryContext.TrackMetric ("Opponents", game.Opponent.Count)

Test the app, and use it so as to run your trackMetric() call.


<!-- Then go to your application in Application Insights and click through the [Metrics][metrics] tile. Select your metric to see the first results. -->

<!-- PIC  -->

<!-- The graph shows the recent average over values logged from all your users. -->

If you send telemetry from both the client and server, be sure to give the metrics different names.

(By the way: metrics aren’t optimized for diagnosing problems. If that's what you need, look at [Diagnostic Logging][diagnostic].) 


## <a name="events"></a>Track events

Events tell you the frequency of an occurrence, averaged across your users. For example, suppose you'd like to know how often users complete your game. In the code that ends the game, insert a line like this:

JavaScript at client

    appInsights.trackEvent("EndOfGame");

C# at server
    
    var telemetryContext = new TelemetryContext();
    telemetryContext.TrackEvent("EndOfGame");

VB at server


    Dim telemetryContext = New TelemetryContext
    telemetryContext.TrackEvent("EndOfGame")


<!-- Run your game, and you'll see events appearing under //// Usage analytics. -->

<!-- PIC -->

## <a name="pageViews"></a>Page views (client only)

By default, the initialization script in the head of the web page logs a page view, naming the event with the relative URL of the page. These calls provide the basic page use statistics. 

![Usage analytics on main app blade](./media/appinsights/appinsights-05-usageTiles.png)

### Custom page data

If you want, you can modify the call to change the name, or you can insert additional calls. For example, if your single-page web app displays multiple tabs, you might want to record a page view when the user switches to a different tab. For example:

JavaScript at client:

    appinsights.trackPageView("tab1");

If you have several tabs within different HTML pages, you can specify the URL too:

    appinsights.trackPageView("tab1", "http://fabrikam.com/page1.htm");

If you want to measure the time the user spent on a page, you can send it:

    // When the page opens:
    window.startTime = new Date().getTime();
    ...
    // When the page closes:
    var endTime = new Date().getTime();
    var durationInMilliseconds = endTime-startTime;
    appinsights.trackPageView("tab1", "http://fabrikam.com/page1.htm", durationInMilliseconds);


## <a name="properties"></a>Filter, search and segment your data with properties

You can attach properties to your events, metrics, and other telemetry data. In the usage reports, you can set a filter to show just the data for specific property values. For example if your app provides several games, you’ll want to attach the name of the game to each event or metric, so that you can see which games are more popular. 


JavaScript at client

    // Create a metric, but don’t send it yet:
    var metric = new Microsoft.ApplicationInsights
                   .MetricTelemetry("Score", currentGame.Score);
    // Attach some properties to it:
    metric.data.item.properties["Game"] = currentGame.name;
    metric.data.item.properties["Difficulty"] = currentGame.difficulty;
    // Send it:
    appinsights.context.track(metric);

C# at server

    // Create a metric, but don’t send it yet:
    var metric = new MetricTelemetry("Score", currentGame.Score);
    // Attach some properties to it:
    metric.Properties["Game"] = currentGame.Name;
    metric.Properties["Difficulty"] = currentGame.Difficulty;
    // Send the metric:
    telemetryContext.Track(metric);

VB at server

    ' Create a metric, but don’t send it yet:
    Dim metric = New MetricTelemetry("Score", currentGame.Score)
    ' Attach some properties to it:
    metric.Properties("Game") = currentGame.Name
    metric.Properties("Difficulty") = currentGame.Difficulty
    ' Send the metric:
    telemetryContext.Track(metric)

Attach properties to events in the same way:

JavaScript at client

    // Create an event, but don’t send it yet:
    var event1 = new Microsoft.ApplicationInsights
                    .EventTelemetry("EndOfGame");
    // Attach some properties to it:
    event1.data.item.properties["Game"] = currentGame.name;
    event1.data.item.properties["Difficulty"] = currentGame.difficulty;
    // Send it:
    appinsights.context.track(event1);

C# at server

    // Create an event, but don’t send it yet:
    var event1 = new EventTelemetry("EndOfGame");
    // Attach some properties to it:
    event1.Properties["game"] = currentGame.Name;
    event1.Properties["difficulty"] = currentGame.Difficulty;
    // Send the metric:
    telemetryContext.Track(event1);

VB at server

    ' Create an event, but don’t send it yet:
    Dim event1 = New EventTelemetry("EndOfGame")
    ' Attach some properties to it:
    event1.Properties("Game") = currentGame.Name
    event1.Properties("Difficulty") = currentGame.Difficulty
    ' Send it:
    telemetryContext.Track(event1)

You can attach as many properties as you like with each metric or event.
A property value can be of any type. It will be converted to a string.

In the Application Insights portal, you can filter on property values. 

<!--
To see the filters, expand the parent event group, and select a particular event in the table – in this example, we expanded 'open' and selected 'buy':

////// pic //////
-->

> [WACOM.NOTE] Take care not to log personally identifiable information in properties.

> Tip: Don't send stack traces in events. Individual events can't easily be read in the event reports. For debugging, use TrackTrace() and TrackException() - read more in [Diagnostic search][diagnostic].

## <a name="measurements"></a>Combine metrics and events

You can attach measurements - that is, numeric values - to an event. 

JavaScript at client

    // Create an event, but don’t send it yet:
    var event1 = new Microsoft.ApplicationInsights.EventTelemetry("EndOfGame");
    // Attach some metrics to it:
    event1.data.item.measurements["Score"] = currentGame.Score;
    event1.data.item.measurements["Duration"] = currentGame.DurationOfPlayInSeconds;
    // Attach some properties to it:
    event1.data.item.properties["Game"] = currentGame.name;
    // Send it:
    appinsights.track(event1);

C# at server

    // Create an event, but don’t send it yet:
    var event1 = new EventTelemetry("EndOfGame");
    // Attach some measurements to it:
    event1.Metrics["Score"] = currentGame.Score;
    event1.Metrics["Duration"] = currentGame.DurationOfPlayInSeconds;
    // Attach some properties to it:
    event1.Properties["game"] = currentGame.Name;
    // Send the event:
    telemetryContext.Track(event1);

VB at server

    ' Create an event, but don’t send it yet:
    Dim event1 = New EventTelemetry("EndOfGame")
    ' Attach some metrics to it:
    event1.Metrics("Score") = currentGame.Score
    event1.Metrics("Duration") = currentGame.DurationOfPlayInSeconds
    ' Attach some properties to it:
    event1.Properties("game") = currentGame.Name
    ' Send the event:
    telemetryContext.Track(event1)
    
<!--
//// PIC

//// CHECK: //// In the event chart, hover over a data point to see average values for the metrics.  -->

## <a name="defaults"></a>Set default property values (not at web client)

You can set default values in the context. They are attached to every metric and event sent from the context. 
    

C# at server

    telemetryContext.Properties["Game"] = currentGame.Name;
    // Now all events and metrics will automatically be sent with the context property:
    telemetryContext.TrackEvent("EndOfGame");
    telemetryContext.TrackMetric("Score", currentGame.Score);
    
VB at server

    telemetryContext.Properties["Game"] = currentGame.Name
    ' Now all events and metrics will automatically be sent with the context property:
    telemetryContext.TrackEvent("EndOfGame")
    telemetryContext.TrackMetric("Score", currentGame.Score)

    
    
Individual events and metrics can override the default values.

## <a name="contexts"></a>Define multiple contexts (not at web client)

If you want to switch between groups of default property values, set up multiple contexts:

C# at server

    var context2 = new TelemetryContext();
    context2.Properties["Game"] = "none"; 
    context2.TrackEvent("EndOfGame");
    context2.TrackMetric("Score", currentGame.Score);
    

VB at server

    Dim context2 = New TelemetryContext()
    context2.Properties["Game"] = "none"
    context2.TrackEvent("EndOfGame")
    context2.TrackMetric("Score", currentGame.Score)


## <a name="next"></a>Next steps


[Explore your metrics][explore]

[Troubleshooting][qna]

## Learn more
* [Application Insights - get started][start]
* [Monitor a live web server now][redfield]
* [Monitor performance in web applications][perf]
* [Search diagnostic logs][diagnostic]
* [Availability tracking with web tests][availability]
* [Track usage][usage]
* [Track custom events and metrics][track]
* [Q & A and troubleshooting][qna]

<!--Link references-->


[start]: ../app-insights-start-monitoring-app-health-usage/
[redfield]: ../app-insights-monitor-performance-live-website-now/
[perf]: ../app-insights-web-monitor-performance/
[diagnostic]: ../app-insights-search-diagnostic-logs/ 
[availability]: ../app-insights-monitor-web-app-availability/
[usage]: ../app-insights-web-track-usage/
[track]: ../app-insights-web-track-custom-events-metrics/
[qna]: ../app-insights-troubleshoot-faq/
[webclient]: ../app-insights-start-monitoring-app-health-usage/#webclient


