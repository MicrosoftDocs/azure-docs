---
title: Azure Application Insights for Console Applications | Microsoft Docs
description: Monitor web applications for availability, performance and usage.
services: application-insights
documentationcenter: .net
author: lmolkova
manager: bfung

ms.assetid: 3b722e47-38bd-4667-9ba4-65b7006c074c
ms.service: application-insights
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.devlang: na
ms.topic: article
ms.date: 03/14/2017
ms.author: lmolkova

---

# Application Insights for Console Applications

Let's go through configuration needed to set up Application Insights with dependency collection for .NET console applications. It's applicable to any .NET Desktop or .NET Core application that does not use ASP.NET or ASP.NET Core.

1. In the [Azure portal](https://portal.azure.com), [create an Application Insights resource](app-insights-create-new-resource.md). For application type, choose ASP.NET app.
2. Take a copy of the Instrumentation Key. Find the key in the Essentials drop-down of the new resource you created. 
3. Install latest [Microsoft.ApplicationInsights](https://www.nuget.org/packages/Microsoft.ApplicationInsights) package
4. Set the instrumentation key in your code before tracking any telemetry or set APPINSIGHTS_INSTRUMENTATIONKEY environment variable:

```C#
    `TelemetryConfiguration.Active.InstrumentationKey = "` *your key* `";` 
```


At this point, you should be able to manually track telemetry and see it on the Azure portal.

```C#
    var client = new TelemetryClient();
    client.TrackTrace("Hello World!");
```

5. Install and configure latest version of [Microsoft.ApplicationInsights.DependecyCollector](https://www.nuget.org/packages/Microsoft.ApplicationInsights.DependencyCollector) package - it automatically tracks HTTP, SQL, or some other external dependency calls.

6 When application starts, create and configure `DependencyTrackingTelemetryModule` instance - it must be singleton and must be preserved for application lifetime.

```C#
    var module = new DependencyTrackingTelemetryModule();
    
    // prevent Correlation Id to be sent to certain endpoints. You may add other domains as needed.
    module.ExcludeComponentCorrelationHttpHeadersOnDomains.Add("core.windows.net");
    //...
    
    // enable known dependency tracking, note that in future versions, we will extend this list. 
    // please check default settings in https://github.com/Microsoft/ApplicationInsights-dotnet-server/blob/develop/Src/DependencyCollector/NuGet/ApplicationInsights.config.install.xdt#L20
    module.IncludeDiagnosticSourceActivities.Add("Microsoft.Azure.ServiceBus");
    module.IncludeDiagnosticSourceActivities.Add("Microsoft.Azure.EventHubs");
    //....
    
    // initialize the module
    module.Initialize(configuration);

    // tun ...
    
    // when application stops or your are done with dependency tracking, do not forget to dispose the module
    dependencyTrackingModule.Dispose();
```

7. Add common telemetry initializers

```C#
    // stamps telemetry with correlation identifiers
    TelemetryConfiguration.Active.TelemetryInitializers.Add(new OperationCorrelationTelemetryInitializer());
    
    // ensures proper DependencyTelemetry.Type is set for Azure RESTful API calls
    TelemetryConfiguration.Active.TelemetryInitializers.Add(new HttpDependenciesParsingTelemetryInitializer());
```

8.  For .NET Framework Windows app, you may also install and initialize Performance Counter collector module as described [here](http://apmtips.com/blog/2017/02/13/enable-application-insights-live-metrics-from-code/)

## Full Example

```C#
    static void Main(string[] args)
    {
        TelemetryConfiguration configuration = TelemetryConfiguration.Active;

        configuration.InstrumentationKey = "removed";
        configuration.TelemetryInitializers.Add(new OperationCorrelationTelemetryInitializer());
        configuration.TelemetryInitializers.Add(new HttpDependenciesParsingTelemetryInitializer());

        var telemetryClient = new TelemetryClient();
        using (IntitializeDependencyTracking(configuration))
        {
            telemetryClient.TrackTrace("Hello World!");

            using (var httpClient = new HttpClient())
            {
                // Http dependency is automatically tracked!
                httpClient.GetAsync("https://microsoft.com").Wait();
            }
        }

        telemetryClient.Flush();
    }

    static DependencyTrackingTelemetryModule IntitializeDependencyTracking(TelemetryConfiguration configuration)
    {
        // prevent Correlation Id to be sent to certain endpoints. You may add other domains as needed.
        module.ExcludeComponentCorrelationHttpHeadersOnDomains.Add("core.windows.net");
        module.ExcludeComponentCorrelationHttpHeadersOnDomains.Add("core.chinacloudapi.cn");
        module.ExcludeComponentCorrelationHttpHeadersOnDomains.Add("core.cloudapi.de");    
        module.ExcludeComponentCorrelationHttpHeadersOnDomains.Add("core.usgovcloudapi.net");
        module.ExcludeComponentCorrelationHttpHeadersOnDomains.Add("localhost");
        module.ExcludeComponentCorrelationHttpHeadersOnDomains.Add("127.0.0.1");

        // enable known dependency tracking, note that in future versions, we will extend this list. 
        // please check default settings in https://github.com/Microsoft/ApplicationInsights-dotnet-server/blob/develop/Src/DependencyCollector/NuGet/ApplicationInsights.config.install.xdt#L20
        module.IncludeDiagnosticSourceActivities.Add("Microsoft.Azure.ServiceBus");    dependencyTrackingModule.Initialize(TelemetryConfiguration.Active);
        module.IncludeDiagnosticSourceActivities.Add("Microsoft.Azure.EventHubs");    

        // initialize the module
        module.Initialize(configuration);

        return module;
    }
```

## Next steps
* [Monitor dependencies](app-insights-asp-net-dependencies.md) to see if REST, SQL, or other external resources are slowing you down.
* [Use the API](app-insights-api-custom-events-metrics.md) to send your own events and metrics for a more detailed view of your app's performance and usage.