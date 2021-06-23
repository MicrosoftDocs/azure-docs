---
title: Azure Communication Services - best practices
description: Learn more about Azure Communication Service Best Practices
author: srahaman
manager: akania
services: azure-communication-services

ms.author: srahaman
ms.date: 06/18/2021
ms.topic: troubleshooting
ms.service: azure-communication-services
---

# Best practices: Azure Communication Services Calling SDKs
This article provides information about best practices related to the Azure Communication Services Calling SDKs.

## JavaScript SDK
This section provides information about best practices associated with the Azure Communication Services JavaScript voice and video calling SDKs.

### Plug-in Microphone or Enable Microphone from Device Manager When ACS Call in Progress
When there is no Microphone available, and later user will plug-in Microphone or enable Microphone in the OS, then Call Diagnostic "noMicrophoneDevicesEnumerated" will be raised.
When this happens, application should invoke `askDevicePermission` to obtain user consent to enumerate devices.

### Stop Video on Page Hide
If app using ACS has an active call with the video, when user switches browser tab, or a user or different process or app puts browser in the background, then application must stop the video by calling `call.stopVideo` API
```JavaScript
document.addEventListener("visibilitychange", function() {
	if (document.visibilityState === 'visible') {
		// TODO: Start Video if it was stopped on visibility change
	} else {
		// TODO: Stop Video if it's on
	}
});
```

### Dispose Video Stream Renderer View
Application should dispose VideoStreamRendererView, or it's parent VideoStreamRenderer instance, if it doesn't need it anymore to render video and it decides to detach if from the DOM

### Hang up the Call on onbeforeunload Event
App should invoke call.hangup on onbeforeunload event

### Hang up the Call on microphoneMuteUnexpectedly UFD
Whey user is on ACS call from iOS Safari and receives the PSTN call then ACS lost the microphone access. To avoid this issue, it's recommended to hang up the call when microphoneMuteUnexpectedly UFD raised.
