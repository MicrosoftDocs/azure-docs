---
description: In this tutorial, you learn how to use the Calling composite on Android
author: mbellah

ms.author: mbellah
ms.date: 21/03/2023
ms.topic: include
ms.service: azure-communication-services
---

Azure Communication UI [open source library](https://github.com/Azure/communication-ui-library-android) for Android and the sample application code can be found [here](https://github.com/Azure-Samples/communication-services-android-quickstarts/tree/main/ui-library-quick-start)


### Bypass Setup Screen Option

`CallCompositeLocalOptions` is an options wrapper that sets the capability of the UI Library to skip the setup screen using a boolean. By default, the bypass setup screen capability is set to false. You'll have to set `bypassSetupScreen` with true boolean value to get the bypass setup screen experience. 

We recommend you to build your application such a way that when user tries to join a call, microphone permission has already been granted to get a smooth call join experience. 

:::image type="content" source="media/android-bypass-setup-screen.png" alt-text="Android Bypass Setup Screen":::

#### Usage

To use the feature, pass the boolean value with `bypassSetupScreen` to `CallCompositeLocalOptions` and inject it to `callComposite.launch`.

#### [Kotlin](#tab/kotlin)

```kotlin
import com.azure.android.communication.ui.calling.models.CallCompositeLocalOptions

val localOptions: CallCompositeLocalOptions = CallCompositeLocalOptions()
    .setBypassSetupScreen(true)

callComposite.launch(callLauncherActivity, remoteOptions, localOptions)
```

#### [Java](#tab/java)

```java
import com.azure.android.communication.ui.calling.models.CallCompositeLocalOptions;

final CallCompositeLocalOptions localOptions = new CallCompositeLocalOptions()
    .setBypassSetupScreen(true);

callComposite.launch(callLauncherActivity, remoteOptions, localOptions);
```

### Default Camera and Microphone Configuration Options

By default, setup screen gives the user an option to configure the camera and microphone settings before joining a call. When you try to bypass the setup screen to join a call, user does not have that option unless they join the call already. So we are providing more options to set default behavior of the camera and microphone. You can pass a boolean value with `cameraOnByDefault` and `microhponeOnByDefault` to turn camera and microphone ON or OFF. This empowers developers to have control over camera and microphone controls prior to join a call. The feature for camera and microphone defauly state control will not be affected if their respective permission is denied by the user.

By default, both `cameraOnByDefault` and `microhponeOnByDefault` are set to false. You can use this functionality even with UI Libraries default call join experience. In that case, setup screen camera and microphone will be turned ON or OFF according to the configuration you will set.

#### Usage 

To use camera and microphone default state feature, pass the boolean value with
`cameraOnByDefault` and `microhponeOnByDefault` to `CallCompositeLocalOptions` and inject it to `callComposite.launch`.

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

It is recommended to let the users join a call with microhpone and camera permission being granted to use the bypass setup screen feature with camera and microphone default configuration APIs. However, if developers do not handle the permissions of the users, UI Library will try to handle for you. 

Microphone permission is a must have to join a call. If microhpone permission is denied and users try to join the call, UI Library will drop the call in connecting stage of the call and might throw an error with code `CallCompositeErrorCode.MICROPHONE_PERMISSION_NOT_GRANTED`.
On the other hand, if camera permission is denied, users will be able to join the call but the camera default configuration API will not make any impact since UI Library will disable the camera functionality for the user in the call.

We recommend, developers handle the microphone permission and also camera permission before joining the call if user joins the call with camera turned on default.

### Network Error

In case of, network disruption or call drop during a call, UI Library will exit and might throw an error with code `CallCompositeErrorCode.CALL_END_FAILED`. If user does not have network connection prior to join a call and tries to join the call with bypass setup screen feature, UI Library exits in call connecting stage and might throw an error with code `CallCompositeErrorCode.NETWORK_CONNECTION_NOT_AVAILABLE`. 

It is recommended to join the call by checking network availability to avoid such error.

#### Usage

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


