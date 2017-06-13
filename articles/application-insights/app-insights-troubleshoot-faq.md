---
title: Azure Application Insights FAQ | Microsoft Docs
description: Frequently asked questions about Application Insights.
services: application-insights
documentationcenter: .net
author: CFreemanwa
manager: carmonm

ms.assetid: 0e3b103c-6e2a-4634-9e8c-8b85cf5e9c84
ms.service: application-insights
ms.workload: mobile
ms.tgt_pltfrm: ibiza
ms.devlang: na
ms.topic: article
ms.date: 04/12/2017
ms.author: cfreeman

---
# Application Insights: Frequently Asked Questions

## Configuration problems
*I'm having trouble setting up my:*

* [.NET app](app-insights-asp-net-troubleshoot-no-data.md)
* [Monitoring an already-running app](app-insights-monitor-performance-live-website-now.md#troubleshooting-runtime-configuration-of-application-insights)
* [Azure diagnostics](app-insights-azure-diagnostics.md)
* [Java web app](app-insights-java-troubleshoot.md)

*I get no data from my server*

* [Set firewall exceptions](app-insights-ip-addresses.md)
* [Set up an ASP.NET server](app-insights-monitor-performance-live-website-now.md)
* [Set up a Java server](app-insights-java-agent.md)

## Can I use Application Insights with ...?

* [Web apps on an IIS server - on-premises or in a VM](app-insights-asp-net.md)
* [Java web apps](app-insights-java-get-started.md)
* [Node.js apps](app-insights-nodejs.md)
* [Web apps on Azure](app-insights-azure-web-apps.md)
* [Cloud Services on Azure](app-insights-cloudservices.md)
* [App servers running in Docker](app-insights-docker.md)
* [Single-page web apps](app-insights-javascript.md)
* [Sharepoint](app-insights-sharepoint.md)
* [Windows desktop app](app-insights-windows-desktop.md)
* [Other platforms](app-insights-platforms.md)

## Is it free?

Yes, for experimental use. In the basic pricing plan, your application can send a certain allowance of data each month free of charge. The free allowance is large enough to cover development, and publishing an app for a small number of users. You can set a cap to prevent more than a specified amount of data from being processed.

Larger volumes of telemetry are charged by the Gb. We provide some tips on how to [limit your charges](app-insights-pricing.md).

The Enterprise plan incurs a charge for each day that each web server node sends telemetry. It is suitable if you want to use Continuous Export on a large scale.

[Read the pricing plan](https://azure.microsoft.com/pricing/details/application-insights/).

## How much is it costing?

* Open the **Features + pricing** page in an Application Insights resource. There's a chart of recent usage. You can set a data volume cap, if you want.
* Open the [Azure Billing blade](https://portal.azure.com/#blade/Microsoft_Azure_Billing/BillingBlade/Overview) to see your bills across all resources.

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

## What is Status Monitor?

A desktop app that you can use in your IIS web server to help configure Application Insights in web apps. It doesn't collect telemetry: you can stop it when you are not configuring an app. 

[Learn more](app-insights-monitor-performance-live-website-now.md#questions).

## What telemetry is collected by Application Insights?

From server web apps:

* HTTP requests
* [Dependencies](app-insights-asp-net-dependencies.md). Calls to: SQL Databases; HTTP calls to external services; Azure Cosmos DB, table, blob storage, and queue. 
* [Exceptions](app-insights-asp-net-exceptions.md) and stack traces.
* [Performance Counters](app-insights-performance-counters.md) - If you use [Status Monitor](app-insights-monitor-performance-live-website-now.md), Azure monitoring(app-insights-azure-web-apps.md) or the [Application Insights collectd writer](app-insights-java-collectd.md).
* [Custom events and metrics](app-insights-api-custom-events-metrics.md) that you code.
* [Trace logs](app-insights-asp-net-trace-logs.md) if you configure the appropriate collector.

From [client web pages](app-insights-javascript.md):

* [Page view counts](app-insights-web-track-usage.md)
* [AJAX calls](app-insights-asp-net-dependencies.md) Requests made from a running script.
* Page view load data
* User and session counts
* [Authenticated user IDs](app-insights-api-custom-events-metrics.md#authenticated-users)

From other sources, if you configure them:

* [Azure diagnostics](app-insights-azure-diagnostics.md)
* [Docker containers](app-insights-docker.md)
* [Import tables to Analytics](app-insights-analytics-import.md)
* [OMS (Log Analytics)](https://azure.microsoft.com/blog/omssolutionforappinsightspublicpreview/)
* [Logstash](app-insights-analytics-import.md)

## Can I filter out or modify some telemetry?

Yes, in the server you can write:

* Telemetry Processor to filter or add properties to selected telemetry items before they are sent from your app.
* Telemetry Initializer to add properties to all items of telemetry.

Learn more for [ASP.NET](app-insights-api-filtering-sampling.md) or [Java](app-insights-java-filter-telemetry.md).

## How are City, Country and other geo location data calculated?

We look up the IP address (IPv4 or IPv6) of the web client using [GeoLite2](http://dev.maxmind.com/geoip/geoip2/geolite2/).

* Browser telemetry: We collect the sender's IP address.
* Server telemetry: The Application Insights module collects the client IP address. It is not collected if `X-Forwarded-For` is set.

You can configure the `ClientIpHeaderTelemetryInitializer` to take the IP address from a different header. In some systems, for example, it is moved by a proxy, load balancer, or CDN to `X-Originating-IP`. [Learn more](http://apmtips.com/blog/2016/07/05/client-ip-address/).

You can [use Power BI](app-insights-export-power-bi.md) to display your request telemetry on a map.


## <a name="data"></a>How long is data retained in the portal? Is it secure?
Take a look at [Data Retention and Privacy][data].

## Might personally identifiable information (PII) be sent in the telemetry?

This is possible if your code sends such data. It can also happen if variables in stack traces include PII. Your development team should conduct risk assessments to ensure that PII is properly handled. [Learn more about data retention and privacy](app-insights-data-retention-privacy.md).

The last octet of the client web address is always set to 0 after ingestion by the portal.

## My iKey is visible in my web page source. 

* This is common practice in monitoring solutions.
* It can't be used to steal your data.
* It could be used to skew your data or trigger alerts.
* We have not heard that any customer has had such problems.

You could:

* Use two separate iKeys (separate Application Insights resources), for client and server data. Or
* Write a proxy that runs in your server, and have the web client send data through that proxy.

## <a name="post"></a>How do I see POST data in Diagnostic search?
We don't log POST data automatically, but you can use a TrackTrace call: put the data in the message parameter. This has a longer size limit than the limits on string properties, though you can't filter on it.

## Should I use single or multiple Application Insights resources?

Use a single resource for all the components or roles in a single business system. Use separate resources for development, test, and release versions, and for independent applications.

* [See the discussion here](app-insights-separate-resources.md)
* [Example - cloud service with worker and web roles](app-insights-cloudservices.md)

## How do I dynamically change the instrumentation key?

* [Discussion here](app-insights-separate-resources.md)
* [Example - cloud service with worker and web roles](app-insights-cloudservices.md)

## What are the User and Session counts?

* The JavaScript SDK sets a user cookie on the web client, to identify returning users, and a session cookie to group activities.
* If there is no client-side script, you can [set cookies at the server](http://apmtips.com/blog/2016/07/09/tracking-users-in-api-apps/).
* If one real user uses your site in different browsers, or using in-private/incognito browsing, or different machines, then they will be counted more than once.
* To identify a logged-in user across machines and browsers, add a call to [setAuthenticatedUserContect()](app-insights-api-custom-events-metrics.md#authenticated-users).

## <a name="q17"></a> Have I enabled everything in Application Insights?
| What you should see | How to get it | Why you want it |
| --- | --- | --- |
| Availability charts |[Web tests](app-insights-monitor-web-app-availability.md) |Know your web app is up |
| Server app perf: response times, ... |[Add Application Insights to your project](app-insights-asp-net.md) or [Install AI Status Monitor on server](app-insights-monitor-performance-live-website-now.md) (or write your own code to [track dependencies](app-insights-api-custom-events-metrics.md#trackdependency)) |Detect perf issues |
| Dependency telemetry |[Install AI Status Monitor on server](app-insights-monitor-performance-live-website-now.md) |Diagnose issues with databases or other external components |
| Get stack traces from exceptions |[Insert TrackException calls in your code](app-insights-asp-net-exceptions.md) (but some are reported automatically) |Detect and diagnose exceptions |
| Search log traces |[Add a logging adapter](app-insights-asp-net-trace-logs.md) |Diagnose exceptions, perf issues |
| Client usage basics: page views, sessions, ... |[JavaScript initializer in web pages](app-insights-javascript.md) |Usage analytics |
| Client custom metrics |[Tracking calls in web pages](app-insights-api-custom-events-metrics.md) |Enhance user experience |
| Server custom metrics |[Tracking calls in server](app-insights-api-custom-events-metrics.md) |Business intelligence |

## Why are the counts in Search and Metrics charts unequal?

[Sampling](app-insights-sampling.md) reduces the number of telemetry items (requests, custom events, and so on) that are actually sent from your app to the portal. In Search, you see the number of items actually received. In metric charts that display a count of events, you see the number of original events that occurred. 

Each item that is transmmitted carries an `itemCount` property that shows how many original events that item represents. To observe sampling in operation, you can run this query in Analytics:

```
    requests | summarize original_events = sum(itemCount), transmitted_events = count()
```


## Automation

### Configuring Application Insights

You can [write PowerShell scripts](app-insights-powershell.md) using Azure Resource Monitor to:

* Create and update Application Insights resources.
* Set the pricing plan.
* Get the instrumentation key.
* Add a metric alert.
* Add an availability test.

You can't set up a Metric Explorer report or set up continuous export.

### Querying the telemetry

Use the [REST API](https://dev.applicationinsights.io/) to run [Analytics](app-insights-analytics.md) queries.

## How can I set an alert on an event?

Azure alerts are only on metrics. Create a custom metric that crosses a value threshold whenever your event occurs. Then set an alert on the metric. Note that: you'll get a notification whenever the metric crosses the threshold in either direction; you won't get a notification until the first crossing, no matter whether the initial value is high or low; there is always a latency of a few minutes.

## Are there data transfer charges between an Azure web app and Application Insights?

* If your Azure web app is hosted in a data center where there is an Application Insights collection endpoint, there is no charge. 
* If there is no collection endpoint in your host data center, then your app's telemetry will incur [Azure outgoing charges](https://azure.microsoft.com/pricing/details/bandwidth/).

This doesn't depend on where your Application Insights resource is hosted. It just depends on the distribution of our endpoints.

## Can I send telemetry to the Application Insights portal?

We recommend you use our SDKs and use the SDK API (app-insights-api-custom-events-metrics.md). There are variants of the SDK for various [platforms](app-insights-platforms.md). These SDKs handle buffering, compression, throttling, retries, and so on. However, the [ingestion schema](https://github.com/Microsoft/ApplicationInsights-dotnet/tree/develop/Schema/PublicSchema) and [endpoint protocol](https://github.com/Microsoft/ApplicationInsights-Home/blob/master/EndpointSpecs/ENDPOINT-PROTOCOL.md) are public.

## Can I monitor an intranet web server?

Here are two methods:

### Firewall door

Allow your web server to send telemetry to our endpoints https://dc.services.visualstudio.com:443 and https://rt.services.visualstudio.com:443. 

### Proxy

Route traffic from your server to a gateway on your intranet, by setting this in ApplicationInsights.config:

```XML
<TelemetryChannel>
    <EndpointAddress>your gateway endpoint</EndpointAddress>
</TelemetryChannel>
```

Your gateway should route the traffic to https://dc.services.visualstudio.com:443/v2/track

## Can I run Availability web tests on an intranet server?

Our [web tests](app-insights-monitor-web-app-availability.md) run on points of presence that are distributed around the globe. There are two solutions:

* Firewall door - Allow requests to your server from [the long and changeable list of web test agents](app-insights-ip-addresses.md).
* Write your own code to send periodic requests to your server from inside your intranet. You could run Visual Studio web tests for this purpose. The tester could send the results to Application Insights using the TrackAvailability() API.

## More answers
* [Application Insights forum](https://social.msdn.microsoft.com/Forums/vstudio/en-US/home?forum=ApplicationInsights)

<!--Link references-->

[data]: app-insights-data-retention-privacy.md
[platforms]: app-insights-platforms.md
[start]: app-insights-overview.md
[windows]: app-insights-windows-get-started.md
