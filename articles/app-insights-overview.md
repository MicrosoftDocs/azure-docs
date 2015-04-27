<properties 
	pageTitle="What is Application Insights?" 
	description="Track usage and performance of your live web or device application.  Detect, triage and diagnose problems. Continuously monitor and improve success with your users." 
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
	ms.date="04/22/2015" 
	ms.author="awills"/>
 
# What is Application Insights?

Visual Studio Application Insights lets you track the performance and usage of your live web or device application.

* [Detect, triage and diagnose][detect] performance issues and fix them before most of your users are aware.
 *  Alerts on performance changes or crashes.
 *  Metrics to help diagnose performance issues, such as response times, CPU usage, dependency tracking.
 *  Availability tests for web apps.
 *  Crash and exception reports and alerts
 *  Powerful diagnostic log search (including log traces from your favorite logging frameworks).
* [Continuously improve your application][knowUsers] by understanding what your users do with it. 
 * Page view counts, new and returning users, and other core usage analytics
 * Track your own events to assess usage patterns and the success of each feature.

## How does it work?

You install a small SDK in your application, and set up an account in the Application Insights portal. The SDK monitors your app and sends telemetry data to the portal. The portal shows you statistical charts and provides powerful search tools to help you diagnose any problems.

![The Application Insights SDK in your app sends telemetry to your Application Insights resource in the Azure portal.](./media/app-insights-overview/01-scheme.png)

The SDK has several modules which collect telemetry, for example to count users, sessions, and performance. You can also write your own custom code to send telemetry data to the portal. Custom telemetry is particularly useful to trace user stories: you can count events such as button clicks, achievement of particular goals, or user mistakes.

For ASP.NET servers and Azure web apps, you can also install [Status Monitor][redfield], which has two uses. It lets you:

* Monitor a web app without re-building or re-installing it.
* Track calls to dependent modules.

## What kinds of apps can it work with?

There are currently SDKs for:

* Web apps
 * [ASP.NET][greenbrown] on Azure or your IIS server
 * [Java][java] on JRE 
 * [Web pages][client]: HTML+JavaScript
* Device apps
 * [Windows][windows]
 * [iOS][ios]
 * [Android][android]
 * Cordova
 * [Other platforms][platforms]


## How would I use it?

* [Detect, triage, and diagnose problems][detect]
* [Analyse the usage of your app][knowUsers]


## What do I need, to use it?

* An subscription to Microsoft Azure. Application Insights is one of the many cloud services of Azure, which also include web sites, databases, VMs and more. (But you can use Application Insights to monitor any application - your app doesn't have to run in Azure.) 

 * Your organization might have an account.


## How do I get started?

Choose your platform from the Get Started menu on the left. 

In all cases, the basic procedure is:

1. Create an Application Insights resource in [Azure][portal] (and get its instrumentation key).
2. Instrument your application with the appropriate SDK (and configure it with the instrumentation key).
3. Run your application  either in debug mode or live.
4. See the results in your resource in [Azure][portal].

In some cases an plug-in is available for your IDE (such as Visual Studio or Eclipse) that performs the first two steps for you. But you can always go through the procedure manually.

If your app is a web site or service, there are some optional additions and variations on the basic procedure:

* Add an SDK both to the server-side application, and to the client [device][windows] or [web page][client]. The telemetry data is merged in the portal so that you can correlate events at the two ends.
* Set up web tests to monitor the availability of your site from points around the world.
* Instrument an already-live server-side application without rebuilding or redeploying it. This is available for [IIS servers][redfield] and [Azure web apps][azure].
* Monitor dependency calls that your app makes to other components such as databases or through REST APIs. Available for [IIS servers][redfield] and [Azure web apps][azure].


<!--Link references-->

[android]:app-insights-android.md
[azure]: insights-perf-analytics.md
[client]: app-insights-javascript.md
[detect]: app-insights-detect-triage-diagnose.md
[greenbrown]: app-insights-start-monitoring-app-health-usage.md
[ios]: app-insights-ios.md
[java]: app-insights-java-get-started.md
[knowUsers]: app-insights-overview-usage.md
[platforms]: app-insights-platforms.md
[portal]: http://portal.azure.com/
[redfield]: app-insights-monitor-performance-live-website-now.md
[windows]: app-insights-windows-get-started.md

