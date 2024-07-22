---
title: Video issues - The sender's video is frozen
titleSuffix: Azure Communication Services - Troubleshooting Guide
description: Learn how to troubleshoot poor video quality when the sender's video is frozen.
author: enricohuang
ms.author: enricohuang

services: azure-communication-services
ms.date: 04/05/2024
ms.topic: troubleshooting
ms.service: azure-communication-services
ms.subservice: calling
---

# The sender's video is frozen
When the receiver sees that the sender's video is frozen, it means that the incoming video frame rate is 0.

The problem may occur due to poor network connection on either the receiving or sending end.
This issue can also occur when a mobile phone browser goes to background, which would lead to the camera stopping to send frames.
Finally the video sender dropping the call unexpectedly also causes the issue.

## How to detect using the Calling SDK

You can use the [User Facing Diagnostics API](../../../../concepts/voice-video-calling/user-facing-diagnostics.md). Your application can register a listener callback to detect the network condition changes and listen for other end user impacting events.

At the video sending end, you can check events with the values of `networkReconnect`, `networkSendQuality`, `cameraFreeze`, `cameraStoppedUnexpectedly`.

At the receiving end, you can check events with the values of `networkReconnect` and `networkReceiveQuality`.

In addition, the [media quality stats API ](../../../../concepts/voice-video-calling/media-quality-sdk.md) also provides a way to monitor the network and video quality.

For the quality of the video sending end, you can check the metrics `packetsLost`, `rttInMs`, `frameRateSent`, `frameWidthSent`, `frameHeightSent`, and `availableOutgoingBitrate`.

For the quality of the receiving end, you can check the metrics `packetsLost`, `frameRateDecoded`, `frameWidthReceived`, `frameHeightReceived`, and `framesDropped`.

## How to mitigate or resolve
From the perspective of the ACS Calling SDK, network issues are considered external problems.
To solve network issues, it's often necessary to understand the network topology and the nodes causing the problem.
These parts involve network infrastructure, which is outside the scope of the ACS Calling SDK.
It's important for the application to handle events from the User Facing Diagnostics Feature and notify the users accordingly.
In this way, users can be aware of any network quality issues and aren't surprised if they experience frozen video during a call.

If you expect the user's network environment to be poor, you can also use the [Video Constraint Feature](../../../../concepts/voice-video-calling/video-constraints.md) to limit the max resolution, max fps, or max bitrate sent by the sender to reduce the bandwidth required for transmitting video.

Other reasons, especially those occur on the sender side, such as the sender's camera stopped or the sender dropping the call unexpectedly,
can't currently be known by the receiver due to the absence of reporting mechanism from the sender to other participants.
In the future, when the SDK supports `Remote UFD`, the application can handle this error gracefully.

