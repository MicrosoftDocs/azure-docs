---
title: Azure Communication Services pre-call diagnostics
titleSuffix: An Azure Communication Services concept document
description: Overview of the pre-call diagnostic API feature.
author: yassirbisteni
manager: bobgao
services: azure-communication-services
ms.author: ybisteni
ms.date: 22/11/2024
ms.topic: conceptual
ms.service: azure-communication-services
---

# Pre-Call diagnostics

[!INCLUDE [Public Preview Disclaimer](../../includes/public-preview-include.md)]

The pre-call API feature enables developers to programmatically validate a client’s readiness to join an Azure Communication Services call. You can only access pre-call features using the Calling SDK. The pre-call diagnostic feature provides multiple diagnostics including device, connection, and call quality. The pre-call diagnotic feature is available only for Web (JavaScript). We plan to enable these capabilities across platforms in the future. Provide us with [feedback](../../support.md) about which platforms you want to see pre-call diagnostics enabled.

## Pre-Call diagnostics accesss

To access pre-call diagnostics, you need to initialize a `CallClient`, and provision an Azure Communication Services access token. Then you can access the `PreCallDiagnostics` feature and the `startTest` method.

```java
String acsToken = "";
try
{
    CommunicationTokenCredential credential = new CommunicationTokenCredential(acsToken);
    CallClient callClient = new CallClient();

    PreCallDiagnosticsCallClientFeature preCallDiagnosticsFeature = callClient.feature(Features.PRE_CALL_DIAGNOSTICS);

    preCallDiagnosticsFeature.addOnDiagnosticsReadyListener(this::OnPreCallDiagnosticsReady);
    preCallDiagnosticsFeature.startTest(context, credential);
}
catch (Exception ex) { }
```

Once it finishes running, developers can access the result object.

## Diagnostic results

Pre-call diagnostics returns a full diagnostic of the device including details like availability and compatibility, call quality statistics, and in-call diagnostics. The results are returned as a `PreCallDiagnosticsReadyEvent` object.

```java
public void OnPreCallDiagnosticsReady(PreCallDiagnosticsReadyEvent args)
{
    PreCallDiagnostics diagnostics = args.getDiagnostics();
    MediaStatisticsReport mediaStatsReport = diagnostics.getMediaStatisticsReport();

    OutgoingMediaStatistics outgoingStatsList = mediaStatsReport.getOutgoingStatistics();
    if (outgoingStatsList != null)
    {
        List<OutgoingVideoStatistics> videoStatsList = outgoingStatsList.getVideoStatistics();
        List<OutgoingScreenShareStatistics> screenShareStatsList = outgoingStatsList.getScreenShareStatistics();
        List<OutgoingAudioStatistics> audioStatsList = outgoingStatsList.getAudioStatistics();
    }

    IncomingMediaStatistics incomingStatsList = mediaStatsReport.getIncomingStatistics();
    if (incomingStatsList != null)
    {
        List<IncomingVideoStatistics> videoStatsList = incomingStatsList.getVideoStatistics();
        List<IncomingScreenShareStatistics> screenShareStatsList = incomingStatsList.getScreenShareStatistics();
        List<IncomingAudioStatistics> audioStatsList = incomingStatsList.getAudioStatistics();
    }
}
```

You can access individual result objects using the `PreCallDiagnosticsReadyEvent` type. Results for individual tests are returned as they're completed with many of the test results being available immediately. The results might take up to 1 minute as the test validates the quality of the video and audio.

### Device permissions

The permission check determines whether video and audio devices are available from a permissions perspective. Provides `boolean` value for `audio` and `video` devices. 

```java
List<DevicePermissionType> permissionList = preCallDiagnosticsFeature.getDevicePermissions(context);
```

## Pricing

When the pre-call diagnostic test runs behind the scenes, it uses calling minutes to run the diagnostic. The test lasts for roughly 30 seconds, using up 30 seconds of calling time which is charged at the standard rate of $0.004 per participant per minute. For the case of pre-call diagnostics, the charge is for 1 participant x 30 seconds = $0.002. 

## Next steps

- [Check your network condition with the diagnostics tool](../developer-tools/network-diagnostic.md)
- [Explore User-Facing Diagnostic APIs](../voice-video-calling/user-facing-diagnostics.md)
- [Enable Media Quality Statistics in your application](../voice-video-calling/media-quality-sdk.md)
- [Consume call logs with Azure Monitor](../analytics/logs/voice-and-video-logs.md)