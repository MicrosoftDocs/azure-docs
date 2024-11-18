---
title: Audio issues - The user's speaker has a problem
titleSuffix: Azure Communication Services - Troubleshooting Guide
description: Learn how to troubleshoot one-way audio issue when the user's speaker has a problem.
author: enricohuang
ms.author: enricohuang

services: azure-communication-services
ms.date: 04/09/2024
ms.topic: troubleshooting
ms.service: azure-communication-services
ms.subservice: calling
---

# The user's speaker has a problem
When the user's speaker has a problem, they may not be able to hear the audio, resulting in one-way audio issue in the call.

## How to detect using the SDK
There's no way for a web application to detect speaker issues.
However, the application can use the [Media Stats Feature](../../../../concepts/voice-video-calling/media-quality-sdk.md) 
to understand whether the incoming audio is silent or not.

To check the audio level at the receiving end, look at `audioOutputLevel` value, which also ranges from 0 to 65536.
This value indicates the volume level of the decoded audio samples.
If the `audioOutputLevel` value isn't always low but the user can't hear audio, it indicates there's a problem in their speaker or output volume settings.

## How to mitigate or resolve
Speaker issues are considered external problems from the perspective of the ACS Calling SDK.

Your application user interface should display a [volume level indicator](../../../../quickstarts/voice-video-calling/get-started-volume-indicator.md?pivots=platform-web) to let your users know what the current volume level of incoming audio is.

If the incoming audio isn't silent, the user can know that the issue occurs in their speaker or output volume settings and can troubleshoot accordingly.

If the user uses Windows, they should also check the volume mixer settings and apps volume settings.

:::image type="content" source="./media/apps-volume-mixer.png" alt-text="Screenshot of volume mixer.":::

If you're using Web Audio API in your application, you might also check if there's `AudioRenderer error with rendering audio code: 3` in the log.
This error occurs when there are too many AudioContext instances open at the same time, particularly if the application doesn't properly close the AudioContext or 
if there's an AudioContext creation associated with the UI component refresh logic.

## References
### Troubleshooting process
If a user can't hear sound during a call, one possibility is that the participant has an issue with their speaker.
The speaker issue isn't easily detected and usually requires users to check their system settings or their audio output devices.

Below is a flow diagram of the troubleshooting process for this issue.

:::image type="content" source="./media/speaker-issue-troubleshooting.svg" alt-text="Diagram of troubleshooting the speaker issue.":::

1. When a user reports that they can't hear audio, the first thing we need to check is whether the incoming audio is silent. The application can obtain this information by checking `audioOutputLevel` in the media stats.
2. If the `audioOutputLevel` value is constantly 0, it indicates that the incoming audio is silent. In this case, ask the user to verify if the speaking participant is muted or experiencing other issues, such as permission issues, device problems, or network issues.
3. If the `audioOutputLevel` value isn't always 0, the user may still be unable to hear audio due to system volume settings. Ask the user to check their system volume settings. 
4. If the user's system volume is set to 0 or very low, the user should increase the volume in the settings.
5. In some systems that support app-specific volume settings, the audio volume output from the app may be low even if system volume isn't low. In this case, the user should check their volume setting of the app within the system.
6. If the volume setting of the app in the system is 0 or very low, the user should increase it.
7. In certain cases, the audio element in the browser may fail to play or decode the audio, you can find an error message `AudioRenderer error with rendering audio code: 3` in the log. 
8. A common case for the AudioRenderer error is that the app uses the Web Audio API but doesn't release AudioContext objects properly. Browsers have a limit on the number of AudioContext instances that can be open simultaneously.
9. If you still can't determine why the user can't hear sound during the call, ask the user to check their speaker device or select another audio output device. Note that not all platforms support speaker enumeration in the browser. For example, you can't select an audio output device through the JavaScript API in the Safari browser or in Chrome on Android. In these cases, you should configure the audio output device in the system settings.
