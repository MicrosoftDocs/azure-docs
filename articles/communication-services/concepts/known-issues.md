---
title: Azure Communication Services - FAQ / Known issues
description: Learn more about Azure Communication Services
author: mikben
manager: jken
services: azure-communication-services

ms.author: mikben
ms.date: 03/10/2021
ms.topic: troubleshooting
ms.service: azure-communication-services
---

# VoIP limitations / known issues 
This article provides information about limitations and known issues related to Voice and Video Calling SDKs in Azure Communication Services.

## JavaScript client library limitations 

### Quality
There are multiple factors that can affect the quality of your experience. Please ensure that you use the supported version of SDKs and operation systems, validate your network. This [article]( https://github.com/nmurav/azure-docs-pr/edit/master/articles/communication-services/concepts/voice-video-calling/network-requirements.md) explains the considerations how to plan for media quality.

### After refreshing the page the call disconnects on web
On page refresh, ACS SDK may not be able to inform ACS media service that it is about to disconnect, ACS media service will start timeout. When those timeouts get raised, we disconnect the endpoint. We recommend developers build their apps in a way so the user can't (don't need) refresh the page. If it did happen the best way to handle it is:
1) reuse same ACS user ID - and pick stream with the highest ID
2) use different ACS user ID - we should discourage - as at that point app won't know if new user equals old user 

### It's not possible to render multiple previews from multiple devices on web
It's a current limitation due to technical implementation, please refer to [Calling Client library overview](https://docs.microsoft.com/en-us/azure/communication-services/concepts/voice-video-calling/calling-sdk-features)

### Enumeration if the mic and speaker devices is not possible in Safari, when the application run on iOS or iPadOS. 
Applications can't enumerate/select mic/speaker devices (like Bluetooth) on Safari iOS/iPad. It's a limitation of the OS - there's always only one device.

For Safari on MacOS - app can't enumerate/select speaker through Communication Services Device Manager - these must be selected via the OS. If you use Chrome on MacOS, the app can enumerate/select devices through the Communication Services Device Manager.

### Audio is lost if a user receives text or call during the ongoing VoIP call
Mobile browsers are lacking the ability to maintain the connectivity while in background state. This will lead to poor experiences if the VoIP call was interrupted by text message or incoming PSTN call.
Platform: web
Browser: Safari, Chrome



## JAVASCRIPT SDK KNOWN ISSUES 

This section provides information about known issues associated with Voice and Video Calling SDKs in Azure Communication Services.

### Repeatedly switching video devices may cause video streaming to temporarily stop

Switching between video devices may cause your video stream to pause while the stream is acquired from the selected device.

#### Possible causes
Streaming from and switching between media devices is computationally intensive. Switching frequently can cause performance degradation. Developers are encouraged to stop one device stream before starting another.

### Bluetooth headset microphone is not detected therefore is not audible during the call on Safari
Currently, there is no ability to use the headset connected via Bluetooth. It will not be listed in available microphone options and other participants will not be able to hear you.

#### Possible causes
There is no option to select Bluetooth microphone on iOS. iOS does this automatically.
Safari on iOS/iPad - app can't enumerate/select mic/speaker devices (e.g. Bluetooth) it's a limitation of OS and there's always only 1 device.
Safari on MacOS - app can't enumerate/select speaker through ACS DM - these have to updated via OS

#### Rotation of a device can create poor video quality
We encourage the developers to build their app in a way that does not require rotation of a device currently. Due to some technical issues end customers can experience receiving video artifacts after the device has been rotated. 
Known devices having this problem: Pixel 5, Pixel 3a, iPad 8, iPad X
Platform: Android
Browser: Chrome


#### Camera switching makes the screen freezing 
After ACS user joined the call on Webrtc app and hit the camera switch button, the UI becomes completely unresponsive until refresh.
Devices affected: Pixel 4a
Browsers: Chrome

#### Possible causes
Under investigation

#### If the video signal was stopped while the call is in connecting state, the video will not be send after the call started 
Mobile browsers are sensitive to any changes made while being in the “connecting state”. At this time we encourage developers build their apps in a way to prevent end user to make any changes. Otherwise you experience maybe degraded in following scenarios: 
•	Scenario 1: I start with audio and start video and then stop video while call in Connecting state
•	Scenario 2: I start with audio and start video and then stop video while call in lobby


#### Possible causes
Under investigation

####  Sometimes it takes a long time to render remote participant videos
This problem was encountered in a following scenario on web: To an ongoing group call where user A sends video joins user B. Sometimes user B doesn't see video from user A, or video is rendered after 30+ seconds. It could be happening due to bad network environment please check the (guidelines)[https://github.com/nmurav/azure-docs-pr/edit/master/articles/communication-services/concepts/voice-video-calling/network-requirements.md].

#### Possible causes
Under investigation
