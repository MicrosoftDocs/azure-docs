---
title: Azure Communication Services Media Stats (iOS)
titleSuffix: An Azure Communication Services concept document
description: Provides usage samples of the Media Stats feature iOS Native.
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

```swift
var mediaStatsCallFeature = self.call?.feature(Features.mediaStats)
```

The Media Stats feature object have the following API structure:
- `didReceiveSample`: Delegate method for listening for periodic reports of the Media Stats.
- `sampleIntervalInSeconds`: Gets and sets the interval in seconds of the Media Stats report generation. If not specified, sdk use defaults.
- A `MediaStatsReport` object that contains the definition of the Outgoing and Incoming Media Stats categorized by Audio, Video and Screen Share.
  - `OutgoingMediaStats`: The list of Media Stats for Outgoing media.
    - `audio`: The list of Media Stats for the Outgoing Audio.
    - `video`: The list of Media Stats for the Outgoing Video.
    - `screenShare`: The list of Media Stats for the Outgoing Screen Share. 
  - `OncomingStats`: The list of Media Stats for Incoming media.
    - `audio`: The list of Media Stats for the Incoming Audio.
    - `video`: The list of Media Stats for the Incoming Video.
    - `screenShare`: The list of Media Stats for the Incoming Screen Share. 
  - `generatedAt`: The date when the report was generated.
  - `incomingMediaStats`: Gets the `IncomingMediaStats` for a `RemoteParticipant`.

Then, subscribe to the `SampleReported` event to get regular updates about the current media quality statistics:

```swift
// Optional, set the interval for Media Stats report generation
mediaStatsCallFeature.sampleIntervalInSeconds = 15
mediaStatsCallFeature.delegate = MediaStatsDelegate()


public class MediaStatsDelegate : MediaStatsCallFeatureDelegate
{
    public func mediaStatsCallFeature(_ mediaStatsCallFeature: MediaStatsCallFeature, didReceiveSample args: MediaStatsReportEventArgs) {
        let report = args.report

        // Obtain the Outgoing Media Stats for Audio
        let outgoingAudioMediaStats = report.outgoingMediaStats.audio
    
        // Obtain the Outgoing Media Stats for Video
        let outgoingVideoMediaStats = report.outgoingMediaStats.video
    
        // Obtain the Outgoing Media Stats for Screen Share
        let outgoingScreenShareMediaStats = report.outgoingMediaStats.screenShare
    
        // Obtain the Incoming Media Stats for Audio
        let incomingAudioMediaStats = report.incomingMediaStats.audio
    
        // Obtain the Incoming Media Stats for Video
        let incomingVideoMediaStats = report.incomingMediaStats.video
    
        // Obtain the Incoming Media Stats for Screen Share
        let incomingScreenShareMediaStats = report.incomingMediaStats.screenShare
    }
}
```

Also, `MediaStatsReport` have a helper method to obtain the `IncomingMediaStats` for a particular `RemoteParticipant`.
For example, in order to get the `IncomingMediaStats` for all the `RemoteParticipants` in the call you can:

```swift
public class MediaStatsDelegate : MediaStatsCallFeatureDelegate
{
    public func mediaStatsCallFeature(_ mediaStatsCallFeature: MediaStatsCallFeature, didReceiveSample args: MediaStatsReportEventArgs) {
        let report = args.report

        call.remoteParticipants.forEach{ remoteParticipant in
            let remoteIncomingMediaStats = report.incomingMediaStats(fromParticipant: remoteParticipant.identifier)

            // Obtain the Incoming Media Stats for Audio
            let incomingAudioMediaStats = remoteIncomingMediaStats.audio
        
            // Obtain the Incoming Media Stats for Video
            let incomingVideoMediaStats = remoteIncomingMediaStats.video
        
            // Obtain the Incoming Media Stats for Screen Share
            let incomingScreenShareMediaStats = remoteIncomingMediaStats.screenShare
        }
    }
}
```

[!INCLUDE [native matrics](media-stats-native-metrics.md)]
