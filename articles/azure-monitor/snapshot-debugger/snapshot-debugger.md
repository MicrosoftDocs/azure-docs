---
title: Debug exceptions in .NET applications using Snapshot Debugger
description: Use Snapshot Debugger to automatically collect snapshots and debug exceptions in .NET apps.
ms.author: hannahhunter
author: hhunter-ms
ms.reviewer: charles.weininger
reviewer: cweining
ms.topic: conceptual
ms.custom: devx-track-dotnet, devdivchpfy22, engagement
ms.date: 07/10/2023
---

# Debug exceptions in .NET applications using Snapshot Debugger

With Snapshot Debugger, you can automatically collect a debug snapshot when an exception occurs in your live .NET application. The debug snapshot shows the state of source code and variables at the moment the exception was thrown.

The Snapshot Debugger in [Application Insights](../app/app-insights-overview.md):

- Monitors system-generated logs from your web app.
- Collects snapshots on your top-throwing exceptions.
- Provides information you need to diagnose issues in production.

## How Snapshot Debugger works

The Snapshot Debugger is implemented as an [Application Insights telemetry processor](../app/configuration-with-applicationinsights-config.md#telemetry-processors-aspnet). When your application runs, the Snapshot Debugger telemetry processor is added to your application's system-generated logs pipeline. The Snapshot Debugger process is as follows:

1. Each time your application calls [`TrackException`](../app/asp-net-exceptions.md#exceptions):
   1. The Snapshot Debugger computes a problem ID from the type of exception being thrown and the throwing method.
   1. A counter is incremented for the appropriate problem ID. 
   1. When the counter reaches the `ThresholdForSnapshotting` value, the problem ID is added to a collection plan.
1. The Snapshot Debugger also monitors exceptions as they're thrown by subscribing to the [`AppDomain.CurrentDomain.FirstChanceException`](/dotnet/api/system.appdomain.firstchanceexception) event. 
   1. When this event fires, the problem ID of the exception is computed and compared against the problem IDs in the collection plan.
1. If there's a match between problem IDs, a snapshot of the running process is created. 
1. The snapshot is assigned a unique identifier and the exception is stamped with that identifier. 
1. After the `FirstChanceException` handler returns, the thrown exception is processed as normal. 
1. Eventually, the exception reaches the `TrackException` method again. It's reported to Application Insights, along with the snapshot identifier.

The main process continues to run and serve traffic to users with little interruption. Meanwhile, the snapshot is handed off to the Snapshot Uploader process. The Snapshot Uploader creates a minidump and uploads it to Application Insights along with any relevant symbol (*.pdb*) files.

> [!TIP]
> Snapshot creation tips:
> - A process snapshot is a suspended clone of the running process.
> - Creating the snapshot takes about 10 milliseconds to 20 milliseconds.
> - The default value for `ThresholdForSnapshotting` is 1. This value is also the minimum. Your app has to trigger the same exception *twice* before a snapshot is created.
> - Set `IsEnabledInDeveloperMode` to `true` if you want to generate snapshots while you debug in Visual Studio.
> - The snapshot creation rate is limited by the `SnapshotsPerTenMinutesLimit` setting. By default, the limit is one snapshot every 10 minutes.
> - No more than 50 snapshots per day can be uploaded.

## Supported applications and environments

This section lists the applications and environments that are supported.

### Applications

Snapshot collection is available for:

- .NET Framework 4.6.2 and newer versions.
- [.NET 6.0 or later](https://dotnet.microsoft.com/download) on Windows.

### Environments

The following environments are supported:

* [Azure App Service](snapshot-debugger-app-service.md?toc=/azure/azure-monitor/toc.json)
* [Azure Functions](snapshot-debugger-function-app.md?toc=/azure/azure-monitor/toc.json)
* [Azure Cloud Services](snapshot-debugger-vm.md?toc=/azure/azure-monitor/toc.json) running OS family 4 or later
* [Azure Service Fabric](snapshot-debugger-vm.md?toc=/azure/azure-monitor/toc.json) running on Windows Server 2012 R2 or later
* [Azure Virtual Machines and Azure Virtual Machine Scale Sets](snapshot-debugger-vm.md?toc=/azure/azure-monitor/toc.json) running Windows Server 2012 R2 or later
* [On-premises virtual or physical machines](snapshot-debugger-vm.md?toc=/azure/azure-monitor/toc.json) running Windows Server 2012 R2 or later or Windows 8.1 or later

> [!NOTE]
> Client applications (for example, WPF, Windows Forms, or UWP) aren't supported.

If you enabled the Snapshot Debugger but you aren't seeing snapshots, see the [Troubleshooting guide](snapshot-debugger-troubleshoot.md).

## Requirements

### Packages and configurations

- Include the [Snapshot Collector NuGet package](https://www.nuget.org/packages/Microsoft.ApplicationInsights.SnapshotCollector) in your application.
- Configure collection parameters in [`ApplicationInsights.config`](../app/configuration-with-applicationinsights-config.md).

### Permissions

Since access to snapshots is protected by Azure role-based access control, you must be added to the [Application Insights Snapshot Debugger](../../role-based-access-control/role-assignments-portal.md) role. Subscription owners can assign this role to individual users or groups for the target **Application Insights Snapshot**.

For more information, see [Assign Azure roles by using the Azure portal](../../role-based-access-control/role-assignments-portal.md).

> [!IMPORTANT]
> Snapshots might contain personal data or other sensitive information in variable and parameter values. Snapshot data is stored in the same region as your Application Insights resource.

## Limitations

This section discusses limitations for the Snapshot Debugger.

### Data retention

Debug snapshots are stored for 15 days. The default data retention policy is set on a per-application basis. If you need to increase this value, you can request an increase by opening a support case in the Azure portal. For each Application Insights instance, a maximum number of 50 snapshots are allowed per day.

### Publish symbols

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

### Optimized builds

In some cases, local variables can't be viewed in release builds because of optimizations applied by the JIT compiler.

However, in App Service, the Snapshot Debugger can deoptimize throwing methods that are part of its collection plan.

> [!TIP]
> Install the Application Insights Site extension in your instance of App Service to get deoptimization support.

## Release notes for Microsoft.ApplicationInsights.SnapshotCollector

This section contains the release notes for the `Microsoft.ApplicationInsights.SnapshotCollector` NuGet package for .NET applications, which is used by the Application Insights Snapshot Debugger.

[Learn](./snapshot-debugger.md) more about the Application Insights Snapshot Debugger for .NET applications.

For bug reports and feedback, [open an issue on GitHub](https://github.com/microsoft/ApplicationInsights-SnapshotCollector).

[!INCLUDE [azure-monitor-log-analytics-rebrand](../../../includes/azure-monitor-instrumentation-key-deprecation.md)]

### [1.4.4](https://www.nuget.org/packages/Microsoft.ApplicationInsights.SnapshotCollector/1.4.4)
A point release to address user-reported bugs.

#### Bug fixes
Fixed [Exception during native component extraction when using a single file application.](https://github.com/microsoft/ApplicationInsights-SnapshotCollector/issues/21)

#### Changes
- Lowered PDB scan failure messages from Error to Warning.
- Updated msdia140.dll.
- Avoid making a service connection if the debugger is disabled via site extension settings.

### [1.4.3](https://www.nuget.org/packages/Microsoft.ApplicationInsights.SnapshotCollector/1.4.3)
A point release to address user-reported bugs.

#### Bug fixes
- Fixed [Hide the IMDS dependency from dependency tracker.](https://github.com/microsoft/ApplicationInsights-SnapshotCollector/issues/17).
- Fixed [ArgumentException: telemetryProcessorTypedoes not implement ITelemetryProcessor.](https://github.com/microsoft/ApplicationInsights-SnapshotCollector/issues/19).
<br>Snapshot Collector used via SDK isn't supported when the Interop feature is enabled. See [More not supported scenarios](snapshot-debugger-troubleshoot.md#not-supported-scenarios).

### [1.4.2](https://www.nuget.org/packages/Microsoft.ApplicationInsights.SnapshotCollector/1.4.2)
A point release to address a user-reported bug.

#### Bug fixes
Fixed [ArgumentException: Delegates must be of the same type](https://github.com/microsoft/ApplicationInsights-SnapshotCollector/issues/16).

### [1.4.1](https://www.nuget.org/packages/Microsoft.ApplicationInsights.SnapshotCollector/1.4.1)
A point release to revert a breaking change introduced in 1.4.0.

#### Bug fixes
Fixed [Method not found in WebJobs](https://github.com/microsoft/ApplicationInsights-SnapshotCollector/issues/15).

### [1.4.0](https://www.nuget.org/packages/Microsoft.ApplicationInsights.SnapshotCollector/1.4.0)
Addressed multiple improvements and added support for Microsoft Entra authentication for Application Insights ingestion.

#### Changes
- Reduced Snapshot Collector package size by 60% from 10.34 MB to 4.11 MB.
- Targeted netstandard2.0 only in Snapshot Collector.
- Bumped Application Insights SDK dependency to 2.15.0.
- Added back `MinidumpWithThreadInfo` when writing dumps.
- Added `CompatibilityVersion` to improve synchronization between the Snapshot Collector agent and the Snapshot Uploader on breaking changes.
- Changed `SnapshotUploader` LogFile naming algorithm to avoid excessive file I/O in App Service.
- Added `pid`, `role name`, and `process start time` to uploaded blob metadata.
- Used `System.Diagnostics.Process` in Snapshot Collector and Snapshot Uploader.

#### New features
Added Microsoft Entra authentication to `SnapshotCollector`. To learn more about Microsoft Entra authentication in Application Insights, see [Microsoft Entra authentication for Application Insights](../app/azure-ad-authentication.md).

### [1.3.7.5](https://www.nuget.org/packages/Microsoft.ApplicationInsights.SnapshotCollector/1.3.7.5)
A point release to backport a fix from 1.4.0-pre.

#### Bug fixes
Fixed [ObjectDisposedException on shutdown](https://github.com/microsoft/ApplicationInsights-dotnet/issues/2097).

### [1.3.7.4](https://www.nuget.org/packages/Microsoft.ApplicationInsights.SnapshotCollector/1.3.7.4)
A point release to address a problem discovered in testing the App Service codeless attach scenario.

#### Changes
The `netcoreapp3.0` target now depends on `Microsoft.ApplicationInsights.AspNetCore` >= 2.1.1 (previously >= 2.1.2).

### [1.3.7.3](https://www.nuget.org/packages/Microsoft.ApplicationInsights.SnapshotCollector/1.3.7.3)
A point release to address a couple of high-impact issues.

#### Bug fixes
- Fixed PDB discovery in the *wwwroot/bin* folder, which was broken when we changed the symbol search algorithm in 1.3.6.
- Fixed noisy `ExtractWasCalledMultipleTimesException` in telemetry.

### [1.3.7](https://www.nuget.org/packages/Microsoft.ApplicationInsights.SnapshotCollector/1.3.7)
#### Changes
The `netcoreapp2.0` target of `SnapshotCollector` depends on `Microsoft.ApplicationInsights.AspNetCore` >= 2.1.1 (again). This change reverts behavior to how it was before 1.3.5. We tried to upgrade it in 1.3.6, but it broke some App Service scenarios.

#### New features
Snapshot Collector reads and parses the `ConnectionString` from the APPLICATIONINSIGHTS_CONNECTION_STRING environment variable or from the `TelemetryConfiguration`. Primarily, it's used to set the endpoint for connecting to the Snapshot service. For more information, see the [Connection strings documentation](../app/sdk-connection-string.md).

#### Bug fixes
Switched to using `HttpClient` for all targets except `net45` because `WebRequest` was failing in some environments because of an incompatible `SecurityProtocol` (requires TLS 1.2).

### [1.3.6](https://www.nuget.org/packages/Microsoft.ApplicationInsights.SnapshotCollector/1.3.6)
#### Changes
- `SnapshotCollector` now depends on `Microsoft.ApplicationInsights` >= 2.5.1 for all target frameworks. This requirement might be a breaking change if your application depends on an older version of the Microsoft.ApplicationInsights SDK.
- Removed support for TLS 1.0 and 1.1 in Snapshot Uploader.
- Period of PDB scans now defaults 24 hours instead of 15 minutes. Configurable via `PdbRescanInterval` on `SnapshotCollectorConfiguration`.
- PDB scan searches top-level folders only, instead of recursive. This change might be a breaking change if your symbols are in subfolders of the binary folder.

#### New features
- Log rotation in `SnapshotUploader` to avoid filling the logs folder with old files.
- Deoptimization support (via ReJIT on attach) for .NET Core 3.0 applications.
- Added symbols to NuGet package.
- Set more metadata when you upload minidumps.
- Added an `Initialized` property to `SnapshotCollectorTelemetryProcessor`. It's a `CancellationToken`, which is canceled when the Snapshot Collector is initialized and connected to the service endpoint.
- Snapshots can now be captured for exceptions in dynamically generated methods. An example is the compiled expression trees generated by Entity Framework queries.

#### Bug fixes
- `AmbiguousMatchException` loading Snapshot Collector due to Status Monitor.
- `GetSnapshotCollector` extension method now searches all `TelemetrySinks`.
- Don't start the Snapshot Uploader on unsupported platforms.
- Handle `InvalidOperationException` when you're deoptimizing dynamic methods (for example, Entity Framework).

### [1.3.5](https://www.nuget.org/packages/Microsoft.ApplicationInsights.SnapshotCollector/1.3.5)
- Added support for sovereign clouds (older versions don't work in sovereign clouds).
- Adding Snapshot Collector made easier by using `AddSnapshotCollector()`. For more information, see [Enable Snapshot Debugger for .NET apps in Azure App Service](./snapshot-debugger-app-service.md).
- Use the FISMA MD5 setting for verifying blob blocks. This setting avoids the default .NET MD5 crypto algorithm, which is unavailable when the OS is set to FIPS-compliant mode.
- Ignore .NET Framework frames when deoptimizing function calls. Control this behavior with the `DeoptimizeIgnoredModules` configuration setting.
- Added the `DeoptimizeMethodCount` configuration setting that allows deoptimization of more than one function call.

### [1.3.4](https://www.nuget.org/packages/Microsoft.ApplicationInsights.SnapshotCollector/1.3.4)
- Allowed structured instrumentation keys.
- Increased Snapshot Uploader robustness. Continue startup even if old uploader logs can't be moved.
- Reenabled reporting more telemetry when *SnapshotUploader.exe* exits immediately (was disabled in 1.3.3).
- Simplified internal telemetry.
- **Experimental feature:** Snappoint collection plans: Add `snapshotOnFirstOccurence`. For more information, see [this GitHub article](https://gist.github.com/alexaloni/5b4d069d17de0dabe384ea30e3f21dfe).

### [1.3.3](https://www.nuget.org/packages/Microsoft.ApplicationInsights.SnapshotCollector/1.3.3)
Fixed bug that was causing *SnapshotUploader.exe* to stop responding and not upload snapshots for .NET Core apps.

### [1.3.2](https://www.nuget.org/packages/Microsoft.ApplicationInsights.SnapshotCollector/1.3.2)
- **Experimental feature:** Snappoint collection plans. For more information, see [this GitHub article](https://gist.github.com/alexaloni/5b4d069d17de0dabe384ea30e3f21dfe).
- *SnapshotUploader.exe* exits when the runtime unloads the `AppDomain` from which `SnapshotCollector` is loaded, instead of waiting for the process to exit. This action improves the collector reliability when hosted in IIS.
- Added configuration to allow multiple `SnapshotCollector` instances that are using the same instrumentation key to share the same `SnapshotUploader` process: `ShareUploaderProcess` (defaults to `true`).
- Reported more telemetry when *SnapshotUploader.exe* exits immediately.
- Reduced the number of support files *SnapshotUploader.exe* needs to write to disk.

### [1.3.1](https://www.nuget.org/packages/Microsoft.ApplicationInsights.SnapshotCollector/1.3.1)
- Removed support for collecting snapshots with the RtlCloneUserProcess API and only support PssCaptureSnapshots API.
- Increased the default limit on how many snapshots can be captured in 10 minutes from one to three.
- Allow *SnapshotUploader.exe* to negotiate TLS 1.1 and 1.2.
- Reported more telemetry when `SnapshotUploader` logs a warning or an error.
- Stop taking snapshots when the back-end service reports the daily quota was reached (50 snapshots per day).
- Added extra check in *SnapshotUploader.exe* to not allow two instances to run in the same time.

### [1.3.0](https://www.nuget.org/packages/Microsoft.ApplicationInsights.SnapshotCollector/1.3.0)
#### Changes
- For applications that target .NET Framework, Snapshot Collector now depends on Microsoft.ApplicationInsights version 2.3.0 or later.
It used to be 2.2.0 or later.
We believe this change won't be an issue for most applications. Let us know if this change prevents you from using the latest Snapshot Collector.
- Use exponential back-off delays in the Snapshot Uploader when retrying failed uploads.
- Use `ServerTelemetryChannel` (if available) for more reliable reporting of telemetry.
- Use `SdkInternalOperationsMonitor` on the initial connection to the Snapshot Debugger service so that dependency tracking ignores it.
- Improved telemetry around initial connection to Snapshot Debugger.
- Report more telemetry for the:
  - App Service version.
  - Azure compute instances.
  - Containers.
  - Azure Functions app.

#### Bug fixes
- When the problem counter reset interval is set to 24 days, interpret that as 24 hours.
- Fixed a bug where the Snapshot Uploader would stop processing new snapshots if there was an exception while disposing a snapshot.

### [1.2.3](https://www.nuget.org/packages/Microsoft.ApplicationInsights.SnapshotCollector/1.2.3)
Fixed strong-name signing with Snapshot Uploader binaries.

### [1.2.2](https://www.nuget.org/packages/Microsoft.ApplicationInsights.SnapshotCollector/1.2.2)
#### Changes
- The files needed for *SnapshotUploader(64).exe* are now embedded as resources in the main DLL. That means the `SnapshotCollectorFiles` folder is no longer created, which simplifies build and deployment and reduces clutter in Solution Explorer. Take care when you upgrade to review the changes in your `.csproj` file. The `Microsoft.ApplicationInsights.SnapshotCollector.targets` file is no longer needed.
- Telemetry is logged to your Application Insights resource even if `ProvideAnonymousTelemetry` is set to false. This change is so that we can implement a health check feature in the Azure portal. `ProvideAnonymousTelemetry` affects only the telemetry sent to Microsoft for product support and improvement.
- When `TempFolder` or `ShadowCopyFolder` are redirected to environment variables, keep the collector idle until those environment variables are set.
- For applications that connect to the internet via a proxy server, Snapshot Collector now autodetects any proxy settings and passes them on to *SnapshotUploader.exe*.
- Lower the priority of the `SnapshotUploader` process (where possible). This priority can be overridden via the `IsLowPrioirtySnapshotUploader` option.
- Added a `GetSnapshotCollector` extension method on `TelemetryConfiguration` for scenarios where you want to configure the Snapshot Collector programmatically.
- Set the Application Insights SDK version (instead of the application version) in customer-facing telemetry.
- Send the first heartbeat event after two minutes.

#### Bug fixes
- Fixed `NullReferenceException` when exceptions have null or immutable Data dictionaries.
- In the uploader, retry PDB matching a few times if we get a sharing violation.
- Fix duplicate telemetry when more than one thread calls into the telemetry pipeline at startup.

### [1.2.1](https://www.nuget.org/packages/Microsoft.ApplicationInsights.SnapshotCollector/1.2.1)
#### Changes
- XML Doc comment files are now included in the NuGet package.
- Added an `ExcludeFromSnapshotting` extension method on `System.Exception` for scenarios where you know you have a noisy exception and want to avoid creating snapshots for it.
- Added an `IsEnabledWhenProfiling` configuration property that defaults to true. This is a change from previous versions where snapshot creation was temporarily disabled if the Application Insights Profiler was performing a detailed collection. The old behavior can be recovered by setting this property to `false`.

#### Bug fixes
- Sign *SnapshotUploader64.exe* properly.
- Protect against double-initialization of the telemetry processor.
- Prevent double logging of telemetry in apps with multiple pipelines.
- Fixed a bug with the expiration time of a collection plan, which could prevent snapshots after 24 hours.

### [1.2.0](https://www.nuget.org/packages/Microsoft.ApplicationInsights.SnapshotCollector/1.2.0)
The biggest change in this version (hence the move to a new minor version number) is a rewrite of the snapshot creation and handling pipeline. In previous versions, this functionality was implemented in native code (*ProductionBreakpoints*.dll* and *SnapshotHolder*.exe*). The new implementation is all managed code with P/Invokes.

For this first version using the new pipeline, we haven't strayed far from the original behavior. The new implementation allows for better error reporting and sets us up for future improvements.

#### Other changes in this version
- *MinidumpUploader.exe* has been renamed to *SnapshotUploader.exe* (or *SnapshotUploader64.exe*).
- Added timing telemetry to DeOptimize/ReOptimize requests.
- Added gzip compression for minidump uploads.
- Fixed a problem where PDBs were locked preventing site upgrade.
- Log the original folder name (*SnapshotCollectorFiles*) when shadow-copying.
- Adjusted memory limits for 64-bit processes to prevent site restarts due to OOM.
- Fixed an issue where snapshots were still collected even after disabling.
- Log heartbeat events to customer's AI resource.
- Improved snapshot speed by removing "Source" from the problem ID.

### [1.1.2](https://www.nuget.org/packages/Microsoft.ApplicationInsights.SnapshotCollector/1.1.2)

#### Changes
- Augmented usage telemetry.
- Detect and report .NET version and OS.
- Detect and report more Azure environments (Azure Cloud Services, Azure Service Fabric).
- Record and report exception metrics (number of first-chance exceptions and the number of `TrackException` calls) in Heartbeat telemetry.

#### Bug fixes
- Correct handling of `SqlException` where the inner exception (Win32Exception) isn't thrown.
- Trimmed trailing spaces on symbol folders, which caused an incorrect parse of command-line arguments to the `MinidumpUploader`.
- Prevented infinite retry of failed connections to the Snapshot Debugger agent's endpoint.

### [1.1.0](https://www.nuget.org/packages/Microsoft.ApplicationInsights.SnapshotCollector/1.1.0)
#### Changes
- Added host memory protection. This feature reduces the impact on the host machine's memory.
- Improved the Azure portal snapshot viewing experience.

## Next steps

Enable the Application Insights Snapshot Debugger for your application:

* [Azure App Service](snapshot-debugger-app-service.md?toc=/azure/azure-monitor/toc.json)
* [Azure Functions](snapshot-debugger-function-app.md?toc=/azure/azure-monitor/toc.json)
* [Azure Cloud Services](snapshot-debugger-vm.md?toc=/azure/azure-monitor/toc.json)
* [Azure Service Fabric](snapshot-debugger-vm.md?toc=/azure/azure-monitor/toc.json)
* [Azure Virtual Machines and Virtual Machine Scale Sets](snapshot-debugger-vm.md?toc=/azure/azure-monitor/toc.json)
* [On-premises virtual or physical machines](snapshot-debugger-vm.md?toc=/azure/azure-monitor/toc.json)

Beyond Application Insights Snapshot Debugger:

* [Set snappoints in your code](/visualstudio/debugger/debug-live-azure-applications) to get snapshots without waiting for an exception.
* [Diagnose exceptions in your web apps](../app/asp-net-exceptions.md) explains how to make more exceptions visible to Application Insights.
* [Smart detection](../alerts/proactive-diagnostics.md) automatically discovers performance anomalies.
