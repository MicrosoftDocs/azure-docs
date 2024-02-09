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
ms.custom: devx-track-js
---

# Best practices: Azure Communication Services calling SDKs
This article provides information about best practices related to the Azure Communication Services calling SDKs.

## Azure Communication Services web JavaScript SDK best practices
This section provides information about best practices associated with the Azure Communication Services JavaScript voice and video calling SDK.

## JavaScript voice and video calling SDK

### Plug-in microphone or enable microphone from device manager when Azure Communication Services call in progress
When there is no microphone available at the beginning of a call, and then a microphone becomes available, the "noMicrophoneDevicesEnumerated" call diagnostic event will be raised.
When this happens, your application should invoke `askDevicePermission` to obtain user consent to enumerate devices. Then user will then be able to mute/unmute the microphone.

### Dispose video stream renderer view
Communication Services applications should dispose `VideoStreamRendererView`, or its parent `VideoStreamRenderer` instance, when it is no longer needed.

### Hang up the call on onbeforeunload event
Your application should invoke `call.hangup` when the `onbeforeunload` event is emitted.

### Handling multiple calls on multiple Tabs on mobile
Your application should not connect to calls from multiple browser tabs simultaneously as this can cause undefined behavior due to resource allocation for microphone and camera on the device. Developers are encouraged to always hang up calls when completed in the background before starting a new one.

### Handle OS muting call when phone call comes in.
While on an Azure Communication Services call (for both iOS and Android) if a phone call comes in or Voice assistant is activated, the OS will automatically mute the user's microphone and camera. On Android, the call automatically unmutes and video restarts after the phone call ends. On iOS, it requires user action to "unmute" and "start video" again. You can listen for the notification that the microphone was muted unexpectedly with the quality event of `microphoneMuteUnexpectedly`. Do note in order to be able to rejoin a call properly you will need to use SDK 1.2.3-beta.1 or higher.

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

#### Request device permissions
You can request device permissions using the SDK:
- Your application should use `DeviceManager.askDevicePermission` to request access to audio and/or video devices.
- If the user denies access, `DeviceManager.askDevicePermission` will return 'false' for a given device type (audio or video) on subsequent calls, even after the page is refreshed. In this scenario, your application must detect that the user previously denied access and instruct the user to manually reset or explicitly grant access to a given device type.


#### Camera being used by another process
- On Windows Chrome and Windows Edge, if you start/join/accept a call with video on and the camera device is being used by another process other than the browser that the web sdk is running on, then the call will be started with audio only and no video. A cameraStartFailed UFD will be raised because the camera failed to start since it was being used by another process. Same applies to turning video on mid-call. You can turn off the camera in the other process so that that process releases the camera device, and then start video again from the call and video will now turn on for the call and remote participants will start seeing your video. 
- This is not an issue in macOS Chrome nor macOS Safari because the OS will let processes/threads share the camera device.
- On mobile devices, if a ProcessA requests the camera device and it is being used by ProcessB, then ProcessA will overtake the camera device and ProcessB will stop using the camera device
- On iOS safari, you cannot have the camera on for multiple call clients within the same tab nor across tabs. When any call client uses the camera, it will overtake the camera from any previous call client that was using it. Previous call client will get a cameraStoppedUnexpectedly UFD.

### Screen sharing
#### Closing out of application does not stop it from being shared
For example, lets say that from Chromium, you screen share the Microsoft Teams application. You then click on the "X" button on the Teams application to close it. The Teams application will not be closed and it will still be running in the background. You will even still see the icon in the bottom right of your desktop bar. Since the Teams application is still running, that means that it is still being screen shared and the remote participant in the call can still see your Teams application being screen shared. In order to stop the application from being screen shared, you will have to right click its icon on the desktop bar and then click on quit. Or you will have to click on "Stop sharing" button on the browser. Or call the sdk's Call.stopScreenSharing() API.

#### Safari can only do full screen sharing
Safari only allows to screen share the entire screen. Unlike Chromium, which lets you screen share full screen, specific desktop app, or specific browser tab.

#### Screen sharing permissions on macOS
In order to do screen sharing in macOS Safari or macOs Chrome, screen recording permissions must be granted to the browsers in the OS menu: "Systems Preferences" -> "Security & Privacy" -> "Screen Recording".

## Next steps
For more information, see the following articles:

- [Add chat to your app](../quickstarts/chat/get-started.md)
- [Add voice calling to your app](../quickstarts/voice-video-calling/getting-started-with-calling.md)
- [Reference documentation](reference.md)
