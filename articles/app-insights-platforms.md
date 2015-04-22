<properties 
	pageTitle="Application Insights: platforms" 
	description="Can I use Application Insights with...?" 
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
	ms.date="04/20/2015" 
	ms.author="awills"/>
 
# Application Insights: platforms

[AZURE.INCLUDE [app-insights-selector-get-started](../includes/app-insights-selector-get-started.md)]

#### Can I use Application Insights with ...?


## Languages

+ [C#, VB](app-insights-start-monitoring-app-health-usage.md)
+ [JavaScript web pages](app-insights-web-track-usage.md)
+ [Windows Store JavaScript apps](#cordova)
+ [Java](app-insights-java.md)
+ [Ruby](https://rubygems.org/gems/application_insights) 
+ [PHP](https://github.com/Microsoft/AppInsights-PHP)
+ [Python](https://pypi.python.org/pypi/applicationinsights/0.1.0)

## Platforms

+ [ASP.NET](app-insights-start-monitoring-app-health-usage.md)
+ [Azure web apps and VMs](insights-perf-analytics.md)
+ [Android](https://github.com/Microsoft/AppInsights-Android)
+ [iOS](https://github.com/Microsoft/AppInsights-iOS)
+ [Cordova](#cordova)
+ [Angular](https://www.npmjs.com/package/angular-applicationinsights)
+ [Node.JS](https://www.npmjs.com/package/applicationinsights)
+ [Joomla](https://github.com/fidmor89/AppInsights-Joomla)
+ [WordPress](https://wordpress.org/plugins/application-insights/)



## Logging frameworks

+	[Log4Net, NLog, or System.Diagnostics.Trace](app-insights-diagnostic-search.md)
+	[Java, Log4J, or Logback](app-insights-java-trace-logs.md)


## Projects

Please also visit the [Application Insights SDK project on GitHub](https://github.com/Microsoft/AppInsights-Home)


### <a name="cordova"></a>Cordova and Windows Store JavaScript apps

Use the standard client-side [web app script](app-insights-web-track-usage.md), but with one change.

When you get the script from the Application Insights portal, insert a line after the instrumentation key:

    ...{
        instrumentationKey:"00000000-662d-4479-0000-40c89770e67c",
        endpointUrl:"https://dc.services.visualstudio.com/v2/track"
    } ...

[Cordova](http://cordova.apache.org/)

[Windows Store apps using JavaScript](https://msdn.microsoft.com/library/windows/apps/br211385.aspx)

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

