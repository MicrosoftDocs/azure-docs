---
description: Learn how to use the Calling composite on Android.
author: pavelprystinka

ms.author: pavelprystinka
ms.date: 12/12/2023
ms.topic: include
ms.service: azure-communication-services
---

For more information, see the [open-source Android UI Library](https://github.com/Azure/communication-ui-library-android) and the [sample application code](https://github.com/Azure-Samples/communication-services-android-quickstarts/tree/main/ui-calling).

### Picture-in-picture setup

To enable multitasking and picture-in-picture, use `CallCompositeBuilder.multitasking` to set `CallCompositeMultitaskingOptions` with  `enableMultitasking` and `enableSystemPictureInPictureWhenMultitasking` constructor parameters.

#### [Kotlin](#tab/kotlin)

```kotlin
val callComposite: CallComposite =
            CallCompositeBuilder()
            .multitasking(CallCompositeMultitaskingOptions(true, true))
            .build()
```

#### [Java](#tab/java)

```java
CallComposite callComposite = 
    new CallCompositeBuilder()
        .multitasking(new CallCompositeMultitaskingOptions(true, true))
        .build();
```

-----

The **Back** button appears when `enableMultitasking` is set to `true`.

:::image type="content" source="media/android-call-screen.png" alt-text="Screenshot of the Android call screen with the Back button visible.":::

When user taps back button Calling UI is hidden and, if configured, Picture-in-Picture view is displayed.

When multitasking is ON for `CallComposite`, the call activity starts in a dedicated task. In the task history, the user sees two screens: one for the app's activity and one for Communication Services call activity.


-----

To enter multitasking programmatically and if configured display Picture-in-Picture, call the `sendToBackground` method.

#### [Kotlin](#tab/kotlin)
```kotlin
callComposite.sendToBackground()
```

#### [Java](#tab/java)

```java
callComposite.sendToBackground();
```
-----

To bring user back to the calling activity programmatically use `bringToForeground` function:

#### [Kotlin](#tab/kotlin)

```kotlin
callComposite.bringToForeground(context)
```

#### [Java](#tab/java)

```java
callComposite.bringToForeground(context);
```
