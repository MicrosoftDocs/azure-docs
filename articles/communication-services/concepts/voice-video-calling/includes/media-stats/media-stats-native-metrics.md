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
If you want to collect this data for off-line inspection (after a call ends), it's recommended to collect this data and send it to your pipeline ingest after your call has ended. If you transmit this data during a call, it could use internet bandwidth that is needed to continue an Azure Communication Services call (especially when available bandwidth is low).

### Outgoing Audio metrics
| Metric Name | Description | Comments |
| ----------- | ----------- | -------- |
| CodecName | codec name | |
| Bitrate | audio send bitrate (bps) | General values are in the 24 kbps range (36-128 kbps typical) |
| JitterInMs | packet jitter (milliseconds) | Lower is better. |
| PacketsPerSecond | packet rate (packets/sec) | |
| RoundTripTimeInMs | round-trip time (milliseconds) | Lower is better. It's calculated from RTCP Receiver Report. A round trip time of 200 ms or less is recommended. |
| AvailableBitrate | bandwidth estimation (bps) | |

### Incoming Audio metrics
| Metric Name | Description | Comments |
| ----------- | ----------- | -------- |
| CodecName | codec name | |
| JitterInMs | packet jitter (milliseconds) | Lower is better. |
| PacketsPerSecond | packet rate (packets/sec) | |
| PacketsLostPerSecond | packet loss rate (packets/sec) | Lower is better. |

### Outgoing Video metrics
| Metric Name | Description | Comments |
| ----------- | ----------- | -------- |
| CodecName | codec name | |
| Bitrate | video send bitrate (bps) | |
| PacketsPerSecond | packet rate (packets/sec) | |
| PacketsLostPerSecond | packet loss rate (packets/sec) | Lower is better. |
| RoundTripTimeInMs | round-trip time (milliseconds) | Lower is better. It's calculated from RTCP Receiver Report. A round trip time of 200 ms or less is recommended. |
| AvailableBitrate | bandwidth estimation (bps) | 1.5 Mbps or higher is recommended for high-quality video for upload/download. |
| FrameRateInput | frame rate originating from the video source (frames/sec) | |
| FrameWidthInput | frame width of the last frame originating from video source (pixel) | |
| FrameHeightInput | frame height of the last frame originating from video source (pixel) | |
| FrameRateSent | frame rate sent on the RTP stream (frames/sec) | |
| FrameWidthSent | frame width of the encoded frame (pixel) | |
| FrameHeightSent | frame height of the encoded frame (pixel) | |

### Incoming Video metrics
| Metric Name | Description | Comments |
| ----------- | ----------- | -------- |
| CodecName | codec name | |
| Bitrate | video receive bitrate (bps) | |
| JitterInMs | packet jitter (milliseconds) | Lower is better. |
| PacketsPerSecond | packet rate (packets/sec) | |
| PacketsLostPerSecond | packet loss rate (packets/sec) | Lower is better. |
| StreamId | stream ID | The streamId value corresponds to the ID of the video of the RemoteParticipant. It can be used to match the sender. |
| FrameRateReceived | frame rate received on the RTP stream (frames/sec) | |
| FrameWidthReceived | frame width of the decoded frame (pixel) | |
| FrameHeightReceived | frame height of the decoded frame (pixel) | |
| TotalFreezeDurationInMs | total freeze duration (milliseconds) | |

### ScreenShare Send metrics
Currently stats fields are the same as *Video Send metrics*

### ScreenShare Receive metrics
Currently stats fields are the same as *Video Receive metrics*
