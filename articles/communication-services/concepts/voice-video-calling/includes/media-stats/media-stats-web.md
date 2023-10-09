---
title: Azure Communication Services media quality statistics (web)
titleSuffix: An Azure Communication Services concept article
description: Get usage samples of the media quality statistics feature for the web.
author: jsaurezle-msft
ms.author: jsaurezlee

services: azure-communication-services
ms.date: 08/09/2023
ms.topic: include
ms.service: azure-communication-services
ms.subservice: calling
---

## Media quality statistics for an ongoing call

> [!IMPORTANT]
> There's an API breaking change on media quality statistics in the SDK, beginning with version 1.8.0-beta.1.

Media quality statistics is an extended feature of the core `Call` API. You first need to obtain the `mediaStatsFeature` API object:

```js
const mediaStatsFeature = call.feature(Features.MediaStats);
```

Then, define `mediaStatsCollectorOptions` of type `MediaStatsCollectorOptions` if you want control over intervals. Otherwise, the SDK uses default values.

```js
const mediaStatsCollectorOptions: SDK.MediaStatsCollectorOptions = {
    aggregationInterval: 10,
    dataPointsPerAggregation: 6
};
```

In the preceding code:

- `aggregationInterval` is the interval, in seconds, that the statistics will be aggregated.
- `dataPointsPerAggregation` defines how many data points each aggregation event has.

After you add an event listener to the media statistics collector, you receive a `mediaStatsEmitted` or `summaryReported` event with statistics every `aggregationInterval * dataPointsPerAggregation` seconds.

For example, if you set the following values:

- `aggregationInterval` = 1
- `dataPointsPerAggregation` = 60

The `mediaStatsEmitted` or `summaryReported` event is raised every 60 seconds and contains 60 unique units for each statistic recorded.

If you set the following values:

- `aggregatinInterval` = 60
- `dataPointsPerAggregation` = 1

The `mediaStatsEmitted` or `summaryReported` event is raised every 60 seconds and contains 1 unique unit for each statistic recorded.

### SDK version 1.8.0 or later

As a developer, you can invoke the `createCollector` method with optional `mediaStatsSubscriptionOptions`.
To receive the media statistics data, you can subscribe `sampleReported` event or `summaryReported` event.
`sampleReported` event triggers every second. It is suitable as a data source for UI display or your own data pipeline.
`summaryReported` event contains the aggregated values of the data over intervals, which is useful when you just need a summary.

```js
const mediaStatsCollector = mediaStatsFeature.createCollector(mediaStatsSubscriptionOptions);

mediaStatsCollector.on('sampleReported', (sample) => {
    console.log('media stats sample', sample);
});

mediaStatsCollector.on('summaryReported', (summary) => {
    console.log('media stats summary', summary);
});
```

In case you don't need to use the media statistics collector, you can call `dispose` method of `mediaStatsCollector`.

```js
mediaStatsCollector.dispose();
```
It is not necessary to call `dispose` method of `mediaStatsCollector` every time when the call ends, as the collectors will be reclaimed internally when the call ends.
However, if you are using SDK version less than 1.8.0-beta.1, you need use `disposeAllCollectors` API to release the resource.

## Best practices

If you want to collect the data for offline inspection, we recommend that you collect the data and send it to your pipeline ingestion after your call ends. If you transmit the data during a call, it could use internet bandwidth that's needed to continue an Azure Communication Services call (especially when available bandwidth is low).

## Media quality statistics metrics for SDK version 1.8.0 or later

In either `sampleReported` event or `summaryReported` event, the media statistics data are not just a simple key-value mapping.

Here is the type declaration of the event data reported by `sampleReported` event.
```typescript
export interface MediaStatsReportSample {
    audio: {
        send: AudioSendMediaStats<MediaStatRawValue>[];
        receive: AudioRecvMediaStats<MediaStatRawValue>[];
    };
    video: {
        send: VideoSendMediaStats<MediaStatRawValue>[];
        receive: VideoRecvMediaStats<MediaStatRawValue>[];
    };
    screenShare: {
        send: ScreenShareSendMediaStats<MediaStatRawValue>[];
        receive: ScreenShareRecvMediaStats<MediaStatRawValue>[];
    };
}

```
The event data provide the statistics data for each media stream in the call, including both send and recv directions.
It is recommended that you print out the event using the `console.log` to observe its layout and value changes, so you can find a proper way to display or process the data according to your usage scenario.


