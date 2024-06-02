---
title: Azure Communication Services - known issues - Chrome
description: Learn more about known issues on Azure Communication Service calling when using a Chrome desktop and mobile browser experience
author: sloanster
services: azure-communication-services
 
ms.author: micahvivion
ms.date: 02/23/2024
ms.topic: include
ms.service: azure-communication-services
ms.subservice: calling
ms.custom: template-how-to
---

## Chrome Desktop

### Chrome M98 - a regression that degrades video resolution and increases keyframe generation for devices that do not have an NVIDIA card
**Browser version:** Google Chrome version 98 (Feb 2022)<br>
**Azure Communication Service calling SDK version:** All.<br>
**Description:** Chrome version 98 introduced a regression with abnormal generation of video keyframes that impacts resolution of a sent video stream negatively for the majority (70%+) of users.<br>
**Known issue reference:** This regression is a known issue introduced on [Chromium](https://bugs.chromium.org/p/chromium/issues/detail?id=1295815).<br>
**Recommended workaround:** Updating Google Chrome to the latest version.<br>
  
## Chrome Mobile Android

### Chrome M125 - No outgoing video in Group and Azure Communication Services-Microsoft Teams calls on some Android devices
**Browser version:** Google Chrome version 125 (May 2024) installed on Android devices.<br>
**Azure Communication Service calling SDK version:** All.<br>
**Description:** Chrome version 125 for Android introduced a regression when making video calls - the result of this bug is a user making a call on Azure Communication Services with this version of Chrome has no outgoing video in Group and Azure Communication Services-Microsoft Teams calls.
This behavior is observed on Huawei, OnePlus, Poco and Xiaomi Android devices. The behaviour is not observed on Samsung, Google Pixel and Motorola Android devices.<br>
**Devices affected:** 
- Huawei P30 Lite
- OnePlus Nord N10
- OnePlus 7T
- Poco X3 Pro
- Xiaomi Redmi 8T
and possibly other similar models/devices.<br>

### Outgoing audio issue on Android 14 when browser is in background or device screen is locked
**Android version:** Android 14.<br>
**Browser version:** All.<br>
**Azure Communication Service calling SDK version:** All.<br>
**Description:** On Android 14, when the browser is put in the background or the device screen is locked, the outgoing audio disappears after approximately 5 seconds. This issue affects user experience as it interrupts the audio transmission during calls. Issue is not observed on Android 13 or other versions of Android.<br>
**Recommended workaround:** Users are advised to keep the browser active in the foreground during calls.<br>

### Incoming and outgoing audio issue on Android when browser is in background or device screen is locked with Power Saving mode enabled
**Browser version:** All.<br>
**Azure Communication Service calling SDK version:** All.<br>
**Description:** On Android mobile phones when Power Saving mode enabled, incoming and outgoing audio stops immediately when the browser hosting the ACS call is put in the background or the device screen is locked. Additionally, because of the action of putting the browser is backgrounded under Power Saving mode the user will be disconnected and removed from the call after approximately one minute after the device screen is locked or the browser goes into the background.<br>
**Known issue reference:** This is a known issue on [Chromium](https://issues.chromium.org/issues/40282141?pli=1).<br>
**Recommended workaround:** To avoid this issue, users are advised to either keep the browser active in the foreground during calls or disable Power Saving mode while on WebRTC calls.<br>

### Incoming video sometimes blinks and duplicates with another incoming video or is applied with a green overlay for a short moment on some Android devices
**Browser version:** All.<br>
**Azure Communication Service calling SDK version:** All.<br>
**Description:** When more than three users are in a video call with a user who has an Android device, the Android user can sometimes observe that the incoming video is blinking and sometimes duplicates with another incoming video. Another behavior users sometimes experience in the same use case is that the incoming video may appear with a green tint or green overlay for a short moment, and at other times it lasts longer. This behavior is especially noticeable when another user re-enables their camera or joins the call with their video turned on. This behavior is observed on Samsung Galaxy S10, S20, S21, and Google Pixel 6, 8.<br>
**Devices affected:** 
- Samsung Galaxy S10
- Samsung Galaxy S20
- Samsung Galaxy S21
- Google Pixel 6
- Google Pixel 8<br>

**Known issue reference:** This regression is a known issue on [Chromium](https://issues.chromium.org/issues/343086045).<br>

### Chrome M115 - No outgoing video in Group and Azure Communication Services-Microsoft Teams calls
**Browser version:** Google Chrome version 115 (Jul 2023) installed on Android devices.<br>
**Azure Communication Service calling SDK version:** All.<br>
**Description:** Chrome version 115 for Android introduced a regression when making video calls - the result of this bug is a user making a call on Azure Communication Services with this version of Chrome has no outgoing video in Group and  Azure Communication Services-Microsoft Teams calls.<br>
**Known issue reference:** This regression is a known issue introduced on [Chromium](https://bugs.chromium.org/p/chromium/issues/detail?id=1469318). <br>
**Recommended workaround:** As a short term mitigation, instruct users to use Microsoft Edge or Firefox on Android, or avoid using Google Chrome 115/116 on Android.<br>

### Android user can still hear audio from the "Azure Communication Services" call while on a PSTN call
**Browser version:** All.<br>
**Azure Communication Service calling SDK version:** All.<br>
  **Description:** This issue happens when an Android Chrome user experiences an incoming PSTN call.
    After answering the PSTN call, the microphone in the "Azure Communication Services" call becomes muted.
    The outgoing audio of the "Azure Communication Services" call is muted, so other participants can't hear the user who is the PSTN call.
    It's worth noting that the user's incoming audio isn't muted, and this behavior is inherent to the browser.
<br>
**Recommended workaround:** Await a forthcoming update or patch from Google.<br>

### Incoming audio is noticeably quieter in Azure Communication Services call after Third-party app call on Android devices
**Browser version:** All.<br>
**Azure Communication Service calling SDK version:** All.<br>
**Description:** Users experience noticeably quieter incoming audio after receiving and accepting a call from a third-party app (e.g., WhatsApp, Viber) during an Azure Communication Services call. 
This issue occurs on Android devices using the mobile browser. Additionally, volume controls indicate maximum levels, although the audio remains quieter than before the third-party call.<br>
**Known issue reference:** This is a known issue on [Chromium](https://bugs.chromium.org/p/webrtc/issues/detail?id=14986). <br>
**Recommended workaround:** Users are advised to either rejoin the Azure Communication Services call or handle third-party app calls separately.<br>

### Android Chrome mutes the call after browser goes to background for one minute
**Browser version:** All.<br>
**Azure Communication Service calling SDK version:** All.<br>
**Description:** On Android Chrome, if a user is on an Azure Communication Services call and puts the browser into background for one minute. The microphone loses access and the other participants in the call can't hear the audio from the user. Once the user brings the browser to foreground, microphone is available again.<br>
**Known issue reference:** Related chromium bugs [here](https://bugs.chromium.org/p/chromium/issues/detail?id=1027446) and [here](https://bugs.chromium.org/p/webrtc/issues/detail?id=10940). <br>
    
### Local microphone/camera mutes when certain interruptions occur on Android Chrome
**Browser version:** All.<br>
**Azure Communication Service calling SDK version:** All.<br>
**Description:** This problem can occur if another application or the operating system takes over the control of the microphone or camera. Here are a few examples that might happen while a user is in the call:
  - An incoming call arrives via PSTN (Public Switched Telephone Network), and it captures the microphone device access.
  - A user plays a YouTube video, for example, or starts a Third-party app call. Switching to another native application can capture access to the microphone or camera.
    
On Android Chrome, when a PSTN call comes in, audio stops flowing in the Azure Communication Services call and the Azure Communication Services call isn't marked as muted. In this case, there's no microphoneMutedUnexepectedly UFD event. Once the PSTN call is finished, Android Chrome regains audio automatically and audio starts flowing normally again in the Azure Communication Services call.

In case camera is on and an interruption occurs, Azure Communication Services call may or may not lose the camera. If lost then camera is marked as off and user has to go turn it back on after the interruption  released the camera.

Occasionally, microphone or camera devices aren't released on time, and that can cause issues with the original call. For example, if the user tries to unmute while watching a YouTube video, or if a PSTN call is active simultaneously.
<br>

### Automatic microphone selection fails for wired headphones in WebRTC Calls on Android devices
**Browser version:** All.<br>
**Azure Communication Service calling SDK version:** All.<br>
**Description:** When users connect wired headphones to their Android device and join a WebRTC call, the microphone option does not default to the wired headphones. This issue is consistently reproducible across different Android devices and Google Chrome versions. Similar behavior has been noted in other services like Twilio and Google's WebRTC sample.<br>
**Known issue reference:** This is a known issue on [Chromium](https://issues.chromium.org/issues/40282142). <br>
**Recommended workaround:** Users should manually select the wired headphones as the microphone option in the call settings after joining the WebRTC call.<br>

### A mobile Android user has dropped the call but is still showing up on the participant list
**Browser version:** All.<br>
**Azure Communication Service calling SDK version:** All.<br>
**Description:** The problem can occur if a mobile user leaves the Azure Communication Services group call without using the Call.hangUp() API. When a mobile user closes the browser or refreshes the webpage without hang up, other participants in the group call can still see this mobile user on the participant list for about 60 seconds.
<br>

### Some Android devices (A326U, A125U and A215U) failing call scenarios except for group calls
**Devices affected:** 
- Samsung Galaxy A32 (Model A326U)
- Samsung Galaxy A12 (Model A125U)
- Samsung Galaxy A21 (Model A215U)<br>

**Description:**  Many specific Android devices fail to start, accept calls, and meetings. The devices that run into this issue, can't recover and fails on every attempt. These are mostly Samsung model A devices, particularly models A326U, A125U and A215U.<br>
    
### Rotation of a device can create poor video quality - Google Pixel 3a, Google Pixel 5

**Devices affected:** Google Pixel 3a, Google Pixel 5.<br>
**Browser version:** All.<br>
**Azure Communication Service calling SDK version:** All.<br>
**Description:**  When users rotate a device, this movement can degrade the quality of video that is streaming.<br>

### Camera switching makes the screen freeze - Google Pixel 4a
**Device affected:** Google Pixel 4a.<br>
**Browser version:** All.<br>
**Azure Communication Service calling SDK version:** All.<br>
**Description:** When a Communication Services user joins a call by using the JavaScript calling SDK, and then selects the camera switch button, the UI might become unresponsive. The user must then refresh the application, or push the browser to the background.<br>


## Chrome Mobile iOS

### No outgoing and incoming audio when switching browser to background or locking the device - fixed in iOS version 16.4+
**iOS version:** All iOS versions up to iOS 16.3.<br>
**Azure Communication Service calling SDK version:** All.<br>
**Description:** The issue of no outgoing or incoming audio when switching the browser to the background or locking the device was present up to and including iOS version 16.3, and was fixed starting with iOS 16.4.<br>
**Known issue reference:** Related [WebKit](https://bugs.webkit.org/show_bug.cgi?id=241480) bug. <br>
**Recommended workaround:** Consider updating to the latest iOS version.<br>
  
### No incoming/outgoing audio coming from bluetooth headset - iOS 15
**iOS version:** We have seen this issue on iOS versions - 15.6, 15.7.<br>
**Azure Communication Service calling SDK version:** All.<br>
**Description:** When a user connects bluetooth headset in the middle of Azure Communication Services call, the audio still comes out from the speaker until the user locks and unlocks the phone.
Issue isn't reproducible on iOS 16.<br>
**Recommended workaround:** Consider updating to the latest iOS version.<br>
  
### A mobile iOS user has dropped the call but is still showing up on the participant list
**Browser version:** All.<br>
**Azure Communication Service calling SDK version:** All.<br>
**Description:** The problem can occur if a mobile user leaves the Azure Communication Services group call without using the Call.hangUp() API. When a mobile user closes the browser or refreshes the webpage without hang up, other participants in the group call can still see this mobile user on the participant list for about 60 seconds.
