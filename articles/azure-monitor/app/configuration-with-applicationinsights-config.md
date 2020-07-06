---
title: ApplicationInsights.config reference - Azure | Microsoft Docs
description: Enable or disable data collection modules, and add performance counters and other parameters.
ms.topic: conceptual
ms.date: 05/22/2019

ms.reviewer: olegan
---

# Configuring the Application Insights SDK with ApplicationInsights.config or .xml
The Application Insights .NET SDK consists of a number of NuGet packages. The
[core package](https://www.nuget.org/packages/Microsoft.ApplicationInsights) provides the API for sending telemetry to
the Application Insights. [Additional packages](https://www.nuget.org/packages?q=Microsoft.ApplicationInsights) provide
telemetry *modules* and *initializers* for automatically tracking telemetry from your application and its context. By
adjusting the configuration file, you can enable or disable Telemetry Modules and initializers, and set parameters for
some of them.

The configuration file is named `ApplicationInsights.config` or `ApplicationInsights.xml`, depending on the type of your application. It is automatically added to your project when you [install most versions of the SDK][start]. By default, when using the automated experience from the Visual Studio template projects that support **Add > Application Insights Telemetry**, the ApplicationInsights.config file is created in the project root folder and when complied is copied to the bin folder. It is also added to a web app by [Status Monitor on an IIS server][redfield]. The configuration file is ignored if [extension for Azure website](azure-web-apps.md) or [extension for Azure VM and virtual machine scale set](azure-vm-vmss-apps.md) is used.

There isn't an equivalent file to control the [SDK in a web page][client].

This document describes the sections you see in the configuration file, how they control the components of the SDK, and which NuGet packages load those components.

> [!NOTE]
> ApplicationInsights.config and .xml instructions do not apply to the .NET Core SDK. For configuring .NET Core applications, follow [this](../../azure-monitor/app/asp-net-core.md) guide.

## Telemetry Modules (ASP.NET)
Each Telemetry Module collects a specific type of data and uses the core API to send the data. The modules are installed by different NuGet packages, which also add the required lines to the .config file.

There's a node in the configuration file for each module. To disable a module, delete the node or comment it out.

### Dependency Tracking
[Dependency tracking](../../azure-monitor/app/asp-net-dependencies.md) collects telemetry about calls your app makes to databases and external services and databases. To allow this module to work in an IIS server, you need to [install Status Monitor][redfield].

You can also write your own dependency tracking code using the [TrackDependency API](../../azure-monitor/app/api-custom-events-metrics.md#trackdependency).

* `Microsoft.ApplicationInsights.DependencyCollector.DependencyTrackingTelemetryModule`
* [Microsoft.ApplicationInsights.DependencyCollector](https://www.nuget.org/packages/Microsoft.ApplicationInsights.DependencyCollector) NuGet package.

Dependencies can be auto-collected without modifying your code by using agent-based (codeless) attach. To use it in Azure web apps, enable the [Application Insights extension](azure-web-apps.md). To use it in Azure VM or Azure virtual machine scale set enable the [Application Monitoring extension for VM and virtual machine scale set](azure-vm-vmss-apps.md).

### Performance collector
[Collects system performance counters](../../azure-monitor/app/performance-counters.md) such as CPU, memory, and network load from IIS installations. You can specify which counters to collect, including performance counters you have set up yourself.

* `Microsoft.ApplicationInsights.Extensibility.PerfCounterCollector.PerformanceCollectorModule`
* [Microsoft.ApplicationInsights.PerfCounterCollector](https://www.nuget.org/packages/Microsoft.ApplicationInsights.PerfCounterCollector) NuGet package.

### Application Insights Diagnostics Telemetry
The `DiagnosticsTelemetryModule` reports errors in the Application Insights instrumentation code itself. For example,
if the code cannot access performance counters or if an `ITelemetryInitializer` throws an exception. Trace telemetry
tracked by this module appears in the [Diagnostic Search][diagnostic].

```
* `Microsoft.ApplicationInsights.Extensibility.Implementation.Tracing.DiagnosticsTelemetryModule`
* [Microsoft.ApplicationInsights](https://www.nuget.org/packages/Microsoft.ApplicationInsights) NuGet package. If you only install this package, the ApplicationInsights.config file is not automatically created.
```

### Developer Mode
`DeveloperModeWithDebuggerAttachedTelemetryModule` forces the Application Insights `TelemetryChannel` to send data immediately, one telemetry item at a time, when a debugger is attached to the application process. This reduces the amount of time between the moment when your application tracks telemetry and when it appears on the Application Insights portal. It causes significant overhead in CPU and network bandwidth.

* `Microsoft.ApplicationInsights.WindowsServer.DeveloperModeWithDebuggerAttachedTelemetryModule`
* [Application Insights Windows Server](https://www.nuget.org/packages/Microsoft.ApplicationInsights.WindowsServer/) NuGet package

### Web Request Tracking
Reports the [response time and result code](../../azure-monitor/app/asp-net.md) of HTTP requests.

* `Microsoft.ApplicationInsights.Web.RequestTrackingTelemetryModule`
* [Microsoft.ApplicationInsights.Web](https://www.nuget.org/packages/Microsoft.ApplicationInsights.Web) NuGet package

### Exception tracking
`ExceptionTrackingTelemetryModule` tracks unhandled exceptions in your web app. See [Failures and exceptions][exceptions].

* `Microsoft.ApplicationInsights.Web.ExceptionTrackingTelemetryModule`
* [Microsoft.ApplicationInsights.Web](https://www.nuget.org/packages/Microsoft.ApplicationInsights.Web) NuGet package
* `Microsoft.ApplicationInsights.WindowsServer.UnobservedExceptionTelemetryModule` - tracks unobserved task exceptions
* `Microsoft.ApplicationInsights.WindowsServer.UnhandledExceptionTelemetryModule` - tracks unhandled exceptions for worker roles, windows services, and console applications.
* [Application Insights Windows Server](https://www.nuget.org/packages/Microsoft.ApplicationInsights.WindowsServer/) NuGet package.

### EventSource Tracking
`EventSourceTelemetryModule` allows you to configure EventSource events to be sent to Application Insights as traces. For information on tracking EventSource events, see [Using EventSource Events](../../azure-monitor/app/asp-net-trace-logs.md#use-eventsource-events).

* `Microsoft.ApplicationInsights.EventSourceListener.EventSourceTelemetryModule`
* [Microsoft.ApplicationInsights.EventSourceListener](https://www.nuget.org/packages/Microsoft.ApplicationInsights.EventSourceListener) 

### ETW Event Tracking
`EtwCollectorTelemetryModule` allows you to configure events from ETW providers to be sent to Application Insights as traces. For information on tracking ETW events, see [Using ETW Events](../../azure-monitor/app/asp-net-trace-logs.md#use-etw-events).

* `Microsoft.ApplicationInsights.EtwCollector.EtwCollectorTelemetryModule`
* [Microsoft.ApplicationInsights.EtwCollector](https://www.nuget.org/packages/Microsoft.ApplicationInsights.EtwCollector) 

### Microsoft.ApplicationInsights
The Microsoft.ApplicationInsights package provides the [core API](https://msdn.microsoft.com/library/mt420197.aspx) of the SDK. The other Telemetry Modules use this, and you can also [use it to define your own telemetry](../../azure-monitor/app/api-custom-events-metrics.md).

* No entry in ApplicationInsights.config.
* [Microsoft.ApplicationInsights](https://www.nuget.org/packages/Microsoft.ApplicationInsights) NuGet package. If you just install this NuGet, no .config file is generated.

## Telemetry Channel
The [telemetry channel](telemetry-channels.md) manages buffering and transmission of telemetry to the Application Insights service.

* `Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.ServerTelemetryChannel` is the default channel for web applications. It buffers data in memory, and employs retry mechanisms and local disk storage for more reliable telemetry delivery.
* `Microsoft.ApplicationInsights.InMemoryChannel` is a lightweight telemetry channel, which is used if no other channel is configured. 

## Telemetry Initializers (ASP.NET)
Telemetry Initializers set context properties that are sent along with every item of telemetry.

You can [write your own initializers](../../azure-monitor/app/api-filtering-sampling.md#add-properties) to set context properties.

The standard initializers are all set either by the Web or WindowsServer NuGet packages:

* `AccountIdTelemetryInitializer` sets the AccountId property.
* `AuthenticatedUserIdTelemetryInitializer` sets the AuthenticatedUserId property as set by the JavaScript SDK.
* `AzureRoleEnvironmentTelemetryInitializer` updates the `RoleName` and `RoleInstance` properties of the `Device` context for all telemetry items with information extracted from the Azure runtime environment.
* `BuildInfoConfigComponentVersionTelemetryInitializer` updates the `Version` property of the `Component` context for all telemetry items with the value extracted from the `BuildInfo.config` file produced by MS Build.
* `ClientIpHeaderTelemetryInitializer` updates `Ip` property of the `Location` context of all telemetry items based on the `X-Forwarded-For` HTTP header of the request.
* `DeviceTelemetryInitializer` updates the following properties of the `Device` context for all telemetry items.
  * `Type` is set to "PC"
  * `Id` is set to the domain name of the computer where the web application is running.
  * `OemName` is set to the value extracted from the `Win32_ComputerSystem.Manufacturer` field using WMI.
  * `Model` is set to the value extracted from the `Win32_ComputerSystem.Model` field using WMI.
  * `NetworkType` is set to the value extracted from the `NetworkInterface`.
  * `Language` is set to the name of the `CurrentCulture`.
* `DomainNameRoleInstanceTelemetryInitializer` updates the `RoleInstance` property of the `Device` context for all
  telemetry items with the domain name of the computer where the web application is running.
* `OperationNameTelemetryInitializer` updates the `Name` property of the `RequestTelemetry` and the `Name` property of the `Operation` context of all telemetry items based on the HTTP method, as well as names of ASP.NET MVC controller and action invoked to process the request.
* `OperationIdTelemetryInitializer` or `OperationCorrelationTelemetryInitializer` updates the `Operation.Id` context property of all telemetry items tracked while handling a request with the automatically generated `RequestTelemetry.Id`.
* `SessionTelemetryInitializer` updates the `Id` property of the `Session` context for all telemetry items with value extracted from the `ai_session` cookie generated by the ApplicationInsights JavaScript instrumentation code running in the user's browser.
* `SyntheticTelemetryInitializer` or `SyntheticUserAgentTelemetryInitializer` updates the `User`, `Session`, and `Operation` contexts properties of all telemetry items tracked when handling a request from a synthetic source, such as an availability test or search engine bot. By default, [Metrics Explorer](../../azure-monitor/platform/metrics-charts.md) does not display synthetic telemetry.

    The `<Filters>` set identifying properties of the requests.
* `UserTelemetryInitializer` updates the `Id` and `AcquisitionDate` properties of `User` context for all telemetry items with values extracted from the `ai_user` cookie generated by the Application Insights JavaScript instrumentation code running in the user's browser.
* `WebTestTelemetryInitializer` sets the user ID, session ID, and synthetic source properties for HTTP requests that come from [availability tests](../../azure-monitor/app/monitor-web-app-availability.md).
  The `<Filters>` set identifying properties of the requests.

For .NET applications running in Service Fabric, you can include the `Microsoft.ApplicationInsights.ServiceFabric` NuGet package. This package includes a `FabricTelemetryInitializer`, which adds Service Fabric properties to telemetry items. For more information, see the [GitHub page](https://github.com/Microsoft/ApplicationInsights-ServiceFabric/blob/master/README.md) about the properties added by this NuGet package.

## Telemetry Processors (ASP.NET)
Telemetry Processors can filter and modify each telemetry item just before it is sent from the SDK to the portal.

You can [write your own Telemetry Processors](../../azure-monitor/app/api-filtering-sampling.md#filtering).

#### Adaptive sampling Telemetry Processor (from 2.0.0-beta3)
This is enabled by default. If your app sends a lot of telemetry, this processor removes some of it.

```xml

    <TelemetryProcessors>
      <Add Type="Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.AdaptiveSamplingTelemetryProcessor, Microsoft.AI.ServerTelemetryChannel">
        <MaxTelemetryItemsPerSecond>5</MaxTelemetryItemsPerSecond>
      </Add>
    </TelemetryProcessors>

```

The parameter provides the target that the algorithm tries to achieve. Each instance of the SDK works independently, so if your server is a cluster of several machines, the actual volume of telemetry will be multiplied accordingly.

[Learn more about sampling](../../azure-monitor/app/sampling.md).

#### Fixed-rate sampling Telemetry Processor (from 2.0.0-beta1)
There is also a standard [sampling Telemetry Processor](../../azure-monitor/app/api-filtering-sampling.md) (from 2.0.1):

```XML

    <TelemetryProcessors>
     <Add Type="Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.SamplingTelemetryProcessor, Microsoft.AI.ServerTelemetryChannel">

     <!-- Set a percentage close to 100/N where N is an integer. -->
     <!-- E.g. 50 (=100/2), 33.33 (=100/3), 25 (=100/4), 20, 1 (=100/100), 0.1 (=100/1000) -->
     <SamplingPercentage>10</SamplingPercentage>
     </Add>
   </TelemetryProcessors>

```

## InstrumentationKey
This determines the Application Insights resource in which your data appears. Typically you create a separate resource, with a separate key, for each of your applications.

If you want to set the key dynamically - for example if you want to send results from your application to different resources - you can omit the key from the configuration file, and set it in code instead.

To set the key for all instances of TelemetryClient, including standard Telemetry Modules. Do this in an initialization method, such as global.aspx.cs in an ASP.NET service:

```csharp
using Microsoft.ApplicationInsights.Extensibility;
using Microsoft.ApplicationInsights;

    protected void Application_Start()
    {
        TelemetryConfiguration configuration = TelemetryConfiguration.CreateDefault();
        configuration.InstrumentationKey = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx";
        var telemetryClient = new TelemetryClient(configuration);
   
```

If you just want to send a specific set of events to a different resource, you can set the key for a specific TelemetryClient:

```csharp

    var tc = new TelemetryClient();
    tc.Context.InstrumentationKey = "----- my key ----";
    tc.TrackEvent("myEvent");
    // ...

```

To get a new key, [create a new resource in the Application Insights portal][new].



## ApplicationId Provider

_Available starting in v2.6.0_

The purpose of this provider is to lookup an Application ID based on an Instrumentation Key. The Application ID is included in RequestTelemetry and DependencyTelemetry and used to determine Correlation in the Portal.

This is available by setting `TelemetryConfiguration.ApplicationIdProvider` either in code or in config.

### Interface: IApplicationIdProvider

```csharp
public interface IApplicationIdProvider
{
    bool TryGetApplicationId(string instrumentationKey, out string applicationId);
}
```


We provide two implementations in the [Microsoft.ApplicationInsights](https://www.nuget.org/packages/Microsoft.ApplicationInsights) sdk: `ApplicationInsightsApplicationIdProvider` and `DictionaryApplicationIdProvider`.

### ApplicationInsightsApplicationIdProvider

This is a wrapper around our Profile API. It will throttle requests and cache results.

This provider is added to your config file when you install either [Microsoft.ApplicationInsights.DependencyCollector](https://www.nuget.org/packages/Microsoft.ApplicationInsights.DependencyCollector) or [Microsoft.ApplicationInsights.Web](https://www.nuget.org/packages/Microsoft.ApplicationInsights.Web/)

This class has an optional property `ProfileQueryEndpoint`.
By default this is set to `https://dc.services.visualstudio.com/api/profiles/{0}/appId`.
If you need to configure a proxy for this configuration, we recommend proxying the base address and including "/api/profiles/{0}/appId". Note that '{0}' is substituted at runtime per request with the Instrumentation Key.

#### Example Configuration via ApplicationInsights.config:
```xml
<ApplicationInsights>
    ...
    <ApplicationIdProvider Type="Microsoft.ApplicationInsights.Extensibility.Implementation.ApplicationId.ApplicationInsightsApplicationIdProvider, Microsoft.ApplicationInsights">
        <ProfileQueryEndpoint>https://dc.services.visualstudio.com/api/profiles/{0}/appId</ProfileQueryEndpoint>
    </ApplicationIdProvider>
    ...
</ApplicationInsights>
```

#### Example Configuration via code:
```csharp
TelemetryConfiguration.Active.ApplicationIdProvider = new ApplicationInsightsApplicationIdProvider();
```

### DictionaryApplicationIdProvider

This is a static provider, which will rely on your configured Instrumentation Key / Application ID pairs.

This class has a property `Defined`, which is a Dictionary<string,string> of Instrumentation Key to Application ID pairs.

This class has an optional property `Next` which can be used to configure another provider to use when an Instrumentation Key is requested that does not exist in your configuration.

#### Example Configuration via ApplicationInsights.config:
```xml
<ApplicationInsights>
    ...
    <ApplicationIdProvider Type="Microsoft.ApplicationInsights.Extensibility.Implementation.ApplicationId.DictionaryApplicationIdProvider, Microsoft.ApplicationInsights">
        <Defined>
            <Type key="InstrumentationKey_1" value="ApplicationId_1"/>
            <Type key="InstrumentationKey_2" value="ApplicationId_2"/>
        </Defined>
        <Next Type="Microsoft.ApplicationInsights.Extensibility.Implementation.ApplicationId.ApplicationInsightsApplicationIdProvider, Microsoft.ApplicationInsights" />
    </ApplicationIdProvider>
    ...
</ApplicationInsights>
```

#### Example Configuration via code:
```csharp
TelemetryConfiguration.Active.ApplicationIdProvider = new DictionaryApplicationIdProvider{
 Defined = new Dictionary<string, string>
    {
        {"InstrumentationKey_1", "ApplicationId_1"},
        {"InstrumentationKey_2", "ApplicationId_2"}
    }
};
```




## Next steps
[Learn more about the API][api].

<!--Link references-->

[api]: ../../azure-monitor/app/api-custom-events-metrics.md
[client]: ../../azure-monitor/app/javascript.md
[diagnostic]: ../../azure-monitor/app/diagnostic-search.md
[exceptions]: ../../azure-monitor/app/asp-net-exceptions.md
[netlogs]: ../../azure-monitor/app/asp-net-trace-logs.md
[new]: ../../azure-monitor/app/create-new-resource.md 
[redfield]: ../../azure-monitor/app/monitor-performance-live-website-now.md
[start]: ../../azure-monitor/app/app-insights-overview.md
