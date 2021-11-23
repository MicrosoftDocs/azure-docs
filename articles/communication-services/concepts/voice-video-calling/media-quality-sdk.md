---
title: Azure Communication Services User Facing Diagnostics
titleSuffix: An Azure Communication Services concept document
description: Provides an overview of the ACS media quality statics SDK.
author: sloanster
ms.author: micahvivion
manager: nmurav

services: azure-communication-services
ms.date: 11/22/2021
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: calling
---

# Media qualiy metrics 

When working with calls in Azure Communication Services, there will be times that you want to know the low level media quality metrics that are being generated within an ACS call. To help underedstand these details, we have a feature called "Media Quality staticis" that you can use to examine the low levey audi, video, and screen sharing metrics.

### Media quality metrics for ongoing call
> **NOTE**
> This API is provided as a preview for developers and may change based on feedback that we receive. Do not use this API in a production environment. To use this api please use 'beta' release of ACS Calling Web SDK

Media quality stats is an extended feature of the core `Call` API. You first need to obtain the MediaStats feature API object:

```js
const mediaStatsFeature = call.feature(Features.MediaStats);
```

Then, define `mediaStatsCollectorOptions` of type `MediaStatsCollectorOptions` if you want control over intervals. Otherwise SDK will use defaults.

```js
const mediaStatsCollectorOptions: SDK.MediaStatsCollectorOptions = {
    aggregationInterval: 2,
    dataPointsPerAggregation: 20
};
```

Then, get media stats colector by invoking `startCollector` method of `mediaStatsApi` with optional `mediaStatsSubscriptionOptions`.

```js
const mediaStatsCollector = mediaStatsFeature.startCollector(mediaStatsSubscriptionOptions);
```

After getting media stats collector, you will receive `mediaStatsEmitted` event with stats every `aggregationIntervalMs * dataPointsPerAggregation` milliseconds.

```js
mediaStatsCollector.on('mediaStatsEmitted', (mediaStats) => {
    console.log('media stats:', mediaStats.stats);
    console.log('media stats collectionInterval:', mediaStats.collectionInterval);
    console.log('media stats aggregationInterval:', mediaStats.aggregationInterval);
});
```

To dispose media stats collector, invoke `dispose` method of `mediaStatsCollector`.

```js
mediaStatsCollector.dispose();
```

To dispose all collectors, invoke `disposeAllCollectors` method of `mediaStatsApi`.

```js
mediaStatsFeature.disposeAllCollectors();
```
### Bandwidth Metrics
| Metric Name    | Purpose              | Detailed explanation                                                    | Comments                                                                      |
| -------------- | -------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| SentBWEstimate | Bandwidth estimation | Average video bandwidth allocated for the channel bps (bits per second) | 1.5 MBps or higher is recommended for high quality video for upload/download. |


