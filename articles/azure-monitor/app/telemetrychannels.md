---
title: Telemetry channels in Azure Application Insights | Microsoft Docs
description: How to customize telemetry channel in Azure Application Insights.
services: application-insights
documentationcenter: windows
author: cijothomas
manager: carmonm
ms.assetid: 015ab744-d514-42c0-8553-8410eef00368
ms.service: application-insights
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.topic: conceptual
ms.date: 05/14/2019
ms.reviewer: vitalyg
ms.author: cithomas
---
# TelemetryChannel in Application Insights

TelemetryChannel is an integral part of [Azure Application Insights SDKs](../../azure-monitor/app/app-insights-overview.md). TelemetryChannel is responsible for sending telemetry to Azure Application Insights backend. The .NET and .NET Core versions of the SDKs has two in-built TelemetryChannels - InMemoryChannel and ServerTelemetryChannel. This article describes each channel in detail, including how users can customize channel behavior. This document also describes how one can write a new channel on their own using the extensibility points provided by the SDK.

## What is a TelemetryChannel?

TelemetryChannel is any class implementing the interface Microsoft.ApplicationInsights.ITelemetryChannel. `ITelemetryChannel` is defined as follows.

```csharp
public interface ITelemetryChannel
{
    // For built-in channel, setting developer mode disables buffering, and telemetry is sent as they are received without any batching.
    bool? DeveloperMode { get; set; }

    // The endpoint to which telemetry is sent.
    string EndpointAddress { get; set; }

    void Send(ITelemetry item);
    void Flush();
}
```

Every telemetry item tracked with `TrackXYZ()` api of `TelemetryClient` goes through a series of steps. First all configured `TelemetryInitializer`s are called, followed by `TelemetryProcessors`. TelemetryChannel.Send() is called after all Telemetry Processors in the pipeline are called. This means items, which are dropped by any  TelemetryProcessors will not reach channel. Once items reach `TelemetryChannel`, it is responsible for serializing and sending them to Azure Application Insights service, where it is stored for querying and analysis.

## Built-in TelemetryChannels

Application Insights .NET/.NET Core SDK ships with two built-in channels:

* **InMemoryChannel**
`InMemoryChannel` is a light-weight channel, which buffers items in memory until it is sent. Items are buffered in memory and flushed once every 30 seconds or whenever 500 items have buffered. This channel offers minimal reliability guarantees as it does not retry sending telemetry upon failures. This channel does not keep items in disk, so any unsent items are lost permanently upon application shutdown (gracefully or not). There is a `Flush()` method implemented by this channel, which can be used to force-flush any in-memory telemetry items synchronously.
This channel is shipped as part of the `Microsoft.ApplicationInsights` nuget package itself, and is the default channel SDK uses when nothing else is configured.

