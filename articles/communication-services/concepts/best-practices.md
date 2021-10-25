---
title: Azure Communication Services - best practices
description: Learn more about Azure Communication Service best practices
author: srahaman
manager: akania
services: azure-communication-services

ms.author: srahaman
ms.date: 06/30/2021
ms.topic: conceptual
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

### Dispose video stream renderer view
Communication Services applications should dispose `VideoStreamRendererView`, or its parent `VideoStreamRenderer` instance, when it is no longer needed.

### Hang up the call on onbeforeunload event
Your application should invoke `call.hangup` when the `onbeforeunload` event is emitted.

### Handling multiple calls on multiple Tabs on mobile
Your application should not connect to calls from multiple browser tabs simultaneously as this can cause undefined behavior due to resource allocation for microphone and camera on the device. Developers are encouraged to always hang up calls when completed in the background before starting a new one.

### Handle OS muting call when phone call comes in.
While on an ACS call (for both iOS and Android) if a phone call comes in or Voice assistant is activated, the OS will automatically mute the users microphone and camera. On Android the call automatically unmutes and video restarts after the phone call ends. On iOS it requires user action to "unmute" and "start video" again. You can listen for the notification that the microphone was muted unexpectedly with the quality event of `microphoneMuteUnexpectedly`. Do note in order to be able to rejoin a call properly you will need to used SDK 1.2.3-beta.1 or higher.

```javascript
const latestMediaDiagnostic = call.api(SDK.Features.Diagnostics).media.getLatest();
const isIosSafari = (getOS() === OSName.ios) && (getPlatformName() === BrowserName.safari);
if (isIosSafari && latestMediaDiagnostic.microphoneMuteUnexpectedly && latestMediaDiagnostic.microphoneMuteUnexpectedly.value) {
  // received a QualityEvent on iOS that the microphone was unexpectedly muted - notify user to unmute their microphone and to start their video stream
}
```

Your application should invoke `call.startVideo(localVideoStream);` to start a video stream and should use `this.currentCall.unmute();` to unmute the audio.

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
