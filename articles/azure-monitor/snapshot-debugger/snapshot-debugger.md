---
title: Azure Application Insights Snapshot Debugger for .NET apps
description: Debug snapshots are automatically collected when exceptions are thrown in production .NET apps
ms.author: hannahhunter
author: hhunter-ms
ms.reviewer: charles.weininger
reviewer: cweining
ms.topic: conceptual
ms.custom: devx-track-dotnet, devdivchpfy22
ms.date: 04/14/2023
---

# Debug snapshots on exceptions in .NET apps

When an exception occurs, you can automatically collect a debug snapshot from your live web application. The debug snapshot shows the state of source code and variables at the moment the exception was thrown. The Snapshot Debugger in [Azure Application Insights](../app/app-insights-overview.md):

- Monitors system-generated logs from your web app.
- Collects snapshots on your top-throwing exceptions.
- Provides information you need to diagnose issues in production.

To use the Snapshot Debugger, you simply:
1. Include the [Snapshot collector NuGet package](https://www.nuget.org/packages/Microsoft.ApplicationInsights.SnapshotCollector) in your application
1. Configure collection parameters in [`ApplicationInsights.config`](../app/configuration-with-applicationinsights-config.md).

## How snapshots work

The Snapshot Debugger is implemented as an [Application Insights Telemetry Processor](../app/configuration-with-applicationinsights-config.md#telemetry-processors-aspnet). When your application runs, the Snapshot Debugger Telemetry Processor is added to your application's system-generated logs pipeline.
Each time your application calls [TrackException](../app/asp-net-exceptions.md#exceptions), the Snapshot Debugger computes a Problem ID from the type of exception being thrown and the throwing method.
Each time your application calls `TrackException`, a counter is incremented for the appropriate Problem ID. When the counter reaches the `ThresholdForSnapshotting` value, the Problem ID is added to a Collection Plan.

The Snapshot Debugger also monitors exceptions as they're thrown by subscribing to the [AppDomain.CurrentDomain.FirstChanceException](/dotnet/api/system.appdomain.firstchanceexception) event. When that event fires, the Problem ID of the exception is computed and compared against the Problem IDs in the Collection Plan.
If there's a match, then a snapshot of the running process is created. The snapshot is assigned a unique identifier and the exception is stamped with that identifier. After the `FirstChanceException` handler returns, the thrown exception is processed as normal. Eventually, the exception reaches the `TrackException` method again where it, along with the snapshot identifier, is reported to Application Insights.

The main process continues to run and serve traffic to users with little interruption. Meanwhile, the snapshot is handed off to the Snapshot Uploader process. The Snapshot Uploader creates a minidump and uploads it to Application Insights along with any relevant symbol (*.pdb*) files.

> [!TIP]
> * A process snapshot is a suspended clone of the running process.
> * Creating the snapshot takes about 10 to 20 milliseconds.
> * The default value for `ThresholdForSnapshotting` is 1. This is also the minimum value. Therefore, your app has to trigger the same exception **twice** before a snapshot is created.
> * Set `IsEnabledInDeveloperMode` to true if you want to generate snapshots while debugging in Visual Studio.
> * The snapshot creation rate is limited by the `SnapshotsPerTenMinutesLimit` setting. By default, the limit is one snapshot every ten minutes.
> * No more than 50 snapshots per day may be uploaded.


## Supported applications and environments 

### Applications

Snapshot collection is available for:

- .NET Framework and ASP.NET applications running .NET Framework 4.6.2 and newer versions.
- .NET and ASP.NET applications running .NET [LTS](https://dotnet.microsoft.com/platform/support/policy/dotnet-core) and newer versions on Windows.
- .NET [LTS](https://dotnet.microsoft.com/platform/support/policy/dotnet-core) (and newer versions) applications on Windows.

.NET Core versions prior to LTS are out of support and not recommended.

### Environments

The following environments are supported:

* [Azure App Service](snapshot-debugger-app-service.md?toc=/azure/azure-monitor/toc.json)
* [Azure Function](snapshot-debugger-function-app.md?toc=/azure/azure-monitor/toc.json)
* [Azure Cloud Services](snapshot-debugger-vm.md?toc=/azure/azure-monitor/toc.json) running OS family 4 or later
* [Azure Service Fabric services](snapshot-debugger-vm.md?toc=/azure/azure-monitor/toc.json) running on Windows Server 2012 R2 or later
* [Azure Virtual Machines and Virtual Machine Scale Sets](snapshot-debugger-vm.md?toc=/azure/azure-monitor/toc.json) running Windows Server 2012 R2 or later
* [On-premises virtual or physical machines](snapshot-debugger-vm.md?toc=/azure/azure-monitor/toc.json) running Windows Server 2012 R2 or later or Windows 8.1 or later

> [!NOTE]
> Client applications (for example, WPF, Windows Forms or UWP) aren't supported.

If you've enabled Snapshot Debugger but aren't seeing snapshots, check the [Troubleshooting guide](snapshot-debugger-troubleshoot.md).

## Required permissions

Access to snapshots is protected by Azure role-based access control (Azure RBAC). To inspect a snapshot, you must first be added to the [Application Insights Snapshot Debugger](../../role-based-access-control/role-assignments-portal.md) role. Subscription owners can assign this role to individual users or groups for the target **Application Insights Snapshot**.

For detailed steps, see [Assign Azure roles using the Azure portal](../../role-based-access-control/role-assignments-portal.md).  

> [!IMPORTANT]
> Snapshots may contain personal data or other sensitive information in variable and parameter values. Snapshot data is stored in the same region as your App Insights resource.

## Limitations

### Data retention

Debug snapshots are stored for 15 days. The default data retention policy is set on a per-application basis. If you need to increase this value, you can request an increase by opening a support case in the Azure portal. For each Application Insights instance, a maximum number of 50 snapshots are allowed per day.

### Publish symbols

The Snapshot Debugger requires symbol files on the production server to decode variables and to provide a debugging experience in Visual Studio.
Version 15.2 (or above) of Visual Studio 2017 publishes symbols for release builds by default when it publishes to App Service. In prior versions, you need to add the following line to your publish profile `.pubxml` file so that symbols are published in release mode:

```xml
    <ExcludeGeneratedDebugSymbol>False</ExcludeGeneratedDebugSymbol>
```

For Azure Compute and other types, make sure that the symbol files are in the same folder of the main application .dll (typically, `wwwroot/bin`) or are available on the current path.

> [!NOTE]
> For more information on the different symbol options that are available, see the [Visual Studio documentation](/visualstudio/ide/reference/advanced-build-settings-dialog-box-csharp). For best results, we recommend that you use "Full", "Portable" or "Embedded".

### Optimized builds

In some cases, local variables can't be viewed in release builds because of optimizations that are applied by the JIT compiler.
However, in Azure App Services, the Snapshot Collector can deoptimize throwing methods that are part of its Collection Plan.

> [!TIP]
> Install the Application Insights Site Extension in your App Service to get de-optimization support.

## Release notes for `Microsoft.ApplicationInsights.SnapshotCollector`

This article contains the releases notes for the Microsoft.ApplicationInsights.SnapshotCollector NuGet package for .NET applications, which is used by the Application Insights Snapshot Debugger.

[Learn](./snapshot-debugger.md) more about the Application Insights Snapshot Debugger for .NET applications.

For bug reports and feedback, [open an issue on GitHub](https://github.com/microsoft/ApplicationInsights-SnapshotCollector)

[!INCLUDE [azure-monitor-log-analytics-rebrand](../../../includes/azure-monitor-instrumentation-key-deprecation.md)]

### [1.4.4](https://www.nuget.org/packages/Microsoft.ApplicationInsights.SnapshotCollector/1.4.4)
A point release to address user-reported bugs.
#### Bug fixes
- Fix [Exception during native component extraction when using a single file application.](https://github.com/microsoft/ApplicationInsights-SnapshotCollector/issues/21)
#### Changes
- Lowered PDB scan failure messages from Error to Warning.
- Update msdia140.dll.
- Avoid making a service connection if the debugger is disabled via site extension settings.

### [1.4.3](https://www.nuget.org/packages/Microsoft.ApplicationInsights.SnapshotCollector/1.4.3)
A point release to address user-reported bugs.
#### Bug fixes
- Fix [Hide the IMDS dependency from dependency tracker.](https://github.com/microsoft/ApplicationInsights-SnapshotCollector/issues/17)
- Fix [ArgumentException: telemetryProcessorTypedoes not implement ITelemetryProcessor.](https://github.com/microsoft/ApplicationInsights-SnapshotCollector/issues/19)
<br>Snapshot Collector used via SDK is not supported when Interop feature is enabled. [See more not supported scenarios.](snapshot-debugger-troubleshoot.md#not-supported-scenarios)

### [1.4.2](https://www.nuget.org/packages/Microsoft.ApplicationInsights.SnapshotCollector/1.4.2)
A point release to address a user-reported bug.
#### Bug fixes
- Fix [ArgumentException: Delegates must be of the same type.](https://github.com/microsoft/ApplicationInsights-SnapshotCollector/issues/16)

### [1.4.1](https://www.nuget.org/packages/Microsoft.ApplicationInsights.SnapshotCollector/1.4.1)
A point release to revert a breaking change introduced in 1.4.0.
#### Bug fixes
- Fix [Method not found in WebJobs](https://github.com/microsoft/ApplicationInsights-SnapshotCollector/issues/15)

### [1.4.0](https://www.nuget.org/packages/Microsoft.ApplicationInsights.SnapshotCollector/1.4.0)
Address multiple improvements and added support for Azure Active Directory (Azure AD) authentication for Application Insights ingestion.
#### Changes
- Snapshot Collector package size reduced by 60%. From 10.34 MB to 4.11 MB.
- Target netstandard2.0 only in Snapshot Collector.
- Bump Application Insights SDK dependency to 2.15.0.
- Add back MinidumpWithThreadInfo when writing dumps.
- Add CompatibilityVersion to improve synchronization between Snapshot Collector agent and uploader on breaking changes.
- Change SnapshotUploader LogFile naming algorithm to avoid excessive file I/O in App Service.
- Add pid, role name, and process start time to uploaded blob metadata.
- Use System.Diagnostics.Process where possible in Snapshot Collector and Snapshot Uploader.
#### New features
- Add Azure Active Directory authentication to SnapshotCollector. Learn more about Azure AD authentication in Application Insights [here](../app/azure-ad-authentication.md).

### [1.3.7.5](https://www.nuget.org/packages/Microsoft.ApplicationInsights.SnapshotCollector/1.3.7.5)
A point release to backport a fix from 1.4.0-pre.
#### Bug fixes
- Fix [ObjectDisposedException on shutdown](https://github.com/microsoft/ApplicationInsights-dotnet/issues/2097).

### [1.3.7.4](https://www.nuget.org/packages/Microsoft.ApplicationInsights.SnapshotCollector/1.3.7.4)
A point release to address a problem discovered in testing Azure App Service's codeless attach scenario.
#### Changes
- The netcoreapp3.0 target now depends on Microsoft.ApplicationInsights.AspNetCore >= 2.1.1 (previously >= 2.1.2).

### [1.3.7.3](https://www.nuget.org/packages/Microsoft.ApplicationInsights.SnapshotCollector/1.3.7.3)
A point release to address a couple of high-impact issues.
#### Bug fixes
- Fixed PDB discovery in the wwwroot/bin folder, which was broken when we changed the symbol search algorithm in 1.3.6.
- Fixed noisy ExtractWasCalledMultipleTimesException in telemetry.

### [1.3.7](https://www.nuget.org/packages/Microsoft.ApplicationInsights.SnapshotCollector/1.3.7)
#### Changes
- The netcoreapp2.0 target of SnapshotCollector depends on Microsoft.ApplicationInsights.AspNetCore >= 2.1.1 (again). This reverts behavior to how it was before 1.3.5. We tried to upgrade it in 1.3.6, but it broke some Azure App Service scenarios.
#### New features
- Snapshot Collector reads and parses the ConnectionString from the APPLICATIONINSIGHTS_CONNECTION_STRING environment variable or from the TelemetryConfiguration. Primarily, this is used to set the endpoint for connecting to the Snapshot service. For more information, see the [Connection strings documentation](../app/sdk-connection-string.md).
#### Bug fixes
- Switched to using HttpClient for all targets except net45 because WebRequest was failing in some environments due to an incompatible SecurityProtocol (requires TLS 1.2).

### [1.3.6](https://www.nuget.org/packages/Microsoft.ApplicationInsights.SnapshotCollector/1.3.6)
#### Changes
- SnapshotCollector now depends on Microsoft.ApplicationInsights >= 2.5.1 for all target frameworks. This may be a breaking change if your application depends on an older version of the Microsoft.ApplicationInsights SDK.
- Remove support for TLS 1.0 and 1.1 in Snapshot Uploader.
- Period of PDB scans now defaults 24 hours instead of 15 minutes. Configurable via PdbRescanInterval on SnapshotCollectorConfiguration.
- PDB scan searches top-level folders only, instead of recursive. This may be a breaking change if your symbols are in subfolders of the binary folder.
#### New features
- Log rotation in SnapshotUploader to avoid filling the logs folder with old files.
- Deoptimization support (via ReJIT on attach) for .NET Core 3.0 applications.
- Add symbols to NuGet package.
- Set additional metadata when uploading minidumps.
- Added an Initialized property to SnapshotCollectorTelemetryProcessor. It's a CancellationToken, which will be canceled when the Snapshot Collector is completely initialized and connected to the service endpoint.
- Snapshots can now be captured for exceptions in dynamically generated methods. For example, the compiled expression trees generated by Entity Framework queries.
#### Bug fixes
- AmbiguousMatchException loading Snapshot Collector due to Status Monitor.
- GetSnapshotCollector extension method now searches all TelemetrySinks.
- Don't start the Snapshot Uploader on unsupported platforms.
- Handle InvalidOperationException when deoptimizing dynamic methods (for example, Entity Framework)

### [1.3.5](https://www.nuget.org/packages/Microsoft.ApplicationInsights.SnapshotCollector/1.3.5)
- Add support for Sovereign clouds (Older versions won't work in sovereign clouds)
- Adding snapshot collector made easier by using AddSnapshotCollector(). More information can be found [here](./snapshot-debugger-app-service.md).
- Use FISMA MD5 setting for verifying blob blocks. This avoids the default .NET MD5 crypto algorithm, which is unavailable when the OS is set to FIPS-compliant mode.
- Ignore .NET Framework frames when deoptimizing function calls. This behavior can be controlled by the DeoptimizeIgnoredModules configuration setting.
- Add `DeoptimizeMethodCount` configuration setting that allows deoptimization of more than one function call. More information here

### [1.3.4](https://www.nuget.org/packages/Microsoft.ApplicationInsights.SnapshotCollector/1.3.4)
- Allow structured Instrumentation Keys.
- Increase SnapshotUploader robustness - continue startup even if old uploader logs can't be moved.
- Re-enabled reporting additional telemetry when SnapshotUploader.exe exits immediately (was disabled in 1.3.3).
- Simplify internal telemetry.
- _Experimental feature_: Snappoint collection plans: Add "snapshotOnFirstOccurence". More information available [here](https://gist.github.com/alexaloni/5b4d069d17de0dabe384ea30e3f21dfe).

### [1.3.3](https://www.nuget.org/packages/Microsoft.ApplicationInsights.SnapshotCollector/1.3.3)
- Fixed bug that was causing SnapshotUploader.exe to stop responding and not upload snapshots for .NET Core apps.

### [1.3.2](https://www.nuget.org/packages/Microsoft.ApplicationInsights.SnapshotCollector/1.3.2)
- _Experimental feature_: Snappoint collection plans. More information available [here](https://gist.github.com/alexaloni/5b4d069d17de0dabe384ea30e3f21dfe).
- SnapshotUploader.exe will exit when the runtime unloads the AppDomain from which SnapshotCollector is loaded, instead of waiting for the process to exit. This improves the collector reliability when hosted in IIS.
- Add configuration to allow multiple SnapshotCollector instances that are using the same Instrumentation Key to share the same SnapshotUploader process: ShareUploaderProcess (defaults to `true`).
- Report additional telemetry when SnapshotUploader.exe exits immediately.
- Reduced the number of support files SnapshotUploader.exe needs to write to disk.

### [1.3.1](https://www.nuget.org/packages/Microsoft.ApplicationInsights.SnapshotCollector/1.3.1)
- Remove support for collecting snapshots with the RtlCloneUserProcess API and only support PssCaptureSnapshots API.
- Increase the default limit on how many snapshots can be captured in 10 minutes from 1 to 3.
- Allow SnapshotUploader.exe to negotiate TLS 1.1 and 1.2
- Report additional telemetry when SnapshotUploader logs a warning or an error
- Stop taking snapshots when the backend service reports the daily quota was reached (50 snapshots per day)
- Add extra check in SnapshotUploader.exe to not allow two instances to run in the same time.

### [1.3.0](https://www.nuget.org/packages/Microsoft.ApplicationInsights.SnapshotCollector/1.3.0)
#### Changes
- For applications targeting .NET Framework, Snapshot Collector now depends on Microsoft.ApplicationInsights version 2.3.0 or above.
It used to be 2.2.0 or above.
We believe this won't be an issue for most applications, but let us know if this change prevents you from using the latest Snapshot Collector.
- Use exponential back-off delays in the Snapshot Uploader when retrying failed uploads.
- Use ServerTelemetryChannel (if available) for more reliable reporting of telemetry.
- Use 'SdkInternalOperationsMonitor' on the initial connection to the Snapshot Debugger service so that it's ignored by dependency tracking.
- Improve telemetry around initial connection to the Snapshot Debugger service.
- Report additional telemetry for:
  - Azure App Service version.
  - Azure compute instances.
  - Containers.
  - Azure Function app.
#### Bug fixes
- When the problem counter reset interval is set to 24 days, interpret that as 24 hours.
- Fixed a bug where the Snapshot Uploader would stop processing new snapshots if there was an exception while disposing a snapshot.

### [1.2.3](https://www.nuget.org/packages/Microsoft.ApplicationInsights.SnapshotCollector/1.2.3)
- Fix strong-name signing with Snapshot Uploader binaries.

### [1.2.2](https://www.nuget.org/packages/Microsoft.ApplicationInsights.SnapshotCollector/1.2.2)
#### Changes
- The files needed for SnapshotUploader(64).exe are now embedded as resources in the main DLL. That means the SnapshotCollectorFiles folder is no longer created, simplifying build and deployment and reducing clutter in Solution Explorer. Take care when upgrading to review the changes in your `.csproj` file. The `Microsoft.ApplicationInsights.SnapshotCollector.targets` file is no longer needed.
- Telemetry is logged to your Application Insights resource even if ProvideAnonymousTelemetry is set to false. This is so we can implement a health check feature in the Azure portal. ProvideAnonymousTelemetry affects only the telemetry sent to Microsoft for product support and improvement.
- When the TempFolder or ShadowCopyFolder are redirected to environment variables, keep the collector idle until those environment variables are set.
- For applications that connect to the Internet via a proxy server, Snapshot Collector will now autodetect any proxy settings and pass them on to SnapshotUploader.exe.
- Lower the priority of the SnapshotUplaoder process (where possible). This priority can be overridden via the IsLowPrioirtySnapshotUploader option.
- Added a GetSnapshotCollector extension method on TelemetryConfiguration for scenarios where you want to configure the Snapshot Collector programmatically.
- Set the Application Insights SDK version (instead of the application version) in customer-facing telemetry.
- Send the first heartbeat event after two minutes.
#### Bug fixes
- Fix NullReferenceException when exceptions have null or immutable Data dictionaries.
- In the uploader, retry PDB matching a few times if we get a sharing violation.
- Fix duplicate telemetry when more than one thread calls into the telemetry pipeline at startup.

### [1.2.1](https://www.nuget.org/packages/Microsoft.ApplicationInsights.SnapshotCollector/1.2.1)
#### Changes
- XML Doc comment files are now included in the NuGet package.
- Added an ExcludeFromSnapshotting extension method on `System.Exception` for scenarios where you know you have a noisy exception and want to avoid creating snapshots for it.
- Added an IsEnabledWhenProfiling configuration property, defaults to true. This is a change from previous versions where snapshot creation was temporarily disabled if the Application Insights Profiler was performing a detailed collection. The old behavior can be recovered by setting this property to false.
#### Bug fixes
- Sign SnapshotUploader64.exe properly.
- Protect against double-initialization of the telemetry processor.
- Prevent double logging of telemetry in apps with multiple pipelines.
- Fix a bug with the expiration time of a collection plan, which could prevent snapshots after 24 hours.

### [1.2.0](https://www.nuget.org/packages/Microsoft.ApplicationInsights.SnapshotCollector/1.2.0)
The biggest change in this version (hence the move to a new minor version number) is a rewrite of the snapshot creation and handling pipeline. In previous versions, this functionality was implemented in native code (ProductionBreakpoints*.dll and SnapshotHolder*.exe). The new implementation is all managed code with P/Invokes. For this first version using the new pipeline, we haven't strayed far from the original behavior. The new implementation allows for better error reporting and sets us up for future improvements.

#### Other changes in this version
- MinidumpUploader.exe has been renamed to SnapshotUploader.exe (or SnapshotUploader64.exe).
- Added timing telemetry to DeOptimize/ReOptimize requests.
- Added gzip compression for minidump uploads.
- Fixed a problem where PDBs were locked preventing site upgrade.
- Log the original folder name (SnapshotCollectorFiles) when shadow-copying.
- Adjust memory limits for 64-bit processes to prevent site restarts due to OOM.
- Fix an issue where snapshots were still collected even after disabling.
- Log heartbeat events to customer's AI resource.
- Improve snapshot speed by removing "Source" from Problem ID.

### [1.1.2](https://www.nuget.org/packages/Microsoft.ApplicationInsights.SnapshotCollector/1.1.2)

#### Changes
- Augmented usage telemetry
- Detect and report .NET version and OS
- Detect and report additional Azure Environments (Cloud Service, Service Fabric)
- Record and report exception metrics (number of 1st chance exceptions and number of TrackException calls) in Heartbeat telemetry.

#### Bug fixes
- Correct handling of SqlException where the inner exception (Win32Exception) isn't thrown.
- Trim trailing spaces on symbol folders, which caused an incorrect parse of command-line arguments to the MinidumpUploader.
- Prevent infinite retry of failed connections to the Snapshot Debugger agent's endpoint.

### [1.1.0](https://www.nuget.org/packages/Microsoft.ApplicationInsights.SnapshotCollector/1.1.0)
#### Changes
- Added host memory protection. This feature reduces the impact on the host machine's memory.
- Improve the Azure portal snapshot viewing experience.

## Next steps

Enable Application Insights Snapshot Debugger for your application:

* [Azure App Service](snapshot-debugger-app-service.md?toc=/azure/azure-monitor/toc.json)
* [Azure Function](snapshot-debugger-function-app.md?toc=/azure/azure-monitor/toc.json)
* [Azure Cloud Services](snapshot-debugger-vm.md?toc=/azure/azure-monitor/toc.json)
* [Azure Service Fabric services](snapshot-debugger-vm.md?toc=/azure/azure-monitor/toc.json)
* [Azure Virtual Machines and Virtual Machine Scale Sets](snapshot-debugger-vm.md?toc=/azure/azure-monitor/toc.json)
* [On-premises virtual or physical machines](snapshot-debugger-vm.md?toc=/azure/azure-monitor/toc.json)

Beyond Application Insights Snapshot Debugger:

* [Set snappoints in your code](/visualstudio/debugger/debug-live-azure-applications) to get snapshots without waiting for an exception.
* [Diagnose exceptions in your web apps](../app/asp-net-exceptions.md) explains how to make more exceptions visible to Application Insights.
* [Smart Detection](../alerts/proactive-diagnostics.md) automatically discovers performance anomalies.
