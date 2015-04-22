<properties 
	pageTitle="Get started with Application Insights" 
	description="Analyze usage, availability and performance of your on-premises or Microsoft Azure web application with Application Insights." 
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
	ms.date="03/27/2015" 
	ms.author="awills"/>

# Get started with Visual Studio Application Insights

*Application Insights is in preview.*

Detect issues, solve problems and continuously improve your applications. Quickly diagnose any problems in your live application. Understand what your users do with it.

Configuration is very easy, and you'll see results within minutes.

We currently support ASP.NET and Java web applications, WCF services, Windows Phone and Windows Store apps.

## Get started

Start with any combination, in any order, of the entry points on the left of this map. Follow the path that works for you.

Application Insights works by adding an SDK into your app, which sends telemetry to the [Azure portal](http://portal.azure.com). There are different SDKs for the many combinations of platforms, languages and IDEs that are supported.

You'll need an account in [Microsoft Azure](http://azure.com). You might already have access to a group account through your organization, or you might want to get a Pay-as-you-go account. (While Application Insights is in Preview, it's free.)

What you want | What to do  | What you get
---|---|---
[![ASP.NET](./media/appinsights/appinsights-gs-i-01-perf.png)][greenbrown]|[Add Application Insights SDK to your web project][greenbrown]<br/>![gets](./media/appinsights/appinsights-00arrow.png)  | [![Performance and usage monitoring](./media/appinsights/appinsights-gs-r-01-perf.png)][greenbrown]
[![ASP.NET site already live](./media/appinsights/appinsights-gs-i-04-red2.png)][redfield]<br/>[![Dependency and performance monitoring](./media/appinsights/appinsights-gs-i-03-red.png)][redfield]|[Install Status Monitor on your IIS server][redfield]<br/>![gets](./media/appinsights/appinsights-00arrow.png) | [![ASP.NET dependency monitoring](./media/appinsights/appinsights-gs-r-03-red.png)][redfield]
[![Azure web app or VM](./media/appinsights/appinsights-gs-i-10-azure.png)][azure]|[Enable Insights in your Azure web app or VM][azure]<br/>![gets](./media/appinsights/appinsights-00arrow.png)  | [![Dependency and performance monitoring](./media/appinsights/appinsights-gs-r-03-red.png)][azure]
[![Java](./media/appinsights/appinsights-gs-i-11-java.png)][java]|[Add the SDK to your Java project][java]<br/>![gets](./media/appinsights/appinsights-00arrow.png)  | [![Performance and usage monitoring](./media/appinsights/appinsights-gs-r-10-java.png)][java]
[![JavaScript](./media/appinsights/appinsights-gs-i-02-usage.png)][usage]|[Insert the Application Insights script into your web pages][usage]<br/>![gets](./media/appinsights/appinsights-00arrow.png)  | [![page views and browser performance](./media/appinsights/appinsights-gs-r-02-usage.png)][usage]
[![Availability](./media/appinsights/appinsights-gs-i-05-avail.png)][availability]|[Create web tests][availability]<br/>![gets](./media/appinsights/appinsights-00arrow.png) | [![Availability](./media/appinsights/appinsights-gs-r-05-avail.png)][availability]
[![Windows and Windows Phone](./media/appinsights/appinsights-gs-i-06-device.png)][windows]|[Add Application Insights to your device app project][windows]<br/>![gets](./media/appinsights/appinsights-00arrow.png) | [![Crash and usage data](./media/appinsights/appinsights-gs-r-06-device.png)][windows]

## Support and feedback

* Questions and Issues:
 * [Troubleshooting][qna]
 * [MSDN Forum](https://social.msdn.microsoft.com/Forums/vstudio/en-US/home?forum=ApplicationInsights)
 * [StackOverflow](http://stackoverflow.com/questions/tagged/ms-application-insights)
* Bugs:
 * [Connect](https://connect.microsoft.com/VisualStudio/Feedback/LoadSubmitFeedbackForm?FormID=6076)
* Suggestions:
 * [User Voice](http://visualstudio.uservoice.com/forums/121579-visual-studio/category/77108-application-insights)
* Document improvements:
 * Discus threads at the bottom of en-us versions of these pages. (In the URL of this and other pages, change `/xx-xx/documentation` to `/en-us/documentation`.)
 


## <a name="video"></a>Videos

#### Introduction

> [AZURE.VIDEO application-insights-for-asp-net]

#### Get started

> [AZURE.VIDEO getting-started-with-application-insights]




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

