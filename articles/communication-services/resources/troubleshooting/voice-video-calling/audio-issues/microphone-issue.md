---
title: Audio issues - The speaking participant's microphone has a problem
titleSuffix: Azure Communication Services - Troubleshooting Guide
description: Learn how to troubleshoot one-way audio issue when the speaking participant's microphone has a problem.
author: enricohuang
ms.author: enricohuang

services: azure-communication-services
ms.date: 04/09/2024
ms.topic: troubleshooting
ms.service: azure-communication-services
ms.subservice: calling
---

# The speaking participant's microphone has a problem
When the speaking's participant's microphone has a problem, it might cause the outgoing audio to be silent, resulting in one-way audio issue in the call.

## How to detect using the SDK
Your application can use [User Facing Diagnostics API](../../../../concepts/voice-video-calling/user-facing-diagnostics.md) and register a listener callback to detect the device issue.

There are several events related to the microphone issues, including:
* `noMicrophoneDevicesEnumerated`: There's no microphone device available in the system.
* `microphoneNotFunctioning`: The browser ends the audio input track.
* `microphoneMuteUnexpectedly`: The browser mutes the audio input track.

In addition, the [Media Stats API](../../../../concepts/voice-video-calling/media-quality-sdk.md) also provides a way to monitor the audio input or output level.

To check the audio level at the sending end, look at `audioInputLevel` value, which ranges from 0 to 65536 and indicates the volume level of the audio captured by the audio input device.

To check the audio level at the receiving end, look at `audioOutputLevel` value, which also ranges from 0 to 65536. This value indicates the volume level of the decoded audio samples.
If the `audioOutputLevel` value is low, it indicates that the volume sent by the sender is also low.

## How to mitigate or resolve
Microphone issues are considered external problems from the perspective of the ACS Calling SDK.
For example, the `noMicrophoneDevicesEnumerated` event indicates that no microphone device is available in the system.
This problem usually happens when the user removes the microphone device and there's no other microphone device in the system.
The `microphoneNotFunctioning` event fires when the browser ends the current audio input track,
which can happen when the operating system or driver layer terminates the audio input session.
The `microphoneMuteUnexpectedly` event can occur when the audio input track's source is temporarily unable to provide media data.
For example, a hardware mute button of some headset models can trigger this event.

The application should listen to the [User Facing Diagnostics API](../../../../concepts/voice-video-calling/user-facing-diagnostics.md) events.
The application should display a warning message when receiving events.
By doing so, the user is aware of the issue and can troubleshoot by switching to a different microphone device or by unplugging and plugging in their current microphone device.
