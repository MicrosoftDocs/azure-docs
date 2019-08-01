---
title: Telemetry channels in Azure Application Insights | Microsoft Docs
description: How to customize telemetry channels in Azure Application Insights SDKs for .NET and .NET Core.
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
# Telemetry channels in Application Insights

Telemetry channels are an integral part of the [Azure Application Insights SDKs](../../azure-monitor/app/app-insights-overview.md). They manage buffering and transmission of telemetry to the Application Insights service. The .NET and .NET Core versions of the SDKs have two built-in telemetry channels: `InMemoryChannel` and `ServerTelemetryChannel`. This article describes each channel in detail, including how to customize channel behavior.

## What are telemetry channels?

Telemetry channels are responsible for buffering telemetry items and sending them to the Application Insights service, where they're stored for querying and analysis. A telemetry channel is any class that implements the [`Microsoft.ApplicationInsights.ITelemetryChannel`](https://docs.microsoft.com/dotnet/api/microsoft.applicationinsights.channel.itelemetrychannel?view=azure-dotnet) interface.

The `Send(ITelemetry item)` method of a telemetry channel is called after all telemetry initializers and telemetry processors are called. So, any items dropped by a telemetry processor won't reach the channel. `Send()` doesn't typically send the items to the back end instantly. Typically, it buffers them in memory and sends them in batches, for efficient transmission.

[Live Metrics Stream](live-stream.md) also has a custom channel that powers the live streaming of telemetry. This channel is independent of the regular telemetry channel, and this document doesn't apply to it.

## Built-in telemetry channels

The Application Insights .NET and .NET Core SDKs ship with two built-in channels:

* `InMemoryChannel`: A lightweight channel that buffers items in memory until they're sent. Items are buffered in memory and flushed once every 30 seconds, or whenever 500 items are buffered. This channel offers minimal reliability guarantees because it doesn't retry sending telemetry after a failure. This channel also doesn't keep items on disk, so any unsent items are lost permanently upon application shutdown (graceful or not). This channel implements a `Flush()` method that can be used to force-flush any in-memory telemetry items synchronously. This channel is well suited for short-running applications where a synchronous flush is ideal.

    This channel is part of the larger Microsoft.ApplicationInsights NuGet package and is the default channel that the SDK uses when nothing else is configured.

