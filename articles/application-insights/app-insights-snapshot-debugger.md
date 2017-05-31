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
ms.date: 05/23/2017
ms.author: cfreeman

---
# Debug Snapshots on Exceptions in .NET Apps

*This feature is in preview.*

Automatically collect a Debug Snapshot from your live web application when an exception occurs. The Snapshot shows the state of source code and variables the moment the exception was thrown. The Snapshot Debugger in [Application Insights](app-insights-overview.md) monitors exception telemetry from your web app. It collects Snapshots on your top-throwing exceptions so that you have the information you need to diagnose issues in production. Include the [Snapshot collector NuGet package](http://www.nuget.org/packages/Microsoft.ApplicationInsights.SnapshotCollector) into your application, and optionally configure collection parameters in [ApplicationInsights.config](app-insights-configuration-with-applicationinsights-config.md). Snapshots appear on [exceptions](app-insights-asp-net-exceptions.md) in the Application Insights portal.

You can view Debug Snapshots in the portal to see the call stack and inspect variables at each call stack frame. To get a more powerful debugging experience with source code, open Snapshots with Visual Studio 2017 Enterprise by [downloading the Snapshot Debugger extension for Visual Studio](https://aka.ms/snapshotdebugger).

Snapshot collection is available for ASP.NET web apps running on .NET Framework 4.6 and above, hosted either on IIS in Azure Compute or in Azure App Service.

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

### Collect exceptions

Snapshots are only collected on exceptions that are visible to the Application Insights SDK. In some cases (for example, older versions of the .NET platform), you may need to [configure exception collection](app-insights-asp-net-exceptions.md#exceptions) to see exceptions with Snapshots appearing in the portal.

### Grant permissions

Owners of the Azure subscription can inspect snapshots. Other users must be granted permission by an owner.

To grant permission, assign the `Application Insights Snapshot Debugger` role to users who will inspect snapshots. This role can only be assigned by subscription owners to individual users. 

Be aware that snapshots can potentially contain personal and other sensitive information in variable and parameter values.

1. In the Azure navigation menu, open **More services > Subscriptions**, then **Access Control**.
2. Click **Roles** and then **Application Insights Snapshot Debugger**.
3. Click **Add** and then select a user.

## Debugging Snapshots in the Application Insights Portal

If a Snapshot is available for a given exception or problem ID, an *Open Debug Snapshot* link appears on the [exception](app-insights-asp-net-exceptions.md) in the Application Insights portal.

![Open Debug Snapshot button on exception](./media/app-insights-snapshot-debugger/snapshot-on-exception.png)

In the Debug Snapshot view, you see a call stack and a variables pane. Selecting frames of the call stack in the call stack pane  allows you to view local variables and parameters for that function call in the variables pane.

![View Debug Snapshot in the portal](./media/app-insights-snapshot-debugger/open-snapshot-portal.png)

Snapshots may contain sensitive information, and by default are not viewable. To view Snapshots, you must have the `Application Insights Snapshot Debugger` role assigned to you.

## Debugging Snapshots with Visual Studio 2017 Enterprise
You can click the *Download Snapshot* button to download a `.diagsession` file, which can be opened by Visual Studio 2017 Enterprise. Opening the `.diagsession` file currently requires that you first [download and install the Snapshot Debugger extension for Visual Studio](https://aka.ms/snapshotdebugger).

After opening the Snapshot file, you are taken to the Minidump Debugging page of Visual Studio, where you can start debugging the Snapshot by clicking *Debug Managed Code*. You are taken to the line of code where the exception was thrown, and can debug the current state of the process.

![View Debug Snapshot in Visual Studio](./media/app-insights-snapshot-debugger/open-snapshot-visualstudio.png)

The downloaded Snapshot contains any symbol files that were found on your web application server. These symbol files are required to associate Snapshot data with source code. For Azure App Service apps, make sure to enable deploying of symbols when publishing your web apps.

## How Snapshots work

When your application starts, a separate Snapshot uploader process is created that monitors your application for Snapshot requests. When a Snapshot is requested, a shadow copy of the running process is made in about 10-20 ms. The shadow process is then analyzed and a Snapshot is created while the main process continues running and serving traffic to users. The Snapshot is then uploaded to Application Insights along with any relevant symbol (.pdb) files needed to view the Snapshot.

## Current Limitations

### Publishing Symbols
The Snapshot Debugger requires that symbol files be present on the production server to decode variables and provide a debugging experience in Visual Studio. The 15.2 release Visual Studio 2017 publishes symbols for Release builds by default when publishing to Azure App Service. In prior versions, you need to add the following line to your publish profile `.pubxml` file so that symbols are published in release mode.

```xml
    <ExcludeGeneratedDebugSymbol>False</ExcludeGeneratedDebugSymbol>
```

For Azure Compute and other types, ensure the symbol files are in the same folder of the main application .dll (typically `wwwroot/bin`), or are available on the current path.

### Optimized Builds
In some cases, local variables are not viewable in Release builds because of optimizations applied during the build process. This limitation will be fixed in a future release of the NuGet package.

## Troubleshooting

These tips help you troubleshoot problems with the Snapshot Debugger.

### 1. Verify the instrumentation key

Make sure you're using the correct instrumentation key in your published application. Usually, Application Insights reads the instrumentation key from the ApplicationInsights.config file. Verify that the value is the same as the instrumentation key for the Application Insights resource you are viewing in the portal.

### 2. Check the uploader logs

After a snapshot is created, a minidump file (.dmp) will be created on disk. A separate uploader process takes that minidump file and uploads it, along with any associated PDBs, to Application Insights Snapshot Debugger storage. Once the minidump has been uploaded successfully, it is deleted from disk. The log files for the minidump uploader are retained on disk. In an Azure App Service environment, you can find these logs in `D:\Home\LogFiles\Uploader_*.log`. Use the Kudu management site for your App Service to find these log files.
1. Open your App Service application in the Azure portal.
2. Select the "Advanced Tools" blade (or search for "Kudu")
3. Click "Go"
4. Select `CMD` from the `Debug console` drop-down.
5. Click `LogFiles`

You should see at least one file with a name beginning with `Uploader_` and a `.log` extension. You can download any log files or open them in the browser by clicking the appropriate icon.
The filename includes the machine name. Therefore, if your App Service is hosted on more than one machine, there are separate log files for each machine. When the uploader detects a new minidump file, it is recorded in the log file. Here is an example of a successful upload:
```
MinidumpUploader.exe Information: 0 : Dump available 139e411a23934dc0b9ea08a626db16c5.dmp
    DateTime=2017-05-25T14:25:08.0349846Z
MinidumpUploader.exe Information: 0 : Uploading D:\local\Temp\Dumps\c12a605e73c44346a984e00000000000\139e411a23934dc0b9ea08a626db16c5.dmp, 329.12 MB
    DateTime=2017-05-25T14:25:16.0145444Z
MinidumpUploader.exe Information: 0 : Upload successful.
    DateTime=2017-05-25T14:25:42.9164120Z
MinidumpUploader.exe Information: 0 : Extracting PDB info from D:\local\Temp\Dumps\c12a605e73c44346a984e00000000000\139e411a23934dc0b9ea08a626db16c5.dmp.
    DateTime=2017-05-25T14:25:42.9164120Z
MinidumpUploader.exe Information: 0 : Matched 2 PDB(s) with local files.
    DateTime=2017-05-25T14:25:44.2310982Z
MinidumpUploader.exe Information: 0 : Stamp does not want any of our matched PDBs.
    DateTime=2017-05-25T14:25:44.5435948Z
MinidumpUploader.exe Information: 0 : Deleted D:\local\Temp\Dumps\c12a605e73c44346a984e00000000000\139e411a23934dc0b9ea08a626db16c5.dmp
    DateTime=2017-05-25T14:25:44.6095821Z
```

In the example above, the instrumentation key is `c12a605e73c44346a984e00000000000`. This value should match the instrumentation key for your application.
The minidump is associated with a snapshot with the ID of `139e411a23934dc0b9ea08a626db16c5`. You can use this ID later to locate the associated exception telemetry in Application Insights Analytics.

The uploader scans for new PDBs, roughly once every 15 minutes. Here is an example of that:
```
MinidumpUploader.exe Information: 0 : PDB rescan requested.
    DateTime=2017-05-25T15:11:38.8003886Z
MinidumpUploader.exe Information: 0 : Scanning D:\home\site\wwwroot\ for local PDBs.
    DateTime=2017-05-25T15:11:38.8003886Z
MinidumpUploader.exe Information: 0 : Scanning D:\local\Temporary ASP.NET Files\root\a6554c94\e3ad6f22\assembly\dl3\81d5008b\00b93cc8_dec5d201 for local PDBs.
    DateTime=2017-05-25T15:11:38.8160276Z
MinidumpUploader.exe Information: 0 : Local PDB scan complete. Found 2 PDB(s).
    DateTime=2017-05-25T15:11:38.8316450Z
MinidumpUploader.exe Information: 0 : Deleted PDB scan marker D:\local\Temp\Dumps\c12a605e73c44346a984e00000000000\.pdbscan.
    DateTime=2017-05-25T15:11:38.8316450Z
```

For applications _not_ hosted in Azure App Service, the uploader logs are in the same folder as the minidumps: `%TEMP%\Dumps\<ikey>` (where `<ikey>` is your instrumentation key).

### 3. Check Application Insights Analytics for exceptions with snapshots

When a snapshot is created, the throwing exception is tagged with a snapshot ID and that snapshot ID is transmitted, along with the exception telemetry to Application Insights. You can use Application Insights Analytics to search for exceptions with snapshots using the following query:
```sql
    exceptions
    | where isnotnull(customDimensions["ai.snapshot.id"])
```

If this query returns no results, then no snapshots were reported to Application Insights for your application in the selected time range.

If you want to search for a specific snapshot ID that you found in the Uploader logs, then the query should look like this:
```sql
    exceptions
    | where customDimensions["ai.snapshot.id"] == "139e411a23934dc0b9ea08a626db16c5"
```

If this query returns no results for a snapshot that you know has been uploaded, then
1. Double-check you're looking at the right Application Insights resource by verifying the instrumentation key.
2. Extend the time range of the query if necessary to include the time when the snapshot was created. You can use the timestamp in the Uploader log to help.

If you still don't see an exception with that snapshot id, then the exception telemetry wasn't reported to Application Insights. This can happen if your application crashed after taking the snapshot, but before reporting the exception telemetry. In this case, check the App Service logs under `Diagnose and solve problems` to see if there were unexpected restarts or unhandled exceptions.

## Next Steps

* [Set snappoints in your code](https://azure.microsoft.com/blog/snapshot-debugger-for-azure/) - get snapshots without waiting for an exception.
* [Diagnose exceptions in your web apps](app-insights-asp-net-exceptions.md) explains how to make more exceptions visible to Application Insights. 
* [Smart Detection](app-insights-proactive-diagnostics.md) automatically discovers performance anomalies.
