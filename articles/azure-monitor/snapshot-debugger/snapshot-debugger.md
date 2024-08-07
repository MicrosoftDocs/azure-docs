---
title: Debug exceptions in .NET applications using Snapshot Debugger
description: Use Snapshot Debugger to automatically collect snapshots and debug exceptions in .NET apps.
ms.author: hannahhunter
author: hhunter-ms
ms.reviewer: charles.weininger
reviewer: cweining
ms.topic: conceptual
ms.custom: devx-track-dotnet, devdivchpfy22, engagement
ms.date: 08/06/2024
---

# Debug exceptions in .NET applications using Snapshot Debugger

When enabled, Snapshot Debugger automatically collects a debug snapshot of the source code and variables when an exception occurs in your live .NET application. The Snapshot Debugger in [Application Insights](../app/app-insights-overview.md):

- Monitors system-generated logs from your web app.
- Collects snapshots on your top-throwing exceptions.
- Provides information you need to diagnose issues in production.

[Learn more about the Snapshot Debugger and Snapshot Uploader processes.](#how-snapshot-debugger-works)

## Supported applications and environments

This section lists the applications and environments that are [supported](../app/).

### Applications

Snapshot collection is available for:

- .NET Framework 4.6.2 and newer versions.
- [.NET 6.0 or later](https://dotnet.microsoft.com/download) on Windows.

### Environments

The following environments are supported:

- [Azure App Service](snapshot-debugger-app-service.md?toc=/azure/azure-monitor/toc.json)
- [Azure Functions](snapshot-debugger-function-app.md?toc=/azure/azure-monitor/toc.json)
- [Azure Cloud Services](snapshot-debugger-vm.md?toc=/azure/azure-monitor/toc.json) running OS family 4 or later
- [Azure Service Fabric](snapshot-debugger-vm.md?toc=/azure/azure-monitor/toc.json) running on Windows Server 2012 R2 or later
- [Azure Virtual Machines and Azure Virtual Machine Scale Sets](snapshot-debugger-vm.md?toc=/azure/azure-monitor/toc.json) running Windows Server 2012 R2 or later
- [On-premises virtual or physical machines](snapshot-debugger-vm.md?toc=/azure/azure-monitor/toc.json) running Windows Server 2012 R2 or later or Windows 8.1 or later

> [!NOTE]
> Client applications (for example, WPF, Windows Forms, or UWP) aren't supported.

## Prerequisites for using Snapshot Debugger

### Packages and configurations

- Include the [Snapshot Collector NuGet package](https://www.nuget.org/packages/Microsoft.ApplicationInsights.SnapshotCollector) in your application.
- Configure collection parameters in [`ApplicationInsights.config`](../app/configuration-with-applicationinsights-config.md).

### Permissions

- Verify you're added to the [Application Insights Snapshot Debugger](../../role-based-access-control/role-assignments-portal.yml) role for the target **Application Insights Snapshot**.

## How Snapshot Debugger works

The Snapshot Debugger is implemented as an [Application Insights telemetry processor](../app/configuration-with-applicationinsights-config.md#telemetry-processors-aspnet). When your application runs, the Snapshot Debugger telemetry processor is added to your application's system-generated logs pipeline. 

> [!IMPORTANT]
> Snapshots might contain personal data or other sensitive information in variable and parameter values. Snapshot data is stored in the same region as your Application Insights resource.

### Snapshot Debugger process

The Snapshot Debugger process starts and ends with the `TrackException` method. A process snapshot is a suspended clone of the running process, so that your users experience little to no interruption. In a typical scenario:

1. Your application throws the [`TrackException`](../app/asp-net-exceptions.md#exceptions).

1. The Snapshot Debugger monitors exceptions as they're thrown by subscribing to the [`AppDomain.CurrentDomain.FirstChanceException`](/dotnet/api/system.appdomain.firstchanceexception) event. 

1. A counter is incremented for the problem ID. 
    - When the counter reaches the `ThresholdForSnapshotting` value, the problem ID is added to a collection plan.
    
     > [!NOTE]
     > The `ThresholdForSnapshotting` default minimum value is 1. With this value, your app has to trigger the same exception *twice* before a snapshot is created.

1. The exception event's problem ID is computed and compared against the problem IDs in the collection plan.

1. If there's a match between problem IDs, a **snapshot** of the running process is created. 
   - The snapshot is assigned a unique identifier and the exception is stamped with that identifier. 
   
   > [!NOTE]
   > The snapshot creation rate is limited by the `SnapshotsPerTenMinutesLimit` setting. By default, the limit is one snapshot every 10 minutes.
   
1. After the `FirstChanceException` handler returns, the thrown exception is processed as normal. 

1. The exception reaches the `TrackException` method again and is reported to Application Insights, along with the snapshot identifier.

> [!NOTE]
> Set `IsEnabledInDeveloperMode` to `true` if you want to generate snapshots while you debug in Visual Studio.

### Snapshot Uploader process

While the Snapshot Debugger process continues to run and serve traffic to users with little interruption, the snapshot is handed off to the Snapshot Uploader process. In a typical scenario, the Snapshot Uploader:

1. Creates a minidump.  

1. Uploads the  minidump to Application Insights, along with any relevant symbol (*.pdb*) files.

> [!NOTE]
> No more than 50 snapshots per day can be uploaded.

If you enabled the Snapshot Debugger but you aren't seeing snapshots, see the [Troubleshooting guide](snapshot-debugger-troubleshoot.md).

## Overhead

The Snapshot Debugger is designed for use in production environments. The default settings include rate limits to minimize the impact on your applications. 

However, you may experience small CPU, memory, and I/O overhead associated with the Snapshot Debugger, such as:
- When an exception is thrown in your application
- If the exception handler decides to create a snapshot
- When `TrackException` is called

There is **no additional cost** for storing data captured by Snapshot Debugger.

[See example scenarios in which you may experience Snapshot Debugger overhead.](./snapshot-debugger-troubleshoot.md#snapshot-debugger-overhead-scenarios)

## Limitations

This section discusses limitations for the Snapshot Debugger.

- **Data retention**

   Debug snapshots are stored for 15 days. The default data retention policy is set on a per-application basis. If you need to increase this value, you can request an increase by opening a support case in the Azure portal. For each Application Insights instance, a maximum number of 50 snapshots are allowed per day.

- **Publish symbols**

   The Snapshot Debugger requires symbol files on the production server to:
   - Decode variables
   - Provide a debugging experience in Visual Studio

   By default, Visual Studio 2017 versions 15.2+ publishes symbols for release builds when it publishes to App Service. 

   In prior versions, you must add the following line to your publish profile `.pubxml` file so that symbols are published in release mode:

   ```xml
       <ExcludeGeneratedDebugSymbol>False</ExcludeGeneratedDebugSymbol>
   ```

   For Azure Compute and other types, make sure that the symbol files are either:
   - In the same folder of the main application `.dll` (typically, `wwwroot/bin`), or
   - Available on the current path.

   For more information on the different symbol options that are available, see the [Visual Studio documentation](/visualstudio/ide/reference/advanced-build-settings-dialog-box-csharp). For best results, we recommend that you use *Full*, *Portable*, or *Embedded*.

- **Optimized builds**

   In some cases, local variables can't be viewed in release builds because of optimizations applied by the JIT compiler.

   However, in App Service, the Snapshot Debugger can deoptimize throwing methods that are part of its collection plan.

   > [!TIP]
   > Install the Application Insights Site extension in your instance of App Service to get deoptimization support.

## Next steps

Enable the Application Insights Snapshot Debugger for your application:

- [Azure App Service](snapshot-debugger-app-service.md?toc=/azure/azure-monitor/toc.json)
- [Azure Functions](snapshot-debugger-function-app.md?toc=/azure/azure-monitor/toc.json)
- [Azure Cloud Services](snapshot-debugger-vm.md?toc=/azure/azure-monitor/toc.json)
- [Azure Service Fabric](snapshot-debugger-vm.md?toc=/azure/azure-monitor/toc.json)
- [Azure Virtual Machines and Virtual Machine Scale Sets](snapshot-debugger-vm.md?toc=/azure/azure-monitor/toc.json)
- [On-premises virtual or physical machines](snapshot-debugger-vm.md?toc=/azure/azure-monitor/toc.json)