<properties title="Search diagnostic logs with Application Insights" pageTitle="Search diagnostic logs" description="Search logs generated with Trace, NLog, or Log4Net." metaKeywords="analytics web test" authors="awills"  manager="kamrani" />

<tags ms.service="application-insights" ms.workload="tbd" ms.tgt_pltfrm="ibiza" ms.devlang="na" ms.topic="article" ms.date="2014-12-11" ms.author="awills" />
 
# Diagnostic search in Application Insights

Diagnostic Search provides a powerful mechanism for filtering and searching trace, event, and exception telemetry sent by your application. And if you already use log4net, NLog, or System.Diagnostics.Trace, you can capture those logs and include them in the search.


## <a name="send"></a>Send telemetry from your application

If you haven't yet [set up Application Insights for your project][start], do that now.


When you run your application, it will send some telemetry that will show up in Diagnostic Search, including requests received by the server, page views logged at the client, and uncaught exceptions.


## <a name="view"></a>View the telemetry sent by your application


In Application Insights, open Diagnostic Search.

![Open diagnostic search](./media/appinsights/appinsights-30openDiagnostics.png)
   
The report lists telemetry over the time range and filters you choose. 

![Open diagnostic search](./media/appinsights/appinsights-331filterTrace.png)

Select any telemetry item to see key fields and related items. If you want to see the full set of fields, click "...". 

![Open diagnostic search](./media/appinsights/appinsights-32detail.png)

To filter the full set of fields, use plain strings (without wildcards). The available fields depend on the type of telemetry.

## Filter event types

Open the Filter blade and choose the event types you want to see.


![Open diagnostic search](./media/appinsights/appinsights-321filter.png)

The event types are:

* **[Trace](#trace)** - Diagnostic logs including TrackTrace,  log4Net, NLog, and System.Diagnostic.Trace calls.
* **[Request](#requests)** - HTTP requests received by your server application, including pages, scripts, images, style files and data. These events are used to create the request and response overview charts.
* **[Page View](#pages)** - Telemetry sent by the web client, used to create page view reports. 
* **[Custom Event](#events)** - If you inserted calls to TrackEvent() in order to [monitor usage][track], you can search them here.
* **[Exception](#exceptions)** - Uncaught exceptions in the server, and those that you log by using TrackException().

### Filter on property values

You can filter events on the values of their properties. The available properties depend on the event types you selected. 

For example, pick out a specific type of exception.

![Select facet values](./media/appinsights/appinsights-333facets.png)

Choosing no values of a particular property has the same effect as choosing all values; it switches off filtering on that property.


## <a name="search"></a>Search the data

Set a time range and search for terms. Searches over a shorter range are faster. 

![Open diagnostic search](./media/appinsights/appinsights-311search.png)

Search for terms, not substrings. Terms are alphanumeric strings including some punctuation such as '.' and '_'. For example:

<table>
  <tr><th>term</th><th>is NOT matched by</th><th>but these do match</th></tr>
  <tr><td>HomeController.About</td><td>about<br/>home</td><td>h*about<br/>home*</td></tr>
  <tr><td>IsLocal</td><td>local<br/>is<br/>*local</td><td>isl*<br/>islocal<br/>i*l</td></tr>
  <tr><td>New Delay</td><td>w d</td><td>new<br/>delay<br/>n* AND d*</td></tr>
</table>

Here are the search expressions you can use:

<table>
                    <tr>
                      <th>
                        <p>Sample query</p>
                      </th>
                      <th>
                        <p>Effect</p>
                      </th>
                    </tr>
                    <tr>
                      <td>
                        <p>
                          <span class="code">slow</span>
                        </p>
                      </td>
                      <td>
                        <p>Find all events in the date range whose fields include the term "slow"</p>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <p>
                          <span class="code">database??</span>
                        </p>
                      </td>
                      <td>
                        <p>Matches database01, databaseAB, ...</p>
                        <p>? is not allowed at the start of a search term.</p>
                      </td>
                    </tr>
                     <tr>
                      <td>
                        <p>
                          <span class="code">database*</span>
                        </p>
                      </td>
                      <td>
                        <p>Matches database, database01, databaseNNNN</p>
                        <p>* is not allowed at the start of a search term</p>
                      </td>
                    </tr>
                   <tr>
                      <td>
                        <p>
                          <span class="code">apple AND banana</span>
                        </p>
                      </td>
                      <td>
                        <p>Find events that contain both terms. Use capital "AND", not "and".</p>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <p>
                          <span class="code">apple OR banana</span>
                        </p>
                        <p>
                          <span class="code">apple banana</span>
                        </p>
                      </td>
                      <td>
                        <p>Find events that contain either term. Use "OR", not "or".</p>
                        <p>Short form.</p>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <p>
                          <span class="code">apple NOT banana</span>
                        </p>
                        <p>
                          <span class="code">apple -banana</span>
                        </p>
                      </td>
                      <td>
                        <p>Find events that contain one term but not the other.</p>
                        <p>Short form.</p>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <p>app* AND banana NOT (grape OR pear)</p>
                        <p>
                          <span class="code">app* AND banana -(grape pear)</span>
                        </p>
                      </td>
                      <td>
                        <p>Logical operators and bracketing.</p>
                        <p>Shorter form.</p>
                      </td>
                    </tr>
       <!-- -- fielded search feature not ready yet --
                    <tr>
                      <td>
                        <p>
                          <span class="code">message:slow</span>
                        </p>
                        <p>
                          <span class="code">ipaddress:(10.0.0.* OR 192.168.0.*)</span>
                        </p>
                        <p>
                          <span class="code">properties.logEventInfo.level:Error</span>
                        </p>
                      </td>
                      <td>
                        <p>Match the specified field. By default, all fields are searched. To see what fields are available, select an event to look at its detail.</p>
                      </td>
                    </tr>
 -->
</table>

## Send telemetry to Diagnostic Search

###<a name="requests"></a>Requests

Request telemetry is sent automatically when you [install Status Monitor on your server][redfield], or when you [add Application Insights to your web project][greenbrown]. It also feeds into the request and response time charts in Metric Explorer and on the Overview page.

###<a name="pages"></a> Page views

Page view telemetry is sent by the trackPageView() call in [the JavaScript snippet you insert in your web pages][usage]. Its main purpose is to contribute to the counts of page views that you see on the overview page.

Usually it is called once in each HTML page, but you can insert more calls - for example, if you have a single-page app and you want to log a new page whenever the user gets more data.

    appInsights.trackPageView(pageSegmentName, "http://fabrikam.com/page.htm"); 

It's sometimes useful to attach properties that you can use as filters in diagnostic search:

    appInsights.trackPageView(pageSegmentName, "http://fabrikam.com/page.htm",
     {Game: currentGame.name, Difficulty: currentGame.difficulty});

###<a name="events"></a>Custom events

Custom events show up both in Diagnostic Search and in Metric Explorer. You can send them both from the web client and the server application. They are typically used to [understand patterns of use][track], but it's also useful to correlate them with exceptions and traces.

A custom event has a name, and can also carry properties that you can filter on, together with numeric measurements.

JavaScript at client

    appInsights.trackEvent("EndOfGame",
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
    telemetry.TrackEvent("endOfGame", properties, measurements);


VB at server

    ' Set up some properties:
    Dim properties = New Dictionary (Of String, String)
    properties.Add("game", currentGame.Name)
    properties.Add("difficulty", currentGame.Difficulty)

    Dim measurements = New Dictionary (Of String, Double)
    measurements.Add("Score", currentGame.Score)
    measurements.Add("Opponents", currentGame.OpponentCount)

    ' Send the event:
    telemetry.TrackEvent("endOfGame", properties, measurements)



###<a name="trace"></a> Trace telemetry

Trace telemetry is code that you insert specifically to create diagnostic logs. 

* If you want to use a logging framework - log4Net, NLog or System.Diagnostics.Trace, you can capture their logs by adding our adapter to your project.

* You can also use TrackTrace(), which is built in to Application Insights SDK.

####  Install an adapter for your logging framework



To search logs generated with log4Net, NLog, or System.Diagnostics.Trace, install the appropriate adapter. (If you only use the built-in Application Insights SDK Track*() calls, you don't need an adapter - [skip to the next section](#pepper).)

1. If you plan to use log4Net or NLog, install it in your project. 
2. In Solution Explorer, right-click your project and choose **Manage NuGet Packages**.
3. Select Online > All, select **Include Prerelease** and search for "Microsoft.ApplicationInsights"

    ![Get the prerelease version of the appropriate adapter](./media/appinsights/appinsights-36nuget.png)

4. Select the appropriate package - one of:
  + Microsoft.ApplicationInsights.TraceListener (to capture System.Diagnostics.Trace calls)
  + Microsoft.ApplicationInsights.NLogTarget
  + Microsoft.ApplicationInsights.Log4NetAppender

The NuGet package installs the necessary assemblies, and also modifies web.config or app.config.

#### <a name="pepper"></a>Insert diagnostic log calls

Insert event logging calls using your chosen logging framework. 

For example, if you use the Application Insights SDK, you might insert:

    var telemetry = new Microsoft.ApplicationInsights.TelemetryClient();
    telemetry.TrackTrace("Slow response - database01");

Or if you use System.Diagnostics.Trace:

    System.Diagnostics.Trace.TraceWarning("Slow response - database01");

If you prefer log4net or NLog:

    logger.Warn("Slow response - database01");

Run your app in debug mode, or deploy it to your web server.

You'll see the messages in Diagnostic Search when you select the Trace filter.

### <a name="exceptions"></a>Exceptions

Getting exception reports in Application Insights provides a very powerful experience, especially since you can navigate between the failed requests and the exceptions, and read the exception stack.

You can write code to send exception telemetry:

JavaScript at client

    try 
    { ...
    }
    catch (ex)
    {
      appInsights.TrackException(ex, "handler loc",
        {Game: currentGame.Name, 
         State: currentGame.State.ToString()});
    }

C# at server

    var telemetry = new TelemetryClient();
    ...
    try 
    { ...
    }
    catch (Exception ex)
    {
       // Set up some properties:
       var properties = new Dictionary <string, string> 
         {{"Game", currentGame.Name}};

       var measurements = new Dictionary <string, double>
         {{"Users", currentGame.Users.Count}};

       // Send the exception telemetry:
       telemetry.TrackException(ex, properties, measurements);
    }

VB at server

    Dim telemetry = New TelemetryClient
    ...
    Try
      ...
    Catch ex as Exception
      ' Set up some properties:
      Dim properties = New Dictionary (Of String, String)
      properties.Add("Game", currentGame.Name)

      Dim measurements = New Dictionary (Of String, Double)
      measurements.Add("Users", currentGame.Users.Count)
  
      ' Send the exception telemetry:
      telemetry.TrackException(ex, properties, measurements)
    End Try

The properties and measurements parameters are optional, but are useful for filtering and adding extra information. For example, if you have an app that can run several games, you could find all the exception reports related to a particular game. You can add as many items as you like to each dictionary.

### Reporting unhandled exceptions

Application Insights reports unhandled exceptions where it can, from [the web browser][usage] and the server, whether instrumented by [Status Monitor][redfield] or [Application Insights SDK][greenbrown]. 

However, it isn't always able to do this in the server because the .NET framework catches the exceptions.  To make sure you see all exceptions, you therefore have to write a small exception handler. The best procedure varies with the technology. Please see [this blog](http://blogs.msdn.com/b/visualstudioalm/archive/2014/12/12/application-insights-exception-telemetry.aspx) for details. 

### Correlating with a build

When you read diagnostic logs, it's likely that your source code will have changed since the live code was deployed.

It's therefore useful to put build information, such as the URL of the current version, into a property along with each exception or trace. 

Instead of adding the property separately to every exception call, you can set the information in the default context. 

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


## <a name="questions"></a>Q & A

### <a name="emptykey"></a>I get an error "Instrumentation key cannot be empty"

Looks like you installed the logging adapter Nuget package without installing Application Insights.

In Solution Explorer, right-click `ApplicationInsights.config` and choose **Update Application Insights**. You'll get a dialog that invites you to sign in to Azure and either create an Application Insights resource, or re-use an existing one. That should fix it.

### <a name="limits"></a>How much data is retained?

Up to 500 events per second from each application. Events are retained for seven days.

## <a name="add"></a>Next steps

* [Set up availability and responsiveness tests][availability]
* [Troubleshooting][qna]





[AZURE.INCLUDE [app-insights-learn-more](../includes/app-insights-learn-more.md)]




