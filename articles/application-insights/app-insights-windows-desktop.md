<properties 
	pageTitle="Application Insights for Windows desktop apps and services" 
	description="Analyze usage and performance of your Windows desktop app with Application Insights." 
	services="application-insights" 
    documentationCenter="windows"
	authors="alancameronwills" 
	manager="douge"/>

<tags 
	ms.service="application-insights" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="ibiza" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="08/19/2015" 
	ms.author="awills"/>

# Application Insights on Windows Desktop apps, services and worker roles

*Application Insights is in preview.*

[AZURE.INCLUDE [app-insights-selector-get-started](../../includes/app-insights-selector-get-started.md)]

Application Insights lets you monitor your deployed application for usage and performance.

All Windows applications - including desktop apps, background services, and worker roles - can use the Application Insights core SDK to send telemetry to Application Insights. The core SDK just provides an API: unlike the Web or device SDKs, it doesn't include any modules that collect data automatically, so you have to write code to send your own telemetry.


## <a name="add"></a> Create an Application Insights resource


1.  In the [Azure portal][portal], create a new Application Insights resource. For application type, choose Windows Store app. 

    ![Click New, Application Insights](./media/app-insights-windows-desktop/01-new.png)

    (Your choice of application type sets the content of the Overview blade and the properties available in [metric explorer][metrics].)

2.  Take a copy of the Instrumentation Key.

    ![Click Properties, select the key, and press ctrl+C](./media/app-insights-windows-desktop/02-props.png)

## <a name="sdk"></a>Install the SDK in your application


1. In Visual Studio, edit the NuGet packages of your desktop app project.

    ![Right-click the project and select Manage Nuget Packages](./media/app-insights-windows-desktop/03-nuget.png)

2. Install the Application Insights Core API package.

    ![Search for "Application Insights"](./media/app-insights-windows-desktop/04-core-nuget.png)

    You can install other packages such as the Performance Counter or log capture packages if you want to use their facilities.

3. Set your InstrumentationKey in code, for example in main(). 

    `TelemetryConfiguration.Active.InstrumentationKey = "your key";`

*Why isn't there an ApplicationInsights.config?*

* The .config file isn't installed by the Core API package, which is only used to configure telemetry collectors. So you write your own code to set the instrumentation key and send telemetry.
* If you installed one of the other packages, you will have a .config file. You can insert the instrumentation key there instead of setting it in code.

*Could I use a different NuGet package?*

