<properties 
	pageTitle="Application Insights: platforms" 
	description="Can I use Application Insights with...?" 
	services="application-insights" 
	authors="alancameronwills" 
	manager="kamrani"/>

<tags 
	ms.service="application-insights" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="ibiza" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="2015-02-14" 
	ms.author="awills"/>
 
# Application Insights: platforms

## <a name="platforms"</a>Can I use Application Insights with ...?


+	[Android](https://github.com/Microsoft/AppInsights-Android)
+	[Ruby](https://rubygems.org/gems/application_insights) 
+	[PHP](https://github.com/Microsoft/AppInsights-PHP)
+	[Node.JS](https://www.npmjs.com/package/applicationinsights)
+	[Python](https://pypi.python.org/pypi/applicationinsights/0.1.0)
+	[WordPress](https://wordpress.org/plugins/application-insights/)
+	[Angular](http://ngmodules.org/modules/angular-appinsights)
+	[Cordova](#cordova)
+	[Windows Store JavaScript apps](#cordova)
+	[Log4Net, NLog, or System.Diagnostics.Trace][diagnostic]
+	[Windows Store and Phone apps][windows]
+	[An IIS website that's already running][redfield]
+	[An Azure website][azure]


Please also visit the [Application Insights SDK project on GitHub](https://github.com/Microsoft/AppInsights-Home)


### <a name="cordova"></a>Cordova and Windows Store JavaScript apps

Use the standard client-side [web app script][usage], but with one change.

When you get the script from the Application Insights portal, insert a line after the instrumentation key:

    ...{
        instrumentationKey:"00000000-662d-4479-0000-40c89770e67c",
        endpointUrl:"https://dc.services.visualstudio.com/v2/track"
    } ...

[>Cordova](http://cordova.apache.org/)
[>Windows Store apps using JavaScript](https://msdn.microsoft.com/library/windows/apps/br211385.aspx)

[AZURE.INCLUDE [app-insights-learn-more](../includes/app-insights-learn-more.md)]


