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

Media quality statistics is an extended feature of the core `Call` API. You first need to obtain the `MediaStatisticsCallFeature` API object:

```java
MediaStatisticsCallFeature mediaStatisticsCallFeature = call.feature(Features.MEDIA_STATISTICS);
```

The `MediaStatisticsCallFeature` object has the following API structure:

- The `OnReportReceivedListener` event listens for periodic reports of the media statistics.
- `getReportIntervalInSeconds` gets the interval, in seconds, of the media statistics report generation. The SDK uses `10` second as default.
- `updateReportIntervalInSeconds()` updates the interval, in seconds, of the media statistics report generation. The SDK uses `10` second as default.
- A `MediaStatisticsReport` contains the definition of the outgoing and incoming media statistics, categorized by audio, video, and screen share.
  - `getOutgoingStatistics()`: The list of media statistics for outgoing media.
    - `getAudioStatistics()`: The list of media statistics for outgoing audio.
    - `getVideoStatistics()`: The list of media statistics for outgoing video.
    - `getScreenShareStatistics()`: The list of media statistics for outgoing screen share.
    - `getDataChannelStatistics()`: The list of media statistics for data channel.
  - `getIncomingStatistics()`: The list of media statistics for incoming media.
    - `getAudioStatistics()`: The list of media statistics for incoming audio.
    - `getVideoStatistics()`: The list of media statistics for the incoming video.
    - `getScreenShareStatistics()`: The list of media statistics for incoming screen share.
    - `getDataChannelStatistics()`: The list of media statistics for data channel.
  - `getLastUpdatedAt()`: The date when the report was generated.

Then, subscribe to the `addOnReportReceivedListener` event to get regular updates about the current media quality statistics:

```java
mediaStatisticsCallFeature.addOnReportReceivedListener(handleReportReceivedListener);
// Optionally, set the interval for media statistics report generation
mediaStatisticsCallFeature.updateReportIntervalInSeconds(15);

private void handleReportReceivedListener(MediaStatisticssReportEvent args) {
    // Obtain the media statistics report instance
    MediaStatisticsReport report = args.getReport();

    // Obtain the outgoing media statistics for audio
    List<OutgoingAudioStatistics> outgoingAudioStatistics = report.getOutgoingStatistics().getAudioStatistics();

    // Obtain the outgoing media statistics for video
    List<OutgoingVideoStatistics> outgoingVideoStatistics = report.getOutgoingStatistics().getVideoStatistics();

    // Obtain the outgoing media statistics for screen share
    List<OutgoingScreenShareStatistics> outgoingScreenShareStatistics = report.getOutgoingStatistics().getScreenShareStatistics();

    // Obtain the outgoing media statistics for data channel
    List<OutgoingDataChannelStatistics> outgoingDataChannelStatistics = report.getOutgoingStatistics().getDataChannelStatistics();

    // Obtain the incoming media statistics for audio
    List<IncomingAudioStatistics> incomingAudioStatistics = report.getIncomingStatistics().getAudioStatistics();

    // Obtain the incoming media statistics for video
    List<IncomingVideoStatistics> incomingVideoStatistics = report.getIncomingStatistics().getVideoStatistics();

    // Obtain the incoming media statistics for screen share
    List<IncomingScreenShareStatistics> incomingScreenShareStatistics = report.getIncomingStatistics().getScreenShareStatistics();

    // Obtain the incoming media statistics for data channel
    List<IncomingDataChannelStatistics> incomingDataChannelStatistics = report.getIncomingStatistics().getDataChannelStatistics();
}
```

[!INCLUDE [native metrics](media-stats-native-metrics.md)]
