---
title: Azure Communication Services - best practices for Calling Web SDK
description: Learn about Azure Communication Services best practices for the Calling Web SDK.
author: srahaman
manager: akania
services: azure-communication-services

ms.author: srahaman
ms.date: 06/30/2021
ms.topic: include
ms.service: azure-communication-services
---

## Best practices for the Azure Communication Services Calling Web SDK

This section provides information about best practices associated with the Azure Communication Services Calling Web (JavaScript) SDK for voice and video calling.

### Plug in a microphone or enable a microphone from the device manager when a call is in progress

When no microphone is available at the beginning of an Azure Communication Services call, and then a microphone becomes available, the change raises a `noMicrophoneDevicesEnumerated` diagnostic event. When that event happens, your application needs to invoke `askDevicePermission` to obtain user consent to enumerate devices. The user can then mute or unmute the microphone.

### Dispose of VideoStreamRendererView

Communication Services applications should dispose of `VideoStreamRendererView`, or its parent `VideoStreamRenderer` instance, when it's no longer needed.

### Hang up the call on an onbeforeunload event

Your application should invoke `call.hangup` when the `onbeforeunload` event is emitted.

### Handle multiple calls on multiple tabs

Your application shouldn't connect to calls from multiple browser tabs simultaneously on mobile devices. This situation can cause undefined behavior due to resource allocation for the microphone and camera on a device. We encourage developers to always hang up calls when they're completed in the background before starting a new one.

### Handle the OS muting a call when a phone call comes in

During an Azure Communication Services call (for both iOS and Android), if a phone call comes in or the voice assistant is activated, the OS automatically mutes the user's microphone and camera. On Android, the call automatically unmutes and video restarts after the phone call ends. On iOS, unmuting and restarting the video require user action.

You can use the quality event of `microphoneMuteUnexpectedly` to listen for the notification that the microphone was muted unexpectedly. Keep in mind that to rejoin a call properly, you need to use SDK 1.2.3-beta.1 or later.

```javascript
const latestMediaDiagnostic = call.api(SDK.Features.Diagnostics).media.getLatest();
const isIosSafari = (getOS() === OSName.ios) && (getPlatformName() === BrowserName.safari);
if (isIosSafari && latestMediaDiagnostic.microphoneMuteUnexpectedly && latestMediaDiagnostic.microphoneMuteUnexpectedly.value) {
  // received a QualityEvent on iOS that the microphone was unexpectedly muted - notify user to unmute their microphone and to start their video stream
}
```

Your application should invoke `call.startVideo(localVideoStream);` to start a video stream and should use `this.currentCall.unmute();` to unmute the audio.

### Manage devices

You can use the Azure Communication Services SDK to manage your devices and media operations.

Your application shouldn't use native browser APIs like `getUserMedia` or `getDisplayMedia` to acquire streams outside the SDK. If you do, you must manually dispose of your media streams before using `DeviceManager` or other device management APIs via the Communication Services SDK.

#### Request device permissions

You can request device permissions by using the SDK. Your application should use `DeviceManager.askDevicePermission` to request access to audio and/or video devices.

If the user denies access, `DeviceManager.askDevicePermission` returns `false` for a particular device type (audio or video) on subsequent calls, even after the page is refreshed. In this scenario, your application must:

1. Detect that the user previously denied access.
1. Instruct the user to manually reset or explicitly grant access to a particular device type.

#### Manage the behavior of a camera that another process is using

- **On Windows Chrome and Windows Microsoft Edge**: If you start, join, or accept a call with video on, and another process (other than the browser that the web SDK is running on) is using the camera device, the call is started with audio only and no video. A `cameraStartFailed` User Facing Diagnostics flag is raised because the camera failed to start.

  The same situation applies to turning on video mid-call. You can turn off the camera in the other process so that that process releases the camera device, and then start video again from the call. The video then turns on for the call, and remote participants start seeing the video.

  This problem doesn't exist in macOS Chrome or macOS Safari because the OS lets processes and threads share the camera device.

- **On mobile devices**: If a *ProcessA* requests the camera device while *ProcessB* is using it, then *ProcessA* overtakes the camera device and *ProcessB* stop using it.

- **On iOS Safari**: You can't have the camera on for multiple call clients on the same tab or across tabs. When any call client uses the camera, it overtakes the camera from any previous call client that was using it. The previous call client gets a `cameraStoppedUnexpectedly` User Facing Diagnostics flag.

### Manage screen sharing

#### Closing an application doesn't stop it from being shared

Let's say that from Chromium, you screen share the Microsoft Teams application. You then select the **X** button on the Teams application to close it. Although the window is closed, the Teams application keeps running in the background. The icon still appears on the desktop taskbar. Because the Teams application is still running, it's still being screen shared with remote participants.

To stop the application from being screen shared, you have to take one of these actions:

- Right-click the application's icon on the desktop taskbar, and then select **Quit**.
- Select the **Stop sharing** button on the browser.
- Call the SDK's `Call.stopScreenSharing()` API operation.

#### Safari can do only full-screen sharing

Safari allows screen sharing only for the entire screen. That behavior is unlike Chromium, which lets you screen share the full screen, a specific desktop app, or a specific browser tab.

#### You can grant screen-sharing permissions on macOS

To screen share in macOS Safari or macOS Chrome, grant the necessary permissions to the browsers on the OS menu: **System Preferences** > **Security & Privacy** > **Screen Recording**.
