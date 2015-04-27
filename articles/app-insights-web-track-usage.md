<properties 
	pageTitle="Usage analysis for web applications with Application Insights" 
	description="Overview of usage analytics with Application Insights" 
	services="application-insights" 
    documentationCenter=""
	authors="alancameronwills" 
	manager="ronmart"/>

<tags 
	ms.service="application-insights" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="ibiza" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/27/2015" 
	ms.author="awills"/>
 
# Usage analysis for web applications with Application Insights

Knowing how people use your application lets you focus your development work on the scenarios that are most important to them, and gain insights into the goals that they find easier or more difficult to achieve. 

Visual Studio Application Insights can provide a clear view of your application's usage, helping you to improve your users' experience, and meet your business goals. 

You can plan usage analysis into your devOps lifecycle, so that whenever you design a new user story, you also plan what telemetry you will need to assess its success.

## Setting up

Usage data from a web application can come from both the server and client ends. The best data is obtained by installing the Application Insights SDK at both ends, but you can use just one.

Follow these links to set up server and client ends:

* [Server-side SDK][greenbrown] provides user and session data. You can write custom telemetry to log business events such as a user placing an order. 
* Client-side SDK in a [web page][client] or [device][windows] provides page view and platform data. You can also write custom telemetry to track more detailed user actions. 

Use the same application resource for both client and server data. You should have the same instrumentation key in the ApplicationInsights.config file and the script in the web pages. The data from the two sources will be integrated in the portal.

## How popular is my web application?

Sign in to the [Azure portal][portal], Browse to your application resource, and click Usage:

![](./media/app-insights-web-track-usage/14-usage.png)

* **Users:** The count of distinct users over the time range of the chart. (Cookies are used to identify returning users.)
* **Sessions:** A session is counted when a user has not made any requests for 30 minutes.
* **Page views** Counts the number of calls to trackPageView(), typically called once in each web page.

Click any of the charts to see more detail. Notice that you can change the time range of the charts.

### Which pages are read most?

Click the page views chart to see more detail.

![](./media/appinsights/appinsights-49usage.png)


Click a chart to see other metrics that you can display, or add a new chart and select the metrics it displays.

![](./media/appinsights/appinsights-63usermetrics.png)

> [AZURE.NOTE] Metrics can only be displayed in some combinations. When you select a metric, the incompatible ones are disabled.



### Where do my users live?

From the usage blade, click the Users chart to see more detail:

![On the overview blade, click the Sessions chart](./media/app-insights-overview-usage/02-sessions.png)
 
(This example is from a website, but the charts look similar for apps that run on devices.)

### Is this the same as last week?

Compare with the previous week to see if things are changing:

![Select a chart that shows a single metric, switch on Prior Week](./media/app-insights-overview-usage/021-prior.png)


### What proportion of my users are new?

Compare two metrics, for example users and new users:

![Select a chart, search for and check or uncheck metrics.](./media/app-insights-overview-usage/031-dual.png)


### What browsers or operating systems do they use?

Group (segment) data by a property such as Browser, Operating System, or City:

![Select a chart that shows a single metric, switch on Grouping, and choose a property](./media/app-insights-overview-usage/03-browsers.png)

 
## Page usage

Click through the page views chart to get a more zoomed-in version together with a breakdown of your most popular pages:


![From the Overview blade, click the Page views chart](./media/app-insights-overview-usage/05-games.png)
 
The example above is from a games website. From it we can instantly see:

* Usage hasn't improved in the past week. Maybe we should think about search engine optimization?
* Many fewer people see the games pages than the Home page. Why doesn't our Home page attract people to play games?
* 'Crossword' is the most popular game. We should give priority to new ideas and improvements there.

## Custom tracking

Let's suppose that instead of implementing each game in a separate web page, you decide to refactor them all into the same single-page app, with most of the functionality coded as Javascript in the web page. This allows the user to switch quickly between one game and another, or even have several games on one page. 

But you'd still like Application Insights to log the number of times each game is opened, in exactly the same way as when they were on separate web pages. That's easy: just insert a call to the telemetry module into your JavaScript where you want to record that a new 'page' has opened:

	telemetryClient.trackPageView(game.Name);

## Custom events

Use custom events to . You can send them from device apps, web pages or a web server:

(JavaScript)

    telemetryClient.trackEvent("GameEnd");

