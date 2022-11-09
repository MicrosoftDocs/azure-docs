---
title: Application Insights for console applications | Microsoft Docs
description: Monitor web applications for availability, performance, and usage.
ms.topic: conceptual
ms.date: 05/21/2020
ms.devlang: csharp
ms.custom: devx-track-csharp
ms.reviewer: casocha
---

# Application Insights for .NET console applications

[Application Insights](./app-insights-overview.md) lets you monitor your web application for availability, performance, and usage.

You need an [Azure](https://azure.com) subscription. Sign in with a Microsoft account, which you might have for Windows, Xbox Live, or other Microsoft cloud services. Your team might have an organizational subscription to Azure. Ask the owner to add you to it by using your Microsoft account.

> [!NOTE]
> We recommend using the newer [Microsoft.ApplicationInsights.WorkerService](https://www.nuget.org/packages/Microsoft.ApplicationInsights.WorkerService) package and associated instructions from [Application Insights for Worker Service applications (non-HTTP applications)](./worker-service.md) for any console applications. This package is compatible with [Long Term Support (LTS) versions](https://dotnet.microsoft.com/platform/support/policy/dotnet-core) of .NET Core and .NET Framework or higher.

[!INCLUDE [azure-monitor-log-analytics-rebrand](../../../includes/azure-monitor-instrumentation-key-deprecation.md)]

## Get started

* In the [Azure portal](https://portal.azure.com), [create an Application Insights resource](./create-new-resource.md).
* Take a copy of the connection string. Find the connection string in the **Essentials** dropdown of the new resource you created.
* Install the latest [Microsoft.ApplicationInsights](https://www.nuget.org/packages/Microsoft.ApplicationInsights) package.
* Set the connection string in your code before you track any telemetry (or set the `APPLICATIONINSIGHTS_CONNECTION_STRING` environment variable). After that, you should be able to manually track telemetry and see it in the Azure portal.
    
    ```csharp
    // You may use different options to create configuration as shown later in this article
    TelemetryConfiguration configuration = TelemetryConfiguration.CreateDefault();
    configuration.ConnectionString = <Copy connection string from Application Insights Resource Overview>;
    var telemetryClient = new TelemetryClient(configuration);
    telemetryClient.TrackTrace("Hello World!");
    ```
    
    > [!NOTE]
    > Telemetry isn't sent instantly. Items are batched and sent by the ApplicationInsights SDK. Console apps exit after calling `Track()` methods.
    >
    > Telemetry might not be sent unless `Flush()` and `Sleep`/`Delay` are done before the app exits, as shown in the [full example](#full-example) later in this article. `Sleep` isn't required if you're using `InMemoryChannel`.

* Install the latest version of the [Microsoft.ApplicationInsights.DependencyCollector](https://www.nuget.org/packages/Microsoft.ApplicationInsights.DependencyCollector) package. It automatically tracks HTTP, SQL, or some other external dependency calls.

You can initialize and configure Application Insights from the code or by using `ApplicationInsights.config` file. Make sure initialization happens as early as possible.

> [!NOTE]
> *ApplicationInsights.config* isn't supported by .NET Core applications.

### Use the config file

For .NET Framework-based applications, by default, the Application Insights SDK looks for the `ApplicationInsights.config` file in the working directory when `TelemetryConfiguration` is being created. Reading the config file isn't supported on .NET Core.

```csharp
TelemetryConfiguration config = TelemetryConfiguration.Active; // Reads ApplicationInsights.config file if present
```

You can also specify a path to the config file:

```csharp
using System.IO;
TelemetryConfiguration configuration = TelemetryConfiguration.CreateFromConfiguration(File.ReadAllText("C:\\ApplicationInsights.config"));
var telemetryClient = new TelemetryClient(configuration);
```

For more information, see [Configuration file reference](configuration-with-applicationinsights-config.md).

You can get a full example of the config file by installing the latest version of the [Microsoft.ApplicationInsights.WindowsServer](https://www.nuget.org/packages/Microsoft.ApplicationInsights.WindowsServer) package. Here's the *minimal* configuration for dependency collection that's equivalent to the code example:

```xml
<?xml version="1.0" encoding="utf-8"?>
<ApplicationInsights xmlns="http://schemas.microsoft.com/ApplicationInsights/2013/Settings">
  <ConnectionString>"Copy connection string from Application Insights Resource Overview"</ConnectionString>
  <TelemetryInitializers>
    <Add Type="Microsoft.ApplicationInsights.DependencyCollector.HttpDependenciesParsingTelemetryInitializer, Microsoft.AI.DependencyCollector"/>
  </TelemetryInitializers>
  <TelemetryModules>
    <Add Type="Microsoft.ApplicationInsights.DependencyCollector.DependencyTrackingTelemetryModule, Microsoft.AI.DependencyCollector">
      <ExcludeComponentCorrelationHttpHeadersOnDomains>
        <Add>core.windows.net</Add>
        <Add>core.chinacloudapi.cn</Add>
        <Add>core.cloudapi.de</Add>
        <Add>core.usgovcloudapi.net</Add>
        <Add>localhost</Add>
        <Add>127.0.0.1</Add>
      </ExcludeComponentCorrelationHttpHeadersOnDomains>
      <IncludeDiagnosticSourceActivities>
        <Add>Microsoft.Azure.ServiceBus</Add>
        <Add>Microsoft.Azure.EventHubs</Add>
      </IncludeDiagnosticSourceActivities>
    </Add>
  </TelemetryModules>
  <TelemetryChannel Type="Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.ServerTelemetryChannel, Microsoft.AI.ServerTelemetryChannel"/>
</ApplicationInsights>

```

### Configure telemetry collection from code

> [!NOTE]
> Reading the config file isn't supported on .NET Core.

* During application startup, create and configure a `DependencyTrackingTelemetryModule` instance. It must be singleton and must be preserved for the application lifetime.

    ```csharp
    var module = new DependencyTrackingTelemetryModule();
    
    // prevent Correlation Id to be sent to certain endpoints. You may add other domains as needed.
    module.ExcludeComponentCorrelationHttpHeadersOnDomains.Add("core.windows.net");
    //...
    
    // enable known dependency tracking, note that in future versions, we will extend this list. 
    // please check default settings in https://github.com/Microsoft/ApplicationInsights-dotnet-server/blob/develop/Src/DependencyCollector/DependencyCollector/ApplicationInsights.config.install.xdt
    
    module.IncludeDiagnosticSourceActivities.Add("Microsoft.Azure.ServiceBus");
    module.IncludeDiagnosticSourceActivities.Add("Microsoft.Azure.EventHubs");
    //....
    
    // initialize the module
    module.Initialize(configuration);
    ```

* Add common telemetry initializers:

    ```csharp
    // ensures proper DependencyTelemetry.Type is set for Azure RESTful API calls
    configuration.TelemetryInitializers.Add(new HttpDependenciesParsingTelemetryInitializer());
    ```
    
    If you created configuration with a plain `TelemetryConfiguration()` constructor, you need to enable correlation support additionally. *It isn't needed* if you read configuration from a file or used `TelemetryConfiguration.CreateDefault()` or `TelemetryConfiguration.Active`.
    
    ```csharp
    configuration.TelemetryInitializers.Add(new OperationCorrelationTelemetryInitializer());
    ```

* You might also want to install and initialize the Performance Counter collector module as described at [this website](https://apmtips.com/posts/2017-02-13-enable-application-insights-live-metrics-from-code/).

#### Full example

```csharp
using Microsoft.ApplicationInsights;
using Microsoft.ApplicationInsights.DependencyCollector;
using Microsoft.ApplicationInsights.Extensibility;
using System.Net.Http;
using System.Threading.Tasks;

namespace ConsoleApp
{
    class Program
    {
        static void Main(string[] args)
        {
            TelemetryConfiguration configuration = TelemetryConfiguration.CreateDefault();

            configuration.ConnectionString = "removed";
            configuration.TelemetryInitializers.Add(new HttpDependenciesParsingTelemetryInitializer());

            var telemetryClient = new TelemetryClient(configuration);
            using (InitializeDependencyTracking(configuration))
            {
                // run app...

                telemetryClient.TrackTrace("Hello World!");

                using (var httpClient = new HttpClient())
                {
                    // Http dependency is automatically tracked!
                    httpClient.GetAsync("https://microsoft.com").Wait();
                }

            }

            // before exit, flush the remaining data
            telemetryClient.Flush();

            // Console apps should use the WorkerService package.
            // This uses ServerTelemetryChannel which does not have synchronous flushing.
            // For this reason we add a short 5s delay in this sample.
            
            Task.Delay(5000).Wait();

            // If you're using InMemoryChannel, Flush() is synchronous and the short delay is not required.

        }

        static DependencyTrackingTelemetryModule InitializeDependencyTracking(TelemetryConfiguration configuration)
        {
            var module = new DependencyTrackingTelemetryModule();

            // prevent Correlation Id to be sent to certain endpoints. You may add other domains as needed.
            module.ExcludeComponentCorrelationHttpHeadersOnDomains.Add("core.windows.net");
            module.ExcludeComponentCorrelationHttpHeadersOnDomains.Add("core.chinacloudapi.cn");
            module.ExcludeComponentCorrelationHttpHeadersOnDomains.Add("core.cloudapi.de");
            module.ExcludeComponentCorrelationHttpHeadersOnDomains.Add("core.usgovcloudapi.net");
            module.ExcludeComponentCorrelationHttpHeadersOnDomains.Add("localhost");
            module.ExcludeComponentCorrelationHttpHeadersOnDomains.Add("127.0.0.1");

            // enable known dependency tracking, note that in future versions, we will extend this list. 
            // please check default settings in https://github.com/microsoft/ApplicationInsights-dotnet-server/blob/develop/WEB/Src/DependencyCollector/DependencyCollector/ApplicationInsights.config.install.xdt

            module.IncludeDiagnosticSourceActivities.Add("Microsoft.Azure.ServiceBus");
            module.IncludeDiagnosticSourceActivities.Add("Microsoft.Azure.EventHubs");

            // initialize the module
            module.Initialize(configuration);

            return module;
        }
    }
}

```

## Next steps

* [Monitor dependencies](./asp-net-dependencies.md) to see if REST, SQL, or other external resources are slowing you down.
* [Use the API](./api-custom-events-metrics.md) to send your own events and metrics for a more detailed view of your app's performance and usage.