### Audio Quality Metrics
| Metric Name               | Purpose                      | Details                                                                                                                                                                               | Comments                                                     |
| ------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| audioSendBitrate          | Sent bitrate                 | Send bitrate of audio (bits per second)                                                                                                                                               | General values are in the 24 kbps range (36-128kbps typical) |
| audioRecvBitrate          | Received bitrate             | Received bitrate of audio received (bits per second)                                                                                                                                  |                                                              |
| audioSendPackets          | Sent packets                 | The number of audio packets sent in last second (packets per second)                                                                                                                  |                                                              |
| audioRecvJitterBufferMs   | Received Jitter              | Jitter is the amount of difference in packet delay (in milliseconds (ms))                                                                                                             | Typically, an audio jitter of 30 ms or less is recommended.  |
| audioRecvPacketsLost      | Received packet loss         | The number of audio packets that were to be received but were lost. Results are packets per second (over the last second).                                                            | Lower is better.                                             |
| audioSendPacketsLost      | Sent packet loss             | The number of audio packets sent that were lost (not received) in the last second.  Results are packets per second (over the last second).                                            | Lower is better.                                             |
| audioRecvPackets          | Received packets             | The number of audio packets received in the last second. Results are packets per second (over the last second).                                                                       | Information only.                                            |
| audioSendCodecName        | Sent codec                   | Audio CODEC used.                                                                                                                                                                     | Information only.                                            |
| audioSendRtt              | Send Round Trip Time         | Response time between your system and ACS server. Results are in milliseconds (ms).                                                                                                   | A round trip time of 200 ms or less is recommended.          |
| audioSendPairRtt          | Send Pair Round Trip Time    | Rtt for entire transport. Results are in milliseconds (ms).                                                                                                                           | A round trip time of 200 ms or less is recommended.          |
| audioRecvPairRtt          | Receive Pair Round Trip Time | Rtt for entire transport Results are in milliseconds (ms).                                                                                                                            | A round trip time of 200 ms or less is recommended.          |
| audioSendAudioInputLevel  | Input level for microphone   | Sent audio playout level. If source data is between 0-1,  media stack multiplies it with 0xFFFF. Depends on microphone. Used to confirm if microphone is silent (no incoming energy). | Microphone input level.                                      |
| audioRecvAudioOutputLevel | Speaker output level.        | Received audio playout level.  If source data is between 0-1,  media stack multiplies it with 0xFFFF.                                                                                 | Speaker output level.                                        |


### Video Quality Metrics
| Metric Name                    | Purpose                          | Details                                                                                                                                  | Comments                                                                                         |
| ------------------------------ | -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| videoSendFrameRateSent         | Sent frame rate                  | Number of video frames sent. Results are frames per second                                                                               | Higher is better:<br>25-30 fps (360p or better)<br>8-15 fps (270p or lower)<br>Frames/second<br> |
| videoSendFrameWidthSent        | Sent width                       | Video width resolution sent.                                                                                                             | Higher is better. Possible values:<br>1920, 1280, 960, 640, 480, 320                             |
| videoSendFrameHeightSent       | Sent height                      | Video height sent. Higher is better                                                                                                      | Higher is better. Possible values:<br>1080, 720, 540, 360, 270, 240                              |
| videoSendBitrate               | Sent bitrate                     | Amount of video bitrate being sent. Results are bps (bits per second)                                                                    |                                                                                                  |
| videoSendPackets               | Sent packets                     | The number of video packets sent. Results are packets per second (over the last second).                                                 | Information only                                                                                 |
| VideoSendCodecName             | Sent codec                       | Video CODEC used for encoding video                                                                                                      | VP8 (1:1 calls) and H264                                                                         |
| videoRecvJitterBufferMs        | Received Jitter                  | Jitter is the amount of difference in packet delay (in milliseconds (ms))                                                                | Lower is better.                                                                                 |
| videoSendRtt                   | Send Round Trip Time             | Response time between your system and ACS server. Lower is better                                                                        | A round trip time of 200 ms or less is recommended.                                              |
| videoSendPairRtt               | Send Pair Round Trip Time        | Response time between your system and ACS server. Results are in milliseconds (ms).                                                      | A round trip time of 200 ms or less is recommended.                                              |
| videoRecvPairRtt               | Receive Pair Round Trip Time     | Rtt for entire transport. Results are in milliseconds (ms).                                                                              | A round trip time of 200 ms or less is recommended.                                              |
| videoRecvFrameRateReceived     | Received frame rate              | Frame rate of video currently received                                                                                                   | 25-30 fps (360p or better)<br>8-15 fps (270p or lower)                                           |
| videoRecvFrameWidthReceived    | Received width                   | Width of video currently received                                                                                                        | 1920, 1280, 960, 640, 480, 320                                                                   |
| videoRecvFrameHeightReceived   | Received height                  | Height of video currently received                                                                                                       | 1080, 720, 540, 360, 270, 240                                                                    |
| videoRecvBitrate               | Received bitrate                 | Bitrate of video currently received (bits per second)                                                                                    | Information only,                                                                                |
| videoRecvPackets               | Received packets                 | The number of packets received in last second                                                                                            | Information only                                                                                 |
| VideoRecvPacketsLost           | Received packet loss             | The results of a bad network                                                                                                             | Lower is better                                                                                  |
| videoSendPacketsLost           | Sent packet loss                 | The results of a bad network                                                                                                             | Lower is better                                                                                  |
| videoSendFrameRateInput        | Sent framerate input             | Framerate measurements from the stream input into peerConnection                                                                         | Information only                                                                                 |
| videoRecvFrameRateDecoded      | Received decoded framerate       | Framerate from decoder output. This takes  videoSendFrameRateInput as an input, might be some loss in decoding                           | Information only                                                                                 |
| videoSendFrameWidthInput       | Sent frame width input           | Frame width of the stream input into peerConnection. This takes  videoRecvFrameRateDecoded as an input, might be some loss in rendering. | 1920, 1280, 960, 640, 480, 320                                                                   |
| videoSendFrameHeightInput      | Sent frame height input          | Frame height of the stream input into peerConnection                                                                                     | 1080, 720, 540, 360, 270, 240                                                                    |
| videoRecvLongestFreezeDuration | Received longest freeze duration | How long was the longest freeze                                                                                                          | Lower is better                                                                                  |
| videoRecvTotalFreezeDuration   | Received total freeze duration   | Total freeze duration in seconds                                                                                                         | Lower is better                                                                                  |