* **ServerTelemetryChannel**
`ServerTelemetryChannel` is a more advanced channel, which has retry policies and capability to store data in local disk. This channel retries telemetry sending, if transient errors occur. This channel also uses a local disk storage to keep items in disk to survive application restarts. Due to these retry mechanisms and local disk storage, this channel is considered more reliable, and is recommended for all production scenarios. This channel is the default for [Asp.Net](https://docs.microsoft.com/azure/azure-monitor/app/asp-net) and [Asp.Net Core](https://docs.microsoft.com/azure/azure-monitor/app/asp-net-core) applications, which are configured as per the linked official docs. This channel is shipped as the nuget package `Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel`, and is brought automatically when using either of the nuget packages `Microsoft.ApplicationInsights.Web` or `Microsoft.ApplicationInsights.AspNetCore`.

## Configuring TelemetryChannel

Telemetry Channel can be configured by setting `TelemetryChannel` on the active `TelemetryConfiguration`. For Asp.Net applications, configuration involves setting `TelemetryChannel` on `TelemetryConfiguration.Active`, or modifying `ApplicationInsights.config`. For ASP.NET Core applications, configuration involves adding the channel to the Dependency Injection Container.

Following shows an example where user is configuring the `StorageFolder` for the channel. `StorageFolder` is just one of the configurable settings. The full set of configuration settings are described [here]().

## Configuring TelemetryChannel using ApplicationInsights.Config for ASP.NET Applications

The following section from [ApplicationInsights.config](https://docs.microsoft.com/azure/azure-monitor/app/configuration-with-applicationinsights-config) shows ServerTelemetryChannel configured with `StorageFolder` set to a custom location.

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

## Configuring TelemetryChannel in code for ASP.NET Applications

The following code sets up ServerTelemetryChannel with `StorageFolder` set to a custom location. This code should be added at the beginning of the application, typically in Application_Start() method in `Global.aspx.cs`

```csharp
protected void Application_Start()
{
    var serverTelemetryChannel = new ServerTelemetryChannel();
    serverTelemetryChannel.StorageFolder = @"d:\temp\applicationinsights";
    serverTelemetryChannel.Initialize(TelemetryConfiguration.Active);
    TelemetryConfiguration.Active.TelemetryChannel = serverTelemetryChannel;
}
```

## Configuring TelemetryChannel in code for ASP.NET Core Applications

Modify `ConfigureServices` method of `Startup.cs` class as shown below.

```csharp
  public void ConfigureServices(IServiceCollection services)
    {
        // This setups up ServerTelemetryChannel with StorageFolder set to a custom location.
        services.AddSingleton(typeof(ITelemetryChannel), new ServerTelemetryChannel() {StorageFolder = @"d:\temp\applicationinsights" });

        services.AddApplicationInsightsTelemetry();
    }

```

> [!NOTE]
> It is important to note that configuring channel using `TelemetryConfiguration.Active` is not recommended for ASP.NET Core applications.

## Configuring TelemetryChannel in code for .NET/.NET Core Console Applications

For Console apps, the code is same for .NET and .NET Core, and is shown below.

```csharp
var serverTelemetryChannel = new ServerTelemetryChannel();
serverTelemetryChannel.StorageFolder = @"d:\temp\applicationinsights";
serverTelemetryChannel.Initialize(TelemetryConfiguration.Active);
TelemetryConfiguration.Active.TelemetryChannel = serverTelemetryChannel;
```

## Working of ServerTelemetryChannel

The `ServerTelemetryChannel` works as follows. Arriving items are stored in an in-memory buffer. It is serialized, compressed, and stored into `Transmission` instance once every 30 secs or when 500 items are buffered. A single `Transmission` instance contains up to 500 items, and represents a batch of telemetry being sent over a single http call to the Application Insights service. By default, there can be up to 10 `Transmission`s being sent in parallel. If telemetry is arriving at faster rates or if Network/Application Insights backend is slow, then `Transmission`s get stored into memory. The default capacity of this in-memory Transmission buffer is 5 MB. Once in-memory capacity exceeds, `Transmission`s are stored into local disk for up to 50 MB. `Transmission`s are stored into local disk when there are network issues as well. Only items stored in the local disk survives an application crash, and they are sent whenever application is started again.

## Configurable settings in Channel

Please refer to the following links to learn about the full list of settings available in both in-built channels.
https://github.com/microsoft/ApplicationInsights-dotnet/blob/develop/src/Microsoft.ApplicationInsights/Channel/InMemoryChannel.cs
https://github.com/microsoft/ApplicationInsights-dotnet/blob/develop/src/ServerTelemetryChannel/ServerTelemetryChannel.cs

Most commonly used settings for `ServerTelemetryChannel` are listed below:

1. MaxTransmissionBufferCapacity - Maximum amount of memory, in bytes, used by the channel to buffer transmissions in memory. Once this capacity is reached, new items will be stored directly into local disk. The default is 5 MB. Setting higher value leads to lesser disk usage, but it is important to note that items in memory is lost if application crashes.

2. MaxTransmissionSenderCapacity - Maximum amount of `Transmission`s that will be sent to Application Insights at the same time. The default is 10, but can be configured to a higher number. This is recommended when huge volume of telemetry is generated, typically when doing load testing and/or when sampling is turned off.

3. StorageFolder - The folder used by the channel to stored items in disk as needed. In Windows, either %LocalAppData% or %Temp% is used. In Non-Windows, user **must** configure a valid location, without which telemetry will not be stored in local disk.

## Which channel should I use?

ServerTelemetryChannel is recommended for most production scenarios. InMemoryChannel is recommended if there is a need to do synchronous flush as ServerTelemetryChannel does not offer a synchronous flush, and hence some sleep is required after calling `Flush()`, if the application is shutting down.

## Frequently Asked Questions

*Does ApplicationInsights in-built channel offer guaranteed telemetry delivery or What are the scenarios where telemetry can be lost and what can I do about it?*

* Short answer is none of the built-in channels offers transaction type guarantee about telemetry delivery to the backend. While ServerTelemetryChannel is way advanced than InMemoryChannel in terms of reliable telemetry delivery, it also makes a best-effort attempt to send telemetry and telemetry can still be lost in several scenarios as explained below:

1. Items in memory are lost whenever application is crashed.
1. Telemetry get stored in local disk during network outage or issues with Application Insights backend. However, items older than 24 hours are discarded. So telemetry is lost during extended period of network issues.
1. The default disk locations for storing telemetry in Windows are %LocalAppData% or %Temp%. These locations are typically local to the machine. If the application migrates physically from one location to another, any telemetry stored in these location is lost.
1. In Azure Web Apps (Windows), the default disk location is "D:\local\LocalAppData". This location is not persisted, and is wiped out in app restarts, leading to loss of telemetry stored in those locations. Users can override storage to a persisted location like "D:\home", but these persisted locations are underneath served by remote storage, and can be slow.

*Does ServerTelemetryChannel works in non-windows systems?*

* Despite the name of the package/namespace being WindowsServer, this channel is supported in non-windows system with the following exception. In non-windows, channel does not create a local storage folder by default. Users must create a local storage folder and configure channel to use it. Once a local storage is configured, channel works same in windows and non-windows systems.'

## Open-source SDK
As any of the Application Insights SDK, channels are also open-source. Read and contribute to the code, or report issues [here](https://github.com/Microsoft/ApplicationInsights-dotnet).

## Next steps

* [Filtering](../../azure-monitor/app/api-filtering-sampling.md) can provide more strict control of what your SDK sends.