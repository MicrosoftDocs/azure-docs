---
title: Azure Communication Services media quality statistics (iOS)
titleSuffix: An Azure Communication Services concept document
description: Get usage samples of the media quality statistics feature for iOS native.
author: jsaurezle-msft
ms.author: jsaurezlee

services: azure-communication-services
ms.date: 08/09/2023
ms.topic: include
ms.service: azure-communication-services
ms.subservice: calling
---

## Media quality statistics for an ongoing call

Media quality statistics is an extended feature of the core `Call` API. You first need to obtain the `mediaStatisticsCallFeature` API object:

```swift
var mediaStatisticsCallFeature = self.call.feature(Features.mediaStatistics)
```

The `mediaStatisticsCallFeature` object has the following API structure:

- The `didReceiveReport` delegate method listens for periodic reports of the media statistics.
- `reportIntervalInSeconds` gets the interval, in seconds, of the media statistics report generation. The SDK uses `10` second as default.
- `updateReportInterval(inSeconds)` updates the interval, in seconds, of the media statistics report generation. The SDK uses `10` second as default.
- A `MediaStatisticsReport` object contains the definition of the outgoing and incoming media statistics, categorized by audio, video, and screen share.
  - `outgoingMediaStatistics`: The list of media statistics for outgoing media.
    - `audio`: The list of media statistics for the outgoing audio.
    - `video`: The list of media statistics for the outgoing video.
    - `screenShare`: The list of media statistics for the outgoing screen share.
    - `dataChannel`: The list of media statistics for the outgoing data channel.
  - `incomingMediaStatistics`: The list of media statistics for incoming media.
    - `audio`: The list of media statistics for the incoming audio.
    - `video`: The list of media statistics for the incoming video.
    - `screenShare`: The list of media statistics for the incoming screen share.
    - `dataChannel`: The list of media statistics for the incoming data channel.
  - `lastUpdated`: The date when the report was generated.

Then, implement the `didReceiveReport` delegate to get regular updates about the current media quality statistics:

```swift
// Optionally, set the interval for media statistics report generation
mediaStatisticsCallFeature.updateReportInterval(inSeconds: 15)
mediaStatisticsCallFeature.delegate = MediaStatisticsDelegate()


public class MediaStatisticsDelegate : MediaStatisticsCallFeatureDelegate
{
    public func mediaStatisticsCallFeature(_ mediaStatisticsCallFeature: MediaStatisticsCallFeature,
                                      didReceiveReport args: MediaStatisticsReportReceivedEventArgs) {
        let report = args.report

        // Obtain the outgoing media statistics for audio
        let outgoingAudioStatistics = report.outgoingStatistics.audio
    
        // Obtain the outgoing media statistics for video
        let outgoingVideoStatistics = report.outgoingStatistics.video
    
        // Obtain the outgoing media statistics for screen share
        let outgoingScreenShareStatistics = report.outgoingStatistics.screenShare

        // Obtain the outgoing media statistics for data channel
        let outgoingDataChannelStatistics = report.outgoingStatistics.dataChannel
    
        // Obtain the incoming media statistics for audio
        let incomingAudioStatistics = report.incomingStatistics.audio
    
        // Obtain the incoming media statistics for video
        let incomingVideoStatistics = report.incomingStatistics.video
    
        // Obtain the incoming media statistics for screen share
        let incomingScreenShareStatistics = report.incomingStatistics.screenShare

        // Obtain the incoming media statistics for data channel
        let incomingDataChannelStatistics = report.incomingStatistics.dataChannel
    }
}
```

[!INCLUDE [native metrics](media-stats-native-metrics.md)]
