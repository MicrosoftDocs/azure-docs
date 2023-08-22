---
title: Azure Communication Services Media Stats (Web)
titleSuffix: An Azure Communication Services concept document
description: Provides usage samples of the Media Stats feature for Web.
author: jsaurezle-msft
ms.author: jsaurezlee

services: azure-communication-services
ms.date: 08/09/2023
ms.topic: include
ms.service: azure-communication-services
ms.subservice: calling
---

## Media quality statistics for ongoing call
> [!NOTE]
> This API is provided as a Public Preview ('beta') for developers and may change based on feedback that we receive. Do not use this API in a production environment.

> [!IMPORTANT]
> There is also an API breaking change on MediaStats in the SDK beginning since version 1.8.0-beta.1

Media quality statistics is an extended feature of the core `Call` API. You first need to obtain the MediaStats feature API object:

```js
const mediaStatsFeature = call.feature(Features.MediaStats);
```

Then, define `mediaStatsCollectorOptions` of type `MediaStatsCollectorOptions` if you want control over intervals. Otherwise SDK will use default values.

```js
const mediaStatsCollectorOptions: SDK.MediaStatsCollectorOptions = {
    aggregationInterval: 10,
    dataPointsPerAggregation: 6
};
```

Where
- `aggregationInterval` is the interval in seconds that the statistics will be aggregated. 
- `dataPointsPerAggregation` defines how many data points are there for each aggregation event.

After adding an event listener to media stats collector, you'll receive `mediaStatsEmitted` or `summaryReported` event with stats every `aggregationInterval * dataPointsPerAggregation` seconds.

Example:
- If you set `aggregationInterval` = 1
- `dataPointsPerAggregation` = 60

The media stats `mediaStatsEmitted` or `summaryReported` event will be raised every 60 seconds and will contain 60 unique units for each stat recorded.

- If you set `aggregatinInterval` = 60
- `dataPointsPerAggregation` = 1

The media stats `mediaStatsEmitted` or `summaryReported` event will be raised every 60 seconds and will contain 1 unique unit for each stat recorded.

### SDK Version `>= 1.8.0`

As a developer you can invoke the `createCollector` method with optional `mediaStatsSubscriptionOptions`.

```js
const mediaStatsCollector = mediaStatsFeature.createCollector(mediaStatsSubscriptionOptions);

mediaStatsCollector.on('sampleReported', (sample) => {
    console.log('media stats sample', sample);
});

mediaStatsCollector.on('summaryReported', (summary) => {
    console.log('media stats summary', summary);
});
```
To dispose media stats collector, invoke `dispose` method of `mediaStatsCollector`.

```js
mediaStatsCollector.dispose();
```

We removed `disposeAllCollectors` method. The collectors will be reclaimed when mediaStatsFeature is disposed.

## Best practices
If you want to collect this data for off-line inspection (after a call ends), it is recommended to collect this data and send it to your pipeline ingest after your call has ended. If you transmit this data during a call, it could use internet bandwidth that is needed to continue an Azure Communication Services call (especially when available bandwidth is low).

## MediaStats Metrics for SDK Version `>= 1.8.0`

The bandwidth metrics have changes to `availableBitrate` in Audio Send / Video Send metrics.

### Audio Send metrics
| Metric Name | Description | Comments |
| ----------- | ----------- | -------- |
| id | stats id | It is used to identify stats across the events, especially when there are multiple stats with same media type and direction in an event. |
| codecName | codec name | OPUS, G722|
| bitrate | audio send bitrate (bps) | General values are in the 24 kbps range (36-128 kbps typical) |
| jitterInMs | packet jitter (milliseconds) | Lower is better. |
| packetsPerSecond | packet rate (packets/sec) | |
| packetsLostPerSecond | packet loss rate (packets/sec) | Lower is better. |
| rttInMs | round-trip time (milliseconds) | Lower is better. It's calculated from RTCP Receiver Report. A round trip time of 200 ms or less is recommended. |
| pairRttInMs | round-trip time (milliseconds) | Lower is better. It's similar to rttInMS but is calculated from STUN connectivity check. A round trip time of 200 ms or less is recommended. |
| availableBitrate | bandwidth estimation (bps) | |
| audioInputLevel | audio volume level from microphone | The value ranges from 0-65536. 0 represents silence |

