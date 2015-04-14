<properties 
	pageTitle="Application Insights: platforms" 
	description="Can I use Application Insights with...?" 
	services="application-insights" 
    documentationCenter=""
	authors="alancameronwills" 
	manager="kamrani"/>

<tags 
	ms.service="application-insights" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="ibiza" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/02/2015" 
	ms.author="awills"/>
 
# Application Insights: platforms

#### Can I use Application Insights with ...?


## Languages

+ [C#, VB][greenbrown]
+ [Ruby](https://rubygems.org/gems/application_insights) 
+ [PHP](https://github.com/Microsoft/AppInsights-PHP)
+ [Python](https://pypi.python.org/pypi/applicationinsights/0.1.0)
+	[Windows Store JavaScript apps](#cordova)

## Platforms

+ [ASP.NET][greenbrown]
+ [Azure web apps and VMs][azure]
+ [Android](https://github.com/Microsoft/AppInsights-Android)
+ [iOS](https://github.com/Microsoft/AppInsights-iOS)
+ [Cordova](#cordova)
+ [Angular](http://ngmodules.org/modules/angular-appinsights)
+ [Node.JS](https://www.npmjs.com/package/applicationinsights)
+ [Joomla](https://github.com/fidmor89/AppInsights-Joomla)
+ [WordPress](https://wordpress.org/plugins/application-insights/)



## Logging frameworks

+	[Log4Net, NLog, or System.Diagnostics.Trace][diagnostic]
+	[Java, Log4J, or Logback][javalogs]


## Projects

Please also visit the [Application Insights SDK project on GitHub](https://github.com/Microsoft/AppInsights-Home)


### <a name="cordova"></a>Cordova and Windows Store JavaScript apps

Use the standard client-side [web app script][usage], but with one change.

When you get the script from the Application Insights portal, insert a line after the instrumentation key:

    ...{
        instrumentationKey:"00000000-662d-4479-0000-40c89770e67c",
        endpointUrl:"https://dc.services.visualstudio.com/v2/track"
    } ...

[Cordova](http://cordova.apache.org/)

[Windows Store apps using JavaScript](https://msdn.microsoft.com/library/windows/apps/br211385.aspx)

[AZURE.INCLUDE [app-insights-learn-more](../includes/app-insights-learn-more.md)]


