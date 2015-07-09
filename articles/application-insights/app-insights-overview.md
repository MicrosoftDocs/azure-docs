<properties 
	pageTitle="What is Application Insights?" 
	description="Track usage and performance of your live web or device application.  Detect, triage and diagnose problems. Continuously monitor and improve success with your users." 
	services="application-insights" 
    documentationCenter=""
	authors="alancameronwills" 
	manager="douge"/>

<tags 
	ms.service="application-insights" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="ibiza" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="07/08/2015" 
	ms.author="awills"/>
 
# What is Application Insights?

Visual Studio Application Insights is a service with which you can track the performance and usage of your live web or device application.

It works for a wide variety of app types and platforms: web apps in .NET or J2EE, hosted on-premises or in the cloud; device apps on Windows, iOS, Android, OSX and other platforms. For applications with client, server and other components, you can 

* [Detect, triage and diagnose][detect] performance issues and fix them before most of your users are aware.
 *  Alerts on performance changes or crashes.
 *  Metrics to help diagnose performance issues, such as response times, CPU usage, dependency tracking.
 *  Availability tests for web apps.
 *  Crash and exception reports and alerts
 *  Powerful diagnostic log search (including log traces from your favorite logging frameworks).
* [Continuously improve your application][knowUsers] by understanding what your users do with it. 
 * Page view counts, new and returning users, and other core usage analytics
 * Track your own events to assess usage patterns and the success of each feature.

![Chart user activity statistics, or drill into specific events.](./media/app-insights-overview/00-sample.png)




## What platforms and languages can it work with?

There are currently SDKs for:

 * [ASP.NET servers][greenbrown] on Azure or your IIS server
 * [J2EE servers][java]
 * [Web pages][client]: HTML+JavaScript
 * [Windows Phone, Windows Store and Desktop apps][windows]
 * [iOS][ios]
 * [Android][android]
 * [Other platforms][platforms]

If your app has client, server and other components, you can instrument them all. The data will be integrated in the Application Insights portal so that, for example, you can correlate events at the client with events at the server.


## How does it work?

You install a small SDK in your application, and set up an account in the Application Insights portal. The SDK monitors your app and sends telemetry data to the portal. The portal shows you statistical charts and provides powerful search tools to help you diagnose any problems.

![The Application Insights SDK in your app sends telemetry to your Application Insights resource in the Azure portal.](./media/app-insights-overview/01-scheme.png)

The SDK has several modules which collect telemetry, for example to count users, sessions, and performance. You can also write your own custom code to send telemetry data to the portal. Custom telemetry is particularly useful to trace user stories: you can count events such as button clicks, achievement of particular goals, or user mistakes.

For ASP.NET servers and Azure web apps, you can also install [Status Monitor][redfield], which has two uses. It lets you:

* Monitor a web app without re-building or re-installing it.
* Track calls to dependent modules.

### What's the overhead?

The impact on your performance is very small. Tracking calls non-blocking, and are batched and sent in a separate thread. 


## How do I get started?

1. You'll need a subscription to [Microsoft Azure](http://azure.com) It's free to sign up, and you can choose the free pricing tier of Application Insights. 

2. Sign into [Azure Preview Portal](http://portal.azure.com)
3. Create an Application Insights resource. This is where you'll see data from your app.

    ![Add, Developer Services, Application Insights.](./media/app-insights-overview/11-new.png)

    Choose your application type.

4. In your new resource, click any empty chart to open the Quick Start guide. This explains how to install the SDK in your app. If it's a web app, you'll also find out how to add the SDK to web pages, and to set up availability tests.


For more details, choose your app type under Get Started in the navigation bar on the left of this page.


## Support and feedback

* Questions and Issues:
 * [Troubleshooting][qna]
 * [MSDN Forum](https://social.msdn.microsoft.com/Forums/vstudio/en-US/home?forum=ApplicationInsights)
 * [StackOverflow](http://stackoverflow.com/questions/tagged/ms-application-insights)
* Bugs:
 * [Connect](https://connect.microsoft.com/VisualStudio/Feedback/LoadSubmitFeedbackForm?FormID=6076)
* Suggestions:
 * [User Voice](http://visualstudio.uservoice.com/forums/121579-visual-studio/category/77108-application-insights)


## Videos


> [AZURE.VIDEO 218]

> [AZURE.VIDEO usage-monitoring-application-insights]

> [AZURE.VIDEO performance-monitoring-application-insights]


<!--Link references-->

[android]:app-insights-android.md
[azure]: ../insights-perf-analytics.md
[client]: app-insights-javascript.md
[detect]: app-insights-detect-triage-diagnose.md
[greenbrown]: app-insights-start-monitoring-app-health-usage.md
[ios]: app-insights-ios.md
[java]: app-insights-java-get-started.md
[knowUsers]: app-insights-overview-usage.md
[platforms]: app-insights-platforms.md
[portal]: http://portal.azure.com/
[qna]: app-insights-troubleshoot-faq.md
[redfield]: app-insights-monitor-performance-live-website-now.md
[windows]: app-insights-windows-get-started.md

 