---
title: Azure Communication Services media quality statistics (Windows)
titleSuffix: An Azure Communication Services concept article
description: Get usage samples of the media quality statistics feature for Windows native.
author: jsaurezle-msft
ms.author: jsaurezlee

services: azure-communication-services
ms.date: 08/09/2023
ms.topic: include
ms.service: azure-communication-services
ms.subservice: calling
---

## Media quality statistics for an ongoing call

Media quality statistics is an extended feature of the core `CommunicationCall` API. You first need to obtain the `MediaStatsCallFeature` API object:

```csharp
MediaStatsCallFeature mediaStatsCallFeature = call.Features.MediaStats;
```

The `MediaStatsCallFeature` feature object has the following API structure:

- The `SampleReported` event listens for periodic reports of the media statistics.
- `SampleIntervalInSeconds` gets and sets the interval, in seconds, of the media statistics report generation. If it's not specified, the SDK uses defaults.
- A `MediaStatsReport` object contains the definition of the outgoing and incoming media statistics, categorized by audio, video, and screen share.
  - `OutgoingMediaStats`: The list of media statistics for outgoing media.
    - `Audio`: The list of media statistics for the outgoing audio.
    - `Video`: The list of media statistics for the outgoing video.
    - `ScreenShare`: The list of media statistics for the outgoing screen share.
  - `IncomingStats`: The list of media statistics for incoming media.
    - `Audio`: The list of media statistics for the incoming audio.
    - `Video`: The list of media statistics for the incoming video.
    - `ScreenShare`: The list of media statistics for the incoming screen share.
  - `GeneratedAt`: The date when the report was generated.
  - `GetIncomingMediaStatsFromParticipant`: Gets the `IncomingMediaStats` value for `RemoteParticipant`.

Then, subscribe to the `SampleReported` event to get regular updates about the current media quality statistics:

```csharp
mediaStatsCallFeature.SampleReported += MediaStatsCallFeature_SampleReported;
// Optionally, set the interval for media statistics report generation
mediaStatsCallFeature.SampleReportedIntervalInSeconds = 15;

private void MediaStatsCallFeature_SampleReported(object sender, MediaStatsReportEventArgs args)
    // Obtain the media statistics report instance
    MediaStatsReport report = args.Report;

    // Obtain the outgoing media statistics for audio
    IReadOnlyList<OutgoingAudioMediaStats> outgoingAudioMediaStats = report.OutgoingMediaStats.Audio;

    // Obtain the outgoing media statistics for video
    IReadOnlyList<OutgoingVideoMediaStats> outgoingVideoMediaStats = report.OutgoingMediaStats.Video;

    // Obtain the outgoing media statistics for screen share
    IReadOnlyList<OutgoingScreenShareMediaStats> outgoingScreenShareMediaStats = report.OutgoingMediaStats.ScreenShare;

    // Obtain the incoming media statistics for audio
    IReadOnlyList<IncomingAudioMediaStats> incomingAudioMediaStats = report.IncomingMediaStats.Audio;

    // Obtain the incoming media statistics for video
    IReadOnlyList<IncomingVideoMediaStats> incomingVideoMediaStats = report.IncomingMediaStats.Video;

    // Obtain the incoming media statistics for screen share
    IReadOnlyList<IncomingScreenShareMediaStats> incomingScreenShareMediaStats = report.IncomingMediaStats.ScreenShare;
}
```

Also, `MediaStatsReport` has a helper method to obtain the `IncomingMediaStats` value for a particular `RemoteParticipant` instance.
For example, to get the `IncomingMediaStats` value for all the remote participants in the call, you can use:

```csharp
private void MediaStatsCallFeature_SampleReported(object sender, MediaStatsReportEventArgs args)
    List<RemoteParticipant> remoteParticipants = call.RemoteParticipants.ToList<RemoteParticipant>();
    foreach (RemoteParticipant remoteParticipant in remoteParticipants)
    {
        IncomingMediaStatsDetails incomingMediaStatsDetails = report.GetIncomingMediaStatsFromParticipant(remoteParticipant.Identifier);
        // Obtain the incoming media statistics for audio
        IReadOnlyList<IncomingAudioMediaStats> incomingAudioMediaStats = incomingMediaStatsDetails.Audio;
    
        // Obtain the incoming media statistics for video
        IReadOnlyList<IncomingVideoMediaStats> incomingVideoMediaStats = incomingMediaStatsDetails.Video;
    
        // Obtain the incoming media statistics for screen share
        IReadOnlyList<IncomingScreenShareMediaStats> incomingScreenShareMediaStats = incomingMediaStatsDetails.ScreenShare;
    }
}
```

[!INCLUDE [native metrics](media-stats-native-metrics.md)]
