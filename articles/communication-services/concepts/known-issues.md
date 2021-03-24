---
title: Azure Communication Services - known issues
description: Learn more about Azure Communication Services
author: rinarish
manager: jken
services: azure-communication-services

ms.author: mikben
ms.date: 03/10/2021
ms.topic: troubleshooting
ms.service: azure-communication-services
---

# Known issues: Azure Communication Services client libraries
This article provides information about limitations and known issues related to the Azure Communication Services client libraries.

> [!IMPORTANT]
> There are multiple factors that can affect the quality of your calling experience. Refer to the **[network requirements](./voice-video-calling/network-requirements)** documentation to learn more about Communication Services network configuration and testing best practices.


## JavaScript client library known issues 

This section provides information about known issues associated with JavaScript voice and video calling client libraries in Azure Communication Services.

### After refreshing the page, the call disconnects on web
When refreshing pages, the Communication Services client library may not be able to inform the Communication Services media service that it's about to disconnect. The Communication Services media service will then time out. When those timeouts get raised, the media endpoint is disconnected. 

We encourage developers build experiences that don't require end-users to refresh the page of your application while participating in a call. If a refresh does happen, the best way to handle it is to track and reuse the same Communication Services user ID between refreshes, and select the stream with the highest numerical ID.

### It's not possible to render multiple previews from multiple devices on web
This is a known limitation. Refer to the [calling client library overview](./voice-video-calling/calling-sdk-features) for more information.

### Enumeration of the mic and speaker devices is not possible in Safari when the application runs on iOS or iPadOS 
Applications can't enumerate/select mic/speaker devices (like Bluetooth) on Safari iOS/iPad. This is a known operating system limitation.

If you're using Safari on MacOS, your app may not be able to enumerate/select speakers through the Communication Services Device Manager. In this scenario, devices must be selected via the OS. If you use Chrome on MacOS, the app can enumerate/select devices through the Communication Services Device Manager.

### Audio connectivity is lost when receiving SMS messages or calls during an ongoing VoIP call
Mobile browsers don't maintain connectivity while in the background state. This can lead to a degraded call experience if the VoIP call was interrupted by text message or incoming PSTN call that pushes your application into the background.

Platform: Web
Browser: Safari, Chrome

### Repeatedly switching video devices may cause video streaming to temporarily stop

Switching between video devices may cause your video stream to pause while the stream is acquired from the selected device.

#### Possible causes
Streaming from and switching between media devices is computationally intensive. Switching frequently can cause performance degradation. Developers are encouraged to stop one device stream before starting another.

### Bluetooth headset microphone is not detected therefore is not audible during the call on Safari
Bluetooth headsets aren't supported by Safari. Your Bluetooth device will not be listed in available microphone options and other participants will not be able to hear you if you try using Bluetooth over Safari.

#### Possible causes
This is a known iOS operating system limitation. 

With Safari on **iOS/iPad**, your app may have trouble enumerating/selecting mic/speaker devices (e.g. Bluetooth). This is a known operating system limitation. You may only see one device in this scenario. 

With Safari on **MacOS**, your app may have trouble enumerating/selecting speaker devices through the Communication Services Device Manager. In this scenario, your device selection should be updated via the operating system.

### Rotation of a device can create poor video quality
We encourage developers to build their app in a way that does not require rotation of multimedia devices. Users may experience degraded video quality when devices are rotated.

Devices affected: Pixel 5, Pixel 3a, iPad 8, and iPad X.
Browsers: Chrome
Platforms: iOS, Android


### Camera switching makes the screen freeze 
When a Communication Services user joins a call using WebRTC and then hits the camera switch button, the UI may become completely unresponsive until the application is refreshed.

Devices affected: Pixel 4a
Browsers: Chrome

#### Possible causes
Under investigation.

### If the video signal was stopped while the call is in connecting state, the video will not be send after the call started 
Mobile browsers are sensitive to any changes made while being in the `connecting` state. We encourage developers to build their apps in a way that doesn't require video to be configured while connecting. This issue may cause degraded video performance in the following scenarios:

 1. If you start with audio and then start and stop video while the call is in `connecting` state
 2. If you start with audio and then start and stop video while the call is in the lobby


#### Possible causes
Under investigation.

###  Sometimes it takes a long time to render remote participant videos
This issue has been observed when, during an ongoing group call, User A sends video and then User B joins the call. Sometimes User B doesn't see video from User A, or User A's video begins rendering after a long delay. This could be caused by a network environment that requires further configuration. Refer to the [network requirements](./voice-video-calling/network-requirements) documentation for network configuration guidance.
