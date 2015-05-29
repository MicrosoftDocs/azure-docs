<properties 
	pageTitle="Upgrade from the old Visual Studio Online version of Application Insights" 
	description="Upgrade existing projects"
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
	ms.date="04/21/2015" 
	ms.author="awills"/>
 
# Upgrade from the old Visual Studio Online version of Application Insights

This document is of interest to you only if you have a project that is still using the older version of Application Insights, which was part of Visual Studio Online. That version will be switched off in due course, and so we encourage you to upgrade to the new version, which is a service within Microsoft Azure.

## Which version have I got?

If you added Application Insights to your project using Visual Studio 2013 Update 3 or later, it most probably uses the new Azure version.

Open ApplicationInsights.config. If it has nodes `ActiveProfile` and `Profiles`, it's the old version and you should upgrade.

Or look at your project in Visual Studio Solution Explorer, and under References, select Microsoft.ApplicationInsights. In the Properties window, find the Version. If it's less than 0.12, then you should upgrade.

## If you have a Visual Studio project ...

1. Open the project in Visual Studio 2013 Update 3 or later.
2. Delete ApplicationInsights.config 
3. Remove the Application Insights NuGet packages from the project. 
To do this, right-click the project in Solution Explorer and choose Manage NuGet Packages.
4. SDK: Right-click the project and [choose Add Application Insights][greenbrown]. This adds the SDK to your project, and also creates a new Application Insights resource in Azure.
5. Logging: If your code includes calls to the old API such as LogEvent(), you'll discover them when you try to build the solution. Update them to [use the new API][track].
6. Web pages: If your project includes web pages, replace the scripts in the <head> sections. Typically there's just one copy in a master page such as Views\Shared\_Layout.cshtml. [Get the new script from the Quick Start blade in your Application Insights resource in Azure][usage]. 
If your web pages include telemetry calls in the body such as logEvent or logPage, [update them to use the new API][track].
7. Server monitor: If your app is a service running on IIS, uninstall Microsoft Monitoring Agent from the server, and then [install Application Insights Status Monitor][redfield].
8. Web tests: If you were using web availability tests, [recreate them on the new portal][availability], with their alerts.
9. Alerts: Set up [alerts on metrics][alerts] in the Azure portal.
10. Perf counters: If you used performance counters, you can write your own code to sample the counters periodically and send them using [TrackMetric()][track].

## If you have a Java web service ...

1. In your server machine, disable the old agent by removing references to the APM agent from the web service startup file. On a TomCat server, edit Catalina.bat. On a JBoss server, edit Run.bat. 
2. Restart the web service.
3. In the Microsoft Azure portal, [add a new Application Insights resource][java]. In your development machine, add [the Java SDK][java] to your web project.
You can now [send custom telemetry][track] from the server code.
4. Replace the scripts in the <head> sections of your web pages. (There might be just one copy in a server side include.) [Get the new script from the Quick Start blade in your new Application Insights resource in Azure][usage]. 
If your web pages include telemetry calls in the body such as logEvent or logPage, [update them to use the new API][track].



<!--Link references-->

[alerts]: app-insights-alerts.md
[availability]: app-insights-monitor-web-app-availability.md
[greenbrown]: app-insights-start-monitoring-app-health-usage.md
[java]: app-insights-java-get-started.md
[redfield]: app-insights-monitor-performance-live-website-now.md
[track]: app-insights-custom-events-metrics-api.md
[usage]: app-insights-web-track-usage.md

