<properties
	pageTitle="Analytics for Windows Phone and Store apps | Microsoft Azure"
	description="Analyze usage and crashes of your Windows device app."
	services="application-insights"
    documentationCenter="windows"
	authors="alancameronwills"
	manager="douge"/>

<tags
	ms.service="application-insights"
	ms.workload="tbd"
	ms.tgt_pltfrm="ibiza"
	ms.devlang="na"
	ms.topic="get-started-article"
	ms.date="08/26/2016"
	ms.author="awills"/>

# Analytics for Windows Phone and Store apps

Microsoft provides two solutions for device devOps: [HockeyApp](http://hockeyapp.net/) for client side analytics; and [Application Insights](app-insights-overview.md) for the server side.

[HockeyApp](http://hockeyapp.net/) is our Mobile DevOps solution for iOS, OS X, Android or Windows device apps, as well as cross platform apps based on Xamarin, Cordova, and Unity. With it, you can distribute builds to beta testers, collect crash data, and get user metrics and feedback. It’s integrated with Visual Studio Team Services enabling easy build deployments and work item integration. 

## Getting started with HockeyApp

Go to:

* [HockeyApp](http://support.hockeyapp.net/kb)
* [HockeyApp for Windows](http://support.hockeyapp.net/kb/client-integration-windows-and-windows-phone)
* [HockeyApp Blog](http://hockeyapp.net/blog/)
* Join [Hockeyapp Preseason](http://hockeyapp.net/preseason/) to get early releases.

If your app has a server side, use [Application Insights](app-insights-overview.md) to monitor the web server side of your app on [ASP.NET](app-insights-asp-net.md) or [J2EE](app-insights-java-get-started.md). 


You can also use [Application Insights for Windows Desktop apps](app-insights-windows-desktop.md).

## Analytics, export and API access to HockeyApp data 

[Set up a HockeyApp bridge](app-insights-hockeyapp-bridge-app.md) in Application Insights. This enables you to:

* Use the powerful [Analytics](app-insights-analytics.md) query language over your telemetry. 
* [Export telemetry](app-insights-export-telemetry.md) to Azure blob storage.

## Next steps

* [Get started with HockeyApp for Windows](http://support.hockeyapp.net/kb/client-integration-windows-and-windows-phone)
