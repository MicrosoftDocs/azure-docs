---
title: Azure Communication Services media quality statistics (Android)
titleSuffix: An Azure Communication Services concept article
description: Get usage samples of the media quality statistics feature for Android native.
author: jsaurezle-msft
ms.author: jsaurezlee

services: azure-communication-services
ms.date: 08/09/2023
ms.topic: include
ms.service: azure-communication-services
ms.subservice: calling
---

## Media quality statistics for an ongoing call

Media quality statistics is an extended feature of the core `Call` API. You first need to obtain the `MediaStatsCallFeature` API object:

```java
MediaStatsCallFeature mediaStatsCallFeature = call.feature(Features.MEDIA_STATS);
```

The `MediaStatsCallFeature` object has the following API structure:

- The `OnSampleReportedListener` event listens for periodic reports of the media statistics.
- `setSampleIntervalInSeconds(int value)` sets the interval, in seconds, of the media statistics report generation. If it's not specified, the SDK uses defaults.
- A `MediaStatsReport` object contains the definition of the outgoing and incoming media statistics, categorized by audio, video, and screen share.
  - `getOutgoingMediaStats()`: The list of media statistics for outgoing media.
    - `getAudio()`: The list of media statistics for outgoing audio.
    - `getVideo()`: The list of media statistics for outgoing video.
    - `getScreenShare()`: The list of media statistics for outgoing screen share.
  - `getIncomingStats()`: The list of media statistics for incoming media.
    - `getAudio()`: The list of media statistics for incoming audio.
    - `getVideo()`: The list of media statistics for the incoming video.
    - `getScreenShare()`: The list of media statistics for incoming screen share.
  - `getGeneratedAt()`: The date when the report was generated.
  - `getIncomingMediaStatsFromParticipant`: Gets the `IncomingMediaStats` value for `RemoteParticipant`.

Then, subscribe to the `addOnSampleReportedListener` event to get regular updates about the current media quality statistics:

```java
mediaStatsCallFeature.addOnSampleReportedListener(handleSampleReportedListener);
// Optionally, set the interval for media statistics report generation
mediaStatsCallFeature.setSampleReportedIntervalInSeconds(15);

private void handleSampleReportedListener(MediaStatsReportEvent args) {
    // Obtain the media statistics report instance
    MediaStatsReport report = args.getReport();

    // Obtain the outgoing media statistics for audio
    List<OutgoingAudioMediaStats> outgoingAudioMediaStats = report.getOutgoingMediaStats().getAudio();

    // Obtain the outgoing media statistics for video
    List<OutgoingVideoMediaStats> outgoingVideoMediaStats = report.getOutgoingMediaStats().getVideo();

    // Obtain the outgoing media statistics for screen share
    List<OutgoingScreenShareMediaStats> outgoingScreenShareMediaStats = report.getOutgoingMediaStats().getScreenShare();

    // Obtain the incoming media statistics for audio
    List<IncomingAudioMediaStats> incomingAudioMediaStats = report.getIncomingMediaStats().getAudio();

    // Obtain the incoming media statistics for video
    List<IncomingVideoMediaStats> incomingVideoMediaStats = report.getIncomingMediaStats().getVideo();

    // Obtain the incoming media statistics for screen share
    List<IncomingScreenShareMediaStats> incomingScreenShareMediaStats = report.getIncomingMediaStats().getScreenShare();
}
```

Also, `MediaStatsReport` has a helper method to obtain the `IncomingMediaStats` value for a particular `RemoteParticipant` instance.
For example, to get the `IncomingMediaStats` value for all the remote participants in the call, you can use:

```java
private void handleSampleReportedListener(MediaStatsReportEvent args) {
    List<RemoteParticipant> remoteParticipants = call.getRemoteParticipants();
    for (RemoteParticipant remoteParticipant : remoteParticipants) {
    {
        IncomingMediaStatsInfo incomingMediaStatsInfo = report.getIncomingMediaStatsFromParticipant(remoteParticipant.getIdentifier());
        // Obtain the incoming media statistics for audio
        List<IncomingAudioMediaStats> incomingAudioMediaStats = incomingMediaStatsInfo.getAudio();
    
        // Obtain the incoming media statistics for video
        List<IncomingVideoMediaStats> incomingVideoMediaStats = incomingMediaStatsInfo.getVideo();
    
        // Obtain the incoming media statistics for screen share
        List<IncomingScreenShareMediaStats> incomingScreenShareMediaStats = incomingMediaStatsInfo.getScreenShare();
    }
}
```

[!INCLUDE [native metrics](media-stats-native-metrics.md)]