The bandwidth metrics have changes to `availableBitrate` in audio send and video send metrics.

### Audio send metrics

| Metric name | Description | Comments |
| ----------- | ----------- | -------- |
| `id` | Statistics ID | It's used to identify statistics across the events, especially when there are multiple statistics with the same media type and direction in an event. |
| `codecName` | Codec name | OPUS, G722.|
| `bitrate` | Audio send bit rate (bits per second) | General values are in the 24-Kbps range (36-128 Kbps is typical). |
| `jitterInMs` | Packet jitter (milliseconds) | Lower is better. |
| `packetsPerSecond` | Packet rate (packets per second) | |
| `packetsLostPerSecond` | Packet loss rate (packets per second) | Lower is better. |
| `rttInMs` | Round-trip time (milliseconds) | Lower is better. It's calculated from the RTCP receiver report. We recommend a round-trip time of 200 ms or less. |
| `pairRttInMs` | Round-trip time (milliseconds) | Lower is better. It's similar to `rttInMS` but is calculated from the STUN connectivity check. We recommend a round-trip time of 200 ms or less. |
| `availableBitrate` | Bandwidth estimation (bits per second) | |
| `audioInputLevel` | Audio volume level from the microphone | The value ranges from 0 to 65536. A value of 0 represents silence. |

### Audio receive metrics

| Metric name | Description | Comments |
| ----------- | ----------- | -------- |
| `id` | Statistics ID | It's used to identify statistics across the events, especially when there are multiple statistics with the same media type and direction in an event. |
| `codecName` | Codec name | OPUS, G722.|
| `bitrate` | Audio receive bitrate (bits per second) | General values are in the 24-Kbps range (36-128 Kbps is typical). |
| `jitterInMs` | Packet jitter (milliseconds) | Lower is better. |
| `packetsPerSecond` | Packet rate (packets per second) | |
| `packetsLostPerSecond` | Packet loss rate (packets per second) | Lower is better. |
| `pairRttInMs` | Round-trip time (milliseconds) | Lower is better. It's calculated from the STUN connectivity check. We recommend a round-trip time of 200 ms or less. |
| `jitterBufferInMs` | Jitter buffer (milliseconds) | Lower is better. The jitter buffer is used for smooth playout. This value is how long the packets of the samples stay in the jitter buffer. |
| `audioOutputLevel` | Audio volume level from the receiving stream | The value ranges from 0 to 65536. A value of 0 represents silence. |
| `healedRatio` | Ratio of concealed samples (except `silentConcealedSamples`) to total received samples | Information only. |

### Video send metrics

| Metric name | Description | Comments |
| ----------- | ----------- | -------- |
| `id` | Statistics ID | It's used to identify statistics across the events, especially when there are multiple statistics with the same media type and direction in an event. |
| `codecName` | Codec name | H264, VP8, VP9. |
| `bitrate` | Video send bitrate (bits per second) | |
| `jitterInMs` | Packet jitter (milliseconds) | Lower is better. |
| `packetsPerSecond` | Packet rate (packets per second) | |
| `packetsLostPerSecond` | Packet loss rate (packets per second) | Lower is better. |
| `rttInMs` | Round-trip time (milliseconds) | Lower is better. It's calculated from the RTCP receiver report. We recommend a round-trip time of 200 ms or less. |
| `pairRttInMs` | Round-trip time (milliseconds) | Lower is better. It's similar to `rttInMS` but is calculated from the STUN connectivity check. We recommend a round-trip time of 200 ms or less. |
| `availableBitrate` | Bandwidth estimation (bits per second) | We recommend 1.5 Mbps or higher for high-quality video for upload/download. |
| `frameRateInput` | Frame rate that originates from the video source (frames per second) | |
| `frameWidthInput` | Frame width of the last frame that originates from the video source (pixels) | |
| `frameHeightInput` | Frame height of the last frame that originates from the video source (pixels) | |
| `frameRateEncoded` | Frame rate successfully encoded for the RTP stream (frames per second) | |
| `frameRateSent` | Frame rate sent on the RTP stream (frames per second) | |
| `frameWidthSent` | Frame width of the encoded frame (pixel) | |
| `frameHeightSent` | Frame height of the encoded frame (pixel) | |
| `framesSent` | frames sent on the RTP stream | |
| `framesEncoded` | Frames successfully encoded for the RTP stream | |
| `keyFramesEncoded` | Key frames successfully encoded for the RTP stream  | |

### Video receive metrics

