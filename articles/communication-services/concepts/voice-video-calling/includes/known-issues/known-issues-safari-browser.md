---
title: Azure Communication Services - known issues - Safari
description: Learn more about known issues on Azure Communication Service calling when using a Safari desktop and mobile browser experience
author: sloanster
services: azure-communication-services
 
ms.author: micahvivion
ms.date: 02/21/2024
ms.topic: include
ms.service: azure-communication-services
ms.subservice: calling
ms.custom: template-how-to
---

## Safari Desktop
___

### On macOS Safari 17 and up, video background effects might cause video flashing, both in local preview and on the remote side

**Browser version:** Safari 17 and up. <br>
**Azure Communication Service calling SDK version:** All.<br>
**Description:** A bug was found in one of the updates of the macOS Safari 17 that is causing our background effects implementation frame capture to skip frames and hence might cause video flashing both in the local preview and the remote side.<br>
**Recommended workaround:** Await a forthcoming update or patch from Apple.

### Screen sharing does not work on macOS Ventura with Safari versions up to 16.3.
**Browser version:** Safari v16.1, v16.2, v16.3 (macOS Ventura 13.0).<br>
**Azure Communication Service calling SDK version:** All.<br>
**Description:** The issue was introduced in macOS Ventura 13.0 when using the Safari browser (v16.1, v16.2, and v16.3), and a fix has been available starting from Safari version 16.4.<br>
**Known issue reference:** This regression is a known issue introduced on [Safari](https://bugs.webkit.org/show_bug.cgi?id=247883).<br>
**Recommended workaround:** Consider updating to the latest macOS/Safari version..<br>


## Safari iOS Mobile
___

### iOS 16 introduced bugs when putting browser in the background during a call
**iOS version:** iOS versions 16 to 16.1.<br>
**Azure Communication Service calling SDK version:** All.<br>
**Description:** The iOS 16 release introduced a bug that can stop the Azure Communication Services audio\video call when using Safari mobile browser. The impact could be that an Azure Communication Services call might stop working during a call and the only resolution to get it working again is to have the end customer restart their phone. 
To reproduce this bug: 
- Have a user using an iPhone running iOS 16.
- Join Azure Communication Services call (with audio only or with audio and video) using Safari iOS mobile browser.
If during a call someone puts the Safari browser in the background and views YouTube OR receives a FaceTime\phone call while connected via a Bluetooth device
Results:
- After a few minutes of this situation, the incoming and outgoing video may stop working.
- The only way to get Azure Communication Services calling to work again is to have the end user restart their phone.
Bug was fixed with iOS 16.2.<br>

**Known issue reference:** Related WebKit bugs [here](https://bugs.webkit.org/show_bug.cgi?id=243982) and [here](https://bugs.webkit.org/show_bug.cgi?id=244505).<br>
**Recommended workaround:** Consider updating to the latest iOS version.<br>
  

### Bluetooth headset microphone isn't detected or audible during the call on Safari on iOS
**iOS version:** All<br>
**Azure Communication Service calling SDK version:** All.<br>
**Description:** Bluetooth headsets aren't supported by Safari on iOS. Your Bluetooth device isn't listed in available microphone options, and other participants aren't able to hear you if you try using Bluetooth over Safari. This regression is a known operating system limitation. With Safari on macOS and iOS/iPadOS, it isn't possible to enumerate or select speaker devices through Communication Services device manager. This is because Safari doesn't support the enumeration or selection of speakers.<br>
**Recommended workaround:** In this scenario, use the operating system to update your device selection.<br>

### Using third-party libraries during the call might result in audio loss

**Browser version:** All.<br>
**Azure Communication Service calling SDK version:** All.<br>
**Description:** If you use `getUserMedia` separately inside the application, the audio stream is lost. Audio stream is lost because a third-party library takes over device access from the Azure Communication Services library.
  - Don't use third-party libraries that are using the  `getUserMedia` API internally during the call.
  - If you still need to use a third-party library, the only way to recover the audio stream is to change the selected device (if the user has more than one), or to restart the call.
 The cause of this problem might be that acquiring your own stream from the same device has a side effect of running into race conditions. Acquiring streams from other devices might lead the user into insufficient USB/IO bandwidth, and the `sourceUnavailableError` rate skyrockets. 
  

### Enumerating or accessing devices for Safari on iOS
**Browser version:** All.<br>
**Azure Communication Service calling SDK version:** All.<br>
**Description:** In certain environments, you might notice that device permissions are reset after some period of time. On macOS and iOS, Safari doesn't keep permissions for a long time unless there's a stream acquired. The simplest way to work around this limitation is to call the `DeviceManager.askDevicePermission()` API, before calling the device manager's device enumeration APIs. These enumeration APIs include `DeviceManager.getCameras()`, `DeviceManager.getSpeakers()`, and `DeviceManager.getMicrophones()`. If the permissions are there, the user doesn't see anything. If the permissions aren't there, the user is prompted for the permissions again.<br>

### Local microphone/camera mutes when certain interruptions occur on iOS Safari
**Description:** This problem can occur if another application or the operating system takes over the control of the microphone or camera. Here are a few examples that might happen while a user is in the call:
  - An incoming call arrives via PSTN (Public Switched Telephone Network), and it captures the microphone device access.
  - A user plays a YouTube video, for example, or starts a FaceTime call. Switching to another native application can capture access to the microphone or camera.
  - A user enables Siri, which captures access to the microphone.

On iOS, for example, while on an Azure Communication Services call, if a PSTN call comes in, then a microphoneMutedUnexepectedly bad UFD is raised and audio stops flowing in the Azure Communication Services call and the call is marked as muted. Once the PSTN call is over, the user has to unmute the Azure Communication Services call for audio to start flowing again in the Azure Communication Services call.

In case camera is on and an interruption occurs, Azure Communication Services call may or may not lose the camera. If lost then camera is marked as off and user has to go turn it back on after the interruption  released the camera.

Occasionally, microphone or camera devices aren't released on time, and that can cause issues with the original call. For example, if the user tries to unmute while watching a YouTube video, or if a PSTN call is active simultaneously.

- Incoming video streams don't stop rendering if the user is on iOS 15.2+ and is using SDK version 1.4.1-beta.1+, the unmute/start video steps are still required to restart outgoing audio and video.
- For iOS 15.4+, audio and video should be able to auto recover on most of the cases. On some edge cases, to unmute, application must call an API to 'unmute' (can be as a result of user action) to recover the outgoing audio.

### iOS Safari refreshes the page if the user goes to another app and returns back to the browser

**Browser version:** All.<br>
**Azure Communication Service calling SDK version:** All.<br>
**Description:** The problem can occur if a user in an Azure Communication Services call with iOS Safari, and switches to other app for a while. After the user returns back to the browser, the browser page may refresh. This is because OS kills the browser. One way to mitigate this issue is to keep some states and recover after page refreshes.<br>

### A mobile iOS user has dropped the call but is still showing up on the participant list

**Browser version:** All.<br>
**Azure Communication Service calling SDK version:** All.<br>
**Description:** The problem can occur if a mobile user leaves the Azure Communication Services group call without using the Call.hangUp() API. When a mobile user closes the browser or refreshes the webpage without hang up, other participants in the group call can still see this mobile user on the participant list for about 60 seconds.<br>

### Safari freezing issue on iOS 15
**Browser version:** iOS versions 15 to 15.1.<br>
**Azure Communication Service calling SDK version:** All.<br>
**Description:** Users may experience Safari freezing when navigating to YouTube, enabling Siri, receiving incoming PSTN calls, or during other interruption scenarios while in a WebRTC call. This is a known issue introduced with iOS 15 and observed in iOS versions 15.0, 15.0.2, and 15.1.
- It has been fixed with iOS 15.2+.<br>

**Known issue reference:** Related WebKit bugs [here](https://bugs.webkit.org/show_bug.cgi?id=233707) and [here](https://bugs.webkit.org/show_bug.cgi?id=233708).<br>
**Recommended workaround:** Consider updating to the latest iOS version.<br>


## Safari iPadOS Tablet
___

### Rotation of a device can create poor video quality - Apple iPad 8 and Apple iPad X
**Devices affected:** Apple iPad 8 and Apple iPad X.<br>
**Description:** When users rotate a device, this movement can degrade the quality of video that is streaming.<br>
