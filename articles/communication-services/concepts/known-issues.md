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
> There are multiple factors that can affect the quality of your calling experience. Refer to the **[network requirements](https://docs.microsoft.com/azure/communication-services/concepts/voice-video-calling/network-requirements)** documentation to learn more about Communication Services network configuration and testing best practices.


## JavaScript client library

This section provides information about known issues associated with JavaScript voice and video calling client libraries in Azure Communication Services.

### After refreshing the page, user is not removed from the call immediately 
If user is in a call and decides to refresh the page, the Communication Services client library may not be able to inform the Communication Services media service that it's about to disconnect. The Communication Services media service will not remove such user immediately from the call but it will wait for a user to rejoin assuming problems with network connectivity. User will be removed from the call after media service will timeout```

We encourage developers build experiences that don't require end-users to refresh the page of your application while participating in a call. If user will refresh the page, the best way to handle it for the app is to reuse the same Communication Services user ID for the user after he returns back to the application after refreshes.

For the perspective of other participants in the call, such user will remain in the call for predefined amount of time ( 1-2mins ) 
If user will rejoin with the same Communication Services user ID, he will be represented as the same, existing object in the `remoteParticipants` collection.
If previously user was sending video, `videoStreams` collection will keep previous stream information untill service will timeout and remove it, in this scenario application may decide to observe any new streams added to the collection and render one with highest `id` 


### It's not possible to render multiple previews from multiple devices on web
This is a known limitation. Refer to the [calling client library overview](https://docs.microsoft.com/azure/communication-services/concepts/voice-video-calling/calling-sdk-features) for more information.

### Enumeration of the microphone and speaker devices is not possible in Safari when the application runs on iOS or iPadOS 
Applications can't enumerate/select mic/speaker devices (like Bluetooth) on Safari iOS/iPad. This is a known operating system limitation.

If you're using Safari on MacOS, your app will not be able to enumerate/select speakers through the Communication Services Device Manager. In this scenario, devices must be selected via the OS. If you use Chrome on MacOS, the app can enumerate/select devices through the Communication Services Device Manager.

### Audio connectivity is lost when receiving SMS messages or calls during an ongoing VoIP call
Mobile browsers don't maintain connectivity while in the background state. This can lead to a degraded call experience if the VoIP call was interrupted by text message or incoming PSTN call that pushes your application into the background.

Client library: Calling (JavaScript)
Browsers: Safari, Chrome
Operating System: iOS, Android

### Repeatedly switching video devices may cause video streaming to temporarily stop

Switching between video devices may cause your video stream to pause while the stream is acquired from the selected device.

#### Possible causes
Streaming from and switching between media devices is computationally intensive. Switching frequently can cause performance degradation. Developers are encouraged to stop one device stream before starting another.

### Bluetooth headset microphone is not detected therefore is not audible during the call on Safari on iOS
Bluetooth headsets aren't supported by Safari on iOS. Your Bluetooth device will not be listed in available microphone options and other participants will not be able to hear you if you try using Bluetooth over Safari.

#### Possible causes
This is a known MacOS/iOS/iPadOS operating system limitation. 

With Safari on **MacOS** and **iOS/iPadOS**, it is not possible to enumerating/selecting speaker devices through the Communication Services Device Manager since speakers enumeration/selection is not supported by Safari. In this scenario, your device selection should be updated via the operating system.

### Rotation of a device can create poor video quality
Users may experience degraded video quality when devices are rotated.

Devices affected: Google Pixel 5, Google Pixel 3a, Apple iPad 8, and Apple iPad X
Client library: Calling (JavaScript)
Browsers: Safari, Chrome
Operating System: iOS, Android


### Camera switching makes the screen freeze 
When a Communication Services user joins a call using the JavaScript calling client library and then hits the camera switch button, the UI may become completely unresponsive until the application is refreshed or browser is pushed to the background by user

Devices affected: Google Pixel 4a
Client library: Calling (JavaScript)
Browsers: Chrome
Operating System: iOS, Android


#### Possible causes
Under investigation.

### If the video signal was stopped while the call is in "connecting" state, the video will not be sent after the call started 
If users decide to quickly turn video on/off while call is in `Connecting` state - this may lead to problem with stream acquired for the call. We encourage developers to build their apps in a way that doesn't require video to be turned on/off while call is in `Connecting` state. This issue may cause degraded video performance in the following scenarios:

 1. If User starts with audio and then start and stop video while the call is in `Connecting` state
 2. If User starts with audio and then start and stop video while the call is in `Lobby` state


#### Possible causes
Under investigation.

###  Sometimes it takes a long time to render remote participant videos
During an ongoing group call, _User A_ sends video and then _User B_ joins the call. Sometimes, User B doesn't see video from User A, or User A's video begins rendering after a long delay. This could be caused by a network environment that requires further configuration. Refer to the [network requirements](https://docs.microsoft.com/azure/communication-services/concepts/voice-video-calling/network-requirements) documentation for network configuration guidance.
