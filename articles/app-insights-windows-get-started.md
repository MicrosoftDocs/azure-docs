<properties 
	pageTitle="Application Insights: Get started with Windows Phone and Store apps" 
	description="Analyze usage and performance of your Windows device app with Application Insights." 
	services="application-insights" 
    documentationCenter=""
	authors="alancameronwills" 
	manager="keboyd"/>

<tags 
	ms.service="application-insights" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="ibiza" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/02/2015" 
	ms.author="awills"/>

# Application Insights: Get started with Windows Phone and Store apps

[AZURE.INCLUDE [app-insights-get-started](../includes/app-insights-get-started.md)]

Application Insights lets you monitor your published application for:

* **Usage** - Learn how many users you have and what they are doing with your app.
* **Crashes** - Get diagnostic reports of crashes and understand their impact on users.

![](./media/appinsights/appinsights-d018-oview.png)


## <a name="add"></a>Add Application Insights

What kind of project are you working with?

* [New Windows Store or Windows Phone project](#new)
* [Existing Windows Store or Windows Phone project](#existing)
* [Windows Universal app](#universal)
* [Windows Desktop project][desktop]

###<a name="new"></a> Creating a new Windows app project

Select Application Insights in the New Project dialog. 

If you're asked to sign in, use the credentials for your Azure account (which is separate from your Visual Studio Online account).

![](./media/appinsights/appinsights-d21-new.png)


###<a name="existing"></a> Existing project

Add Application Insights from Solution Explorer.


![](./media/appinsights/appinsights-d22-add.png)

###<a name="universal"></a> Windows Universal app 

Create the app in Visual Studio, and then:

1.  In the [Azure portal][portal], create a new Application Insights resource.
    ![](./media/app-insights-windows-get-started/01-new.png)
2.  Go to the Properties blade and copy the Instrumentation Key.
    ![](./media/app-insights-windows-get-started/02-props.png)

In Visual Studio, repeat the following steps for both the Windows Phone project and the Windows project:

1. Right-click the project in Solution Explorer and choose **Manage NuGet Packages**.
    ![](./media/app-insights-windows-get-started/03-nuget.png)
2. Select **Online**, **Include prerelease**, and search for "Application Insights".
    ![](./media/app-insights-windows-get-started/04-ai-nuget.png)
3. Pick the latest version of the appropriate package - one of:
   * Application Insights for Windows applications - *for Windows Store apps*
   * Application Insights for Windows Phone applications
   * Application Insights for Web Apps - *use this for a desktop application* 
4. Edit ApplicationInsights.config (which has been added by the NuGet install). Insert this just before the closing tag:

    `<InstrumentationKey>`*the key you copied*`</InstrumentationKey>`


## <a name="network"></a>2. Enable network access for your app

If your app doesn't already [request outgoing network access](https://msdn.microsoft.com/library/windows/apps/hh452752.aspx), you'll have to add that to its manifest as a [required capability](https://msdn.microsoft.com/library/windows/apps/br211477.aspx).

## <a name="run"></a>3. Run your project

[Run your application with F5](http://msdn.microsoft.com/library/windows/apps/bg161304.aspx) and use it, so as to generate some telemetry. 

In Visual Studio, you'll see a count of the events that have been received.

![](./media/appinsights/appinsights-09eventcount.png)

In debug mode, telemetry is sent as soon as it's generated. In release mode, telemetry is stored on the device and sent only when the app resumes.

## <a name="monitor"></a>4. See monitor data

Open Application Insights from your project.

![Right-click your project and open the Azure portal](./media/appinsights/appinsights-04-openPortal.png)


At first, you'll just see one or two points. For example:

![Click through to more data](./media/appinsights/appinsights-26-devices-01.png)

Click Refresh after a few seconds if you're expecting more data.

Click any chart to see more detail. 


## <a name="deploy"></a>5. Publish your application to Store

[Publish your application](http://dev.windows.com/publish) and watch the data accumulate as users download and use it.


## <a name="usage"></a>Next Steps

[Track usage of your app][windowsUsage]

[Detect and diagnose crashes in your app][windowsCrash]

[Capture and search diagnostic logs][diagnostic]

[Troubleshooting][qna]



<!--Link references-->

[alerts]: app-insightss-alerts.md
[android]: https://github.com/Microsoft/AppInsights-Android
[api]: app-insights-custom-events-metrics-api.md
[apiproperties]: app-insights-custom-events-metrics-api.md#properties
[apiref]: http://msdn.microsoft.com/library/azure/dn887942.aspx
[availability]: app-insights-monitor-web-app-availability.md
[azure]: insights-perf-analytics.md
[azure-availability]: insights-create-web-tests.md
[azure-usage]: insights-usage-analytics.md
[azurediagnostic]: insights-how-to-use-diagnostics.md
[client]: app-insights-web-track-usage.md
[config]: app-insights-configuration-with-applicationinsights-config.md
[data]: app-insights-data-retention-privacy.md
[desktop]: app-insights-windows-desktop.md
[detect]: app-insights-detect-triage-diagnose.md
[diagnostic]: app-insights-diagnostic-search.md
[eclipse]: app-insights-java-eclipse.md
[exceptions]: app-insights-web-failures-exceptions.md
[export]: app-insights-export-telemetry.md
[exportcode]: app-insights-code-sample-export-telemetry-sql-database.md
[greenbrown]: app-insights-start-monitoring-app-health-usage.md
[java]: app-insights-java-get-started.md
[javalogs]: app-insights-java-trace-logs.md
[javareqs]: app-insights-java-track-http-requests.md
[knowUsers]: app-insights-overview-usage.md
[metrics]: app-insights-metrics-explorer.md
[netlogs]: app-insights-asp-net-trace-logs.md
[new]: app-insights-create-new-resource.md
[older]: http://www.visualstudio.com/get-started/get-usage-data-vs
[perf]: app-insights-web-monitor-performance.md
[platforms]: app-insights-platforms.md
[portal]: http://portal.azure.com/
[qna]: app-insights-troubleshoot-faq.md
[redfield]: app-insights-monitor-performance-live-website-now.md
[roles]: app-insights-role-based-access-control.md
[start]: app-insights-get-started.md
[trace]: app-insights-search-diagnostic-logs.md
[track]: app-insights-custom-events-metrics-api.md
[usage]: app-insights-web-track-usage.md
[windows]: app-insights-windows-get-started.md
[windowsCrash]: app-insights-windows-crashes.md
[windowsUsage]: app-insights-windows-usage.md

