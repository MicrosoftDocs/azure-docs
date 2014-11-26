<properties title="Application Insights" pageTitle="Application Insights - start monitoring your app's health and usage" description="Analyze usage, availability and performance of your on-premises or Microsoft Azure web application with Application Insights." metaKeywords="analytics monitoring application insights" authors="awills"  manager="kamrani" />

<tags ms.service="application-insights" ms.workload="tbd" ms.tgt_pltfrm="ibiza" ms.devlang="na" ms.topic="article" ms.date="2014-09-24" ms.author="awills" />

# Application Insights - Start monitoring your app's health and usage

*Application Insights is in preview.*

Application Insights lets you monitor your live application for:

* **Availability** - We'll test your URLs every few minutes from around the world.
* **Performance**  - Detect and diagnose perf issues and exceptions.
* **Usage** - Find out what users are doing with your app, so that you can make it better for them.

Configuration is very easy, and you'll see results in minutes. We currently support ASP.NET web apps (on your own servers or on Azure).


## Get started

Start with any combination, in any order, of the entry points on the left of this chart. Pick the routes that work for you. If you're developing an ASP.NET web app, start by adding Application Insights to your web project - it's easy to add the other bits later.

You'll need an account in [Microsoft Azure](http://azure.com) (unless you use the VSO version).

<table >
<tr valign="top"><th>What you need</th><th colspan="2">What to do</th><th>What you get</th></tr>
<tr valign="top"><td>Get perf and usage analytics for my ASP.NET app</td><td colspan="2"><a href="../app-insights-start-monitoring-app-health-usage/">Add Application Insights to your web project</a></td><td>Performance metrics: load counts, response times, ...</td></tr>
<tr valign="top"><td></td><td></td><td><a href="../app-insights-web-track-usage-custom-events-metrics/">Send events and metric from your server code</a></td><td>Custom business analytics</td></tr>
<tr valign="top"><td></td><td></td><td><a href="../app-insights-search-diagnostic-logs/">Send trace and exception telemetry from your server, or capture 3rd party log data.</td><td>Server app diagnostics. Search and filter log data.</a></td></tr>
<tr valign="top"><td>Get usage analytics for my web pages (on any platform)</td><td colspan="2"><a href="../app-insights-web-track-usage/">Insert the AI script in your web pages</a></td><td>Usage analytics: page views, returning users, session counts</td></tr>
<tr valign="top"><td></td><td>&nbsp;&nbsp;</td><td><a href="../app-insights-web-track-usage-custom-events-metrics/">Write event and metric calls in your web page scripts</a></td><td>Custom user experience analytics</td></tr>
<tr valign="top"><td></td><td></td><td><a href="../app-insights-search-diagnostic-logs/">Write trace and diagnostic calls in your web page scripts</a></td><td>Search and filter log data.</td></tr>
<tr valign="top"><td>Diagnose issues in an ASP.NET app already running on my web server</td><td colspan="2"><a href="../app-insights-monitor-performance-live-website-now/">Install Status Monitor on your web server</a></td><td>Dependency call durations and counts; CPU, mem and network counters; load counts, response times</td></tr>
<tr valign="top"><td>Monitor the availability of any web pages</td><td colspan="2"><a href="../app-insights-monitor-web-app-availability/">Set up web tests on Application Insights</a></td><td>Availability monitor and alerts</td></tr>
<tr valign="top"><td>Get perf and usage analytics for Windows Phone apps, Windows Store apps, or Java websites</td><td colspan="2"><a href="http://msdn.microsoft.com/library/dn481095.aspx">For now, use the older VSO version of Application Insights</a></td><td>Usage and performance analytics. <a href="http://msdn.microsoft.com/library/dn793604.aspx">We're gradually building up features in the Azure version.</a></td></tr>
</table>


## <a name="video"></a>Videos

#### Introduction

> [AZURE.VIDEO application-insights-introduction]

#### Get started

> [AZURE.VIDEO getting-started-with-application-insights]




[AZURE.INCLUDE [app-insights-learn-more](../includes/app-insights-learn-more.md)]


