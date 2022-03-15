---
title: Telemetry sampling in Azure Application Insights | Microsoft Docs
description: How to keep the volume of telemetry under control.
ms.topic: conceptual
ms.date: 08/26/2021
ms.reviewer: vitalyg
ms.custom: fasttrack-edit
---

# Sampling in Application Insights

Sampling is a feature in [Azure Application Insights](./app-insights-overview.md). It is the recommended way to reduce telemetry traffic, data costs, and storage costs, while preserving a statistically correct analysis of application data. Sampling also helps you avoid Application Insights throttling your telemetry. The sampling filter selects items that are related, so that you can navigate between items when you are doing diagnostic investigations.

When metric counts are presented in the portal, they are renormalized to take into account sampling. Doing so minimizes any effect on the statistics.

## Brief summary

* There are three different types of sampling: adaptive sampling, fixed-rate sampling, and ingestion sampling.
* Adaptive sampling is enabled by default in all the latest versions of the Application Insights ASP.NET and ASP.NET Core Software Development Kits (SDKs). It is also used by [Azure Functions](../../azure-functions/functions-overview.md).
* Fixed-rate sampling is available in recent versions of the Application Insights SDKs for ASP.NET, ASP.NET Core, Java (both the agent and the SDK), and Python.
* In Java, sampling overrides are available, and are useful when you need to apply different sampling rates to selected dependencies, requests, healthchecks. Use [sampling overrides](./java-standalone-sampling-overrides.md) to tune out some noisy dependencies while for example all important errors are kept at 100%. This is a form of fixed sampling that gives you a fine-grained level of control over your telemetry.
* Ingestion sampling works on the Application Insights service endpoint. It only applies when no other sampling is in effect. If the SDK samples your telemetry, ingestion sampling is disabled.
* For web applications, if you log custom events and need to ensure that a set of events is retained or discarded together, the events must have the same `OperationId` value.
* If you write Analytics queries, you should [take account of sampling](/azure/data-explorer/kusto/query/samples?&pivots=azuremonitor#aggregations). In particular, instead of simply counting records, you should use `summarize sum(itemCount)`.
* Some telemetry types, including performance metrics and custom metrics, are always kept regardless of whether sampling is enabled or not.

The following table summarizes the sampling types available for each SDK and type of application:

| Application Insights SDK | Adaptive sampling supported | Fixed-rate sampling supported | Ingestion sampling supported |
|-|-|-|-|
| ASP.NET | [Yes (on by default)](#configuring-adaptive-sampling-for-aspnet-applications) | [Yes](#configuring-fixed-rate-sampling-for-aspnet-applications) | Only if no other sampling is in effect |
| ASP.NET Core | [Yes (on by default)](#configuring-adaptive-sampling-for-aspnet-core-applications) | [Yes](#configuring-fixed-rate-sampling-for-aspnet-core-applications) | Only if no other sampling is in effect |
| Azure Functions | [Yes (on by default)](#configuring-adaptive-sampling-for-azure-functions) | No | Only if no other sampling is in effect |
| Java | No | [Yes](#configuring-sampling-overrides-and-fixed-rate-sampling-for-java-applications) | Only if no other sampling is in effect |
| Node.JS | No | [Yes](./nodejs.md#sampling) | Only if no other sampling is in effect
| Python | No | [Yes](#configuring-fixed-rate-sampling-for-opencensus-python-applications) | Only if no other sampling is in effect |
| All others | No | No | [Yes](#ingestion-sampling) |

> [!NOTE]
> The information on most of this page applies to the current versions of the Application Insights SDKs. For information on older versions of the SDKs, [see the section below](#older-sdk-versions).

## Types of sampling

There are three different sampling methods:

* **Adaptive sampling** automatically adjusts the volume of telemetry sent from the SDK in your ASP.NET/ASP.NET Core app, and from Azure Functions. This is the default sampling when you use the ASP.NET or ASP.NET Core SDK. Adaptive sampling is currently only available for ASP.NET server-side telemetry, and for Azure Functions.

* **Fixed-rate sampling** reduces the volume of telemetry sent from both your ASP.NET or ASP.NET Core or Java server and from your users' browsers. You set the rate. The client and server will synchronize their sampling so that, in Search, you can navigate between related page views and requests.

* **Ingestion sampling** happens at the Application Insights service endpoint. It discards some of the telemetry that arrives from your app, at a sampling rate that you set. It doesn't reduce telemetry traffic sent from your app, but helps you keep within your monthly quota. The main advantage of ingestion sampling is that you can set the sampling rate without redeploying your app. Ingestion sampling works uniformly for all servers and clients, but it does not apply when any other types of sampling are in operation.

> [!IMPORTANT]
> If adaptive or fixed rate sampling methods are enabled for a telemetry type, ingestion sampling is disabled for that telemetry. However, telemetry types that are excluded from sampling at the SDK level will still be subject to ingestion sampling at the rate set in the portal.

## Adaptive sampling

Adaptive sampling affects the volume of telemetry sent from your web server app to the Application Insights service endpoint.

> [!TIP]
> Adaptive sampling is enabled by default when you use the ASP.NET SDK or the ASP.NET Core SDK, and is also enabled by default for Azure Functions.

The volume is adjusted automatically to keep within a specified maximum rate of traffic, and is controlled via the setting `MaxTelemetryItemsPerSecond`. If the application produces a low amount of telemetry, such as when debugging or due to low usage, items won't be dropped by the sampling processor as long as volume is below `MaxTelemetryItemsPerSecond`. As the volume of telemetry increases, the sampling rate is adjusted so as to achieve the target volume. The adjustment is recalculated at regular intervals, and is based on a moving average of the outgoing transmission rate.

To achieve the target volume, some of the generated telemetry is discarded. But like other types of sampling, the algorithm retains related telemetry items. For example, when you're inspecting the telemetry in Search, you'll be able to find the request related to a particular exception.

Metric counts such as request rate and exception rate are adjusted to compensate for the sampling rate, so that they show approximately correct values in Metric Explorer.

### Configuring adaptive sampling for ASP.NET applications

> [!NOTE]
> This section applies to ASP.NET applications, not to ASP.NET Core applications. [Learn about configuring adaptive sampling for ASP.NET Core applications later in this document.](#configuring-adaptive-sampling-for-aspnet-core-applications)

In [`ApplicationInsights.config`](./configuration-with-applicationinsights-config.md), you can adjust several parameters in the `AdaptiveSamplingTelemetryProcessor` node. The figures shown are the default values:

* `<MaxTelemetryItemsPerSecond>5</MaxTelemetryItemsPerSecond>`
  
    The target rate of [logical operations](./correlation.md#data-model-for-telemetry-correlation) that the adaptive algorithm aims to collect **on each server host**. If your web app runs on many hosts, reduce this value so as to remain within your target rate of traffic at the Application Insights portal.

* `<EvaluationInterval>00:00:15</EvaluationInterval>` 
  
    The interval at which the current rate of telemetry is reevaluated. Evaluation is performed as a moving average. You might want to shorten this interval if your telemetry is liable to sudden bursts.

* `<SamplingPercentageDecreaseTimeout>00:02:00</SamplingPercentageDecreaseTimeout>`
  
    When sampling percentage value changes, how soon after are we allowed to lower the sampling percentage again to capture less data?

* `<SamplingPercentageIncreaseTimeout>00:15:00</SamplingPercentageIncreaseTimeout>`
  
    When sampling percentage value changes, how soon after are we allowed to increase the sampling percentage again to capture more data?

* `<MinSamplingPercentage>0.1</MinSamplingPercentage>`
  
    As sampling percentage varies, what is the minimum value we're allowed to set?

* `<MaxSamplingPercentage>100.0</MaxSamplingPercentage>`
  
    As sampling percentage varies, what is the maximum value we're allowed to set?

* `<MovingAverageRatio>0.25</MovingAverageRatio>` 
  
    In the calculation of the moving average, this specifies the weight that should be assigned to the most recent value. Use a value equal to or less than 1. Smaller values make the algorithm less reactive to sudden changes.

* `<InitialSamplingPercentage>100</InitialSamplingPercentage>`
  
    The amount of telemetry to sample when the app has just started. Don't reduce this value while you're debugging.

* `<ExcludedTypes>Trace;Exception</ExcludedTypes>`
  
    A semi-colon delimited list of types that you do not want to be subject to sampling. Recognized types are: `Dependency`, `Event`, `Exception`, `PageView`, `Request`, `Trace`. All telemetry of the specified types is transmitted; the types that are not specified will be sampled.

* `<IncludedTypes>Request;Dependency</IncludedTypes>`
  
    A semi-colon delimited list of types that you do want to subject to sampling. Recognized types are: `Dependency`, `Event`, `Exception`, `PageView`, `Request`, `Trace`. The specified types will be sampled; all telemetry of the other types will always be transmitted.

**To switch off** adaptive sampling, remove the `AdaptiveSamplingTelemetryProcessor` node(s) from `ApplicationInsights.config`.

#### Alternative: Configure adaptive sampling in code

Instead of setting the sampling parameter in the `.config` file, you can programmatically set these values.

1. Remove all the `AdaptiveSamplingTelemetryProcessor` node(s) from the `.config` file.
2. Use the following snippet to configure adaptive sampling:

    ```csharp
    using Microsoft.ApplicationInsights;
    using Microsoft.ApplicationInsights.Extensibility;
    using Microsoft.ApplicationInsights.WindowsServer.Channel.Implementation;
    using Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel;
    
    // ...

    var builder = TelemetryConfiguration.Active.DefaultTelemetrySink.TelemetryProcessorChainBuilder;
    // For older versions of the Application Insights SDK, use the following line instead:
    // var builder = TelemetryConfiguration.Active.TelemetryProcessorChainBuilder;

    // Enable AdaptiveSampling so as to keep overall telemetry volume to 5 items per second.
    builder.UseAdaptiveSampling(maxTelemetryItemsPerSecond:5);

    // If you have other telemetry processors:
    builder.Use((next) => new AnotherProcessor(next));

    builder.Build();
    ```

    ([Learn about telemetry processors](./api-filtering-sampling.md#filtering).)

You can also adjust the sampling rate for each telemetry type individually, or can even exclude certain types from being sampled at all:

```csharp
// The following configures adaptive sampling with 5 items per second, and also excludes Dependency telemetry from being subjected to sampling.
builder.UseAdaptiveSampling(maxTelemetryItemsPerSecond:5, excludedTypes: "Dependency");
```

### Configuring adaptive sampling for ASP.NET Core applications

There is no `ApplicationInsights.config` for ASP.NET Core applications, so all configuration is done via code.
Adaptive sampling is enabled by default for all ASP.NET Core applications. You can disable or customize the sampling behavior.

#### Turning off adaptive sampling

The default sampling feature can be disabled while adding Application Insights service, in the method `ConfigureServices`, using `ApplicationInsightsServiceOptions` within the `Startup.cs` file:

```csharp
public void ConfigureServices(IServiceCollection services)
{
    // ...

    var aiOptions = new Microsoft.ApplicationInsights.AspNetCore.Extensions.ApplicationInsightsServiceOptions();
    aiOptions.EnableAdaptiveSampling = false;
    services.AddApplicationInsightsTelemetry(aiOptions);

    //...
}
```

The above code will disable adaptive sampling. Follow the steps below to add sampling with more customization options.

#### Configure sampling settings

Use extension methods of `TelemetryProcessorChainBuilder` as shown below to customize sampling behavior.

> [!IMPORTANT]
> If you use this method to configure sampling, please make sure to set the `aiOptions.EnableAdaptiveSampling` property to `false` when calling `AddApplicationInsightsTelemetry()`. After making this change, you then need to follow the instructions in the code block below **exactly** in order to re-enable adaptive sampling with your customizations in place. Failure to do so can result in excess data ingestion. Always test post changing sampling settings, and set an appropriate [daily data cap](pricing.md#set-the-daily-cap) to help control your costs.

```csharp
using Microsoft.ApplicationInsights.Extensibility

public void Configure(IApplicationBuilder app, IHostingEnvironment env, TelemetryConfiguration configuration)
{
    var builder = configuration.DefaultTelemetrySink.TelemetryProcessorChainBuilder;
    // For older versions of the Application Insights SDK, use the following line instead:
    // var builder = configuration.TelemetryProcessorChainBuilder;

    // Using adaptive sampling
    builder.UseAdaptiveSampling(maxTelemetryItemsPerSecond:5);

    // Alternately, the following configures adaptive sampling with 5 items per second, and also excludes DependencyTelemetry from being subject to sampling.
    // builder.UseAdaptiveSampling(maxTelemetryItemsPerSecond:5, excludedTypes: "Dependency");

    // If you have other telemetry processors:
    builder.Use((next) => new AnotherProcessor(next));
    
    builder.Build();

    // ...
}
```

### Configuring adaptive sampling for Azure Functions

Follow instructions from [this page](../../azure-functions/configure-monitoring.md#configure-sampling) to configure adaptive sampling for apps running in Azure Functions.

## Fixed-rate sampling

Fixed-rate sampling reduces the traffic sent from your web server and web browsers. Unlike adaptive sampling, it reduces telemetry at a fixed rate decided by you. Fixed-rate sampling is available for ASP.NET, ASP.NET Core, Java and Python applications.

Like other sampling techniques, this also retains related items. It also synchronizes the client and server sampling so that related items are retained - for example, when you look at a page view in Search, you can find its related server requests. 

In Metrics Explorer, rates such as request and exception counts are multiplied by a factor to compensate for the sampling rate, so that they are approximately correct.

### Configuring fixed-rate sampling for ASP.NET applications

1. **Disable adaptive sampling**: In [`ApplicationInsights.config`](./configuration-with-applicationinsights-config.md), remove or comment out the `AdaptiveSamplingTelemetryProcessor` node.

    ```xml
    <TelemetryProcessors>
        <!-- Disabled adaptive sampling:
        <Add Type="Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.AdaptiveSamplingTelemetryProcessor, Microsoft.AI.ServerTelemetryChannel">
            <MaxTelemetryItemsPerSecond>5</MaxTelemetryItemsPerSecond>
        </Add>
        -->
    ```

2. **Enable the fixed-rate sampling module.** Add this snippet to [`ApplicationInsights.config`](./configuration-with-applicationinsights-config.md):
   
    ```xml
    <TelemetryProcessors>
        <Add Type="Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.SamplingTelemetryProcessor, Microsoft.AI.ServerTelemetryChannel">
            <!-- Set a percentage close to 100/N where N is an integer. -->
            <!-- E.g. 50 (=100/2), 33.33 (=100/3), 25 (=100/4), 20, 1 (=100/100), 0.1 (=100/1000) -->
            <SamplingPercentage>10</SamplingPercentage>
        </Add>
    </TelemetryProcessors>
    ```

      Alternatively, instead of setting the sampling parameter in the `ApplicationInsights.config` file, you can programmatically set these values:

    ```csharp
    using Microsoft.ApplicationInsights.Extensibility;
    using Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel;

    // ...

    var builder = TelemetryConfiguration.Active.DefaultTelemetrySink.TelemetryProcessorChainBuilder;
    // For older versions of the Application Insights SDK, use the following line instead:
    // var builder = TelemetryConfiguration.Active.TelemetryProcessorChainBuilder;

    builder.UseSampling(10.0); // percentage

    // If you have other telemetry processors:
    builder.Use((next) => new AnotherProcessor(next));

    builder.Build();
    ```

    ([Learn about telemetry processors](./api-filtering-sampling.md#filtering).)

### Configuring fixed-rate sampling for ASP.NET Core applications

1. **Disable adaptive sampling**:  Changes can be made in the `ConfigureServices` method, using `ApplicationInsightsServiceOptions`:

    ```csharp
    public void ConfigureServices(IServiceCollection services)
    {
        // ...

        var aiOptions = new Microsoft.ApplicationInsights.AspNetCore.Extensions.ApplicationInsightsServiceOptions();
        aiOptions.EnableAdaptiveSampling = false;
        services.AddApplicationInsightsTelemetry(aiOptions);

        //...
    }
    ```

2. **Enable the fixed-rate sampling module.** Changes can be made in the `Configure` method as shown in the below snippet:

    ```csharp
    public void Configure(IApplicationBuilder app, IHostingEnvironment env)
    {
        var configuration = app.ApplicationServices.GetService<TelemetryConfiguration>();

        var builder = configuration.DefaultTelemetrySink.TelemetryProcessorChainBuilder;
        // For older versions of the Application Insights SDK, use the following line instead:
        // var builder = configuration.TelemetryProcessorChainBuilder;

        // Using fixed rate sampling
        double fixedSamplingPercentage = 10;
        builder.UseSampling(fixedSamplingPercentage);

        builder.Build();

        // ...
    }
    ```

### Configuring sampling overrides and fixed-rate sampling for Java applications

By default no sampling is enabled in the Java auto-instrumentation and SDK. Currently the Java auto-instrumentation, [sampling overrides](./java-standalone-sampling-overrides.md) and fixed rate sampling are supported. Adaptive sampling is not supported in Java.

#### Configuring Java auto-instrumentation

* To configure sampling overrides that override the defaulr sampling rate and apply different sampling rates to selected requests and dependencies, use the [sampling override guide](./java-standalone-sampling-overrides.md#getting-started).
* To configure fixed-rate samping that applies to all of your telemetry, use the [fixed rate sampling guide](./java-standalone-config.md#sampling).

#### Configuring Java 2.x SDK

1. Download and configure your web application with the latest [Application Insights Java SDK](./java-2x-get-started.md).

2. **Enable the fixed-rate sampling module** by adding the following snippet to `ApplicationInsights.xml` file:

    ```xml
    <TelemetryProcessors>
        <BuiltInProcessors>
            <Processor type="FixedRateSamplingTelemetryProcessor">
                <!-- Set a percentage close to 100/N where N is an integer. -->
                <!-- E.g. 50 (=100/2), 33.33 (=100/3), 25 (=100/4), 20, 1 (=100/100), 0.1 (=100/1000) -->
                <Add name="SamplingPercentage" value="50" />
            </Processor>
        </BuiltInProcessors>
    </TelemetryProcessors>
    ```

3. You can include or exclude specific types of telemetry from sampling using the following tags inside the `Processor` tag's `FixedRateSamplingTelemetryProcessor`:
   
    ```xml
    <ExcludedTypes>
        <ExcludedType>Request</ExcludedType>
    </ExcludedTypes>

    <IncludedTypes>
        <IncludedType>Exception</IncludedType>
    </IncludedTypes>
    ```

The telemetry types that can be included or excluded from sampling are: `Dependency`, `Event`, `Exception`, `PageView`, `Request`, and `Trace`.

> [!NOTE]
> For the sampling percentage, choose a percentage that is close to 100/N where N is an integer.  Currently sampling doesn't support other values.

### Configuring fixed-rate sampling for OpenCensus Python applications

Instrument your application with the latest [OpenCensus Azure Monitor exporters](./opencensus-python.md).

> [!NOTE]
> Fixed-rate sampling is not available for the metrics exporter. This means custom metrics are the only types of telemetry where sampling can NOT be configured. The metrics exporter will send all telemetry that it tracks.

#### Fixed-rate sampling for tracing ####
You may specify a `sampler` as part of your `Tracer` configuration. If no explicit sampler is provided, the `ProbabilitySampler` will be used by default. The `ProbabilitySampler` would use a rate of 1/10000 by default, meaning one out of every 10000 requests will be sent to Application Insights. If you want to specify a sampling rate, see below.

To specify the sampling rate, make sure your `Tracer` specifies a sampler with a sampling rate between 0.0 and 1.0 inclusive. A sampling rate of 1.0 represents 100%, meaning all of your requests will be sent as telemetry to Application Insights.

```python
tracer = Tracer(
    exporter=AzureExporter(
        instrumentation_key='00000000-0000-0000-0000-000000000000',
    ),
    sampler=ProbabilitySampler(1.0),
)
```

#### Fixed-rate sampling for logs ####
You can configure fixed-rate sampling for `AzureLogHandler` by modifying the `logging_sampling_rate` optional argument. If no argument is supplied, a sampling rate of 1.0 will be used. A sampling rate of 1.0 represents 100%, meaning all of your requests will be sent as telemetry to Application Insights.

```python
handler = AzureLogHandler(
    instrumentation_key='00000000-0000-0000-0000-000000000000',
    logging_sampling_rate=0.5,
)
```

### Configuring fixed-rate sampling for web pages with JavaScript

JavaScript-based web pages can be configured to use Application Insights. Telemetry is sent from the client application running within the user's browser, and the pages can be hosted from any server.

When you [configure your JavaScript-based web pages for Application Insights](javascript.md), modify the JavaScript snippet that you get from the Application Insights portal.

> [!TIP]
> In ASP.NET apps with JavaScript included, the snippet typically goes in `_Layout.cshtml`.

Insert a line like `samplingPercentage: 10,` before the instrumentation key:

```xml
<script>
    var appInsights = // ... 
    ({ 
      // Value must be 100/N where N is an integer.
      // Valid examples: 50, 25, 20, 10, 5, 1, 0.1, ...
      samplingPercentage: 10, 

      instrumentationKey: ...
    }); 

    window.appInsights = appInsights; 
    appInsights.trackPageView(); 
</script>
```

For the sampling percentage, choose a percentage that is close to 100/N where N is an integer. Currently sampling doesn't support other values.

#### Coordinating server-side and client-side sampling

The client-side JavaScript SDK participates in fixed-rate sampling in conjunction with the server-side SDK. The instrumented pages will only send client-side telemetry from the same user for which the server-side SDK made its decision to include in the sampling. This logic is designed to maintain the integrity of user sessions across client- and server-side applications. As a result, from any particular telemetry item in Application Insights you can find all other telemetry items for this user or session and in Search, you can navigate between related page views and requests.

If your client and server-side telemetry don't show coordinated samples:

* Verify that you enabled sampling both on the server and client.
* Check that you set the same sampling percentage in both the client and server.
* Make sure that the SDK version is 2.0 or above.

## Ingestion sampling

Ingestion sampling operates at the point where the telemetry from your web server, browsers, and devices reaches the Application Insights service endpoint. Although it doesn't reduce the telemetry traffic sent from your app, it does reduce the amount processed and retained (and charged for) by Application Insights.

Use this type of sampling if your app often goes over its monthly quota and you don't have the option of using either of the SDK-based types of sampling. 

Set the sampling rate in the Usage and estimated costs page:

![From the application's Overview blade, click Settings, Quota, Samples, then select a sampling rate, and click Update.](./media/sampling/data-sampling.png)

Like other types of sampling, the algorithm retains related telemetry items. For example, when you're inspecting the telemetry in Search, you'll be able to find the request related to a particular exception. Metric counts such as request rate and exception rate are correctly retained.

Data points that are discarded by sampling are not available in any Application Insights feature such as [Continuous Export](./export-telemetry.md).

Ingestion sampling doesn't operate while adaptive or fixed-rate sampling is in operation. Adaptive sampling is enabled by default when the ASP.NET SDK or the ASP.NET Core SDK is being used, or when Application Insights is enabled in [Azure App Service ](azure-web-apps.md) or by using Status Monitor. When telemetry is received by the Application Insights service endpoint, it examines the telemetry and if the sampling rate is reported to be less than 100% (which indicates that telemetry is being sampled) then the ingestion sampling rate that you set is ignored.

> [!WARNING]
> The value shown on the portal tile indicates the value that you set for ingestion sampling. It doesn't represent the actual sampling rate if any sort of SDK sampling (adaptive or fixed-rate sampling) is in operation.

## When to use sampling

In general, for most small and medium size applications you don't need sampling. The most useful diagnostic information and most accurate statistics are obtained by collecting data on all your user activities. 

The main advantages of sampling are:

* Application Insights service drops ("throttles") data points when your app sends a very high rate of telemetry in a short time interval. Sampling reduces the likelihood that your application will see throttling occur.
* To keep within the [quota](pricing.md) of data points for your pricing tier. 
* To reduce network traffic from the collection of telemetry. 

### Which type of sampling should I use?

**Use ingestion sampling if:**

* You often use your monthly quota of telemetry.
* You're getting too much telemetry from your users' web browsers.
* You're using a version of the SDK that doesn't support sampling - for example ASP.NET versions earlier than 2.

**Use fixed-rate sampling if:**

* You want synchronized sampling between client and server so that, when you're investigating events in [Search](./diagnostic-search.md), you can navigate between related events on the client and server, such as page views and HTTP requests.
* You are confident of the appropriate sampling percentage for your app. It should be high enough to get accurate metrics, but below the rate that exceeds your pricing quota and the throttling limits.

**Use adaptive sampling:**

If the conditions to use the other forms of sampling do not apply, we recommend adaptive sampling. This setting is enabled by default in the ASP.NET/ASP.NET Core SDK. It will not reduce traffic until a certain minimum rate is reached, therefore low-use sites will probably not be sampled at all.

## Knowing whether sampling is in operation

To discover the actual sampling rate no matter where it has been applied, use an [Analytics query](../logs/log-query-overview.md) such as this:

```kusto
union requests,dependencies,pageViews,browserTimings,exceptions,traces
| where timestamp > ago(1d)
| summarize RetainedPercentage = 100/avg(itemCount) by bin(timestamp, 1h), itemType
```

If you see that `RetainedPercentage` for any type is less than 100, then that type of telemetry is being sampled.

> [!IMPORTANT]
> Application Insights does not sample session, metrics (including custom metrics), or performance counter telemetry types in any of the sampling techniques. These types are always excluded from sampling as a reduction in precision can be highly undesirable for these telemetry types.

## How sampling works

The sampling algorithm decides which telemetry items to drop, and which ones to keep. This is true whether sampling is done by the SDK or in the Application Insights service. The sampling decision is based on several rules that aim to preserve all interrelated data points intact, maintaining a diagnostic experience in Application Insights that is actionable and reliable even with a reduced data set. For example, if your app has a failed request included in a sample, the additional telemetry items (such as exception and traces logged for this request) will be retained. Sampling either keeps or drops them all together. As a result, when you look at the request details in Application Insights, you can always see the request along with its associated telemetry items.

The sampling decision is based on the operation ID of the request, which means that all telemetry items belonging to a particular operation is either preserved or dropped. For the telemetry items that do not have an operation ID set (such as telemetry items reported from asynchronous threads with no HTTP context) sampling simply captures a percentage of telemetry items of each type.

When presenting telemetry back to you, the Application Insights service adjusts the metrics by the same sampling percentage that was used at the time of collection, to compensate for the missing data points. Hence, when looking at the telemetry in Application Insights, the users are seeing statistically correct approximations that are very close to the real numbers.

The accuracy of the approximation largely depends on the configured sampling percentage. Also, the accuracy increases for applications that handle a large volume of generally similar requests from lots of users. On the other hand, for applications that don't work with a significant load, sampling is not needed as these applications can usually send all their telemetry while staying within the quota, without causing data loss from throttling. 

## Log query accuracy and high sample rates

         // Our hypothetical application picks up work items from an Azure Queue or an Event 
            // Hub. Work items come in 3 kinds: A, B and C.
            // Every time a telemetry item is processed, we log its kind and its Id. We also 
            // compute and log how long it took to process the work item(duration). In addition, 
            // we log the outcome(result), a detailed status message and whether or not the 
            // processing was successful overall.If the processing fails, we also log the 
            // respective exception and correlate it with the work item via its Id.
            //
            // All this information allows us to do 3 key things:
            //  - Monitor the processing duration for work items and alert if it crosses a 
            //    specified threshold.
            //  - Monitor the number of failed work items and alert if the number of failed 
            //    processing events crosses a specified threshold.
            //  - If any problem is detected, use the detailed logged event and exception 
            //    telemetry to diagnose the issue.
            //
            // As long as the number of processed work items is relatively low, everything is just
            // fine. However, as the application is scaled up, it may be processing dozens, 
            // hundreds, or thousands of work items per second. Logging an event for each of them 
            // is not resource-effective and not cost-effective. Application Insights uses 
            // sampling to adapt to growing telemetry volume in a flexible manner and to control 
            // resource usage and cost. See:
            // https://docs.microsoft.com/en-us/azure/application-insights/app-insights-sampling
            //
            // However, sampling can affect the accuracy of query results gained from sampled 
            // telemetry. For example, assume that 0.01% of all work items actually fail (1 out
            // of 10,000). Also assume that the sampling rate is 1% (1 out of 100 events is 
            // chosen for storage, the other 99 are discarded). Consider a case where 1000 work 
            // items are actually processed per some time period, so 10 are randomly chosen by 
            // the sampling engine. Assume that 1 out of these 10 stored events happens to 
            // represent a work item processing failure. Based on the the sampling rate of 1% 
            // the system will estimate that the number of processing failures is 100 out of the
            // 1000 processed items (10%). This grossly overestimates the true failure rate of 
            // 0.01%. If any alerts based of failure counts were set up they will likely be 
            // triggered and unnecessary investigations will occur.
            // Because the true error rate is 0.01%, this problem will occur rarely, but it will 
            // occur. For similar reasons, it will be impossible to get accurate statistics about 
            // the processing duration grouped by successful vs. failing executions. The 
            // corresponding events will be either missing or be over-represented.
            // 
            // To address these problems introduced by sampling we use a technique called
            // pre-aggregation:
            // We identify properties of the logged data that are most relevant and extract the 
            // respective statistics before sampling occurs. Because metrics are always 
            // aggregated, the resulting aggregate data will be represented by only a few metric 
            // telemetry items per minute, instead of potentially thousands of event telemetry 
            // items. This will avoid resource and cost problems.
            // 
            // We implement a
            //  class PreaggregatedWorkitemProcessingDurationMetricExtractor
            //                  : ITelemetryProcessor, ITelemetryModule
            // that extracts and pre-aggregates relevant metrics from the event telemetry. In 
            // this example, we extract the duration and count of processing events grouped by
            // work item kind and by the success-status.
            // For this to work correctly, it is critical that we install our metrics extractor 
            // into the Application Insights processing pipeline before the sampling processor.
            // For example, in ApplicatioinInsights.config:
            //
            //     ...
            //     <TelemetryProcessors>
            //         ...
            //         < !-- Insert here -->
            //         <Add Type="User.Namespace.Example07.PreaggregatedWorkitemProcessingDurationMetricExtractor, Your.Assembly.Name" />
            //         < !-- Insert BEFORE here -->
            //     
            //         <Add Type="Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.AdaptiveSamplingTelemetryProcessor, Microsoft.AI.ServerTelemetryChannel">
            //             <MaxTelemetryItemsPerSecond>5</ MaxTelemetryItemsPerSecond>
            //             <IncludedTypes>Event</IncludedTypes>
            //        </Add>
            //        ...
            //     </TelemetryProcessors>
            //     ...
            //     
            // See further down in this example to see how to implement the metric extractor.
            // In order to learn more about telemetry processors in Application Insights, see:
            // https://docs.microsoft.com/en-us/azure/application-insights/app-insights-api-filtering-sampling
            
 Teams Content:
show customers why sampling impacts log based queries. How sampling is by operation id, not just random individual records and when sampling rates increase log based queries accuracy is way off, usually inflated

I've been trying to find a way to deliver this message to customers with an example. I pasted my last attempt at that example in the work item, but don't think we should use colors, or if we do different colors to describe which records we sample out compared to which records we keep and set itemCount value to higher values. 
Think we just need to explain that if sampling is turned off the itemCount = 1, Always. 

If sampling starts to occur then itemCount will be greater than 1 and again any Log-based query that uses sum(ItemCount) is just not going to be accurate anymore and the accuracy gets worse as sample rates increase and itemCount gets extreme like 30-60-100+ etc. 

If itemCount = 2 then I think that means sample rates are already 50%, we typically dont' see customers complain about log based, sum(ItemCount), queries until sample rates get into the high 60s-80s percent rate

Work Item content:

Once we land the spot for this content, we need to walk customers through a clear example, show the problem, explain why the numbers are inflated, explain WHY our SDK does it that way so that we can more easily have conversations with these customers to rely on the Pre-aggregated Standard metrics instead when sample rates get high. 

I am going to paste in verbiage that I used for our last customer who faced this which I think is helpful, however not sure if the "tick colors" example is best for public docs or if we could just switch those out for 25x"Rs", 25x"Ds", 25x"Ts", 25x"Es" to represent 25 Requests, Dependencies, Traces, and Exceptions messages. Maybe we just need better images as an example, showing 100 telemetry items with itemCount set to 1, versus only keeping a single record out of the 100 adn setting itemCount to 100.  However we want to pitch the example, I think showing customers 100 telemetry items and walking through the problem of only getting to keep one of those records helps with the discussion. I don't know the best way to word this but we desperately need to get something up there for customers and I think my walkthrough example below is a decent start. 


To help explain this behavior, it helps to walk through a controlled example. Let’s say that my web application generated 100 distinct telemetry records. For this hypothetical scenario let's assume 25 different users made a single request to my web site and each of those requests generated 1 Request telemetry record, 1 Dependency telemetry record, 1 Trace Message telemetry record and 1 Exception telemetry record. If all 25 of those users completed their requests, then we’d have the raw 100 telemetry records in the image below, so 25 Requests in black, 25 Dependencies in blue, 25 traces in green and 25 exceptions in red.

 

Now, let’s make the assumption that the App Insights did NOT need to throttle the telemetry. Your web application wanted to send all 100 records up to our ingestion endpoint. The SDK would package up all of those 100 telemetry records into json payloads and send them up to our ingestion service. Every single one of those 100 telemetry records would get their itemCount field set to 1. That is because we don’t need to drop any records for sampling and each single telemetry record represents a count of 1. With a sample rate of 0% we keep each telemetry record and when you do a sum(itemCount) against the requests telemetry you get 25, which matches the 25 requests and 25% of the 100 telemetry records produced by the web application.

 

 Image


Now that we know how the telemetry behaves without sampling, let’s then talk about what happens during extreme sampling. Let’s say you use Ingestion Sampling or Fixed Rate sampling and decide you are getting too much telemetry and only want to keep 1% of all the records, thus dropping 99% of all of your telemetry. If your sample rate was 99% against our 100 telemetry records above, then that would mean I could only keep a single record out of all 100 items. If I can only keep 1 out of these 100 records, then let’s assume the SDK picks one of the black request telemetry records. It will have to drop all the other 99 records (24 requests, 25 dependencies, 25 traces, 25 exceptions = 99 records). Since we are keeping only one record, dropping 99, then the SDK would naturally set the itemCount field for that single request record to 100, because this single record that is getting ingested represents 100 total telemetry records that executed within the web app.


Image
 

Now, when you go to run your same log-based sum(itemCount) calculation, you are going to see that the telemetry reports your web application processed 100 Requests, when we know that in reality it only processed 25 requests. Thus, this is how extreme sample rates can wildly start to skew log-based query results. There is no possible way for us to keep just keep 1 out of those 100 records and still somehow represent the true real values across the other telemetry types.

 

In practice it’s not this simple, because our App Insights SDK samples based on Operation Id, meaning we’ll identify an operation_Id that we want to keep and then we’ll collect ALL of the telemetry for that single operation and make sure all of those records get ingested and saved. The reason we do this is so that your End-to-End experience is complete. When you review a failing operation in the end-to-end view, we want to allow you to see all of the telemetry for that single failing operation so that you know where in the code it was breaking, and you’ll be able to get the exception details. If we were to drop telemetry items from within each operation too, then that wouldn’t help sum(itemCount) computations nor the e2e investigation experience. Since we sample out by operation id that also means you could see wild fluctuations from day to day if your operations produce different counts of telemetry. Say you had a Single-Page-Application that ran at some kiosk and ran all day for multiple users, it’s possible that a single telemetry operation could have produced 4000 telemetry records for just that operation id alone, and if that’s the operation id selected by the SDK to get ingested, as compared to other operations in your web app that only require 1 to 3 telemetry records, you could randomly see a spike in your adjusted sample rates.

 

This is a hard issue to describe and explain, but it is intentional and only impacts the accuracy of log-based, sum(itemCount), queries when sampling is enabled and starts to get high. I’ve seen some customers detect inaccuracies when sample rates get into the 60% range, but it impacts customers differently based on their telemetry types, telemetry counts per operation, etc.

 

The product team is well aware of this issue, and there just is no good solution so solve the issues with sum(itemCount) log-based queries. So, to help customers, the product team added pre-aggregated metrics to the SDKs, Log-based and pre-aggregated metrics in Azure Application Insights - Azure Monitor | Microsoft Docs. These metrics will calculate the 25 requests above and send a metric to your MDM account reporting “this web app processed 25 requests”, but then it will send that sole request telemetry record with itemCount of 100 from our example above. The pre-aggregated metrics report the correct numbers and customers can find that on the Metrics blade of Application Insights, just search for anything in the Metric Namespace Application Insights Standard Metrics. Those standard metrics will chart correct numbers, the sum(itemCount) log-based queries will not when sampling rates get high.






## Frequently asked questions

*What is the default sampling behavior in the ASP.NET and ASP.NET Core SDKs?*

* If you are using one of the latest versions of the above SDK, Adaptive Sampling is enabled by default with five telemetry items per second.
  There are two `AdaptiveSamplingTelemetryProcessor` nodes added by default, and one includes the `Event` type in sampling, while the other excludes
  the `Event` type from sampling. This configuration means that the SDK will try to limit telemetry items to five telemetry items of `Event` types, and five telemetry items of all other types combined, thereby ensuring that `Events` are sampled separately from other telemetry types. Events are typically used for business telemetry, and most likely should not be affected by diagnostic telemetry volumes.
  
  The following shows the default `ApplicationInsights.config` file generated. In ASP.NET Core, the same default behavior is enabled in code. Use the [examples in the earlier section of this page](#configuring-adaptive-sampling-for-aspnet-core-applications) to change this default behavior.

    ```xml
    <TelemetryProcessors>
        <Add Type="Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.AdaptiveSamplingTelemetryProcessor, Microsoft.AI.ServerTelemetryChannel">
            <MaxTelemetryItemsPerSecond>5</MaxTelemetryItemsPerSecond>
            <ExcludedTypes>Event</ExcludedTypes>
        </Add>
        <Add Type="Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.AdaptiveSamplingTelemetryProcessor, Microsoft.AI.ServerTelemetryChannel">
            <MaxTelemetryItemsPerSecond>5</MaxTelemetryItemsPerSecond>
            <IncludedTypes>Event</IncludedTypes>
        </Add>
    </TelemetryProcessors>
    ```

*Can telemetry be sampled more than once?*

* No. SamplingTelemetryProcessors ignore items from sampling considerations if the item is already sampled. The same is true for ingestion sampling as well, which won't apply sampling to those items already sampled in the SDK itself.

*Why isn't sampling a simple "collect X percent of each telemetry type"?*

* While this sampling approach would provide with a high level of precision in metric approximations, it would break the ability to correlate diagnostic data per user, session, and request, which is critical for diagnostics. Therefore, sampling works better with policies like "collect all telemetry items for X percent of app users", or "collect all telemetry for X percent of app requests". For the telemetry items not associated with the requests (such as background asynchronous processing), the fallback is to "collect X percent of all items for each telemetry type." 

*Can the sampling percentage change over time?*

* Yes, adaptive sampling gradually changes the sampling percentage, based on the currently observed volume of the telemetry.

*If I use fixed-rate sampling, how do I know which sampling percentage will work the best for my app?*

* One way is to start with adaptive sampling, find out what rate it settles on (see the above question), and then switch to fixed-rate sampling using that rate. 
  
    Otherwise, you have to guess. Analyze your current telemetry usage in Application Insights, observe any throttling that is occurring, and estimate the volume of the collected telemetry. These three inputs, together with your selected pricing tier, suggest how much you might want to reduce the volume of the collected telemetry. However, an increase in the number of your users or some other shift in the volume of telemetry might invalidate your estimate.

*What happens if I configure the sampling percentage to be too low?*

* Excessively low sampling percentages cause over-aggressive sampling, and reduce the accuracy of the approximations when Application Insights attempts to compensate the visualization of the data for the data volume reduction. Also your diagnostic experience might be negatively impacted, as some of the infrequently failing or slow requests may be sampled out.

*What happens if I configure the sampling percentage to be too high?*

* Configuring too high a sampling percentage (not aggressive enough) results in an insufficient reduction in the volume of the collected telemetry. You may still experience telemetry data loss related to throttling, and the cost of using Application Insights might be higher than you planned due to overage charges.

*On what platforms can I use sampling?*

* Ingestion sampling can occur automatically for any telemetry above a certain volume, if the SDK is not performing sampling. This configuration would work, for example, if you are using an older version of the ASP.NET SDK or Java SDK.
* If you're using the current ASP.NET or ASP.NET Core SDKs (hosted either in Azure or on your own server), you get adaptive sampling by default, but you can switch to fixed-rate as described above. With fixed-rate sampling, the browser SDK automatically synchronizes to sample related events. 
* If you're using the current Java agent, you can configure `applicationinsights.json` (for Java SDK, configure `ApplicationInsights.xml`) to turn on fixed-rate sampling. Sampling is turned off by default. With fixed-rate sampling, the browser SDK and the server automatically synchronize to sample related events.

*There are certain rare events I always want to see. How can I get them past the sampling module?*

* The best way to achieve this is to write a custom [TelemetryInitializer](./api-filtering-sampling.md#addmodify-properties-itelemetryinitializer), which sets the `SamplingPercentage` to 100 on the telemetry item you want retained, as shown below. As initializers are guaranteed to be run before telemetry processors (including sampling), this ensures that all sampling techniques will ignore this item from any sampling considerations. Custom telemetry initializers are available in the ASP.NET SDK, the ASP.NET Core SDK, the JavaScript SDK, and the Java SDK. For example, you can configure a telemetry initializer using the ASP.NET SDK:

    ```csharp
    public class MyTelemetryInitializer : ITelemetryInitializer
    {
        public void Initialize(ITelemetry telemetry)
        {
            if(somecondition)
            {
                ((ISupportSampling)telemetry).SamplingPercentage = 100;
            }
        }
    }
    ```

## Older SDK versions

Adaptive sampling is available for the Application Insights SDK for ASP.NET v2.0.0-beta3 and later, Microsoft.ApplicationInsights.AspNetCore SDK v2.2.0-beta1 and later, and is enabled by default.

Fixed-rate sampling is a feature of the SDK in ASP.NET versions from 2.0.0 and Java SDK version 2.0.1 and onwards.

Prior to v2.5.0-beta2 of the ASP.NET SDK, and v2.2.0-beta3 of ASP.NET Core SDK, the sampling decision was based on the hash of the user ID for applications that define "user" (that is, most typical web applications). For the types of applications that didn't define users (such as web services) the sampling decision was based on the operation ID of the request. Recent versions of the ASP.NET and ASP.NET Core SDKs use the operation ID for the sampling decision.

## Next steps

* [Filtering](./api-filtering-sampling.md) can provide more strict control of what your SDK sends.
* Read the Developer Network article [Optimize Telemetry with Application Insights](/archive/msdn-magazine/2017/may/devops-optimize-telemetry-with-application-insights).
