<properties
	pageTitle="Performance monitoring for mobile web apps with Developer Analytics | Microsoft Azure"
	description="Application performance and usage monitoring for mobile app developers. , desktop, web service, and backend apps with HockeyApp and Application Insights."
	authors="alancameronwills"
	services="application-insights"
    documentationCenter=""
	manager="douge"/>

<tags
	ms.service="application-insights"
	ms.workload="tbd"
	ms.tgt_pltfrm="ibiza"
	ms.devlang="na"
	ms.topic="article" 
	ms.date="09/19/2016"
	ms.author="awills"/>

# Mobile Analytics with HockeyApp and Application Insights

Monitor the performance and usage of your beta-test and deployed mobile and desktop apps with [HockeyApp](https://hockeyapp.net/). Monitor the supporting web service and backend apps with [Visual Studio Application Insights](app-insights-overview.md). Analyze data from both the client and server apps in Analytics, and display the charts alongside each other in an Azure dashboard.

Microsoft Developer Analytics offers two solutions for application performance monitoring:

* **HockeyApp for mobile** and desktop apps.
 * Distribute test versions to selected users.
 * Crash analysis.
 * Custom telemetry for usage analysis.
* **Application Insights for web sites** and services, and backend applications.
 * Performance and usage metrics and alerts.
 * Exception reporting and diagnostic tracing.
 * Diagnostic search with filtering and related telemetry links.

Both solutions offer:

 * Powerful **[analytic query language](app-insights-analytics.md)** for diagnostics and analysis.
 * **[Export data](app-insights-export-telemetry.md)** to your own storage.
 * **Integrated dashboard** display of analytic charts and tables.

## Monitor your app components

Follow the instructions in these pages to install the SDK in your code and start tracking your app.

### Web apps - Application Insights

* [ASP.NET web app](app-insights-asp-net.md) 
* [Java web app](app-insights-java-get-started.md)
* [Node.js web app](https://github.com/Microsoft/ApplicationInsights-node.js)
* [Azure Cloud Services](app-insights-cloudservices.md)

### Mobile apps - HockeyApp

* [iOS app](https://support.hockeyapp.net/kb/client-integration-ios-mac-os-x-tvos/hockeyapp-for-ios)
* [Mac OS X app](https://support.hockeyapp.net/kb/client-integration-ios-mac-os-x-tvos/hockeyapp-for-mac-os-x)
* [Android app](https://support.hockeyapp.net/kb/client-integration-android/hockeyapp-for-android-sdk)
* [Universal Windows app](https://support.hockeyapp.net/kb/client-integration-windows-and-windows-phone/how-to-create-an-app-for-uwp)
* [Windows Phone 8 and 8.1 app](https://support.hockeyapp.net/kb/client-integration-windows-and-windows-phone/hockeyapp-for-windows-phone-silverlight-apps-80-and-81)
* [Windows Presentation Foundation app](https://support.hockeyapp.net/kb/client-integration-windows-and-windows-phone/hockeyapp-for-windows-wpf-apps)

For Windows desktop apps, we recommend HockeyApp. But you can also [send telemetry from a Windows app to Application Insights](app-insights-windows-desktop.md). You might want to do that to experiment with Application Insights.


## Analytics and Export for HockeyApp telemetry

You can investigate HockeyApp custom and log telemetry using the Analytics and Continuous Export features of Application Insights by [setting up a bridge](app-insights-hockeyapp-bridge-app.md).




