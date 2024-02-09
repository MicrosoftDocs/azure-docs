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

Media quality statistics is an extended feature of the core `Call` API. You first need to obtain the `mediaStatsCallFeature` API object:

```swift
var mediaStatsCallFeature = self.call?.feature(Features.mediaStats)
```

The `mediaStatsCallFeature` object has the following API structure:

- The `didReceiveSample` delegate method listens for periodic reports of the media statistics.
- `sampleIntervalInSeconds` gets and sets the interval, in seconds, of the media statistics report generation. If it's not specified, the SDK uses defaults.
- A `MediaStatsReport` object contains the definition of the outgoing and incoming media statistics, categorized by audio, video, and screen share.
  - `OutgoingMediaStats`: The list of media statistics for outgoing media.
    - `audio`: The list of media statistics for the outgoing audio.
    - `video`: The list of media statistics for the outgoing video.
    - `screenShare`: The list of media statistics for the outgoing screen share.
  - `OncomingStats`: The list of media statistics for incoming media.
    - `audio`: The list of media statistics for the incoming audio.
    - `video`: The list of media statistics for the incoming video.
    - `screenShare`: The list of media statistics for the incoming screen share.
  - `generatedAt`: The date when the report was generated.
  - `incomingMediaStats`: Gets the `IncomingMediaStats` value for `RemoteParticipant`.

Then, subscribe to the `SampleReported` event to get regular updates about the current media quality statistics:

```swift
// Optionally, set the interval for media statistics report generation
mediaStatsCallFeature.sampleIntervalInSeconds = 15
mediaStatsCallFeature.delegate = MediaStatsDelegate()


public class MediaStatsDelegate : MediaStatsCallFeatureDelegate
{
    public func mediaStatsCallFeature(_ mediaStatsCallFeature: MediaStatsCallFeature, didReceiveSample args: MediaStatsReportEventArgs) {
        let report = args.report

        // Obtain the outgoing media statistics for audio
        let outgoingAudioMediaStats = report.outgoingMediaStats.audio
    
        // Obtain the outgoing media statistics for video
        let outgoingVideoMediaStats = report.outgoingMediaStats.video
    
        // Obtain the outgoing media statistics for screen share
        let outgoingScreenShareMediaStats = report.outgoingMediaStats.screenShare
    
        // Obtain the incoming media statistics for audio
        let incomingAudioMediaStats = report.incomingMediaStats.audio
    
        // Obtain the incoming media statistics for video
        let incomingVideoMediaStats = report.incomingMediaStats.video
    
        // Obtain the incoming media statistics for screen share
        let incomingScreenShareMediaStats = report.incomingMediaStats.screenShare
    }
}
```

Also, `MediaStatsReport` has a helper method to obtain the `IncomingMediaStats` value for a particular `RemoteParticipant` instance.
For example, to get the `IncomingMediaStats` value for all the remote participants in the call, you can use:

```swift
public class MediaStatsDelegate : MediaStatsCallFeatureDelegate
{
    public func mediaStatsCallFeature(_ mediaStatsCallFeature: MediaStatsCallFeature, didReceiveSample args: MediaStatsReportEventArgs) {
        let report = args.report

        call.remoteParticipants.forEach{ remoteParticipant in
            let remoteIncomingMediaStats = report.incomingMediaStats(fromParticipant: remoteParticipant.identifier)

            // Obtain the incoming media statistics for audio
            let incomingAudioMediaStats = remoteIncomingMediaStats.audio
        
            // Obtain the incoming media statistics for video
            let incomingVideoMediaStats = remoteIncomingMediaStats.video
        
            // Obtain the incoming media statistics for screen share
            let incomingScreenShareMediaStats = remoteIncomingMediaStats.screenShare
        }
    }
}
```

[!INCLUDE [native metrics](media-stats-native-metrics.md)]
