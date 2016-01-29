<properties 
	pageTitle="Troubleshooting no data - Application Insights for ASP.NET" 
	description="Not seeing data in Visual Studio Application Insights? Try here." 
	services="application-insights" 
    documentationCenter=".net"
	authors="alancameronwills" 
	manager="douge"/>

<tags 
	ms.service="application-insights" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="ibiza" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="01/29/2016" 
	ms.author="awills"/>
 
# Troubleshooting no data - Application Insights for ASP.NET

## <a name="q01"></a>No option to Add Application Insights to my project in Visual Studio

+ Make sure you have [Visual Studio 2013 Update 3 or later](http://go.microsoft.com/fwlink/?LinkId=397827). It comes pre-installed with Application Insights Tools.
+ Although the tools don't support all types of application, you can probably still [add an Application Insights SDK to your project manually](app-insights-windows-desktop.md).


## <a name="q02"></a>My new web project was created, but adding Application Insights failed.

Likely causes:

* Communication with the Application Insights portal failed; or
* There is some problem with your Azure account;
* You only have [read access to the subscription or group where you were trying to create the new resource](app-insights-resources-roles-access-control.md).

Fix:

+ Check that you provided sign-in credentials for the right Azure account. 
+ In your browser, check that you have access to the [Azure portal](https://portal.azure.com). Open Settings and see if there is any restriction.
+ [Add Application Insights to your existing project](app-insights-asp-net.md): In Solution Explorer, right click your project and choose "Add Application Insights."
+ If it still isn't working, follow the [manual procedure](app-insights-start-monitoring-app-health-usage.md) to add a resource in the portal and then add the SDK to your project. 



##<a name="NuGetBuild"></a> "NuGet package(s) are missing" on my build server

Everything builds OK on the dev machines, but you get a NuGet error on the build server.

Please see [NuGet Package Restore](http://docs.nuget.org/Consume/Package-Restore)
and [Automatic Package Restore](http://docs.nuget.org/Consume/package-restore/migrating-to-automatic-package-restore).

## 'Access denied' on opening Application Insights from Visual Studio

*The 'Open Application Insights' menu command takes me to the Azure portal, but I get an 'access denied' error.*

![](./media/app-insights-troubleshoot-no-data-asp-net/access-denied.png)

The Microsoft sign-in that you last used on your default browser doesn't have access to [the resource that was created when Application Insights was added to this app](app-insights-asp-net.md). There are two likely reasons: 

* You have more than one Microsoft account - maybe a work and a personal Microsoft account? The sign-in that you last used on your default browser was for a different account than the one that has access to [add Application Insights to the project](app-insights-asp-net.md). 

 * Fix: Click your name at top right of the browser window, and sign out. Then sign in with the account that has access. Then on the left navigation bar, click Application Insights and select your app.

* Someone else added Application Insights to the project, and they forgot to give you [access to the resource group](app-insights-resources-roles-access-control.md) in which it was created. 

 * Fix: If they used an organizational account, they can add you to the team; or they can grant you individual access to the resource group.



## 'Asset not found' on opening Application Insights from Visual Studio

Likely causes:

* The Application Insights resource for your application has been deleted; or
* The instrumentation key was set or changed in ApplicationInsights.config by hand, without updating the project file. This will send telemetry, but will not 
* The project was not correctly updated in Visual Studio.

Fix:

1. In 


## <a name="q03"></a> Never seen data in the portal.

+ On the Overview page, click the Search tile to open Diagnostic Search. Data usually appears here first.
+ Click the Refresh button. The blade refreshes itself periodically, but you can also do it manually. The refresh interval is longer for larger time ranges.
+ In the Microsoft Azure start board, look at the service status map. If there are some alert indications, wait until they have returned to OK and then close and re-open your Application Insights application blade.
+ Check also [our status blog](http://blogs.msdn.com/b/applicationinsights-status/).
+ If you edited ApplicationInsights.config, carefully check the configuration of TelemetryInitializers and TelemetryProcessors. An incorrectly-named type or parameter can cause the SDK to send no data.

#### No data since I published the app to my server

+ Check that you actually copied all the Microsoft. ApplicationInsights DLLs to the server, together with Microsoft.Diagnostics.Instrumentation.Extensions.Intercept.dll
+ In your firewall, you might have to open TCP ports 80 and 443 for outgoing traffic to dc.services.visualstudio.com and f5.services.visualstudio.com.
+ If you have to use a proxy to send out of your corporate network, set [defaultProxy](https://msdn.microsoft.com/library/aa903360.aspx) in Web.config
+ Windows Server 2008: Make sure you have installed the following updates: [KB2468871](https://support.microsoft.com/kb/2468871), [KB2533523](https://support.microsoft.com/kb/2533523), [KB2600217](https://support.microsoft.com/kb/2600217).


## <a name="q04"></a>No data on Page Views, Browsers, Usage

*I see data in Server Response Time and Server Requests charts, but no data in Page View Load time, or in the Browser or Usage blades.*

The data comes from scripts in the web pages. 

+ If you added Application Insights to an existing web project, [you have to add the scripts by hand](app-insights-javascript.md).
+ Make sure Internet Explorer isn't displaying your site in Compatibility mode.
+ Use the browser's debug feature (F12 on some browsers, then choose Network) to verify that data is being sent to `dc.services.visualstudio.com`.

## I used to see data, but it has stopped

* Check the [status blog](http://blogs.msdn.com/b/applicationinsights-status/).
* Have you hit your monthly quota of data points? Open the Settings/Quota and Pricing to find out. If so, you can upgrade your plan, or pay for additional capacity. See the [pricing scheme](https://azure.microsoft.com/pricing/details/application-insights/).


## I don't see all the data I'm expecting

* **Sampling.** If your application sends a lot of data and you are using the Application Insights SDK for ASP.NET version 2.0.0-beta3 or later, the adaptive sampling feature may operate and send only a percentage of your telemetry. You can disable it. [Learn more about sampling.](app-insights-sampling.md)

## Wrong geographical data in user telemetry

The city, region, and country dimensions are derived from IP addresses and aren't always accurate.


## Status Monitor doesn't work

See [Troubleshooting Status Monitor](app-insights-monitor-performance-live-website-now.md#troubleshooting). Firewall ports are the most common issue.


## Logging

#### <a name="post"></a>How do I see POST data in Diagnostic search?

We don't log POST data automatically, but you can use a TrackTrace call: put the data in the message parameter. This has a longer size limit than the limits on string properties, though you can't filter on it. 