* Yes, you could use the web server package (Microsoft.ApplicationInsights.Web), which would install collectors for a variety of collection modules such as performance counters. It would install a .config file, where you would put your instrumentation key. Use  [ApplicationInsights.config to disable modules you don't want](app-insights-configuration-with-applicationinsights-config.md), such as the HTTP Request collector. 
* If you want to use the [log or trace collector packages](app-insights-asp-net-trace-logs.md), start with the web server package. 

## <a name="telemetry"></a>Insert telemetry calls

Create a `TelemetryClient` instance and then [use it to send telemetry][api].


For example, in a Windows Forms application, you could write:

```C#

    public partial class Form1 : Form
    {
        private TelemetryClient tc = new TelemetryClient();
        ...
        private void Form1_Load(object sender, EventArgs e)
        {
            // Alternative to setting ikey in config file:
            tc.InstrumentationKey = "key copied from portal";

            // Set session data:
            tc.Context.User.Id = Environment.GetUserName();
            tc.Context.Session.Id = Guid.NewGuid().ToString();
            tc.Context.Device.OperatingSystem = Environment.OSVersion.ToString();

            // Log a page view:
            tc.TrackPageView("Form1");
            ...
        }

        protected override void OnClosing(CancelEventArgs e)
        {
            stop = true;
            if (tc != null)
            {
                tc.Flush(); // only for desktop apps
            }
            base.OnClosing(e);
        }

```

Use any of the [Application Insights API][api] to send telemetry. In Windows Desktop applications, no telemetry is sent automatically. Typically you'd use:

* TrackPageView(pageName) on switching forms, pages, or tabs
* TrackEvent(eventName) for other user actions
* TrackMetric(name, value) in a background task to send regular reports of metrics not attached to specific events.
* TrackTrace(logEvent) for [diagnostic logging][diagnostic]
* TrackException(exception) in catch clauses


To make sure all telemetry is sent before closing the app, use `TelemetryClient.Flush()`. Normally, telemetry is batched and sent at regular intervals. (Flush is recommended only if you are using just the core API. The web and device SDKs implement this behavior automatically.)


#### Context initializers

To see counts of users and sessions you can set the values on each `TelemetryClient` instance. Alternatively, you can use a context initializer to perform this addition for all clients:

```C#

    class UserSessionInitializer: IContextInitializer
    {
        public void Initialize(TelemetryContext context)
        {
            context.User.Id = Environment.UserName;
            context.Session.Id = Guid.NewGuid().ToString();
        }
    }

    static class Program
    {
        ...
        static void Main()
        {
            TelemetryConfiguration.Active.ContextInitializers.Add(
                new UserSessionInitializer());
            ...

```



## <a name="run"></a>Run your project

[Run your application with F5](http://msdn.microsoft.com/library/windows/apps/bg161304.aspx) and use it, so as to generate some telemetry. 

In Visual Studio, you'll see a count of the events that have been sent.

![](./media/app-insights-windows-desktop/appinsights-09eventcount.png)



## <a name="monitor"></a>See monitor data

Return to your application blade in the Azure portal.

The first events will appear in Diagnostic Search. 

Click Refresh after a few seconds if you're expecting more data.

If you used TrackMetric or the measurements parameter of TrackEvent, open [Metric Explorer][metrics] and open the Filters blade, where you'll see your metrics.



## <a name="Persistence Channel"></a>Persistence Channel 
By default, when you create <code>TelemetryConfiguration</code> in-memory channel will be used to communicate with the Application Insights backend. This channel has no persistence of events and will lose data if internet connection is not reliable. If you do not have an issue with this, you may use this channel. However, for more reliable telemetry you may want to use persistence channel. For desktop applicaitons use [Microsoft.ApplicationInsights.PersistenceChannel](https://www.nuget.org/packages/Microsoft.ApplicationInsights.PersistenceChannel) NuGet: 
 
```C# 
public MainWindow() 
{ 
    TelemetryConfiguration config = TelemetryConfiguration.CreateDefault(); 
    config.InstrumentationKey = "954f17ff-47ee-4aa1-a03b-bf0b1a33dbaf"; 
 
    config.TelemetryChannel = new PersistenceChannel(); 
    config.TelemetryChannel.DeveloperMode = Debugger.IsAttached; 
 
    telemetryClient = new TelemetryClient(config); 
    telemetryClient.Context.User.Id = Environment.UserName; 
    telemetryClient.Context.Session.Id = Guid.NewGuid().ToString(); 
 
    InitializeComponent(); 
} 
``` 
 
Persistence channel is optimized for devices scenario when the number of events produced by application is relatively small and connection is often unreliable. This channel will write events to the disk into reliable storage first and then attempt to send it. Here is how it works. 
Let’s say you want to monitor unhandled exceptions. You’d subscribe on <code>UnhandledException</code> event and in the corresponding callback you want to make sure that telemetry will be persisted. So you call <code>Flush</code> on telemetry client. 
 
```C# 
AppDomain.CurrentDomain.UnhandledException += CurrentDomain_UnhandledException; 
 
... 
 
private void CurrentDomain_UnhandledException(object sender, UnhandledExceptionEventArgs e) 
{ 
    ExceptionTelemetry excTelemetry = new ExceptionTelemetry((Exception)e.ExceptionObject); 
    excTelemetry.SeverityLevel = SeverityLevel.Critical; 
    excTelemetry.HandledAt = ExceptionHandledAt.Unhandled; 
 
    telemetryClient.TrackException(excTelemetry); 
 
    telemetryClient.Flush(); 
} 
``` 
The only thing method <code>Flush</code> will do is to make sure that all telemetry events from the buffer are stored in persistence storage. In my case when I enter incorrect zip code - application will crash with <code>ArgumentExcetpion</code> and I’ll see new file named <code>20150810005005_84fb4de977e24c8399618daf2c4eb57d.trn</code> into the folder <code>%LocalAppData%\Microsoft\ApplicationInsights\35eb39bd0bb5855e732748ad369ffacc10de7340</code>. 
 
This file has all events scheduled to be send to the backend compressed with GZIP. 
 
```C# 
https://dc.services.visualstudio.com/v2/track 
Content-Type:application/x-json-stream 
Content-Encoding:gzip 
 
H4sIAAAAAAAEAN2YbW/bNhDH3w/YdzD0tjahR8sWkgCps6JZ4yyL3ebFXASUdLI5S5RKUk7cIN99R9mulYd5SR/UYMkbizqefve/I0/UjcFpBkZgDFkkcpknihwWRcoiqljOj7lk05mSpO+5ieUniesDuJRa1HTCMDFDizpOHNKE/LYAroy2oVjlzTYtr2P2OmZ/bPmBZwamR3pez7S7Tsf0A9NEU/YOlmi6cd3RvjvaeUd779Tda8d0Ko3gxqCMMK5AcJoSGc8/gJAIin4sYhOTeF2nj9ZoVUoQhMV4B39M55R/Xo1LkHrG6pYdU8tzqdfx+0jrdm2vE/a6Vsft22DaNPQ8yzRu20ZMFdVPD6mE8bLQIVYRH+nxdjV8tDZZgDACu73RdQxZAYKqUsA5fCpBKohxRgZU4lCGPqqw4lJUihuBY3n4wELkOE0xqO5+ZoVWqmd6dmzc4t+vv9x8r8RdR1BUT96dvL5t2v7/J3mbqHckcEZ5nEJ8qND+PV9foS1s5mJIf90YGsXCxDhmz8FI0f/pKjGjJeY6I4diWuo0n5ZpWhc7w1DoVBt+oGkJrYhynqtWCC2OlmQiJvyMCnSFerV0roOWzEsRgaHR5Bs0GikazY1AiRKwYqiQEK+HkCuFBaRGYOonqVmuBTuFK4XYulZ+l6jiCeOfsAAUcC2qJBWIFlpKyMJ0+XBKu7XO2b6P+cL/dmtQprq49zmUStC03TorQyxDrI9xPge+75g0dhPohjbtUkAFb9tf4KyXDGfX4C6KpLa6LDKkjF8wHudXr/bCUiHFAG/OL8VqiQ9KITDltbV/EF9eOmSYL+AUrtXdMO4534ZhPTUMXTHoM2HppviiYDLB6ismk3veHxnYBkOuaZaSSKKvlHH049s1QZyaIOviPi+53jTIIM8KfLgYgViwCCQ5lEseDSvr1yVLYxCDXMCrvYPo8vKIySKly0GKGthkbzwT+VVlfxCiSHe1yWSUi5SFW1Hcp4oS+j71Iq9r9R0XzF6/nlv3YSgrBSRBHKAx49Pt1nghaIGJJMfrvescaDqgleT1NK4cvMat5CtoHStMnJ7XpbHTdcHx6rTeV9GOxXJAVTS7mAFvirT7FFKdfw0G4o9qeegN/Zgv0PlxVjQmqv+NqHwEUSmYWg5yLIsHa/qHcfcecteLAKE05RpKL9BN1TaysPrPpWuEyjJfJpb1bTXYVMlZ9vM4yZnIsQnIP0u437J/IOQj7Wkn5AWPNefbPJ83xljvO8OR5nNs8vaKx5tNew3VGJD3b0CjMox0g64pplteiK+XX8qwMcontZUX066tJ7WWF9GvrUe6yc5FcwJTGi2b79ZW/z8LdfOj4SVkm4+RveeSJvgyrtgCVq/B25U0XJ/8mgJ8ZpchZ6WcvdEnzyYTbD+7x2woGyPc0WBqByr99rDFvAt3JkDiubCyq9ivcjH/3pg7zjb3MB9/M2wEcseR5h7kT4Db0W5+Ppy/47MEXlSfJl7W94U8/HsyOYKwnE4mmnCqvzDcfrz92DYkBqXPUCer4IwBXuDEVH/k/AeYVOh5mxYAAA== 
``` 
 
Next time you start this application - channel will pick up this file and deliver telemetry to the Application Insights. 
All the implementation details of this telemetry configuration you may find on [github](https://github.com/Microsoft/ApplicationInsights-dotnet/tree/master/src/TelemetryChannels/PersistenceChannel). 


## <a name="usage"></a>Next Steps

[Track usage of your app][knowUsers]

[Capture and search diagnostic logs][diagnostic]

[Troubleshooting][qna]




<!--Link references-->

[diagnostic]: app-insights-diagnostic-search.md
[metrics]: app-insights-metrics-explorer.md
[portal]: http://portal.azure.com/
[qna]: app-insights-troubleshoot-faq.md
[knowUsers]: app-insights-overview-usage.md
[api]: app-insights-api-custom-events-metrics.md
[CoreNuGet]: https://www.nuget.org/packages/Microsoft.ApplicationInsights
 
