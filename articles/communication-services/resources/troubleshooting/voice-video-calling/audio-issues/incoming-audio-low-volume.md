---
title: Audio issues - The volume of the incoming audio is low
titleSuffix: Azure Communication Services - Troubleshooting Guide
description: Learn how to troubleshoot when the volume of the incoming audio is low.
author: enricohuang
ms.author: enricohuang

services: azure-communication-services
ms.date: 04/09/2024
ms.topic: troubleshooting
ms.service: azure-communication-services
ms.subservice: calling
---

# The volume of the incoming audio is low
If users report low incoming audio volume, there could be several possible causes.
One possibility is that the volume sent by the sender is low.
Another possibility is that the operating system volume is set too low.
Finally, it's possible that the speaker output volume is set too low.

If you use [raw audio](../../../../quickstarts/voice-video-calling/get-started-raw-media-access.md?pivots=platform-web) API, you may also need to check the output volume of the audio element.

## How to detect using the SDK
The [Media Stats API](../../../../concepts/voice-video-calling/media-quality-sdk.md) provides a way to monitor the incoming audio volume at receiving end.

To check the audio output level, you can look at `audioOutputLevel` value, which ranges from 0 to 65536.
This value is derived from `audioLevel` in WebRTC Stats. [https://www.w3.org/TR/webrtc-stats/#dom-rtcinboundrtpstreamstats-audiolevel](https://www.w3.org/TR/webrtc-stats/#dom-rtcinboundrtpstreamstats-audiolevel)
A low `audioOutputLevel` value indicates that the volume sent by the sender is also low.

## How to mitigate or resolve
If the `audioOutputLevel` value is low, this is likely that the volume sent by the sender is also low.
To troubleshoot this issue, users should investigate why the audio input volume is low on the sender's side.
This problem could be due to various factors, such as microphone settings, or hardware issues.

If the `audioOutputLevel` value appears normal, the issue may be related to system volume settings or speaker issues on the receiver's side.
Users can check their device's volume settings and speaker output to ensure that they're set to an appropriate level.

### Using Web Audio GainNode to increase the volume
It may be possible to address this issue at the application layer using Web Audio GainNode.
By using this feature with the raw audio stream, it's possible to increase the output volume of the stream.

You can also look to display a [volume level indicator](../../../../quickstarts/voice-video-calling/get-started-volume-indicator.md?pivots=platform-web) in your client user interface to let your users know what the current volume level is.

