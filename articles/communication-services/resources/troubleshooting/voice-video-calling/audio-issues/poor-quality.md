---
title: Audio issues - The user experiences poor audio quality
titleSuffix: Azure Communication Services - Troubleshooting Guide
description: Learn how to troubleshoot when the user experiences poor audio quality.
author: enricohuang
ms.author: enricohuang

services: azure-communication-services
ms.date: 04/09/2024
ms.topic: troubleshooting
ms.service: azure-communication-services
ms.subservice: calling
---

# The user experiences poor audio quality

There are many different factors that can affect poor audio quality. For instance, it may be due to:

- A poor network connectivity
- A faulty microphone on the speaker's end
- A deterioration of audio quality caused by the browser's audio processing module
- A faulty speaker on the receiver's end

As a result, the user may hear distorted audio, crackling noise, and mechanical sounds.

## How to detect using the SDK
Detecting poor audio quality can be challenging because the browser's reported information doesn't always reflect audio quality.

However, even if a poor network connection is causing poor audio quality, you can still identify these issues and display the information about potential issues with audio quality.

Through [User Facing Diagnostics API](../../../../concepts/voice-video-calling/user-facing-diagnostics.md), the application can register a listener callback to detect the network condition changes.

To check the network quality of the audio sending end, look for events with the values of `networkSendQuality`.

To check the network quality of the receiving end, look for events with the values of `networkReceiveQuality`.

The [Media Stats API](../../../../concepts/voice-video-calling/media-quality-sdk.md) provides several metrics that are indirectly correlated to the network or audio quality,
such as `packetsLostPerSecond` and `healedRatio`.
The `healedRatio` is calculated from the concealment count reported by the WebRTC Stats.
If this value is larger than 0.1, it's likely that the receiver experiences some audio quality degradation.

## How to mitigate or resolve

It's important to first locate where the problem is occurring.
Poor audio quality might come from issues on either the sender or receiver side.

To debug poor audio quality, it's often difficult to understand the issue from a text description alone.
It would be more helpful to obtain audio recordings captured by the user's browser.

If the user hears robotic-sounding audio, it's usually caused by packet loss.
If you suspect the audio quality is coming from the sender device, you can check the audio recordings captured from the sender's side.
If the sender is using Desktop Edge or Chrome, they can follow the instructions in this document to collect the audio recordings:
[How to collect diagnostic audio recordings](../references/how-to-collect-diagnostic-audio-recordings.md)

The audio recordings include the audio before and after it's processed by the audio processing module.
By comparing the recordings, you may be able to determine where the issue is coming from.

We found in some scenarios that when the browser is playing sound, especially if the sound is loud,
and the user starts speaking, the user's audio input in the first few seconds may be overly processed,
leading to distortion in the sound. This can be observed by comparing the ref\_out.wav and input.wav files in aecdump files.
In this case, reducing the volume of audio playing sound may help.

## References
### Troubleshooting process
Below is a flow diagram of the troubleshooting process for this issue.

:::image type="content" source="./media/poor-audio-quality-issue-troubleshooting.svg" alt-text="Diagram of troubleshooting the poor audio quality issue.":::
1. When a user reports experiencing poor audio quality during a call, the first thing to check is the source of the issue. It could be coming from the sender's side or the receiver's side. If other participants on different networks also have similar issues, it's very possible that the issue comes from the sender's side.
2. Check if there's `networkSendQuality` UFD Bad event on the sender's side.
3. If there's no `networkSendQuality` UFD Bad event on the sender's side, the poor audio could be due to device issues or audio distortion caused by the browser's audio processing module. Ask the user to collect diagnostic audio recordings from the browser. Refer to [How to collect diagnostic audio recordings](../references/how-to-collect-diagnostic-audio-recordings.md)
4. If there's a `networkSendQuality` UFD Bad event, the poor audio quality might be due to the sender's network issues. Check the sender's network.
5. If the user experiences poor audio quality but no other participants have the same issue, and there are only two participants in the call, still check the sender's network.
6. If the user experiences poor audio quality but no other participants have the same issue in a group call, the issue might be due to the receiver's network. Check for a `networkReceiveQuality` UFD Bad event on the receiver's end.
7. If there's a `networkReceiveQuality` UFD Bad event, check the receiver's network.
8. If you can't find a `networkReceiveQuality` UFD Bad event, check if other media stats metrics on the receiver's end are poor, such as packetsLost, jitter, etc.
9. If you can't determine why the audio quality on the receiver's end is poor, create a support ticket for the ACS team to investigate.