### Audio Receive metrics
| Metric Name | Description | Comments |
| ----------- | ----------- | -------- |
| id | stats id | It is used to identify stats across the events, especially when there are multiple stats with same media type and direction in an event. |
| codecName | codec name | OPUS, G722|
| bitrate | audio receive bitrate (bps) | General values are in the 24 kbps range (36-128 kbps typical) |
| jitterInMs | packet jitter (milliseconds) | Lower is better. |
| packetsPerSecond | packet rate (packets/sec) | |
| packetsLostPerSecond | packet loss rate (packets/sec) | Lower is better. |
| pairRttInMs | round-trip time (milliseconds) | Lower is better. It is calculated from STUN connectivity check. A round trip time of 200 ms or less is recommended. |
| jitterBufferInMs | jitter buffer (milliseconds) | Lower is better. The jitter buffer is used for smooth playout. This value is how long the packets of the samples stay in the jitter buffer. |
| audioOutputLevel | audio volume level from receiving stream | The value ranges from 0-65536. 0 represents silence. |
| healedRatio | ratio of concealedSamples(except silentConcealedSamples) to total received samples | Information only. |

### Video Send metrics
| Metric Name | Description | Comments |
| ----------- | ----------- | -------- |
| id | stats id | It is used to identify stats across the events, especially when there are multiple stats with same media type and direction in an event. |
| codecName | codec name | H264, VP8, VP9 |
| bitrate | video send bitrate (bps) | |
| jitterInMs | packet jitter (milliseconds) | Lower is better. |
| packetsPerSecond | packet rate (packets/sec) | |
| packetsLostPerSecond | packet loss rate (packets/sec) | Lower is better. |
| rttInMs | round-trip time (milliseconds) | Lower is better. It is calculated from RTCP Receiver Report. A round trip time of 200 ms or less is recommended. |
| pairRttInMs | round-trip time (milliseconds) | Lower is better. It is similar to rttInMS but is calculated from STUN connectivity check. A round trip time of 200 ms or less is recommended. |
| availableBitrate | bandwidth estimation (bps) | 1.5 Mbps or higher is recommended for high-quality video for upload/download. |
| frameRateInput | frame rate originating from the video source (frames/sec) | |
| frameWidthInput | frame width of the last frame originating from video source (pixel) | |
| frameHeightInput | frame height of the last frame originating from video source (pixel) | |
| frameRateEncoded | frame rate successfully encoded for the RTP stream (frames/sec) | |
| frameRateSent | frame rate sent on the RTP stream (frames/sec) | |
| frameWidthSent | frame width of the encoded frame (pixel) | |
| frameHeightSent | frame height of the encoded frame (pixel) | |
| framesSent | frames sent on the RTP stream | |
| framesEncoded | frames successfully encoded for the RTP stream | |
| keyFramesEncoded | key frames successfully encoded for the RTP stream  | |

