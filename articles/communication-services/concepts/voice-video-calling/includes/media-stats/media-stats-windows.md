---
title: Azure Communication Services Media Stats (Windows)
titleSuffix: An Azure Communication Services concept document
description: Provides usage samples of the Media Stats feature Windows Native.
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

Media quality statistics is an extended feature of the core `CommunicationCall` API. You first need to obtain the MediaStats feature API object:

```csharp
MediaStatsCallFeature mediaStatsCallFeature = call.Features.MediaStats;
```

The Media Stats feature object have the following API structure:
- `SampleReported`: Event for listening for periodic reports of the Media Stats.
- `SampleIntervalInSeconds`: Gets and sets the interval in seconds of the Media Stats report generation. If not specified, sdk use defaults.
- A `MediaStatsReport` object that contains the definition of the Outgoing and Incoming Media Stats categorized by Audio, Video and Screen Share.
  - `OutgoingMediaStats`: The list of Media Stats for Outgoing media.
    - `Audio`: The list of Media Stats for the Outgoing Audio.
    - `Video`: The list of Media Stats for the Outgoing Video.
    - `ScreenShare`: The list of Media Stats for the Outgoing Screen Share. 
  - `IncomingStats`: The list of Media Stats for Incoming media.
    - `Audio`: The list of Media Stats for the Incoming Audio.
    - `Video`: The list of Media Stats for the Incoming Video.
    - `ScreenShare`: The list of Media Stats for the Incoming Screen Share. 
  - `GeneratedAt`: The date when the report was generated.
  - `GetIncomingMediaStatsFromParticipant`: Gets the `IncomingMediaStats` for a `RemoteParticipant`.

Then, subscribe to the `SampleReported` event to get regular updates about the current media quality statistics:

```csharp
mediaStatsCallFeature.SampleReported += MediaStatsCallFeature_SampleReported;
// Optional, set the interval for Media Stats report generation
mediaStatsCallFeature.SampleReportedIntervalInSeconds = 15;

private void MediaStatsCallFeature_SampleReported(object sender, MediaStatsReportEventArgs args)
    // Obtain the Media Stats Report instance.
    MediaStatsReport report = args.Report;

    // Obtain the Outgoing Media Stats for Audio
    IReadOnlyList<OutgoingAudioMediaStats> outgoingAudioMediaStats = report.OutgoingMediaStats.Audio;

    // Obtain the Outgoing Media Stats for Video
    IReadOnlyList<OutgoingVideoMediaStats> outgoingVideoMediaStats = report.OutgoingMediaStats.Video;

    // Obtain the Outgoing Media Stats for Screen Share
    IReadOnlyList<OutgoingScreenShareMediaStats> outgoingScreenShareMediaStats = report.OutgoingMediaStats.ScreenShare;

    // Obtain the Incoming Media Stats for Audio
    IReadOnlyList<IncomingAudioMediaStats> incomingAudioMediaStats = report.IncomingMediaStats.Audio;

    // Obtain the Incoming Media Stats for Video
    IReadOnlyList<IncomingVideoMediaStats> incomingVideoMediaStats = report.IncomingMediaStats.Video;

    // Obtain the Incoming Media Stats for Screen Share
    IReadOnlyList<IncomingScreenShareMediaStats> incomingScreenShareMediaStats = report.IncomingMediaStats.ScreenShare;
}
```

Also, `MediaStatsReport` have a helper method to obtain the `IncomingMediaStats` for a particular `RemoteParticipant`.
For example, in order to get the `IncomingMediaStats` for all the `RemoteParticipants` in the call you can:

```csharp
private void MediaStatsCallFeature_SampleReported(object sender, MediaStatsReportEventArgs args)
    List<RemoteParticipant> remoteParticipants = call.RemoteParticipants.ToList<RemoteParticipant>();
    foreach (RemoteParticipant remoteParticipant in remoteParticipants)
    {
        IncomingMediaStatsDetails incomingMediaStatsDetails = report.GetIncomingMediaStatsFromParticipant(remoteParticipant.Identifier);
        // Obtain the Incoming Media Stats for Audio
        IReadOnlyList<IncomingAudioMediaStats> incomingAudioMediaStats = incomingMediaStatsDetails.Audio;
    
        // Obtain the Incoming Media Stats for Video
        IReadOnlyList<IncomingVideoMediaStats> incomingVideoMediaStats = incomingMediaStatsDetails.Video;
    
        // Obtain the Incoming Media Stats for Screen Share
        IReadOnlyList<IncomingScreenShareMediaStats> incomingScreenShareMediaStats = incomingMediaStatsDetails.ScreenShare;
    }
}
```

[!INCLUDE [native matrics](media-stats-native-metrics.md)]
