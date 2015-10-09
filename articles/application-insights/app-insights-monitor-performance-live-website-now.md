<properties
	pageTitle="Diagnose performance issues on a running IIS website | Microsoft Azure"
	description="Monitor a website's performance without re-deploying it. Use standalone or with Application Insights SDK to get dependency telemetry."
	services="application-insights"
    documentationCenter=".net"
	authors="alancameronwills"
	manager="douge"/>

<tags
	ms.service="application-insights"
	ms.workload="tbd"
	ms.tgt_pltfrm="ibiza"
	ms.devlang="na"
	ms.topic="get-started-article"
	ms.date="09/23/2015"
	ms.author="awills"/>


# Install Application Insights Status Monitor to monitor website performance

*Application Insights is in preview.*

The Status Monitor of Visual Studio Application Insights lets you diagnose exceptions and performance issues in ASP.NET applications. 

![sample charts](./media/app-insights-monitor-performance-live-website-now/10-intro.png)

> [AZURE.TIP] There are separate articles about  instrumenting [live J2EE web apps](app-insights-java-live.md) and [Azure Cloud Services](app-insights-cloudservices.md).


You have a choice of three ways to apply Application Insights to your IIS web applications:

* **Build time:** [Add the Application Insights SDK][greenbrown] to your web app code. This gives you:
 * A range of standard diagnostic and usage telemetry.
 * The [Application Insights API][api] lets you write your own telemetry to track detailed usage or diagnose problems.
* **Run time:** Use Status Monitor to instrument your web app on the server.
 * Monitor web apps that are already running: no need to rebuild or republish them.
 * A range of standard diagnostic and usage telemetry.
 * Dependency diagnostics&#151;locate faults or poor performance where your app uses other components such as databases, REST APIs, or other services.
 * Troubleshoot any issues with telemetry.
* **Both:** Compile the SDK into your web app code, and run Status Monitor on your web server.  The best of both worlds:
 * Standard diagnostic and usage telemetry.
 * Dependency diagnostics.
 * The API lets you write custom telemetry.
 * Troubleshoot any issues with the SDK and telemetry.


## Install Application Insights Status Monitor

