---
title: Troubleshooting and Questions about Azure Application Insights | Microsoft Docs
description: Something in Azure Application Insights unclear or not working? Try here.
services: application-insights
documentationcenter: .net
author: alancameronwills
manager: douge

ms.assetid: 0e3b103c-6e2a-4634-9e8c-8b85cf5e9c84
ms.service: application-insights
ms.workload: mobile
ms.tgt_pltfrm: ibiza
ms.devlang: na
ms.topic: article
ms.date: 08/24/2016
ms.author: awills

---
# Questions - Application Insights for ASP.NET
## Configuration problems
*I'm having trouble setting up my:*

* [.NET app](app-insights-asp-net-troubleshoot-no-data.md)
* [Monitoring an already-running app](app-insights-monitor-performance-live-website-now.md#troubleshooting-runtime-configuration-of-application-insights)
* [Azure diagnostics](app-insights-azure-diagnostics.md)
* [Java web app](app-insights-java-troubleshoot.md)
* [Other platforms](app-insights-platforms.md)

*I get no data from my server*

* [Set firewall exceptions](app-insights-ip-addresses.md)
* [Set up an ASP.NET server](app-insights-monitor-performance-live-website-now.md)
* [Set up a Java server](app-insights-java-agent.md)

## Can I use Application Insights with ...?
[See Platforms][platforms]

## Is it free?

Yes, for experimental use. In the basic pricing plan, your application can send a certain allowance of data each month free of charge. The free allowance is large enough to cover development, and publishing an app for a small number of users. You can set a cap to prevent more than a specified amount of data from being processed.

You need to use the Enterprise plan to get certain features such as Continuous Export. That incurs a daily charge.

[Read the pricing plan](https://azure.microsoft.com/pricing/details/application-insights/).


## <a name="q14"></a>What does Application Insights modify in my project?
The details depend on the type of project. For a web application:

* Adds these files to your project:

  * ApplicationInsights.config.
  * ai.js
* Installs these NuGet packages:

  * *Application Insights API* - the core API
  * *Application Insights API for Web Applications* - used to send telemetry from the server
  * *Application Insights API for JavaScript Applications* - used to send telemetry from the client

    The packages include these assemblies:
  * Microsoft.ApplicationInsights
  * Microsoft.ApplicationInsights.Platform
* Inserts items into:

  * Web.config
  * packages.config
* (New projects only - if you [add Application Insights to an existing project][start], you have to do this manually.) Inserts snippets into the client and server code to initialize them with the Application Insights resource ID. For example, in an MVC app, code is inserted into the master page Views/Shared/_Layout.cshtml

## How do I upgrade from older SDK versions?
See the [release notes](app-insights-release-notes.md) for the SDK appropriate to your type of application.

## <a name="update"></a>How can I change which Azure resource my project sends data to?
In Solution Explorer, right-click `ApplicationInsights.config` and choose **Update Application Insights**. You can send the data to an existing or new resource in Azure. The update wizard changes the instrumentation key in ApplicationInsights.config, which determines where the server SDK sends your data. Unless you deselect "Update all," it will also change the key where it appears in your web pages.

#### <a name="data"></a>How long is data retained in the portal? Is it secure?
Take a look at [Data Retention and Privacy][data].

## Logging
#### <a name="post"></a>How do I see POST data in Diagnostic search?
We don't log POST data automatically, but you can use a TrackTrace call: put the data in the message parameter. This has a longer size limit than the limits on string properties, though you can't filter on it.

## Security
#### Is my data secure in the portal? How long is it retained?
See [Data Retention and Privacy][data].

## <a name="q17"></a> Have I enabled everything in Application Insights?
| What you should see | How to get it | Why you want it |
| --- | --- | --- |
| Availability charts |[Web tests](app-insights-monitor-web-app-availability.md) |Know your web app is up |
| Server app perf: response times, ... |[Add Application Insights to your project](app-insights-asp-net.md) or [Install AI Status Monitor on server](app-insights-monitor-performance-live-website-now.md) (or write your own code to [track dependencies](app-insights-api-custom-events-metrics.md#trackdependency)) |Detect perf issues |
| Dependency telemetry |[Install AI Status Monitor on server](app-insights-monitor-performance-live-website-now.md) |Diagnose issues with databases or other external components |
| Get stack traces from exceptions |[Insert TrackException calls in your code](app-insights-search-diagnostic-logs.md#exceptions) (but some are reported automatically) |Detect and diagnose exceptions |
| Search log traces |[Add a logging adapter](app-insights-search-diagnostic-logs.md) |Diagnose exceptions, perf issues |
| Client usage basics: page views, sessions, ... |[JavaScript initializer in web pages](app-insights-javascript.md) |Usage analytics |
| Client custom metrics |[Tracking calls in web pages](app-insights-api-custom-events-metrics.md) |Enhance user experience |
| Server custom metrics |[Tracking calls in server](app-insights-api-custom-events-metrics.md) |Business intelligence |

## Automation
You can [write PowerShell scripts](app-insights-powershell.md) to create and update Application Insights resources.

## More answers
* [Application Insights forum](https://social.msdn.microsoft.com/Forums/vstudio/en-US/home?forum=ApplicationInsights)

<!--Link references-->

[data]: app-insights-data-retention-privacy.md
[platforms]: app-insights-platforms.md
[start]: app-insights-overview.md
[windows]: app-insights-windows-get-started.md
