---
description: In this tutorial, you learn how to use the Calling composite on iOS
author: mbellah

ms.author: mbellah
ms.date: 03/22/2023
ms.topic: include
ms.service: azure-communication-services
---

Azure Communication UI [open source library](https://github.com/Azure/communication-ui-library-ios) for iOS and the sample application code can be found [here](https://github.com/Azure-Samples/communication-services-ios-quickstarts/tree/main/ui-calling)

### Bypass Setup Screen Option

`LocalOptions` is an options wrapper that sets the capability of the UI Library to skip the setup screen using a boolean. By default, the bypass setup screen capability is set to false. You have to set `bypassSetupScreen` with true boolean value to get the bypass setup screen experience. 

We recommend you to build your application such a way that when user tries to join a call, microphone permission has already been granted to get a smooth call join experience.

:::image type="content" source="media/ios-bypass-setup-screen.png" alt-text="Android Bypass Setup Screen":::

To use the feature, pass the boolean value with `bypassSetupScreen` to `LocalOptions` and inject it to `callComposite.launch`.

```swift
let localOptions = LocalOptions(bypassSetupScreen: true)

callComposite.launch(remoteOptions: remoteOptions, localOptions: localOptions)
```

### Default Camera and Microphone Options

By default, setup screen gives the user an option to configure the camera and microphone settings before joining a call. When you try to bypass the setup screen to join a call, user does not have that option unless they join the call already. We are providing more options to set default behavior of the camera and microphone so that developers get more control over default state of camera and microphone. You can pass a boolean value with `cameraOnByDefault` and `microphoneOnByDefault` to turn camera and microphone ON or OFF. These attributes empower developers to have control over camera and microphone controls prior to join a call. Default camera and microphone state control functionality is not affected if user grants the permission for each of them respectively.

By default, both `cameraOnByDefault` and `microphoneOnByDefault` are set to false. You can use this functionality even with UI Libraries default call join experience. In that case, setup screen camera and microphone is turned ON or OFF according to the configuration that you set.

To use camera and microphone default state feature, pass the boolean value with
`cameraOnByDefault` and `microphoneOnByDefault` to `LocalOptions` and inject it to `callComposite.launch`.

```swift
let localOptions = LocalOptions(cameraOnByDefault: true, microphoneOnByDefault: true)

callComposite.launch(remoteOptions: remoteOptions, localOptions: localOptions)
```


### Permission Handling

It is recommended to let the users join a call with microphone and camera permission being granted to use the bypass setup screen feature with camera and microphone default configuration APIs. However, if developers do not handle the permissions of the user, UI Library tries to handle them for you.

Microphone permission is a must have to join a call. If users try to join a call with denied microphone permission, UI Library drops the call in connecting stage and may throw the `microphonePermissionNotGranted` error.
On the other hand, if camera permission is denied, users are able to join the call but the camera default configuration API does not make any impact since UI Library disables the camera functionality for the user in the call.

We recommend, developers handle the microphone permission and also camera permission before joining the call if user joins the call with camera turned on default.

## Network Error

In case of, network disruption happens or call drops during a call, UI Library exits and may throw an error with code `callEndFailed`. If user does not have network connection prior to join a call and tries to join the call with bypass setup screen feature, UI Library exits in call connecting stage and may throw an error with code `networkConnectionNotAvailable`.
In case of, network disruption or call drop during a call, UI Library will exit and might throw `callEndFailed` error. If user does not have network connection prior to join a call and tries to join the call with bypass setup screen feature, UI Library exits in call connecting stage and might throw `networkConnectionNotAvailable` error.

#### Usage

You can implement closures to act on composite events. The following example shows an error event for a failed composite:

The following `error` values might be sent to the error handler:
- `microphonePermissionNotGranted`
- `networkConnectionNotAvailable`

```swift
callComposite?.events.onError = { error in
    print("CallComposite failed with error:\(error)")
}
```
