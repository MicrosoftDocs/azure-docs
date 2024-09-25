---
description: Learn how to use the Calling composite on Android.
author: mbellah

ms.author: mbellah
ms.date: 08/16/2023
ms.topic: include
ms.service: azure-communication-services
---

For more information, see the [open-source Android UI Library](https://github.com/Azure/communication-ui-library-android) and the [sample application code](https://github.com/Azure-Samples/communication-services-android-quickstarts/tree/main/ui-calling).

### Available orientations

The following table lists `CallCompositeSupportedScreenOrientation` types for out-of-the-box orientations. If you want to set the orientation of the various screens of the composite, set `CallCompositeSupportedScreenOrientation` to `CallComposite`.

|Orientation mode| CallCompositeSupportedScreenOrientation type|
|---------|---------|
|`PORTRAIT` | `CallCompositeSupportedScreenOrientation.PORTRAIT`|
|`LANDSCAPE` | `CallCompositeSupportedScreenOrientation.LANDSCAPE`|
|`REVERSE_LANDSCAPE` | `CallCompositeSupportedScreenOrientation.REVERSE_LANDSCAPE`|
|`USER_LANDSCAPE` | `CallCompositeSupportedScreenOrientation.USER_LANDSCAPE`|
|`FULL_SENSOR` | `CallCompositeSupportedScreenOrientation.FULL_SENSOR`|
|`USER` | `CallCompositeSupportedScreenOrientation.USER`|

### Orientation API

`CallCompositeSupportedScreenOrientation` is a custom type for the Android UI Library. The name for the orientation type is defined by keeping similarity with the names of the Android platform's orientation modes.

By default, the setup screen orientation is in `PORTRAIT` mode and the calling screen is in `USER` mode. To set a different orientation for the screens, you can pass `CallCompositeSupportedScreenOrientation`. Out of the box, the UI Library includes a set of `CallCompositeSupportedScreenOrientation` types that are usable with the composite.

You can also get a list of `CallCompositeSupportedScreenOrientation` types by using the static function `CallCompositeSupportedScreenOrientation.values()`.

To set the orientation, specify `CallCompositeSupportedScreenOrientation` and pass it to `CallCompositeBuilder`. The following example sets `FULL_SENSOR` for the setup screen and `LANDSCAPE` for the calling screen of the composite.

#### [Kotlin](#tab/kotlin)

```kotlin
import com.azure.android.communication.ui.calling.models.CallCompositeSupportedScreenOrientation

// CallCompositeSupportedLocale provides a list of supported locales
val callComposite: CallComposite =
            CallCompositeBuilder()
            .setupScreenOrientation(CallCompositeSupportedScreenOrientation.FULL_SENSOR)
            .callScreenOrientation(CallCompositeSupportedScreenOrientation.LANDSCAPE)
            .build()
```

#### [Java](#tab/java)

```java
import com.azure.android.communication.ui.calling.models.CallCompositeSupportedScreenOrientation;

// CallCompositeSupportedLocale provides a list of supported locales
CallComposite callComposite = 
    new CallCompositeBuilder()
        .setupScreenOrientation(CallCompositeSupportedScreenOrientation.FULL_SENSOR)
        .callScreenOrientation(CallCompositeSupportedScreenOrientation.LANDSCAPE)
        .build();
```
