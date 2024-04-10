---
title: Video issues - The network is poor during the call
titleSuffix: Azure Communication Services - Troubleshooting Guide
description: Learn how to troubleshoot poor video quality when the network is poor during the call.
author: enricohuang
ms.author: enricohuang

services: azure-communication-services
ms.date: 04/05/2024
ms.topic: troubleshooting
ms.service: azure-communication-services
ms.subservice: calling
---

# The network is poor during the call
The quality of the network affects video quality on the sender and receiver's side.
If the sender's network bandwidth becomes poor, the sender's SDK may adjust the video's encoding resolution and frame rate. In doing so, the SDK ensures that it doesn't send more data than the current network can support.

Similarly, when the receiver's bandwidth becomes poor in a group call and the [simulcast](../../../../concepts/voice-video-calling/simulcast.md) is enabled on the sender's side, the server may forward a lower resolution stream.
This mechanism can reduce the impact of the network on the receiver's side.

Other network characteristics, such as packet loss, round trip time, and jitter, also affect the video quality.

## How to detect using the SDK

The [User Facing Diagnostics API](../../../../concepts/voice-video-calling/user-facing-diagnostics.md) gives feedback to your application about the occurrence of real time network impacting events.

For the network quality of the video sending end, you can check events with the values of `networkReconnect` and `networkSendQuality`.

For the network quality of the receiving end, you can check events with the values of `networkReconnect` and `networkReceiveQuality`.

In addition, the [media quality stats API](../../../../concepts/voice-video-calling/media-quality-sdk.md) also provides a way to monitor the network and video quality.

For the quality of the video sending end, you can check the metrics `packetsLost`, `rttInMs`, `frameRateSent`, `frameWidthSent`, `frameHeightSent`, and `availableOutgoingBitrate`.

For the quality of the receiving end, you can check the metrics `packetsLost`, `frameRateDecoded`, `frameWidthReceived`, `frameHeightReceived`, and `framesDropped`.

## How to mitigate or resolve
From the perspective of the ACS Calling SDK, network issues are considered external problems.
To solve network issues, it's often necessary to understand the network topology and the nodes causing the problem.

The ACS Calling SDK and browser adaptively adjust the video quality according to the networks condition.
It's important for the application to handle events from the User Facing Diagnostics Feature and notify the users accordingly.
In this way, users can be aware of any network quality issues and aren't surprised if they experience low-quality video during a call.

You should also consider monitoring your client [media quality and network status](../../../../concepts/voice-video-calling/media-quality-sdk.md?pivots=platform-web) and taking action when low quality or poor network is reported. For instance, you might consider automatically turning off incoming video streams when you notice that the client is experience degraded network performance. In other instances, you might give feedback to a user that they should turn off their camera because they have a poor internet connection.

If you have a hypothesis that the user's network environment is poor or unstable, you can also use the [Video Constraint API](../../../../concepts/voice-video-calling/video-constraints.md) to limit the maximum resolution, maximum frames per second (fps), and\or maximum bitrate sent or received to reduce the bandwidth required for video transmission.