* `ServerTelemetryChannel`: A more advanced channel that has retry policies and the capability to store data on a local disk. This channel retries sending telemetry if transient errors occur. This channel also uses local disk storage to keep items on disk during network outages or high telemetry volumes. Because of these retry mechanisms and local disk storage, this channel is considered more reliable and is recommended for all production scenarios. This channel is the default for [ASP.NET](https://docs.microsoft.com/azure/azure-monitor/app/asp-net) and [ASP.NET Core](https://docs.microsoft.com/azure/azure-monitor/app/asp-net-core) applications that are configured according to the official documentation. This channel is optimized for server scenarios with long-running processes. The [`Flush()`](#which-channel-should-i-use) method that's implemented by this channel isn't synchronous.

    This channel is shipped as the Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel NuGet package and is acquired automatically when you use either the  Microsoft.ApplicationInsights.Web or Microsoft.ApplicationInsights.AspNetCore NuGet package.

## Configure a telemetry channel

You configure a telemetry channel by setting it to the active telemetry configuration. For ASP.NET applications, configuration involves setting the telemetry channel instance to `TelemetryConfiguration.Active`, or by modifying `ApplicationInsights.config`. For ASP.NET Core applications, configuration involves adding the channel to the Dependency Injection Container.

The following sections show examples of configuring the `StorageFolder` setting for the channel in various application types. `StorageFolder` is just one of the configurable settings. For the full list of configuration settings, see [the settings section](telemetry-channels.md#configurable-settings-in-channels) later in this article.

### Configuration by using ApplicationInsights.config for ASP.NET applications

The following section from [ApplicationInsights.config](configuration-with-applicationinsights-config.md) shows the `ServerTelemetryChannel` channel configured with `StorageFolder` set to a custom location:

```xml
    <TelemetrySinks>
        <Add Name="default">
            <TelemetryProcessors>
                <!-- Telemetry processors omitted for brevity  -->
            </TelemetryProcessors>
            <TelemetryChannel Type="Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.ServerTelemetryChannel, Microsoft.AI.ServerTelemetryChannel">
                <StorageFolder>d:\temp\applicationinsights</StorageFolder>
            </TelemetryChannel>
        </Add>
    </TelemetrySinks>
```

### Configuration in code for ASP.NET applications

The following code sets up a 'ServerTelemetryChannel' instance with `StorageFolder` set to a custom location. Add this code at the beginning of the application, typically in `Application_Start()` method in Global.aspx.cs.

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

### Configuration in code for ASP.NET Core applications

Modify the `ConfigureServices` method of the `Startup.cs` class as shown here:

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

> [!IMPORTANT]
> Configuring the channel by using `TelemetryConfiguration.Active` is not recommended for ASP.NET Core applications.

### Configuration in code for .NET/.NET Core console applications

For console apps, the code is the same for both .NET and .NET Core:

```csharp
var serverTelemetryChannel = new ServerTelemetryChannel();
serverTelemetryChannel.StorageFolder = @"d:\temp\applicationinsights";
serverTelemetryChannel.Initialize(TelemetryConfiguration.Active);
TelemetryConfiguration.Active.TelemetryChannel = serverTelemetryChannel;
```

## Operational details of ServerTelemetryChannel

`ServerTelemetryChannel` stores arriving items in an in-memory buffer. The items are serialized, compressed, and stored into a `Transmission` instance once every 30 seconds, or when 500 items have been buffered. A single `Transmission` instance contains up to 500 items and represents a batch of telemetry that's sent over a single HTTPS call to the Application Insights service.

By default, a maximum of 10 `Transmission` instances can be sent in parallel. If telemetry is arriving at faster rates, or if the network or the Application Insights back end is slow, `Transmission` instances are stored in memory. The default capacity of this in-memory `Transmission` buffer is 5 MB. When the in-memory capacity has been exceeded, `Transmission` instances are stored on local disk up to a limit of 50 MB. `Transmission` instances are stored on local disk also when there are network problems. Only those items that are stored on a local disk survive an application crash. They're sent whenever the application starts again.

## Configurable settings in channels

For the full list of configurable settings for each channel, see:

* [InMemoryChannel](https://github.com/microsoft/ApplicationInsights-dotnet/blob/develop/src/Microsoft.ApplicationInsights/Channel/InMemoryChannel.cs)

* [ServerTelemetryChannel](https://github.com/microsoft/ApplicationInsights-dotnet/blob/develop/src/ServerTelemetryChannel/ServerTelemetryChannel.cs)

Here are the most commonly used settings for `ServerTelemetryChannel`:

1. `MaxTransmissionBufferCapacity`: The maximum amount of memory, in bytes, used by the channel to buffer transmissions in memory. When this capacity is reached, new items are stored directly to local disk. The default value is 5 MB. Setting a higher value leads to less disk usage, but remember that items in memory will be lost if the application crashes.

1. `MaxTransmissionSenderCapacity`: The maximum number of `Transmission` instances that will be sent to Application Insights at the same time. The default value is 10. This setting can be configured to a higher number, which is recommended when a huge volume of telemetry is generated. High volume typically occurs during load testing or when sampling is turned off.

1. `StorageFolder`: The folder that's used by the channel to store items to disk as needed. In Windows, either %LOCALAPPDATA% or %TEMP% is used if no other path is specified explicitly. In environments other than Windows, you must specify a valid location or telemetry won't be stored to local disk.

## Which channel should I use?

`ServerTelemetryChannel` is recommended for most production scenarios involving long-running applications. The `Flush()` method implemented by `ServerTelemetryChannel` isn't synchronous, and it also doesn't guarantee sending all pending items from memory or disk. If you use this channel in scenarios where the application is about to shut down, we recommend that you introduce some delay after calling `Flush()`. The exact amount of delay that you might require isn't predictable. It depends on factors like how many items or `Transmission` instances are in memory, how many are on disk, how many are being transmitted to the back end, and whether the channel is in the middle of exponential back-off scenarios.

If you need to do a synchronous flush, we recommend that you use `InMemoryChannel`.

## Frequently asked questions

### Does the Application Insights channel guarantee telemetry delivery? If not, what are the scenarios in which telemetry can be lost?

The short answer is that none of the built-in channels offer a transaction-type guarantee of telemetry delivery to the back end. `ServerTelemetryChannel` is more advanced compared with `InMemoryChannel` for reliable delivery, but it also makes only a best-effort attempt to send telemetry. Telemetry can still be lost in several situations, including these common scenarios:

1. Items in memory are lost when the application crashes.

1. Telemetry is lost during extended periods of network problems. Telemetry is stored to local disk during network outages or when problems occur with the Application Insights back end. However, items older than 24 hours are discarded.

1. The default disk locations for storing telemetry in Windows are %LOCALAPPDATA% or %TEMP%. These locations are typically local to the machine. If the application migrates physically from one location to another, any telemetry stored in the original location is lost.

1. In Web Apps on Windows, the default disk-storage location is D:\local\LocalAppData. This location isn't persisted. It's wiped out in app restarts, scale-outs, and other such operations, leading to loss of any telemetry stored there. You can override the default and specify storage to a persisted location like D:\home. However, such persisted locations are served by remote storage and so can be slow.

### Does ServerTelemetryChannel work on systems other than Windows?

Although the name of its package and namespace includes "WindowsServer," this channel is supported on systems other than Windows, with the following exception. On systems other than Windows, the channel doesn't create a local storage folder by default. You must create a local storage folder and configure the channel to use it. After local storage has been configured, the channel works the same way on all systems.

### Does the SDK create temporary local storage? Is the data encrypted at storage?

The SDK stores telemetry items in local storage during network problems or during throttling. This data isn't encrypted locally.

For Windows systems, the SDK automatically creates a temporary local folder in the %TEMP% or %LOCALAPPDATA% directory, and restricts access to administrators and the current user only.

For systems other than Windows, no local storage is created automatically by the SDK, and so no data is stored locally by default. You can create a storage directory yourself and configure the channel to use it. In this case, you're responsible for ensuring that the directory is secured.
Read more about [data protection and privacy](data-retention-privacy.md#does-the-sdk-create-temporary-local-storage).

## Open-source SDK
Like every SDK for Application Insights, channels are open source. Read and contribute to the code, or report problems, at [the official GitHub repo](https://github.com/Microsoft/ApplicationInsights-dotnet).

## Next steps

* [Sampling](../../azure-monitor/app/sampling.md)
* [SDK Troubleshooting](../../azure-monitor/app/asp-net-troubleshoot-no-data.md)
