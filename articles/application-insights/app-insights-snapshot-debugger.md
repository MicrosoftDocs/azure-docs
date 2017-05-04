---
title: Azure Application Insights Snapshot Debugger for .NET apps | Microsoft Docs
description: Debug snapshots automatically collected when exceptions are thrown in production .NET apps
services: application-insights
documentationcenter: ''
author: qubitron
manager: carmonm

ms.service: application-insights
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.devlang: na
ms.topic: article
ms.date: 04/30/2017
ms.author: dantaylo

---
# Debug Snapshots on Exceptions in .NET Apps

*This feature is in preview.*

Automatically collect a debug snapshot from your live web application when an exception occurs. The snapshot shows the state of source code and variables the moment the exception was thrown. The Snapshot Debugger in [Application Insights](app-insights-overview.md) monitors exception telemetry from your web app. It collects snapshots on your top-throwing exceptions so that you have the information you need to diagnose issues in production. Include the [snapshot collector NuGet package](http://www.nuget.org/packages/Microsoft.ApplicationInsights.SnapshotCollector) into your application, and optionally configure collection parameters in [ApplicationInsights.config](app-insights-configuration-with-applicationinsights-config.md). Snapshots appear on [exceptions](app-insights-asp-net-exceptions.md) in the Application Insights portal.

You can view debug snapshots in the portal to see the call stack and inspect variables at each call stack frame. To get a more powerful debugging experience with source code, open snapshots with Visual Studio 2017 Enterprise by [downloading the Snapshot Debugger extension for Visual Studio](https://aka.ms/snapshotdebugger).

Snapshot collection is available for:

* ASP.NET web apps running on .NET Framework 4.6 and above, hosted either on IIS or in Azure.
* Windows apps running on .NET Core 2.0 and above.

## Configure Snapshot Collection

1. If you haven't done this yet, [enable Application Insights in your web app](app-insights-asp-net.md).

2. Include the [Microsoft.ApplicationInsights.SnapshotCollector](http://www.nuget.org/packages/Microsoft.ApplicationInsights.SnapshotCollector) NuGet package into your app. 

3. Review the default options that the package has added to [ApplicationInsights.config](app-insights-configuration-with-applicationinsights-config.md).

```xml
  <TelemetryProcessors>
    <Add Type="Microsoft.ApplicationInsights.SnapshotCollector.SnapshotCollectorTelemetryProcessor, Microsoft.ApplicationInsights.SnapshotCollector">
      <!-- The default is true, but you can disable Snapshot Debugging by setting it to false -->
      <IsEnabled>true</IsEnabled>
      <!-- Snapshot Debugging is usually disabled in developer mode, but you can enable it by setting this to true. -->
      <!-- DeveloperMode is a property on the active TelemetryChannel. -->
      <IsEnabledInDeveloperMode>false</IsEnabledInDeveloperMode>
      <!-- How many times we need to see an exception before we ask for snapshots. -->
      <ThresholdForSnapshotting>5</ThresholdForSnapshotting>
      <!-- The maximum number of examples we create for a single problem. -->
      <MaximumSnapshotsRequired>3</MaximumSnapshotsRequired>
      <!-- The maximum number of problems that we can be tracking at any time. -->
      <MaximumCollectionPlanSize>50</MaximumCollectionPlanSize>
      <!-- How often to reset problem counters. -->
      <ProblemCounterResetInterval>06:00:00</ProblemCounterResetInterval>
      <!-- The maximum number of snapshots allowed in one minute. -->
      <SnapshotsPerMinuteLimit>2</SnapshotsPerMinuteLimit>
      <!-- The maximum number of snapshots allowed per day. -->
      <SnapshotsPerDayLimit>50</SnapshotsPerDayLimit>
    </Add>
  </TelemetryProcessors>
```

Snapshots are only collected on exceptions that are visible to the Application Insights SDK. In some cases, you may need to [configure exception collection](app-insights-asp-net-exceptions.md#exceptions) to see exceptions with snapshots appearing in the portal.



## Debugging snapshots in the Application Insights Portal

If a snapshot is available for a given exception or problem ID, an *Open Debug Snapshot* link appears on the [exception](app-insights-asp-net-exceptions.md) in the Application Insights portal.

![Open Debug Snapshot button on exception](./media/app-insights-snapshot-debugger/snapshot-on-exception.png)

In the Debug Snapshot view, you see a call stack and a variables pane. Selecting frames of the call stack in the call stack pane  allows you to view local variables and parameters for that function call in the variables pane.

![View Debug Snapshot in the portal](./media/app-insights-snapshot-debugger/open-snapshot-portal.png)

Snapshots may contain sensitive information, and by default are not viewable. To view snapshots, you must have the `Application Insights Snapshot Debugger` role assigned to you in the portal for the subscription or resource. Currently this role can only be assigned by subscription owners on a per-user basis. Assigning the role to Azure Active Directory groups is currently not supported.

## Debugging snapshots with Visual Studio 2017 Enterprise
You can click the *Download Snapshot* button to download a `.diagsession` file, which can be opened by Visual Studio 2017 Enterprise. Opening the `.diagsession` file currently requires that you first [download and install the Snapshot Debugger extension for Visual Studio](https://aka.ms/snapshotdebugger).

After opening the snapshot file, you are taken to the Minidump Debugging page of Visual Studio, where you can start debugging the snapshot by clicking *Debug Managed Code*. You are taken to the line of code where the exception was thrown, and can debug the current state of the process.

![View Debug Snapshot in Visual Studio](./media/app-insights-snapshot-debugger/open-snapshot-visualstudio.png)

The downloaded snapshot contains any symbol files that were found on your web application server. These symbol files are required to associate snapshot data with source code. For Azure App Service apps, make sure to enable deploying of symbols when publishing your web apps.

## How snapshots work

When your application starts, a separate snapshot uploader process is created that monitors your application for snapshot requests. When a snapshot is requested, a shadow copy of the running process is made in about 10-20 ms. The shadow process is then analyzed and a snapshot is created while the main process continues running and serving traffic to users. The snapshot is then uploaded to Application Insights along with any relevant symbol (.pdb) files needed to view the snapshot.

## Current Limitations

### Publishing Symbols
The Snapshot Debugger requires that symbol files be present on the production server in order to decode variables and provide a debugging experience in Visual Studio. The 15.2 release Visual Studio 2017 publishes symbols for Release builds by default when publishing to Azure App Service. In prior versions you will need to add the following line to your publish profile `.pubxml` file so that symbols are published in release mode.

```xml
    <ExcludeGeneratedDebugSymbol>False</ExcludeGeneratedDebugSymbol>
```

For Azure Compute and other types, ensure the symbol files are in the same folder of the main application .dll (typically `wwwroot/bin`), or are available on the current path.

### Optimized Builds
In some cases, local variables will not be viewable in Release builds because of optimizations applied during the build process. This limitation will be fixed in a future release.

## Next Steps

* [Diagnose exceptions in your web apps](app-insights-asp-net-exceptions.md) explains how to make more exceptions visible to Application Insights. 
* [Smart Detection](app-insights-proactive-diagnostics.md) automatically discovers performance anomalies.
