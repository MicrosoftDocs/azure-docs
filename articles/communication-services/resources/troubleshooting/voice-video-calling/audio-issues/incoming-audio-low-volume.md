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
If the `audioOutputLevel` value is low, it's likely that the volume sent by the sender is also low.
To troubleshoot this issue, users should investigate why the audio input volume is low on the sender's side.
This problem could be due to various factors, such as microphone settings, or hardware issues.

The value of `audioOutputLevel` ranges from 0 - 65536. In practice, values lower than 60 can be considered quiet, and values lower than 150 are often considered low volume.

Users can check their device's volume settings and speaker output to ensure that they're set to an appropriate level.
If the `audioOutputLevel` value appears normal, the issue may be related to system volume settings or speaker issues on the receiver's side.

For example, if the user uses Windows, they should check the volume mixer settings and apps volume settings.

:::image type="content" source="./media/apps-volume-mixer.png" alt-text="Screenshot of volume mixer.":::

### Using Web Audio GainNode to increase the volume
It may be possible to address this issue at the application layer using Web Audio GainNode.
By using this feature with the raw audio stream, it's possible to increase the output volume of the stream.

You can also look to display a [volume level indicator](../../../../quickstarts/voice-video-calling/get-started-volume-indicator.md?pivots=platform-web) in your client user interface to let your users know what the current volume level is.

## References
### Troubleshooting process
Below is a flow diagram of the troubleshooting process for this issue.

:::image type="content" source="./media/low-volume-troubleshooting.svg" alt-text="Diagram of troubleshooting the low volume issue.":::

1. When a user reports experiencing low audio volume, the first thing to check is whether the volume of the incoming audio is low. The application can obtain this information by checking `audioOutputLevel` in the media stats.
2. If the `audioOutputLevel` value is constantly low, it indicates that the volume of audio sent by the speaking participant is low. In this case, ask the user to verify if the speaking participant has issues with their microphone device or input volume settings.
3. If the `audioOutputLevel` value isn't always low, the user may still experience low audio volume issue due to system volume settings. Ask the user to check their system volume settings. 
4. If the user's system volume is set to a low value, the user should increase the volume in the settings.
5. In some systems that support app-specific volume settings, the audio volume output from the app may be low even if system volume isn't low. In this case, the user should check their volume setting of the app within the system.
6. If the volume setting of the app in the system is low, the user should increase it.
7. If you still can't determine why the audio output volume is low, ask the user to check their speaker device or select another audio output device. The issue may be due to a device problem and not related to the software or operating system. Not all platforms support speaker enumeration in the browser. For example, you can't select an audio output device through the JavaScript API in the Safari browser or in Chrome on Android. In these cases, you should configure the audio output device in the system settings.
