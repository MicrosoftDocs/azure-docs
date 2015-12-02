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
	ms.date="11/23/2015" 
	ms.author="awills"/>

#  Sampling in Application Insights

*Application Insights is in preview.*


Sampling is a feature in Application Insights that allows you to collect and store a reduced set of telemetry while maintaining a statistically correct analysis of application data.  It reduces traffic and helps avoid [throttling](app-insights-pricing.md#data-rate). The data is filtered in such a way that related items are allowed through, so that you can navigate between items when you're performing diagnostic investigations.
When metric counts are presented to you in the portal, they are renormalized to take account of the sampling, to minimize any effect on the statistics.

Adaptive sampling is enabled by default in the Application Insights SDK for ASP.NET, version 2.0.0-beta3 or later. Sampling is currently in Beta, and may change in the future.

There are two alternative sampling modules:

* Adaptive sampling automatically adjusts the sampling percentage to achieve a specific volume of requests. Currently available for ASP.NET server-side telemetry only.  
* Fixed-rate sampling is also available. You specify the sampling percentage. Available for ASP.NET web app code and JavaScript web pages. The client and server will synchronize their sampling so that, in Search, you can navigate between related page views and requests.

## Enabling adaptive sampling

**Update your project's NuGet** packages to the latest *pre-release* version of Application Insights: Right-click the project in Solution Explorer, choose Manage NuGet Packages, check **Include prerelease** and search for Microsoft.ApplicationInsights.Web. 

In [ApplicationInsights.config](app-insights-configuration-with-applicationinsights-config.md), you can adjust a number of parameters in the `AdaptiveSamplingTelemetryProcessor` node. The figures shown are the default values:

* `<MaxTelemetryItemsPerSecond>5</MaxTelemetryItemsPerSecond>`

    The target rate that the adaptive algorithm aims for **on a single server host**. If your web app runs on many hosts, you will want to reduce this value so as to remain within your target rate of traffic at the Application Insights portal.

* `<EvaluationInterval>00:00:15</EvaluationInterval>` 

    The interval at which the current rate of telemetry is re-evaluated. Evaluation is performed as a moving average. You might want to shorten this interval if your telemetry is liable to sudden bursts.

* `<SamplingPercentageDecreaseTimeout>00:02:00</SamplingPercentageDecreaseTimeout>`

    When sampling percentage value changes, how soon after are we allowed to lower sampling percentage again to capture less data.

* `<SamplingPercentageIncreaseTimeout>00:15:00</SamplingPercentageDecreaseTimeout>`

    When sampling percentage value changes, how soon after are we allowed to increase sampling percentage again to capture more data.

* `<MinSamplingPercentage>0.1<\MinSamplingPercentage>`

    As sampling percentage varies, what is the minimum value we're allowed to set.

* `<MaxSamplingPercentage>100.0<\MaxSamplingPercentage>`

    As sampling percentage varies, what is the maximum value we're allowed to set.

* `<MovingAverageRatio>0.25</MovingAverageRatio>` 

    In the calculation of the moving average, the weight assigned to the most recent value. Use a value equal to or less than 1. Smaller values make the algorithm less reactive to sudden changes.

* `<InitialSamplingPercentage>100<\InitialSamplingPercentage>`

    The value assigned when the app has just started. Don't reduce this while you're debugging. 

### Alternative: configure adaptive sampling in code

Instead of adjusting sampling in the .config file, you can use code. This allows you to specify a callback function that is invoked whenever the sampling rate is re-evaluated. You could use this, for example, to find out what sampling rate is being used.

Remove the `AdaptiveSamplingTelemetryProcessor` node from the .config file.



*C#*

```C#

    using Microsoft.ApplicationInsights;
    using Microsoft.ApplicationInsights.Extensibility;
    using Microsoft.ApplicationInsights.WindowsServer.Channel.Implementation;
    using Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel;
    ...

    var adaptiveSamplingSettings = new SamplingPercentageEstimatorSettings();

    // Optional: here you can adjust the settings from their defaults.

    var builder = TelemetryConfiguration.Active.GetTelemetryProcessorChainBuilder();
    
    builder.UseAdaptiveSampling(
         adaptiveSamplingSettings,

        // Callback on rate re-evaluation:
        (double afterSamplingTelemetryItemRatePerSecond,
         double currentSamplingPercentage,
         double newSamplingPercentage,
         bool isSamplingPercentageChanged,
         SamplingPercentageEstimatorSettings s
        ) =>
        {
          if (isSamplingPercentageChanged)
          {
             // Report the sampling rate.
             telemetryClient.TrackMetric("samplingPercentage", newSamplingPercentage);
          }
      });

    // If you have other telemetry processors:
    builder.Use((next) => new AnotherProcessor(next));

    builder.Build();

```

([Learn about telemetry processors](app-insights-api-filtering-sampling.md#filtering).)


<a name="other-web-pages"></a>
## Sampling for web pages with JavaScript

You can configure web pages for fixed-rate sampling from any server. 

When you [configure the web pages for Application Insights](app-insights-javascript.md), modify the snippet that you get from the Application Insights portal. (In ASP.NET apps, the snippet typically goes in _Layout.cshtml.)  Insert a line like `samplingPercentage: 10,` before the instrumentation key:

    <script>
	var appInsights= ... 
	}({ 


    // Value must be 100/N where N is an integer.
    // Valid examples: 50, 25, 20, 10, 5, 1, 0.1, ...
	samplingPercentage: 10, 

	instrumentationKey:...
	}); 
	
	window.appInsights=appInsights; 
	appInsights.trackPageView(); 
	</script> 

For the sampling percentage, choose a percentage that is close to 100/N where N is an integer.  Currently sampling doesn't support other values.

If you also enable fixed-rate sampling at the server, the clients and server will synchronize so that, in Search, you can  navigate between related page views and requests.


## Enabling fixed-rate sampling at the server

1. **Update your project's NuGet packages** to the latest *pre-release* version of Application Insights. Right-click the project in Solution Explorer, choose Manage NuGet Packages, check **Include prerelease** and search for Microsoft.ApplicationInsights.Web. 

2. **Disable adaptive sampling**: In [ApplicationInsights.config](app-insights-configuration-with-applicationinsights-config.md), remove or comment out the `AdaptiveSamplingTelemetryProcessor` node.

    ```xml

    <TelemetryProcessors>
    <!-- Disabled adaptive sampling:
      <Add Type="Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.AdaptiveSamplingTelemetryProcessor, Microsoft.AI.ServerTelemetryChannel">
        <MaxTelemetryItemsPerSecond>5</MaxTelemetryItemsPerSecond>
      </Add>
    -->
    

    ```

2. **Enable the fixed-rate sampling module.** Add this snippet to [ApplicationInsights.config](app-insights-configuration-with-applicationinsights-config.md):

    ```XML

    <TelemetryProcessors>
     <Add  Type="Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.SamplingTelemetryProcessor, Microsoft.AI.ServerTelemetryChannel">

      <!-- Set a percentage close to 100/N where N is an integer. -->
     <!-- E.g. 50 (=100/2), 33.33 (=100/3), 25 (=100/4), 20, 1 (=100/100), 0.1 (=100/1000) -->
      <SamplingPercentage>10</SamplingPercentage>
      </Add>
    </TelemetryProcessors>

    ```

> [AZURE.NOTE] For the sampling percentage, choose a percentage that is close to 100/N where N is an integer.  Currently sampling doesn't support other values.



### Alternative: enable fixed-rate sampling in server code


Instead of setting the sampling parameter in the .config file, you can use code. 

*C#*

```C#

    using Microsoft.ApplicationInsights.Extensibility;
    using Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel;
    ...

    var builder = TelemetryConfiguration.Active.GetTelemetryProcessorChainBuilder();
    builder.UseSampling(10.0); // percentage

    // If you have other telemetry processors:
    builder.Use((next) => new AnotherProcessor(next));

    builder.Build();

```

([Learn about telemetry processors](app-insights-api-filtering-sampling.md#filtering).)

## When  to use sampling?

Adaptive sampling is automatically enabled if you use the ASP.NET SDK version 2.0.0-beta3 or later.

You don’t need sampling for most small and medium size applications. The most useful diagnostic information and most accurate statistics are obtained by collecting data on all of your user activities. 

 
The main advantages of sampling are:

* Application Insights service drops ("throttles") data points when your app sends a very high rate of telemetry in short time interval. 
* To keep within the [quota](app-insights-pricing.md) of data points for your pricing tier. 
* To reduce network traffic from the collection of telemetry. 

### Fixed or adaptive sampling?

Use fixed-rate sampling if:

* You want synchronized sampling between client and server, so that, when you're investigating events in [Search](app-insights-diagnostic-search.md), you can navigate between related events on the client and server, such as page views and http requests.
* You are confident of the appropriate sampling percentage for your app. It should be high enough to get accurate metrics, but below the rate that exceeds your pricing quota and the throttling limits. 
* You aren't debugging your app. When you hit F5 and try a few pages of your app, you probably want to see all the telemetry.

Otherwise, we recommend adaptive sampling. 

## How does sampling work?

From the application standpoint, sampling is a feature of the Application Insights SDK. You specify what percentage of all data points should be sent to Application Insights service. From version 2.0.0 of Application Insights SDK you can control sampling percentage from your code. (Future versions of SDK will additionally allow configuring sampling percentage from the ApplicationInsights.config file.)

The SDK decides which telemetry items to drop, and which ones to keep. The sampling decision is based on several rules that aim to preserve all interrelated data points intact, maintaining a diagnostic experience in Application Insights that is actionable and reliable even with a reduced data set. For example, if for a failed request your app sends additional telemetry items (such as exception and traces logged from this request), sampling will not split this request and other telemetry. It either keeps or drops them all together. As a result, when you look at the request details in Application Insights, you can always see the request along with its associated telemetry items. 

For applications that define "user" (that is, most typical web applications), the sampling decision is based on the hash of the user id, which means that all telemetry for any particular user is either preserved or dropped. For the types of applications that don't define users (such as web services) the sampling decision is based on the operation id of the request. Finally, for the telemetry items that neither have user nor operation id set (for example telemetry items reported from asynchronous threads with no http context) sampling simply captures a percentage of telemetry items of each type. 

When presenting telemetry back to you, the Application Insights service adjusts the metrics by the same sampling percentage that was used at the time of collection, to compensate for the missing data points. Hence, when looking at the telemetry in Application Insights, the users are seeing statistically correct approximations that are very close to the real numbers.

The accuracy of the approximation largely depends on the configured sampling percentage. Also, the accuracy increases for applications that handle a large volume of generally similar requests from lots of users. On the other hand, for applications that don't work with a significant load, sampling is not needed as these applications can usually send all of their telemetry while staying within the quota, without causing data loss from throttling. 

Note that Application Insights does not sample Metrics and Sessions telemetry types, since for these types reduction in the precision can be highly undesirable. 

### Adaptive sampling

Adaptive sampling adds a component that monitors the current rate of transmission from the SDK, and adjusts the sampling percentage to try to stay within the target maximum rate. The adjustment is recalculated at regular intervals, and is based on a moving average of the outgoing transmission rate.

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

 * Yes, adaptive sampling gradually changes the sampling percentage, based on the currently observed volume of the telemetry.

*Can I find out the sampling rate that adaptive sampling is using?*

 * Yes - use the code method of configuring adaptive sampling, and you can provide a callback that gets the sampling rate.

*If I use fixed-rate sampling, how do I know which sampling percentage will work the best for my app?*

* One way is to start with adaptive sampling, find out what rate it settles on (see the above question), and then switch to fixed-rate sampling using that rate. 

    Otherwise, you have to guess. Analyze your current telemetry usage in AI, observe any throttling that is occurring, and estimate the volume of the collected telemetry. These three inputs, together with your selected pricing tier, will suggest how much you might want to reduce the volume of the collected telemetry. However, an increase in the number of your users or some other shift in the volume of telemetry might invalidate your estimate.

*What happens if I configure sampling percentage too low?*

* Excessively low sampling percentage (over-aggressive sampling) will reduce the accuracy of the approximations, when Application Insights attempts to compensate the visualization of the data for the data volume reduction. Also, diagnostic experience might be negatively impacted, as some of the infrequently failing or slow requests may be sampled out.

*What happens if I configure sampling percentage too high?*

* Configuring too high sampling percentage (not aggressive enough) will result in an insufficient reduction in the volume of the collected telemetry. You may still experience telemetry data loss related to throttling, and the cost of using Application Insights might be higher than you planned due to overage charges.

*On what platforms can I use sampling?*

* Currently, adaptive sampling is available for the server sides of ASP.NET web apps (hosted either in Azure or on your own server). Fixed-rate sampling is available for any web pages, and for both client and server sides of .NET web applications.

*There are certain rare events I always want to see. How can I get them past the sampling module?*

 * Initialize a separate instance of TelemetryClient with a new TelemetryConfiguration (not the default Active one). Use that to send your rare events.
