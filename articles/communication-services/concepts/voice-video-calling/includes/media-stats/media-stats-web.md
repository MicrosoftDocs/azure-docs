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
> There's an interface update on media quality statistics in the SDK, beginning with the SDK version 1.20.1

Media quality statistics is an extended feature of the core `Call` API. You first need to obtain the `mediaStatsFeature` API object:

```js
const mediaStatsFeature = call.feature(Features.MediaStats);
```

To receive the media statistics data, you can subscribe `sampleReported` event or `summaryReported` event.

`sampleReported` event triggers every second. It's suitable as a data source for UI display or your own data pipeline.

`summaryReported` event contains the aggregated values of the data over intervals, which is useful when you just need a summary.

If you want control over the interval of the `summaryReported` event, you need to define `mediaStatsCollectorOptions` of type `MediaStatsCollectorOptions`.
Otherwise, the SDK uses default values.


```js
const mediaStatsCollectorOptions: SDK.MediaStatsCollectorOptions = {
    aggregationInterval: 10,
    dataPointsPerAggregation: 6
};

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
It's not necessary to call `dispose` method of `mediaStatsCollector` every time when the call ends, as the collectorsare reclaimed internally when the call ends.

### MediaStatsCollectorOptions

The `MediaStatsCollectorOptions` is optional, and there are two optional fields in `MediaStatsCollectorOptions`.

- `aggregationInterval` is the interval, in seconds, that the statistics are aggregated. The default value is 10.
- `dataPointsPerAggregation` defines how many data points each aggregation event has. The default value is 6.

These two values determine the frequency at which the SDK emits `summaryReported` event and the number of aggregated data points included in the report.

The `summaryReported` event raised every `aggregationInterval * dataPointsPerAggregation` seconds.

For example, if you set the following values:

- `aggregationInterval` = 1
- `dataPointsPerAggregation` = 60

The `summaryReported` event is raised every 60 seconds and contains 60 unique units for each statistic recorded.

If you set the following values:

- `aggregatinInterval` = 60
- `dataPointsPerAggregation` = 1

The `summaryReported` event is raised every 60 seconds and contains 1 unique unit for each statistic recorded.

## Best practices

If you want to collect the data for offline inspection, we recommend that you collect the data and send it to your pipeline ingestion after your call ends. If you transmit the data during a call, it could use internet bandwidth needed to continue an Azure Communication Services call (especially when available bandwidth is low).

In either `sampleReported` event or `summaryReported` event, the media statistics data are not just a simple key-value mapping.

Here is the type declaration of the event data reported by `sampleReported` event.

```typescript
export interface MediaStatsReportSample {
    audio: {
        send: OutgoingAudioMediaStats<number, string>[];
        receive: IncomingAudioMediaStats<number, string>[];
    };
    video: {
        send: OutgoingVideoMediaStats<number, string>[];
        receive: IncomingVideoMediaStats<number, string>[];
    };
    screenShare: {
        send: OutgoingScreenShareMediaStats<number, string>[];
        receive: IncomingScreenShareMediaStats<number, string>[];
    };
    transports: TransportMediaStats<number>[];
}