| Metric name | Description | Comments |
| ----------- | ----------- | -------- |
| `id` | Statistics ID | It's used to identify statistics across the events, especially when there are multiple statistics with the same media type and direction in an event. |
| `codecName` | Codec name | H264, VP8, VP9. |
| `bitrate` | Video receive bitrate (bits per second) | |
| `jitterInMs` | Packet jitter (milliseconds) | Lower is better. |
| `packetsPerSecond` | Packet rate (packets per second) | |
| `packetsLostPerSecond` | Packet loss rate (packets per second) | Lower is better. |
| `pairRttInMs` | Round-trip time (milliseconds) | Lower is better. We recommend a round-trip time of 200 ms or less. |
| `jitterBufferInMs` | Jitter buffer (milliseconds) | Lower is better. The jitter buffer is used for smooth playout. This value is how long the packets of the frame stay in the jitter buffer. |
| `streamId` | Stream ID | The `streamId` value corresponds to `id` in `VideoStreamCommon`. It can be used to match the sender. |
| `frameRateOutput` | Frame rate output (frames per second) | |
| `frameRateDecoded` | Frame rate correctly decoded for the RTP stream (frames per second) | |
| `frameRateReceived` | Frame rate received on the RTP stream (frames per second) | |
| `frameWidthReceived` | Frame width of the decoded frame (pixel) | |
| `frameHeightReceived` | Frame height of the decoded frame (pixel) | |
| `longestFreezeDurationInMs` | Longest freeze duration (milliseconds) | |
| `totalFreezeDurationInMs` | Total freeze duration (milliseconds) | |
| `framesReceived` | Total number of frames received on the RTP stream | |
| `framesDecoded` | Total number of frames correctly decoded for the RTP stream | |
| `framesDropped` | Total number of frames dropped | |
| `keyFramesDecoded` | Total number of key frames correctly decoded for the RTP stream | |

### Screen-share send metrics

Currently, statistics fields are the same as *video send metrics*.

### Screen-share receive metrics

Currently, statistics fields are the same as *video receive metrics*.

### Using media quality statistics on SDK versions earlier than 1.8.0

If you're using an Azure Communication Services SDK version earlier than 1.8.0, this section describes how to use this functionality.

As a developer, you can invoke the `startCollector` method with optional `mediaStatsSubscriptionOptions`.

```js
const mediaStatsCollector = mediaStatsFeature.startCollector(mediaStatsSubscriptionOptions);

mediaStatsCollector.on('mediaStatsEmitted', (mediaStats) => {
    console.log('media stats:', mediaStats.stats);
    console.log('media stats collectionInterval:', mediaStats.collectionInterval);
    console.log('media stats aggregationInterval:', mediaStats.aggregationInterval);
});
```

To dispose of the media statistics collector, invoke the `dispose` method of `mediaStatsCollector`.

```js
mediaStatsCollector.dispose();
```

To dispose of all collectors, invoke the `disposeAllCollectors` method of `mediaStatsApi`.

```js
mediaStatsFeature.disposeAllCollectors();
```

### Bandwidth metrics

| Metric name    | Purpose              | Detailed explanation                                                    | Comments                                                                      |
| -------------- | -------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `SentBWEstimate` | Bandwidth estimation | Average video bandwidth allocated for the channel (bits per second) | We recommend 1.5 Mbps or higher for high-quality video for upload/download. |

### Audio quality metrics

