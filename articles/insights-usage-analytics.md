<properties 
	pageTitle="Usage analytics for Azure Web Apps" 
	description="End user analytics for Microsoft Azure websites." 
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
	ms.date="03/26/2015" 
	ms.author="awills"/>

# Usage analytics for Azure Web Apps

Wonder how many users have used your [Azure App Service Web App](websites-learning-map.md)?  Wonder what the average page load time is or what browsers are being used?  By inserting a few lines of script in your web pages, you can collect data about how your website is used by your customers. 

*You can do this for non-Azure websites too: [Monitor web app usage with Application Insights](app-insights-web-track-usage.md).*

![End User Analytics](./media/insights-usage-analytics/Insights_ConfiguredExperience.png)

## How to set up End User Analytics

1. Click on the Analytics tile on the **Web app** blade.
2. On the **Configuration** blade, select the entire instrumentation script and copy it.  
    ![Configuration](./media/insights-usage-analytics/Insights_CopyCode.png)
3. Paste the script into each of your web pages, just before the close of the </head> tag. It's a good idea to insert the script into all your web pages. If you're using ASP.NET, you can do that by inserting the script into your application's master page.
4. Deploy and use your web application. Usage analytic information will begin to appear after about 5-10 minutes.

## Exploring the data

The Browsers session part allows you to drill into to see the different browsers and then browser versions.

![Browsers](./media/insights-usage-analytics/Insights_Browsers.png)

The Analytics part shows:

- A break down of the different device types including Desktop and Mobile.
- Your top 5 pages and graphs the page load time over the past week.  The number of sessions and views is also available  
    ![Top Pages](./media/insights-usage-analytics/Insights_TopPages.png)
- Your slowest pages in the past week so you can improve them to meet your business goals and objectives

## Get more Application Insights

* [Use the API](app-insights-web-track-usage-custom-events-metrics.md) for usage tracking and diagnostic logging
* [Monitor performance][azure] to diagnose issues with your code's dependencies
* [Create web tests][azure-availability] to make sure your site is available and responsive


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

