---
title: Azure Communication Services Media Stats (Native)
titleSuffix: An Azure Communication Services concept document
description: Provides usage samples of the Media Stats feature for Native.
author: jsaurezle-msft
ms.author: jsaurezlee

services: azure-communication-services
ms.date: 08/09/2023
ms.topic: include
ms.service: azure-communication-services
ms.subservice: calling
---

## Best practices
If you want to collect this data for off-line inspection (after a call ends), it is recommended to collect this data and send it to your pipeline ingest after your call has ended. If you transmit this data during a call, it could use internet bandwidth that is needed to continue an Azure Communication Services call (especially when available bandwidth is low).

### Outgoing Audio metrics
| Metric Name | Description | Comments |
| ----------- | ----------- | -------- |
| CodecName | codec name | |
| Bitrate | audio send bitrate (bps) | General values are in the 24 kbps range (36-128 kbps typical) |
| JitterInMs | packet jitter (milliseconds) | Lower is better. |
| PacketsPerSecond | packet rate (packets/sec) | |
| PacketsLostPerSecond | packet loss rate (packets/sec) | Lower is better. |
| RoundTripTimeInMs | round-trip time (milliseconds) | Lower is better. It's calculated from RTCP Receiver Report. A round trip time of 200 ms or less is recommended. |
| PairRoundTripTimeInMs | round-trip time (milliseconds) | Lower is better. It's similar to rttInMS but is calculated from STUN connectivity check. A round trip time of 200 ms or less is recommended. |
| AvailableBitrate | bandwidth estimation (bps) | |
| AudioInputLevel | audio volume level from microphone | The value ranges from 0-65536. 0 represents silence |

### Incoming Audio metrics
| Metric Name | Description | Comments |
| ----------- | ----------- | -------- |
| CodecName | codec name | |
| Bitrate | audio receive bitrate (bps) | General values are in the 24 kbps range (36-128 kbps typical) |
| JitterInMs | packet jitter (milliseconds) | Lower is better. |
| PacketsPerSecond | packet rate (packets/sec) | |
| PacketsLostPerSecond | packet loss rate (packets/sec) | Lower is better. |
| RoundTripTimeInMs | round-trip time (milliseconds) | Lower is better. It's calculated from RTCP Receiver Report. A round trip time of 200 ms or less is recommended. |
| PairRoundTripTimeInMs | round-trip time (milliseconds) | Lower is better. It is calculated from STUN connectivity check. A round trip time of 200 ms or less is recommended. |
| AvailableBitrate | bandwidth estimation (bps) | |
| JitterBufferInMs | jitter buffer (milliseconds) | Lower is better. The jitter buffer is used for smooth playout. This value is how long the packets of the samples stay in the jitter buffer. |
| AudioOutputLevel | audio volume level from receiving stream | The value ranges from 0-65536. 0 represents silence. |
| HealedRatio | ratio of concealedSamples(except silentConcealedSamples) to total received samples | Information only. |

### Outgoing Video metrics
| Metric Name | Description | Comments |
| ----------- | ----------- | -------- |
| CodecName | codec name | |
| Bitrate | video send bitrate (bps) | |
| JitterInMs | packet jitter (milliseconds) | Lower is better. |
| PacketsPerSecond | packet rate (packets/sec) | |
| PacketsLostPerSecond | packet loss rate (packets/sec) | Lower is better. |
| RoundTripTimeInMs | round-trip time (milliseconds) | Lower is better. It is calculated from RTCP Receiver Report. A round trip time of 200 ms or less is recommended. |
| PairRoundTripTimeInMs | round-trip time (milliseconds) | Lower is better. It is similar to rttInMS but is calculated from STUN connectivity check. A round trip time of 200 ms or less is recommended. |
| AvailableBitrate | bandwidth estimation (bps) | 1.5 Mbps or higher is recommended for high-quality video for upload/download. |
| FrameRateInput | frame rate originating from the video source (frames/sec) | |
| FrameWidthInput | frame width of the last frame originating from video source (pixel) | |
| FrameHeightInput | frame height of the last frame originating from video source (pixel) | |
| FrameRateEncoded | frame rate successfully encoded for the RTP stream (frames/sec) | |
| FrameRateSent | frame rate sent on the RTP stream (frames/sec) | |
| FrameWidthSent | frame width of the encoded frame (pixel) | |
| FrameHeightSent | frame height of the encoded frame (pixel) | |
| FramesSent | frames sent on the RTP stream | |
| FramesEncoded | frames successfully encoded for the RTP stream | |
| KeyFramesEncoded | key frames successfully encoded for the RTP stream  | |

### Incoming Video metrics
| Metric Name | Description | Comments |
| ----------- | ----------- | -------- |
| CodecName | codec name | |
| Bitrate | video receive bitrate (bps) | |
| JitterInMs | packet jitter (milliseconds) | Lower is better. |
| PacketsPerSecond | packet rate (packets/sec) | |
| PacketsLostPerSecond | packet loss rate (packets/sec) | Lower is better. |
| RoundTripTimeInMs | round-trip time (milliseconds) | Lower is better. It is calculated from RTCP Receiver Report. A round trip time of 200 ms or less is recommended. |
| PairRoundTripTimeInMs | round-trip time (milliseconds) | Lower is better. A round trip time of 200 ms or less is recommended. |
| AvailableBitrate | bandwidth estimation (bps) | 1.5 Mbps or higher is recommended for high-quality video for upload/download. |
| JitterBufferInMs | jitter buffer (milliseconds) | Lower is better. The jitter buffer is used for smooth playout. This value is how long the packets of the frame stay in the jitter buffer. |
| StreamId | stream id | The streamId value corresponds to id in VideoStreamCommon. It can be used to match the sender. |
| FrameRateOutput | frame rate output (frames/sec) | |
| FrameRateDecoded | frame rate correctly decoded for the RTP stream (frames/sec) | |
| FrameRateReceived | frame rate received on the RTP stream (frames/sec) | |
| FrameWidthReceived | frame width of the decoded frame (pixel) | |
| FrameHeightReceived | frame height of the decoded frame (pixel) | |
| LongestFreezeDurationInMs | longest freeze duration (milliseconds) | |
| TotalFreezeDurationInMs | total freeze duration (milliseconds) | |
| FramesReceived | total number of frames received on the RTP stream | |
| FramesDecoded | total number of frames correctly decoded for the RTP stream | |
| FramesDropped | total number of frames dropped | |
| KeyFramesDecoded | total number of key frames correctly decoded for the RTP stream | |

### ScreenShare Send metrics
Currently stats fields are the same as *Video Send metrics*

### ScreenShare Receive metrics
Currently stats fields are the same as *Video Receive metrics*
