<properties 
	pageTitle="Trace usage and events in your web app with Application Insights API" 
	description="Insert a few lines of code to track usage and diagnose issues." 
	services="application-insights" 
	authors="alancameronwills" 
	manager="kamrani"/>
 
<tags 
	ms.service="application-insights" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="ibiza" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="2015-02-06" 
	ms.author="awills"/>

# Write custom telemetry with Application Insights API

*Application Insights is in preview.*

Insert a few lines of code in your application to find out what users are doing with it, or to help diagnose issues. You can send telemetry from device apps, web clients, and web servers.

The APIs for all platforms are very similar, and can be used separately or in any combination. If your app has client and server components, you can send telemetry from both parts. This is true whether the client is a web page or an app running in a phone or other device.


## <a name="prep"></a>Before you start

If you haven't done these yet:

* Add the Application Insights SDK to your project:
 * [ASP.NET project][greenbrown]
 * [Windows device project][windows]
 * [Java project][java]    

* In your device or web server code, include:

  (C#) `using Microsoft.ApplicationInsights;`

  (VB) `Imports Microsoft.ApplicationInsights`

  (Java) `import com.microsoft.applicationinsights.TelemetryClient;`

* To monitor web pages, [add the Application Insights script to each page][usage]. The JavaScript initialization code should be included in every web page you want to monitor. 

    If it's working, you should see data on the Overview blade, under Usage Analytics.

When you run your app on your development machine in debug mode, results will appear in Application Insights within seconds. When you deploy the app, data takes longer to move through the pipeline from your server, or your users' devices or web browsers.


## <a name="pageViews"></a>Page views

In a web page app, page view telemetry is sent by default when each HTML page is loaded. But you can change that to track page views at additional or different times. For example, in an app that displays tabs or blades, you might want to track a page whenever the user opens a new tab.

In a phone or other device app, there is no default page view telemetry, but we recommend you add your own to track when the user opens different screens. 

![Usage lens on Overview blade](./media/appinsights/appinsights-47usage-2.png)

#### Custom page views

*JavaScript*

    appInsights.trackPageView("tab1");

*C#*

    var telemetry = new TelemetryClient();
    telemetry.TrackPageView("GameReviewPage");

*VB*

    Dim telemetry = New TelemetryClient
    telemetry.TrackPageView("GameReviewPage")


If you have several tabs within different HTML pages, you can specify the URL too:

    appInsights.trackPageView("tab1", "http://fabrikam.com/page1.htm");

#### Timed page views

By using this pair of methods calls instead of trackPageView, you can analyze how long users linger on your pages.

    // At the start of a page view:
    appInsights.startTrackPage(myPage.name);

    // At the completion of a page view:
    appInsights.stopTrackPage(myPage.name, "http://fabrikam.com/page", properties, measurements);

Use the same string as the first parameter in the start and stop calls.

Look at the Page Duration metric in [Metrics Explorer][metrics].

## <a name="events"></a>Track events

Events can be displayed on the portal as an aggregated count, and you can also display individual occurrences. 

For example, to count how many games have been won:

*JavaScript*

    appInsights.trackEvent("WinsGame");

*C#*
    
    var telemetry = new TelemetryClient();
    telemetry.TrackEvent("WinGame");

*VB*


    Dim telemetry = New TelemetryClient
    telemetry.TrackEvent("WinGame")

*Java*

    TelemetryClient telemetry = new TelemetryClient();
    telemetry.trackEvent("WinGame");


The top events show up on the overview blade:

![](./media/appinsights/appinsights-23-customevents-1.png)

Click through to see an overview chart and a complete list.

Select the chart and segment it by Event name to see the relative contributions of the most significant events.

![](./media/appinsights/appinsights-23-customevents-2.png)

From the list below the chart, select an event name to see individual occurrences of the event.

![](./media/appinsights/appinsights-23-customevents-3.png)

#### <a name="timed"></a> Timed events (web client code)

You can attach timing data to events. Instead of calling trackEvent, use these calls:

JavaScript at client

    // At the start of the game:
    appInsights.startTrackEvent(game.id);

    // At the end of the game:
    appInsights.stopTrackEvent(game.id, {GameName: game.name}, {Score: game.score});

Use the same string as the first parameter in the start and stop calls.

## <a name="properties"></a>Filter, search and segment your data with properties

You can attach properties and measurements to your metrics, events, page views, and other telemetry data. 

**Properties** are string values that you can use to filter your telemetry in the usage reports. For example if your app provides several games, you’ll want to attach the name of the game to each event, so that you can see which games are more popular.

**Metrics** are numeric values that can be presented graphically. For example, you might want to see if there's a gradual increase in the scores your gamers achieve. The graphs can be segmented by the properties sent with the event, so that you could get separate or stacked graphs for different games.

*JavaScript*

    appInsights.trackEvent // or trackPageView, trackMetric, ...
      ("WinGame",
         // String properties:
         {Game: currentGame.name, Difficulty: currentGame.difficulty},
         // Numeric metrics:
         {Score: currentGame.score, Opponents: currentGame.opponentCount}
         );

*C#*

    // Set up some properties:
    var properties = new Dictionary <string, string> 
       {{"game", currentGame.Name}, {"difficulty", currentGame.Difficulty}};
    var metrics = new Dictionary <string, double>
       {{"Score", currentGame.Score}, {"Opponents", currentGame.OpponentCount}};

    // Send the event:
    telemetry.TrackEvent("WinGame", properties, metrics);


*VB*

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

    TelemetryClient telemetry = new TelemetryClient();
    
    Map<String, String> properties = new HashMap<String, String>();
    properties.put("game", currentGame.getName());
    properties.put("difficulty", currentGame.getDifficulty());
    
    Map<String, Double> metrics = new HashMap<String, Double>();
    metrics.put("Score", currentGame.getScore());
    metrics.put("Opponents", currentGame.getOpponentCount());
    
    telemetry.trackEvent("WinGame", properties, metrics2/7/2015 12:05:25 AM );


> [AZURE.NOTE] Take care not to log personally identifiable information in properties.

**If you used metrics**, open Metric Explorer and select the metric from the Custom group:

![](./media/app-insights-web-track-usage/03-track-custom.png)

**If you used properties and metrics**, segment the metric by the property:


![](./media/app-insights-web-track-usage/04-segment-metric-event.png)



**In Diagnostic Search**, you can view the properties and metrics of individual occurrences of an event.


![](./media/appinsights/appinsights-23-customevents-4.png)


Use the Search field to see event occurrences with a particular property value.


![](./media/appinsights/appinsights-23-customevents-5.png)

[Learn more about search strings][diagnostic]


## <a name="metrics"></a>Track metrics

You can sent metrics that are not attached to particular events. For example, you could monitor a queue length at regular intervals. 

*JavaScript*

    appInsights.trackMetric("Queue", queue.Length);

*C#*

    var telemetry = new TelemetryClient();
    client.TrackMetric("Queue", queue.Length);

*VB*

    Dim telemetry = New TelemetryClient
    telemetry.TrackMetric("Queue", queue.Length)

*Java*

    TelemetryClient telemetry = new TelemetryClient();
    telemetry.trackMetric("Queue", queue.Length);

To see the results, open Metrics Explorer and add a new chart. Set it to display your metric.

![](./media/app-insights-web-track-usage/03-track-custom.png)





## <a name="defaults"></a>Set default property values (not at web client)

You can set default values in a TelemetryContext. They are attached to every metric and event sent from the context. 
    

*C#*

    using Microsoft.ApplicationInsights.DataContracts;

    var context = new TelemetryContext();
    context.Properties["Game"] = currentGame.Name;
    var telemetry = new TelemetryClient(context);
    // Now all telemetry will automatically be sent with the context property:
    telemetry.TrackEvent("WinGame");
    
*VB*

    Dim context = New TelemetryContext
    context.Properties("Game") = currentGame.Name
    Dim telemetry = New TelemetryClient(context)
    ' Now all telemetry will automatically be sent with the context property:
    telemetry.TrackEvent("WinGame")

*Java*

    import com.microsoft.applicationinsights.TelemetryClient;
    import com.microsoft.applicationinsights.TelemetryContext;
    ...


    TelemetryClient telemetry = new TelemetryClient();
    TelemetryContext context = telemetry.getContext();
    context.getProperties().put("Game", currentGame.Name);

    
Individual telemetry can override the default values.

You can set up a universal initializer so that all new TelemetryClients automatically use your context.

*C#*

    // Telemetry initializer class
    public class MyTelemetryInitializer : IContextInitializer
    {
        public void Initialize (TelemetryContext context)
        {
            context.Properties["AppVersion"] = "v2.1";
        }
    }

In the app initializer such as Global.asax.cs:

*C#*

    protected void Application_Start()
    {
        // ...
        TelemetryConfiguration.Active.ContextInitializers
        .Add(new MyTelemetryInitializer());
    }

## Set instrumentation key in code

Instead of getting the instrumentation key from the configuration file, you can set it in your code. You might want to do this, for example, to send telemetry from test installations to a different Application Insights resource than telemetry from the live application.

Set the key in an initialization method, such as global.aspx.cs in an ASP.NET service:

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


In web pages, you might want to set it from the web server's state, rather than coding it literally into the script. For example, in a web page generated in an ASP.NET app:

*JavaScript in Razor*

    <script type="text/javascript">
    // Standard Application Insights web page script:
    var appInsights = window.appInsights || function(config){ ...
    // Modify this part:
    }({instrumentationKey:  
      // Generate from server property:
      @Microsoft.ApplicationInsights.Extensibility.
         TelemetryConfiguration.Active.InstrumentationKey"
    }) // ...



## <a name="debug"></a>Debug mode

During debugging, it's useful to have your telemetry expedited through the pipeline so that you can see results immediately.

*JavaScript*
    // Insert this in the initialization script, just before trackPageView:
    appInsights.config.enableDebug = true;


## <a name="next"></a>Next steps


[Search events and logs][diagnostic]

[Troubleshooting][qna]


[AZURE.INCLUDE [app-insights-learn-more](../includes/app-insights-learn-more.md)]