You need a [Microsoft Azure](http://azure.com) subscription.

### If your app runs on your IIS server

1. On your IIS web server, login with administrator credentials.
2. Download and run the [Status Monitor installer](http://go.microsoft.com/fwlink/?LinkId=506648).
4. In the installation wizard, sign in to Microsoft Azure.

    ![Sign into Azure with your Microsoft account credentials](./media/app-insights-monitor-performance-live-website-now/appinsights-035-signin.png)

    *Connection errors? See [Troubleshooting](#troubleshooting).*

5. Pick the installed web application or website that you want to monitor, then configure the resource in which you want to see the results in the Application Insights portal.

    ![Choose an app and a resource.](./media/app-insights-monitor-performance-live-website-now/appinsights-036-configAIC.png)

    Normally, you choose to configure a new resource and [resource group][roles].

    Otherwise, use an existing resource if you already set up [web tests][availability] for your site, or [web client monitoring][client].

6. Restart IIS.

    ![Choose Restart at the top of the dialog.](./media/app-insights-monitor-performance-live-website-now/appinsights-036-restart.png)

    Your web service will be interrupted for a short while.

6. Notice that ApplicationInsights.config has been inserted into the web apps that you want to monitor.

    ![Find the .config file alongside the code files of the web app.](./media/app-insights-monitor-performance-live-website-now/appinsights-034-aiconfig.png)

   There are also some changes to web.config.

#### Want to (re)configure later?

After you complete the wizard, you can re-configure the agent whenever you want. You can also use this if you installed the agent but there was some trouble with the initial setup.

![Click the Application Insights icon on the task bar](./media/app-insights-monitor-performance-live-website-now/appinsights-033-aicRunning.png)


### If your app runs as an Azure Web App

In the control panel of your Azure Web App, add the Application Insights extension.

![In your web app, Settings, Extensions, Add, Application Insights](./media/app-insights-monitor-performance-live-website-now/05-extend.png)


### If it's an Azure cloud services project

[Add scripts to web and worker roles](app-insights-cloudservices.md).


## View performance telemetry

Sign into [the Azure Preview portal](http://portal.azure.com), browse Application Insights and open the resource that you created.

![Choose Browse, Application Insights, then select your app](./media/app-insights-monitor-performance-live-website-now/appinsights-08openApp.png)

Open the Performance blade to see request, response time, dependency and other data.

![Performance](./media/app-insights-monitor-performance-live-website-now/21-perf.png)

Click to adjust the details of what it displays, or add a new chart.


![](./media/app-insights-monitor-performance-live-website-now/appinsights-038-dependencies.png)

## Dependencies

The Dependency Duration chart shows the time taken by calls from your app to external components such as databases, REST APIs, or Azure blob storage.

To segment the chart by calls to different dependencies, select the chart, turn on Grouping, and then choose Dependency, Dependency Type or Dependency Performance.

You can also filter the chart to look at a specific dependency, type, or performance bucket. Click Filters.

#### Performance counters

(Not for Azure web apps.) Click Servers on the overview blade to see charts of server performance counters such as CPU occupancy and memory usage.

Add a new chart, or click any chart to change what it shows. 

You can also [change the set of performance counters that are reported by the SDK](app-insights-configuration-with-applicationinsights-config.md#nuget-package-3). 

#### Exceptions

![Click through the server exceptions chart](./media/app-insights-monitor-performance-live-website-now/appinsights-039-1exceptions.png)

You can drill down to specific exceptions (from the last seven days) and get stack traces and context data.


## Troubleshooting

### Connection errors

You need to open some outgoing ports in your server's firewall to allow Status Monitor to work:

+ Telemetry - these are needed all the time:
 +	`dc.services.visualstudio.com:80`
 +	`f5.services.visualstudio.com:80`
 +	`dc.services.visualstudio.com:443`
 +	`f5.services.visualstudio.com:443`
 +	`dc.services.vsallin.net:443`
+ Configuration - needed only when making changes:
 -	`management.core.windows.net:443`
 -	`management.azure.com:443`
 -	`login.windows.net:443`
 -	`login.microsoftonline.com:443`
 -	`secure.aadcdn.microsoftonline-p.com:443`
 -	`auth.gfx.ms:443`
 -	`login.live.com:443`
+ Installation:
 +	`packages.nuget.org:443`
 +	`appinsightsstatusmonitor.blob.core.windows.net:80`

This list may change from time to time.

### No telemetry?

  * Use your site, to generate some data.
  * Wait a few minutes to let the data arrive, then click **Refresh**.
  * Open Diagnostic Search (the Search tile) to see individual events. Events are often visible in Diagnostic Search before aggregate data appears in the charts.
  * Open Status Monitor and select your application on left pane. Check if there are any diagnostics messages for this application in the "Configuration notifications" section:

  ![](./media/app-insights-monitor-performance-live-website-now/appinsights-status-monitor-diagnostics-message.png)

  * Make sure your server firewall allows outgoing traffic on the ports listed above.
  * On the server, if you see a message about "insufficient permissions", try the following:
    * In IIS Manager, select your application pool, open **Advanced Settings**, and under **Process Model** note the identity.
    * In Computer management control panel, add this identity to the Performance Monitor Users group.
  * See [Troubleshooting][qna].

## System Requirements

OS support for Application Insights Status Monitor on Server:

- Windows Server 2008
- Windows Server 2008 R2
- Windows Server 2012
- Windows server 2012 R2

with latest SP and .NET Framework 4.0 and 4.5

On the client side Windows 7, 8 and 8.1, again with .NET Framework 4.0 and 4.5

IIS support is: IIS 7, 7.5, 8, 8.5
(IIS is required)

## <a name="next"></a>Next steps

* [Create web tests][availability] to make sure your site stays live.
* [Search events and logs][diagnostic] to help diagnose problems.
* [Add web client telemetry][usage] to see exceptions from web page code and to let you insert trace calls.
* [Add Application Insights SDK to your web service code][greenbrown] so that you can insert trace and log calls in the server code.

## Video

#### Performance monitoring

[AZURE.VIDEO app-insights-performance-monitoring]

<!--Link references-->

[api]: app-insights-api-custom-events-metrics.md
[availability]: app-insights-monitor-web-app-availability.md
[client]: app-insights-javascript.md
[diagnostic]: app-insights-diagnostic-search.md
[greenbrown]: app-insights-start-monitoring-app-health-usage.md
[qna]: app-insights-troubleshoot-faq.md
[roles]: app-insights-resources-roles-access-control.md
[usage]: app-insights-web-track-usage.md
