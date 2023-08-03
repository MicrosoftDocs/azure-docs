---
description: In this tutorial, you learn how to use the Calling composite on iOS
author: mbellah

ms.author: mbellah
ms.date: 03/22/2023
ms.topic: include
ms.service: azure-communication-services
---

Azure Communication UI [open source library](https://github.com/Azure/communication-ui-library-ios) for iOS and the sample application code can be found [here](https://github.com/Azure-Samples/communication-services-ios-quickstarts/tree/main/ui-calling)

### Skip setup screen option

`LocalOptions` is an options wrapper that sets the capability of the UI Library to skip the setup screen using a boolean. By default, the skip setup screen capability is set to false. You have to set `skipSetupScreen` with true boolean value to get the skip setup screen experience. 

We recommend you to build your application such a way that when user tries to join a call, microphone permission has already been granted to get a smooth call join experience.

:::image type="content" source="media/ios-bypass-setup-screen.png" alt-text="Diagram of joining call skipping the setup screen for Android.":::

To use the feature, pass the boolean value with `skipSetupScreen` to `LocalOptions` and inject it to `callComposite.launch`.

```swift
let localOptions = LocalOptions(skipSetupScreen: true)

callComposite.launch(remoteOptions: remoteOptions, localOptions: localOptions)
```

### Default camera and microphone configuration options

By default, setup screen gives the user an option to configure the camera and microphone settings before joining a call. When you try to skip the setup screen to join a call, user doesn't have that option unless they join the call already. We're providing more options to set default behavior of the camera and microphone so that developers get more control over default state of camera and microphone. You can pass a boolean value with `cameraOn` and `microphoneOn` to turn camera and microphone ON or OFF. These attributes empower developers to have control over camera and microphone controls prior to join a call. Default camera and microphone state control functionality isn't affected if user grants the permission for each of them respectively.

By default, both `cameraOn` and `microphoneOn` are set to false. You can use this functionality even with UI Libraries default call join experience. In that case, setup screen camera and microphone are turned ON or OFF according to the configuration that you set.

To use camera and microphone default state feature, pass the boolean value with
`cameraOn` and `microphoneOn` to `LocalOptions` and inject it to `callComposite.launch`.

```swift
let localOptions = LocalOptions(cameraOn: true, microphoneOn: true)

callComposite.launch(remoteOptions: remoteOptions, localOptions: localOptions)
```


### Permission handling

It's recommended to let the users join a call with microphone and camera permission being granted to use the skip setup screen feature with camera and microphone default configuration APIs. However, if developers don't handle the permissions of the user, UI Library tries to handle them for you.

Microphone permission is a must have to join a call. If users try to join a call with denied microphone permission, UI Library drops the call in connecting stage and may throw the `microphonePermissionNotGranted` error.
On the other hand, users are able to join a call even if they deny the camera permission. UI Library disables the camera functionality when camera permission is set as denied. Thus the camera default configuration API doesn't affect the calling experience. User may enjoy default camera configuration API effect once the camera permission is set as granted.

We recommend, developers handle the microphone permission. If user joins the call with camera turned on default, we recommend developers to handle the camera permission as well.

### Network error

If network disruption happens or call drops during a call, UI Library exits and may throw `callEndFailed` error. If user doesn't have network connection prior to join a call and tries to join the call with skip setup screen feature, UI Library exits at call connecting stage and may throw `networkConnectionNotAvailable` error.

It's recommended to join the call by checking network availability to avoid such error.

You can implement closures to act on composite events. The following example shows an error event for a failed composite:

The following `error` values might be sent to the error handler:
- `microphonePermissionNotGranted`
- `networkConnectionNotAvailable`

```swift
callComposite?.events.onError = { error in
    print("CallComposite failed with error:\(error)")
}
```
