<properties 
	pageTitle="Telemetry sampling in Application Insights" 
	description="How to keep the volume of telemetry under control." 
	services="application-insights" 
    documentationCenter="windows"
	authors="vgorbenko" 
	manager="douge"/>

<tags 
	ms.service="application-insights" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="ibiza" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="10/20/2015" 
	ms.author="awills"/>

#  Sampling in Application Insights

*Application Insights is in preview.*


Sampling  is an option in Application Insights that allows you to collect and store a reduced set of telemetry while maintaining a statistically correct analysis of application data. You'd typically use it to reduce traffic and avoid [throttling](app-insights-pricing.md#data-rate). The data is filtered in such a way that related items are allowed through, so that you can perform diagnostic investigations with a reduced set of data. Client and server side automatically coordinate to filter related items. When metric counts are presented to you in the portal, they are renormalized to take account of the sampling, to minimize any effect on the statistics. 


Sampling is currently in Beta, and may change in the future.

## Configuring  sampling for your application

Sampling is currently available for the ASP.NET SDK or [any   web page](#other-web-pages). 

### ASP.NET server
To configure sampling in your application, insert the following code snippet into the `Application_Start()` method in Global.asax.cs:

```C#

    using Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel;
    // This configures sampling percentage at 10%:
    TelemetryConfiguration.Active.TelemetryChannel = new TelemetryChannelBuilder().UseSampling(10.0).Build();
```

> [AZURE.NOTE] For the sampling percentage, choose a percentage that is close to 100/N where N is an integer. So for example, valid values include 50 (=1/2), 33.33 (= 1/3), 25 (=1/4), 20 (=1/5) and so on. Currently sampling doesn't support other values.

### Web pages with JavaScript

You can configure web pages for sampling from any server. For ASP.NET servers, configure both client and server sides. 

When you [configure the web pages for Application Insights](app-insights-javascript.md), modify the snippet that you get from the Application Insights portal. (In ASP.NET, you'll find it in _Layout.cshtml.)  Insert a line like `samplingPercentage: 10,` before the instrumentation key:

    <script>
	var appInsights= ... 
	}({ 

	samplingPercentage: 10, 

	instrumentationKey:...
	}); 
	
	window.appInsights=appInsights; 
	appInsights.trackPageView(); 
	</script> 

Make sure that you provide the same sampling percentage in the JavaScript as you did in the server side.


## When  to use sampling?

You don’t need sampling for most small and medium size applications. The most useful diagnostic information and most accurate statistics are obtained by collecting data on all of your user activities. 

 
The main reasons you'd use sampling are:


* Application Insights service drops ("throttles") data points when your app sends a very high rate of telemetry in short time interval. 
* You  want to keep within the [quota](app-insights-pricing.md) of data points for your pricing tier. 
* To reduce network traffic from the collection of telemetry. 

## How does sampling work?

From the application standpoint, sampling is a feature of the Application Insights SDK. You specify what percentage of all data points should be sent to Application Insights service. From version 2.0.0 of Application Insights SDK you can control sampling percentage from your code. (Future versions of SDK will additionally allow configuring sampling percentage from the ApplicationInsights.config file.)

The SDK decides which telemetry items to drop, and which ones to keep. The sampling decision is based on several rules that aim to preserve all interrelated data points intact, maintaining a diagnostic experience in Application Insights that is actionable and reliable even with a reduced data set. For example, if for a failed request your app sends additional telemetry items (such as exception and traces logged from this request), sampling will not split this request and other telemetry. It either keeps or drops them all together. As a result, when you look at the request details in Application Insights, you can always see the request along with its associated telemetry items. 

For applications that define "user" (that is, most typical web applications), the sampling decision is based on the hash of the user id, which means that all telemetry for any particular user is either preserved or dropped. For the types of applications that don't define users (such as web services) the sampling decision is based on the operation id of the request. Finally, for the telemetry items that neither have user nor operation id set (for example telemetry items reported from asynchronous threads with no http context) sampling simply captures a percentage of telemetry items of each type. 

When presenting telemetry back to you, the Application Insights service adjusts the metrics by the same sampling percentage that was used at the time of collection, to compensate for the missing data points. Hence, when looking at the telemetry in Application Insights, the users are seeing statistically correct approximations that are very close to the real numbers.

The accuracy of the approximation largely depends on the configured sampling percentage. Also, the accuracy increases for applications that handle a large volume of generally similar requests from lots of users. On the other hand, for applications that don't work with a significant load, sampling is not needed as these applications can usually send all of their telemetry while staying within the quota, without causing data loss from throttling. 

Note that Application Insights does not sample Metrics and Sessions telemetry types, since for these types reduction in the precision can be highly undesirable. 

## Sampling and the JavaScript SDK

The client-side (JavaScript) SDK participates in sampling in conjunction with server side SDK. The instrumented pages will only send client-side telemetry from the same users for which the server-side made its decision to "sample in". This logic is designed to maintain integrity of user session across client- and server-sides. As a result, from any particular telemetry item in Application Insights you can find all other telemetry items for this user or session. 

*My client and server side telemetry don't show coordinated samples as you describe above.*

* Verify that you enabled sampling both on server and client.
* Make sure that the SDK version is 2.0 or above.
* Check that you set the same sampling percentage in both the client and server.


## Frequently Asked Questions 

*Why isn't sampling a simple "collect X percent of each telemetry type"?*

 *  While this sampling approach would provide with a very high precision in metric approximations, it would break ability to correlate diagnostic data per user, session, and request, which is critical for diagnostics. Therefore, sampling works better with "collect all telemetry items for X percent of app users", or "collect all telemetry for X percent of app requests" logic. For the telemetry items not associated with the requests (such as background asynchronous processing), the fall back is to "collect X percent of all items for each telemetry type". 

*Can the sampling percentage change over time?*

 * In today's implementation you would typically not change the sampling percentage after setting it up on application start. Even though you have control over sampling percentage runtime, there is no way to determine which sampling percentage will be optimal and will collect "just the right amount of data volume" before throttling logic kicks in or before monthly data volume quota is reached. Future versions of Application Insights SDK will include adaptive sampling that, on the fly, will adjust the sampling percentage up and down, based on the currently observed volume of the telemetry and other factors. 

*How do I know which sampling percentage will work the best for my app?*

* Today you have to guess. Analyze your current telemetry usage in AI, observe the drops of data related to throttling, and estimate the volume of the collected telemetry. These three inputs, together with the selected pricing tier, will suggest how much you might want to reduce the volume of the collected telemetry. However, a shift in the pattern of the telemetry volume may invalidate optimally configured sampling percentage (for example an increase in the number of your users). When implemented, adaptive sampling will automatically control the sampling percentage to its optimal level, based on the observed telemetry volume.

*What happens if I configure sampling percentage too low?*

* Excessively low sampling percentage (over-aggressive sampling) will reduce the accuracy of the approximations, when Application Insights attempts to compensate the visualization of the data for the data volume reduction. Also, diagnostic experience might be negatively impacted, as some of the infrequently failing or slow requests may be sampled out.

*What happens if I configure sampling percentage too high?*

* Configuring too high sampling percentage (not aggressive enough) will result in an insufficient reduction in the volume of the collected telemetry. You may still experience telemetry data loss related to throttling, and the cost of using Application Insights might be higher than you planned due to overage charges.

*On what platforms can I use sampling?*

* Currently sampling is available for any web pages, and for both client and server sides of .NET web applications.

*Can I use sampling with device apps (Windows Phone, iOS, Android, or desktop apps)?*

* No, sampling for device applications is not supported at the moment. 

