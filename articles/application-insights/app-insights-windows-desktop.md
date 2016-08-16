<properties 
	pageTitle="Monitoring usage and performance for Windows desktop apps" 
	description="Analyze usage and performance of your Windows desktop app with HockeyApp and Application Insights." 
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
	ms.date="04/27/2016" 
	ms.author="awills"/>

# Monitoring usage and performance in Windows Desktop apps

*Application Insights is in preview.*

[Visual Studio Application Insights](app-insights-get-started.md) and [HockeyApp](https://hockeyapp.net) let you monitor your deployed application for usage and performance.

> [AZURE.IMPORTANT] We recommend [HockeyApp](https://hockeyapp.net) to distribute and monitor desktop and device apps. With HockeyApp, you can manage distribution, live testing, and user feedback, as well as monitor usage and crash reports. 

> Although telemetry can be sent to Application Insights from a desktop application, this is chiefly useful for debugging and experimental purposes.


## To send telemetry to Application Insights from a Windows application

1. In the [Azure portal](https://portal.azure.com), create a new Application Insights resource. For application type, choose ASP.NET app.
2. Take a copy of the Instrumentation Key. Find the key in the Essentials drop-down of the new resource you just created. Close the Application Map or scroll left to the overview blade for the resource.
3. In Visual Studio, edit the NuGet packages of your app project, and add Microsoft.ApplicationInsights.WindowsServer. (Or choose Microsoft.ApplicationInsights if you just want the bare API, without the standard telemetry collection modules.)
4. Set the instrumentation key either in your code:

    `TelemetryConfiguration.Active.InstrumentationKey = "` *your key* `";` 

    or in ApplicationInsights.config (if you installed one of the standard telemetry packages):
 
    `<InstrumentationKey>`*your key*`</InstrumentationKey>` 

    If you use ApplicationInsights.config, make sure its properties in Solution Explorer are set to **Build Action = Content, Copy to Output Directory = Copy**.
5. [Use the API](app-insights-api-custom-events-metrics.md) to send telemetry.
6. Run your app, and see the telemetry in the resource you created in the Azure Portal.

## <a name="telemetry"></a>Example code

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
            tc.Context.User.Id = Environment.UserName;
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

                // Allow time for flushing:
                System.Threading.Thread.Sleep(1000);
            }
            base.OnClosing(e);
        }

```


 
