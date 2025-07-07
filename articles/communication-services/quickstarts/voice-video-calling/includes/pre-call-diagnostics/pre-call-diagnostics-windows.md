---
title: Azure Communication Services pre-call diagnostics
titleSuffix: An Azure Communication Services concept document
description: Overview of the pre-call diagnostic API feature.
author: yassirbisteni
manager: bobgao
services: azure-communication-services
ms.author: yassirb
ms.date: 12/12/2024
ms.topic: conceptual
ms.service: azure-communication-services
---

## Pre-call diagnostics

[!INCLUDE [Public Preview Disclaimer](../../../../includes/public-preview-include.md)]

The pre-call API feature allows developers to programmatically validate a client’s readiness to join an Azure Communication Services call. You can only access pre-call features using the Calling SDK. The pre-call diagnostic feature provides multiple diagnostics including device, connection, and call quality. Provide us with [feedback](../../../../support.md) about which platforms you want to see pre-call diagnostics enabled.

### Pre-call diagnostics access

To access pre-call diagnostics, you need to initialize a `CallClient`, and provision an Azure Communication Services access token. Then you can access the `PreCallDiagnostics` feature and the `startTest` method.

```c#
string acsToken = "";
try
{
    var credential = new CallTokenCredential(acsToken);
    var callClient = new CallClient();

    var features = callClient.Features;
    var preCallDiagnosticsFeature = features.PreCallDiagnostics;

    preCallDiagnosticsFeature.DiagnosticsReady += DiagnosticsReady;
    await preCallDiagnosticsFeature.StartTestAsync(credential);
}
catch (Exception ex) { }
```

Once it finishes running, developers can access the result object.

### Diagnostic results

Pre-call diagnostics return a full diagnostic of the device including details like availability and compatibility, call quality statistics, and in-call diagnostics. The results are returned as a `PreCallDiagnosticsReadyEvent` object.

```c#
private void DiagnosticsReady(object sender, PreCallDiagnosticsReadyEventArgs args)
{
    var diagnostics = args.Diagnostics;
    var mediaStatsReport = diagnostics.MediaStatisticsReport;

    var outgoingStatsList = mediaStatsReport.OutgoingStatistics;
    if (outgoingStatsList != null)
    {
        var videoStatsList = outgoingStatsList.Video;
        var ScreenShareStatsList = outgoingStatsList.ScreenShare;
        var audioStatsList = outgoingStatsList.Audio;
    }

    var incomingStatsList = mediaStatsReport.IncomingStatistics;
    if (incomingStatsList != null)
    {
        var videoStatsList = incomingStatsList.Video;
        var ScreenShareStatsList = incomingStatsList.ScreenShare;
        var audioStatsList = incomingStatsList.Audio;
    }
}
```

You can access individual result objects using the `PreCallDiagnosticsReadyEvent` type. Results for individual tests are returned as they are completed with many of the test results being available immediately. The results might take up to 1 minute as the test validates the quality of the video and audio.

### Device permissions

The permission check determines whether video and audio devices are available from a permissions perspective. Provides `boolean` value for `audio` and `video` devices. 

```c#
var permissionList = preCallDiagnosticsFeature.DevicePermissions;
```