---
title: Azure Communication Services - known issues
description: Learn more about Azure Communication Services
author: rinarish
manager: chpalm
services: azure-communication-services

ms.author: rifox
ms.date: 06/30/2021
ms.topic: conceptual
ms.service: azure-communication-services
---

# Known issues in the SDKs and APIs

This article provides information about limitations and known issues related to the Azure Communication Services Calling SDKs and Communication Services Call Automation APIs.

> [!IMPORTANT]
> There are multiple factors that can affect the quality of your calling experience. To learn more about Communication Services network configuration and testing best practices, see [Network recommendations](./voice-video-calling/network-requirements.md).

## Communication Services Calling SDKs

The following sections provide information about known issues associated with the Communication Services JavaScript voice and video calling SDKs.

### Refreshing a page doesn't immediately remove the user from their call

If a user is in a call and decides to refresh the page, the Communication Services media service won't remove this user immediately from the call. It will wait for the user to rejoin. The user will be removed from the call after the media service times out.

It's best to build user experiences that don't require end users to refresh the page of your application while in a call. If a user refreshes the page, reuse the same Communication Services user ID after that user returns back to the application. By rejoining with the same user ID, the user is represented as the same, existing object in the `remoteParticipants` collection. (Note that from the perspective of other participants in the call, the user remains in the call during the time it takes to refresh the page, up to a minute or two.)

If the user was sending video before refreshing, the `videoStreams` collection will keep the previous stream information until the service times out and removes it. In this scenario, the application might decide to observe any new streams added to the collection, and render one with the highest `id`. 

### It's not possible to render multiple previews from multiple devices on web

This is a known limitation. For more information, see [Calling SDK overview](./voice-video-calling/calling-sdk-features.md).

### Enumerating devices isn't possible in Safari when the application runs on iOS or iPadOS

Applications can't enumerate or select mic or speaker devices (like Bluetooth) on Safari iOS or iPadOS. This is a known limitation of these operating systems.

If you're using Safari on macOS, your app won't be able to enumerate or select speakers through the Communication Services device manager. In this scenario, you must select devices via the operating system. If you use Chrome on macOS, the app can enumerate or select devices through the Communication Services device manager.

### Device mutes and incoming video stops rendering when certain interruptions occur

This problem can occur if another application or the operating system takes over the control of the microphone or camera. Here are a few examples that might happen while a user is in the call:

- An incoming call arrives via PSTN (Public Switched Telephone Network), and it captures the microphone device access.
- A user plays a YouTube video, for example, or starts a FaceTime call. Switching to another native application can capture access to the microphone or camera.
- A user enables Siri, which will capture access to the microphone.

To recover from all these cases, the user must go back to the application to unmute. In the case of video, the user must start the video in order to have the audio and video start flowing after the interruption.

Occasionally, microphone or camera devices won't be released on time, and that can cause issues with the original call. For example, if the user tries to unmute while watching a YouTube video, or if a PSTN call is active simultaneously. 

The environment in which this problem occurs is the following:

- Client library: Calling (JavaScript)
- Browser: Safari
- Operating system: iOS

### Repeatedly switching video devices might cause video streaming to temporarily stop

Switching between video devices may cause your video stream to pause while the stream is acquired from the selected device.

##### Possible causes
Switching between devices frequently can cause performance degradation. Developers are encouraged to stop one device stream before starting another.

#### Bluetooth headset microphone is not detected therefore is not audible during the call on Safari on iOS
Bluetooth headsets aren't supported by Safari on iOS. Your Bluetooth device won't be listed in available microphone options and other participants won't be able to hear you if you try using Bluetooth over Safari.

##### Possible causes
This is a known macOS/iOS/iPadOS operating system limitation. 

With Safari on **macOS** and **iOS/iPadOS**, it is not possible to enumerating/selecting speaker devices through the Communication Services Device Manager since speakers enumeration/selection is not supported by Safari. In this scenario, your device selection should be updated via the operating system.

