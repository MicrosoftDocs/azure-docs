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

Media quality statistics is an extended feature of the core `CommunicationCall` API. You first need to obtain the `MediaStatisticsCallFeature` API object:

```csharp
MediaStatisticsCallFeature mediaStatisticsCallFeature = call.Features.MediaStatistics;
```

The `MediaStatisticsCallFeature` feature object has the following API structure:

- The `ReportReceived` event listens for periodic reports of the media statistics.
- `ReportIntervalInSeconds` gets the interval, in seconds, of the media statistics report generation. The SDK uses `10` second as default.
- `UpdateReportIntervalInSeconds()` updates the interval, in seconds, of the media statistics report generation. The SDK uses `10` second as default.
- A `MediaStatisticsReport` object contains the definition of the outgoing and incoming media statistics, categorized by audio, video, and screen share.
  - `OutgoingMediaStatistics`: The list of media statistics for outgoing media.
    - `Audio`: The list of media statistics for the outgoing audio.
    - `Video`: The list of media statistics for the outgoing video.
    - `ScreenShare`: The list of media statistics for the outgoing screen share.
    - `DataChannel`: The list of media statistics for the outgoing data channel.
  - `IncomingMediaStatistics`: The list of media statistics for incoming media.
    - `Audio`: The list of media statistics for the incoming audio.
    - `Video`: The list of media statistics for the incoming video.
    - `ScreenShare`: The list of media statistics for the incoming screen share.
    - `DataChannel`: The list of media statistics for the incoming data channel.
  - `LastUpdateAt`: The date when the report was generated.

Then, subscribe to the `SampleReported` event to get regular updates about the current media quality statistics:

```csharp
mediaStatisticsCallFeature.ReportReceived += MediaStatisticsCallFeature_ReportReceived;
// Optionally, set the interval for media statistics report generation
mediaStatisticsCallFeature.UpdateReportIntervalInSeconds(15);

private void MediaStatisticsCallFeature_ReportReceived(object sender, MediaStatisticsReportReceivedEventArgs args)
    // Obtain the media statistics report instance
    MediaStatisticsReport report = args.Report;

    // Obtain the outgoing media statistics for audio
    IReadOnlyList<OutgoingAudioStatistics> outgoingAudioStatistics = report.OutgoingStatistics.Audio;

    // Obtain the outgoing media statistics for video
    IReadOnlyList<OutgoingVideoStatistics> outgoingVideoStatistics = report.OutgoingStatistics.Video;

    // Obtain the outgoing media statistics for screen share
    IReadOnlyList<OutgoingScreenShareStatistics> outgoingScreenShareStatistics = report.OutgoingStatistics.ScreenShare;

    // Obtain the outgoing media statistics for data channel
    IReadOnlyList<OutgoingDataChannelStatistics> outgoingDataChannelStatistics = report.OutgoingStatistics.DataChannel;

    // Obtain the incoming media statistics for audio
    IReadOnlyList<IncomingAudioStatistics> incomingAudioStatistics = report.IncomingStatistics.Audio;

    // Obtain the incoming media statistics for video
    IReadOnlyList<IncomingVideoStatistics> incomingVideoStatistics = report.IncomingStatistics.Video;

    // Obtain the incoming media statistics for screen share
    IReadOnlyList<IncomingScreenShareStatistics> incomingScreenShareStatistics = report.IncomingStatistics.ScreenShare;

    // Obtain the incoming media statistics for data channel
    IReadOnlyList<IncomingDataChannelStatistics> incomingDataChannelStatistics = report.IncomingStatistics.DataChannel;
}
```

[!INCLUDE [native metrics](media-stats-native-metrics.md)]
