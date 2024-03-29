---
title: Video issues - The sender's video is frozen
titleSuffix: Azure Communication Services - Troubleshooting Guide
description: Learn how to troubleshoot poor video quality when the sender's video is frozen
author: enricohuang
ms.author: enricohuang

services: azure-communication-services
ms.date: 02/24/2024
ms.topic: troubleshooting
ms.service: azure-communication-services
ms.subservice: calling
---

# The sender's video is frozen
When the receiver sees that the sender's video is frozen, it means that the incoming video frame rate is 0.

The problem may occur due to poor network connection on either the receiving or sending end,
or due to issues with the camera on the sending end, or if the video input track is muted, which usually happens when a mobile phone browser goes to background,
or if the video sender drops the call unexpectedly.


## How to detect
### SDK

Through [User Facing Diagnostics Feature](../../../concepts/voice-video-calling/user-facing-diagnostics.md), the application can register a listener callback to detect the network condition changes.

At the video sending end, you can check events with the values of `networkReconnect`, `networkSendQuality`, `cameraFreeze`, `cameraStoppedUnexpectedly`.

At the receiving end, you can check events with the values of `networkReconnect` and `networkReceiveQuality`.

In addition, the [MediaStats Feature](../../../concepts/voice-video-calling/media-quality-sdk.md) also provides a way to monitor the netowrk and video quality.

For the quality of the video sending end, you can check the metrics `packetsLost`, `rttInMs`, `frameRateSent`, `frameWidthSent`, `frameHeightSent`, and `availableOutgoingBitrate`.

For the quality of the receiving end, you can check the metrics `packetsLost`, `frameRateDecoded`, `frameWidthReceived`, `frameHeightReceived`, and `framesDropped`.

## How to monitor
### Azure log
...
### CDC
...

## How to mitigate or resolve
From the perspective of the ACS Calling SDK, network issues are considered external problems.
To solve network issues, it is usually necessary to understand the network topology and the nodes causing the problem.
These parts involve network infrastructure, which is outside the scope of the ACS Calling SDK.
It is very important for the application to handle events from the User Facing Diagnostics Feature and notify the users accordingly, so that they are aware of any network quality issues and are not surprised if they experience frozen video during a call.

If you expect the user's network environment to be very poor, you can also use the [Video Constraint Feature](../../../concepts/voice-video-calling/video-constraints.md) to limit the max resolution, max fps, or max bitrate sent by the sender to reduce the bandwidth required for transmitting video.

Other reasons, especially those that occur on the sender side, such as the sender's camera stopped or the sender dropping the call unexpectedly,
cannot currently be known by the receiver because there is no reporting mechanism for this part from the sender to other participants.
In the future, the SDK will support Remote UFD, which can detect this case quickly and provides applications a way to handle this error gracefully.