```
The event data provide the statistics data for each media stream in the call, including both send and receive directions.

It's recommended that you print the event using the `console.log` to observe its layout and value changes, so you can find a proper way to display or process the data according to your usage scenario.

### Audio send metrics

| Metric name | Description | Comments |
| ----------- | ----------- | -------- |
| `id` | Statistics ID | Used to identify statistics across the events, especially when there are multiple statistics with the same media type and direction in an event. |
| `codecName` | Codec name | OPUS, G722.|
| `bitrate` | Audio send bit rate (bits per second) | General values are in the 24-Kbps range (36-128 Kbps is typical). |
| `jitterInMs` | Packet jitter (milliseconds) | Lower is better. |
| `packets` | The total number of packets sent. | |
| `packetsPerSecond` | Packet rate (packets per second) | |
| `packetsLost` | The total number of packets lost reported from the remote end. | |
| `packetsLostPerSecond` | Packet loss rate (packets per second) | Lower is better. |
| `rttInMs` | Round-trip time (milliseconds) | Lower is better. Calculated from the RTCP receiver report. We recommend a round-trip time of 200 ms or less. |
| `audioInputLevel` | Audio volume level from the microphone | The value ranges from 0 to 65536. A value of 0 represents silence. |
| `transportId` | Transport ID | Used to associate the stats in transports.|

### Audio receive metrics

In the SDK versions ealier than 1.20.1, `jitterBufferDelayInMs` existed as `jitterBufferInMs`.

| Metric name | Description | Comments |
| ----------- | ----------- | -------- |
| `id` | Statistics ID | Used to identify statistics across the events, especially when there are multiple statistics with the same media type and direction in an event. |
| `codecName` | Codec name | OPUS, G722.|
| `bitrate` | Audio receive bitrate (bits per second) | General values are in the 24-Kbps range (36-128 Kbps is typical). |
| `jitterInMs` | Packet jitter (milliseconds) | Lower is better. |
| `packets` | The total number of packets received. | |
| `packetsPerSecond` | Packet rate (packets per second) | |
| `packetsLost` | The total number of packets lost. | |
| `packetsLostPerSecond` | Packet loss rate (packets per second) | Lower is better. |
| `jitterBufferDelayInMs` | Jitter buffer (milliseconds) | Lower is better. The jitter buffer is used for smooth playout. This value is how long the packets of the samples stay in the jitter buffer. |
| `audioOutputLevel` | Audio volume level from the receiving stream | The value ranges from 0 to 65536. A value of 0 represents silence. |
| `healedRatio` | Ratio of concealed samples (except `silentConcealedSamples`) to total received samples | Information only. |
| `transportId` | Transport ID | Used to associate the stats in transports.|

### Video send metrics

Starting from SDK version 1.20.1, the video send metrics included the `altLayouts` metric field, which allows for a better representation of simulcast stream statistics.

| Metric name | Description | Comments |
| ----------- | ----------- | -------- |
| `id` | Statistics ID | Used to identify statistics across the events, especially when there are multiple statistics with the same media type and direction in an event. |
| `codecName` | Codec name | H264, VP8, VP9. |
| `bitrate` | Video send bitrate (bits per second) | |
| `jitterInMs` | Packet jitter (milliseconds) | Lower is better. |
| `packets` | The total number of packets sent. | |
| `packetsPerSecond` | Packet rate (packets per second) | |
| `packetsLost` | The total number of packets lost reported from the remote end. | |
| `packetsLostPerSecond` | Packet loss rate (packets per second) | Lower is better. |
| `rttInMs` | Round-trip time (milliseconds) | Lower is better. Calculated from the RTCP receiver report. We recommend a round-trip time of 200 ms or less. |
| `frameRateInput` | Frame rate that originates from the video source (frames per second) | |
| `frameWidthInput` | Frame width of the last frame that originates from the video source (pixels) | |
| `frameHeightInput` | Frame height of the last frame that originates from the video source (pixels) | |
| `framesEncoded` | The number of frames successfully encoded for the RTP stream. | |
| `frameRateEncoded` | Frame rate successfully encoded for the RTP stream (frames per second) | |
| `framesSent` | The number of frames sent on the RTP stream | |
| `frameRateSent` | Frame rate sent on the RTP stream (frames per second) | |
| `frameWidthSent` | Frame width of the encoded frame (pixel) | |
| `frameHeightSent` | Frame height of the encoded frame (pixel) | |
| `keyFramesEncoded` | Key frames successfully encoded for the RTP stream  | |
| `transportId` | Transport ID | Used to associate the stats in transports.|
| `altLayouts` | Simulcast streams | `altLayouts` contains the same metrics to the video send |

### Video receive metrics

In the SDK versions earlier than 1.20.1, `jitterBufferDelayInMs` existed as `jitterBufferInMs`.

| Metric name | Description | Comments |
| ----------- | ----------- | -------- |
| `id` | Statistics ID | Used to identify statistics across the events, especially when there are multiple statistics with the same media type and direction in an event. |
| `codecName` | Codec name | H264, VP8, VP9. |
| `bitrate` | Video receive bitrate (bits per second) | |
| `jitterInMs` | Packet jitter (milliseconds) | Lower is better. |
| `packets` | The total number of packets received. | |
| `packetsPerSecond` | Packet rate (packets per second) | |
| `packetsLost` | The total number of packets lost. | |
| `packetsLostPerSecond` | Packet loss rate (packets per second) | Lower is better. |
| `rttInMs` | Round-trip time (milliseconds) | Lower is better. Calculated from the RTCP sender report. We recommend a round-trip time of 200 ms or less. |
| `streamId` | Stream ID | The `streamId` value corresponds to `id` in `VideoStreamCommon`. It can be used to match the sender. |
| `jitterBufferDelayInMs` | Jitter buffer (milliseconds) | Lower is better. The jitter buffer is used for smooth playout. This value is how long the packets of the frames stay in the jitter buffer. |
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
| `transportId` | Transport ID | Used to associate the stats in transports.|

### Screen-share send metrics

Currently, statistics fields are the same as *video send metrics*.

### Screen-share receive metrics

Currently, statistics fields are the same as *video receive metrics*.

### Transport metrics

The transport related metrics were separated out after ACS Web SDK 1.20.1.

In earlier versions, `rttInMs` existed as `pairRttInMs` in the stats for audio, video, and screenShare.

`availableIncomingBitrate` was `availableBitrate` in the receive stats for audio, video, and screenShare.

`availableOutgoingBitrate` was `availableBitrate` in the send stats for audio, video, and screenShare.

| Metric name | Description | Comments |
| ----------- | ----------- | -------- |
| `id` | Transport ID | Used to associate with the transportId in other stats |
| `rttInMs` | Round-trip time (milliseconds) | The value is calculated from the STUN connectivity check. We recommend a round-trip time of 200 ms or less. |
| `availableIncomingBitrate` | Bandwidth estimation (bits per second) | The value may not be available depending on the bandwidth estimation algorithm used in the WebRTC session |
| `availableOutgoingBitrate` | Bandwidth estimation (bits per second) | The value may not be available depending on the bandwidth estimation algorithm used in the WebRTC session |

## What are changed in SDK version 1.20.1 (GA)

We now support MediaStats feature API in 1.20.1 (GA).
Compared to the previous beta versions, we also made some minor changes to the API interface in this GA version.

In the previous beta versions, `pairRttInMs`, `availableBitrate` were included in audio, video, and screenShare statistics.
Now, these metrics have been separated into transport metrics.

We introduced `packets`, `packetsLost` metric fields in audio, video, screenShare statistics. These metrics are useful for calculating the total number of packets sent or recieved between two different time points.

The `frameRateOutput` in video and screenShare statistics is removed. You can use `frameRateDecoded` instead.

The metric field `jitterBufferInMs` has been renamed to `jitterBufferDelayInMs` to provide a clearer description, as this metric indicates the duration of a packet stay in the jitter buffer.
