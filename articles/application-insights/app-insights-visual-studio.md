<properties 
	pageTitle="Working with Application Insights on Visual Studio" 
	description="Performance analysis and diagnostics during debugging and in production." 
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
	ms.date="05/25/2016" 
	ms.author="awills"/>


# Working with Application Insights in Visual Studio

In Visual Studio (2015 and later), you can analyze performance and diagnose issues both in debugging and in production, using telemetry from [Visual Studio Application Insights](app-insights-overview.md).

If you haven't yet [installed Application Insights in your app](app-insights-asp-net.md), do that now.

## <a name="run"></a> Debug your project

Run your application with F5 and try it out: open different pages to generate some telemetry.

In Visual Studio, you'll see a count of the events that have been logged.

![In Visual Studio, the Application Insights button shows during debugging.](./media/app-insights-asp-net/appinsights-09eventcount.png)

Click this button to open diagnostic search. 


## Debugging telemetry

### Diagnostics hub

The Diagnostics Hub (in Visual Studio 2015 or later) shows the Application Insights server telemetry as it's generated. This works even if you opted only to install the SDK, without connecting it to a resource in the Azure portal.

![Open the Diagnostic Tools window and inspect the Application Insights events.](./media/app-insights-asp-net/31.png)


### Diagnostic search