### Video Receive metrics
| Metric Name | Description | Comments |
| ----------- | ----------- | -------- |
| id | stats id | It is used to identify stats across the events, especially when there are multiple stats with same media type and direction in an event. |
| codecName | codec name | H264, VP8, VP9 |
| bitrate | video receive bitrate (bps) | |
| jitterInMs | packet jitter (milliseconds) | Lower is better. |
| packetsPerSecond | packet rate (packets/sec) | |
| packetsLostPerSecond | packet loss rate (packets/sec) | Lower is better. |
| pairRttInMs | round-trip time (milliseconds) | Lower is better. A round trip time of 200 ms or less is recommended. |
| jitterBufferInMs | jitter buffer (milliseconds) | Lower is better. The jitter buffer is used for smooth playout. This value is how long the packets of the frame stay in the jitter buffer. |
| streamId | stream id | The streamId value corresponds to id in VideoStreamCommon. It can be used to match the sender. |
| frameRateOutput | frame rate output (frames/sec) | |
| frameRateDecoded | frame rate correctly decoded for the RTP stream (frames/sec) | |
| frameRateReceived | frame rate received on the RTP stream (frames/sec) | |
| frameWidthReceived | frame width of the decoded frame (pixel) | |
| frameHeightReceived | frame height of the decoded frame (pixel) | |
| longestFreezeDurationInMs | longest freeze duration (milliseconds) | |
| totalFreezeDurationInMs | total freeze duration (milliseconds) | |
| framesReceived | total number of frames received on the RTP stream | |
| framesDecoded | total number of frames correctly decoded for the RTP stream | |
| framesDropped | total number of frames dropped | |
| keyFramesDecoded | total number of key frames correctly decoded for the RTP stream | |

### ScreenShare Send metrics
Currently stats fields are the same as *Video Send metrics*

### ScreenShare Receive metrics
Currently stats fields are the same as *Video Receive metrics*

### Using Media Quality Statistics on SDK Version `< 1.8.0` or older
If you are using an ACS SDK version older than 1.8.0, please see below for documentation on how to use this functionality.

As a developer you can invoke the `startCollector` method with optional `mediaStatsSubscriptionOptions`.

