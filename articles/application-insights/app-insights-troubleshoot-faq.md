<properties 
	pageTitle="Troubleshooting and Questions about Application Insights" 
	description="Something in Visual Studio Application Insights unclear or not working? Try here." 
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
	ms.date="05/13/2016" 
	ms.author="awills"/>
 
# Questions - Application Insights for ASP.NET

## Configuration problems

*I'm having trouble setting up my:*

* [.NET app](app-insights-asp-net-troubleshoot-no-data.md)
* [Monitoring an already-running app](app-insights-monitor-performance-live-website-now.md#troubleshooting)
* [Azure diagnostics](app-insights-azure-diagnostics.md)
* [Java web app](app-insights-java-troubleshoot.md)
* [Other platforms](app-insights-platforms.md)


## Can I use Application Insights with ...?

[See Platforms][platforms]


## Is it free?

* Yes, if you choose the free [pricing tier](app-insights-pricing.md). You get most features and a generous quota of data. 
* You have to provide your credit card data to register with Microsoft Azure, but no charges will be made unless you use another paid-for Azure service, or you explicitly upgrade to a paying tier.
* If your app sends more data than the monthly quota for the free tier, it stops being logged. If that happens, you can either choose to start paying, or wait until the quota is reset at the end of the month.
* Basic usage and session data is not subject to a quota.
* There is also a free 30-day trial, during which you get the paid features free of charge.
* Each application resource has a separate quota, and you set its pricing tier independently of any others.

#### What do I get if I pay?

* A larger [monthly quota of data](https://azure.microsoft.com/pricing/details/application-insights/).
* Option to pay 'overage' to continue collecting data over the monthly quota. If your data goes over quota, you're charged per Mb.
* [Continuous export](app-insights-export-telemetry.md).


## <a name="q14"></a>What does Application Insights modify in my project?

The details depend on the type of project. For a web application:


+ Adds these files to your project:

 + ApplicationInsights.config. 
 + ai.js


+ Installs these NuGet packages:

 -  *Application Insights API* - the core API

 -  *Application Insights API for Web Applications* - used to send telemetry from the server

 -  *Application Insights API for JavaScript Applications* - used to send telemetry from the client

    The packages include these assemblies:

 - Microsoft.ApplicationInsights

 - Microsoft.ApplicationInsights.Platform

+ Inserts items into:

 - Web.config

 - packages.config

+ (New projects only - if you [add Application Insights to an existing project][start], you have to do this manually.) Inserts snippets into the client and server code to initialize them with the Application Insights resource ID. For example, in an MVC app, code is inserted into the master page Views/Shared/_Layout.cshtml


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

<table border="1">
<tr><th>What you should see</th><th>How to get it</th><th>Why you want it</th></tr>
<tr><td>Availability charts</td><td><a href="../app-insights-monitor-web-app-availability/">Web tests</a></td><td>Know your web app is up</td></tr>
<tr><td>Server app perf: response times, ...
</td><td><a href="../app-insights-asp-net/">Add Application Insights to your project</a><br/>or <br/><a href="../app-insights-monitor-performance-live-website-now/">Install AI Status Monitor on server</a> (or write your own code to <a href="../app-insights-api-custom-events-metrics/#track-dependency">track dependencies</a>)</td><td>Detect perf issues</td></tr>
<tr><td>Dependency telemetry</td><td><a href="../app-insights-monitor-performance-live-website-now/">Install AI Status Monitor on server</a></td><td>Diagnose issues with databases or other external components</td></tr>
<tr><td>Get stack traces from exceptions</td><td><a href="../app-insights-search-diagnostic-logs/#exceptions">Insert TrackException calls in your code</a> (but some are reported automatically)</td><td>Detect and diagnose exceptions</td></tr>
<tr><td>Search log traces</td><td><a href="../app-insights-search-diagnostic-logs/">Add a logging adapter</a></td><td>Diagnose exceptions, perf issues</td></tr>
<tr><td>Client usage basics: page views, sessions, ...</td><td><a href="../app-insights-javascript/">JavaScript initializer in web pages</a></td><td>Usage analytics</td></tr>
<tr><td>Client custom metrics</td><td><a href="../app-insights-api-custom-events-metrics/">Tracking calls in web pages</a></td><td>Enhance user experience</td></tr>
<tr><td>Server custom metrics</td><td><a href="../app-insights-api-custom-events-metrics/">Tracking calls in server code</a></td><td>Business intelligence</td></tr>
</table>


## Automation

You can [write PowerShell scripts](app-insights-powershell.md) to create and update Application Insights resources.

## More answers

* [Application Insights forum](https://social.msdn.microsoft.com/Forums/vstudio/en-US/home?forum=ApplicationInsights)


<!--Link references-->

[data]: app-insights-data-retention-privacy.md
[platforms]: app-insights-platforms.md
[start]: app-insights-overview.md
[windows]: app-insights-windows-get-started.md

 