The Search window shows events that have been logged. (If you signed in to Azure when you set up Application Insights, you'll be able to search the same events in the portal.)

![Right-click the project and choose Application Insights, Search](./media/app-insights-asp-net/34.png)

The free text search works on any fields in the events. For example, search for part of the URL of a page; or the value of a property such as client city; or specific words in a trace log.

You can also open the Related Items tab to help diagnose failed requests or exceptions.


![](./media/app-insights-asp-net/41.png)



### Exceptions

If you have [set up exception monitoring](app-insights-asp-net-exceptions.md), exception reports will show in the Search window. 

Click an exception to get a stack trace. If the code of the app is open in Visual Studio, you can click through from the stack trace to the relevant line of the code.




### Local monitoring



(From Visual Studio 2015 Update 2) If you haven't configured the SDK to send telemetry to the Application Insights portal (so that there is no instrumentation key in ApplicationInsights.config) then the diagnostics window will display telemetry from your latest debugging session. 

This is desirable if you have already published a previous version of your app. You don't want the telemetry from your debugging sessions to be mixed up with the telemetry on the Application Insights portal from the published app.

It's also useful if you have some [custom telemetry](app-insights-api-custom-events-metrics.md) that you want to debug before sending telemetry to the portal.


* *At first, I fully configured Application Insights to send telemetry to the portal. But now I'd like to see the telemetry only in Visual Studio.*

 * In the Search window's Settings, there's an option to search local diagnostics even if your app sends telemetry to the portal.
 * To stop telemetry being sent to the portal, comment out the line `<instrumentationkey>...` from ApplicationInsights.config. When you're ready to send telemetry to the portal again, uncomment it.



## <a name="monitor"></a> View telemetry in the Application Insights portal

The Application Insights portal is where you'll see telemetry once your application is published, and while you're debugging you'll want to verify that it sends telemetry correctly.

Open your Application Insights resource in the [Azure portal][portal].

![Right-click your project and open the Azure portal](./media/app-insights-asp-net/appinsights-04-openPortal.png)

If you didn't sign in to Azure when you added the Application Ingsights to this app, do that now. Select **Configure Application Insights**. Doing that will enable you to continue to see telemetry from your live app after you've deployed it. The telemetry will appear in the Application Insights portal.

### Live Stream

For a quick view of your telemetry data when you're debugging or right after a deployment, use Live Stream. 

![From the overview blade, click Live Stream](./media/app-insights-asp-net/45.png)


Live Stream is designed so that you can verify that your app is working OK right after a deployment.

It shows data from just the past few minutes, and doesn't retain any data.

It requires the 2.1.0-beta1 or later version of the SDK.  



### Search: individual events

Open Search to investigate individual requests and their associated events. 

![In the search blade, search for page names or other properties.](./media/app-insights-asp-net/21-search.png)

[Learn more about search](app-insights-diagnostic-search.md)

* *No associated events?* Set up [server exceptions](app-insights-asp-net-exceptions.md) and [dependencies](app-insights-asp-net-dependencies.md).


### Metrics: aggregated data

Look for aggregated data in the Overview charts. At first, you'll just see one or two points. For example:

![Click through to more data](./media/app-insights-asp-net/12-first-perf.png)

Click through any chart to see more detailed metrics. [Learn more about metrics.][perf]

* *No user or page data?* - [Add user & page data](app-insights-web-track-usage.md)

### Analytics: Powerful query language

As you accumulate more data, you can run queries both to aggregate data and to find individual instances. [Analytics]() is a powerful tool for both for understanding performance and usage, and for diagnostic purposes.

![Example of Analytics](./media/app-insights-asp-net/025.png)


## No data?

* In Visual Studio, make sure your app is sending telemetry. You should see traces in the Output window, and in the Diagnostics Hub.
* Make sure you're looking at the right thing in Azure. Sign in at the [Azure portal](https://portal.azure.com), click "Browse >", "Application Insights", and then select your app.
* Use the application, opening different pages so that it generates some telemetry.
* Open the [Search][diagnostic] blade, to see individual events. Sometimes events take a little while longer to come through the metrics pipeline.
* Wait a few seconds and click Refresh.
* See [Troubleshooting][qna].



## Publish your app

Now deploy your application and watch the data accumulate.

Use [Live Stream](#live-stream) to monitor the first few minutes of a deployment or re-deployment tell you whether your app is working correctly. Especially when you're replacing an older version, you want to know whether performance has improved. If there's a problem, you might want to revert to the old version.


#### Trouble on your build server?

See [this Troubleshooting item](app-insights-asp-net-troubleshoot-no-data.md#NuGetBuild).

> [AZURE.NOTE] If your app generates a lot of telemetry (and you are using the ASP.NET SDK version 2.0.0-beta3 or later), the adaptive sampling module will automatically reduce the volume that is sent to the portal by sending only a representative fraction of events. However, events that are related to the same request will be selected or deselected as a group, so that you can navigate between related events. 
> [Learn about sampling](app-insights-sampling.md).



## Next steps

- [User & page data](../article/application-insights/app-insights-javascript.md#selector1)
- [Exceptions](../article/application-insights/app-insights-asp-net-exceptions.md#selector1)
- [Dependencies](../article/application-insights/app-insights-asp-net-dependencies.md#selector1)
- [Availability](../article/application-insights/app-insights-monitor-web-app-availability.md#selector1)





## To upgrade to future SDK versions

To upgrade to a [new release of the SDK](app-insights-release-notes-dotnet.md), open NuGet package manager again and filter on installed packages. Select Microsoft.ApplicationInsights.Web and choose Upgrade.

If you made any customizations to ApplicationInsights.config, save a copy of it before you upgrade, and afterwards merge your changes into the new version.



## <a name="video"></a>Video

> [AZURE.VIDEO getting-started-with-application-insights]


<!--Link references-->

[api]: app-insights-api-custom-events-metrics.md
[apikey]: app-insights-api-custom-events-metrics.md#ikey
[availability]: app-insights-monitor-web-app-availability.md
[azure]: ../insights-perf-analytics.md
[client]: app-insights-javascript.md
[detect]: app-insights-detect-triage-diagnose.md
[diagnostic]: app-insights-diagnostic-search.md
[knowUsers]: app-insights-overview-usage.md
[metrics]: app-insights-metrics-explorer.md
[netlogs]: app-insights-asp-net-trace-logs.md
[perf]: app-insights-web-monitor-performance.md
[portal]: http://portal.azure.com/
[qna]: app-insights-troubleshoot-faq.md
[redfield]: app-insights-monitor-performance-live-website-now.md
[roles]: app-insights-resources-roles-access-control.md
[start]: app-insights-overview.md

 
