<properties 
	pageTitle="Diagnose performance issues on a running website" 
	description="Monitor a website's performance without re-deploying it. Use standalone or with Application Insights SDK to get dependency telemetry." 
	services="application-insights" 
    documentationCenter=".net"
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
 

# Install Application Insights Status Monitor to monitor website performance

*Application Insights is in preview.*

The Status Monitor of Visual Studio Application Insights lets you diagnose exceptions and performance issues in web applications running in any IIS server. Just install it on your Azure or standalone IIS web server and it will instrument the ASP.NET web apps it finds there, sending data to the Application Insights portal for you to search and analyse. 

![sample charts](./media/app-insights-monitor-performance-live-website-now/10-intro.png)

You have a choice of three ways to apply Application Insights to your IIS web applications:

* **Build time:** [Add the Application Insights SDK][greenbrown] to your web app code. This gives you:
 * A range of standard diagnostic and usage telemetry. 
 * And you can use the [Application Insights API][api] if you want to write your own telemetry to track usage or diagnose problems.
* **Run time:** Use Status Monitor to instrument your web app on the server.
 * Monitor web apps that are already running: no need to rebuild or republish them.
 * A range of standard diagnostic and usage telemetry.
 * Dependency diagnostics - locate faults or poor performance where your app uses other components such as databases, REST APIs, or other services.
 * Troubleshoot any issues with telemetry.
* **Both:** Compile the SDK into your web app code, and run Status Monitor on your web server.  The best of both worlds:
 * Standard diagnostic and usage telemetry.
 * Dependency diagnostics.
 * Write custom telemetry using the API.
 * Troubleshoot any issues with the SDK and telemetry.



> [AZURE.TIP] Is your app an [Azure App Service Web App](websites-learning-map.md)? Just [add the Application Insights extension](insights-perf-analytics.md) from the app's control panel in Azure.


## Install Application Insights Status Monitor on your IIS web server

1. You need a [Microsoft Azure](http://azure.com) subscription. 

1. On your IIS web server, login with administrator credentials.
2. Download and run the [Status Monitor installer](http://go.microsoft.com/fwlink/?LinkId=506648).

4. In the installation wizard, sign in to Microsoft Azure.

    ![Sign into Azure with your Microsoft account credentials](./media/app-insights-monitor-performance-live-website-now/appinsights-035-signin.png)

5. Pick the installed web application or website that you want to monitor, then configure the resource in which you want to see the results in the Application Insights portal.

    ![Choose an app and a resource.](./media/app-insights-monitor-performance-live-website-now/appinsights-036-configAIC.png)

    Normally, you should choose to configure a new resource and [resource group][roles].

    You would use an existing resource if you already set up [web tests][availability] for your site, or [web client monitoring][client].

6. Restart IIS.

    ![Choose Restart at the top of the dialog.](./media/app-insights-monitor-performance-live-website-now/appinsights-036-restart.png)

    Your web service will be interrupted for a short while.

6. Notice that ApplicationInsights.config has been inserted into the web apps that you want to monitor.

    ![Find the .config file alongside the code files of the web app.](./media/app-insights-monitor-performance-live-website-now/appinsights-034-aiconfig.png)

   There are also some changes to web.config.

### Want to (re)configure later?

After you complete the wizard, you can re-configure the agent whenever you want. You can also use this if you installed the agent but there was some trouble with the initial setup.

![Click the Application Insights icon on the task bar](./media/app-insights-monitor-performance-live-website-now/appinsights-033-aicRunning.png)

## View performance telemetry

Sign into [the Azure Preview portal](http://portal.azure.com), browse Application Insights and open the resource that you created.

![Choose Browse, Application Insights, then select your app](./media/appinsights/appinsights-08openApp.png)

Open the Performance blade to see dependency and other data.

![Performance](./media/app-insights-monitor-performance-live-website-now/21-perf.png)

Click through any chart to see more details.


![](./media/appinsights/appinsights-038-dependencies.png)

#### Dependencies

The charts labeled HTTP, SQL, AZUREBLOB show the response times and counts of calls to dependencies: that is, external services that your application uses.



#### Performance counters

Click any performance counter chart to change what it shows. Or you can add a new chart. 
 
#### Exceptions

![Click through the server exceptions chart](./media/appinsights/appinsights-039-1exceptions.png)

You can drill down to specific exceptions (from the last seven days) and get stack traces and context data.


### No telemetry?

  * Use your site, to generate some data.
  * Wait a few minutes to let the data arrive, then click Refresh.
  * Open Diagnostic Search (the Search tile) to see individual events. Events are often visible in Diagnostic Search before aggregate data appears in the charts.
  * Open Status Monitor and select your application on left pane. Check if there are any diagnostics messages for this application in the "Configuration notifications" section:
  
  ![](.\media\app-insights-monitor-performance-live-website-now\appinsights-status-monitor-diagnostics-message.png)

  * Make sure your server firewall allows outgoing traffic on port 443 to dc.services.visualstudio.com. 
  * If on the server you see a message about "insufficient permissions":
  * In IIS Manager, select your application pool, open Advanced Settings, and under Process Model note the Identity.
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