### Screen Share Quality Metrics
| Metric Name                            | Purpose                          | Details                                                          | Comments                              |
| -------------------------------------- | -------------------------------- | ---------------------------------------------------------------- | ------------------------------------- |
| screenSharingSendFrameRateSent         | Sent frame rate                  | Number of video frames sent. Higher is better                    | 1-30 FPS (content aware, variable)    |
| screenSharingSendFrameWidthSent        | Sent width                       | Video resolution sent. Higher is better                          | 1920 pixels (content aware, variable) |
| screenSharingSendFrameHeightSent       | Sent height                      | Video resolution sent. Higher is better                          | 1080 pixels (content aware, variable) |
| screenSharingSendCodecName             | Sent codec                       | Codec used for encoding screen share                             | Information only                      |
| screenSharingRecvFrameRateReceived     | Received frame rate              | Number of video frames received. Lower is better.                | 1-30 FPS                              |
| screenSharingRecvFrameWidthReceived    | Received width                   | Video resolution received. Higher is better                      | 1920 pixels (content aware, variable) |
| screenSharingRecvFrameHeightReceived   | Received height                  | Video resolution sent. Higher is better                          | 1080 pixels (content aware, variable) |
| screenSharingRecvCodecName             | Received codec                   | Codec used for decoding your video camera feed                   | Information only                      |
| screenSharingRecvJitterBufferMs        | Received Jitter                  | //TODO                                                           | //TODO                                |
| screenSharingRecvPacketsLost           | Received packet loss             | The results of a bad network                                     | Lower is better                       |
| screenSharingSendPacketsLost           | Received packet loss             | The results of a bad network                                     | Lower is better                       |
| screenSharingSendFrameRateInput        | Sent framerate input             | Framerate measurements from the stream input into peerConnection | Information only                      |
| screenSharingRecvFrameRateDecoded      | Received decoded framerate       | Framerate from decoder output                                    | Information only                      |
| screenSharingRecvFrameRateOutput       | Received framerate output        | Framerate of the stream that was sent to renderer                | Information only                      |
| screenSharingSendFrameWidthInput       | Sent frame width input           | Frame width of the stream input into peerConnection              | Information only                      |
| screenSharingSendFrameHeightInput      | Sent frame height input          | Frame height of the stream input into peerConnection             | Information only                      |
| screenSharingRecvLongestFreezeDuration | Received longest freeze duration | How long was the longest freeze                                  | Lower is better                       |
| screenSharingRecvTotalFreezeDuration   | Received total freeze duration   | Total freeze duration in seconds                                 | Lower is better                       |
