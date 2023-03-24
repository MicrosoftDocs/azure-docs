---
description: In this tutorial, you learn how to use the Calling composite on Android
author: mbellah

ms.author: mbellah
ms.date: 03/21/2023
ms.topic: include
ms.service: azure-communication-services
---

Azure Communication UI [open source library](https://github.com/Azure/communication-ui-library-android) for Android and the sample application code can be found [here](https://github.com/Azure-Samples/communication-services-android-quickstarts/tree/main/ui-calling)


### Bypass Setup Screen Option

`CallCompositeLocalOptions` is an options wrapper that sets the capability of the UI Library to skip the setup screen using a boolean. By default, the bypass setup screen capability is set to false. You have to set `bypassSetupScreen` with true boolean value to get the bypass setup screen experience.

We recommend you to build your application such a way that when user tries to join a call, microphone permission has already been granted to get a smooth call join experience.

:::image type="content" source="media/android-bypass-setup-screen.png" alt-text="Android Bypass Setup Screen":::


To use the feature, pass the boolean value with `bypassSetupScreen` to `CallCompositeLocalOptions` and inject it to `callComposite.launch`.

#### [Kotlin](####tab/kotlin)

```kotlin
import com.azure.android.communication.ui.calling.models.CallCompositeLocalOptions

val localOptions: CallCompositeLocalOptions = CallCompositeLocalOptions()
    .setBypassSetupScreen(true)

callComposite.launch(callLauncherActivity, remoteOptions, localOptions)
```

#### [Java](####tab/java)

```java
import com.azure.android.communication.ui.calling.models.CallCompositeLocalOptions;

final CallCompositeLocalOptions localOptions = new CallCompositeLocalOptions()
    .setBypassSetupScreen(true);

callComposite.launch(callLauncherActivity, remoteOptions, localOptions);
```

### Default Camera and Microphone Configuration Options

By default, setup screen gives the user an option to configure the camera and microphone settings before joining a call. When you try to bypass the setup screen to join a call, user doesn't have that option unless they join the call already. We're providing more options to set default behavior of the camera and microphone so that developers get more control over default state of camera and microphone. You can pass a boolean value with `cameraOnByDefault` and `microphoneOnByDefault` to turn camera and microphone ON or OFF. These attributes empower developers to have control over camera and microphone controls prior to join a call. Default camera and microphone state control functionality is not affected if user grants the permission for each of them respectively.

By default, both `cameraOnByDefault` and `microphoneOnByDefault` are set to false. You can use this functionality even with UI Libraries default call join experience. In that case, setup screen camera and microphone are turned ON or OFF according to the configuration that you set.

To use camera and microphone default state feature, pass the boolean value with
`cameraOnByDefault` and `microphoneOnByDefault` to `CallCompositeLocalOptions` and inject it to `callComposite.launch`.

#### [Kotlin](#tab/kotlin)

```kotlin
import com.azure.android.communication.ui.calling.models.CallCompositeLocalOptions

val localOptions: CallCompositeLocalOptions = CallCompositeLocalOptions()
    .setMicrophoneOnByDefault(true)
    .setCameraOnByDefault(true)

callComposite.launch(callLauncherActivity, remoteOptions, localOptions)
```

#### [Java](#tab/java)

```java
import com.azure.android.communication.ui.calling.models.CallCompositeLocalOptions;

final CallCompositeLocalOptions localOptions = new CallCompositeLocalOptions()
    .setMicrophoneOnByDefault(true)
    .setCameraOnByDefault(true);

callComposite.launch(callLauncherActivity, remoteOptions, localOptions);
```

### Permission Handling

It is recommended to let the users join a call with microphone and camera permission being granted to use the bypass setup screen feature with camera and microphone default configuration APIs. However, if developers do not handle the permissions of the user, UI Library tries to handle them for you.

Microphone permission is a must have to join a call. If users try to join a call with denied microphone permission, UI Library drops the call in connecting stage and may throw an error with code `CallCompositeErrorCode.MICROPHONE_PERMISSION_NOT_GRANTED`.
On the other hand, users will be able to join a call even if they deny the camera permission. UI Library disables the camera functionality when camera permission is set as denied. Thus the camera default configuration API will not affect the calling experience. User will be able to enjoy default camera configuration API affect once the camera permission is set as granted. 

We recommend, developers handle the microphone permission. If user joins the call with camera turned on default, we recommend developers to handle the camera permission as well.

### Network Error

If network disruption happens or call drops during a call, UI Library exits and may throw an error with code `CallCompositeErrorCode.CALL_END_FAILED`. If user doesn't have network connection prior to join a call and tries to join the call with bypass setup screen feature, UI Library exits in call connecting stage and may throw an error with code `CallCompositeErrorCode.NETWORK_CONNECTION_NOT_AVAILABLE`.

It is recommended to join the call by checking network availability to avoid such error.

To receive error events, call `setOnErrorHandler` with `CallComposite`.

The following `error` values might be sent to the error handler:
- `microphonePermissionNotGranted`
- `networkConnectionNotAvailable`

#### [Kotlin](#tab/kotlin)

```kotlin
callComposite.addOnErrorEventHandler { callCompositeErrorEvent ->
    println(callCompositeErrorEvent.errorCode)
}
```

#### [Java](#tab/java)

```java
callComposite.addOnErrorEventHandler(callCompositeErrorEvent -> {
    System.out.println(callCompositeErrorEvent.getErrorCode());
});
```


