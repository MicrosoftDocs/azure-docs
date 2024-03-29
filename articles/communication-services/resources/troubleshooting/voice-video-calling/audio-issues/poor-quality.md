---
title: Audio issues - The user experiences poor audio quality
titleSuffix: Azure Communication Services - Troubleshooting Guide
description: Learn how to troubleshoot when the user experiences poor audio quality.
author: enricohuang
ms.author: enricohuang

services: azure-communication-services
ms.date: 02/24/2024
ms.topic: troubleshooting
ms.service: azure-communication-services
ms.subservice: calling
---

# The user experiences poor audio quality

There are many different factors that can affect poor audio quality.
For example, it may because the network is poor, the speaker's microphone is bad,
the browser's audio processing module deteriorates the audio quality, or the receiver's speaker is bad.

As a result, the user may hear distorted audio, crackling noise, and mechanical sounds.

## How to detect
Detecting poor audio quality can be challenging because the browser's reported information doesn't always reflect audio quality.

However, if poor audio quality is caused by poor network, you can still detect these issues and display the information to users
so they are aware of the potential for poor audio quality.

Through [User Facing Diagnostics Feature](../../../../concepts/voice-video-calling/user-facing-diagnostics.md), the application can register a listener callback to detect the network condition changes.

To check the network quality of the audio sending end, look for events with the values of `networkSendQuality`.

To check the network quality of the receiving end, look for events with the values of `networkReceiveQuality`.

The [MediaStats Feature](../../../../concepts/voice-video-calling/media-quality-sdk.md) provides several metrics that are indirectly correlated to the network or audio quality,
such as `packetsLostPerSecond` and `healedRatio`.
The `healedRatio` is calculated from the concealment count reported by the WebRTC Stats.
If this value is larger than 0.1, it's likely that the receiver experiences some audio quality degradation.

## How to mitigate or resolve

It's important to first locate where the problem is occurring.
Poor audio quality could be due to issues on either the sender or receiver side.

To debug poor audio quality, it's often difficult to understand the issue from a text description alone.
It would be more helpful to obtain audio recordings captured by the user's browser.

If the user hears robotic-sounding audio, it's usually caused by packet loss.
If you suspect the audio quality is coming from the sender device, you can check the audio recordings captured from the sender's side.
If the sender is using Desktop Edge or Chrome, they can follow the instructions in this document to collect the audio recordings:
[How to collect diagnostic audio recordings](../references/how-to-collect-diagnostic-audio-recordings.md)

The audio recordings include the audio before and after it's processed by the audio processing module.
By comparing the recordings, you may be able to determine where the issue is coming from.
