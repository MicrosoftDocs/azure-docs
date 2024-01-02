---
title: Azure Communication Services media quality statistics (native)
titleSuffix: An Azure Communication Services concept article
description: Get usage samples of the media quality statistics feature for native.
author: jsaurezle-msft
ms.author: jsaurezlee

services: azure-communication-services
ms.date: 08/09/2023
ms.topic: include
ms.service: azure-communication-services
ms.subservice: calling
---

## Best practices

If you want to collect the data for offline inspection, we recommend that you collect the data and send it to your pipeline ingestion after your call ends. If you transmit the data during a call, it could use internet bandwidth that's needed to continue an Azure Communication Services call (especially when available bandwidth is low).

### Outgoing audio metrics

| Metric name | Description | Comments |
| ----------- | ----------- | -------- |
| `CodecName` | Codec name | |
| `Bitrate` | Audio send bitrate (bits per second) | General values are in the 24-Kbps range (36-128 Kbps is typical). |
| `JitterInMs` | Packet jitter (milliseconds) | Lower is better. |
| `PacketsPerSecond` | Packet rate (packets per second) | |
| `RoundTripTimeInMs` | Round-trip time (milliseconds) | Lower is better. It's calculated from the RTCP receiver report. We recommend a round-trip time of 200 ms or less. |
| `AvailableBitrate` | Bandwidth estimation (bits per second) | |

### Incoming audio metrics

| Metric name | Description | Comments |
| ----------- | ----------- | -------- |
| `CodecName` | Codec name | |
| `JitterInMs` | Packet jitter (milliseconds) | Lower is better. |
| `PacketsPerSecond` | Packet rate (packets per second) | |
| `PacketsLostPerSecond` | Packet loss rate (packets per second) | Lower is better. |

### Outgoing video metrics

| Metric name | Description | Comments |
| ----------- | ----------- | -------- |
| `CodecName` | Codec name | |
| `Bitrate` | Video send bitrate (bits per second) | |
| `PacketsPerSecond` | Packet rate (packets per second) | |
| `PacketsLostPerSecond` | Packet loss rate (packets per second) | Lower is better. |
| `RoundTripTimeInMs` | Round-trip time (milliseconds) | Lower is better. It's calculated from the RTCP receiver report. We recommend a round-trip time of 200 ms or less. |
| `AvailableBitrate` | Bandwidth estimation (bits per second) | We recommend 1.5 Mbps or higher for high-quality video for upload/download. |
| `FrameRateInput` | Frame rate that originates from the video source (frames per second) | |
| `FrameWidthInput` | Frame width of the last frame that originates from the video source (pixels) | |
| `FrameHeightInput` | Frame height of the last frame that originates from the video source (pixels) | |
| `FrameRateSent` | Frame rate sent on the RTP stream (frames per second) | |
| `FrameWidthSent` | Frame width of the encoded frame (pixels) | |
| `FrameHeightSent` | Frame height of the encoded frame (pixels) | |

### Incoming video metrics

| Metric name | Description | Comments |
| ----------- | ----------- | -------- |
| `CodecName` | Codec name | |
| `Bitrate` | Video receive bitrate (bits per second) | |
| `JitterInMs` | Packet jitter (milliseconds) | Lower is better. |
| `PacketsPerSecond` | Packet rate (packets per second) | |
| `PacketsLostPerSecond` | Packet loss rate (packets per second) | Lower is better. |
| `StreamId` | Stream ID | The `streamId` value corresponds to the ID of the video of the remote participant. It can be used to match the sender. |
| `FrameRateReceived` | Frame rate received on the RTP stream (frames per second) | |
| `FrameWidthReceived` | Frame width of the decoded frame (pixels) | |
| `FrameHeightReceived` | Frame height of the decoded frame (pixels) | |
| `TotalFreezeDurationInMs` | Total freeze duration (milliseconds) | |

### Screen-share send metrics

Currently, statistics fields are the same as *video send metrics*.

### Screen-share receive metrics

Currently, statistics fields are the same as *video receive metrics*.
