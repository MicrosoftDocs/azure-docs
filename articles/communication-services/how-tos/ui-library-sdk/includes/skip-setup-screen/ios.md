---
description: In this tutorial, you learn how to use the Calling composite on iOS
author: mbellah

ms.author: mbellah
ms.date: 22/03/2023
ms.topic: include
ms.service: azure-communication-services
---

Azure Communication UI [open source library](https://github.com/Azure/communication-ui-library-ios) for iOS and the sample application code can be found [here](https://github.com/Azure-Samples/communication-services-ios-quickstarts/tree/main/ui-calling)

### Bypass Setup Screen Option

`LocalOptions` is an options wrapper that sets the capability of the UI Library to skip the setup screen using a boolean. By default, the bypass setup screen capability is set to false, so that UI Library goes through setup screen to provide the default experience of the UI Library. UI Library will assess `bypassSetupScreen` attribute value to set the mode for calling experience. You'll have to set `bypassSetupScreen` with true boolean value to get the bypass setup screen experience. Also to get a smooth transition to join a call, we recommend you to handle all the required permissions prior to join a call.

:::image type="content" source="media/ios-bypass-setup-screen.png" alt-text="Android Bypass Setup Screen":::

#### Usage

To use the feature, pass the boolean value with `bypassSetupScreen` to `LocalOptions` and inject it to `callComposite.launch`.

```swift
let localOptions = LocalOptions(bypassSetupScreen: true)

callComposite.launch(remoteOptions: remoteOptions, localOptions: localOptions)
```

### Default Camera and Microphone Options

By default, setup screen gives the user an option to configure the camera and microphone settings before joining a call. When you try to bypass the setup screen to join a call, user does not have that option anymore. So we are providing more options to set default behavior of the camera and microphone. You can pass a boolean value with `cameraOnByDefault` and `microhponeOnByDefault` to turn camera and microphone ON or OFF. Given that users have granted permission for camera and microphone, they will be set as ON or OFF when joining a call.

By default, both `cameraOnByDefault` and `microhponeOnByDefault` are set to false. You can use these attributes even with UI Libraries default call join experience. In that case, setup screen camera and microphone will be turned ON or OFF according to the value.

#### Usage 

To use camera and microphone default state feature, pass the boolean value with
`cameraOnByDefault` and `microhponeOnByDefault` to `LocalOptions` and inject it to `callComposite.launch`.

```swift
let localOptions = LocalOptions(cameraOnByDefault: true, microphoneOnByDefault: true)

callComposite.launch(remoteOptions: remoteOptions, localOptions: localOptions)
```


### Permission Handling

It is recommended to let the users join a call with microhpone and camera permission being granted to use the bypass setup screen feature with camera and microphone default configuration APIs. However, if developers do not handle the permissions of the users, UI Library will try to handle for you. 

Microphone permission is a must have to join a call. If microhpone permission is denied and users try to join the call, UI Library will drop the call in connecting stage of the call and might throw the `microphonePermissionNotGranted` error.
On the other hand, if camera permission is denied, users will be able to join the call but the camera default configuration API will not make any impact since UI Library will disable the camera functionality for the user in the call.

We recommend, developers handle the microphone permission and also camera permission before joining the call if user joins the call with camera turned on default.

## Network Error

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
