---
title: Telemetry channels in Azure Application Insights | Microsoft Docs
description: How to customize telemetry channels in Azure Application Insights SDKs for .NET/.NET Core.
services: application-insights
documentationcenter: .net
author: cijothomas
manager: carmonm
ms.assetid: 015ab744-d514-42c0-8553-8410eef00368
ms.service: application-insights
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.topic: conceptual
ms.date: 05/14/2019
ms.reviewer: mbullwin
ms.author: cithomas
---
# TelemetryChannel in Application Insights

TelemetryChannel is an integral part of [Azure Application Insights SDKs](../../azure-monitor/app/app-insights-overview.md). It manages buffering and transmission of telemetry to the Application Insights service. The .NET and .NET Core versions of the SDKs have two built-in TelemetryChannels - `InMemoryChannel` and `ServerTelemetryChannel`. This article describes each channel in detail, including how users can customize channel behavior.

## What is a TelemetryChannel?

`TelemetryChannel` is responsible for buffering, and sending telemetry items to Application Insights service, where it is stored for querying and analysis. It is any class implementing the interface [`Microsoft.ApplicationInsights.ITelemetryChannel`](https://docs.microsoft.com/dotnet/api/microsoft.applicationinsights.channel.itelemetrychannel?view=azure-dotnet)

The `Send(ITelemetry item)` method of TelemetryChannel is called after all `TelemetryInitializer`s and `TelemetryProcessor`s are called. This means that any items dropped by `TelemetryProcessor` won't reach the channel. `Send()` does not typically send the items instantly to the backend. They are typically buffered in-memory, and sent in batches, for efficient transmission.

[LiveMetrics](live-stream.md) also has a custom channel, which powers the live streaming of telemetry. This channel is independent of the regular telemetry channel, and this document does not apply to the channel used by `LiveMetrics`.

## Built-in TelemetryChannels

Application Insights .NET/.NET Core SDK ships with two built-in channels:

* **InMemoryChannel**
`InMemoryChannel` is a light-weight channel, which buffers items in memory until it's sent. Items are buffered in memory and flushed once every 30 seconds or whenever 500 items have buffered. This channel offers minimal reliability guarantees as it doesn't retry sending telemetry upon failures. This channel doesn't keep items on disk, so any unsent items are lost permanently upon application shutdown (gracefully or not). There's a `Flush()` method implemented by this channel, which can be used to force-flush any in-memory telemetry items synchronously. This is well suited for short-running applications where a synchronous flush is ideal.

    This channel is shipped as part of the `Microsoft.ApplicationInsights` nuget package itself, and is the default channel the SDK uses when nothing else is configured.

* **ServerTelemetryChannel**
`ServerTelemetryChannel` is a more advanced channel, which has retry policies and the capability to store data on local disk. This channel is optimized for server scenarios of long running processes with a relatively high load of telemetry and a stable internet connection. This channel retries sending telemetry, if transient errors occur. This channel also uses local disk storage to keep items on disk during network outages or high telemetry volumes. Because of these retry mechanisms and local disk storage, this channel is considered more reliable, and is recommended for all production scenarios. This channel is the default for [ASP.NET](https://docs.microsoft.com/azure/azure-monitor/app/asp-net) and [ASP.NET Core](https://docs.microsoft.com/azure/azure-monitor/app/asp-net-core) applications, which are configured as per the linked official docs.

    This channel is shipped as the NuGet package `Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel`, and is brought automatically when using either of the NuGet packages `Microsoft.ApplicationInsights.Web` or `Microsoft.ApplicationInsights.AspNetCore`.

## Configuring TelemetryChannel

Telemetry Channel can be configured by setting the desired `TelemetryChannel` on the active `TelemetryConfiguration`. For Asp.Net applications, configuration involves setting `TelemetryChannel` on `TelemetryConfiguration.Active`, or modifying `ApplicationInsights.config`. For ASP.NET Core applications, configuration involves adding the desired channel to the Dependency Injection Container.

Following shows an example where user is configuring the `StorageFolder` for the channel. `StorageFolder` is just one of the configurable settings. The full list of configuration settings is described [in the settings section](telemetry-channels.md#configurable-settings-in-channel).

## Configuration using ApplicationInsights.Config for ASP.NET Applications

The following section from [ApplicationInsights.config](configuration-with-applicationinsights-config.md) shows ServerTelemetryChannel configured with `StorageFolder` set to a custom location.

```xml
    <TelemetrySinks>
        <Add Name="default">
            <TelemetryProcessors>
                <!--TelemetryProcessors omitted for brevity  -->
            </TelemetryProcessors>
            <TelemetryChannel Type="Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.ServerTelemetryChannel, Microsoft.AI.ServerTelemetryChannel">
                <StorageFolder>d:\temp\applicationinsights</StorageFolder>
            </TelemetryChannel>
        </Add>
    </TelemetrySinks>
```

## Configuration in code for ASP.NET Applications

The following code sets up ServerTelemetryChannel with `StorageFolder` set to a custom location. This code should be added at the beginning of the application, typically in Application_Start() method in `Global.aspx.cs`

```csharp
using Microsoft.ApplicationInsights.Extensibility;
using Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel;
protected void Application_Start()
{
    var serverTelemetryChannel = new ServerTelemetryChannel();
    serverTelemetryChannel.StorageFolder = @"d:\temp\applicationinsights";
    serverTelemetryChannel.Initialize(TelemetryConfiguration.Active);
    TelemetryConfiguration.Active.TelemetryChannel = serverTelemetryChannel;
}
```

## Configuration in code for ASP.NET Core Applications

Modify `ConfigureServices` method of `Startup.cs` class as shown below.

```csharp
using Microsoft.ApplicationInsights.Channel;
using Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel;

public void ConfigureServices(IServiceCollection services)
{
    // This sets up ServerTelemetryChannel with StorageFolder set to a custom location.
    services.AddSingleton(typeof(ITelemetryChannel), new ServerTelemetryChannel() {StorageFolder = @"d:\temp\applicationinsights" });

    services.AddApplicationInsightsTelemetry();
}

```

> [!NOTE]
> It is important to note that configuring the channel using `TelemetryConfiguration.Active` is not recommended for ASP.NET Core applications.

## Configuring TelemetryChannel in code for .NET/.NET Core Console Applications

For Console apps, the code is same for .NET and .NET Core, and is shown below.

```csharp
var serverTelemetryChannel = new ServerTelemetryChannel();
serverTelemetryChannel.StorageFolder = @"d:\temp\applicationinsights";
serverTelemetryChannel.Initialize(TelemetryConfiguration.Active);
TelemetryConfiguration.Active.TelemetryChannel = serverTelemetryChannel;
```

## Operational details of ServerTelemetryChannel

The `ServerTelemetryChannel` buffers arriving items in an in-memory buffer. It is serialized, compressed, and stored into `Transmission` instance once every 30 secs or when 500 items are buffered. A single `Transmission` instance contains up to 500 items, and represents a batch of telemetry being sent over a single https call to the Application Insights service. By default, there can be a maximum of 10 `Transmission`s being sent in parallel. If telemetry is arriving at faster rates or if Network/Application Insights backend is slow, then `Transmission`s get stored into memory. The default capacity of this in-memory Transmission buffer is 5 MB. Once in-memory capacity exceeds, `Transmission`s are stored on local disk for up to 50 MB. `Transmission`s are stored on local disk when there are network issues as well. Only items stored in the local disk survive an application crash, which are sent whenever the application is started again.

## Configurable settings in Channel

The full list of configurable settings for each channel are here:

[InMemoryChannel](https://github.com/microsoft/ApplicationInsights-dotnet/blob/develop/src/Microsoft.ApplicationInsights/Channel/InMemoryChannel.cs)

[ServerTelemetryChannel](https://github.com/microsoft/ApplicationInsights-dotnet/blob/develop/src/ServerTelemetryChannel/ServerTelemetryChannel.cs)

Most commonly used settings for `ServerTelemetryChannel` are listed below:

1. `MaxTransmissionBufferCapacity` - Maximum amount of memory, in bytes, used by the channel to buffer transmissions in memory. Once this capacity is reached, new items will be stored directly to local disk. The default is 5 MB. Setting a higher value leads to lesser disk usage, but it is important to note that items in memory will be lost if application crashes.

2. `MaxTransmissionSenderCapacity` - Maximum amount of `Transmission`s that will be sent to Application Insights at the same time. The default is 10, but it can be configured to a higher number. This is recommended when a huge volume of telemetry is generated, typically when doing load testing and/or when sampling is turned off.

3. `StorageFolder` - The folder used by the channel to store items to disk as needed. In Windows, either %LocalAppData% or %Temp% is used, if nothing is configured explicitly. In Non-Windows environments, user **must** configure a valid location, without which telemetry won't be stored to local disk.

## Which channel should I use?

`ServerTelemetryChannel` is recommended for most production scenarios. `InMemoryChannel` is recommended if there's a need to do synchronous flush as `ServerTelemetryChannel` doesn't offer a synchronous flush, and hence some delay is required after calling `Flush()`, if the application is shutting down.

## Frequently Asked Questions

### *Does ApplicationInsights channel offer guaranteed telemetry delivery or What are the scenarios where telemetry can be lost?*

* Short answer is none of the built-in channels offer transaction type guarantee about telemetry delivery to the backend. While `ServerTelemetryChannel` is more advanced compared to `InMemoryChannel` for reliable telemetry delivery, it also makes a best-effort attempt to send telemetry and telemetry can still be lost in several scenarios. Some of the common scenarios where telemetry is lost include:

1. Items in memory are lost whenever application crashes.
1. Telemetry gets stored to local disk during network outages or issues with the Application Insights backend. However, items older than 24 hours are discarded. So telemetry is lost during extended period of network issues.
1. The default disk locations for storing telemetry in Windows are %LocalAppData% or %Temp%. These locations are typically local to the machine. If the application migrates physically from one location to another, any telemetry stored in this location is lost.
1. In Azure Web Apps (Windows), the default disk location is "D:\local\LocalAppData". This location isn't persisted, and is wiped out in app restarts, scale outs and so on, leading to loss of telemetry stored in those locations. Users can override storage to a persisted location like "D:\home", but these persisted locations are underneath served by remote storage, and can be slow.

### *Does ServerTelemetryChannel work in non-Windows systems?*

* Despite the name of the package/namespace being WindowsServer, this channel is supported in non-Windows systems with the following exception. In non-Windows, the channel doesn't create a local storage folder by default. Users must create a local storage folder and configure the channel to use it. Once local storage is configured, the channel works same in Windows and non-Windows systems.

### *Does the SDK create temporary local storage? Is the data encrypted at storage?*

* SDK stores telemetry items in local storage during network issues or during throttling. This data is not encrypted locally.
For Windows systems, the SDK automatically creates a temporary local folder in TEMP or APPDATA directory, and restricts access to administrators and the current user only.
For Non-Windows, no local storage is created automatically by the SDK, and hence no data is stored locally by default. Users can create a storage directory themselves, and configure the channel to use it. In this case, the user is responsible for ensuring this directory is secured.
Read more about [data protection and privacy](data-retention-privacy.md#does-the-sdk-create-temporary-local-storage).

## Open-source SDK
Like every Application Insights SDKs, channels are also open-source. Read and contribute to the code, or report issues at [the official GitHub repo](https://github.com/Microsoft/ApplicationInsights-dotnet).

## Next Steps

* [Sampling](../../azure-monitor/app/sampling.md)
* [SDK Troubleshooting](../../azure-monitor/app/asp-net-troubleshoot-no-data.md)
