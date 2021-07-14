---
title: Azure Communication Services - best practices
description: Learn more about Azure Communication Service best practices
author: srahaman
manager: akania
services: azure-communication-services

ms.author: srahaman
ms.date: 06/30/2021
ms.topic: troubleshooting
ms.service: azure-communication-services
---

# Best practices: Azure Communication Services calling SDKs
This article provides information about best practices related to the Azure Communication Services (ACS) calling SDKs.

## ACS web JavaScript SDK best practices
This section provides information about best practices associated with the Azure Communication Services JavaScript voice and video calling SDK.

## JavaScript voice and video calling SDK

### Plug-in microphone or enable microphone from device manager when ACS call in progress
When there is no microphone available at the beginning of a call, and then a microphone becomes available, the "noMicrophoneDevicesEnumerated" call diagnostic event will be raised.
When this happens, your application should invoke `askDevicePermission` to obtain user consent to enumerate devices. Then user will then be able to mute/unmute the microphone.

### Stop video on page hide
When user navigate away from the calling tab then the video streaming stops. Some devices continue to stream the last frame. To avoid this issue, Developers are encouraged to stop video streaming when users navigate away from an active video-enabled call. Video can be stopped by calling the `call.stopVideo` API.
```JavaScript
document.addEventListener("visibilitychange", function() {
	if (document.visibilityState === 'visible') {
		// Start Video if it was stopped on visibility change (flag true)
	} else {
		// Stop Video if it's on and set flag = true to keep track
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

### Device management
You can use the Azure Communication Services SDK to manage your devices and media operations.
- Your application shouldn't use native browser APIs like `getUserMedia` or `getDisplayMedia` to acquire streams outside of the SDK. If you do, you'll have to manually dispose your media stream(s) before using `DeviceManager` or other device management APIs via the Communication Services SDK.

### Request device permissions
You can request device permissions using the SDK:
- Your application should use `DeviceManager.askDevicePermission` to request access to audio and/or video devices.
- If the user denies access, `DeviceManager.askDevicePermission` will return 'false' for a given device type (audio or video) on subsequent calls, even after the page is refreshed. In this scenario, your application must detect that the user previously denied access and instruct the user to manually reset or explicitly grant access to a given device type.

## Next steps
For more information, see the following articles:

- [Add chat to your app](../quickstarts/chat/get-started.md)
- [Add voice calling to your app](../quickstarts/voice-video-calling/getting-started-with-calling.md)
- [Reference documentation](reference.md)
