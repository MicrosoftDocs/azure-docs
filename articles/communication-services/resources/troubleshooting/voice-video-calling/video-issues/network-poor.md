---
title: Video issues - The network is poor during the call
titleSuffix: Azure Communication Services - Troubleshooting Guide
description: Learn how to troubleshoot poor video quality when the network is poor during the call.
author: enricohuang
ms.author: enricohuang

services: azure-communication-services
ms.date: 02/24/2024
ms.topic: troubleshooting
ms.service: azure-communication-services
ms.subservice: calling
---

# The network is poor during the call
The quality of the network greatly affects video quality.
The sender and receiver's network quality are both important.
For example, if the sender's network bandwidth becomes poor, the sender's SDK may adjust the video's encoding resolution and frame rate according the bandwidth estimation.
The browser itself also has degradation rules that could affect the encoding resolution and framerate.
Therefore, even if the original input resolution is high, it's likely that the final video resolution sent out can be low due to network issues.

Similarly, if the receiver's bandwidth becomes poor in a group call and the simulcast is enabled on the sender's side, the server will forward a lower resolution stream to reduce the impact of the network on the receiver's side.

Other network characteristics, such as packet loss, round trip time, and jitter, will also affect the video quality that users experience.

## How to detect
### SDK

Through [User Facing Diagnostics Feature](../../../concepts/voice-video-calling/user-facing-diagnostics.md), the application can register a listener callback to detect the network condition changes.

For the network quality of the video sending end, you can check events with the values of `networkReconnect` and `networkSendQuality`.

For the network quality of the receiving end, you can check events with the values of `networkReconnect` and `networkReceiveQuality`.

In addition, the [MediaStats Feature](../../../concepts/voice-video-calling/media-quality-sdk.md) also provides a way to monitor the network and video quality.

For the quality of the video sending end, you can check the metrics `packetsLost`, `rttInMs`, `frameRateSent`, `frameWidthSent`, `frameHeightSent`, and `availableOutgoingBitrate`.

For the quality of the receiving end, you can check the metrics `packetsLost`, `frameRateDecoded`, `frameWidthReceived`, `frameHeightReceived`, and `framesDropped`.

## How to mitigate or resolve
From the perspective of the ACS Calling SDK, network issues are considered external problems.
To solve network issues, it's usually necessary to understand the network topology and the nodes causing the problem.
These parts involve network infrastructure, which is outside the scope of the ACS Calling SDK.

However, the ACS Calling SDK and browser can adaptively adjust the video quality according to the network condition. It's very important for the application to handle events from the User Facing Diagnostics Feature and notify the users accordingly, so that they're aware of any network quality issues and aren't surprised if they experience low-quality video during a call.

If you expect the user's network environment to be very poor, you can also use the [Video Constraint Feature](../../../concepts/voice-video-calling/video-constraints.md) to limit the max resolution, max fps, or max bitrate sent by the sender to reduce the bandwidth required for transmitting video.