```js
const mediaStatsCollector = mediaStatsFeature.startCollector(mediaStatsSubscriptionOptions);

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

### Bandwidth metrics
| Metric Name    | Purpose              | Detailed explanation                                                    | Comments                                                                      |
| -------------- | -------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| SentBWEstimate | Bandwidth estimation | Average video bandwidth allocated for the channel bps (bits per second) | 1.5 Mbps or higher is recommended for high-quality video for upload/download. |


### Audio quality metrics
| Metric Name               | Purpose                      | Details                                                                                                                                                                               | Comments                                                     |
| ------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| audioSendBitrate          | Sent bitrate                 | Send bitrate of audio (bits per second)                                                                                                                                               | General values are in the 24 kbps range (36-128 kbps typical) |
| audioRecvBitrate          | Received audio bitrate             | Received bitrate of audio received (bits per second)                                                                                                                                  |                                                              |
| audioSendPackets          | Sent packets                 | The number of audio packets sent in last second (packets per second)                                                                                                                  |                                                              |
| audioRecvJitterBufferMs   | Jitter buffer delay          | The jitter buffer is used for smooth playout. This value is how long the packets of the samples stay in the jitter buffer. (in milliseconds (ms))                                                                                                             | Lower is better. |
| audioRecvPacketsLost      | Received packet loss         | The number of audio packets that were to be received but were lost. Results are packets per second (over the last second).                                                            | Lower is better.                                             |
| audioSendPacketsLost      | Sent packet loss             | The number of audio packets sent that were lost (not received) in the last second.  Results are packets per second (over the last second).                                            | Lower is better.                                             |
| audioRecvPackets          | Received packets             | The number of audio packets received in the last second. Results are packets per second (over the last second).                                                                       | Information only.                                            |
| audioSendCodecName        | Sent codec                   | Audio codec used.                                                                                                                                                                     | Information only.                                            |
| audioSendRtt              | Send Round-Trip Time         | Round trip time between your system and Azure Communication Services server. Results are in milliseconds (ms).                                                                                                   | A round trip time of 200 ms or less is recommended.          |
| audioSendPairRtt          | Send Pair Round-Trip Time    | Round trip time for entire transport. Results are in milliseconds (ms).                                                                                                                           | A round trip time of 200 ms or less is recommended.          |
| audioRecvPairRtt          | Receive Pair Round-Trip Time | Round trip time for entire transport. Results are in milliseconds (ms).                                                                                                                            | A round trip time of 200 ms or less is recommended.          |
| audioSendAudioInputLevel  | Input level for microphone   | Sent audio playout level. If source data is between 0-1,  media stack multiplies it with 0xFFFF. Depends on microphone. Used to confirm if microphone is silent (no incoming energy). | Microphone input level.                                      |
| audioRecvAudioOutputLevel | Speaker output level.        | Received audio playout level.  If source data is between 0-1,  media stack multiplies it with 0xFFFF.                                                                                 | Speaker output level.                                        |


### Video quality metrics
| Metric Name                    | Purpose                          | Details                                                                                                                                  | Comments                                                                                         |
| ------------------------------ | -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| videoSendFrameRateSent         | Sent frame rate                  | Number of video frames sent. Results are frames per second                                                                               | Higher is better:<br>25-30 fps (360p or better)<br>8-15 fps (270p or lower)<br>Frames/second<br> |
| videoSendFrameWidthSent        | Sent width                       | Video width resolution sent.                                                                                                             | Higher is better. Possible values:<br>1920, 1280, 960, 640, 480, 320                             |
| videoSendFrameHeightSent       | Sent height                      | Video height sent. Higher is better                                                                                                      | Higher is better. Possible values:<br>1080, 720, 540, 360, 270, 240                              |
| videoSendBitrate               | Sent bitrate                     | Amount of video bitrate being sent. Results are bps (bits per second)                                                                    |                                                                                                  |
| videoSendPackets               | Sent packets                     | The number of video packets sent. Results are packets per second (over the last second).                                                 | Information only                                                                                 |
| VideoSendCodecName             | Sent codec                       | Video codec used for encoding video                                                                                                      | VP8 (1:1 calls) and H264                                                                         |
| videoRecvJitterBufferMs        | Received Jitter                  | The jitter buffer is used for smooth playout. This value is how long the packets of the frame stay in the jitter buffer. (in milliseconds (ms))                                                                | Lower is better.                                                                                 |
| videoSendRtt                   | Send Round-Trip Time             | Response time between your system and Azure Communication Services server. Lower is better                                                                        | A round trip time of 200 ms or less is recommended.                                              |
| videoSendPairRtt               | Send Pair Round-Trip Time        | Response time between your system and Azure Communication Services server. Results are in milliseconds (ms).                                                      | A round trip time of 200 ms or less is recommended.                                              |
| videoRecvPairRtt               | Receive Pair Round-Trip Time     | Round trip time for entire transport. Results are in milliseconds (ms).                                                                              | A round trip time of 200 ms or less is recommended.                                              |
| videoRecvFrameRateReceived     | Received frame rate              | Frame rate of video currently received                                                                                                   | 25-30 fps (360p or better)<br>8-15 fps (270p or lower)                                           |
| videoRecvFrameWidthReceived    | Received width                   | Width of video currently received                                                                                                        | 1920, 1280, 960, 640, 480, 320                                                                   |
| videoRecvFrameHeightReceived   | Received height                  | Height of video currently received                                                                                                       | 1080, 720, 540, 360, 270, 240                                                                    |
| videoRecvBitrate               | Received bitrate                 | Bitrate of video currently received (bits per second)                                                                                    | Information only,                                                                                |
| videoRecvPackets               | Received packets                 | The number of packets received in last second                                                                                            | Information only                                                                                 |
| VideoRecvPacketsLost           | Received packet loss             | The number of video packets that were to be received but were lost. Results are packets per second (over the last second).                                                                                                             | Lower is better                                                                                  |
| videoSendPacketsLost           | Sent packet loss                 | The number of audio packets that were sent but were lost. Results are packets per second (over the last second).                                                                                                             | Lower is better                                                                                  |
| videoSendFrameRateInput        | Sent framerate input             | Framerate measurements from the stream input into peerConnection                                                                         | Information only                                                                                 |
| videoRecvFrameRateDecoded      | Received decoded framerate       | Framerate from decoder output. This metric takes  videoSendFrameRateInput as an input, might be some loss in decoding                           | Information only                                                                                 |
| videoSendFrameWidthInput       | Sent frame width input           | Frame width of the stream input into peerConnection. This takes  videoRecvFrameRateDecoded as an input, might be some loss in rendering. | 1920, 1280, 960, 640, 480, 320                                                                   |
| videoSendFrameHeightInput      | Sent frame height input          | Frame height of the stream input into peerConnection                                                                                     | 1080, 720, 540, 360, 270, 240                                                                    |
| videoRecvLongestFreezeDuration | Received longest freeze duration | How long was the longest freeze                                                                                                          | Lower is better                                                                                  |
| videoRecvTotalFreezeDuration   | Received total freeze duration   | Total freeze duration in seconds                                                                                                         | Lower is better                                                                                  |

### Screen share quality metrics
| Metric Name                            | Purpose                          | Details                                                          | Comments                              |
| -------------------------------------- | -------------------------------- | ---------------------------------------------------------------- | ------------------------------------- |
| screenSharingSendFrameRateSent         | Sent frame rate                  | Number of video frames sent. Higher is better                    | 1-30 FPS (content aware, variable)    |
| screenSharingSendFrameWidthSent        | Sent width                       | Video resolution sent. Higher is better                          | 1920 pixels (content aware, variable) |
| screenSharingSendFrameHeightSent       | Sent height                      | Video resolution sent. Higher is better                          | 1080 pixels (content aware, variable) |
| screenSharingSendCodecName             | Sent codec                       | Codec used for encoding screen share                             | Information only                      |
| screenSharingRecvFrameRateReceived     | Received frame rate              | Number of video frames received. Lower is better.                | 1-30 FPS                              |
| screenSharingRecvFrameWidthReceived    | Received width                   | Video resolution received. Higher is better                      | 1920 pixels (content aware, variable) |
| screenSharingRecvFrameHeightReceived   | Received height                  | Video resolution sent. Higher is better                          | 1080 pixels (content aware, variable) |
| screenSharingRecvCodecName             | Received codec                   | Codec used for decoding video stream                             | Information only                      |
| screenSharingRecvJitterBufferMs        | Received Jitter                  | The jitter buffer is used for smooth playout. This value is how long the packets of the frame stay in the jitter buffer. (in milliseconds (ms))                                                                |                                 |
| screenSharingRecvPacketsLost           | Received packet loss             | The number of screen share packets that were to be received but were lost. Results are packets per second (over the last second).                                     | Lower is better                       |
| screenSharingSendPacketsLost           | Received packet loss             | The number of screen share packets that were sent were lost. Results are packets per second (over the last second).                                     | Lower is better                       |
| screenSharingSendFrameRateInput        | Sent framerate input             | Framerate measurements from the stream input into peerConnection | Information only                      |
| screenSharingRecvFrameRateDecoded      | Received decoded framerate       | Framerate from decoder output                                    | Information only                      |
| screenSharingRecvFrameRateOutput       | Received framerate output        | Framerate of the stream that was sent to renderer                | Information only                      |
| screenSharingSendFrameWidthInput       | Sent frame width input           | Frame width of the stream input into peerConnection              | Information only                      |
| screenSharingSendFrameHeightInput      | Sent frame height input          | Frame height of the stream input into peerConnection             | Information only                      |
| screenSharingRecvLongestFreezeDuration | Received longest freeze duration | How long was the longest freeze                                  | Lower is better                       |
| screenSharingRecvTotalFreezeDuration   | Received total freeze duration   | Total freeze duration in seconds                                 | Lower is better                       |