| Metric name               | Purpose                      | Details                                                                                                                                                                               | Comments                                                     |
| ------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `audioSendBitrate`          | Sent bitrate                 | Sent bitrate of audio (bits per second).                                                                                                                                              | General values are in the 24-Kbps range (36-128 Kbps is typical). |
| `audioRecvBitrate`          | Received audio bitrate             | Received bitrate of audio (bits per second).                                                                                                                                  |                                                              |
| `audioSendPackets`          | Sent packets                 | Number of audio packets sent in the last second (packets per second).                                                                                                                  |                                                              |
| `audioRecvJitterBufferMs`   | Jitter buffer delay          | The jitter buffer is used for smooth playout. This value is how long the packets of the samples stay in the jitter buffer (in milliseconds).                                                                                                             | Lower is better. |
| `audioRecvPacketsLost`      | Received packet loss         | Number of audio packets that were to be received but were lost. Results are packets per second (over the last second).                                                            | Lower is better.                                             |
| `audioSendPacketsLost`      | Sent packet loss             | Number of audio packets sent that were lost (not received) in the last second.  Results are packets per second (over the last second).                                            | Lower is better.                                             |
| `audioRecvPackets`          | Received packets             | Number of audio packets received in the last second. Results are packets per second (over the last second).                                                                       | Information only.                                            |
| `audioSendCodecName`        | Sent codec                   | Audio codec used.                                                                                                                                                                     | Information only.                                            |
| `audioSendRtt`              | Send round-trip time         | Round-trip time between your system and the Azure Communication Services server. Results are in milliseconds.                                                                                                   | We recommend a round-trip time of 200 ms or less.          |
| `audioSendPairRtt`          | Send pair round-trip time    | Round-trip time for the entire transport. Results are in milliseconds.                                                                                                                           | We recommend a round-trip time of 200 ms or less.          |
| `audioRecvPairRtt`          | Receive pair round-trip time | Round-trip time for the entire transport. Results are in milliseconds.                                                                                                                            | We recommend a round-trip time of 200 ms or less.          |
| `audioSendAudioInputLevel`  | Input level for the microphone   | Sent audio playout level. If source data is between 0 and 1, the media stack multiplies it with `0xFFFF`. It depends on the microphone. Use this metric to confirm if the microphone is silent (no incoming energy). | Microphone input level.                                      |
| `audioRecvAudioOutputLevel` | Speaker output level        | Received audio playout level. If the source data is between 0 and 1, the media stack multiplies it with `0xFFFF`.                                                                                 | Speaker output level.                                        |

### Video quality metrics

| Metric name                    | Purpose                          | Details                                                                                                                                  | Comments                                                                                         |
| ------------------------------ | -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `videoSendFrameRateSent`         | Sent frame rate                  | Number of video frames sent. Results are frames per second.                                                                               | Higher is better. Possible values: 25-30 fps (360p or higher); <br>8-15 fps (270p or lower). |
| `videoSendFrameWidthSent`        | Sent width                       | Video width resolution sent.                                                                                                             | Higher is better. Possible values:<br>1920, 1280, 960, 640, 480, 320.                             |
| `videoSendFrameHeightSent`       | Sent height                      | Video height sent. Higher is better.                                                                                                      | Higher is better. Possible values:<br>1080, 720, 540, 360, 270, 240.                              |
| `videoSendBitrate`               | Sent bitrate                     | Amount of video bitrate sent. Results are bits per second.                                                                    |                                                                                                  |
| `videoSendPackets`               | Sent packets                     | The number of video packets sent. Results are packets per second (over the last second).                                                 | Information only.                                                                                 |
| `VideoSendCodecName`             | Sent codec                       | Video codec used for encoding video.                                                                                                      | Possible values: VP8 (1:1 calls) and H264.                                                                         |
| `videoRecvJitterBufferMs`        | Received jitter                  | The jitter buffer is used for smooth playout. This value is how long the packets of the frame stay in the jitter buffer (in milliseconds).                                                                | Lower is better.                                                                                 |
| `videoSendRtt`                   | Send round-trip time             | Response time between your system and the Azure Communication Services server. Lower is better.                                                                        | We recommend a round-trip time of 200 ms or less.                                              |
| `videoSendPairRtt`               | Send pair round-trip time        | Response time between your system and the Azure Communication Services server. Results are in milliseconds.                                                      | We recommend a round-trip time of 200 ms or less.                                              |
| `videoRecvPairRtt`               | Receive pair round-trip time     | Round-trip time for the entire transport. Results are in milliseconds.                                                                              | We recommend a round-trip time of 200 ms or less.                                              |
| `videoRecvFrameRateReceived`     | Received frame rate              | Frame rate of video currently received.                                                                                                   | Possible values: 25-30 fps (360p or higher);<br>8-15 fps (270p or lower).                                           |
| `videoRecvFrameWidthReceived`    | Received width                   | Width of video currently received.                                                                                                        | Possible values: 1920, 1280, 960, 640, 480, 320.                                                                   |
| `videoRecvFrameHeightReceived`   | Received height                  | Height of video currently received.                                                                                                       | Possible values: 1080, 720, 540, 360, 270, 240.                                                                    |
| `videoRecvBitrate`               | Received bitrate                 | Bitrate of video currently received (bits per second).                                                                                    | Information only.                                                                                |
| `videoRecvPackets`               | Received packets                 | The number of packets received in the last second.                                                                                            | Information only.                                                                                 |
| `VideoRecvPacketsLost`           | Received packet loss             | The number of video packets that were to be received but were lost. Results are packets per second (over the last second).                                                                                                             | Lower is better.                                                                                  |
| `videoSendPacketsLost`           | Sent packet loss                 | The number of audio packets that were sent but were lost. Results are packets per second (over the last second).                                                                                                             | Lower is better.                                                                                  |
| `videoSendFrameRateInput`        | Sent frame-rate input             | Frame-rate measurements from the stream input into `peerConnection`.                                                                         | Information only.                                                                                 |
| `videoRecvFrameRateDecoded`      | Received decoded frame rate       | Frame rate from decoder output. This metric takes `videoSendFrameRateInput` as an input. There might be some loss in decoding.                           | Information only.                                                                                 |
| `videoSendFrameWidthInput`       | Sent frame width input           | Frame width of the stream input into `peerConnection`. This metric takes  `videoRecvFrameRateDecoded` as an input. There might be some loss in rendering. | Possible values: 1920, 1280, 960, 640, 480, 320.                                                                   |
| `videoSendFrameHeightInput`      | Sent frame height input          | Frame height of the stream input into `peerConnection`.                                                                                     | Possible values: 1080, 720, 540, 360, 270, 240.                                                                    |
| `videoRecvLongestFreezeDuration` | Received longest freeze duration | How long the longest freeze was.                                                                                                          | Lower is better.                                                                                  |
| `videoRecvTotalFreezeDuration`   | Received total freeze duration   | Total freeze duration in seconds.                                                                                                         | Lower is better.                                                                                  |

