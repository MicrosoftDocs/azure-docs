<properties 
	pageTitle="Sampling in Aplication Insights" 
	description="Control the volume of telemetry by sending only a specified fraction." 
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
	ms.date="10/06/2015" 
	ms.author="awills"/>
 
# Sampling in Application Insights

Sampling is a feature of the [Application Insights SDK](app-insights-api-custom-events-metrics.md) that reduces the volume of telemetry that your application sends to the [Application Insights](app-insights-overview.md) service. It doesn't operate by default: you have to configure it. 

Use sampling if you want to reduce network traffic or data rate charges. 

Sampling is designed so that the statistical metrics you see at the portal represent a fair approximation to the results you'd see from the unmodulated telemetry. It works on the level of user operations, not individual data points. This means, for example, that if you investigate an exception that you find in [diagnostic search](app-insights-diagnostic-search.md), you will be able to see the events associated with it. Sampling works across application tiers for the same reason: you'll see user events reported from the browser that are associated with the same request.

##  Configuring sampling for your application

Add this code to Application_Start() in Global.asax.cs (or to a similar suitable initialization method for other app types):

```C#

    using Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel;
    ...
 
    // 10% sampling:
    TelemetryConfiguration.Active.TelemetryChannel = new TelemetryChannelBuilder().UseSampling(10.0).Build();
```

Replace 10.0 with your own choice of percentage. Too low a percentage will reduce the accuracy of the approximated results. Too high a percentage might not reduce the traffic enough. You will probably have to experiment to get the best figure.

Rebuild and redeploy your app.


## When to use sampling

The volume of data that the Application Insights service accepts from your app depends on the [pricing tier](app-insights-pricing.md) you select. A small app with few users usually stays within the free pricing tier. For larger apps with more users, you pay to allow more data per month and to allow it to be retained longer.

Ideally, you'd like to collect as much telemetry as possible, but there some good reasons why you might want to limit the volume:

* The monthly number of data points produced by your app exceeds the quota included in the chosen pricing tier, but the overage charges would surpass your spending budget.
* Application Insights begins dropping ("throttling") data points because of a very high rate telemetry. 
* The network consumption or resulting performance impact from collecting application telemetry is too high. 

 
## How sampling works

Sampling is a mechanism that reduces the volume of the certain types of telemetry, by sending to the Application Insights service only a desired percentage of all data points. This percentage is called the *sampling ratio,* and is configurable by you. 

When it is time to present the telemetry to you, the Application Insights service adjusts the event counts by the same sampling ratio, to compensate for the missing data points. The values you see are approximations to the true numbers. The larger the volume of data, the better the approximation.

When deciding which telemetry item to drop, and which one to keep, the sampling logic tries to preserve all interrelated telemetry data points intact, to keep diagnostic experience in Application Insights actionable with a reduced data set. For example, if for a failed request your app sends additional telemetry items such as exception, events or traces, then sampling will not split these telemetry items, and will either keep them all, or will drop them all together. 

If there is a defined user, the strategy is "collect all telemetry items for X% of app users". If there is no user (for example when monitoring a REST service) it is "collect all telemetry for X% of operations". An operation is typically an HTTP request. If there is no defined operation, for example when monitoring a background service or desktop app, the fall back is to "collect X% of all items for each telemetry type". 

Sampling is not applied to TrackMetric, performance counter, and session telemetry types, since exact values are typically required.



## Frequently Asked Questions


*Can the sample ratio be changed dynamically?*

* Not at present. On the roadmap is to build “adaptive sampling” that will adjust sampling ratio up and down on the fly, based on the currently observed volume of the telemetry and other factors. 

*How do I know which sampling ratio will work the best for my app?*

* Experiment. Keep it high enough that you make good use of your monthly quota, but low enough to keep under the throttling limits. If introducing sampling changes the apparent performance, it might be that you're sending too little data. Increase the sampling ratio.



*Does sampling control the volume of the telemetry collected from the browser? Or is it server-side only?*

* For web applications, sampling works across the application tiers. If we collect telemetry for a particular user ("sampled in") then all telemetry in this user sessions will be collected, both browser- and server-side. Conversely, sampled-out user sessions will send telemetry from neither browser nor server.

*On what platforms can I use sampling?*

* Currently sampling is available only for [.NET applications](app-insights-asp-net.md). Support for Java is planned.  

*What other ways can I use to limit telemetry?*

* You could remove some of the modules specified in [ApplicationInsights.config](app-insights-configuration-with-applicationinsights-config.md). Each TelemetryInitializer corresponds to a type of telemetry, which you might not need.



