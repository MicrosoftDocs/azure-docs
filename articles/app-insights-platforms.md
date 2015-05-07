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
+ [SharePoint](app-insights-sharepoint.md)
+ [WordPress](https://wordpress.org/plugins/application-insights/)
+ [Windows desktop](app-insights-windows-desktop.md)


## Logging frameworks

+	[Log4Net, NLog, or System.Diagnostics.Trace](app-insights-diagnostic-search.md)
+	[Java, Log4J, or Logback](app-insights-java-trace-logs.md)


## Projects

Please also visit the [Application Insights SDK project on GitHub](https://github.com/Microsoft/AppInsights-Home)


### <a name="cordova"></a>Cordova and Windows Store JavaScript apps

In Visual Studio, right-click your project and choose **Manage NuGet packages**.

Select **Online** and search on Application Insights.

Install **Application Insights API for JavaScript Applications**. 

Use the standard client-side [web app script](app-insights-web-track-usage.md), but with one change.

When you get the script from the Application Insights portal, insert a line after the instrumentation key:

    ...{
        instrumentationKey:"00000000-662d-4479-0000-40c89770e67c",
        endpointUrl:"https://dc.services.visualstudio.com/v2/track"
    } ...

[Cordova](http://cordova.apache.org/)

[Windows Store apps using JavaScript](https://msdn.microsoft.com/library/windows/apps/br211385.aspx)

<!--Link references-->