### Screen-share quality metrics

| Metric name                            | Purpose                          | Details                                                          | Comments                              |
| -------------------------------------- | -------------------------------- | ---------------------------------------------------------------- | ------------------------------------- |
| `screenSharingSendFrameRateSent`         | Sent frame rate                  | Number of video frames sent. Higher is better.                    | 1-30 fps (content aware, variable).    |
| `screenSharingSendFrameWidthSent`        | Sent width                       | Video resolution sent. Higher is better.                          | 1920 pixels (content aware, variable). |
| `screenSharingSendFrameHeightSent`       | Sent height                      | Video resolution sent. Higher is better.                          | 1080 pixels (content aware, variable). |
| `screenSharingSendCodecName`             | Sent codec                       | Codec used for encoding a screen share.                             | Information only.                      |
| `screenSharingRecvFrameRateReceived`     | Received frame rate              | Number of video frames received. Lower is better.                | 1-30 fps.                              |
| `screenSharingRecvFrameWidthReceived`    | Received width                   | Video resolution received. Higher is better.                      | 1920 pixels (content aware, variable). |
| `screenSharingRecvFrameHeightReceived`   | Received height                  | Video resolution sent. Higher is better.                          | 1080 pixels (content aware, variable). |
| `screenSharingRecvCodecName`             | Received codec                   | Codec used for decoding the video stream.                             | Information only.                      |
| `screenSharingRecvJitterBufferMs`        | Received jitter                  | The jitter buffer is used for smooth playout. This value is how long the packets of the frame stay in the jitter buffer (in milliseconds).                                                                |                                 |
| `screenSharingRecvPacketsLost`           | Received packet loss             | The number of screen-share packets that were to be received but were lost. Results are packets per second (over the last second).                                     | Lower is better.                       |
| `screenSharingSendPacketsLost`           | Received packet loss             | The number of screen-share packets that were sent and were lost. Results are packets per second (over the last second).                                     | Lower is better.                       |
| `screenSharingSendFrameRateInput`        | Sent frame-rate input             | Frame-rate measurements from the stream input into `peerConnection`. | Information only.                      |
| `screenSharingRecvFrameRateDecoded`      | Received decoded frame rate       | Frame rate from decoder output.                                    | Information only.                      |
| `screenSharingRecvFrameRateOutput`       | Received frame-rate output        | Frame rate of the stream that was sent to the renderer.                | Information only.                      |
| `screenSharingSendFrameWidthInput`       | Sent frame width input           | Frame width of the stream input into `peerConnection`.              | Information only.                      |
| `screenSharingSendFrameHeightInput`      | Sent frame height input          | Frame height of the stream input into `peerConnection`.             | Information only.                      |
| `screenSharingRecvLongestFreezeDuration` | Received longest freeze duration | How long the longest freeze was.                                  | Lower is better.                       |
| `screenSharingRecvTotalFreezeDuration`   | Received total freeze duration   | Total freeze duration in seconds.                                 | Lower is better.                       |