(C#)

    var tc = new Microsoft.ApplicationInsights.TelemetryClient(); 
    tc.TrackEvent("GameEnd");

(VB)

    Dim tc = New Microsoft.ApplicationInsights.TelemetryClient()
    tc.TrackEvent("GameEnd")


The most frequent custom events are listed on the overview blade.

![On the Overview blade, scroll down to and click Custom Events.](./media/app-insights-overview-usage/04-events.png)

Click the head of the table to see total numbers of events. You can segment the chart by various attributes such as the event name: 

![Select a chart that shows just one metric. Switch on Grouping. Choose a property. Not all properties are available.](./media/app-insights-overview-usage/06-eventsSegment.png)

The particularly useful feature of timelines is that you can correlate changes with other metrics and events. For example, at times when more games are played, you'd expect to see a rise in abandoned games as well. But the rise in abandoned games is disproportionate, you'd want to find out whether the high load is causing problems that users find unacceptable.

## Drill into specific events

To get a better understanding of how a typical session goes, you might want to focus on a specific user session that contains a particular type of event. 

In this example, we coded a custom event "NoGame" that is called if the user logs out without actually starting a game. Why would a user do that? Maybe if we drill into some specific occurrences, we'll get a clue. 

The custom events received from the app are listed by name on the overview blade:


![On the Overview blade, click one of the custom event types.](./media/app-insights-overview-usage/07-clickEvent.png)
 
Click through the event of interest, and select a recent specific occurrence:


![In the list under the summary chart, click an event](./media/app-insights-overview-usage/08-searchEvents.png)
 
Let's look at all the telemetry for the session in which that particular NoGame event occurred. 


![Click 'all telemetry for session'](./media/app-insights-overview-usage/09-relatedTelemetry.png)
 
There were no exceptions, so the user wasn't prevented from playing by some failure.
 
We can filter out all types of telemetry except page views for this session:


![](./media/app-insights-overview-usage/10-filter.png)
 
And now we can see that this user logged in simply to check the latest scores. Maybe we should consider developing a user story that makes it easier to do that. (And we should implement a custom event to report when this specific story occurs.)

## Filter, search and segment your data with properties
You can attach arbitrary tags and numeric values to events.
 

JavaScript at client

    appInsights.trackEvent("WinGame",
        // String properties:
        {Game: currentGame.name, Difficulty: currentGame.difficulty},
        // Numeric measurements:
        {Score: currentGame.score, Opponents: currentGame.opponentCount}
    );

C# at server

    // Set up some properties:
    var properties = new Dictionary <string, string> 
        {{"game", currentGame.Name}, {"difficulty", currentGame.Difficulty}};
    var measurements = new Dictionary <string, double>
        {{"Score", currentGame.Score}, {"Opponents", currentGame.OpponentCount}};

    // Send the event:
    telemetry.TrackEvent("WinGame", properties, measurements);

VB at server

    ' Set up some properties:
    Dim properties = New Dictionary (Of String, String)
    properties.Add("game", currentGame.Name)
    properties.Add("difficulty", currentGame.Difficulty)

    Dim measurements = New Dictionary (Of String, Double)
    measurements.Add("Score", currentGame.Score)
    measurements.Add("Opponents", currentGame.OpponentCount)

    ' Send the event:
    telemetry.TrackEvent("WinGame", properties, measurements)

Attach properties to page views in the same way:

JavaScript at client

    appInsights.trackPageView("Win", 
        {Game: currentGame.Name}, 
        {Score: currentGame.Score});

In Diagnostic Search, view the properties by clicking through an individual occurrence of an event.


![In the list of events, open an event, and then click '...' to see more properties](./media/app-insights-overview-usage/11-details.png)
 
Use the Search field to see event occurrences with a particular property value.


![Type a value into the Search field](./media/app-insights-overview-usage/12-searchEvents.png)


## A | B Testing

If you don't know which variant of a feature will be more successful, release both of them, making each accessible to different users. Measure the success of each, and then move to a unified version.

For this technique, you attach distinct tags to all the telemetry that is sent by each version of your app. You can do that by defining properties in the active TelemetryContext. These default properties are added to every telemetry message that the application sends - not just your custom messages, but the standard telemetry as well. 

In the Application Insights portal, you'll then be able to filter and group (segment) your data on the tags, so as to compare the different versions.

C# at server

    using Microsoft.ApplicationInsights.DataContracts;

    var context = new TelemetryContext();
    context.Properties["Game"] = currentGame.Name;
    var telemetry = new TelemetryClient(context);
    // Now all telemetry will automatically be sent with the context property:
    telemetry.TrackEvent("WinGame");

VB at server

    Dim context = New TelemetryContext
    context.Properties("Game") = currentGame.Name
    Dim telemetry = New TelemetryClient(context)
    ' Now all telemetry will automatically be sent with the context property:
    telemetry.TrackEvent("WinGame")

Individual telemetry can override the default values.

You can set up a universal initializer so that all new TelemetryClients automatically use your context.

    // Telemetry initializer class
    public class MyTelemetryInitializer : IContextInitializer
    {
        public void Initialize (TelemetryContext context)
        {
            context.Properties["AppVersion"] = "v2.1";
        }
    }

In the app initializer such as Global.asax.cs:

    protected void Application_Start()
    {
        // ...
        TelemetryConfiguration.Active.ContextInitializers
        .Add(new MyTelemetryInitializer());
    }


## Build - Measure - Learn

When you use analytics, it becomes an integrated part of your development cycle - not just something you think about to help solve problems. Here are some tips:

* Determine the key metric of your application. Do you want as many users as possible, or would you prefer a small set of very happy users? Do you want to maximize visits or sales?
* Plan to measure each story. When you sketch a new user story or feature, or plan to update an existing one, always think about how you will measure the success of the change. Before coding starts, ask "What effect will this have on our metrics, if it works? Should we track any new events?"
And of course, when the feature is live, make sure you look at the analytics and act on the results. 
* Relate other metrics to the key metric. For example, if you add a Ã¢â‚¬ËœfavoritesÃ¢â‚¬â„¢ feature, youÃ¢â‚¬â„¢d like to know how often users add favorites. But itÃ¢â‚¬â„¢s perhaps more interesting to know how often they come back to their favorites. And, most importantly, do customers who use favorites ultimately buy more of your product?
* Canary testing. Set up a feature switch that allows you to make a new feature visible only to some users. Use Application Insights to see whether the new feature is being used in the way you envisaged. Make adjustments, then release it to a wider audience.
* Talk to your users! Analytics is not enough on its own, but complementary to maintaining a good customer relationship.





<!--Link references-->

[client]: app-insights-javascript.md
[greenbrown]: app-insights-start-monitoring-app-health-usage.md
[portal]: http://portal.azure.com/
[windows]: app-insights-windows-get-started.md

