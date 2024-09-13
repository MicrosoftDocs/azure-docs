---
description: Learn how to use the Calling composite on iOS.
author: mbellah

ms.author: mbellah
ms.date: 03/22/2023
ms.topic: include
ms.service: azure-communication-services
---

For more information, see the [open-source iOS UI Library](https://github.com/Azure/communication-ui-library-ios) and the [sample application code](https://github.com/Azure-Samples/communication-services-ios-quickstarts/tree/main/ui-calling).

### Option to skip the setup screen

`LocalOptions` is an options wrapper that sets the capability of the UI Library to skip the setup screen by using a Boolean. By default, the capability to skip the setup screen is set to `false`. You have to set `skipSetupScreen` with a `true` Boolean value to provide the experience of skipping the setup screen.

We recommend that you build your application in such a way that when a user tries to join a call, microphone permission is already granted for a smooth joining experience.

:::image type="content" source="media/ios-bypass-setup-screen.png" alt-text="Screenshot of joining call by skipping the setup screen for iOS.":::

To use the feature, pass the Boolean value with `skipSetupScreen` to `LocalOptions` and inject it into `callComposite.launch`.

```swift
let localOptions = LocalOptions(skipSetupScreen: true)

callComposite.launch(remoteOptions: remoteOptions, localOptions: localOptions)
```

### Default options for camera and microphone configuration

By default, the setup screen gives users an option to configure camera and microphone settings before joining a call. When you set up skipping the setup screen to join a call, users don't have that option until they're on the call.

You can pass a Boolean value with `cameraOn` and `microphoneOn` to turn the camera and microphone on or off before users join a call. The functionality of controlling the default state of the camera and microphone isn't affected if a user grants the permission for each of them respectively.

By default, both `cameraOn` and `microphoneOn` are set to `false`. You can use this functionality even with the UI Library's default call-joining experience. In that case, the camera and microphone are turned on or off on the setup screen according to the configuration that you set.

To set the default state of the camera and microphone, pass the Boolean value with `cameraOn` and `microphoneOn` to `LocalOptions` and inject it into `callComposite.launch`.

```swift
let localOptions = LocalOptions(cameraOn: true, microphoneOn: true)

callComposite.launch(remoteOptions: remoteOptions, localOptions: localOptions)
```

### Permission handling

We recommend that you let users join a call with microphone and camera permission being granted to use the feature of skipping the setup screen with default configuration APIs for the microphone and camera. If you don't handle the permissions of the user, the UI Library tries to handle them for you.

Users must enable microphone permission to join a call. If users try to join a call after denying microphone permission, the UI Library drops the call in the connecting stage and throws a `microphonePermissionNotGranted` error.

However, users can join a call even if they deny camera permission. The UI Library disables the camera functionality when camera permission is denied. So, the default configuration API for the camera doesn't affect the calling experience. Users can enjoy the effect of the default configuration API for the camera after granting the camera permission.

We recommend that you handle the microphone permission. If users join the call with the camera turned on by default, we recommend that you also handle the camera permission.

### Network errors

If a network disruption happens during a call or a call drops, the UI Library closes and throws a `callEndFailed` error.

If a user doesn't have a network connection and tries to join the call after skipping the setup screen, the UI Library closes at the call-connecting stage and throws a `networkConnectionNotAvailable` error. To avoid this error, we recommend that you configure your application to check network availability before users join a call.

You can implement closures to act on composite events. The following example shows an error event for a failed composite:

```swift
callComposite?.events.onError = { error in
    print("CallComposite failed with error:\(error)")
}
```

The following `error` values might be sent to the error handler:

- `microphonePermissionNotGranted`
- `networkConnectionNotAvailable`
