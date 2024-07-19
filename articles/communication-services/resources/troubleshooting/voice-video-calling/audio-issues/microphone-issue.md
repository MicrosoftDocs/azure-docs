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

## References
### Troubleshooting process
If a user can't hear sound during a call, one possibility is that the speaking participant has an issue with their microphone.
If the speaking participant is using your application, you can follow this flow diagram to troubleshoot the issue.

:::image type="content" source="./media/microphone-issue-troubleshooting.svg" alt-text="Diagram of troubleshooting the microphone issue.":::

1. First, check if a microphone is available. The application can obtain this information by invoking `DeviceManager.getMicrophone` API or by detecting a `noMicrophoneDevicesEnumerated` UFD Bad event.
2. If no microphone device is available, prompt the user to plug in a microphone.
3. If a microphone is available but there's no outgoing audio, consider other possibilities such as permission issues, device issues, or network problems.
4. If permission is denied, refer to [The speaking participant doesn't grant the microphone permission](./microphone-permission.md) for more information.
5. If permission is granted, consider whether the issue is due to an external problem, such as `microphoneMuteUnexpectedly` UFD.
6. The `microphoneMuteUnexpectedly` UFD Bad event is triggered when the browser mutes the audio input track. The application can monitor this UFD but isn't able to detect the reason at JavaScript layer. You can still provide instructions in the app and ask if the user is using hardware mute button on their headset.
7. If the user releases the hardware mute and the `microphoneMuteUnexpectedly` UFD recovers, the issue is resolved.
8. If the user isn't using the hardware mute, ask the user to unplug and replug the microphone, or to select another microphone. Ensure the user hasn't muted the microphone at the system level.
9. No outgoing audio issue can also happen when there's a `microphoneNotFunctioning` UFD Bad event.
10. If there's no `microphoneNotFunctioning` UFD Bad event, consider other possibilities, such as network issues.
11. If there's a `networkReconnect` Bad UFD, outgoing audio may be temporarily lost due to a network disconnection. Refer to [There's a network issue in the call](./network-issue.md) for detailed information.
12. If there are no microphone-related events and no network-related events, create a support ticket for ACS team to investigate the issue. Refer to [Reporting an issue](../general-troubleshooting-strategies/report-issue.md).
13. If a `microphoneNotFunctioning` UFD Bad event occurs, and the user has no outgoing audio, they can try to recover the stream by using ACS [mute](/javascript/api/azure-communication-services/@azure/communication-calling/call?view=azure-communication-services-js&preserve-view=true#@azure-communication-calling-call-mute) and [unmute](/javascript/api/azure-communication-services/@azure/communication-calling/call?view=azure-communication-services-js&preserve-view=true#@azure-communication-calling-call-unmute).
14. If the `microphoneNotFunctioning` UFD doesn't recover after the user performs ACS mute and unmute, there might be an issue with the microphone device. Ask the user to unplug and replug the microphone or select another microphone.
