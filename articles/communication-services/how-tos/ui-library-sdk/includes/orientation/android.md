---
description: In this tutorial, you learn how to use the Calling composite on Android.
author: mbellah

ms.author: mbellah
ms.date: 08/16/2023
ms.topic: include
ms.service: azure-communication-services
---

Azure Communication UI [open source library](https://github.com/Azure/communication-ui-library-android) for Android and the sample application code can be found [here](https://github.com/Azure-Samples/communication-services-android-quickstarts/tree/main/ui-calling)

### Available orientations

The following is a table of `CallCompositeSupportedScreenOrientation` with out of the box orientations. If you want to set orientation of the different screens of the composite, set the `CallCompositeSupportedScreenOrientation` into `CallComposite`.

|Orientation Mode| CallCompositeSupportedScreenOrientation|
|---------|---------|
|PORTRAIT | CallCompositeSupportedScreenOrientation.PORTRAIT|
|LANDSCAPE | CallCompositeSupportedScreenOrientation.LANDSCAPE|
|REVERSE_LANDSCAPE | CallCompositeSupportedScreenOrientation.REVERSE_LANDSCAPE|
|USER_LANDSCAPE | CallCompositeSupportedScreenOrientation.USER_LANDSCAPE|
|FULL_SENSOR | CallCompositeSupportedScreenOrientation.FULL_SENSOR|
|USER | CallCompositeSupportedScreenOrientation.USER|

### Orientation API

`CallCompositeSupportedScreenOrientation` is a custom type for UI Library for Android. The name for the orientation type is defined by keeping similarity between Android Platform's orientation mode names. By default, the setup screen orientation is set with `PORTRAIT` mode and calling screen is set with `USER` mode. To set a different orientation for the screens other than default one, developers can pass `CallCompositeSupportedScreenOrientation`. Out of the box, the UI Library includes a set of `CallCompositeSupportedScreenOrientation` usable with the composite.

You can also obtain list of `CallCompositeSupportedScreenOrientation` by the static function `CallCompositeSupportedScreenOrientation.values()`.

#### Usage

To set orientation, specify a `CallCompositeSupportedScreenOrientation` and pass it to the `CallCompositeBuilder`. For the example below, we'll set `FULL_SENSOR` for setup screen and `LANDSCAPE` for calling screen of the composite.

#### [Kotlin](#tab/kotlin)

```kotlin
import com.azure.android.communication.ui.calling.models.CallCompositeSupportedScreenOrientation

// CallCompositeSupportedLocale provides list of supported locale
val callComposite: CallComposite =
            CallCompositeBuilder()
            .setupScreenOrientation(CallCompositeSupportedScreenOrientation.FULL_SENSOR)
            .callScreenOrientation(CallCompositeSupportedScreenOrientation.LANDSCAPE)
            .build()
```

#### [Java](#tab/java)

```java
import com.azure.android.communication.ui.calling.models.CallCompositeSupportedScreenOrientation;

// CallCompositeSupportedLocale provides list of supported locale
CallComposite callComposite = 
    new CallCompositeBuilder()
        .setupScreenOrientation(CallCompositeSupportedScreenOrientation.FULL_SENSOR)
        .callScreenOrientation(CallCompositeSupportedScreenOrientation.LANDSCAPE)
        .build();
```
