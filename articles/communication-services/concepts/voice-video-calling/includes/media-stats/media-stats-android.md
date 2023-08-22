---
title: Azure Communication Services Media Stats (Android)
titleSuffix: An Azure Communication Services concept document
description: Provides usage samples of the Media Stats feature Android Native.
author: jsaurezle-msft
ms.author: jsaurezlee

services: azure-communication-services
ms.date: 08/09/2023
ms.topic: include
ms.service: azure-communication-services
ms.subservice: calling
---

## Media quality statistics for ongoing call

[!INCLUDE [public-preview-notes](../../../../includes/public-preview-include.md)]

Media quality statistics is an extended feature of the core `Call` API. You first need to obtain the MediaStats feature API object:

```java
MediaStatsCallFeature mediaStatsCallFeature = call.feature(Features.MEDIA_STATS);
```

The Media Stats feature object have the following API structure:
- `OnSampleReportedListener`: Event for listening for periodic reports of the Media Stats.
- `setSampleIntervalInSeconds(int value)`: Sets the interval in seconds of the Media Stats report generation. If not specified, sdk use defaults.
- A `MediaStatsReport` object that contains the definition of the Outgoing and Incoming Media Stats categorized by Audio, Video and Screen Share.
  - `getOutgoingMediaStats()`: The list of Media Stats for Outgoing media.
    - `getAudio()`: The list of Media Stats for the Outgoing Audio.
    - `getVideo()`: The list of Media Stats for the Outgoing Video.
    - `getScreenShare()`: The list of Media Stats for the Outgoing Screen Share. 
  - `getIncomingStats()`: The list of Media Stats for Incoming media.
    - `getAudio()`: The list of Media Stats for the Incoming Audio.
    - `getVideo()`: The list of Media Stats for the Incoming Video.
    - `getScreenShare()`: The list of Media Stats for the Incoming Screen Share. 
  - `getGeneratedAt()`: The date when the report was generated.
  - `getIncomingMediaStatsFromParticipant`: Gets the `IncomingMediaStats` for a `RemoteParticipant`.

Then, subscribe to the `addOnSampleReportedListener` event to get regular updates about the current media quality statistics:

```java
mediaStatsCallFeature.addOnSampleReportedListener(handleSampleReportedListener);
// Optional, set the interval for Media Stats report generation
mediaStatsCallFeature.setSampleReportedIntervalInSeconds(15);

private void handleSampleReportedListener(MediaStatsReportEvent args) {
    // Obtain the Media Stats Report instance.
    MediaStatsReport report = args.getReport();

    // Obtain the Outgoing Media Stats for Audio
    List<OutgoingAudioMediaStats> outgoingAudioMediaStats = report.getOutgoingMediaStats().getAudio();

    // Obtain the Outgoing Media Stats for Video
    List<OutgoingVideoMediaStats> outgoingVideoMediaStats = report.getOutgoingMediaStats().getVideo();

    // Obtain the Outgoing Media Stats for Screen Share
    List<OutgoingScreenShareMediaStats> outgoingScreenShareMediaStats = report.getOutgoingMediaStats().getScreenShare();

    // Obtain the Incoming Media Stats for Audio
    List<IncomingAudioMediaStats> incomingAudioMediaStats = report.getIncomingMediaStats().getAudio();

    // Obtain the Incoming Media Stats for Video
    List<IncomingVideoMediaStats> incomingVideoMediaStats = report.getIncomingMediaStats().getVideo();

    // Obtain the Incoming Media Stats for Screen Share
    List<IncomingScreenShareMediaStats> incomingScreenShareMediaStats = report.getIncomingMediaStats().getScreenShare();
}
```

Also, `MediaStatsReport` have a helper method to obtain the `IncomingMediaStats` for a particular `RemoteParticipant`.
For example, in order to get the `IncomingMediaStats` for all the `RemoteParticipants` in the call you can:

```java
private void handleSampleReportedListener(MediaStatsReportEvent args) {
    List<RemoteParticipant> remoteParticipants = call.getRemoteParticipants();
    for (RemoteParticipant remoteParticipant : remoteParticipants) {
    {
        IncomingMediaStatsInfo incomingMediaStatsInfo = report.getIncomingMediaStatsFromParticipant(remoteParticipant.getIdentifier());
        // Obtain the Incoming Media Stats for Audio
        List<IncomingAudioMediaStats> incomingAudioMediaStats = incomingMediaStatsInfo.getAudio();
    
        // Obtain the Incoming Media Stats for Video
        List<IncomingVideoMediaStats> incomingVideoMediaStats = incomingMediaStatsInfo.getVideo();
    
        // Obtain the Incoming Media Stats for Screen Share
        List<IncomingScreenShareMediaStats> incomingScreenShareMediaStats = incomingMediaStatsInfo.getScreenShare();
    }
}
```

[!INCLUDE [native matrics](media-stats-native-metrics.md)]
