---
title: Azure Communication Services - known issues
description: Learn more about Azure Communication Services
author: tophpalmer
manager: chpalm
services: azure-communication-services

ms.author: chpalm
ms.date: 06/30/2021
ms.topic: conceptual
ms.service: azure-communication-services
ms.custom: devx-track-js
---

# Known issues in the SDKs and APIs

This article provides information about limitations and known issues related to the Azure Communication Services Calling SDKs and Communication Services Call Automation APIs.

> [!IMPORTANT]
> There are multiple factors that can affect the quality of your calling experience. To learn more about Communication Services network configuration and testing best practices, see [Network recommendations](./voice-video-calling/network-requirements.md).

## JavaScript SDK

The following sections provide information about known issues associated with the Communication Services JavaScript voice and video calling SDKs.

### Chrome M115 - regression 

Chrome version 115 for Android introduced a regression when making video calls - the result of this bug is a user making a call on ACS with this version of Chrome will have no outgoing video in Group and ACS-MS Teams calls.
- This is a known regression introduced on [Chromium](https://bugs.chromium.org/p/chromium/issues/detail?id=1469318)
- As a short term mitigation please instruct users to use Microsoft Edge or Firefox on Android, or avoid using Google Chrome 115/116 on Android

### Firefox Known Issues
Firefox desktop browser support is now available in public preview. Known issues are:
- Enumerating speakers is not available: If you're using Firefox, your app won't be able to enumerate or select speakers through the Communication Services device manager. In this scenario, you must select devices via the operating system. 
- Virtual cameras are not currently supported when making Firefox desktop audio\video calls. 

### iOS Chrome Known Issues
iOS Chrome browser support is now available in public preview. Known issues are:
- No outgoing and incoming audio when switching browser to background or locking the device
- No incoming/outgoing audio coming from bluetooth headset. When a user connects bluetooth headset in the middle of ACS call, the audio still comes out from the speaker until the user locks and unlocks the phone. We have seen this issue on older iOS versions (15.6, 15.7), and it is not reproducible on iOS 16.

### iOS 16 introduced bugs when putting browser in the background during a call
The iOS 16 release has introduced a bug that can stop the ACS audio\video call when using Safari mobile browser. Apple is aware of this issue and is looking for a fix on their side. The impact could be that an ACS call might stop working during a call and the only resolution to get it working again is to have the end customer restart their phone. 

To reproduce this bug:
-	Have a user using an iPhone running iOS 16
-	Join ACS call (with audio only or with audio and video) using Safari iOS mobile browser
-	If during a call someone puts the Safari browser in the background and views YouTube OR receives a FaceTime\phone call while connected via a Bluetooth device

Results:
- After a few minutes of this situation, the incoming and outgoing video may stop working.
- The only way to get ACS calling to work again is to have the end user restart their phone.

### Chrome M98 - regression 

Chrome version 98 introduced a regression with abnormal generation of video keyframes that impacts resolution of a sent video stream negatively for majority (70%+) of users.
- This is a known regression introduced on [Chromium](https://bugs.chromium.org/p/chromium/issues/detail?id=1295815)

### No incoming audio during a call

Occasionally, a user in an ACS call may not be able to hear the audio from remote participants.
There is a related [Chromium](https://bugs.chromium.org/p/chromium/issues/detail?id=1402250) bug that causes this issue, the issue can be mitigated by reconnecting the PeerConnection. We've added this workaround since SDK 1.9.1 (stable) and SDK 1.10.0 (beta)

On Android Chrome, if a user joins ACS call several times, the incoming audio can also disappear. The user is not able to hear the audio from other participants until the page is refreshed. We've fixed this issue in SDK 1.10.1-beta.1, and improved the audio resource usage.

### Some Android devices failing call scenarios except for group calls.

A number of specific Android devices fail to start, accept calls, and meetings. The devices that run into this issue, won't recover and will fail on every attempt. These are mostly Samsung model A devices, particularly models A326U, A125U and A215U.
- This is a known regression introduced on [Chromium](https://bugs.chromium.org/p/webrtc/issues/detail?id=13223).

### Android Chrome mutes the call after browser goes to background for one minute

On Android Chrome, if a user is on an ACS call and puts the browser into background for one minute. The microphone will lose access and the other participants in the call won't hear the audio from the user. Once the user brings the browser to foreground, microphone is available again. Related chromium bugs [here](https://bugs.chromium.org/p/chromium/issues/detail?id=1027446) and [here](https://bugs.chromium.org/p/webrtc/issues/detail?id=10940)

### A mobile (iOS and Android) user has dropped the call but is still showing up on the participant list.

The problem can occur if a mobile user leaves the ACS group call without using the Call.hangUp() API. When a mobile user closes the browser or refreshes the webpage without hang up, other participants in the group call will still see this mobile user on the participant list for about 60 seconds.

### iOS Safari refreshes the page if the user goes to another app and returns back to the browser

The problem can occur if a user in an ACS call with iOS Safari, and switches to other app for a while. After the user returns back to the browser, 
the browser page may refresh. This is because OS kills the browser. One way to mitigate this issue is to keep some states and recover after page refreshes.


### iOS 15.1 users joining group calls or Microsoft Teams meetings.

* Sometimes when incoming PSTN is received the tab with the call or meeting will hang. Related WebKit bugs [here](https://bugs.webkit.org/show_bug.cgi?id=233707) and [here](https://bugs.webkit.org/show_bug.cgi?id=233708#c0).

### Local microphone/camera mutes when certain interruptions occur on iOS Safari and Android Chrome.

This problem can occur if another application or the operating system takes over the control of the microphone or camera. Here are a few examples that might happen while a user is in the call:

- An incoming call arrives via PSTN (Public Switched Telephone Network), and it captures the microphone device access.
- A user plays a YouTube video, for example, or starts a FaceTime call. Switching to another native application can capture access to the microphone or camera.
- A user enables Siri, which will capture access to the microphone.

On iOS, for example, while on an ACS call, if a PSTN call comes in, then a microphoneMutedUnexepectedly bad UFD will be raised and audio will stop flowing in the ACS call and the call will be marked as muted. Once the PSTN call is over, the user will have to go and unmute the ACS call for audio to start flowing again in the ACS call. In the case of Android Chrome when a PSTN call comes in, audio will stop flowing in the ACS call and the ACS call will not be marked as muted. In this case, there is no microphoneMutedUnexepectedly UFD event. Once the PSTN call is finished, Android Chrome will regain audio automatically and audio will start flowing normally again in the ACS call.

In case camera is on and an interruption occurs, ACS call may or may not lose the camera. If lost then camera will be marked as off and user will have to go turn it back on after the interruption has released the camera.

Occasionally, microphone or camera devices won't be released on time, and that can cause issues with the original call. For example, if the user tries to unmute while watching a YouTube video, or if a PSTN call is active simultaneously.

Incoming video streams won't stop rendering if the user is on iOS 15.2+ and is using SDK version 1.4.1-beta.1+, the unmute/start video steps will still be required to re-start outgoing audio and video. 

For iOS 15.4+, audio and video should be able to auto recover on most of the cases. On some edge cases, to unmute, an api to 'unmute' must be called by the application (can be as a result of user action) to recover the outgoing audio.

### iOS with Safari crashes and refreshes the page if a user tries to switch from front camera to back camera.

Azure Communication Services Calling SDK version 1.2.3-beta.1 introduced a bug that affects all of the calls made from iOS Safari. The problem occurs when a user tries to switch the camera video stream from front to back. Switching camera results in Safari browser to crash and reload the page.

This issue is fixed in Azure Communication Services Calling SDK version 1.3.1-beta.1 +

* iOS Safari version: 15.1

### Screen sharing in macOS Ventura Safari (v16.3 and below) 
Screen sharing does not work in macOS Ventura Safari(v16.3 and below). Known issue from Safari and will be fixed in v16.4+ 

### Refreshing a page doesn't immediately remove the user from their call

If a user is in a call and decides to refresh the page, the Communication Services media service won't remove this user immediately from the call. It will wait for the user to rejoin. The user will be removed from the call after the media service times out.

It's best to build user experiences that don't require end users to refresh the page of your application while in a call. If a user refreshes the page, reuse the same Communication Services user ID after that user returns back to the application. By rejoining with the same user ID, the user is represented as the same, existing object in the `remoteParticipants` collection. From the perspective of other participants in the call, the user remains in the call during the time it takes to refresh the page, up to a minute or two.

If the user was sending video before refreshing, the `videoStreams` collection will keep the previous stream information until the service times out and removes it. In this scenario, the application might decide to observe any new streams added to the collection, and render one with the highest `id`. 

### It's not possible to render multiple previews from multiple devices on web

This is a known limitation. For more information, see [Calling SDK overview](./voice-video-calling/calling-sdk-features.md).

### Enumerating devices isn't possible in Safari when the application runs on iOS or iPadOS

Applications can't enumerate or select speaker devices (like Bluetooth) on Safari iOS or iPadOS. This is a known limitation of these operating systems.

If you're using Safari on macOS, your app won't be able to enumerate or select speakers through the Communication Services device manager. In this scenario, you must select devices via the operating system. If you use Chrome on macOS, the app can enumerate or select devices through the Communication Services device manager.

* iOS Safari version: 15.1

### Repeatedly switching video devices might cause video streaming to stop temporarily

Switching between video devices might cause your video stream to pause while the stream is acquired from the selected device. Switching between devices frequently can cause performance degradation. It's best for developers to stop one device stream before starting another.

### Bluetooth headset microphone isn't detected or audible during the call on Safari on iOS

Bluetooth headsets aren't supported by Safari on iOS. Your Bluetooth device won't be listed in available microphone options, and other participants won't be able to hear you if you try using Bluetooth over Safari.

This is a known operating system limitation. With Safari on macOS and iOS/iPadOS, it's not possible to enumerate or select speaker devices through Communication Services device manager. This is because Safari doesn't support the enumeration or selection of speakers. In this scenario, use the operating system to update your device selection.

### Rotation of a device can create poor video quality

When users rotate a device, this movement can degrade the quality of video that is streaming.

The environment in which this problem occurs is the following:

- Devices affected: Google Pixel 5, Google Pixel 3a, Apple iPad 8, and Apple iPad X
- Client library: Calling (JavaScript)
- Browsers: Safari, Chrome
- Operating systems: iOS, Android

### Camera switching makes the screen freeze 

When a Communication Services user joins a call by using the JavaScript calling SDK, and then selects the camera switch button, the UI might become unresponsive. The user must then refresh the application, or push the browser to the background.

The environment in which this problem occurs is the following:

- Devices affected: Google Pixel 4a
- Client library: Calling (JavaScript)
- Browser: Chrome
- Operating systems: iOS, Android

### Video signal problem when the call is in connecting state 

If a user turns video on and off quickly while the call is in the *Connecting* state, this might lead to a problem with the stream acquired for the call. It's best for developers to build their apps in a way that doesn't require video to be turned on and off while the call is in the *Connecting* state. Degraded video performance might occur in the following scenarios:

 - If the user starts with audio, and then starts and stops video, while the call is in the *Connecting* state.
 - If the user starts with audio, and then starts and stops video, while the call is in the *Lobby* state.

### Enumerating or accessing devices for Safari on macOS and iOS 

In certain environments, you might notice that device permissions are reset after some period of time. On macOS and iOS, Safari doesn't keep permissions for a long time unless there is a stream acquired. The simplest way to work around this is to call the `DeviceManager.askDevicePermission()` API, before calling the device manager's device enumeration APIs. These enumeration APIs include `DeviceManager.getCameras()`, `DeviceManager.getSpeakers()`, and `DeviceManager.getMicrophones()`. If the permissions are there, the user won't see anything. If the permissions aren't there, the user will be prompted for the permissions again.

The environment in which this problem occurs is the following:

- Device affected: iPhone
- Client library: Calling (JavaScript)
- Browser: Safari
- Operating system: iOS

### Delay in rendering remote participant videos

During an ongoing group call, suppose that _User A_ sends video, and then _User B_ joins the call. Sometimes, User B doesn't see video from User A, or User A's video begins rendering after a long delay. A network environment configuration problem might cause this delay. For more information, see [Network recommendations](./voice-video-calling/network-requirements.md).

### Using third-party libraries during the call might result in audio loss

If you use `getUserMedia` separately inside the application, the audio stream is lost. This is because a third-party library takes over device access from the Azure Communication Services library.

- Don't use third-party libraries that are using the `getUserMedia` API internally during the call.
- If you still need to use a third-party library, the only way to recover the audio stream is to change the selected device (if the user has more than one), or to restart the call.

The environment in which this problem occurs is the following:

- Browser: Safari
- Operating system: iOS

The cause of this problem might be that acquiring your own stream from the same device will have a side effect of running into race conditions. Acquiring streams from other devices might lead the user into insufficient USB/IO bandwidth, and the `sourceUnavailableError` rate will skyrocket.  

### Excessive use of certain APIs like mute/unmute will result in throttling on ACS infrastructure

As a result of the mute/unmute API call, ACS infrastructure informs other participants in the call about the state of audio of a local participant who invoked mute/unmute, so that participants in the call know who is muted/unmuted.
Excessive use of mute/unmute will be blocked in ACS infrastructure. That will happen if the participant (or application on behalf of participant) will attempt to mute/unmute continuously, every second, more than 15 times in a 30-second rolling window.


## Communication Services Call Automation APIs

The following are known issues in the Communication Services Call Automation APIs:

- The only authentication currently supported for server applications is to use a connection string.

- Make calls only between entities of the same Communication Services resource. Cross-resource communication is blocked.

- Calls between tenant users of Microsoft Teams and Communication Services users or server application entities aren't allowed.

- If an application dials out to two or more PSTN identities and then quits the call, the call between the other PSTN entities drops.

## Group call limitations for JS web Calling SDK users		

Up to 100 users can join a group call using the JS web calling SDK. 

## Android API emulators
When utilizing Android API emulators on Android 5.0 (API level 21) and Android 5.1 (API level 22) some crashes are expected.  
