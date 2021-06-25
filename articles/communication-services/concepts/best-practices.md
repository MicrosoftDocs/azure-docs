---
title: Azure Communication Services - best practices
description: Learn more about Azure Communication Service best practices
author: srahaman
manager: akania
services: azure-communication-services

ms.author: srahaman
ms.date: 06/18/2021
ms.topic: troubleshooting
ms.service: azure-communication-services
---

# Best practices: Azure Communication Services calling SDKs
This article provides information about best practices related to the Azure Communication Services Calling SDKs.

## JavaScript SDK
This section provides information about best practices associated with the Azure Communication Services JavaScript voice and video calling SDKs.

### Plug-in microphone or enable microphone from device manager when ACS call in progress
When there is no microphone available at the beginning of a call, and then a microphone becomes available, the "noMicrophoneDevicesEnumerated" call diagnostic event will be raised.
When this happens, your application should invoke `askDevicePermission` to obtain user consent to enumerate devices. Then user will then be able to mute/unmute the microphone.

### Stop video on page hide
Developers are encouraged to stop video streaming when users navigate away from an active video-enabled call. Video can be stopped by calling the `call.stopVideo` API.
```JavaScript
document.addEventListener("visibilitychange", function() {
	if (document.visibilityState === 'visible') {
		// TODO: Start Video if it was stopped on visibility change
	} else {
		// TODO: Stop Video if it's on
	}
});
```

### Dispose video stream renderer view
Communication Services applications should dispose `VideoStreamRendererView`, or its parent `VideoStreamRenderer` instance, when it is no longer needed.

### Hang up the call on onbeforeunload event
Your application should invoke `call.hangup` when the `onbeforeunload` event is emitted.

### Hang up the call on microphoneMuteUnexpectedly UFD
When an iOS/Safari user receives a PSTN call, Azure Communication Services loses microphone access. 
Azure Communication Services will raise the `microphoneMuteUnexpectedly` call diagnostic event, and at this point Communication Services will not be able to regain access to microphone.
It's recommended to hang up the call ( `call.hangUp` ) when this situation occurs.