#### Rotation of a device can create poor video quality
Users may experience degraded video quality when devices are rotated.

<br/>Devices affected: Google Pixel 5, Google Pixel 3a, Apple iPad 8, and Apple iPad X
<br/>Client library: Calling (JavaScript)
<br/>Browsers: Safari, Chrome
<br/>Operating System: iOS, Android


#### Camera switching makes the screen freeze 
When a Communication Services user joins a call using the JavaScript calling SDK and then hits the camera switch button, the UI may become unresponsive until the application is refreshed or browser is pushed to the background by user.

<br/>Devices affected: Google Pixel 4a
<br/>Client library: Calling (JavaScript)
<br/>Browsers: Chrome
<br/>Operating System: iOS, Android


##### Possible causes
Under investigation.

#### If the video signal was stopped while the call is in "connecting" state, the video will not be sent after the call started 
If users decide to quickly turn video on/off while call is in `Connecting` state - this may lead to problem with stream acquired for the call. We encourage developers to build their apps in a way that doesn't require video to be turned on/off while call is in `Connecting` state. This issue may cause degraded video performance in the following scenarios:

 - If the user starts with audio and then start and stop video while the call is in `Connecting` state.
 - If the user starts with audio and then start and stop video while the call is in `Lobby` state.

##### Possible causes
Under investigation.

#### Enumerating/accessing devices for Safari on macOS and iOS 
If access to devices are granted, after some time, device permissions are reset. Safari on macOS and on iOS does not keep permissions for very long time unless there is a stream acquired. The simplest way to work around this is to call DeviceManager.askDevicePermission() API before calling the device manager's device enumeration APIs (DeviceManager.getCameras(), DeviceManager.getSpeakers(), and DeviceManager.getMicrophones()). If the permissions are there, then user will not see anything, if not, it will re-prompt.

<br/>Devices affected: iPhone
<br/>Client library: Calling (JavaScript)
<br/>Browsers: Safari
<br/>Operating System: iOS

####  Sometimes it takes a long time to render remote participant videos
During an ongoing group call, _User A_ sends video and then _User B_ joins the call. Sometimes, User B doesn't see video from User A, or User A's video begins rendering after a long delay. This issue could be caused by a network environment that requires further configuration. Refer to the [network requirements](./voice-video-calling/network-requirements.md) documentation for network configuration guidance.

#### Using 3rd party libraries to access GUM during the call may result in audio loss
Using getUserMedia separately inside the application will result in losing audio stream since a third party library takes over device access from ACS library.
Developers are encouraged to do the following:
- Don't use 3rd party libraries that are using internally GetUserMedia API during the call.
- If you still need to use 3rd party library, only way to recover is to either change the selected device (if the user has more than one) or restart the call.

<br/>Browsers: Safari
<br/>Operating System: iOS

##### Possible causes
In some browsers (Safari for example), acquiring your own stream from the same device will have a side-effect of running into race conditions. Acquiring streams from other devices may lead the user into insufficient USB/IO bandwidth, and sourceUnavailableError rate will skyrocket.  

#### Support for Simulcast
Simulcast is a technique by which a client encodes the same video stream twice in different resolutions and bitrates and letting the ACS infrastructure decide which stream a client should receive. The ACS calling library SDK for Windows, Android, or iOS support sending simulcast streams. The ACS Web SDK does not currently support sending simulcast streams out.

## Azure Communication Services Call Automation APIs

Following are the known issues in the Azure Communication Services Call Automation APIs

- The only authentication supported at this time for server applications is using a connection string.

- Calls should be make only between entities of the same Azure Communication Service resource. Cross resource communication is blocked.

- Calls between Teams' tenant users and Azure Communication Service user or server application entities are not allowed.

- If an application dials out to two or more PSTN identities and then quits the call, the call between the other PSTN entities would be dropped.

