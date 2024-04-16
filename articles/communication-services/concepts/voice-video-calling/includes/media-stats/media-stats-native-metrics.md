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

If you want to collect the data for offline inspection, we recommend that you collect the data and send it to your pipeline ingestion after your call ends. If you transmit the data during a call, it could use internet bandwidth needed to continue an Azure Communication Services call (especially when available bandwidth is low).

### Outgoing audio metrics

| Metric name | Description | Comments |
| ----------- | ----------- | -------- |
| `CodecName` | Codec name | |
| `BitrateInBps` | Audio send bitrate (bits per second) | General values are in the 24-Kbps range (36-128 Kbps is typical). |
| `JitterInMs` | Packet jitter (milliseconds) | Lower is better. |
| `PacketCount` | The total number of packets sent. | |

### Incoming audio metrics

| Metric name | Description | Comments |
| ----------- | ----------- | -------- |
| `CodecName` | Codec name | |
| `JitterInMs` | Packet jitter (milliseconds) | Lower is better. |
| `PacketCount` | The total number of packets sent. | |
| `PacketsLostPerSecond` | Packet loss rate (packets per second) | Lower is better. |

### Outgoing video metrics

| Metric name | Description | Comments |
| ----------- | ----------- | -------- |
| `CodecName` | Codec name | |
| `BitrateInBps` | Video send bitrate (bits per second) | |
| `PacketCount` | The total number of packets sent. | |
| `FrameRate` | Frame rate sent on the RTP stream (frames per second) | |
| `FrameWidth` | Frame width of the encoded frame (pixels) | |
| `FrameHeight` | Frame height of the encoded frame (pixels) | |

### Incoming video metrics

| Metric name | Description | Comments |
| ----------- | ----------- | -------- |
| `CodecName` | Codec name | |
| `BitrateInBps` | Video receive bitrate (bits per second) | |
| `JitterInMs` | Packet jitter (milliseconds) | Lower is better. |
| `PacketCount` | The total number of packets sent. | |
| `PacketsLostPerSecond` | Packet loss rate (packets per second) | Lower is better. |
| `StreamId` | Stream ID | The `streamId` value corresponds to the ID of the video of the remote participant. It can be used to match the sender. |
| `FrameRate` | Frame rate received on the RTP stream (frames per second) | |
| `FrameWidth` | Frame width of the decoded frame (pixels) | |
| `FrameHeight` | Frame height of the decoded frame (pixels) | |
| `TotalFreezeDurationInMs` | Total freeze duration (milliseconds) | |

### Outgoing screen share metrics

Currently, statistics fields are the same as *Outgoing video metrics*.

### Incoming screen share metrics

Currently, statistics fields are the same as *Incoming video metrics*.

### Outgoing data channel metrics

| Metric name | Description | Comments |
| ----------- | ----------- | -------- |
| `PacketCount` | The total number of packets sent. | |

### Incoming data channel metrics

| Metric name | Description | Comments |
| ----------- | ----------- | -------- |
| `JitterInMs` | Packet jitter (milliseconds) | Lower is better. |
| `PacketCount` | The total number of packets sent. | |
